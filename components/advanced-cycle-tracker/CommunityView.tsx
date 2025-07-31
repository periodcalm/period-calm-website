"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Users, MessageCircle, Heart, Share2, MoreHorizontal } from "lucide-react"

export default function CommunityView() {
  const [posts] = useState([
    {
      id: 1,
      user: {
        name: "Sarah K.",
        avatar: "SK",
        verified: true
      },
      content: "Just discovered that Period Calm really helps with my cramps! Anyone else tried it?",
      likes: 24,
      comments: 8,
      timeAgo: "2 hours ago",
      tags: ["Period Calm", "Cramp Relief"]
    },
    {
      id: 2,
      user: {
        name: "Priya M.",
        avatar: "PM",
        verified: false
      },
      content: "Looking for natural ways to manage PMS symptoms. Any recommendations?",
      likes: 15,
      comments: 12,
      timeAgo: "5 hours ago",
      tags: ["PMS", "Natural Remedies"]
    },
    {
      id: 3,
      user: {
        name: "Dr. Emily Chen",
        avatar: "EC",
        verified: true
      },
      content: "As a gynecologist, I often recommend tracking your cycle. It helps identify patterns and can be crucial for reproductive health.",
      likes: 42,
      comments: 6,
      timeAgo: "1 day ago",
      tags: ["Health Tips", "Cycle Tracking"]
    }
  ])

  const [topics] = useState([
    { name: "Period Health", count: 1247 },
    { name: "Natural Remedies", count: 892 },
    { name: "Cycle Tracking", count: 654 },
    { name: "PMS Support", count: 445 },
    { name: "Fertility", count: 334 },
    { name: "Product Reviews", count: 223 }
  ])

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Community</h2>
          <p className="text-gray-600">Connect with others on their health journey</p>
        </div>
        <Button className="flex items-center">
          <MessageCircle className="w-4 h-4 mr-2" />
          New Post
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Feed */}
        <div className="lg:col-span-2 space-y-4">
          {posts.map((post) => (
            <Card key={post.id} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Avatar>
                      <AvatarImage src="" />
                      <AvatarFallback className="bg-rose-100 text-rose-600">
                        {post.user.avatar}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="font-medium text-gray-900">{post.user.name}</span>
                        {post.user.verified && (
                          <Badge variant="secondary" className="text-xs">Verified</Badge>
                        )}
                      </div>
                      <span className="text-sm text-gray-500">{post.timeAgo}</span>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm">
                    <MoreHorizontal className="w-4 h-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 mb-3">{post.content}</p>
                
                <div className="flex flex-wrap gap-2 mb-4">
                  {post.tags.map((tag) => (
                    <Badge key={tag} variant="outline" className="text-xs">
                      #{tag}
                    </Badge>
                  ))}
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <Button variant="ghost" size="sm" className="flex items-center">
                      <Heart className="w-4 h-4 mr-1" />
                      {post.likes}
                    </Button>
                    <Button variant="ghost" size="sm" className="flex items-center">
                      <MessageCircle className="w-4 h-4 mr-1" />
                      {post.comments}
                    </Button>
                  </div>
                  <Button variant="ghost" size="sm">
                    <Share2 className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Community Stats */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center text-lg">
                <Users className="w-5 h-5 mr-2 text-blue-500" />
                Community Stats
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Members</span>
                  <span className="font-semibold">12,847</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Active Today</span>
                  <span className="font-semibold">1,234</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Posts Today</span>
                  <span className="font-semibold">89</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Popular Topics */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Popular Topics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {topics.map((topic) => (
                  <div key={topic.name} className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-lg cursor-pointer">
                    <span className="text-gray-700">#{topic.name}</span>
                    <Badge variant="secondary" className="text-xs">
                      {topic.count}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Community Guidelines */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Community Guidelines</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm text-gray-600">
                <p>• Be respectful and supportive</p>
                <p>• Share evidence-based information</p>
                <p>• Protect your privacy</p>
                <p>• Report inappropriate content</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
} 