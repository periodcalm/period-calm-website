import BlogSection from "@/components/BlogSection"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Period Health Blog - Expert Articles & Wellness Tips | Period Calm",
  description:
    "Discover expert-written articles on menstrual health, nutrition, wellness, and natural period pain relief. Get insights from gynecologists and wellness experts.",
  keywords: "period health blog, menstrual health articles, period pain relief, women's wellness, nutrition tips",
}

export default function BlogPage() {
  return (
    <div className="min-h-screen">
      <BlogSection />
    </div>
  )
}
