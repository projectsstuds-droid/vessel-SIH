import pandas as pd
import numpy as np
import datetime
import os

def generate_freight_data(num_records=1000, output_path="../data/historical_freight_data.csv"):
    np.random.seed(42)
    
    # Generate dates over the past ~2 years
    base_date = datetime.date.today() - datetime.timedelta(days=700)
    dates = [base_date + datetime.timedelta(days=i) for i in range(num_records)]
    
    # Base features
    # Demand Index: 50 to 150
    demand = np.random.normal(100, 15, num_records).clip(50, 150)
    
    # Supply Index (Available Vessels): 50 to 150
    supply = np.random.normal(100, 15, num_records).clip(50, 150)
    
    # Fuel Price (Bunker index): 400 to 800 $/ton
    fuel = np.random.normal(600, 50, num_records).clip(400, 800)
    
    # Port Congestion Delay (Days): 0 to 15
    congestion = np.random.exponential(3, num_records).clip(0, 15)
    
    # Weather Risk Score: 1 to 10
    weather = np.random.uniform(1, 10, num_records)
    
    # Generate Freight Rate (Target Variable)
    # Base rate around $15/MT, plus modifiers
    base_rate = 15.0
    demand_factor = (demand - 100) * 0.05
    supply_factor = (100 - supply) * 0.04
    fuel_factor = (fuel - 600) * 0.01
    congestion_factor = congestion * 0.3
    weather_factor = weather * 0.1
    
    # Add some random noise
    noise = np.random.normal(0, 1.5, num_records)
    
    freight_rate = (base_rate + demand_factor + supply_factor + 
                    fuel_factor + congestion_factor + weather_factor + noise).clip(5, 50)
    
    df = pd.DataFrame({
        'date': dates,
        'demand_index': demand.round(2),
        'supply_index': supply.round(2),
        'fuel_price_usd': fuel.round(2),
        'congestion_days': congestion.round(2),
        'weather_risk': weather.round(2),
        'freight_rate_usd_mt': freight_rate.round(2)
    })
    
    os.makedirs(os.path.dirname(output_path), exist_ok=True)
    df.to_csv(output_path, index=False)
    print(f"Generated {num_records} records of synthetic training data at {output_path}")

if __name__ == "__main__":
    generate_freight_data()
