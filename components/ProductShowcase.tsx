"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useCartStore } from "@/lib/cart-store"
import { useAnalytics } from "@/hooks/useAnalytics"
// Removed admin-store import - using default product data

import { AnimatedCounter } from "@/components/AnimatedCounter"
import {
  Star,
  Leaf,
  Shield,
  Award,
  ChevronLeft,
  ChevronRight,
  Heart,
  Truck,
  RotateCcw,
  Clock,
  Users,
  CheckCircle,
  Minus,
  Plus,
  Zap,
  RefreshCw,
} from "lucide-react"
import Image from "next/image"

// Icon mapping for dynamic icons
const iconMap = {
  Heart,
  Zap,
  Users,
  CheckCircle,
  Clock,
  Shield,
  Leaf,
  Award,
  Star,
}

// Default product data as fallback
const defaultProduct = {
  id: "main-product",
  name: "Period Calm",
  subtitle: "Natural Relief Powder",
  description:
    "Transform your period experience with our scientifically formulated powder drink. Get relief from cramps, mood swings, and fatigue in just 15-20 minutes.",
  price: 1299,
  originalPrice: 1599,
  stock: 150,
  category: "Supplements",
  status: "active" as const,
  images: [
    { src: "/images/packaging.png", alt: "Product Front View", label: "Front" },
    { src: "/images/packaging.png", alt: "Product Back View", label: "Back" },
    { src: "/images/packaging.png", alt: "Lifestyle Shot", label: "Lifestyle" },
    { src: "/images/packaging.png", alt: "Usage Instructions", label: "Instructions" },
  ],
  sku: "PC-MAIN-001",
  rating: 4.9,
  reviewCount: 2847,
  customerCount: 500, // Updated to trial phase number
  createdAt: "2024-01-01T00:00:00Z",
  updatedAt: "2024-01-15T00:00:00Z",

  keyIngredients: [
    {
      name: "Magnesium Glycinate",
      amount: "",
      benefit: "Muscle relaxation & cramp relief",
      description: "Highly bioavailable form that reduces muscle tension and cramping",
      color: "rose",
    },
    {
      name: "Ginger Extract",
      amount: "",
      benefit: "Anti-inflammatory & nausea relief",
      description: "Clinically proven to reduce inflammation and digestive discomfort",
      color: "orange",
    },
    {
      name: "L-Theanine",
      amount: "",
      benefit: "Calm focus & stress relief",
      description: "Promotes relaxation without drowsiness, balances mood",
      color: "green",
    },
    {
      name: "GABA",
      amount: "",
      benefit: "Natural anxiety relief",
      description: "Neurotransmitter that promotes calm and reduces anxiety",
      color: "blue",
    },
    {
      name: "Rhodiola Rosea",
      amount: "",
      benefit: "Adaptogenic stress support",
      description: "Helps body adapt to stress and supports energy levels",
      color: "purple",
    },
    {
      name: "Peppermint Extract",
      amount: "",
      benefit: "Digestive comfort & freshness",
      description: "Soothes digestive system and reduces bloating",
      color: "teal",
    },
  ],

  benefits: [
    {
      icon: "Heart",
      percentage: 92,
      text: "reduction in menstrual pain within 15-20 minutes",
      color: "rose",
    },
    {
      icon: "Zap",
      percentage: 89,
      text: "improvement in mood stability and emotional balance",
      color: "orange",
    },
    {
      icon: "Users",
      percentage: 85,
      text: "increase in energy levels without crashes",
      color: "pink",
    },
    {
      icon: "CheckCircle",
      percentage: 87,
      text: "reduction in bloating and water retention",
      color: "purple",
    },
  ],

  usageSteps: [
    {
      step: "1",
      title: "Daily Prevention",
      description: "Mix 1 sachet with 250ml of water. Drink 1-2 times daily during your cycle.",
      icon: "Clock",
      color: "rose",
    },
    {
      step: "2",
      title: "Acute Relief",
      description: "At first sign of cramps, mix 1 sachet with 200ml cold water and drink immediately.",
      icon: "Zap",
      color: "orange",
    },
    {
      step: "3",
      title: "Optimal Results",
      description: "Start 1-2 days before expected period for maximum prevention and comfort.",
      icon: "CheckCircle",
      color: "green",
    },
  ],

  certifications: [
    {
      icon: "Leaf",
      label: "100% Natural",
      description: "Plant-based ingredients only",
      color: "green",
    },
    {
      icon: "Users",
      label: "Community-Validated",
      description: "Real feedback from trial participants",
      color: "blue",
    },
    {
      icon: "Shield",
      label: "Quality-First",
      description: "Committed to safety and effectiveness",
      color: "purple",
    },
    {
      icon: "Heart",
      label: "Transparent Development",
      description: "Building trust through honesty",
      color: "rose",
    },
  ],

  pricingPlans: {
    onetime: {
      price: 1299,
      originalPrice: 1599,
      savings: 300,
      perUnit: 1299,
      label: "One-time Purchase",
      description: "30 sachets (1 month supply)",
    },
    subscription: {
      price: 974,
      originalPrice: 1599,
      savings: 625,
      perUnit: 974,
      label: "Monthly Subscription",
      description: "30 sachets delivered monthly",
    },
  },

  tags: ["natural", "period-relief", "cramp-relief", "mood-support"],
  featured: true,
  badges: ["Best Seller", "Limited Offer"],
}

