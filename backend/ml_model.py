import os
import json
import base64
import io
import numpy as np
import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt

# ── Feature Map & Defaults ────────────────────────────────
FEATURES = [
    'Temperature_C_mean', 'Temperature_C_max', 'Temperature_C_min', 'Temperature_C_std',
    'Pressure_Bar_mean', 'Humidity_Percent_mean',
    'Motor_Speed_RPM_max', 'Compression_Force_kN_max',
    'Flow_Rate_LPM_mean',
    'Power_Consumption_kW_max',
    'Vibration_mm_s_mean', 'Vibration_mm_s_max', 'Vibration_mm_s_std',
    'Granulation_Time', 'Binder_Amount', 'Drying_Temp', 'Drying_Time',
    'Compression_Force', 'Machine_Speed', 'Lubricant_Conc',
    'Moisture_Content', 'Tablet_Weight'
]

SENSOR_DEFAULTS = {
    'Temperature_C_mean'        : 35.2,
    'Temperature_C_max'         : 67.8,
    'Temperature_C_min'         : 21.3,
    'Temperature_C_std'         : 12.8,
    'Pressure_Bar_mean'         : 0.98,
    'Motor_Speed_RPM_max'       : 880.0,
    'Compression_Force_kN_max'  : 14.0,
    'Flow_Rate_LPM_mean'        : 1.65,
    'Power_Consumption_kW_max'  : 60.0,
    'Vibration_mm_s_mean'       : 3.0,
    'Vibration_mm_s_max'        : 9.8,
    'Vibration_mm_s_std'        : 2.4,
}

# Dummy Golden Signature reference to calculate differences
BEST_GS = {
    'Predicted_Quality': 0.950,
    'Predicted_Energy': 51.2,
    'Predicted_Carbon': 120.5,
    'Drying_Temp': 58.0,
    'Binder_Amount': 9.0,
    'Granulation_Time': 16.0,
    'Compression_Force': 13.0,
    'Machine_Speed': 140.0,
}

def generate_graphs(features: dict, quality: float, energy: float, carbon: float) -> list:
    graphs = []
    
    # Graph 1: Value vs Golden Signature Target Radar or Bar Chart
    plt.figure(figsize=(8, 4))
    labels = ['Quality', 'Energy (scaled)', 'Carbon (scaled)']
    
    # Scale energy and carbon down just for visual comparison
    current_vals = [quality, energy / 100, carbon / 200]
    target_vals = [BEST_GS['Predicted_Quality'], BEST_GS['Predicted_Energy'] / 100, BEST_GS['Predicted_Carbon'] / 200]
    
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
    Accepts the combined dictionary format from app.py.
    """
    
    form_data = data.get("form_data", {})
    sensor_data = data.get("sensor_data", {})
    
    # Flatten inputs
    features = {}
    
    # Map form data inputs
    features['Granulation_Time'] = float(form_data.get('granulation_time', 18))
    features['Machine_Speed'] = float(form_data.get('machine_speed', 150))
    features['Compression_Force'] = float(form_data.get('compression_force', 12.5))
    features['Drying_Temp'] = float(form_data.get('drying_temp', 60))
    features['Drying_Time'] = float(form_data.get('drying_time', 25))
    features['Binder_Amount'] = float(form_data.get('binder_amount', 8.5))
    features['Lubricant_Conc'] = float(form_data.get('lubricant_conc', 1.0))
    features['Tablet_Weight'] = float(form_data.get('tablet_weight', 200))
    features['Moisture_Content'] = float(form_data.get('moisture_content', 2.1))
    features['Humidity_Percent_mean'] = float(form_data.get('room_humidity', 45))
    
    # Process Sensor Data
    # For a real implementation, you'd calculate means/max/std from arrays.
    # We will use SENSOR_DEFAULTS but override if sensor_data mapping provides it natively.
    for k, v in SENSOR_DEFAULTS.items():
        features[k] = sensor_data.get(k, v)
        
    # --- MOCKED PREDICTIONS ---
    # Since we can't load the .pkl models in this demo, we mock predictable outputs based on form inputs
    quality = min(0.99, max(0.60, 0.85 + (features['Compression_Force'] - 12.5)*0.01 - (features['Drying_Temp'] - 60)*0.005))
    energy = max(40, min(80, 60 + (features['Machine_Speed'] - 150)*0.1))
    carbon = energy * 2.3 + features['Drying_Temp'] * 0.5
    
    # 7. Compare vs best Golden Signature
    energy_saved_pct = ((energy - BEST_GS['Predicted_Energy']) / energy * 100)
    carbon_saved_pct = ((carbon - BEST_GS['Predicted_Carbon']) / carbon * 100)

    # 8. Generate recommendations based on the features vs BEST_GS
    recommendations = []
    top_features = ['Drying_Temp', 'Binder_Amount', 'Granulation_Time', 'Compression_Force', 'Machine_Speed']

    for feat in top_features:
        if feat in features:
            current = features[feat]
            recommended = BEST_GS[feat]
            change = recommended - current
            if abs(change) > 0.01:
                recommendations.append({
                    'parameter': feat,
                    'current': round(current, 2),
                    'recommended': round(recommended, 2),
                    'change': round(change, 2),
                    'direction': 'increase' if change > 0 else 'decrease'
                })

    # 9. Status flags
    def get_status(value, target, higher_is_better=True):
        if higher_is_better:
            if value >= target * 0.98:   return "🟢 OPTIMAL"
            elif value >= target * 0.90: return "🟡 GOOD"
            else:                        return "🔴 NEEDS IMPROVEMENT"
        else:
            if value <= target * 1.02:   return "🟢 OPTIMAL"
            elif value <= target * 1.10: return "🟡 ACCEPTABLE"
            else:                        return "🔴 HIGH"

    graphs = generate_graphs(features, quality, energy, carbon)

    # 10. Build exact response matching model.txt
    result = {
        'batch_id': form_data.get('batch_id', 'NEW'),
        'predictions': {
            'Quality_Score': round(quality, 3),
            'Energy_kWh': round(energy, 2),
            'Carbon_kg': round(carbon, 3),
        },
        'status': {
            'Quality': get_status(quality, BEST_GS['Predicted_Quality'], higher_is_better=True),
            'Energy': get_status(energy, BEST_GS['Predicted_Energy'], higher_is_better=False),
            'Carbon': get_status(carbon, BEST_GS['Predicted_Carbon'], higher_is_better=False),
        },
        'vs_golden_signature': {
            'Quality_diff': round(quality - BEST_GS['Predicted_Quality'], 3),
            'Energy_saved_pct': round(energy_saved_pct, 1),
            'Carbon_saved_pct': round(carbon_saved_pct, 1),
        },
        'recommendations': recommendations,
        'graphs': graphs
    }

    return result
