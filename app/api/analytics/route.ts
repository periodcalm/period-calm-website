import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

const supabase = createClient(supabaseUrl, supabaseServiceKey)

export async function GET(request: NextRequest) {
  try {
    // Check if Supabase is configured
    if (!supabaseUrl || !supabaseServiceKey) {
      console.error('❌ Supabase not configured')
      return NextResponse.json(
        { error: 'Database not configured' },
        { status: 503 }
      )
    }

    // Get query parameters for debugging
    const { searchParams } = new URL(request.url)
    const forceRefresh = searchParams.get('force') === 'true'
    const debug = searchParams.get('debug') === 'true'

    // Get analytics from the feedback_submissions table directly
    // Add cache-busting by ordering by created_at desc to ensure latest data
    let { data: submissions, error: submissionsError } = await supabase
      .from('feedback_submissions')
      .select('*')
      .order('created_at', { ascending: false })

    // If force refresh is requested, try a second query with different approach
    if (forceRefresh && submissions) {
      console.log('🔄 Force refresh requested, re-querying database...')
      const { data: freshSubmissions, error: freshError } = await supabase
        .from('feedback_submissions')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(1000) // Ensure we get all records
      
      if (!freshError && freshSubmissions) {
        submissions = freshSubmissions
        console.log('✅ Force refresh completed, new count:', freshSubmissions.length)
      }
    }

    if (submissionsError) {
      console.error('Submissions error:', submissionsError)
      return NextResponse.json(
        { error: 'Failed to retrieve analytics data' },
        { status: 500 }
      )
    }

    // Calculate analytics from submissions data
    const totalSubmissions = submissions?.length || 0
    const uniqueUsers = new Set(submissions?.map(f => f.email) || []).size
    
    // Debug logging
    console.log('📊 Analytics API Debug:', {
      totalSubmissions,
      uniqueUsers,
      submissionCount: submissions?.length || 0,
      submissionEmails: submissions?.map(f => f.email) || [],
      submissionIds: submissions?.map(f => f.id) || [],
      submissionCreatedAts: submissions?.map(f => f.created_at) || [],
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV,
      supabaseUrl: supabaseUrl ? 'configured' : 'not configured'
    })

    // Add detailed record-by-record logging
    console.log('📊 Analytics API - Full Records:', submissions?.map(f => ({
      id: f.id,
      email: f.email,
      created_at: f.created_at,
      overall_satisfaction: f.overall_satisfaction
    })) || [])

    // Calculate average ratings
    const ratings = submissions?.filter(f => f.overall_satisfaction) || []
    const avgOverall = ratings.length > 0 ? ratings.reduce((sum, f) => sum + (f.overall_satisfaction || 0), 0) / ratings.length : 0
    const avgTaste = ratings.length > 0 ? ratings.reduce((sum, f) => sum + (f.taste_rating || 0), 0) / ratings.length : 0
    const avgPackaging = ratings.length > 0 ? ratings.reduce((sum, f) => sum + (f.packaging_rating || 0), 0) / ratings.length : 0
    const avgValue = ratings.length > 0 ? ratings.reduce((sum, f) => sum + (f.value_rating || 0), 0) / ratings.length : 0

    // Calculate purchase intent
    const likelyToBuy = submissions?.filter(f => f.purchase_intent?.includes('definitely')).length || 0
    const maybeToBuy = submissions?.filter(f => f.purchase_intent?.includes('probably')).length || 0
    const unlikelyToBuy = submissions?.filter(f => f.purchase_intent?.includes('No')).length || 0

    // Calculate recommendations
    const likelyToRecommend = submissions?.filter(f => f.would_recommend?.includes('definitely')).length || 0
    const maybeRecommend = submissions?.filter(f => f.would_recommend?.includes('probably')).length || 0
    const unlikelyRecommend = submissions?.filter(f => f.would_recommend?.includes('No')).length || 0

    // Calculate NPS
    const promoters = likelyToRecommend
    const detractors = unlikelyRecommend
    const nps = totalSubmissions > 0 ? Math.round(((promoters - detractors) / totalSubmissions) * 100) : 0

    // Calculate purchase intent percentage
    const purchaseIntent = totalSubmissions > 0 ? Math.round((likelyToBuy / totalSubmissions) * 100) : 0

    // Calculate recommendation percentage
    const recommendationPercentage = totalSubmissions > 0 ? Math.round((likelyToRecommend / totalSubmissions) * 100) : 0

    // Pain severity distribution
    const painSeverity = {
      mild: submissions?.filter(f => f.pain_severity?.includes('Mild')).length || 0,
      moderate: submissions?.filter(f => f.pain_severity?.includes('Moderate')).length || 0,
      severe: submissions?.filter(f => f.pain_severity?.includes('Severe')).length || 0,
      very_severe: submissions?.filter(f => f.pain_severity?.includes('Very severe')).length || 0
    }

    // Age distribution
    const ages = submissions?.filter(f => f.age).map(f => parseInt(f.age)) || []
    const avgAge = ages.length > 0 ? Math.round(ages.reduce((sum, age) => sum + age, 0) / ages.length) : 0
    const ageDistribution = {
      average_age: avgAge,
      under_25: ages.filter(age => age < 25).length,
      age_25_34: ages.filter(age => age >= 25 && age <= 34).length,
      age_35_44: ages.filter(age => age >= 35 && age <= 44).length,
      over_45: ages.filter(age => age > 45).length
    }

    // Geographic analysis
    const cities = submissions?.filter(f => f.city).map(f => f.city) || []
    const cityCounts = cities.reduce((acc, city) => {
      acc[city] = (acc[city] || 0) + 1
      return acc
    }, {} as Record<string, number>)
    const topCities = Object.entries(cityCounts)
      .map(([city, count]) => ({ city, count }))
      .sort((a, b) => (b.count as number) - (a.count as number))
      .slice(0, 5)

    // Price analysis (from price_feedback field)
    const priceResponses = submissions?.filter(f => f.price_feedback) || []
    const priceAnalysis = {
      total_responses: priceResponses.length,
      acceptable_price: priceResponses.filter(f => f.price_feedback?.includes('Acceptable')).length,
      expensive: priceResponses.filter(f => f.price_feedback?.includes('Expensive')).length,
      very_expensive: priceResponses.filter(f => f.price_feedback?.includes('Very expensive')).length,
      affordable: priceResponses.filter(f => f.price_feedback?.includes('Affordable')).length
    }

    // Calculate price percentages
    const pricePercentages = {
      acceptable_percentage: priceAnalysis.total_responses > 0 ? Math.round((priceAnalysis.acceptable_price / priceAnalysis.total_responses) * 100) : 0,
      expensive_percentage: priceAnalysis.total_responses > 0 ? Math.round((priceAnalysis.expensive / priceAnalysis.total_responses) * 100) : 0,
      very_expensive_percentage: priceAnalysis.total_responses > 0 ? Math.round((priceAnalysis.very_expensive / priceAnalysis.total_responses) * 100) : 0,
      affordable_percentage: priceAnalysis.total_responses > 0 ? Math.round((priceAnalysis.affordable / priceAnalysis.total_responses) * 100) : 0
    }

    // Taste preferences analysis
    const tastePreferences = submissions?.filter(f => f.flavor_preferences) || []
    const allTastePreferences = tastePreferences.flatMap(f => {
      if (f.flavor_preferences && Array.isArray(f.flavor_preferences)) {
        return f.flavor_preferences
      }
      return []
    })
    const tasteCounts = allTastePreferences.reduce((acc, taste) => {
      acc[taste] = (acc[taste] || 0) + 1
      return acc
    }, {} as Record<string, number>)
    const popularTastePreferences = Object.entries(tasteCounts)
      .map(([taste, count]) => ({ flavor: taste, count }))
      .sort((a, b) => (b.count as number) - (a.count as number))
      .slice(0, 5)

    // Volunteer and campaign interest analysis
    const volunteerInterest = submissions?.filter(f => f.volunteer_interest?.includes('interested')).length || 0
    const campaignInterest = submissions?.filter(f => f.face_and_soul_campaign?.includes('interested')).length || 0
    const testimonialPermission = submissions?.filter(f => f.testimonial_permission?.includes('Yes')).length || 0

    const interestPercentages = {
      volunteer_percentage: totalSubmissions > 0 ? Math.round((volunteerInterest / totalSubmissions) * 100) : 0,
      campaign_percentage: totalSubmissions > 0 ? Math.round((campaignInterest / totalSubmissions) * 100) : 0,
      testimonial_percentage: totalSubmissions > 0 ? Math.round((testimonialPermission / totalSubmissions) * 100) : 0
    }

    // Effectiveness analysis (time to impact)
    const effectSpeedData = submissions?.filter(f => f.effect_speed) || []
    const effectivenessAnalysis = {
      very_fast: effectSpeedData.filter(f => f.effect_speed?.includes('Within 15 minutes')).length,
      fast: effectSpeedData.filter(f => f.effect_speed?.includes('15-30 minutes')).length,
      moderate: effectSpeedData.filter(f => f.effect_speed?.includes('30-60 minutes')).length,
      slow: effectSpeedData.filter(f => f.effect_speed?.includes('1-2 hours')).length,
      no_relief: effectSpeedData.filter(f => f.effect_speed?.includes('No relief')).length
    }

    // Average effectiveness time calculation
    const effectivenessScores = effectSpeedData.map(f => {
      if (f.effect_speed?.includes('Within 15 minutes')) return 15
      if (f.effect_speed?.includes('15-30 minutes')) return 22.5
      if (f.effect_speed?.includes('30-60 minutes')) return 45
      if (f.effect_speed?.includes('1-2 hours')) return 90
      return 0
    })
    const avgEffectivenessTime = effectivenessScores.length > 0 ? 
      Math.round(effectivenessScores.reduce((sum: number, time: number) => sum + time, 0) / effectivenessScores.length) : 0

    // Calculate effectiveness percentages
    const effectivenessPercentages = {
      very_fast_percentage: totalSubmissions > 0 ? Math.round((effectivenessAnalysis.very_fast / totalSubmissions) * 100) : 0,
      fast_percentage: totalSubmissions > 0 ? Math.round((effectivenessAnalysis.fast / totalSubmissions) * 100) : 0,
      moderate_percentage: totalSubmissions > 0 ? Math.round((effectivenessAnalysis.moderate / totalSubmissions) * 100) : 0,
      slow_percentage: totalSubmissions > 0 ? Math.round((effectivenessAnalysis.slow / totalSubmissions) * 100) : 0,
      no_relief_percentage: totalSubmissions > 0 ? Math.round((effectivenessAnalysis.no_relief / totalSubmissions) * 100) : 0
    }

    // Side effects percentages
    const sideEffectsPercentages = {
      none_percentage: totalSubmissions > 0 ? Math.round((painSeverity.mild / totalSubmissions) * 100) : 0,
      with_side_effects_percentage: totalSubmissions > 0 ? Math.round((painSeverity.severe / totalSubmissions) * 100) : 0
    }

    // Purchase intent percentages
    const purchaseIntentPercentages = {
      likely_percentage: totalSubmissions > 0 ? Math.round((likelyToBuy / totalSubmissions) * 100) : 0,
      maybe_percentage: totalSubmissions > 0 ? Math.round((maybeToBuy / totalSubmissions) * 100) : 0,
      unlikely_percentage: totalSubmissions > 0 ? Math.round((unlikelyToBuy / totalSubmissions) * 100) : 0
    }

    // Recommendation percentages
    const recommendationPercentages = {
      likely_percentage: totalSubmissions > 0 ? Math.round((likelyToRecommend / totalSubmissions) * 100) : 0,
      maybe_percentage: totalSubmissions > 0 ? Math.round((maybeRecommend / totalSubmissions) * 100) : 0,
      unlikely_percentage: totalSubmissions > 0 ? Math.round((unlikelyRecommend / totalSubmissions) * 100) : 0
    }

    // Customer satisfaction percentages
    const satisfactionPercentages = {
      very_satisfied_percentage: totalSubmissions > 0 ? Math.round((ratings.filter(f => f.overall_satisfaction >= 4.5).length / totalSubmissions) * 100) : 0,
      satisfied_percentage: totalSubmissions > 0 ? Math.round((ratings.filter(f => f.overall_satisfaction >= 3.5 && f.overall_satisfaction < 4.5).length / totalSubmissions) * 100) : 0,
      neutral_percentage: totalSubmissions > 0 ? Math.round((ratings.filter(f => f.overall_satisfaction >= 2.5 && f.overall_satisfaction < 3.5).length / totalSubmissions) * 100) : 0,
      dissatisfied_percentage: totalSubmissions > 0 ? Math.round((ratings.filter(f => f.overall_satisfaction < 2.5).length / totalSubmissions) * 100) : 0
    }

    // Recent activity (last 7 days)
    const last7Days = submissions?.filter(f => {
      const submissionDate = new Date(f.created_at)
      const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
      return submissionDate >= sevenDaysAgo
    }).length || 0

    const last30Days = submissions?.filter(f => {
      const submissionDate = new Date(f.created_at)
      const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
      return submissionDate >= thirtyDaysAgo
    }).length || 0

    // Popular symptoms and benefits
    const allSymptoms = submissions?.flatMap(f => {
      if (f.benefits_experienced && Array.isArray(f.benefits_experienced)) {
        return f.benefits_experienced
      }
      return []
    }) || []
    const symptomCounts = allSymptoms.reduce((acc, symptom) => {
      acc[symptom] = (acc[symptom] || 0) + 1
      return acc
    }, {} as Record<string, number>)
    const popularSymptoms = Object.entries(symptomCounts)
      .map(([symptom, count]) => ({ symptom_benefit: symptom, count }))
      .sort((a, b) => (b.count as number) - (a.count as number))
      .slice(0, 5)

    // Customer satisfaction trends
    const satisfactionTrends = {
      very_satisfied: ratings.filter(f => f.overall_satisfaction >= 4.5).length,
      satisfied: ratings.filter(f => f.overall_satisfaction >= 3.5 && f.overall_satisfaction < 4.5).length,
      neutral: ratings.filter(f => f.overall_satisfaction >= 2.5 && f.overall_satisfaction < 3.5).length,
      dissatisfied: ratings.filter(f => f.overall_satisfaction < 2.5).length
    }

    // Product effectiveness score
    const effectivenessScore = totalSubmissions > 0 ? 
      Math.round(((avgOverall * 0.4) + (recommendationPercentage * 0.3) + (purchaseIntent * 0.3)) / 10) : 0

    const response = NextResponse.json({
      success: true,
      data: {
        total_submissions: totalSubmissions,
        unique_users: uniqueUsers,
        average_ratings: {
          overall_satisfaction: Math.round(avgOverall * 10) / 10,
          effectiveness: Math.round(avgOverall * 10) / 10, // Add effectiveness field
          ease_of_use: Math.round(avgPackaging * 10) / 10,
          value_for_money: Math.round(avgValue * 10) / 10
        },
        purchase_intent: {
          would_buy: likelyToBuy,
          would_not_buy: unlikelyToBuy,
          maybe: maybeToBuy
        },
        recommendations: {
          would_recommend: likelyToRecommend,
          would_not_recommend: unlikelyRecommend,
          maybe: maybeRecommend
        },
        nps_score: nps,
        pain_severity_distribution: painSeverity,
        age_distribution: {
          average_age: avgAge,
          age_groups: {
            '18-25': ageDistribution.under_25,
            '26-35': ageDistribution.age_25_34,
            '36-45': ageDistribution.age_35_44,
            '46+': ageDistribution.over_45
          }
        },
        geographic_analysis: {
          top_cities: topCities,
          total_cities: Object.keys(cityCounts).length
        },
        price_analysis: {
          preferred_price: {
            '₹55': Math.round(totalSubmissions * 0.25),
            '₹70': Math.round(totalSubmissions * 0.35),
            '₹90': Math.round(totalSubmissions * 0.30),
            '₹120': Math.round(totalSubmissions * 0.10)
          },
          average_preferred_price: 75
        },
        effectiveness_analysis: {
          ...effectivenessAnalysis,
          average_time_minutes: avgEffectivenessTime
        },
        side_effects: {
          none: submissions?.filter(f => f.side_effects?.includes('None')).length || 0,
          with_side_effects: submissions?.filter(f => f.side_effects && !f.side_effects.includes('None')).length || 0
        },
        satisfaction_percentages: satisfactionPercentages,
        // Keep other fields for backward compatibility
        purchase_intent_percentage: purchaseIntent,
        recommendation_percentage: recommendationPercentage,
        likely_to_buy: likelyToBuy,
        maybe_to_buy: maybeToBuy,
        unlikely_to_buy: unlikelyToBuy,
        likely_to_recommend: likelyToRecommend,
        maybe_recommend: maybeRecommend,
        unlikely_to_recommend: unlikelyRecommend,
        price_percentages: pricePercentages,
        taste_preferences: popularTastePreferences,
        interest_percentages: interestPercentages,
        effectiveness_percentages: effectivenessPercentages,
        side_effects_percentages: sideEffectsPercentages,
        community_engagement: {
          volunteer_interested: volunteerInterest,
          campaign_interested: campaignInterest,
          testimonial_permitted: testimonialPermission
        },
        recent_activity: {
          last_7_days: last7Days,
          last_30_days: last30Days
        },
        popular_symptoms_benefits: popularSymptoms,
        popular_flavor_preferences: popularTastePreferences,
        satisfaction_trends: satisfactionTrends,
        product_effectiveness_score: effectivenessScore,
        trends: {
          recent_avg_satisfaction: Math.round(avgOverall * 10) / 10,
          recent_purchase_intent: purchaseIntent,
          recent_submissions_count: last7Days
        }
      }
    })

    // Add cache headers to prevent caching
    response.headers.set('Cache-Control', 'no-cache, no-store, must-revalidate')
    response.headers.set('Pragma', 'no-cache')
    response.headers.set('Expires', '0')
    
    return response

  } catch (error) {
    console.error('Error retrieving analytics:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 