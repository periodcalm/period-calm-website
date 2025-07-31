"use client"

import React, { useState, useRef, useCallback, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Star, X, ArrowLeft, ArrowRight, Trophy, Sparkles, Heart, MessageCircle, ChevronLeft, ChevronRight, CheckCircle, Loader2, Maximize2, Minimize2 } from 'lucide-react'

import ProductQAForm from './ProductQAForm'
import { useLiveStatsStore } from '@/lib/live-stats-store'
import { useRouter } from 'next/navigation'

interface FeedbackQuestion {
  id: number
  type: 'name' | 'age' | 'contact' | 'phone' | 'location' | 'experience' | 'rating' | 'benefits' | 'improvements' | 'recommendation' | 'price' | 'packaging' | 'final' | 'social' | 'cycle' | 'period' | 'regularity' | 'previous' | 'severity' | 'timing' | 'frequency' | 'preparation' | 'lifestyle' | 'selfcare' | 'feeling' | 'confidence' | 'campaign' | 'community' | 'volunteer' | 'testimonial' | 'convenience' | 'last_period' | 'storage' | 'dosage' | 'side_effects' | 'budget' | 'price_points' | 'purchase_intent'
  title: string
  description?: string
  required: boolean
  options?: string[]
  emojis?: string[]
  placeholder?: string
  validation?: (value: any) => boolean
}

interface FeedbackData {
  // Basic Information
  first_name: string
  last_name: string
  age: string
  email: string
  phone: string
  city: string
  state: string
  instagram: string
  
  // Period & Health Information
  cycle_length: string
  last_period_date: string
  period_regularity: string
  previous_pain_management: string
  pain_severity: string
  
  // Product Experience
  when_tried: string
  timing_of_use: string
  frequency_of_use: string
  preparation_method: string
  effect_speed: string
  overall_satisfaction: number
  would_drink_again: string
  benefits_experienced: string[]
  side_effects: string
  taste_rating: number
  value_rating: number
  packaging_rating: number
  convenience_rating: string
  storage_experience: string
  dosage_followed: string
  
  // Pricing Strategy
  budget_range: string
  price_points: string
  purchase_intent: string
  
  // Lifestyle & Emotional Impact
  lifestyle_impact: string[]
  self_care_essentials: string[]
  current_feeling: string
  confidence_boost: string
  
  // Community & Engagement
  face_and_soul_campaign: string
  community_interest: string
  volunteer_interest: string
  testimonial_permission: string
  
  // Feedback & Recommendations
  improvements: string
  would_recommend: string
  price_feedback: string
  final_thoughts: string
}

interface ProgressMilestone {
  percentage: number
  message: string
  emoji: string
}

// Game mechanics and achievements
interface GameAchievement {
  id: string
  title: string
  description: string
  icon: string
  unlocked: boolean
  progress: number
  maxProgress: number
}

interface GameStats {
  level: number
  experience: number
  achievements: GameAchievement[]
  streak: number
  totalPoints: number
}

// Hero's Journey interfaces
interface HeroJourneyPhase {
  id: string
  title: string
  description: string
  color: string
  gradient: string
  icon: string
  emoji: string
  progress: number
}

interface AIAssistant {
  name: string
  avatar: string
  personality: string
  currentMood: string
  messages: string[]
}

interface HeroStats {
  level: number
  experience: number
  power: number
  wisdom: number
  courage: number
  compassion: number
  achievements: string[]
  title: string
}

const GAME_ACHIEVEMENTS: Omit<GameAchievement, 'unlocked' | 'progress'>[] = [
  {
    id: 'first_step',
    title: 'First Steps',
    description: 'Started your Period Calm journey',
    icon: '👣',
    maxProgress: 1
  },
  {
    id: 'period_expert',
    title: 'Period Expert',
    description: 'Shared your cycle knowledge',
    icon: '🌙',
    maxProgress: 1
  },
  {
    id: 'magic_finder',
    title: 'Magic Finder',
    description: 'Experienced the Period Calm magic',
    icon: '✨',
    maxProgress: 1
  },
  {
    id: 'taste_critic',
    title: 'Taste Critic',
    description: 'Rated the delicious taste',
    icon: '🍯',
    maxProgress: 1
  },
  {
    id: 'price_guru',
    title: 'Price Guru',
    description: 'Helped set the perfect price',
    icon: '💰',
    maxProgress: 1
  },
  {
    id: 'community_builder',
    title: 'Community Builder',
    description: 'Joined our empowered community',
    icon: '🌸',
    maxProgress: 1
  },
  {
    id: 'volunteer_hero',
    title: 'Volunteer Hero',
    description: 'Willing to help spread awareness',
    icon: '🤝',
    maxProgress: 1
  },
  {
    id: 'story_sharer',
    title: 'Story Sharer',
    description: 'Willing to inspire other women',
    icon: '💝',
    maxProgress: 1
  },
  {
    id: 'feedback_champion',
    title: 'Feedback Champion',
    description: 'Completed the full journey',
    icon: '🏆',
    maxProgress: 1
  },
  {
    id: 'brand_advocate',
    title: 'Brand Advocate',
    description: 'Would recommend to others',
    icon: '⭐',
    maxProgress: 1
  }
]

const GAME_MESSAGES = {
  welcome: [
    "Welcome to the Period Calm Adventure! 🌟",
    "Ready to help thousands of women? Let's go! 💪",
    "Your journey to empowerment starts now! ✨",
    "You're about to make a difference! 🚀"
  ],
  progress: [
    "Amazing progress! You're a natural! 🌟",
    "Look at you go! You're helping so many women! 💕",
    "Incredible! Your feedback is pure gold! ✨",
    "You're on fire! Keep going, superstar! 🔥",
    "Unstoppable! You're making a difference! 💪",
    "Fantastic! You're building something amazing! 🏆",
    "Brilliant! Your insights are invaluable! 💎",
    "Outstanding! You're a Period Calm hero! 👑"
  ],
  achievements: [
    "🎉 Achievement Unlocked! You're amazing!",
    "🏆 New Badge! You're a Period Calm hero!",
    "⭐ Achievement earned! You're helping women everywhere!",
    "🌟 New level unlocked! You're unstoppable!",
    "💫 Achievement unlocked! You're making history!",
    "🎊 New badge earned! You're incredible!",
    "🏅 Achievement unlocked! You're a legend!",
    "👑 New level reached! You're extraordinary!"
  ],
  milestones: [
    "Adventure Begins! You're doing incredible! 🌟",
    "Understanding Your Journey! You're a superstar! 💫",
    "Experiencing the Magic! You're helping thousands! ✨",
    "Quality & Experience! You're building something amazing! 💎",
    "Pricing Strategy! You're shaping the future! 💰",
    "Lifestyle Impact! You're transforming lives! 💕",
    "Community Building! You're creating change! 🤝",
    "Almost There! You're about to become a legend! ⭐",
    "Final Stretch! You're making history! 🎯",
    "Champion! You're extraordinary! 🎉"
  ]
}

// Hero's Journey phases with enhanced theming
const HERO_JOURNEY_PHASES: HeroJourneyPhase[] = [
  {
    id: 'call-to-adventure',
    title: "The Call to Adventure",
    description: "Begin your epic journey to help thousands of women",
    color: "from-purple-500 to-pink-500",
    gradient: "bg-gradient-to-r from-purple-500 to-pink-500",
    icon: "🌟",
    emoji: "✨",
    progress: 0
  },
  {
    id: 'crossing-threshold',
    title: "Crossing the Threshold",
    description: "Share your story and connect with our community",
    color: "from-blue-500 to-cyan-500",
    gradient: "bg-gradient-to-r from-blue-500 to-cyan-500",
    icon: "🌊",
    emoji: "🚀",
    progress: 12.5
  },
  {
    id: 'tests-allies',
    title: "Tests, Allies & Enemies",
    description: "Experience the magic and share your wisdom",
    color: "from-green-500 to-emerald-500",
    gradient: "bg-gradient-to-r from-green-500 to-emerald-500",
    icon: "⚔️",
    emoji: "💎",
    progress: 25
  },
  {
    id: 'approach-cave',
    title: "Approach to the Cave",
    description: "Evaluate quality and share your insights",
    color: "from-orange-500 to-red-500",
    gradient: "bg-gradient-to-r from-orange-500 to-red-500",
    icon: "🔥",
    emoji: "🏆",
    progress: 37.5
  },
  {
    id: 'ordeal',
    title: "The Ordeal",
    description: "Face the pricing challenge and set the future",
    color: "from-indigo-500 to-purple-500",
    gradient: "bg-gradient-to-r from-indigo-500 to-purple-500",
    icon: "⚡",
    emoji: "💫",
    progress: 50
  },
  {
    id: 'reward',
    title: "The Reward",
    description: "Discover your impact and transformation",
    color: "from-yellow-500 to-orange-500",
    gradient: "bg-gradient-to-r from-yellow-500 to-orange-500",
    icon: "🎁",
    emoji: "🌟",
    progress: 62.5
  },
  {
    id: 'road-back',
    title: "The Road Back",
    description: "Join the community and become a leader",
    color: "from-teal-500 to-green-500",
    gradient: "bg-gradient-to-r from-teal-500 to-green-500",
    icon: "🛤️",
    emoji: "🤝",
    progress: 75
  },
  {
    id: 'resurrection',
    title: "Resurrection",
    description: "Share your story and inspire others",
    color: "from-rose-500 to-pink-500",
    gradient: "bg-gradient-to-r from-rose-500 to-pink-500",
    icon: "🦋",
    emoji: "💝",
    progress: 87.5
  },
  {
    id: 'return-elixir',
    title: "Return with the Elixir",
    description: "Complete your journey and claim your rewards",
    color: "from-violet-500 to-purple-500",
    gradient: "bg-gradient-to-r from-violet-500 to-purple-500",
    icon: "🏆",
    emoji: "👑",
    progress: 100
  }
]

