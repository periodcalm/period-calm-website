"use client"

import { useState, useEffect, useRef, useCallback, useMemo } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  Heart, 
  Star, 
  Calendar, 
  Clock, 
  CheckCircle, 
  Users, 
  Sparkles,
  MessageCircle,
  Zap,
  Moon,
  Sun,
  Coffee,
  Send,
  Trophy,
  PartyPopper,
  ChevronRight,
  X,
  Mic,
  MicOff,
  Smile,
  ThumbsUp,
  ThumbsDown,
  Sparkles as SparklesIcon
} from 'lucide-react'

interface ChatMessage {
  id: string
  type: 'bot' | 'user' | 'system'
  content: string
  timestamp: Date
  options?: ChatOption[]
  inputType?: 'text' | 'number' | 'date' | 'select' | 'rating' | 'multi-select' | 'emoji'
  inputData?: any
  reactions?: string[]
  quickReplies?: string[]
}

interface ChatOption {
  id: string
  label: string
  icon?: any
  emoji?: string
  description?: string
}

interface FeedbackData {
  firstName: string
  lastName: string
  age: string
  phone: string
  city: string
  state: string
  instagram: string
  email: string
  cycleLength: string
  lastPeriodDate: string
  whenDrank: string
  effectWithin30Min: string
  rating: number
  wouldDrinkAgain: string
  benefits: string[]
  currentFeeling: string
  selfCareEssentials: string[]
  wouldRecommend: string
  faceAndSoulCampaign: string
  fairPrice: string
  finalThoughts: string
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

const quickReplies = [
  "Amazing! 😍",
  "Not bad 😊",
  "Could be better 😕",
  "Love it! 💖",
  "So helpful! ✨",
  "Life changing! 🌟"
]

// Global flag to prevent multiple initializations
let isInitialized = false

// Generate unique ID with more randomness
const generateId = () => {
  const timestamp = Date.now()
  const random = Math.random().toString(36).substring(2, 15)
  const random2 = Math.random().toString(36).substring(2, 15)
  return `msg_${timestamp}_${random}_${random2}`
}

export default function ChatFeedbackForm({ onClose }: { onClose: () => void }) {
  const [messages, setMessages] = useState<ChatMessage[]>([])
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
  const [currentStep, setCurrentStep] = useState(0)
  const [achievements, setAchievements] = useState<string[]>([])
  const [inputValue, setInputValue] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [isRecording, setIsRecording] = useState(false)
  const [showEmojiPicker, setShowEmojiPicker] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const initializationRef = useRef(false)

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [])

  useEffect(() => {
    scrollToBottom()
  }, [messages, isTyping, scrollToBottom])

  // Initialize conversation only once using multiple safeguards
  useEffect(() => {
    if (!isInitialized && !initializationRef.current && messages.length === 0) {
      isInitialized = true
      initializationRef.current = true
      
      // Use setTimeout to ensure this runs after the component is fully mounted
      setTimeout(() => {
        initializeConversation()
      }, 100)
    }
  }, [messages.length])

  const initializeConversation = useCallback(async () => {
    try {
      console.log('Starting conversation...')
      await addMessageWithTyping("Hey beautiful! 👋 I'm your Period Calm assistant!")
      await addMessageWithTyping("Ready to share your journey? This will be fun! 💕")
      await addMessageWithTyping("What's your first name?", 'text', { field: 'firstName' })
    } catch (error) {
      console.error('Error starting conversation:', error)
    }
  }, [])

  const addMessageWithTyping = useCallback(async (content: string, inputType?: 'text' | 'number' | 'date' | 'select' | 'rating' | 'multi-select' | 'emoji', inputData?: any) => {
    setIsTyping(true)
    await new Promise(resolve => setTimeout(resolve, 1500))
    setIsTyping(false)
    
    const newMessage = {
      id: generateId(),
      type: 'bot' as const,
      content,
      timestamp: new Date(),
      inputType,
      inputData,
      quickReplies: inputType === 'text' ? quickReplies : undefined
    }
    
    setMessages(prev => [...prev, newMessage])
  }, [])

  const addUserMessage = useCallback((content: string) => {
    const newMessage = {
      id: generateId(),
      type: 'user' as const,
      content,
      timestamp: new Date()
    }
    
    setMessages(prev => [...prev, newMessage])
  }, [])

