"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { BookOpen, Play, FileText, Star, Clock, Users } from "lucide-react"

export default function EducationView() {
  const articles = [
    {
      id: 1,
      title: "Understanding Your Menstrual Cycle",
      description: "Learn about the phases of your cycle and what happens in each stage",
      category: "Basics",
      readTime: "5 min",
      rating: 4.8,
      readers: 1247,
      image: "📚"
    },
    {
      id: 2,
      title: "Natural Remedies for Period Pain",
      description: "Discover effective natural ways to manage menstrual cramps",
      category: "Health",
      readTime: "7 min",
      rating: 4.9,
      readers: 892,
      image: "🌿"
    },
    {
      id: 3,
      title: "Nutrition for Hormonal Balance",
      description: "Foods that support your hormonal health throughout your cycle",
      category: "Nutrition",
      readTime: "6 min",
      rating: 4.7,
      readers: 654,
      image: "🥗"
    },
    {
      id: 4,
      title: "Tracking Fertility Signs",
      description: "How to identify and track your fertile window naturally",
      category: "Fertility",
      readTime: "8 min",
      rating: 4.6,
      readers: 445,
      image: "📊"
    }
  ]

  const videos = [
    {
      id: 1,
      title: "Cycle Tracking 101",
      duration: "12:34",
      thumbnail: "🎥",
      views: 2341
    },
    {
      id: 2,
      title: "Yoga for Period Relief",
      duration: "18:22",
      thumbnail: "🧘‍♀️",
      views: 1892
    }
  ]

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Learn & Grow</h2>
        <p className="text-gray-600">Educational content to help you understand your body better</p>
      </div>

      {/* Featured Article */}
      <Card className="border-l-4 border-l-purple-500">
        <CardHeader>
          <div className="flex items-center justify-between">
            <Badge variant="secondary" className="text-purple-600 border-purple-600">
              Featured
            </Badge>
            <div className="flex items-center text-sm text-gray-500">
              <Clock className="w-4 h-4 mr-1" />
              10 min read
            </div>
          </div>
          <CardTitle className="text-xl">The Complete Guide to Period Health</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600 mb-4">
            Everything you need to know about maintaining optimal menstrual health, from nutrition to exercise and stress management.
          </p>
          <Button className="w-full">
            <BookOpen className="w-4 h-4 mr-2" />
            Read Full Article
          </Button>
        </CardContent>
      </Card>

      {/* Articles Grid */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Latest Articles</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {articles.map((article) => (
            <Card key={article.id} className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between mb-2">
                  <Badge variant="outline">{article.category}</Badge>
                  <div className="flex items-center text-sm text-gray-500">
                    <Clock className="w-3 h-3 mr-1" />
                    {article.readTime}
                  </div>
                </div>
                <CardTitle className="text-lg">{article.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 text-sm mb-3">{article.description}</p>
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center text-yellow-500">
                    <Star className="w-4 h-4 fill-current mr-1" />
                    {article.rating}
                  </div>
                  <div className="flex items-center text-gray-500">
                    <Users className="w-4 h-4 mr-1" />
                    {article.readers}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Video Section */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Video Content</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {videos.map((video) => (
            <Card key={video.id} className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardContent className="p-4">
                <div className="flex items-center space-x-3">
                  <div className="text-3xl">{video.thumbnail}</div>
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900">{video.title}</h4>
                    <div className="flex items-center justify-between text-sm text-gray-500 mt-1">
                      <span>{video.duration}</span>
                      <span>{video.views} views</span>
                    </div>
                  </div>
                  <Button size="sm" variant="outline">
                    <Play className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Quick Tips */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <FileText className="w-5 h-5 mr-2 text-green-500" />
            Quick Tips
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-3 bg-green-50 rounded-lg">
              <h4 className="font-medium text-green-800 mb-1">Stay Hydrated</h4>
              <p className="text-sm text-green-700">Drink plenty of water to help reduce bloating</p>
            </div>
            <div className="p-3 bg-blue-50 rounded-lg">
              <h4 className="font-medium text-blue-800 mb-1">Gentle Exercise</h4>
              <p className="text-sm text-blue-700">Light yoga or walking can help with cramps</p>
            </div>
            <div className="p-3 bg-purple-50 rounded-lg">
              <h4 className="font-medium text-purple-800 mb-1">Track Symptoms</h4>
              <p className="text-sm text-purple-700">Log your symptoms to identify patterns</p>
            </div>
            <div className="p-3 bg-orange-50 rounded-lg">
              <h4 className="font-medium text-orange-800 mb-1">Rest Well</h4>
              <p className="text-sm text-orange-700">Get adequate sleep during your period</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 