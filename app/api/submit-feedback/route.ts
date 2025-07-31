import { NextResponse } from 'next/server'
import { supabaseServer } from '@/supabase/server'

export async function POST(request: Request) {
  try {
    console.log('=== SUPABASE FEEDBACK SUBMISSION API ===')
    console.log('Environment check:', {
      hasUrl: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
      hasServiceKey: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
      url: process.env.NEXT_PUBLIC_SUPABASE_URL?.substring(0, 20) + '...'
    })
    
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
    
    // Prepare submission data for the new clean schema
    const submission = {
      // Basic Information
      first_name: String(body.first_name || ''),
      last_name: String(body.last_name || ''),
      email: String(body.email || ''),
      age: String(body.age || ''),
      phone: String(body.phone || ''),
      city: String(body.city || ''),
      state: String(body.state || ''),
      
      // Period Information
      cycle_length: String(body.cycle_length || ''),
      last_period_date: String(body.last_period_date || ''),
      period_regularity: String(body.period_regularity || ''),
      pain_severity: String(body.pain_severity || ''),
      previous_pain_management: String(body.previous_pain_management || ''),
      
      // Product Experience
      when_tried: String(body.when_tried || ''),
      timing_of_use: String(body.timing_of_use || ''),
      frequency_of_use: String(body.frequency_of_use || ''),
      preparation_method: String(body.preparation_method || ''),
      effect_speed: String(body.effect_speed || ''),
      
      // Ratings (ensure they are integers)
      overall_satisfaction: Number(body.overall_satisfaction) || 0,
      taste_rating: Number(body.taste_rating) || 0,
      value_rating: Number(body.value_rating) || 0,
      packaging_rating: Number(body.packaging_rating) || 0,
      
      // Experience Details
      would_drink_again: String(body.would_drink_again || ''),
      would_recommend: String(body.would_recommend || ''),
      side_effects: String(body.side_effects || ''),
      convenience_rating: String(body.convenience_rating || ''),
      storage_experience: String(body.storage_experience || ''),
      dosage_followed: String(body.dosage_followed || ''),
      
      // Benefits and Impact (as JSON arrays)
      benefits_experienced: Array.isArray(body.benefits_experienced) ? body.benefits_experienced : [],
      lifestyle_impact: Array.isArray(body.lifestyle_impact) ? body.lifestyle_impact : [],
      self_care_essentials: Array.isArray(body.self_care_essentials) ? body.self_care_essentials : [],
      
      // Pricing and Purchase
      budget_range: String(body.budget_range || ''),
      price_points: String(body.price_points || ''),
      purchase_intent: String(body.purchase_intent || ''),
      
      // Community and Engagement
      current_feeling: String(body.current_feeling || ''),
      confidence_boost: String(body.confidence_boost || ''),
      face_and_soul_campaign: String(body.face_and_soul_campaign || ''),
      community_interest: String(body.community_interest || ''),
      volunteer_interest: String(body.volunteer_interest || ''),
      testimonial_permission: String(body.testimonial_permission || ''),
      
      // Feedback
      improvements: String(body.improvements || ''),
      price_feedback: String(body.price_feedback || ''),
      final_thoughts: String(body.final_thoughts || ''),
      
      // Metadata
      submitted_at: new Date().toISOString(),
      source: 'website'
    }
    
    console.log('Prepared submission for new schema:', {
      first_name: submission.first_name,
      email: submission.email,
      benefits_experienced: submission.benefits_experienced,
      benefits_type: typeof submission.benefits_experienced,
      is_array: Array.isArray(submission.benefits_experienced),
      overall_satisfaction: submission.overall_satisfaction,
      satisfaction_type: typeof submission.overall_satisfaction,
      taste_rating: submission.taste_rating,
      value_rating: submission.value_rating,
      packaging_rating: submission.packaging_rating
    })
    
    // Log all numeric fields to verify they are numbers
    const numericFields = {
      overall_satisfaction: submission.overall_satisfaction,
      taste_rating: submission.taste_rating,
      value_rating: submission.value_rating,
      packaging_rating: submission.packaging_rating
    }
    
    console.log('Numeric fields check:', numericFields)
    
    // Verify all numeric fields are actually numbers
    Object.entries(numericFields).forEach(([field, value]) => {
      if (typeof value !== 'number') {
        console.error(`⚠️ Non-number found in numeric field: ${field} = ${value} (${typeof value})`)
      }
    })
    
    // Insert into Supabase
    const { data, error } = await supabaseServer
      .from('feedback_submissions')
      .insert([submission])
      .select()
    
    console.log('Supabase insert result:', {
      hasData: !!data,
      dataLength: data?.length || 0,
      hasError: !!error,
      error: error?.message,
      errorDetails: error?.details,
      errorHint: error?.hint,
      errorCode: error?.code
    })
    
    if (error) {
      console.error('Supabase insert error details:', {
        message: error.message,
        details: error.details,
        hint: error.hint,
        code: error.code
      })
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