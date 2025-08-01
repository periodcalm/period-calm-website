"use client"

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  Heart, 
  Star, 
  Calendar, 
  Clock, 
  CheckCircle, 
  Award, 
  Users, 
  Sparkles,
  ArrowRight,
  ArrowLeft,
  Trophy,
  MessageCircle,
  Zap,
  Moon,
  Sun,
  Coffee
} from 'lucide-react'

interface FeedbackData {
  // Personal Info
  firstName: string
  lastName: string
  age: string
  phone: string
  city: string
  state: string
  instagram: string
  email: string
  
  // Cycle Info
  cycleLength: string
  lastPeriodDate: string
  
  // Experience
  whenDrank: string
  effectWithin30Min: string
  rating: number
  wouldDrinkAgain: string
  
  // Benefits
  benefits: string[]
  currentFeeling: string
  selfCareEssentials: string[]
  wouldRecommend: string
  
  // Future
  faceAndSoulCampaign: string
  fairPrice: string
  finalThoughts: string
}

const phases = [
  {
    id: 'personal',
    title: "Let's Get Personal",
    subtitle: "Tell us about yourself!",
    icon: Heart,
    color: "rose"
  },
  {
    id: 'cycle',
    title: "Your Cycle Story",
    subtitle: "Let's map your journey!",
    icon: Calendar,
    color: "purple"
  },
  {
    id: 'experience',
    title: "Your Period Calm Moment",
    subtitle: "When did the magic happen?",
    icon: Clock,
    color: "blue"
  },
  {
    id: 'transformation',
    title: "The Transformation",
    subtitle: "Before & After!",
    icon: Zap,
    color: "green"
  },
  {
    id: 'voice',
    title: "Your Voice & Impact",
    subtitle: "You're helping thousands!",
    icon: Users,
    color: "orange"
  },
  {
    id: 'future',
    title: "Shaping the Future",
    subtitle: "Help us create the future!",
    icon: Sparkles,
    color: "pink"
  }
]

const timeSlots = [
  { value: 'morning', label: 'Morning Start', icon: Sun, description: 'with intention' },
  { value: 'afternoon', label: 'Afternoon', icon: Coffee, description: 'midday reset' },
  { value: 'evening', label: 'Evening', icon: Moon, description: 'wind down bliss' },
  { value: 'before_bed', label: 'Before Bed', icon: Moon, description: 'peaceful & restful' }
]

const benefits = [
  { value: 'reduced_pain', label: 'Reduced pain & cramps', icon: Heart },
  { value: 'physical_relief', label: 'Physical relief', icon: CheckCircle },
  { value: 'better_mood', label: 'Better mood', icon: Sparkles },
  { value: 'emotional_wellbeing', label: 'Emotional well-being', icon: Heart },
  { value: 'calmer', label: 'Feel calmer & more at peace', icon: Moon },
  { value: 'better_sleep', label: 'Better sleep', icon: Moon },
  { value: 'increased_energy', label: 'Increased energy', icon: Zap },
  { value: 'increased_vitality', label: 'Increased vitality', icon: Star },
  { value: 'improved_focus', label: 'Improved focus', icon: CheckCircle },
  { value: 'better_rest', label: 'Better rest', icon: Moon }
]

const selfCareEssentials = [
  { value: 'hot_baths', label: 'Hot baths/showers', emoji: '🛀' },
  { value: 'meditation', label: 'Meditation', emoji: '🧘‍♀️' },
  { value: 'yoga', label: 'Gentle yoga', emoji: '🧘‍♀️' },
  { value: 'movement', label: 'Nurturing movement', emoji: '💃' },
  { value: 'blankets_drinks', label: 'Cozy blankets & warm drinks', emoji: '☕' },
  { value: 'comfort_food', label: 'Comfort food', emoji: '🍕' },
  { value: 'nourishing_meals', label: 'Nourishing meals', emoji: '🥗' },
  { value: 'rest_sleep', label: 'Rest & sleep', emoji: '😴' },
  { value: 'recovery_time', label: 'Recovery time', emoji: '🛌' }
]

