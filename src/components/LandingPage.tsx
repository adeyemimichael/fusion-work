import React from 'react';
import { 
  Leaf, 
  Brain, 
  Cloud, 
  TrendingUp, 
  Users, 
  CheckCircle, 
  ArrowRight,
  Sparkles,
  Target,
  BarChart3
} from 'lucide-react';

interface LandingPageProps {
  onGetStarted: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onGetStarted }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-amber-50">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <div className="flex justify-center mb-8">
              <div className="relative">
                <div className="w-20 h-20 bg-gradient-to-br from-emerald-500 to-amber-500 rounded-full flex items-center justify-center shadow-xl">
                  <Leaf className="h-10 w-10 text-white" />
                </div>
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-amber-400 rounded-full flex items-center justify-center">
                  <Sparkles className="h-3 w-3 text-white" />
                </div>
              </div>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold mb-6">
              <span className="gradient-text">Smart Garden</span>
              <br />
              <span className="text-gray-800">Planning Made Easy</span>
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
              Get AI-powered crop recommendations, sustainability insights, and personalized 
              growing plans optimized for your space, climate, and experience level.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
              <button 
                onClick={onGetStarted}
                className="btn-primary text-lg px-8 py-4 flex items-center space-x-2 shadow-xl hover:shadow-2xl transform hover:scale-105"
              >
                <span>Start Planning Your Garden</span>
                <ArrowRight className="h-5 w-5" />
              </button>
              <button className="text-emerald-600 hover:text-emerald-700 font-semibold flex items-center space-x-2">
                <span>Watch Demo</span>
                <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center">
                  <div className="w-0 h-0 border-l-[6px] border-l-emerald-600 border-t-[4px] border-t-transparent border-b-[4px] border-b-transparent ml-1"></div>
                </div>
              </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
              <div className="text-center">
                <div className="text-3xl font-bold text-emerald-600 mb-2">10,000+</div>
                <div className="text-gray-600">Gardens Planned</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-amber-600 mb-2">95%</div>
                <div className="text-gray-600">Success Rate</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-emerald-600 mb-2">50+</div>
                <div className="text-gray-600">Crop Varieties</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Why Choose GardenAI?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our AI-powered platform combines real-time weather data, soil analysis, 
              and agricultural expertise to create the perfect garden plan for you.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="card text-center hover:scale-105 transition-transform">
              <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Brain className="h-8 w-8 text-emerald-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">AI-Powered Recommendations</h3>
              <p className="text-gray-600">
                Advanced machine learning algorithms analyze your specific conditions to recommend 
                the best crops for your garden.
              </p>
            </div>

            <div className="card text-center hover:scale-105 transition-transform">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Cloud className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Real-Time Weather Data</h3>
              <p className="text-gray-600">
                Integration with weather APIs provides accurate, location-specific climate data 
                for optimal planting decisions.
              </p>
            </div>

            <div className="card text-center hover:scale-105 transition-transform">
              <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <TrendingUp className="h-8 w-8 text-amber-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Sustainability Insights</h3>
              <p className="text-gray-600">
                Track your environmental impact with carbon footprint calculations and 
                sustainable gardening recommendations.
              </p>
            </div>

            <div className="card text-center hover:scale-105 transition-transform">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Target className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Personalized Plans</h3>
              <p className="text-gray-600">
                Customized garden layouts and timelines based on your space, experience level, 
                and crop preferences.
              </p>
            </div>

            <div className="card text-center hover:scale-105 transition-transform">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Users className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Expert Guidance</h3>
              <p className="text-gray-600">
                Access to agricultural expertise and best practices, tailored to your 
                experience level from beginner to expert.
              </p>
            </div>

            <div className="card text-center hover:scale-105 transition-transform">
              <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <BarChart3 className="h-8 w-8 text-indigo-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Performance Tracking</h3>
              <p className="text-gray-600">
                Monitor your garden's progress with yield predictions, water usage tracking, 
                and harvest scheduling.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 bg-gradient-to-br from-emerald-50 to-amber-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              How It Works
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Get your personalized garden plan in just three simple steps
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-20 h-20 bg-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6 text-white text-2xl font-bold">
                1
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Input Your Details</h3>
              <p className="text-gray-600">
                Tell us about your location, garden space, sunlight hours, and crop preferences. 
                Our form makes it easy to provide all the necessary information.
              </p>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 bg-amber-500 rounded-full flex items-center justify-center mx-auto mb-6 text-white text-2xl font-bold">
                2
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">AI Analysis</h3>
              <p className="text-gray-600">
                Our AI processes your information along with real-time weather data and 
                agricultural databases to create optimal recommendations.
              </p>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 bg-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6 text-white text-2xl font-bold">
                3
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Get Your Plan</h3>
              <p className="text-gray-600">
                Receive a comprehensive garden plan with crop recommendations, planting timeline, 
                layout design, and care instructions.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-emerald-600 to-amber-600">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-white mb-6">
            Ready to Start Your Garden Journey?
          </h2>
          <p className="text-xl text-emerald-100 mb-8">
            Join thousands of gardeners who have transformed their spaces with AI-powered planning
          </p>
          <button 
            onClick={onGetStarted}
            className="bg-white text-emerald-600 hover:bg-gray-100 font-bold py-4 px-8 rounded-lg text-lg transition-all duration-200 transform hover:scale-105 shadow-xl"
          >
            Create Your Garden Plan Now
          </button>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;