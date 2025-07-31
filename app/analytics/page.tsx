'use client'

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { 
  BarChart3, 
  Users, 
  Star, 
  TrendingUp, 
  Heart, 
  Target, 
  Award,
  Download,
  Eye,
  Lock,
  Unlock,
  RefreshCw,
  AlertCircle
} from 'lucide-react'

interface AnalyticsData {
  total_submissions: number
  unique_users: number
  average_ratings: {
    overall_satisfaction: number
    taste: number
    packaging_convenience: number
    value_for_money: number
  }
  nps_score: number
  purchase_intent_percentage: number
  likely_to_buy: number
  maybe_to_buy: number
  unlikely_to_buy: number
  likely_to_recommend: number
  maybe_recommend: number
  unlikely_to_recommend: number
  pain_severity_distribution: {
    mild: number
    moderate: number
    severe: number
    very_severe: number
  }
  age_distribution: {
    average_age: number
    under_25: number
    age_25_34: number
    age_35_44: number
    over_45: number
  }
  effect_speed_distribution: {
    very_fast: number
    fast: number
    slow: number
    no_relief: number
  }
  side_effects: {
    none: number
    with_side_effects: number
  }
  community_engagement: {
    volunteer_interested: number
    campaign_interested: number
    testimonial_permitted: number
  }
  recent_activity: {
    last_7_days: number
    last_30_days: number
  }
  popular_symptoms_benefits: Array<{ symptom_benefit: string; count: number }>
  popular_flavor_preferences: Array<{ flavor: string; count: number }>
  trends: {
    recent_avg_satisfaction: number
    recent_purchase_intent: number
    recent_submissions_count: number
  }
}

