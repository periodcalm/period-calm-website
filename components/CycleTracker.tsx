"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Calendar,
  TrendingUp,
  Heart,
  Droplets,
  Zap,
  Brain,
  Bell,
  Plus,
  ChevronLeft,
  ChevronRight,
  Sun,
  Activity,
  Target,
  AlertCircle,
  CheckCircle,
  BarChart3,
  PieChart,
  Thermometer,
  Scale,
  Dumbbell,
  Bed,
  Moon,
} from "lucide-react"
import { format, addDays, subDays, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay } from "date-fns"

interface CycleData {
  date: string
  isPeriod: boolean
  flow: "light" | "medium" | "heavy" | null
  symptoms: string[]
  mood: "great" | "good" | "okay" | "bad" | "terrible" | null
  notes: string
  temperature: number | null
  weight: number | null
  sleep: number | null
  exercise: boolean
  water: number
}

interface PredictionData {
  nextPeriod: Date
  ovulation: Date
  fertileWindow: { start: Date; end: Date }
  cycleLength: number
  periodLength: number
  pmsStart: Date
}

const cyclePhases = [
  {
    name: "Menstrual",
    days: "1-5",
    color: "bg-red-500",
    description: "Period days - focus on rest and comfort",
    tips: ["Use Period Calm for cramp relief", "Stay hydrated", "Gentle movement"],
  },
  {
    name: "Follicular",
    days: "6-13",
    color: "bg-green-500",
    description: "Energy building - great time for new projects",
    tips: ["Increase protein intake", "Plan important meetings", "Try new workouts"],
  },
  {
    name: "Ovulation",
    days: "14",
    color: "bg-yellow-500",
    description: "Peak energy and confidence",
    tips: ["Social activities", "Creative projects", "High-intensity exercise"],
  },
  {
    name: "Luteal",
    days: "15-28",
    color: "bg-purple-500",
    description: "Winding down - prepare for next cycle",
    tips: ["Self-care focus", "Reduce caffeine", "Stock up on Period Calm"],
  },
]

