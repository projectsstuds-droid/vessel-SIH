from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import List, Optional, Dict, Any
import pandas as pd
import numpy as np
from statsmodels.tsa.holtwinters import ExponentialSmoothing
import datetime

from fpi_engine import calculate_fpi

app = FastAPI(title="AI Vessel Forecasting Service")

class ForecastRequest(BaseModel):
    historical_dates: List[str]
    historical_rates: List[float]
    horizon_days: int = 30
    # Optional raw factors for FPI (falling back to neutral if omitted)
    current_factors: Optional[Dict[str, float]] = None
    historical_factors: Optional[Dict[str, List[float]]] = None

class ForecastResponse(BaseModel):
    forecast_dates: List[str]
    forecast_rates: List[float]
    lower_band: List[float]
    upper_band: List[float]
    expected_change_pct: float
    volatility: str
    direction: str
    fpi_score: float
    fpi_breakdown: Dict[str, float]

@app.get("/health")
def health_check():
    return {"status": "ok", "service": "ML Forecasting Service"}

@app.post("/forecast", response_model=ForecastResponse)
def generate_forecast(req: ForecastRequest):
    if len(req.historical_rates) < 10:
        raise HTTPException(status_code=400, detail="Insufficient historical data (need at least 10 data points)")
        
    df = pd.DataFrame({
        'date': pd.to_datetime(req.historical_dates),
        'rate': req.historical_rates
    })
    df.set_index('date', inplace=True)
    df = df.sort_index()

    try:
        # Calculate FPI
        factors_curr = req.current_factors or {}
        factors_hist = req.historical_factors or {}
        fpi_score, fpi_breakdown = calculate_fpi(factors_curr, factors_hist)
        
        steps = max(1, req.horizon_days // 7)
        
        import os
        import joblib
        model_path = os.path.join(os.path.dirname(__file__), "models", "freight_rf_model.pkl")
        
        forecast = None
        if os.path.exists(model_path):
            try:
                # Load the trained RandomForest model
                rf_model = joblib.load(model_path)
                
                # Base factors
                demand = factors_curr.get('Demand', 100)
                supply = factors_curr.get('Supply', 100)
                fuel = 600 # Default assumption if not provided
                congestion = factors_curr.get('Congestion', 3)
                weather = 5 # Default assumption
                
                # Project out future steps using the model
                future_rates = []
                for i in range(steps):
                    # Simulate slightly worsening/improving conditions over time based on trend
                    x_input = pd.DataFrame([{
                        'demand_index': demand + (i * 0.5),
                        'supply_index': supply - (i * 0.2),
                        'fuel_price_usd': fuel,
                        'congestion_days': congestion + (i * 0.1),
                        'weather_risk': weather
                    }])
                    pred = rf_model.predict(x_input)[0]
                    future_rates.append(pred)
                
                forecast = pd.Series(future_rates)
            except Exception as e:
                print(f"Failed to use trained model: {e}")
                
        # Fallback to Holt-Winters if RF model isn't available or fails
        if forecast is None:
            model = ExponentialSmoothing(df['rate'], trend='add', seasonal=None)
            fit_model = model.fit()
            forecast = fit_model.forecast(steps)
        
        # Calculate prediction intervals (using rolling std for prototype)
        rolling_std = df['rate'].rolling(window=4).std().iloc[-1]
        if pd.isna(rolling_std):
            rolling_std = df['rate'].std()
            
        # Z-value for 95% confidence interval is approx 1.96
        # Expand bands slightly as we go further into the future
        multiplier = np.linspace(1.0, 1.5, steps)
        margin_of_error = 1.96 * rolling_std * multiplier
        
        lower_band = forecast - margin_of_error
        upper_band = forecast + margin_of_error

        last_date = df.index[-1]
        forecast_dates = [ (last_date + datetime.timedelta(days=7*i)).strftime('%Y-%m-%d') for i in range(1, steps + 1) ]
        
        last_rate = df['rate'].iloc[-1]
        final_forecast = forecast.iloc[-1]
        
        change_pct = ((final_forecast - last_rate) / last_rate) * 100
        direction = "UPWARD" if change_pct > 2 else ("DOWNWARD" if change_pct < -2 else "STABLE")
        
        volatility_measure = df['rate'].std() / df['rate'].mean()
        volatility = "HIGH" if volatility_measure > 0.2 else ("MEDIUM" if volatility_measure > 0.1 else "LOW")
        
        return ForecastResponse(
            forecast_dates=forecast_dates,
            forecast_rates=forecast.tolist(),
            lower_band=lower_band.tolist(),
            upper_band=upper_band.tolist(),
            expected_change_pct=round(change_pct, 2),
            volatility=volatility,
            direction=direction,
            fpi_score=fpi_score,
            fpi_breakdown=fpi_breakdown
        )

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Model execution failed: {str(e)}")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
