import { NextResponse } from 'next/server'
import { writeFile, readFile, mkdir } from 'fs/promises'
import { existsSync } from 'fs'
import path from 'path'

// Simple JSON file storage
const DATA_FILE = path.join(process.cwd(), 'data', 'feedback-submissions.json')

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
    
    // Ensure data directory exists
    const dataDir = path.dirname(DATA_FILE)
    console.log('Data directory path:', dataDir)
    console.log('Data file path:', DATA_FILE)
    
    try {
      if (!existsSync(dataDir)) {
        console.log('Creating data directory...')
        await mkdir(dataDir, { recursive: true })
        console.log('Data directory created successfully')
      }
    } catch (dirError) {
      console.error('Error creating data directory:', dirError)
      // Continue anyway, might be a permission issue
    }
    
    // Read existing submissions
    let submissions = []
    try {
      if (existsSync(DATA_FILE)) {
        console.log('Reading existing data file...')
        const fileContent = await readFile(DATA_FILE, 'utf-8')
        submissions = JSON.parse(fileContent)
        console.log('Successfully read', submissions.length, 'existing submissions')
      } else {
        console.log('No existing data file found, starting fresh')
      }
    } catch (readError) {
      console.error('Error reading existing data:', readError)
      console.log('Starting with empty submissions array')
      submissions = []
    }
    
    // Add new submission
    submissions.push(submission)
    console.log('Added submission to array. Total submissions:', submissions.length)
    
    // Write back to file - this is crucial for persistence
    try {
      console.log('Writing data to file...')
      await writeFile(DATA_FILE, JSON.stringify(submissions, null, 2))
      console.log('Successfully wrote data to file')
    } catch (writeError) {
      console.error('Error writing to file:', writeError)
      // This is critical - if we can't write, the data won't persist
      return NextResponse.json(
        { error: 'Failed to save data - serverless environment limitation' },
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