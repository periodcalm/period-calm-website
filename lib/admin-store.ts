"use client"

import { create } from "zustand"
import { persist } from "zustand/middleware"
import { getSupabaseBrowserClient } from "@/supabase/client"

export interface AdminNotification {
  id: string
  title: string
  message: string
  type: "info" | "warning" | "error" | "success"
  time: string
  read: boolean
}

export interface ProductIngredient {
  name: string
  amount: string
  benefit: string
  description: string
  color: string
}

export interface ProductBenefit {
  icon: string
  percentage: number
  text: string
  color: string
}

export interface ProductUsageStep {
  step: string
  title: string
  description: string
  icon: string
  color: string
}

export interface ProductCertification {
  icon: string
  label: string
  description: string
  color: string
}

export interface ProductImage {
  src: string
  alt: string
  label: string
}

export interface PricingPlan {
  price: number
  originalPrice: number
  savings: number
  perUnit: number
  label: string
  description: string
}

export interface Product {
  id: string
  name: string
  subtitle: string
  description: string
  price: number
  originalPrice?: number
  stock: number
  category: string
  status: "active" | "inactive" | "draft"
  images: ProductImage[]
  sku: string
  rating: number
  reviewCount: number
  customerCount: number
  createdAt: string
  updatedAt: string

  // Detailed product information
  keyIngredients: ProductIngredient[]
  benefits: ProductBenefit[]
  usageSteps: ProductUsageStep[]
  certifications: ProductCertification[]
  pricingPlans: {
    onetime: PricingPlan
    subscription: PricingPlan
  }

  // SEO and marketing
  tags: string[]
  featured: boolean
  badges: string[]
}

export interface Order {
  id: string
  customerId: string
  customerName: string
  customerEmail: string
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled"
  total: number
  items: Array<{
    productId: string
    productName: string
    quantity: number
    price: number
  }>
  shippingAddress: string
  paymentMethod: string
  createdAt: string
  updatedAt: string
  trackingNumber?: string
}

export interface Subscription {
  id: string
  customerId: string
  customerName: string
  customerEmail: string
  plan: string
  status: "active" | "paused" | "cancelled"
  nextBilling: string
  amount: number
  frequency: "monthly" | "quarterly" | "yearly"
  createdAt: string
}

export interface SupportTicket {
  id: string
  customerId: string
  customerName: string
  customerEmail: string
  subject: string
  status: "open" | "in-progress" | "resolved" | "closed"
  priority: "low" | "medium" | "high" | "urgent"
  category: string
  assignedTo?: string
  createdAt: string
  updatedAt: string
  messages: Array<{
    id: string
    sender: "customer" | "admin"
    message: string
    timestamp: string
  }>
}

interface AdminStore {
  activeSection: string
  notifications: AdminNotification[]
  products: Product[]
  orders: Order[]
  subscriptions: Subscription[]
  supportTickets: SupportTicket[]
  loading: boolean
  error: string | null

  // Actions
  setActiveSection: (section: string) => void
  addNotification: (notification: Omit<AdminNotification, "id">) => void
  markNotificationRead: (id: string) => void

  // Product actions
  addProduct: (product: Omit<Product, "id" | "createdAt" | "updatedAt">) => void
  updateProduct: (id: string, updates: Partial<Product>) => void
  deleteProduct: (id: string) => void
  getMainProduct: () => Product | undefined
  fetchProducts: () => Promise<void>
  addProductSupabase: (product: Omit<Product, "id">) => Promise<void>
  updateProductSupabase: (id: string, updates: Partial<Product>) => Promise<void>
  deleteProductSupabase: (id: string) => Promise<void>

  // Order actions
  updateOrderStatus: (id: string, status: Order["status"]) => void
  addTrackingNumber: (id: string, trackingNumber: string) => void

  // Subscription actions
  updateSubscriptionStatus: (id: string, status: Subscription["status"]) => void

  // Support actions
  updateTicketStatus: (id: string, status: SupportTicket["status"]) => void
  assignTicket: (id: string, assignedTo: string) => void
  addTicketMessage: (ticketId: string, message: Omit<SupportTicket["messages"][0], "id">) => void
}

