"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuthStore } from "@/lib/auth-store"
import { AdminDashboard } from "@/components/admin/AdminDashboard"

export default function AdminPage() {
  const { user, isAuthenticated } = useAuthStore()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check authentication and admin role
    if (!isAuthenticated) {
      router.push("/auth/signin?redirect=/admin")
      return
    }

    if (user?.role !== "ADMIN") {
      router.push("/account")
      return
    }

    setIsLoading(false)
  }, [isAuthenticated, user, router])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-rose-500"></div>
      </div>
    )
  }

  if (!isAuthenticated || user?.role !== "ADMIN") {
    return null
  }

  return <AdminDashboard />
}
