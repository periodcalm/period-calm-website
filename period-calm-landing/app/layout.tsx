import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Period Calm - Natural Period Pain Relief',
  description: 'Transform your period experience with our scientifically formulated powder drink. Get relief from cramps, mood swings, and fatigue in just 15-20 minutes.',
  keywords: 'period pain relief, menstrual cramps, natural remedies, women health, period calm',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-gradient-to-br from-rose-50 via-orange-50 to-pink-50 min-h-screen`}>
        {children}
      </body>
    </html>
  )
} 