import { NextResponse } from 'next/server'
import { supabaseServer } from '@/supabase/server'

export async function POST(request: Request) {
  try {
    console.log('=== RESETTING DATABASE WITH NEW SCHEMA ===')
    
    // Check environment variables
    const envCheck = {
      hasUrl: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
      hasServiceKey: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
      url: process.env.NEXT_PUBLIC_SUPABASE_URL?.substring(0, 20) + '...'
    }
    
    console.log('Environment check:', envCheck)
    
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
      return NextResponse.json({
        success: false,
        error: 'Missing Supabase environment variables',
        envCheck
      })
    }
    
    // Drop existing table
    const { error: dropError } = await supabaseServer
      .rpc('exec_sql', { sql: 'DROP TABLE IF EXISTS feedback_submissions CASCADE;' })
    
    if (dropError) {
      console.log('Drop table error (this might be expected):', dropError.message)
    }
    
    // Create new table
    const createTableSQL = `
      CREATE TABLE feedback_submissions (
        id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
        
        -- Basic Information
        first_name TEXT NOT NULL,
        last_name TEXT NOT NULL,
        email TEXT NOT NULL,
        age TEXT,
        phone TEXT,
        city TEXT,
        state TEXT,
        
        -- Period Information
        cycle_length TEXT,
        last_period_date TEXT,
        period_regularity TEXT,
        pain_severity TEXT,
        previous_pain_management TEXT,
        
        -- Product Experience
        when_tried TEXT,
        timing_of_use TEXT,
        frequency_of_use TEXT,
        preparation_method TEXT,
        effect_speed TEXT,
        
        -- Ratings (all as integers)
        overall_satisfaction INTEGER DEFAULT 0,
        taste_rating INTEGER DEFAULT 0,
        value_rating INTEGER DEFAULT 0,
        packaging_rating INTEGER DEFAULT 0,
        
        -- Experience Details
        would_drink_again TEXT,
        would_recommend TEXT,
        side_effects TEXT,
        convenience_rating TEXT,
        storage_experience TEXT,
        dosage_followed TEXT,
        
        -- Benefits and Impact (as JSON arrays)
        benefits_experienced JSONB DEFAULT '[]',
        lifestyle_impact JSONB DEFAULT '[]',
        self_care_essentials JSONB DEFAULT '[]',
        
        -- Pricing and Purchase
        budget_range TEXT,
        price_points TEXT,
        purchase_intent TEXT,
        
        -- Community and Engagement
        current_feeling TEXT,
        confidence_boost TEXT,
        face_and_soul_campaign TEXT,
        community_interest TEXT,
        volunteer_interest TEXT,
        testimonial_permission TEXT,
        
        -- Feedback
        improvements TEXT,
        price_feedback TEXT,
        final_thoughts TEXT,
        
        -- Metadata
        submitted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        source TEXT DEFAULT 'website',
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `
    
    const { error: createError } = await supabaseServer
      .rpc('exec_sql', { sql: createTableSQL })
    
    if (createError) {
      console.error('Create table error:', createError)
      return NextResponse.json({
        success: false,
        error: 'Failed to create table',
        details: createError.message
      })
    }
    
    // Enable RLS
    const { error: rlsError } = await supabaseServer
      .rpc('exec_sql', { sql: 'ALTER TABLE feedback_submissions ENABLE ROW LEVEL SECURITY;' })
    
    if (rlsError) {
      console.log('RLS error (might be expected):', rlsError.message)
    }
    
    // Create policy
    const { error: policyError } = await supabaseServer
      .rpc('exec_sql', { sql: 'CREATE POLICY "Allow all operations on feedback_submissions" ON feedback_submissions FOR ALL USING (true);' })
    
    if (policyError) {
      console.log('Policy error (might be expected):', policyError.message)
    }
    
    // Insert test data
    const testData = [
      {
        first_name: 'Sarah',
        last_name: 'Johnson',
        email: 'sarah@example.com',
        age: '28',
        city: 'Mumbai',
        overall_satisfaction: 5,
        taste_rating: 5,
        value_rating: 5,
        packaging_rating: 5,
        benefits_experienced: ['Cramp relief', 'Mood improvement'],
        lifestyle_impact: ['Could work normally', 'Could exercise'],
        testimonial_permission: 'Yes, with my name',
        would_recommend: 'Yes, definitely!',
        final_thoughts: 'Life-changing relief! I\'ve tried everything for my period pain, but nothing worked like Period Calm. Within 20 minutes, my cramps were completely gone.'
      },
      {
        first_name: 'Priya',
        last_name: 'Sharma',
        email: 'priya@example.com',
        age: '25',
        city: 'Delhi',
        overall_satisfaction: 5,
        taste_rating: 4,
        value_rating: 5,
        packaging_rating: 4,
        benefits_experienced: ['Cramp relief', 'Better sleep'],
        lifestyle_impact: ['Could work normally'],
        testimonial_permission: 'Yes, with my name',
        would_recommend: 'Yes, definitely!',
        final_thoughts: 'Amazing product! No more cramps and mood swings. It\'s now a must-have in my monthly routine.'
      }
    ]
    
    const { data: insertData, error: insertError } = await supabaseServer
      .from('feedback_submissions')
      .insert(testData)
      .select()
    
    if (insertError) {
      console.error('Insert test data error:', insertError)
      return NextResponse.json({
        success: false,
        error: 'Failed to insert test data',
        details: insertError.message
      })
    }
    
    console.log('Successfully inserted test data:', insertData?.length || 0, 'records')
    
    return NextResponse.json({
      success: true,
      message: 'Database reset successfully with new schema',
      testDataInserted: insertData?.length || 0
    })
    
  } catch (err) {
    console.error('Reset database error:', err)
    return NextResponse.json({
      success: false,
      error: 'Failed to reset database',
      details: err instanceof Error ? err.message : 'Unknown error'
    })
  }
} 