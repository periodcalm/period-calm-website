"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Heart, Sparkles, Users, Calendar, Bell, Crown, BookOpen, Star, Target, Globe } from "lucide-react"

interface ComingSoonModalProps {
  isOpen: boolean
  onClose: () => void
}

export function ComingSoonModal({ isOpen, onClose }: ComingSoonModalProps) {
  const [email, setEmail] = useState("")
  const [isSubscribed, setIsSubscribed] = useState(false)

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault()
    if (email) {
      // Simulate subscription
      setIsSubscribed(true)
      setTimeout(() => {
        setIsSubscribed(false)
        setEmail("")
        onClose()
      }, 2000)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-r from-purple-500 via-pink-500 to-rose-500">
            <Crown className="h-8 w-8 text-white" />
          </div>
          <DialogTitle className="text-2xl font-bold text-gray-900">
            SheRises - Divine Empowerment Platform
          </DialogTitle>
          <Badge variant="secondary" className="mx-auto mt-2 w-fit">
            <Calendar className="w-3 h-3 mr-1" />
            Launching Q1 2024
          </Badge>
        </DialogHeader>

        <div className="space-y-6">
          {/* Description */}
          <div className="text-center">
            <p className="text-gray-600 mb-4">
              SheRises is a revolutionary platform where women discover their true divine worth, 
              embrace authentic feminism, and unlock their limitless potential through education, 
              mentorship, and community.
            </p>
            
            <div className="grid grid-cols-1 gap-3 text-sm">
              <div className="flex items-center justify-center space-x-2 text-purple-600">
                <Crown className="w-4 h-4" />
                <span>Divine Worth & Dignity</span>
              </div>
              <div className="flex items-center justify-center space-x-2 text-pink-600">
                <Star className="w-4 h-4" />
                <span>Authentic Feminism</span>
              </div>
              <div className="flex items-center justify-center space-x-2 text-rose-600">
                <Target className="w-4 h-4" />
                <span>Skills & Empowerment</span>
              </div>
            </div>
          </div>

          {/* Core Mission */}
          <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg p-4">
            <h4 className="font-semibold text-gray-900 mb-3 text-center">Our Divine Mission:</h4>
            <p className="text-sm text-gray-700 text-center italic mb-3">
              "To restore every woman's divine aura, dignity, and worth while creating a platform 
              where she can shine in her authentic power."
            </p>
          </div>

          {/* Features Preview */}
          <div className="bg-gradient-to-r from-rose-50 to-orange-50 rounded-lg p-4">
            <h4 className="font-semibold text-gray-900 mb-3">What SheRises Offers:</h4>
            <ul className="space-y-2 text-sm text-gray-600">
              <li className="flex items-start space-x-2">
                <div className="w-1.5 h-1.5 bg-purple-500 rounded-full mt-2 flex-shrink-0"></div>
                <span><strong>Free Skills Courses:</strong> Learn valuable skills to build your career and independence</span>
              </li>
              <li className="flex items-start space-x-2">
                <div className="w-1.5 h-1.5 bg-pink-500 rounded-full mt-2 flex-shrink-0"></div>
                <span><strong>Top Women Entrepreneurs:</strong> Connect with successful mentors and role models</span>
              </li>
              <li className="flex items-start space-x-2">
                <div className="w-1.5 h-1.5 bg-rose-500 rounded-full mt-2 flex-shrink-0"></div>
                <span><strong>Feminist Education:</strong> Understand true feminism and women's rights</span>
              </li>
              <li className="flex items-start space-x-2">
                <div className="w-1.5 h-1.5 bg-purple-500 rounded-full mt-2 flex-shrink-0"></div>
                <span><strong>Divine Worth Discovery:</strong> Rediscover your inherent dignity and value</span>
              </li>
              <li className="flex items-start space-x-2">
                <div className="w-1.5 h-1.5 bg-pink-500 rounded-full mt-2 flex-shrink-0"></div>
                <span><strong>Community Support:</strong> Connect with like-minded empowered women</span>
              </li>
              <li className="flex items-start space-x-2">
                <div className="w-1.5 h-1.5 bg-rose-500 rounded-full mt-2 flex-shrink-0"></div>
                <span><strong>Showcase Your Aura:</strong> Display your talents and achievements proudly</span>
              </li>
            </ul>
          </div>

          {/* Empowerment Pillars */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="text-center p-3 bg-purple-100 rounded-lg">
              <Crown className="w-6 h-6 text-purple-600 mx-auto mb-2" />
              <h5 className="font-semibold text-purple-800 text-sm">Divine Worth</h5>
              <p className="text-xs text-purple-600">Rediscover your inherent dignity</p>
            </div>
            <div className="text-center p-3 bg-pink-100 rounded-lg">
              <BookOpen className="w-6 h-6 text-pink-600 mx-auto mb-2" />
              <h5 className="font-semibold text-pink-800 text-sm">Skills & Learning</h5>
              <p className="text-xs text-pink-600">Free courses & mentorship</p>
            </div>
            <div className="text-center p-3 bg-rose-100 rounded-lg">
              <Globe className="w-6 h-6 text-rose-600 mx-auto mb-2" />
              <h5 className="font-semibold text-rose-800 text-sm">Community</h5>
              <p className="text-xs text-rose-600">Connect & empower together</p>
            </div>
          </div>

          {/* Email Subscription */}
          {!isSubscribed ? (
            <form onSubmit={handleSubscribe} className="space-y-3">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Be the first to know when SheRises launches:
                </label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email address"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  required
                />
              </div>
              <Button 
                type="submit" 
                className="w-full bg-gradient-to-r from-purple-500 via-pink-500 to-rose-500 hover:from-purple-600 hover:via-pink-600 hover:to-rose-600 text-white"
              >
                <Bell className="w-4 h-4 mr-2" />
                Join the Revolution
              </Button>
            </form>
          ) : (
            <div className="text-center py-4">
              <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
                <Crown className="h-6 w-6 text-green-600" />
              </div>
              <p className="text-green-600 font-medium">Welcome to SheRises!</p>
              <p className="text-sm text-gray-500">We'll notify you as soon as the platform launches.</p>
            </div>
          )}

          {/* Close Button */}
          <div className="text-center">
            <Button 
              variant="outline" 
              onClick={onClose}
              className="text-gray-600 hover:text-gray-800"
            >
              Close
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
} 