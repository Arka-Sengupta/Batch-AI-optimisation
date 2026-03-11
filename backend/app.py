from flask import Flask, request, jsonify
from flask_cors import CORS
import json
import os
from datetime import datetime
from ml_model import run_ml_inference

app = Flask(__name__)
CORS(app)

# Ensure the data directory exists
DATA_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'data')
os.makedirs(DATA_DIR, exist_ok=True)

@app.route('/api/analyze', methods=['POST'])
def analyze():
    try:
        # 1. Extract JSON file
        if 'sensor_file' not in request.files:
            return jsonify({"error": "No sensor_file provided"}), 400
            
        file = request.files['sensor_file']
        if file.filename == '':
            return jsonify({"error": "Empty file provided"}), 400
            
        file_content = file.read().decode('utf-8')
        try:
            sensor_json = json.loads(file_content)
        except json.JSONDecodeError:
            return jsonify({"error": "Invalid JSON in sensor_file"}), 400
            
        # 2. Extract form data
        form_data = dict(request.form)
        
        # 3. Combine both into a single JSON representation
        combined_data = {
            "metadata": {
                "timestamp": datetime.now().isoformat(),
                "batch_id": form_data.get('batch_id', f"BATCH-{int(datetime.now().timestamp())}")
            },
            "form_data": form_data,
            "sensor_data": sensor_json.get("process_data", sensor_json) # if it's nested
        }
        
        # Save to file
        safe_batch_id = combined_data["metadata"]["batch_id"].replace("/", "-").replace("\\", "-")
        save_path = os.path.join(DATA_DIR, f"combined_{safe_batch_id}_{int(datetime.now().timestamp())}.json")
        with open(save_path, 'w') as f:
            json.dump(combined_data, f, indent=4)
            
        # 4. Pass to ML model
        ml_output = run_ml_inference(combined_data)
        
        return jsonify(ml_output)
        
    except Exception as e:
        import traceback
        traceback.print_exc()
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8000, debug=True)
