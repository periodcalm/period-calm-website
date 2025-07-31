"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Bell, CreditCard, Globe, Users, Plus, Trash2 } from "lucide-react"
import { useAuthStore } from "@/lib/auth-store"
import { toast } from "@/hooks/use-toast"

const adminUsers = [
  {
    id: "admin-1",
    name: "John Doe",
    email: "john@periodcalm.com",
    role: "Super Admin",
    status: "active",
    lastLogin: "2024-01-20T10:30:00Z",
    permissions: ["all"],
  },
  {
    id: "admin-2",
    name: "Jane Smith",
    email: "jane@periodcalm.com",
    role: "Admin",
    status: "active",
    lastLogin: "2024-01-19T14:15:00Z",
    permissions: ["products", "orders", "customers"],
  },
]

export function AdminSettings() {
  const { user } = useAuthStore()
  const [profileData, setProfileData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: "",
    bio: "",
  })
  const [siteSettings, setSiteSettings] = useState({
    siteName: "Period Calm",
    siteDescription: "Natural solutions for menstrual wellness",
    contactEmail: "hello@periodcalm.com",
    supportEmail: "support@periodcalm.com",
    phone: "+1-555-0123",
    address: "123 Wellness St, Health City, HC 12345",
  })
  const [notifications, setNotifications] = useState({
    emailNotifications: true,
    orderAlerts: true,
    inventoryAlerts: true,
    supportTickets: true,
    marketingUpdates: false,
  })

  const handleProfileUpdate = () => {
    toast({ title: "Profile updated successfully" })
  }

  const handleSiteSettingsUpdate = () => {
    toast({ title: "Site settings updated successfully" })
  }

  const handleNotificationUpdate = () => {
    toast({ title: "Notification preferences updated" })
  }

  const getRoleBadge = (role: string) => {
    const colors = {
      "Super Admin": "bg-red-100 text-red-800",
      Admin: "bg-blue-100 text-blue-800",
      Manager: "bg-green-100 text-green-800",
      Support: "bg-yellow-100 text-yellow-800",
    }

    return <Badge className={colors[role as keyof typeof colors] || colors.Admin}>{role}</Badge>
  }

  const getStatusBadge = (status: string) => {
    return status === "active" ? (
      <Badge className="bg-green-100 text-green-800">Active</Badge>
    ) : (
      <Badge className="bg-red-100 text-red-800">Inactive</Badge>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Admin Settings</h1>
        <p className="text-gray-600 mt-2">Manage your profile, site settings, and admin controls</p>
      </div>

      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="site">Site Settings</TabsTrigger>
          <TabsTrigger value="admins">Admin Users</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="integrations">Integrations</TabsTrigger>
        </TabsList>

        <TabsContent value="profile">
          <Card>
            <CardHeader>
              <CardTitle>Admin Profile</CardTitle>
              <CardDescription>Update your personal information and preferences</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center gap-6">
                <Avatar className="w-20 h-20">
                  <AvatarImage src={user?.avatar || "/placeholder.svg"} />
                  <AvatarFallback>{user?.name?.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <Button variant="outline">Change Photo</Button>
                  <p className="text-sm text-gray-500 mt-2">JPG, GIF or PNG. 1MB max.</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    value={profileData.name}
                    onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    value={profileData.email}
                    onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    value={profileData.phone}
                    onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="role">Role</Label>
                  <Input id="role" value="Super Admin" disabled />
                </div>
              </div>

              <div>
                <Label htmlFor="bio">Bio</Label>
                <Textarea
                  id="bio"
                  placeholder="Tell us about yourself..."
                  value={profileData.bio}
                  onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })}
                />
              </div>

              <Button onClick={handleProfileUpdate}>Update Profile</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="site">
          <Card>
            <CardHeader>
              <CardTitle>Site Settings</CardTitle>
              <CardDescription>Configure general site information and contact details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="siteName">Site Name</Label>
                  <Input
                    id="siteName"
                    value={siteSettings.siteName}
                    onChange={(e) => setSiteSettings({ ...siteSettings, siteName: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="contactEmail">Contact Email</Label>
                  <Input
                    id="contactEmail"
                    type="email"
                    value={siteSettings.contactEmail}
                    onChange={(e) => setSiteSettings({ ...siteSettings, contactEmail: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="supportEmail">Support Email</Label>
                  <Input
                    id="supportEmail"
                    type="email"
                    value={siteSettings.supportEmail}
                    onChange={(e) => setSiteSettings({ ...siteSettings, supportEmail: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    value={siteSettings.phone}
                    onChange={(e) => setSiteSettings({ ...siteSettings, phone: e.target.value })}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="siteDescription">Site Description</Label>
                <Textarea
                  id="siteDescription"
                  value={siteSettings.siteDescription}
                  onChange={(e) => setSiteSettings({ ...siteSettings, siteDescription: e.target.value })}
                />
              </div>

              <div>
                <Label htmlFor="address">Business Address</Label>
                <Textarea
                  id="address"
                  value={siteSettings.address}
                  onChange={(e) => setSiteSettings({ ...siteSettings, address: e.target.value })}
                />
              </div>

              <Button onClick={handleSiteSettingsUpdate}>Update Settings</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="admins">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Admin Users</CardTitle>
                  <CardDescription>Manage admin users and their permissions</CardDescription>
                </div>
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Admin
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>User</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Last Login</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {adminUsers.map((admin) => (
                    <TableRow key={admin.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="w-8 h-8">
                            <AvatarFallback>{admin.name.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium">{admin.name}</div>
                            <div className="text-sm text-gray-500">{admin.email}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{getRoleBadge(admin.role)}</TableCell>
                      <TableCell>{getStatusBadge(admin.status)}</TableCell>
                      <TableCell className="text-sm">{new Date(admin.lastLogin).toLocaleDateString()}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button variant="ghost" size="sm">
                            Edit
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
        </TabsContent>

        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>Notification Preferences</CardTitle>
              <CardDescription>Configure when and how you receive notifications</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="emailNotifications">Email Notifications</Label>
                    <p className="text-sm text-gray-500">Receive notifications via email</p>
                  </div>
                  <Switch
                    id="emailNotifications"
                    checked={notifications.emailNotifications}
                    onCheckedChange={(checked) => setNotifications({ ...notifications, emailNotifications: checked })}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="orderAlerts">Order Alerts</Label>
                    <p className="text-sm text-gray-500">Get notified about new orders</p>
                  </div>
                  <Switch
                    id="orderAlerts"
                    checked={notifications.orderAlerts}
                    onCheckedChange={(checked) => setNotifications({ ...notifications, orderAlerts: checked })}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="inventoryAlerts">Inventory Alerts</Label>
                    <p className="text-sm text-gray-500">Low stock and reorder notifications</p>
                  </div>
                  <Switch
                    id="inventoryAlerts"
                    checked={notifications.inventoryAlerts}
                    onCheckedChange={(checked) => setNotifications({ ...notifications, inventoryAlerts: checked })}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="supportTickets">Support Tickets</Label>
                    <p className="text-sm text-gray-500">New support ticket notifications</p>
                  </div>
                  <Switch
                    id="supportTickets"
                    checked={notifications.supportTickets}
                    onCheckedChange={(checked) => setNotifications({ ...notifications, supportTickets: checked })}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="marketingUpdates">Marketing Updates</Label>
                    <p className="text-sm text-gray-500">Campaign performance and marketing insights</p>
                  </div>
                  <Switch
                    id="marketingUpdates"
                    checked={notifications.marketingUpdates}
                    onCheckedChange={(checked) => setNotifications({ ...notifications, marketingUpdates: checked })}
                  />
                </div>
              </div>

              <Button onClick={handleNotificationUpdate}>Save Preferences</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security">
          <Card>
            <CardHeader>
              <CardTitle>Security Settings</CardTitle>
              <CardDescription>Manage your account security and authentication</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="font-semibold mb-4">Change Password</h3>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="currentPassword">Current Password</Label>
                    <Input id="currentPassword" type="password" />
                  </div>
                  <div>
                    <Label htmlFor="newPassword">New Password</Label>
                    <Input id="newPassword" type="password" />
                  </div>
                  <div>
                    <Label htmlFor="confirmPassword">Confirm New Password</Label>
                    <Input id="confirmPassword" type="password" />
                  </div>
                  <Button>Update Password</Button>
                </div>
              </div>

              <div>
                <h3 className="font-semibold mb-4">Two-Factor Authentication</h3>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Enable 2FA</p>
                    <p className="text-sm text-gray-500">Add an extra layer of security to your account</p>
                  </div>
                  <Button variant="outline">Setup 2FA</Button>
                </div>
              </div>

              <div>
                <h3 className="font-semibold mb-4">Active Sessions</h3>
                <div className="space-y-2">
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium">Current Session</p>
                      <p className="text-sm text-gray-500">Chrome on macOS • New York, NY</p>
                    </div>
                    <Badge className="bg-green-100 text-green-800">Active</Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="integrations">
          <Card>
            <CardHeader>
              <CardTitle>Integrations</CardTitle>
              <CardDescription>Connect with third-party services and tools</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                        <CreditCard className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold">Stripe</h3>
                        <p className="text-sm text-gray-500">Payment processing</p>
                      </div>
                    </div>
                    <Badge className="bg-green-100 text-green-800">Connected</Badge>
                  </div>
                  <Button variant="outline" size="sm">
                    Configure
                  </Button>
                </div>

                <div className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                        <Globe className="w-5 h-5 text-purple-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold">Google Analytics</h3>
                        <p className="text-sm text-gray-500">Website analytics</p>
                      </div>
                    </div>
                    <Badge className="bg-gray-100 text-gray-800">Not Connected</Badge>
                  </div>
                  <Button variant="outline" size="sm">
                    Connect
                  </Button>
                </div>

                <div className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                        <Bell className="w-5 h-5 text-green-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold">Mailchimp</h3>
                        <p className="text-sm text-gray-500">Email marketing</p>
                      </div>
                    </div>
                    <Badge className="bg-green-100 text-green-800">Connected</Badge>
                  </div>
                  <Button variant="outline" size="sm">
                    Configure
                  </Button>
                </div>

                <div className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                        <Users className="w-5 h-5 text-orange-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold">Zendesk</h3>
                        <p className="text-sm text-gray-500">Customer support</p>
                      </div>
                    </div>
                    <Badge className="bg-gray-100 text-gray-800">Not Connected</Badge>
                  </div>
                  <Button variant="outline" size="sm">
                    Connect
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
