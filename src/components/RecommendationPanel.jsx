import { useContext } from "react";
import { DataContext } from "../context/DataContext";

export default function RecommendationPanel() {
  const { mlResponse } = useContext(DataContext);

  if (!mlResponse) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 h-full flex items-center justify-center">
        <div className="text-center">
           <span className="text-4xl">🤖</span>
           <p className="text-gray-500 mt-4 text-center">Run the AI Prediction on the left to see parameter adjustments required to hit Pareto Optimality.</p>
        </div>
      </div>
    );
  }

  const recommendations = mlResponse.recommendations || [];

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 flex flex-col h-full">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-indigo-900 mb-2">Target Adjustments</h2>
        <p className="text-gray-600">Model recommended adjustments to reach the Golden Signature target parameters</p>
      </div>

      {recommendations.length > 0 ? (
        <div className="mt-2 space-y-4 flex-grow">
          
          <div className="overflow-x-auto border rounded-lg shadow-sm">
             <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                   <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Parameter</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Current</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-indigo-600 uppercase tracking-wider">Target</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                   </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                   {recommendations.map((rec, idx) => (
                      <tr key={idx} className="hover:bg-indigo-50 transition-colors">
                         <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{rec.parameter.replace(/_/g, " ")}</td>
                         <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{rec.current}</td>
                         <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-indigo-700">{rec.recommended}</td>
                         <td className="px-6 py-4 whitespace-nowrap text-sm">
                            {rec.direction === 'increase' ? (
                               <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                                  ▲ +{Math.abs(rec.change).toFixed(2)}
                               </span>
                            ) : (
                               <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                  ▼ -{Math.abs(rec.change).toFixed(2)}
                               </span>
                            )}
                         </td>
                      </tr>
                   ))}
                </tbody>
             </table>
          </div>

          <div className="mt-6 p-4 bg-indigo-50 border border-indigo-100 rounded-lg">
            <h4 className="font-semibold text-indigo-900 flex items-center mb-2">
               <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
               NSGA-II Pareto Front Report
            </h4>
            <p className="text-sm text-indigo-800 leading-relaxed">
              These adjustments were identified by matching your current processing configuration against the most dominant non-dominated solution sets (Pareto Fronts) that successfully reduced Carbon Footprint and Energy Consumption while boosting Quality in historical traces.
            </p>
          </div>
        </div>
      ) : (
        <div className="p-4 bg-green-50 text-green-700 rounded-lg font-semibold flex items-center mt-4 border border-green-200 shadow-sm">
          <span className="text-2xl mr-3">🎉</span> Great job! Your parameters are extremely close to the NSGA Pareto targets. No major adjustments required.
        </div>
      )}
    </div>
  );
}
