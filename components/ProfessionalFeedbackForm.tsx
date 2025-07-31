"use client"

import { useState, useEffect, useRef } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { X, Star, Heart, Calendar, Clock, CheckCircle, Users, Sparkles, MessageCircle, Zap, Moon, Sun, Coffee, Send, Trophy, PartyPopper, ChevronRight } from 'lucide-react'
import { createClient } from '@supabase/supabase-js'

interface FeedbackFormData {
  first_name: string
  last_name: string
  age: string
  email: string
  phone: string
  city: string
  state: string
  instagram: string
  cycle_length: string
  last_period_date: string
  when_drank: string
  effect_within_30min: string
  overall_satisfaction: number
  would_drink_again: string
  benefits: string[]
  current_feeling: string
  self_care_essentials: string[]
  would_recommend: string
  face_and_soul_campaign: string
  fair_price: string
  final_thoughts: string
}

const timeSlots = [
  { id: 'morning', label: 'Morning Start', icon: Sun, emoji: '🌅', description: 'with intention' },
  { id: 'afternoon', label: 'Afternoon', icon: Coffee, emoji: '☕', description: 'midday reset' },
  { id: 'evening', label: 'Evening', icon: Moon, emoji: '🌙', description: 'wind down bliss' },
  { id: 'before_bed', label: 'Before Bed', icon: Moon, emoji: '😴', description: 'peaceful & restful' }
]

const benefits = [
  { id: 'reduced_pain', label: 'Reduced pain & cramps', emoji: '💖' },
  { id: 'physical_relief', label: 'Physical relief', emoji: '✨' },
  { id: 'better_mood', label: 'Better mood', emoji: '😊' },
  { id: 'emotional_wellbeing', label: 'Emotional well-being', emoji: '🧘‍♀️' },
  { id: 'calmer', label: 'Feel calmer & more at peace', emoji: '🕊️' },
  { id: 'better_sleep', label: 'Better sleep', emoji: '😴' },
  { id: 'increased_energy', label: 'Increased energy', emoji: '⚡' },
  { id: 'increased_vitality', label: 'Increased vitality', emoji: '🌟' },
  { id: 'improved_focus', label: 'Improved focus', emoji: '🎯' },
  { id: 'better_rest', label: 'Better rest', emoji: '🛌' }
]

const selfCareEssentials = [
  { id: 'hot_baths', label: 'Hot baths/showers', emoji: '🛀' },
  { id: 'meditation', label: 'Meditation', emoji: '🧘‍♀️' },
  { id: 'yoga', label: 'Gentle yoga', emoji: '🧘‍♀️' },
  { id: 'movement', label: 'Nurturing movement', emoji: '💃' },
  { id: 'blankets_drinks', label: 'Cozy blankets & warm drinks', emoji: '☕' },
  { id: 'comfort_food', label: 'Comfort food', emoji: '🍕' },
  { id: 'nourishing_meals', label: 'Nourishing meals', emoji: '🥗' },
  { id: 'rest_sleep', label: 'Rest & sleep', emoji: '😴' },
  { id: 'recovery_time', label: 'Recovery time', emoji: '🛌' }
]

