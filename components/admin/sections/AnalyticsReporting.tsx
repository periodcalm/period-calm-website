"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Line,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
} from "recharts"
import { Download, TrendingUp } from "lucide-react"

const salesData = [
  { month: "Jan", revenue: 12000, orders: 45, customers: 38 },
  { month: "Feb", revenue: 15000, orders: 52, customers: 44 },
  { month: "Mar", revenue: 18000, orders: 61, customers: 52 },
  { month: "Apr", revenue: 22000, orders: 73, customers: 61 },
  { month: "May", revenue: 25000, orders: 84, customers: 71 },
  { month: "Jun", revenue: 28000, orders: 92, customers: 78 },
]

const customerSegments = [
  { name: "New Customers", value: 35, color: "#8884d8" },
  { name: "Returning Customers", value: 45, color: "#82ca9d" },
  { name: "VIP Customers", value: 20, color: "#ffc658" },
]

const productPerformance = [
  { product: "Period Calm Supplement", sales: 450, revenue: 13500 },
  { product: "Period Calm Tea", sales: 280, revenue: 5600 },
  { product: "Wellness Bundle", sales: 120, revenue: 7200 },
  { product: "Monthly Subscription", sales: 95, revenue: 2565 },
]

const trafficSources = [
  { source: "Organic Search", visitors: 2400, conversions: 48 },
  { source: "Social Media", visitors: 1800, conversions: 36 },
  { source: "Direct", visitors: 1200, conversions: 32 },
  { source: "Email Marketing", visitors: 800, conversions: 28 },
  { source: "Paid Ads", visitors: 600, conversions: 24 },
]

export function AnalyticsReporting() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Analytics & Reporting</h1>
          <p className="text-gray-600 mt-2">Comprehensive business insights and performance metrics</p>
        </div>
        <div className="flex gap-2">
          <Select defaultValue="30days">
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7days">Last 7 days</SelectItem>
              <SelectItem value="30days">Last 30 days</SelectItem>
              <SelectItem value="90days">Last 90 days</SelectItem>
              <SelectItem value="1year">Last year</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export Report
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$120,000</div>
            <div className="flex items-center text-xs text-green-600">
              <TrendingUp className="h-3 w-3 mr-1" />
              +12.5% from last month
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">407</div>
            <div className="flex items-center text-xs text-green-600">
              <TrendingUp className="h-3 w-3 mr-1" />
              +8.2% from last month
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">New Customers</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">344</div>
            <div className="flex items-center text-xs text-green-600">
              <TrendingUp className="h-3 w-3 mr-1" />
              +15.3% from last month
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Avg Order Value</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$294.84</div>
            <div className="flex items-center text-xs text-green-600">
              <TrendingUp className="h-3 w-3 mr-1" />
              +3.1% from last month
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Revenue and Orders Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Revenue & Orders Trend</CardTitle>
          <CardDescription>Monthly revenue and order volume over time</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={400}>
            <AreaChart data={salesData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis yAxisId="left" />
              <YAxis yAxisId="right" orientation="right" />
              <Tooltip />
              <Area
                yAxisId="left"
                type="monotone"
                dataKey="revenue"
                stackId="1"
                stroke="#8884d8"
                fill="#8884d8"
                fillOpacity={0.6}
              />
              <Line yAxisId="right" type="monotone" dataKey="orders" stroke="#82ca9d" strokeWidth={3} />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Customer Segments */}
        <Card>
          <CardHeader>
            <CardTitle>Customer Segments</CardTitle>
            <CardDescription>Distribution of customer types</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={customerSegments}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, value }) => `${name}: ${value}%`}
                >
                  {customerSegments.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Product Performance */}
        <Card>
          <CardHeader>
            <CardTitle>Product Performance</CardTitle>
            <CardDescription>Sales and revenue by product</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={productPerformance} layout="horizontal">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis dataKey="product" type="category" width={120} />
                <Tooltip />
                <Bar dataKey="sales" fill="#8884d8" name="Units Sold" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Traffic Sources */}
      <Card>
        <CardHeader>
          <CardTitle>Traffic Sources & Conversions</CardTitle>
          <CardDescription>Website traffic sources and their conversion rates</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={trafficSources}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="source" />
              <YAxis yAxisId="left" />
              <YAxis yAxisId="right" orientation="right" />
              <Tooltip />
              <Bar yAxisId="left" dataKey="visitors" fill="#8884d8" name="Visitors" />
              <Bar yAxisId="right" dataKey="conversions" fill="#82ca9d" name="Conversions" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Detailed Analytics Table */}
      <Card>
        <CardHeader>
          <CardTitle>Detailed Performance Metrics</CardTitle>
          <CardDescription>Comprehensive breakdown of key performance indicators</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-4">
              <h3 className="font-semibold">Sales Metrics</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Gross Revenue</span>
                  <span className="font-medium">$120,000</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Net Revenue</span>
                  <span className="font-medium">$108,000</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Refunds</span>
                  <span className="font-medium">$2,400</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Avg Order Value</span>
                  <span className="font-medium">$294.84</span>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="font-semibold">Customer Metrics</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Total Customers</span>
                  <span className="font-medium">1,247</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">New Customers</span>
                  <span className="font-medium">344</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Returning Rate</span>
                  <span className="font-medium">68.5%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Customer LTV</span>
                  <span className="font-medium">$485.20</span>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="font-semibold">Conversion Metrics</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Conversion Rate</span>
                  <span className="font-medium">3.2%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Cart Abandonment</span>
                  <span className="font-medium">68.4%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Email Open Rate</span>
                  <span className="font-medium">24.8%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Email Click Rate</span>
                  <span className="font-medium">4.2%</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
