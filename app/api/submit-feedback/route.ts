import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

const supabase = createClient(supabaseUrl, supabaseServiceKey)

export async function POST(request: NextRequest) {
  try {
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
      profession: body.profession?.trim() || null,
      
      // Period Details
      cycle_regularity: body.cycle_regularity || null,
      pain_severity: body.pain_severity || null,
      what_used_before: body.what_used_before || null,
      comparison_with_other_products: body.comparison_with_other_products || null,
      
      // Product Experience
      when_tried_and_timing: body.when_tried_and_timing || null,
      frequency_of_use: body.frequency_of_use || null,
      preparation_method: body.preparation_method || null,
      effect_speed: body.effect_speed || null,
      effect_duration: body.effect_duration || null,
      overall_satisfaction: body.overall_satisfaction ? parseInt(body.overall_satisfaction) : null,
      taste_rating: body.taste_rating ? parseInt(body.taste_rating) : null,
      packaging_convenience_rating: body.packaging_convenience_rating ? parseInt(body.packaging_convenience_rating) : null,
      value_for_money_rating: body.value_for_money_rating ? parseInt(body.value_for_money_rating) : null,
      
      // Symptoms and Benefits (ensure it's a valid JSON array)
      symptoms_and_benefits: Array.isArray(body.symptoms_and_benefits) ? body.symptoms_and_benefits : [],
      side_effects: body.side_effects || null,
      flavor_preferences: Array.isArray(body.flavor_preferences) ? body.flavor_preferences : [],
      
      // Business Insights
      price_opinion: body.price_opinion || null,
      would_buy: body.would_buy || null,
      recommend_to_others: body.recommend_to_others || null,
      social_media_handle: body.social_media_handle?.trim() || null,
      volunteer_interest: body.volunteer_interest || null,
      campaign_face_interest: body.campaign_face_interest || null,
      testimonial_permission: body.testimonial_permission || null,
      
      // Emotional & Lifestyle Impact
      current_mood: body.current_mood || null,
      happiness_factors: Array.isArray(body.happiness_factors) ? body.happiness_factors : [],
      confidence_boost: body.confidence_boost || null,
      lifestyle_impact: Array.isArray(body.lifestyle_impact) ? body.lifestyle_impact : [],
      self_care_essentials: Array.isArray(body.self_care_essentials) ? body.self_care_essentials : [],
      
      // Additional Feedback
      improvements: body.improvements?.trim() || null,
      final_thoughts: body.final_thoughts?.trim() || null,
      
      // Metadata
      submission_source: 'website',
      user_agent: request.headers.get('user-agent') || null,
      ip_address: request.headers.get('x-forwarded-for') || request.ip || null
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
      would_buy: feedbackData.would_buy,
      recommend_to_others: feedbackData.recommend_to_others
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
    
    // Get feedback submissions with pagination
    const { data, error } = await supabase
      .from('feedback_submissions')
      .select('*')
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1)

    if (error) {
      console.error('Supabase select error:', error)
      return NextResponse.json(
        { error: 'Failed to retrieve feedback data' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      data: data,
      pagination: {
        limit,
        offset,
        count: data.length
      }
    })

  } catch (error) {
    console.error('Error retrieving feedback data:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 