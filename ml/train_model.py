import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestRegressor
from sklearn.metrics import mean_squared_error, r2_score
import joblib
import os

def train():
    data_path = "../data/historical_freight_data.csv"
    model_path = "models/freight_rf_model.pkl"
    
    if not os.path.exists(data_path):
        print(f"Error: {data_path} not found. Run generate_dataset.py first.")
        return
        
    print("Loading dataset...")
    df = pd.read_csv(data_path)
    
    # Features and Target
    features = ['demand_index', 'supply_index', 'fuel_price_usd', 'congestion_days', 'weather_risk']
    X = df[features]
    y = df['freight_rate_usd_mt']
    
    # Train-test split
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
    
    print(f"Training RandomForestRegressor on {len(X_train)} samples...")
    model = RandomForestRegressor(n_estimators=100, max_depth=10, random_state=42)
    model.fit(X_train, y_train)
    
    # Evaluate
    predictions = model.predict(X_test)
    mse = mean_squared_error(y_test, predictions)
    r2 = r2_score(y_test, predictions)
    
    print("-" * 30)
    print("Model Evaluation Results:")
    print(f"Mean Squared Error (MSE): {mse:.4f}")
    print(f"R2 Score:                 {r2:.4f}")
    print("-" * 30)
    
    # Feature importance
    print("Feature Importances:")
    importances = model.feature_importances_
    for name, imp in zip(features, importances):
        print(f" - {name}: {imp:.4f}")
        
    # Save the model
    os.makedirs(os.path.dirname(model_path), exist_ok=True)
    joblib.dump(model, model_path)
    print(f"\nModel successfully saved to {model_path}")

if __name__ == "__main__":
    train()
