import os
import json
import base64
import io
import numpy as np
import requests
import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt

API_URL = "https://1f88-112-133-220-139.ngrok-free.app/api/predict"

# Dummy Golden Signature reference to calculate differences for graphs
BEST_GS = {
    'Predicted_Quality': 0.950,
    'Predicted_Energy': 51.2,
    'Predicted_Carbon': 120.5,
}

def generate_graphs(quality: float, energy: float, carbon: float, vs_golden: dict) -> list:
    graphs = []
    
    # Extract target values dynamically from differences
    target_quality = quality - vs_golden.get('Quality_diff', 0)
    target_energy = energy - (vs_golden.get('Energy_saved_pct', 0) / 100 * energy)
    target_carbon = carbon - (vs_golden.get('Carbon_saved_pct', 0) / 100 * carbon)

    # Graph 1: Value vs Golden Signature Target Bar Chart
    plt.figure(figsize=(8, 4))
    labels = ['Quality Score', 'Energy (kWh/100)', 'Carbon (kg/200)']
    
    # Scale energy and carbon down just for visual comparison
    current_vals = [quality, energy / 100, carbon / 200]
    target_vals = [target_quality, target_energy / 100, target_carbon / 200]
    
    x = np.arange(len(labels))
    width = 0.35
    
    plt.bar(x - width/2, current_vals, width, label='Current Predicted', color='#3b82f6')
    plt.bar(x + width/2, target_vals, width, label='Golden Signature (Target)', color='#10b981')
    
    plt.ylabel('Normalized Score')
    plt.title('Prediction vs Pareto Optimal Targets')
    plt.xticks(x, labels)
    plt.legend()
    plt.tight_layout()
    
    buf = io.BytesIO()
    plt.savefig(buf, format='png')
    buf.seek(0)
    image_base64 = base64.b64encode(buf.read()).decode('utf-8')
    plt.close()
    
    graphs.append(f"data:image/png;base64,{image_base64}")
    
    return graphs

def run_ml_inference(data: dict) -> dict:
    """
    Accepts the combined dictionary format from app.py, translates it to the user_json/sensor_json
    payload format of the external API, requests predictions, and appends generated graphs.
    """
    form_data = data.get("form_data", {})
    sensor_data = data.get("sensor_data", {})
    
    if isinstance(sensor_data, str):
        try:
            sensor_data = json.loads(sensor_data)
        except:
            sensor_data = {}

    # Build user_json structure expected by predict_batch in the API
    user_json = {
        "batch_id": form_data.get('batch_id', 'NEW_BATCH'),
        "operator_name": form_data.get('operator_name', 'Operator'),
        "machine_settings": {
            "Granulation_Time": float(form_data.get('granulation_time', 18)),
            "Machine_Speed": float(form_data.get('machine_speed', 150)),
            "Compression_Force": float(form_data.get('compression_force', 12.5)),
            "Drying_Temp": float(form_data.get('drying_temp', 60)),
            "Drying_Time": float(form_data.get('drying_time', 25))
        },
        "material_recipe": {
            "Binder_Amount": float(form_data.get('binder_amount', 8.5)),
            "Lubricant_Conc": float(form_data.get('lubricant_conc', 1.0)),
            "Tablet_Weight": float(form_data.get('tablet_weight', 200)),
            "Moisture_Content": float(form_data.get('moisture_content', 2.1))
        },
        "environment": {
            "Humidity_Percent_mean": float(form_data.get('room_humidity', 45)),
            "Temperature_C_mean": float(form_data.get('room_temperature', 22))
        }
    }
    
    # 1. Call real model API over the network
    # We send both user_json and sensor_json nested.
    payload = {
        "user_json": user_json,
        "sensor_json": sensor_data if sensor_data else None
    }
    
    response = requests.post(API_URL, json=payload)
    
    if response.status_code != 200:
        raise Exception(f"ML API Error: {response.text}")
        
    result = response.json()
    
    # 2. Extract values to generate visual graphs
    preds = result.get('predictions', {})
    vs_golden = result.get('vs_golden_signature', {})
    
    quality = preds.get('Quality_Score', 0)
    energy = preds.get('Energy_kWh', 0)
    carbon = preds.get('Carbon_kg', 0)
    
    # 3. Append Graph to final result payload
    graphs = generate_graphs(quality, energy, carbon, vs_golden)
    result['graphs'] = graphs
    
    return result
