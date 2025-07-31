import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

const supabase = createClient(supabaseUrl, supabaseServiceKey)

export async function GET(request: NextRequest) {
  try {
    // Get analytics from the view
    const { data: analyticsData, error: analyticsError } = await supabase
      .from('feedback_analytics')
      .select('*')
      .single()

    if (analyticsError) {
      console.error('Analytics view error:', analyticsError)
      return NextResponse.json(
        { error: 'Failed to retrieve analytics data' },
        { status: 500 }
      )
    }

    // Get popular symptoms and benefits
    const { data: symptomsData, error: symptomsError } = await supabase
      .rpc('get_popular_symptoms_benefits')

    if (symptomsError) {
      console.error('Symptoms function error:', symptomsError)
    }

    // Get popular flavor preferences
    const { data: flavorsData, error: flavorsError } = await supabase
      .rpc('get_popular_flavor_preferences')

    if (flavorsError) {
      console.error('Flavors function error:', flavorsError)
    }

    // Get recent submissions for trends
    const { data: recentSubmissions, error: recentError } = await supabase
      .from('feedback_submissions')
      .select('created_at, overall_satisfaction, would_buy, recommend_to_others')
      .order('created_at', { ascending: false })
      .limit(50)

    if (recentError) {
      console.error('Recent submissions error:', recentError)
    }

    // Calculate NPS (Net Promoter Score)
    const totalResponses = analyticsData.total_submissions || 0
    const promoters = analyticsData.likely_to_recommend || 0
    const detractors = analyticsData.unlikely_to_recommend || 0
    const nps = totalResponses > 0 ? Math.round(((promoters - detractors) / totalResponses) * 100) : 0

    // Calculate purchase intent percentage
    const purchaseIntent = totalResponses > 0 ? Math.round((analyticsData.likely_to_buy / totalResponses) * 100) : 0

    // Calculate average ratings
    const avgOverall = analyticsData.avg_overall_satisfaction || 0
    const avgTaste = analyticsData.avg_taste_rating || 0
    const avgPackaging = analyticsData.avg_packaging_rating || 0
    const avgValue = analyticsData.avg_value_rating || 0

    // Process recent submissions for trends
    const last7Days = recentSubmissions?.filter(sub => {
      const submissionDate = new Date(sub.created_at)
      const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
      return submissionDate >= sevenDaysAgo
    }) || []

    const last30Days = recentSubmissions?.filter(sub => {
      const submissionDate = new Date(sub.created_at)
      const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
      return submissionDate >= thirtyDaysAgo
    }) || []

    // Calculate trend metrics
    const recentAvgSatisfaction = last7Days.length > 0 
      ? last7Days.reduce((sum, sub) => sum + (sub.overall_satisfaction || 0), 0) / last7Days.length 
      : 0

    const recentPurchaseIntent = last7Days.length > 0
      ? (last7Days.filter(sub => sub.would_buy?.includes('Yes')).length / last7Days.length) * 100
      : 0

    const response = {
      success: true,
      data: {
        // Basic metrics
        total_submissions: analyticsData.total_submissions || 0,
        unique_users: analyticsData.unique_users || 0,
        
        // Satisfaction metrics
        average_ratings: {
          overall_satisfaction: Math.round(avgOverall * 10) / 10,
          taste: Math.round(avgTaste * 10) / 10,
          packaging_convenience: Math.round(avgPackaging * 10) / 10,
          value_for_money: Math.round(avgValue * 10) / 10
        },
        
        // Business metrics
        nps_score: nps,
        purchase_intent_percentage: purchaseIntent,
        likely_to_buy: analyticsData.likely_to_buy || 0,
        maybe_to_buy: analyticsData.maybe_to_buy || 0,
        unlikely_to_buy: analyticsData.unlikely_to_buy || 0,
        
        // Recommendation metrics
        likely_to_recommend: analyticsData.likely_to_recommend || 0,
        maybe_recommend: analyticsData.maybe_recommend || 0,
        unlikely_to_recommend: analyticsData.unlikely_to_recommend || 0,
        
        // Pain severity distribution
        pain_severity_distribution: {
          mild: analyticsData.mild_pain_users || 0,
          moderate: analyticsData.moderate_pain_users || 0,
          severe: analyticsData.severe_pain_users || 0,
          very_severe: analyticsData.very_severe_pain_users || 0
        },
        
        // Age distribution
        age_distribution: {
          average_age: Math.round(analyticsData.avg_age || 0),
          under_25: analyticsData.under_25 || 0,
          age_25_34: analyticsData.age_25_34 || 0,
          age_35_44: analyticsData.age_35_44 || 0,
          over_45: analyticsData.over_45 || 0
        },
        
        // Effect metrics
        effect_speed_distribution: {
          very_fast: analyticsData.very_fast_relief || 0,
          fast: analyticsData.fast_relief || 0,
          slow: analyticsData.slow_relief || 0,
          no_relief: analyticsData.no_relief || 0
        },
        
        // Side effects
        side_effects: {
          none: analyticsData.no_side_effects || 0,
          with_side_effects: analyticsData.with_side_effects || 0
        },
        
        // Community engagement
        community_engagement: {
          volunteer_interested: analyticsData.volunteer_interested || 0,
          campaign_interested: analyticsData.campaign_interested || 0,
          testimonial_permitted: analyticsData.testimonial_permitted || 0
        },
        
        // Recent activity
        recent_activity: {
          last_7_days: analyticsData.submissions_last_7_days || 0,
          last_30_days: analyticsData.submissions_last_30_days || 0
        },
        
        // Popular responses
        popular_symptoms_benefits: symptomsData || [],
        popular_flavor_preferences: flavorsData || [],
        
        // Trends
        trends: {
          recent_avg_satisfaction: Math.round(recentAvgSatisfaction * 10) / 10,
          recent_purchase_intent: Math.round(recentPurchaseIntent),
          recent_submissions_count: last7Days.length
        }
      }
    }

    return NextResponse.json(response)

  } catch (error) {
    console.error('Error retrieving analytics:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 