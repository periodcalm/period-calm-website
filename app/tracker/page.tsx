import CycleTrackerApp from "@/components/advanced-cycle-tracker/CycleTrackerApp"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Advanced Cycle Tracker - AI-Powered Period Tracking | Period Calm",
  description:
    "Best-in-class menstrual cycle tracker with AI predictions, comprehensive symptom tracking, fertility insights, and personalized health recommendations.",
  keywords:
    "period tracker, menstrual cycle app, fertility tracking, symptom tracker, BBT tracking, ovulation predictor",
}

export default function TrackerPage() {
  return (
    <div className="min-h-screen pt-20">
      <CycleTrackerApp />
    </div>
  )
}
