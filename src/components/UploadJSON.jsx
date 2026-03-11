import { useContext, useState } from "react";
import { DataContext } from "../context/DataContext";
import { useNavigate } from "react-router-dom";

export default function UploadJSON() {
  const { setFormDataPayload } = useContext(DataContext);
  const navigate = useNavigate();
  const [file, setFile] = useState(null);

  const [formData, setFormData] = useState({
    batch_id: "",
    granulation_time: "18",
    machine_speed: "150",
    compression_force: "12.5",
    drying_temp: "60",
    drying_time: "25",
    binder_amount: "8.5",
    lubricant_conc: "1.0",
    tablet_weight: "200",
    moisture_content: "2.1",
    room_temperature: "22",
    room_humidity: "45",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!file) {
      alert("Please upload the sensor JSON file.");
      return;
    }

    const payload = new FormData();
    payload.append("sensor_file", file);
    Object.keys(formData).forEach((key) => {
      payload.append(key, formData[key]);
    });

    setFormDataPayload(payload);
    // Proceed to dashboard automatically
    navigate("/dashboard");
  };

  return (
    <div className="text-left w-full max-w-4xl mx-auto">
      <div className="mb-8 text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Configure Batch Analysis</h2>
        <p className="text-gray-600 mb-6">Enter machine settings, lab inputs, and upload the sensor dataset.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Section 1: Machine Settings */}
        <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
          <h3 className="text-xl font-semibold mb-4 text-indigo-700 border-b pb-2">🏭 Section 1 - Machine Settings</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Batch ID</label>
              <input type="text" name="batch_id" required value={formData.batch_id} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border" placeholder="e.g. BATCH-001" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Granulation Time (mins)</label>
              <input type="number" step="any" name="granulation_time" required value={formData.granulation_time} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 p-2 border" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Machine Speed (RPM)</label>
              <input type="number" step="any" name="machine_speed" required value={formData.machine_speed} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 p-2 border" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Compression Force (kN)</label>
              <input type="number" step="any" name="compression_force" required value={formData.compression_force} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 p-2 border" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Drying Temp (°C)</label>
              <input type="number" step="any" name="drying_temp" required value={formData.drying_temp} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 p-2 border" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Drying Time (mins)</label>
              <input type="number" step="any" name="drying_time" required value={formData.drying_time} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 p-2 border" />
            </div>
          </div>
        </div>

        {/* Section 2: Material/Recipe inputs */}
        <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
          <h3 className="text-xl font-semibold mb-4 text-emerald-700 border-b pb-2">🧪 Section 2 - Material / Lab Inputs</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Binder Amount (g)</label>
              <input type="number" step="any" name="binder_amount" required value={formData.binder_amount} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-500 p-2 border" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Lubricant Conc (%)</label>
              <input type="number" step="any" name="lubricant_conc" required value={formData.lubricant_conc} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-500 p-2 border" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Tablet Weight (mg)</label>
              <input type="number" step="any" name="tablet_weight" required value={formData.tablet_weight} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-500 p-2 border" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Moisture Content (%)</label>
              <input type="number" step="any" name="moisture_content" required value={formData.moisture_content} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-500 p-2 border" />
            </div>
          </div>
        </div>

        {/* Section 3: Environment Data */}
        <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
          <h3 className="text-xl font-semibold mb-4 text-amber-700 border-b pb-2">🌡️ Section 3 - Environment</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Room Temperature (°C)</label>
              <input type="number" step="any" name="room_temperature" required value={formData.room_temperature} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-amber-500 p-2 border" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Room Humidity (%)</label>
              <input type="number" step="any" name="room_humidity" required value={formData.room_humidity} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-amber-500 p-2 border" />
            </div>
          </div>
        </div>

        {/* Section 4: JSON File Upload */}
        <div className="bg-blue-50 p-6 rounded-lg border border-blue-200 text-center">
          <h3 className="text-xl font-semibold mb-4 text-blue-800">📊 Sensor Data Upload</h3>
          <div className="relative">
            <input type="file" accept=".json" onChange={handleFileChange} className="hidden" id="file-upload" />
            <label htmlFor="file-upload" className="cursor-pointer inline-flex items-center px-6 py-3 border-2 border-dashed border-blue-400 rounded-lg hover:border-blue-500 transition-colors duration-200 bg-white hover:bg-blue-100">
              <svg className="w-5 h-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <span className="text-blue-700 font-medium">{file ? file.name : "Choose JSON Sensor File"}</span>
            </label>
          </div>
        </div>

        <div className="text-center pt-4">
          <button type="submit" className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-4 bg-indigo-600 text-white font-bold text-lg rounded-xl hover:bg-indigo-700 transition-all duration-200 shadow-xl hover:shadow-2xl">
            Submit & Proceed to Dashboard
            <svg className="ml-2 w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </button>
        </div>
      </form>
    </div>
  );
}
