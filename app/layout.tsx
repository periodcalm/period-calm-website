import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import Header from "@/components/Header"
import Footer from "@/components/Footer"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Period Calm - Say Goodbye to Period Pain",
  description:
    "Natural period pain relief in just 15-20 minutes. Join our trial phase and experience the Period Calm difference with 500+ trial participants and 94% success rate.",
  keywords: "period pain relief, menstrual cramps, natural remedies, women health, trial phase",
  openGraph: {
    title: "Period Calm - Say Goodbye to Period Pain",
    description: "Natural period pain relief in just 15-20 minutes",
    images: ["/og-image.jpg"],
  },
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-gradient-to-br from-rose-50 via-orange-50 to-pink-50 min-h-screen`}>
        <Header />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  )
}
