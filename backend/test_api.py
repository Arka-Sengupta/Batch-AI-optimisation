import requests
import json

url = "https://1f88-112-133-220-139.ngrok-free.app/api/predict"

user_json = {
    "batch_id": "T061",
    "operator_name": "Ravi",
    "machine_settings": {
        "Granulation_Time" : 21,
        "Machine_Speed"    : 160,
        "Compression_Force": 10.64,
        "Drying_Temp"      : 53,
        "Drying_Time"      : 30
    },
    "material_recipe": {
        "Binder_Amount"   : 10.8,
        "Lubricant_Conc"  : 1.1,
        "Tablet_Weight"   : 200.0,
        "Moisture_Content": 2.1
    },
    "environment": {
        "Humidity_Percent_mean": 42.0
    }
}

# Sending pure user_json (since predict_batch defaults sensor_json to None)
response1 = requests.post(url, json=user_json)
print("TEST 1 (Pure user_json):", response1.status_code, response1.text)

payload2 = {
    "user_json": user_json,
    "sensor_json": None
}
response2 = requests.post(url, json=payload2)
print("TEST 2 (Nested):", response2.status_code, response2.text)
