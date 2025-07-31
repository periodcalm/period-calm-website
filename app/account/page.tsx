"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuthStore } from "@/lib/auth-store"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import {
  User,
  Package,
  RefreshCw,
  Gift,
  Users,
  MessageCircle,
  Heart,
  Settings,
  Mail,
  CalendarIcon,
  Share2,
  Copy,
  Plus,
  Eye,
  EyeOff,
  Star,
  Award,
  Edit,
  Pause,
  X,
  Download,
  Filter,
  Search,
  Bell,
  Shield,
  Moon,
  Sun,
  Camera,
  Check,
  AlertCircle,
  TrendingUp,
  Activity,
  Zap,
  Target,
  BarChart3,
  Phone,
  MapPin,
  CreditCard,
  Truck,
  Package2,
  Clock,
  CheckCircle,
  XCircle,
  Info,
  ExternalLink,
  Smartphone,
  Globe,
  Lock,
  UserCheck,
  DollarSign,
  Percent,
  ShoppingCart,
  Repeat,
  CalendarDays,
  Thermometer,
  Droplets,
  Smile,
  Frown,
  Meh,
  BookOpen,
  Lightbulb,
  Hash,
  Link,
} from "lucide-react"
import { toast } from "sonner"
import { format, addDays, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, isToday } from "date-fns"

