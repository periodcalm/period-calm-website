"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Calendar,
  BarChart3,
  Target,
  Bell,
  Settings,
  BookOpen,
  Users,
  Shield,
  TrendingUp,
  Heart,
  Activity,
} from "lucide-react"
import CalendarView from "./CalendarView"
import InsightsView from "./InsightsView"
import PredictionsView from "./PredictionsView"
import RemindersView from "./RemindersView"
import EducationView from "./EducationView"
import CommunityView from "./CommunityView"
import SettingsView from "./SettingsView"
import DataVisualization from "./DataVisualization"
import { useCycleData } from "./hooks/useCycleData"
import { useNotifications } from "./hooks/useNotifications"

export default function CycleTrackerApp() {
  const [activeTab, setActiveTab] = useState("calendar")
  const [isOnboarding, setIsOnboarding] = useState(false)
  const { cycleData, updateCycleData, predictions, insights } = useCycleData()
  const { notifications, scheduleNotification } = useNotifications()

  // Check if user needs onboarding
  useEffect(() => {
    const hasData = Object.keys(cycleData).length > 0
    const hasCompletedOnboarding = localStorage.getItem("cycle-tracker-onboarded")

    if (!hasData && !hasCompletedOnboarding) {
      setIsOnboarding(true)
    }
  }, [cycleData])

  const tabConfig = [
    {
      id: "calendar",
      label: "Calendar",
      icon: Calendar,
      component: CalendarView,
      color: "purple",
    },
    {
      id: "insights",
      label: "Insights",
      icon: BarChart3,
      component: InsightsView,
      color: "blue",
    },
    {
      id: "predictions",
      label: "Predictions",
      icon: Target,
      component: PredictionsView,
      color: "green",
    },
    {
      id: "charts",
      label: "Charts",
      icon: TrendingUp,
      component: DataVisualization,
      color: "orange",
    },
    {
      id: "reminders",
      label: "Reminders",
      icon: Bell,
      component: RemindersView,
      color: "yellow",
    },
    {
      id: "education",
      label: "Learn",
      icon: BookOpen,
      component: EducationView,
      color: "pink",
    },
    {
      id: "community",
      label: "Community",
      icon: Users,
      component: CommunityView,
      color: "indigo",
    },
    {
      id: "settings",
      label: "Settings",
      icon: Settings,
      component: SettingsView,
      color: "gray",
    },
  ]

  if (isOnboarding) {
    return (
      <OnboardingFlow
        onComplete={() => {
          setIsOnboarding(false)
          localStorage.setItem("cycle-tracker-onboarded", "true")
        }}
      />
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-rose-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4">
            <span className="gradient-text">Period Calm</span> Cycle Tracker
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Your comprehensive menstrual health companion with AI-powered insights and personalized predictions
          </p>
        </div>

        {/* Quick Stats Dashboard */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white">
            <CardContent className="p-4 text-center">
              <Calendar className="w-8 h-8 mx-auto mb-2" />
              <div className="text-2xl font-bold">
                {predictions?.nextPeriod
                  ? Math.ceil((predictions.nextPeriod.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
                  : "—"}
              </div>
              <div className="text-sm opacity-90">Days to Period</div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white">
            <CardContent className="p-4 text-center">
              <Target className="w-8 h-8 mx-auto mb-2" />
              <div className="text-2xl font-bold">{predictions?.cycleLength || "—"}</div>
              <div className="text-sm opacity-90">Avg Cycle</div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-rose-500 to-rose-600 text-white">
            <CardContent className="p-4 text-center">
              <Heart className="w-8 h-8 mx-auto mb-2" />
              <div className="text-2xl font-bold">{insights?.totalEntries || 0}</div>
              <div className="text-sm opacity-90">Days Tracked</div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-orange-500 to-orange-600 text-white">
            <CardContent className="p-4 text-center">
              <Activity className="w-8 h-8 mx-auto mb-2" />
              <div className="text-2xl font-bold">{insights?.streakDays || 0}</div>
              <div className="text-sm opacity-90">Day Streak</div>
            </CardContent>
          </Card>
        </div>

        {/* Main Tracker Interface */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-4 md:grid-cols-8 w-full mb-8 bg-white/80 backdrop-blur-sm">
            {tabConfig.map((tab) => {
              const Icon = tab.icon
              return (
                <TabsTrigger
                  key={tab.id}
                  value={tab.id}
                  className="flex flex-col items-center gap-1 p-3 data-[state=active]:bg-white data-[state=active]:shadow-sm"
                >
                  <Icon className="w-4 h-4" />
                  <span className="text-xs hidden sm:block">{tab.label}</span>
                </TabsTrigger>
              )
            })}
          </TabsList>

          {tabConfig.map((tab) => {
            const Component = tab.component
            return (
              <TabsContent key={tab.id} value={tab.id} className="mt-0">
                <Component
                  cycleData={cycleData}
                  updateCycleData={updateCycleData}
                  predictions={predictions}
                  insights={insights}
                  notifications={notifications}
                  scheduleNotification={scheduleNotification}
                />
              </TabsContent>
            )
          })}
        </Tabs>
      </div>
    </div>
  )
}

// Onboarding Flow Component
function OnboardingFlow({ onComplete }: { onComplete: () => void }) {
  const [step, setStep] = useState(1)
  const [userData, setUserData] = useState({
    name: "",
    age: "",
    avgCycleLength: 28,
    avgPeriodLength: 5,
    lastPeriodDate: "",
    goals: [] as string[],
    notifications: true,
  })

  const steps = [
    {
      title: "Welcome to Period Calm Tracker",
      description: "Let's personalize your experience with a few quick questions",
      content: (
        <div className="text-center space-y-6">
          <div className="w-24 h-24 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto">
            <Heart className="w-12 h-12 text-white" />
          </div>
          <div>
            <h3 className="text-2xl font-bold mb-2">Your Journey Starts Here</h3>
            <p className="text-gray-600">
              Track your cycle, understand your body, and take control of your menstrual health
            </p>
          </div>
        </div>
      ),
    },
    {
      title: "Tell us about yourself",
      description: "This helps us provide personalized insights",
      content: (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">What should we call you?</label>
            <input
              type="text"
              value={userData.name}
              onChange={(e) => setUserData({ ...userData, name: e.target.value })}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholder="Your name"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Age (optional)</label>
            <input
              type="number"
              value={userData.age}
              onChange={(e) => setUserData({ ...userData, age: e.target.value })}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholder="Your age"
            />
          </div>
        </div>
      ),
    },
    {
      title: "Cycle Information",
      description: "Help us understand your typical cycle",
      content: (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Average cycle length</label>
            <div className="flex items-center gap-4">
              <input
                type="range"
                min="21"
                max="35"
                value={userData.avgCycleLength}
                onChange={(e) => setUserData({ ...userData, avgCycleLength: Number(e.target.value) })}
                className="flex-1"
              />
              <span className="font-medium">{userData.avgCycleLength} days</span>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Average period length</label>
            <div className="flex items-center gap-4">
              <input
                type="range"
                min="3"
                max="8"
                value={userData.avgPeriodLength}
                onChange={(e) => setUserData({ ...userData, avgPeriodLength: Number(e.target.value) })}
                className="flex-1"
              />
              <span className="font-medium">{userData.avgPeriodLength} days</span>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">When was your last period?</label>
            <input
              type="date"
              value={userData.lastPeriodDate}
              onChange={(e) => setUserData({ ...userData, lastPeriodDate: e.target.value })}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>
        </div>
      ),
    },
    {
      title: "Your Goals",
      description: "What would you like to achieve with tracking?",
      content: (
        <div className="space-y-3">
          {[
            "Track period patterns",
            "Manage PMS symptoms",
            "Understand fertility",
            "Monitor mood changes",
            "Plan activities around cycle",
            "Share data with healthcare provider",
          ].map((goal) => (
            <label key={goal} className="flex items-center gap-3 p-3 border rounded-lg hover:bg-gray-50 cursor-pointer">
              <input
                type="checkbox"
                checked={userData.goals.includes(goal)}
                onChange={(e) => {
                  if (e.target.checked) {
                    setUserData({ ...userData, goals: [...userData.goals, goal] })
                  } else {
                    setUserData({ ...userData, goals: userData.goals.filter((g) => g !== goal) })
                  }
                }}
                className="rounded"
              />
              <span>{goal}</span>
            </label>
          ))}
        </div>
      ),
    },
    {
      title: "Privacy & Notifications",
      description: "Control your data and stay informed",
      content: (
        <div className="space-y-6">
          <div className="p-4 bg-green-50 rounded-lg border border-green-200">
            <div className="flex items-center gap-3 mb-2">
              <Shield className="w-5 h-5 text-green-600" />
              <h4 className="font-semibold text-green-800">Your Data is Secure</h4>
            </div>
            <p className="text-sm text-green-700">
              All your data is encrypted and stored locally. You have full control over your privacy settings.
            </p>
          </div>

          <label className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={userData.notifications}
              onChange={(e) => setUserData({ ...userData, notifications: e.target.checked })}
              className="rounded"
            />
            <div>
              <div className="font-medium">Enable notifications</div>
              <div className="text-sm text-gray-600">Get reminders for periods, ovulation, and logging</div>
            </div>
          </label>
        </div>
      ),
    },
  ]

  const currentStep = steps[step - 1]

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-rose-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="flex gap-2">
              {steps.map((_, index) => (
                <div
                  key={index}
                  className={`w-3 h-3 rounded-full transition-colors ${
                    index + 1 <= step ? "bg-purple-500" : "bg-gray-200"
                  }`}
                />
              ))}
            </div>
          </div>
          <CardTitle className="text-2xl">{currentStep.title}</CardTitle>
          <p className="text-gray-600">{currentStep.description}</p>
        </CardHeader>

        <CardContent className="space-y-6">
          {currentStep.content}

          <div className="flex gap-4 pt-6">
            {step > 1 && (
              <Button variant="outline" onClick={() => setStep(step - 1)} className="flex-1">
                Previous
              </Button>
            )}

            <Button
              onClick={() => {
                if (step < steps.length) {
                  setStep(step + 1)
                } else {
                  // Save user data and complete onboarding
                  localStorage.setItem("cycle-tracker-user-data", JSON.stringify(userData))
                  onComplete()
                }
              }}
              className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
            >
              {step < steps.length ? "Next" : "Get Started"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