export default function ProfessionalFeedbackForm({ onClose }: { onClose: () => void }) {
  const [currentStep, setCurrentStep] = useState(0)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState<FeedbackFormData>({
    first_name: '',
    last_name: '',
    age: '',
    email: '',
    phone: '',
    city: '',
    state: '',
    instagram: '',
    cycle_length: '',
    last_period_date: '',
    when_drank: '',
    effect_within_30min: '',
    overall_satisfaction: 0,
    would_drink_again: '',
    benefits: [],
    current_feeling: '',
    self_care_essentials: [],
    would_recommend: '',
    face_and_soul_campaign: '',
    fair_price: '',
    final_thoughts: ''
  })

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  const updateFormData = (field: keyof FeedbackFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleMultiSelect = (field: keyof FeedbackFormData, value: string) => {
    const currentValues = formData[field] as string[]
    const newValues = currentValues.includes(value)
      ? currentValues.filter(v => v !== value)
      : [...currentValues, value]
    updateFormData(field, newValues)
  }

  const handleSubmit = async () => {
    setIsSubmitting(true)
    try {
      const { data, error } = await supabase
        .from('feedback_submissions')
        .insert([{
          ...formData,
          submitted_at: new Date().toISOString(),
          source: 'custom_form'
        }])

      if (error) {
        console.error('Error saving feedback:', error)
        alert('There was an error saving your feedback. Please try again.')
      } else {
        alert('Thank you for your feedback! Your response has been recorded.')
        onClose()
      }
    } catch (error) {
      console.error('Error:', error)
      alert('There was an error saving your feedback. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const nextStep = () => {
    // Validate current step before proceeding
    if (!canProceedToNext()) {
      return
    }
    
    if (currentStep < 19) { // Updated to include all steps
      setCurrentStep(currentStep + 1)
    } else {
      handleSubmit()
    }
  }

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const progressPercentage = ((currentStep + 1) / 20) * 100 // Updated total steps

  const canProceedToNext = () => {
    switch (currentStep) {
      case 0:
        return formData.first_name.trim() !== ''
      case 1:
        return formData.age.trim() !== ''
      case 2:
        return formData.last_period_date !== ''
      case 3:
        return formData.when_drank !== ''
      case 4:
        return formData.effect_within_30min !== ''
      case 5:
        return formData.overall_satisfaction > 0
      case 6:
        return formData.would_drink_again !== ''
      case 7:
        return formData.benefits.length > 0
      case 8:
        return formData.current_feeling.trim() !== ''
      case 9:
        return formData.self_care_essentials.length > 0
      case 10:
        return formData.would_recommend !== ''
      case 11:
        return formData.face_and_soul_campaign !== ''
      case 12:
        return formData.fair_price !== ''
      case 13:
        return true // Final thoughts is optional
      case 14:
        return formData.email.trim() !== ''
      case 15:
        return formData.phone.trim() !== ''
      case 16:
        return formData.city.trim() !== ''
      case 17:
        return formData.state.trim() !== ''
      case 18:
        return true // Instagram is optional
      case 19:
        return true // Final step
      default:
        return true
    }
  }

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-rose-400 to-pink-400 rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Hey beautiful! 👋</h2>
              <p className="text-gray-600">I'm your Period Calm assistant! Ready to share your journey? This will be fun! 💕</p>
            </div>
            <div className="space-y-4">
              <div>
                <Label htmlFor="first_name" className="text-sm font-medium text-gray-700">What's your first name?</Label>
                <Input
                  id="first_name"
                  value={formData.first_name}
                  onChange={(e) => updateFormData('first_name', e.target.value)}
                  placeholder="Enter your first name"
                  className="mt-1"
                />
              </div>
            </div>
          </div>
        )

      case 1:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-xl font-bold text-gray-900 mb-2">Nice to meet you, {formData.first_name}! 💕</h2>
              <p className="text-gray-600">How old are you? (This helps us personalize your experience)</p>
            </div>
            <div className="space-y-4">
              <div>
                <Label htmlFor="age" className="text-sm font-medium text-gray-700">Age</Label>
                <Input
                  id="age"
                  type="number"
                  value={formData.age}
                  onChange={(e) => updateFormData('age', e.target.value)}
                  placeholder="Enter your age"
                  className="mt-1"
                />
              </div>
            </div>
          </div>
        )

      case 2:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-xl font-bold text-gray-900 mb-2">Perfect! Now let's map your cycle journey 📅</h2>
              <p className="text-gray-600">When was your last period?</p>
            </div>
            <div className="space-y-4">
              <div>
                <Label htmlFor="last_period_date" className="text-sm font-medium text-gray-700">Last Period Date</Label>
                <Input
                  id="last_period_date"
                  type="date"
                  value={formData.last_period_date}
                  onChange={(e) => updateFormData('last_period_date', e.target.value)}
                  className="mt-1"
                />
              </div>
            </div>
          </div>
        )

      case 3:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-xl font-bold text-gray-900 mb-2">Great! Now the fun part... 🎉</h2>
              <p className="text-gray-600">When did you try Period Calm? Pick your vibe:</p>
            </div>
            <div className="space-y-3">
              {timeSlots.map((slot) => (
                <div
                  key={slot.id}
                  className={`p-4 border rounded-lg cursor-pointer transition-all ${
                    formData.when_drank === slot.id
                      ? 'border-rose-500 bg-rose-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => updateFormData('when_drank', slot.id)}
                >
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl">{slot.emoji}</span>
                    <div>
                      <div className="font-medium">{slot.label}</div>
                      <div className="text-sm text-gray-600">{slot.description}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )

      case 4:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-xl font-bold text-gray-900 mb-2">Amazing! 🌟</h2>
              <p className="text-gray-600">How did you feel within 30 minutes?</p>
            </div>
            <div className="space-y-3">
              {[
                { id: 'yes_definitely', label: 'Yes, definitely! One positive change', emoji: '😊' },
                { id: 'maybe_little', label: 'Maybe, a little bit', emoji: '🤔' },
                { id: 'no_not_really', label: 'No, not really', emoji: '😕' },
                { id: 'no_noticeable', label: 'No noticeable change', emoji: '😐' }
              ].map((option) => (
                <div
                  key={option.id}
                  className={`p-4 border rounded-lg cursor-pointer transition-all ${
                    formData.effect_within_30min === option.id
                      ? 'border-rose-500 bg-rose-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => updateFormData('effect_within_30min', option.id)}
                >
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl">{option.emoji}</span>
                    <span className="font-medium">{option.label}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )

      case 5:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-xl font-bold text-gray-900 mb-2">Thanks for sharing! ⭐</h2>
              <p className="text-gray-600">How would you rate your experience?</p>
            </div>
            <div className="flex justify-center space-x-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onClick={() => updateFormData('overall_satisfaction', star)}
                  className="text-3xl transition-all duration-200 hover:scale-110"
                >
                  <Star
                    className={`w-8 h-8 ${
                      star <= formData.overall_satisfaction
                        ? 'fill-yellow-400 text-yellow-400'
                        : 'text-gray-300 hover:text-yellow-300'
                    }`}
                  />
                </button>
              ))}
            </div>
          </div>
        )

      case 6:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-xl font-bold text-gray-900 mb-2">Awesome! 🎯</h2>
              <p className="text-gray-600">Would you drink Period Calm again?</p>
            </div>
            <div className="space-y-3">
              {[
                { id: 'definitely_absolutely', label: 'Definitely, absolutely', emoji: '💯' },
                { id: 'probably', label: 'Probably', emoji: '👍' },
                { id: 'might_be_unsure', label: 'Might be, unsure', emoji: '🤷‍♀️' },
                { id: 'probably_not', label: 'Probably not', emoji: '👎' },
                { id: 'definitely_not', label: 'Definitely not again', emoji: '❌' }
              ].map((option) => (
                <div
                  key={option.id}
                  className={`p-4 border rounded-lg cursor-pointer transition-all ${
                    formData.would_drink_again === option.id
                      ? 'border-rose-500 bg-rose-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => updateFormData('would_drink_again', option.id)}
                >
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl">{option.emoji}</span>
                    <span className="font-medium">{option.label}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )

      case 7:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-xl font-bold text-gray-900 mb-2">Perfect! 🌈</h2>
              <p className="text-gray-600">What benefits did you experience? (Select all that apply)</p>
            </div>
            <div className="space-y-3">
              {benefits.map((benefit) => (
                <div
                  key={benefit.id}
                  className={`p-4 border rounded-lg cursor-pointer transition-all ${
                    formData.benefits.includes(benefit.id)
                      ? 'border-rose-500 bg-rose-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => handleMultiSelect('benefits', benefit.id)}
                >
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl">{benefit.emoji}</span>
                    <span className="font-medium">{benefit.label}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )

      case 8:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-xl font-bold text-gray-900 mb-2">Wonderful! 💭</h2>
              <p className="text-gray-600">How are you feeling right now?</p>
            </div>
            <div className="space-y-4">
              <div>
                <Label htmlFor="current_feeling" className="text-sm font-medium text-gray-700">Current Feeling</Label>
                <Textarea
                  id="current_feeling"
                  value={formData.current_feeling}
                  onChange={(e) => updateFormData('current_feeling', e.target.value)}
                  placeholder="Tell us how you're feeling..."
                  className="mt-1"
                  rows={3}
                />
              </div>
            </div>
          </div>
        )

      case 9:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-xl font-bold text-gray-900 mb-2">Love that! 🛀</h2>
              <p className="text-gray-600">What are your self-care essentials? (Select all that apply)</p>
            </div>
            <div className="space-y-3">
              {selfCareEssentials.map((essential) => (
                <div
                  key={essential.id}
                  className={`p-4 border rounded-lg cursor-pointer transition-all ${
                    formData.self_care_essentials.includes(essential.id)
                      ? 'border-rose-500 bg-rose-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => handleMultiSelect('self_care_essentials', essential.id)}
                >
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl">{essential.emoji}</span>
                    <span className="font-medium">{essential.label}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )

      case 10:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-xl font-bold text-gray-900 mb-2">You're helping thousands! 👥</h2>
              <p className="text-gray-600">Would you recommend Period Calm to other women?</p>
            </div>
            <div className="space-y-3">
              {[
                { id: 'definitely_recommend', label: 'Would definitely recommend!', emoji: '💖' },
                { id: 'yes_with_conditions', label: 'Yes, with conditions', emoji: '🤝' },
                { id: 'maybe_unsure', label: 'Maybe, unsure', emoji: '🤔' },
                { id: 'probably_not', label: 'Probably not', emoji: '😕' }
              ].map((option) => (
                <div
                  key={option.id}
                  className={`p-4 border rounded-lg cursor-pointer transition-all ${
                    formData.would_recommend === option.id
                      ? 'border-rose-500 bg-rose-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => updateFormData('would_recommend', option.id)}
                >
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl">{option.emoji}</span>
                    <span className="font-medium">{option.label}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )

      case 11:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-xl font-bold text-gray-900 mb-2">Amazing! 🎬</h2>
              <p className="text-gray-600">Interested in our 'Face & Soul' campaign?</p>
            </div>
            <div className="space-y-3">
              {[
                { id: 'yes_love_to', label: 'Yes, I\'d love to!', emoji: '🎉' },
                { id: 'maybe_tell_more', label: 'Maybe, tell me more', emoji: '🤔' },
                { id: 'not_right_now', label: 'Not right now', emoji: '😊' }
              ].map((option) => (
                <div
                  key={option.id}
                  className={`p-4 border rounded-lg cursor-pointer transition-all ${
                    formData.face_and_soul_campaign === option.id
                      ? 'border-rose-500 bg-rose-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => updateFormData('face_and_soul_campaign', option.id)}
                >
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl">{option.emoji}</span>
                    <span className="font-medium">{option.label}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )

      case 12:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-xl font-bold text-gray-900 mb-2">Perfect! 💰</h2>
              <p className="text-gray-600">What's a fair price point for Period Calm?</p>
            </div>
            <div className="space-y-3">
              {[
                { id: '199', label: '₹199', emoji: '💰', description: 'Budget-friendly' },
                { id: '299', label: '₹299', emoji: '💎', description: 'Mid-range' },
                { id: '399', label: '₹399', emoji: '✨', description: 'Premium' },
                { id: '599', label: '₹599', emoji: '👑', description: 'Luxury' }
              ].map((option) => (
                <div
                  key={option.id}
                  className={`p-4 border rounded-lg cursor-pointer transition-all ${
                    formData.fair_price === option.id
                      ? 'border-rose-500 bg-rose-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => updateFormData('fair_price', option.id)}
                >
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl">{option.emoji}</span>
                    <div>
                      <div className="font-medium">{option.label}</div>
                      <div className="text-sm text-gray-600">{option.description}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )

      case 13:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-xl font-bold text-gray-900 mb-2">Almost done! 💌</h2>
              <p className="text-gray-600">Any final thoughts or messages for us?</p>
            </div>
            <div className="space-y-4">
              <div>
                <Label htmlFor="final_thoughts" className="text-sm font-medium text-gray-700">Final Thoughts</Label>
                <Textarea
                  id="final_thoughts"
                  value={formData.final_thoughts}
                  onChange={(e) => updateFormData('final_thoughts', e.target.value)}
                  placeholder="Share any final thoughts..."
                  className="mt-1"
                  rows={4}
                />
              </div>
            </div>
          </div>
        )

      // Additional steps for more comprehensive data collection
      case 14:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-xl font-bold text-gray-900 mb-2">Tell us more about you 📧</h2>
              <p className="text-gray-600">What's your email address?</p>
            </div>
            <div className="space-y-4">
              <div>
                <Label htmlFor="email" className="text-sm font-medium text-gray-700">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => updateFormData('email', e.target.value)}
                  placeholder="Enter your email"
                  className="mt-1"
                />
              </div>
            </div>
          </div>
        )

      case 15:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-xl font-bold text-gray-900 mb-2">Stay connected 📱</h2>
              <p className="text-gray-600">What's your phone number?</p>
            </div>
            <div className="space-y-4">
              <div>
                <Label htmlFor="phone" className="text-sm font-medium text-gray-700">Phone Number</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => updateFormData('phone', e.target.value)}
                  placeholder="Enter your phone number"
                  className="mt-1"
                />
              </div>
            </div>
          </div>
        )

      case 16:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-xl font-bold text-gray-900 mb-2">Where are you located? 🗺️</h2>
              <p className="text-gray-600">What city do you live in?</p>
            </div>
            <div className="space-y-4">
              <div>
                <Label htmlFor="city" className="text-sm font-medium text-gray-700">City</Label>
                <Input
                  id="city"
                  value={formData.city}
                  onChange={(e) => updateFormData('city', e.target.value)}
                  placeholder="Enter your city"
                  className="mt-1"
                />
              </div>
            </div>
          </div>
        )

      case 17:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-xl font-bold text-gray-900 mb-2">Almost there! 🏛️</h2>
              <p className="text-gray-600">What state do you live in?</p>
            </div>
            <div className="space-y-4">
              <div>
                <Label htmlFor="state" className="text-sm font-medium text-gray-700">State</Label>
                <Input
                  id="state"
                  value={formData.state}
                  onChange={(e) => updateFormData('state', e.target.value)}
                  placeholder="Enter your state"
                  className="mt-1"
                />
              </div>
            </div>
          </div>
        )

      case 18:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-xl font-bold text-gray-900 mb-2">Social media 📸</h2>
              <p className="text-gray-600">What's your Instagram handle?</p>
            </div>
            <div className="space-y-4">
              <div>
                <Label htmlFor="instagram" className="text-sm font-medium text-gray-700">Instagram Handle</Label>
                <Input
                  id="instagram"
                  value={formData.instagram}
                  onChange={(e) => updateFormData('instagram', e.target.value)}
                  placeholder="@yourusername"
                  className="mt-1"
                />
              </div>
            </div>
          </div>
        )

      case 19:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-xl font-bold text-gray-900 mb-2">🎉 You're amazing!</h2>
              <p className="text-gray-600">Thank you for sharing your story!</p>
              <p className="text-gray-600">You've just helped 500+ trial participants find relief! 🌟</p>
              <p className="text-gray-600">Your feedback is invaluable to us. We'll be in touch soon! 💕</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full flex items-center justify-center mx-auto mb-4">
                <Trophy className="w-8 h-8 text-white" />
              </div>
              <p className="text-lg font-semibold text-gray-900">🎊 Achievement unlocked: Feedback Champion!</p>
            </div>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <Card className="w-full max-w-2xl h-[90vh] bg-white shadow-2xl overflow-hidden">
        <CardContent className="p-0 h-full flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gradient-to-r from-rose-50 to-pink-50 flex-shrink-0">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-r from-rose-400 to-pink-400 rounded-full flex items-center justify-center text-white text-sm font-bold animate-pulse">
                PC
              </div>
              <div>
                <h2 className="text-lg font-bold text-gray-900">Period Calm Feedback</h2>
                <p className="text-sm text-gray-600">Share your experience with us!</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Progress Bar */}
          <div className="px-4 py-2 bg-gray-50 border-b border-gray-200 flex-shrink-0">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs text-gray-600">Progress</span>
              <span className="text-xs text-gray-600">{Math.round(progressPercentage)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-1">
              <div
                className="bg-gradient-to-r from-rose-500 to-pink-500 h-1 rounded-full transition-all duration-500"
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
          </div>

          {/* Form Content - Now properly scrollable */}
          <div className="flex-1 overflow-y-auto p-6 min-h-0">
            <div className="max-w-md mx-auto">
              {renderStep()}
            </div>
          </div>

          {/* Navigation */}
          <div className="p-4 border-t border-gray-200 bg-gray-50 flex-shrink-0">
            <div className="flex justify-between">
              <Button
                onClick={prevStep}
                disabled={currentStep === 0}
                variant="outline"
                className="px-6"
              >
                Previous
              </Button>
              <Button
                onClick={nextStep}
                disabled={isSubmitting || !canProceedToNext()}
                className="px-6 bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Saving...' : currentStep === 19 ? 'Submit' : 'Next'}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 