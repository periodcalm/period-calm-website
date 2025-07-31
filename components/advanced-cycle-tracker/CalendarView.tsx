"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  Calendar,
  ChevronLeft,
  ChevronRight,
  Plus,
  Thermometer,
  Droplets,
  Heart,
  Brain,
  Zap,
  Activity,
} from "lucide-react"
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, addMonths, subMonths } from "date-fns"
import type { CycleData } from "./types"
import DayEntryModal from "./DayEntryModal"

interface CalendarViewProps {
  cycleData: Record<string, CycleData>
  updateCycleData: (date: string, data: Partial<CycleData>) => void
  predictions: any
  insights: any
}

export default function CalendarView({ cycleData, updateCycleData, predictions }: CalendarViewProps) {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [showEntryModal, setShowEntryModal] = useState(false)
  const [viewMode, setViewMode] = useState<"month" | "week">("month")

  const monthStart = startOfMonth(currentDate)
  const monthEnd = endOfMonth(currentDate)
  const calendarDays = eachDayOfInterval({ start: monthStart, end: monthEnd })

  const getDayData = (date: Date): CycleData | undefined => {
    const dateKey = format(date, "yyyy-MM-dd")
    return cycleData[dateKey]
  }

  const getDayStatus = (date: Date) => {
    const data = getDayData(date)
    const today = new Date()

    if (data?.isPeriod) return "period"
    if (predictions) {
      if (predictions.ovulation && isSameDay(date, predictions.ovulation)) return "ovulation"
      if (predictions.fertileWindow && date >= predictions.fertileWindow.start && date <= predictions.fertileWindow.end)
        return "fertile"
      if (predictions.pmsStart && date >= predictions.pmsStart && date < predictions.nextPeriod) return "pms"
      if (predictions.nextPeriod && isSameDay(date, predictions.nextPeriod)) return "predicted-period"
    }
    if (isSameDay(date, today)) return "today"
    return "normal"
  }

  const getDayColor = (status: string) => {
    const colors = {
      period: "bg-red-500 text-white border-red-600",
      ovulation: "bg-green-500 text-white border-green-600",
      fertile: "bg-green-200 text-green-800 border-green-300",
      pms: "bg-yellow-200 text-yellow-800 border-yellow-300",
      "predicted-period": "bg-red-200 text-red-800 border-2 border-red-400 border-dashed",
      today: "bg-blue-500 text-white ring-2 ring-blue-300 border-blue-600",
      normal: "bg-white hover:bg-gray-50 text-gray-700 border-gray-200",
    }
    return colors[status as keyof typeof colors] || colors.normal
  }

  const getSymptomIcons = (data: CycleData) => {
    const icons = []
    if (data.symptoms.includes("cramps")) icons.push(<Heart key="cramps" className="w-2 h-2 text-red-500" />)
    if (data.symptoms.includes("bloating")) icons.push(<Droplets key="bloating" className="w-2 h-2 text-blue-500" />)
    if (data.symptoms.includes("headache")) icons.push(<Brain key="headache" className="w-2 h-2 text-purple-500" />)
    if (data.symptoms.includes("fatigue")) icons.push(<Zap key="fatigue" className="w-2 h-2 text-yellow-500" />)
    if (data.temperature) icons.push(<Thermometer key="temp" className="w-2 h-2 text-orange-500" />)
    return icons.slice(0, 3) // Show max 3 icons
  }

  const handleDayClick = (date: Date) => {
    setSelectedDate(date)
    setShowEntryModal(true)
  }

  return (
    <div className="space-y-6">
      {/* Calendar Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-purple-500" />
              {format(currentDate, "MMMM yyyy")}
            </CardTitle>

            <div className="flex items-center gap-2">
              <div className="flex gap-1">
                <Button
                  variant={viewMode === "month" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setViewMode("month")}
                >
                  Month
                </Button>
                <Button
                  variant={viewMode === "week" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setViewMode("week")}
                >
                  Week
                </Button>
              </div>

              <div className="flex gap-1">
                <Button variant="outline" size="sm" onClick={() => setCurrentDate(subMonths(currentDate, 1))}>
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                <Button variant="outline" size="sm" onClick={() => setCurrentDate(new Date())}>
                  Today
                </Button>
                <Button variant="outline" size="sm" onClick={() => setCurrentDate(addMonths(currentDate, 1))}>
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          {/* Calendar Grid */}
          <div className="space-y-4">
            {/* Day Headers */}
            <div className="grid grid-cols-7 gap-2">
              {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                <div key={day} className="text-center text-sm font-medium text-gray-500 p-2">
                  {day}
                </div>
              ))}
            </div>

            {/* Calendar Days */}
            <div className="grid grid-cols-7 gap-2">
              {calendarDays.map((day) => {
                const status = getDayStatus(day)
                const data = getDayData(day)
                const isToday = isSameDay(day, new Date())

                return (
                  <button
                    key={day.toISOString()}
                    onClick={() => handleDayClick(day)}
                    className={`
                      relative min-h-[60px] p-2 rounded-lg border-2 transition-all duration-200
                      ${getDayColor(status)}
                      hover:scale-105 hover:shadow-md
                      flex flex-col items-center justify-start
                    `}
                  >
                    <span className="text-sm font-medium mb-1">{format(day, "d")}</span>

                    {/* Flow indicator for period days */}
                    {data?.isPeriod && data.flow && (
                      <div
                        className={`w-2 h-2 rounded-full mb-1 ${
                          data.flow === "light" ? "bg-pink-300" : data.flow === "medium" ? "bg-red-400" : "bg-red-600"
                        }`}
                      />
                    )}

                    {/* Mood indicator */}
                    {data?.mood && (
                      <div className="text-xs mb-1">
                        {data.mood === "great"
                          ? "😊"
                          : data.mood === "good"
                            ? "🙂"
                            : data.mood === "okay"
                              ? "😐"
                              : data.mood === "bad"
                                ? "😞"
                                : "😢"}
                      </div>
                    )}

                    {/* Symptom icons */}
                    {data && <div className="flex gap-1 flex-wrap justify-center">{getSymptomIcons(data)}</div>}

                    {/* Data indicator dot */}
                    {data && Object.keys(data).length > 2 && (
                      <div className="absolute bottom-1 right-1 w-2 h-2 bg-purple-500 rounded-full" />
                    )}
                  </button>
                )
              })}
            </div>
          </div>

          {/* Legend */}
          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <h4 className="font-medium mb-3">Legend</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-red-500 rounded border"></div>
                <span>Period</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-green-500 rounded border"></div>
                <span>Ovulation</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-green-200 rounded border"></div>
                <span>Fertile Window</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-yellow-200 rounded border"></div>
                <span>PMS</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-red-200 border-2 border-red-400 border-dashed rounded"></div>
                <span>Predicted Period</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-blue-500 rounded border ring-2 ring-blue-300"></div>
                <span>Today</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid md:grid-cols-3 gap-4">
        <Card className="bg-gradient-to-br from-red-50 to-pink-50 border-red-200">
          <CardContent className="p-4 text-center">
            <Droplets className="w-8 h-8 text-red-500 mx-auto mb-2" />
            <h3 className="font-semibold mb-2">Log Period</h3>
            <Button
              size="sm"
              className="bg-red-500 hover:bg-red-600"
              onClick={() => {
                setSelectedDate(new Date())
                setShowEntryModal(true)
              }}
            >
              <Plus className="w-4 h-4 mr-1" />
              Add Entry
            </Button>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200">
          <CardContent className="p-4 text-center">
            <Activity className="w-8 h-8 text-purple-500 mx-auto mb-2" />
            <h3 className="font-semibold mb-2">Track Symptoms</h3>
            <Button
              size="sm"
              className="bg-purple-500 hover:bg-purple-600"
              onClick={() => {
                setSelectedDate(new Date())
                setShowEntryModal(true)
              }}
            >
              <Plus className="w-4 h-4 mr-1" />
              Log Today
            </Button>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
          <CardContent className="p-4 text-center">
            <Thermometer className="w-8 h-8 text-green-500 mx-auto mb-2" />
            <h3 className="font-semibold mb-2">BBT & Data</h3>
            <Button
              size="sm"
              className="bg-green-500 hover:bg-green-600"
              onClick={() => {
                setSelectedDate(new Date())
                setShowEntryModal(true)
              }}
            >
              <Plus className="w-4 h-4 mr-1" />
              Add Data
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Day Entry Modal */}
      {showEntryModal && selectedDate && (
        <DayEntryModal
          date={selectedDate}
          existingData={getDayData(selectedDate)}
          onSave={(data) => {
            const dateKey = format(selectedDate, "yyyy-MM-dd")
            updateCycleData(dateKey, data)
            setShowEntryModal(false)
          }}
          onClose={() => setShowEntryModal(false)}
        />
      )}
    </div>
  )
}
