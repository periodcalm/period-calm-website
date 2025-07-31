import { NextResponse } from 'next/server'
import { supabaseServer } from '@/supabase/server'

export async function POST(request: Request) {
  try {
    console.log('=== SUPABASE FEEDBACK SUBMISSION API ===')
    
    // Parse request body
    const body = await request.json()
    console.log('Received feedback data:', body)
    
    // Validate required fields
    if (!body.first_name || !body.last_name || !body.email) {
      console.error('Missing required fields:', { first_name: !!body.first_name, last_name: !!body.last_name, email: !!body.email })
      return NextResponse.json(
        { error: 'Missing required fields: first_name, last_name, email' },
        { status: 400 }
      )
    }
    
    // Prepare submission data
    const submission = {
      ...body,
      submitted_at: new Date().toISOString(),
      source: 'website'
    }
    
    console.log('Prepared submission:', submission)
    
    // Insert into Supabase
    const { data, error } = await supabaseServer
      .from('feedback_submissions')
      .insert([submission])
      .select()
    
    if (error) {
      console.error('Supabase insert error:', error)
      return NextResponse.json(
        { error: 'Failed to save feedback to database', details: error.message },
        { status: 500 }
      )
    }
    
    console.log('Successfully saved to Supabase:', data)
    
    return NextResponse.json({
      success: true,
      message: 'Feedback submitted successfully!',
      data: data[0],
      totalSubmissions: 1 // We'll get actual count from analytics
    })
    
  } catch (err) {
    console.error('Submit feedback error:', err)
    return NextResponse.json(
      { error: 'Failed to submit feedback', details: err instanceof Error ? err.message : 'Unknown error' },
      { status: 500 }
    )
  }
} 