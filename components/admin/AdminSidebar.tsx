"use client"

import { cn } from "@/lib/utils"
import { useAdminStore } from "@/lib/admin-store"
import { LayoutDashboard, Package, ShoppingCart, Users, CreditCard, Megaphone, Gift, Warehouse, BarChart2, Settings, FileText, LifeBuoy, LogOut } from "lucide-react"
import { useAuthStore } from "@/lib/auth-store"
import { useRouter } from "next/navigation"

const navigation = [
  { name: "Dashboard", icon: LayoutDashboard, key: "dashboard" },
  { name: "Products", icon: Package, key: "products" },
  { name: "Orders", icon: ShoppingCart, key: "orders" },
  { name: "Customers", icon: Users, key: "customers" },
  { name: "Subscriptions", icon: CreditCard, key: "subscriptions" },
  { name: "Marketing", icon: Megaphone, key: "marketing" },
  { name: "Loyalty & Referrals", icon: Gift, key: "loyalty" },
  { name: "Inventory & Wholesale", icon: Warehouse, key: "inventory" },
  { name: "Analytics & Reporting", icon: BarChart2, key: "analytics" },
  { name: "Settings", icon: Settings, key: "settings" },
  { name: "Audit Logs", icon: FileText, key: "audit-logs" },
  { name: "Support Tickets", icon: LifeBuoy, key: "support-tickets" },
]

export function AdminSidebar() {
  const { activeSection, setActiveSection } = useAdminStore()
  const { logout } = useAuthStore()
  const router = useRouter()

  const handleLogout = () => {
    logout()
    router.push("/")
  }

  return (
    <div className="w-64 bg-white shadow-lg border-r border-gray-200">
      <div className="p-6">
        <h1 className="text-2xl font-bold text-gray-900">Period Calm</h1>
        <p className="text-sm text-gray-600">Admin Dashboard</p>
      </div>

      <nav className="mt-6">
        <div className="px-3">
          {navigation.map((item) => {
            const Icon = item.icon
            return (
              <button
                key={item.key}
                onClick={() => setActiveSection(item.key)}
                className={cn(
                  "w-full flex items-center px-3 py-2 text-sm font-medium rounded-lg mb-1 transition-colors",
                  activeSection === item.key
                    ? "bg-rose-100 text-rose-700 border-r-2 border-rose-500"
                    : "text-gray-600 hover:bg-gray-100 hover:text-gray-900",
                )}
              >
                <Icon className="w-5 h-5 mr-3" />
                {item.name}
              </button>
            )
          })}
        </div>

        <div className="mt-8 pt-6 border-t border-gray-200 px-3">
          <button
            onClick={handleLogout}
            className="w-full flex items-center px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 hover:text-gray-900 rounded-lg transition-colors"
          >
            <LogOut className="w-5 h-5 mr-3" />
            Logout
          </button>
        </div>
      </nav>
    </div>
  )
}
