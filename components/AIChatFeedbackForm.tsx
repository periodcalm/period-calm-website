'use client'

import React, { useState, useRef, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Star, X, ArrowLeft, ArrowRight, Sparkles, Heart, MessageCircle, CheckCircle, Loader2, Trophy, Zap, Clock, Target, Users, Star as StarIcon } from 'lucide-react'
import { useRouter } from 'next/navigation'

interface FeedbackData {
  // Personal Information
  first_name: string
  last_name: string
  email: string
  phone: string
  age: string
  city: string
  state: string
  profession: string
  
  // Period Details
  cycle_length: string
  period_regularity: string
  pain_severity: string
  previous_pain_management: string
  what_used_before: string
  
  // Product Experience
  when_tried: string
  timing_of_use: string
  frequency_of_use: string
  preparation_method: string
  effect_speed: string
  effect_duration: string
  overall_satisfaction: number
  taste_rating: number
  packaging_rating: number
  convenience_rating: number
  benefits_experienced: string[]
  side_effects: string
  before_after_impact: string
  
  // Business Insights
  price_opinion: string
  would_buy: string
  recommend_to_others: string
  social_media_handle: string
  volunteer_interest: string
  campaign_face_interest: string
  testimonial_permission: string
  
  // Emotional & Lifestyle Impact
  current_mood: string
  happiness_factors: string[]
  confidence_boost: string
  lifestyle_impact: string[]
  self_care_essentials: string[]
  
  // Additional Feedback
  improvements: string
  final_thoughts: string
}

const AI_ASSISTANT = {
  name: "Luna",
  avatar: "✨",
  personality: "Warm, empathetic, and encouraging"
}