export function ProductShowcase() {
  const [currentImage, setCurrentImage] = useState(0)
  const [selectedTab, setSelectedTab] = useState("ingredients")
  const [isVisible, setIsVisible] = useState(false)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [isLoadingStats, setIsLoadingStats] = useState(true)
  const { addItem } = useCartStore()
  const { analyticsData, isLoading } = useAnalytics()
  // Removed admin-store usage - using default product data

  // Use default product data with dynamic values from analytics
  const product = {
    ...defaultProduct,
    rating: analyticsData?.average_ratings?.overall_satisfaction || defaultProduct.rating,
    reviewCount: analyticsData?.total_submissions || defaultProduct.reviewCount,
    customerCount: analyticsData?.total_submissions || defaultProduct.customerCount
  }

  useEffect(() => {
    setIsVisible(true)
  }, [])

  const nextImage = () => {
    setCurrentImage((prev) => (prev === product.images.length - 1 ? 0 : prev + 1))
  }

  const prevImage = () => {
    setCurrentImage((prev) => (prev === 0 ? product.images.length - 1 : prev - 1))
  }

  const getColorClasses = (color: string) => {
    const colors = {
      rose: "bg-rose-50 border-rose-200 text-rose-700",
      orange: "bg-orange-50 border-orange-200 text-orange-700",
      green: "bg-green-50 border-green-200 text-green-700",
      blue: "bg-blue-50 border-blue-200 text-blue-700",
      purple: "bg-purple-50 border-purple-200 text-purple-700",
      teal: "bg-teal-50 border-teal-200 text-teal-700",
      pink: "bg-pink-50 border-pink-200 text-pink-700",
      yellow: "bg-yellow-50 border-yellow-200 text-yellow-700",
    }
    return colors[color as keyof typeof colors] || colors.rose
  }

  const getIcon = (iconName: string) => {
    return iconMap[iconName as keyof typeof iconMap] || Heart
  }

  return (
    <section className="py-20 bg-gradient-to-br from-gray-50 to-rose-50" id="product">
      <div className="container mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <div
          className={`text-center mb-16 transition-all duration-1000 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
        >
          <h2 className="text-3xl md:text-5xl font-light mb-4">
            Meet Your
            <span className="block font-semibold bg-gradient-to-r from-rose-600 to-orange-600 bg-clip-text text-transparent">
              Period Game Changer
            </span>
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Scientifically formulated with premium natural ingredients for fast, effective relief
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-start">
          {/* Product Images */}
          <div
            className={`space-y-6 transition-all duration-1000 delay-200 ${isVisible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-10"}`}
          >
            {/* Main Image */}
            <div className="relative group">
              <div className="relative bg-white rounded-3xl p-8 shadow-2xl border border-gray-100 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-rose-50/50 to-orange-50/50"></div>
                <Image
                  src={product.images[currentImage]?.src || "/placeholder.svg"}
                  alt={product.images[currentImage]?.alt || product.name}
                  width={400}
                  height={500}
                  className="mx-auto relative z-10 transform group-hover:scale-105 transition-transform duration-500"
                  priority
                />

                {/* Navigation Arrows */}
                <button
                  onClick={prevImage}
                  className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white rounded-full p-3 shadow-lg transition-all duration-300 hover:scale-110 z-20"
                >
                  <ChevronLeft className="w-5 h-5 text-gray-700" />
                </button>
                <button
                  onClick={nextImage}
                  className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white rounded-full p-3 shadow-lg transition-all duration-300 hover:scale-110 z-20"
                >
                  <ChevronRight className="w-5 h-5 text-gray-700" />
                </button>

                {/* Image Indicator */}
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-white/90 rounded-full px-3 py-1 text-sm font-medium z-20">
                  {product.images[currentImage]?.label || "Product"}
                </div>
              </div>

              {/* Thumbnail Navigation */}
              <div className="flex justify-center space-x-3 mt-4">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImage(index)}
                    className={`w-16 h-16 rounded-xl border-2 overflow-hidden transition-all duration-300 ${
                      currentImage === index
                        ? "border-rose-500 shadow-lg scale-110"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <Image
                      src={image.src || "/placeholder.svg"}
                      alt={image.alt}
                      width={64}
                      height={64}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Trust Indicators */}
            <div className="grid grid-cols-2 gap-4">
              {product.certifications.map((cert, index) => {
                const Icon = getIcon(cert.icon)
                return (
                  <div
                    key={index}
                    className={`bg-white rounded-xl p-4 shadow-sm border transition-all duration-300 hover:shadow-md hover:scale-105 ${getColorClasses(cert.color)}`}
                  >
                    <div className="flex items-center space-x-3">
                      <Icon className="w-6 h-6 flex-shrink-0" />
                      <div>
                        <div className="font-semibold text-sm">{cert.label}</div>
                        <div className="text-xs opacity-80">{cert.description}</div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Product Details */}
          <div
            className={`space-y-8 transition-all duration-1000 delay-400 w-full overflow-hidden ${isVisible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-10"}`}
          >
            {/* Product Header */}
            <div>
              <div className="flex items-center gap-3 mb-4">
                {product.badges.map((badge, index) => (
                  <Badge key={index} className="bg-rose-100 text-rose-700 px-3 py-1">
                    <Star className="w-4 h-4 mr-1" />
                    {badge}
                  </Badge>
                ))}
              </div>

              <h2 className="text-3xl md:text-4xl font-light mb-4">
                {product.name}
                <span className="block font-semibold text-rose-600">{product.subtitle}</span>
              </h2>

              <div className="flex items-center space-x-4 mb-4">
                <div className="flex items-center">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <Star key={i} className="w-5 h-5 fill-rose-400 text-rose-400" />
                  ))}
                  <span className="ml-2 font-semibold">
                    {isLoading ? (
                      <span className="text-gray-400">Loading...</span>
                    ) : (
                      <span>{product.rating.toFixed(1)}</span>
                    )}
                  </span>
                </div>
                <span className="text-gray-600">
                  {isLoading ? (
                    "(Loading...)"
                  ) : (
                    `(${product.reviewCount} reviews)`
                  )}
                </span>
                <Badge variant="outline" className="text-xs">
                  <Users className="w-3 h-3 mr-1" />
                  {isLoading ? (
                    "Loading..."
                  ) : (
                    <span>{product.customerCount}+</span>
                  )} happy users
                </Badge>
                <button
                  onClick={async () => {
                    setIsRefreshing(true)
                    // await syncWithFeedbackData() // Removed syncWithFeedbackData
                    setIsRefreshing(false)
                  }}
                  className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                  title="Refresh stats"
                  disabled={isRefreshing}
                >
                  <RefreshCw className={`w-4 h-4 text-gray-500 ${isRefreshing ? 'animate-spin' : ''}`} />
                </button>
                <button
                  onClick={() => {
                    // debugStats() // Removed debugStats
                  }}
                  className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                  title="Debug stats"
                >
                  <span className="w-4 h-4 text-gray-500 text-xs">🔍</span>
                </button>
                <button
                  onClick={() => {
                    // clearStore() // Removed clearStore
                  }}
                  className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                  title="Clear store"
                >
                  <span className="w-4 h-4 text-gray-500 text-xs">🗑️</span>
                </button>
              </div>

              <p className="text-lg text-gray-600 leading-relaxed break-words">{product.description}</p>
            </div>

            {/* Product Information Tabs */}
            <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full overflow-hidden">
              <TabsList className="grid w-full grid-cols-3 bg-gray-100 p-1 rounded-xl">
                <TabsTrigger
                  value="ingredients"
                  className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm"
                >
                  Ingredients
                </TabsTrigger>
                <TabsTrigger
                  value="benefits"
                  className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm"
                >
                  Benefits
                </TabsTrigger>
                <TabsTrigger
                  value="usage"
                  className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm"
                >
                  How to Use
                </TabsTrigger>
              </TabsList>

              <TabsContent value="ingredients" className="space-y-4 mt-6">
                <div className="grid gap-4">
                  {product.keyIngredients.map((ingredient, index) => (
                    <Card
                      key={index}
                      className={`border transition-all duration-300 hover:shadow-md ${getColorClasses(ingredient.color)}`}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex-1 min-w-0">
                            <div className="mb-1">
                              <h4 className="font-semibold break-words">{ingredient.name}</h4>
                            </div>
                            <p className="text-sm font-medium mb-1 break-words">{ingredient.benefit}</p>
                            <p className="text-xs opacity-80 break-words leading-relaxed">{ingredient.description}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
                <div className="mt-6 p-4 bg-rose-50 rounded-xl border border-rose-200">
                  <p className="text-sm text-rose-700 text-center">
                    <Heart className="w-4 h-4 inline mr-2" />
                    Formulated with research-backed ingredients for natural relief
                  </p>
                </div>
              </TabsContent>

              <TabsContent value="benefits" className="space-y-4 mt-6">
                <div className="grid gap-4">
                  {product.benefits.map((benefit, index) => {
                    const Icon = getIcon(benefit.icon)
                    return (
                      <div
                        key={index}
                        className={`p-4 rounded-xl border transition-all duration-300 hover:shadow-md ${getColorClasses(benefit.color)}`}
                      >
                        <div className="flex items-center space-x-4">
                          <Icon className="w-8 h-8 flex-shrink-0" />
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-2xl font-bold">{benefit.percentage}%</span>
                              <span className="text-sm opacity-80">of users report</span>
                            </div>
                            <p className="text-sm font-medium break-words">{benefit.text}</p>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </TabsContent>

              <TabsContent value="usage" className="space-y-4 mt-6">
                <div className="space-y-4">
                  {product.usageSteps.map((step, index) => {
                    const Icon = getIcon(step.icon)
                    return (
                      <div
                        key={index}
                        className={`p-4 rounded-xl border transition-all duration-300 hover:shadow-md ${getColorClasses(step.color)}`}
                      >
                        <div className="flex items-start space-x-4">
                          <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center font-bold text-sm flex-shrink-0">
                            {step.step}
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="font-semibold mb-2 flex items-center gap-2">
                              <Icon className="w-4 h-4" />
                              {step.title}
                            </h4>
                            <p className="text-sm opacity-90 break-words">{step.description}</p>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </section>
  )
}

export default ProductShowcase
