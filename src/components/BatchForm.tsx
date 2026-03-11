import React, { useState } from 'react';
import type { UserInput, SensorInput } from '../services/api';

interface BatchFormProps {
  onSubmit: (userInput: UserInput, sensorInput?: SensorInput) => void;
  loading: boolean;
}

const BatchForm: React.FC<BatchFormProps> = ({ onSubmit, loading }) => {
  const [batchId, setBatchId] = useState('');
  const [operatorName, setOperatorName] = useState('');
  const [useSensorData, setUseSensorData] = useState(false);

  const [machineSettings, setMachineSettings] = useState({
    Drying_Temp: 120,
    Binder_Amount: 2.5,
    Granulation_Time: 15,
    Compression_Force: 10,
    Machine_Speed: 50,
    Drying_Time: 30,
    Lubricant_Conc: 1.0,
    Tablet_Weight: 500
  });

  const [materialRecipe, setMaterialRecipe] = useState({
    API_Content: 0.8,
    Excipient_Ratio: 0.2,
    Moisture_Content: 1.5
  });

  const [environment, setEnvironment] = useState({
    Humidity_Percent_mean: 45,
    Ambient_Temp_C: 25
  });

  const [sensorData] = useState({
    temperature_sensors: {
      Temperature_C_mean: 35.2,
      Temperature_C_max: 67.8,
      Temperature_C_min: 21.3,
      Temperature_C_std: 12.8
    },
    pressure_sensors: {
      Pressure_Bar_mean: 0.98
    },
    motor_sensors: {
      Motor_Speed_RPM_max: 880.0
    },
    compression_sensors: {
      Compression_Force_kN_max: 14.0
    },
    flow_sensors: {
      Flow_Rate_LPM_mean: 1.65
    },
    power_sensors: {
      Power_Consumption_kW_max: 60.0
    },
    vibration_sensors: {
      Vibration_mm_s_mean: 3.0,
      Vibration_mm_s_max: 9.8,
      Vibration_mm_s_std: 2.4
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const userInput: UserInput = {
      batch_id: batchId || `BATCH-${Date.now()}`,
      operator_name: operatorName || 'Operator',
      machine_settings: machineSettings,
      material_recipe: materialRecipe,
      environment: environment
    };

    const sensorInput: SensorInput | undefined = useSensorData ? {
      batch_id: userInput.batch_id,
      ...sensorData
    } : undefined;

    onSubmit(userInput, sensorInput);
  };

  const handleMachineSettingChange = (key: string, value: string) => {
    setMachineSettings(prev => ({
      ...prev,
      [key]: parseFloat(value) || 0
    }));
  };

  const handleMaterialRecipeChange = (key: string, value: string) => {
    setMaterialRecipe(prev => ({
      ...prev,
      [key]: parseFloat(value) || 0
    }));
  };

  const handleEnvironmentChange = (key: string, value: string) => {
    setEnvironment(prev => ({
      ...prev,
      [key]: parseFloat(value) || 0
    }));
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Batch Optimization Form</h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Batch ID
            </label>
            <input
              type="text"
              value={batchId}
              onChange={(e) => setBatchId(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Auto-generated if empty"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Operator Name
            </label>
            <input
              type="text"
              value={operatorName}
              onChange={(e) => setOperatorName(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter operator name"
            />
          </div>
        </div>

        {/* Machine Settings */}
        <div>
          <h3 className="text-lg font-semibold mb-3 text-gray-700">Machine Settings</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {Object.entries(machineSettings).map(([key, value]) => (
              <div key={key}>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {key.replace(/_/g, ' ')}
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={value}
                  onChange={(e) => handleMachineSettingChange(key, e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Material Recipe */}
        <div>
          <h3 className="text-lg font-semibold mb-3 text-gray-700">Material Recipe</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {Object.entries(materialRecipe).map(([key, value]) => (
              <div key={key}>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {key.replace(/_/g, ' ')}
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={value}
                  onChange={(e) => handleMaterialRecipeChange(key, e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Environment */}
        <div>
          <h3 className="text-lg font-semibold mb-3 text-gray-700">Environment</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Object.entries(environment).map(([key, value]) => (
              <div key={key}>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {key.replace(/_/g, ' ')}
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={value}
                  onChange={(e) => handleEnvironmentChange(key, e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Sensor Data Toggle */}
        <div className="flex items-center">
          <input
            type="checkbox"
            id="useSensorData"
            checked={useSensorData}
            onChange={(e) => setUseSensorData(e.target.checked)}
            className="mr-2"
          />
          <label htmlFor="useSensorData" className="text-sm font-medium text-gray-700">
            Use custom sensor data (defaults will be used if unchecked)
          </label>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {loading ? 'Processing...' : 'Predict Batch Results'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default BatchForm;
