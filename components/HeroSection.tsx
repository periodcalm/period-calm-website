"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Star, Heart, Zap, Shield, ArrowRight, Play, RefreshCw } from "lucide-react"

import { AnimatedCounter } from "@/components/AnimatedCounter"
import { useAnalytics } from "@/hooks/useAnalytics"
import { LoadingSpinner } from "@/components/LoadingSpinner"
import Image from "next/image"

export default function HeroSection() {
  const [isVisible, setIsVisible] = useState(false)
  const [hasMounted, setHasMounted] = useState(false)
  const { analyticsData, testimonials, isLoading, refetch } = useAnalytics()

  // Analytics data loaded

  // Analytics data loaded

  useEffect(() => {
    setIsVisible(true)
    setHasMounted(true)
  }, [])

  const scrollToProduct = () => {
    const element = document.getElementById("product")
    if (element) {
      element.scrollIntoView({ behavior: "smooth" })
    }
  }

  // Dynamic review data from testimonials
  const latestReview = testimonials.length > 0 ? {
    name: testimonials[0].name,
    rating: testimonials[0].rating,
    comment: testimonials[0].content,
    timestamp: testimonials[0].submitted_at
  } : {
    name: "Sarah J.",
    rating: 5,
    comment: "Life-changing relief! Within 20 minutes, my cramps were completely gone.",
    timestamp: new Date().toISOString()
  }

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-rose-50 via-orange-50 to-pink-50">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-rose-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-orange-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
        <div className="absolute top-40 left-40 w-80 h-80 bg-pink-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
      </div>

      <div className="container mx-auto px-4 py-20 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-8">
            {/* Badge */}
            <div
              className={`transition-all duration-1000 ${
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
              }`}
            >
              <div className="flex items-center gap-2">
                <Badge className="bg-gradient-to-r from-rose-500 to-pink-500 text-white px-4 py-2 text-sm font-medium floating-badge">
                  <Star className="w-4 h-4 mr-2" />
                  #1 Natural Period Relief
                </Badge>
                <button
                  onClick={() => {
                    console.log('🔄 Manual refresh clicked')
                    // Force multiple refreshes to ensure data sync
                    refetch()
                    setTimeout(() => refetch(), 500)
                    setTimeout(() => refetch(), 1000)
                    // Force a complete page refresh after 2 seconds to ensure latest data
                    setTimeout(() => {
                      window.location.reload()
                    }, 2000)
                  }}
                  className="p-1 hover:bg-rose-100 rounded-full transition-colors"
                  title="Force refresh data and reload page"
                >
                  <RefreshCw className={`w-4 h-4 text-rose-600 ${isLoading ? 'animate-spin' : ''}`} />
                </button>
              </div>
            </div>

            {/* Main Heading */}
            <div
              className={`space-y-4 transition-all duration-1000 delay-200 ${
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
              }`}
            >
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-light leading-tight">
                Say Goodbye to
                <span className="block font-bold bg-gradient-to-r from-rose-600 via-orange-600 to-pink-600 bg-clip-text text-transparent animate-gradient-shift">
                  Period Pain
                </span>
              </h1>
              <div className="text-xl md:text-2xl text-gray-600 leading-relaxed max-w-2xl">
                Natural relief in just <span className="font-semibold text-rose-600">0-20 minutes</span>. Join{" "}
                <span className="font-semibold text-rose-600">
                  {isLoading ? (
                    <LoadingSpinner size="sm" text="" className="justify-start" />
                  ) : (
                    <span>{analyticsData?.total_submissions || 0}</span>
                  )}
                </span>{" "}
                users who trusted Period Calm for cramp relief, mood harmony, and energy boost.
              </div>
            </div>

            {/* Trust Indicators */}
            <div
              className={`flex flex-wrap items-center gap-6 transition-all duration-1000 delay-400 ${
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
              }`}
            >
              <div className="flex items-center space-x-1">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                ))}
                <span className="ml-2 font-semibold">
                  {isLoading ? (
                    <LoadingSpinner size="sm" text="" className="justify-start" />
                  ) : (
                    <span>{analyticsData?.average_ratings?.overall_satisfaction || 0}</span>
                  )}
                </span>
                <span className="text-gray-600">
                  ({isLoading ? (
                    <LoadingSpinner size="sm" text="" className="justify-start" />
                  ) : (
                    <span>{analyticsData?.total_submissions || 0}</span>
                  )} reviews)
                </span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <Shield className="w-4 h-4 text-blue-500" />
                <span>Community-Validated</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <Heart className="w-4 h-4 text-red-500" />
                <span>100% Natural</span>
              </div>
            </div>

            {/* CTA Buttons */}
            <div
              className={`flex flex-col sm:flex-row gap-4 transition-all duration-1000 delay-600 ${
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
              }`}
            >
              <Button
                size="lg"
                onClick={scrollToProduct}
                className="bg-gradient-to-r from-rose-500 to-orange-500 hover:from-rose-600 hover:to-orange-600 text-white px-8 py-4 text-lg font-semibold rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
              >
                <Zap className="w-5 h-5 mr-2" />
                Try Period Calm
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="px-8 py-4 text-lg font-semibold rounded-full border-2 border-gray-300 hover:border-rose-300 hover:bg-rose-50 transition-all duration-300 bg-white/80 backdrop-blur-sm"
              >
                <Play className="w-5 h-5 mr-2" />
                Watch How It Works
              </Button>
            </div>

            {/* Quick Stats */}
            <div
              className={`grid grid-cols-3 gap-6 mt-10 transition-all duration-1000 delay-600 ${
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
              }`}
            >
              <div className="text-center">
                <div className="text-3xl font-bold text-rose-600">
                  {isLoading ? (
                    <LoadingSpinner size="sm" text="" className="justify-center" />
                  ) : (
                    <span>{analyticsData?.average_ratings?.overall_satisfaction || 0}★</span>
                  )}
                </div>
                <div className="text-gray-600 text-sm">Average Rating</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-orange-600">
                  {isLoading ? (
                    <LoadingSpinner size="sm" text="" className="justify-center" />
                  ) : (
                    <span>{analyticsData?.total_submissions || 0}</span>
                  )}
                </div>
                <div className="text-gray-600 text-sm">Reviews</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-pink-600">
                  {isLoading ? (
                    <LoadingSpinner size="sm" text="" className="justify-center" />
                  ) : (
                    <span>{analyticsData?.total_submissions || 0}+</span>
                  )}
                </div>
                <div className="text-gray-600 text-sm">Happy Users</div>
              </div>
            </div>
          </div>

          {/* Right Content - Product Image */}
          <div
            className={`relative transition-all duration-1000 delay-300 ${
              isVisible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-10"
            }`}
          >
            <div className="relative">
              {/* Main Product Image */}
              <div className="relative bg-white rounded-3xl p-8 shadow-2xl border border-gray-100 transform hover:scale-105 transition-transform duration-500">
                <Image
                  src="/images/packaging.png"
                  alt="Period Calm Natural Relief Powder"
                  width={400}
                  height={500}
                  className="mx-auto"
                  priority
                />
              </div>

              {/* Floating Elements */}
              <div className="absolute -top-6 -left-6 bg-green-500 text-white rounded-full p-4 shadow-lg animate-bounce-gentle">
                <Shield className="w-6 h-6" />
              </div>
              <div className="absolute -bottom-6 -right-6 bg-blue-500 text-white rounded-full p-4 shadow-lg animate-bounce-gentle animation-delay-2000">
                <Zap className="w-6 h-6" />
              </div>
              <div className="absolute top-1/2 -right-8 bg-pink-500 text-white rounded-full p-3 shadow-lg animate-float">
                <Heart className="w-5 h-5" />
              </div>

              {/* Live Testimonial Bubble */}
              {latestReview && (
                <div className="absolute -left-8 top-1/3 bg-white rounded-2xl p-4 shadow-lg max-w-xs animate-float-delayed">
                  <div className="flex items-center space-x-2 mb-2">
                    <div className="w-8 h-8 bg-rose-500 rounded-full flex items-center justify-center text-white text-sm font-semibold">
                      {latestReview.name.charAt(0)}
                    </div>
                    <div>
                      <div className="font-semibold text-sm">{latestReview.name}</div>
                      <div className="flex">
                        {[1, 2, 3, 4, 5].map((i) => (
                          <Star 
                            key={i} 
                            className={`w-3 h-3 ${i <= latestReview.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} 
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                  <p className="text-xs text-gray-600">"{latestReview.comment}"</p>
                  <div className="text-xs text-gray-400 mt-1">
                    {hasMounted
                      ? new Date(latestReview.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                      : ""}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-gray-400 rounded-full flex justify-center">
          <div className="w-1 h-3 bg-gray-400 rounded-full mt-2 animate-pulse"></div>
        </div>
      </div>
    </section>
  )
}
