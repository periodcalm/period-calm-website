import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

const supabase = createClient(supabaseUrl, supabaseServiceKey)

export async function DELETE(request: NextRequest) {
  try {
    // Check if Supabase is configured
    if (!supabaseUrl || !supabaseServiceKey) {
      console.error('❌ Supabase not configured')
      return NextResponse.json(
        { error: 'Database not configured' },
        { status: 503 }
      )
    }

    // Get count of existing records before deletion
    const { count: beforeCount, error: countError } = await supabase
      .from('feedback_submissions')
      .select('*', { count: 'exact', head: true })

    if (countError) {
      console.error('Error counting records:', countError)
      return NextResponse.json(
        { error: 'Failed to count existing records' },
        { status: 500 }
      )
    }

    // Delete all records from feedback_submissions table
    const { error: deleteError } = await supabase
      .from('feedback_submissions')
      .delete()
      .neq('id', '00000000-0000-0000-0000-000000000000') // Delete all records

    if (deleteError) {
      console.error('Error deleting records:', deleteError)
      return NextResponse.json(
        { error: 'Failed to delete feedback data' },
        { status: 500 }
      )
    }

    // Verify deletion by counting again
    const { count: afterCount, error: verifyError } = await supabase
      .from('feedback_submissions')
      .select('*', { count: 'exact', head: true })

    if (verifyError) {
      console.error('Error verifying deletion:', verifyError)
      return NextResponse.json(
        { error: 'Failed to verify deletion' },
        { status: 500 }
      )
    }

    console.log('🗑️ Feedback data cleared successfully:', {
      recordsDeleted: beforeCount,
      remainingRecords: afterCount
    })

    return NextResponse.json({
      success: true,
      message: 'All feedback data cleared successfully',
      data: {
        recordsDeleted: beforeCount,
        remainingRecords: afterCount,
        timestamp: new Date().toISOString()
      }
    })

  } catch (error) {
    console.error('Error clearing feedback data:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// GET method to check current data count (for verification)
export async function GET(request: NextRequest) {
  try {
    // Check if Supabase is configured
    if (!supabaseUrl || !supabaseServiceKey) {
      console.error('❌ Supabase not configured')
      return NextResponse.json(
        { error: 'Database not configured' },
        { status: 503 }
      )
    }

    // Get count of existing records
    const { count, error } = await supabase
      .from('feedback_submissions')
      .select('*', { count: 'exact', head: true })

    if (error) {
      console.error('Error counting records:', error)
      return NextResponse.json(
        { error: 'Failed to count records' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      data: {
        totalRecords: count,
        timestamp: new Date().toISOString()
      }
    })

  } catch (error) {
    console.error('Error getting record count:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 