  const addSystemMessage = useCallback((content: string) => {
    const newMessage = {
      id: generateId(),
      type: 'system' as const,
      content,
      timestamp: new Date()
    }
    
    setMessages(prev => [...prev, newMessage])
  }, [])

  const updateFeedbackData = useCallback((field: keyof FeedbackData, value: any) => {
    setFeedbackData(prev => ({ ...prev, [field]: value }))
  }, [])

  const handleInputSubmit = useCallback(async () => {
    if (!inputValue.trim() || isProcessing) return

    const currentMessage = messages[messages.length - 1]
    if (currentMessage?.type === 'bot' && currentMessage.inputType === 'text') {
      const field = currentMessage.inputData?.field
      if (field) {
        setIsProcessing(true)
        updateFeedbackData(field, inputValue)
        addUserMessage(inputValue)
        setInputValue('')
        
        await progressConversation()
        setIsProcessing(false)
      }
    }
  }, [inputValue, isProcessing, messages, updateFeedbackData, addUserMessage])

  const handleQuickReply = useCallback(async (reply: string) => {
    if (isProcessing) return
    
    setIsProcessing(true)
    addUserMessage(reply)
    setInputValue('')
    
    await progressConversation()
    setIsProcessing(false)
  }, [isProcessing, addUserMessage])

  const handleOptionSelect = useCallback(async (optionId: string, messageId: string) => {
    if (isProcessing) return
    
    const message = messages.find(m => m.id === messageId)
    if (!message) return

    setIsProcessing(true)
    addUserMessage(optionId)
    
    // Update data based on the message type
    if (message.content.includes('When did you drink Period Calm')) {
      updateFeedbackData('whenDrank', optionId)
    } else if (message.content.includes('Did you feel any effect')) {
      updateFeedbackData('effectWithin30Min', optionId)
    } else if (message.content.includes('Would you drink Period Calm again')) {
      updateFeedbackData('wouldDrinkAgain', optionId)
    } else if (message.content.includes('Would you recommend')) {
      updateFeedbackData('wouldRecommend', optionId)
    } else if (message.content.includes('Interested in our')) {
      updateFeedbackData('faceAndSoulCampaign', optionId)
    } else if (message.content.includes('Fair price point')) {
      updateFeedbackData('fairPrice', optionId)
    }

    await progressConversation()
    setIsProcessing(false)
  }, [isProcessing, messages, addUserMessage, updateFeedbackData])

