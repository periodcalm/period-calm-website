"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Settings, Bell, Shield, Palette, Download, Trash2, User, Lock } from "lucide-react"

export default function SettingsView() {
  const [settings, setSettings] = useState({
    notifications: {
      periodReminders: true,
      ovulationAlerts: true,
      symptomTracking: false,
      emailNotifications: true,
      pushNotifications: true
    },
    privacy: {
      shareData: false,
      anonymousMode: true,
      dataRetention: "1 year"
    },
    appearance: {
      theme: "light",
      compactMode: false,
      showPredictions: true
    }
  })

  const toggleSetting = (category: string, setting: string) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category as keyof typeof prev],
        [setting]: !prev[category as keyof typeof prev][setting as keyof typeof prev[typeof category]]
      }
    }))
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Settings</h2>
        <p className="text-gray-600">Customize your experience and manage your data</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Notifications */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center text-lg">
              <Bell className="w-5 h-5 mr-2 text-blue-500" />
              Notifications
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Period Reminders</p>
                <p className="text-sm text-gray-600">Get notified before your period starts</p>
              </div>
              <Switch
                checked={settings.notifications.periodReminders}
                onCheckedChange={() => toggleSetting("notifications", "periodReminders")}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Ovulation Alerts</p>
                <p className="text-sm text-gray-600">Fertility window notifications</p>
              </div>
              <Switch
                checked={settings.notifications.ovulationAlerts}
                onCheckedChange={() => toggleSetting("notifications", "ovulationAlerts")}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Symptom Tracking</p>
                <p className="text-sm text-gray-600">Daily symptom reminders</p>
              </div>
              <Switch
                checked={settings.notifications.symptomTracking}
                onCheckedChange={() => toggleSetting("notifications", "symptomTracking")}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Email Notifications</p>
                <p className="text-sm text-gray-600">Receive updates via email</p>
              </div>
              <Switch
                checked={settings.notifications.emailNotifications}
                onCheckedChange={() => toggleSetting("notifications", "emailNotifications")}
              />
            </div>
          </CardContent>
        </Card>

        {/* Privacy & Security */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center text-lg">
              <Shield className="w-5 h-5 mr-2 text-green-500" />
              Privacy & Security
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Anonymous Mode</p>
                <p className="text-sm text-gray-600">Hide personal information</p>
              </div>
              <Switch
                checked={settings.privacy.anonymousMode}
                onCheckedChange={() => toggleSetting("privacy", "anonymousMode")}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Data Sharing</p>
                <p className="text-sm text-gray-600">Share anonymized data for research</p>
              </div>
              <Switch
                checked={settings.privacy.shareData}
                onCheckedChange={() => toggleSetting("privacy", "shareData")}
              />
            </div>
            
            <div>
              <label className="text-sm font-medium text-gray-700">Data Retention</label>
              <Select value={settings.privacy.dataRetention}>
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="3 months">3 months</SelectItem>
                  <SelectItem value="6 months">6 months</SelectItem>
                  <SelectItem value="1 year">1 year</SelectItem>
                  <SelectItem value="forever">Forever</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Appearance */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center text-lg">
              <Palette className="w-5 h-5 mr-2 text-purple-500" />
              Appearance
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-700">Theme</label>
              <Select value={settings.appearance.theme}>
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="light">Light</SelectItem>
                  <SelectItem value="dark">Dark</SelectItem>
                  <SelectItem value="auto">Auto</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Compact Mode</p>
                <p className="text-sm text-gray-600">Reduce spacing for more content</p>
              </div>
              <Switch
                checked={settings.appearance.compactMode}
                onCheckedChange={() => toggleSetting("appearance", "compactMode")}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Show Predictions</p>
                <p className="text-sm text-gray-600">Display period predictions</p>
              </div>
              <Switch
                checked={settings.appearance.showPredictions}
                onCheckedChange={() => toggleSetting("appearance", "showPredictions")}
              />
            </div>
          </CardContent>
        </Card>

        {/* Data Management */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center text-lg">
              <User className="w-5 h-5 mr-2 text-orange-500" />
              Data Management
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <Button variant="outline" className="w-full justify-start">
                <Download className="w-4 h-4 mr-2" />
                Export My Data
              </Button>
              
              <Button variant="outline" className="w-full justify-start">
                <Lock className="w-4 h-4 mr-2" />
                Change Password
              </Button>
              
              <Button variant="outline" className="w-full justify-start text-red-600 hover:text-red-700">
                <Trash2 className="w-4 h-4 mr-2" />
                Delete Account
              </Button>
            </div>
            
            <div className="pt-4 border-t">
              <p className="text-sm text-gray-600">
                Last updated: {new Date().toLocaleDateString()}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Account Info */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center text-lg">
            <Settings className="w-5 h-5 mr-2 text-gray-500" />
            Account Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700">Email</label>
              <p className="text-gray-900">user@example.com</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Member Since</label>
              <p className="text-gray-900">January 2024</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Data Points</label>
              <p className="text-gray-900">156 entries</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Account Status</label>
              <Badge variant="default" className="text-xs">Active</Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 