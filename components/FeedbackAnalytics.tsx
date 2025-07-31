"use client"

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Star, TrendingUp, Users, MessageCircle, Heart, ThumbsUp } from 'lucide-react'
import { createClient } from '@supabase/supabase-js'

interface FeedbackStats {
  totalSubmissions: number
  avgSatisfaction: number
  avgTaste: number
  avgValue: number
  avgPackaging: number
  wouldRecommendCount: number
  wouldDrinkAgainCount: number
  recentSubmissions: number
}

interface RecentFeedback {
  id: string
  first_name: string
  overall_satisfaction: number
  would_recommend: string
  final_thoughts: string
  submitted_at: string
}

export default function FeedbackAnalytics() {
  const [stats, setStats] = useState<FeedbackStats | null>(null)
  const [recentFeedback, setRecentFeedback] = useState<RecentFeedback[]>([])
  const [loading, setLoading] = useState(true)

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  useEffect(() => {
    fetchAnalytics()
  }, [])

  const fetchAnalytics = async () => {
    try {
      setLoading(true)

      // Fetch overall stats
      const { data: statsData, error: statsError } = await supabase
        .from('feedback_submissions')
        .select('*')

      if (statsError) throw statsError

      if (statsData && statsData.length > 0) {
        const totalSubmissions = statsData.length
        const avgSatisfaction = statsData.reduce((sum, item) => sum + (item.overall_satisfaction || 0), 0) / totalSubmissions
        const avgTaste = statsData.reduce((sum, item) => sum + (item.taste_rating || 0), 0) / totalSubmissions
        const avgValue = statsData.reduce((sum, item) => sum + (item.value_rating || 0), 0) / totalSubmissions
        const avgPackaging = statsData.reduce((sum, item) => sum + (item.packaging_rating || 0), 0) / totalSubmissions
        
        const wouldRecommendCount = statsData.filter(item => 
          item.would_recommend?.toLowerCase().includes('definitely') || 
          item.would_recommend?.toLowerCase().includes('yes')
        ).length
        
        const wouldDrinkAgainCount = statsData.filter(item => 
          item.would_drink_again?.toLowerCase().includes('definitely') || 
          item.would_drink_again?.toLowerCase().includes('probably')
        ).length

        const recentSubmissions = statsData.filter(item => 
          new Date(item.submitted_at) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
        ).length

        setStats({
          totalSubmissions,
          avgSatisfaction: Math.round(avgSatisfaction * 10) / 10,
          avgTaste: Math.round(avgTaste * 10) / 10,
          avgValue: Math.round(avgValue * 10) / 10,
          avgPackaging: Math.round(avgPackaging * 10) / 10,
          wouldRecommendCount,
          wouldDrinkAgainCount,
          recentSubmissions
        })

        // Fetch recent feedback
        const { data: recentData, error: recentError } = await supabase
          .from('feedback_submissions')
          .select('id, first_name, overall_satisfaction, would_recommend, final_thoughts, submitted_at')
          .order('submitted_at', { ascending: false })
          .limit(5)

        if (recentError) throw recentError
        setRecentFeedback(recentData || [])
      }
    } catch (error) {
      console.error('Error fetching analytics:', error)
    } finally {
      setLoading(false)
    }
  }

  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`w-4 h-4 ${
              star <= rating 
                ? 'text-yellow-400 fill-current' 
                : 'text-gray-300'
            }`}
          />
        ))}
        <span className="ml-2 text-sm font-medium">{rating}/5</span>
      </div>
    )
  }

  const getRecommendationColor = (recommendation: string) => {
    if (recommendation?.toLowerCase().includes('definitely')) return 'bg-green-100 text-green-800'
    if (recommendation?.toLowerCase().includes('yes')) return 'bg-blue-100 text-blue-800'
    if (recommendation?.toLowerCase().includes('maybe')) return 'bg-yellow-100 text-yellow-800'
    return 'bg-gray-100 text-gray-800'
  }

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-6">
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-8 bg-gray-200 rounded w-1/2"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  if (!stats) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <MessageCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No Feedback Yet</h3>
          <p className="text-gray-600">Start collecting feedback to see analytics here!</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Users className="w-5 h-5 text-blue-500" />
              <span className="text-sm font-medium text-gray-600">Total Feedback</span>
            </div>
            <div className="mt-2">
              <span className="text-2xl font-bold text-gray-900">{stats.totalSubmissions}</span>
              <Badge variant="secondary" className="ml-2">
                +{stats.recentSubmissions} this week
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Star className="w-5 h-5 text-yellow-500" />
              <span className="text-sm font-medium text-gray-600">Avg Satisfaction</span>
            </div>
            <div className="mt-2">
              {renderStars(stats.avgSatisfaction)}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <ThumbsUp className="w-5 h-5 text-green-500" />
              <span className="text-sm font-medium text-gray-600">Would Recommend</span>
            </div>
            <div className="mt-2">
              <span className="text-2xl font-bold text-gray-900">
                {Math.round((stats.wouldRecommendCount / stats.totalSubmissions) * 100)}%
              </span>
              <span className="text-sm text-gray-600 ml-2">
                ({stats.wouldRecommendCount}/{stats.totalSubmissions})
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Heart className="w-5 h-5 text-red-500" />
              <span className="text-sm font-medium text-gray-600">Would Buy Again</span>
            </div>
            <div className="mt-2">
              <span className="text-2xl font-bold text-gray-900">
                {Math.round((stats.wouldDrinkAgainCount / stats.totalSubmissions) * 100)}%
              </span>
              <span className="text-sm text-gray-600 ml-2">
                ({stats.wouldDrinkAgainCount}/{stats.totalSubmissions})
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Ratings */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Taste Rating</CardTitle>
          </CardHeader>
          <CardContent>
            {renderStars(stats.avgTaste)}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Value Rating</CardTitle>
          </CardHeader>
          <CardContent>
            {renderStars(stats.avgValue)}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Packaging Rating</CardTitle>
          </CardHeader>
          <CardContent>
            {renderStars(stats.avgPackaging)}
          </CardContent>
        </Card>
      </div>

      {/* Recent Feedback */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Recent Feedback</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentFeedback.map((feedback) => (
              <div key={feedback.id} className="border-b border-gray-200 pb-4 last:border-b-0">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <span className="font-medium text-gray-900">
                        {feedback.first_name || 'Anonymous'}
                      </span>
                      <Badge variant="outline" className={getRecommendationColor(feedback.would_recommend)}>
                        {feedback.would_recommend}
                      </Badge>
                    </div>
                    {feedback.final_thoughts && (
                      <p className="text-gray-600 text-sm mb-2">
                        "{feedback.final_thoughts}"
                      </p>
                    )}
                    <div className="flex items-center space-x-4 text-xs text-gray-500">
                      <span>{renderStars(feedback.overall_satisfaction)}</span>
                      <span>
                        {new Date(feedback.submitted_at).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 