// AI Assistant with personality
const AI_ASSISTANT: AIAssistant = {
  name: "Luna",
  avatar: "🌙",
  personality: "Warm, encouraging, and genuinely interested",
  currentMood: "excited",
  messages: [
    "Thank you for sharing your experience! Every detail helps us improve! ✨",
    "You're doing amazing! Your feedback is so valuable to us! 🌟",
    "Incredible insights! You're helping us make Period Calm even better! 💪",
    "Look at you go! Your thoughts will help so many women! 🚀",
    "You're incredible! Your experience matters so much! 👑",
    "Almost there! Your feedback is making a real difference! 🏆"
  ]
}

// Hero titles based on progress
const HERO_TITLES = [
  "Feedback Friend",
  "Experience Sharer", 
  "Insight Provider",
  "Thoughtful Tester",
  "Valuable Voice",
  "Feedback Champion",
  "Period Calm Expert",
  "Community Helper",
  "Inspiration Source",
  "Feedback Legend"
]

// Enhanced game messages with feedback focus
const HERO_MESSAGES = {
  welcome: [
    "🌟 Welcome to share your Period Calm story!",
    "🚀 Ready to help us improve? Let's hear your thoughts!",
    "✨ Your feedback journey starts now!",
    "💫 We can't wait to hear your experience!",
    "👑 Your voice matters so much to us!"
  ],
  progress: [
    "⚡ Amazing progress! Your feedback is gold!",
    "🌟 Look at you go! You're helping us improve!",
    "💎 Brilliant insights! You're making a difference!",
    "🔥 You're on fire! Your thoughts are invaluable!",
    "🚀 Unstoppable! You're helping other women!",
    "💪 Fantastic! Your feedback will shape the future!",
    "🏆 Outstanding! You're a feedback superstar!",
    "👑 Magnificent! Your experience is priceless!"
  ],
  achievements: [
    "🎉 Achievement Unlocked! You're helping us improve!",
    "🏆 New Insight Gained! You're making a difference!",
    "⭐ Valuable Feedback! You're helping women everywhere!",
    "🌟 New Level Reached! Your voice matters!",
    "💫 Epic Contribution! You're shaping the future!",
    "🎊 Amazing Feedback! You're incredible!",
    "🏅 Thoughtful Tester! You're a legend!",
    "👑 Ultimate Helper! You're extraordinary!"
  ],
  milestones: [
    "Getting Started! Your journey begins! 🌟",
    "Sharing Your Story! You're helping us improve! 🚀",
    "Providing Insights! You're making a difference! 💎",
    "Giving Feedback! You're shaping the future! 🔥",
    "Sharing Thoughts! You're helping other women! ⚡",
    "Contributing Ideas! You're making an impact! 🎁",
    "Building Community! You're leading the way! 🛤️",
    "Inspiring Others! You're creating change! 🦋",
    "Almost There! You're about to complete your feedback! 👑",
    "Feedback Complete! You're a true champion! 🏆"
  ]
}