export default function AnalyticsPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null)
  const [loading, setLoading] = useState(false)
  const [refreshing, setRefreshing] = useState(false)

  const CORRECT_PASSWORD = 'Piyush@0502'

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (password === CORRECT_PASSWORD) {
      setIsAuthenticated(true)
      setError('')
      fetchAnalytics()
    } else {
      setError('Incorrect password')
    }
  }

  const fetchAnalytics = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/analytics')
      const result = await response.json()
      
      if (result.success) {
        setAnalyticsData(result.data)
      } else {
        throw new Error(result.error || 'Failed to fetch analytics')
      }
    } catch (err) {
      console.error('Error fetching analytics:', err)
      setError('Failed to load analytics data')
    } finally {
      setLoading(false)
    }
  }

  const refreshAnalytics = async () => {
    setRefreshing(true)
    await fetchAnalytics()
    setRefreshing(false)
  }

  const exportData = async () => {
    try {
      const response = await fetch('/api/submit-feedback?limit=1000')
      const result = await response.json()
      
      if (result.success) {
        const csvContent = convertToCSV(result.data)
        const blob = new Blob([csvContent], { type: 'text/csv' })
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `period-calm-feedback-${new Date().toISOString().split('T')[0]}.csv`
        a.click()
        window.URL.revokeObjectURL(url)
      }
    } catch (err) {
      console.error('Error exporting data:', err)
      setError('Failed to export data')
    }
  }

  const convertToCSV = (data: any[]) => {
    if (data.length === 0) return ''
    
    const headers = Object.keys(data[0])
    const csvRows = [headers.join(',')]
    
    for (const row of data) {
      const values = headers.map(header => {
        const value = row[header]
        if (Array.isArray(value)) {
          return `"${value.join('; ')}"`
        }
        return `"${value || ''}"`
      })
      csvRows.push(values.join(','))
    }
    
    return csvRows.join('\n')
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mb-4">
              <Lock className="w-6 h-6 text-purple-600" />
            </div>
            <CardTitle className="text-xl">Analytics Dashboard</CardTitle>
            <p className="text-gray-600">Enter password to access feedback analytics</p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handlePasswordSubmit} className="space-y-4">
              <Input
                type="password"
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="text-center"
              />
              {error && (
                <div className="flex items-center gap-2 text-red-600 text-sm">
                  <AlertCircle className="w-4 h-4" />
                  {error}
                </div>
              )}
              <Button type="submit" className="w-full">
                <Unlock className="w-4 h-4 mr-2" />
                Access Analytics
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-4 text-purple-600" />
          <p className="text-gray-600">Loading analytics data...</p>
        </div>
      </div>
    )
  }

  if (!analyticsData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-8 h-8 mx-auto mb-4 text-red-600" />
          <p className="text-gray-600">Failed to load analytics data</p>
          <Button onClick={fetchAnalytics} className="mt-4">
            Try Again
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Period Calm Analytics</h1>
            <p className="text-gray-600">Comprehensive feedback insights and trends</p>
          </div>
          <div className="flex gap-2 mt-4 md:mt-0">
            <Button onClick={refreshAnalytics} disabled={refreshing} variant="outline">
              <RefreshCw className={`w-4 h-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
            <Button onClick={exportData}>
              <Download className="w-4 h-4 mr-2" />
              Export Data
            </Button>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Submissions</p>
                  <p className="text-2xl font-bold text-gray-900">{analyticsData.total_submissions}</p>
                </div>
                <Users className="w-8 h-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">NPS Score</p>
                  <p className="text-2xl font-bold text-gray-900">{analyticsData.nps_score}</p>
                </div>
                <TrendingUp className="w-8 h-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Purchase Intent</p>
                  <p className="text-2xl font-bold text-gray-900">{analyticsData.purchase_intent_percentage}%</p>
                </div>
                <Target className="w-8 h-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Avg Satisfaction</p>
                  <p className="text-2xl font-bold text-gray-900">{analyticsData.average_ratings.overall_satisfaction}/5</p>
                </div>
                <Star className="w-8 h-8 text-yellow-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Detailed Analytics */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Ratings Breakdown */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Star className="w-5 h-5" />
                Ratings Breakdown
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Overall Satisfaction</span>
                  <span>{analyticsData.average_ratings.overall_satisfaction}/5</span>
                </div>
                <Progress value={analyticsData.average_ratings.overall_satisfaction * 20} className="h-2" />
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Taste</span>
                  <span>{analyticsData.average_ratings.taste}/5</span>
                </div>
                <Progress value={analyticsData.average_ratings.taste * 20} className="h-2" />
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Packaging & Convenience</span>
                  <span>{analyticsData.average_ratings.packaging_convenience}/5</span>
                </div>
                <Progress value={analyticsData.average_ratings.packaging_convenience * 20} className="h-2" />
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Value for Money</span>
                  <span>{analyticsData.average_ratings.value_for_money}/5</span>
                </div>
                <Progress value={analyticsData.average_ratings.value_for_money * 20} className="h-2" />
              </div>
            </CardContent>
          </Card>

          {/* Purchase Intent */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="w-5 h-5" />
                Purchase Intent
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Likely to Buy</span>
                  <Badge variant="default" className="bg-green-100 text-green-800">
                    {analyticsData.likely_to_buy}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Maybe</span>
                  <Badge variant="secondary">{analyticsData.maybe_to_buy}</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Unlikely</span>
                  <Badge variant="destructive">{analyticsData.unlikely_to_buy}</Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Pain Severity Distribution */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Heart className="w-5 h-5" />
                Pain Severity Distribution
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Mild</span>
                  <Badge variant="outline">{analyticsData.pain_severity_distribution.mild}</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Moderate</span>
                  <Badge variant="outline">{analyticsData.pain_severity_distribution.moderate}</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Severe</span>
                  <Badge variant="outline">{analyticsData.pain_severity_distribution.severe}</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Very Severe</span>
                  <Badge variant="outline">{analyticsData.pain_severity_distribution.very_severe}</Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Age Distribution */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5" />
                Age Distribution
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Under 25</span>
                  <Badge variant="outline">{analyticsData.age_distribution.under_25}</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">25-34</span>
                  <Badge variant="outline">{analyticsData.age_distribution.age_25_34}</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">35-44</span>
                  <Badge variant="outline">{analyticsData.age_distribution.age_35_44}</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Over 45</span>
                  <Badge variant="outline">{analyticsData.age_distribution.over_45}</Badge>
                </div>
                <div className="pt-2 border-t">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Average Age</span>
                    <span className="text-sm font-medium">{analyticsData.age_distribution.average_age}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Popular Responses */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="w-5 h-5" />
                Top Symptoms & Benefits
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {analyticsData.popular_symptoms_benefits.slice(0, 10).map((item, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <span className="text-sm truncate">{item.symptom_benefit}</span>
                    <Badge variant="secondary">{item.count}</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5" />
                Popular Flavor Preferences
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {analyticsData.popular_flavor_preferences.slice(0, 10).map((item, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <span className="text-sm truncate">{item.flavor}</span>
                    <Badge variant="secondary">{item.count}</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              Recent Activity & Trends
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <p className="text-2xl font-bold text-purple-600">{analyticsData.recent_activity.last_7_days}</p>
                <p className="text-sm text-gray-600">Submissions (7 days)</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-blue-600">{analyticsData.recent_activity.last_30_days}</p>
                <p className="text-sm text-gray-600">Submissions (30 days)</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-green-600">{analyticsData.trends.recent_avg_satisfaction}/5</p>
                <p className="text-sm text-gray-600">Recent Avg Satisfaction</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 