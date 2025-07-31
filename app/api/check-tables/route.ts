import { NextResponse } from 'next/server'
import { supabaseServer } from '@/supabase/server'

export async function GET() {
  try {
    console.log('=== CHECKING SUPABASE TABLES ===')
    
    // Check if we can connect to Supabase
    console.log('Environment check:', {
      hasUrl: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
      hasServiceKey: !!process.env.SUPABASE_SERVICE_ROLE_KEY
    })
    
    // Try to get table information
    const { data: tables, error: tablesError } = await supabaseServer
      .from('information_schema.tables')
      .select('table_name')
      .eq('table_schema', 'public')
    
    if (tablesError) {
      console.error('Error getting tables:', tablesError)
      return NextResponse.json({
        success: false,
        error: 'Failed to get table information',
        details: tablesError.message
      })
    }
    
    console.log('Available tables:', tables)
    
    // Try different possible table names
    const possibleTableNames = [
      'feedback_submissions',
      'feedback',
      'submissions',
      'user_feedback',
      'period_calm_feedback'
    ]
    
    const tableResults = {}
    
    for (const tableName of possibleTableNames) {
      try {
        const { data, error } = await supabaseServer
          .from(tableName)
          .select('count')
          .limit(1)
        
        tableResults[tableName] = {
          exists: !error,
          error: error?.message,
          hasData: !!data
        }
        
        if (!error) {
          // Try to get actual count
          const { count, error: countError } = await supabaseServer
            .from(tableName)
            .select('*', { count: 'exact', head: true })
          
          tableResults[tableName].count = countError ? 'Error getting count' : count
        }
      } catch (err) {
        tableResults[tableName] = {
          exists: false,
          error: err instanceof Error ? err.message : 'Unknown error'
        }
      }
    }
    
    return NextResponse.json({
      success: true,
      tables: tableResults,
      allTables: tables
    })
    
  } catch (err) {
    console.error('Check tables error:', err)
    return NextResponse.json(
      { error: 'Failed to check tables', details: err instanceof Error ? err.message : 'Unknown error' },
      { status: 500 }
    )
  }
} 