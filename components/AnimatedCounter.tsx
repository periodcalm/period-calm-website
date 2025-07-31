"use client"

import { useState, useEffect, useRef, ReactNode } from "react"

interface AnimatedCounterProps {
  value: number
  duration?: number
  className?: string
  suffix?: ReactNode
  prefix?: ReactNode
}

export function AnimatedCounter({ 
  value, 
  duration = 2000, 
  className = "",
  suffix = null,
  prefix = null
}: AnimatedCounterProps) {
  const [displayValue, setDisplayValue] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)
  const prevValueRef = useRef(value)

  useEffect(() => {
    // Ensure value is a number
    const numericValue = typeof value === 'string' ? parseFloat(value) : value
    
    if (numericValue !== prevValueRef.current) {
      setIsAnimating(true)
      const startValue = prevValueRef.current
      const endValue = numericValue
      const startTime = Date.now()

      const animate = () => {
        const currentTime = Date.now()
        const elapsed = currentTime - startTime
        const progress = Math.min(elapsed / duration, 1)

        // Easing function for smooth animation
        const easeOutQuart = 1 - Math.pow(1 - progress, 4)
        const currentValue = startValue + (endValue - startValue) * easeOutQuart

        // For ratings, keep decimal places; for counts, use integers
        const displayValue = endValue % 1 === 0 ? Math.floor(currentValue) : Math.round(currentValue * 10) / 10
        setDisplayValue(displayValue)

        if (progress < 1) {
          requestAnimationFrame(animate)
        } else {
          setDisplayValue(endValue)
          setIsAnimating(false)
        }
      }

      requestAnimationFrame(animate)
      prevValueRef.current = numericValue
    }
  }, [value, duration])

  // Format the number with commas
  const formatNumber = (num: number) => {
    return num.toLocaleString()
  }

  return (
    <span className={`${className} ${isAnimating ? 'animate-pulse' : ''}`}>
      {prefix}{formatNumber(displayValue)}{suffix}
    </span>
  )
} 