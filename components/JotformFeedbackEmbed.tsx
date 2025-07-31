"use client"

import { useEffect, useRef } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { X } from 'lucide-react'

interface JotformFeedbackEmbedProps {
  onClose: () => void
}

export default function JotformFeedbackEmbed({ onClose }: JotformFeedbackEmbedProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null)

  useEffect(() => {
    // Load Jotform embed handler script
    const script = document.createElement('script')
    script.src = 'https://cdn.jotfor.ms/s/umd/latest/for-form-embed-handler.js'
    script.async = true
    script.onload = () => {
      // Initialize Jotform embed handler
      if (window.jotformEmbedHandler && iframeRef.current) {
        window.jotformEmbedHandler(iframeRef.current, "https://www.jotform.com")
      }
    }
    document.head.appendChild(script)

    return () => {
      // Cleanup script when component unmounts
      const existingScript = document.querySelector('script[src*="jotform"]')
      if (existingScript) {
        existingScript.remove()
      }
    }
  }, [])

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <Card className="w-full max-w-4xl h-[90vh] bg-white shadow-2xl">
        <CardContent className="p-0 h-full flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gradient-to-r from-rose-50 to-pink-50">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-r from-rose-400 to-pink-400 rounded-full flex items-center justify-center text-white text-sm font-bold animate-pulse">
                PC
              </div>
              <div>
                <h2 className="text-lg font-bold text-gray-900">Period Calm Feedback</h2>
                <p className="text-sm text-gray-600">Share your experience with us!</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Jotform Embed */}
          <div className="flex-1 relative">
            <iframe
              ref={iframeRef}
              id="JotFormIFrame-01984321c705761ca90c8c14e5689d74faa0"
              title="Calma: Feedback Analyst"
              onLoad={() => window.parent.scrollTo(0, 0)}
              allowTransparency={true}
              allow="geolocation; microphone; camera; fullscreen"
              src="https://agent.jotform.com/01984321c705761ca90c8c14e5689d74faa0?embedMode=iframe&background=1&shadow=1"
              frameBorder="0"
              className="w-full h-full border-none"
              style={{
                minWidth: '100%',
                maxWidth: '100%',
                height: '100%',
                border: 'none',
                width: '100%'
              }}
              scrolling="no"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

// Add TypeScript declaration for Jotform
declare global {
  interface Window {
    jotformEmbedHandler: (iframe: HTMLIFrameElement, domain: string) => void
  }
} 