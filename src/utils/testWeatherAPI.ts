import { WeatherService } from '../services/weatherService';

export async function testWeatherAPI() {
  console.log('🌤️ Testing Weather API...');
  
  const testLocations = ['New York', 'London', 'Tokyo', 'Sydney'];
  
  for (const location of testLocations) {
    try {
      console.log(`\n📍 Testing location: ${location}`);
      
      const startTime = Date.now();
      const weatherData = await WeatherService.getWeatherData(location);
      const endTime = Date.now();
      
      console.log(`✅ Success (${endTime - startTime}ms):`, {
        location: weatherData.location,
        temperature: `${weatherData.temperature}°C`,
        humidity: `${weatherData.humidity}%`,
        precipitation: `${weatherData.precipitation}mm`,
        windSpeed: `${weatherData.windSpeed} m/s`,
        uvIndex: weatherData.uvIndex
      });
      
      // Test forecast
      const forecast = await WeatherService.getForecast(location, 3);
      console.log(`📅 3-day forecast:`, forecast.map(day => ({
        date: day.date,
        temp: `${day.temperature}°C`,
        condition: day.condition
      })));
      
    } catch (error) {
      console.error(`❌ Error for ${location}:`, error);
    }
  }
}

// Test function to check if API key is working
export function checkAPIKeyStatus(): boolean {
  const apiKey = import.meta.env.VITE_OPENWEATHER_API_KEY;
  
  if (!apiKey || apiKey === 'demo_key' || apiKey === 'your_actual_api_key_here') {
    console.warn('⚠️ Weather API Key not configured. Using mock data.');
    console.log('To use real weather data:');
    console.log('1. Get API key from https://openweathermap.org/api');
    console.log('2. Add VITE_OPENWEATHER_API_KEY=your_key to .env file');
    return false;
  }
  
  console.log('✅ Weather API Key configured');
  return true;
}