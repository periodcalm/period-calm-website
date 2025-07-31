"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Search, Eye, RefreshCw, Pause, Play, X } from "lucide-react"
import { useAdminStore, type Subscription } from "@/lib/admin-store"
import { format } from "date-fns"
import { toast } from "sonner"

export function SubscriptionsManagement() {
  const { subscriptions, updateSubscriptionStatus } = useAdminStore()
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")

  const filteredSubscriptions = subscriptions.filter((subscription) => {
    const matchesSearch =
      subscription.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      subscription.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      subscription.customerEmail.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || subscription.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const getStatusColor = (status: Subscription["status"]) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800 border-green-200"
      case "paused":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "cancelled":
        return "bg-red-100 text-red-800 border-red-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const handleStatusUpdate = (subscriptionId: string, newStatus: Subscription["status"]) => {
    updateSubscriptionStatus(subscriptionId, newStatus)
    toast.success(`Subscription ${newStatus}`)
  }

  const subscriptionStats = {
    total: subscriptions.length,
    active: subscriptions.filter((s) => s.status === "active").length,
    paused: subscriptions.filter((s) => s.status === "paused").length,
    cancelled: subscriptions.filter((s) => s.status === "cancelled").length,
    revenue: subscriptions.filter((s) => s.status === "active").reduce((sum, s) => sum + s.amount, 0),
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Subscriptions Management</h1>
          <p className="text-gray-600 mt-1">Manage customer subscriptions and recurring billing</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <RefreshCw className="w-5 h-5 text-blue-500" />
              <div>
                <p className="text-sm text-gray-600">Total Subscriptions</p>
                <p className="text-2xl font-bold">{subscriptionStats.total}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 bg-green-500 rounded-full"></div>
              <div>
                <p className="text-sm text-gray-600">Active</p>
                <p className="text-2xl font-bold">{subscriptionStats.active}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Pause className="w-5 h-5 text-yellow-500" />
              <div>
                <p className="text-sm text-gray-600">Paused</p>
                <p className="text-2xl font-bold">{subscriptionStats.paused}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <X className="w-5 h-5 text-red-500" />
              <div>
                <p className="text-sm text-gray-600">Cancelled</p>
                <p className="text-2xl font-bold">{subscriptionStats.cancelled}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 bg-purple-500 rounded-full"></div>
              <div>
                <p className="text-sm text-gray-600">Monthly Revenue</p>
                <p className="text-2xl font-bold">₹{subscriptionStats.revenue.toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search subscriptions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="paused">Paused</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Subscriptions Table */}
      <Card>
        <CardHeader>
          <CardTitle>Subscriptions ({filteredSubscriptions.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Subscription ID</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Plan</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Next Billing</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredSubscriptions.map((subscription) => (
                <TableRow key={subscription.id}>
                  <TableCell className="font-mono text-sm">{subscription.id}</TableCell>
                  <TableCell>
                    <div>
                      <p className="font-medium">{subscription.customerName}</p>
                      <p className="text-sm text-gray-500">{subscription.customerEmail}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="font-medium">{subscription.plan}</p>
                      <p className="text-sm text-gray-500 capitalize">{subscription.frequency}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(subscription.status)}>{subscription.status}</Badge>
                  </TableCell>
                  <TableCell>₹{subscription.amount.toLocaleString()}</TableCell>
                  <TableCell>{format(new Date(subscription.nextBilling), "MMM dd, yyyy")}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="outline" size="sm">
                            <Eye className="w-4 h-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl">
                          <DialogHeader>
                            <DialogTitle>Subscription Details - {subscription.id}</DialogTitle>
                            <DialogDescription>Manage subscription settings and billing information</DialogDescription>
                          </DialogHeader>
                          <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <h4 className="font-medium mb-2">Customer Information</h4>
                                <p className="text-sm">{subscription.customerName}</p>
                                <p className="text-sm text-gray-600">{subscription.customerEmail}</p>
                              </div>
                              <div>
                                <h4 className="font-medium mb-2">Subscription Status</h4>
                                <Select
                                  value={subscription.status}
                                  onValueChange={(value: Subscription["status"]) =>
                                    handleStatusUpdate(subscription.id, value)
                                  }
                                >
                                  <SelectTrigger>
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="active">Active</SelectItem>
                                    <SelectItem value="paused">Paused</SelectItem>
                                    <SelectItem value="cancelled">Cancelled</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <h4 className="font-medium mb-2">Plan Details</h4>
                                <p className="text-sm">{subscription.plan}</p>
                                <p className="text-sm text-gray-600 capitalize">{subscription.frequency} billing</p>
                              </div>
                              <div>
                                <h4 className="font-medium mb-2">Billing Information</h4>
                                <p className="text-sm">₹{subscription.amount.toLocaleString()}</p>
                                <p className="text-sm text-gray-600">
                                  Next billing: {format(new Date(subscription.nextBilling), "MMM dd, yyyy")}
                                </p>
                              </div>
                            </div>

                            <div>
                              <h4 className="font-medium mb-2">Subscription History</h4>
                              <div className="space-y-2">
                                <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                                  <span className="text-sm">Started</span>
                                  <span className="text-sm">
                                    {format(new Date(subscription.createdAt), "MMM dd, yyyy")}
                                  </span>
                                </div>
                                <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                                  <span className="text-sm">Status</span>
                                  <Badge className={getStatusColor(subscription.status)}>{subscription.status}</Badge>
                                </div>
                              </div>
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>

                      {subscription.status === "active" && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleStatusUpdate(subscription.id, "paused")}
                        >
                          <Pause className="w-4 h-4" />
                        </Button>
                      )}

                      {subscription.status === "paused" && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleStatusUpdate(subscription.id, "active")}
                        >
                          <Play className="w-4 h-4" />
                        </Button>
                      )}
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
