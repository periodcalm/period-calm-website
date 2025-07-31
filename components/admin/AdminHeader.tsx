"use client"

import { Bell, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { useAdminStore } from "@/lib/admin-store"
import { useAuthStore } from "@/lib/auth-store"
import Link from "next/link"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Menu, LayoutDashboard, Package, ShoppingCart, Users, CreditCard, Megaphone, Gift, Warehouse, BarChart2, Settings, FileText, LifeBuoy } from "lucide-react"
import { useRouter } from "next/navigation"

export function AdminHeader() {
  const { notifications, markNotificationRead } = useAdminStore()
  const { user } = useAuthStore()
  const unreadCount = notifications.filter((n: { read: boolean }) => !n.read).length
  const { setActiveSection } = useAdminStore()
  const router = useRouter()
  const navItems = [
    { name: "Dashboard", icon: LayoutDashboard, section: "dashboard" },
    { name: "Products", icon: Package, section: "products" },
    { name: "Orders", icon: ShoppingCart, section: "orders" },
    { name: "Customers", icon: Users, section: "customers" },
    { name: "Subscriptions", icon: CreditCard, section: "subscriptions" },
    { name: "Marketing", icon: Megaphone, section: "marketing" },
    { name: "Loyalty & Referrals", icon: Gift, section: "loyalty" },
    { name: "Inventory & Wholesale", icon: Warehouse, section: "inventory" },
    { name: "Analytics & Reporting", icon: BarChart2, section: "analytics" },
    { name: "Settings", icon: Settings, section: "settings" },
    { name: "Audit Logs", icon: FileText, section: "audit-logs" },
    { name: "Support Tickets", icon: LifeBuoy, section: "support-tickets" },
  ]

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="flex items-center justify-between px-6 py-4">
        {/* Mobile Navigation */}
        <Sheet>
          <SheetTrigger asChild>
            <Button type="button">
              <Menu className="h-6 w-6" />
              <span className="sr-only">Toggle navigation menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left">
            {[
              <div key="header" className="flex items-center gap-2 font-semibold mb-4">
                <LayoutDashboard className="h-6 w-6" />
                <span>Period Calm Admin</span>
              </div>,
              <nav key="nav" className="grid gap-2 text-lg font-medium">
                {navItems.map((item) => {
                  const Icon = item.icon
                  return (
                    <button
                      key={item.section}
                      className="flex items-center gap-4 rounded-xl px-3 py-2 text-gray-700 hover:text-rose-700"
                      onClick={() => {
                        setActiveSection(item.section)
                      }}
                    >
                      <Icon className="h-5 w-5" />
                      {item.name}
                    </button>
                  )
                })}
              </nav>
            ]}
          </SheetContent>
        </Sheet>
        {/* Search Bar */}
        <div className="flex-1 flex items-center space-x-4">
          <div className="relative w-full max-w-xs">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input placeholder="Search..." className="pl-10 w-full" />
          </div>
        </div>
        {/* Notification Bell & User Info */}
        <div className="flex items-center space-x-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button type="button">
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                  <Badge style={{ position: 'absolute', top: '-0.25rem', right: '-0.25rem', height: '1.25rem', width: '1.25rem', borderRadius: '9999px', padding: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem' }}>
                    {unreadCount}
                  </Badge>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80">
              <div className="p-2">
                <h3 className="font-semibold mb-2">Notifications</h3>
                {notifications.slice(0, 5).map((notification: { id: string; title: string; time: string; message: string; read: boolean }) => (
                  <DropdownMenuItem
                    key={notification.id}
                    className="flex flex-col items-start p-3 cursor-pointer"
                    onClick={() => markNotificationRead(notification.id)}
                  >
                    <div className="flex items-center justify-between w-full">
                      <span className="font-medium text-sm">{notification.title}</span>
                      <span className="text-xs text-gray-500">{notification.time}</span>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">{notification.message}</p>
                    {!notification.read && <div className="w-2 h-2 bg-blue-500 rounded-full mt-1"></div>}
                  </DropdownMenuItem>
                ))}
              </div>
            </DropdownMenuContent>
          </DropdownMenu>
          {/* User Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button type="button">
                <span className="text-white text-sm font-medium bg-rose-500 rounded-full w-8 h-8 flex items-center justify-center">{user?.name?.charAt(0) || "A"}</span>
                <span className="sr-only">Toggle user menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>{user?.name || "My Account"}</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => setActiveSection("settings")}>Settings</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setActiveSection("support-tickets")}>Support</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => { router.push("/"); }}>Logout</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}
