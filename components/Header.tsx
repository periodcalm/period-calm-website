"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Heart, Menu, X, ShoppingCartIcon as CartIcon, User, Shield, MessageSquare, Send } from "lucide-react"
import Link from "next/link"
import { useHasMounted } from "@/hooks/use-has-mounted"
import { useCartStore } from "@/lib/cart-store"
// Removed auth-store import - no longer using authentication
import { ShoppingCart } from "@/components/shopping-cart"
import { ComingSoonModal } from "@/components/ComingSoonModal"

import AIChatFeedbackForm from "./AIChatFeedbackForm"

function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false)
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768)
    check()
    window.addEventListener("resize", check)
    return () => window.removeEventListener("resize", check)
  }, [])
  return isMobile
}

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isComingSoonOpen, setIsComingSoonOpen] = useState(false)
  const [isFeedbackOpen, setIsFeedbackOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { getTotalItems, toggleCart } = useCartStore()
  // Removed auth-store usage - no longer using authentication

  const hasMounted = useHasMounted()
  const [showEmpowerPopover, setShowEmpowerPopover] = useState(true)
  const isMobile = useIsMobile()

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  useEffect(() => {
    // Auto-hide the popover after 6 seconds
    if (showEmpowerPopover) {
      const timer = setTimeout(() => setShowEmpowerPopover(false), 6000)
      return () => clearTimeout(timer)
    }
  }, [showEmpowerPopover])

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId)
    if (element) {
      element.scrollIntoView({ behavior: "smooth" })
    }
    setIsMobileMenuOpen(false)
  }

  // Removed handleFeedbackSubmit as it's now handled by ProfessionalFeedbackForm

  const navLinks = [
    { href: "/", label: "Home", action: () => (window.location.href = "/") },
    { href: "#benefits", label: "Benefits", action: () => scrollToSection("benefits") },
    { href: "#product", label: "Product", action: () => scrollToSection("product") },
    { href: "#testimonials", label: "Reviews", action: () => scrollToSection("testimonials") },
    { href: "/blog", label: "Blog", action: () => (window.location.href = "/blog") },
    { href: "/sherises", label: "SheRises", action: () => setIsComingSoonOpen(true) },
  ]

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          isScrolled
            ? "bg-white/95 backdrop-blur-md shadow-lg border-b border-rose-100 transform translate-y-0"
            : "bg-transparent"
        }`}
      >
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16 md:h-20">
            {/* Logo */}
            <Link href="/" className="flex items-center space-x-3 group">
              <div className="relative">
                <Heart className="w-8 h-8 text-rose-500 group-hover:scale-110 transition-transform duration-300 group-hover:rotate-12" />
                <div className="absolute inset-0 bg-rose-500 rounded-full opacity-20 group-hover:opacity-30 transition-opacity duration-300 blur-sm animate-pulse"></div>
              </div>
              <span className="text-xl md:text-2xl font-bold bg-gradient-to-r from-rose-600 to-orange-600 bg-clip-text text-transparent group-hover:from-rose-500 group-hover:to-orange-500 transition-all duration-300">
                Period Calm
              </span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center space-x-6">
              {navLinks.map((link, index) => (
                <button
                  key={index}
                  onClick={link.action}
                  className={`text-gray-700 hover:text-rose-600 transition-all duration-300 font-medium relative group py-2 px-2 ${
                    link.label === "SheRises"
                      ? "bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent font-semibold"
                      : ""
                  }`}
                >
                  {link.label}
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-rose-500 to-orange-500 group-hover:w-full transition-all duration-300"></span>
                  <span className="absolute inset-0 bg-rose-50 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10"></span>
                </button>
              ))}
            </nav>

            {/* Right Side Actions */}
            <div className="flex items-center space-x-4">
              {/* Empower Us Button with Popover */}
              <div className="relative">
                {/* Empower Us Button: only show on desktop */}
                {!isMobile && (
                  <Button
                    size="sm"
                    className={
                      "hidden md:flex bg-gradient-to-r from-purple-500 via-pink-500 to-rose-500 hover:from-purple-600 hover:via-pink-600 hover:to-rose-600 text-white transition-all duration-300 hover:scale-105 hover:shadow-lg focus:ring-4 focus:ring-pink-300 outline-none" +
                      (showEmpowerPopover ? " animate-pulse ring-4 ring-pink-300" : "")
                    }
                    onClick={() => setIsFeedbackOpen(true)}
                  >
                    <MessageSquare className="w-4 h-4 mr-2" />
                    Empower Us
                  </Button>
                )}
                {/* Responsive Popover (unchanged) */}
                {showEmpowerPopover && !isMobile && (
                  <div className="absolute left-1/2 top-full mt-3 -translate-x-1/2 z-50 w-72 max-w-xs flex flex-col items-center animate-fade-in">
                    {/* Arrow */}
                    <div className="w-4 h-4 rotate-45 -mt-2 bg-gradient-to-r from-purple-200 via-pink-100 to-rose-100 border border-pink-200 shadow-sm"></div>
                    <div className="w-full rounded-2xl bg-gradient-to-br from-purple-100 via-pink-50 to-rose-100 border border-pink-200 shadow-2xl px-5 py-4 flex flex-col items-center gap-2">
                      <span className="text-2xl">✨</span>
                      <span className="font-bold text-pink-700 text-base">Empower Us</span>
                      <span className="text-pink-700 text-sm text-center leading-snug">
                        Your feedback shapes the future of <span className="font-semibold text-rose-600">Period Calm</span>!<br />Click here to share your thoughts.
                      </span>
                      <button
                        className="mt-2 text-pink-400 hover:text-pink-600 text-xs font-bold rounded-full px-2 py-1 transition-colors"
                        onClick={() => setShowEmpowerPopover(false)}
                        aria-label="Close"
                      >
                        Close
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Mobile Menu Button */}
              <Button
                variant="ghost"
                size="sm"
                className="lg:hidden transition-all duration-300 hover:scale-110"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </Button>
            </div>
          </div>

          {/* Mobile Menu */}
          <div
            className={`lg:hidden absolute top-full left-0 right-0 bg-white/95 backdrop-blur-md border-b border-rose-100 shadow-lg transition-all duration-300 ${
              isMobileMenuOpen ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4 pointer-events-none"
            }`}
          >
            <nav className="flex flex-col space-y-4 p-6">
              {navLinks.map((link, index) => (
                <button
                  key={index}
                  onClick={link.action}
                  className={`text-gray-700 hover:text-rose-600 transition-all duration-300 font-medium py-2 text-left hover:bg-rose-50 rounded-lg px-3 ${
                    link.label === "SheRises"
                      ? "bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent font-semibold"
                      : ""
                  }`}
                >
                  {link.label}
                </button>
              ))}

              <div className="pt-4 border-t border-gray-200 space-y-3">
                <Button
                  className="w-full bg-gradient-to-r from-purple-500 via-pink-500 to-rose-500 hover:from-purple-600 hover:via-pink-600 hover:to-rose-600 text-white transition-all duration-300"
                  onClick={() => {
                    setIsFeedbackOpen(true)
                    setIsMobileMenuOpen(false)
                  }}
                >
                  <MessageSquare className="w-4 h-4 mr-2" />
                  Empower Us
                </Button>
              </div>
            </nav>
          </div>
        </div>
      </header>

      {/* Floating Action Button for Empower Us on mobile */}
      {isMobile && (
        <button
          className="fixed bottom-5 right-5 z-50 flex items-center gap-2 px-5 py-3 rounded-full shadow-lg bg-gradient-to-r from-purple-500 via-pink-500 to-rose-500 text-white font-bold text-base animate-fade-in focus:outline-none focus:ring-4 focus:ring-pink-300"
          style={{ boxShadow: '0 4px 24px 0 rgba(236, 72, 153, 0.25)' }}
          onClick={() => setIsFeedbackOpen(true)}
        >
          <MessageSquare className="w-5 h-5" />
          Empower Us
        </button>
      )}

                  {/* Empower Us Modal - always render when isFeedbackOpen is true */}
            {isFeedbackOpen && (
              <AIChatFeedbackForm onCloseAction={() => setIsFeedbackOpen(false)} />
            )}
      
      {/* Coming Soon Modal */}
      <ComingSoonModal 
        isOpen={isComingSoonOpen} 
        onClose={() => setIsComingSoonOpen(false)} 
      />
    </>
  )
}

export default Header
