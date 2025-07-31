"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useAdminStore } from "@/lib/admin-store"
import { Users, ShoppingCart, DollarSign, Package, AlertTriangle } from "lucide-react"

export function DashboardOverview() {
  const { products, orders, subscriptions, supportTickets } = useAdminStore()

  const stats = [
    {
      title: "Total Revenue",
      value: "₹1,25,847",
      change: "+12.5%",
      icon: DollarSign,
      color: "text-green-600",
    },
    {
      title: "Total Orders",
      value: orders.length.toString(),
      change: "+8.2%",
      icon: ShoppingCart,
      color: "text-blue-600",
    },
    {
      title: "Active Subscriptions",
      value: subscriptions.filter((s) => s.status === "active").length.toString(),
      change: "+15.3%",
      icon: Users,
      color: "text-purple-600",
    },
    {
      title: "Products",
      value: products.length.toString(),
      change: "0%",
      icon: Package,
      color: "text-orange-600",
    },
  ]

  const recentOrders = orders.slice(0, 5)
  const openTickets = supportTickets.filter((t) => t.status === "open")

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard Overview</h1>
        <p className="text-gray-600 mt-1">Welcome back! Here's what's happening with your business.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon
          return (
            <Card key={index}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">{stat.title}</p>
                    <p className="text-2xl font-bold">{stat.value}</p>
                    <p className={`text-sm ${stat.change.startsWith("+") ? "text-green-600" : "text-red-600"}`}>
                      {stat.change} from last month
                    </p>
                  </div>
                  <Icon className={`w-8 h-8 ${stat.color}`} />
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Recent Orders */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Orders</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentOrders.map((order) => (
                <div key={order.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium">{order.customerName}</p>
                    <p className="text-sm text-gray-600">{order.id}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">₹{order.total.toLocaleString()}</p>
                    <span
                      className={`text-xs px-2 py-1 rounded-full ${
                        order.status === "delivered"
                          ? "bg-green-100 text-green-800"
                          : order.status === "shipped"
                            ? "bg-blue-100 text-blue-800"
                            : order.status === "processing"
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {order.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Support Tickets */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              Support Tickets
              {openTickets.length > 0 && (
                <span className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded-full">
                  {openTickets.length} open
                </span>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {supportTickets.slice(0, 5).map((ticket) => (
                <div key={ticket.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium">{ticket.subject}</p>
                    <p className="text-sm text-gray-600">{ticket.customerName}</p>
                  </div>
                  <div className="text-right">
                    <span
                      className={`text-xs px-2 py-1 rounded-full ${
                        ticket.priority === "high"
                          ? "bg-red-100 text-red-800"
                          : ticket.priority === "medium"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-green-100 text-green-800"
                      }`}
                    >
                      {ticket.priority}
                    </span>
                    <p className="text-xs text-gray-500 mt-1">{ticket.status}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Low Stock Alert */}
      {products.some((p) => p.stock < 10) && (
        <Card className="border-orange-200 bg-orange-50">
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <AlertTriangle className="w-6 h-6 text-orange-600" />
              <div>
                <h3 className="font-semibold text-orange-800">Low Stock Alert</h3>
                <p className="text-orange-700">
                  {products.filter((p) => p.stock < 10).length} product(s) are running low on stock.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
