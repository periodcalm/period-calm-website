import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function GET() {
  try {
    console.log('=== DEBUG FEEDBACK API ===')
    console.log('SUPABASE_URL:', process.env.NEXT_PUBLIC_SUPABASE_URL ? 'Set' : 'Not set')
    console.log('SERVICE_ROLE_KEY:', process.env.SUPABASE_SERVICE_ROLE_KEY ? 'Set' : 'Not set')
    console.log('ANON_KEY:', process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? 'Set' : 'Not set')

    // Test with service role key
    const serviceRoleClient = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    // Test with anon key
    const anonClient = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )

    console.log('Testing service role client...')
    const { data: serviceData, error: serviceError, count: serviceCount } = await serviceRoleClient
      .from('feedback_submissions')
      .select('*', { count: 'exact' })
      .limit(5)

    console.log('Service role result:', { 
      count: serviceCount, 
      error: serviceError?.message,
      dataLength: serviceData?.length 
    })

    console.log('Testing anon client...')
    const { data: anonData, error: anonError, count: anonCount } = await anonClient
      .from('feedback_submissions')
      .select('*', { count: 'exact' })
      .limit(5)

    console.log('Anon client result:', { 
      count: anonCount, 
      error: anonError?.message,
      dataLength: anonData?.length 
    })

    // Check if table exists
    console.log('Checking table structure...')
    const { data: tableInfo, error: tableError } = await serviceRoleClient
      .from('information_schema.tables')
      .select('table_name')
      .eq('table_name', 'feedback_submissions')

    console.log('Table check:', { 
      tableExists: tableInfo?.length > 0, 
      error: tableError?.message 
    })

    return NextResponse.json({
      success: true,
      debug: {
        environment: {
          supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL ? 'Set' : 'Not set',
          serviceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY ? 'Set' : 'Not set',
          anonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? 'Set' : 'Not set'
        },
        serviceRole: {
          count: serviceCount,
          error: serviceError?.message,
          dataLength: serviceData?.length,
          sampleData: serviceData?.[0] ? 'Has data' : 'No data'
        },
        anonClient: {
          count: anonCount,
          error: anonError?.message,
          dataLength: anonData?.length,
          sampleData: anonData?.[0] ? 'Has data' : 'No data'
        },
        table: {
          exists: tableInfo?.length > 0,
          error: tableError?.message
        }
      }
    })

  } catch (err) {
    console.error('Debug API error:', err)
    return NextResponse.json(
      { error: 'Debug API error', details: err instanceof Error ? err.message : 'Unknown error' },
      { status: 500 }
    )
  }
} 