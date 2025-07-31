import { NextResponse } from 'next/server'
import { Redis } from '@upstash/redis'

// Initialize Redis client (with fallback)
let redis: Redis | null = null
try {
  if (process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN) {
    redis = new Redis({
      url: process.env.UPSTASH_REDIS_REST_URL,
      token: process.env.UPSTASH_REDIS_REST_TOKEN,
    })
    console.log('✅ Redis client initialized successfully')
  } else {
    console.log('⚠️ Redis environment variables not found, using fallback storage')
  }
} catch (error) {
  console.log('⚠️ Failed to initialize Redis, using fallback storage:', error)
}

// Fallback in-memory storage (temporary until Redis is set up)
let fallbackSubmissions: any[] = []

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
    
    // Get existing submissions
    let submissions: any[] = []
    
    if (redis) {
      // Try Redis first
      try {
        const existingData = await redis.get('feedback-submissions')
        if (existingData) {
          submissions = existingData as any[]
          console.log('Loaded', submissions.length, 'existing submissions from Redis')
        } else {
          console.log('No existing data in Redis, starting fresh')
        }
      } catch (redisReadError) {
        console.error('Error reading from Redis:', redisReadError)
        console.log('Falling back to in-memory storage')
        submissions = [...fallbackSubmissions]
      }
    } else {
      // Use fallback storage
      submissions = [...fallbackSubmissions]
      console.log('Using fallback storage, current submissions:', submissions.length)
    }
    
    // Add new submission
    submissions.push(submission)
    console.log('Added submission to array. Total submissions:', submissions.length)
    
    // Save data
    if (redis) {
      try {
        console.log('Saving data to Redis...')
        await redis.set('feedback-submissions', submissions)
        console.log('Successfully saved data to Redis')
        
        // Also update fallback for consistency
        fallbackSubmissions = [...submissions]
      } catch (redisWriteError) {
        console.error('Error writing to Redis:', redisWriteError)
        console.log('Falling back to in-memory storage')
        fallbackSubmissions = [...submissions]
      }
    } else {
      // Use fallback storage
      fallbackSubmissions = [...submissions]
      console.log('Saved to fallback storage')
    }
    
    return NextResponse.json({
      success: true,
      message: 'Feedback submitted successfully!',
      data: submission,
      totalSubmissions: submissions.length,
      storage: redis ? 'redis' : 'fallback'
    })
    
  } catch (err) {
    console.error('Submit feedback error:', err)
    return NextResponse.json(
      { error: 'Failed to submit feedback', details: err instanceof Error ? err.message : 'Unknown error' },
      { status: 500 }
    )
  }
} 