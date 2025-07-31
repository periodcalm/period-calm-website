"use client"

import { AdminSidebar } from "./AdminSidebar"
import { AdminHeader } from "./AdminHeader"
import { DashboardOverview } from "./sections/DashboardOverview"
import { ProductsManagement } from "./sections/ProductsManagement"
import { OrdersManagement } from "./sections/OrdersManagement"
import { SubscriptionsManagement } from "./sections/SubscriptionsManagement"
import { SupportTickets } from "./sections/SupportTickets"
import { CustomersManagement } from "./sections/CustomersManagement"
import { MarketingCampaigns } from "./sections/MarketingCampaigns"
import { LoyaltyReferrals } from "./sections/LoyaltyReferrals"
import { InventoryWholesale } from "./sections/InventoryWholesale"
import { AnalyticsReporting } from "./sections/AnalyticsReporting"
import { AdminSettings } from "./sections/AdminSettings"
import { AuditLogs } from "./sections/AuditLogs"
import { useAdminStore } from "@/lib/admin-store"

export function AdminDashboard() {
  const { activeSection } = useAdminStore()

  const renderActiveSection = () => {
    switch (activeSection) {
      case "dashboard":
        return <DashboardOverview />
      case "products":
        return <ProductsManagement />
      case "orders":
        return <OrdersManagement />
      case "customers":
        return <CustomersManagement />
      case "subscriptions":
        return <SubscriptionsManagement />
      case "marketing":
        return <MarketingCampaigns />
      case "loyalty":
        return <LoyaltyReferrals />
      case "inventory":
        return <InventoryWholesale />
      case "analytics":
        return <AnalyticsReporting />
      case "settings":
        return <AdminSettings />
      case "audit-logs":
        return <AuditLogs />
      case "support-tickets":
        return <SupportTickets />
      case "support":
        return <SupportTickets />
      default:
        return <DashboardOverview />
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        <AdminSidebar />
        <div className="flex-1 flex flex-col">
          <AdminHeader />
          <main className="flex-1 p-6">{renderActiveSection()}</main>
        </div>
      </div>
    </div>
  )
}