const FEEDBACK_QUESTIONS: FeedbackQuestion[] = [
  // Phase 1: The Adventure Begins (5 questions)
  {
    id: 1,
    type: 'name',
    title: "🌟 Welcome, Beautiful! What's your full name?",
    description: "Please enter your first and last name. Let's start this amazing journey together! Your feedback will help thousands of women find relief.",
    required: true,
    placeholder: "Enter your first and last name..."
  },
  {
    id: 2,
    type: 'age',
    title: "✨ How young and fabulous are you?",
    description: "Age is just a number, but it helps us understand our amazing community!",
    required: true,
    placeholder: "Your age in years"
  },
  {
    id: 3,
    type: 'contact',
    title: "📧 How can we stay connected?",
    description: "We'll send you exclusive offers, early access, and updates about your impact!",
    required: true,
    placeholder: "Your email address"
  },
  {
    id: 4,
    type: 'phone',
    title: "📞 Can we call you for special surprises?",
    description: "We love surprising our amazing testers with exclusive offers and early access!",
    required: true,
    placeholder: "Your phone number"
  },
  {
    id: 5,
    type: 'location',
    title: "🌍 Where are you located?",
    description: "Help us understand our global community of empowered women!",
    required: true,
    placeholder: "Your city and state"
  },

  // Phase 2: Understanding Your Journey (5 questions)
  {
    id: 6,
    type: 'cycle',
    title: "🌙 Tell us about your cycle rhythm",
    description: "Every woman's cycle is unique! Understanding yours helps us serve you better.",
    required: true,
    options: ["21-25 days (Short & Sweet)", "26-30 days (Perfect Balance)", "31-35 days (Extended Flow)", "36+ days (Long & Strong)", "Irregular (Mystery Cycle)"]
  },
  {
    id: 7,
    type: 'last_period',
    title: "📅 When was your last period?",
    description: "This helps us track the magic timeline and effectiveness!",
    required: true,
    options: ["Currently on period (Right now!)", "Last week (Recent)", "2-3 weeks ago (Not long ago)", "1-2 months ago (A while back)", "More than 2 months ago (Long time)"]
  },
  {
    id: 8,
    type: 'regularity',
    title: "🔄 How regular are your periods?",
    description: "Understanding your regularity helps us personalize your experience!",
    required: true,
    options: ["Very regular (Like clockwork)", "Mostly regular (Usually on time)", "Sometimes irregular (Unpredictable)", "Very irregular (Complete mystery)", "Not sure (Still learning)"]
  },
  {
    id: 9,
    type: 'severity',
    title: "😰 How intense are your period pains?",
    description: "We want to understand your pain levels to help others like you!",
    required: true,
    options: ["Mild (Annoying but manageable)", "Moderate (Need some help)", "Severe (Really tough days)", "Very severe (Bed-bound sometimes)", "Varies each month (Unpredictable)"]
  },
  {
    id: 10,
    type: 'previous',
    title: "💊 What did you use before Period Calm?",
    description: "This helps us understand your journey to natural relief!",
    required: false,
    options: ["Painkillers (Paracetamol/Ibuprofen)", "Heating pad (Warm comfort)", "Exercise (Movement therapy)", "Nothing (Just suffered through)", "Other natural remedies", "Multiple methods (Whatever worked)"]
  },

  // Phase 3: The Magic Experience (8 questions)
  {
    id: 11,
    type: 'experience',
    title: "🗓️ When did you try Period Calm?",
    description: "We're tracking the magic timeline! When did your transformation begin?",
    required: true,
    options: ["Last week (Fresh experience)", "Last month (Recent magic)", "2-3 months ago (Seasoned user)", "More than 3 months ago (Veteran)"]
  },
  {
    id: 12,
    type: 'timing',
    title: "⏰ When did you drink it during the day?",
    description: "Timing is everything! When did you feel the magic?",
    required: true,
    options: ["Morning (Start with intention)", "Afternoon (Midday reset)", "Evening (Wind-down time)", "Before bed (Peaceful transition)", "Multiple times (All-day comfort)", "Only when needed (Emergency relief)"]
  },
  {
    id: 13,
    type: 'frequency',
    title: "🔄 How often did you use it?",
    description: "Understanding your usage patterns helps us optimize the experience!",
    required: true,
    options: ["Daily during period (Every day)", "Every other day (Alternating)", "Only on heavy days (When needed)", "Once per period (Single use)", "Multiple times per day (Frequent relief)"]
  },
  {
    id: 14,
    type: 'preparation',
    title: "☕ How did you prepare it?",
    description: "We want to make preparation as easy and enjoyable as possible!",
    required: true,
    options: ["Hot water (Warm comfort)", "Cold water (Quick and easy)", "With honey (Sweet touch)", "With milk (Creamy delight)", "With tea (Herbal blend)", "Other way (Creative preparation)"]
  },
  {
    id: 15,
    type: 'rating',
    title: "⚡ How quickly did you feel the magic?",
    description: "We're so proud of our fast-acting formula! How fast was your relief?",
    required: true,
    options: ["0-10 minutes (Lightning fast!)", "10-20 minutes (Quick relief)", "20-30 minutes (Steady comfort)", "30+ minutes (Gradual magic)"],
    emojis: ["⚡", "🚀", "⏰", "🐌"]
  },
  {
    id: 16,
    type: 'rating',
    title: "🌟 Overall, how satisfied are you?",
    description: "Your honest feedback helps thousands of women! Rate your experience.",
    required: true,
    options: ["1", "2", "3", "4", "5"],
    emojis: ["😞", "😕", "😐", "😊", "😍"]
  },
  {
    id: 17,
    type: 'recommendation',
    title: "💕 Would you drink Period Calm again?",
    description: "We hope to see you again! Your loyalty means everything to us.",
    required: true,
    options: ["Definitely! (100% yes!)", "Probably (Most likely)", "Maybe (Need to think)", "Probably not (Unlikely)", "Definitely not (Not for me)"]
  },
  {
    id: 18,
    type: 'benefits',
    title: "✨ What magic did you experience?",
    description: "Select all the amazing benefits you felt! Your experience inspires others.",
    required: false,
    options: ["Cramp relief (Pain gone!)", "Mood improvement (Happy vibes)", "Energy boost (Power mode)", "Better sleep (Dreamy nights)", "Reduced bloating (Comfort zone)", "Less fatigue (Stay active)", "Better focus (Clear mind)", "Reduced anxiety (Peaceful)", "No benefits (Still testing)"]
  },

  // Phase 4: Quality & Experience (6 questions)
  {
    id: 19,
    type: 'rating',
    title: "🍯 How delicious was the taste?",
    description: "We're always working on making it tastier! Rate the flavor experience.",
    required: true,
    options: ["1", "2", "3", "4", "5"],
    emojis: ["🤢", "😕", "😐", "😋", "😍"]
  },
  {
    id: 20,
    type: 'rating',
    title: "✨ How convenient was it to prepare?",
    description: "We want to make it as easy as possible! How simple was preparation?",
    required: true,
    options: ["Very easy (Effortless)", "Easy (Simple)", "Okay (Manageable)", "Difficult (Challenging)", "Very difficult (Too much work)"]
  },
  {
    id: 21,
    type: 'storage',
    title: "📦 How easy was it to store?",
    description: "Storage convenience matters! How was your storage experience?",
    required: true,
    options: ["Very easy (No issues)", "Easy (Simple storage)", "Okay (Manageable)", "Difficult (Tricky)", "Very difficult (Problematic)"]
  },
  {
    id: 22,
    type: 'dosage',
    title: "💊 Did you follow the recommended dosage?",
    description: "Understanding usage patterns helps us provide better guidance!",
    required: true,
    options: ["Yes, exactly (Followed perfectly)", "Mostly (Almost perfect)", "Sometimes (Mixed usage)", "Rarely (Seldom followed)", "No (Used differently)"]
  },
  {
    id: 23,
    type: 'side_effects',
    title: "⚠️ Did you experience any side effects?",
    description: "Your safety is our priority! We want to ensure Period Calm is safe for everyone.",
    required: false,
    options: ["None (Perfect experience)", "Mild nausea (Slight discomfort)", "Headache (Minor issue)", "Dizziness (Brief feeling)", "Stomach upset (Minor)", "Other (Please specify)"]
  },
  {
    id: 24,
    type: 'rating',
    title: "🎁 How would you rate our packaging?",
    description: "We care about sustainability and beauty! Rate the packaging experience.",
    required: true,
    options: ["1", "2", "3", "4", "5"],
    emojis: ["📦", "😕", "😐", "😊", "🎁"]
  },

  // Phase 5: Pricing Strategy (4 questions)
  {
    id: 25,
    type: 'budget',
    title: "💰 What's your budget for period relief?",
    description: "Help us set the perfect price that works for everyone!",
    required: true,
    options: ["₹50-100 (Budget-friendly)", "₹100-150 (Mid-range)", "₹150-200 (Premium)", "₹200+ (Luxury)", "No budget limit (Whatever works)"]
  },
  {
    id: 26,
    type: 'rating',
    title: "💎 How would you rate the value?",
    description: "We want to ensure fair pricing for everyone! Rate the value you received.",
    required: true,
    options: ["1", "2", "3", "4", "5"],
    emojis: ["💸", "😕", "😐", "😊", "💎"]
  },
  {
    id: 27,
    type: 'price_points',
    title: "🏷️ What price feels fair to you?",
    description: "Help us set the perfect price point! Which feels most reasonable?",
    required: true,
    options: ["₹55 (Super affordable)", "₹70 (Good value)", "₹90 (Fair price)", "₹120 (Premium quality)", "₹150+ (Luxury segment)"]
  },
  {
    id: 28,
    type: 'purchase_intent',
    title: "🛒 Would you buy at this price?",
    description: "Your purchase intent helps us understand the perfect pricing strategy!",
    required: true,
    options: ["Yes, definitely! (100% yes)", "Yes, probably (Most likely)", "Maybe (Need to think)", "Probably not (Too expensive)", "No (Not interested)"]
  },

  // Phase 6: Lifestyle Impact (4 questions)
  {
    id: 29,
    type: 'lifestyle',
    title: "🌟 How did Period Calm change your day?",
    description: "We want to understand your lifestyle transformation! Select all that apply.",
    required: false,
    options: ["Could work normally (Productive days)", "Could exercise (Active lifestyle)", "Could socialize (Social butterfly)", "Better sleep (Restful nights)", "More energy (Power through)", "No change (Still exploring)", "Other (Tell us more)"]
  },
  {
    id: 30,
    type: 'selfcare',
    title: "💕 What are your self-care essentials?",
    description: "We love learning about your wellness routine! Select all that apply.",
    required: false,
    options: ["Hot baths (Warm comfort)", "Meditation (Mind peace)", "Gentle yoga (Body harmony)", "Journaling (Soul expression)", "Comfort food (Nourishment)", "Rest & sleep (Recovery)", "Exercise (Movement)", "Reading (Mind escape)", "Music (Soul therapy)", "Other (Unique practices)"]
  },
  {
    id: 31,
    type: 'confidence',
    title: "💪 Did it boost your period confidence?",
    description: "We believe every woman should feel confident during her period!",
    required: false,
    options: ["Yes, significantly (Super confident!)", "Yes, somewhat (More confident)", "A little (Slight boost)", "Not really (Same as before)", "Not applicable (Different experience)"]
  },
  {
    id: 32,
    type: 'feeling',
    title: "💭 How are you feeling right now?",
    description: "We care about your current state of mind! Share your feelings.",
    required: false,
    placeholder: "Tell us how you're feeling today..."
  },

  // Phase 7: Community & Marketing (7 questions)
  {
    id: 33,
    type: 'social',
    title: "📱 Do you have Instagram?",
    description: "Join our community of empowered women! Connect with thousands of amazing women.",
    required: false,
    placeholder: "Your Instagram handle (optional)"
  },
  {
    id: 34,
    type: 'community',
    title: "🌸 Would you join our Period Calm community?",
    description: "Connect with thousands of empowered women! Be part of something amazing.",
    required: false,
    options: ["Yes, definitely! (Count me in)", "Yes, sounds interesting (Curious)", "Maybe later (Busy now)", "Not interested (Happy solo)"]
  },
  {
    id: 35,
    type: 'volunteer',
    title: "🤝 Would you be interested in volunteering?",
    description: "Help us spread awareness about natural period care! Be a voice for change.",
    required: false,
    options: ["Yes, I'd love to help! (Count me in)", "Maybe, what's involved? (Interested)", "Not right now (Busy)", "Tell me more (Need details)"]
  },
  {
    id: 36,
    type: 'campaign',
    title: "✨ Would you share your story?",
    description: "Your story could inspire thousands of women! Help us build a movement.",
    required: false,
    options: ["Yes, I'd love to! (Share my journey)", "Maybe, tell me more (Interested)", "Not right now (Private person)", "What is it? (Need details)"]
  },
  {
    id: 37,
    type: 'testimonial',
    title: "💝 Can we use your feedback?",
    description: "Your words can inspire other women! Help us spread the magic.",
    required: false,
    options: ["Yes, with my name (Proud to share)", "Yes, anonymously (Private but helpful)", "No, keep it private (Personal)", "Maybe, ask me later (Need time)"]
  },
  {
    id: 38,
    type: 'recommendation',
    title: "💝 Would you recommend Period Calm?",
    description: "Word of mouth is everything to us! Your recommendation helps others.",
    required: true,
    options: ["Yes, definitely! (100% recommend)", "Yes, with conditions (Mostly recommend)", "Maybe (Unsure)", "Probably not (Unlikely)", "No (Wouldn't recommend)"]
  },
  {
    id: 39,
    type: 'final',
    title: "💕 Any final thoughts or messages?",
    description: "We'd love to hear anything else you have to say! Share your thoughts.",
    required: false,
    placeholder: "Share your thoughts, suggestions, or just say hello..."
  }
]

