"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts"
import { TrendingUp, BarChart3, PieChartIcon, Activity, Thermometer, Heart, Download } from "lucide-react"
import type { CycleData, InsightData } from "./types"
import { format, subDays } from "date-fns"

interface DataVisualizationProps {
  cycleData: Record<string, CycleData>
  insights: InsightData
}

export default function DataVisualization({ cycleData, insights }: DataVisualizationProps) {
  const [timeRange, setTimeRange] = useState<"3months" | "6months" | "1year">("3months")
  const [activeChart, setActiveChart] = useState("overview")

  // Prepare data for charts
  const prepareChartData = () => {
    const days = timeRange === "3months" ? 90 : timeRange === "6months" ? 180 : 365
    const data = []

    for (let i = days; i >= 0; i--) {
      const date = subDays(new Date(), i)
      const dateKey = format(date, "yyyy-MM-dd")
      const dayData = cycleData[dateKey]

      data.push({
        date: format(date, "MMM dd"),
        fullDate: dateKey,
        isPeriod: dayData?.isPeriod ? 1 : 0,
        mood: dayData?.mood ? { terrible: 1, bad: 2, okay: 3, good: 4, great: 5 }[dayData.mood] : null,
        temperature: dayData?.temperature || null,
        sleep: dayData?.sleep || null,
        water: dayData?.water || null,
        exercise: dayData?.exercise ? 1 : 0,
        symptomCount: dayData?.symptoms?.length || 0,
      })
    }

    return data
  }

  const chartData = prepareChartData()

  // Symptom distribution data
  const symptomData = insights.commonSymptoms.map((symptom, index) => ({
    name: symptom.symptom.replace("_", " "),
    value: symptom.count,
    color: ["#8B5CF6", "#EC4899", "#F59E0B", "#10B981", "#3B82F6", "#EF4444", "#8B5A2B", "#6B7280"][index % 8],
  }))

  // Cycle length data
  const cycleData_chart = Array.from({ length: 12 }, (_, i) => ({
    month: format(subDays(new Date(), (11 - i) * 30), "MMM"),
    cycleLength: 28 + Math.floor(Math.random() * 4) - 2, // Mock data
    periodLength: 5 + Math.floor(Math.random() * 2) - 1, // Mock data
  }))

  const exportData = () => {
    const dataToExport = Object.entries(cycleData).map(([date, data]) => ({
      Date: date,
      Period: data.isPeriod ? "Yes" : "No",
      Flow: data.flow || "",
      Mood: data.mood || "",
      Symptoms: Array.isArray(data.symptoms) ? data.symptoms.join(", ") : "",
      Temperature: data.temperature || "",
      Sleep: data.sleep || "",
      Exercise: data.exercise ? "Yes" : "No",
      Notes: data.notes || "",
    }))

    const csv = [
      Object.keys(dataToExport[0]).join(","),
      ...dataToExport.map((row) => Object.values(row).join(",")),
    ].join("\n")

    const blob = new Blob([csv], { type: "text/csv" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `period-calm-data-${format(new Date(), "yyyy-MM-dd")}.csv`
    a.click()
  }

  return (
    <div className="space-y-6">
      {/* Header with Controls */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold mb-2">Data Visualization</h2>
          <p className="text-gray-600">Visualize your cycle patterns and health trends</p>
        </div>

        <div className="flex gap-2">
          <div className="flex gap-1">
            {["3months", "6months", "1year"].map((range) => (
              <Button
                key={range}
                variant={timeRange === range ? "default" : "outline"}
                size="sm"
                onClick={() => setTimeRange(range as any)}
              >
                {range === "3months" ? "3M" : range === "6months" ? "6M" : "1Y"}
              </Button>
            ))}
          </div>

          <Button variant="outline" size="sm" onClick={exportData}>
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      <Tabs value={activeChart} onValueChange={setActiveChart}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="symptoms">Symptoms</TabsTrigger>
          <TabsTrigger value="health">Health Metrics</TabsTrigger>
          <TabsTrigger value="cycles">Cycle Analysis</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            {/* Mood & Period Timeline */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-purple-500" />
                  Mood & Period Timeline
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis yAxisId="left" domain={[0, 5]} />
                    <YAxis yAxisId="right" orientation="right" domain={[0, 1]} />
                    <Tooltip />
                    <Legend />
                    <Line
                      yAxisId="left"
                      type="monotone"
                      dataKey="mood"
                      stroke="#8B5CF6"
                      strokeWidth={2}
                      name="Mood (1-5)"
                      connectNulls={false}
                    />
                    <Bar yAxisId="right" dataKey="isPeriod" fill="#EF4444" name="Period Days" opacity={0.7} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Temperature Tracking */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Thermometer className="w-5 h-5 text-orange-500" />
                  Basal Body Temperature
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis domain={[97, 100]} />
                    <Tooltip />
                    <Area
                      type="monotone"
                      dataKey="temperature"
                      stroke="#F59E0B"
                      fill="#FEF3C7"
                      strokeWidth={2}
                      connectNulls={false}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Symptoms Tab */}
        <TabsContent value="symptoms" className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            {/* Symptom Distribution */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <PieChartIcon className="w-5 h-5 text-pink-500" />
                  Symptom Distribution
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={symptomData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {symptomData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Symptom Frequency */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-blue-500" />
                  Symptom Frequency
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={symptomData} layout="horizontal">
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" />
                    <YAxis dataKey="name" type="category" width={100} />
                    <Tooltip />
                    <Bar dataKey="value" fill="#3B82F6" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Health Metrics Tab */}
        <TabsContent value="health" className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            {/* Sleep & Exercise */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="w-5 h-5 text-green-500" />
                  Sleep & Exercise
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis yAxisId="left" domain={[0, 12]} />
                    <YAxis yAxisId="right" orientation="right" domain={[0, 1]} />
                    <Tooltip />
                    <Legend />
                    <Line
                      yAxisId="left"
                      type="monotone"
                      dataKey="sleep"
                      stroke="#10B981"
                      strokeWidth={2}
                      name="Sleep (hours)"
                      connectNulls={false}
                    />
                    <Bar yAxisId="right" dataKey="exercise" fill="#3B82F6" name="Exercise" opacity={0.7} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Water Intake */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="w-5 h-5 text-blue-500" />
                  Water Intake
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis domain={[0, 12]} />
                    <Tooltip />
                    <Area
                      type="monotone"
                      dataKey="water"
                      stroke="#3B82F6"
                      fill="#DBEAFE"
                      strokeWidth={2}
                      connectNulls={false}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Cycle Analysis Tab */}
        <TabsContent value="cycles" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Heart className="w-5 h-5 text-red-500" />
                Cycle Length Trends
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <LineChart data={cycleData_chart}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis domain={[20, 35]} />
                  <Tooltip />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="cycleLength"
                    stroke="#EF4444"
                    strokeWidth={3}
                    name="Cycle Length (days)"
                  />
                  <Line
                    type="monotone"
                    dataKey="periodLength"
                    stroke="#F59E0B"
                    strokeWidth={2}
                    name="Period Length (days)"
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