export default function CycleTracker() {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [cycleData, setCycleData] = useState<Record<string, CycleData>>({})
  const [showAddEntry, setShowAddEntry] = useState(false)
  const [predictions, setPredictions] = useState<PredictionData | null>(null)
  const [activeTab, setActiveTab] = useState("calendar")
  const [reminders, setReminders] = useState<string[]>([])
  const [currentDay, setCurrentDay] = useState(1)
  const [selectedPhase, setSelectedPhase] = useState(0)

  const symptoms = [
    { id: "cramps", label: "Cramps", icon: Heart, color: "rose" },
    { id: "bloating", label: "Bloating", icon: Droplets, color: "blue" },
    { id: "fatigue", label: "Fatigue", icon: Moon, color: "purple" },
    { id: "headache", label: "Headache", icon: Brain, color: "yellow" },
    { id: "acne", label: "Acne", icon: Sun, color: "orange" },
    { id: "breast_tenderness", label: "Breast Tenderness", icon: Heart, color: "pink" },
    { id: "mood_swings", label: "Mood Swings", icon: Brain, color: "indigo" },
    { id: "back_pain", label: "Back Pain", icon: Activity, color: "red" },
  ]

  const moods = [
    { value: "great", label: "Great", emoji: "😊", color: "green" },
    { value: "good", label: "Good", emoji: "🙂", color: "lime" },
    { value: "okay", label: "Okay", emoji: "😐", color: "yellow" },
    { value: "bad", label: "Bad", emoji: "😞", color: "orange" },
    { value: "terrible", label: "Terrible", emoji: "😢", color: "red" },
  ]

  const flows = [
    { value: "light", label: "Light", color: "pink" },
    { value: "medium", label: "Medium", color: "rose" },
    { value: "heavy", label: "Heavy", color: "red" },
  ]

  // Generate calendar days
  const monthStart = startOfMonth(currentDate)
  const monthEnd = endOfMonth(currentDate)
  const calendarDays = eachDayOfInterval({ start: monthStart, end: monthEnd })

  // Calculate predictions based on cycle data
  useEffect(() => {
    const periodDates = Object.entries(cycleData)
      .filter(([_, data]) => data.isPeriod)
      .map(([date, _]) => new Date(date))
      .sort((a, b) => a.getTime() - b.getTime())

    if (periodDates.length >= 2) {
      const cycles = []
      for (let i = 1; i < periodDates.length; i++) {
        const cycleLength = Math.round(
          (periodDates[i].getTime() - periodDates[i - 1].getTime()) / (1000 * 60 * 60 * 24),
        )
        cycles.push(cycleLength)
      }

      const avgCycleLength = Math.round(cycles.reduce((a, b) => a + b, 0) / cycles.length)
      const lastPeriod = periodDates[periodDates.length - 1]
      const nextPeriod = addDays(lastPeriod, avgCycleLength)
      const ovulation = addDays(nextPeriod, -14)
      const fertileStart = subDays(ovulation, 5)
      const fertileEnd = addDays(ovulation, 1)
      const pmsStart = subDays(nextPeriod, 7)

      setPredictions({
        nextPeriod,
        ovulation,
        fertileWindow: { start: fertileStart, end: fertileEnd },
        cycleLength: avgCycleLength,
        periodLength: 5, // Default, could be calculated
        pmsStart,
      })
    }
  }, [cycleData])

  const getDayData = (date: Date) => {
    const dateKey = format(date, "yyyy-MM-dd")
    return cycleData[dateKey]
  }

  const getDayStatus = (date: Date) => {
    const data = getDayData(date)
    const today = new Date()

    if (data?.isPeriod) return "period"
    if (predictions) {
      if (isSameDay(date, predictions.ovulation)) return "ovulation"
      if (date >= predictions.fertileWindow.start && date <= predictions.fertileWindow.end) return "fertile"
      if (date >= predictions.pmsStart && date < predictions.nextPeriod) return "pms"
      if (isSameDay(date, predictions.nextPeriod)) return "predicted-period"
    }
    if (isSameDay(date, today)) return "today"
    return "normal"
  }

  const getDayColor = (status: string) => {
    const colors = {
      period: "bg-red-500 text-white",
      ovulation: "bg-green-500 text-white",
      fertile: "bg-green-200 text-green-800",
      pms: "bg-yellow-200 text-yellow-800",
      "predicted-period": "bg-red-200 text-red-800 border-2 border-red-400 border-dashed",
      today: "bg-blue-500 text-white ring-2 ring-blue-300",
      normal: "bg-gray-50 hover:bg-gray-100 text-gray-700",
    }
    return colors[status as keyof typeof colors] || colors.normal
  }

  const saveEntry = (entryData: Partial<CycleData>) => {
    const dateKey = format(selectedDate, "yyyy-MM-dd")
    setCycleData((prev) => ({
      ...prev,
      [dateKey]: {
        date: dateKey,
        isPeriod: false,
        flow: null,
        symptoms: [],
        mood: null,
        notes: "",
        temperature: null,
        weight: null,
        sleep: null,
        exercise: false,
        water: 0,
        ...prev[dateKey],
        ...entryData,
        date: dateKey, // Ensure date is set correctly after spread
      },
    }))
    setShowAddEntry(false)
  }

  const getInsights = () => {
    const entries = Object.values(cycleData)
    const periodEntries = entries.filter((e) => e.isPeriod)
    const symptomCounts = entries.reduce(
      (acc, entry) => {
        entry.symptoms.forEach((symptom) => {
          acc[symptom] = (acc[symptom] || 0) + 1
        })
        return acc
      },
      {} as Record<string, number>,
    )

    return {
      totalEntries: entries.length,
      periodDays: periodEntries.length,
      commonSymptoms: Object.entries(symptomCounts)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 3)
        .map(([symptom, count]) => ({ symptom, count })),
      avgMood:
        entries.filter((e) => e.mood).length > 0
          ? entries
              .filter((e) => e.mood)
              .reduce((acc, e) => {
                const moodValues = { terrible: 1, bad: 2, okay: 3, good: 4, great: 5 }
                return acc + (moodValues[e.mood as keyof typeof moodValues] || 3)
              }, 0) / entries.filter((e) => e.mood).length
          : 3,
    }
  }

  const insights = getInsights()

  const getCurrentPhase = (day: number) => {
    if (day >= 1 && day <= 5) return 0 // Menstrual
    if (day >= 6 && day <= 13) return 1 // Follicular
    if (day === 14) return 2 // Ovulation
    return 3 // Luteal
  }

  const currentPhase = getCurrentPhase(currentDay)

  return (
    <section className="py-20 bg-gradient-to-br from-purple-50 via-pink-50 to-rose-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <Badge className="mb-4 bg-purple-100 text-purple-700 hover:bg-purple-100">
            <Calendar className="w-4 h-4 mr-2" />
            Cycle Insights
          </Badge>
          <h2 className="text-3xl md:text-5xl font-light mb-4">
            Track Your
            <span className="block font-semibold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Cycle Journey
            </span>
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Understanding your cycle helps you prepare better and know exactly when you might need Period Calm
          </p>
        </div>

        <div className="max-w-7xl mx-auto">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-4 mb-8">
              <TabsTrigger value="calendar" className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                Calendar
              </TabsTrigger>
              <TabsTrigger value="insights" className="flex items-center gap-2">
                <BarChart3 className="w-4 h-4" />
                Insights
              </TabsTrigger>
              <TabsTrigger value="predictions" className="flex items-center gap-2">
                <Target className="w-4 h-4" />
                Predictions
              </TabsTrigger>
              <TabsTrigger value="reminders" className="flex items-center gap-2">
                <Bell className="w-4 h-4" />
                Reminders
              </TabsTrigger>
            </TabsList>

            {/* Calendar Tab */}
            <TabsContent value="calendar" className="space-y-6">
              <div className="grid lg:grid-cols-4 gap-6">
                {/* Calendar */}
                <div className="lg:col-span-3">
                  <Card>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="flex items-center gap-2">
                          <Calendar className="w-5 h-5 text-purple-500" />
                          {format(currentDate, "MMMM yyyy")}
                        </CardTitle>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm" onClick={() => setCurrentDate(subDays(currentDate, 30))}>
                            <ChevronLeft className="w-4 h-4" />
                          </Button>
                          <Button variant="outline" size="sm" onClick={() => setCurrentDate(addDays(currentDate, 30))}>
                            <ChevronRight className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      {/* Calendar Grid */}
                      <div className="grid grid-cols-7 gap-2 mb-4">
                        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                          <div key={day} className="text-center text-sm font-medium text-gray-500 p-2">
                            {day}
                          </div>
                        ))}
                      </div>

                      <div className="grid grid-cols-7 gap-2">
                        {calendarDays.map((day) => {
                          const status = getDayStatus(day)
                          const data = getDayData(day)

                          return (
                            <button
                              key={day.toISOString()}
                              onClick={() => {
                                setSelectedDate(day)
                                setShowAddEntry(true)
                              }}
                              className={`
                                relative w-12 h-12 rounded-lg text-sm font-medium transition-all duration-200
                                ${getDayColor(status)}
                                hover:scale-105 hover:shadow-md
                              `}
                            >
                              {format(day, "d")}
                              {data && (
                                <div className="absolute -bottom-1 -right-1 flex gap-0.5">
                                  {data.symptoms.length > 0 && (
                                    <div className="w-2 h-2 bg-orange-400 rounded-full"></div>
                                  )}
                                  {data.mood && <div className="w-2 h-2 bg-blue-400 rounded-full"></div>}
                                </div>
                              )}
                            </button>
                          )
                        })}
                      </div>

                      {/* Legend */}
                      <div className="flex flex-wrap gap-4 mt-6 text-sm">
                        <div className="flex items-center gap-2">
                          <div className="w-4 h-4 bg-red-500 rounded"></div>
                          <span>Period</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-4 h-4 bg-green-500 rounded"></div>
                          <span>Ovulation</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-4 h-4 bg-green-200 rounded"></div>
                          <span>Fertile Window</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-4 h-4 bg-yellow-200 rounded"></div>
                          <span>PMS</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-4 h-4 bg-red-200 border-2 border-red-400 border-dashed rounded"></div>
                          <span>Predicted Period</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Quick Stats */}
                <div className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Quick Stats</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-purple-600">{predictions?.cycleLength || "—"}</div>
                        <div className="text-sm text-gray-600">Avg Cycle Length</div>
                      </div>

                      <div className="text-center">
                        <div className="text-2xl font-bold text-rose-600">
                          {predictions ? format(predictions.nextPeriod, "MMM d") : "—"}
                        </div>
                        <div className="text-sm text-gray-600">Next Period</div>
                      </div>

                      <div className="text-center">
                        <div className="text-2xl font-bold text-green-600">
                          {predictions ? format(predictions.ovulation, "MMM d") : "—"}
                        </div>
                        <div className="text-sm text-gray-600">Ovulation</div>
                      </div>

                      <div className="text-center">
                        <div className="text-2xl font-bold text-orange-600">{insights.totalEntries}</div>
                        <div className="text-sm text-gray-600">Days Tracked</div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Today's Wellness</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <Button
                        onClick={() => {
                          setSelectedDate(new Date())
                          setShowAddEntry(true)
                        }}
                        className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        Log Today
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>

            {/* Insights Tab */}
            <TabsContent value="insights" className="space-y-6">
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card>
                  <CardContent className="p-6 text-center">
                    <PieChart className="w-8 h-8 text-purple-500 mx-auto mb-2" />
                    <div className="text-2xl font-bold">{insights.totalEntries}</div>
                    <div className="text-sm text-gray-600">Total Entries</div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6 text-center">
                    <Droplets className="w-8 h-8 text-red-500 mx-auto mb-2" />
                    <div className="text-2xl font-bold">{insights.periodDays}</div>
                    <div className="text-sm text-gray-600">Period Days</div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6 text-center">
                    <Heart className="w-8 h-8 text-pink-500 mx-auto mb-2" />
                    <div className="text-2xl font-bold">{insights.avgMood.toFixed(1)}/5</div>
                    <div className="text-sm text-gray-600">Avg Mood</div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6 text-center">
                    <TrendingUp className="w-8 h-8 text-green-500 mx-auto mb-2" />
                    <div className="text-2xl font-bold">{predictions?.cycleLength || "—"}</div>
                    <div className="text-sm text-gray-600">Cycle Length</div>
                  </CardContent>
                </Card>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Common Symptoms</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {insights.commonSymptoms.map(({ symptom, count }) => {
                        const symptomData = symptoms.find((s) => s.id === symptom)
                        const Icon = symptomData?.icon || Heart
                        return (
                          <div key={symptom} className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <Icon className="w-4 h-4 text-gray-500" />
                              <span className="capitalize">{symptom.replace("_", " ")}</span>
                            </div>
                            <Badge variant="outline">{count} times</Badge>
                          </div>
                        )
                      })}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Cycle Patterns</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span>Cycle Regularity</span>
                        <Badge className="bg-green-100 text-green-700">Regular</Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>Period Length</span>
                        <span className="font-medium">5 days avg</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>Flow Intensity</span>
                        <span className="font-medium">Medium</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Predictions Tab */}
            <TabsContent value="predictions" className="space-y-6">
              {predictions ? (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <Card className="bg-gradient-to-br from-red-50 to-pink-50 border-red-200">
                    <CardContent className="p-6 text-center">
                      <Droplets className="w-12 h-12 text-red-500 mx-auto mb-4" />
                      <h3 className="font-bold text-lg mb-2">Next Period</h3>
                      <div className="text-2xl font-bold text-red-600 mb-2">
                        {format(predictions.nextPeriod, "MMM d, yyyy")}
                      </div>
                      <div className="text-sm text-gray-600">
                        in{" "}
                        {Math.ceil((predictions.nextPeriod.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))}{" "}
                        days
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
                    <CardContent className="p-6 text-center">
                      <Target className="w-12 h-12 text-green-500 mx-auto mb-4" />
                      <h3 className="font-bold text-lg mb-2">Ovulation</h3>
                      <div className="text-2xl font-bold text-green-600 mb-2">
                        {format(predictions.ovulation, "MMM d")}
                      </div>
                      <div className="text-sm text-gray-600">Peak fertility day</div>
                    </CardContent>
                  </Card>

                  <Card className="bg-gradient-to-br from-yellow-50 to-orange-50 border-yellow-200">
                    <CardContent className="p-6 text-center">
                      <AlertCircle className="w-12 h-12 text-yellow-500 mx-auto mb-4" />
                      <h3 className="font-bold text-lg mb-2">PMS Window</h3>
                      <div className="text-2xl font-bold text-yellow-600 mb-2">
                        {format(predictions.pmsStart, "MMM d")}
                      </div>
                      <div className="text-sm text-gray-600">Prepare for symptoms</div>
                    </CardContent>
                  </Card>

                  <Card className="md:col-span-2 lg:col-span-3">
                    <CardHeader>
                      <CardTitle>Fertile Window</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium">High Fertility Period</span>
                          <Badge className="bg-green-500 text-white">6 days</Badge>
                        </div>
                        <div className="text-sm text-gray-600">
                          {format(predictions.fertileWindow.start, "MMM d")} -{" "}
                          {format(predictions.fertileWindow.end, "MMM d")}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              ) : (
                <Card>
                  <CardContent className="p-12 text-center">
                    <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-xl font-bold mb-2">Start Tracking to See Predictions</h3>
                    <p className="text-gray-600 mb-6">
                      Log at least 2 cycles to get personalized predictions and insights.
                    </p>
                    <Button
                      onClick={() => {
                        setActiveTab("calendar")
                        setSelectedDate(new Date())
                        setShowAddEntry(true)
                      }}
                      className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                    >
                      Start Tracking
                    </Button>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            {/* Reminders Tab */}
            <TabsContent value="reminders" className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Active Reminders</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {predictions && (
                        <>
                          <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                            <div className="flex items-center gap-3">
                              <Bell className="w-5 h-5 text-red-500" />
                              <div>
                                <div className="font-medium">Period Reminder</div>
                                <div className="text-sm text-gray-600">
                                  {format(predictions.nextPeriod, "MMM d")} - 2 days before
                                </div>
                              </div>
                            </div>
                            <CheckCircle className="w-5 h-5 text-green-500" />
                          </div>

                          <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                            <div className="flex items-center gap-3">
                              <Bell className="w-5 h-5 text-green-500" />
                              <div>
                                <div className="font-medium">Ovulation Reminder</div>
                                <div className="text-sm text-gray-600">
                                  {format(predictions.ovulation, "MMM d")} - 1 day before
                                </div>
                              </div>
                            </div>
                            <CheckCircle className="w-5 h-5 text-green-500" />
                          </div>

                          <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                            <div className="flex items-center gap-3">
                              <Bell className="w-5 h-5 text-purple-500" />
                              <div>
                                <div className="font-medium">Period Calm Reminder</div>
                                <div className="text-sm text-gray-600">Take Period Calm 2 days before period</div>
                              </div>
                            </div>
                            <CheckCircle className="w-5 h-5 text-green-500" />
                          </div>
                        </>
                      )}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Reminder Settings</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span>Period Reminders</span>
                      <Button variant="outline" size="sm">
                        Enable
                      </Button>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Ovulation Alerts</span>
                      <Button variant="outline" size="sm">
                        Enable
                      </Button>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Daily Log Reminders</span>
                      <Button variant="outline" size="sm">
                        Enable
                      </Button>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Period Calm Reminders</span>
                      <Button variant="outline" size="sm">
                        Enable
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>

        {/* Entry Modal */}
        {showAddEntry && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Log Entry - {format(selectedDate, "MMM d, yyyy")}</CardTitle>
                  <Button variant="ghost" size="sm" onClick={() => setShowAddEntry(false)}>
                    ×
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Period Tracking */}
                <div>
                  <h4 className="font-medium mb-3">Period</h4>
                  <div className="flex gap-2">
                    <Button
                      variant={getDayData(selectedDate)?.isPeriod ? "default" : "outline"}
                      size="sm"
                      onClick={() => saveEntry({ isPeriod: !getDayData(selectedDate)?.isPeriod })}
                    >
                      Period Day
                    </Button>
                  </div>

                  {getDayData(selectedDate)?.isPeriod && (
                    <div className="mt-3">
                      <label className="block text-sm font-medium mb-2">Flow</label>
                      <div className="flex gap-2">
                        {flows.map((flow) => (
                          <Button
                            key={flow.value}
                            variant={getDayData(selectedDate)?.flow === flow.value ? "default" : "outline"}
                            size="sm"
                            onClick={() => saveEntry({ flow: flow.value as any })}
                          >
                            {flow.label}
                          </Button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Symptoms */}
                <div>
                  <h4 className="font-medium mb-3">Symptoms</h4>
                  <div className="grid grid-cols-2 gap-2">
                    {symptoms.map((symptom) => {
                      const Icon = symptom.icon
                      const isSelected = getDayData(selectedDate)?.symptoms.includes(symptom.id) || false

                      return (
                        <Button
                          key={symptom.id}
                          variant={isSelected ? "default" : "outline"}
                          size="sm"
                          className="justify-start"
                          onClick={() => {
                            const currentSymptoms = getDayData(selectedDate)?.symptoms || []
                            const newSymptoms = isSelected
                              ? currentSymptoms.filter((s) => s !== symptom.id)
                              : [...currentSymptoms, symptom.id]
                            saveEntry({ symptoms: newSymptoms })
                          }}
                        >
                          <Icon className="w-4 h-4 mr-2" />
                          {symptom.label}
                        </Button>
                      )
                    })}
                  </div>
                </div>

                {/* Mood */}
                <div>
                  <h4 className="font-medium mb-3">Mood</h4>
                  <div className="flex gap-2">
                    {moods.map((mood) => (
                      <Button
                        key={mood.value}
                        variant={getDayData(selectedDate)?.mood === mood.value ? "default" : "outline"}
                        size="sm"
                        onClick={() => saveEntry({ mood: mood.value as any })}
                      >
                        <span className="mr-1">{mood.emoji}</span>
                        {mood.label}
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Additional Tracking */}
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      <Thermometer className="w-4 h-4 inline mr-1" />
                      Temperature (°F)
                    </label>
                    <Input
                      type="number"
                      step="0.1"
                      placeholder="98.6"
                      value={getDayData(selectedDate)?.temperature || ""}
                      onChange={(e) => saveEntry({ temperature: Number.parseFloat(e.target.value) || null })}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      <Scale className="w-4 h-4 inline mr-1" />
                      Weight (lbs)
                    </label>
                    <Input
                      type="number"
                      placeholder="130"
                      value={getDayData(selectedDate)?.weight || ""}
                      onChange={(e) => saveEntry({ weight: Number.parseFloat(e.target.value) || null })}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      <Bed className="w-4 h-4 inline mr-1" />
                      Sleep (hours)
                    </label>
                    <Input
                      type="number"
                      step="0.5"
                      placeholder="8"
                      value={getDayData(selectedDate)?.sleep || ""}
                      onChange={(e) => saveEntry({ sleep: Number.parseFloat(e.target.value) || null })}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      <Droplets className="w-4 h-4 inline mr-1" />
                      Water (glasses)
                    </label>
                    <Input
                      type="number"
                      placeholder="8"
                      value={getDayData(selectedDate)?.water || ""}
                      onChange={(e) => saveEntry({ water: Number.parseInt(e.target.value) || 0 })}
                    />
                  </div>
                </div>

                {/* Exercise */}
                <div>
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={getDayData(selectedDate)?.exercise || false}
                      onChange={(e) => saveEntry({ exercise: e.target.checked })}
                      className="rounded"
                    />
                    <Dumbbell className="w-4 h-4" />
                    <span>Exercised today</span>
                  </label>
                </div>

                {/* Notes */}
                <div>
                  <label className="block text-sm font-medium mb-2">Notes</label>
                  <Textarea
                    placeholder="How are you feeling today?"
                    value={getDayData(selectedDate)?.notes || ""}
                    onChange={(e) => saveEntry({ notes: e.target.value })}
                    rows={3}
                  />
                </div>

                <div className="flex gap-2 pt-4">
                  <Button
                    onClick={() => setShowAddEntry(false)}
                    className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                  >
                    Save Entry
                  </Button>
                  <Button variant="outline" onClick={() => setShowAddEntry(false)}>
                    Cancel
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Cycle Visualization */}
        <div className="grid lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
          <Card className="overflow-hidden">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <TrendingUp className="w-5 h-5 text-purple-600" />
                <span>Your 28-Day Cycle</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              {/* Cycle Circle */}
              <div className="relative w-80 h-80 mx-auto mb-8">
                <div className="absolute inset-0 rounded-full border-8 border-gray-200"></div>

                {/* Phase Segments */}
                {cyclePhases.map((phase, index) => {
                  const startAngle = index === 0 ? 0 : index === 1 ? 45 : index === 2 ? 135 : 150
                  const endAngle = index === 0 ? 45 : index === 1 ? 135 : index === 2 ? 150 : 360

                  return (
                    <div
                      key={index}
                      className={`absolute inset-0 rounded-full border-8 ${phase.color} opacity-30 cursor-pointer hover:opacity-50 transition-opacity`}
                      style={{
                        clipPath: `polygon(50% 50%, ${50 + 40 * Math.cos(((startAngle - 90) * Math.PI) / 180)}% ${50 + 40 * Math.sin(((startAngle - 90) * Math.PI) / 180)}%, ${50 + 40 * Math.cos(((endAngle - 90) * Math.PI) / 180)}% ${50 + 40 * Math.sin(((endAngle - 90) * Math.PI) / 180)}%)`,
                      }}
                      onClick={() => setSelectedPhase(index)}
                    />
                  )
                })}

                {/* Current Day Indicator */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-4xl font-bold text-gray-900">Day {currentDay}</div>
                    <div className={`text-sm font-medium ${cyclePhases[currentPhase].color.replace("bg-", "text-")}`}>
                      {cyclePhases[currentPhase].name} Phase
                    </div>
                  </div>
                </div>
              </div>

              {/* Day Selector */}
              <div className="flex items-center justify-center space-x-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentDay(Math.max(1, currentDay - 1))}
                  disabled={currentDay === 1}
                >
                  Previous Day
                </Button>
                <span className="text-sm text-gray-600">Day {currentDay} of 28</span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentDay(Math.min(28, currentDay + 1))}
                  disabled={currentDay === 28}
                >
                  Next Day
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Phase Information */}
          <div className="space-y-6">
            <Card className={`border-l-4 ${cyclePhases[selectedPhase].color.replace("bg-", "border-l-")}`}>
              <CardHeader>
                <CardTitle className="flex items-center space-x-3">
                  <div className={`w-4 h-4 rounded-full ${cyclePhases[selectedPhase].color}`}></div>
                  <span>{cyclePhases[selectedPhase].name} Phase</span>
                  <Badge variant="outline">Days {cyclePhases[selectedPhase].days}</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">{cyclePhases[selectedPhase].description}</p>
                <div className="space-y-2">
                  <h4 className="font-semibold text-sm">Recommended Actions:</h4>
                  <ul className="space-y-1">
                    {cyclePhases[selectedPhase].tips.map((tip, index) => (
                      <li key={index} className="flex items-start space-x-2 text-sm text-gray-600">
                        <div className="w-1.5 h-1.5 rounded-full bg-gray-400 mt-2 flex-shrink-0"></div>
                        <span>{tip}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>

            {/* Symptoms Tracker */}
            <Card>
              <CardHeader>
                <CardTitle>Common Symptoms</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center space-x-3 p-3 bg-red-50 rounded-lg">
                    <Droplets className="w-5 h-5 text-red-500" />
                    <div>
                      <div className="font-medium text-sm">Cramps</div>
                      <div className="text-xs text-gray-600">Days 1-3</div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg">
                    <Moon className="w-5 h-5 text-blue-500" />
                    <div>
                      <div className="font-medium text-sm">Fatigue</div>
                      <div className="text-xs text-gray-600">Days 1-2</div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3 p-3 bg-purple-50 rounded-lg">
                    <Heart className="w-5 h-5 text-purple-500" />
                    <div>
                      <div className="font-medium text-sm">Mood Changes</div>
                      <div className="text-xs text-gray-600">Days 25-28</div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
                    <Zap className="w-5 h-5 text-green-500" />
                    <div>
                      <div className="font-medium text-sm">High Energy</div>
                      <div className="text-xs text-gray-600">Days 12-16</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* CTA */}
            <Card className="bg-gradient-to-r from-rose-500 to-orange-500 text-white">
              <CardContent className="p-6 text-center">
                <h3 className="text-xl font-semibold mb-2">Ready for Your Next Cycle?</h3>
                <p className="mb-4 opacity-90">Stock up on Period Calm and never be caught unprepared again.</p>
                <Button className="bg-white text-rose-600 hover:bg-gray-100">Shop Period Calm</Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  )
}
