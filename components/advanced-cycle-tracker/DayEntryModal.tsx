"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  X,
  Droplets,
  Heart,
  Brain,
  Zap,
  Sun,
  Activity,
  Thermometer,
  Scale,
  Bed,
  Dumbbell,
  Coffee,
  Pill,
} from "lucide-react"
import { format } from "date-fns"
import type { CycleData } from "./types"

interface DayEntryModalProps {
  date: Date
  existingData?: CycleData
  onSave: (data: Partial<CycleData>) => void
  onClose: () => void
}

export default function DayEntryModal({ date, existingData, onSave, onClose }: DayEntryModalProps) {
  const [formData, setFormData] = useState<Partial<CycleData>>({
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
    ...existingData,
  })

  const symptoms = [
    { id: "cramps", label: "Cramps", icon: Heart, severity: true },
    { id: "bloating", label: "Bloating", icon: Droplets, severity: true },
    { id: "headache", label: "Headache", icon: Brain, severity: true },
    { id: "fatigue", label: "Fatigue", icon: Zap, severity: true },
    { id: "acne", label: "Acne", icon: Sun, severity: false },
    { id: "breast_tenderness", label: "Breast Tenderness", icon: Heart, severity: true },
    { id: "mood_swings", label: "Mood Swings", icon: Brain, severity: true },
    { id: "back_pain", label: "Back Pain", icon: Activity, severity: true },
    { id: "nausea", label: "Nausea", icon: Activity, severity: true },
    { id: "diarrhea", label: "Digestive Issues", icon: Activity, severity: true },
    { id: "insomnia", label: "Sleep Issues", icon: Bed, severity: false },
    { id: "food_cravings", label: "Food Cravings", icon: Coffee, severity: false },
  ]

  const moods = [
    { value: "great", label: "Great", emoji: "😊", color: "green" },
    { value: "good", label: "Good", emoji: "🙂", color: "lime" },
    { value: "okay", label: "Okay", emoji: "😐", color: "yellow" },
    { value: "bad", label: "Bad", emoji: "😞", color: "orange" },
    { value: "terrible", label: "Terrible", emoji: "😢", color: "red" },
  ]

  const flows = [
    { value: "spotting", label: "Spotting", color: "pink", description: "Very light, brown or pink" },
    { value: "light", label: "Light", color: "red", description: "Light red, minimal" },
    { value: "medium", label: "Medium", color: "red", description: "Steady red flow" },
    { value: "heavy", label: "Heavy", color: "red", description: "Heavy, bright red" },
    { value: "very_heavy", label: "Very Heavy", color: "red", description: "Flooding, clots" },
  ]

  const cervicalMucusTypes = [
    { value: "dry", label: "Dry", description: "No mucus observed" },
    { value: "sticky", label: "Sticky", description: "Thick, tacky, minimal" },
    { value: "creamy", label: "Creamy", description: "Lotion-like, white/yellow" },
    { value: "watery", label: "Watery", description: "Thin, clear, slippery" },
    { value: "egg_white", label: "Egg White", description: "Clear, stretchy, fertile" },
  ]

  const updateSymptom = (symptomId: string, severity?: number) => {
    const currentSymptoms = formData.symptoms || []
    const symptomIndex = currentSymptoms.findIndex((s) =>
      typeof s === "string" ? s === symptomId : s.id === symptomId,
    )

    if (symptomIndex >= 0) {
      // Remove symptom
      const newSymptoms = currentSymptoms.filter((_, index) => index !== symptomIndex)
      setFormData({ ...formData, symptoms: newSymptoms })
    } else {
      // Add symptom
      const newSymptom = severity !== undefined ? { id: symptomId, severity } : symptomId
      setFormData({ ...formData, symptoms: [...currentSymptoms, newSymptom] })
    }
  }

  const isSymptomSelected = (symptomId: string) => {
    return formData.symptoms?.some((s) => (typeof s === "string" ? s === symptomId : s.id === symptomId)) || false
  }

  const getSymptomSeverity = (symptomId: string) => {
    const symptom = formData.symptoms?.find((s) => typeof s !== "string" && s.id === symptomId)
    return typeof symptom === "object" ? symptom.severity : 1
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Droplets className="w-5 h-5 text-purple-500" />
              Log Entry - {format(date, "EEEE, MMM d, yyyy")}
            </CardTitle>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          </div>
        </CardHeader>

        <CardContent>
          <Tabs defaultValue="period" className="w-full">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="period">Period</TabsTrigger>
              <TabsTrigger value="symptoms">Symptoms</TabsTrigger>
              <TabsTrigger value="mood">Mood & Notes</TabsTrigger>
              <TabsTrigger value="fertility">Fertility</TabsTrigger>
              <TabsTrigger value="health">Health Data</TabsTrigger>
            </TabsList>

            {/* Period Tab */}
            <TabsContent value="period" className="space-y-6">
              <div>
                <h3 className="font-semibold mb-4">Period Tracking</h3>
                <div className="space-y-4">
                  <label className="flex items-center gap-3 p-3 border rounded-lg hover:bg-gray-50 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.isPeriod || false}
                      onChange={(e) => setFormData({ ...formData, isPeriod: e.target.checked })}
                      className="rounded"
                    />
                    <Droplets className="w-5 h-5 text-red-500" />
                    <span className="font-medium">I'm on my period today</span>
                  </label>

                  {formData.isPeriod && (
                    <div>
                      <h4 className="font-medium mb-3">Flow Intensity</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {flows.map((flow) => (
                          <button
                            key={flow.value}
                            onClick={() => setFormData({ ...formData, flow: flow.value as any })}
                            className={`p-3 rounded-lg border-2 text-left transition-all ${
                              formData.flow === flow.value
                                ? "border-red-500 bg-red-50"
                                : "border-gray-200 hover:border-gray-300"
                            }`}
                          >
                            <div className="font-medium">{flow.label}</div>
                            <div className="text-sm text-gray-600">{flow.description}</div>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </TabsContent>

            {/* Symptoms Tab */}
            <TabsContent value="symptoms" className="space-y-6">
              <div>
                <h3 className="font-semibold mb-4">Symptoms</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {symptoms.map((symptom) => {
                    const Icon = symptom.icon
                    const isSelected = isSymptomSelected(symptom.id)
                    const severity = getSymptomSeverity(symptom.id)

                    return (
                      <div
                        key={symptom.id}
                        className={`p-4 rounded-lg border-2 transition-all ${
                          isSelected ? "border-purple-500 bg-purple-50" : "border-gray-200 hover:border-gray-300"
                        }`}
                      >
                        <button
                          onClick={() => updateSymptom(symptom.id, symptom.severity ? 1 : undefined)}
                          className="flex items-center gap-3 w-full text-left"
                        >
                          <Icon className="w-5 h-5 text-purple-500" />
                          <span className="font-medium">{symptom.label}</span>
                        </button>

                        {isSelected && symptom.severity && (
                          <div className="mt-3">
                            <label className="block text-sm font-medium mb-2">Severity</label>
                            <div className="flex gap-2">
                              {[1, 2, 3, 4, 5].map((level) => (
                                <button
                                  key={level}
                                  onClick={() => updateSymptom(symptom.id, level)}
                                  className={`w-8 h-8 rounded-full border-2 text-sm font-medium transition-all ${
                                    severity >= level
                                      ? "bg-purple-500 text-white border-purple-500"
                                      : "border-gray-300 hover:border-purple-300"
                                  }`}
                                >
                                  {level}
                                </button>
                              ))}
                            </div>
                            <div className="text-xs text-gray-600 mt-1">1 = Mild, 5 = Severe</div>
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              </div>
            </TabsContent>

            {/* Mood & Notes Tab */}
            <TabsContent value="mood" className="space-y-6">
              <div>
                <h3 className="font-semibold mb-4">How are you feeling?</h3>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                  {moods.map((mood) => (
                    <button
                      key={mood.value}
                      onClick={() => setFormData({ ...formData, mood: mood.value as any })}
                      className={`p-4 rounded-lg border-2 text-center transition-all ${
                        formData.mood === mood.value
                          ? "border-purple-500 bg-purple-50"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <div className="text-2xl mb-2">{mood.emoji}</div>
                      <div className="font-medium text-sm">{mood.label}</div>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="font-semibold mb-4">Notes</h3>
                <Textarea
                  placeholder="How are you feeling today? Any additional notes..."
                  value={formData.notes || ""}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  rows={4}
                  className="w-full"
                />
              </div>
            </TabsContent>

            {/* Fertility Tab */}
            <TabsContent value="fertility" className="space-y-6">
              <div>
                <h3 className="font-semibold mb-4">Basal Body Temperature</h3>
                <div className="flex items-center gap-4">
                  <Thermometer className="w-5 h-5 text-orange-500" />
                  <Input
                    type="number"
                    step="0.1"
                    placeholder="98.6"
                    value={formData.temperature || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, temperature: Number.parseFloat(e.target.value) || null })
                    }
                    className="w-32"
                  />
                  <span className="text-sm text-gray-600">°F</span>
                </div>
              </div>

              <div>
                <h3 className="font-semibold mb-4">Cervical Mucus</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {cervicalMucusTypes.map((type) => (
                    <button
                      key={type.value}
                      onClick={() => setFormData({ ...formData, cervicalMucus: type.value as any })}
                      className={`p-3 rounded-lg border-2 text-left transition-all ${
                        formData.cervicalMucus === type.value
                          ? "border-green-500 bg-green-50"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <div className="font-medium">{type.label}</div>
                      <div className="text-sm text-gray-600">{type.description}</div>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="flex items-center gap-3 p-3 border rounded-lg hover:bg-gray-50 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.sexualActivity || false}
                    onChange={(e) => setFormData({ ...formData, sexualActivity: e.target.checked })}
                    className="rounded"
                  />
                  <Heart className="w-5 h-5 text-pink-500" />
                  <span className="font-medium">Sexual activity</span>
                </label>
              </div>
            </TabsContent>

            {/* Health Data Tab */}
            <TabsContent value="health" className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    <Scale className="w-4 h-4 inline mr-1" />
                    Weight (lbs)
                  </label>
                  <Input
                    type="number"
                    placeholder="130"
                    value={formData.weight || ""}
                    onChange={(e) => setFormData({ ...formData, weight: Number.parseFloat(e.target.value) || null })}
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
                    value={formData.sleep || ""}
                    onChange={(e) => setFormData({ ...formData, sleep: Number.parseFloat(e.target.value) || null })}
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
                    value={formData.water || ""}
                    onChange={(e) => setFormData({ ...formData, water: Number.parseInt(e.target.value) || 0 })}
                  />
                </div>

                <div className="flex items-center">
                  <label className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={formData.exercise || false}
                      onChange={(e) => setFormData({ ...formData, exercise: e.target.checked })}
                      className="rounded"
                    />
                    <Dumbbell className="w-5 h-5 text-blue-500" />
                    <span className="font-medium">Exercised today</span>
                  </label>
                </div>
              </div>

              <div>
                <h4 className="font-medium mb-3">
                  <Pill className="w-4 h-4 inline mr-1" />
                  Medications & Supplements
                </h4>
                <Input
                  placeholder="e.g., Birth control, Vitamins, Pain relievers..."
                  value={formData.medications?.join(", ") || ""}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      medications: e.target.value
                        .split(",")
                        .map((m) => m.trim())
                        .filter(Boolean),
                    })
                  }
                />
              </div>
            </TabsContent>
          </Tabs>

          {/* Save Button */}
          <div className="flex gap-4 pt-6 border-t">
            <Button
              onClick={() => onSave(formData)}
              className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
            >
              Save Entry
            </Button>
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
