"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import {
  Search,
  Calendar,
  Clock,
  ArrowRight,
  BookOpen,
  Heart,
  Share2,
  Bookmark,
  TrendingUp,
  Grid,
  List,
  ChevronLeft,
  ChevronRight,
  Star,
  MessageCircle,
  Eye,
} from "lucide-react"
import Image from "next/image"
import Link from "next/link"

interface BlogPost {
  id: string
  title: string
  excerpt: string
  content: string
  author: {
    name: string
    avatar: string
    bio: string
    expertise: string[]
  }
  category: string
  tags: string[]
  publishedAt: string
  readTime: number
  featured: boolean
  image: string
  views: number
  likes: number
  comments: number
  rating: number
}

interface Author {
  id: string
  name: string
  avatar: string
  bio: string
  expertise: string[]
  posts: number
  followers: number
}

export default function BlogSection() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [selectedTag, setSelectedTag] = useState("")
  const [sortBy, setSortBy] = useState<"recent" | "popular" | "trending">("recent")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [currentPage, setCurrentPage] = useState(1)
  const [likedPosts, setLikedPosts] = useState<Set<string>>(new Set())
  const [bookmarkedPosts, setBookmarkedPosts] = useState<Set<string>>(new Set())

  const categories = [
    { id: "all", name: "All Articles", count: 24 },
    { id: "menstrual-health", name: "Menstrual Health", count: 8 },
    { id: "nutrition", name: "Nutrition & Diet", count: 6 },
    { id: "wellness", name: "Wellness & Lifestyle", count: 5 },
    { id: "product-guides", name: "Product Guides", count: 3 },
    { id: "science", name: "Research & Science", count: 2 },
  ]

  const tags = [
    "period pain",
    "cramps",
    "PMS",
    "hormones",
    "nutrition",
    "exercise",
    "mental health",
    "natural remedies",
    "cycle tracking",
    "fertility",
    "period products",
    "self-care",
    "wellness tips",
    "research",
  ]

  const authors: Author[] = [
    {
      id: "1",
      name: "Dr. Priya Sharma",
      avatar: "/placeholder.svg?height=60&width=60",
      bio: "Gynecologist with 15+ years experience in women's health",
      expertise: ["Gynecology", "Reproductive Health", "Hormonal Balance"],
      posts: 12,
      followers: 2500,
    },
    {
      id: "2",
      name: "Nutritionist Ananya",
      avatar: "/placeholder.svg?height=60&width=60",
      bio: "Certified nutritionist specializing in women's wellness",
      expertise: ["Nutrition", "Hormonal Health", "Wellness"],
      posts: 8,
      followers: 1800,
    },
    {
      id: "3",
      name: "Wellness Coach Meera",
      avatar: "/placeholder.svg?height=60&width=60",
      bio: "Holistic wellness coach and yoga instructor",
      expertise: ["Wellness", "Mindfulness", "Yoga"],
      posts: 6,
      followers: 1200,
    },
  ]

  const blogPosts: BlogPost[] = [
    {
      id: "1",
      title: "Understanding Your Menstrual Cycle: A Complete Guide",
      excerpt:
        "Learn about the four phases of your menstrual cycle and how to work with your body's natural rhythms for optimal health and wellness.",
      content: "Full article content here...",
      author: authors[0],
      category: "menstrual-health",
      tags: ["menstrual cycle", "hormones", "health education"],
      publishedAt: "2024-01-15",
      readTime: 8,
      featured: true,
      image: "/placeholder.svg?height=300&width=500",
      views: 2847,
      likes: 234,
      comments: 45,
      rating: 4.8,
    },
    {
      id: "2",
      title: "Natural Remedies for Period Pain: What Really Works",
      excerpt:
        "Discover evidence-based natural approaches to managing menstrual cramps, from dietary changes to herbal supplements.",
      content: "Full article content here...",
      author: authors[1],
      category: "wellness",
      tags: ["natural remedies", "period pain", "herbs"],
      publishedAt: "2024-01-12",
      readTime: 6,
      featured: true,
      image: "/placeholder.svg?height=300&width=500",
      views: 1923,
      likes: 189,
      comments: 32,
      rating: 4.7,
    },
    {
      id: "3",
      title: "Nutrition During Your Period: Foods That Help and Hurt",
      excerpt:
        "Learn which foods can ease period symptoms and which ones might make them worse, plus meal planning tips for each phase of your cycle.",
      content: "Full article content here...",
      author: authors[1],
      category: "nutrition",
      tags: ["nutrition", "period foods", "meal planning"],
      publishedAt: "2024-01-10",
      readTime: 10,
      featured: true,
      image: "/placeholder.svg?height=300&width=500",
      views: 3156,
      likes: 298,
      comments: 67,
      rating: 4.9,
    },
    {
      id: "4",
      title: "Exercise and Your Menstrual Cycle: When to Push and When to Rest",
      excerpt:
        "Optimize your workout routine by understanding how your energy levels and strength change throughout your menstrual cycle.",
      content: "Full article content here...",
      author: authors[2],
      category: "wellness",
      tags: ["exercise", "fitness", "cycle syncing"],
      publishedAt: "2024-01-08",
      readTime: 7,
      featured: false,
      image: "/placeholder.svg?height=300&width=500",
      views: 1654,
      likes: 156,
      comments: 28,
      rating: 4.6,
    },
    {
      id: "5",
      title: "Managing Period Mood Swings: Hormones and Mental Health",
      excerpt:
        "Understanding the connection between hormonal fluctuations and mood changes, plus practical strategies for emotional balance.",
      content: "Full article content here...",
      author: authors[0],
      category: "wellness",
      tags: ["mental health", "hormones", "mood"],
      publishedAt: "2024-01-05",
      readTime: 9,
      featured: false,
      image: "/placeholder.svg?height=300&width=500",
      views: 2234,
      likes: 201,
      comments: 43,
      rating: 4.7,
    },
    {
      id: "6",
      title: "Period Products Guide: Finding What Works for You",
      excerpt:
        "A comprehensive comparison of different menstrual products, from traditional options to innovative new solutions.",
      content: "Full article content here...",
      author: authors[1],
      category: "product-guides",
      tags: ["period products", "menstrual cups", "sustainability"],
      publishedAt: "2024-01-03",
      readTime: 5,
      featured: false,
      image: "/placeholder.svg?height=300&width=500",
      views: 1876,
      likes: 167,
      comments: 35,
      rating: 4.5,
    },
  ]

  // Filter and sort posts
  const filteredPosts = blogPosts
    .filter((post) => {
      const matchesCategory = selectedCategory === "all" || post.category === selectedCategory
      const matchesTag = selectedTag === "" || post.tags.includes(selectedTag)
      const matchesSearch =
        searchQuery === "" ||
        post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()))

      return matchesCategory && matchesTag && matchesSearch
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "popular":
          return b.views - a.views
        case "trending":
          return b.likes - a.likes
        case "recent":
        default:
          return new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
      }
    })

  const featuredPosts = filteredPosts.filter((post) => post.featured)
  const regularPosts = filteredPosts.filter((post) => !post.featured)

  const postsPerPage = 6
  const totalPages = Math.ceil(regularPosts.length / postsPerPage)
  const paginatedPosts = regularPosts.slice((currentPage - 1) * postsPerPage, currentPage * postsPerPage)

  const toggleLike = (postId: string) => {
    setLikedPosts((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(postId)) {
        newSet.delete(postId)
      } else {
        newSet.add(postId)
      }
      return newSet
    })
  }

  const toggleBookmark = (postId: string) => {
    setBookmarkedPosts((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(postId)) {
        newSet.delete(postId)
      } else {
        newSet.add(postId)
      }
      return newSet
    })
  }

  const PostCard = ({ post, featured = false }: { post: BlogPost; featured?: boolean }) => (
    <Card
      className={`overflow-hidden hover:shadow-xl transition-all duration-300 group ${featured ? "border-2 border-purple-200" : ""}`}
    >
      <div className="relative">
        <Image
          src={post.image || "/placeholder.svg"}
          alt={post.title}
          width={500}
          height={300}
          className={`w-full object-cover group-hover:scale-105 transition-transform duration-300 ${featured ? "h-64" : "h-48"}`}
        />
        {featured && (
          <Badge className="absolute top-4 left-4 bg-purple-500 text-white">
            <Star className="w-3 h-3 mr-1" />
            Featured
          </Badge>
        )}
        <div className="absolute top-4 right-4 flex gap-2">
          <Button
            variant="ghost"
            size="sm"
            className="bg-white/80 hover:bg-white"
            onClick={() => toggleBookmark(post.id)}
          >
            <Bookmark className={`w-4 h-4 ${bookmarkedPosts.has(post.id) ? "fill-current text-purple-600" : ""}`} />
          </Button>
          <Button variant="ghost" size="sm" className="bg-white/80 hover:bg-white">
            <Share2 className="w-4 h-4" />
          </Button>
        </div>
      </div>

      <CardContent className="p-6">
        <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
          <Badge variant="outline" className="capitalize">
            {post.category.replace("-", " ")}
          </Badge>
          <div className="flex items-center gap-1">
            <Calendar className="w-4 h-4" />
            <span>{new Date(post.publishedAt).toLocaleDateString()}</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock className="w-4 h-4" />
            <span>{post.readTime} min read</span>
          </div>
        </div>

        <h3
          className={`font-bold mb-3 group-hover:text-purple-600 transition-colors ${featured ? "text-xl" : "text-lg"}`}
        >
          <Link href={`/blog/${post.id}`}>{post.title}</Link>
        </h3>

        <p className="text-gray-600 mb-4 line-clamp-3">{post.excerpt}</p>

        <div className="flex items-center gap-4 mb-4">
          <div className="flex items-center gap-2">
            <Image
              src={post.author.avatar || "/placeholder.svg"}
              alt={post.author.name}
              width={32}
              height={32}
              className="rounded-full"
            />
            <div>
              <div className="font-medium text-sm">{post.author.name}</div>
              <div className="text-xs text-gray-500">{post.author.expertise[0]}</div>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mb-4">
          {post.tags.slice(0, 3).map((tag, index) => (
            <Badge key={index} variant="outline" className="text-xs">
              {tag}
            </Badge>
          ))}
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-gray-200">
          <div className="flex items-center gap-4 text-sm text-gray-600">
            <div className="flex items-center gap-1">
              <Eye className="w-4 h-4" />
              <span>{post.views.toLocaleString()}</span>
            </div>
            <button
              onClick={() => toggleLike(post.id)}
              className={`flex items-center gap-1 hover:text-red-500 transition-colors ${likedPosts.has(post.id) ? "text-red-500" : ""}`}
            >
              <Heart className={`w-4 h-4 ${likedPosts.has(post.id) ? "fill-current" : ""}`} />
              <span>{post.likes + (likedPosts.has(post.id) ? 1 : 0)}</span>
            </button>
            <div className="flex items-center gap-1">
              <MessageCircle className="w-4 h-4" />
              <span>{post.comments}</span>
            </div>
          </div>

          <Link href={`/blog/${post.id}`}>
            <Button variant="ghost" size="sm" className="text-purple-600 hover:text-purple-700 p-0">
              Read More
              <ArrowRight className="w-4 h-4 ml-1" />
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  )

  return (
    <section className="py-20 bg-gradient-to-br from-purple-50 via-pink-50 to-rose-50">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">
            <span className="gradient-text">Period Education</span> & Wellness Blog
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Expert-written articles covering everything you need to know about menstrual health, nutrition, and
            wellness.
          </p>

          {/* Search and Filters */}
          <div className="flex flex-col md:flex-row items-center justify-center gap-4 mb-8">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                type="text"
                placeholder="Search articles..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 w-80 rounded-full border-gray-300 focus:border-purple-500"
              />
            </div>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
              className="px-4 py-2 rounded-full border border-gray-300 focus:border-purple-500 focus:outline-none bg-white"
            >
              <option value="recent">Most Recent</option>
              <option value="popular">Most Popular</option>
              <option value="trending">Trending</option>
            </select>

            <div className="flex gap-2">
              <Button
                variant={viewMode === "grid" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("grid")}
              >
                <Grid className="w-4 h-4" />
              </Button>
              <Button
                variant={viewMode === "list" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("list")}
              >
                <List className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Category Filter */}
          <div className="flex flex-wrap justify-center gap-3 mb-8">
            {categories.map((category) => (
              <Button
                key={category.id}
                variant={selectedCategory === category.id ? "default" : "outline"}
                onClick={() => {
                  setSelectedCategory(category.id)
                  setCurrentPage(1)
                }}
                className={`${
                  selectedCategory === category.id
                    ? "bg-purple-500 hover:bg-purple-600"
                    : "hover:bg-purple-50 hover:text-purple-600 hover:border-purple-300 bg-transparent"
                } rounded-full`}
              >
                {category.name}
                <Badge variant="secondary" className="ml-2 text-xs">
                  {category.count}
                </Badge>
              </Button>
            ))}
          </div>

          {/* Tag Filter */}
          <div className="flex flex-wrap justify-center gap-2 mb-8">
            {tags.slice(0, 8).map((tag) => (
              <Button
                key={tag}
                variant={selectedTag === tag ? "default" : "ghost"}
                size="sm"
                onClick={() => setSelectedTag(selectedTag === tag ? "" : tag)}
                className={`text-xs ${selectedTag === tag ? "bg-purple-500" : "hover:bg-purple-100"} rounded-full`}
              >
                #{tag}
              </Button>
            ))}
          </div>
        </div>

        {/* Featured Articles */}
        {featuredPosts.length > 0 && (
          <div className="mb-16">
            <div className="flex items-center gap-2 mb-8">
              <TrendingUp className="w-6 h-6 text-purple-500" />
              <h3 className="text-2xl font-bold">Featured Articles</h3>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredPosts.map((post) => (
                <PostCard key={post.id} post={post} featured />
              ))}
            </div>
          </div>
        )}

        {/* Regular Articles */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-2xl font-bold">Latest Articles</h3>
            <div className="text-sm text-gray-600">
              Showing {paginatedPosts.length} of {regularPosts.length} articles
            </div>
          </div>

          {viewMode === "grid" ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {paginatedPosts.map((post) => (
                <PostCard key={post.id} post={post} />
              ))}
            </div>
          ) : (
            <div className="space-y-6">
              {paginatedPosts.map((post) => (
                <Card key={post.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                  <CardContent className="p-0">
                    <div className="flex gap-6">
                      <Image
                        src={post.image || "/placeholder.svg"}
                        alt={post.title}
                        width={200}
                        height={150}
                        className="w-48 h-36 object-cover flex-shrink-0"
                      />
                      <div className="flex-1 p-6">
                        <div className="flex items-center gap-4 text-sm text-gray-600 mb-2">
                          <Badge variant="outline">{post.category.replace("-", " ")}</Badge>
                          <span>{new Date(post.publishedAt).toLocaleDateString()}</span>
                          <span>{post.readTime} min read</span>
                        </div>
                        <h3 className="text-xl font-bold mb-2 hover:text-purple-600 transition-colors">
                          <Link href={`/blog/${post.id}`}>{post.title}</Link>
                        </h3>
                        <p className="text-gray-600 mb-4 line-clamp-2">{post.excerpt}</p>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Image
                              src={post.author.avatar || "/placeholder.svg"}
                              alt={post.author.name}
                              width={24}
                              height={24}
                              className="rounded-full"
                            />
                            <span className="text-sm font-medium">{post.author.name}</span>
                          </div>
                          <div className="flex items-center gap-4 text-sm text-gray-600">
                            <span>{post.views.toLocaleString()} views</span>
                            <span>{post.likes} likes</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-4">
            <Button
              variant="outline"
              onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="w-4 h-4 mr-2" />
              Previous
            </Button>

            <div className="flex gap-2">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <Button
                  key={page}
                  variant={currentPage === page ? "default" : "outline"}
                  size="sm"
                  onClick={() => setCurrentPage(page)}
                  className={currentPage === page ? "bg-purple-500 hover:bg-purple-600" : ""}
                >
                  {page}
                </Button>
              ))}
            </div>

            <Button
              variant="outline"
              onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages}
            >
              Next
              <ChevronRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        )}

        {/* Authors Section */}
        <div className="mt-16">
          <h3 className="text-2xl font-bold text-center mb-8">Meet Our Expert Authors</h3>
          <div className="grid md:grid-cols-3 gap-6">
            {authors.map((author) => (
              <Card key={author.id} className="text-center hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <Image
                    src={author.avatar || "/placeholder.svg"}
                    alt={author.name}
                    width={80}
                    height={80}
                    className="rounded-full mx-auto mb-4"
                  />
                  <h4 className="font-bold text-lg mb-2">{author.name}</h4>
                  <p className="text-gray-600 text-sm mb-4">{author.bio}</p>
                  <div className="flex flex-wrap justify-center gap-2 mb-4">
                    {author.expertise.map((skill, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                  <div className="flex justify-center gap-4 text-sm text-gray-600">
                    <span>{author.posts} articles</span>
                    <span>{author.followers.toLocaleString()} followers</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Newsletter Signup */}
        <div className="mt-16">
          <Card className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">
            <CardContent className="p-8 text-center">
              <BookOpen className="w-12 h-12 mx-auto mb-4" />
              <h3 className="text-2xl font-bold mb-4">Stay Updated with Our Latest Articles</h3>
              <p className="mb-6 opacity-90">
                Get expert insights on menstrual health, wellness tips, and product updates delivered to your inbox.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
                <Input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1 bg-white/10 border-white/20 text-white placeholder:text-white/70 focus:border-white"
                />
                <Button className="bg-white text-purple-600 hover:bg-gray-100 px-8">Subscribe</Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* No Results */}
        {filteredPosts.length === 0 && (
          <div className="text-center py-12">
            <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-bold mb-2">No articles found</h3>
            <p className="text-gray-600 mb-4">Try adjusting your search or filter criteria.</p>
            <Button
              variant="outline"
              onClick={() => {
                setSearchQuery("")
                setSelectedCategory("all")
                setSelectedTag("")
              }}
            >
              Clear Filters
            </Button>
          </div>
        )}
      </div>
    </section>
  )
}
