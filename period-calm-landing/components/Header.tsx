"use client"

import { useState } from 'react'
import { Menu, X, Heart } from 'lucide-react'

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <header className="bg-white/80 backdrop-blur-md border-b border-rose-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <Heart className="h-8 w-8 text-rose-500" />
            <span className="text-2xl font-bold text-gray-900">Period Calm</span>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            <a href="#benefits" className="text-gray-700 hover:text-rose-600 transition-colors">
              Benefits
            </a>
            <a href="#product" className="text-gray-700 hover:text-rose-600 transition-colors">
              Product
            </a>
            <a href="#testimonials" className="text-gray-700 hover:text-rose-600 transition-colors">
              Reviews
            </a>
            <a href="#contact" className="text-gray-700 hover:text-rose-600 transition-colors">
              Contact
            </a>
          </nav>

          {/* CTA Button */}
          <div className="hidden md:block">
            <a
              href="#contact"
              className="bg-rose-500 text-white px-6 py-2 rounded-full hover:bg-rose-600 transition-colors"
            >
              Get Started
            </a>
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? (
              <X className="h-6 w-6 text-gray-700" />
            ) : (
              <Menu className="h-6 w-6 text-gray-700" />
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-rose-100">
            <nav className="flex flex-col space-y-4">
              <a href="#benefits" className="text-gray-700 hover:text-rose-600 transition-colors">
                Benefits
              </a>
              <a href="#product" className="text-gray-700 hover:text-rose-600 transition-colors">
                Product
              </a>
              <a href="#testimonials" className="text-gray-700 hover:text-rose-600 transition-colors">
                Reviews
              </a>
              <a href="#contact" className="text-gray-700 hover:text-rose-600 transition-colors">
                Contact
              </a>
              <a
                href="#contact"
                className="bg-rose-500 text-white px-6 py-2 rounded-full hover:bg-rose-600 transition-colors text-center"
              >
                Get Started
              </a>
            </nav>
          </div>
        )}
      </div>
    </header>
  )
} 