export interface CycleData {
  date: string
  isPeriod: boolean
  flow: "spotting" | "light" | "medium" | "heavy" | "very_heavy" | null
  symptoms: (string | { id: string; severity: number })[]
  mood: "great" | "good" | "okay" | "bad" | "terrible" | null
  notes: string
  temperature: number | null
  weight: number | null
  sleep: number | null
  exercise: boolean
  water: number
  cervicalMucus: "dry" | "sticky" | "creamy" | "watery" | "egg_white" | null
  medications: string[]
  sexualActivity: boolean
}

export interface DayEntry extends CycleData {
  id: string
  userId: string
  createdAt: Date
  updatedAt: Date
}

export interface PredictionData {
  nextPeriod: Date
  ovulation: Date
  fertileWindow: { start: Date; end: Date }
  cycleLength: number
  periodLength: number
  pmsStart: Date
  confidence: number
}

export interface InsightData {
  totalEntries: number
  periodDays: number
  avgCycleLength: number
  avgPeriodLength: number
  commonSymptoms: { symptom: string; count: number; avgSeverity?: number }[]
  avgMood: number
  streakDays: number
  patterns: {
    regularCycle: boolean
    ovulationPattern: boolean
    pmsPattern: boolean
  }
}

export interface UserPreferences {
  notifications: {
    period: boolean
    ovulation: boolean
    pms: boolean
    dailyReminder: boolean
  }
  privacy: {
    dataSharing: boolean
    analytics: boolean
    socialFeatures: boolean
  }
  display: {
    theme: "light" | "dark" | "auto"
    language: string
    units: "metric" | "imperial"
  }
  tracking: {
    symptoms: string[]
    customSymptoms: string[]
    fertilityTracking: boolean
    moodTracking: boolean
  }
}

export interface NotificationData {
  id: string
  type: "period" | "ovulation" | "pms" | "reminder"
  title: string
  message: string
  scheduledFor: Date
  isActive: boolean
  userId: string
}

export interface CommunityPost {
  id: string
  userId: string
  username: string
  avatar?: string
  content: string
  type: "question" | "experience" | "tip" | "support"
  tags: string[]
  likes: number
  comments: number
  createdAt: Date
  isAnonymous: boolean
}

export interface EducationalContent {
  id: string
  title: string
  content: string
  category: "menstrual-health" | "nutrition" | "wellness" | "fertility" | "symptoms"
  tags: string[]
  readTime: number
  author: string
  publishedAt: Date
  featured: boolean
}