const PROGRESS_MILESTONES: ProgressMilestone[] = [
  { percentage: 10, message: "Adventure Begins! 🌟", emoji: "👣" },
  { percentage: 20, message: "Understanding Your Journey! 🌙", emoji: "📚" },
  { percentage: 30, message: "Experiencing the Magic! ✨", emoji: "🌟" },
  { percentage: 40, message: "Quality & Experience! 🍯", emoji: "💎" },
  { percentage: 50, message: "Pricing Strategy! 💰", emoji: "🏷️" },
  { percentage: 60, message: "Lifestyle Impact! 🌟", emoji: "💕" },
  { percentage: 70, message: "Community Building! 🌸", emoji: "🤝" },
  { percentage: 80, message: "Almost There! 🚀", emoji: "⭐" },
  { percentage: 90, message: "Final Stretch! 🏆", emoji: "🎯" },
  { percentage: 100, message: "Champion! 🎉", emoji: "👑" }
]

const ENCOURAGEMENT_MESSAGES = [
  "You're doing amazing! 🌟",
  "Your feedback is helping thousands of women! 💕",
  "You're a Period Calm hero! ✨",
  "Keep going, superstar! 🔥",
  "You're making a real difference! 💪",
  "Incredible progress! You're unstoppable! 🚀",
  "Your journey inspires others! 🌸",
  "You're building something amazing! 🏆",
  "Almost there! You're a legend! 👑",
  "You've got this! You're incredible! 💎",
  "Fantastic work! You're extraordinary! ⭐",
  "Brilliant progress! You're making history! 🎊",
  "Outstanding! You're a true champion! 🏅",
  "Amazing! You're helping women everywhere! 💫"
]