  const progressConversation = useCallback(async () => {
    setCurrentStep(prev => prev + 1)
    
    switch (currentStep) {
      case 0: // After first name
        await addMessageWithTyping(`Nice to meet you, ${feedbackData.firstName}! 💕`)
        await addMessageWithTyping("How old are you? (This helps us personalize your experience)", 'number', { field: 'age' })
        break
      case 1: // After age
        await addMessageWithTyping("Perfect! Now let's map your cycle journey 📅")
        await addMessageWithTyping("When was your last period? (Tap the date below)", 'date', { field: 'lastPeriodDate' })
        break
      case 2: // After last period date
        await addMessageWithTyping("Great! Now the fun part... 🎉")
        await addMessageWithTyping("When did you try Period Calm? Pick your vibe:", 'select', { 
          options: timeSlots,
          field: 'whenDrank'
        })
        break
      case 3: // After when drank
        await addMessageWithTyping("Amazing! 🌟 How did you feel within 30 minutes?", 'select', {
          options: [
            { id: 'yes_definitely', label: 'Yes, definitely! One positive change', emoji: '😊' },
            { id: 'maybe_little', label: 'Maybe, a little bit', emoji: '🤔' },
            { id: 'no_not_really', label: 'No, not really', emoji: '😕' },
            { id: 'no_noticeable', label: 'No noticeable change', emoji: '😐' }
          ],
          field: 'effectWithin30Min'
        })
        break
      case 4: // After effect
        await addMessageWithTyping("Thanks for sharing! ⭐ How would you rate your experience?", 'rating', { field: 'rating' })
        break
      case 5: // After rating
        await addMessageWithTyping("Awesome! 🎯 Would you drink Period Calm again?", 'select', {
          options: [
            { id: 'definitely_absolutely', label: 'Definitely, absolutely', emoji: '💯' },
            { id: 'probably', label: 'Probably', emoji: '👍' },
            { id: 'might_be_unsure', label: 'Might be, unsure', emoji: '🤷‍♀️' },
            { id: 'probably_not', label: 'Probably not', emoji: '👎' },
            { id: 'definitely_not', label: 'Definitely not again', emoji: '❌' }
          ],
          field: 'wouldDrinkAgain'
        })
        break
      case 6: // After would drink again
        await addMessageWithTyping("Perfect! 🌈 What benefits did you experience? (Select all that apply)", 'multi-select', {
          options: benefits,
          field: 'benefits'
        })
        break
      case 7: // After benefits
        await addMessageWithTyping("Wonderful! 💭 How are you feeling right now?", 'text', { field: 'currentFeeling' })
        break
      case 8: // After current feeling
        await addMessageWithTyping("Love that! 🛀 What are your self-care essentials? (Select all that apply)", 'multi-select', {
          options: selfCareEssentials,
          field: 'selfCareEssentials'
        })
        break
      case 9: // After self care
        await addMessageWithTyping("You're helping thousands! 👥 Would you recommend Period Calm to other women?", 'select', {
          options: [
            { id: 'definitely_recommend', label: 'Would definitely recommend!', emoji: '💖' },
            { id: 'yes_with_conditions', label: 'Yes, with conditions', emoji: '🤝' },
            { id: 'maybe_unsure', label: 'Maybe, unsure', emoji: '🤔' },
            { id: 'probably_not', label: 'Probably not', emoji: '😕' }
          ],
          field: 'wouldRecommend'
        })
        break
      case 10: // After recommend
        await addMessageWithTyping("Amazing! 🎬 Interested in our 'Face & Soul' campaign?", 'select', {
          options: [
            { id: 'yes_love_to', label: 'Yes, I\'d love to!', emoji: '🎉' },
            { id: 'maybe_tell_more', label: 'Maybe, tell me more', emoji: '🤔' },
            { id: 'not_right_now', label: 'Not right now', emoji: '😊' }
          ],
          field: 'faceAndSoulCampaign'
        })
        break
      case 11: // After campaign
        await addMessageWithTyping("Perfect! 💰 What's a fair price point for Period Calm?", 'select', {
          options: [
            { id: '199', label: '₹199', emoji: '💰', description: 'Budget-friendly' },
            { id: '299', label: '₹299', emoji: '💎', description: 'Mid-range' },
            { id: '399', label: '₹399', emoji: '✨', description: 'Premium' },
            { id: '599', label: '₹599', emoji: '👑', description: 'Luxury' }
          ],
          field: 'fairPrice'
        })
        break
      case 12: // After price
        await addMessageWithTyping("Almost done! 💌 Any final thoughts or messages for us?", 'text', { field: 'finalThoughts' })
        break
      case 13: // After final thoughts
        await addMessageWithTyping("🎉 You're amazing! Thank you for sharing your story!")
        await addMessageWithTyping("You've just helped 500+ trial participants find relief! 🌟")
        await addMessageWithTyping("Your feedback is invaluable to us. We'll be in touch soon! 💕")
        addSystemMessage("🎊 Achievement unlocked: Feedback Champion!")
        setTimeout(() => {
          onClose()
        }, 3000)
        break
    }
  }, [currentStep, feedbackData.firstName, addMessageWithTyping, addSystemMessage, onClose])

  const renderTypingIndicator = useCallback(() => (
    <div className="flex justify-start mb-4">
      <div className="bg-gradient-to-r from-rose-100 to-pink-100 px-4 py-3 rounded-2xl">
        <div className="flex items-center space-x-2">
          <div className="w-6 h-6 bg-gradient-to-r from-rose-400 to-pink-400 rounded-full flex items-center justify-center text-white text-xs font-bold">
            PC
          </div>
          <div className="flex space-x-1">
            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
          </div>
        </div>
      </div>
    </div>
  ), [])

