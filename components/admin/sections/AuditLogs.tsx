"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Filter, Download, User, Package, ShoppingCart, Settings } from "lucide-react"
import { Button } from "@/components/ui/button"

const auditLogs = [
  {
    id: "log-1",
    timestamp: "2024-01-20T10:30:00Z",
    user: "John Doe",
    action: "Product Updated",
    resource: "Period Calm Supplement",
    resourceType: "product",
    details: "Updated price from $39.99 to $29.99",
    ipAddress: "192.168.1.100",
    userAgent: "Chrome/120.0.0.0",
  },
  {
    id: "log-2",
    timestamp: "2024-01-20T09:15:00Z",
    user: "Jane Smith",
    action: "Order Status Changed",
    resource: "ORD-001",
    resourceType: "order",
    details: "Changed status from pending to processing",
    ipAddress: "192.168.1.101",
    userAgent: "Firefox/121.0.0.0",
  },
  {
    id: "log-3",
    timestamp: "2024-01-20T08:45:00Z",
    user: "John Doe",
    action: "User Login",
    resource: "Admin Dashboard",
    resourceType: "auth",
    details: "Successful login to admin dashboard",
    ipAddress: "192.168.1.100",
    userAgent: "Chrome/120.0.0.0",
  },
  {
    id: "log-4",
    timestamp: "2024-01-19T16:20:00Z",
    user: "Jane Smith",
    action: "Support Ticket Resolved",
    resource: "TKT-001",
    resourceType: "support",
    details: "Marked ticket as resolved and sent response",
    ipAddress: "192.168.1.101",
    userAgent: "Firefox/121.0.0.0",
  },
  {
    id: "log-5",
    timestamp: "2024-01-19T14:30:00Z",
    user: "John Doe",
    action: "Settings Updated",
    resource: "Site Configuration",
    resourceType: "settings",
    details: "Updated notification preferences",
    ipAddress: "192.168.1.100",
    userAgent: "Chrome/120.0.0.0",
  },
]

export function AuditLogs() {
  const [searchTerm, setSearchTerm] = useState("")
  const [filterUser, setFilterUser] = useState<string>("all")
  const [filterAction, setFilterAction] = useState<string>("all")
  const [filterResource, setFilterResource] = useState<string>("all")

  const filteredLogs = auditLogs.filter((log) => {
    const matchesSearch =
      log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.resource.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.details.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesUser = filterUser === "all" || log.user === filterUser
    const matchesAction = filterAction === "all" || log.action.toLowerCase().includes(filterAction.toLowerCase())
    const matchesResource = filterResource === "all" || log.resourceType === filterResource

    return matchesSearch && matchesUser && matchesAction && matchesResource
  })

  const getActionBadge = (action: string) => {
    const actionColors = {
      "Product Updated": "bg-blue-100 text-blue-800",
      "Order Status Changed": "bg-green-100 text-green-800",
      "User Login": "bg-gray-100 text-gray-800",
      "Support Ticket Resolved": "bg-purple-100 text-purple-800",
      "Settings Updated": "bg-orange-100 text-orange-800",
    }

    return (
      <Badge className={actionColors[action as keyof typeof actionColors] || "bg-gray-100 text-gray-800"}>
        {action}
      </Badge>
    )
  }

  const getResourceIcon = (resourceType: string) => {
    const icons = {
      product: Package,
      order: ShoppingCart,
      auth: User,
      support: User,
      settings: Settings,
    }

    const Icon = icons[resourceType as keyof typeof icons] || User
    return <Icon className="w-4 h-4" />
  }

  const exportLogs = () => {
    // In a real application, this would generate and download a CSV/PDF
    console.log("Exporting audit logs...")
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Audit Logs</h1>
          <p className="text-gray-600 mt-2">Track all administrative actions and system changes</p>
        </div>
        <Button onClick={exportLogs} variant="outline">
          <Download className="w-4 h-4 mr-2" />
          Export Logs
        </Button>
      </div>

      {/* Log Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{auditLogs.length}</div>
            <p className="text-xs text-muted-foreground">Last 30 days</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Unique Users</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{new Set(auditLogs.map((log) => log.user)).size}</div>
            <p className="text-xs text-muted-foreground">Active admins</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Product Changes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {auditLogs.filter((log) => log.resourceType === "product").length}
            </div>
            <p className="text-xs text-muted-foreground">Product modifications</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Order Updates</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {auditLogs.filter((log) => log.resourceType === "order").length}
            </div>
            <p className="text-xs text-muted-foreground">Order modifications</p>
          </CardContent>
        </Card>
      </div>

      {/* Audit Logs Table */}
      <Card>
        <CardHeader>
          <CardTitle>Activity Log</CardTitle>
          <CardDescription>Detailed record of all administrative actions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search logs by action, resource, or details..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={filterUser} onValueChange={setFilterUser}>
              <SelectTrigger className="w-40">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue placeholder="User" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Users</SelectItem>
                <SelectItem value="John Doe">John Doe</SelectItem>
                <SelectItem value="Jane Smith">Jane Smith</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filterAction} onValueChange={setFilterAction}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Action" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Actions</SelectItem>
                <SelectItem value="updated">Updated</SelectItem>
                <SelectItem value="created">Created</SelectItem>
                <SelectItem value="deleted">Deleted</SelectItem>
                <SelectItem value="login">Login</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filterResource} onValueChange={setFilterResource}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Resource" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Resources</SelectItem>
                <SelectItem value="product">Products</SelectItem>
                <SelectItem value="order">Orders</SelectItem>
                <SelectItem value="auth">Authentication</SelectItem>
                <SelectItem value="support">Support</SelectItem>
                <SelectItem value="settings">Settings</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Timestamp</TableHead>
                <TableHead>User</TableHead>
                <TableHead>Action</TableHead>
                <TableHead>Resource</TableHead>
                <TableHead>Details</TableHead>
                <TableHead>IP Address</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredLogs.map((log) => (
                <TableRow key={log.id}>
                  <TableCell className="text-sm">{new Date(log.timestamp).toLocaleString()}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4 text-gray-400" />
                      <span className="font-medium">{log.user}</span>
                    </div>
                  </TableCell>
                  <TableCell>{getActionBadge(log.action)}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {getResourceIcon(log.resourceType)}
                      <span>{log.resource}</span>
                    </div>
                  </TableCell>
                  <TableCell className="max-w-xs">
                    <div className="text-sm text-gray-600 truncate" title={log.details}>
                      {log.details}
                    </div>
                  </TableCell>
                  <TableCell className="text-sm font-mono">{log.ipAddress}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {filteredLogs.length === 0 && (
            <div className="text-center py-8">
              <p className="text-gray-500">No audit logs found matching your criteria.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
