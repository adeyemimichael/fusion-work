import { useState } from 'react';
import Navbar from './components/Navbar';
import LandingPage from './components/LandingPage';
import UserInputForm from './components/UserInputForm';
import GardenPlanDisplay from './components/GardenPlanDisplay';
import type { UserInput, GardenPlan, WeatherData } from './types';
import { WeatherService } from './services/weatherService';
import { MLService } from './services/mlService';

function App() {
  const [currentView, setCurrentView] = useState<'landing' | 'form' | 'dashboard'>('landing');
  const [gardenPlan, setGardenPlan] = useState<GardenPlan | null>(null);
  const [userInput, setUserInput] = useState<UserInput | null>(null);
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [userName, setUserName] = useState<string>('');

  const handleGetStarted = () => {
    setCurrentView('form');
  };

  const handleUserInput = async (input: UserInput) => {
    setLoading(true);
    setError(null);
    setUserInput(input);

    try {
      // Get weather data for the user's location
      const weather: WeatherData = await WeatherService.getWeatherData(input.location);
      setWeatherData(weather);
      
      // Generate AI recommendations
      const plan: GardenPlan = await MLService.generateRecommendations(input, weather);
      
      setGardenPlan(plan);
      setCurrentView('dashboard');
    } catch (err) {
      console.error('Error generating garden plan:', err);
      setError('Failed to generate garden plan. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    if (currentView === 'dashboard') {
      setCurrentView('form');
    } else if (currentView === 'form') {
      setCurrentView('landing');
    }
    setError(null);
  };

  const handleNavigation = (view: 'landing' | 'form' | 'dashboard') => {
    if (view === 'dashboard' && !gardenPlan) {
      setCurrentView('form');
    } else {
      setCurrentView(view);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-amber-50">
      <Navbar 
        currentView={currentView} 
        onNavigate={handleNavigation}
        userName={userName}
        hasGardenPlan={!!gardenPlan}
      />
      
      <main className="pt-16">
        {error && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg animate-fade-in">
              <div className="flex items-center space-x-2">
                <div className="text-red-600">⚠️</div>
                <p className="text-red-800 font-medium">Error</p>
              </div>
              <p className="text-red-700 mt-1">{error}</p>
              <button
                onClick={() => setError(null)}
                className="mt-2 text-red-600 hover:text-red-800 text-sm underline"
              >
                Dismiss
              </button>
            </div>
          </div>
        )}

        {currentView === 'landing' && (
          <LandingPage onGetStarted={handleGetStarted} onSetUserName={setUserName} />
        )}

        {currentView === 'form' && (
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <UserInputForm onSubmit={handleUserInput} loading={loading} onBack={handleBack} />
          </div>
        )}

        {currentView === 'dashboard' && gardenPlan && userInput && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <GardenPlanDisplay 
              gardenPlan={gardenPlan} 
              userInput={userInput}
              weatherData={weatherData}
              userName={userName}
              onBack={handleBack} 
            />
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <p className="text-gray-600 mb-2">
              Built for <strong>Fusion Hacks 2</strong> - Summer 2025
            </p>
            <p className="text-sm text-gray-500">
              Empowering sustainable urban gardening through AI and data visualization
            </p>
            <div className="mt-4 flex flex-wrap justify-center gap-4 text-sm text-gray-500">
              <span className="flex items-center gap-1">🌱 AI-Powered</span>
              <span className="flex items-center gap-1">♻️ Sustainable</span>
              <span className="flex items-center gap-1">📊 Data-Driven</span>
              <span className="flex items-center gap-1">☀️ Summer-Optimized</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;