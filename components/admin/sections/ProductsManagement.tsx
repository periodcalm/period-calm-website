"use client"

import type React from "react"

import { useState, useEffect } from "react"
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Plus, Edit, Trash2, Search, Package, AlertTriangle, Save } from "lucide-react"
import {
  useAdminStore,
  type Product,
  type ProductIngredient,
  type ProductBenefit,
  type ProductUsageStep,
  type ProductCertification,
} from "@/lib/admin-store"
import { toast } from "sonner"

export function ProductsManagement() {
  const { products, loading, error, fetchProducts, addProductSupabase, updateProductSupabase, deleteProductSupabase } = useAdminStore()
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [activeTab, setActiveTab] = useState("basic")

  // Basic product form data
  const [basicData, setBasicData] = useState({
    name: "",
    subtitle: "",
    description: "",
    price: "",
    originalPrice: "",
    stock: "",
    category: "",
    status: "active" as Product["status"],
    sku: "",
    rating: "",
    reviewCount: "",
    customerCount: "",
    tags: "",
    badges: "",
  })

  // Detailed product data
  const [ingredients, setIngredients] = useState<ProductIngredient[]>([])
  const [benefits, setBenefits] = useState<ProductBenefit[]>([])
  const [usageSteps, setUsageSteps] = useState<ProductUsageStep[]>([])
  const [certifications, setCertifications] = useState<ProductCertification[]>([])
  const [pricingPlans, setPricingPlans] = useState({
    onetime: { price: "", originalPrice: "", savings: "", perUnit: "", label: "", description: "" },
    subscription: { price: "", originalPrice: "", savings: "", perUnit: "", label: "", description: "" },
  })

  useEffect(() => {
    fetchProducts()
  }, [fetchProducts])

  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.sku.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || product.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const resetForm = () => {
    setBasicData({
      name: "",
      subtitle: "",
      description: "",
      price: "",
      originalPrice: "",
      stock: "",
      category: "",
      status: "active",
      sku: "",
      rating: "",
      reviewCount: "",
      customerCount: "",
      tags: "",
      badges: "",
    })
    setIngredients([])
    setBenefits([])
    setUsageSteps([])
    setCertifications([])
    setPricingPlans({
      onetime: { price: "", originalPrice: "", savings: "", perUnit: "", label: "", description: "" },
      subscription: { price: "", originalPrice: "", savings: "", perUnit: "", label: "", description: "" },
    })
    setEditingProduct(null)
    setActiveTab("basic")
  }

  const handleEdit = (product: Product) => {
    setEditingProduct(product)
    setBasicData({
      name: product.name,
      subtitle: product.subtitle,
      description: product.description,
      price: product.price.toString(),
      originalPrice: product.originalPrice?.toString() || "",
      stock: product.stock.toString(),
      category: product.category,
      status: product.status,
      sku: product.sku,
      rating: product.rating.toString(),
      reviewCount: product.reviewCount.toString(),
      customerCount: product.customerCount.toString(),
      tags: product.tags.join(", "),
      badges: product.badges.join(", "),
    })
    setIngredients(product.keyIngredients || [])
    setBenefits(product.benefits || [])
    setUsageSteps(product.usageSteps || [])
    setCertifications(product.certifications || [])
    setPricingPlans({
      onetime: {
        price: product.pricingPlans?.onetime?.price?.toString() || "",
        originalPrice: product.pricingPlans?.onetime?.originalPrice?.toString() || "",
        savings: product.pricingPlans?.onetime?.savings?.toString() || "",
        perUnit: product.pricingPlans?.onetime?.perUnit?.toString() || "",
        label: product.pricingPlans?.onetime?.label || "",
        description: product.pricingPlans?.onetime?.description || "",
      },
      subscription: {
        price: product.pricingPlans?.subscription?.price?.toString() || "",
        originalPrice: product.pricingPlans?.subscription?.originalPrice?.toString() || "",
        savings: product.pricingPlans?.subscription?.savings?.toString() || "",
        perUnit: product.pricingPlans?.subscription?.perUnit?.toString() || "",
        label: product.pricingPlans?.subscription?.label || "",
        description: product.pricingPlans?.subscription?.description || "",
      },
    })
    setIsAddDialogOpen(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!basicData.name || !basicData.price || !basicData.stock) {
      toast.error("Please fill in all required fields")
      return
    }

    const productData: Omit<Product, "id" | "createdAt" | "updatedAt"> = {
      name: basicData.name,
      subtitle: basicData.subtitle,
      description: basicData.description,
      price: Number.parseFloat(basicData.price),
      originalPrice: basicData.originalPrice ? Number.parseFloat(basicData.originalPrice) : undefined,
      stock: Number.parseInt(basicData.stock),
      category: basicData.category || "Supplements",
      status: basicData.status,
      sku: basicData.sku || `PC-${Date.now()}`,
      rating: Number.parseFloat(basicData.rating) || 4.9,
      reviewCount: Number.parseInt(basicData.reviewCount) || 0,
      customerCount: Number.parseInt(basicData.customerCount) || 0,
      tags: basicData.tags
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean),
      badges: basicData.badges
        .split(",")
        .map((badge) => badge.trim())
        .filter(Boolean),
      featured: true,
      images: [
        { src: "/images/packaging.png", alt: "Product Front View", label: "Front" },
        { src: "/images/packaging.png", alt: "Product Back View", label: "Back" },
        { src: "/images/packaging.png", alt: "Lifestyle Shot", label: "Lifestyle" },
        { src: "/images/packaging.png", alt: "Usage Instructions", label: "Instructions" },
      ],
      keyIngredients: ingredients,
      benefits: benefits,
      usageSteps: usageSteps,
      certifications: certifications,
      pricingPlans: {
        onetime: {
          price: Number.parseFloat(pricingPlans.onetime.price) || Number.parseFloat(basicData.price),
          originalPrice:
            Number.parseFloat(pricingPlans.onetime.originalPrice) ||
            Number.parseFloat(basicData.originalPrice || basicData.price),
          savings: Number.parseFloat(pricingPlans.onetime.savings) || 0,
          perUnit: Number.parseFloat(pricingPlans.onetime.perUnit) || Number.parseFloat(basicData.price),
          label: pricingPlans.onetime.label || "One-time Purchase",
          description: pricingPlans.onetime.description || "Single purchase",
        },
        subscription: {
          price: Number.parseFloat(pricingPlans.subscription.price) || Number.parseFloat(basicData.price) * 0.75,
          originalPrice:
            Number.parseFloat(pricingPlans.subscription.originalPrice) ||
            Number.parseFloat(basicData.originalPrice || basicData.price),
          savings: Number.parseFloat(pricingPlans.subscription.savings) || Number.parseFloat(basicData.price) * 0.25,
          perUnit: Number.parseFloat(pricingPlans.subscription.perUnit) || Number.parseFloat(basicData.price) * 0.75,
          label: pricingPlans.subscription.label || "Monthly Subscription",
          description: pricingPlans.subscription.description || "Monthly delivery",
        },
      },
    }

    try {
      if (editingProduct) {
        await updateProductSupabase(editingProduct.id, productData)
        toast.success("Product updated successfully")
      } else {
        await addProductSupabase(productData)
        toast.success("Product added successfully")
      }
    } catch (err) {
      toast.error("Failed to save product")
    }

    resetForm()
    setIsAddDialogOpen(false)
  }

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this product?")) {
      try {
        await deleteProductSupabase(id)
        toast.success("Product deleted successfully")
      } catch (err) {
        toast.error("Failed to delete product")
      }
    }
  }

  const addIngredient = () => {
    setIngredients([...ingredients, { name: "", amount: "", benefit: "", description: "", color: "rose" }])
  }

  const updateIngredient = (index: number, field: keyof ProductIngredient, value: string) => {
    const updated = [...ingredients]
    updated[index] = { ...updated[index], [field]: value }
    setIngredients(updated)
  }

  const removeIngredient = (index: number) => {
    setIngredients(ingredients.filter((_, i) => i !== index))
  }

  const addBenefit = () => {
    setBenefits([...benefits, { icon: "Heart", percentage: 0, text: "", color: "rose" }])
  }

  const updateBenefit = (index: number, field: keyof ProductBenefit, value: string | number) => {
    const updated = [...benefits]
    updated[index] = { ...updated[index], [field]: value }
    setBenefits(updated)
  }

  const removeBenefit = (index: number) => {
    setBenefits(benefits.filter((_, i) => i !== index))
  }

  const addUsageStep = () => {
    setUsageSteps([
      ...usageSteps,
      { step: (usageSteps.length + 1).toString(), title: "", description: "", icon: "Clock", color: "rose" },
    ])
  }

  const updateUsageStep = (index: number, field: keyof ProductUsageStep, value: string) => {
    const updated = [...usageSteps]
    updated[index] = { ...updated[index], [field]: value }
    setUsageSteps(updated)
  }

  const removeUsageStep = (index: number) => {
    setUsageSteps(usageSteps.filter((_, i) => i !== index))
  }

  const addCertification = () => {
    setCertifications([...certifications, { icon: "Shield", label: "", description: "", color: "blue" }])
  }

  const updateCertification = (index: number, field: keyof ProductCertification, value: string) => {
    const updated = [...certifications]
    updated[index] = { ...updated[index], [field]: value }
    setCertifications(updated)
  }

  const removeCertification = (index: number) => {
    setCertifications(certifications.filter((_, i) => i !== index))
  }

  const getStatusColor = (status: Product["status"]) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800 border-green-200"
      case "inactive":
        return "bg-gray-100 text-gray-800 border-gray-200"
      case "draft":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const lowStockCount = products.filter((p) => p.stock < 10).length

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Products Management</h1>
          <p className="text-gray-600 mt-1">Manage your product catalog and showcase details</p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm}>
              <Plus className="w-4 h-4 mr-2" />
              Add Product
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingProduct ? "Edit Product" : "Add New Product"}</DialogTitle>
              <DialogDescription>
                {editingProduct
                  ? "Update product information and showcase details"
                  : "Create a new product with complete showcase information"}
              </DialogDescription>
            </DialogHeader>

            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-5">
                <TabsTrigger value="basic">Basic Info</TabsTrigger>
                <TabsTrigger value="ingredients">Ingredients</TabsTrigger>
                <TabsTrigger value="benefits">Benefits</TabsTrigger>
                <TabsTrigger value="usage">Usage Steps</TabsTrigger>
                <TabsTrigger value="pricing">Pricing</TabsTrigger>
              </TabsList>

              <form onSubmit={handleSubmit} className="space-y-4">
                <TabsContent value="basic" className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Product Name *</Label>
                      <Input
                        id="name"
                        value={basicData.name}
                        onChange={(e) => setBasicData({ ...basicData, name: e.target.value })}
                        placeholder="Period Calm"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="subtitle">Subtitle</Label>
                      <Input
                        id="subtitle"
                        value={basicData.subtitle}
                        onChange={(e) => setBasicData({ ...basicData, subtitle: e.target.value })}
                        placeholder="Natural Relief Powder"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      value={basicData.description}
                      onChange={(e) => setBasicData({ ...basicData, description: e.target.value })}
                      placeholder="Transform your period experience with our scientifically formulated powder drink..."
                      rows={3}
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="price">Price (₹) *</Label>
                      <Input
                        id="price"
                        type="number"
                        value={basicData.price}
                        onChange={(e) => setBasicData({ ...basicData, price: e.target.value })}
                        placeholder="1299"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="originalPrice">Original Price (₹)</Label>
                      <Input
                        id="originalPrice"
                        type="number"
                        value={basicData.originalPrice}
                        onChange={(e) => setBasicData({ ...basicData, originalPrice: e.target.value })}
                        placeholder="1599"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="stock">Stock Quantity *</Label>
                      <Input
                        id="stock"
                        type="number"
                        value={basicData.stock}
                        onChange={(e) => setBasicData({ ...basicData, stock: e.target.value })}
                        placeholder="150"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="rating">Rating</Label>
                      <Input
                        id="rating"
                        type="number"
                        step="0.1"
                        max="5"
                        value={basicData.rating}
                        onChange={(e) => setBasicData({ ...basicData, rating: e.target.value })}
                        placeholder="4.9"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="reviewCount">Review Count</Label>
                      <Input
                        id="reviewCount"
                        type="number"
                        value={basicData.reviewCount}
                        onChange={(e) => setBasicData({ ...basicData, reviewCount: e.target.value })}
                        placeholder="2847"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="customerCount">Customer Count</Label>
                      <Input
                        id="customerCount"
                        type="number"
                        value={basicData.customerCount}
                        onChange={(e) => setBasicData({ ...basicData, customerCount: e.target.value })}
                        placeholder="500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="tags">Tags (comma-separated)</Label>
                      <Input
                        id="tags"
                        value={basicData.tags}
                        onChange={(e) => setBasicData({ ...basicData, tags: e.target.value })}
                        placeholder="natural, period-relief, cramp-relief"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="badges">Badges (comma-separated)</Label>
                      <Input
                        id="badges"
                        value={basicData.badges}
                        onChange={(e) => setBasicData({ ...basicData, badges: e.target.value })}
                        placeholder="Best Seller, Limited Offer"
                      />
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="ingredients" className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold">Key Ingredients</h3>
                    <Button type="button" onClick={addIngredient} size="sm">
                      <Plus className="w-4 h-4 mr-2" />
                      Add Ingredient
                    </Button>
                  </div>

                  {ingredients.map((ingredient, index) => (
                    <Card key={index}>
                      <CardContent className="p-4 space-y-3">
                        <div className="flex items-center justify-between">
                          <h4 className="font-medium">Ingredient {index + 1}</h4>
                          <Button type="button" variant="outline" size="sm" onClick={() => removeIngredient(index)}>
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                          <Input
                            placeholder="Name (e.g., Magnesium Glycinate)"
                            value={ingredient.name}
                            onChange={(e) => updateIngredient(index, "name", e.target.value)}
                          />
                          <Input
                            placeholder="Amount (e.g., 200mg)"
                            value={ingredient.amount}
                            onChange={(e) => updateIngredient(index, "amount", e.target.value)}
                          />
                        </div>
                        <Input
                          placeholder="Benefit (e.g., Muscle relaxation & cramp relief)"
                          value={ingredient.benefit}
                          onChange={(e) => updateIngredient(index, "benefit", e.target.value)}
                        />
                        <Textarea
                          placeholder="Description (e.g., Highly bioavailable form that reduces muscle tension and cramping)"
                          value={ingredient.description}
                          onChange={(e) => updateIngredient(index, "description", e.target.value)}
                          rows={2}
                        />
                        <Select
                          value={ingredient.color}
                          onValueChange={(value) => updateIngredient(index, "color", value)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select color theme" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="rose">Rose</SelectItem>
                            <SelectItem value="orange">Orange</SelectItem>
                            <SelectItem value="green">Green</SelectItem>
                            <SelectItem value="blue">Blue</SelectItem>
                            <SelectItem value="purple">Purple</SelectItem>
                            <SelectItem value="teal">Teal</SelectItem>
                          </SelectContent>
                        </Select>
                      </CardContent>
                    </Card>
                  ))}
                </TabsContent>

                <TabsContent value="benefits" className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold">Product Benefits</h3>
                    <Button type="button" onClick={addBenefit} size="sm">
                      <Plus className="w-4 h-4 mr-2" />
                      Add Benefit
                    </Button>
                  </div>

                  {benefits.map((benefit, index) => (
                    <Card key={index}>
                      <CardContent className="p-4 space-y-3">
                        <div className="flex items-center justify-between">
                          <h4 className="font-medium">Benefit {index + 1}</h4>
                          <Button type="button" variant="outline" size="sm" onClick={() => removeBenefit(index)}>
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                        <div className="grid grid-cols-3 gap-3">
                          <Select value={benefit.icon} onValueChange={(value) => updateBenefit(index, "icon", value)}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select icon" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Heart">Heart</SelectItem>
                              <SelectItem value="Zap">Zap</SelectItem>
                              <SelectItem value="Users">Users</SelectItem>
                              <SelectItem value="CheckCircle">CheckCircle</SelectItem>
                              <SelectItem value="Shield">Shield</SelectItem>
                            </SelectContent>
                          </Select>
                          <Input
                            type="number"
                            placeholder="Percentage (e.g., 92)"
                            value={benefit.percentage}
                            onChange={(e) => updateBenefit(index, "percentage", Number.parseInt(e.target.value) || 0)}
                          />
                          <Select value={benefit.color} onValueChange={(value) => updateBenefit(index, "color", value)}>
                            <SelectTrigger>
                              <SelectValue placeholder="Color" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="rose">Rose</SelectItem>
                              <SelectItem value="orange">Orange</SelectItem>
                              <SelectItem value="green">Green</SelectItem>
                              <SelectItem value="blue">Blue</SelectItem>
                              <SelectItem value="purple">Purple</SelectItem>
                              <SelectItem value="pink">Pink</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <Input
                          placeholder="Benefit text (e.g., reduction in menstrual pain within 15-20 minutes)"
                          value={benefit.text}
                          onChange={(e) => updateBenefit(index, "text", e.target.value)}
                        />
                      </CardContent>
                    </Card>
                  ))}
                </TabsContent>

                <TabsContent value="usage" className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold">Usage Steps</h3>
                    <Button type="button" onClick={addUsageStep} size="sm">
                      <Plus className="w-4 h-4 mr-2" />
                      Add Step
                    </Button>
                  </div>

                  {usageSteps.map((step, index) => (
                    <Card key={index}>
                      <CardContent className="p-4 space-y-3">
                        <div className="flex items-center justify-between">
                          <h4 className="font-medium">Step {index + 1}</h4>
                          <Button type="button" variant="outline" size="sm" onClick={() => removeUsageStep(index)}>
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                        <div className="grid grid-cols-3 gap-3">
                          <Input
                            placeholder="Step number"
                            value={step.step}
                            onChange={(e) => updateUsageStep(index, "step", e.target.value)}
                          />
                          <Select value={step.icon} onValueChange={(value) => updateUsageStep(index, "icon", value)}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select icon" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Clock">Clock</SelectItem>
                              <SelectItem value="Zap">Zap</SelectItem>
                              <SelectItem value="CheckCircle">CheckCircle</SelectItem>
                              <SelectItem value="Heart">Heart</SelectItem>
                            </SelectContent>
                          </Select>
                          <Select value={step.color} onValueChange={(value) => updateUsageStep(index, "color", value)}>
                            <SelectTrigger>
                              <SelectValue placeholder="Color" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="rose">Rose</SelectItem>
                              <SelectItem value="orange">Orange</SelectItem>
                              <SelectItem value="green">Green</SelectItem>
                              <SelectItem value="blue">Blue</SelectItem>
                              <SelectItem value="purple">Purple</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <Input
                          placeholder="Step title (e.g., Daily Prevention)"
                          value={step.title}
                          onChange={(e) => updateUsageStep(index, "title", e.target.value)}
                        />
                        <Textarea
                          placeholder="Step description (e.g., Mix 1 sachet with 250ml of water...)"
                          value={step.description}
                          onChange={(e) => updateUsageStep(index, "description", e.target.value)}
                          rows={2}
                        />
                      </CardContent>
                    </Card>
                  ))}

                  <div className="mt-6">
                    <h3 className="text-lg font-semibold mb-4">Certifications</h3>
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-sm text-gray-600">Trust indicators and certifications</span>
                      <Button type="button" onClick={addCertification} size="sm">
                        <Plus className="w-4 h-4 mr-2" />
                        Add Certification
                      </Button>
                    </div>

                    {certifications.map((cert, index) => (
                      <Card key={index} className="mb-3">
                        <CardContent className="p-4 space-y-3">
                          <div className="flex items-center justify-between">
                            <h4 className="font-medium">Certification {index + 1}</h4>
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => removeCertification(index)}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                          <div className="grid grid-cols-2 gap-3">
                            <Select
                              value={cert.icon}
                              onValueChange={(value) => updateCertification(index, "icon", value)}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Select icon" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="Shield">Shield</SelectItem>
                                <SelectItem value="Leaf">Leaf</SelectItem>
                                <SelectItem value="Award">Award</SelectItem>
                                <SelectItem value="Star">Star</SelectItem>
                              </SelectContent>
                            </Select>
                            <Select
                              value={cert.color}
                              onValueChange={(value) => updateCertification(index, "color", value)}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Color" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="blue">Blue</SelectItem>
                                <SelectItem value="green">Green</SelectItem>
                                <SelectItem value="purple">Purple</SelectItem>
                                <SelectItem value="yellow">Yellow</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <Input
                            placeholder="Label (e.g., FSSAI Approved)"
                            value={cert.label}
                            onChange={(e) => updateCertification(index, "label", e.target.value)}
                          />
                          <Input
                            placeholder="Description (e.g., Manufactured in FSSAI-approved facility)"
                            value={cert.description}
                            onChange={(e) => updateCertification(index, "description", e.target.value)}
                          />
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </TabsContent>

                <TabsContent value="pricing" className="space-y-4">
                  <h3 className="text-lg font-semibold">Pricing Plans</h3>

                  <div className="grid grid-cols-2 gap-6">
                    <Card>
                      <CardHeader>
                        <CardTitle>One-time Purchase</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <Label>Price (₹)</Label>
                            <Input
                              type="number"
                              value={pricingPlans.onetime.price}
                              onChange={(e) =>
                                setPricingPlans({
                                  ...pricingPlans,
                                  onetime: { ...pricingPlans.onetime, price: e.target.value },
                                })
                              }
                              placeholder="1299"
                            />
                          </div>
                          <div>
                            <Label>Original Price (₹)</Label>
                            <Input
                              type="number"
                              value={pricingPlans.onetime.originalPrice}
                              onChange={(e) =>
                                setPricingPlans({
                                  ...pricingPlans,
                                  onetime: { ...pricingPlans.onetime, originalPrice: e.target.value },
                                })
                              }
                              placeholder="1599"
                            />
                          </div>
                        </div>
                        <div>
                          <Label>Label</Label>
                          <Input
                            value={pricingPlans.onetime.label}
                            onChange={(e) =>
                              setPricingPlans({
                                ...pricingPlans,
                                onetime: { ...pricingPlans.onetime, label: e.target.value },
                              })
                            }
                            placeholder="One-time Purchase"
                          />
                        </div>
                        <div>
                          <Label>Description</Label>
                          <Input
                            value={pricingPlans.onetime.description}
                            onChange={(e) =>
                              setPricingPlans({
                                ...pricingPlans,
                                onetime: { ...pricingPlans.onetime, description: e.target.value },
                              })
                            }
                            placeholder="30 sachets (1 month supply)"
                          />
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle>Subscription</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <Label>Price (₹)</Label>
                            <Input
                              type="number"
                              value={pricingPlans.subscription.price}
                              onChange={(e) =>
                                setPricingPlans({
                                  ...pricingPlans,
                                  subscription: { ...pricingPlans.subscription, price: e.target.value },
                                })
                              }
                              placeholder="974"
                            />
                          </div>
                          <div>
                            <Label>Original Price (₹)</Label>
                            <Input
                              type="number"
                              value={pricingPlans.subscription.originalPrice}
                              onChange={(e) =>
                                setPricingPlans({
                                  ...pricingPlans,
                                  subscription: { ...pricingPlans.subscription, originalPrice: e.target.value },
                                })
                              }
                              placeholder="1599"
                            />
                          </div>
                        </div>
                        <div>
                          <Label>Label</Label>
                          <Input
                            value={pricingPlans.subscription.label}
                            onChange={(e) =>
                              setPricingPlans({
                                ...pricingPlans,
                                subscription: { ...pricingPlans.subscription, label: e.target.value },
                              })
                            }
                            placeholder="Monthly Subscription"
                          />
                        </div>
                        <div>
                          <Label>Description</Label>
                          <Input
                            value={pricingPlans.subscription.description}
                            onChange={(e) =>
                              setPricingPlans({
                                ...pricingPlans,
                                subscription: { ...pricingPlans.subscription, description: e.target.value },
                              })
                            }
                            placeholder="30 sachets delivered monthly"
                          />
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>

                <DialogFooter>
                  <Button type="button" variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit">
                    <Save className="w-4 h-4 mr-2" />
                    {editingProduct ? "Update Product" : "Add Product"}
                  </Button>
                </DialogFooter>
              </form>
            </Tabs>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Package className="w-5 h-5 text-blue-500" />
              <div>
                <p className="text-sm text-gray-600">Total Products</p>
                <p className="text-2xl font-bold">{products.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 bg-green-500 rounded-full"></div>
              <div>
                <p className="text-sm text-gray-600">Active Products</p>
                <p className="text-2xl font-bold">{products.filter((p) => p.status === "active").length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-orange-500" />
              <div>
                <p className="text-sm text-gray-600">Low Stock</p>
                <p className="text-2xl font-bold">{lowStockCount}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 bg-purple-500 rounded-full"></div>
              <div>
                <p className="text-sm text-gray-600">Total Value</p>
                <p className="text-2xl font-bold">
                  ₹{products.reduce((sum, p) => sum + p.price * p.stock, 0).toLocaleString()}
                </p>
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
                placeholder="Search products..."
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
                <SelectItem value="inactive">Inactive</SelectItem>
                <SelectItem value="draft">Draft</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Products Table */}
      <Card>
        <CardHeader>
          <CardTitle>Products ({filteredProducts.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Product</TableHead>
                <TableHead>SKU</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Stock</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredProducts.map((product) => (
                <TableRow key={product.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <img
                        src={product.images?.[0]?.src || "/placeholder.svg"}
                        alt={product.name}
                        className="w-10 h-10 rounded-lg object-cover"
                      />
                      <div>
                        <p className="font-medium">
                          {product.name} {product.subtitle}
                        </p>
                        <p className="text-sm text-gray-500 truncate max-w-xs">{product.description}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="font-mono text-sm">{product.sku}</TableCell>
                  <TableCell>₹{product.price.toLocaleString()}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <span>{product.stock}</span>
                      {product.stock < 10 && <AlertTriangle className="w-4 h-4 text-orange-500" />}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(product.status)}>{product.status}</Badge>
                  </TableCell>
                  <TableCell>{product.category}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm" onClick={() => handleEdit(product)}>
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(product.id)}
                        className="text-red-600 hover:text-red-700"
                      >
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
