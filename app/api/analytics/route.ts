import { NextResponse } from 'next/server'

// In-memory storage for serverless environment
let submissions: any[] = []

// Try to load existing data from file (read-only)
try {
  const fs = require('fs')
  const path = require('path')
  const DATA_FILE = path.join(process.cwd(), 'data', 'feedback-submissions.json')
  
  if (fs.existsSync(DATA_FILE)) {
    const fileContent = fs.readFileSync(DATA_FILE, 'utf-8')
    submissions = JSON.parse(fileContent)
    console.log('Analytics: Loaded', submissions.length, 'existing submissions from file')
  }
} catch (error) {
  console.log('Analytics: Could not load existing data, starting fresh:', error)
  submissions = []
}

export async function GET() {
  try {
    console.log('=== SIMPLE ANALYTICS API ===')
    
    // Use in-memory submissions array (already loaded at module level)
    console.log('Analytics: Current submissions in memory:', submissions.length)
    
    if (submissions.length === 0) {
      return NextResponse.json({
        success: true,
        data: {
          totalSubmissions: 0,
          averageSatisfaction: 0,
          averageTasteRating: 0,
          averageValueRating: 0,
          averagePackagingRating: 0,
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