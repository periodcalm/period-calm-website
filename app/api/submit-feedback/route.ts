import { NextResponse } from 'next/server'

// In-memory storage for serverless environment
let submissions: any[] = []

// Try to load existing data from file (read-only)
try {
  const fs = require('fs')
  const path = require('path')
  const DATA_FILE = path.join(process.cwd(), 'data', 'feedback-submissions.json')
  
  if (fs.existsSync(DATA_FILE)) {
    const fileContent = fs.readFileSync(DATA_FILE, 'utf-8')
    submissions = JSON.parse(fileContent)
    console.log('Loaded', submissions.length, 'existing submissions from file')
  }
} catch (error) {
  console.log('Could not load existing data, starting fresh:', error)
  submissions = []
}

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
    
    // Use in-memory submissions array (already loaded at module level)
    console.log('Current submissions in memory:', submissions.length)
    
    // Add new submission to in-memory array
    submissions.push(submission)
    console.log('Added submission to memory. Total submissions:', submissions.length)
    
    // Note: In serverless environment, data persists only during function execution
    // For production, consider using a database like Supabase, MongoDB, or Vercel KV
    
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