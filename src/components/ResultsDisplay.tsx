import React from 'react';
import type { PredictionResponse } from '../services/api';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts';

interface ResultsDisplayProps {
  results: PredictionResponse | null;
  loading: boolean;
}

const ResultsDisplay: React.FC<ResultsDisplayProps> = ({ results, loading }) => {
  if (loading) {
    return (
      <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <span className="ml-3 text-lg text-gray-600">Processing batch optimization...</span>
        </div>
      </div>
    );
  }

  if (!results) {
    return null;
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'OPTIMAL': return 'text-green-600 font-semibold';
      case 'GOOD': 
      case 'ACCEPTABLE': return 'text-yellow-600 font-semibold';
      case 'NEEDS IMPROVEMENT':
      case 'HIGH': return 'text-red-600 font-semibold';
      default: return 'text-gray-600';
    }
  };

  const predictionData = [
    {
      name: 'Quality Score',
      value: results.predictions.Quality_Score,
      fill: '#3b82f6'
    },
    {
      name: 'Energy (kWh)',
      value: results.predictions.Energy_kWh,
      fill: '#ef4444'
    },
    {
      name: 'Carbon (kg)',
      value: results.predictions.Carbon_kg,
      fill: '#10b981'
    }
  ];

  const comparisonData = [
    {
      metric: 'Quality',
      current: results.predictions.Quality_Score,
      benchmark: results.predictions.Quality_Score - results.vs_golden_signature.Quality_diff
    },
    {
      metric: 'Energy',
      current: results.predictions.Energy_kWh,
      benchmark: results.predictions.Energy_kWh * (1 - results.vs_golden_signature.Energy_saved_pct / 100)
    },
    {
      metric: 'Carbon',
      current: results.predictions.Carbon_kg,
      benchmark: results.predictions.Carbon_kg * (1 - results.vs_golden_signature.Carbon_saved_pct / 100)
    }
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-bold mb-4 text-gray-800">
          Batch Optimization Results - {results.batch_id}
        </h2>
        
        {/* Status Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
            <h3 className="text-lg font-semibold text-blue-800 mb-2">Quality</h3>
            <p className="text-2xl font-bold text-blue-600">{results.predictions.Quality_Score.toFixed(3)}</p>
            <p className={getStatusColor(results.status.Quality)}>{results.status.Quality}</p>
          </div>
          
          <div className="bg-red-50 p-4 rounded-lg border border-red-200">
            <h3 className="text-lg font-semibold text-red-800 mb-2">Energy Consumption</h3>
            <p className="text-2xl font-bold text-red-600">{results.predictions.Energy_kWh.toFixed(2)} kWh</p>
            <p className={getStatusColor(results.status.Energy)}>{results.status.Energy}</p>
          </div>
          
          <div className="bg-green-50 p-4 rounded-lg border border-green-200">
            <h3 className="text-lg font-semibold text-green-800 mb-2">Carbon Emission</h3>
            <p className="text-2xl font-bold text-green-600">{results.predictions.Carbon_kg.toFixed(3)} kg</p>
            <p className={getStatusColor(results.status.Carbon)}>{results.status.Carbon}</p>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Prediction Values Chart */}
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h3 className="text-lg font-semibold mb-4 text-gray-800">Current Predictions</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={predictionData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#3b82f6" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Comparison Chart */}
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h3 className="text-lg font-semibold mb-4 text-gray-800">vs Golden Signature Benchmark</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={comparisonData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="metric" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="current" stroke="#3b82f6" strokeWidth={2} name="Current" />
              <Line type="monotone" dataKey="benchmark" stroke="#10b981" strokeWidth={2} name="Golden Signature" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Comparison Metrics */}
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <h3 className="text-lg font-semibold mb-4 text-gray-800">Performance Comparison</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-600 mb-1">Quality Difference</p>
            <p className={`text-xl font-bold ${results.vs_golden_signature.Quality_diff >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {results.vs_golden_signature.Quality_diff >= 0 ? '+' : ''}{results.vs_golden_signature.Quality_diff.toFixed(3)}
            </p>
          </div>
          
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-600 mb-1">Energy Saved</p>
            <p className="text-xl font-bold text-green-600">
              {results.vs_golden_signature.Energy_saved_pct.toFixed(1)}%
            </p>
          </div>
          
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-600 mb-1">Carbon Reduced</p>
            <p className="text-xl font-bold text-green-600">
              {results.vs_golden_signature.Carbon_saved_pct.toFixed(1)}%
            </p>
          </div>
        </div>
      </div>

      {/* Recommendations */}
      {results.recommendations.length > 0 && (
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h3 className="text-lg font-semibold mb-4 text-gray-800">Optimization Recommendations</h3>
          <div className="space-y-3">
            {results.recommendations.map((rec, index) => (
              <div key={index} className="border-l-4 border-blue-500 pl-4 py-2">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-semibold text-gray-800">{rec.parameter.replace(/_/g, ' ')}</h4>
                    <p className="text-sm text-gray-600">
                      Change from <span className="font-medium">{rec.current}</span> to 
                      <span className="font-medium text-blue-600"> {rec.recommended}</span>
                      <span className={`ml-2 ${rec.direction === 'increase' ? 'text-green-600' : 'text-red-600'}`}>
                        ({rec.direction} by {Math.abs(rec.change)})
                      </span>
                    </p>
                  </div>
                  <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                    rec.direction === 'increase' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {rec.direction.toUpperCase()}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ResultsDisplay;