const QUESTIONS = [
  // Personal Information Section
  {
    id: 1,
    type: 'name',
    title: "What's your beautiful name? 💕",
    description: "Let's start with the basics!",
    required: true,
    placeholder: "Enter your first and last name",
    emoji: "👋"
  },
  {
    id: 2,
    type: 'contact',
    title: "How can we reach you? 📧",
    description: "We'd love to keep you updated with our latest developments!",
    required: true,
    placeholder: "your.email@example.com",
    emoji: "📧"
  },
  {
    id: 3,
    type: 'phone',
    title: "What's your phone number? 📱",
    description: "Optional - for special updates and offers",
    required: false,
    placeholder: "+91 98765 43210",
    emoji: "📱"
  },
  {
    id: 4,
    type: 'age',
    title: "What's your age? 🎂",
    description: "This helps us understand our community better",
    required: false,
    placeholder: "e.g., 25",
    emoji: "🎂"
  },
  {
    id: 5,
    type: 'location',
    title: "Where are you from? 🌍",
    description: "We love connecting with women from all over!",
    required: false,
    placeholder: "City, State",
    emoji: "🌍"
  },
  {
    id: 6,
    type: 'profession',
    title: "What do you do? 💼",
    description: "Optional - helps us understand our diverse community",
    required: false,
    placeholder: "e.g., Student, Working Professional, Homemaker",
    emoji: "💼"
  },
  
  // Period Details Section
  {
    id: 7,
    type: 'cycle_info',
    title: "Tell us about your cycle 📅",
    description: "This helps us understand your unique needs",
    required: false,
    options: ["Regular (28-32 days)", "Irregular", "I'm not sure", "Prefer not to say"],
    emoji: "📅"
  },
  {
    id: 8,
    type: 'pain_severity',
    title: "How severe are your period symptoms? 😰",
    description: "Be honest - we're here to help!",
    required: false,
    options: ["Mild - manageable", "Moderate - affects daily life", "Severe - debilitating", "Very severe - bed rest needed"],
    emoji: "😰"
  },
  {
    id: 9,
    type: 'what_used_before',
    title: "What were you using before Period Calm? 💊",
    description: "Understanding your journey helps us improve",
    required: false,
    options: ["Painkillers (Paracetamol/Ibuprofen)", "Hot water bottle", "Exercise", "Diet changes", "Herbal remedies", "Nothing worked", "Other"],
    emoji: "💊"
  },
  
  // Product Experience Section
  {
    id: 10,
    type: 'when_tried',
    title: "When did you try Period Calm? ⏰",
    description: "Help us understand your experience timeline",
    required: false,
    options: ["During my last period", "A few periods ago", "Just started", "Haven't tried yet", "Other"],
    emoji: "⏰"
  },
  {
    id: 11,
    type: 'timing_use',
    title: "When did you take Period Calm? 🕐",
    description: "Timing can make a big difference!",
    required: false,
    options: ["Before period started", "When cramps began", "During period", "After period", "Multiple times"],
    emoji: "🕐"
  },
  {
    id: 12,
    type: 'effect_speed',
    title: "How quickly did you feel relief? ⚡",
    description: "We want to know about the speed of action",
    required: false,
    options: ["Within 15 minutes", "15-30 minutes", "30-60 minutes", "1-2 hours", "More than 2 hours", "No relief"],
    emoji: "⚡"
  },
  {
    id: 13,
    type: 'effect_duration',
    title: "How long did the relief last? ⏱️",
    description: "Duration of effectiveness is crucial",
    required: false,
    options: ["Less than 2 hours", "2-4 hours", "4-6 hours", "6-8 hours", "More than 8 hours", "All day"],
    emoji: "⏱️"
  },
  {
    id: 14,
    type: 'before_after_impact',
    title: "Compare your before & after experience 📊",
    description: "How did Period Calm change your period experience?",
    required: false,
    options: ["Dramatically better", "Significantly better", "Somewhat better", "Slightly better", "No change", "Worse"],
    emoji: "📊"
  },
  {
    id: 15,
    type: 'overall_satisfaction',
    title: "🌟 Overall, how satisfied are you?",
    description: "Rate your complete experience with Period Calm",
    required: true,
    options: ["1 - Not satisfied at all", "2 - Somewhat dissatisfied", "3 - Neutral", "4 - Satisfied", "5 - Extremely satisfied"],
    emoji: "🌟"
  },
  {
    id: 16,
    type: 'taste_rating',
    title: "How would you rate the taste? 🍵",
    description: "We're always working on making it delicious!",
    required: false,
    options: ["1 - Didn't like it", "2 - Okay", "3 - Good", "4 - Very good", "5 - Loved it!"],
    emoji: "🍵"
  },
  {
    id: 17,
    type: 'packaging_rating',
    title: "How would you rate the packaging? 📦",
    description: "We want to make it as convenient as possible",
    required: false,
    options: ["1 - Not convenient", "2 - Somewhat convenient", "3 - Convenient", "4 - Very convenient", "5 - Perfect!"],
    emoji: "📦"
  },
  {
    id: 18,
    type: 'convenience_rating',
    title: "How convenient was it to use? 🎯",
    description: "Ease of preparation and consumption",
    required: false,
    options: ["1 - Very inconvenient", "2 - Somewhat inconvenient", "3 - Neutral", "4 - Convenient", "5 - Very convenient"],
    emoji: "🎯"
  },
  {
    id: 19,
    type: 'benefits_experienced',
    title: "✨ What magic did you experience?",
    description: "Select all that apply - every detail matters!",
    required: false,
    options: ["Cramp relief", "Mood improvement", "Better sleep", "Energy boost", "Reduced bloating", "Regular cycles", "Less fatigue", "Better focus", "Reduced anxiety", "No benefits"],
    emoji: "✨"
  },
  {
    id: 20,
    type: 'side_effects',
    title: "Did you experience any side effects? ⚠️",
    description: "Your safety is our priority",
    required: false,
    options: ["None", "Mild nausea", "Dizziness", "Allergic reaction", "Other", "Prefer not to say"],
    emoji: "⚠️"
  },
  
  // Business Insights Section
  {
    id: 21,
    type: 'price_opinion',
    title: "What do you think about the pricing? 💰",
    description: "We want to make it accessible to everyone",
    required: false,
    options: ["Very affordable (₹55)", "Reasonable (₹70)", "Acceptable (₹90)", "A bit expensive (₹120)", "Too expensive", "Not sure"],
    emoji: "💰"
  },
  {
    id: 22,
    type: 'would_buy',
    title: "Would you buy Period Calm? 🛒",
    description: "Your honest opinion helps us understand demand",
    required: false,
    options: ["Yes, definitely!", "Yes, probably", "Maybe", "No, probably not", "No, definitely not"],
    emoji: "🛒"
  },
  {
    id: 23,
    type: 'recommend_to_others',
    title: "💝 Would you recommend Period Calm?",
    description: "Your honest opinion helps other women make informed decisions",
    required: true,
    options: ["Yes, definitely!", "Yes, probably", "Maybe", "No, probably not", "No, definitely not"],
    emoji: "💝"
  },
  {
    id: 24,
    type: 'social_media_handle',
    title: "What's your social media handle? 📱",
    description: "Optional - for community building and updates",
    required: false,
    placeholder: "@yourusername (Instagram/Twitter)",
    emoji: "📱"
  },
  {
    id: 25,
    type: 'volunteer_interest',
    title: "Would you like to be a volunteer? 🤝",
    description: "Help us spread awareness and support other women",
    required: false,
    options: ["Yes, I'm interested!", "Maybe, tell me more", "Not right now", "No, thank you"],
    emoji: "🤝"
  },
  {
    id: 26,
    type: 'campaign_face_interest',
    title: "Would you like to be the face of our campaign? 🌟",
    description: "Share your story and inspire others",
    required: false,
    options: ["Yes, I'd love to!", "Maybe, I'm interested", "Not comfortable", "No, thank you"],
    emoji: "🌟"
  },
  {
    id: 27,
    type: 'testimonial_permission',
    title: "💝 Can we use your feedback?",
    description: "We'd love to share your story (with your permission)",
    required: false,
    options: ["Yes, with my name", "Yes, anonymously", "No, keep it private"],
    emoji: "💝"
  },
  
  // Emotional & Lifestyle Impact Section
  {
    id: 28,
    type: 'current_mood',
    title: "How are you feeling right now? 😊",
    description: "Your emotional well-being matters to us",
    required: false,
    options: ["Happy and energetic", "Calm and relaxed", "Neutral", "A bit low", "Stressed", "Other"],
    emoji: "😊"
  },
  {
    id: 29,
    type: 'happiness_factors',
    title: "What makes you feel happy during periods? 🌈",
    description: "Select all that apply - we want to understand your needs",
    required: false,
    options: ["Comfort food", "Rest and relaxation", "Exercise", "Music", "Reading", "Talking to friends", "Self-care rituals", "Nothing really", "Other"],
    emoji: "🌈"
  },
  {
    id: 30,
    type: 'confidence_boost',
    title: "Did Period Calm boost your confidence? 💪",
    description: "Feeling empowered during your period",
    required: false,
    options: ["Yes, significantly", "Yes, somewhat", "A little bit", "No change", "Not sure"],
    emoji: "💪"
  },
  {
    id: 31,
    type: 'lifestyle_impact',
    title: "🌟 How did Period Calm change your day?",
    description: "Select all that apply - we love success stories!",
    required: false,
    options: ["Could work normally", "Could exercise", "Better sleep quality", "More confident", "Less stress", "Better mood", "Could socialize", "Could focus on tasks", "No change"],
    emoji: "🌟"
  },
  {
    id: 32,
    type: 'self_care_essentials',
    title: "What are your period self-care essentials? 🛁",
    description: "Select all that apply - helps us understand your routine",
    required: false,
    options: ["Hot water bottle", "Comfortable clothes", "Healthy food", "Rest", "Exercise", "Meditation", "Reading", "Music", "Nothing specific", "Other"],
    emoji: "🛁"
  },
  
  // Additional Feedback Section
  {
    id: 33,
    type: 'improvements',
    title: "What could we improve? 🔧",
    description: "Your suggestions help us make Period Calm even better",
    required: false,
    placeholder: "Share your ideas for improvements...",
    emoji: "🔧"
  },
  {
    id: 34,
    type: 'final_thoughts',
    title: "💭 Any final thoughts?",
    description: "Share anything else you'd like us to know",
    required: false,
    placeholder: "Your thoughts, suggestions, or experiences...",
    emoji: "💭"
  }
]

