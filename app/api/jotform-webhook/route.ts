import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

// Initialize Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    console.log('Jotform webhook received:', JSON.stringify(body, null, 2))

    // Extract form data from Jotform submission
    const formData = body.formData || {}
    
    // Map Jotform fields to your database structure
    const feedbackData = {
      // Basic info
      first_name: formData['1'] || '',
      last_name: formData['2'] || '',
      age: formData['3'] || '',
      email: formData['4'] || '',
      phone: formData['5'] || '',
      
      // Location
      city: formData['6'] || '',
      state: formData['7'] || '',
      
      // Social media
      instagram: formData['8'] || '',
      
      // Period info
      cycle_length: formData['9'] || '',
      last_period_date: formData['10'] || '',
      
      // Product experience
      when_drank: formData['11'] || '',
      effect_within_30min: formData['12'] || '',
      rating: parseInt(formData['13']) || 0,
      would_drink_again: formData['14'] || '',
      
      // Benefits (multi-select)
      benefits: Array.isArray(formData['15']) ? formData['15'] : [formData['15']].filter(Boolean),
      
      // Current state
      current_feeling: formData['16'] || '',
      self_care_essentials: Array.isArray(formData['17']) ? formData['17'] : [formData['17']].filter(Boolean),
      
      // Recommendations
      would_recommend: formData['18'] || '',
      face_and_soul_campaign: formData['19'] || '',
      fair_price: formData['20'] || '',
      
      // Final thoughts
      final_thoughts: formData['21'] || '',
      
      // Metadata
      jotform_submission_id: body.submissionID || '',
      submitted_at: new Date().toISOString(),
      source: 'jotform_webhook'
    }

    // Insert into your database
    const { data, error } = await supabase
      .from('feedback_submissions')
      .insert([feedbackData])

    if (error) {
      console.error('Database error:', error)
      return NextResponse.json(
        { error: 'Failed to save feedback data' },
        { status: 500 }
      )
    }

    console.log('Feedback saved successfully:', data)

    // Return success response
    return NextResponse.json(
      { 
        success: true, 
        message: 'Feedback received and saved',
        submission_id: body.submissionID 
      },
      { status: 200 }
    )

  } catch (error) {
    console.error('Webhook processing error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// Handle GET requests (for testing)
export async function GET() {
  return NextResponse.json(
    { message: 'Jotform webhook endpoint is active' },
    { status: 200 }
  )
} 