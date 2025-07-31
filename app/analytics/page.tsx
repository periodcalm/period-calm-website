"use client"

import { useState, useEffect, useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  RefreshCw, 
  Trash2, 
  AlertCircle, 
  CheckCircle, 
  Users, 
  Star, 
  TrendingUp,
  Download,
  Search,
  Filter,
  Calendar,
  MapPin,
  Heart,
  Zap,
  Target,
  BarChart3,
  PieChart,
  Activity,
  UserCheck,
  Clock,
  DollarSign,
  Award,
  MessageSquare,
  ThumbsUp,
  Eye,
  Download as DownloadIcon,
  Lock,
  Shield
} from 'lucide-react'

interface Submission {
  id: string
  first_name: string
  last_name: string
  age?: string
  email: string
  phone?: string
  city?: string
  state?: string
  instagram?: string
  cycle_length?: string
  last_period_date?: string
  period_regularity?: string
  previous_pain_management?: string
  pain_severity?: string
  when_tried?: string
  timing_of_use?: string
  frequency_of_use?: string
  preparation_method?: string
  effect_speed?: string
  overall_satisfaction: number
  would_drink_again?: string
  benefits_experienced?: string[]
  side_effects?: string
  taste_rating: number
  value_rating: number
  packaging_rating: number
  convenience_rating?: string
  storage_experience?: string
  dosage_followed?: string
  budget_range?: string
  price_points?: string
  purchase_intent?: string
  lifestyle_impact?: string[]
  self_care_essentials?: string[]
  current_feeling?: string
  confidence_boost?: string
  face_and_soul_campaign?: string
  community_interest?: string
  volunteer_interest?: string
  testimonial_permission?: string
  improvements?: string
  would_recommend?: string
  price_feedback?: string
  final_thoughts?: string
  submitted_at: string
  source: string
}

interface AnalyticsData {
  totalSubmissions: number
  averageSatisfaction: number
  averageTasteRating: number
  averageValueRating: number
  averagePackagingRating: number
  recentSubmissions: Submission[]
  submissions: Submission[]
}

interface FilterState {
  search: string
  dateRange: string
  satisfactionFilter: string
  ageFilter: string
  cityFilter: string
}

