import axios from "axios";

const API = "http://localhost:8000/api";

export const analyzeBatch = async (formData) => {
  try {
    // Convert FormData to the expected JSON format
    const sensorFile = formData.get('sensor_file');
    let sensorData = null;
    
    if (sensorFile) {
      const sensorText = await sensorFile.text();
      sensorData = JSON.parse(sensorText);
      sensorData.batch_id = formData.get('batch_id');
    }

    const payload = {
      user_json: {
        batch_id: formData.get('batch_id'),
        operator_name: "Operator",
        machine_settings: {
          Drying_Temp: parseFloat(formData.get('drying_temp')),
          Binder_Amount: parseFloat(formData.get('binder_amount')),
          Granulation_Time: parseFloat(formData.get('granulation_time')),
          Compression_Force: parseFloat(formData.get('compression_force')),
          Machine_Speed: parseFloat(formData.get('machine_speed')),
          Drying_Time: parseFloat(formData.get('drying_time')),
          Lubricant_Conc: parseFloat(formData.get('lubricant_conc')),
          Tablet_Weight: parseFloat(formData.get('tablet_weight'))
        },
        material_recipe: {
          API_Content: 0.8,
          Excipient_Ratio: 0.2,
          Moisture_Content: parseFloat(formData.get('moisture_content'))
        },
        environment: {
          Humidity_Percent_mean: parseFloat(formData.get('room_humidity')),
          Ambient_Temp_C: parseFloat(formData.get('room_temperature'))
        }
      },
      sensor_json: sensorData
    };

    const res = await axios.post(`${API}/predict`, payload, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    return res.data;
  } catch (error) {
    console.error('Analyze API error:', error);
    throw error;
  }
};
