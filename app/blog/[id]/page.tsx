"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Calendar,
  Clock,
  Heart,
  Share2,
  Bookmark,
  ArrowLeft,
  Facebook,
  Twitter,
  Linkedin,
  Copy,
  Eye,
} from "lucide-react"
import Image from "next/image"
import Link from "next/link"

export default function BlogPostPage({ params }: { params: { id: string } }) {
  const [liked, setLiked] = useState(false)
  const [bookmarked, setBookmarked] = useState(false)
  const [showShareMenu, setShowShareMenu] = useState(false)

  // Mock blog post data - in real app, fetch based on params.id
  const post = {
    id: params.id,
    title: "Understanding Your Menstrual Cycle: A Complete Guide",
    content: `
      <p>Your menstrual cycle is a complex, beautiful process that affects your entire body and mind. Understanding how it works can help you optimize your health, predict your periods, and work with your body's natural rhythms rather than against them.</p>
      
      <h2>The Four Phases of Your Menstrual Cycle</h2>
      
      <h3>1. Menstrual Phase (Days 1-5)</h3>
      <p>This is when your period occurs. The lining of your uterus (endometrium) sheds, resulting in menstrual flow. Hormone levels are at their lowest during this time.</p>
      
      <h3>2. Follicular Phase (Days 1-13)</h3>
      <p>Starting on the first day of your period, this phase overlaps with menstruation. Your pituitary gland releases follicle-stimulating hormone (FSH), which stimulates your ovaries to produce mature eggs.</p>
      
      <h3>3. Ovulation Phase (Around Day 14)</h3>
      <p>A mature egg is released from the ovary. This is your most fertile time, and you might notice changes in cervical mucus and a slight increase in body temperature.</p>
      
      <h3>4. Luteal Phase (Days 15-28)</h3>
      <p>After ovulation, the empty egg follicle releases progesterone, which thickens the uterine lining in preparation for a potential pregnancy. If pregnancy doesn't occur, hormone levels drop and the cycle begins again.</p>
      
      <h2>Working With Your Cycle</h2>
      <p>Understanding your cycle phases can help you:</p>
      <ul>
        <li>Plan important events around your energy levels</li>
        <li>Optimize your workout routine</li>
        <li>Manage PMS symptoms more effectively</li>
        <li>Track fertility if you're trying to conceive</li>
      </ul>
      
      <h2>When to Seek Help</h2>
      <p>While some variation in cycles is normal, you should consult a healthcare provider if you experience:</p>
      <ul>
        <li>Periods that last longer than 7 days</li>
        <li>Cycles shorter than 21 days or longer than 35 days</li>
        <li>Severe pain that interferes with daily activities</li>
        <li>Heavy bleeding that requires changing protection every hour</li>
      </ul>
    `,
    author: {
      name: "Dr. Priya Sharma",
      avatar: "/placeholder.svg?height=60&width=60",
      bio: "Gynecologist with 15+ years experience in women's health",
      expertise: ["Gynecology", "Reproductive Health", "Hormonal Balance"],
    },
    category: "menstrual-health",
    tags: ["menstrual cycle", "hormones", "health education"],
    publishedAt: "2024-01-15",
    readTime: 8,
    image: "/placeholder.svg?height=400&width=800",
    views: 2847,
    likes: 234,
    comments: 45,
    rating: 4.8,
  }

  const relatedPosts = [
    {
      id: "2",
      title: "Natural Remedies for Period Pain: What Really Works",
      image: "/placeholder.svg?height=200&width=300",
      readTime: 6,
    },
    {
      id: "3",
      title: "Nutrition During Your Period: Foods That Help and Hurt",
      image: "/placeholder.svg?height=200&width=300",
      readTime: 10,
    },
    {
      id: "4",
      title: "Exercise and Your Menstrual Cycle: When to Push and When to Rest",
      image: "/placeholder.svg?height=200&width=300",
      readTime: 7,
    },
  ]

  const copyToClipboard = () => {
    navigator.clipboard.writeText(window.location.href)
    // Show toast notification
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-rose-50 pt-20">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Back Button */}
          <Link href="/blog">
            <Button variant="ghost" className="mb-6 hover:bg-purple-100">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Blog
            </Button>
          </Link>

          {/* Article Header */}
          <div className="mb-8">
            <Badge className="mb-4 bg-purple-100 text-purple-700">{post.category.replace("-", " ")}</Badge>

            <h1 className="text-4xl font-bold mb-6 leading-tight">{post.title}</h1>

            <div className="flex flex-wrap items-center gap-6 text-gray-600 mb-6">
              <div className="flex items-center gap-2">
                <Image
                  src={post.author.avatar || "/placeholder.svg"}
                  alt={post.author.name}
                  width={40}
                  height={40}
                  className="rounded-full"
                />
                <div>
                  <div className="font-medium text-gray-900">{post.author.name}</div>
                  <div className="text-sm">{post.author.expertise[0]}</div>
                </div>
              </div>

              <div className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                <span>{new Date(post.publishedAt).toLocaleDateString()}</span>
              </div>

              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                <span>{post.readTime} min read</span>
              </div>

              <div className="flex items-center gap-1">
                <Eye className="w-4 h-4" />
                <span>{post.views.toLocaleString()} views</span>
              </div>
            </div>

            {/* Article Actions */}
            <div className="flex items-center gap-4 mb-8">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setLiked(!liked)}
                className={liked ? "text-red-500 border-red-200" : ""}
              >
                <Heart className={`w-4 h-4 mr-2 ${liked ? "fill-current" : ""}`} />
                {post.likes + (liked ? 1 : 0)}
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={() => setBookmarked(!bookmarked)}
                className={bookmarked ? "text-purple-500 border-purple-200" : ""}
              >
                <Bookmark className={`w-4 h-4 mr-2 ${bookmarked ? "fill-current" : ""}`} />
                Save
              </Button>

              <div className="relative">
                <Button variant="outline" size="sm" onClick={() => setShowShareMenu(!showShareMenu)}>
                  <Share2 className="w-4 h-4 mr-2" />
                  Share
                </Button>

                {showShareMenu && (
                  <div className="absolute top-full left-0 mt-2 bg-white rounded-lg shadow-lg border p-2 z-10">
                    <div className="flex gap-2">
                      <Button variant="ghost" size="sm">
                        <Facebook className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Twitter className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Linkedin className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={copyToClipboard}>
                        <Copy className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Featured Image */}
          <div className="mb-8">
            <Image
              src={post.image || "/placeholder.svg"}
              alt={post.title}
              width={800}
              height={400}
              className="w-full rounded-lg shadow-lg"
            />
          </div>

          {/* Article Content */}
          <div className="grid lg:grid-cols-4 gap-8">
            <div className="lg:col-span-3">
              <Card>
                <CardContent className="p-8">
                  <div className="prose prose-lg max-w-none" dangerouslySetInnerHTML={{ __html: post.content }} />

                  {/* Tags */}
                  <div className="mt-8 pt-8 border-t">
                    <h4 className="font-semibold mb-4">Tags</h4>
                    <div className="flex flex-wrap gap-2">
                      {post.tags.map((tag, index) => (
                        <Badge key={index} variant="outline">
                          #{tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Author Bio */}
              <Card className="mt-8">
                <CardContent className="p-6">
                  <div className="flex gap-4">
                    <Image
                      src={post.author.avatar || "/placeholder.svg"}
                      alt={post.author.name}
                      width={80}
                      height={80}
                      className="rounded-full"
                    />
                    <div className="flex-1">
                      <h4 className="font-bold text-lg mb-2">{post.author.name}</h4>
                      <p className="text-gray-600 mb-3">{post.author.bio}</p>
                      <div className="flex flex-wrap gap-2">
                        {post.author.expertise.map((skill, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Related Articles */}
              <Card>
                <CardContent className="p-6">
                  <h4 className="font-bold mb-4">Related Articles</h4>
                  <div className="space-y-4">
                    {relatedPosts.map((relatedPost) => (
                      <Link key={relatedPost.id} href={`/blog/${relatedPost.id}`}>
                        <div className="flex gap-3 hover:bg-gray-50 p-2 rounded-lg transition-colors">
                          <Image
                            src={relatedPost.image || "/placeholder.svg"}
                            alt={relatedPost.title}
                            width={60}
                            height={60}
                            className="rounded object-cover flex-shrink-0"
                          />
                          <div className="flex-1">
                            <h5 className="font-medium text-sm mb-1 line-clamp-2">{relatedPost.title}</h5>
                            <div className="text-xs text-gray-500">{relatedPost.readTime} min read</div>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Newsletter Signup */}
              <Card className="bg-gradient-to-br from-purple-500 to-pink-500 text-white">
                <CardContent className="p-6 text-center">
                  <h4 className="font-bold mb-2">Stay Updated</h4>
                  <p className="text-sm mb-4 opacity-90">Get the latest articles delivered to your inbox</p>
                  <Button className="w-full bg-white text-purple-600 hover:bg-gray-100">Subscribe Now</Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
