import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

const supabase = createClient(supabaseUrl, supabaseServiceKey)

export async function POST(request: NextRequest) {
  try {
    // Check if Supabase is configured
    if (!supabaseUrl || !supabaseServiceKey) {
      console.error('❌ Supabase not configured')
      return NextResponse.json(
        { error: 'Database not configured' },
        { status: 503 }
      )
    }

    const body = await request.json()
    
    // Validate required fields
    if (!body.first_name || !body.last_name || !body.email) {
      return NextResponse.json(
        { error: 'Missing required fields: first_name, last_name, email' },
        { status: 400 }
      )
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(body.email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      )
    }

    // Validate rating fields (1-5 range)
    const ratingFields = ['overall_satisfaction', 'taste_rating', 'packaging_convenience_rating', 'value_for_money_rating']
    for (const field of ratingFields) {
      if (body[field] !== undefined && (body[field] < 1 || body[field] > 5)) {
        return NextResponse.json(
          { error: `${field} must be between 1 and 5` },
          { status: 400 }
        )
      }
    }

    // Process and validate data
    const feedbackData = {
      // Personal Information
      first_name: body.first_name?.trim() || '',
      last_name: body.last_name?.trim() || '',
      email: body.email?.trim().toLowerCase() || '',
      phone: body.phone?.trim() || null,
      age: body.age ? parseInt(body.age) : null,
      city: body.city?.trim() || null,
      state: body.state?.trim() || null,
      instagram: body.social_media_handle?.trim() || null,
      
      // Period Details
      cycle_length: body.cycle_regularity || null,
      period_regularity: body.cycle_regularity || null,
      pain_severity: body.pain_severity || null,
      previous_pain_management: body.what_used_before || null,
      
      // Product Experience
      when_tried: body.when_tried_and_timing || null,
      timing_of_use: body.when_tried_and_timing || null,
      frequency_of_use: body.frequency_of_use || null,
      preparation_method: body.preparation_method || null,
      effect_speed: body.effect_speed || null,
      overall_satisfaction: body.overall_satisfaction ? parseInt(body.overall_satisfaction) : null,
      taste_rating: body.taste_rating ? parseInt(body.taste_rating) : null,
      packaging_rating: body.packaging_convenience_rating ? parseInt(body.packaging_convenience_rating) : null,
      convenience_rating: body.packaging_convenience_rating ? parseInt(body.packaging_convenience_rating) : null,
      value_rating: body.value_for_money_rating ? parseInt(body.value_for_money_rating) : null,
      
      // Symptoms and Benefits (ensure it's a valid JSON array)
      benefits_experienced: Array.isArray(body.symptoms_and_benefits) ? body.symptoms_and_benefits : [],
      side_effects: body.side_effects || null,
      
      // Business Insights
      price_feedback: body.price_opinion || null,
      purchase_intent: body.would_buy || null,
      would_recommend: body.recommend_to_others || null,
      volunteer_interest: body.volunteer_interest || null,
      face_and_soul_campaign: body.campaign_face_interest || null,
      testimonial_permission: body.testimonial_permission || null,
      
      // Emotional & Lifestyle Impact
      current_feeling: body.current_mood || null,
      confidence_boost: body.confidence_boost || null,
      lifestyle_impact: Array.isArray(body.lifestyle_impact) ? body.lifestyle_impact : [],
      self_care_essentials: Array.isArray(body.self_care_essentials) ? body.self_care_essentials : [],
      
      // Additional Feedback
      improvements: body.improvements?.trim() || null,
      final_thoughts: body.final_thoughts?.trim() || null,
      
      // Metadata
      source: 'website',
      submitted_at: new Date().toISOString()
    }

    // Insert data into Supabase
    const { data, error } = await supabase
      .from('feedback_submissions')
      .insert([feedbackData])
      .select()

    if (error) {
      console.error('Supabase insert error:', error)
      return NextResponse.json(
        { error: 'Failed to save feedback data' },
        { status: 500 }
      )
    }

    // Log successful submission
    console.log('Feedback submitted successfully:', {
      id: data[0].id,
      email: feedbackData.email,
      overall_satisfaction: feedbackData.overall_satisfaction,
      purchase_intent: feedbackData.purchase_intent,
      would_recommend: feedbackData.would_recommend
    })

    return NextResponse.json({
      success: true,
      message: 'Feedback submitted successfully',
      data: {
        id: data[0].id,
        created_at: data[0].created_at
      }
    })

  } catch (error) {
    console.error('Error processing feedback submission:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// GET method to retrieve feedback data (for analytics)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get('limit') || '100')
    const offset = parseInt(searchParams.get('offset') || '0')
    
    // In development mode without database, return stored data
    if (process.env.NODE_ENV === 'development' && (!supabaseUrl || !supabaseServiceKey)) {
      console.log('🧪 Development mode: Returning stored feedback data')
      // The original dev-data-store file was removed, so this part will now return an empty array or throw an error
      // For now, returning an empty array as a placeholder.
      return NextResponse.json({
        success: true,
        data: [],
        pagination: {
          limit,
          offset,
          count: 0,
          total: 0
        }
      })
    }
    
    // Get feedback submissions with pagination from Supabase
    const { data, error } = await supabase
      .from('feedback_submissions')
      .select('*')
      .order('created_at', { ascending: false })
      // Remove pagination to get all records like analytics API
      // .range(offset, offset + limit - 1)

    if (error) {
      console.error('Supabase select error:', error)
      return NextResponse.json(
        { error: 'Failed to retrieve feedback data' },
        { status: 500 }
      )
    }

    // Debug logging
    console.log('📋 Submit-feedback GET Debug:', {
      dataCount: data?.length || 0,
      emails: data?.map(f => f.email) || [],
      ids: data?.map(f => f.id) || [],
      createdAts: data?.map(f => f.created_at) || [],
      timestamp: new Date().toISOString()
    })

    const response = NextResponse.json({
      success: true,
      data: data,
      pagination: {
        limit,
        offset,
        count: data.length
      }
    })

    // Add cache headers to prevent caching
    response.headers.set('Cache-Control', 'no-cache, no-store, must-revalidate')
    response.headers.set('Pragma', 'no-cache')
    response.headers.set('Expires', '0')
    
    return response

  } catch (error) {
    console.error('Error retrieving feedback data:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 