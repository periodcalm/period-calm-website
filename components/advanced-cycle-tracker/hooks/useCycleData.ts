"use client"

import { useState, useEffect, useMemo } from "react"
import type { CycleData, PredictionData, InsightData } from "../types"
import { addDays, subDays, differenceInDays, parseISO, format } from "date-fns"

export function useCycleData() {
  const [cycleData, setCycleData] = useState<Record<string, CycleData>>({})
  const [isLoading, setIsLoading] = useState(true)

  // Load data from localStorage on mount
  useEffect(() => {
    const savedData = localStorage.getItem("cycle-tracker-data")
    if (savedData) {
      try {
        setCycleData(JSON.parse(savedData))
      } catch (error) {
        console.error("Error loading cycle data:", error)
      }
    }
    setIsLoading(false)
  }, [])

  // Save data to localStorage whenever it changes
  useEffect(() => {
    if (!isLoading) {
      localStorage.setItem("cycle-tracker-data", JSON.stringify(cycleData))
    }
  }, [cycleData, isLoading])

  const updateCycleData = (date: string, data: Partial<CycleData>) => {
    setCycleData((prev) => ({
      ...prev,
      [date]: {
        date,
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
        cervicalMucus: null,
        medications: [],
        sexualActivity: false,
        ...prev[date],
        ...data,
      },
    }))
  }

  // Calculate predictions based on historical data
  const predictions = useMemo((): PredictionData | null => {
    const periodDates = Object.entries(cycleData)
      .filter(([_, data]) => data.isPeriod)
      .map(([date, _]) => parseISO(date))
      .sort((a, b) => a.getTime() - b.getTime())

    if (periodDates.length < 2) return null

    // Calculate cycle lengths
    const cycles = []
    for (let i = 1; i < periodDates.length; i++) {
      const cycleLength = differenceInDays(periodDates[i], periodDates[i - 1])
      if (cycleLength >= 21 && cycleLength <= 35) {
        cycles.push(cycleLength)
      }
    }

    if (cycles.length === 0) return null

    const avgCycleLength = Math.round(cycles.reduce((a, b) => a + b, 0) / cycles.length)
    const lastPeriod = periodDates[periodDates.length - 1]

    // Calculate period length
    const periodLengths = []
    for (const startDate of periodDates) {
      let length = 1
      for (let i = 1; i <= 10; i++) {
        const checkDate = format(addDays(startDate, i), "yyyy-MM-dd")
        if (cycleData[checkDate]?.isPeriod) {
          length++
        } else {
          break
        }
      }
      periodLengths.push(length)
    }

    const avgPeriodLength = Math.round(periodLengths.reduce((a, b) => a + b, 0) / periodLengths.length)

    const nextPeriod = addDays(lastPeriod, avgCycleLength)
    const ovulation = subDays(nextPeriod, 14)
    const fertileStart = subDays(ovulation, 5)
    const fertileEnd = addDays(ovulation, 1)
    const pmsStart = subDays(nextPeriod, 7)

    // Calculate confidence based on cycle regularity
    const cycleVariation = Math.max(...cycles) - Math.min(...cycles)
    const confidence = Math.max(0.5, 1 - cycleVariation / avgCycleLength)

    return {
      nextPeriod,
      ovulation,
      fertileWindow: { start: fertileStart, end: fertileEnd },
      cycleLength: avgCycleLength,
      periodLength: avgPeriodLength,
      pmsStart,
      confidence,
    }
  }, [cycleData])

  // Calculate insights
  const insights = useMemo((): InsightData => {
    const entries = Object.values(cycleData)
    const periodEntries = entries.filter((e) => e.isPeriod)

    // Symptom analysis
    const symptomCounts: Record<string, { count: number; totalSeverity: number }> = {}
    entries.forEach((entry) => {
      entry.symptoms.forEach((symptom) => {
        const id = typeof symptom === "string" ? symptom : symptom.id
        const severity = typeof symptom === "object" ? symptom.severity : 1

        if (!symptomCounts[id]) {
          symptomCounts[id] = { count: 0, totalSeverity: 0 }
        }
        symptomCounts[id].count++
        symptomCounts[id].totalSeverity += severity
      })
    })

    const commonSymptoms = Object.entries(symptomCounts)
      .map(([symptom, data]) => ({
        symptom,
        count: data.count,
        avgSeverity: data.totalSeverity / data.count,
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5)

    // Mood analysis
    const moodEntries = entries.filter((e) => e.mood)
    const moodValues = { terrible: 1, bad: 2, okay: 3, good: 4, great: 5 }
    const avgMood =
      moodEntries.length > 0
        ? moodEntries.reduce((acc, e) => acc + (moodValues[e.mood as keyof typeof moodValues] || 3), 0) /
          moodEntries.length
        : 3

    // Calculate streak
    const today = new Date()
    let streakDays = 0
    for (let i = 0; i < 365; i++) {
      const checkDate = format(subDays(today, i), "yyyy-MM-dd")
      if (cycleData[checkDate]) {
        streakDays++
      } else {
        break
      }
    }

    // Pattern analysis
    const cycles = predictions ? [predictions.cycleLength] : []
    const regularCycle = cycles.length > 0 && Math.max(...cycles) - Math.min(...cycles) <= 3

    return {
      totalEntries: entries.length,
      periodDays: periodEntries.length,
      avgCycleLength: predictions?.cycleLength || 0,
      avgPeriodLength: predictions?.periodLength || 0,
      commonSymptoms,
      avgMood,
      streakDays,
      patterns: {
        regularCycle,
        ovulationPattern: predictions?.confidence > 0.7 || false,
        pmsPattern: commonSymptoms.some((s) => ["mood_swings", "cramps", "bloating"].includes(s.symptom)),
      },
    }
  }, [cycleData, predictions])

  return {
    cycleData,
    updateCycleData,
    predictions,
    insights,
    isLoading,
  }
}
