'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function TestFeedbackPage() {
  const [loading, setLoading] = useState(false)
  const [results, setResults] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)

  const testFeedbackDelete = async () => {
    setLoading(true)
    setError(null)
    setResults(null)

    try {
      const steps = []
      
      // Step 1: Check current count
      steps.push('Checking current count...')
      const countResponse = await fetch('/api/check-feedback-count')
      const countData = await countResponse.json()
      steps.push(`Current count: ${countData.count}`)

      // Step 2: Check analytics data
      steps.push('Checking analytics data...')
      const analyticsResponse = await fetch('/api/analytics')
      const analyticsData = await analyticsResponse.json()
      steps.push(`Analytics total submissions: ${analyticsData.data?.totalSubmissions || 0}`)

      // Step 3: Try to clear feedback
      steps.push('Attempting to clear feedback...')
      const clearResponse = await fetch('/api/clear-feedback', {
        method: 'DELETE'
      })
      const clearData = await clearResponse.json()
      steps.push(`Clear response: ${JSON.stringify(clearData, null, 2)}`)

      // Step 4: Check count again after clear
      steps.push('Checking count after clear...')
      const afterCountResponse = await fetch('/api/check-feedback-count')
      const afterCountData = await afterCountResponse.json()
      steps.push(`Count after clear: ${afterCountData.count}`)

      // Step 5: Check analytics data again
      steps.push('Checking analytics data after clear...')
      const afterAnalyticsResponse = await fetch('/api/analytics')
      const afterAnalyticsData = await afterAnalyticsResponse.json()
      steps.push(`Analytics total submissions after clear: ${afterAnalyticsData.data?.totalSubmissions || 0}`)

      setResults({
        steps,
        summary: {
          beforeCount: countData.count,
          afterCount: afterCountData.count,
          recordsDeleted: clearData.recordsDeleted,
          analyticsBefore: analyticsData.data?.totalSubmissions || 0,
          analyticsAfter: afterAnalyticsData.data?.totalSubmissions || 0
        }
      })

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 p-6">
      <div className="max-w-4xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>Feedback Deletion Test</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button 
              onClick={testFeedbackDelete} 
              disabled={loading}
              className="w-full"
            >
              {loading ? 'Testing...' : 'Test Feedback Deletion'}
            </Button>

            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                <p className="font-bold">Error:</p>
                <p>{error}</p>
              </div>
            )}

            {results && (
              <div className="space-y-4">
                <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
                  <p className="font-bold">Test Results:</p>
                  <div className="mt-2">
                    <p><strong>Before Count:</strong> {results.summary.beforeCount}</p>
                    <p><strong>After Count:</strong> {results.summary.afterCount}</p>
                    <p><strong>Records Deleted:</strong> {results.summary.recordsDeleted}</p>
                    <p><strong>Analytics Before:</strong> {results.summary.analyticsBefore}</p>
                    <p><strong>Analytics After:</strong> {results.summary.analyticsAfter}</p>
                  </div>
                </div>

                <div className="bg-gray-100 border border-gray-400 text-gray-700 px-4 py-3 rounded">
                  <p className="font-bold">Test Steps:</p>
                  <div className="mt-2 space-y-1">
                    {results.steps.map((step: string, index: number) => (
                      <p key={index} className="text-sm">{step}</p>
                    ))}
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