import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function DELETE() {
  try {
    // Use service role key to bypass RLS
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )
    
    // First, get the count of existing records
    const { count: beforeCount, error: countError } = await supabase
      .from('feedback_submissions')
      .select('*', { count: 'exact', head: true })
    
    if (countError) {
      console.error('Error getting count before delete:', countError)
      return NextResponse.json(
        { error: 'Failed to get count before delete', details: countError.message },
        { status: 500 }
      )
    }
    
    console.log('Records to delete:', beforeCount)
    
    // Delete all feedback submissions (Supabase requires a WHERE clause)
    const { error } = await supabase
      .from('feedback_submissions')
      .delete()
      .neq('id', '00000000-0000-0000-0000-000000000000')
    
    if (error) {
      console.error('Error clearing feedback submissions:', error)
      return NextResponse.json(
        { error: 'Failed to clear feedback submissions', details: error.message },
        { status: 500 }
      )
    }

    // Verify deletion by checking count again
    const { count: afterCount, error: afterCountError } = await supabase
      .from('feedback_submissions')
      .select('*', { count: 'exact', head: true })
    
    if (afterCountError) {
      console.error('Error getting count after delete:', afterCountError)
    }
    
    console.log('All feedback submissions cleared successfully')
    console.log('Records before delete:', beforeCount, 'Records after delete:', afterCount)
    
    return NextResponse.json(
      { 
        success: true, 
        message: 'All feedback submissions cleared successfully',
        recordsDeleted: beforeCount - (afterCount || 0),
        beforeCount,
        afterCount,
        timestamp: new Date().toISOString()
      }
    )
  } catch (err) {
    console.error('Unexpected error clearing feedback:', err)
    return NextResponse.json(
      { error: 'Unexpected error occurred' },
      { status: 500 }
    )
  }
}