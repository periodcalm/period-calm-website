"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Star, ChevronLeft, ChevronRight, Quote, RefreshCw } from "lucide-react"

import { AnimatedCounter } from "@/components/AnimatedCounter"

interface Testimonial {
  id: string
  name: string
  age: number | null
  location: string
  rating: number
  title: string
  content: string
  image: string
  verified: boolean
  beforeAfter: {
    before: string
    after: string
  }
  submitted_at: string
}

export default function TestimonialsSection() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isVisible, setIsVisible] = useState(false)
  const [hasMounted, setHasMounted] = useState(false)
  const [testimonials, setTestimonials] = useState<Testimonial[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)


  useEffect(() => {
    setIsVisible(true)
    setHasMounted(true)
    // Use static testimonials instead of API call
    setTestimonials([])
  }, [])

  const nextTestimonial = () => {
    if (testimonials.length > 0) {
      setCurrentIndex((prev) => (prev + 1) % testimonials.length)
    }
  }

  const prevTestimonial = () => {
    if (testimonials.length > 0) {
      setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length)
    }
  }

  const currentTestimonial = testimonials[currentIndex] || null

  // Fallback testimonials if no dynamic data
  const fallbackTestimonials = [
    {
      id: "fallback-1",
      name: "Sarah Johnson",
      age: 28,
      location: "Mumbai, India",
      rating: 5,
      title: "Life-changing relief!",
      content: "I've tried everything for my period pain, but nothing worked like Period Calm. Within 20 minutes, my cramps were completely gone. It's now a must-have in my monthly routine.",
      image: "/placeholder.svg?height=60&width=60&text=SJ",
      verified: true,
      beforeAfter: {
        before: "Severe cramps, couldn't work",
        after: "Pain-free, productive days",
      },
      submitted_at: new Date().toISOString()
    }
  ]

  const displayTestimonials = testimonials.length > 0 ? testimonials : fallbackTestimonials
  const displayTestimonial = currentTestimonial || displayTestimonials[0]

  return (
    <section className="py-20 bg-gradient-to-br from-gray-50 to-rose-50" id="testimonials">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div
          className={`text-center mb-16 transition-all duration-1000 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
        >
          <Badge className="mb-4 bg-rose-100 text-rose-700 hover:bg-rose-100">Real Stories</Badge>
          <h2 className="text-3xl md:text-5xl font-light mb-4">
            What Our
            <span className="block font-semibold bg-gradient-to-r from-rose-600 to-orange-600 bg-clip-text text-transparent">
              Users Say
            </span>
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Join thousands of women who have transformed their period experience with Period Calm
          </p>
        </div>

        {/* Main Testimonial */}
        <div
          className={`max-w-4xl mx-auto mb-12 transition-all duration-1000 delay-200 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
        >
          <Card className="relative overflow-hidden shadow-2xl border-0 bg-white">
            <CardContent className="p-8 md:p-12">
              {isLoading ? (
                <div className="flex items-center justify-center py-12">
                  <RefreshCw className="w-8 h-8 animate-spin text-rose-500" />
                  <span className="ml-3 text-gray-600">Loading testimonials...</span>
                </div>
              ) : error ? (
                <div className="text-center py-12">
                  <p className="text-gray-600 mb-4">{error}</p>
                  <Button onClick={fetchTestimonials} variant="outline">
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Try Again
                  </Button>
                </div>
              ) : (
                <div className="grid md:grid-cols-3 gap-8 items-center">
                  {/* Customer Info */}
                  <div className="text-center md:text-left">
                    <div className="relative inline-block mb-4">
                      <img
                        src={displayTestimonial.image || "/placeholder.svg"}
                        alt={displayTestimonial.name}
                        className="w-20 h-20 rounded-full mx-auto md:mx-0 object-cover border-4 border-rose-100"
                      />
                      {displayTestimonial.verified && (
                        <div className="absolute -bottom-1 -right-1 bg-green-500 text-white rounded-full p-1">
                          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                            <path
                              fillRule="evenodd"
                              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </div>
                      )}
                    </div>
                    <h3 className="font-semibold text-lg">{displayTestimonial.name}</h3>
                    <p className="text-gray-600 text-sm">
                      {displayTestimonial.age && `Age ${displayTestimonial.age} • `}{displayTestimonial.location}
                    </p>
                    <div className="flex justify-center md:justify-start mt-2">
                      {[1, 2, 3, 4, 5].map((i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${
                            i <= displayTestimonial.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                          }`}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Testimonial Content */}
                  <div className="md:col-span-2">
                    <Quote className="w-8 h-8 text-rose-300 mb-4" />
                    <h4 className="text-xl font-semibold mb-3 text-gray-900">{displayTestimonial.title}</h4>
                    <p className="text-gray-700 leading-relaxed mb-6 text-lg">{displayTestimonial.content}</p>

                    {/* Before/After */}
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-red-50 p-4 rounded-lg border border-red-100">
                        <h5 className="font-semibold text-red-700 text-sm mb-1">Before Period Calm</h5>
                        <p className="text-red-600 text-sm">{displayTestimonial.beforeAfter.before}</p>
                      </div>
                      <div className="bg-green-50 p-4 rounded-lg border border-green-100">
                        <h5 className="font-semibold text-green-700 text-sm mb-1">After Period Calm</h5>
                        <p className="text-green-600 text-sm">{displayTestimonial.beforeAfter.after}</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Navigation */}
        {displayTestimonials.length > 1 && (
          <div className="flex items-center justify-center space-x-4 mb-12">
            <Button variant="outline" size="sm" onClick={prevTestimonial} className="rounded-full bg-transparent">
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <div className="flex space-x-2">
              {displayTestimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    index === currentIndex ? "bg-rose-500 scale-125" : "bg-gray-300 hover:bg-gray-400"
                  }`}
                />
              ))}
            </div>
            <Button variant="outline" size="sm" onClick={nextTestimonial} className="rounded-full bg-transparent">
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        )}

        {/* Stats */}
        <div
          className={`grid grid-cols-2 md:grid-cols-4 gap-8 text-center transition-all duration-1000 delay-400 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
        >
          <div>
            <div className="text-3xl font-bold text-rose-600">
                              <AnimatedCounter value={4.9} suffix="★" />
            </div>
            <div className="text-gray-600 text-sm">Average Rating</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-orange-600">
                              <AnimatedCounter value={7} />
            </div>
            <div className="text-gray-600 text-sm">Reviews</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-pink-600">
                              <AnimatedCounter value={500} suffix="+" />
            </div>
            <div className="text-gray-600 text-sm">Happy Users</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-green-600">
              <AnimatedCounter value={83} suffix="%" />
            </div>
            <div className="text-gray-600 text-sm">Recommend Us</div>
          </div>
        </div>
      </div>
    </section>
  )
}
