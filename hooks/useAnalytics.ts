import { useState, useEffect } from 'react'

interface AnalyticsData {
  total_submissions: number
  unique_users: number
  average_ratings: {
    overall_satisfaction: number
    effectiveness: number
    ease_of_use: number
    value_for_money: number
  }
  purchase_intent: {
    would_buy: number
    would_not_buy: number
    maybe: number
  }
  recommendations: {
    would_recommend: number
    would_not_recommend: number
    maybe: number
  }
  nps_score: number
  pain_severity_distribution: {
    mild: number
    moderate: number
    severe: number
    very_severe: number
  }
  age_distribution: {
    average_age: number
    age_groups: {
      '18-25': number
      '26-35': number
      '36-45': number
      '46+': number
    }
  }
  geographic_analysis: {
    total_cities: number
    top_cities: Array<{ city: string; count: number }>
  }
  price_analysis: {
    preferred_price: {
      '₹55': number
      '₹70': number
      '₹90': number
      '₹120': number
    }
    average_preferred_price: number
  }
  effectiveness_analysis: {
    average_time_minutes: number
    very_fast: number
    fast: number
    moderate: number
    slow: number
  }
  side_effects: {
    none: number
    with_side_effects: number
  }
  satisfaction_percentages: {
    very_satisfied_percentage: number
    satisfied_percentage: number
    neutral_percentage: number
    dissatisfied_percentage: number
    very_dissatisfied_percentage: number
  }
}

interface Testimonial {
  id: string
  name: string
  age: number | null
  location: string
  rating: number
  title: string
  content: string
  image: string
  verified: boolean
  beforeAfter: {
    before: string
    after: string
  }
  submitted_at: string
}

export function useAnalytics() {
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null)
  const [testimonials, setTestimonials] = useState<Testimonial[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchAnalytics = async () => {
    try {
      setIsLoading(true)
      setError(null)

      // Fetch analytics data
      const analyticsResponse = await fetch('/api/analytics')
      if (!analyticsResponse.ok) {
        throw new Error('Failed to fetch analytics data')
      }
      const analytics = await analyticsResponse.json()

      // Fetch testimonials from feedback submissions
      const feedbackResponse = await fetch('/api/submit-feedback')
      if (!feedbackResponse.ok) {
        throw new Error('Failed to fetch feedback data')
      }
      const feedbackData = await feedbackResponse.json()

      // Transform feedback data into testimonials
      const transformedTestimonials: Testimonial[] = feedbackData.data
        .filter((item: any) => 
          item.overall_satisfaction >= 4 && 
          (item.would_recommend?.includes('definitely') || item.would_recommend?.includes('probably')) &&
          (item.testimonial_text || item.improvements || item.additional_feedback)
        )
        .map((item: any, index: number) => ({
          id: item.id || `testimonial-${index}`,
          name: `${item.first_name || 'User'} ${item.last_name || (index + 1)}`,
          age: item.age || null,
          location: item.city || 'India',
          rating: item.overall_satisfaction || 5,
          title: item.testimonial_title || 'Great experience with Period Calm',
          content: item.testimonial_text || item.improvements || item.additional_feedback || 'This product really helped with my period pain.',
          image: `/placeholder.svg?height=60&width=60&text=${(item.first_name || 'U').charAt(0).toUpperCase()}`,
          verified: true,
          beforeAfter: {
            before: item.pain_severity ? `${item.pain_severity} pain` : 
                   item.what_used_before ? `Used ${item.what_used_before}` : 
                   'Severe cramps and discomfort',
            after: item.overall_satisfaction >= 4 ? 
                   (item.effect_speed ? `Relief in ${item.effect_speed}` : 'Significant relief') :
                   (item.improvements ? `Improved with ${item.improvements}` : 'Better experience')
          },
          submitted_at: item.created_at || new Date().toISOString()
        }))
        .slice(0, 10) // Limit to 10 best testimonials

      setAnalyticsData(analytics.data)
      setTestimonials(transformedTestimonials)
    } catch (err) {
      console.error('Error fetching analytics:', err)
      setError(err instanceof Error ? err.message : 'Failed to fetch data')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchAnalytics()
  }, [])

  // Listen for feedback submission events to refresh data
  useEffect(() => {
    const handleFeedbackSubmitted = () => {
      fetchAnalytics()
    }

    window.addEventListener('feedbackSubmitted', handleFeedbackSubmitted)
    
    return () => {
      window.removeEventListener('feedbackSubmitted', handleFeedbackSubmitted)
    }
  }, [])

  // Add refetch function for manual refresh
  const refetch = () => {
    fetchAnalytics()
  }

  // Helper functions for derived metrics
  const getSuccessRate = () => {
    if (!analyticsData) return 0
    const total = analyticsData.total_submissions
    const successful = analyticsData.satisfaction_percentages.very_satisfied_percentage + 
                      analyticsData.satisfaction_percentages.satisfied_percentage
    return Math.round((successful / 100) * total)
  }

  const getOptimalPrice = () => {
    if (!analyticsData) return '₹90'
    const prices = analyticsData.price_analysis.preferred_price
    return Object.entries(prices).reduce((a, b) => prices[a[0] as keyof typeof prices] > prices[b[0] as keyof typeof prices] ? a : b)[0]
  }

  const getWouldBuyPercentage = () => {
    if (!analyticsData) return 0
    const total = analyticsData.purchase_intent.would_buy + 
                  analyticsData.purchase_intent.would_not_buy + 
                  analyticsData.purchase_intent.maybe
    return Math.round((analyticsData.purchase_intent.would_buy / total) * 100)
  }

  const getWouldRecommendPercentage = () => {
    if (!analyticsData) return 0
    const total = analyticsData.recommendations.would_recommend + 
                  analyticsData.recommendations.would_not_recommend + 
                  analyticsData.recommendations.maybe
    return Math.round((analyticsData.recommendations.would_recommend / total) * 100)
  }

  return {
    analyticsData,
    testimonials,
    isLoading,
    error,
    refetch: fetchAnalytics,
    getSuccessRate,
    getOptimalPrice,
    getWouldBuyPercentage,
    getWouldRecommendPercentage
  }
} 