"use client"

import { useState, useEffect } from "react"
import type { NotificationData } from "../types"

export function useNotifications() {
  const [notifications, setNotifications] = useState<NotificationData[]>([])
  const [permission, setPermission] = useState<NotificationPermission>("default")

  useEffect(() => {
    // Check notification permission
    if ("Notification" in window) {
      setPermission(Notification.permission)
    }

    // Load scheduled notifications
    const savedNotifications = localStorage.getItem("cycle-tracker-notifications")
    if (savedNotifications) {
      try {
        const parsed = JSON.parse(savedNotifications)
        setNotifications(
          parsed.map((n: any) => ({
            ...n,
            scheduledFor: new Date(n.scheduledFor),
          })),
        )
      } catch (error) {
        console.error("Error loading notifications:", error)
      }
    }
  }, [])

  useEffect(() => {
    // Save notifications to localStorage
    localStorage.setItem("cycle-tracker-notifications", JSON.stringify(notifications))
  }, [notifications])

  const requestPermission = async () => {
    if ("Notification" in window) {
      const result = await Notification.requestPermission()
      setPermission(result)
      return result === "granted"
    }
    return false
  }

  const scheduleNotification = (notification: Omit<NotificationData, "id">) => {
    const id = Date.now().toString()
    const newNotification: NotificationData = {
      ...notification,
      id,
    }

    setNotifications((prev) => [...prev, newNotification])

    // Schedule browser notification if permission granted
    if (permission === "granted") {
      const timeUntilNotification = notification.scheduledFor.getTime() - Date.now()

      if (timeUntilNotification > 0) {
        setTimeout(() => {
          new Notification(notification.title, {
            body: notification.message,
            icon: "/favicon.ico",
            badge: "/favicon.ico",
          })
        }, timeUntilNotification)
      }
    }

    return id
  }

  const cancelNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id))
  }

  const updateNotification = (id: string, updates: Partial<NotificationData>) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, ...updates } : n)))
  }

  return {
    notifications,
    permission,
    requestPermission,
    scheduleNotification,
    cancelNotification,
    updateNotification,
  }
}
