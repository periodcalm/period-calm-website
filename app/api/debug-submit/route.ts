import { NextResponse } from 'next/server'
import { supabaseServer } from '@/supabase/server'

export async function POST(request: Request) {
  try {
    console.log('=== DEBUG SUBMIT API ===')
    
    // Parse request body
    const body = await request.json()
    console.log('Raw body received:', JSON.stringify(body, null, 2))
    
    // Check environment variables
    const envCheck = {
      hasUrl: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
      hasServiceKey: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
      url: process.env.NEXT_PUBLIC_SUPABASE_URL?.substring(0, 20) + '...'
    }
    
    console.log('Environment check:', envCheck)
    
    // Test if table exists
    const { data: tableCheck, error: tableError } = await supabaseServer
      .from('feedback_submissions')
      .select('count')
      .limit(1)
    
    console.log('Table check:', {
      hasData: !!tableCheck,
      hasError: !!tableError,
      error: tableError?.message
    })
    
    // Try to insert a minimal test record
    const testSubmission = {
      first_name: 'Test',
      last_name: 'User',
      email: 'test@example.com',
      overall_satisfaction: 5,
      benefits_experienced: ['Test benefit'],
      submitted_at: new Date().toISOString(),
      source: 'debug-test'
    }
    
    console.log('Attempting to insert test submission:', testSubmission)
    
    const { data: testData, error: testError } = await supabaseServer
      .from('feedback_submissions')
      .insert([testSubmission])
      .select()
    
    console.log('Test insert result:', {
      hasData: !!testData,
      dataLength: testData?.length || 0,
      hasError: !!testError,
      error: testError?.message,
      errorDetails: testError?.details,
      errorHint: testError?.hint,
      errorCode: testError?.code
    })
    
    return NextResponse.json({
      success: true,
      debug: {
        envCheck,
        tableCheck: {
          success: !tableError,
          error: tableError?.message
        },
        testInsert: {
          success: !testError,
          error: testError?.message,
          details: testError?.details,
          hint: testError?.hint,
          code: testError?.code
        },
        receivedData: {
          fieldCount: Object.keys(body).length,
          fields: Object.keys(body),
          sampleValues: {
            first_name: body.first_name,
            benefits_experienced: body.benefits_experienced,
            overall_satisfaction: body.overall_satisfaction
          }
        }
      }
    })
    
  } catch (err) {
    console.error('Debug API error:', err)
    return NextResponse.json({
      success: false,
      error: 'Debug API failed',
      details: err instanceof Error ? err.message : 'Unknown error'
    })
  }
} 