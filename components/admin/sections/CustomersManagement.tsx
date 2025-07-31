"use client"

import { DialogClose } from "@/components/ui/dialog"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Plus, Edit, Trash2, Users } from "lucide-react"
import { toast } from "sonner"
import { useProfileStore } from "@/lib/customer-store"

interface Customer {
  id: string
  full_name: string
  email: string
  phone: string
  address: string
  totalOrders: number
  totalSpent: number
  lastOrderDate: string
  status: "active" | "inactive" | "vip"
  notes?: string
}

export function CustomersManagement() {
  const { profiles, loading, error, fetchProfiles, addProfile, updateProfile, deleteProfile } = useProfileStore()
  const [newCustomer, setNewCustomer] = useState({
    full_name: "",
    email: "",
    phone: "",
    address: "",
    status: "active",
    notes: "",
  })
  const [editingCustomer, setEditingCustomer] = useState<any>(null)

  useEffect(() => {
    fetchProfiles()
  }, [fetchProfiles])

  const handleAddCustomer = async () => {
    if (!newCustomer.full_name || !newCustomer.email) {
      toast.error("Please fill all required fields for the customer.")
      return
    }
    try {
      await addProfile(newCustomer)
      toast.success("Customer added successfully!")
      setNewCustomer({ full_name: "", email: "", phone: "", address: "", status: "active", notes: "" })
    } catch {
      toast.error("Failed to add customer.")
    }
  }

  const handleUpdateCustomer = async () => {
    if (editingCustomer) {
      try {
        await updateProfile(editingCustomer.id, editingCustomer)
        toast.success("Customer updated successfully!")
        setEditingCustomer(null)
      } catch {
        toast.error("Failed to update customer.")
      }
    }
  }

  const handleDeleteCustomer = async (id: string) => {
    if (confirm("Are you sure you want to delete this customer?")) {
      try {
        await deleteProfile(id)
        toast.success("Customer deleted.")
      } catch {
        toast.error("Failed to delete customer.")
      }
    }
  }

  const getStatusColor = (status: Customer["status"]) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800"
      case "inactive":
        return "bg-gray-100 text-gray-800"
      case "vip":
        return "bg-purple-100 text-purple-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900">Customers Management</h1>
      <p className="text-gray-600 mt-1">View and manage your customer base.</p>

      {/* Customer List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              <Users className="w-5 h-5" />
              All Customers
            </span>
            <Dialog>
              <DialogTrigger asChild>
                <Button
                  size="sm"
                  onClick={() =>
                    setNewCustomer({ full_name: "", email: "", phone: "", address: "", status: "active", notes: "" })
                  }
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Customer
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Add New Customer</DialogTitle>
                  <DialogDescription>Manually add a new customer to your database.</DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="new-full_name">Full Name *</Label>
                      <Input
                        id="new-full_name"
                        value={newCustomer.full_name}
                        onChange={(e) => setNewCustomer({ ...newCustomer, full_name: e.target.value })}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="new-email">Email *</Label>
                      <Input
                        id="new-email"
                        type="email"
                        value={newCustomer.email}
                        onChange={(e) => setNewCustomer({ ...newCustomer, email: e.target.value })}
                        required
                      />
                    </div>
                  </div>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="new-phone">Phone</Label>
                      <Input
                        id="new-phone"
                        type="tel"
                        value={newCustomer.phone}
                        onChange={(e) => setNewCustomer({ ...newCustomer, phone: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="new-status">Status</Label>
                      <Select
                        value={newCustomer.status}
                        onValueChange={(value) =>
                          setNewCustomer({ ...newCustomer, status: value as Customer["status"] })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="active">Active</SelectItem>
                          <SelectItem value="inactive">Inactive</SelectItem>
                          <SelectItem value="vip">VIP</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="new-address">Address</Label>
                    <Textarea
                      id="new-address"
                      value={newCustomer.address}
                      onChange={(e) => setNewCustomer({ ...newCustomer, address: e.target.value })}
                      rows={3}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="new-notes">Notes</Label>
                    <Textarea
                      id="new-notes"
                      value={newCustomer.notes}
                      onChange={(e) => setNewCustomer({ ...newCustomer, notes: e.target.value })}
                      rows={2}
                    />
                  </div>
                </div>
                <DialogFooter>
                  <DialogClose asChild>
                    <Button variant="outline">Cancel</Button>
                  </DialogClose>
                  <Button onClick={handleAddCustomer}>Add Customer</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Customer Name</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Address</TableHead>
                  <TableHead>Orders</TableHead>
                  <TableHead>Total Spent</TableHead>
                  <TableHead>Last Order</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading && <TableRow><TableCell colSpan={8} className="text-center">Loading customers...</TableCell></TableRow>}
                {error && <TableRow><TableCell colSpan={8} className="text-center text-red-500">{error}</TableCell></TableRow>}
                {!loading && !error && profiles.map((customer) => (
                  <TableRow key={customer.id}>
                    <TableCell className="font-medium">{customer.full_name}</TableCell>
                    <TableCell>
                      {customer.email}
                      <br />
                      <span className="text-xs text-gray-500">{customer.phone}</span>
                    </TableCell>
                    <TableCell className="max-w-[200px] truncate">{customer.address}</TableCell>
                    <TableCell>{customer.totalOrders}</TableCell>
                    <TableCell>₹{customer.totalSpent.toLocaleString()}</TableCell>
                    <TableCell>{customer.lastOrderDate}</TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(customer.status)}>{customer.status}</Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button size="sm" variant="outline" onClick={() => setEditingCustomer(customer)}>
                              <Edit className="w-4 h-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-2xl">
                            <DialogHeader>
                              <DialogTitle>Edit Customer</DialogTitle>
                              <DialogDescription>Update the details of this customer.</DialogDescription>
                            </DialogHeader>
                            <div className="space-y-4">
                              <div className="grid md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                  <Label htmlFor="edit-full_name">Full Name *</Label>
                                  <Input
                                    id="edit-full_name"
                                    value={editingCustomer?.full_name || ""}
                                    onChange={(e) => setEditingCustomer({ ...editingCustomer!, full_name: e.target.value })}
                                    required
                                  />
                                </div>
                                <div className="space-y-2">
                                  <Label htmlFor="edit-email">Email *</Label>
                                  <Input
                                    id="edit-email"
                                    type="email"
                                    value={editingCustomer?.email || ""}
                                    onChange={(e) => setEditingCustomer({ ...editingCustomer!, email: e.target.value })}
                                    required
                                  />
                                </div>
                              </div>
                              <div className="grid md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                  <Label htmlFor="edit-phone">Phone</Label>
                                  <Input
                                    id="edit-phone"
                                    type="tel"
                                    value={editingCustomer?.phone || ""}
                                    onChange={(e) => setEditingCustomer({ ...editingCustomer!, phone: e.target.value })}
                                  />
                                </div>
                                <div className="space-y-2">
                                  <Label htmlFor="edit-status">Status</Label>
                                  <Select
                                    value={editingCustomer?.status || "active"}
                                    onValueChange={(value) =>
                                      setEditingCustomer({ ...editingCustomer!, status: value as Customer["status"] })
                                    }
                                  >
                                    <SelectTrigger>
                                      <SelectValue placeholder="Select status" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="active">Active</SelectItem>
                                      <SelectItem value="inactive">Inactive</SelectItem>
                                      <SelectItem value="vip">VIP</SelectItem>
                                    </SelectContent>
                                  </Select>
                                </div>
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor="edit-address">Address</Label>
                                <Textarea
                                  id="edit-address"
                                  value={editingCustomer?.address || ""}
                                  onChange={(e) => setEditingCustomer({ ...editingCustomer!, address: e.target.value })}
                                  rows={3}
                                />
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor="edit-notes">Notes</Label>
                                <Textarea
                                  id="edit-notes"
                                  value={editingCustomer?.notes || ""}
                                  onChange={(e) => setEditingCustomer({ ...editingCustomer!, notes: e.target.value })}
                                  rows={2}
                                />
                              </div>
                            </div>
                            <DialogFooter>
                              <DialogClose asChild>
                                <Button variant="outline">Cancel</Button>
                              </DialogClose>
                              <Button onClick={handleUpdateCustomer}>Update Customer</Button>
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>
                        <Button size="sm" variant="destructive" onClick={() => handleDeleteCustomer(customer.id)}>
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
