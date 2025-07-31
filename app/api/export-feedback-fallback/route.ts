import { NextResponse } from 'next/server'
import { getSupabaseBrowserClient } from '@/supabase/client'

// Helper function to convert data to CSV
function convertToCSV(data: any[]): string {
  if (data.length === 0) return ''
  
  // Get headers from first object
  const headers = Object.keys(data[0])
  
  // Create CSV header row
  const csvHeader = headers.map(header => `"${header}"`).join(',')
  
  // Create CSV data rows
  const csvRows = data.map(row => {
    return headers.map(header => {
      const value = row[header]
      // Handle arrays, null, undefined
      if (Array.isArray(value)) {
        return `"${value.join(', ')}"`
      }
      if (value === null || value === undefined) {
        return '""'
      }
      // Escape quotes and wrap in quotes
      const stringValue = String(value).replace(/"/g, '""')
      return `"${stringValue}"`
    }).join(',')
  })
  
  return [csvHeader, ...csvRows].join('\n')
}

export async function GET(request: Request) {
  try {
    console.log('Using fallback export method with browser client...')
    
    const { searchParams } = new URL(request.url)
    const download = searchParams.get('download')
    
    const supabase = getSupabaseBrowserClient()
    
    // Try to fetch feedback submissions
    const { data, error } = await supabase
      .from('feedback_submissions')
      .select('*')
      .order('submitted_at', { ascending: false })

    if (error) {
      console.error('Supabase error:', error)
      
      // If it's a permissions error, provide helpful message
      if (error.message.includes('permission') || error.message.includes('policy')) {
        return NextResponse.json({ 
          error: 'Permission denied. This endpoint requires admin access.',
          details: error.message,
          suggestion: 'Please ensure you are logged in as an admin user.'
        }, { status: 403 })
      }
      
      return NextResponse.json({ 
        error: `Database error: ${error.message}`,
        details: error
      }, { status: 500 })
    }

    console.log(`Found ${data?.length || 0} feedback submissions`)

    if (!data || data.length === 0) {
      return NextResponse.json({ 
        error: 'No feedback submissions found.',
        message: 'The database is empty. Try submitting some feedback first!',
        suggestion: 'Go to the main page and click "Empower Us" to submit feedback.'
      }, { status: 404 })
    }

    // If download parameter is present, return CSV file
    if (download === 'true') {
      // Convert to CSV
      const csv = convertToCSV(data)

      // Generate filename with current date
      const date = new Date().toISOString().split('T')[0]
      const filename = `feedback_submissions_${date}.csv`

      console.log(`Successfully generated CSV with ${data.length} rows`)

      return new Response(csv, {
        status: 200,
        headers: {
          'Content-Type': 'text/csv; charset=utf-8',
          'Content-Disposition': `attachment; filename="${filename}"`,
          'Cache-Control': 'no-cache',
        },
      })
    }

    // Otherwise return JSON data for analytics
    return NextResponse.json({
      success: true,
      count: data.length,
      data: data,
      message: 'Feedback data retrieved successfully'
    })

  } catch (err) {
    console.error('Export error:', err)
    return NextResponse.json({ 
      error: err instanceof Error ? err.message : 'An unexpected error occurred',
      stack: err instanceof Error ? err.stack : undefined
    }, { status: 500 })
  }
}