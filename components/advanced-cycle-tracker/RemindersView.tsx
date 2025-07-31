"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Bell, Plus, Clock, Calendar, AlertCircle } from "lucide-react"

export default function RemindersView() {
  const [reminders, setReminders] = useState([
    {
      id: 1,
      type: "period_start",
      title: "Period Start Reminder",
      description: "Get notified 2 days before your expected period",
      enabled: true,
      time: "09:00",
      daysBefore: 2
    },
    {
      id: 2,
      type: "ovulation",
      title: "Ovulation Reminder",
      description: "Track your fertile window",
      enabled: true,
      time: "10:00",
      daysBefore: 0
    },
    {
      id: 3,
      type: "medication",
      title: "Medication Reminder",
      description: "Take your supplements",
      enabled: false,
      time: "08:00",
      daysBefore: 0
    }
  ])

  const toggleReminder = (id: number) => {
    setReminders(prev => 
      prev.map(reminder => 
        reminder.id === id 
          ? { ...reminder, enabled: !reminder.enabled }
          : reminder
      )
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Reminders</h2>
        <Button className="flex items-center">
          <Plus className="w-4 h-4 mr-2" />
          Add Reminder
        </Button>
      </div>

      <div className="space-y-4">
        {reminders.map((reminder) => (
          <Card key={reminder.id} className="border-l-4 border-l-blue-500">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center text-lg">
                  <Bell className="w-5 h-5 mr-2 text-blue-500" />
                  {reminder.title}
                </CardTitle>
                <div className="flex items-center space-x-3">
                  <Badge variant={reminder.enabled ? "default" : "secondary"}>
                    {reminder.enabled ? "Active" : "Inactive"}
                  </Badge>
                  <Switch
                    checked={reminder.enabled}
                    onCheckedChange={() => toggleReminder(reminder.id)}
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <p className="text-gray-600">{reminder.description}</p>
                
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center text-gray-500">
                    <Clock className="w-4 h-4 mr-1" />
                    {reminder.time}
                  </div>
                  
                  {reminder.daysBefore > 0 && (
                    <div className="flex items-center text-gray-500">
                      <Calendar className="w-4 h-4 mr-1" />
                      {reminder.daysBefore} days before
                    </div>
                  )}
                </div>

                <div className="flex space-x-2">
                  <Button variant="outline" size="sm">
                    Edit
                  </Button>
                  <Button variant="outline" size="sm">
                    Test
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Notification Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <AlertCircle className="w-5 h-5 mr-2 text-orange-500" />
            Notification Settings
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Push Notifications</p>
                <p className="text-sm text-gray-600">Receive notifications on your device</p>
              </div>
              <Switch defaultChecked />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Email Notifications</p>
                <p className="text-sm text-gray-600">Get reminders via email</p>
              </div>
              <Switch />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">SMS Notifications</p>
                <p className="text-sm text-gray-600">Receive text message reminders</p>
              </div>
              <Switch />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 