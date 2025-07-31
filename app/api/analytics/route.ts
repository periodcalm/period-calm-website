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
    console.log('✅ Analytics: Redis client initialized successfully')
  } else {
    console.log('⚠️ Analytics: Redis environment variables not found, using fallback storage')
  }
} catch (error) {
  console.log('⚠️ Analytics: Failed to initialize Redis, using fallback storage:', error)
}

// Fallback in-memory storage (temporary until Redis is set up)
let fallbackSubmissions: any[] = []

export async function GET() {
  try {
    console.log('=== SIMPLE ANALYTICS API ===')
    
    // Get submissions
    let submissions: any[] = []
    
    if (redis) {
      // Try Redis first
      try {
        const existingData = await redis.get('feedback-submissions')
        if (existingData) {
          submissions = existingData as any[]
          console.log('Analytics: Loaded', submissions.length, 'submissions from Redis')
        } else {
          console.log('Analytics: No data in Redis, using fallback')
          submissions = [...fallbackSubmissions]
        }
      } catch (redisError) {
        console.error('Analytics: Error reading from Redis:', redisError)
        console.log('Analytics: Falling back to in-memory storage')
        submissions = [...fallbackSubmissions]
      }
    } else {
      // Use fallback storage
      submissions = [...fallbackSubmissions]
      console.log('Analytics: Using fallback storage, submissions:', submissions.length)
    }
    
    if (submissions.length === 0) {
      return NextResponse.json({
        success: true,
        data: {
          totalSubmissions: 0,
          averageSatisfaction: 0,
          averageTasteRating: 0,
          averageValueRating: 0,
          averagePackagingRating: 0,
          recommendationRate: 0,
          recentSubmissions: [],
          submissions: []
        }
      })
    }
    
    // Calculate metrics
    const totalSubmissions = submissions.length
    console.log('📊 Total submissions:', totalSubmissions)
    
    const totalSatisfaction = submissions.reduce((sum: number, sub: any) => {
      const rating = sub.overall_satisfaction || 0
      console.log(`📈 Submission ${sub.id}: satisfaction = ${rating}`)
      return sum + rating
    }, 0)
    
    const totalTasteRating = submissions.reduce((sum: number, sub: any) => {
      return sum + (sub.taste_rating || 0)
    }, 0)
    
    const totalValueRating = submissions.reduce((sum: number, sub: any) => {
      return sum + (sub.value_rating || 0)
    }, 0)
    
    const totalPackagingRating = submissions.reduce((sum: number, sub: any) => {
      return sum + (sub.packaging_rating || 0)
    }, 0)
    
    // Calculate recommendation rate
    const wouldRecommendCount = submissions.filter((sub: any) => {
      const recommendation = sub.would_recommend || ''
      return recommendation.toLowerCase().includes('definitely') || 
             recommendation.toLowerCase().includes('yes')
    }).length
    
    const recommendationRate = totalSubmissions > 0 ? Math.round((wouldRecommendCount / totalSubmissions) * 100) : 0
    
    console.log('📊 Totals calculated:', {
      totalSatisfaction,
      totalTasteRating,
      totalValueRating,
      totalPackagingRating,
      wouldRecommendCount,
      recommendationRate
    })
    
    const analyticsData = {
      totalSubmissions,
      averageSatisfaction: totalSubmissions > 0 ? Math.round(totalSatisfaction / totalSubmissions * 10) / 10 : 0,
      averageTasteRating: totalSubmissions > 0 ? Math.round(totalTasteRating / totalSubmissions * 10) / 10 : 0,
      averageValueRating: totalSubmissions > 0 ? Math.round(totalValueRating / totalSubmissions * 10) / 10 : 0,
      averagePackagingRating: totalSubmissions > 0 ? Math.round(totalPackagingRating / totalSubmissions * 10) / 10 : 0,
      recommendationRate,
      recentSubmissions: submissions.slice(-10).reverse(), // Last 10, newest first
      submissions: submissions
    }
    
    console.log('Analytics calculated:', analyticsData)
    
    return NextResponse.json({
      success: true,
      data: analyticsData
    })
    
  } catch (err) {
    console.error('Analytics API error:', err)
    return NextResponse.json(
      { error: 'Analytics API error', details: err instanceof Error ? err.message : 'Unknown error' },
      { status: 500 }
    )
  }
} 