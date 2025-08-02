import dynamic from "next/dynamic"
import HeroSection from "@/components/HeroSection"
import BenefitsSection from "@/components/BenefitsSection"
// import ProductShowcase from "@/components/ProductShowcase"
import TestimonialsSection from "@/components/TestimonialsSection"
import EducationalSection from "@/components/EducationalSection"
import CycleTracker from "@/components/CycleTracker"
import TrustSection from "@/components/TrustSection"
import LegalDisclaimer from "@/components/LegalDisclaimer"

const ProductShowcase = dynamic(() => import("@/components/ProductShowcase"), { ssr: false })

export default function HomePage() {
  return (
    <div className="overflow-hidden">
      <HeroSection />
      <BenefitsSection />
      <ProductShowcase />
      <TestimonialsSection />
      <EducationalSection />
      <CycleTracker />
      <TrustSection />
      <LegalDisclaimer />
    </div>
  )
}
