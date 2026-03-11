import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export interface UserInput {
  batch_id: string;
  operator_name: string;
  machine_settings: Record<string, number>;
  material_recipe: Record<string, number>;
  environment: Record<string, number>;
}

export interface SensorInput {
  batch_id: string;
  temperature_sensors: Record<string, number>;
  pressure_sensors: Record<string, number>;
  motor_sensors: Record<string, number>;
  compression_sensors: Record<string, number>;
  flow_sensors: Record<string, number>;
  power_sensors: Record<string, number>;
  vibration_sensors: Record<string, number>;
}

export interface PredictRequest {
  user_json: UserInput;
  sensor_json?: SensorInput;
}

export interface PredictionResponse {
  batch_id: string;
  predictions: {
    Quality_Score: number;
    Energy_kWh: number;
    Carbon_kg: number;
  };
  status: {
    Quality: string;
    Energy: string;
    Carbon: string;
  };
  vs_golden_signature: {
    Quality_diff: number;
    Energy_saved_pct: number;
    Carbon_saved_pct: number;
  };
  recommendations: Array<{
    parameter: string;
    current: number;
    recommended: number;
    change: number;
    direction: string;
  }>;
}

export interface GoldenSignature {
  Predicted_Quality: number;
  Predicted_Energy: number;
  Predicted_Carbon: number;
}

export const apiService = {
  async healthCheck() {
    const response = await api.get('/api/health');
    return response.data;
  },

  async predictBatch(request: PredictRequest): Promise<PredictionResponse> {
    const response = await api.post('/api/predict', request);
    return response.data;
  },

  async getGoldenSignatures(): Promise<GoldenSignature[]> {
    const response = await api.get('/api/golden-signatures');
    return response.data;
  },

  async getRoot() {
    const response = await api.get('/');
    return response.data;
  }
};

export default apiService;
