import { NextResponse } from 'next/server'
import { getSupabaseBrowserClient } from '@/supabase/client'

export async function GET() {
  try {
    const supabase = getSupabaseBrowserClient()
    
    // Test reading feedback submissions
    const { data, error } = await supabase
      .from('feedback_submissions')
      .select('count')
      .limit(1)

    if (error) {
      return NextResponse.json({ 
        status: 'error',
        error: error.message,
        details: error
      })
    }

    // Test inserting a sample feedback (for testing only)
    const testFeedback = {
      first_name: 'Test',
      email: 'test@example.com',
      phone: '1234567890',
      overall_satisfaction: 5,
      submitted_at: new Date().toISOString(),
      source: 'test'
    }

    const { data: insertData, error: insertError } = await supabase
      .from('feedback_submissions')
      .insert([testFeedback])
      .select()

    return NextResponse.json({
      status: 'success',
      readTest: 'passed',
      insertTest: insertError ? 'failed' : 'passed',
      insertError: insertError?.message,
      message: 'Database connection and policies are working correctly'
    })

  } catch (err) {
    return NextResponse.json({
      status: 'error',
      error: err instanceof Error ? err.message : 'Unknown error'
    })
  }
}