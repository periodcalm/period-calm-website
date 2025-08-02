"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Heart, Mail, Phone, MapPin, Facebook, Instagram, Twitter, Youtube } from "lucide-react"
import Link from "next/link"

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-16">
        <div className="grid lg:grid-cols-4 md:grid-cols-2 gap-8">
          {/* Brand Section */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center space-x-3">
              <Heart className="w-8 h-8 text-rose-500" />
              <span className="text-2xl font-bold">Period Calm</span>
            </Link>
            <p className="text-gray-400 leading-relaxed">
              Empowering women with natural, effective period pain relief. Join thousands who have transformed their
              monthly experience.
            </p>
            <div className="flex space-x-4">
              <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
                <Facebook className="w-5 h-5" />
              </Button>
              <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
                <Instagram className="w-5 h-5" />
              </Button>
              <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
                <Twitter className="w-5 h-5" />
              </Button>
              <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
                <Youtube className="w-5 h-5" />
              </Button>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="#product" className="text-gray-400 hover:text-white transition-colors">
                  Shop Now
                </Link>
              </li>
              <li>
                <Link href="#benefits" className="text-gray-400 hover:text-white transition-colors">
                  Benefits
                </Link>
              </li>
              <li>
                <Link href="#testimonials" className="text-gray-400 hover:text-white transition-colors">
                  Reviews
                </Link>
              </li>
              <li>
                <Link href="/blog" className="text-gray-400 hover:text-white transition-colors">
                  Blog
                </Link>
              </li>
              <li>
                <Link href="/tracker" className="text-gray-400 hover:text-white transition-colors">
                  Cycle Tracker
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Support</h3>
            <ul className="space-y-2">
              <li>
                <span className="text-gray-400">
                  FAQ (Coming Soon)
                </span>
              </li>
              <li>
                <span className="text-gray-400">
                  Contact Us (Coming Soon)
                </span>
              </li>
              <li>
                <span className="text-gray-400">
                  Shipping Info (Coming Soon)
                </span>
              </li>
              <li>
                <span className="text-gray-400">
                  Returns (Coming Soon)
                </span>
              </li>
              <li>
                <span className="text-gray-400">
                  Privacy Policy (Coming Soon)
                </span>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Stay Updated</h3>
            <p className="text-gray-400 mb-4">Get period tips, wellness advice, and exclusive offers.</p>
            <div className="space-y-3">
              <Input
                type="email"
                placeholder="Enter your email"
                className="bg-gray-800 border-gray-700 text-white placeholder-gray-400"
              />
              <Button className="w-full bg-gradient-to-r from-rose-500 to-orange-500 hover:from-rose-600 hover:to-orange-600">
                Subscribe
              </Button>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center">
          <div className="text-gray-400 text-sm">© 2024 Period Calm. All rights reserved.</div>
          <div className="flex space-x-6 text-sm text-gray-400 mt-4 md:mt-0">
            <span className="text-gray-400">
              Terms of Service (Coming Soon)
            </span>
            <span className="text-gray-400">
              Privacy Policy (Coming Soon)
            </span>
            <span className="text-gray-400">
              Cookie Policy (Coming Soon)
            </span>
          </div>
        </div>
        
        {/* Legal Disclaimer */}
        <div className="border-t border-gray-800 pt-4 mt-4">
          <p className="text-xs text-gray-500 text-center leading-relaxed">
            <strong>Medical Disclaimer:</strong> Period Calm is a dietary supplement and is not intended to diagnose, treat, cure, or prevent any disease. 
            These statements have not been evaluated by the FDA. Always consult with a healthcare professional before use. 
            Individual results may vary. Not suitable for pregnant or nursing women without medical consultation.
          </p>
        </div>
      </div>
    </footer>
  )
}
