import { NextResponse } from 'next/server'
import { kv } from '@vercel/kv'

export async function POST(request: Request) {
  try {
    console.log('=== SIMPLE FEEDBACK SUBMISSION API ===')
    
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
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      ...body,
      submitted_at: new Date().toISOString(),
      source: 'website'
    }
    
    console.log('Prepared submission:', submission)
    
    // Get existing submissions from KV
    let submissions: any[] = []
    try {
      const existingData = await kv.get('feedback-submissions')
      if (existingData) {
        submissions = existingData as any[]
        console.log('Loaded', submissions.length, 'existing submissions from KV')
      } else {
        console.log('No existing data in KV, starting fresh')
      }
    } catch (kvReadError) {
      console.error('Error reading from KV:', kvReadError)
      console.log('Starting with empty submissions array')
      submissions = []
    }
    
    // Add new submission
    submissions.push(submission)
    console.log('Added submission to array. Total submissions:', submissions.length)
    
    // Save to KV storage
    try {
      console.log('Saving data to KV...')
      await kv.set('feedback-submissions', submissions)
      console.log('Successfully saved data to KV')
    } catch (kvWriteError) {
      console.error('Error writing to KV:', kvWriteError)
      return NextResponse.json(
        { error: 'Failed to save data - KV storage error' },
        { status: 500 }
      )
    }
    
    return NextResponse.json({
      success: true,
      message: 'Feedback submitted successfully!',
      data: submission,
      totalSubmissions: submissions.length
    })
    
  } catch (err) {
    console.error('Submit feedback error:', err)
    return NextResponse.json(
      { error: 'Failed to submit feedback', details: err instanceof Error ? err.message : 'Unknown error' },
      { status: 500 }
    )
  }
} 