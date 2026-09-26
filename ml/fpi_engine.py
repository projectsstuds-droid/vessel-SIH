import numpy as np

# Initial prototype weights
WEIGHTS = {
    'WD': 0.20,
    'WS': 0.18,
    'WV': 0.12,
    'WP': 0.12,
    'WB': 0.10,
    'WC': 0.10,
    'WR': 0.08,
    'WM': 0.10
}

def robust_z_score(value, historical_data):
    """
    Normalizes raw variables using: Z(X) = (X - Median(X)) / (1.4826 * MAD(X))
    """
    if len(historical_data) == 0:
        return 0.0
        
    median = np.median(historical_data)
    mad = np.median(np.abs(historical_data - median))
    
    if mad == 0:
        return 0.0
        
    z = (value - median) / (1.4826 * mad)
    
    # Clamp between -3 and 3
    z_clamped = max(-3.0, min(3.0, z))
    return z_clamped

def calculate_fpi(factors_current, factors_historical):
    """
    Calculates the FPI using the 8 normalized components.
    factors_current: dict of current raw values for D, S, V, P, B, C, R, M
    factors_historical: dict of lists of historical values for robust normalization
    """
    # Normalize each factor
    z_factors = {}
    for key in WEIGHTS.keys():
        # Map weight key (e.g., 'WD') to factor key (e.g., 'D')
        factor_key = key[1]
        
        current_val = factors_current.get(factor_key, 0.0)
        hist_data = factors_historical.get(factor_key, [current_val])
        
        z_factors[factor_key] = robust_z_score(current_val, hist_data)

    # Calculate raw FPI
    fpi_raw = (
        WEIGHTS['WD'] * z_factors['D']
        - WEIGHTS['WS'] * z_factors['S'] # Supply reduces pressure
        + WEIGHTS['WV'] * z_factors['V']
        + WEIGHTS['WP'] * z_factors['P']
        + WEIGHTS['WB'] * z_factors['B']
        + WEIGHTS['WC'] * z_factors['C']
        + WEIGHTS['WR'] * z_factors['R']
        + WEIGHTS['WM'] * z_factors['M']
    )
    
    # Convert to 0-100 scale: FPI100 = 50 + 16.67 * FPI
    fpi_100 = 50 + (16.67 * fpi_raw)
    fpi_100_clamped = max(0.0, min(100.0, fpi_100))
    
    # Generate breakdown for explainability UI
    breakdown = {
        'Demand': round(WEIGHTS['WD'] * z_factors['D'] * 16.67, 1),
        'Supply': round(-WEIGHTS['WS'] * z_factors['S'] * 16.67, 1),
        'Utilization': round(WEIGHTS['WV'] * z_factors['V'] * 16.67, 1),
        'Congestion': round(WEIGHTS['WP'] * z_factors['P'] * 16.67, 1),
        'Bunker': round(WEIGHTS['WB'] * z_factors['B'] * 16.67, 1),
        'Commodity': round(WEIGHTS['WC'] * z_factors['C'] * 16.67, 1),
        'Risk': round(WEIGHTS['WR'] * z_factors['R'] * 16.67, 1),
        'Momentum': round(WEIGHTS['WM'] * z_factors['M'] * 16.67, 1)
    }

    return round(fpi_100_clamped, 1), breakdown
