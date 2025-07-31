"use client"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Heart, Zap, Smile, Droplets } from "lucide-react"

export function BenefitsSection() {
  const [hoveredCard, setHoveredCard] = useState<number | null>(null)
  const [isVisible, setIsVisible] = useState(false)
  const [animatedPercentages, setAnimatedPercentages] = useState([0, 0, 0, 0])
  const sectionRef = useRef<HTMLElement>(null)

  const benefits = [
    {
      icon: Heart,
      title: "Cramp Relief",
      percentage: 92,
      description: "Significant reduction in menstrual pain and cramping",
      detail:
        "Our magnesium blend and ginger extract work synergistically to relax uterine muscles and reduce inflammatory responses.",
      color: "rose",
    },
    {
      icon: Smile,
      title: "Mood Harmony",
      percentage: 89,
      description: "Improved emotional balance and mood stability",
      detail: "L-Theanine and GABA promote calm while supporting serotonin pathways for emotional well-being.",
      color: "orange",
    },
    {
      icon: Zap,
      title: "Energy Boost",
      percentage: 85,
      description: "Sustained energy without crashes",
      detail: "Natural caffeine with Rhodiola Rosea provides gentle alertness while combating period fatigue.",
      color: "pink",
    },
    {
      icon: Droplets,
      title: "Bloat Relief",
      percentage: 87,
      description: "Reduced bloating and water retention",
      detail: "Peppermint extract and electrolyte balance help reduce uncomfortable bloating and digestive issues.",
      color: "purple",
    },
  ]

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          // Animate percentages
          benefits.forEach((benefit, index) => {
            setTimeout(() => {
              let current = 0
              const increment = benefit.percentage / 50
              const timer = setInterval(() => {
                current += increment
                if (current >= benefit.percentage) {
                  current = benefit.percentage
                  clearInterval(timer)
                }
                setAnimatedPercentages((prev) => {
                  const newPercentages = [...prev]
                  newPercentages[index] = Math.round(current)
                  return newPercentages
                })
              }, 20)
            }, index * 200)
          })
        }
      },
      { threshold: 0.3 },
    )

    if (sectionRef.current) {
      observer.observe(sectionRef.current)
    }

    return () => observer.disconnect()
  }, [])

  const getColorClasses = (color: string) => {
    const colors = {
      rose: {
        bg: "bg-rose-50",
        border: "border-rose-200",
        icon: "text-rose-500",
        progress: "bg-rose-500",
        text: "text-rose-600",
        glow: "shadow-rose-200/50",
      },
      orange: {
        bg: "bg-orange-50",
        border: "border-orange-200",
        icon: "text-orange-500",
        progress: "bg-orange-500",
        text: "text-orange-600",
        glow: "shadow-orange-200/50",
      },
      pink: {
        bg: "bg-pink-50",
        border: "border-pink-200",
        icon: "text-pink-500",
        progress: "bg-pink-500",
        text: "text-pink-600",
        glow: "shadow-pink-200/50",
      },
      purple: {
        bg: "bg-purple-50",
        border: "border-purple-200",
        icon: "text-purple-500",
        progress: "bg-purple-500",
        text: "text-purple-600",
        glow: "shadow-purple-200/50",
      },
    }
    return colors[color as keyof typeof colors]
  }

  return (
    <section ref={sectionRef} className="py-20 bg-white" id="benefits">
      <div className="container mx-auto px-4">
        <div
          className={`text-center mb-16 transition-all duration-1000 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
        >
          <h2 className="text-3xl md:text-5xl font-light mb-4">
            User & Gynecologist
            <span className="block font-semibold bg-gradient-to-r from-rose-600 to-orange-600 bg-clip-text text-transparent animate-gradient-shift">
              Tested Results
            </span>
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Our natural formula delivers measurable relief validated by real women and medical professionals
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {benefits.map((benefit, index) => {
            const Icon = benefit.icon
            const colors = getColorClasses(benefit.color)

            return (
              <Card
                key={index}
                className={`relative overflow-hidden transition-all duration-500 cursor-pointer transform ${
                  isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
                } ${
                  hoveredCard === index
                    ? `${colors.bg} ${colors.border} shadow-xl scale-105 ${colors.glow}`
                    : "hover:shadow-lg border-gray-200 hover:scale-102"
                }`}
                style={{ transitionDelay: `${index * 100}ms` }}
                onMouseEnter={() => setHoveredCard(index)}
                onMouseLeave={() => setHoveredCard(null)}
              >
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Icon
                        className={`w-8 h-8 ${colors.icon} transition-all duration-300 ${hoveredCard === index ? "scale-110 rotate-12" : ""}`}
                      />
                      <div className={`text-2xl font-bold ${colors.text} transition-all duration-300`}>
                        {animatedPercentages[index]}%
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold mb-2">{benefit.title}</h3>
                      <p className="text-sm text-gray-600 mb-4">{benefit.description}</p>
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Effectiveness</span>
                        <span className={colors.text}>{animatedPercentages[index]}%</span>
                      </div>
                      <Progress value={animatedPercentages[index]} className="h-2" />
                    </div>

                    <div
                      className={`transition-all duration-300 ${
                        hoveredCard === index
                          ? "max-h-20 opacity-100 transform translate-y-0"
                          : "max-h-0 opacity-0 transform -translate-y-2"
                      } overflow-hidden`}
                    >
                      <div className="mt-4 p-3 bg-white/80 rounded-lg border border-gray-100">
                        <p className="text-xs text-gray-600">{benefit.detail}</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        <div
          className={`text-center mt-12 transition-all duration-1000 delay-500 ${isVisible ? "opacity-100" : "opacity-0"}`}
        >
          <p className="text-sm text-gray-500">
            *Results based on user testing with 500+ participants and gynecologist validation over 3 months
          </p>
        </div>
      </div>
    </section>
  )
}

export default BenefitsSection
