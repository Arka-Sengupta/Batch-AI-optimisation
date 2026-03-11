import { useContext, useState } from "react";
import { DataContext } from "../context/DataContext";
import { analyzeBatch } from "../api/api";

export default function PredictionPanel() {
  const { formDataPayload, mlResponse, setMlResponse } = useContext(DataContext);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  if (!formDataPayload && !mlResponse) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 h-full flex items-center justify-center">
        <p className="text-gray-500 text-center">No batch data submitted yet. Please configure analysis from the Home page.</p>
      </div>
    );
  }

  const runAnalysis = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await analyzeBatch(formDataPayload);
      setMlResponse(result);
    } catch (error) {
      setError('Failed to run ML Analysis. Please check your backend connection.');
      console.error('Analysis failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const prediction = mlResponse?.predictions;
  const status = mlResponse?.status;
  const vsGolden = mlResponse?.vs_golden_signature;

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 flex flex-col h-full">
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-1">AI Predictions</h2>
          <p className="text-gray-600">Model Analysis Results for Batch {mlResponse?.batch_id || '...'}</p>
        </div>
        {mlResponse && (
           <span className="px-3 py-1 bg-indigo-100 text-indigo-800 text-sm font-semibold rounded-full border border-indigo-200">
             Batch {mlResponse.batch_id}
           </span>
        )}
      </div>

      {!mlResponse && (
        <button
          onClick={runAnalysis}
          disabled={isLoading || !formDataPayload}
          className="w-full px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center mb-6"
        >
          {isLoading ? (
            <>
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Running Analysis...
            </>
          ) : (
             "Run AI Prediction"
          )}
        </button>
      )}

      {error && (
        <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-700 text-sm">{error}</p>
        </div>
      )}

      {prediction && (
        <div className="space-y-4 flex-grow">
          <div className="grid grid-cols-1 gap-4">
            
            {/* Quality Score Panel */}
            <div className="bg-gradient-to-r from-emerald-50 to-green-50 rounded-lg p-4 border border-green-100">
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium text-emerald-700 uppercase tracking-wider">Quality Score</p>
                    <span className="text-xs font-bold text-gray-700 bg-white px-2 py-0.5 rounded shadow-sm">{status.Quality}</span>
                  </div>
                  <p className="text-3xl font-bold text-emerald-900 mt-1">{prediction.Quality_Score}</p>
                  <p className="text-xs text-emerald-600 font-medium mt-1">
                    Diff vs NSGA Pareto: {vsGolden.Quality_diff > 0 ? '+' : ''}{vsGolden.Quality_diff}
                  </p>
                </div>
                <div className="w-12 h-12 bg-emerald-200 rounded-full flex items-center justify-center border border-emerald-300">
                  <span className="text-xl">🏆</span>
                </div>
              </div>
            </div>

            {/* Energy Panel */}
            <div className="bg-gradient-to-r from-amber-50 to-yellow-50 rounded-lg p-4 border border-amber-100">
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium text-amber-700 uppercase tracking-wider">Energy Consumed</p>
                    <span className="text-xs font-bold text-gray-700 bg-white px-2 py-0.5 rounded shadow-sm">{status.Energy}</span>
                  </div>
                  <p className="text-3xl font-bold text-amber-900 mt-1">{prediction.Energy_kWh} <span className="text-lg">kWh</span></p>
                  <p className="text-xs text-amber-700 font-medium mt-1">
                    Potential Savings vs TS: {vsGolden.Energy_saved_pct}%
                  </p>
                </div>
                <div className="w-12 h-12 bg-amber-200 rounded-full flex items-center justify-center border border-amber-300">
                  <span className="text-xl">⚡</span>
                </div>
              </div>
            </div>

            {/* Carbon Panel */}
            <div className="bg-gradient-to-r from-rose-50 to-red-50 rounded-lg p-4 border border-rose-100">
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium text-rose-700 uppercase tracking-wider">Carbon Footprint</p>
                    <span className="text-xs font-bold text-gray-700 bg-white px-2 py-0.5 rounded shadow-sm">{status.Carbon}</span>
                  </div>
                  <p className="text-3xl font-bold text-rose-900 mt-1">{prediction.Carbon_kg} <span className="text-lg">kg</span></p>
                  <p className="text-xs text-rose-700 font-medium mt-1">
                     Potential Reductions: {vsGolden.Carbon_saved_pct}%
                  </p>
                </div>
                <div className="w-12 h-12 bg-rose-200 rounded-full flex items-center justify-center border border-rose-300">
                  <span className="text-xl">🏭</span>
                </div>
              </div>
            </div>
          </div>

          {mlResponse.graphs && mlResponse.graphs.length > 0 && (
            <div className="mt-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3 border-b pb-2">Analysis Visualizations</h3>
              {mlResponse.graphs.map((g, idx) => (
                <img key={idx} src={g} alt={`Analysis Chart ${idx}`} className="w-full rounded-lg shadow-sm border" />
              ))}
            </div>
          )}

        </div>
      )}
    </div>
  );
}
