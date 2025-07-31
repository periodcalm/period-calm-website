"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

const inventoryItems = [
  {
    id: "inv-1",
    productName: "Period Calm Supplement",
    sku: "PC-001",
    currentStock: 150,
    reorderLevel: 50,
    reorderQuantity: 200,
    supplier: "Natural Health Co.",
    lastRestocked: "2024-01-15",
    status: "in-stock",
  },
  {
    id: "inv-2",
    productName: "Period Calm Tea Blend",
    sku: "PC-002",
    currentStock: 25,
    reorderLevel: 30,
    reorderQuantity: 100,
    supplier: "Herbal Solutions Ltd.",
    lastRestocked: "2024-01-10",
    status: "low-stock",
  },
]

const wholesaleApplications = [
  {
    id: "ws-1",
    companyName: "Wellness Pharmacy Chain",
    contactName: "John Smith",
    email: "john@wellnesspharmacy.com",
    phone: "+1-555-0123",
    businessType: "Pharmacy",
    status: "pending",
    appliedDate: "2024-01-20",
    estimatedVolume: "500 units/month",
  },
  {
    id: "ws-2",
    companyName: "Natural Health Store",
    contactName: "	 Johnson",
    email: "mary@naturalhealthstore.com",
    phone: "+1-555-0456",
    businessType: "Retail Store",
    status: "approved",
    appliedDate: "2024-01-18",
    estimatedVolume: "200 units/month",
  },
]

export function InventoryWholesale() {
  const getStockStatus = (currentStock: number, reorderLevel: number) => {
    if (currentStock <= reorderLevel) {
      return <Badge className="bg-red-100 text-red-800">Low Stock</Badge>
    } else if (currentStock <= reorderLevel * 1.5) {
      return <Badge className="bg-yellow-100 text-yellow-800">Medium Stock</Badge>
    } else {
      return <Badge className="bg-green-100 text-green-800">In Stock</Badge>
    }
  }

  const getApplicationStatus = (status: string) => {
    const colors = {
      pending: "bg-yellow-100 text-yellow-800",
      approved: "bg-green-100 text-green-800",
      rejected: "bg-red-100 text-red-800",
      under_review: "bg-blue-100 text-blue-800",
    }

    return (
      <Badge className={colors[status as keyof typeof colors] || colors.pending}>
        {status.charAt(0).toUpperCase() + status.slice(1).replace("_", " ")}
      </Badge>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Inventory & Wholesale</h1>
        <p className="text-gray-600 mt-2">Manage inventory levels and wholesale partnerships</p>
      </div>

      {/* Inventory Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Products</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{inventoryItems.length}</div>
            <p className="text-xs text-muted-foreground">In inventory</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Low Stock Items</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {inventoryItems.filter((item) => item.currentStock <= item.reorderLevel).length}
            </div>
            <p className="text-xs text-muted-foreground">Need reordering</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Stock Value</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">$12,450</div>
            <p className="text-xs text-muted-foreground">Current inventory value</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Wholesale Partners</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {wholesaleApplications.filter((app) => app.status === "approved").length}
            </div>
            <p className="text-xs text-muted-foreground">Active partners</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Inventory Management */}
        <Card>
          <CardHeader>
            <CardTitle>Inventory Management</CardTitle>
            <CardDescription>Monitor stock levels and reorder alerts</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Product</TableHead>
                  <TableHead>Stock</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {inventoryItems.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{item.productName}</div>
                        <div className="text-sm text-gray-500">{item.sku}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{item.currentStock} units</div>
                        <div className="text-sm text-gray-500">Reorder at {item.reorderLevel}</div>
                      </div>
                    </TableCell>
                    <TableCell>{getStockStatus(item.currentStock, item.reorderLevel)}</TableCell>
                    <TableCell>
                      <Button size="sm" variant="outline">
                        Reorder
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Wholesale Applications */}
        <Card>
          <CardHeader>
            <CardTitle>Wholesale Applications</CardTitle>
            <CardDescription>Review and manage wholesale partnership requests</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Company</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {wholesaleApplications.map((application) => (
                  <TableRow key={application.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{application.companyName}</div>
                        <div className="text-sm text-gray-500">{application.businessType}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{application.contactName}</div>
                        <div className="text-sm text-gray-500">{application.email}</div>
                      </div>
                    </TableCell>
                    <TableCell>{getApplicationStatus(application.status)}</TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline">
                          Review
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

      {/* Detailed Inventory Table */}
      <Card>
        <CardHeader>
          <CardTitle>Detailed Inventory</CardTitle>
          <CardDescription>Complete inventory management and supplier information</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Product</TableHead>
                <TableHead>Current Stock</TableHead>
                <TableHead>Reorder Level</TableHead>
                <TableHead>Reorder Qty</TableHead>
                <TableHead>Supplier</TableHead>
                <TableHead>Last Restocked</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {inventoryItems.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{item.productName}</div>
                      <div className="text-sm text-gray-500">{item.sku}</div>
                    </div>
                  </TableCell>
                  <TableCell className="font-medium">{item.currentStock}</TableCell>
                  <TableCell>{item.reorderLevel}</TableCell>
                  <TableCell>{item.reorderQuantity}</TableCell>
                  <TableCell>{item.supplier}</TableCell>
                  <TableCell>{new Date(item.lastRestocked).toLocaleDateString()}</TableCell>
                  <TableCell>{getStockStatus(item.currentStock, item.reorderLevel)}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline">
                        Edit
                      </Button>
                      <Button size="sm">Reorder</Button>
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
