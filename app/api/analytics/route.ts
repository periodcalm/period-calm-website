import { NextResponse } from 'next/server'
import { supabaseServer } from '@/supabase/server'

export async function GET() {
  try {
    console.log('=== SUPABASE ANALYTICS API ===')
    console.log('Environment check:', {
      hasUrl: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
      hasServiceKey: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
      url: process.env.NEXT_PUBLIC_SUPABASE_URL?.substring(0, 20) + '...'
    })
    
    // First, let's check what tables exist
    const { data: tables, error: tablesError } = await supabaseServer
      .from('information_schema.tables')
      .select('table_name')
      .eq('table_schema', 'public')
    
    console.log('Available tables:', tables)
    
    // Try different possible table names
    const possibleTableNames = [
      'feedback_submissions',
      'feedback',
      'submissions',
      'user_feedback',
      'period_calm_feedback'
    ]
    
    let submissions = null
    let tableName = null
    
    for (const name of possibleTableNames) {
      try {
        const { data, error } = await supabaseServer
          .from(name)
          .select('*')
          .limit(1)
        
        if (!error && data) {
          console.log(`Found data in table: ${name}`)
          tableName = name
          break
        }
      } catch (err) {
        console.log(`Table ${name} not accessible:`, err)
      }
    }
    
    if (!tableName) {
      console.log('No accessible table found, trying feedback_submissions')
      tableName = 'feedback_submissions'
    }
    
    // Get all submissions from the found table
    const { data: submissionsData, error } = await supabaseServer
      .from(tableName)
      .select('*')
      .order('submitted_at', { ascending: false })
    
    console.log('Supabase query result:', {
      tableName,
      hasData: !!submissionsData,
      dataLength: submissionsData?.length || 0,
      hasError: !!error,
      error: error?.message
    })
    
    if (error) {
      console.error('Supabase query error:', error)
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
    
    submissions = submissionsData
    console.log('Loaded submissions from Supabase:', submissions?.length || 0)
    if (submissions && submissions.length > 0) {
      console.log('Sample submission:', submissions[0])
    }
    
    if (!submissions || submissions.length === 0) {
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
      recentSubmissions: submissions.slice(0, 10), // First 10 (already ordered by newest first)
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