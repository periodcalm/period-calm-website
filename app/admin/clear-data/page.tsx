'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { AlertCircle, Trash2, CheckCircle, Loader2 } from 'lucide-react'
import { Alert, AlertDescription } from '@/components/ui/alert'

export default function ClearDataPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [currentCount, setCurrentCount] = useState<number | null>(null)
  const [result, setResult] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)
  const [showConfirmation, setShowConfirmation] = useState(false)

  const checkCurrentCount = async () => {
    try {
      setIsLoading(true)
      setError(null)
      
      const response = await fetch('/api/clear-feedback-data')
      const data = await response.json()
      
      if (response.ok) {
        setCurrentCount(data.data.totalRecords)
      } else {
        setError(data.error || 'Failed to check current count')
      }
    } catch (err) {
      setError('Network error')
    } finally {
      setIsLoading(false)
    }
  }

  const clearAllData = async () => {
    try {
      setIsLoading(true)
      setError(null)
      setResult(null)
      
      const response = await fetch('/api/clear-feedback-data', {
        method: 'DELETE'
      })
      const data = await response.json()
      
      if (response.ok) {
        setResult(data)
        setCurrentCount(0)
        setShowConfirmation(false)
      } else {
        setError(data.error || 'Failed to clear data')
      }
    } catch (err) {
      setError('Network error')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 p-6">
      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-red-700 mb-2">🗑️ Clear Feedback Data</h1>
          <p className="text-red-600">Remove all test/dummy feedback data from the database</p>
        </div>

        <Card className="shadow-xl border-red-200">
          <CardHeader className="bg-red-50 rounded-t-lg">
            <CardTitle className="flex items-center text-red-700">
              <Trash2 className="w-5 h-5 mr-2" />
              Data Management
            </CardTitle>
            <CardDescription>
              Clear all existing feedback submissions to start fresh
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            {/* Current Status */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-700">Current Status</h3>
                <Button 
                  onClick={checkCurrentCount} 
                  disabled={isLoading}
                  variant="outline"
                  size="sm"
                >
                  {isLoading ? (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    'Refresh'
                  )}
                  Check Count
                </Button>
              </div>
              
              {currentCount !== null && (
                <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="text-2xl font-bold text-blue-600">{currentCount}</div>
                  <p className="text-blue-700">Records in database</p>
                </div>
              )}
            </div>

            {/* Warning Alert */}
            <Alert className="mb-6 border-red-200 bg-red-50">
              <AlertCircle className="h-4 w-4 text-red-600" />
              <AlertDescription className="text-red-700">
                <strong>Warning:</strong> This action will permanently delete ALL feedback data. 
                This cannot be undone. Make sure you have backed up any important data.
              </AlertDescription>
            </Alert>

            {/* Action Buttons */}
            <div className="space-y-4">
              {!showConfirmation ? (
                <Button 
                  onClick={() => setShowConfirmation(true)}
                  disabled={isLoading || currentCount === 0}
                  className="w-full bg-red-600 hover:bg-red-700"
                  size="lg"
                >
                  <Trash2 className="w-5 h-5 mr-2" />
                  Clear All Feedback Data
                </Button>
              ) : (
                <div className="space-y-4">
                  <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                    <h4 className="font-semibold text-yellow-700 mb-2">Final Confirmation</h4>
                    <p className="text-yellow-600 mb-4">
                      Are you absolutely sure you want to delete all {currentCount} feedback records?
                    </p>
                    <div className="flex gap-3">
                      <Button 
                        onClick={clearAllData}
                        disabled={isLoading}
                        className="bg-red-600 hover:bg-red-700"
                      >
                        {isLoading ? (
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        ) : (
                          <Trash2 className="w-4 h-4 mr-2" />
                        )}
                        Yes, Delete All Data
                      </Button>
                      <Button 
                        onClick={() => setShowConfirmation(false)}
                        variant="outline"
                        disabled={isLoading}
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Error Display */}
            {error && (
              <Alert className="mt-6 border-red-200 bg-red-50">
                <AlertCircle className="h-4 w-4 text-red-600" />
                <AlertDescription className="text-red-700">
                  {error}
                </AlertDescription>
              </Alert>
            )}

            {/* Success Result */}
            {result && (
              <Alert className="mt-6 border-green-200 bg-green-50">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <AlertDescription className="text-green-700">
                  <div className="font-semibold mb-2">✅ Data cleared successfully!</div>
                  <div className="text-sm space-y-1">
                    <div>Records deleted: {result.data.recordsDeleted}</div>
                    <div>Remaining records: {result.data.remainingRecords}</div>
                    <div>Timestamp: {new Date(result.data.timestamp).toLocaleString()}</div>
                  </div>
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>

        {/* Instructions */}
        <Card className="mt-6 shadow-lg border-blue-200">
          <CardHeader className="bg-blue-50 rounded-t-lg">
            <CardTitle className="text-blue-700">Instructions</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-3 text-sm text-gray-600">
              <p>1. <strong>Check current count</strong> to see how many records exist</p>
              <p>2. <strong>Click "Clear All Feedback Data"</strong> to start the process</p>
              <p>3. <strong>Confirm the deletion</strong> when prompted</p>
              <p>4. <strong>Wait for completion</strong> - this cannot be undone</p>
              <p>5. <strong>Start fresh</strong> with real feedback data</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 