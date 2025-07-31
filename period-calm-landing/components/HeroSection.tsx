import { ArrowRight, Star } from 'lucide-react'

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-rose-50 via-orange-50 to-pink-50 py-20 lg:py-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <p className="text-lg text-gray-600 mb-4">Trusted by 500+ trial participants</p>
          <div className="flex justify-center space-x-8 text-sm text-gray-500">
            <span>⭐ 4.9/5 Rating</span>
            <span>🌿 100% Natural</span>
            <span>⚡ 15-20 Min Relief</span>
          </div>
        </div>

        {/* Main Headline */}
        <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
          Say Goodbye to{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-600 to-orange-600">
            Period Pain
          </span>
        </h1>

        {/* Subtitle */}
        <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto">
          Transform your period experience with our scientifically formulated powder drink. 
          Get relief from cramps, mood swings, and fatigue in just{' '}
          <span className="font-semibold text-rose-600">15-20 minutes</span>.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
          <a
            href="#contact"
            className="bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white px-8 py-4 text-lg rounded-full font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 flex items-center"
          >
            Try Period Calm - ₹1,299
            <ArrowRight className="w-5 h-5 ml-2" />
          </a>
          <a
            href="#product"
            className="border-2 border-rose-300 text-rose-600 hover:bg-rose-50 px-8 py-4 text-lg rounded-full font-semibold transition-all duration-300"
          >
            Join 500+ trial participants
          </a>
        </div>

        {/* Social Proof */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-8 text-sm text-gray-600">
          <div className="flex items-center">
            <div className="flex -space-x-2 mr-3">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="w-8 h-8 rounded-full bg-gradient-to-r from-rose-400 to-orange-400 border-2 border-white"
                />
              ))}
            </div>
            <span>Join 500+ trial participants</span>
          </div>
          <div className="flex items-center">
            <div className="flex text-yellow-400 mr-2">
              {[1, 2, 3, 4, 5].map((i) => (
                <Star key={i} className="w-4 h-4 fill-current" />
              ))}
            </div>
            <span>4.9/5 from 2,847 reviews</span>
          </div>
        </div>
      </div>

      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-rose-200 rounded-full opacity-20"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-orange-200 rounded-full opacity-20"></div>
      </div>
    </section>
  )
} 