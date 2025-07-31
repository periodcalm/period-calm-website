import Header from '@/components/Header'
import HeroSection from '@/components/HeroSection'
import FeedbackForm from '@/components/FeedbackForm'
import { Heart, Zap, Users, CheckCircle, Star, Shield, Leaf, Award } from 'lucide-react'

export default function HomePage() {
  return (
    <div className="min-h-screen">
      <Header />
      
      <main>
        <HeroSection />

        {/* Benefits Section */}
        <section id="benefits" className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Why Choose Period Calm?
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Our scientifically formulated blend works with your body to provide natural, effective relief.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                {
                  icon: Heart,
                  title: "92% Pain Reduction",
                  description: "Relief from menstrual cramps within 15-20 minutes"
                },
                {
                  icon: Zap,
                  title: "Mood Balance",
                  description: "Stabilize emotions and reduce mood swings naturally"
                },
                {
                  icon: Users,
                  title: "Energy Boost",
                  description: "Increase energy levels without crashes or jitters"
                },
                {
                  icon: CheckCircle,
                  title: "Bloating Relief",
                  description: "Reduce water retention and digestive discomfort"
                }
              ].map((benefit, index) => (
                <div key={index} className="text-center p-6 rounded-xl bg-gradient-to-br from-rose-50 to-orange-50">
                  <benefit.icon className="w-12 h-12 text-rose-500 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{benefit.title}</h3>
                  <p className="text-gray-600">{benefit.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Product Section */}
        <section id="product" className="py-20 bg-gradient-to-br from-rose-50 to-orange-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                  Natural Relief Powder
                </h2>
                <p className="text-lg text-gray-600 mb-8">
                  Our premium blend combines clinically-proven ingredients like Magnesium Glycinate, 
                  Ginger Extract, L-Theanine, and GABA to provide comprehensive period support.
                </p>
                
                <div className="space-y-4 mb-8">
                  <div className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                    <span>30 sachets per pack (1 month supply)</span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                    <span>100% natural ingredients</span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                    <span>FSSAI approved & GMP certified</span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                    <span>Third-party tested for purity</span>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-rose-600">₹1,299</div>
                    <div className="text-sm text-gray-500 line-through">₹1,599</div>
                  </div>
                  <a
                    href="#contact"
                    className="bg-rose-500 text-white px-8 py-3 rounded-lg font-semibold hover:bg-rose-600 transition-colors text-center"
                  >
                    Order Now
                  </a>
                </div>
              </div>

              <div className="relative">
                <div className="bg-white rounded-2xl p-8 shadow-xl">
                  <div className="aspect-square bg-gradient-to-br from-rose-100 to-orange-100 rounded-xl flex items-center justify-center">
                    <div className="text-center">
                      <Heart className="w-24 h-24 text-rose-500 mx-auto mb-4" />
                      <p className="text-gray-600">Product Image</p>
                    </div>
                  </div>
                </div>
                
                {/* Certifications */}
                <div className="absolute -bottom-4 -right-4 bg-white rounded-lg p-4 shadow-lg">
                  <div className="flex space-x-3">
                    <Shield className="w-8 h-8 text-blue-500" />
                    <Leaf className="w-8 h-8 text-green-500" />
                    <Award className="w-8 h-8 text-purple-500" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section id="testimonials" className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                What Our Customers Say
              </h2>
              <p className="text-xl text-gray-600">
                Join thousands of women who have transformed their period experience
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  name: "Sarah K.",
                  rating: 5,
                  text: "Period Calm has been a game-changer for me. The cramps that used to leave me bedridden are now manageable within 20 minutes."
                },
                {
                  name: "Priya M.",
                  rating: 5,
                  text: "I love how natural this feels. No side effects, just pure relief. My mood is so much better during my cycle now."
                },
                {
                  name: "Anita R.",
                  rating: 5,
                  text: "Finally found something that actually works! The energy boost is incredible and I don't feel bloated anymore."
                }
              ].map((testimonial, index) => (
                <div key={index} className="bg-gradient-to-br from-rose-50 to-orange-50 p-6 rounded-xl">
                  <div className="flex text-yellow-400 mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 fill-current" />
                    ))}
                  </div>
                  <p className="text-gray-700 mb-4 italic">"{testimonial.text}"</p>
                  <p className="font-semibold text-gray-900">- {testimonial.name}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section id="contact" className="py-20 bg-gradient-to-br from-rose-50 to-orange-50">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <FeedbackForm />
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <Heart className="h-6 w-6 text-rose-500" />
                <span className="text-xl font-bold">Period Calm</span>
              </div>
              <p className="text-gray-400">
                Natural period pain relief that works with your body, not against it.
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Product</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#product" className="hover:text-white transition-colors">Natural Relief Powder</a></li>
                <li><a href="#benefits" className="hover:text-white transition-colors">Benefits</a></li>
                <li><a href="#testimonials" className="hover:text-white transition-colors">Reviews</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Support</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#contact" className="hover:text-white transition-colors">Contact Us</a></li>
                <li><a href="#contact" className="hover:text-white transition-colors">Customer Support</a></li>
                <li><a href="#contact" className="hover:text-white transition-colors">Wholesale</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Legal</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Shipping Policy</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 Period Calm. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
} 