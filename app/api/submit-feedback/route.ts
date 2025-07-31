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
    if (!existsSync(dataDir)) {
      await mkdir(dataDir, { recursive: true })
    }
    
    // Read existing submissions
    let submissions = []
    if (existsSync(DATA_FILE)) {
      try {
        const fileContent = await readFile(DATA_FILE, 'utf-8')
        submissions = JSON.parse(fileContent)
      } catch (error) {
        console.log('No existing data or invalid JSON, starting fresh')
        submissions = []
      }
    }
    
    // Add new submission
    submissions.push(submission)
    
    // Write back to file
    await writeFile(DATA_FILE, JSON.stringify(submissions, null, 2))
    
    console.log('Successfully saved submission. Total submissions:', submissions.length)
    
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