export const useAdminStore = create<AdminStore>()(
  persist(
    (set, get) => ({
      activeSection: "dashboard",
      notifications: [
        {
          id: "1",
          title: "Low Stock Alert",
          message: "Period Calm Natural Relief Powder is running low (5 units left)",
          type: "warning",
          time: "2 minutes ago",
          read: false,
        },
        {
          id: "2",
          title: "New Order",
          message: "Order #ORD-2024-156 received from Sarah Johnson",
          type: "info",
          time: "5 minutes ago",
          read: false,
        },
        {
          id: "3",
          title: "Support Ticket",
          message: "High priority ticket #TKT-789 needs attention",
          type: "error",
          time: "10 minutes ago",
          read: false,
        },
        {
          id: "4",
          title: "Subscription Cancelled",
          message: "Customer cancelled monthly subscription",
          type: "warning",
          time: "1 hour ago",
          read: true,
        },
        {
          id: "5",
          title: "Payment Successful",
          message: "Bulk payment of ₹25,000 processed successfully",
          type: "success",
          time: "2 hours ago",
          read: true,
        },
      ],

      products: [
        {
          id: "main-product",
          name: "Period Calm",
          subtitle: "Natural Relief Powder",
          description:
            "Transform your period experience with our scientifically formulated powder drink. Get relief from cramps, mood swings, and fatigue in just 15-20 minutes.",
          price: 1299,
          originalPrice: 1599,
          stock: 150,
          category: "Supplements",
          status: "active",
          images: [
            { src: "/images/packaging.png", alt: "Product Front View", label: "Front" },
            { src: "/images/packaging.png", alt: "Product Back View", label: "Back" },
            { src: "/images/packaging.png", alt: "Lifestyle Shot", label: "Lifestyle" },
            { src: "/images/packaging.png", alt: "Usage Instructions", label: "Instructions" },
          ],
          sku: "PC-MAIN-001",
          rating: 4.9,
          reviewCount: 2847,
          customerCount: 50000,
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
        },
      ],

      orders: [
        {
          id: "ORD-2024-156",
          customerId: "cust-001",
          customerName: "Sarah Johnson",
          customerEmail: "sarah@example.com",
          status: "processing",
          total: 1299,
          items: [
            {
              productId: "main-product",
              productName: "Period Calm Natural Relief Powder",
              quantity: 1,
              price: 1299,
            },
          ],
          shippingAddress: "123 Main St, Mumbai, MH 400001",
          paymentMethod: "Credit Card",
          createdAt: "2024-01-20T10:30:00Z",
          updatedAt: "2024-01-20T10:30:00Z",
        },
        {
          id: "ORD-2024-155",
          customerId: "cust-002",
          customerName: "Priya Sharma",
          customerEmail: "priya@example.com",
          status: "shipped",
          total: 2598,
          items: [
            {
              productId: "main-product",
              productName: "Period Calm Natural Relief Powder",
              quantity: 2,
              price: 2598,
            },
          ],
          shippingAddress: "456 Park Ave, Delhi, DL 110001",
          paymentMethod: "UPI",
          createdAt: "2024-01-19T14:20:00Z",
          updatedAt: "2024-01-20T09:15:00Z",
          trackingNumber: "TRK123456789",
        },
      ],

      subscriptions: [
        {
          id: "SUB-001",
          customerId: "cust-001",
          customerName: "Sarah Johnson",
          customerEmail: "sarah@example.com",
          plan: "Monthly Subscription",
          status: "active",
          nextBilling: "2024-02-20T00:00:00Z",
          amount: 974,
          frequency: "monthly",
          createdAt: "2024-01-20T00:00:00Z",
        },
        {
          id: "SUB-002",
          customerId: "cust-003",
          customerName: "Anita Nair",
          customerEmail: "anita@example.com",
          plan: "Monthly Subscription",
          status: "paused",
          nextBilling: "2024-03-15T00:00:00Z",
          amount: 974,
          frequency: "monthly",
          createdAt: "2024-01-15T00:00:00Z",
        },
      ],

      supportTickets: [
        {
          id: "TKT-789",
          customerId: "cust-004",
          customerName: "Meera Patel",
          customerEmail: "meera@example.com",
          subject: "Product not working as expected",
          status: "open",
          priority: "high",
          category: "Product Issue",
          createdAt: "2024-01-20T08:00:00Z",
          updatedAt: "2024-01-20T08:00:00Z",
          messages: [
            {
              id: "msg-1",
              sender: "customer",
              message: "I've been using Period Calm for 2 weeks but haven't seen any improvement in my symptoms.",
              timestamp: "2024-01-20T08:00:00Z",
            },
          ],
        },
        {
          id: "TKT-788",
          customerId: "cust-005",
          customerName: "Kavya Singh",
          customerEmail: "kavya@example.com",
          subject: "Delivery delay inquiry",
          status: "resolved",
          priority: "medium",
          category: "Shipping",
          assignedTo: "Admin",
          createdAt: "2024-01-19T12:00:00Z",
          updatedAt: "2024-01-20T10:00:00Z",
          messages: [
            {
              id: "msg-2",
              sender: "customer",
              message: "My order was supposed to arrive yesterday but I haven't received it yet.",
              timestamp: "2024-01-19T12:00:00Z",
            },
            {
              id: "msg-3",
              sender: "admin",
              message:
                "I apologize for the delay. Your order has been expedited and will arrive today. Here's your tracking number: TRK987654321",
              timestamp: "2024-01-20T10:00:00Z",
            },
          ],
        },
      ],

      loading: false,
      error: null,

      // Actions
      setActiveSection: (section) => set({ activeSection: section }),

      addNotification: (notification) =>
        set((state) => ({
          notifications: [{ ...notification, id: Date.now().toString() }, ...state.notifications],
        })),

      markNotificationRead: (id) =>
        set((state) => ({
          notifications: state.notifications.map((n) => (n.id === id ? { ...n, read: true } : n)),
        })),

      // Product actions
      addProduct: (product) =>
        set((state) => ({
          products: [
            ...state.products,
            {
              ...product,
              id: Date.now().toString(),
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            },
          ],
        })),

      updateProduct: (id, updates) =>
        set((state) => ({
          products: state.products.map((p) =>
            p.id === id ? { ...p, ...updates, updatedAt: new Date().toISOString() } : p,
          ),
        })),

      deleteProduct: (id) =>
        set((state) => ({
          products: state.products.filter((p) => p.id !== id),
        })),

      getMainProduct: () => {
        const state = get()
        return state.products.find((p) => p.id === "main-product")
      },

      fetchProducts: async () => {
        set({ loading: true, error: null })
        const supabase = getSupabaseBrowserClient()
        const { data, error } = await supabase.from("products").select("*")
        if (error) set({ error: error.message })
        set({ products: (data as unknown as Product[]) || [], loading: false })
      },

      addProductSupabase: async (product) => {
        set({ loading: true, error: null })
        const supabase = getSupabaseBrowserClient()
        const { error } = await supabase.from("products").insert([product])
        if (error) set({ error: error.message })
        await get().fetchProducts()
        set({ loading: false })
      },

      updateProductSupabase: async (id, updates) => {
        set({ loading: true, error: null })
        const supabase = getSupabaseBrowserClient()
        const { error } = await supabase.from("products").update(updates).eq("id", id)
        if (error) set({ error: error.message })
        await get().fetchProducts()
        set({ loading: false })
      },

      deleteProductSupabase: async (id) => {
        set({ loading: true, error: null })
        const supabase = getSupabaseBrowserClient()
        const { error } = await supabase.from("products").delete().eq("id", id)
        if (error) set({ error: error.message })
        await get().fetchProducts()
        set({ loading: false })
      },

      // Order actions
      updateOrderStatus: (id, status) =>
        set((state) => ({
          orders: state.orders.map((o) => (o.id === id ? { ...o, status, updatedAt: new Date().toISOString() } : o)),
        })),

      addTrackingNumber: (id, trackingNumber) =>
        set((state) => ({
          orders: state.orders.map((o) =>
            o.id === id ? { ...o, trackingNumber, updatedAt: new Date().toISOString() } : o,
          ),
        })),

      // Subscription actions
      updateSubscriptionStatus: (id, status) =>
        set((state) => ({
          subscriptions: state.subscriptions.map((s) => (s.id === id ? { ...s, status } : s)),
        })),

      // Support actions
      updateTicketStatus: (id, status) =>
        set((state) => ({
          supportTickets: state.supportTickets.map((t) =>
            t.id === id ? { ...t, status, updatedAt: new Date().toISOString() } : t,
          ),
        })),

      assignTicket: (id, assignedTo) =>
        set((state) => ({
          supportTickets: state.supportTickets.map((t) =>
            t.id === id ? { ...t, assignedTo, updatedAt: new Date().toISOString() } : t,
          ),
        })),

      addTicketMessage: (ticketId, message) =>
        set((state) => ({
          supportTickets: state.supportTickets.map((t) =>
            t.id === ticketId
              ? {
                  ...t,
                  messages: [...t.messages, { ...message, id: Date.now().toString() }],
                  updatedAt: new Date().toISOString(),
                }
              : t,
          ),
        })),
    }),
    {
      name: "admin-storage",
    },
  ),
)
