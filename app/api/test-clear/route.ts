import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function GET() {
  try {
    console.log('=== TEST CLEAR API ===')
    console.log('SUPABASE_URL:', process.env.NEXT_PUBLIC_SUPABASE_URL ? 'Set' : 'Not set')
    console.log('SERVICE_ROLE_KEY:', process.env.SUPABASE_SERVICE_ROLE_KEY ? 'Set' : 'Not set')

    // Test with service role key
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    // First, get the count
    const { count, error: countError } = await supabase
      .from('feedback_submissions')
      .select('*', { count: 'exact', head: true })

    console.log('Current count:', count, 'Error:', countError?.message)

    if (countError) {
      return NextResponse.json({
        success: false,
        error: 'Failed to get count',
        details: countError.message
      })
    }

    // Try to delete one record to test
    const { data: firstRecord, error: selectError } = await supabase
      .from('feedback_submissions')
      .select('id')
      .limit(1)

    if (selectError) {
      return NextResponse.json({
        success: false,
        error: 'Failed to select record',
        details: selectError.message
      })
    }

    if (firstRecord && firstRecord.length > 0) {
      const { error: deleteError } = await supabase
        .from('feedback_submissions')
        .delete()
        .eq('id', firstRecord[0].id)

      console.log('Delete test result:', { error: deleteError?.message })

      return NextResponse.json({
        success: true,
        testRecord: firstRecord[0],
        deleteError: deleteError?.message,
        currentCount: count
      })
    } else {
      return NextResponse.json({
        success: true,
        message: 'No records to test with',
        currentCount: count
      })
    }

  } catch (err) {
    console.error('Test clear API error:', err)
    return NextResponse.json(
      { error: 'Test clear API error', details: err instanceof Error ? err.message : 'Unknown error' },
      { status: 500 }
    )
  }
} 