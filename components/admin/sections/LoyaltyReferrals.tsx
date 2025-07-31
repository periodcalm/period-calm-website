"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Award, Star, Crown } from "lucide-react"

const loyaltyMembers = [
  {
    id: "user-1",
    name: "Sarah Johnson",
    email: "sarah@example.com",
    points: 2450,
    tier: "Gold",
    totalSpent: 450.0,
    referrals: 3,
    joinDate: "2024-01-15",
  },
  {
    id: "user-2",
    name: "Emma Wilson",
    email: "emma@example.com",
    points: 1200,
    tier: "Silver",
    totalSpent: 280.0,
    referrals: 1,
    joinDate: "2024-02-01",
  },
]

const referralData = [
  {
    id: "ref-1",
    referrer: "Sarah Johnson",
    referred: "Jessica Brown",
    status: "completed",
    reward: 50,
    date: "2024-01-20",
  },
  {
    id: "ref-2",
    referrer: "Emma Wilson",
    referred: "Michael Davis",
    status: "pending",
    reward: 50,
    date: "2024-01-22",
  },
]

export function LoyaltyReferrals() {
  const getTierBadge = (tier: string) => {
    const tierConfig = {
      Bronze: { color: "bg-orange-100 text-orange-800", icon: Award },
      Silver: { color: "bg-gray-100 text-gray-800", icon: Star },
      Gold: { color: "bg-yellow-100 text-yellow-800", icon: Crown },
    }

    const config = tierConfig[tier as keyof typeof tierConfig] || tierConfig.Bronze
    const Icon = config.icon

    return (
      <Badge className={config.color}>
        <Icon className="w-3 h-3 mr-1" />
        {tier}
      </Badge>
    )
  }

  const getStatusBadge = (status: string) => {
    return status === "completed" ? (
      <Badge className="bg-green-100 text-green-800">Completed</Badge>
    ) : (
      <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Loyalty & Referrals</h1>
        <p className="text-gray-600 mt-2">Manage customer loyalty program and referral system</p>
      </div>

      {/* Program Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Members</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{loyaltyMembers.length}</div>
            <p className="text-xs text-muted-foreground">Active loyalty members</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Points Issued</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {loyaltyMembers.reduce((sum, member) => sum + member.points, 0).toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">Total points distributed</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Successful Referrals</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {referralData.filter((r) => r.status === "completed").length}
            </div>
            <p className="text-xs text-muted-foreground">Completed referrals</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Referral Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              ${referralData.filter((r) => r.status === "completed").reduce((sum, r) => sum + r.reward, 0)}
            </div>
            <p className="text-xs text-muted-foreground">From referrals</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Loyalty Program */}
        <Card>
          <CardHeader>
            <CardTitle>Loyalty Program</CardTitle>
            <CardDescription>Manage customer loyalty tiers and rewards</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-semibold mb-2">Tier Structure</h3>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="flex items-center gap-2">
                      <Award className="w-4 h-4 text-orange-500" />
                      Bronze (0-999 points)
                    </span>
                    <span className="text-sm text-gray-500">5% cashback</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="flex items-center gap-2">
                      <Star className="w-4 h-4 text-gray-500" />
                      Silver (1000-2499 points)
                    </span>
                    <span className="text-sm text-gray-500">10% cashback</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="flex items-center gap-2">
                      <Crown className="w-4 h-4 text-yellow-500" />
                      Gold (2500+ points)
                    </span>
                    <span className="text-sm text-gray-500">15% cashback</span>
                  </div>
                </div>
              </div>

              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Member</TableHead>
                    <TableHead>Points</TableHead>
                    <TableHead>Tier</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loyaltyMembers.map((member) => (
                    <TableRow key={member.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{member.name}</div>
                          <div className="text-sm text-gray-500">{member.email}</div>
                        </div>
                      </TableCell>
                      <TableCell className="font-medium">{member.points.toLocaleString()}</TableCell>
                      <TableCell>{getTierBadge(member.tier)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {/* Referral Program */}
        <Card>
          <CardHeader>
            <CardTitle>Referral Program</CardTitle>
            <CardDescription>Track referral performance and rewards</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-semibold mb-2">Referral Settings</h3>
                <div className="space-y-2">
                  <p className="text-sm">
                    <strong>Referrer Reward:</strong> $25 credit
                  </p>
                  <p className="text-sm">
                    <strong>Referee Reward:</strong> 20% off first order
                  </p>
                  <p className="text-sm">
                    <strong>Minimum Order:</strong> $50
                  </p>
                </div>
              </div>

              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Referrer</TableHead>
                    <TableHead>Referred</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Reward</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {referralData.map((referral) => (
                    <TableRow key={referral.id}>
                      <TableCell className="font-medium">{referral.referrer}</TableCell>
                      <TableCell>{referral.referred}</TableCell>
                      <TableCell>{getStatusBadge(referral.status)}</TableCell>
                      <TableCell>${referral.reward}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Program Configuration */}
      <Card>
        <CardHeader>
          <CardTitle>Program Configuration</CardTitle>
          <CardDescription>Adjust loyalty and referral program settings</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="font-semibold">Loyalty Settings</h3>
              <div className="space-y-2">
                <div>
                  <label className="text-sm font-medium">Points per $1 spent</label>
                  <Input type="number" defaultValue="10" className="mt-1" />
                </div>
                <div>
                  <label className="text-sm font-medium">Bronze tier threshold</label>
                  <Input type="number" defaultValue="0" className="mt-1" />
                </div>
                <div>
                  <label className="text-sm font-medium">Silver tier threshold</label>
                  <Input type="number" defaultValue="1000" className="mt-1" />
                </div>
                <div>
                  <label className="text-sm font-medium">Gold tier threshold</label>
                  <Input type="number" defaultValue="2500" className="mt-1" />
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="font-semibold">Referral Settings</h3>
              <div className="space-y-2">
                <div>
                  <label className="text-sm font-medium">Referrer reward ($)</label>
                  <Input type="number" defaultValue="25" className="mt-1" />
                </div>
                <div>
                  <label className="text-sm font-medium">Referee discount (%)</label>
                  <Input type="number" defaultValue="20" className="mt-1" />
                </div>
                <div>
                  <label className="text-sm font-medium">Minimum order value ($)</label>
                  <Input type="number" defaultValue="50" className="mt-1" />
                </div>
                <div>
                  <label className="text-sm font-medium">Referral link expiry (days)</label>
                  <Input type="number" defaultValue="30" className="mt-1" />
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end mt-6">
            <Button>Save Settings</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
