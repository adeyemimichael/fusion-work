import React, { useState, useEffect } from 'react';
import { Bug, Cloud, Brain, Database, Zap, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { testWeatherAPI, checkAPIKeyStatus } from '../utils/testWeatherAPI';
import { RealAIService } from '../services/realAIService';
import { WeatherService } from '../services/weatherService';
import type { UserInput, WeatherData } from '../types';

interface DebugPanelProps {
  isOpen: boolean;
  onClose: () => void;
  userInput?: UserInput | null;
  weatherData?: WeatherData | null;
}

const DebugPanel: React.FC<DebugPanelProps> = ({ isOpen, onClose, userInput, weatherData }) => {
  const [weatherStatus, setWeatherStatus] = useState<'unknown' | 'working' | 'mock' | 'error'>('unknown');
  const [aiStatus, setAiStatus] = useState<'unknown' | 'training' | 'ready' | 'fallback'>('unknown');
  const [testResults, setTestResults] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      checkSystemStatus();
    }
  }, [isOpen]);

  const checkSystemStatus = async () => {
    // Check Weather API status
    const hasApiKey = checkAPIKeyStatus();
    setWeatherStatus(hasApiKey ? 'working' : 'mock');

    // Check AI status
    const aiInfo = RealAIService.getModelInfo();
    if (aiInfo.isAIEnabled) {
      setAiStatus('ready');
    } else if (aiInfo.trainingStatus === 'Ready') {
      setAiStatus('fallback');
    } else {
      setAiStatus('unknown');
    }
  };

  const runWeatherTest = async () => {
    setIsLoading(true);
    setTestResults(['🌤️ Testing Weather API...']);
    
    try {
      // Use user's actual location if available, otherwise default to New York
      const testLocation = userInput?.location || 'New York';
      setTestResults([`🌤️ Testing Weather API for: ${testLocation}...`]);
      
      const startTime = Date.now();
      const weatherData = await WeatherService.getWeatherData(testLocation);
      const endTime = Date.now();
      
      const results = [
        `✅ Weather API Test Completed (${endTime - startTime}ms)`,
        `📍 Location: ${weatherData.location}`,
        `🌡️ Temperature: ${weatherData.temperature}°C`,
        `💧 Humidity: ${weatherData.humidity}%`,
        `🌧️ Precipitation: ${weatherData.precipitation}mm`,
        `💨 Wind Speed: ${weatherData.windSpeed} m/s`,
        `☀️ UV Index: ${weatherData.uvIndex}`,
        '',
        '📅 Testing 3-day forecast...'
      ];
      
      const forecast = await WeatherService.getForecast(testLocation, 3);
      forecast.forEach((day, index) => {
        results.push(`Day ${index + 1}: ${day.date} - ${day.temperature}°C, ${day.condition}`);
      });
      
      setTestResults(results);
      setWeatherStatus('working');
      
    } catch (error) {
      setTestResults([
        '❌ Weather API Test Failed',
        `Error: ${error}`,
        '🔄 Falling back to mock data...'
      ]);
      setWeatherStatus('error');
    } finally {
      setIsLoading(false);
    }
  };

  const runAITest = async () => {
    setIsLoading(true);
    setTestResults(['🤖 Testing AI System...']);
    
    try {
      // Initialize AI
      setAiStatus('training');
      await RealAIService.initialize();
      
      const aiInfo = RealAIService.getModelInfo();
      const results = [
        '🤖 AI System Test Results:',
        `✅ AI Enabled: ${aiInfo.isAIEnabled ? 'Yes' : 'No'}`,
        `💾 Models Saved: ${aiInfo.modelsSaved ? 'Yes' : 'No'}`,
        `📊 Training Status: ${aiInfo.trainingStatus}`,
        '',
        '🧪 Testing AI Recommendations...'
      ];

      // Test AI with sample data
      const sampleInput = {
        location: 'San Francisco',
        gardenSpace: 50,
        sunlightHours: 8,
        cropPreferences: ['Tomatoes', 'Basil'],
        soilType: 'loamy',
        experienceLevel: 'intermediate'
      };

      const sampleWeather = {
        temperature: 22,
        humidity: 65,
        precipitation: 0.5,
        windSpeed: 10,
        uvIndex: 7,
        location: 'San Francisco, US'
      };

      const startTime = Date.now();
      const recommendations = await RealAIService.generateRecommendations(sampleInput, sampleWeather);
      const endTime = Date.now();

      results.push(
        `⚡ Generation Time: ${endTime - startTime}ms`,
        `🌱 Crops Recommended: ${recommendations.recommendations.length}`,
        `📈 Expected Yield: ${recommendations.metrics.expectedYield.toFixed(1)}kg`,
        `♻️ Carbon Savings: ${recommendations.metrics.carbonFootprintReduction.toFixed(1)}kg CO₂`,
        `🎯 Sustainability Score: ${recommendations.metrics.sustainabilityScore.toFixed(0)}%`,
        '',
        '🌿 Recommended Crops:'
      );

      recommendations.recommendations.forEach((crop, index) => {
        results.push(`${index + 1}. ${crop.name} (${crop.variety}) - ${crop.expectedYield.toFixed(1)}kg`);
      });

      setTestResults(results);
      setAiStatus(aiInfo.isAIEnabled ? 'ready' : 'fallback');
      
    } catch (error) {
      setTestResults([
        '❌ AI Test Failed',
        `Error: ${error}`,
        '📋 Using rule-based fallback system'
      ]);
      setAiStatus('fallback');
    } finally {
      setIsLoading(false);
    }
  };

  const clearAIModels = () => {
    RealAIService.clearSavedModels();
    setTestResults(['🗑️ AI models cleared from storage']);
    setAiStatus('unknown');
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'working':
      case 'ready':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'mock':
      case 'fallback':
        return <AlertCircle className="h-5 w-5 text-yellow-500" />;
      case 'error':
        return <XCircle className="h-5 w-5 text-red-500" />;
      default:
        return <AlertCircle className="h-5 w-5 text-gray-500" />;
    }
  };

  const getStatusText = (type: 'weather' | 'ai', status: string) => {
    if (type === 'weather') {
      switch (status) {
        case 'working': return 'Real API Data';
        case 'mock': return 'Mock Data (No API Key)';
        case 'error': return 'API Error';
        default: return 'Unknown';
      }
    } else {
      switch (status) {
        case 'ready': return 'AI Models Active';
        case 'training': return 'Training Models...';
        case 'fallback': return 'Rule-Based Fallback';
        default: return 'Not Initialized';
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-600 to-amber-600 text-white p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Bug className="h-6 w-6" />
              <h2 className="text-xl font-bold">System Debug Panel</h2>
            </div>
            <button
              onClick={onClose}
              className="text-white hover:text-gray-200 text-2xl font-bold"
            >
              ×
            </button>
          </div>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          {/* System Status */}
          <div className="grid md:grid-cols-2 gap-6 mb-6">
            {/* Weather API Status */}
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center space-x-3 mb-3">
                <Cloud className="h-5 w-5 text-blue-500" />
                <h3 className="font-semibold">Weather API Status</h3>
                {getStatusIcon(weatherStatus)}
              </div>
              <p className="text-sm text-gray-600 mb-3">
                {getStatusText('weather', weatherStatus)}
              </p>
              <button
                onClick={runWeatherTest}
                disabled={isLoading}
                className="btn-primary text-sm py-2 px-4 disabled:opacity-50"
              >
                {isLoading ? 'Testing...' : 'Test Weather API'}
              </button>
            </div>

            {/* AI Status */}
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center space-x-3 mb-3">
                <Brain className="h-5 w-5 text-purple-500" />
                <h3 className="font-semibold">AI System Status</h3>
                {getStatusIcon(aiStatus)}
              </div>
              <p className="text-sm text-gray-600 mb-3">
                {getStatusText('ai', aiStatus)}
              </p>
              <div className="flex space-x-2">
                <button
                  onClick={runAITest}
                  disabled={isLoading}
                  className="btn-primary text-sm py-2 px-4 disabled:opacity-50"
                >
                  {isLoading ? 'Testing...' : 'Test AI System'}
                </button>
                <button
                  onClick={clearAIModels}
                  className="bg-red-500 hover:bg-red-600 text-white text-sm py-2 px-4 rounded-lg transition-colors"
                >
                  Clear Models
                </button>
              </div>
            </div>
          </div>

          {/* Test Results */}
          {testResults.length > 0 && (
            <div className="bg-gray-900 text-green-400 rounded-lg p-4 font-mono text-sm">
              <div className="flex items-center space-x-2 mb-3">
                <Database className="h-4 w-4" />
                <span className="font-semibold">Test Results</span>
              </div>
              <div className="space-y-1 max-h-64 overflow-y-auto">
                {testResults.map((result, index) => (
                  <div key={index} className={result === '' ? 'h-2' : ''}>
                    {result}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Quick Setup Guide */}
          <div className="mt-6 bg-blue-50 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-3">
              <Zap className="h-5 w-5 text-blue-500" />
              <h3 className="font-semibold text-blue-900">Quick Setup Guide</h3>
            </div>
            <div className="text-sm text-blue-800 space-y-2">
              <div>
                <strong>Weather API:</strong>
                <ol className="list-decimal list-inside ml-4 mt-1 space-y-1">
                  <li>Get free API key from <a href="https://openweathermap.org/api" target="_blank" rel="noopener noreferrer" className="underline">OpenWeatherMap</a></li>
                  <li>Add <code className="bg-blue-100 px-1 rounded">VITE_OPENWEATHER_API_KEY=your_key</code> to .env file</li>
                  <li>Restart dev server</li>
                </ol>
              </div>
              <div>
                <strong>AI System:</strong>
                <ol className="list-decimal list-inside ml-4 mt-1 space-y-1">
                  <li>AI models train automatically on first use</li>
                  <li>Models are saved to browser storage</li>
                  <li>Clear models to retrain with new data</li>
                </ol>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DebugPanel;