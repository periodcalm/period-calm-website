"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Target, Calendar, TrendingUp, AlertTriangle } from "lucide-react"

export default function PredictionsView() {
  const predictions = {
    nextPeriod: "2024-02-15",
    fertileWindow: {
      start: "2024-01-28",
      end: "2024-02-03"
    },
    ovulationDate: "2024-01-31",
    cycleLength: 28,
    confidence: 85
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Predictions</h2>
        <Badge variant="secondary" className="text-sm">
          {predictions.confidence}% Confidence
        </Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Next Period Prediction */}
        <Card className="border-l-4 border-l-red-500">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center text-lg">
              <Calendar className="w-5 h-5 mr-2 text-red-500" />
              Next Period
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900 mb-2">
              {new Date(predictions.nextPeriod).toLocaleDateString('en-US', { 
                month: 'short', 
                day: 'numeric' 
              })}
            </div>
            <p className="text-gray-600 text-sm">
              Based on your {predictions.cycleLength}-day cycle
            </p>
          </CardContent>
        </Card>

        {/* Fertile Window */}
        <Card className="border-l-4 border-l-green-500">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center text-lg">
              <Target className="w-5 h-5 mr-2 text-green-500" />
              Fertile Window
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-lg font-semibold text-gray-900 mb-1">
              {new Date(predictions.fertileWindow.start).toLocaleDateString('en-US', { 
                month: 'short', 
                day: 'numeric' 
              })} - {new Date(predictions.fertileWindow.end).toLocaleDateString('en-US', { 
                month: 'short', 
                day: 'numeric' 
              })}
            </div>
            <p className="text-gray-600 text-sm">
              Peak fertility on {new Date(predictions.ovulationDate).toLocaleDateString('en-US', { 
                month: 'short', 
                day: 'numeric' 
              })}
            </p>
          </CardContent>
        </Card>

        {/* Cycle Insights */}
        <Card className="border-l-4 border-l-blue-500">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center text-lg">
              <TrendingUp className="w-5 h-5 mr-2 text-blue-500" />
              Cycle Insights
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">Average Cycle:</span>
                <span className="font-semibold">{predictions.cycleLength} days</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Regularity:</span>
                <Badge variant="outline" className="text-green-600 border-green-600">
                  Regular
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Prediction Accuracy */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <AlertTriangle className="w-5 h-5 mr-2 text-orange-500" />
            Prediction Accuracy
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-gray-700">Based on 6 months of data</span>
              <Badge variant="secondary">{predictions.confidence}% accurate</Badge>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${predictions.confidence}%` }}
              ></div>
            </div>
            <p className="text-sm text-gray-600">
              More data will improve prediction accuracy. Track your periods consistently for better results.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 