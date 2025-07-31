"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Plus, Mail, MessageSquare, TrendingUp, Eye, Edit, Trash2 } from "lucide-react"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

const campaigns = [
  {
    id: "camp-1",
    name: "Welcome Series",
    type: "email",
    status: "active",
    sent: 1250,
    opened: 875,
    clicked: 156,
    converted: 23,
    revenue: 1150.0,
    createdAt: "2024-01-15",
  },
  {
    id: "camp-2",
    name: "Product Launch",
    type: "social",
    status: "completed",
    sent: 5000,
    opened: 3200,
    clicked: 480,
    converted: 67,
    revenue: 3350.0,
    createdAt: "2024-01-10",
  },
]

const performanceData = [
  { month: "Jan", campaigns: 3, revenue: 4500, conversions: 89 },
  { month: "Feb", campaigns: 2, revenue: 3200, conversions: 64 },
  { month: "Mar", campaigns: 4, revenue: 5800, conversions: 112 },
  { month: "Apr", campaigns: 3, revenue: 4200, conversions: 78 },
  { month: "May", campaigns: 5, revenue: 6500, conversions: 134 },
  { month: "Jun", campaigns: 4, revenue: 5200, conversions: 98 },
]

export function MarketingCampaigns() {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)

  const getStatusBadge = (status: string) => {
    const colors = {
      active: "bg-green-100 text-green-800",
      paused: "bg-yellow-100 text-yellow-800",
      completed: "bg-blue-100 text-blue-800",
      draft: "bg-gray-100 text-gray-800",
    }

    return (
      <Badge className={colors[status as keyof typeof colors] || colors.draft}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    )
  }

  const getTypeBadge = (type: string) => {
    const typeConfig = {
      email: { color: "bg-blue-100 text-blue-800", icon: Mail },
      social: { color: "bg-purple-100 text-purple-800", icon: MessageSquare },
      paid: { color: "bg-green-100 text-green-800", icon: TrendingUp },
    }

    const config = typeConfig[type as keyof typeof typeConfig] || typeConfig.email
    const Icon = config.icon

    return (
      <Badge className={config.color}>
        <Icon className="w-3 h-3 mr-1" />
        {type.charAt(0).toUpperCase() + type.slice(1)}
      </Badge>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Marketing Campaigns</h1>
          <p className="text-gray-600 mt-2">Create and manage marketing campaigns across channels</p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Create Campaign
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Campaign</DialogTitle>
              <DialogDescription>Set up a new marketing campaign</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">Campaign Name</label>
                <Input placeholder="Enter campaign name" className="mt-1" />
              </div>
              <div>
                <label className="text-sm font-medium">Campaign Type</label>
                <select className="w-full mt-1 p-2 border rounded-md">
                  <option value="email">Email</option>
                  <option value="social">Social Media</option>
                  <option value="paid">Paid Advertising</option>
                </select>
              </div>
              <div>
                <label className="text-sm font-medium">Target Audience</label>
                <Input placeholder="Define target audience" className="mt-1" />
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={() => setIsCreateDialogOpen(false)}>Create Campaign</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Campaign Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Active Campaigns</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{campaigns.filter((c) => c.status === "active").length}</div>
            <p className="text-xs text-muted-foreground">Currently running</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Sent</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{campaigns.reduce((sum, c) => sum + c.sent, 0).toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Messages sent</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {(
                (campaigns.reduce((sum, c) => sum + c.converted, 0) / campaigns.reduce((sum, c) => sum + c.sent, 0)) *
                100
              ).toFixed(1)}
              %
            </div>
            <p className="text-xs text-muted-foreground">Average conversion</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Revenue Generated</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              ${campaigns.reduce((sum, c) => sum + c.revenue, 0).toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">From campaigns</p>
          </CardContent>
        </Card>
      </div>

      {/* Performance Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Campaign Performance</CardTitle>
          <CardDescription>Monthly campaign metrics and revenue</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={performanceData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="revenue" fill="#8884d8" name="Revenue ($)" />
              <Bar dataKey="conversions" fill="#82ca9d" name="Conversions" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Campaigns Table */}
      <Card>
        <CardHeader>
          <CardTitle>Campaign Management</CardTitle>
          <CardDescription>Monitor and manage all marketing campaigns</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Campaign</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Sent</TableHead>
                <TableHead>Open Rate</TableHead>
                <TableHead>Click Rate</TableHead>
                <TableHead>Conversions</TableHead>
                <TableHead>Revenue</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {campaigns.map((campaign) => (
                <TableRow key={campaign.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{campaign.name}</div>
                      <div className="text-sm text-gray-500">
                        Created {new Date(campaign.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{getTypeBadge(campaign.type)}</TableCell>
                  <TableCell>{getStatusBadge(campaign.status)}</TableCell>
                  <TableCell className="font-medium">{campaign.sent.toLocaleString()}</TableCell>
                  <TableCell>
                    <div>
                      <span className="font-medium">{((campaign.opened / campaign.sent) * 100).toFixed(1)}%</span>
                      <div className="text-sm text-gray-500">{campaign.opened.toLocaleString()} opens</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <span className="font-medium">{((campaign.clicked / campaign.sent) * 100).toFixed(1)}%</span>
                      <div className="text-sm text-gray-500">{campaign.clicked.toLocaleString()} clicks</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <span className="font-medium">{campaign.converted}</span>
                      <div className="text-sm text-gray-500">
                        {((campaign.converted / campaign.sent) * 100).toFixed(1)}% rate
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="font-medium">${campaign.revenue.toFixed(2)}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="sm">
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