export default function AccountPage() {
  const { user, isAuthenticated, logout, updateUser } = useAuthStore()
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("profile")
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [theme, setTheme] = useState("light")
  const [profileCompletion, setProfileCompletion] = useState(75)
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date())
  const [cycleData, setCycleData] = useState({
    lastPeriod: new Date(2024, 0, 15),
    cycleLength: 28,
    periodLength: 5,
    nextPeriod: new Date(2024, 1, 12),
  })

  // Enhanced mock data with more realistic information
  const [orders] = useState([
    {
      id: "ORD-2024-001",
      date: "2024-01-15",
      status: "delivered",
      total: 1299,
      items: [
        {
          name: "Period Calm - 1 Month Supply",
          quantity: 1,
          price: 1299,
          image: "/placeholder.svg?height=60&width=60&text=PC",
        },
      ],
      tracking: "TRK123456789",
      shippingAddress: "123 Main St, Mumbai, MH 400001",
      paymentMethod: "Credit Card ending in 4567",
      estimatedDelivery: "2024-01-18",
      actualDelivery: "2024-01-17",
    },
    {
      id: "ORD-2024-002",
      date: "2024-02-15",
      status: "shipped",
      total: 2598,
      items: [
        {
          name: "Period Calm - 2 Month Supply",
          quantity: 1,
          price: 2598,
          image: "/placeholder.svg?height=60&width=60&text=PC2",
        },
      ],
      tracking: "TRK987654321",
      shippingAddress: "123 Main St, Mumbai, MH 400001",
      paymentMethod: "Credit Card ending in 4567",
      estimatedDelivery: "2024-02-18",
    },
    {
      id: "ORD-2024-003",
      date: "2024-01-05",
      status: "processing",
      total: 1299,
      items: [
        {
          name: "Period Calm - 1 Month Supply",
          quantity: 1,
          price: 1299,
          image: "/placeholder.svg?height=60&width=60&text=PC",
        },
      ],
      shippingAddress: "123 Main St, Mumbai, MH 400001",
      paymentMethod: "UPI",
      estimatedDelivery: "2024-01-08",
    },
  ])

  const [subscriptions] = useState([
    {
      id: "SUB-001",
      plan: "Monthly Subscription",
      status: "active",
      nextDelivery: "2024-02-01",
      price: 1199,
      frequency: "monthly",
      startDate: "2023-12-01",
      totalDeliveries: 3,
      paymentMethod: "Credit Card ending in 4567",
      shippingAddress: "123 Main St, Mumbai, MH 400001",
      discount: 100,
    },
  ])

  const [loyaltyPoints] = useState({
    current: 2450,
    lifetime: 5670,
    nextReward: 3000,
    tier: "Gold",
    pointsToNextTier: 550,
    nextTier: "Platinum",
  })

  const [rewards] = useState([
    {
      id: "RWD-001",
      name: "Free Shipping",
      points: 500,
      description: "Get free shipping on your next order",
      available: true,
      category: "shipping",
    },
    {
      id: "RWD-002",
      name: "10% Discount",
      points: 1000,
      description: "Get 10% off your next purchase",
      available: true,
      category: "discount",
    },
    {
      id: "RWD-003",
      name: "Free Sample Pack",
      points: 1500,
      description: "Get a free sample pack of wellness products",
      available: true,
      category: "product",
    },
    {
      id: "RWD-004",
      name: "Premium Consultation",
      points: 2500,
      description: "Free 30-minute consultation with our wellness expert",
      available: false,
      category: "service",
    },
  ])

  const [supportTickets] = useState([
    {
      id: "TKT-001",
      subject: "Question about ingredients",
      status: "open",
      priority: "medium",
      category: "Product Question",
      date: "2024-01-20",
      lastReply: "2024-01-21",
      messages: [
        {
          id: 1,
          sender: "user",
          message: "I have a question about the ingredients in Period Calm. Are they all natural?",
          timestamp: "2024-01-20T10:30:00Z",
        },
        {
          id: 2,
          sender: "support",
          message:
            "Yes, all ingredients in Period Calm are 100% natural and sourced from certified organic farms. Would you like a detailed ingredient list?",
          timestamp: "2024-01-21T09:15:00Z",
        },
      ],
    },
    {
      id: "TKT-002",
      subject: "Delivery delay inquiry",
      status: "closed",
      priority: "high",
      category: "Order Issue",
      date: "2024-01-15",
      lastReply: "2024-01-16",
      resolution: "Order was expedited and delivered successfully",
    },
  ])

  const [referralStats] = useState({
    totalReferred: 8,
    successfulPurchases: 5,
    totalEarned: 1000,
    pendingRewards: 200,
    referralCode: "SARAH2024",
    referralLink: "https://periodcalm.com/ref/SARAH2024",
  })

  const [wellnessData] = useState({
    currentCycle: {
      day: 15,
      phase: "luteal",
      nextPeriod: 13,
      fertility: "low",
    },
    symptoms: {
      cramps: 2,
      bloating: 3,
      headache: 1,
      moodSwings: 2,
      fatigue: 3,
    },
    mood: "good",
    flow: 0,
    temperature: 98.2,
    notes: "Feeling good today, energy levels are stable",
  })

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login")
    }
  }, [isAuthenticated, router])

  if (!isAuthenticated || !user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-rose-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your account...</p>
        </div>
      </div>
    )
  }

  const handleProfileUpdate = async (data: any) => {
    setIsLoading(true)
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000))
      updateUser(data)
      toast.success("Profile updated successfully!")
      setProfileCompletion(Math.min(100, profileCompletion + 5))
    } catch (error) {
      toast.error("Failed to update profile")
    } finally {
      setIsLoading(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "delivered":
        return "bg-green-100 text-green-800 border-green-200"
      case "shipped":
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "processing":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "cancelled":
        return "bg-red-100 text-red-800 border-red-200"
      case "active":
        return "bg-green-100 text-green-800 border-green-200"
      case "paused":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "open":
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "closed":
        return "bg-gray-100 text-gray-800 border-gray-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "delivered":
        return <CheckCircle className="h-4 w-4" />
      case "shipped":
        return <Truck className="h-4 w-4" />
      case "processing":
        return <Clock className="h-4 w-4" />
      case "cancelled":
        return <XCircle className="h-4 w-4" />
      case "active":
        return <CheckCircle className="h-4 w-4" />
      case "paused":
        return <Pause className="h-4 w-4" />
      case "open":
        return <AlertCircle className="h-4 w-4" />
      case "closed":
        return <CheckCircle className="h-4 w-4" />
      default:
        return <Info className="h-4 w-4" />
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800 border-red-200"
      case "medium":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "low":
        return "bg-green-100 text-green-800 border-green-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    toast.success("Copied to clipboard!")
  }

  const getMoodIcon = (mood: string) => {
    switch (mood) {
      case "great":
        return <Smile className="h-5 w-5 text-green-500" />
      case "good":
        return <Smile className="h-5 w-5 text-blue-500" />
      case "okay":
        return <Meh className="h-5 w-5 text-yellow-500" />
      case "bad":
        return <Frown className="h-5 w-5 text-orange-500" />
      case "terrible":
        return <Frown className="h-5 w-5 text-red-500" />
      default:
        return <Meh className="h-5 w-5 text-gray-500" />
    }
  }

  const getPhaseColor = (phase: string) => {
    switch (phase) {
      case "menstrual":
        return "bg-red-100 text-red-800 border-red-200"
      case "follicular":
        return "bg-green-100 text-green-800 border-green-200"
      case "ovulation":
        return "bg-purple-100 text-purple-800 border-purple-200"
      case "luteal":
        return "bg-orange-100 text-orange-800 border-orange-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  return (
    <div className={`min-h-screen transition-colors duration-300 ${theme === "dark" ? "bg-gray-900" : "bg-gray-50"}`}>
      {/* Enhanced Header with notifications and theme toggle */}
      <div
        className={`border-b transition-colors duration-300 ${theme === "dark" ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"}`}
      >
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Avatar className="h-16 w-16 ring-4 ring-rose-100">
                  <AvatarImage src={user.avatar || "/placeholder.svg"} />
                  <AvatarFallback className="bg-rose-100 text-rose-600 text-xl font-semibold">
                    {user.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <Button
                  size="sm"
                  variant="outline"
                  className="absolute -bottom-1 -right-1 h-8 w-8 rounded-full p-0 bg-white"
                >
                  <Camera className="h-4 w-4" />
                </Button>
              </div>
              <div>
                <h1
                  className={`text-2xl font-semibold transition-colors duration-300 ${theme === "dark" ? "text-white" : "text-gray-900"}`}
                >
                  Welcome back, {user.name}!
                </h1>
                <p className={`transition-colors duration-300 ${theme === "dark" ? "text-gray-300" : "text-gray-600"}`}>
                  Manage your Period Calm account
                </p>
                <div className="flex items-center mt-2 space-x-4">
                  <div className="flex items-center space-x-2">
                    <div className="w-24 bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-rose-500 h-2 rounded-full transition-all duration-500"
                        style={{ width: `${profileCompletion}%` }}
                      ></div>
                    </div>
                    <span
                      className={`text-sm transition-colors duration-300 ${theme === "dark" ? "text-gray-300" : "text-gray-600"}`}
                    >
                      {profileCompletion}% complete
                    </span>
                  </div>
                  <Badge variant="outline" className="border-rose-300 text-rose-600">
                    {loyaltyPoints.tier} Member
                  </Badge>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setTheme(theme === "light" ? "dark" : "light")}
                className="bg-transparent"
              >
                {theme === "light" ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
              </Button>
              <Button variant="outline" size="sm" className="relative bg-transparent">
                <Bell className="h-4 w-4" />
                <span className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full text-xs"></span>
              </Button>
              <Button variant="outline" onClick={logout} className="bg-transparent">
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
          {/* Enhanced Navigation with better mobile support */}
          <div className="sticky top-0 z-10 bg-white/80 backdrop-blur-sm border rounded-lg p-1">
            <TabsList className="grid w-full grid-cols-7 lg:w-auto lg:grid-cols-7 bg-gray-100">
              <TabsTrigger value="profile" className="flex items-center gap-2 data-[state=active]:bg-white">
                <User className="h-4 w-4" />
                <span className="hidden sm:inline">Profile</span>
              </TabsTrigger>
              <TabsTrigger value="orders" className="flex items-center gap-2 data-[state=active]:bg-white">
                <Package className="h-4 w-4" />
                <span className="hidden sm:inline">Orders</span>
              </TabsTrigger>
              <TabsTrigger value="subscriptions" className="flex items-center gap-2 data-[state=active]:bg-white">
                <RefreshCw className="h-4 w-4" />
                <span className="hidden sm:inline">Subscriptions</span>
              </TabsTrigger>
              <TabsTrigger value="loyalty" className="flex items-center gap-2 data-[state=active]:bg-white">
                <Gift className="h-4 w-4" />
                <span className="hidden sm:inline">Loyalty</span>
              </TabsTrigger>
              <TabsTrigger value="referrals" className="flex items-center gap-2 data-[state=active]:bg-white">
                <Users className="h-4 w-4" />
                <span className="hidden sm:inline">Referrals</span>
              </TabsTrigger>
              <TabsTrigger value="support" className="flex items-center gap-2 data-[state=active]:bg-white">
                <MessageCircle className="h-4 w-4" />
                <span className="hidden sm:inline">Support</span>
              </TabsTrigger>
              <TabsTrigger value="wellness" className="flex items-center gap-2 data-[state=active]:bg-white">
                <Heart className="h-4 w-4" />
                <span className="hidden sm:inline">Wellness</span>
              </TabsTrigger>
            </TabsList>
          </div>

          {/* Enhanced Profile Tab */}
          <TabsContent value="profile" className="space-y-6">
            {/* Profile Completion Card */}
            <Card className="border-0 shadow-lg">
              <CardHeader className="bg-gradient-to-r from-rose-50 to-orange-50">
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5 text-rose-600" />
                  Complete Your Profile
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm font-medium">Profile Completion</span>
                  <span className="text-sm text-gray-600">{profileCompletion}%</span>
                </div>
                <Progress value={profileCompletion} className="mb-4" />
                <div className="grid md:grid-cols-3 gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-green-500" />
                    <span>Basic Information</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-green-500" />
                    <span>Contact Details</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <AlertCircle className="h-4 w-4 text-orange-500" />
                    <span>Health Preferences</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Personal Information */}
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Personal Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="flex items-center gap-2">
                      Full Name <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="name"
                      defaultValue={user.name}
                      className="focus:ring-2 focus:ring-rose-500 focus:border-rose-500"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email" className="flex items-center gap-2">
                      Email <span className="text-red-500">*</span>
                      <Badge variant="outline" className="text-xs border-green-300 text-green-600">
                        Verified
                      </Badge>
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      defaultValue={user.email}
                      className="focus:ring-2 focus:ring-rose-500 focus:border-rose-500"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone" className="flex items-center gap-2">
                      <Phone className="h-4 w-4" />
                      Phone Number
                    </Label>
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="+91 98765 43210"
                      className="focus:ring-2 focus:ring-rose-500 focus:border-rose-500"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="dob">Date of Birth</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="outline" className="w-full justify-start text-left font-normal bg-transparent">
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {selectedDate ? format(selectedDate, "PPP") : "Pick a date"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar mode="single" selected={selectedDate} onSelect={setSelectedDate} initialFocus />
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="address" className="flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    Address
                  </Label>
                  <Textarea
                    id="address"
                    placeholder="Enter your complete address"
                    className="focus:ring-2 focus:ring-rose-500 focus:border-rose-500"
                  />
                </div>
                <Button
                  onClick={() => handleProfileUpdate({})}
                  disabled={isLoading}
                  className="bg-rose-600 hover:bg-rose-700"
                >
                  {isLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Updating...
                    </>
                  ) : (
                    "Update Profile"
                  )}
                </Button>
              </CardContent>
            </Card>

            {/* Account Settings */}
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  Account Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <Mail className="h-5 w-5 text-blue-500" />
                      <div>
                        <Label>Email Notifications</Label>
                        <p className="text-sm text-gray-600">Receive order updates and health tips</p>
                      </div>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <Smartphone className="h-5 w-5 text-green-500" />
                      <div>
                        <Label>SMS Notifications</Label>
                        <p className="text-sm text-gray-600">Get delivery updates via SMS</p>
                      </div>
                    </div>
                    <Switch />
                  </div>
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <Globe className="h-5 w-5 text-purple-500" />
                      <div>
                        <Label>Newsletter</Label>
                        <p className="text-sm text-gray-600">Monthly wellness tips and offers</p>
                      </div>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <Shield className="h-5 w-5 text-orange-500" />
                      <div>
                        <Label>Two-Factor Authentication</Label>
                        <p className="text-sm text-gray-600">Add an extra layer of security</p>
                      </div>
                    </div>
                    <Button variant="outline" size="sm">
                      Enable
                    </Button>
                  </div>
                </div>

                <Separator />

                {/* Enhanced Password Change Section */}
                <div className="space-y-4">
                  <h4 className="font-medium flex items-center gap-2">
                    <Lock className="h-4 w-4" />
                    Change Password
                  </h4>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="current-password">Current Password</Label>
                      <div className="relative">
                        <Input
                          id="current-password"
                          type={showPassword ? "text" : "password"}
                          className="focus:ring-2 focus:ring-rose-500 focus:border-rose-500"
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-0 top-0 h-full px-3"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </Button>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="new-password">New Password</Label>
                      <Input
                        id="new-password"
                        type="password"
                        className="focus:ring-2 focus:ring-rose-500 focus:border-rose-500"
                      />
                      <div className="text-xs text-gray-600">
                        Password must be at least 8 characters with uppercase, lowercase, and numbers
                      </div>
                    </div>
                  </div>
                  <Button variant="outline" className="border-rose-300 text-rose-600 hover:bg-rose-50 bg-transparent">
                    <Lock className="h-4 w-4 mr-2" />
                    Update Password
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Enhanced Orders Tab */}
          <TabsContent value="orders" className="space-y-6">
            {/* Order Statistics */}
            <div className="grid md:grid-cols-4 gap-4">
              <Card className="border-0 shadow-lg">
                <CardContent className="p-6 text-center">
                  <Package className="h-8 w-8 text-blue-500 mx-auto mb-2" />
                  <p className="text-2xl font-bold">{orders.length}</p>
                  <p className="text-sm text-gray-600">Total Orders</p>
                </CardContent>
              </Card>
              <Card className="border-0 shadow-lg">
                <CardContent className="p-6 text-center">
                  <DollarSign className="h-8 w-8 text-green-500 mx-auto mb-2" />
                  <p className="text-2xl font-bold">₹{orders.reduce((sum, order) => sum + order.total, 0)}</p>
                  <p className="text-sm text-gray-600">Total Spent</p>
                </CardContent>
              </Card>
              <Card className="border-0 shadow-lg">
                <CardContent className="p-6 text-center">
                  <CheckCircle className="h-8 w-8 text-green-500 mx-auto mb-2" />
                  <p className="text-2xl font-bold">{orders.filter((o) => o.status === "delivered").length}</p>
                  <p className="text-sm text-gray-600">Delivered</p>
                </CardContent>
              </Card>
              <Card className="border-0 shadow-lg">
                <CardContent className="p-6 text-center">
                  <Truck className="h-8 w-8 text-blue-500 mx-auto mb-2" />
                  <p className="text-2xl font-bold">{orders.filter((o) => o.status === "shipped").length}</p>
                  <p className="text-sm text-gray-600">In Transit</p>
                </CardContent>
              </Card>
            </div>

            {/* Order Filters */}
            <Card className="border-0 shadow-lg">
              <CardContent className="p-4">
                <div className="flex flex-col sm:flex-row gap-4 items-center">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Search orders..."
                      className="pl-10 focus:ring-2 focus:ring-rose-500 focus:border-rose-500"
                    />
                  </div>
                  <Select>
                    <SelectTrigger className="w-full sm:w-48">
                      <SelectValue placeholder="Filter by status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Orders</SelectItem>
                      <SelectItem value="delivered">Delivered</SelectItem>
                      <SelectItem value="shipped">Shipped</SelectItem>
                      <SelectItem value="processing">Processing</SelectItem>
                      <SelectItem value="cancelled">Cancelled</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button variant="outline" className="bg-transparent">
                    <Filter className="h-4 w-4 mr-2" />
                    More Filters
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Order History */}
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="h-5 w-5" />
                  Order History
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {orders.map((order) => (
                    <div key={order.id} className="border rounded-lg p-6 hover:shadow-md transition-shadow">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-start gap-4">
                          <div className="flex-shrink-0">
                            {order.items[0]?.image && (
                              <img
                                src={order.items[0].image || "/placeholder.svg"}
                                alt={order.items[0].name}
                                className="w-16 h-16 rounded-lg object-cover"
                              />
                            )}
                          </div>
                          <div>
                            <div className="flex items-center gap-3 mb-2">
                              <p className="font-semibold">Order #{order.id}</p>
                              <Badge className={`${getStatusColor(order.status)} flex items-center gap-1`}>
                                {getStatusIcon(order.status)}
                                {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                              </Badge>
                            </div>
                            <p className="text-sm text-gray-600 mb-1">
                              Ordered on {format(new Date(order.date), "PPP")}
                            </p>
                            <p className="text-sm text-gray-600">
                              {order.items.length} item(s) • {order.paymentMethod}
                            </p>
                            {order.estimatedDelivery && (
                              <p className="text-sm text-gray-600">
                                Expected: {format(new Date(order.estimatedDelivery), "PPP")}
                              </p>
                            )}
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-xl font-bold">₹{order.total}</p>
                          {order.status === "delivered" && order.actualDelivery && (
                            <p className="text-sm text-green-600">
                              Delivered {format(new Date(order.actualDelivery), "MMM dd")}
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Order Items */}
                      <div className="border-t pt-4 mb-4">
                        {order.items.map((item, index) => (
                          <div key={index} className="flex justify-between items-center py-2">
                            <span className="text-sm">
                              {item.name} × {item.quantity}
                            </span>
                            <span className="text-sm font-medium">₹{item.price}</span>
                          </div>
                        ))}
                      </div>

                      <div className="flex flex-wrap gap-2 pt-4 border-t">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="outline" size="sm" className="bg-transparent">
                              <Eye className="h-4 w-4 mr-2" />
                              View Details
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-2xl">
                            <DialogHeader>
                              <DialogTitle>Order Details - #{order.id}</DialogTitle>
                            </DialogHeader>
                            <div className="space-y-4">
                              <div className="grid md:grid-cols-2 gap-4">
                                <div>
                                  <h4 className="font-medium mb-2">Shipping Address</h4>
                                  <p className="text-sm text-gray-600">{order.shippingAddress}</p>
                                </div>
                                <div>
                                  <h4 className="font-medium mb-2">Payment Method</h4>
                                  <p className="text-sm text-gray-600">{order.paymentMethod}</p>
                                </div>
                              </div>
                              <div>
                                <h4 className="font-medium mb-2">Order Items</h4>
                                <div className="space-y-2">
                                  {order.items.map((item, index) => (
                                    <div
                                      key={index}
                                      className="flex justify-between items-center p-3 bg-gray-50 rounded-lg"
                                    >
                                      <div className="flex items-center gap-3">
                                        <img
                                          src={item.image || "/placeholder.svg"}
                                          alt={item.name}
                                          className="w-12 h-12 rounded-lg object-cover"
                                        />
                                        <div>
                                          <p className="font-medium">{item.name}</p>
                                          <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                                        </div>
                                      </div>
                                      <p className="font-medium">₹{item.price}</p>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            </div>
                          </DialogContent>
                        </Dialog>

                        {order.tracking && (
                          <Button variant="outline" size="sm" className="bg-transparent">
                            <ExternalLink className="h-4 w-4 mr-2" />
                            Track Order
                          </Button>
                        )}

                        <Button variant="outline" size="sm" className="bg-transparent">
                          <Download className="h-4 w-4 mr-2" />
                          Invoice
                        </Button>

                        <Button variant="outline" size="sm" className="bg-transparent">
                          <Repeat className="h-4 w-4 mr-2" />
                          Reorder
                        </Button>

                        {order.status === "delivered" && (
                          <Button variant="outline" size="sm" className="bg-transparent">
                            <Star className="h-4 w-4 mr-2" />
                            Review
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Enhanced Subscriptions Tab */}
          <TabsContent value="subscriptions" className="space-y-6">
            {/* Subscription Overview */}
            <div className="grid md:grid-cols-3 gap-4">
              <Card className="border-0 shadow-lg">
                <CardContent className="p-6 text-center">
                  <RefreshCw className="h-8 w-8 text-blue-500 mx-auto mb-2" />
                  <p className="text-2xl font-bold">{subscriptions.filter((s) => s.status === "active").length}</p>
                  <p className="text-sm text-gray-600">Active Subscriptions</p>
                </CardContent>
              </Card>
              <Card className="border-0 shadow-lg">
                <CardContent className="p-6 text-center">
                  <CalendarDays className="h-8 w-8 text-green-500 mx-auto mb-2" />
                  <p className="text-2xl font-bold">
                    {subscriptions[0]?.nextDelivery ? format(new Date(subscriptions[0].nextDelivery), "MMM dd") : "N/A"}
                  </p>
                  <p className="text-sm text-gray-600">Next Delivery</p>
                </CardContent>
              </Card>
              <Card className="border-0 shadow-lg">
                <CardContent className="p-6 text-center">
                  <DollarSign className="h-8 w-8 text-purple-500 mx-auto mb-2" />
                  <p className="text-2xl font-bold">₹{subscriptions.reduce((sum, sub) => sum + sub.price, 0)}</p>
                  <p className="text-sm text-gray-600">Monthly Savings</p>
                </CardContent>
              </Card>
            </div>

            {/* Active Subscriptions */}
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <RefreshCw className="h-5 w-5" />
                  Active Subscriptions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {subscriptions.map((sub) => (
                    <div key={sub.id} className="border rounded-lg p-6 hover:shadow-md transition-shadow">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-start gap-4">
                          <div className="w-16 h-16 bg-rose-100 rounded-lg flex items-center justify-center">
                            <Package2 className="h-8 w-8 text-rose-600" />
                          </div>
                          <div>
                            <div className="flex items-center gap-3 mb-2">
                              <h3 className="font-semibold text-lg">{sub.plan}</h3>
                              <Badge className={`${getStatusColor(sub.status)} flex items-center gap-1`}>
                                {getStatusIcon(sub.status)}
                                {sub.status.charAt(0).toUpperCase() + sub.status.slice(1)}
                              </Badge>
                            </div>
                            <div className="space-y-1 text-sm text-gray-600">
                              <p className="flex items-center gap-2">
                                <CalendarIcon className="h-4 w-4" />
                                Next delivery: {format(new Date(sub.nextDelivery), "PPP")}
                              </p>
                              <p className="flex items-center gap-2">
                                <CreditCard className="h-4 w-4" />
                                {sub.paymentMethod}
                              </p>
                              <p className="flex items-center gap-2">
                                <MapPin className="h-4 w-4" />
                                {sub.shippingAddress}
                              </p>
                              <p className="flex items-center gap-2">
                                <Package className="h-4 w-4" />
                                {sub.totalDeliveries} deliveries completed
                              </p>
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="mb-2">
                            <p className="text-2xl font-bold">₹{sub.price}</p>
                            <p className="text-sm text-gray-600">per {sub.frequency}</p>
                          </div>
                          {sub.discount > 0 && (
                            <Badge variant="outline" className="border-green-300 text-green-600">
                              Save ₹{sub.discount}
                            </Badge>
                          )}
                        </div>
                      </div>

                      {/* Subscription Progress */}
                      <div className="mb-4 p-4 bg-gray-50 rounded-lg">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm font-medium">Subscription Progress</span>
                          <span className="text-sm text-gray-600">
                            Started {format(new Date(sub.startDate), "MMM yyyy")}
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-rose-500 h-2 rounded-full"
                            style={{ width: `${(sub.totalDeliveries / 12) * 100}%` }}
                          ></div>
                        </div>
                        <p className="text-xs text-gray-600 mt-1">{sub.totalDeliveries} of 12 deliveries this year</p>
                      </div>

                      <div className="flex flex-wrap gap-2 pt-4 border-t">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="outline" size="sm" className="bg-transparent">
                              <Edit className="h-4 w-4 mr-2" />
                              Modify
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Modify Subscription</DialogTitle>
                              <DialogDescription>Update your subscription preferences</DialogDescription>
                            </DialogHeader>
                            <div className="space-y-4">
                              <div>
                                <Label>Delivery Frequency</Label>
                                <Select defaultValue={sub.frequency}>
                                  <SelectTrigger>
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="monthly">Monthly</SelectItem>
                                    <SelectItem value="bimonthly">Every 2 Months</SelectItem>
                                    <SelectItem value="quarterly">Quarterly</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                              <div>
                                <Label>Next Delivery Date</Label>
                                <Popover>
                                  <PopoverTrigger asChild>
                                    <Button variant="outline" className="w-full justify-start bg-transparent">
                                      <CalendarIcon className="mr-2 h-4 w-4" />
                                      {format(new Date(sub.nextDelivery), "PPP")}
                                    </Button>
                                  </PopoverTrigger>
                                  <PopoverContent className="w-auto p-0">
                                    <Calendar
                                      mode="single"
                                      selected={new Date(sub.nextDelivery)}
                                      onSelect={() => {}}
                                      initialFocus
                                    />
                                  </PopoverContent>
                                </Popover>
                              </div>
                            </div>
                            <DialogFooter>
                              <Button variant="outline">Cancel</Button>
                              <Button className="bg-rose-600 hover:bg-rose-700">Save Changes</Button>
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>

                        <Button variant="outline" size="sm" className="bg-transparent">
                          <Pause className="h-4 w-4 mr-2" />
                          Pause
                        </Button>

                        <Button variant="outline" size="sm" className="bg-transparent">
                          <CalendarIcon className="h-4 w-4 mr-2" />
                          Skip Next
                        </Button>

                        <Dialog>
                          <DialogTrigger asChild>
                            <Button
                              variant="outline"
                              size="sm"
                              className="text-red-600 border-red-300 hover:bg-red-50 bg-transparent"
                            >
                              <X className="h-4 w-4 mr-2" />
                              Cancel
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Cancel Subscription</DialogTitle>
                              <DialogDescription>
                                Are you sure you want to cancel your subscription? This action cannot be undone.
                              </DialogDescription>
                            </DialogHeader>
                            <div className="space-y-4">
                              <div className="p-4 bg-red-50 rounded-lg">
                                <h4 className="font-medium text-red-900 mb-2">What happens when you cancel:</h4>
                                <ul className="text-sm text-red-800 space-y-1">
                                  <li>• Your subscription will end after the current billing cycle</li>
                                  <li>• You'll lose your subscription discount</li>
                                  <li>• No more automatic deliveries</li>
                                </ul>
                              </div>
                              <div>
                                <Label>Reason for cancellation (optional)</Label>
                                <Select>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select a reason" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="too-expensive">Too expensive</SelectItem>
                                    <SelectItem value="not-effective">Product not effective</SelectItem>
                                    <SelectItem value="too-frequent">Deliveries too frequent</SelectItem>
                                    <SelectItem value="other">Other</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                            </div>
                            <DialogFooter>
                              <Button variant="outline">Keep Subscription</Button>
                              <Button variant="destructive">Cancel Subscription</Button>
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Subscription Benefits */}
            <Card className="border-0 shadow-lg bg-gradient-to-r from-rose-50 to-orange-50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Gift className="h-5 w-5 text-rose-600" />
                  Subscription Benefits
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="text-center">
                    <Percent className="h-8 w-8 text-green-500 mx-auto mb-2" />
                    <h4 className="font-medium">Save 15%</h4>
                    <p className="text-sm text-gray-600">On every delivery</p>
                  </div>
                  <div className="text-center">
                    <Truck className="h-8 w-8 text-blue-500 mx-auto mb-2" />
                    <h4 className="font-medium">Free Shipping</h4>
                    <p className="text-sm text-gray-600">Always included</p>
                  </div>
                  <div className="text-center">
                    <Zap className="h-8 w-8 text-purple-500 mx-auto mb-2" />
                    <h4 className="font-medium">Priority Support</h4>
                    <p className="text-sm text-gray-600">Faster response times</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Enhanced Loyalty Tab */}
          <TabsContent value="loyalty" className="space-y-6">
            {/* Loyalty Overview */}
            <div className="grid md:grid-cols-4 gap-4">
              <Card className="border-0 shadow-lg">
                <CardContent className="p-6 text-center">
                  <Gift className="h-8 w-8 text-rose-500 mx-auto mb-2" />
                  <p className="text-2xl font-bold">{loyaltyPoints.current}</p>
                  <p className="text-sm text-gray-600">Current Points</p>
                </CardContent>
              </Card>
              <Card className="border-0 shadow-lg">
                <CardContent className="p-6 text-center">
                  <Star className="h-8 w-8 text-yellow-500 mx-auto mb-2" />
                  <p className="text-2xl font-bold">{loyaltyPoints.lifetime}</p>
                  <p className="text-sm text-gray-600">Lifetime Points</p>
                </CardContent>
              </Card>
              <Card className="border-0 shadow-lg">
                <CardContent className="p-6 text-center">
                  <Award className="h-8 w-8 text-purple-500 mx-auto mb-2" />
                  <p className="text-2xl font-bold">{loyaltyPoints.tier}</p>
                  <p className="text-sm text-gray-600">Current Tier</p>
                </CardContent>
              </Card>
              <Card className="border-0 shadow-lg">
                <CardContent className="p-6 text-center">
                  <TrendingUp className="h-8 w-8 text-green-500 mx-auto mb-2" />
                  <p className="text-2xl font-bold">{loyaltyPoints.pointsToNextTier}</p>
                  <p className="text-sm text-gray-600">To {loyaltyPoints.nextTier}</p>
                </CardContent>
              </Card>
            </div>

            {/* Tier Progress */}
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="h-5 w-5" />
                  Tier Progress
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
                        <Award className="h-6 w-6 text-yellow-600" />
                      </div>
                      <div>
                        <p className="font-medium">{loyaltyPoints.tier} Member</p>
                        <p className="text-sm text-gray-600">Current tier benefits active</p>
                      </div>
                    </div>
                    <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">Current</Badge>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Progress to {loyaltyPoints.nextTier}</span>
                      <span>
                        {loyaltyPoints.current}/{loyaltyPoints.current + loyaltyPoints.pointsToNextTier}
                      </span>
                    </div>
                    <Progress
                      value={(loyaltyPoints.current / (loyaltyPoints.current + loyaltyPoints.pointsToNextTier)) * 100}
                      className="h-3"
                    />
                    <p className="text-xs text-gray-600">
                      Earn {loyaltyPoints.pointsToNextTier} more points to reach {loyaltyPoints.nextTier} tier
                    </p>
                  </div>

                  <div className="grid md:grid-cols-3 gap-4 pt-4">
                    <div className="text-center p-4 bg-gray-50 rounded-lg">
                      <h4 className="font-medium text-gray-600">Silver</h4>
                      <p className="text-sm text-gray-500">0-999 points</p>
                      <Check className="h-5 w-5 text-gray-400 mx-auto mt-2" />
                    </div>
                    <div className="text-center p-4 bg-yellow-50 rounded-lg border-2 border-yellow-200">
                      <h4 className="font-medium text-yellow-800">Gold</h4>
                      <p className="text-sm text-yellow-600">1000-2999 points</p>
                      <Award className="h-5 w-5 text-yellow-600 mx-auto mt-2" />
                    </div>
                    <div className="text-center p-4 bg-gray-50 rounded-lg">
                      <h4 className="font-medium text-gray-600">Platinum</h4>
                      <p className="text-sm text-gray-500">3000+ points</p>
                      <Star className="h-5 w-5 text-gray-400 mx-auto mt-2" />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Available Rewards */}
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <Gift className="h-5 w-5" />
                    Available Rewards
                  </span>
                  <Select defaultValue="all">
                    <SelectTrigger className="w-48">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Rewards</SelectItem>
                      <SelectItem value="shipping">Shipping</SelectItem>
                      <SelectItem value="discount">Discounts</SelectItem>
                      <SelectItem value="product">Products</SelectItem>
                      <SelectItem value="service">Services</SelectItem>
                    </SelectContent>
                  </Select>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-4">
                  {rewards.map((reward) => (
                    <div
                      key={reward.id}
                      className={`border rounded-lg p-4 transition-all ${
                        reward.available ? "hover:shadow-md" : "opacity-60"
                      }`}
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-start gap-3">
                          <div
                            className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                              reward.category === "shipping"
                                ? "bg-blue-100"
                                : reward.category === "discount"
                                  ? "bg-green-100"
                                  : reward.category === "product"
                                    ? "bg-purple-100"
                                    : "bg-orange-100"
                            }`}
                          >
                            {reward.category === "shipping" && <Truck className="h-6 w-6 text-blue-600" />}
                            {reward.category === "discount" && <Percent className="h-6 w-6 text-green-600" />}
                            {reward.category === "product" && <Package className="h-6 w-6 text-purple-600" />}
                            {reward.category === "service" && <UserCheck className="h-6 w-6 text-orange-600" />}
                          </div>
                          <div>
                            <h4 className="font-medium">{reward.name}</h4>
                            <p className="text-sm text-gray-600 mb-2">{reward.description}</p>
                            <Badge variant="outline" className="text-xs">
                              {reward.points} points
                            </Badge>
                          </div>
                        </div>
                      </div>
                      <Button
                        size="sm"
                        disabled={!reward.available || loyaltyPoints.current < reward.points}
                        className="w-full bg-rose-600 hover:bg-rose-700 disabled:bg-gray-300"
                      >
                        {loyaltyPoints.current < reward.points
                          ? `Need ${reward.points - loyaltyPoints.current} more points`
                          : "Redeem"}
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Points History */}
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5" />
                  Points History
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                        <Plus className="h-4 w-4 text-green-600" />
                      </div>
                      <div>
                        <p className="font-medium text-sm">Order Purchase</p>
                        <p className="text-xs text-gray-600">Jan 15, 2024</p>
                      </div>
                    </div>
                    <span className="text-green-600 font-medium">+130 points</span>
                  </div>
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                        <Gift className="h-4 w-4 text-blue-600" />
                      </div>
                      <div>
                        <p className="font-medium text-sm">Referral Bonus</p>
                        <p className="text-xs text-gray-600">Jan 10, 2024</p>
                      </div>
                    </div>
                    <span className="text-green-600 font-medium">+200 points</span>
                  </div>
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                        <Gift className="h-4 w-4 text-red-600" />
                      </div>
                      <div>
                        <p className="font-medium text-sm">Redeemed Free Shipping</p>
                        <p className="text-xs text-gray-600">Jan 5, 2024</p>
                      </div>
                    </div>
                    <span className="text-red-600 font-medium">-500 points</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Enhanced Referrals Tab */}
          <TabsContent value="referrals" className="space-y-6">
            {/* Referral Stats */}
            <div className="grid md:grid-cols-4 gap-4">
              <Card className="border-0 shadow-lg">
                <CardContent className="p-6 text-center">
                  <Users className="h-8 w-8 text-blue-500 mx-auto mb-2" />
                  <p className="text-2xl font-bold">{referralStats.totalReferred}</p>
                  <p className="text-sm text-gray-600">Friends Referred</p>
                </CardContent>
              </Card>
              <Card className="border-0 shadow-lg">
                <CardContent className="p-6 text-center">
                  <ShoppingCart className="h-8 w-8 text-green-500 mx-auto mb-2" />
                  <p className="text-2xl font-bold">{referralStats.successfulPurchases}</p>
                  <p className="text-sm text-gray-600">Successful Purchases</p>
                </CardContent>
              </Card>
              <Card className="border-0 shadow-lg">
                <CardContent className="p-6 text-center">
                  <DollarSign className="h-8 w-8 text-purple-500 mx-auto mb-2" />
                  <p className="text-2xl font-bold">₹{referralStats.totalEarned}</p>
                  <p className="text-sm text-gray-600">Total Earned</p>
                </CardContent>
              </Card>
              <Card className="border-0 shadow-lg">
                <CardContent className="p-6 text-center">
                  <Clock className="h-8 w-8 text-orange-500 mx-auto mb-2" />
                  <p className="text-2xl font-bold">₹{referralStats.pendingRewards}</p>
                  <p className="text-sm text-gray-600">Pending Rewards</p>
                </CardContent>
              </Card>
            </div>

            {/* Referral Program */}
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Refer Friends & Earn
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="text-center p-6 bg-gradient-to-r from-rose-50 to-orange-50 rounded-lg">
                  <Gift className="h-16 w-16 text-rose-500 mx-auto mb-4" />
                  <h3 className="text-2xl font-bold mb-2">Earn ₹200 for each referral!</h3>
                  <p className="text-gray-600 mb-4 max-w-md mx-auto">
                    Share Period Calm with friends and earn rewards when they make their first purchase. Your friends
                    get 10% off their first order too!
                  </p>
                  <div className="grid md:grid-cols-3 gap-4 mt-6">
                    <div className="text-center">
                      <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
                        <Share2 className="h-6 w-6 text-blue-600" />
                      </div>
                      <h4 className="font-medium">1. Share</h4>
                      <p className="text-sm text-gray-600">Send your unique link</p>
                    </div>
                    <div className="text-center">
                      <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
                        <UserCheck className="h-6 w-6 text-green-600" />
                      </div>
                      <h4 className="font-medium">2. Friend Orders</h4>
                      <p className="text-sm text-gray-600">They get 10% off first order</p>
                    </div>
                    <div className="text-center">
                      <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-2">
                        <Gift className="h-6 w-6 text-purple-600" />
                      </div>
                      <h4 className="font-medium">3. You Earn</h4>
                      <p className="text-sm text-gray-600">Get ₹200 reward</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <Label className="flex items-center gap-2 mb-2">
                      <Link className="h-4 w-4" />
                      Your Referral Link
                    </Label>
                    <div className="flex gap-2">
                      <Input value={referralStats.referralLink} readOnly className="flex-1 bg-gray-50" />
                      <Button
                        variant="outline"
                        onClick={() => copyToClipboard(referralStats.referralLink)}
                        className="bg-transparent"
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  <div>
                    <Label className="flex items-center gap-2 mb-2">
                      <Hash className="h-4 w-4" />
                      Your Referral Code
                    </Label>
                    <div className="flex gap-2">
                      <Input
                        value={referralStats.referralCode}
                        readOnly
                        className="flex-1 bg-gray-50 font-mono text-lg text-center"
                      />
                      <Button
                        variant="outline"
                        onClick={() => copyToClipboard(referralStats.referralCode)}
                        className="bg-transparent"
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-3">
                  <Button className="bg-green-600 hover:bg-green-700">
                    <Share2 className="h-4 w-4 mr-2" />
                    Share on WhatsApp
                  </Button>
                  <Button variant="outline" className="bg-transparent">
                    <Mail className="h-4 w-4 mr-2" />
                    Share via Email
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Referral History */}
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle>Referral History</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10">
                        <AvatarFallback>PR</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">Priya Sharma</p>
                        <p className="text-sm text-gray-600">Joined Jan 15, 2024</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge className="bg-green-100 text-green-800 border-green-200 mb-1">Purchased</Badge>
                      <p className="text-sm font-medium text-green-600">+₹200</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10">
                        <AvatarFallback>AN</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">Anita Nair</p>
                        <p className="text-sm text-gray-600">Joined Jan 10, 2024</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200 mb-1">Pending</Badge>
                      <p className="text-sm text-gray-600">₹200</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Enhanced Support Tab */}
          <TabsContent value="support" className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              {/* Create New Ticket */}
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Plus className="h-5 w-5" />
                    Create New Ticket
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="subject">Subject *</Label>
                    <Input
                      id="subject"
                      placeholder="Brief description of your issue"
                      className="focus:ring-2 focus:ring-rose-500 focus:border-rose-500"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="category">Category *</Label>
                    <Select>
                      <SelectTrigger className="focus:ring-2 focus:ring-rose-500 focus:border-rose-500">
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="order">Order Issue</SelectItem>
                        <SelectItem value="product">Product Question</SelectItem>
                        <SelectItem value="billing">Billing</SelectItem>
                        <SelectItem value="technical">Technical Support</SelectItem>
                        <SelectItem value="subscription">Subscription</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="priority">Priority</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select priority" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Low</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                        <SelectItem value="urgent">Urgent</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="message">Message *</Label>
                    <Textarea
                      id="message"
                      placeholder="Describe your issue in detail"
                      rows={4}
                      className="focus:ring-2 focus:ring-rose-500 focus:border-rose-500"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="attachment">Attachment (optional)</Label>
                    <Input
                      id="attachment"
                      type="file"
                      accept="image/*,.pdf,.doc,.docx"
                      className="focus:ring-2 focus:ring-rose-500 focus:border-rose-500"
                    />
                    <p className="text-xs text-gray-600">Max file size: 10MB. Supported formats: JPG, PNG, PDF, DOC</p>
                  </div>
                  <Button className="w-full bg-rose-600 hover:bg-rose-700">
                    <Plus className="h-4 w-4 mr-2" />
                    Submit Ticket
                  </Button>
                </CardContent>
              </Card>

              {/* Quick Help */}
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Lightbulb className="h-5 w-5" />
                    Quick Help
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="p-3 border rounded-lg hover:bg-gray-50 cursor-pointer transition-colors">
                      <h4 className="font-medium text-sm mb-1">How to track my order?</h4>
                      <p className="text-xs text-gray-600">Find your tracking number in order details</p>
                    </div>
                    <div className="p-3 border rounded-lg hover:bg-gray-50 cursor-pointer transition-colors">
                      <h4 className="font-medium text-sm mb-1">Subscription management</h4>
                      <p className="text-xs text-gray-600">Pause, modify, or cancel your subscription</p>
                    </div>
                    <div className="p-3 border rounded-lg hover:bg-gray-50 cursor-pointer transition-colors">
                      <h4 className="font-medium text-sm mb-1">Return & refund policy</h4>
                      <p className="text-xs text-gray-600">Learn about our return process</p>
                    </div>
                    <div className="p-3 border rounded-lg hover:bg-gray-50 cursor-pointer transition-colors">
                      <h4 className="font-medium text-sm mb-1">Product ingredients</h4>
                      <p className="text-xs text-gray-600">Detailed ingredient information</p>
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-3">
                    <h4 className="font-medium">Contact Options</h4>
                    <div className="space-y-2">
                      <Button variant="outline" className="w-full justify-start bg-transparent">
                        <Mail className="h-4 w-4 mr-2" />
                        support@periodcalm.com
                      </Button>
                      <Button variant="outline" className="w-full justify-start bg-transparent">
                        <Phone className="h-4 w-4 mr-2" />
                        +91 98765 43210
                      </Button>
                      <Button variant="outline" className="w-full justify-start bg-transparent">
                        <MessageCircle className="h-4 w-4 mr-2" />
                        Live Chat (9 AM - 6 PM)
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Support Tickets */}
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <MessageCircle className="h-5 w-5" />
                    Your Support Tickets
                  </span>
                  <Select defaultValue="all">
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All</SelectItem>
                      <SelectItem value="open">Open</SelectItem>
                      <SelectItem value="closed">Closed</SelectItem>
                    </SelectContent>
                  </Select>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {supportTickets.map((ticket) => (
                    <div key={ticket.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-start gap-3">
                          <div
                            className={`w-10 h-10 rounded-full flex items-center justify-center ${
                              ticket.status === "open" ? "bg-blue-100" : "bg-gray-100"
                            }`}
                          >
                            {getStatusIcon(ticket.status)}
                          </div>
                          <div>
                            <h4 className="font-medium">{ticket.subject}</h4>
                            <div className="flex items-center gap-2 mt-1">
                              <Badge className={getStatusColor(ticket.status)}>{ticket.status}</Badge>
                              <Badge className={getPriorityColor(ticket.priority)}>{ticket.priority}</Badge>
                              <Badge variant="outline" className="text-xs">
                                {ticket.category}
                              </Badge>
                            </div>
                            <p className="text-sm text-gray-600 mt-1">
                              Created: {format(new Date(ticket.date), "PPP")}
                            </p>
                            {ticket.lastReply && (
                              <p className="text-sm text-gray-600">
                                Last reply: {format(new Date(ticket.lastReply), "PPP")}
                              </p>
                            )}
                          </div>
                        </div>
                        <span className="text-sm text-gray-500">#{ticket.id}</span>
                      </div>

                      <div className="flex gap-2">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="outline" size="sm" className="bg-transparent">
                              <Eye className="h-4 w-4 mr-2" />
                              View Details
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                            <DialogHeader>
                              <DialogTitle>
                                Ticket #{ticket.id} - {ticket.subject}
                              </DialogTitle>
                              <div className="flex gap-2">
                                <Badge className={getStatusColor(ticket.status)}>{ticket.status}</Badge>
                                <Badge className={getPriorityColor(ticket.priority)}>{ticket.priority}</Badge>
                              </div>
                            </DialogHeader>
                            <div className="space-y-4">
                              {ticket.messages && (
                                <div className="space-y-3">
                                  {ticket.messages.map((message) => (
                                    <div
                                      key={message.id}
                                      className={`p-3 rounded-lg ${
                                        message.sender === "user" ? "bg-rose-50 ml-8" : "bg-gray-50 mr-8"
                                      }`}
                                    >
                                      <div className="flex items-center justify-between mb-2">
                                        <span className="font-medium text-sm">
                                          {message.sender === "user" ? "You" : "Support Team"}
                                        </span>
                                        <span className="text-xs text-gray-600">
                                          {format(new Date(message.timestamp), "PPp")}
                                        </span>
                                      </div>
                                      <p className="text-sm">{message.message}</p>
                                    </div>
                                  ))}
                                </div>
                              )}

                              {ticket.status === "open" && (
                                <div className="border-t pt-4">
                                  <Label htmlFor="reply">Reply to ticket</Label>
                                  <Textarea id="reply" placeholder="Type your reply..." className="mt-2" />
                                  <Button className="mt-2 bg-rose-600 hover:bg-rose-700">Send Reply</Button>
                                </div>
                              )}

                              {ticket.resolution && (
                                <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                                  <h4 className="font-medium text-green-900 mb-1">Resolution</h4>
                                  <p className="text-sm text-green-800">{ticket.resolution}</p>
                                </div>
                              )}
                            </div>
                          </DialogContent>
                        </Dialog>

                        {ticket.status === "open" && (
                          <Button variant="outline" size="sm" className="bg-transparent">
                            <MessageCircle className="h-4 w-4 mr-2" />
                            Reply
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Enhanced Wellness Tab */}
          <TabsContent value="wellness" className="space-y-6">
            {/* Cycle Overview */}
            <div className="grid md:grid-cols-3 gap-4">
              <Card className="border-0 shadow-lg">
                <CardContent className="p-6 text-center">
                  <div className="w-16 h-16 bg-rose-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <CalendarDays className="h-8 w-8 text-rose-600" />
                  </div>
                  <p className="font-medium mb-1">Next Period</p>
                  <p className="text-2xl font-bold text-rose-600">{format(cycleData.nextPeriod, "MMM dd")}</p>
                  <p className="text-sm text-gray-600">
                    in {Math.ceil((cycleData.nextPeriod.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))} days
                  </p>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-lg">
                <CardContent className="p-6 text-center">
                  <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Activity className="h-8 w-8 text-purple-600" />
                  </div>
                  <p className="font-medium mb-1">Current Phase</p>
                  <Badge className={`${getPhaseColor(wellnessData.currentCycle.phase)} text-lg px-3 py-1`}>
                    {wellnessData.currentCycle.phase}
                  </Badge>
                  <p className="text-sm text-gray-600 mt-2">Day {wellnessData.currentCycle.day} of cycle</p>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-lg">
                <CardContent className="p-6 text-center">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Heart className="h-8 w-8 text-green-600" />
                  </div>
                  <p className="font-medium mb-1">Fertility</p>
                  <p className="text-2xl font-bold text-green-600 capitalize">{wellnessData.currentCycle.fertility}</p>
                  <p className="text-sm text-gray-600">
                    {wellnessData.currentCycle.fertility === "high" ? "Fertile window" : "Low fertility"}
                  </p>
                </CardContent>
              </Card>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {/* Today's Log */}
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Heart className="h-5 w-5" />
                    Today's Log
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <Label className="flex items-center gap-2">
                          <Droplets className="h-4 w-4" />
                          Flow
                        </Label>
                        <span className="text-sm text-gray-600">
                          {wellnessData.flow === 0 ? "None" : `Level ${wellnessData.flow}`}
                        </span>
                      </div>
                      <div className="flex gap-1">
                        {[1, 2, 3, 4, 5].map((i) => (
                          <button
                            key={i}
                            className={`w-6 h-6 rounded-full transition-colors ${
                              i <= wellnessData.flow ? "bg-rose-500 hover:bg-rose-600" : "bg-gray-200 hover:bg-gray-300"
                            }`}
                            onClick={() => {}}
                          />
                        ))}
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <Label className="flex items-center gap-2">
                          <Smile className="h-4 w-4" />
                          Mood
                        </Label>
                        <span className="text-sm text-gray-600 capitalize">{wellnessData.mood}</span>
                      </div>
                      <div className="flex gap-2">
                        {["terrible", "bad", "okay", "good", "great"].map((mood) => (
                          <button
                            key={mood}
                            className={`p-2 rounded-lg transition-colors ${
                              wellnessData.mood === mood
                                ? "bg-blue-100 border-2 border-blue-300"
                                : "bg-gray-100 hover:bg-gray-200"
                            }`}
                            onClick={() => {}}
                          >
                            {getMoodIcon(mood)}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <Label className="flex items-center gap-2 mb-2">
                        <Thermometer className="h-4 w-4" />
                        Temperature
                      </Label>
                      <div className="flex items-center gap-2">
                        <Input type="number" step="0.1" defaultValue={wellnessData.temperature} className="w-24" />
                        <span className="text-sm text-gray-600">°F</span>
                      </div>
                    </div>

                    <div>
                      <Label className="mb-2 block">Symptoms</Label>
                      <div className="grid grid-cols-2 gap-2">
                        {Object.entries(wellnessData.symptoms).map(([symptom, level]) => (
                          <div key={symptom} className="flex items-center justify-between p-2 border rounded">
                            <span className="text-sm capitalize">{symptom}</span>
                            <div className="flex gap-1">
                              {[1, 2, 3].map((i) => (
                                <div
                                  key={i}
                                  className={`w-2 h-2 rounded-full ${i <= level ? "bg-orange-500" : "bg-gray-200"}`}
                                />
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="notes" className="mb-2 block">
                        Notes
                      </Label>
                      <Textarea
                        id="notes"
                        placeholder="How are you feeling today?"
                        defaultValue={wellnessData.notes}
                        rows={3}
                      />
                    </div>
                  </div>

                  <Button className="w-full bg-rose-600 hover:bg-rose-700">
                    <Check className="h-4 w-4 mr-2" />
                    Update Today's Log
                  </Button>
                </CardContent>
              </Card>

              {/* Cycle Calendar */}
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CalendarIcon className="h-5 w-5" />
                    Cycle Calendar
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-7 gap-1 text-center text-sm font-medium text-gray-600">
                      {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                        <div key={day} className="p-2">
                          {day}
                        </div>
                      ))}
                    </div>

                    <div className="grid grid-cols-7 gap-1">
                      {eachDayOfInterval({
                        start: startOfMonth(new Date()),
                        end: endOfMonth(new Date()),
                      }).map((day) => {
                        const isPeriodDay =
                          day >= cycleData.lastPeriod &&
                          day <= addDays(cycleData.lastPeriod, cycleData.periodLength - 1)
                        const isOvulation = isSameDay(day, addDays(cycleData.lastPeriod, 14))
                        const isFertile =
                          day >= addDays(cycleData.lastPeriod, 11) && day <= addDays(cycleData.lastPeriod, 16)

                        return (
                          <button
                            key={day.toISOString()}
                            className={`
                              p-2 text-sm rounded-lg transition-colors relative
                              ${isToday(day) ? "ring-2 ring-blue-500" : ""}
                              ${isPeriodDay ? "bg-red-100 text-red-800 hover:bg-red-200" : ""}
                              ${isOvulation ? "bg-purple-100 text-purple-800 hover:bg-purple-200" : ""}
                              ${isFertile && !isPeriodDay && !isOvulation ? "bg-green-100 text-green-800 hover:bg-green-200" : ""}
                              ${!isPeriodDay && !isOvulation && !isFertile ? "hover:bg-gray-100" : ""}
                            `}
                          >
                            {format(day, "d")}
                            {isPeriodDay && (
                              <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-red-500 rounded-full"></div>
                            )}
                            {isOvulation && (
                              <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-purple-500 rounded-full"></div>
                            )}
                          </button>
                        )
                      })}
                    </div>

                    <div className="flex flex-wrap gap-4 text-xs">
                      <div className="flex items-center gap-1">
                        <div className="w-3 h-3 bg-red-100 rounded border"></div>
                        <span>Period</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <div className="w-3 h-3 bg-green-100 rounded border"></div>
                        <span>Fertile</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <div className="w-3 h-3 bg-purple-100 rounded border"></div>
                        <span>Ovulation</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <div className="w-3 h-3 border-2 border-blue-500 rounded"></div>
                        <span>Today</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Wellness Insights */}
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Wellness Insights
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="space-y-3">
                    <h4 className="font-medium">Cycle Regularity</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Average cycle length</span>
                        <span className="font-medium">{cycleData.cycleLength} days</span>
                      </div>
                      <Progress value={85} className="h-2" />
                      <p className="text-xs text-gray-600">85% regular - Very good!</p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <h4 className="font-medium">Symptom Trends</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Most common</span>
                        <span className="font-medium">Fatigue</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Improving</span>
                        <span className="font-medium text-green-600">Cramps ↓</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Watch</span>
                        <span className="font-medium text-orange-600">Headaches ↑</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <h4 className="font-medium">Mood Patterns</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Overall mood</span>
                        <span className="font-medium">Good</span>
                      </div>
                      <div className="flex gap-1">
                        {["😢", "😕", "😐", "😊", "😄"].map((emoji, index) => (
                          <div
                            key={index}
                            className={`flex-1 h-2 rounded ${index === 3 ? "bg-blue-500" : "bg-gray-200"}`}
                          />
                        ))}
                      </div>
                      <p className="text-xs text-gray-600">Stable mood this cycle</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Wellness Tips */}
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lightbulb className="h-5 w-5" />
                  Personalized Wellness Tips
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <Droplets className="h-4 w-4 text-blue-600" />
                      </div>
                      <div>
                        <h4 className="font-medium text-blue-900 mb-1">Stay Hydrated</h4>
                        <p className="text-sm text-blue-800">
                          You're in your luteal phase. Drinking 8-10 glasses of water daily can help reduce bloating and
                          support your body's natural processes.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <Activity className="h-4 w-4 text-green-600" />
                      </div>
                      <div>
                        <h4 className="font-medium text-green-900 mb-1">Gentle Exercise</h4>
                        <p className="text-sm text-green-800">
                          Light yoga or walking can help manage PMS symptoms. Your energy might be lower, so listen to
                          your body.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <Heart className="h-4 w-4 text-purple-600" />
                      </div>
                      <div>
                        <h4 className="font-medium text-purple-900 mb-1">Self-Care Time</h4>
                        <p className="text-sm text-purple-800">
                          Your period is approaching. Plan some relaxing activities and ensure you have your Period Calm
                          supply ready.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 bg-orange-50 rounded-lg border border-orange-200">
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <BookOpen className="h-4 w-4 text-orange-600" />
                      </div>
                      <div>
                        <h4 className="font-medium text-orange-900 mb-1">Nutrition Focus</h4>
                        <p className="text-sm text-orange-800">
                          Include iron-rich foods like spinach and lentils. Magnesium from nuts and seeds can help with
                          cramps.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
