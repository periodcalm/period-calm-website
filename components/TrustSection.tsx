"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Shield, Award, Leaf, Users, Heart, Star } from "lucide-react"

const trustIndicators = [
  {
    icon: Leaf,
    title: "100% Natural",
    description: "Plant-based ingredients with no artificial additives or chemicals",
    color: "green",
  },
  {
    icon: Users,
    title: "Community-Validated",
    description: "Real feedback from trial participants across India",
    color: "blue",
  },
  {
    icon: Shield,
    title: "Quality-First",
    description: "Committed to safety and effectiveness in every batch",
    color: "purple",
  },
  {
    icon: Heart,
    title: "Transparent Development",
    description: "Building trust through honesty and user feedback",
    color: "orange",
  },
]

const certifications = [
  { name: "Natural", logo: "/placeholder.svg?height=60&width=60&text=🌿" },
  { name: "Community", logo: "/placeholder.svg?height=60&width=60&text=👥" },
  { name: "Quality", logo: "/placeholder.svg?height=60&width=60&text=✨" },
  { name: "Transparent", logo: "/placeholder.svg?height=60&width=60&text=💝" },
]

const doctorEndorsements = [
  {
    name: "Dr. Priya Menon",
    title: "Gynecologist, Apollo Hospital",
    quote: "I recommend Period Calm to my patients as a safe, natural alternative for menstrual pain management.",
    image: "/placeholder.svg?height=80&width=80&text=PM",
  },
  {
    name: "Dr. Anjali Sharma",
    title: "Women's Health Specialist",
    quote:
      "The natural ingredients in Period Calm provide effective relief without the side effects of traditional painkillers.",
    image: "/placeholder.svg?height=80&width=80&text=AS",
  },
]

export default function TrustSection() {
  
  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16">
          <Badge className="mb-4 bg-green-100 text-green-700 hover:bg-green-100">
            <Shield className="w-4 h-4 mr-2" />
            Trust & Safety
          </Badge>
          <h2 className="text-3xl md:text-5xl font-light mb-4">
            Why Women
            <span className="block font-semibold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
              Trust Period Calm
            </span>
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Your health and safety are our top priorities. Here's why Period Calm is the trusted choice for natural
            period relief.
          </p>
        </div>

        {/* Trust Indicators */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {trustIndicators.map((indicator, index) => {
            const Icon = indicator.icon
            const colorClasses = {
              blue: "bg-blue-50 border-blue-200 text-blue-700",
              purple: "bg-purple-50 border-purple-200 text-purple-700",
              green: "bg-green-50 border-green-200 text-green-700",
              orange: "bg-orange-50 border-orange-200 text-orange-700",
            }

            return (
              <Card
                key={index}
                className={`border-2 hover:shadow-lg transition-all duration-300 ${colorClasses[indicator.color as keyof typeof colorClasses]}`}
              >
                <CardContent className="p-6 text-center">
                  <Icon className="w-12 h-12 mx-auto mb-4" />
                  <h3 className="font-semibold text-lg mb-2">{indicator.title}</h3>
                  <p className="text-sm opacity-80">{indicator.description}</p>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Trust Pillars */}
        <div className="text-center mb-16">
          <h3 className="text-2xl font-semibold mb-8 text-gray-900">Our Trust Pillars</h3>
          <div className="flex justify-center items-center space-x-8 flex-wrap gap-4">
            {certifications.map((cert, index) => (
              <div key={index} className="bg-gray-50 p-4 rounded-lg border hover:shadow-md transition-shadow">
                <div className="w-16 h-16 mx-auto text-3xl flex items-center justify-center">
                  {cert.logo.includes('text=') ? cert.logo.split('text=')[1] : cert.name}
                </div>
                <div className="text-sm font-medium mt-2 text-gray-700">{cert.name}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Community Feedback */}
        <div className="mb-16">
          <h3 className="text-2xl font-semibold text-center mb-8 text-gray-900">
            What Our Trial Community Says
          </h3>
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {doctorEndorsements.map((doctor, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start space-x-4">
                    <img
                      src={doctor.image || "/placeholder.svg"}
                      alt={doctor.name}
                      className="w-16 h-16 rounded-full object-cover border-2 border-gray-200"
                    />
                    <div className="flex-1">
                      <div className="flex items-center mb-2">
                        {[1, 2, 3, 4, 5].map((i) => (
                          <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        ))}
                      </div>
                      <p className="text-gray-700 italic mb-3">"{doctor.quote}"</p>
                      <div>
                        <h4 className="font-semibold text-gray-900">{doctor.name}</h4>
                        <p className="text-sm text-gray-600">{doctor.title}</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Safety Promise */}
        <Card className="bg-gradient-to-r from-green-50 to-blue-50 border-green-200 max-w-4xl mx-auto">
          <CardContent className="p-8 text-center">
            <Heart className="w-12 h-12 text-green-600 mx-auto mb-4" />
            <h3 className="text-2xl font-semibold mb-4 text-gray-900">Our Safety Promise</h3>
            <p className="text-gray-700 leading-relaxed mb-6">
              We're committed to transparency and quality in our development journey. Every ingredient is carefully selected 
              based on scientific research, and we're building trust through honest communication and real user feedback 
              from our trial community.
            </p>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div className="bg-white p-3 rounded-lg">
                <div className="font-semibold text-green-600">Natural Ingredients</div>
                <div className="text-gray-600">Plant-Based & Safe</div>
              </div>
              <div className="bg-white p-3 rounded-lg">
                <div className="font-semibold text-blue-600">Research-Backed</div>
                <div className="text-gray-600">Science-Based</div>
              </div>
              <div className="bg-white p-3 rounded-lg">
                <div className="font-semibold text-purple-600">Community Feedback</div>
                <div className="text-gray-600">Real User Stories</div>
              </div>
              <div className="bg-white p-3 rounded-lg">
                <div className="font-semibold text-orange-600">Transparent Journey</div>
                <div className="text-gray-600">Honest Development</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  )
}
