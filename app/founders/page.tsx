"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Header from "@/components/Header"
import Footer from "@/components/Footer"
import {
  Heart,
  Lightbulb,
  Users,
  Award,
  Quote,
  ArrowRight,
  Mail,
  Linkedin,
  Twitter,
  Play,
  Star,
  Calendar,
  MapPin,
  BookOpen,
  TrendingUp,
} from "lucide-react"
import Image from "next/image"

export default function FoundersPage() {
  const [currentTestimonial, setCurrentTestimonial] = useState(0)

  const milestones = [
    {
      year: "2024",
      title: "The Night That Changed Everything",
      description:
        "CA Shreya Gupta, a successful chartered accountant, found herself helpless despite her professional success. Despite her achievements, she couldn't find relief from her own debilitating period pain.",
      icon: Heart,
      color: "rose",
      image: "/placeholder.svg?height=300&width=400&text=The+Night",
      details:
        "It was 2 AM in her home office. CA Shreya, who had helped hundreds of businesses succeed, was curled up on her desk chair, crying in pain. 'How can I help others build their dreams when I can't even get through my own monthly cycle?' she thought. That night, she made a promise to find a solution.",
    },
    {
      year: "2024-2025",
      title: "The Hidden Epidemic",
      description:
        "CA Shreya discovered that 80% of her female clients and colleagues suffered from period pain, but most treatments were either ineffective or had harmful side effects. She began documenting every case, every failed treatment.",
      icon: BookOpen,
      color: "orange",
      image: "/placeholder.svg?height=300&width=400&text=Research",
      details:
        "Client after client came to her with the same story: 'CA Shreya, I've tried everything. Painkillers make me sick, heating pads don't work, and I'm missing important work days.' CA Shreya realized this wasn't just a personal problem—it was a silent crisis affecting millions of working Indian women.",
    },
    {
      year: "2025",
      title: "The Breakthrough Moment",
      description:
        "After months of research, 100+ formula tests, and countless sleepless nights, CA Shreya discovered the perfect combination of 12 natural ingredients that worked in harmony with the Indian female body.",
      icon: Lightbulb,
      color: "pink",
      image: "/placeholder.svg?height=300&width=400&text=Breakthrough",
      details:
        "The moment of truth came when CA Shreya tested the final formula on herself during her own period. Within 18 minutes, her pain was gone. She cried tears of joy—not from pain, but from relief. 'This is it,' she whispered. 'This is what every working woman deserves.'",
    },
    {
      year: "2025-Present",
      title: "The Trial Phase Begins",
      description:
        "Period Calm is now in its trial phase, with early testers experiencing remarkable results. Women who had suffered for years are finding relief in minutes. CA Shreya's personal mission is becoming a reality.",
      icon: TrendingUp,
      color: "purple",
      image: "/placeholder.svg?height=300&width=400&text=Trial",
      details:
        "Today, CA Shreya receives messages daily from trial participants saying 'You gave me my career back.' From students who can now attend exams to working professionals who don't miss important meetings. The trial phase is proving that this isn't just pain relief—it's about dignity, confidence, and professional freedom.",
    },
  ]

  const testimonials = [
    {
      name: "CA Shreya Gupta",
      role: "Co-Founder & Chief Financial Officer",
      content:
        "I created Period Calm because I lived the pain. Every working woman deserves to pursue her dreams without the constant fear of her period. This isn't just medicine—it's freedom to succeed.",
      rating: 5,
      image: "/placeholder.svg?height=60&width=60&text=CA+SG",
    },
    {
      name: "Anita Desai",
      role: "First Trial Participant & Success Story",
      content:
        "CA Shreya understood my pain because she had felt it herself. When she told me 'I know exactly what you're going through,' I believed her. Period Calm changed everything for my career.",
      rating: 5,
      image: "/placeholder.svg?height=60&width=60&text=AD",
    },
    {
      name: "Meera Patel",
      role: "Trial Participant, Mumbai",
      content:
        "I was skeptical until I learned CA Shreya was a successful professional who suffered from the same pain. Her story gave me hope, and Period Calm gave me relief. I'm finally free to focus on my career.",
      rating: 5,
      image: "/placeholder.svg?height=60&width=60&text=MP",
    },
  ]

  const achievements = [
    { number: "500+", label: "Trial Participants", icon: Users },
    { number: "94%", label: "Success Rate", icon: TrendingUp },
    { number: "12", label: "States Researched", icon: MapPin },
    { number: "1+", label: "Years of R&D", icon: Calendar },
  ]

  const values = [
    {
      title: "Women-First Approach",
      description: "Every decision is made with Indian women's health and professional wellbeing as the top priority.",
      icon: Heart,
    },
    {
      title: "Professional Integrity",
      description: "All claims are backed by research and validated through user testing, maintaining the highest standards of professional ethics.",
      icon: Award,
    },
    {
      title: "Natural Solutions",
      description:
        "Committed to plant-based, natural ingredients that work in harmony with the Indian body and support professional lifestyles.",
      icon: Lightbulb,
    },
    {
      title: "Career Empowerment",
      description: "Building a supportive community where Indian women can pursue their professional dreams without period pain holding them back.",
      icon: Users,
    },
  ]

  const getColorClasses = (color: string) => {
    const colors = {
      rose: "bg-rose-100 text-rose-600 border-rose-200",
      orange: "bg-orange-100 text-orange-600 border-orange-200",
      pink: "bg-pink-100 text-pink-600 border-pink-200",
      purple: "bg-purple-100 text-purple-600 border-purple-200",
    }
    return colors[color as keyof typeof colors]
  }

  // Auto-rotate testimonials
  useState(() => {
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length)
    }, 5000)
    return () => clearInterval(interval)
  })

  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* Hero Section */}
      <section className="pt-24 pb-20 bg-gradient-to-br from-rose-50 via-orange-50 to-pink-50 relative overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-20 left-10 w-32 h-32 bg-rose-300 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-20 w-48 h-48 bg-orange-300 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>
        <div className="container mx-auto px-4 relative">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <Badge className="bg-rose-100 text-rose-700 px-6 py-2 text-lg">✨ Meet Our Co-Founder</Badge>
            <h1 className="text-4xl md:text-6xl font-light mb-6">
              The Story Behind
              <span className="block font-semibold bg-gradient-to-r from-rose-600 to-orange-600 bg-clip-text text-transparent">
                Period Calm
              </span>
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              How CA Shreya Gupta, a successful chartered accountant who suffered from debilitating period pain, created a solution that's
              transforming lives during our trial phase
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-rose-600 mb-2">500+</div>
                <div className="text-sm text-gray-600">Trial Participants</div>
              </div>
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-orange-600 mb-2">94%</div>
                <div className="text-sm text-gray-600">Success Rate</div>
              </div>
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-pink-600 mb-2">12</div>
                <div className="text-sm text-gray-600">States Researched</div>
              </div>
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-purple-600 mb-2">1+</div>
                <div className="text-sm text-gray-600">Years of R&D</div>
              </div>
            </div>
            <Button
              className="bg-gradient-to-r from-rose-500 to-orange-500 hover:from-rose-600 hover:to-orange-600 text-white px-8 py-6 text-lg rounded-full"
              onClick={() => document.getElementById("story")?.scrollIntoView({ behavior: "smooth" })}
            >
              <Play className="w-5 h-5 mr-2" />
              Watch CA Shreya's Story
            </Button>
          </div>
        </div>
      </section>

      {/* Founder Profile */}
      <section className="py-20 bg-white" id="story">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              {/* Founder Image */}
              <div className="relative">
                <div className="relative bg-gradient-to-br from-rose-100 to-orange-100 rounded-3xl p-8 shadow-2xl">
                  <Image
                    src="/placeholder.svg?height=500&width=400&text=CA+Shreya+Gupta"
                    alt="CA Shreya Gupta - Co-Founder of Period Calm"
                    width={400}
                    height={500}
                    className="rounded-2xl mx-auto"
                  />
                  {/* Floating Achievement Badges */}
                  <div className="absolute -top-4 -right-4 bg-white rounded-full p-4 shadow-lg border border-rose-100">
                    <Award className="w-8 h-8 text-rose-500" />
                  </div>
                  <div className="absolute -bottom-4 -left-4 bg-white rounded-full p-4 shadow-lg border border-orange-100">
                    <Heart className="w-8 h-8 text-orange-500" />
                  </div>
                </div>
              </div>

              {/* Founder Details */}
              <div className="space-y-8">
                <div>
                  <h2 className="text-3xl md:text-4xl font-light mb-4">
                    CA Shreya Gupta
                    <span className="block text-xl text-rose-600 font-medium">Co-Founder & Chief Financial Officer</span>
                  </h2>
                  <div className="flex flex-wrap gap-3 mb-6">
                    <Badge variant="outline" className="border-rose-300 text-rose-600">
                      Chartered Accountant
                    </Badge>
                    <Badge variant="outline" className="border-orange-300 text-orange-600">
                      Women's Health Advocate
                    </Badge>
                    <Badge variant="outline" className="border-pink-300 text-pink-600">
                      Period Pain Survivor
                    </Badge>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                    <Quote className="w-8 h-8 text-rose-500 mb-4" />
                    <p className="text-lg text-gray-700 italic leading-relaxed">
                      "I was a professional who couldn't heal myself. That night in my home office, curled up in pain, I realized that millions of working women were suffering silently. I made a promise to find a solution—not just for myself, but for every woman who deserves to live without fear of her period. Now, during our trial phase, I'm seeing that promise become reality."
                    </p>
                  </div>

                  {/* Achievement Grid */}
                  <div className="grid grid-cols-2 gap-4">
                    {achievements.map((achievement, index) => {
                      const Icon = achievement.icon
                      return (
                        <div
                          key={index}
                          className="text-center p-4 bg-white rounded-xl shadow-sm border border-gray-100"
                        >
                          <Icon className="w-6 h-6 text-rose-500 mx-auto mb-2" />
                          <div className="text-2xl font-bold text-rose-600">{achievement.number}</div>
                          <div className="text-sm text-gray-600">{achievement.label}</div>
                        </div>
                      )
                    })}
                  </div>

                  {/* Social Links */}
                  <div className="flex space-x-4">
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-rose-300 text-rose-600 hover:bg-rose-50 bg-transparent"
                    >
                      <Mail className="w-4 h-4 mr-2" />
                      Contact
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-blue-300 text-blue-600 hover:bg-blue-50 bg-transparent"
                    >
                      <Linkedin className="w-4 h-4 mr-2" />
                      LinkedIn
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-sky-300 text-sky-600 hover:bg-sky-50 bg-transparent"
                    >
                      <Twitter className="w-4 h-4 mr-2" />
                      Twitter
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Journey Timeline */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-rose-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-light mb-4">
              The Journey from
              <span className="block font-semibold bg-gradient-to-r from-rose-600 to-orange-600 bg-clip-text text-transparent">
                Pain to Purpose
              </span>
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Every great mission starts with a moment of truth. Here's how personal pain became a purpose that's
              transforming lives.
            </p>
          </div>

          <div className="max-w-6xl mx-auto">
            <div className="space-y-16">
              {milestones.map((milestone, index) => {
                const Icon = milestone.icon
                const isEven = index % 2 === 0
                return (
                  <div
                    key={index}
                    className={`flex flex-col lg:flex-row items-center gap-12 ${!isEven ? "lg:flex-row-reverse" : ""}`}
                  >
                    {/* Content */}
                    <div className="flex-1 space-y-6">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-white rounded-full border-4 border-rose-300 flex items-center justify-center shadow-lg">
                          <Icon className="w-6 h-6 text-rose-500" />
                        </div>
                        <Badge className={getColorClasses(milestone.color)}>{milestone.year}</Badge>
                      </div>

                      <div>
                        <h3 className="text-2xl font-semibold mb-4">{milestone.title}</h3>
                        <p className="text-gray-600 text-lg leading-relaxed mb-4">{milestone.description}</p>
                        <p className="text-gray-500 italic">{milestone.details}</p>
                      </div>
                    </div>

                    {/* Image */}
                    <div className="flex-1">
                      <div className="relative">
                        <Image
                          src={milestone.image || "/placeholder.svg"}
                          alt={milestone.title}
                          width={500}
                          height={300}
                          className="rounded-2xl shadow-xl"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-2xl"></div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-light mb-4">
              What People Say About
              <span className="block font-semibold bg-gradient-to-r from-rose-600 to-orange-600 bg-clip-text text-transparent">
                CA Shreya's Mission
              </span>
            </h2>
          </div>

          <div className="max-w-4xl mx-auto">
            <Card className="shadow-2xl border-0 bg-gradient-to-br from-rose-50 to-orange-50">
              <CardContent className="p-12">
                <div className="text-center space-y-6">
                  <div className="flex justify-center space-x-1 mb-4">
                    {[...Array(testimonials[currentTestimonial].rating)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>

                  <Quote className="w-12 h-12 text-rose-300 mx-auto" />

                  <p className="text-xl text-gray-700 leading-relaxed italic">
                    "{testimonials[currentTestimonial].content}"
                  </p>

                  <div className="flex items-center justify-center space-x-4">
                    <Image
                      src={testimonials[currentTestimonial].image || "/placeholder.svg"}
                      alt={testimonials[currentTestimonial].name}
                      width={60}
                      height={60}
                      className="rounded-full"
                    />
                    <div className="text-left">
                      <div className="font-semibold text-gray-900">{testimonials[currentTestimonial].name}</div>
                      <div className="text-gray-600">{testimonials[currentTestimonial].role}</div>
                    </div>
                  </div>

                  {/* Testimonial Indicators */}
                  <div className="flex justify-center space-x-2 mt-8">
                    {testimonials.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentTestimonial(index)}
                        className={`w-3 h-3 rounded-full transition-all duration-300 ${
                          index === currentTestimonial ? "bg-rose-500" : "bg-gray-300"
                        }`}
                      />
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-rose-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-light mb-4">
              Our Core
              <span className="block font-semibold bg-gradient-to-r from-rose-600 to-orange-600 bg-clip-text text-transparent">
                Values
              </span>
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              The principles that guide everything we do at Period Calm
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
            {values.map((value, index) => {
              const Icon = value.icon
              return (
                <Card
                  key={index}
                  className="text-center shadow-lg border-0 hover:shadow-xl transition-all duration-300 group"
                >
                  <CardContent className="p-8">
                    <div className="space-y-4">
                      <div className="mx-auto w-16 h-16 bg-rose-100 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                        <Icon className="w-8 h-8 text-rose-500" />
                      </div>
                      <h3 className="text-xl font-semibold">{value.title}</h3>
                      <p className="text-gray-600 text-sm leading-relaxed">{value.description}</p>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      </section>

      {/* Video Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-5xl font-light mb-8">
              Hear CA Shreya's Story
              <span className="block font-semibold bg-gradient-to-r from-rose-600 to-orange-600 bg-clip-text text-transparent">
                In Her Own Words
              </span>
            </h2>

            <div className="relative bg-gradient-to-br from-rose-100 to-orange-100 rounded-3xl p-8 shadow-2xl">
              <div className="aspect-video bg-gray-900 rounded-2xl flex items-center justify-center relative overflow-hidden">
                <Image
                  src="/placeholder.svg?height=400&width=600&text=Video+Thumbnail"
                  alt="CA Shreya's Story Video"
                  width={600}
                  height={400}
                  className="absolute inset-0 w-full h-full object-cover"
                />
                <Button size="lg" className="bg-white/90 text-rose-600 hover:bg-white rounded-full p-6 shadow-xl">
                  <Play className="w-8 h-8" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-rose-500 to-orange-500">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-3xl mx-auto space-y-8 text-white">
            <h2 className="text-3xl md:text-5xl font-light">Join CA Shreya's Mission</h2>
            <p className="text-xl opacity-90 leading-relaxed">
              Be part of the movement to transform women's health across India. Join our trial phase and experience the Period Calm difference
              firsthand.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                className="bg-white text-rose-600 hover:bg-gray-100 px-8 py-6 text-lg rounded-full"
              >
                Join Trial Phase
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="border-white text-white hover:bg-white/10 px-8 py-6 text-lg rounded-full bg-transparent"
              >
                Contact CA Shreya
              </Button>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
