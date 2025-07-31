'use client'

import React, { useState, useRef, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Star, X, ArrowLeft, ArrowRight, Sparkles, Heart, MessageCircle, CheckCircle, Loader2 } from 'lucide-react'
import { useRouter } from 'next/navigation'

interface FeedbackData {
  first_name: string
  last_name: string
  email: string
  age: string
  phone: string
  city: string
  overall_satisfaction: number
  taste_rating: number
  value_rating: number
  packaging_rating: number
  benefits_experienced: string[]
  lifestyle_impact: string[]
  would_recommend: string
  final_thoughts: string
  testimonial_permission: string
}

const AI_ASSISTANT = {
  name: "Luna",
  avatar: "✨",
  personality: "Warm, empathetic, and encouraging"
}

const QUESTIONS = [
  {
    id: 1,
    type: 'name',
    title: "What's your beautiful name? 💕",
    description: "Let's start with the basics!",
    required: true,
    placeholder: "Enter your first and last name"
  },
  {
    id: 2,
    type: 'contact',
    title: "How can we reach you? 📧",
    description: "We'd love to keep you updated!",
    required: true,
    placeholder: "your.email@example.com"
  },
  {
    id: 3,
    type: 'age',
    title: "What's your age? 🎂",
    description: "This helps us understand our community better",
    required: false,
    placeholder: "e.g., 25"
  },
  {
    id: 4,
    type: 'location',
    title: "Where are you from? 🌍",
    description: "We love connecting with women from all over!",
    required: false,
    placeholder: "City, State"
  },
  {
    id: 5,
    type: 'rating',
    title: "🌟 Overall, how satisfied are you?",
    description: "Rate your experience with Period Calm",
    required: true,
    options: ["1 - Not satisfied", "2 - Somewhat satisfied", "3 - Satisfied", "4 - Very satisfied", "5 - Extremely satisfied"]
  },
  {
    id: 6,
    type: 'benefits',
    title: "✨ What magic did you experience?",
    description: "Select all that apply",
    required: false,
    options: ["Cramp relief", "Mood improvement", "Better sleep", "Energy boost", "Reduced bloating", "Regular cycles"]
  },
  {
    id: 7,
    type: 'lifestyle',
    title: "🌟 How did Period Calm change your day?",
    description: "Select all that apply",
    required: false,
    options: ["Could work normally", "Could exercise", "Better sleep quality", "More confident", "Less stress", "Better mood"]
  },
  {
    id: 8,
    type: 'recommendation',
    title: "💝 Would you recommend Period Calm?",
    description: "Your honest opinion matters to us",
    required: true,
    options: ["Yes, definitely!", "Yes, probably", "Maybe", "No, probably not", "No, definitely not"]
  },
  {
    id: 9,
    type: 'testimonial',
    title: "💝 Can we use your feedback?",
    description: "We'd love to share your story (with your permission)",
    required: false,
    options: ["Yes, with my name", "Yes, anonymously", "No, keep it private"]
  },
  {
    id: 10,
    type: 'final',
    title: "💭 Any final thoughts?",
    description: "Share anything else you'd like us to know",
    required: false,
    placeholder: "Your thoughts, suggestions, or experiences..."
  }
]

export default function AIChatFeedbackForm({ onCloseAction }: { onCloseAction: () => void }) {
  const [currentStep, setCurrentStep] = useState(0)
  const [feedbackData, setFeedbackData] = useState<FeedbackData>({
    first_name: '',
    last_name: '',
    email: '',
    age: '',
    phone: '',
    city: '',
    overall_satisfaction: 0,
    taste_rating: 0,
    value_rating: 0,
    packaging_rating: 0,
    benefits_experienced: [],
    lifestyle_impact: [],
    would_recommend: '',
    final_thoughts: '',
    testimonial_permission: ''
  })
  const [currentAnswer, setCurrentAnswer] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showWelcome, setShowWelcome] = useState(true)
  const router = useRouter()

  const currentQuestion = QUESTIONS[currentStep]
  const progress = ((currentStep + 1) / QUESTIONS.length) * 100

  const handleInputChange = (value: string) => {
    setCurrentAnswer(value)
  }

  const handleOptionSelect = (option: string) => {
    if (currentQuestion.type === 'benefits' || currentQuestion.type === 'lifestyle') {
      const currentArray = currentQuestion.type === 'benefits' 
        ? feedbackData.benefits_experienced 
        : feedbackData.lifestyle_impact
      
      const newArray = currentArray.includes(option)
        ? currentArray.filter(item => item !== option)
        : [...currentArray, option]
      
      setFeedbackData(prev => ({
        ...prev,
        [currentQuestion.type === 'benefits' ? 'benefits_experienced' : 'lifestyle_impact']: newArray
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
      } else if (currentQuestion.type === 'age') {
        setFeedbackData(prev => ({ ...prev, age: currentAnswer }))
      } else if (currentQuestion.type === 'location') {
        setFeedbackData(prev => ({ ...prev, city: currentAnswer }))
      } else if (currentQuestion.type === 'rating') {
        const rating = parseInt(currentAnswer.split(' ')[0])
        setFeedbackData(prev => ({ ...prev, overall_satisfaction: rating }))
      } else if (currentQuestion.type === 'final') {
        setFeedbackData(prev => ({ ...prev, final_thoughts: currentAnswer }))
      }
      
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

  const handleComplete = async () => {
    setIsSubmitting(true)
    setError(null)
    
    try {
      // Log the feedback data
      console.log('Feedback submitted:', feedbackData)
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Show success message
      setShowSuccess(true)
      
      // Auto close after 3 seconds
      setTimeout(() => {
        onCloseAction()
        router.push('/')
      }, 3000)
      
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
      if (currentQuestion.type === 'rating') {
        return currentAnswer !== ''
      }
      if (currentQuestion.type === 'recommendation') {
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

      {/* Call to Action */}
      <div className="space-y-4 px-4">
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

      {/* Question */}
      <div className="space-y-4">
        <div className="text-center space-y-2">
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
                    (currentQuestion.type === 'benefits' || currentQuestion.type === 'lifestyle')
                      ? (feedbackData[currentQuestion.type === 'benefits' ? 'benefits_experienced' : 'lifestyle_impact'].includes(option)
                          ? 'border-purple-500 bg-purple-50 text-purple-700'
                          : 'border-gray-200 hover:border-purple-300 hover:bg-purple-50')
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
      <CheckCircle className="w-16 h-16 text-green-500 mx-auto" />
      <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
        Thank You! 🌟
      </h2>
      <p className="text-lg text-gray-600">
        Your feedback has been submitted successfully. We appreciate you taking the time to share your experience with Period Calm!
      </p>
      <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-6 rounded-xl">
        <p className="text-sm text-gray-600">
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