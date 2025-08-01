'use client'

import { useAnalytics } from '@/hooks/useAnalytics'

export default function AnalyticsDebug() {
  const { analyticsData, isLoading, refreshTrigger, refetch } = useAnalytics()

  return (
    <div className="fixed top-4 right-4 bg-white border border-gray-300 rounded-lg p-4 shadow-lg z-50 max-w-sm">
      <h3 className="font-bold text-sm mb-2">Analytics Debug</h3>
      <div className="text-xs space-y-1">
        <div>Loading: {isLoading ? 'Yes' : 'No'}</div>
        <div>Refresh Trigger: {refreshTrigger}</div>
        <div>Total Submissions: {analyticsData?.total_submissions || 0}</div>
        <div>Average Rating: {analyticsData?.average_ratings?.overall_satisfaction || 0}</div>
        <div>Timestamp: {new Date().toLocaleTimeString()}</div>
        <button
          onClick={() => {
            console.log('🔄 Debug refresh clicked')
            refetch()
          }}
          className="mt-2 bg-blue-500 text-white px-2 py-1 rounded text-xs hover:bg-blue-600"
        >
          Refresh
        </button>
        <button
          onClick={() => {
            console.log('🧪 Debug test event')
            window.dispatchEvent(new CustomEvent('feedbackSubmitted'))
          }}
          className="mt-1 bg-green-500 text-white px-2 py-1 rounded text-xs hover:bg-green-600 block"
        >
          Test Event
        </button>
      </div>
    </div>
  )
} 