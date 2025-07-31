'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function DebugFeedbackPage() {
  const [loading, setLoading] = useState(false)
  const [results, setResults] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)

  const debugFeedback = async () => {
    setLoading(true)
    setError(null)
    setResults(null)

    try {
      console.log('Starting debug...')
      
      // Test debug endpoint
      const debugResponse = await fetch('/api/debug-feedback')
      const debugData = await debugResponse.json()
      
      // Test analytics endpoint
      const analyticsResponse = await fetch('/api/analytics')
      const analyticsData = await analyticsResponse.json()
      
      // Test count endpoint
      const countResponse = await fetch('/api/check-feedback-count')
      const countData = await countResponse.json()

      setResults({
        debug: debugData,
        analytics: analyticsData,
        count: countData
      })

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 p-6">
      <div className="max-w-6xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>Feedback Debug Tool</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button 
              onClick={debugFeedback} 
              disabled={loading}
              className="w-full"
            >
              {loading ? 'Debugging...' : 'Debug Feedback System'}
            </Button>

            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                <p className="font-bold">Error:</p>
                <p>{error}</p>
              </div>
            )}

            {results && (
              <div className="space-y-4">
                {/* Debug Results */}
                <div className="bg-blue-100 border border-blue-400 text-blue-700 px-4 py-3 rounded">
                  <p className="font-bold">Debug Results:</p>
                  <pre className="mt-2 text-xs overflow-auto">
                    {JSON.stringify(results.debug, null, 2)}
                  </pre>
                </div>

                {/* Analytics Results */}
                <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
                  <p className="font-bold">Analytics API Results:</p>
                  <pre className="mt-2 text-xs overflow-auto">
                    {JSON.stringify(results.analytics, null, 2)}
                  </pre>
                </div>

                {/* Count Results */}
                <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded">
                  <p className="font-bold">Count API Results:</p>
                  <pre className="mt-2 text-xs overflow-auto">
                    {JSON.stringify(results.count, null, 2)}
                  </pre>
                </div>

                {/* Summary */}
                <div className="bg-gray-100 border border-gray-400 text-gray-700 px-4 py-3 rounded">
                  <p className="font-bold">Summary:</p>
                  <div className="mt-2 space-y-1">
                    <p><strong>Environment Variables:</strong> {results.debug?.debug?.environment?.serviceRoleKey === 'Set' ? '✅ Service Role Key Set' : '❌ Service Role Key Missing'}</p>
                    <p><strong>Database Connection:</strong> {results.debug?.debug?.serviceRole?.error ? '❌ Error' : '✅ Connected'}</p>
                    <p><strong>Feedback Count (Service Role):</strong> {results.debug?.debug?.serviceRole?.count || 0}</p>
                    <p><strong>Feedback Count (Anon):</strong> {results.debug?.debug?.anonClient?.count || 0}</p>
                    <p><strong>Analytics API Success:</strong> {results.analytics?.success ? '✅' : '❌'}</p>
                    <p><strong>Analytics Total Submissions:</strong> {results.analytics?.data?.totalSubmissions || 0}</p>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 