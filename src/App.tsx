import { useState } from 'react';
import Header from './components/Header';
import UserInputForm from './components/UserInputForm';
import GardenPlanDisplay from './components/GardenPlanDisplay';
import type { UserInput, GardenPlan, WeatherData } from './types';
import { WeatherService } from './services/weatherService';
import { MLService } from './services/mlService';

function App() {
  const [gardenPlan, setGardenPlan] = useState<GardenPlan | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleUserInput = async (userInput: UserInput) => {
    setLoading(true);
    setError(null);

    try {
      // Get weather data for the user's location
      const weatherData: WeatherData = await WeatherService.getWeatherData(userInput.location);
      
      // Generate AI recommendations
      const plan: GardenPlan = await MLService.generateRecommendations(userInput, weatherData);
      
      setGardenPlan(plan);
    } catch (err) {
      console.error('Error generating garden plan:', err);
      setError('Failed to generate garden plan. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    setGardenPlan(null);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
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
        )}

        {!gardenPlan ? (
          <div className="max-w-2xl mx-auto">
            <div className="text-center mb-8">
              <h1 className="text-4xl font-bold gradient-text mb-4">
                Plan Your Perfect Summer Garden
              </h1>
              <p className="text-lg text-gray-600 max-w-xl mx-auto">
                Get AI-powered crop recommendations, sustainability insights, and a personalized 
                growing plan optimized for the summer season.
              </p>
            </div>
            <UserInputForm onSubmit={handleUserInput} loading={loading} />
          </div>
        ) : (
          <GardenPlanDisplay gardenPlan={gardenPlan} onBack={handleBack} />
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
            <div className="mt-4 flex justify-center space-x-6 text-sm text-gray-500">
              <span>🌱 AI-Powered</span>
              <span>♻️ Sustainable</span>
              <span>📊 Data-Driven</span>
              <span>☀️ Summer-Optimized</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;