export default function AIChatFeedbackForm({ onCloseAction }: { onCloseAction: () => void }) {
  const [currentStep, setCurrentStep] = useState(0)
  const [feedbackData, setFeedbackData] = useState<FeedbackData>({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    age: '',
    city: '',
    state: '',
    profession: '',
    cycle_length: '',
    period_regularity: '',
    pain_severity: '',
    previous_pain_management: '',
    what_used_before: '',
    when_tried: '',
    timing_of_use: '',
    frequency_of_use: '',
    preparation_method: '',
    effect_speed: '',
    effect_duration: '',
    overall_satisfaction: 0,
    taste_rating: 0,
    packaging_rating: 0,
    convenience_rating: 0,
    benefits_experienced: [],
    side_effects: '',
    before_after_impact: '',
    price_opinion: '',
    would_buy: '',
    recommend_to_others: '',
    social_media_handle: '',
    volunteer_interest: '',
    campaign_face_interest: '',
    testimonial_permission: '',
    current_mood: '',
    happiness_factors: [],
    confidence_boost: '',
    lifestyle_impact: [],
    self_care_essentials: [],
    improvements: '',
    final_thoughts: ''
  })
  const [currentAnswer, setCurrentAnswer] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showWelcome, setShowWelcome] = useState(true)
  const [achievements, setAchievements] = useState<string[]>([])
  const router = useRouter()

  const currentQuestion = QUESTIONS[currentStep]
  const progress = ((currentStep + 1) / QUESTIONS.length) * 100

  const handleInputChange = (value: string) => {
    setCurrentAnswer(value)
  }

  const handleOptionSelect = (option: string) => {
    if (currentQuestion.type === 'benefits_experienced' || 
        currentQuestion.type === 'lifestyle_impact' || 
        currentQuestion.type === 'happiness_factors' || 
        currentQuestion.type === 'self_care_essentials') {
      const currentArray = feedbackData[currentQuestion.type as keyof FeedbackData] as string[]
      
      const newArray = currentArray.includes(option)
        ? currentArray.filter(item => item !== option)
        : [...currentArray, option]
      
      setFeedbackData(prev => ({
        ...prev,
        [currentQuestion.type]: newArray
      }))
      setCurrentAnswer(option)
    } else {
      setCurrentAnswer(option)
      setFeedbackData(prev => ({
        ...prev,
        [currentQuestion.type]: option
      }))
    }
  }

  const handleNext = () => {
    if (currentStep < QUESTIONS.length - 1) {
      // Save current answer
      if (currentQuestion.type === 'name') {
        const names = currentAnswer.split(' ')
        setFeedbackData(prev => ({
          ...prev,
          first_name: names[0] || '',
          last_name: names.slice(1).join(' ') || ''
        }))
      } else if (currentQuestion.type === 'contact') {
        setFeedbackData(prev => ({ ...prev, email: currentAnswer }))
      } else if (currentQuestion.type === 'phone') {
        setFeedbackData(prev => ({ ...prev, phone: currentAnswer }))
      } else if (currentQuestion.type === 'age') {
        setFeedbackData(prev => ({ ...prev, age: currentAnswer }))
      } else if (currentQuestion.type === 'location') {
        setFeedbackData(prev => ({ ...prev, city: currentAnswer }))
      } else if (currentQuestion.type === 'profession') {
        setFeedbackData(prev => ({ ...prev, profession: currentAnswer }))
      } else if (currentQuestion.type === 'social_media_handle') {
        setFeedbackData(prev => ({ ...prev, social_media_handle: currentAnswer }))
      } else if (currentQuestion.type === 'overall_satisfaction') {
        const rating = parseInt(currentAnswer.split(' ')[0])
        setFeedbackData(prev => ({ ...prev, overall_satisfaction: rating }))
      } else if (currentQuestion.type === 'taste_rating') {
        const rating = parseInt(currentAnswer.split(' ')[0])
        setFeedbackData(prev => ({ ...prev, taste_rating: rating }))
      } else if (currentQuestion.type === 'packaging_rating') {
        const rating = parseInt(currentAnswer.split(' ')[0])
        setFeedbackData(prev => ({ ...prev, packaging_rating: rating }))
      } else if (currentQuestion.type === 'convenience_rating') {
        const rating = parseInt(currentAnswer.split(' ')[0])
        setFeedbackData(prev => ({ ...prev, convenience_rating: rating }))
      } else if (currentQuestion.type === 'improvements') {
        setFeedbackData(prev => ({ ...prev, improvements: currentAnswer }))
      } else if (currentQuestion.type === 'final_thoughts') {
        setFeedbackData(prev => ({ ...prev, final_thoughts: currentAnswer }))
      }
      
      // Check for achievements
      checkAchievements(currentStep + 1)
      
      setCurrentStep(prev => prev + 1)
      setCurrentAnswer('')
    } else {
      handleComplete()
    }
  }

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1)
      setCurrentAnswer('')
    }
  }

  const checkAchievements = (step: number) => {
    const newAchievements = []
    
    if (step === 5) {
      newAchievements.push('🎯 First Steps - Started your feedback journey!')
    }
    if (step === 10) {
      newAchievements.push('💪 Quarter Champion - You\'re making great progress!')
    }
    if (step === 17) {
      newAchievements.push('🌟 Halfway Hero - You\'re halfway through!')
    }
    if (step === 25) {
      newAchievements.push('💎 Detail Champion - You\'re sharing amazing details!')
    }
    if (step === 30) {
      newAchievements.push('🏆 Almost There - Final stretch!')
    }
    
    if (newAchievements.length > 0) {
      setAchievements(prev => [...prev, ...newAchievements])
    }
  }

  const handleComplete = async () => {
    setIsSubmitting(true)
    setError(null)
    
    try {
      // Log the feedback data
      console.log('Comprehensive feedback submitted:', feedbackData)
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      // Show success message
      setShowSuccess(true)
      
      // Auto close after 4 seconds
      setTimeout(() => {
        onCloseAction()
        router.push('/')
      }, 4000)
      
    } catch (err) {
      console.error('Error submitting feedback:', err)
      setError('Something went wrong. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const canProceedToNext = () => {
    if (currentQuestion.required) {
      if (currentQuestion.type === 'name') {
        return currentAnswer.trim().split(' ').length >= 2
      }
      if (currentQuestion.type === 'contact') {
        return currentAnswer.includes('@') && currentAnswer.includes('.')
      }
      if (currentQuestion.type === 'overall_satisfaction') {
        return currentAnswer !== ''
      }
      if (currentQuestion.type === 'recommend_to_others') {
        return currentAnswer !== ''
      }
      return currentAnswer.trim() !== ''
    }
    return true
  }

  const handleStartFeedback = () => {
    setShowWelcome(false)
  }

  const renderWelcomeScreen = () => (
    <div className="text-center space-y-6 max-w-2xl mx-auto">
      {/* AI Assistant Avatar */}
      <div className="relative">
        <div className="w-20 h-20 md:w-24 md:h-24 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto animate-pulse">
          <span className="text-3xl md:text-4xl">{AI_ASSISTANT.avatar}</span>
        </div>
        <div className="absolute -top-2 -right-2 w-6 h-6 md:w-8 md:h-8 bg-yellow-400 rounded-full flex items-center justify-center animate-bounce">
          <Sparkles className="w-3 h-3 md:w-4 md:h-4 text-white" />
        </div>
      </div>

      {/* Welcome Message */}
      <div className="space-y-3 md:space-y-4">
        <h1 className="text-2xl md:text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
          Share Your Period Calm Story! 🌟
        </h1>
        <p className="text-lg md:text-xl text-gray-600 px-4">
          Hi beautiful! I'm <span className="font-semibold text-purple-600">{AI_ASSISTANT.name}</span>, and I'm here to collect your amazing feedback.
        </p>
        <p className="text-base md:text-lg text-gray-700 px-4">
          Your experience with Period Calm is incredibly valuable to us. Every detail you share helps us improve and helps other women find relief.
        </p>
      </div>

      {/* Impact Preview */}
      <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-4 md:p-6 rounded-xl border-2 border-purple-200 mx-4">
        <h3 className="text-base md:text-lg font-semibold text-gray-900 mb-3 md:mb-4">Your Feedback Makes a Difference:</h3>
        <div className="grid grid-cols-2 gap-3 md:gap-4 text-sm">
          <div className="text-center">
            <div className="text-xl md:text-2xl font-bold text-purple-600">✨</div>
            <div className="text-gray-600 text-xs md:text-sm">Improve the Product</div>
          </div>
          <div className="text-center">
            <div className="text-xl md:text-2xl font-bold text-pink-600">💕</div>
            <div className="text-gray-600 text-xs md:text-sm">Help Other Women</div>
          </div>
          <div className="text-center">
            <div className="text-xl md:text-2xl font-bold text-indigo-600">🌟</div>
            <div className="text-gray-600 text-xs md:text-sm">Shape the Future</div>
          </div>
          <div className="text-center">
            <div className="text-xl md:text-2xl font-bold text-rose-600">🎯</div>
            <div className="text-gray-600 text-xs md:text-sm">Perfect the Formula</div>
          </div>
        </div>
      </div>

      {/* Call to Action */}
      <div className="space-y-4 px-4">
        <p className="text-base md:text-lg text-gray-700">
          Ready to share your thoughts and help us create something amazing?
        </p>
        <Button 
          onClick={handleStartFeedback}
          className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-6 md:px-8 py-3 text-base md:text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
        >
          💝 Share My Experience
        </Button>
      </div>
    </div>
  )

  const renderQuestion = () => (
    <div className="space-y-6 max-w-2xl mx-auto">
      {/* Progress Bar */}
      <div className="space-y-2">
        <div className="flex justify-between text-sm text-gray-600">
          <span>Question {currentStep + 1} of {QUESTIONS.length}</span>
          <span>{Math.round(progress)}%</span>
        </div>
        <Progress value={progress} className="h-2" />
      </div>

      {/* Achievements */}
      {achievements.length > 0 && (
        <div className="bg-gradient-to-r from-yellow-50 to-orange-50 p-3 rounded-lg border border-yellow-200">
          <div className="flex items-center gap-2 text-sm text-yellow-800">
            <Trophy className="w-4 h-4" />
            <span className="font-semibold">Latest Achievement:</span>
          </div>
          <p className="text-xs text-yellow-700 mt-1">{achievements[achievements.length - 1]}</p>
        </div>
      )}

      {/* Question */}
      <div className="space-y-4">
        <div className="text-center space-y-2">
          <div className="text-4xl mb-2">{currentQuestion.emoji}</div>
          <h2 className="text-xl md:text-2xl font-bold text-gray-900">
            {currentQuestion.title}
          </h2>
          {currentQuestion.description && (
            <p className="text-gray-600">{currentQuestion.description}</p>
          )}
        </div>

        {/* Answer Input */}
        <div className="space-y-4">
          {currentQuestion.options ? (
            <div className="grid gap-3">
              {currentQuestion.options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => handleOptionSelect(option)}
                  className={`p-4 text-left rounded-lg border-2 transition-all duration-200 ${
                    (currentQuestion.type === 'benefits_experienced' || 
                     currentQuestion.type === 'lifestyle_impact' || 
                     currentQuestion.type === 'happiness_factors' || 
                     currentQuestion.type === 'self_care_essentials')
                      ? (feedbackData[currentQuestion.type as keyof FeedbackData] as string[]).includes(option)
                          ? 'border-purple-500 bg-purple-50 text-purple-700'
                          : 'border-gray-200 hover:border-purple-300 hover:bg-purple-50'
                      : (currentAnswer === option
                          ? 'border-purple-500 bg-purple-50 text-purple-700'
                          : 'border-gray-200 hover:border-purple-300 hover:bg-purple-50')
                  }`}
                >
                  {option}
                </button>
              ))}
            </div>
          ) : (
            <Input
              type={currentQuestion.type === 'contact' ? 'email' : 'text'}
              value={currentAnswer}
              onChange={(e) => handleInputChange(e.target.value)}
              placeholder={currentQuestion.placeholder}
              className="text-lg p-4"
            />
          )}
        </div>
      </div>

      {/* Navigation */}
      <div className="flex justify-between pt-6">
        <Button
          variant="outline"
          onClick={handlePrevious}
          disabled={currentStep === 0}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Previous
        </Button>
        
        <Button
          onClick={handleNext}
          disabled={!canProceedToNext() || isSubmitting}
          className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white flex items-center gap-2"
        >
          {currentStep === QUESTIONS.length - 1 ? (
            <>
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Submitting...
                </>
              ) : (
                <>
                  <CheckCircle className="w-4 h-4" />
                  Submit Feedback
                </>
              )}
            </>
          ) : (
            <>
              Next
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </Button>
      </div>
    </div>
  )

  const renderSuccessScreen = () => (
    <div className="text-center space-y-6 max-w-2xl mx-auto">
      <div className="relative">
        <CheckCircle className="w-16 h-16 text-green-500 mx-auto" />
        <div className="absolute -top-2 -right-2 w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center animate-bounce">
          <Trophy className="w-3 h-3 text-white" />
        </div>
      </div>
      <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
        Thank You! 🌟
      </h2>
      <p className="text-lg text-gray-600">
        Your comprehensive feedback has been submitted successfully. We're so grateful for your detailed insights!
      </p>
      
      {/* Achievement Summary */}
      {achievements.length > 0 && (
        <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-4 rounded-xl border border-purple-200">
          <h3 className="font-semibold text-purple-700 mb-2">🏆 Your Achievements:</h3>
          <div className="space-y-1">
            {achievements.map((achievement, index) => (
              <p key={index} className="text-sm text-purple-600">• {achievement}</p>
            ))}
          </div>
        </div>
      )}
      
      <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-6 rounded-xl border border-green-200">
        <p className="text-sm text-green-700">
          Redirecting you back to the homepage...
        </p>
      </div>
    </div>
  )

  const renderContent = () => {
    if (showSuccess) {
      return renderSuccessScreen()
    }

    if (showWelcome) {
      return renderWelcomeScreen()
    }

    return renderQuestion()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="relative w-full max-w-4xl max-h-[90vh] mx-4 bg-white rounded-2xl shadow-2xl overflow-hidden">
        {/* Close Button */}
        <button
          onClick={onCloseAction}
          className="absolute top-4 right-4 z-10 p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
        >
          <X className="w-6 h-6" />
        </button>

        {/* Content */}
        <div className="p-6 md:p-8 overflow-y-auto max-h-[90vh]">
          {renderContent()}
        </div>
      </div>
    </div>
  )
} 