  const renderMessage = useCallback((message: ChatMessage) => {
    const isBot = message.type === 'bot'
    const isSystem = message.type === 'system'
    
    if (isSystem) {
      return (
        <div className="flex justify-center mb-4">
          <div className="bg-yellow-100 text-yellow-800 px-4 py-2 rounded-full text-sm font-medium flex items-center space-x-2">
            <Trophy className="w-4 h-4" />
            <span>{message.content}</span>
          </div>
        </div>
      )
    }
    
    return (
      <div
        className={`flex ${isBot ? 'justify-start' : 'justify-end'} mb-4`}
      >
        <div
          className={`max-w-xs lg:max-w-md px-4 py-3 rounded-2xl ${
            isBot
              ? 'bg-gradient-to-r from-rose-100 to-pink-100 text-gray-800'
              : 'bg-gradient-to-r from-rose-500 to-pink-500 text-white'
          }`}
        >
          <div className="flex items-start space-x-2">
            {isBot && (
              <div className="w-6 h-6 bg-gradient-to-r from-rose-400 to-pink-400 rounded-full flex items-center justify-center text-white text-xs font-bold">
                PC
              </div>
            )}
            <div className="flex-1">
              <p className="text-sm leading-relaxed">{message.content}</p>
              
              {/* Quick Replies */}
              {message.quickReplies && (
                <div className="mt-3 flex flex-wrap gap-2">
                  {message.quickReplies.map((reply, index) => (
                    <button
                      key={`reply_${message.id}_${index}`}
                      onClick={() => handleQuickReply(reply)}
                      disabled={isProcessing}
                      className="px-3 py-1 bg-white/80 hover:bg-white text-gray-700 rounded-full text-xs transition-colors border border-gray-200 disabled:opacity-50"
                    >
                      {reply}
                    </button>
                  ))}
                </div>
              )}
              
              {/* Input Options */}
              {message.inputType === 'select' && message.inputData?.options && (
                <div className="mt-3 space-y-2">
                  {message.inputData.options.map((option: ChatOption) => (
                    <button
                      key={`option_${message.id}_${option.id}`}
                      onClick={() => handleOptionSelect(option.id, message.id)}
                      disabled={isProcessing}
                      className="w-full text-left p-2 rounded-lg bg-white/80 hover:bg-white transition-colors border border-gray-200 hover:shadow-sm disabled:opacity-50"
                    >
                      <div className="flex items-center space-x-2">
                        {option.emoji && <span className="text-lg">{option.emoji}</span>}
                        <span className="text-sm font-medium">{option.label}</span>
                      </div>
                      {option.description && (
                        <p className="text-xs text-gray-600 mt-1">{option.description}</p>
                      )}
                    </button>
                  ))}
                </div>
              )}
              
              {message.inputType === 'rating' && (
                <div className="mt-3">
                  <div className="flex space-x-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={`star_${message.id}_${star}`}
                        onClick={async () => {
                          if (isProcessing) return
                          setIsProcessing(true)
                          updateFeedbackData('rating', star)
                          addUserMessage(`${star} star${star > 1 ? 's' : ''}`)
                          await progressConversation()
                          setIsProcessing(false)
                        }}
                        disabled={isProcessing}
                        className="text-2xl transition-all duration-200 hover:scale-110 disabled:opacity-50"
                      >
                        <Star
                          className={`w-6 h-6 ${
                            star <= feedbackData.rating
                              ? 'fill-yellow-400 text-yellow-400'
                              : 'text-gray-300 hover:text-yellow-300'
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                </div>
              )}
              
              {message.inputType === 'multi-select' && message.inputData?.options && (
                <div className="mt-3 space-y-2">
                  {message.inputData.options.map((option: ChatOption) => (
                    <button
                      key={`multi_${message.id}_${option.id}`}
                      onClick={() => {
                        const field = message.inputData?.field as keyof FeedbackData
                        if (field) {
                          const currentValues = feedbackData[field] as string[]
                          const newValues = currentValues.includes(option.id)
                            ? currentValues.filter(v => v !== option.id)
                            : [...currentValues, option.id]
                          updateFeedbackData(field, newValues)
                        }
                      }}
                      className={`w-full text-left p-2 rounded-lg transition-all duration-200 border ${
                        ((feedbackData[message.inputData?.field as keyof FeedbackData]) as string[])?.includes(option.id)
                          ? 'bg-rose-100 border-rose-300 shadow-sm'
                          : 'bg-white/80 border-gray-200 hover:bg-white hover:shadow-sm'
                      }`}
                    >
                      <div className="flex items-center space-x-2">
                        {option.emoji && <span className="text-lg">{option.emoji}</span>}
                        <span className="text-sm font-medium">{option.label}</span>
                      </div>
                    </button>
                  ))}
                  <button
                    onClick={async () => {
                      if (isProcessing) return
                      setIsProcessing(true)
                      addUserMessage('Selected benefits')
                      await progressConversation()
                      setIsProcessing(false)
                    }}
                    disabled={isProcessing}
                    className="w-full mt-3 p-2 bg-gradient-to-r from-rose-500 to-pink-500 text-white rounded-lg text-sm font-medium hover:from-rose-600 hover:to-pink-600 transition-all duration-200 disabled:opacity-50"
                  >
                    Continue
                  </button>
                </div>
              )}
              
              {message.inputType === 'date' && (
                <div className="mt-3">
                  <input
                    type="date"
                    onChange={async (e) => {
                      if (isProcessing) return
                      setIsProcessing(true)
                      updateFeedbackData('lastPeriodDate', e.target.value)
                      addUserMessage(e.target.value)
                      await progressConversation()
                      setIsProcessing(false)
                    }}
                    disabled={isProcessing}
                    className="w-full p-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-rose-500 focus:border-transparent disabled:opacity-50"
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    )
  }, [isProcessing, feedbackData, handleQuickReply, handleOptionSelect, updateFeedbackData, addUserMessage, progressConversation])

  const progressPercentage = useMemo(() => Math.round(((currentStep + 1) / 14) * 100), [currentStep])

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <Card className="w-full max-w-2xl h-[80vh] bg-white shadow-2xl">
        <CardContent className="p-0 h-full flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gradient-to-r from-rose-50 to-pink-50">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-r from-rose-400 to-pink-400 rounded-full flex items-center justify-center text-white text-sm font-bold animate-pulse">
                PC
              </div>
              <div>
                <h2 className="text-lg font-bold text-gray-900">Period Calm Assistant</h2>
                <p className="text-sm text-gray-600">Let's chat about your experience!</p>
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
          <div className="px-4 py-2 bg-gray-50 border-b border-gray-200">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs text-gray-600">Progress</span>
              <span className="text-xs text-gray-600">{progressPercentage}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-1">
              <div
                className="bg-gradient-to-r from-rose-500 to-pink-500 h-1 rounded-full transition-all duration-500"
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
          </div>

          {/* Chat Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message, index) => (
              <div key={`message_${message.id}_${index}`}>
                {renderMessage(message)}
              </div>
            ))}
            {isTyping && renderTypingIndicator()}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="p-4 border-t border-gray-200 bg-gray-50">
            <div className="flex space-x-2">
              <button
                onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <Smile className="w-5 h-5" />
              </button>
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleInputSubmit()}
                placeholder="Type your message..."
                className="flex-1 px-4 py-2 border border-gray-300 rounded-full focus:ring-2 focus:ring-rose-500 focus:border-transparent bg-white"
                disabled={!messages[messages.length - 1]?.inputType || isProcessing}
              />
              <button
                onClick={() => setIsRecording(!isRecording)}
                className={`p-2 rounded-full transition-colors ${
                  isRecording 
                    ? 'bg-red-500 text-white' 
                    : 'text-gray-400 hover:text-gray-600'
                }`}
              >
                {isRecording ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
              </button>
              <Button
                onClick={handleInputSubmit}
                disabled={!inputValue.trim() || !messages[messages.length - 1]?.inputType || isProcessing}
                className="bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 rounded-full p-2 transition-all duration-200"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>

            {/* Emoji Picker */}
            {showEmojiPicker && (
              <div className="mt-2 p-2 bg-white rounded-lg border border-gray-200">
                <div className="grid grid-cols-8 gap-1">
                  {['😊', '😍', '💖', '✨', '🌟', '💕', '🎉', '🔥', '😌', '🕊️', '🧘‍♀️', '💪', '🌈', '🎯', '💎', '👑'].map((emoji) => (
                    <button
                      key={`emoji_${emoji}`}
                      onClick={() => {
                        setInputValue(prev => prev + emoji)
                        setShowEmojiPicker(false)
                      }}
                      className="p-1 hover:bg-gray-100 rounded text-lg transition-colors"
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Achievements */}
          {achievements.length > 0 && (
            <div className="p-4 border-t border-gray-200 bg-yellow-50">
              <div className="flex items-center space-x-2 mb-2">
                <Trophy className="w-4 h-4 text-yellow-500" />
                <span className="text-sm font-medium text-gray-700">Achievements:</span>
              </div>
              <div className="flex flex-wrap gap-1">
                {achievements.map((achievement, index) => (
                  <Badge key={`achievement_${index}`} className="bg-yellow-100 text-yellow-800 text-xs animate-pulse">
                    {achievement}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
} 