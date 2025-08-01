import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { userInput, conversationHistory, systemPrompt } = await request.json()

    // Get the last AI message to understand context
    const lastAIMessage = conversationHistory
      .filter((msg: any) => msg.role === 'assistant')
      .pop()?.content || ''

    const lowerInput = userInput.toLowerCase()
    let aiResponse = "I'm here to help! 💕 Can you tell me more about what you'd like to know about Period Calm?"
    let feedbackUpdate = null

    // Handle feedback collection flow
    if (lastAIMessage.includes("What's your first name?") || lastAIMessage.includes("Let's start with your name")) {
      // User provided their first name
      aiResponse = `Thank you, ${userInput}! 💕 Now I need your full name (first and last). Can you tell me your complete name?`
      feedbackUpdate = { first_name: userInput }
    }
    else if (lastAIMessage.includes("your complete name") || lastAIMessage.includes("full name")) {
      // User provided their full name
      const nameParts = userInput.trim().split(' ')
      const firstName = nameParts[0] || ''
      const lastName = nameParts.slice(1).join(' ') || ''
      aiResponse = "Perfect! How old are you? (Just the number is fine!)"
      feedbackUpdate = { first_name: firstName, last_name: lastName }
    }
    else if (lastAIMessage.includes("How old are you")) {
      // User provided their age
      aiResponse = "Thanks! What's your phone number?"
      feedbackUpdate = { age: userInput }
    }
    else if (lastAIMessage.includes("phone number")) {
      // User provided their phone
      aiResponse = "Great! What's your email address?"
      feedbackUpdate = { phone: userInput }
    }
    else if (lastAIMessage.includes("email address")) {
      // User provided their email
      aiResponse = "Awesome! Which city and state do you live in?"
      feedbackUpdate = { email: userInput }
    }
    else if (lastAIMessage.includes("city and state")) {
      // User provided their location
      const locationParts = userInput.split(',').map((part: string) => part.trim())
      const city = locationParts[0] || ''
      const state = locationParts[1] || ''
      aiResponse = "When did you drink Period Calm? (e.g., last week, yesterday, etc.)"
      feedbackUpdate = { city, state }
    }
    else if (lastAIMessage.includes("When did you drink")) {
      // User provided when they drank it
      aiResponse = "How quickly did you feel the effect? (within 30 minutes?)"
      feedbackUpdate = { when_drank: userInput }
    }
    else if (lastAIMessage.includes("feel the effect")) {
      // User provided effect timing
      aiResponse = "How would you rate your experience? (1-5 stars)"
      feedbackUpdate = { effect_within_30min: userInput }
    }
    else if (lastAIMessage.includes("rate your experience")) {
      // User provided rating
      const rating = parseInt(userInput) || 0
      aiResponse = "Would you drink Period Calm again?"
      feedbackUpdate = { rating }
    }
    else if (lastAIMessage.includes("drink again")) {
      // User answered about drinking again
      aiResponse = "What benefits did you experience?"
      feedbackUpdate = { would_drink_again: userInput }
    }
    else if (lastAIMessage.includes("benefits did you experience")) {
      // User provided benefits
      aiResponse = "How are you feeling right now?"
      feedbackUpdate = { benefits: [userInput] }
    }
    else if (lastAIMessage.includes("feeling right now")) {
      // User provided current feeling
      aiResponse = "What are your self-care essentials?"
      feedbackUpdate = { current_feeling: userInput }
    }
    else if (lastAIMessage.includes("self-care essentials")) {
      // User provided self-care essentials
      aiResponse = "Would you recommend Period Calm to others?"
      feedbackUpdate = { self_care_essentials: [userInput] }
    }
    else if (lastAIMessage.includes("recommend")) {
      // User answered about recommendation
      aiResponse = "Have you heard about our Face & Soul campaign?"
      feedbackUpdate = { would_recommend: userInput }
    }
    else if (lastAIMessage.includes("Face & Soul campaign")) {
      // User answered about campaign
      aiResponse = "What do you think is a fair price point for Period Calm?"
      feedbackUpdate = { face_and_soul_campaign: userInput }
    }
    else if (lastAIMessage.includes("fair price point")) {
      // User provided price feedback
      aiResponse = "Any final thoughts or suggestions for us? 💕"
      feedbackUpdate = { fair_price: userInput }
    }
    else if (lastAIMessage.includes("final thoughts")) {
      // User provided final thoughts - end of feedback
      aiResponse = "Thank you so much for your feedback! 💕 Your responses have been saved. Is there anything else you'd like to know about Period Calm?"
      feedbackUpdate = { final_thoughts: userInput }
    }
    // Handle general questions
    else if (lowerInput.includes('what is period calm') || lowerInput.includes('period calm')) {
      aiResponse = "Hey beautiful! 👋 Period Calm is our amazing natural drink powder that helps with menstrual discomfort. It's made with scientifically formulated ingredients and works within 0-20 minutes! 💕\n\nKey benefits:\n• Natural relief from cramps and discomfort\n• Fast-acting (0-20 minutes)\n• 50,000+ happy customers\n• 4.9/5 star rating\n\nWould you like to know more about our ingredients or how it works?"
    }
    else if (lowerInput.includes('hello') || lowerInput.includes('hi')) {
      aiResponse = "Hey beautiful! 👋 Welcome to Period Calm! I'm here to help with anything about our products, answer questions, or collect your feedback. What would you like to do? 💕"
    }
    else if (lowerInput.includes('feedback')) {
      aiResponse = "Amazing! I'd love to collect your feedback! 💕 Let's start with your name. What's your first name?"
    }
    else if (lowerInput.includes('thank')) {
      aiResponse = "You're so welcome! 💕 I'm here anytime you need help or want to share your experience!"
    }
    else if (lowerInput.includes('bye') || lowerInput.includes('goodbye')) {
      aiResponse = "Take care beautiful! 💕 Thanks for chatting with me! Come back anytime!"
    }

    // Simulate typing delay
    await new Promise(resolve => setTimeout(resolve, 1000))

    return NextResponse.json({ 
      response: aiResponse,
      feedbackUpdate 
    })

  } catch (error) {
    console.error('AI chat error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 