'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { X, CheckCircle } from 'lucide-react'

interface SimpleFeedbackFormProps {
  isOpen: boolean
  onClose: () => void
}

export default function SimpleFeedbackForm({ isOpen, onClose }: SimpleFeedbackFormProps) {
  const [currentStep, setCurrentStep] = useState(1)
  const [feedbackData, setFeedbackData] = useState({
    name: '',
    email: '',
    rating: 0,
    experience: '',
    recommendation: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)

  const handleInputChange = (field: string, value: string | number) => {
    setFeedbackData(prev => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async () => {
    setIsSubmitting(true)
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      console.log('Feedback submitted:', feedbackData)
      setShowSuccess(true)
      
      // Auto close after 3 seconds
      setTimeout(() => {
        onClose()
        setShowSuccess(false)
        setCurrentStep(1)
        setFeedbackData({
          name: '',
          email: '',
          rating: 0,
          experience: '',
          recommendation: ''
        })
      }, 3000)
      
    } catch (error) {
      console.error('Error submitting feedback:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const renderStep1 = () => (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Your Name *
        </label>
        <input
          type="text"
          value={feedbackData.name}
          onChange={(e) => handleInputChange('name', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
          placeholder="Enter your name"
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Email *
        </label>
        <input
          type="email"
          value={feedbackData.email}
          onChange={(e) => handleInputChange('email', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
          placeholder="Enter your email"
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Overall Rating *
        </label>
        <div className="flex gap-2">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => handleInputChange('rating', star)}
              className={`text-2xl ${feedbackData.rating >= star ? 'text-yellow-400' : 'text-gray-300'}`}
            >
              ★
            </button>
          ))}
        </div>
      </div>
      
      <Button
        onClick={() => setCurrentStep(2)}
        disabled={!feedbackData.name || !feedbackData.email || feedbackData.rating === 0}
        className="w-full bg-purple-600 hover:bg-purple-700"
      >
        Next
      </Button>
    </div>
  )

  const renderStep2 = () => (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Your Experience
        </label>
        <textarea
          value={feedbackData.experience}
          onChange={(e) => handleInputChange('experience', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
          rows={4}
          placeholder="Tell us about your experience with Period Calm..."
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Would you recommend Period Calm?
        </label>
        <select
          value={feedbackData.recommendation}
          onChange={(e) => handleInputChange('recommendation', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
        >
          <option value="">Select an option</option>
          <option value="Yes, definitely!">Yes, definitely!</option>
          <option value="Yes, probably">Yes, probably</option>
          <option value="Maybe">Maybe</option>
          <option value="No">No</option>
        </select>
      </div>
      
      <div className="flex gap-2">
        <Button
          onClick={() => setCurrentStep(1)}
          variant="outline"
          className="flex-1"
        >
          Back
        </Button>
        <Button
          onClick={handleSubmit}
          disabled={isSubmitting}
          className="flex-1 bg-purple-600 hover:bg-purple-700"
        >
          {isSubmitting ? 'Submitting...' : 'Submit Feedback'}
        </Button>
      </div>
    </div>
  )

  const renderSuccess = () => (
    <div className="text-center space-y-4">
      <CheckCircle className="w-16 h-16 text-green-500 mx-auto" />
      <h3 className="text-xl font-semibold text-gray-900">
        Thank You! 🌟
      </h3>
      <p className="text-gray-600">
        Your feedback has been submitted successfully. We appreciate you taking the time to share your experience with Period Calm!
      </p>
    </div>
  )

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center">
            {showSuccess ? 'Feedback Submitted!' : 'Share Your Experience'}
          </DialogTitle>
          <button
            onClick={onClose}
            className="absolute right-4 top-4 text-gray-400 hover:text-gray-600"
          >
            <X className="w-5 h-5" />
          </button>
        </DialogHeader>
        
        <div className="py-4">
          {showSuccess ? renderSuccess() : (
            currentStep === 1 ? renderStep1() : renderStep2()
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
} 