export default function InteractiveFeedbackForm({ onClose }: { onClose: () => void }) {
  const [currentPhase, setCurrentPhase] = useState(0)
  const [feedbackData, setFeedbackData] = useState<FeedbackData>({
    firstName: '',
    lastName: '',
    age: '',
    phone: '',
    city: '',
    state: '',
    instagram: '',
    email: '',
    cycleLength: '',
    lastPeriodDate: '',
    whenDrank: '',
    effectWithin30Min: '',
    rating: 0,
    wouldDrinkAgain: '',
    benefits: [],
    currentFeeling: '',
    selfCareEssentials: [],
    wouldRecommend: '',
    faceAndSoulCampaign: '',
    fairPrice: '',
    finalThoughts: ''
  })
  const [isTyping, setIsTyping] = useState(false)
  const [achievements, setAchievements] = useState<string[]>([])

  const currentPhaseData = phases[currentPhase]
  const progress = ((currentPhase + 1) / phases.length) * 100

  useEffect(() => {
    // Simulate typing effect
    setIsTyping(true)
    const timer = setTimeout(() => setIsTyping(false), 1000)
    return () => clearTimeout(timer)
  }, [currentPhase])

  const updateFeedbackData = (field: keyof FeedbackData, value: any) => {
    setFeedbackData(prev => ({ ...prev, [field]: value }))
  }

  const nextPhase = () => {
    if (currentPhase < phases.length - 1) {
      setCurrentPhase(prev => prev + 1)
      // Add achievement
      const newAchievement = `Completed ${currentPhaseData.title}!`
      setAchievements(prev => [...prev, newAchievement])
    } else {
      // Submit form
      handleSubmit()
    }
  }

  const prevPhase = () => {
    if (currentPhase > 0) {
      setCurrentPhase(prev => prev - 1)
    }
  }

  const handleSubmit = async () => {
    // Here you would submit to your backend
    // Feedback submitted successfully
    // Show success message and close
    onClose()
  }

  const renderPersonalPhase = () => (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <Heart className="w-12 h-12 text-rose-500 mx-auto mb-4 animate-pulse" />
        <h3 className="text-2xl font-bold text-gray-900 mb-2">Let's Get Personal</h3>
        <p className="text-gray-600">Tell us about yourself!</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">First Name *</label>
          <input
            type="text"
            value={feedbackData.firstName}
            onChange={(e) => updateFeedbackData('firstName', e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
            placeholder="Your first name"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Last Name *</label>
          <input
            type="text"
            value={feedbackData.lastName}
            onChange={(e) => updateFeedbackData('lastName', e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
            placeholder="Your last name"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Age *</label>
          <input
            type="number"
            value={feedbackData.age}
            onChange={(e) => updateFeedbackData('age', e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
            placeholder="Your age"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number *</label>
          <input
            type="tel"
            value={feedbackData.phone}
            onChange={(e) => updateFeedbackData('phone', e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
            placeholder="(000) 000-0000"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">City *</label>
          <input
            type="text"
            value={feedbackData.city}
            onChange={(e) => updateFeedbackData('city', e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
            placeholder="Your city"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">State *</label>
          <input
            type="text"
            value={feedbackData.state}
            onChange={(e) => updateFeedbackData('state', e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
            placeholder="Your state"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Instagram Handle (Optional)</label>
          <input
            type="text"
            value={feedbackData.instagram}
            onChange={(e) => updateFeedbackData('instagram', e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
            placeholder="@username"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Email *</label>
          <input
            type="email"
            value={feedbackData.email}
            onChange={(e) => updateFeedbackData('email', e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
            placeholder="me@example.com"
          />
        </div>
      </div>
    </div>
  )

  const renderCyclePhase = () => (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <Calendar className="w-12 h-12 text-purple-500 mx-auto mb-4 animate-pulse" />
        <h3 className="text-2xl font-bold text-gray-900 mb-2">Your Cycle Story</h3>
        <p className="text-gray-600">Let's map your journey!</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Cycle Length (days) *</label>
          <select
            value={feedbackData.cycleLength}
            onChange={(e) => updateFeedbackData('cycleLength', e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          >
            <option value="">Select cycle length</option>
            <option value="21">21 days</option>
            <option value="22">22 days</option>
            <option value="23">23 days</option>
            <option value="24">24 days</option>
            <option value="25">25 days</option>
            <option value="26">26 days</option>
            <option value="27">27 days</option>
            <option value="28">28 days (most common)</option>
            <option value="29">29 days</option>
            <option value="30">30 days</option>
            <option value="31">31 days</option>
            <option value="32">32 days</option>
            <option value="33">33 days</option>
            <option value="34">34 days</option>
            <option value="35">35 days</option>
            <option value="other">Other</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Last Period Date *</label>
          <input
            type="date"
            value={feedbackData.lastPeriodDate}
            onChange={(e) => updateFeedbackData('lastPeriodDate', e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          />
        </div>
      </div>
      
      <div className="bg-purple-50 p-4 rounded-lg">
        <p className="text-purple-700 text-sm">
          💡 <strong>Did you know?</strong> Most women have 28-day cycles, but everyone's unique! 
          Your cycle length helps us understand you better.
        </p>
      </div>
    </div>
  )

  const renderExperiencePhase = () => (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <Clock className="w-12 h-12 text-blue-500 mx-auto mb-4 animate-pulse" />
        <h3 className="text-2xl font-bold text-gray-900 mb-2">Your Period Calm Moment</h3>
        <p className="text-gray-600">When did the magic happen?</p>
      </div>
      
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-4">When did you drink Period Calm? *</label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {timeSlots.map((slot) => (
              <button
                key={slot.value}
                onClick={() => updateFeedbackData('whenDrank', slot.value)}
                className={`p-4 rounded-lg border-2 transition-all duration-200 ${
                  feedbackData.whenDrank === slot.value
                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                    : 'border-gray-200 hover:border-blue-300'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <slot.icon className="w-6 h-6" />
                  <div className="text-left">
                    <div className="font-medium">{slot.label}</div>
                    <div className="text-sm text-gray-600">{slot.description}</div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-4">Did you feel any effect within 30 minutes? *</label>
          <div className="space-y-3">
            {[
              { value: 'yes_definitely', label: 'Yes, definitely! One positive change' },
              { value: 'maybe_little', label: 'Maybe, a little bit' },
              { value: 'no_not_really', label: 'No, not really' },
              { value: 'no_noticeable', label: 'No noticeable change' }
            ].map((option) => (
              <label key={option.value} className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="radio"
                  name="effectWithin30Min"
                  value={option.value}
                  checked={feedbackData.effectWithin30Min === option.value}
                  onChange={(e) => updateFeedbackData('effectWithin30Min', e.target.value)}
                  className="text-blue-500 focus:ring-blue-500"
                />
                <span className="text-gray-700">{option.label}</span>
              </label>
            ))}
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-4">Rate Us Today *</label>
          <div className="flex space-x-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                onClick={() => updateFeedbackData('rating', star)}
                className="text-3xl transition-colors duration-200"
              >
                <Star
                  className={`w-8 h-8 ${
                    star <= feedbackData.rating
                      ? 'fill-yellow-400 text-yellow-400'
                      : 'text-gray-300 hover:text-yellow-300'
                  }`}
                />
              </button>
            ))}
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-4">Would you drink Period Calm again? *</label>
          <div className="space-y-3">
            {[
              { value: 'definitely_absolutely', label: 'Definitely, absolutely' },
              { value: 'probably', label: 'Probably' },
              { value: 'might_be_unsure', label: 'Might be, unsure, need to think' },
              { value: 'probably_not', label: 'Probably not' },
              { value: 'definitely_not', label: 'Definitely not again' }
            ].map((option) => (
              <label key={option.value} className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="radio"
                  name="wouldDrinkAgain"
                  value={option.value}
                  checked={feedbackData.wouldDrinkAgain === option.value}
                  onChange={(e) => updateFeedbackData('wouldDrinkAgain', e.target.value)}
                  className="text-blue-500 focus:ring-blue-500"
                />
                <span className="text-gray-700">{option.label}</span>
              </label>
            ))}
          </div>
        </div>
      </div>
    </div>
  )

  const renderTransformationPhase = () => (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <Zap className="w-12 h-12 text-green-500 mx-auto mb-4 animate-pulse" />
        <h3 className="text-2xl font-bold text-gray-900 mb-2">The Transformation</h3>
        <p className="text-gray-600">Before & After!</p>
      </div>
      
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-4">What benefits did you experience? (Select all that apply) *</label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {benefits.map((benefit) => (
              <label key={benefit.value} className="flex items-center space-x-3 cursor-pointer p-3 rounded-lg border border-gray-200 hover:bg-gray-50">
                <input
                  type="checkbox"
                  checked={feedbackData.benefits.includes(benefit.value)}
                  onChange={(e) => {
                    const newBenefits = e.target.checked
                      ? [...feedbackData.benefits, benefit.value]
                      : feedbackData.benefits.filter(b => b !== benefit.value)
                    updateFeedbackData('benefits', newBenefits)
                  }}
                  className="text-green-500 focus:ring-green-500"
                />
                <benefit.icon className="w-5 h-5 text-green-500" />
                <span className="text-gray-700">{benefit.label}</span>
              </label>
            ))}
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">How are you feeling right now? *</label>
          <textarea
            value={feedbackData.currentFeeling}
            onChange={(e) => updateFeedbackData('currentFeeling', e.target.value)}
            rows={3}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            placeholder="Tell us how you're feeling..."
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-4">Your self-care essentials? (Select all that apply)</label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {selfCareEssentials.map((essential) => (
              <label key={essential.value} className="flex items-center space-x-3 cursor-pointer p-3 rounded-lg border border-gray-200 hover:bg-gray-50">
                <input
                  type="checkbox"
                  checked={feedbackData.selfCareEssentials.includes(essential.value)}
                  onChange={(e) => {
                    const newEssentials = e.target.checked
                      ? [...feedbackData.selfCareEssentials, essential.value]
                      : feedbackData.selfCareEssentials.filter(e => e !== essential.value)
                    updateFeedbackData('selfCareEssentials', newEssentials)
                  }}
                  className="text-green-500 focus:ring-green-500"
                />
                <span className="text-2xl">{essential.emoji}</span>
                <span className="text-gray-700">{essential.label}</span>
              </label>
            ))}
          </div>
        </div>
      </div>
    </div>
  )

  const renderVoicePhase = () => (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <Users className="w-12 h-12 text-orange-500 mx-auto mb-4 animate-pulse" />
        <h3 className="text-2xl font-bold text-gray-900 mb-2">Your Voice & Impact</h3>
        <p className="text-gray-600">You're helping thousands!</p>
      </div>
      
      <div className="bg-orange-50 p-6 rounded-lg mb-6">
        <div className="text-center">
          <Users className="w-8 h-8 text-orange-500 mx-auto mb-2" />
          <p className="text-orange-700 font-medium">
            Your story could help <strong>500+ trial participants</strong> find relief!
          </p>
        </div>
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-4">Would you recommend Period Calm to other women? *</label>
        <div className="space-y-3">
          {[
            { value: 'definitely_recommend', label: 'Would definitely recommend!' },
            { value: 'yes_with_conditions', label: 'Yes, with conditions (would recommend in certain situations)' },
            { value: 'maybe_unsure', label: 'Maybe (I\'m unsure about recommending)' },
            { value: 'probably_not', label: 'Probably not (likely wouldn\'t recommend)' }
          ].map((option) => (
            <label key={option.value} className="flex items-center space-x-3 cursor-pointer">
              <input
                type="radio"
                name="wouldRecommend"
                value={option.value}
                checked={feedbackData.wouldRecommend === option.value}
                onChange={(e) => updateFeedbackData('wouldRecommend', e.target.value)}
                className="text-orange-500 focus:ring-orange-500"
              />
              <span className="text-gray-700">{option.label}</span>
            </label>
          ))}
        </div>
      </div>
    </div>
  )

  const renderFuturePhase = () => (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <Sparkles className="w-12 h-12 text-pink-500 mx-auto mb-4 animate-pulse" />
        <h3 className="text-2xl font-bold text-gray-900 mb-2">Shaping the Future</h3>
        <p className="text-gray-600">Help us create the future!</p>
      </div>
      
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-4">Interested in our 'Face & Soul' campaign? *</label>
          <div className="space-y-3">
            {[
              { value: 'yes_love_to', label: 'Yes, I\'d love to! (excited to share my story)' },
              { value: 'maybe_tell_more', label: 'Maybe, tell me more (interested but need details)' },
              { value: 'not_right_now', label: 'Not right now (not interested at this time)' }
            ].map((option) => (
              <label key={option.value} className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="radio"
                  name="faceAndSoulCampaign"
                  value={option.value}
                  checked={feedbackData.faceAndSoulCampaign === option.value}
                  onChange={(e) => updateFeedbackData('faceAndSoulCampaign', e.target.value)}
                  className="text-pink-500 focus:ring-pink-500"
                />
                <span className="text-gray-700">{option.label}</span>
              </label>
            ))}
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-4">Fair price point for Period Calm? *</label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { value: '199', label: '₹199', description: 'Budget-friendly' },
              { value: '299', label: '₹299', description: 'Mid-range' },
              { value: '399', label: '₹399', description: 'Premium' },
              { value: '599', label: '₹599', description: 'Luxury' }
            ].map((option) => (
              <button
                key={option.value}
                onClick={() => updateFeedbackData('fairPrice', option.value)}
                className={`p-4 rounded-lg border-2 transition-all duration-200 ${
                  feedbackData.fairPrice === option.value
                    ? 'border-pink-500 bg-pink-50 text-pink-700'
                    : 'border-gray-200 hover:border-pink-300'
                }`}
              >
                <div className="text-center">
                  <div className="font-bold text-lg">{option.label}</div>
                  <div className="text-sm text-gray-600">{option.description}</div>
                </div>
              </button>
            ))}
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Any final thoughts or messages for us?</label>
          <textarea
            value={feedbackData.finalThoughts}
            onChange={(e) => updateFeedbackData('finalThoughts', e.target.value)}
            rows={4}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
            placeholder="Share your thoughts..."
          />
        </div>
      </div>
    </div>
  )

  const renderPhaseContent = () => {
    switch (currentPhaseData.id) {
      case 'personal':
        return renderPersonalPhase()
      case 'cycle':
        return renderCyclePhase()
      case 'experience':
        return renderExperiencePhase()
      case 'transformation':
        return renderTransformationPhase()
      case 'voice':
        return renderVoicePhase()
      case 'future':
        return renderFuturePhase()
      default:
        return null
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-white shadow-2xl">
        <CardContent className="p-6 bg-white">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <MessageCircle className="w-6 h-6 text-rose-500" />
              <h2 className="text-xl font-bold text-gray-900">Your Calm. Your Truth.</h2>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 text-2xl font-bold"
            >
              ×
            </button>
          </div>

          {/* Progress Bar */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">
                Step {currentPhase + 1} of {phases.length}
              </span>
              <span className="text-sm text-gray-500">{Math.round(progress)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-gradient-to-r from-rose-500 to-pink-500 h-2 rounded-full transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          {/* Phase Title */}
          <div className="text-center mb-6">
            <currentPhaseData.icon className={`w-8 h-8 text-${currentPhaseData.color}-500 mx-auto mb-2`} />
            <h3 className="text-xl font-bold text-gray-900 mb-1">{currentPhaseData.title}</h3>
            <p className="text-gray-600">{currentPhaseData.subtitle}</p>
          </div>

          {/* Content */}
          <div className="mb-6">
            {renderPhaseContent()}
          </div>

          {/* Achievements */}
          {achievements.length > 0 && (
            <div className="mb-6">
              <div className="flex items-center space-x-2 mb-2">
                <Trophy className="w-5 h-5 text-yellow-500" />
                <span className="text-sm font-medium text-gray-700">Achievements Unlocked:</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {achievements.map((achievement, index) => (
                  <Badge key={index} className="bg-yellow-100 text-yellow-800">
                    {achievement}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Navigation */}
          <div className="flex justify-between">
            <Button
              variant="outline"
              onClick={prevPhase}
              disabled={currentPhase === 0}
              className="flex items-center space-x-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Previous
            </Button>
            
            <Button
              onClick={nextPhase}
              className="flex items-center space-x-2 bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600"
            >
              {currentPhase === phases.length - 1 ? (
                <>
                  Submit Feedback
                  <CheckCircle className="w-4 h-4" />
                </>
              ) : (
                <>
                  Next
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 