import { useState } from 'react'
import BatchForm from './components/BatchForm'
import ResultsDisplay from './components/ResultsDisplay'
import apiService from './services/api'
import type { UserInput, SensorInput, PredictionResponse } from './services/api'
import './App.css'

function App() {
  const [results, setResults] = useState<PredictionResponse | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleBatchSubmit = async (userInput: UserInput, sensorInput?: SensorInput) => {
    setLoading(true)
    setError(null)
    
    try {
      const response = await apiService.predictBatch({
        user_json: userInput,
        sensor_json: sensorInput
      })
      setResults(response)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred while processing your request')
      console.error('Prediction error:', err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="container mx-auto px-4">
        <header className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            Batch Optimization AI Dashboard
          </h1>
          <p className="text-lg text-gray-600">
            Optimize your manufacturing batches with AI-powered predictions
          </p>
        </header>

        {error && (
          <div className="max-w-4xl mx-auto mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
            <strong>Error:</strong> {error}
          </div>
        )}

        <div className="space-y-8">
          <BatchForm onSubmit={handleBatchSubmit} loading={loading} />
          <ResultsDisplay results={results} loading={loading} />
        </div>
      </div>
    </div>
  )
}

export default App
