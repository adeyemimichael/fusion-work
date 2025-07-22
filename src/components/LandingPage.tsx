import React, { useState, useEffect } from 'react';
import { 
  Leaf, 
  Sparkles, 
  TrendingUp, 
  Users, 
  Award, 
  ArrowRight,
  Play,
  CheckCircle,
  Sun,
  Droplets,
  Zap
} from 'lucide-react';

interface LandingPageProps {
  onGetStarted: () => void;
  onSetUserName: (name: string) => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onGetStarted, onSetUserName }) => {
  const [userName, setUserName] = useState('');
  const [currentFeature, setCurrentFeature] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  const features = [
    {
      icon: Sparkles,
      title: 'AI-Powered Recommendations',
      description: 'Get personalized crop suggestions based on your location, space, and preferences',
      color: 'text-purple-600',
      bgColor: 'bg-purple-100'
    },
    {
      icon: TrendingUp,
      title: 'Sustainability Insights',
      description: 'Track your carbon footprint reduction and environmental impact',
      color: 'text-green-600',
      bgColor: 'bg-green-100'
    },
    {
      icon: Sun,
      title: 'Weather Integration',
      description: 'Real-time weather data to optimize your planting schedule',
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-100'
    },
    {
      icon: Zap,
      title: 'Smart Planning',
      description: 'Automated garden layout and timeline for maximum efficiency',
      color: 'text-blue-600',
      bgColor: 'bg-blue-100'
    }
  ];

  const stats = [
    { number: '10K+', label: 'Gardens Planned', icon: Leaf },
    { number: '95%', label: 'Success Rate', icon: Award },
    { number: '2.5K', label: 'Happy Gardeners', icon: Users },
    { number: '50%', label: 'Yield Increase', icon: TrendingUp }
  ];

  useEffect(() => {
    setIsVisible(true);
    const interval = setInterval(() => {
      setCurrentFeature((prev) => (prev + 1) % features.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const handleGetStarted = () => {
    if (userName.trim()) {
      onSetUserName(userName.trim());
    }
    onGetStarted();
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-emerald-50 via-white to-amber-50">
        <div className="absolute inset-0 bg-pattern opacity-30"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Column - Content */}
            <div className={`space-y-8 ${isVisible ? 'animate-fade-in' : 'opacity-0'}`}>
              <div className="space-y-4">
                <div className="inline-flex items-center space-x-2 bg-emerald-100 text-emerald-700 px-4 py-2 rounded-full text-sm font-medium">
                  <Sparkles className="h-4 w-4" />
                  <span>AI-Powered Garden Planning</span>
                </div>
                
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
                  Plan Your Perfect
                  <span className="gradient-text block">Summer Garden</span>
                </h1>
                
                <p className="text-xl text-gray-600 max-w-2xl">
                  Transform your space into a thriving garden with AI-powered recommendations, 
                  sustainability insights, and personalized growing plans optimized for summer success.
                </p>
              </div>

              {/* User Input */}
              <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      What's your name? (Optional)
                    </label>
                    <input
                      type="text"
                      value={userName}
                      onChange={(e) => setUserName(e.target.value)}
                      placeholder="Enter your name..."
                      className="input-field"
                    />
                  </div>
                  
                  <button
                    onClick={handleGetStarted}
                    className="w-full btn-primary group"
                  >
                    <span>Start Planning My Garden</span>
                    <ArrowRight className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform" />
                  </button>
                  
                  <div className="flex items-center justify-center space-x-4 text-sm text-gray-500">
                    <div className="flex items-center space-x-1">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span>Free to use</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span>No signup required</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Interactive Feature Showcase */}
            <div className={`relative ${isVisible ? 'animate-slide-up' : 'opacity-0'}`}>
              <div className="relative bg-white rounded-3xl shadow-2xl p-8 border border-gray-100">
                <div className="text-center mb-6">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">
                    Powered by Advanced AI
                  </h3>
                  <p className="text-gray-600">
                    Discover what makes our garden planner special
                  </p>
                </div>

                {/* Feature Carousel */}
                <div className="space-y-6">
                  {features.map((feature, index) => {
                    const Icon = feature.icon;
                    const isActive = index === currentFeature;
                    
                    return (
                      <div
                        key={index}
                        className={`flex items-start space-x-4 p-4 rounded-xl transition-all duration-500 ${
                          isActive 
                            ? `${feature.bgColor} scale-105 shadow-md` 
                            : 'bg-gray-50 opacity-60'
                        }`}
                      >
                        <div className={`p-3 rounded-lg ${feature.bgColor}`}>
                          <Icon className={`h-6 w-6 ${feature.color}`} />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-900 mb-1">
                            {feature.title}
                          </h4>
                          <p className="text-sm text-gray-600">
                            {feature.description}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Feature Indicators */}
                <div className="flex justify-center space-x-2 mt-6">
                  {features.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentFeature(index)}
                      className={`w-3 h-3 rounded-full transition-all duration-300 ${
                        index === currentFeature 
                          ? 'bg-emerald-500 scale-125' 
                          : 'bg-gray-300 hover:bg-gray-400'
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Trusted by Gardeners Worldwide
            </h2>
            <p className="text-lg text-gray-600">
              Join thousands of successful gardeners who've transformed their spaces
            </p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div
                  key={index}
                  className="text-center p-6 rounded-xl bg-gradient-to-br from-emerald-50 to-amber-50 hover:shadow-lg transition-all duration-300 animate-slide-up"
                  style={{ animationDelay: `${index * 150}ms` }}
                >
                  <div className="inline-flex items-center justify-center w-12 h-12 bg-emerald-100 rounded-lg mb-4">
                    <Icon className="h-6 w-6 text-emerald-600" />
                  </div>
                  <div className="text-3xl font-bold text-gray-900 mb-2">
                    {stat.number}
                  </div>
                  <div className="text-sm text-gray-600 font-medium">
                    {stat.label}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-emerald-600 to-amber-500">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="space-y-6">
            <h2 className="text-3xl sm:text-4xl font-bold text-white">
              Ready to Start Your Garden Journey?
            </h2>
            <p className="text-xl text-emerald-100 max-w-2xl mx-auto">
              Get personalized recommendations in minutes and start growing your dream garden today.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <button
                onClick={handleGetStarted}
                className="bg-white text-emerald-600 hover:bg-gray-50 font-semibold py-4 px-8 rounded-lg transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-emerald-600 shadow-lg hover:shadow-xl group"
              >
                <span>Get Started Now</span>
                <ArrowRight className="h-5 w-5 ml-2 inline group-hover:translate-x-1 transition-transform" />
              </button>
              
              <div className="flex items-center space-x-2 text-emerald-100">
                <Play className="h-4 w-4" />
                <span className="text-sm">Takes less than 5 minutes</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;