export default function AnalyticsPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null)
  const [filterState, setFilterState] = useState<FilterState>({
    search: '',
    dateRange: 'all',
    satisfactionFilter: 'all',
    ageFilter: 'all',
    cityFilter: 'all'
  })

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    // Simulate loading delay
    setTimeout(() => {
      if (password === 'Piyush@0502') {
        setIsAuthenticated(true)
        setError('')
      } else {
        setError('Incorrect password. Please try again.')
        setPassword('')
      }
      setIsLoading(false)
    }, 500)
  }

  const fetchAnalytics = async () => {
    try {
      setIsLoading(true)
      const response = await fetch('/api/analytics')
      if (!response.ok) {
        throw new Error('Failed to fetch analytics data')
      }
      const result = await response.json()
      if (result.success) {
        setAnalyticsData(result.data)
        console.log('📊 Analytics data loaded:', result.data)
      } else {
        throw new Error('Failed to load analytics data')
      }
    } catch (err) {
      console.error('Error fetching analytics:', err)
      setError('Failed to load analytics data')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (isAuthenticated) {
      fetchAnalytics()
    }
  }, [isAuthenticated])

  // Filter data based on current filters
  const filteredData = useMemo(() => {
    if (!analyticsData?.submissions) return []

    let filtered = analyticsData.submissions

    // Search filter
    if (filterState.search) {
      const searchLower = filterState.search.toLowerCase()
      filtered = filtered.filter(sub => 
        sub.first_name?.toLowerCase().includes(searchLower) ||
        sub.last_name?.toLowerCase().includes(searchLower) ||
        sub.email?.toLowerCase().includes(searchLower) ||
        sub.city?.toLowerCase().includes(searchLower) ||
        sub.phone?.includes(searchLower)
      )
    }

    // Date range filter
    if (filterState.dateRange !== 'all') {
      const now = new Date()
      const daysAgo = parseInt(filterState.dateRange)
      const cutoffDate = new Date(now.getTime() - (daysAgo * 24 * 60 * 60 * 1000))
      
      filtered = filtered.filter(sub => {
        const submissionDate = new Date(sub.submitted_at)
        return submissionDate >= cutoffDate
      })
    }

    // Satisfaction filter
    if (filterState.satisfactionFilter !== 'all') {
      const minRating = parseInt(filterState.satisfactionFilter)
      filtered = filtered.filter(sub => sub.overall_satisfaction >= minRating)
    }

    // Age filter
    if (filterState.ageFilter !== 'all') {
      const [minAge, maxAge] = filterState.ageFilter.split('-').map(Number)
      filtered = filtered.filter(sub => {
        const age = parseInt(sub.age || '0')
        return age >= minAge && age <= maxAge
      })
    }

    // City filter
    if (filterState.cityFilter !== 'all') {
      filtered = filtered.filter(sub => 
        sub.city?.toLowerCase() === filterState.cityFilter.toLowerCase()
      )
    }

    return filtered
  }, [analyticsData, filterState])

  // Advanced Analytics Calculations - Optimized with better error handling
  const advancedAnalytics = useMemo(() => {
    if (!filteredData.length) return null

    const total = filteredData.length

    // Basic Metrics with validation
    const satisfactionSum = filteredData.reduce((sum, sub) => {
      const rating = Number(sub.overall_satisfaction) || 0
      return sum + (rating >= 1 && rating <= 5 ? rating : 0)
    }, 0)
    
    const tasteSum = filteredData.reduce((sum, sub) => {
      const rating = Number(sub.taste_rating) || 0
      return sum + (rating >= 1 && rating <= 5 ? rating : 0)
    }, 0)
    
    const valueSum = filteredData.reduce((sum, sub) => {
      const rating = Number(sub.value_rating) || 0
      return sum + (rating >= 1 && rating <= 5 ? rating : 0)
    }, 0)
    
    const packagingSum = filteredData.reduce((sum, sub) => {
      const rating = Number(sub.packaging_rating) || 0
      return sum + (rating >= 1 && rating <= 5 ? rating : 0)
    }, 0)

    // Satisfaction Distribution
    const satisfactionDistribution = {
      5: filteredData.filter(sub => sub.overall_satisfaction === 5).length,
      4: filteredData.filter(sub => sub.overall_satisfaction === 4).length,
      3: filteredData.filter(sub => sub.overall_satisfaction === 3).length,
      2: filteredData.filter(sub => sub.overall_satisfaction === 2).length,
      1: filteredData.filter(sub => sub.overall_satisfaction === 1).length,
    }

    // Age Distribution
    const ageDistribution = filteredData.reduce((acc, sub) => {
      if (!sub.age) return acc
      const age = parseInt(sub.age)
      if (age >= 18 && age <= 25) acc['18-25'] = (acc['18-25'] || 0) + 1
      else if (age >= 26 && age <= 35) acc['26-35'] = (acc['26-35'] || 0) + 1
      else if (age >= 36 && age <= 45) acc['36-45'] = (acc['36-45'] || 0) + 1
      else if (age > 45) acc['45+'] = (acc['45+'] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    // Pain Severity Analysis
    const painSeverityDistribution = filteredData.reduce((acc, sub) => {
      if (sub.pain_severity) {
        acc[sub.pain_severity] = (acc[sub.pain_severity] || 0) + 1
      }
      return acc
    }, {} as Record<string, number>)

    // Benefits Analysis
    const benefitsDistribution = filteredData.reduce((acc, sub) => {
      if (sub.benefits_experienced) {
        sub.benefits_experienced.forEach(benefit => {
          acc[benefit] = (acc[benefit] || 0) + 1
        })
      }
      return acc
    }, {} as Record<string, number>)

    // Geographic Analysis
    const cityDistribution = filteredData.reduce((acc, sub) => {
      if (sub.city) {
        acc[sub.city] = (acc[sub.city] || 0) + 1
      }
      return acc
    }, {} as Record<string, number>)

    // Purchase Intent Analysis
    const purchaseIntentDistribution = filteredData.reduce((acc, sub) => {
      if (sub.purchase_intent) {
        acc[sub.purchase_intent] = (acc[sub.purchase_intent] || 0) + 1
      }
      return acc
    }, {} as Record<string, number>)

    // Price Preference Analysis
    const pricePreferenceDistribution = filteredData.reduce((acc, sub) => {
      if (sub.price_points) {
        acc[sub.price_points] = (acc[sub.price_points] || 0) + 1
      }
      return acc
    }, {} as Record<string, number>)

    // Effect Speed Analysis
    const effectSpeedDistribution = filteredData.reduce((acc, sub) => {
      if (sub.effect_speed) {
        acc[sub.effect_speed] = (acc[sub.effect_speed] || 0) + 1
      }
      return acc
    }, {} as Record<string, number>)

    // Cycle Length Analysis
    const cycleLengthDistribution = filteredData.reduce((acc, sub) => {
      if (sub.cycle_length) {
        acc[sub.cycle_length] = (acc[sub.cycle_length] || 0) + 1
      }
      return acc
    }, {} as Record<string, number>)

    // Usage Frequency Analysis
    const usageFrequencyDistribution = filteredData.reduce((acc, sub) => {
      if (sub.frequency_of_use) {
        acc[sub.frequency_of_use] = (acc[sub.frequency_of_use] || 0) + 1
      }
      return acc
    }, {} as Record<string, number>)

    // Preparation Method Analysis
    const preparationMethodDistribution = filteredData.reduce((acc, sub) => {
      if (sub.preparation_method) {
        acc[sub.preparation_method] = (acc[sub.preparation_method] || 0) + 1
      }
      return acc
    }, {} as Record<string, number>)

    // Timing Analysis
    const timingDistribution = filteredData.reduce((acc, sub) => {
      if (sub.timing_of_use) {
        acc[sub.timing_of_use] = (acc[sub.timing_of_use] || 0) + 1
      }
      return acc
    }, {} as Record<string, number>)

    // Side Effects Analysis
    const sideEffectsDistribution = filteredData.reduce((acc, sub) => {
      if (sub.side_effects) {
        acc[sub.side_effects] = (acc[sub.side_effects] || 0) + 1
      }
      return acc
    }, {} as Record<string, number>)

    // Confidence Boost Analysis
    const confidenceBoostDistribution = filteredData.reduce((acc, sub) => {
      if (sub.confidence_boost) {
        acc[sub.confidence_boost] = (acc[sub.confidence_boost] || 0) + 1
      }
      return acc
    }, {} as Record<string, number>)

    // Community Interest Analysis
    const communityInterestDistribution = filteredData.reduce((acc, sub) => {
      if (sub.community_interest) {
        acc[sub.community_interest] = (acc[sub.community_interest] || 0) + 1
      }
      return acc
    }, {} as Record<string, number>)

    // Recommendation Analysis
    const recommendationDistribution = filteredData.reduce((acc, sub) => {
      if (sub.would_recommend) {
        acc[sub.would_recommend] = (acc[sub.would_recommend] || 0) + 1
      }
      return acc
    }, {} as Record<string, number>)

    // Volunteer Interest Analysis
    const volunteerInterestDistribution = filteredData.reduce((acc, sub) => {
      if (sub.volunteer_interest) {
        acc[sub.volunteer_interest] = (acc[sub.volunteer_interest] || 0) + 1
      }
      return acc
    }, {} as Record<string, number>)

    // Campaign Participation Analysis
    const campaignParticipationDistribution = filteredData.reduce((acc, sub) => {
      if (sub.face_and_soul_campaign) {
        acc[sub.face_and_soul_campaign] = (acc[sub.face_and_soul_campaign] || 0) + 1
      }
      return acc
    }, {} as Record<string, number>)

    // Testimonial Permission Analysis
    const testimonialPermissionDistribution = filteredData.reduce((acc, sub) => {
      if (sub.testimonial_permission) {
        acc[sub.testimonial_permission] = (acc[sub.testimonial_permission] || 0) + 1
      }
      return acc
    }, {} as Record<string, number>)

    // Calculate Insights
    const insights = {
      conversionRate: Math.round((filteredData.filter(sub => sub.purchase_intent?.includes('definitely') || sub.purchase_intent?.includes('yes')).length / total) * 100),
      highSatisfactionRate: Math.round((filteredData.filter(sub => sub.overall_satisfaction >= 4).length / total) * 100),
      lowSatisfactionRate: Math.round((filteredData.filter(sub => sub.overall_satisfaction <= 2).length / total) * 100),
      averageEffectSpeed: Math.round((filteredData.filter(sub => sub.effect_speed).length / total) * 100),
      purchaseIntentRate: Math.round((filteredData.filter(sub => sub.purchase_intent?.includes('definitely') || sub.purchase_intent?.includes('yes')).length / total) * 100),
      averagePricePreference: Math.round((filteredData.filter(sub => sub.price_points).length / total) * 100),
      topBenefits: Object.entries(benefitsDistribution).sort(([,a], [,b]) => b - a).slice(0, 5),
      topCities: Object.entries(cityDistribution).sort(([,a], [,b]) => b - a).slice(0, 5),
      mostCommonPainSeverity: Object.entries(painSeverityDistribution).sort(([,a], [,b]) => b - a)[0]?.[0] || 'N/A',
      mostEffectiveTiming: Object.entries(timingDistribution).sort(([,a], [,b]) => b - a)[0]?.[0] || 'N/A',
      mostPopularPreparation: Object.entries(preparationMethodDistribution).sort(([,a], [,b]) => b - a)[0]?.[0] || 'N/A',
      communityEngagementRate: Math.round((filteredData.filter(sub => sub.community_interest?.includes('yes')).length / total) * 100),
      confidenceBoostRate: Math.round((filteredData.filter(sub => sub.confidence_boost?.includes('yes')).length / total) * 100),
      recommendationRate: Math.round((filteredData.filter(sub => sub.would_recommend?.includes('definitely') || sub.would_recommend?.includes('yes')).length / total) * 100),
      volunteerInterestRate: Math.round((filteredData.filter(sub => sub.volunteer_interest?.includes('yes')).length / total) * 100),
      campaignParticipationRate: Math.round((filteredData.filter(sub => sub.face_and_soul_campaign?.includes('yes')).length / total) * 100),
      testimonialPermissionRate: Math.round((filteredData.filter(sub => sub.testimonial_permission?.includes('yes')).length / total) * 100),
    }

    return {
      total,
      averages: {
        satisfaction: total > 0 ? Math.round((satisfactionSum / total) * 10) / 10 : 0,
        taste: total > 0 ? Math.round((tasteSum / total) * 10) / 10 : 0,
        value: total > 0 ? Math.round((valueSum / total) * 10) / 10 : 0,
        packaging: total > 0 ? Math.round((packagingSum / total) * 10) / 10 : 0,
      },
      distributions: {
        satisfaction: satisfactionDistribution,
        age: ageDistribution,
        painSeverity: painSeverityDistribution,
        benefits: benefitsDistribution,
        city: cityDistribution,
        purchaseIntent: purchaseIntentDistribution,
        pricePreference: pricePreferenceDistribution,
        effectSpeed: effectSpeedDistribution,
        cycleLength: cycleLengthDistribution,
        usageFrequency: usageFrequencyDistribution,
        preparationMethod: preparationMethodDistribution,
        timing: timingDistribution,
        sideEffects: sideEffectsDistribution,
        confidenceBoost: confidenceBoostDistribution,
        communityInterest: communityInterestDistribution,
        recommendation: recommendationDistribution,
        volunteerInterest: volunteerInterestDistribution,
        campaignParticipation: campaignParticipationDistribution,
        testimonialPermission: testimonialPermissionDistribution,
      },
      insights
    }
  }, [filteredData])

  const clearAllData = async () => {
    if (!confirm('Are you sure you want to clear all feedback data? This action cannot be undone.')) {
      return
    }

    try {
      setIsLoading(true)
      const response = await fetch('/api/clear-feedback-simple', {
        method: 'POST',
      })

      if (!response.ok) {
        throw new Error('Failed to clear data')
      }

      const result = await response.json()
      if (result.success) {
        alert('All feedback data cleared successfully!')
        fetchAnalytics()
      } else {
        throw new Error(result.error || 'Failed to clear data')
      }
    } catch (err) {
      console.error('Clear data error:', err)
      alert('Failed to clear data. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const addTestSubmission = async () => {
    try {
      setIsLoading(true)
      const testData = {
        first_name: 'Test',
        last_name: 'User',
        age: '25',
        email: 'test@example.com',
        phone: '1234567890',
        city: 'Mumbai',
        state: 'Maharashtra',
        instagram: 'testuser',
        cycle_length: '28-30 days (Regular)',
        last_period_date: 'Currently on period (Right now!)',
        period_regularity: 'Very regular (Like clockwork)',
        previous_pain_management: 'Nothing (Just suffered through)',
        pain_severity: 'Moderate (Need some help)',
        when_tried: 'Last week (Fresh experience)',
        timing_of_use: 'Morning (Start with intention)',
        frequency_of_use: 'Daily during period (Every day)',
        preparation_method: 'Hot water (Warm comfort)',
        effect_speed: '10-20 minutes (Pretty fast!)',
        overall_satisfaction: 5,
        would_drink_again: 'Definitely! (100% yes!)',
        benefits_experienced: ['Cramp relief (Pain gone!)', 'Mood improvement (Happy vibes)'],
        side_effects: 'None (Perfect experience)',
        taste_rating: 5,
        value_rating: 5,
        packaging_rating: 5,
        convenience_rating: 'Very easy (Effortless)',
        storage_experience: 'Very easy (No issues)',
        dosage_followed: 'Yes, exactly (Followed perfectly)',
        budget_range: '₹100-150 (Mid-range)',
        price_points: '₹70 (Good value)',
        purchase_intent: 'Yes, definitely! (100% yes)',
        lifestyle_impact: ['Could work normally (Productive days)', 'Could exercise (Active lifestyle)'],
        self_care_essentials: ['Comfort food (Nourishment)'],
        current_feeling: 'Amazing',
        confidence_boost: 'Yes, significantly (Super confident!)',
        face_and_soul_campaign: 'Yes, I\'d love to! (Share my journey)',
        community_interest: 'Yes, definitely! (Count me in)',
        volunteer_interest: 'Yes, I\'d love to help! (Count me in)',
        testimonial_permission: 'Yes, with my name (Proud to share)',
        improvements: 'None needed!',
        would_recommend: 'Yes, definitely! (100% recommend)',
        price_feedback: 'Perfect price!',
        final_thoughts: 'This product changed my life! Highly recommend to everyone.',
        source: 'website'
      }

      const response = await fetch('/api/submit-feedback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(testData),
      })

      if (!response.ok) {
        throw new Error('Failed to add test submission')
      }

      const result = await response.json()
      if (result.success) {
        alert('Test submission added successfully!')
        fetchAnalytics()
      } else {
        throw new Error(result.error || 'Failed to add test submission')
      }
    } catch (err) {
      console.error('Add test submission error:', err)
      alert('Failed to add test submission. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const exportData = async () => {
    try {
      console.log('Exporting data...')
      const response = await fetch('/api/export-feedback')
      
      if (!response.ok) {
        const errorData = await response.json()
        alert(`Export failed: ${errorData.message || 'Unknown error'}`)
        return
      }
      
      // Get the filename from the response headers
      const contentDisposition = response.headers.get('content-disposition')
      const filename = contentDisposition?.split('filename=')[1]?.replace(/"/g, '') || `period-calm-feedback-${new Date().toISOString().split('T')[0]}.csv`
      
      // Create blob and download
      const blob = await response.blob()
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = filename
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)
      
      console.log('Export completed successfully')
    } catch (error) {
      console.error('Export error:', error)
      alert('Failed to export data. Please try again.')
    }
  }

  // Password Protection Screen
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-rose-50 via-orange-50 to-pink-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md shadow-2xl">
          <CardContent className="p-8">
            <div className="text-center space-y-6">
              {/* Lock Icon */}
              <div className="mx-auto w-16 h-16 bg-gradient-to-r from-rose-500 to-orange-500 rounded-full flex items-center justify-center">
                <Lock className="w-8 h-8 text-white" />
              </div>
              
              <div>
                <h1 className="text-2xl font-bold text-gray-900 mb-2">Analytics Dashboard</h1>
                <p className="text-gray-600">Enter password to access analytics data</p>
              </div>

              <form onSubmit={handlePasswordSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Input
                    type="password"
                    placeholder="Enter password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="text-center text-lg"
                    autoFocus
                  />
                  {error && (
                    <p className="text-red-500 text-sm flex items-center justify-center">
                      <AlertCircle className="w-4 h-4 mr-1" />
                      {error}
                    </p>
                  )}
                </div>
                
                <Button 
                  type="submit" 
                  className="w-full bg-gradient-to-r from-rose-500 to-orange-500 hover:from-rose-600 hover:to-orange-600"
                  disabled={isLoading || !password.trim()}
                >
                  {isLoading ? (
                    <div className="flex items-center">
                      <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                      Verifying...
                    </div>
                  ) : (
                    <div className="flex items-center">
                      <Shield className="w-4 h-4 mr-2" />
                      Access Analytics
                    </div>
                  )}
                </Button>
              </form>

              <div className="text-xs text-gray-500">
                <p>🔒 Secure access required</p>
                <p>Contact admin for credentials</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Main Analytics Dashboard (after authentication)
  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-orange-50 to-pink-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
              Analytics Dashboard
            </h1>
            <p className="text-gray-600">
              Real-time insights from {analyticsData?.totalSubmissions || 0} feedback submissions
            </p>
          </div>
          <div className="flex items-center space-x-4 mt-4 sm:mt-0">
            <Button 
              onClick={fetchAnalytics} 
              disabled={isLoading}
              aria-label="Refresh analytics data"
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
              <span className="hidden sm:inline">Refresh</span>
            </Button>
            <Button 
              variant="outline" 
              onClick={() => setIsAuthenticated(false)}
              className="text-gray-600"
            >
              <Lock className="h-4 w-4 mr-2" />
              Lock
            </Button>
          </div>
        </div>

        {/* Error State */}
        {error && (
          <Card className="mb-8 border-red-200 bg-red-50">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
                  <span className="text-red-700">{error}</span>
                </div>
                <Button 
                  size="sm" 
                  onClick={fetchAnalytics}
                  disabled={isLoading}
                  className="ml-4"
                >
                  <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
                  Retry
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Filters */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search by name, email, phone, Instagram, city..."
                  value={filterState.search}
                  onChange={(e) => setFilterState(prev => ({ ...prev, search: e.target.value }))}
                  className="pl-10"
                  aria-label="Search submissions"
                />
              </div>
              <Select value={filterState.dateRange} onValueChange={(value) => setFilterState(prev => ({ ...prev, dateRange: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Date Range" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Time</SelectItem>
                  <SelectItem value="7">Last 7 Days</SelectItem>
                  <SelectItem value="30">Last 30 Days</SelectItem>
                  <SelectItem value="90">Last 90 Days</SelectItem>
                </SelectContent>
              </Select>
              <Select value={filterState.satisfactionFilter} onValueChange={(value) => setFilterState(prev => ({ ...prev, satisfactionFilter: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Satisfaction" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Ratings</SelectItem>
                  <SelectItem value="5">5 Stars Only</SelectItem>
                  <SelectItem value="4">4+ Stars</SelectItem>
                  <SelectItem value="3">3+ Stars</SelectItem>
                </SelectContent>
              </Select>
              <Select value={filterState.ageFilter} onValueChange={(value) => setFilterState(prev => ({ ...prev, ageFilter: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Age Group" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Ages</SelectItem>
                  <SelectItem value="18-25">18-25</SelectItem>
                  <SelectItem value="26-35">26-35</SelectItem>
                  <SelectItem value="36-45">36-45</SelectItem>
                  <SelectItem value="45-60">45+</SelectItem>
                </SelectContent>
              </Select>
              <Select value={filterState.cityFilter} onValueChange={(value) => setFilterState(prev => ({ ...prev, cityFilter: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="City" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Cities</SelectItem>
                  {analyticsData?.submissions
                    .map(sub => sub.city)
                    .filter(Boolean)
                    .filter((city, index, arr) => arr.indexOf(city) === index)
                    .sort()
                    .map(city => (
                      <SelectItem key={city} value={city || ''}>
                        {city}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>
            <div className="mt-4 text-sm text-gray-600">
              Showing {filteredData.length} of {analyticsData?.totalSubmissions || 0} submissions
            </div>
          </CardContent>
        </Card>

        {/* Empty State */}
        {!advancedAnalytics && !isLoading && (
          <Card className="mb-8">
            <CardContent className="text-center py-12">
              <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <BarChart3 className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No Data Available</h3>
              <p className="text-gray-600 mb-4">No feedback submissions match your current filters.</p>
              <Button onClick={() => setFilterState({
                search: '',
                dateRange: 'all',
                satisfactionFilter: 'all',
                ageFilter: 'all',
                cityFilter: 'all'
              })}>
                Clear Filters
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Loading State */}
        {isLoading && (
          <Card className="mb-8">
            <CardContent className="text-center py-12">
              <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <RefreshCw className="w-8 h-8 text-gray-400 animate-spin" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Loading Analytics...</h3>
              <p className="text-gray-600">Please wait while we process your data.</p>
            </CardContent>
          </Card>
        )}

        {/* Analytics Content */}
        {advancedAnalytics && !isLoading && (
          <>
            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Total Submissions</p>
                      <p className="text-2xl font-bold text-gray-900">{advancedAnalytics.total}</p>
                    </div>
                    <Users className="h-8 w-8 text-blue-500" />
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Avg Satisfaction</p>
                      <p className="text-2xl font-bold text-gray-900">{advancedAnalytics.averages.satisfaction}/5</p>
                    </div>
                    <Star className="h-8 w-8 text-yellow-500" />
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Success Rate</p>
                      <p className="text-2xl font-bold text-gray-900">{advancedAnalytics.insights.highSatisfactionRate}%</p>
                    </div>
                    <TrendingUp className="h-8 w-8 text-green-500" />
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Recommendation Rate</p>
                      <p className="text-2xl font-bold text-gray-900">{advancedAnalytics.insights.recommendationRate}%</p>
                    </div>
                    <ThumbsUp className="h-8 w-8 text-purple-500" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Detailed Analytics Tabs */}
            <Tabs defaultValue="overview" className="space-y-6">
              <TabsList className="grid w-full grid-cols-8">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="demographics">Demographics</TabsTrigger>
                <TabsTrigger value="ratings">Ratings</TabsTrigger>
                <TabsTrigger value="benefits">Benefits</TabsTrigger>
                <TabsTrigger value="usage">Usage</TabsTrigger>
                <TabsTrigger value="business">Business</TabsTrigger>
                <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
                <TabsTrigger value="submissions">Submissions</TabsTrigger>
              </TabsList>

              {/* Overview Tab */}
              <TabsContent value="overview" className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <Star className="w-5 h-5 mr-2" />
                        Satisfaction Distribution
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {Object.entries(advancedAnalytics.distributions.satisfaction).map(([rating, count]) => (
                          <div key={rating} className="flex items-center justify-between">
                            <div className="flex items-center">
                              <span className="text-sm font-medium">{rating} Stars</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <div className="w-32 bg-gray-200 rounded-full h-2">
                                <div 
                                  className="bg-yellow-400 h-2 rounded-full" 
                                  style={{ width: `${(count / advancedAnalytics.total) * 100}%` }}
                                />
                              </div>
                              <span className="text-sm text-gray-600 w-8">{count}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <Users className="w-5 h-5 mr-2" />
                        Age Distribution
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {Object.entries(advancedAnalytics.distributions.age).map(([ageGroup, count]) => (
                          <div key={ageGroup} className="flex items-center justify-between">
                            <span className="text-sm font-medium">{ageGroup}</span>
                            <div className="flex items-center space-x-2">
                              <div className="w-32 bg-gray-200 rounded-full h-2">
                                <div 
                                  className="bg-blue-400 h-2 rounded-full" 
                                  style={{ width: `${(count / advancedAnalytics.total) * 100}%` }}
                                />
                              </div>
                              <span className="text-sm text-gray-600 w-8">{count}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              {/* Submissions Tab */}
              <TabsContent value="submissions" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span>Recent Submissions</span>
                      <Button onClick={exportData} variant="outline" size="sm">
                        <DownloadIcon className="w-4 h-4 mr-2" />
                        Export CSV
                      </Button>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {filteredData.slice(0, 10).map((submission) => (
                        <div key={submission.id} className="border rounded-lg p-4">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center space-x-2">
                              <span className="font-medium">
                                {submission.first_name} {submission.last_name}
                              </span>
                              <Badge variant="outline">{submission.age} years</Badge>
                              <Badge variant="outline">{submission.city}</Badge>
                            </div>
                            <div className="flex items-center space-x-2">
                              <div className="flex items-center">
                                <Star className="w-4 h-4 text-yellow-400 fill-current" />
                                <span className="ml-1 text-sm">{submission.overall_satisfaction}/5</span>
                              </div>
                              <span className="text-xs text-gray-500">
                                {new Date(submission.submitted_at).toLocaleDateString()}
                              </span>
                            </div>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-sm text-gray-600">
                            <div>📧 {submission.email}</div>
                            <div>📱 {submission.phone || 'N/A'}</div>
                            <div>📸 {submission.instagram || 'N/A'}</div>
                          </div>
                          {submission.final_thoughts && (
                            <div className="mt-2 p-2 bg-gray-50 rounded text-sm">
                              💭 {submission.final_thoughts}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </>
        )}
      </div>
    </div>
  )
} 