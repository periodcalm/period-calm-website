"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BookOpen, Heart, Brain, Zap, ChevronRight, Play } from "lucide-react"

const educationalContent = {
  understanding: {
    title: "Understanding Your Cycle",
    icon: Brain,
    content: [
      {
        title: "Menstrual Phase (Days 1-5)",
        description: "The shedding of the uterine lining, often accompanied by cramps and discomfort.",
        tips: ["Stay hydrated", "Use heat therapy", "Gentle exercise like yoga"],
      },
      {
        title: "Follicular Phase (Days 1-13)",
        description: "Your body prepares for ovulation, energy levels typically increase.",
        tips: ["Focus on iron-rich foods", "Gradually increase exercise intensity", "Plan important tasks"],
      },
      {
        title: "Ovulation (Day 14)",
        description: "Peak fertility window, you might feel more energetic and confident.",
        tips: ["Track your cycle", "Maintain consistent sleep", "Stay active"],
      },
      {
        title: "Luteal Phase (Days 15-28)",
        description: "Progesterone rises, you might experience PMS symptoms.",
        tips: ["Reduce caffeine", "Practice stress management", "Prepare for next cycle"],
      },
    ],
  },
  nutrition: {
    title: "Nutrition for Period Health",
    icon: Heart,
    content: [
      {
        title: "Iron-Rich Foods",
        description: "Combat fatigue and replenish iron lost during menstruation.",
        tips: ["Spinach and leafy greens", "Lean red meat and poultry", "Lentils and beans"],
      },
      {
        title: "Magnesium Sources",
        description: "Natural muscle relaxant that helps reduce cramps and tension.",
        tips: ["Dark chocolate (70%+ cacao)", "Nuts and seeds", "Whole grains"],
      },
      {
        title: "Anti-inflammatory Foods",
        description: "Reduce inflammation and ease period pain naturally.",
        tips: ["Fatty fish (salmon, mackerel)", "Turmeric and ginger", "Berries and cherries"],
      },
      {
        title: "Hydration & Herbs",
        description: "Support your body's natural healing processes.",
        tips: ["Drink 8-10 glasses of water daily", "Chamomile tea for relaxation", "Peppermint for digestion"],
      },
    ],
  },
  wellness: {
    title: "Holistic Wellness Tips",
    icon: Zap,
    content: [
      {
        title: "Movement & Exercise",
        description: "Gentle movement can significantly reduce period pain and improve mood.",
        tips: ["Light yoga or stretching", "Walking or swimming", "Avoid high-intensity workouts"],
      },
      {
        title: "Stress Management",
        description: "Chronic stress can worsen period symptoms and disrupt your cycle.",
        tips: ["Practice deep breathing", "Try meditation or mindfulness", "Maintain regular sleep schedule"],
      },
      {
        title: "Heat Therapy",
        description: "Natural pain relief that relaxes muscles and improves blood flow.",
        tips: ["Use heating pad on lower abdomen", "Take warm baths", "Try heat patches for on-the-go relief"],
      },
      {
        title: "Sleep & Recovery",
        description: "Quality sleep is crucial for hormone regulation and pain management.",
        tips: ["Aim for 7-9 hours nightly", "Create a relaxing bedtime routine", "Keep bedroom cool and dark"],
      },
    ],
  },
}

export default function EducationalSection() {
  const [activeTab, setActiveTab] = useState("understanding")

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16">
          <Badge className="mb-4 bg-blue-100 text-blue-700 hover:bg-blue-100">
            <BookOpen className="w-4 h-4 mr-2" />
            Educational Hub
          </Badge>
          <h2 className="text-3xl md:text-5xl font-light mb-4">
            Empower Your
            <span className="block font-semibold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Period Journey
            </span>
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Knowledge is power. Learn about your cycle, nutrition, and wellness practices to take control of your period
            health.
          </p>
        </div>

        {/* Educational Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="max-w-6xl mx-auto">
          <TabsList className="grid w-full grid-cols-3 mb-12 bg-gray-100 p-1 rounded-xl">
            {Object.entries(educationalContent).map(([key, section]) => {
              const Icon = section.icon
              return (
                <TabsTrigger
                  key={key}
                  value={key}
                  className="flex items-center space-x-2 rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm py-3"
                >
                  <Icon className="w-5 h-5" />
                  <span className="hidden sm:inline">{section.title}</span>
                </TabsTrigger>
              )
            })}
          </TabsList>

          {Object.entries(educationalContent).map(([key, section]) => (
            <TabsContent key={key} value={key} className="space-y-8">
              <div className="text-center mb-8">
                <section.icon className="w-12 h-12 mx-auto mb-4 text-blue-600" />
                <h3 className="text-2xl font-semibold text-gray-900">{section.title}</h3>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                {section.content.map((item, index) => (
                  <Card key={index} className="hover:shadow-lg transition-shadow duration-300">
                    <CardContent className="p-6">
                      <h4 className="text-lg font-semibold mb-3 text-gray-900">{item.title}</h4>
                      <p className="text-gray-600 mb-4 leading-relaxed">{item.description}</p>
                      <div className="space-y-2">
                        <h5 className="font-medium text-sm text-gray-800">Key Tips:</h5>
                        <ul className="space-y-1">
                          {item.tips.map((tip, tipIndex) => (
                            <li key={tipIndex} className="flex items-start space-x-2 text-sm text-gray-600">
                              <ChevronRight className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
                              <span>{tip}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          ))}
        </Tabs>

        {/* Call to Action */}
        <div className="text-center mt-16">
          <Card className="max-w-2xl mx-auto bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
            <CardContent className="p-8">
              <h3 className="text-2xl font-semibold mb-4 text-gray-900">Want to Learn More?</h3>
              <p className="text-gray-600 mb-6">
                Join our educational webinars and get personalized tips from period health experts.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                  <Play className="w-4 h-4 mr-2" />
                  Watch Free Webinar
                </Button>
                <Button variant="outline" className="border-blue-300 text-blue-600 hover:bg-blue-50 bg-transparent">
                  Download Period Guide
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}