export default function AIChatFeedbackForm({ onCloseAction }: { onCloseAction: () => void }) {
  const [currentStep, setCurrentStep] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('feedback-progress')
      return saved ? parseInt(saved) : 0
    }
    return 0
  })
  const [feedbackData, setFeedbackData] = useState<FeedbackData>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('feedback-data')
      return saved ? JSON.parse(saved) : {
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
        period_regularity: '',
        previous_pain_management: '',
        pain_severity: '',
        when_tried: '',
        timing_of_use: '',
        frequency_of_use: '',
        preparation_method: '',
        effect_speed: '',
        overall_satisfaction: 0,
        would_drink_again: '',
        benefits_experienced: [],
        side_effects: '',
        taste_rating: 0,
        value_rating: 0,
        packaging_rating: 0,
        convenience_rating: '',
        storage_experience: '',
        dosage_followed: '',
        budget_range: '',
        price_points: '',
        purchase_intent: '',
        lifestyle_impact: [],
        self_care_essentials: [],
        current_feeling: '',
        confidence_boost: '',
        face_and_soul_campaign: '',
        community_interest: '',
        volunteer_interest: '',
        testimonial_permission: '',
        improvements: '',
        would_recommend: '',
        price_feedback: '',
        final_thoughts: ''
      }
    }
    return {
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
      period_regularity: '',
      previous_pain_management: '',
      pain_severity: '',
      when_tried: '',
      timing_of_use: '',
      frequency_of_use: '',
      preparation_method: '',
      effect_speed: '',
      overall_satisfaction: 0,
      would_drink_again: '',
      benefits_experienced: [],
      side_effects: '',
      taste_rating: 0,
      value_rating: 0,
      packaging_rating: 0,
      convenience_rating: '',
      storage_experience: '',
      dosage_followed: '',
      budget_range: '',
      price_points: '',
      purchase_intent: '',
      lifestyle_impact: [],
      self_care_essentials: [],
      current_feeling: '',
      confidence_boost: '',
      face_and_soul_campaign: '',
      community_interest: '',
      volunteer_interest: '',
      testimonial_permission: '',
      improvements: '',
      would_recommend: '',
      price_feedback: '',
      final_thoughts: ''
    }
  })
  
  // Game state
  const [gameStats, setGameStats] = useState<GameStats>({
    level: 1,
    experience: 0,
    achievements: GAME_ACHIEVEMENTS.map(achievement => ({
      ...achievement,
      unlocked: false,
      progress: 0
    })),
    streak: 0,
    totalPoints: 0
  })
  
  const [showAchievement, setShowAchievement] = useState<string | null>(null)
  const [showCelebration, setShowCelebration] = useState(false)
  const [currentMessage, setCurrentMessage] = useState('')
  const [showWelcome, setShowWelcome] = useState(true)
  const [showQA, setShowQA] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [currentAnswer, setCurrentAnswer] = useState('')
  const [selectedOptions, setSelectedOptions] = useState<string[]>([])
  const [isExpanded, setIsExpanded] = useState(true) // Always start expanded (full screen)
  const [isMaximized, setIsMaximized] = useState(true) // New state for maximize/minimize
  const { incrementCustomer, addReview, updateStats, syncWithFeedbackData } = useLiveStatsStore()
  const router = useRouter()



  // Save form progress to localStorage
  const saveFormProgress = useCallback(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('feedback-progress', currentStep.toString())
      localStorage.setItem('feedback-data', JSON.stringify(feedbackData))
    }
  }, [currentStep, feedbackData])

  // Clear form progress from localStorage
  const clearFormProgress = useCallback(() => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('feedback-progress')
      localStorage.removeItem('feedback-data')
    }
  }, [])

  // Save progress whenever step or data changes
  useEffect(() => {
    saveFormProgress()
  }, [currentStep, feedbackData, saveFormProgress])

  const currentQuestion = FEEDBACK_QUESTIONS[currentStep]
  const progress = ((currentStep + 1) / FEEDBACK_QUESTIONS.length) * 100
  const currentMilestone = PROGRESS_MILESTONES.find(m => progress >= m.percentage)


  // Game mechanics functions
  const unlockAchievement = (achievementId: string) => {
    setGameStats(prev => ({
      ...prev,
      achievements: prev.achievements.map(achievement => 
        achievement.id === achievementId 
          ? { ...achievement, unlocked: true, progress: achievement.maxProgress }
          : achievement
      ),
      totalPoints: prev.totalPoints + 100
    }))
    setShowAchievement(achievementId)
    setTimeout(() => setShowAchievement(null), 3000)
  }

  const addExperience = (points: number) => {
    setGameStats(prev => {
      const newExperience = prev.experience + points
      const newLevel = Math.floor(newExperience / 100) + 1
      return {
        ...prev,
        experience: newExperience,
        level: newLevel,
        totalPoints: prev.totalPoints + points
      }
    })
  }

  const getRandomMessage = (category: keyof typeof GAME_MESSAGES) => {
    const messages = GAME_MESSAGES[category]
    return messages[Math.floor(Math.random() * messages.length)]
  }

  const checkAchievements = (step: number) => {
    // First Steps achievement
    if (step === 0) {
      unlockAchievement('first_step')
    }
    
    // Period Expert achievement
    if (step === 9) {
      unlockAchievement('period_expert')
    }
    
    // Magic Finder achievement
    if (step === 17) {
      unlockAchievement('magic_finder')
    }
    
    // Taste Critic achievement
    if (step === 18) {
      unlockAchievement('taste_critic')
    }
    
    // Price Guru achievement
    if (step === 27) {
      unlockAchievement('price_guru')
    }
    
    // Community Builder achievement
    if (step === 33) {
      unlockAchievement('community_builder')
    }
    
    // Volunteer Hero achievement
    if (step === 34) {
      unlockAchievement('volunteer_hero')
    }
    
    // Story Sharer achievement
    if (step === 35) {
      unlockAchievement('story_sharer')
    }
    
    // Brand Advocate achievement
    if (step === 37) {
      unlockAchievement('brand_advocate')
    }
    
    // Feedback Champion achievement
    if (step === FEEDBACK_QUESTIONS.length - 1) {
      unlockAchievement('feedback_champion')
    }
  }

  const validateEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
  }

  const validateAge = (age: string) => {
    const ageNum = parseInt(age)
    return ageNum >= 13 && ageNum <= 100
  }

  const validatePhone = (phone: string) => {
    // Basic phone validation - at least 10 digits
    const phoneDigits = phone.replace(/\D/g, '')
    return phoneDigits.length >= 10
  }

  const canProceedToNext = () => {
    if (!currentQuestion.required) return true
    
    if (currentQuestion.type === 'rating' || currentQuestion.type === 'recommendation' || currentQuestion.type === 'benefits' || currentQuestion.type === 'lifestyle' || currentQuestion.type === 'selfcare') {
      return selectedOptions.length > 0
    }
    
    if (currentQuestion.type === 'name') {
      const nameParts = currentAnswer.trim().split(' ').filter(part => part.length > 0)
      return nameParts.length >= 2 && nameParts[0].length >= 2 && nameParts[1].length >= 2
    }
    
    if (currentQuestion.type === 'contact') {
      return currentAnswer.trim() !== '' && validateEmail(currentAnswer)
    }
    
    if (currentQuestion.type === 'phone') {
      return currentAnswer.trim() !== '' && validatePhone(currentAnswer)
    }
    
    if (currentQuestion.type === 'age') {
      return currentAnswer.trim() !== '' && validateAge(currentAnswer)
    }
    
    if (currentQuestion.type === 'final') {
      // Final thoughts are optional, so always allow proceeding
      return true
    }
    
    return currentAnswer.trim() !== ''
  }

  const handleOptionSelect = (option: string) => {
    console.log('Option selected:', option, 'Question type:', currentQuestion.type, 'Question title:', currentQuestion.title)
    
    if (currentQuestion.type === 'benefits' || currentQuestion.type === 'lifestyle' || currentQuestion.type === 'selfcare') {
      setSelectedOptions(prev => 
        prev.includes(option) 
          ? prev.filter(o => o !== option)
          : [...prev, option]
      )
    } else {
      setSelectedOptions([option])
      setCurrentAnswer(option)
      console.log('Current answer set to:', option)
    }
  }

  const handleNext = () => {
    if (!canProceedToNext()) return

    // Add experience points
    addExperience(10)
    
    // Check for achievements
    checkAchievements(currentStep)
    
    // Show celebration at milestones
    const progress = ((currentStep + 1) / FEEDBACK_QUESTIONS.length) * 100
    const milestone = PROGRESS_MILESTONES.find(m => progress >= m.percentage)
    if (milestone && progress % 10 === 0) {
      setShowCelebration(true)
      setCurrentMessage(milestone.message)
      setTimeout(() => setShowCelebration(false), 2000)
    }

    // Update feedback data
    const updatedData = { ...feedbackData }
    
    switch (currentQuestion.type) {
      case 'name':
        // Split the name into first and last name
        const nameParts = currentAnswer.trim().split(' ')
        updatedData.first_name = nameParts[0] || ''
        updatedData.last_name = nameParts.slice(1).join(' ') || ''
        break
      case 'age':
        updatedData.age = currentAnswer
        break
      case 'contact':
        updatedData.email = currentAnswer
        break
      case 'phone':
        updatedData.phone = currentAnswer
        break
      case 'location':
        updatedData.city = currentAnswer
        break
      case 'cycle':
        updatedData.cycle_length = currentAnswer
        break
      case 'last_period':
        updatedData.last_period_date = currentAnswer
        break
      case 'regularity':
        updatedData.period_regularity = currentAnswer
        break
      case 'severity':
        updatedData.pain_severity = currentAnswer
        break
      case 'previous':
        updatedData.previous_pain_management = currentAnswer
        break
      case 'experience':
        updatedData.when_tried = currentAnswer
        break
      case 'timing':
        updatedData.timing_of_use = currentAnswer
        break
      case 'frequency':
        updatedData.frequency_of_use = currentAnswer
        break
      case 'preparation':
        updatedData.preparation_method = currentAnswer
        break
      case 'rating':
        if (currentQuestion.title.includes('satisfied')) {
          // User selects actual rating value (1-5), not index
          const ratingValue = parseInt(currentAnswer)
          console.log('Satisfaction rating captured:', currentAnswer, 'Parsed as:', ratingValue)
          updatedData.overall_satisfaction = ratingValue
        } else if (currentQuestion.title.includes('taste')) {
          // User selects actual rating value (1-5), not index
          const ratingValue = parseInt(currentAnswer)
          console.log('Taste rating captured:', currentAnswer, 'Parsed as:', ratingValue)
          updatedData.taste_rating = ratingValue
        } else if (currentQuestion.title.includes('value')) {
          // User selects actual rating value (1-5), not index
          const ratingValue = parseInt(currentAnswer)
          console.log('Value rating captured:', currentAnswer, 'Parsed as:', ratingValue)
          updatedData.value_rating = ratingValue
        } else if (currentQuestion.title.includes('packaging')) {
          // User selects actual rating value (1-5), not index
          const ratingValue = parseInt(currentAnswer)
          console.log('Packaging rating captured:', currentAnswer, 'Parsed as:', ratingValue)
          updatedData.packaging_rating = ratingValue
        } else if (currentQuestion.title.includes('quickly') || currentQuestion.title.includes('magic')) {
          updatedData.effect_speed = currentAnswer
        }
        break
      case 'recommendation':
        if (currentQuestion.title.includes('drink again')) {
          updatedData.would_drink_again = currentAnswer
        } else if (currentQuestion.title.includes('recommend')) {
          updatedData.would_recommend = currentAnswer
        }
        break
      case 'benefits':
        updatedData.benefits_experienced = selectedOptions
        break
      case 'convenience':
        updatedData.convenience_rating = currentAnswer
        break
      case 'storage':
        updatedData.storage_experience = currentAnswer
        break
      case 'dosage':
        updatedData.dosage_followed = currentAnswer
        break
      case 'side_effects':
        updatedData.side_effects = currentAnswer
        break
      case 'budget':
        updatedData.budget_range = currentAnswer
        break
      case 'price_points':
        updatedData.price_points = currentAnswer
        break
      case 'purchase_intent':
        updatedData.purchase_intent = currentAnswer
        break
      case 'lifestyle':
        updatedData.lifestyle_impact = selectedOptions
        break
      case 'selfcare':
        updatedData.self_care_essentials = selectedOptions
        break
      case 'confidence':
        updatedData.confidence_boost = currentAnswer
        break
      case 'feeling':
        updatedData.current_feeling = currentAnswer
        break
      case 'social':
        updatedData.instagram = currentAnswer
        break
      case 'community':
        updatedData.community_interest = currentAnswer
        break
      case 'volunteer':
        updatedData.volunteer_interest = currentAnswer
        break
      case 'campaign':
        updatedData.face_and_soul_campaign = currentAnswer
        break
      case 'testimonial':
        updatedData.testimonial_permission = currentAnswer
        break
      case 'final':
        updatedData.final_thoughts = currentAnswer
        break
    }

    setFeedbackData(updatedData)

    // Move to next question or complete
    if (currentStep < FEEDBACK_QUESTIONS.length - 1) {
      setCurrentStep(prev => prev + 1)
      setCurrentAnswer('')
      setSelectedOptions([])
    } else {
      handleComplete()
    }
  }

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1)
      setCurrentAnswer('')
      setSelectedOptions([])
    }
  }

  const handleComplete = async () => {
    setIsSubmitting(true)
    setError(null)
    setIsLoading(true)
    
    try {
      // Debug: Log the raw feedback data
      console.log('Raw feedback data before validation:', feedbackData)
      console.log('Overall satisfaction raw value:', feedbackData.overall_satisfaction, 'Type:', typeof feedbackData.overall_satisfaction)
      
      // Validate and set default values for rating fields
      const validatedData = {
        ...feedbackData,
        // Ensure rating fields are valid numbers between 1-5
        overall_satisfaction: (feedbackData.overall_satisfaction !== null && 
          feedbackData.overall_satisfaction !== undefined && 
          feedbackData.overall_satisfaction >= 1 && 
          feedbackData.overall_satisfaction <= 5) 
          ? feedbackData.overall_satisfaction 
          : 3, // Default to 3 if invalid
        taste_rating: (feedbackData.taste_rating !== null && 
          feedbackData.taste_rating !== undefined && 
          feedbackData.taste_rating >= 1 && 
          feedbackData.taste_rating <= 5) 
          ? feedbackData.taste_rating 
          : 3,
        value_rating: (feedbackData.value_rating !== null && 
          feedbackData.value_rating !== undefined && 
          feedbackData.value_rating >= 1 && 
          feedbackData.value_rating <= 5) 
          ? feedbackData.value_rating 
          : 3,
        packaging_rating: (feedbackData.packaging_rating !== null && 
          feedbackData.packaging_rating !== undefined && 
          feedbackData.packaging_rating >= 1 && 
          feedbackData.packaging_rating <= 5) 
          ? feedbackData.packaging_rating 
          : 3,
        submitted_at: new Date().toISOString(),
        source: 'structured_feedback'
      }

      console.log('Submitting feedback data:', validatedData)
      console.log('Final overall satisfaction:', validatedData.overall_satisfaction)

      // Save to database using API endpoint
      const response = await fetch('/api/submit-feedback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(validatedData)
      })

      if (!response.ok) {
        const errorData = await response.json()
        console.error('API error:', errorData)
        throw new Error(errorData.error || 'Failed to save your feedback. Please try again.')
      }

      const result = await response.json()
      console.log('Feedback saved successfully:', result)

      // Update live stats for Hero Section
      incrementCustomer()
      
      // Add review if they gave permission and had positive feedback
      if (validatedData.testimonial_permission?.includes('Yes') && 
          validatedData.overall_satisfaction >= 4) {
        addReview({
          name: validatedData.first_name || 'Anonymous',
          rating: validatedData.overall_satisfaction,
          comment: validatedData.final_thoughts || 'Amazing experience with Period Calm!'
        })
      }
      
      // Update effectiveness rate based on satisfaction
      const currentStats = useLiveStatsStore.getState().stats
      const newEffectivenessRate = Math.round(
        ((currentStats.effectivenessRate * currentStats.totalCustomers) + validatedData.overall_satisfaction) / 
        (currentStats.totalCustomers + 1)
      )
      
      // Update relief time based on effect speed
      let reliefTime = 15 // default
      if (validatedData.effect_speed?.includes('0-10')) reliefTime = 8
      else if (validatedData.effect_speed?.includes('10-20')) reliefTime = 15
      else if (validatedData.effect_speed?.includes('20-30')) reliefTime = 25
      else if (validatedData.effect_speed?.includes('30+')) reliefTime = 35
      
      updateStats({
        effectivenessRate: newEffectivenessRate,
        reliefTimeMinutes: reliefTime
      })

      // Sync live stats with the latest feedback data
      await syncWithFeedbackData()

      setShowSuccess(true)
      setIsLoading(false)
      
      // Clear saved form progress since submission was successful
      clearFormProgress()
      
      // Auto close and navigate to home page after 3 seconds
      setTimeout(() => {
        onCloseAction()
        router.push('/')
      }, 3000)
      
    } catch (error) {
      console.error('Error saving feedback:', error)
      setError(error instanceof Error ? error.message : 'An unexpected error occurred. Please try again.')
      setIsLoading(false)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleNext()
    }
  }

  const handleStartFeedback = () => {
    setShowWelcome(false)
    setShowQA(false)
  }

  const handleStartQA = () => {
    setShowWelcome(false)
    setShowQA(true)
  }

  const handleResumeFeedback = () => {
    setShowWelcome(false)
    setShowQA(false)
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

      {/* Simplified Impact Preview */}
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
        <div className="flex flex-col gap-3 md:flex-row md:gap-4 justify-center">
          <Button 
            onClick={handleStartFeedback}
            className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-6 md:px-8 py-3 text-base md:text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 w-full md:w-auto"
            aria-label="Start sharing your Period Calm experience"
          >
            💝 Share My Experience
          </Button>
          <Button 
            onClick={handleStartQA}
            variant="outline"
            className="border-2 border-purple-300 text-purple-600 hover:bg-purple-50 px-6 md:px-8 py-3 text-base md:text-lg font-semibold rounded-xl transition-all duration-300 w-full md:w-auto"
            aria-label="Ask questions about Period Calm"
          >
            💭 Ask Questions
          </Button>
        </div>
        
        {/* Resume Progress Button */}
        {typeof window !== 'undefined' && localStorage.getItem('feedback-progress') && (
          <div className="pt-2">
            <Button 
              onClick={handleResumeFeedback}
              variant="outline"
              className="border-2 border-green-300 text-green-600 hover:bg-green-50 px-6 md:px-8 py-2 text-sm md:text-base font-medium rounded-lg transition-all duration-300 w-full md:w-auto"
              aria-label="Resume your previous feedback session"
            >
              🔄 Resume Previous Session
            </Button>
          </div>
        )}
      </div>

      {/* Promise */}
      <div className="bg-gradient-to-r from-yellow-50 to-orange-50 p-3 md:p-4 rounded-lg border-2 border-yellow-200 mx-4">
        <p className="text-xs md:text-sm text-gray-700">
          <span className="font-semibold">Our Promise:</span> Your feedback is precious to us. We'll use every detail to make Period Calm even better for women everywhere! ✨
        </p>
      </div>
    </div>
  )

  const renderQuestion = () => {
    const currentQuestion = FEEDBACK_QUESTIONS[currentStep]
    const progress = ((currentStep + 1) / FEEDBACK_QUESTIONS.length) * 100
    const currentPhase = HERO_JOURNEY_PHASES.find(phase => progress >= phase.progress) || HERO_JOURNEY_PHASES[0]
    const feedbackTitle = HERO_TITLES[Math.floor((currentStep / FEEDBACK_QUESTIONS.length) * HERO_TITLES.length)]
    
    const isMultipleChoice = currentQuestion.type === 'rating' || 
                            currentQuestion.type === 'recommendation' || 
                            currentQuestion.type === 'benefits' || 
                            currentQuestion.type === 'lifestyle' || 
                            currentQuestion.type === 'selfcare' ||
                            currentQuestion.type === 'cycle' ||
                            currentQuestion.type === 'last_period' ||
                            currentQuestion.type === 'regularity' ||
                            currentQuestion.type === 'severity' ||
                            currentQuestion.type === 'previous' ||
                            currentQuestion.type === 'experience' ||
                            currentQuestion.type === 'timing' ||
                            currentQuestion.type === 'frequency' ||
                            currentQuestion.type === 'preparation' ||
                            currentQuestion.type === 'convenience' ||
                            currentQuestion.type === 'storage' ||
                            currentQuestion.type === 'dosage' ||
                            currentQuestion.type === 'side_effects' ||
                            currentQuestion.type === 'budget' ||
                            currentQuestion.type === 'price_points' ||
                            currentQuestion.type === 'purchase_intent' ||
                            currentQuestion.type === 'confidence' ||
                            currentQuestion.type === 'community' ||
                            currentQuestion.type === 'volunteer' ||
                            currentQuestion.type === 'campaign' ||
                            currentQuestion.type === 'testimonial'

    return (
      <div className="space-y-4 md:space-y-6 max-w-2xl mx-auto">
        {/* Feedback Progress Header */}
        <div className={`p-3 md:p-4 rounded-xl ${currentPhase.gradient} text-white`}>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-2 md:space-y-0">
            <div className="flex items-center space-x-3">
              <span className="text-xl md:text-2xl">{currentPhase.icon}</span>
              <div>
                <h3 className="font-semibold text-base md:text-lg">Sharing Your Experience</h3>
                <p className="text-xs md:text-sm opacity-90">Step {currentStep + 1} of {FEEDBACK_QUESTIONS.length}</p>
              </div>
            </div>
            <div className="text-center md:text-right">
              <div className="text-xs md:text-sm opacity-90">Your Role</div>
              <div className="font-bold text-base md:text-lg">{feedbackTitle}</div>
            </div>
          </div>
        </div>

        {/* AI Assistant Message */}
        <div className="flex items-start space-x-3 bg-gradient-to-r from-purple-50 to-pink-50 p-3 md:p-4 rounded-lg border border-purple-200">
          <div className="w-8 h-8 md:w-10 md:h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center flex-shrink-0">
            <span className="text-sm md:text-lg">{AI_ASSISTANT.avatar}</span>
          </div>
          <div className="flex-1">
            <div className="font-semibold text-purple-700 mb-1 text-sm md:text-base">{AI_ASSISTANT.name}</div>
            <p className="text-gray-700 text-sm md:text-base">
              {HERO_MESSAGES.progress[Math.floor(Math.random() * HERO_MESSAGES.progress.length)]}
            </p>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="flex justify-between text-xs md:text-sm text-gray-600">
            <span>Feedback Progress</span>
            <span>{Math.round(progress)}% Complete</span>
          </div>
          <div className="relative">
            <Progress value={progress} className="h-2 md:h-3" />
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-xs font-semibold text-white drop-shadow">
                {currentStep + 1} / {FEEDBACK_QUESTIONS.length}
              </span>
            </div>
          </div>
        </div>

        {/* Question */}
        <div className="space-y-3 md:space-y-4">
          <div className="text-center space-y-2">
            <h2 className="text-xl md:text-2xl font-bold text-gray-900 px-2">
              {currentQuestion.title}
            </h2>
            {currentQuestion.description && (
              <p className="text-gray-600 text-sm md:text-base px-2">
                {currentQuestion.description}
              </p>
            )}
          </div>

          {/* Input Options */}
          {isMultipleChoice ? (
            <div className="space-y-2 md:space-y-3">
              {currentQuestion.options?.map((option, index) => (
                <div
                  key={index}
                  onClick={() => handleOptionSelect(option)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault()
                      handleOptionSelect(option)
                    }
                  }}
                  tabIndex={0}
                  role="button"
                  aria-pressed={selectedOptions.includes(option)}
                  className={`p-3 md:p-4 rounded-lg border-2 cursor-pointer transition-all duration-200 min-h-[48px] md:min-h-[56px] flex items-center ${
                    selectedOptions.includes(option)
                      ? `${currentPhase.gradient} text-white border-transparent shadow-lg`
                      : 'border-gray-200 hover:border-purple-300 hover:bg-purple-50'
                  }`}
                >
                  <div className="flex items-center space-x-3 w-full">
                    {currentQuestion.emojis && currentQuestion.emojis[index] && (
                      <span className="text-lg md:text-xl">{currentQuestion.emojis[index]}</span>
                    )}
                    <span className="font-medium text-sm md:text-base flex-1">{option}</span>
                    {selectedOptions.includes(option) && (
                      <CheckCircle className="w-5 h-5 md:w-6 md:h-6 ml-auto" />
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-3 md:space-y-4">
              <Input
                type={currentQuestion.type === 'contact' ? 'email' : 'text'}
                placeholder={currentQuestion.placeholder}
                value={currentAnswer}
                onChange={(e) => setCurrentAnswer(e.target.value)}
                onKeyPress={handleKeyPress}
                className="text-base md:text-lg p-3 md:p-4 border-2 border-gray-200 focus:border-purple-500 focus:ring-purple-500 min-h-[48px] md:min-h-[56px]"
                aria-label={currentQuestion.title}
              />
              {currentQuestion.type === 'contact' && currentAnswer && !validateEmail(currentAnswer) && (
                <p className="text-red-500 text-xs md:text-sm">Please enter a valid email address</p>
              )}
              {currentQuestion.type === 'phone' && currentAnswer && !validatePhone(currentAnswer) && (
                <p className="text-red-500 text-xs md:text-sm">Please enter a valid phone number</p>
              )}
              {currentQuestion.type === 'name' && currentAnswer && !canProceedToNext() && (
                <p className="text-red-500 text-xs md:text-sm">Please enter your full name (first and last name)</p>
              )}
              {currentQuestion.type === 'age' && currentAnswer && !validateAge(currentAnswer) && (
                <p className="text-red-500 text-xs md:text-sm">Please enter a valid age (13-100)</p>
              )}
            </div>
          )}
        </div>

        {/* Navigation */}
        <div className="flex flex-col md:flex-row justify-between items-center pt-4 space-y-3 md:space-y-0">
          <Button
            onClick={handlePrevious}
            disabled={currentStep === 0 || isLoading}
            variant="outline"
            className="flex items-center space-x-2 w-full md:w-auto"
            aria-label="Go to previous question"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Previous</span>
          </Button>

          <div className="flex items-center space-x-2 order-first md:order-none">
            <Badge variant="secondary" className="bg-purple-100 text-purple-700 text-xs">
              {gameStats.totalPoints} Points
            </Badge>
            <Badge variant="secondary" className="bg-pink-100 text-pink-700 text-xs">
              {feedbackTitle}
            </Badge>
          </div>

          <Button
            onClick={handleNext}
            disabled={!canProceedToNext() || isLoading}
            className={`flex items-center space-x-2 w-full md:w-auto ${currentPhase.gradient} text-white hover:opacity-90`}
            aria-label={currentStep === FEEDBACK_QUESTIONS.length - 1 ? "Complete feedback" : "Continue to next question"}
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Saving...</span>
              </>
            ) : (
              <>
                <span>{currentStep === FEEDBACK_QUESTIONS.length - 1 ? 'Complete Feedback' : 'Continue'}</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </Button>
        </div>

        {/* Error Display */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3 md:p-4 mt-4">
            <div className="flex items-center space-x-2">
              <div className="w-5 h-5 bg-red-500 rounded-full flex items-center justify-center">
                <span className="text-white text-xs font-bold">!</span>
              </div>
              <div className="flex-1">
                <p className="text-red-800 text-sm md:text-base font-medium">Error</p>
                <p className="text-red-700 text-xs md:text-sm">{error}</p>
              </div>
              <button
                onClick={() => setError(null)}
                className="text-red-400 hover:text-red-600"
                aria-label="Dismiss error"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    )
  }

  const renderSuccessScreen = () => (
    <div className="text-center space-y-6 max-w-2xl mx-auto">
      {/* Completion Celebration */}
      <div className="space-y-3 md:space-y-4">
        <div className="text-6xl md:text-8xl animate-bounce">🎉</div>
        <div className="text-4xl md:text-6xl animate-pulse">💝</div>
        <h2 className="text-2xl md:text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
          Thank You So Much! 🎉
        </h2>
        <p className="text-lg md:text-xl text-gray-600 px-4">
          You've completed your feedback and helped us make Period Calm even better!
        </p>
        <p className="text-base md:text-lg text-gray-700 px-4">
          Your experience and thoughts will help <span className="font-bold text-pink-600">other women</span> find relief and comfort.
        </p>
      </div>

      {/* Feedback Impact Summary */}
      <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-4 md:p-6 rounded-xl border-2 border-purple-200 mx-4">
        <h3 className="text-base md:text-lg font-semibold text-gray-900 mb-3 md:mb-4">Your Feedback Impact:</h3>
        <div className="grid grid-cols-2 gap-3 md:gap-4 text-sm">
          <div className="text-center">
            <div className="text-xl md:text-2xl font-bold text-purple-600">39</div>
            <div className="text-gray-600 text-xs md:text-sm">Questions Answered</div>
          </div>
          <div className="text-center">
            <div className="text-xl md:text-2xl font-bold text-pink-600">{gameStats.totalPoints}</div>
            <div className="text-gray-600 text-xs md:text-sm">Insights Shared</div>
          </div>
          <div className="text-center">
            <div className="text-xl md:text-2xl font-bold text-indigo-600">{gameStats.achievements.filter(a => a.unlocked).length}</div>
            <div className="text-gray-600 text-xs md:text-sm">Contributions Made</div>
          </div>
          <div className="text-center">
            <div className="text-xl md:text-2xl font-bold text-rose-600">✨</div>
            <div className="text-gray-600 text-xs md:text-sm">Lives You'll Help</div>
          </div>
        </div>
      </div>

      {/* Special Rewards */}
      <div className="space-y-3 md:space-y-4 px-4">
        <h3 className="text-lg md:text-xl font-semibold text-gray-900">
          🎁 Your Special Rewards
        </h3>
        <div className="space-y-2 md:space-y-3">
          <div className="flex items-center space-x-3">
            <div className="w-6 h-6 md:w-8 md:h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-white text-xs md:text-sm font-bold">1</span>
            </div>
            <div className="text-left">
              <div className="font-semibold text-gray-900 text-sm md:text-base">Exclusive Discount</div>
              <div className="text-purple-600 font-mono text-sm md:text-lg">FEEDBACK20</div>
              <div className="text-xs md:text-sm text-gray-600">20% off your first order when we launch!</div>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <div className="w-6 h-6 md:w-8 md:h-8 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-white text-xs md:text-sm font-bold">2</span>
            </div>
            <div className="text-left">
              <div className="font-semibold text-gray-900 text-sm md:text-base">Early Access</div>
              <div className="text-xs md:text-sm text-gray-600">Be the first to know when we launch!</div>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <div className="w-6 h-6 md:w-8 md:h-8 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-white text-xs md:text-sm font-bold">3</span>
            </div>
            <div className="text-left">
              <div className="font-semibold text-gray-900 text-sm md:text-base">Community Access</div>
              <div className="text-xs md:text-sm text-gray-600">Join our exclusive feedback community!</div>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <div className="w-6 h-6 md:w-8 md:h-8 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-white text-xs md:text-sm font-bold">4</span>
            </div>
            <div className="text-left">
              <div className="font-semibold text-gray-900 text-sm md:text-base">Volunteer Opportunities</div>
              <div className="text-xs md:text-sm text-gray-600">Help spread awareness about natural period care!</div>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <div className="w-6 h-6 md:w-8 md:h-8 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-white text-xs md:text-sm font-bold">5</span>
            </div>
            <div className="text-left">
              <div className="font-semibold text-gray-900 text-sm md:text-base">Story Sharing</div>
              <div className="text-xs md:text-sm text-gray-600">Share your experience and inspire other women!</div>
            </div>
          </div>
        </div>
      </div>

      {/* Your Impact */}
      <div className="bg-gradient-to-r from-yellow-50 to-orange-50 p-4 md:p-6 rounded-xl border-2 border-yellow-200 mx-4">
        <h3 className="text-base md:text-lg font-semibold text-gray-900 mb-2 md:mb-3">Your Feedback Will:</h3>
        <div className="space-y-1 md:space-y-2 text-xs md:text-sm">
          <div className="flex justify-between">
            <span>Improve the product:</span>
            <span className="font-bold text-purple-600">Significantly</span>
          </div>
          <div className="flex justify-between">
            <span>Help other women:</span>
            <span className="font-bold text-pink-600">Countless</span>
          </div>
          <div className="flex justify-between">
            <span>Shape our future:</span>
            <span className="font-bold text-indigo-600">Directly</span>
          </div>
          <div className="flex justify-between">
            <span>Your contribution:</span>
            <span className="font-bold text-rose-600">Priceless</span>
          </div>
        </div>
      </div>

      {/* Next Steps */}
      <div className="space-y-3 md:space-y-4 px-4">
        <p className="text-gray-600 text-sm md:text-base">
          We'll call and email you with updates and your exclusive rewards! 📧📞
        </p>
        <div className="flex items-center justify-center space-x-2 text-xs md:text-sm text-gray-500">
          <Heart className="w-3 h-3 md:w-4 md:h-4 text-purple-400" />
          <span>Thank you for helping us make Period Calm better for everyone!</span>
          <Heart className="w-3 h-3 md:w-4 md:h-4 text-purple-400" />
        </div>
      </div>

      {/* AI Assistant Final Message */}
      <div className="flex items-center justify-center space-x-3 bg-gradient-to-r from-purple-50 to-pink-50 p-3 md:p-4 rounded-lg border border-purple-200 mx-4">
        <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
          <span className="text-lg md:text-xl">{AI_ASSISTANT.avatar}</span>
        </div>
        <div>
          <div className="font-semibold text-purple-700 text-sm md:text-base">{AI_ASSISTANT.name}</div>
          <p className="text-gray-700 text-xs md:text-sm">"Your feedback is absolutely precious to us! Thank you for helping us improve! 🌟"</p>
        </div>
      </div>

      {/* Auto-close message */}
      <div className="text-xs md:text-sm text-gray-500">
        This window will close automatically in 3 seconds...
      </div>
    </div>
  )

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50">
      <Card className={`bg-white shadow-2xl overflow-hidden transition-all duration-300 ${
        isMaximized 
          ? 'w-full h-full rounded-none' 
          : 'w-full max-w-4xl h-[90vh] rounded-lg m-4'
      }`}>
        <CardContent className="p-0 h-full flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between p-3 md:p-4 border-b border-gray-200 bg-gradient-to-r from-purple-50 to-pink-50">
            <div className="flex items-center space-x-2 md:space-x-3">
              <div className="w-6 h-6 md:w-8 md:h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white text-xs md:text-sm font-bold">
                PC
              </div>
              <div>
                <h2 className="text-base md:text-lg font-bold text-gray-900">
                  Period Calm Feedback
                </h2>
                <p className="text-xs md:text-sm text-gray-600">
                  Share your experience with us!
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-1 md:space-x-2">
              <button
                onClick={() => setIsMaximized(!isMaximized)}
                className="text-gray-400 hover:text-gray-600 transition-colors p-1 md:p-2"
                title={isMaximized ? "Minimize" : "Maximize"}
                aria-label={isMaximized ? "Minimize modal" : "Maximize modal"}
              >
                {isMaximized ? (
                  <Minimize2 className="w-4 h-4 md:w-5 md:h-5" />
                ) : (
                  <Maximize2 className="w-4 h-4 md:w-5 md:h-5" />
                )}
              </button>
              <button
                onClick={onCloseAction}
                className="text-gray-400 hover:text-gray-600 transition-colors p-1 md:p-2"
                aria-label="Close modal"
              >
                <X className="w-4 h-4 md:w-5 md:h-5" />
              </button>
            </div>
          </div>

          {/* Game Stats Display */}
          <div className="px-3 md:px-4 py-2 bg-gradient-to-r from-purple-100 to-pink-100 border-b border-purple-200">
            <div className="flex items-center justify-between text-xs md:text-sm">
              <div className="flex items-center space-x-2 md:space-x-4">
                <div className="flex items-center space-x-1">
                  <Star className="w-3 h-3 md:w-4 md:h-4 text-yellow-500" />
                  <span className="font-semibold text-gray-700">{gameStats.totalPoints}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Trophy className="w-3 h-3 md:w-4 md:h-4 text-purple-500" />
                  <span className="font-semibold text-gray-700">Level {gameStats.level}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Sparkles className="w-3 h-3 md:w-4 md:h-4 text-pink-500" />
                  <span className="font-semibold text-gray-700">
                    {gameStats.achievements.filter(a => a.unlocked).length} Achievements
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Achievement Notification */}
          {showAchievement && (
            <div className="fixed top-2 md:top-4 right-2 md:right-4 z-50 bg-gradient-to-r from-yellow-400 to-orange-500 text-white p-3 md:p-4 rounded-lg shadow-lg animate-bounce max-w-xs">
              <div className="flex items-center space-x-2">
                <span className="text-xl md:text-2xl">🏆</span>
                <div>
                  <div className="font-semibold text-sm md:text-base">Achievement Unlocked!</div>
                  <div className="text-xs md:text-sm">{showAchievement}</div>
                </div>
              </div>
            </div>
          )}

          {/* Celebration Effect */}
          {showCelebration && (
            <div className="fixed inset-0 z-40 flex items-center justify-center bg-black bg-opacity-50 p-4">
              <div className="bg-white p-6 md:p-8 rounded-2xl text-center animate-pulse max-w-sm md:max-w-md">
                <div className="text-4xl md:text-6xl mb-3 md:mb-4">🎉</div>
                <div className="text-xl md:text-2xl font-bold text-gray-900 mb-2">Milestone Reached!</div>
                <div className="text-gray-600 text-sm md:text-base">{currentMessage}</div>
              </div>
            </div>
          )}

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-3 md:p-6 min-h-0">
            {showSuccess ? (
              renderSuccessScreen()
            ) : showWelcome ? (
              renderWelcomeScreen()
            ) : showQA ? (
              <ProductQAForm onCloseAction={onCloseAction} onBackToFeedback={() => setShowWelcome(true)} />
            ) : (
              renderQuestion()
            )}
          </div>

          {/* Footer */}
          <div className="p-3 md:p-4 border-t border-gray-200 bg-gray-50">
            <div className="flex items-center justify-center space-x-2 text-xs md:text-sm text-gray-500">
              <Heart className="w-3 h-3 md:w-4 md:h-4 text-purple-400" />
              <span>Your feedback helps thousands of women find relief</span>
              <Heart className="w-3 h-3 md:w-4 md:h-4 text-purple-400" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 
