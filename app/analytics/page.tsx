'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Separator } from '@/components/ui/separator'
import { 
  Lock, 
  RefreshCw, 
  Download, 
  Users, 
  Star, 
  TrendingUp, 
  Heart, 
  Target, 
  BarChart3, 
  DollarSign,
  Clock,
  MapPin,
  ThumbsUp,
  ShoppingCart,
  AlertCircle,
  CheckCircle,
  Zap,
  Activity,
  Award,
  TrendingDown,
  Eye,
  MessageCircle,
  Calendar,
  PieChart,
  LineChart,
  ArrowUp,
  ArrowDown,
  Minus
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
  recommendation_percentage: number
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
  geographic_analysis: {
    top_cities: Array<{ city: string; count: number }>
    total_cities: number
  }
  price_analysis: {
    total_responses: number
    acceptable_price: number
    expensive: number
    very_expensive: number
    affordable: number
  }
  price_percentages: {
    acceptable_percentage: number
    expensive_percentage: number
    very_expensive_percentage: number
    affordable_percentage: number
  }
  taste_preferences: Array<{ flavor: string; count: number }>
  interest_percentages: {
    volunteer_percentage: number
    campaign_percentage: number
    testimonial_percentage: number
  }
  effectiveness_analysis: {
    very_fast: number
    fast: number
    moderate: number
    slow: number
    no_relief: number
    average_time_minutes: number
  }
  effectiveness_percentages: {
    very_fast_percentage: number
    fast_percentage: number
    moderate_percentage: number
    slow_percentage: number
    no_relief_percentage: number
  }
  side_effects: {
    none: number
    with_side_effects: number
  }
  side_effects_percentages: {
    none_percentage: number
    with_side_effects_percentage: number
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
  satisfaction_trends: {
    very_satisfied: number
    satisfied: number
    neutral: number
    dissatisfied: number
  }
  satisfaction_percentages: {
    very_satisfied_percentage: number
    satisfied_percentage: number
    neutral_percentage: number
    dissatisfied_percentage: number
  }
  product_effectiveness_score: number
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
  const [rawData, setRawData] = useState<any[]>([])

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
    setError('')
    try {
      const response = await fetch('/api/analytics')
      const result = await response.json()
      
      if (result.success) {
        setAnalyticsData(result.data)
      } else {
        throw new Error(result.error || 'Failed to fetch analytics')
      }

      // Fetch raw data for detailed view
      const rawResponse = await fetch('/api/submit-feedback?limit=1000')
      const rawResult = await rawResponse.json()
      if (rawResult.success) {
        setRawData(rawResult.data)
      }
    } catch (err) {
      console.error('Error fetching analytics:', err)
      setError('Failed to load analytics data')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (isAuthenticated) {
      fetchAnalytics()
    }
  }, [isAuthenticated])

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

  const getRatingColor = (rating: number) => {
    if (rating >= 4) return 'text-green-600'
    if (rating >= 3) return 'text-yellow-600'
    return 'text-red-600'
  }

  const getSuccessRate = () => {
    if (!analyticsData) return 0
    const satisfied = analyticsData.satisfaction_trends.very_satisfied + analyticsData.satisfaction_trends.satisfied
    return Math.round((satisfied / analyticsData.total_submissions) * 100)
  }

  const getOptimalPrice = () => {
    if (!analyticsData) return '₹90'
    const { price_analysis } = analyticsData
    
    if (price_analysis.affordable > price_analysis.acceptable_price) {
      return '₹55'
    } else if (price_analysis.acceptable_price > price_analysis.expensive) {
      return '₹70'
    } else if (price_analysis.acceptable_price > price_analysis.very_expensive) {
      return '₹90'
    } else {
      return '₹120'
    }
  }

  const getTrendIcon = (current: number, previous: number) => {
    if (current > previous) return <ArrowUp className="w-4 h-4 text-green-600" />
    if (current < previous) return <ArrowDown className="w-4 h-4 text-red-600" />
    return <Minus className="w-4 h-4 text-gray-600" />
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md shadow-2xl">
          <CardHeader className="text-center">
            <div className="mx-auto w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mb-4">
              <Lock className="w-8 h-8 text-white" />
            </div>
            <CardTitle className="text-2xl bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Period Calm Analytics
            </CardTitle>
            <p className="text-gray-600">Enter password to access insights</p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handlePasswordSubmit} className="space-y-4">
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
              {error && <p className="text-red-500 text-sm">{error}</p>}
              <Button type="submit" className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
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
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <RefreshCw className="w-8 h-8 text-white animate-spin" />
          </div>
          <p className="text-gray-600 text-lg">Loading insights...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <Button onClick={fetchAnalytics} variant="outline">
            <RefreshCw className="w-4 h-4 mr-2" />
            Try Again
          </Button>
        </div>
      </div>
    )
  }

  if (!analyticsData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 mb-4">No analytics data available</p>
          <Button onClick={fetchAnalytics} variant="outline">
            <RefreshCw className="w-4 h-4 mr-2" />
            Try Again
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                Period Calm Analytics Dashboard
              </h1>
              <p className="text-gray-600 text-lg">Comprehensive insights for business decisions</p>
            </div>
            <div className="flex gap-3">
              <Button onClick={refreshAnalytics} variant="outline" disabled={refreshing} className="shadow-lg">
                <RefreshCw className={`w-4 h-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
              <Button onClick={exportData} variant="outline" className="shadow-lg">
                <Download className="w-4 h-4 mr-2" />
                Export Data
              </Button>
            </div>
          </div>
          
          {/* Key Performance Indicators */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card className="shadow-xl border-0 bg-gradient-to-br from-green-50 to-emerald-50">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-green-600">Success Rate</p>
                    <p className="text-3xl font-bold text-green-700">{getSuccessRate()}%</p>
                    <p className="text-xs text-green-600 mt-1">Product Effectiveness</p>
                  </div>
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                    <CheckCircle className="w-6 h-6 text-green-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="shadow-xl border-0 bg-gradient-to-br from-blue-50 to-cyan-50">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-blue-600">Optimal Price</p>
                    <p className="text-3xl font-bold text-blue-700">{getOptimalPrice()}</p>
                    <p className="text-xs text-blue-600 mt-1">Recommended Price Point</p>
                  </div>
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <DollarSign className="w-6 h-6 text-blue-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="shadow-xl border-0 bg-gradient-to-br from-purple-50 to-violet-50">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-purple-600">Purchase Intent</p>
                    <p className="text-3xl font-bold text-purple-700">{analyticsData.purchase_intent_percentage}%</p>
                    <p className="text-xs text-purple-600 mt-1">Would Buy</p>
                  </div>
                  <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                    <ShoppingCart className="w-6 h-6 text-purple-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="shadow-xl border-0 bg-gradient-to-br from-orange-50 to-amber-50">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-orange-600">Recommendation</p>
                    <p className="text-3xl font-bold text-orange-700">{analyticsData.recommendation_percentage}%</p>
                    <p className="text-xs text-orange-600 mt-1">Would Recommend</p>
                  </div>
                  <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                    <ThumbsUp className="w-6 h-6 text-orange-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="dashboard" className="space-y-6">
          <TabsList className="grid w-full grid-cols-8 bg-white shadow-lg rounded-lg p-1">
            <TabsTrigger value="dashboard" className="rounded-md">Dashboard</TabsTrigger>
            <TabsTrigger value="effectiveness" className="rounded-md">Effectiveness</TabsTrigger>
            <TabsTrigger value="customers" className="rounded-md">Customers</TabsTrigger>
            <TabsTrigger value="pricing" className="rounded-md">Pricing</TabsTrigger>
            <TabsTrigger value="geographic" className="rounded-md">Geographic</TabsTrigger>
            <TabsTrigger value="trends" className="rounded-md">Trends</TabsTrigger>
            <TabsTrigger value="insights" className="rounded-md">Insights</TabsTrigger>
            <TabsTrigger value="raw-data" className="rounded-md">Raw Data</TabsTrigger>
          </TabsList>

          {/* Dashboard Tab */}
          <TabsContent value="dashboard" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Pain Severity Analysis */}
              <Card className="shadow-xl border-0">
                <CardHeader className="bg-gradient-to-r from-red-50 to-orange-50 rounded-t-lg">
                  <CardTitle className="flex items-center text-red-700">
                    <Heart className="w-5 h-5 mr-2" />
                    Pain Severity Distribution
                  </CardTitle>
                  <CardDescription>Analysis by pain level severity</CardDescription>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg border-l-4 border-green-500">
                      <div>
                        <span className="font-semibold text-green-700">Mild Pain</span>
                        <p className="text-sm text-green-600">{analyticsData.pain_severity_distribution.mild} users</p>
                      </div>
                      <div className="flex items-center">
                        <Progress value={analyticsData.pain_severity_distribution.mild / analyticsData.total_submissions * 100} className="w-20 mr-3" />
                        <Badge variant="default" className="bg-green-600">
                          {((analyticsData.pain_severity_distribution.mild / analyticsData.total_submissions) * 100).toFixed(1)}%
                        </Badge>
                      </div>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg border-l-4 border-yellow-500">
                      <div>
                        <span className="font-semibold text-yellow-700">Moderate Pain</span>
                        <p className="text-sm text-yellow-600">{analyticsData.pain_severity_distribution.moderate} users</p>
                      </div>
                      <div className="flex items-center">
                        <Progress value={analyticsData.pain_severity_distribution.moderate / analyticsData.total_submissions * 100} className="w-20 mr-3" />
                        <Badge variant="secondary">
                          {((analyticsData.pain_severity_distribution.moderate / analyticsData.total_submissions) * 100).toFixed(1)}%
                        </Badge>
                      </div>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-orange-50 rounded-lg border-l-4 border-orange-500">
                      <div>
                        <span className="font-semibold text-orange-700">Severe Pain</span>
                        <p className="text-sm text-orange-600">{analyticsData.pain_severity_distribution.severe} users</p>
                      </div>
                      <div className="flex items-center">
                        <Progress value={analyticsData.pain_severity_distribution.severe / analyticsData.total_submissions * 100} className="w-20 mr-3" />
                        <Badge variant="outline">
                          {((analyticsData.pain_severity_distribution.severe / analyticsData.total_submissions) * 100).toFixed(1)}%
                        </Badge>
                      </div>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg border-l-4 border-red-500">
                      <div>
                        <span className="font-semibold text-red-700">Very Severe Pain</span>
                        <p className="text-sm text-red-600">{analyticsData.pain_severity_distribution.very_severe} users</p>
                      </div>
                      <div className="flex items-center">
                        <Progress value={analyticsData.pain_severity_distribution.very_severe / analyticsData.total_submissions * 100} className="w-20 mr-3" />
                        <Badge variant="destructive">
                          {((analyticsData.pain_severity_distribution.very_severe / analyticsData.total_submissions) * 100).toFixed(1)}%
                        </Badge>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Time to Relief */}
              <Card className="shadow-xl border-0">
                <CardHeader className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-t-lg">
                  <CardTitle className="flex items-center text-blue-700">
                    <Clock className="w-5 h-5 mr-2" />
                    Time to Relief Analysis
                  </CardTitle>
                  <CardDescription>Average time to effect: {analyticsData.effectiveness_analysis.average_time_minutes} minutes</CardDescription>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="text-center mb-6">
                    <div className="text-4xl font-bold text-blue-600 mb-2">
                      {analyticsData.effectiveness_analysis.average_time_minutes} min
                    </div>
                    <p className="text-blue-600 font-medium">Average Time to Effect</p>
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center p-2 bg-green-50 rounded-lg border border-green-200">
                      <span className="font-medium text-green-700">≤15 min (Very Fast)</span>
                      <Badge variant="default" className="bg-green-600">{analyticsData.effectiveness_analysis.very_fast} users</Badge>
                    </div>
                    <div className="flex justify-between items-center p-2 bg-blue-50 rounded-lg border border-blue-200">
                      <span className="font-medium text-blue-700">15-30 min (Fast)</span>
                      <Badge variant="secondary">{analyticsData.effectiveness_analysis.fast} users</Badge>
                    </div>
                    <div className="flex justify-between items-center p-2 bg-yellow-50 rounded-lg border border-yellow-200">
                      <span className="font-medium text-yellow-700">30-60 min (Moderate)</span>
                      <Badge variant="outline">{analyticsData.effectiveness_analysis.moderate} users</Badge>
                    </div>
                    <div className="flex justify-between items-center p-2 bg-red-50 rounded-lg border border-red-200">
                      <span className="font-medium text-red-700">&gt;60 min (Slow)</span>
                      <Badge variant="destructive">{analyticsData.effectiveness_analysis.slow + analyticsData.effectiveness_analysis.no_relief} users</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Side Effects & Quick Stats */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Side Effects */}
              <Card className="shadow-xl border-0">
                <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-t-lg">
                  <CardTitle className="flex items-center text-green-700">
                    <AlertCircle className="w-5 h-5 mr-2" />
                    Side Effects Analysis
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="grid grid-cols-1 gap-4">
                    <div className="text-center p-4 bg-green-50 rounded-lg border border-green-200">
                      <CheckCircle className="w-10 h-10 text-green-600 mx-auto mb-2" />
                      <div className="text-3xl font-bold text-green-600">{analyticsData.side_effects.none}</div>
                      <p className="text-green-700 font-medium">No Side Effects</p>
                      <p className="text-sm text-green-600">{((analyticsData.side_effects.none / analyticsData.total_submissions) * 100).toFixed(1)}% of users</p>
                    </div>
                    <div className="text-center p-4 bg-red-50 rounded-lg border border-red-200">
                      <AlertCircle className="w-10 h-10 text-red-600 mx-auto mb-2" />
                      <div className="text-3xl font-bold text-red-600">{analyticsData.side_effects.with_side_effects}</div>
                      <p className="text-red-700 font-medium">With Side Effects</p>
                      <p className="text-sm text-red-600">{((analyticsData.side_effects.with_side_effects / analyticsData.total_submissions) * 100).toFixed(1)}% of users</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Quick Stats */}
              <Card className="shadow-xl border-0">
                <CardHeader className="bg-gradient-to-r from-purple-50 to-violet-50 rounded-t-lg">
                  <CardTitle className="flex items-center text-purple-700">
                    <Activity className="w-5 h-5 mr-2" />
                    Quick Statistics
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div className="text-center p-3 bg-purple-50 rounded-lg">
                      <div className="text-2xl font-bold text-purple-600">{analyticsData.total_submissions}</div>
                      <p className="text-purple-700 text-sm">Total Responses</p>
                    </div>
                    <div className="text-center p-3 bg-blue-50 rounded-lg">
                      <div className="text-2xl font-bold text-blue-600">{analyticsData.geographic_analysis.total_cities}</div>
                      <p className="text-blue-700 text-sm">Cities Represented</p>
                    </div>
                    <div className="text-center p-3 bg-green-50 rounded-lg">
                      <div className="text-2xl font-bold text-green-600">{analyticsData.age_distribution.average_age}</div>
                      <p className="text-green-700 text-sm">Average Age</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Satisfaction Overview */}
              <Card className="shadow-xl border-0">
                <CardHeader className="bg-gradient-to-r from-orange-50 to-amber-50 rounded-t-lg">
                  <CardTitle className="flex items-center text-orange-700">
                    <Star className="w-5 h-5 mr-2" />
                    Satisfaction Overview
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Very Satisfied</span>
                      <div className="flex items-center">
                        <Progress value={analyticsData.satisfaction_percentages.very_satisfied_percentage} className="w-16 mr-2" />
                        <span className="text-sm font-medium">{analyticsData.satisfaction_percentages.very_satisfied_percentage}%</span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Satisfied</span>
                      <div className="flex items-center">
                        <Progress value={analyticsData.satisfaction_percentages.satisfied_percentage} className="w-16 mr-2" />
                        <span className="text-sm font-medium">{analyticsData.satisfaction_percentages.satisfied_percentage}%</span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Neutral</span>
                      <div className="flex items-center">
                        <Progress value={analyticsData.satisfaction_percentages.neutral_percentage} className="w-16 mr-2" />
                        <span className="text-sm font-medium">{analyticsData.satisfaction_percentages.neutral_percentage}%</span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Dissatisfied</span>
                      <div className="flex items-center">
                        <Progress value={analyticsData.satisfaction_percentages.dissatisfied_percentage} className="w-16 mr-2" />
                        <span className="text-sm font-medium">{analyticsData.satisfaction_percentages.dissatisfied_percentage}%</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Effectiveness Tab */}
          <TabsContent value="effectiveness" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Time to Impact */}
              <Card className="shadow-xl border-0">
                <CardHeader className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-t-lg">
                  <CardTitle className="flex items-center text-blue-700">
                    <Clock className="w-5 h-5 mr-2" />
                    Time to Impact Analysis
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="text-center mb-6">
                    <div className="text-4xl font-bold text-blue-600 mb-2">
                      {analyticsData.effectiveness_analysis.average_time_minutes} min
                    </div>
                    <p className="text-blue-600 font-medium">Average Time to Effect</p>
                  </div>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="font-medium">Very Fast (≤15 min)</span>
                      <div className="flex items-center">
                        <Progress value={(analyticsData.effectiveness_analysis.very_fast / analyticsData.total_submissions) * 100} className="w-24 mr-3" />
                        <Badge variant="default" className="bg-green-600">{analyticsData.effectiveness_analysis.very_fast}</Badge>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="font-medium">Fast (15-30 min)</span>
                      <div className="flex items-center">
                        <Progress value={(analyticsData.effectiveness_analysis.fast / analyticsData.total_submissions) * 100} className="w-24 mr-3" />
                        <Badge variant="secondary">{analyticsData.effectiveness_analysis.fast}</Badge>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="font-medium">Moderate (30-60 min)</span>
                      <div className="flex items-center">
                        <Progress value={(analyticsData.effectiveness_analysis.moderate / analyticsData.total_submissions) * 100} className="w-24 mr-3" />
                        <Badge variant="outline">{analyticsData.effectiveness_analysis.moderate}</Badge>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="font-medium">Slow (1-2 hours)</span>
                      <div className="flex items-center">
                        <Progress value={(analyticsData.effectiveness_analysis.slow / analyticsData.total_submissions) * 100} className="w-24 mr-3" />
                        <Badge variant="destructive">{analyticsData.effectiveness_analysis.slow}</Badge>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Side Effects */}
              <Card className="shadow-xl border-0">
                <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-t-lg">
                  <CardTitle className="flex items-center text-green-700">
                    <AlertCircle className="w-5 h-5 mr-2" />
                    Side Effects Analysis
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="grid grid-cols-1 gap-6">
                    <div className="text-center p-6 bg-green-50 rounded-lg border border-green-200">
                      <CheckCircle className="w-12 h-12 text-green-600 mx-auto mb-3" />
                      <div className="text-4xl font-bold text-green-600 mb-2">{analyticsData.side_effects.none}</div>
                      <p className="text-green-700 font-medium text-lg">No Side Effects</p>
                      <p className="text-sm text-green-600 mt-1">{((analyticsData.side_effects.none / analyticsData.total_submissions) * 100).toFixed(1)}% of users</p>
                    </div>
                    <div className="text-center p-6 bg-red-50 rounded-lg border border-red-200">
                      <AlertCircle className="w-12 h-12 text-red-600 mx-auto mb-3" />
                      <div className="text-4xl font-bold text-red-600 mb-2">{analyticsData.side_effects.with_side_effects}</div>
                      <p className="text-red-700 font-medium text-lg">With Side Effects</p>
                      <p className="text-sm text-red-600 mt-1">{((analyticsData.side_effects.with_side_effects / analyticsData.total_submissions) * 100).toFixed(1)}% of users</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Popular Benefits */}
            <Card className="shadow-xl border-0">
              <CardHeader className="bg-gradient-to-r from-purple-50 to-violet-50 rounded-t-lg">
                <CardTitle className="flex items-center text-purple-700">
                  <Heart className="w-5 h-5 mr-2" />
                  Most Reported Benefits
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {analyticsData.popular_symptoms_benefits.map((item, index) => (
                    <div key={index} className="p-4 bg-purple-50 rounded-lg border border-purple-200 hover:shadow-md transition-shadow">
                      <div className="font-semibold text-purple-800 mb-1">{item.symptom_benefit}</div>
                      <div className="text-2xl font-bold text-purple-600">{item.count}</div>
                      <p className="text-purple-700 text-sm">users reported</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Customers Tab */}
          <TabsContent value="customers" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Purchase Intent */}
              <Card className="shadow-xl border-0">
                <CardHeader className="bg-gradient-to-r from-purple-50 to-violet-50 rounded-t-lg">
                  <CardTitle className="flex items-center text-purple-700">
                    <ShoppingCart className="w-5 h-5 mr-2" />
                    Purchase Intent Analysis
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div className="flex justify-between items-center p-4 bg-green-50 rounded-lg border border-green-200">
                      <div>
                        <span className="font-semibold text-green-700">Definitely Buy</span>
                        <p className="text-sm text-green-600">{analyticsData.likely_to_buy} users</p>
                      </div>
                      <Badge variant="default" className="bg-green-600 text-lg px-3 py-1">
                        {((analyticsData.likely_to_buy / analyticsData.total_submissions) * 100).toFixed(1)}%
                      </Badge>
                    </div>
                    <div className="flex justify-between items-center p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                      <div>
                        <span className="font-semibold text-yellow-700">Probably Buy</span>
                        <p className="text-sm text-yellow-600">{analyticsData.maybe_to_buy} users</p>
                      </div>
                      <Badge variant="secondary" className="text-lg px-3 py-1">
                        {((analyticsData.maybe_to_buy / analyticsData.total_submissions) * 100).toFixed(1)}%
                      </Badge>
                    </div>
                    <div className="flex justify-between items-center p-4 bg-red-50 rounded-lg border border-red-200">
                      <div>
                        <span className="font-semibold text-red-700">Unlikely to Buy</span>
                        <p className="text-sm text-red-600">{analyticsData.unlikely_to_buy} users</p>
                      </div>
                      <Badge variant="destructive" className="text-lg px-3 py-1">
                        {((analyticsData.unlikely_to_buy / analyticsData.total_submissions) * 100).toFixed(1)}%
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Community Engagement */}
              <Card className="shadow-xl border-0">
                <CardHeader className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-t-lg">
                  <CardTitle className="flex items-center text-blue-700">
                    <Users className="w-5 h-5 mr-2" />
                    Community Engagement
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div className="flex justify-between items-center p-3 bg-purple-50 rounded-lg border border-purple-200">
                      <span className="font-medium text-purple-700">Volunteer Interest</span>
                      <Badge variant="default" className="bg-purple-600">{analyticsData.community_engagement.volunteer_interested} users</Badge>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg border border-blue-200">
                      <span className="font-medium text-blue-700">Campaign Interest</span>
                      <Badge variant="secondary">{analyticsData.community_engagement.campaign_interested} users</Badge>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg border border-green-200">
                      <span className="font-medium text-green-700">Testimonial Permission</span>
                      <Badge variant="outline">{analyticsData.community_engagement.testimonial_permitted} users</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Launch Readiness */}
            <Card className="shadow-xl border-0">
              <CardHeader className="bg-gradient-to-r from-orange-50 to-amber-50 rounded-t-lg">
                <CardTitle className="flex items-center text-orange-700">
                  <Zap className="w-5 h-5 mr-2" />
                  Launch Readiness Assessment
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center p-6 bg-green-50 rounded-lg border border-green-200">
                    <div className="text-4xl font-bold text-green-600 mb-2">{getSuccessRate()}%</div>
                    <p className="text-green-700 font-medium text-lg">Success Rate</p>
                    <p className="text-sm text-green-600">Product Effectiveness</p>
                  </div>
                  <div className="text-center p-6 bg-blue-50 rounded-lg border border-blue-200">
                    <div className="text-4xl font-bold text-blue-600 mb-2">{analyticsData.purchase_intent_percentage}%</div>
                    <p className="text-blue-700 font-medium text-lg">Purchase Intent</p>
                    <p className="text-sm text-blue-600">Market Demand</p>
                  </div>
                  <div className="text-center p-6 bg-purple-50 rounded-lg border border-purple-200">
                    <div className="text-4xl font-bold text-purple-600 mb-2">{analyticsData.recommendation_percentage}%</div>
                    <p className="text-purple-700 font-medium text-lg">Recommendation Rate</p>
                    <p className="text-sm text-purple-600">Word-of-Mouth Potential</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Pricing Tab */}
          <TabsContent value="pricing" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Price Analysis */}
              <Card className="shadow-xl border-0">
                <CardHeader className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-t-lg">
                  <CardTitle className="flex items-center text-blue-700">
                    <DollarSign className="w-5 h-5 mr-2" />
                    Price Sensitivity Analysis
                  </CardTitle>
                  <CardDescription>
                    Based on {analyticsData.price_analysis.total_responses} responses
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div className="flex justify-between items-center p-4 bg-green-50 rounded-lg border border-green-200">
                      <div>
                        <span className="font-semibold text-green-700">Very Affordable (₹55)</span>
                        <p className="text-sm text-green-600">{analyticsData.price_analysis.affordable} responses</p>
                      </div>
                      <Badge variant="default" className="bg-green-600 text-lg px-3 py-1">
                        {((analyticsData.price_analysis.affordable / analyticsData.price_analysis.total_responses) * 100).toFixed(1)}%
                      </Badge>
                    </div>
                    <div className="flex justify-between items-center p-4 bg-blue-50 rounded-lg border border-blue-200">
                      <div>
                        <span className="font-semibold text-blue-700">Reasonable (₹70)</span>
                        <p className="text-sm text-blue-600">Acceptable price range</p>
                      </div>
                      <Badge variant="outline" className="text-lg px-3 py-1">Consider</Badge>
                    </div>
                    <div className="flex justify-between items-center p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                      <div>
                        <span className="font-semibold text-yellow-700">Acceptable (₹90)</span>
                        <p className="text-sm text-yellow-600">{analyticsData.price_analysis.acceptable_price} responses</p>
                      </div>
                      <Badge variant="secondary" className="text-lg px-3 py-1">
                        {((analyticsData.price_analysis.acceptable_price / analyticsData.price_analysis.total_responses) * 100).toFixed(1)}%
                      </Badge>
                    </div>
                    <div className="flex justify-between items-center p-4 bg-red-50 rounded-lg border border-red-200">
                      <div>
                        <span className="font-semibold text-red-700">Expensive (₹120)</span>
                        <p className="text-sm text-red-600">{analyticsData.price_analysis.expensive + analyticsData.price_analysis.very_expensive} responses</p>
                      </div>
                      <Badge variant="destructive" className="text-lg px-3 py-1">
                        {(((analyticsData.price_analysis.expensive + analyticsData.price_analysis.very_expensive) / analyticsData.price_analysis.total_responses) * 100).toFixed(1)}%
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Price Recommendation */}
              <Card className="shadow-xl border-0">
                <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-t-lg">
                  <CardTitle className="flex items-center text-green-700">
                    <Target className="w-5 h-5 mr-2" />
                    Price Recommendation
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="text-center p-8 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-200">
                    <div className="text-6xl font-bold text-blue-600 mb-4">{getOptimalPrice()}</div>
                    <p className="text-blue-700 font-semibold text-xl mb-6">Recommended Price Point</p>
                    <div className="text-sm text-gray-600 space-y-2">
                      <p>• Based on price sensitivity analysis</p>
                      <p>• Balances affordability with value perception</p>
                      <p>• Maximizes purchase intent</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Geographic Tab */}
          <TabsContent value="geographic" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Geographic Distribution */}
              <Card className="shadow-xl border-0">
                <CardHeader className="bg-gradient-to-r from-purple-50 to-violet-50 rounded-t-lg">
                  <CardTitle className="flex items-center text-purple-700">
                    <MapPin className="w-5 h-5 mr-2" />
                    Geographic Distribution
                  </CardTitle>
                  <CardDescription>
                    {analyticsData.geographic_analysis.total_cities} cities represented
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-3">
                    {analyticsData.geographic_analysis.top_cities.map((city, index) => (
                      <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg border border-gray-200 hover:shadow-md transition-shadow">
                        <span className="font-medium text-gray-700">{city.city}</span>
                        <Badge variant="outline" className="text-lg px-3 py-1">{city.count} users</Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Age Distribution */}
              <Card className="shadow-xl border-0">
                <CardHeader className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-t-lg">
                  <CardTitle className="flex items-center text-blue-700">
                    <Users className="w-5 h-5 mr-2" />
                    Age Distribution
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="text-center mb-6">
                    <div className="text-3xl font-bold text-blue-600 mb-2">{analyticsData.age_distribution.average_age}</div>
                    <p className="text-blue-600 font-medium">Average Age</p>
                  </div>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="font-medium">Under 25</span>
                      <div className="flex items-center">
                        <Progress value={analyticsData.age_distribution.under_25 / analyticsData.total_submissions * 100} className="w-24 mr-3" />
                        <Badge variant="outline">{analyticsData.age_distribution.under_25}</Badge>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="font-medium">25-34 (Primary)</span>
                      <div className="flex items-center">
                        <Progress value={analyticsData.age_distribution.age_25_34 / analyticsData.total_submissions * 100} className="w-24 mr-3" />
                        <Badge variant="default" className="bg-blue-600">{analyticsData.age_distribution.age_25_34}</Badge>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="font-medium">35-44</span>
                      <div className="flex items-center">
                        <Progress value={analyticsData.age_distribution.age_35_44 / analyticsData.total_submissions * 100} className="w-24 mr-3" />
                        <Badge variant="secondary">{analyticsData.age_distribution.age_35_44}</Badge>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="font-medium">Over 45</span>
                      <div className="flex items-center">
                        <Progress value={analyticsData.age_distribution.over_45 / analyticsData.total_submissions * 100} className="w-24 mr-3" />
                        <Badge variant="outline">{analyticsData.age_distribution.over_45}</Badge>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Pain Severity by Region */}
            <Card className="shadow-xl border-0">
              <CardHeader className="bg-gradient-to-r from-red-50 to-orange-50 rounded-t-lg">
                <CardTitle className="flex items-center text-red-700">
                  <Heart className="w-5 h-5 mr-2" />
                  Pain Severity Distribution
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="text-center p-6 bg-green-50 rounded-lg border border-green-200">
                    <div className="text-3xl font-bold text-green-600 mb-2">{analyticsData.pain_severity_distribution.mild}</div>
                    <p className="text-green-700 font-medium">Mild Pain</p>
                    <p className="text-sm text-green-600">{((analyticsData.pain_severity_distribution.mild / analyticsData.total_submissions) * 100).toFixed(1)}%</p>
                  </div>
                  <div className="text-center p-6 bg-yellow-50 rounded-lg border border-yellow-200">
                    <div className="text-3xl font-bold text-yellow-600 mb-2">{analyticsData.pain_severity_distribution.moderate}</div>
                    <p className="text-yellow-700 font-medium">Moderate Pain</p>
                    <p className="text-sm text-yellow-600">{((analyticsData.pain_severity_distribution.moderate / analyticsData.total_submissions) * 100).toFixed(1)}%</p>
                  </div>
                  <div className="text-center p-6 bg-orange-50 rounded-lg border border-orange-200">
                    <div className="text-3xl font-bold text-orange-600 mb-2">{analyticsData.pain_severity_distribution.severe}</div>
                    <p className="text-orange-700 font-medium">Severe Pain</p>
                    <p className="text-sm text-orange-600">{((analyticsData.pain_severity_distribution.severe / analyticsData.total_submissions) * 100).toFixed(1)}%</p>
                  </div>
                  <div className="text-center p-6 bg-red-50 rounded-lg border border-red-200">
                    <div className="text-3xl font-bold text-red-600 mb-2">{analyticsData.pain_severity_distribution.very_severe}</div>
                    <p className="text-red-700 font-medium">Very Severe</p>
                    <p className="text-sm text-red-600">{((analyticsData.pain_severity_distribution.very_severe / analyticsData.total_submissions) * 100).toFixed(1)}%</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Trends Tab */}
          <TabsContent value="trends" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Satisfaction Trends */}
              <Card className="shadow-xl border-0">
                <CardHeader className="bg-gradient-to-r from-orange-50 to-amber-50 rounded-t-lg">
                  <CardTitle className="flex items-center text-orange-700">
                    <Star className="w-5 h-5 mr-2" />
                    Satisfaction Trends
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="font-medium">Very Satisfied</span>
                      <div className="flex items-center">
                        <Progress value={analyticsData.satisfaction_percentages.very_satisfied_percentage} className="w-24 mr-3" />
                        <span className="font-medium">{analyticsData.satisfaction_percentages.very_satisfied_percentage}%</span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="font-medium">Satisfied</span>
                      <div className="flex items-center">
                        <Progress value={analyticsData.satisfaction_percentages.satisfied_percentage} className="w-24 mr-3" />
                        <span className="font-medium">{analyticsData.satisfaction_percentages.satisfied_percentage}%</span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="font-medium">Neutral</span>
                      <div className="flex items-center">
                        <Progress value={analyticsData.satisfaction_percentages.neutral_percentage} className="w-24 mr-3" />
                        <span className="font-medium">{analyticsData.satisfaction_percentages.neutral_percentage}%</span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="font-medium">Dissatisfied</span>
                      <div className="flex items-center">
                        <Progress value={analyticsData.satisfaction_percentages.dissatisfied_percentage} className="w-24 mr-3" />
                        <span className="font-medium">{analyticsData.satisfaction_percentages.dissatisfied_percentage}%</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Effectiveness Percentages */}
              <Card className="shadow-xl border-0">
                <CardHeader className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-t-lg">
                  <CardTitle className="flex items-center text-blue-700">
                    <Zap className="w-5 h-5 mr-2" />
                    Effectiveness Percentages
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="font-medium">Very Fast</span>
                      <div className="flex items-center">
                        <Progress value={analyticsData.effectiveness_percentages.very_fast_percentage} className="w-24 mr-3" />
                        <span className="font-medium">{analyticsData.effectiveness_percentages.very_fast_percentage}%</span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="font-medium">Fast</span>
                      <div className="flex items-center">
                        <Progress value={analyticsData.effectiveness_percentages.fast_percentage} className="w-24 mr-3" />
                        <span className="font-medium">{analyticsData.effectiveness_percentages.fast_percentage}%</span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="font-medium">Moderate</span>
                      <div className="flex items-center">
                        <Progress value={analyticsData.effectiveness_percentages.moderate_percentage} className="w-24 mr-3" />
                        <span className="font-medium">{analyticsData.effectiveness_percentages.moderate_percentage}%</span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="font-medium">Slow</span>
                      <div className="flex items-center">
                        <Progress value={analyticsData.effectiveness_percentages.slow_percentage} className="w-24 mr-3" />
                        <span className="font-medium">{analyticsData.effectiveness_percentages.slow_percentage}%</span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="font-medium">No Relief</span>
                      <div className="flex items-center">
                        <Progress value={analyticsData.effectiveness_percentages.no_relief_percentage} className="w-24 mr-3" />
                        <span className="font-medium">{analyticsData.effectiveness_percentages.no_relief_percentage}%</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Popular Preferences */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Popular Flavor Preferences */}
              <Card className="shadow-xl border-0">
                <CardHeader className="bg-gradient-to-r from-pink-50 to-rose-50 rounded-t-lg">
                  <CardTitle className="flex items-center text-pink-700">
                    <ThumbsUp className="w-5 h-5 mr-2" />
                    Popular Flavor Preferences
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {analyticsData.popular_flavor_preferences.map((flavor, index) => (
                      <div key={index} className="text-center p-4 bg-pink-50 rounded-lg border border-pink-200">
                        <Badge variant="outline" className="text-xs bg-pink-100 text-pink-800 mb-2">{flavor.flavor}</Badge>
                        <div className="text-2xl font-bold text-pink-600">{flavor.count}</div>
                        <p className="text-pink-700 text-sm">Users</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Popular Symptoms & Benefits */}
              <Card className="shadow-xl border-0">
                <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-t-lg">
                  <CardTitle className="flex items-center text-green-700">
                    <Heart className="w-5 h-5 mr-2" />
                    Popular Symptoms & Benefits
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {analyticsData.popular_symptoms_benefits.map((item, index) => (
                      <div key={index} className="text-center p-4 bg-green-50 rounded-lg border border-green-200">
                        <Badge variant="outline" className="text-xs bg-green-100 text-green-800 mb-2">{item.symptom_benefit}</Badge>
                        <div className="text-2xl font-bold text-green-600">{item.count}</div>
                        <p className="text-green-700 text-sm">Users</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Insights Tab */}
          <TabsContent value="insights" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Key Insights */}
              <Card className="shadow-xl border-0">
                <CardHeader className="bg-gradient-to-r from-purple-50 to-violet-50 rounded-t-lg">
                  <CardTitle className="flex items-center text-purple-700">
                    <Eye className="w-5 h-5 mr-2" />
                    Key Insights
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                      <h4 className="font-semibold text-green-700 mb-2">🎯 Success Rate</h4>
                      <p className="text-green-600 text-sm">Your product has a {getSuccessRate()}% success rate, indicating strong effectiveness.</p>
                    </div>
                    <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                      <h4 className="font-semibold text-blue-700 mb-2">💰 Optimal Pricing</h4>
                      <p className="text-blue-600 text-sm">Recommended price point is {getOptimalPrice()} based on customer feedback.</p>
                    </div>
                    <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                      <h4 className="font-semibold text-purple-700 mb-2">⚡ Fast Relief</h4>
                      <p className="text-purple-600 text-sm">Average time to effect is {analyticsData.effectiveness_analysis.average_time_minutes} minutes.</p>
                    </div>
                    <div className="p-4 bg-orange-50 rounded-lg border border-orange-200">
                      <h4 className="font-semibold text-orange-700 mb-2">👥 Community Ready</h4>
                      <p className="text-orange-600 text-sm">{analyticsData.community_engagement.volunteer_interested} users interested in volunteering.</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Recommendations */}
              <Card className="shadow-xl border-0">
                <CardHeader className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-t-lg">
                  <CardTitle className="flex items-center text-blue-700">
                    <Award className="w-5 h-5 mr-2" />
                    Strategic Recommendations
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                      <h4 className="font-semibold text-green-700 mb-2">✅ Launch Ready</h4>
                      <p className="text-green-600 text-sm">High success rate and purchase intent suggest readiness for full launch.</p>
                    </div>
                    <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                      <h4 className="font-semibold text-blue-700 mb-2">🎯 Target Focus</h4>
                      <p className="text-blue-600 text-sm">Focus on age group 25-34 as primary target market.</p>
                    </div>
                    <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                      <h4 className="font-semibold text-purple-700 mb-2">📈 Growth Strategy</h4>
                      <p className="text-purple-600 text-sm">Leverage high recommendation rate for word-of-mouth marketing.</p>
                    </div>
                    <div className="p-4 bg-orange-50 rounded-lg border border-orange-200">
                      <h4 className="font-semibold text-orange-700 mb-2">🌍 Geographic Expansion</h4>
                      <p className="text-orange-600 text-sm">Consider expanding to cities with high user concentration.</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Recent Activity */}
            <Card className="shadow-xl border-0">
              <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-t-lg">
                <CardTitle className="flex items-center text-green-700">
                  <Activity className="w-5 h-5 mr-2" />
                  Recent Activity
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="text-center p-6 bg-blue-50 rounded-lg border border-blue-200">
                    <div className="text-3xl font-bold text-blue-600 mb-2">{analyticsData.recent_activity.last_7_days}</div>
                    <p className="text-blue-700 font-medium text-lg">Last 7 Days</p>
                    <p className="text-sm text-blue-600">New submissions</p>
                  </div>
                  <div className="text-center p-6 bg-purple-50 rounded-lg border border-purple-200">
                    <div className="text-3xl font-bold text-purple-600 mb-2">{analyticsData.recent_activity.last_30_days}</div>
                    <p className="text-purple-700 font-medium text-lg">Last 30 Days</p>
                    <p className="text-sm text-purple-600">Total submissions</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Raw Data Tab */}
          <TabsContent value="raw-data" className="space-y-6">
            <Card className="shadow-xl border-0">
              <CardHeader className="bg-gradient-to-r from-gray-50 to-slate-50 rounded-t-lg">
                <CardTitle className="flex items-center text-gray-700">
                  <BarChart3 className="w-5 h-5 mr-2" />
                  Detailed Customer Feedback
                </CardTitle>
                <CardDescription>
                  Complete view of all feedback submissions
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-4 max-h-96 overflow-y-auto">
                  {rawData.map((submission, index) => (
                    <div key={submission.id || index} className="p-4 border rounded-lg bg-gray-50 hover:shadow-md transition-shadow">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h4 className="font-semibold text-gray-800">{submission.first_name} {submission.last_name}</h4>
                          <p className="text-sm text-gray-600">{submission.email}</p>
                          <p className="text-sm text-gray-500">{submission.phone} • {submission.city}</p>
                        </div>
                        <div className="text-right">
                          <div className="text-sm text-gray-500">
                            {new Date(submission.created_at).toLocaleDateString()}
                          </div>
                          <div className="flex items-center mt-1">
                            <Star className="w-4 h-4 text-yellow-500 mr-1" />
                            <span className="text-sm font-medium">{submission.overall_satisfaction}/5</span>
                          </div>
                        </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                        <div><strong>Age:</strong> {submission.age || 'N/A'}</div>
                        <div><strong>Pain Severity:</strong> {submission.pain_severity || 'N/A'}</div>
                        <div><strong>Purchase Intent:</strong> {submission.purchase_intent || 'N/A'}</div>
                        <div><strong>Would Recommend:</strong> {submission.would_recommend || 'N/A'}</div>
                        <div><strong>Side Effects:</strong> {submission.side_effects || 'N/A'}</div>
                        <div><strong>Effect Speed:</strong> {submission.effect_speed || 'N/A'}</div>
                        <div><strong>Taste Rating:</strong> {submission.taste_rating ? `${submission.taste_rating}/5` : 'N/A'}</div>
                        <div><strong>Value Rating:</strong> {submission.value_rating ? `${submission.value_rating}/5` : 'N/A'}</div>
                        <div><strong>Price Feedback:</strong> {submission.price_feedback || 'N/A'}</div>
                        <div><strong>Volunteer Interest:</strong> {submission.volunteer_interest || 'N/A'}</div>
                        <div><strong>Campaign Interest:</strong> {submission.face_and_soul_campaign || 'N/A'}</div>
                        <div><strong>Testimonial Permission:</strong> {submission.testimonial_permission || 'N/A'}</div>
                      </div>
                      
                      {/* Taste Preferences */}
                      {submission.flavor_preferences && Array.isArray(submission.flavor_preferences) && submission.flavor_preferences.length > 0 && (
                        <div className="mt-3">
                          <strong className="text-sm">Taste Preferences:</strong>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {submission.flavor_preferences.map((preference: string, i: number) => (
                              <Badge key={i} variant="outline" className="text-xs bg-blue-50">
                                {preference}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Benefits Experienced */}
                      {submission.benefits_experienced && Array.isArray(submission.benefits_experienced) && submission.benefits_experienced.length > 0 && (
                        <div className="mt-3">
                          <strong className="text-sm">Benefits:</strong>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {submission.benefits_experienced.map((benefit: string, i: number) => (
                              <Badge key={i} variant="outline" className="text-xs bg-green-50">
                                {benefit}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Additional Details */}
                      <div className="mt-3 pt-3 border-t">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs text-gray-600">
                          <div><strong>Previous Pain Management:</strong> {submission.previous_pain_management || 'N/A'}</div>
                          <div><strong>Frequency of Use:</strong> {submission.frequency_of_use || 'N/A'}</div>
                          <div><strong>Preparation Method:</strong> {submission.preparation_method || 'N/A'}</div>
                          <div><strong>Confidence Boost:</strong> {submission.confidence_boost || 'N/A'}</div>
                          <div><strong>Current Feeling:</strong> {submission.current_feeling || 'N/A'}</div>
                          <div><strong>Improvements:</strong> {submission.improvements || 'N/A'}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
} 