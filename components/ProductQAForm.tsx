"use client"

import { useState, useEffect, useRef, useCallback } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { X, Send, Heart, Star, Sparkles, MessageCircle, Bot, User, Loader2, ArrowLeft } from 'lucide-react'
import { PERIOD_CALM_KNOWLEDGE_BASE } from '@/lib/ai-knowledge-base'

interface ChatMessage {
  id: string
  type: 'ai' | 'user'
  content: string
  timestamp: Date
}

const QUICK_QUESTIONS = [
  "What is Period Calm?",
  "How does it work?",
  "What are the ingredients?",
  "How quickly does it work?",
  "Are there any side effects?",
  "How much does it cost?",
  "Where can I buy it?",
  "Is it safe to use?"
]

export default function ProductQAForm({ onCloseAction, onBackToFeedback }: { 
  onCloseAction: () => void
  onBackToFeedback: () => void 
}) {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [inputValue, setInputValue] = useState('')
  const [isTyping, setIsTyping] = useState(false)

  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [])

  useEffect(() => {
    scrollToBottom()
  }, [messages, scrollToBottom])

  // Initialize with welcome message
  useEffect(() => {
    if (messages.length === 0) {
      const welcomeMessage: ChatMessage = {
        id: 'welcome',
        type: 'ai',
        content: "Hey beautiful! 👋 I'm here to answer any questions about Period Calm! 💕\n\nWhat would you like to know about our natural relief powder?",
        timestamp: new Date()
      }
      setMessages([welcomeMessage])
    }
  }, [messages.length])

  const addMessage = useCallback((message: Omit<ChatMessage, 'id' | 'timestamp'>) => {
    const newMessage: ChatMessage = {
      ...message,
      id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date()
    }
    setMessages(prev => [...prev, newMessage])
  }, [])

  const getAIResponse = useCallback(async (userInput: string) => {
    const lowerInput = userInput.toLowerCase()
    
    // Simple keyword-based responses
    if (lowerInput.includes('what is') || lowerInput.includes('period calm')) {
      return "Period Calm is our amazing natural drink powder that helps with menstrual discomfort! 💕\n\nIt's made with scientifically formulated ingredients and works within 0-20 minutes to provide relief from cramps and discomfort.\n\nKey benefits:\n• Natural relief from cramps and discomfort\n• Fast-acting (0-20 minutes)\n• 500+ trial participants\n• 4.9/5 star rating\n\nWould you like to know more about our ingredients or how it works?"
    }
    
    if (lowerInput.includes('how does it work') || lowerInput.includes('work')) {
      return "Great question! 🌸 Period Calm works by combining natural ingredients that target the root causes of menstrual discomfort:\n\n• **Anti-inflammatory compounds** reduce swelling and pain\n• **Muscle relaxants** help ease cramps\n• **Hormone-balancing herbs** support your natural cycle\n• **Fast-absorbing formula** gets to work in 0-20 minutes\n\nOur unique blend is designed to work with your body, not against it! 💕"
    }
    
    if (lowerInput.includes('ingredient')) {
      return "Period Calm contains carefully selected natural ingredients! 🌿\n\n**Key Ingredients:**\n• Chamomile - Natural anti-inflammatory\n• Ginger - Pain relief and nausea support\n• Magnesium - Muscle relaxation\n• Vitamin B6 - Hormone balance\n• Turmeric - Anti-inflammatory properties\n• Peppermint - Digestive comfort\n\nAll ingredients are:\n✅ Natural and safe\n✅ Scientifically backed\n✅ Fast-acting\n✅ No artificial additives\n\nWould you like to know about any specific ingredient?"
    }
    
    if (lowerInput.includes('quick') || lowerInput.includes('fast') || lowerInput.includes('time')) {
      return "Period Calm is super fast-acting! ⚡\n\n**Timeline:**\n• **0-10 minutes**: Initial relief begins\n• **10-20 minutes**: Full effect kicks in\n• **Lasts 4-6 hours**: Sustained comfort\n\nMost customers feel relief within 10-15 minutes! That's why we're so proud of our formula. 💪\n\nNo waiting around - just quick, natural relief when you need it most! 💕"
    }
    
    if (lowerInput.includes('side effect') || lowerInput.includes('safe')) {
      return "Period Calm is very safe! 🌱\n\n**Safety Profile:**\n✅ Made with natural ingredients\n✅ No artificial additives\n✅ No known serious side effects\n✅ Suitable for most women\n\n**Rare mild effects** (if any):\n• Slight stomach upset (very rare)\n• Mild drowsiness (due to natural relaxation)\n\n**Always consult your doctor** if you have:\n• Allergies to any ingredients\n• Medical conditions\n• Taking other medications\n\nYour safety is our top priority! 💕"
    }
    
    if (lowerInput.includes('cost') || lowerInput.includes('price') || lowerInput.includes('money')) {
      return "Period Calm is priced for accessibility! 💰\n\n**Current Pricing:**\n• **Regular Price**: ₹1,599\n• **Special Offer**: ₹1,299 (Save ₹300!)\n• **Free Shipping** on orders above ₹999\n\n**Value Breakdown:**\n• 30 servings per pack\n• ₹43 per serving (with discount)\n• Less than a coffee! ☕\n\n**Special Offers:**\n• 10% off for first-time buyers\n• 15% off for subscribers\n• Free samples with orders\n\nWe believe natural relief should be accessible to everyone! 💕"
    }
    
    if (lowerInput.includes('buy') || lowerInput.includes('where') || lowerInput.includes('purchase')) {
      return "You can buy Period Calm in several ways! 🛒\n\n**Online (Recommended):**\n• Our official website\n• Free shipping on orders above ₹999\n• Secure payment options\n• 30-day money-back guarantee\n\n**Coming Soon:**\n• Amazon India\n• Flipkart\n• Local pharmacies\n\n**Benefits of buying direct:**\n✅ Best prices and offers\n✅ Authentic product guarantee\n✅ Direct customer support\n✅ Loyalty rewards\n\nWould you like me to help you place an order? 💕"
    }
    
    if (lowerInput.includes('thank')) {
      return "You're so welcome! 💕 I'm here anytime you need help or want to share your experience with Period Calm!\n\nRemember, your feedback helps us improve and helps other women too! 🌸"
    }
    
    if (lowerInput.includes('bye') || lowerInput.includes('goodbye')) {
      return "Take care beautiful! 💕 Thanks for chatting with me! Come back anytime you have questions about Period Calm!\n\nDon't forget to share your experience when you try it! 🌟"
    }
    
    // Default response
    return "That's a great question! 💕 While I'd love to give you a detailed answer, I'm designed to help with common questions about Period Calm.\n\nCould you try asking about:\n• What Period Calm is\n• How it works\n• Ingredients\n• Pricing\n• Where to buy\n• Safety and side effects\n\nOr if you'd like to share your experience with us, I can switch you to our feedback mode! 🌸"
  }, [])

  const handleSubmit = useCallback(async () => {
    if (!inputValue.trim() || isTyping) return

    const userInput = inputValue.trim()
    setInputValue('')
    
    // Add user message
    addMessage({
      type: 'user',
      content: userInput
    })

    setIsTyping(true)

    try {
      // Simulate typing delay
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Get AI response
      const aiResponse = await getAIResponse(userInput)
      
      setIsTyping(false)

      // Add AI response
      addMessage({
        type: 'ai',
        content: aiResponse
      })

    } catch (error) {
      setIsTyping(false)
      addMessage({
        type: 'ai',
        content: "I'm sorry, I'm having trouble right now. Please try again in a moment."
      })
    }
  }, [inputValue, isTyping, addMessage, getAIResponse])

  const handleQuickQuestion = (question: string) => {
    setInputValue(question)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit()
    }
  }

  const renderMessage = (message: ChatMessage) => {
    const isAI = message.type === 'ai'
    
    return (
      <div
        key={message.id}
        className={`flex ${isAI ? 'justify-start' : 'justify-end'} mb-4`}
      >
        <div className={`flex items-start space-x-3 max-w-[80%] ${isAI ? 'flex-row' : 'flex-row-reverse'}`}>
          {isAI && (
            <div className="w-8 h-8 bg-gradient-to-r from-rose-400 to-pink-400 rounded-full flex items-center justify-center flex-shrink-0">
              <Bot className="w-4 h-4 text-white" />
            </div>
          )}
          
          <div className={`px-4 py-3 rounded-2xl ${
            isAI 
              ? 'bg-gray-100 text-gray-900' 
              : 'bg-gradient-to-r from-rose-500 to-pink-500 text-white'
          }`}>
            <div className="whitespace-pre-wrap">{message.content}</div>
          </div>

          {!isAI && (
            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center flex-shrink-0">
              <User className="w-4 h-4 text-white" />
            </div>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <Card className="w-full max-w-2xl h-[90vh] bg-white shadow-2xl overflow-hidden">
        <CardContent className="p-0 h-full flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gradient-to-r from-rose-50 to-pink-50 flex-shrink-0">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-r from-rose-400 to-pink-400 rounded-full flex items-center justify-center text-white text-sm font-bold">
                PC
              </div>
              <div>
                <h2 className="text-lg font-bold text-gray-900">Ask Questions</h2>
                <p className="text-sm text-gray-600">Learn about Period Calm! 💕</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Button
                onClick={onBackToFeedback}
                variant="outline"
                size="sm"
                className="flex items-center"
              >
                <ArrowLeft className="w-4 h-4 mr-1" />
                Feedback
              </Button>
              <button
                onClick={onCloseAction}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Chat Messages */}
          <div className="flex-1 overflow-y-auto p-4 min-h-0">
            <div className="space-y-4">
              {messages.map(renderMessage)}
              
              {isTyping && (
                <div className="flex justify-start mb-4">
                  <div className="flex items-start space-x-3 max-w-[80%]">
                    <div className="w-8 h-8 bg-gradient-to-r from-rose-400 to-pink-400 rounded-full flex items-center justify-center flex-shrink-0">
                      <Bot className="w-4 h-4 text-white" />
                    </div>
                    <div className="px-4 py-3 rounded-2xl bg-gray-100">
                      <div className="flex items-center space-x-2">
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span className="text-gray-600">AI is typing...</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Questions */}
          {messages.length === 1 && (
            <div className="p-4 border-t border-gray-200 bg-gray-50">
              <p className="text-sm text-gray-600 mb-3">Quick questions:</p>
              <div className="grid grid-cols-2 gap-2">
                {QUICK_QUESTIONS.map((question) => (
                  <Button
                    key={question}
                    onClick={() => handleQuickQuestion(question)}
                    variant="outline"
                    size="sm"
                    className="text-xs h-auto py-2 px-3 text-left"
                  >
                    {question}
                  </Button>
                ))}
              </div>
            </div>
          )}

          {/* Input Area */}
          <div className="p-4 border-t border-gray-200 bg-gray-50 flex-shrink-0">
            <div className="flex space-x-2">
              <Input
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask about Period Calm..."
                className="flex-1"
                disabled={isTyping}
              />
              <Button
                onClick={handleSubmit}
                disabled={!inputValue.trim() || isTyping}
                className="bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 