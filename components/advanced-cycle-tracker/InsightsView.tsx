"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { TrendingUp, Calendar, Heart, Brain, Activity, Target, Award, BarChart3, Zap } from "lucide-react"
import type { InsightData, CycleData } from "./types"

interface InsightsViewProps {
  insights: InsightData
  cycleData: Record<string, CycleData>
}

export default function InsightsView({ insights, cycleData }: InsightsViewProps) {
  const getSymptomIcon = (symptom: string) => {
    const icons: Record<string, any> = {
      cramps: Heart,
      bloating: Activity,
      headache: Brain,
      fatigue: Zap,
      mood_swings: Brain,
      back_pain: Activity,
    }
    return icons[symptom] || Activity
  }

  const getMoodColor = (mood: number) => {
    if (mood >= 4.5) return "text-green-600"
    if (mood >= 3.5) return "text-lime-600"
    if (mood >= 2.5) return "text-yellow-600"
    if (mood >= 1.5) return "text-orange-600"
    return "text-red-600"
  }

  const getPatternStatus = (isGood: boolean) => {
    return isGood ? (
      <Badge className="bg-green-100 text-green-700">Regular</Badge>
    ) : (
      <Badge className="bg-yellow-100 text-yellow-700">Irregular</Badge>
    )
  }

  return (
    <div className="space-y-6">
      {/* Overview Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <Calendar className="w-8 h-8 text-purple-500 mx-auto mb-2" />
            <div className="text-2xl font-bold">{insights.totalEntries}</div>
            <div className="text-sm text-gray-600">Days Tracked</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 text-center">
            <Activity className="w-8 h-8 text-red-500 mx-auto mb-2" />
            <div className="text-2xl font-bold">{insights.periodDays}</div>
            <div className="text-sm text-gray-600">Period Days</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 text-center">
            <Target className="w-8 h-8 text-green-500 mx-auto mb-2" />
            <div className="text-2xl font-bold">{insights.avgCycleLength || "—"}</div>
            <div className="text-sm text-gray-600">Avg Cycle</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 text-center">
            <Award className="w-8 h-8 text-orange-500 mx-auto mb-2" />
            <div className="text-2xl font-bold">{insights.streakDays}</div>
            <div className="text-sm text-gray-600">Day Streak</div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Insights */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Cycle Patterns */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-purple-500" />
              Cycle Patterns
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span>Cycle Regularity</span>
              {getPatternStatus(insights.patterns.regularCycle)}
            </div>

            <div className="flex items-center justify-between">
              <span>Ovulation Pattern</span>
              {getPatternStatus(insights.patterns.ovulationPattern)}
            </div>

            <div className="flex items-center justify-between">
              <span>PMS Pattern</span>
              {getPatternStatus(insights.patterns.pmsPattern)}
            </div>

            <div className="pt-4 border-t">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm">Average Cycle Length</span>
                <span className="font-medium">{insights.avgCycleLength} days</span>
              </div>
              <Progress value={(insights.avgCycleLength / 35) * 100} className="h-2" />
              <div className="text-xs text-gray-500 mt-1">Normal range: 21-35 days</div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm">Average Period Length</span>
                <span className="font-medium">{insights.avgPeriodLength} days</span>
              </div>
              <Progress value={(insights.avgPeriodLength / 8) * 100} className="h-2" />
              <div className="text-xs text-gray-500 mt-1">Normal range: 3-8 days</div>
            </div>
          </CardContent>
        </Card>

        {/* Mood Analysis */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Brain className="w-5 h-5 text-pink-500" />
              Mood Analysis
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center">
              <div className={`text-4xl font-bold ${getMoodColor(insights.avgMood)}`}>
                {insights.avgMood.toFixed(1)}/5
              </div>
              <div className="text-sm text-gray-600">Average Mood Score</div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Mood Stability</span>
                <span className="font-medium">
                  {insights.avgMood >= 3.5 ? "Good" : insights.avgMood >= 2.5 ? "Fair" : "Needs Attention"}
                </span>
              </div>
              <Progress value={(insights.avgMood / 5) * 100} className="h-2" />
            </div>

            <div className="pt-4 border-t">
              <h4 className="font-medium mb-2">Mood Distribution</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>😊 Great Days</span>
                  <span>25%</span>
                </div>
                <div className="flex justify-between">
                  <span>🙂 Good Days</span>
                  <span>35%</span>
                </div>
                <div className="flex justify-between">
                  <span>😐 Okay Days</span>
                  <span>25%</span>
                </div>
                <div className="flex justify-between">
                  <span>😞 Difficult Days</span>
                  <span>15%</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Common Symptoms */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="w-5 h-5 text-orange-500" />
              Common Symptoms
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {insights.commonSymptoms.map((symptom, index) => {
                const Icon = getSymptomIcon(symptom.symptom)
                const percentage = (symptom.count / insights.totalEntries) * 100

                return (
                  <div key={symptom.symptom} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Icon className="w-4 h-4 text-gray-500" />
                        <span className="capitalize text-sm">{symptom.symptom.replace("_", " ")}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium">{symptom.count} times</span>
                        {symptom.avgSeverity && (
                          <Badge variant="outline" className="text-xs">
                            Avg: {symptom.avgSeverity.toFixed(1)}/5
                          </Badge>
                        )}
                      </div>
                    </div>
                    <Progress value={percentage} className="h-2" />
                    <div className="text-xs text-gray-500">{percentage.toFixed(1)}% of tracked days</div>
                  </div>
                )
              })}

              {insights.commonSymptoms.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <Activity className="w-12 h-12 mx-auto mb-2 opacity-50" />
                  <p>No symptoms tracked yet</p>
                  <p className="text-sm">Start logging symptoms to see patterns</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Health Metrics */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-green-500" />
              Health Metrics
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-3 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">8.2</div>
                <div className="text-xs text-blue-600">Avg Sleep (hrs)</div>
              </div>

              <div className="text-center p-3 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">6.5</div>
                <div className="text-xs text-green-600">Avg Water (glasses)</div>
              </div>

              <div className="text-center p-3 bg-purple-50 rounded-lg">
                <div className="text-2xl font-bold text-purple-600">65%</div>
                <div className="text-xs text-purple-600">Exercise Days</div>
              </div>

              <div className="text-center p-3 bg-orange-50 rounded-lg">
                <div className="text-2xl font-bold text-orange-600">98.4°F</div>
                <div className="text-xs text-orange-600">Avg BBT</div>
              </div>
            </div>

            <div className="pt-4 border-t">
              <h4 className="font-medium mb-3">Health Score</h4>
              <div className="flex items-center gap-3">
                <div className="flex-1">
                  <Progress value={78} className="h-3" />
                </div>
                <span className="font-bold text-green-600">78/100</span>
              </div>
              <p className="text-sm text-gray-600 mt-2">
                Great job! Your tracking consistency and health metrics are above average.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recommendations */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="w-5 h-5 text-indigo-500" />
            Personalized Recommendations
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="p-4 bg-green-50 rounded-lg border border-green-200">
              <h4 className="font-semibold text-green-800 mb-2">✅ You're doing great!</h4>
              <ul className="text-sm text-green-700 space-y-1">
                <li>• Consistent tracking for {insights.streakDays} days</li>
                <li>• Regular cycle pattern detected</li>
                <li>• Good mood stability</li>
              </ul>
            </div>

            <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
              <h4 className="font-semibold text-blue-800 mb-2">💡 Suggestions</h4>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• Try Period Calm 2 days before your period</li>
                <li>• Consider tracking cervical mucus for better predictions</li>
                <li>• Log exercise to see activity-mood correlations</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
