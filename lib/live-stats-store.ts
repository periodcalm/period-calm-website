"use client"

import { create } from "zustand"
import { persist } from "zustand/middleware"

export interface LiveStats {
  totalCustomers: number
  totalReviews: number
  averageRating: number
  effectivenessRate: number
  reliefTimeMinutes: number
  recommendPercent: number
  lastUpdated: string
}

export interface LiveReview {
  id: string
  name: string
  rating: number
  comment: string
  timestamp: string
}

interface LiveStatsStore {
  stats: LiveStats
  recentReviews: LiveReview[]
  
  // Actions
  incrementCustomer: () => void
  addReview: (review: Omit<LiveReview, "id" | "timestamp">) => void
  updateStats: (updates: Partial<LiveStats>) => void
  addFeedbackSubmission: (feedback: { name: string; email: string; message: string }) => void
  syncWithFeedbackData: () => Promise<void>
  debugStats: () => void
  clearStore: () => void
}

// Initial stats
const initialStats: LiveStats = {
  totalCustomers: 0,
  totalReviews: 0,
  averageRating: 0,
  effectivenessRate: 0,
  reliefTimeMinutes: 0,
  recommendPercent: 0,
  lastUpdated: new Date().toISOString(),
}

console.log('📊 Initial stats created:', initialStats)

// Initial reviews
const initialReviews: LiveReview[] = [
  {
    id: "1",
    name: "Sarah M.",
    rating: 5,
    comment: "Relief in 15 minutes! This changed my life completely.",
    timestamp: new Date(Date.now() - 2 * 60 * 1000).toISOString(), // 2 minutes ago
  },
  {
    id: "2",
    name: "Priya S.",
    rating: 5,
    comment: "Amazing product! No more cramps and mood swings.",
    timestamp: new Date(Date.now() - 5 * 60 * 1000).toISOString(), // 5 minutes ago
  },
  {
    id: "3",
    name: "Maria K.",
    rating: 5,
    comment: "Finally found something that actually works!",
    timestamp: new Date(Date.now() - 8 * 60 * 1000).toISOString(), // 8 minutes ago
  },
]

export const useLiveStatsStore = create<LiveStatsStore>()(
  persist(
    (set, get) => ({
      stats: initialStats,
      recentReviews: initialReviews,

      incrementCustomer: () => {
        set((state) => ({
          stats: {
            ...state.stats,
            totalCustomers: state.stats.totalCustomers + 1,
            lastUpdated: new Date().toISOString(),
          },
        }))
      },

      addReview: (review) => {
        const newReview: LiveReview = {
          ...review,
          id: Date.now().toString(),
          timestamp: new Date().toISOString(),
        }

        set((state) => {
          const newReviews = [newReview, ...state.recentReviews.slice(0, 4)] // Keep only 5 most recent
          
          // Calculate new average rating
          const allRatings = newReviews.map(r => r.rating)
          const newAverageRating = allRatings.reduce((sum, rating) => sum + rating, 0) / allRatings.length

          return {
            recentReviews: newReviews,
            stats: {
              ...state.stats,
              totalReviews: state.stats.totalReviews + 1,
              averageRating: Math.round(newAverageRating * 10) / 10, // Round to 1 decimal
              lastUpdated: new Date().toISOString(),
            },
          }
        })
      },

      updateStats: (updates) => {
        set((state) => ({
          stats: {
            ...state.stats,
            ...updates,
            lastUpdated: new Date().toISOString(),
          },
        }))
      },

      addFeedbackSubmission: (feedback) => {
        // When someone submits feedback, increment customer count and potentially add a review
        const state = get()
        
        // Always increment customer count
        state.incrementCustomer()
        
        // 20% chance to add a review based on the feedback
        if (Math.random() < 0.2) {
          const reviewName = feedback.name || "Anonymous"
          const reviewComment = feedback.message.length > 50 
            ? feedback.message.substring(0, 50) + "..." 
            : feedback.message
            
          state.addReview({
            name: reviewName,
            rating: 5, // Assume positive feedback
            comment: reviewComment,
          })
        }
      },

      syncWithFeedbackData: async () => {
        try {
          console.log('🔄 Starting live stats sync...')
          
          // Fetch the latest feedback data from our API
          const response = await fetch('/api/analytics')
          if (!response.ok) {
            console.error('❌ Failed to fetch feedback data for sync:', response.status)
            return
          }
          
          const result = await response.json()
          console.log('📊 Analytics API response:', result)
          
          if (!result.success || !result.data) {
            console.error('❌ Invalid feedback data response')
            return
          }
          
          const { totalSubmissions, averageSatisfaction, recommendationRate } = result.data
          console.log('📈 Extracted data:', { totalSubmissions, averageSatisfaction, recommendationRate })
          
          // Update stats with real data from feedback submissions
          set((state) => {
            const newStats = {
              ...state.stats,
              totalCustomers: totalSubmissions, // Force update, don't use Math.max
              totalReviews: totalSubmissions,   // Force update, don't use Math.max
              averageRating: averageSatisfaction || 0, // Force update
              recommendPercent: recommendationRate || 0, // Force update
              lastUpdated: new Date().toISOString(),
            }
            
            console.log('🔄 Updating stats from:', state.stats, 'to:', newStats)
            return { stats: newStats }
          })
          
          console.log('✅ Live stats synced successfully!')
        } catch (error) {
          console.error('❌ Error syncing live stats with feedback data:', error)
        }
      },

      debugStats: () => {
        const state = get()
        console.log('🔍 Current live stats state:', state)
      },

      clearStore: () => {
        console.log('🗑️ Clearing live stats store...')
        set({
          stats: initialStats,
          recentReviews: initialReviews,
        })
        console.log('✅ Live stats store cleared!')
      },
    }),
    {
      name: "live-stats-storage",
    },
  ),
) 