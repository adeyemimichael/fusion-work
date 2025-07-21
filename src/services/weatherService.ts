import axios from 'axios';
import type { WeatherData } from '../types';

const WEATHER_API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY || 'demo_key';
const WEATHER_BASE_URL = 'https://api.openweathermap.org/data/2.5';

export class WeatherService {
  static async getWeatherData(location: string): Promise<WeatherData> {
    try {
      // For demo purposes, we'll use mock data if no API key is provided
      if (WEATHER_API_KEY === 'demo_key') {
        return this.getMockWeatherData(location);
      }

      const response = await axios.get(`${WEATHER_BASE_URL}/weather`, {
        params: {
          q: location,
          appid: WEATHER_API_KEY,
          units: 'metric'
        }
      });

      const data = response.data;
      
      return {
        temperature: data.main.temp,
        humidity: data.main.humidity,
        precipitation: data.rain?.['1h'] || 0,
        windSpeed: data.wind.speed,
        uvIndex: 5, // Would need UV Index API for real data
        location: data.name
      };
    } catch (error) {
      console.warn('Weather API error, using mock data:', error);
      return this.getMockWeatherData(location);
    }
  }

  private static getMockWeatherData(location: string): WeatherData {
    // Generate realistic summer weather data based on location
    const baseTemp = location.toLowerCase().includes('florida') ? 32 : 
                     location.toLowerCase().includes('california') ? 28 :
                     location.toLowerCase().includes('new york') ? 25 : 27;
    
    return {
      temperature: baseTemp + Math.random() * 5 - 2.5,
      humidity: 60 + Math.random() * 20,
      precipitation: Math.random() * 2,
      windSpeed: 5 + Math.random() * 10,
      uvIndex: 6 + Math.random() * 3,
      location: location
    };
  }

  static async getForecast(location: string, days: number = 7) {
    // For demo purposes, generate mock forecast data
    const forecast = [];
    const baseWeather = await this.getWeatherData(location);
    
    for (let i = 0; i < days; i++) {
      forecast.push({
        date: new Date(Date.now() + i * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        temperature: baseWeather.temperature + Math.random() * 6 - 3,
        humidity: baseWeather.humidity + Math.random() * 10 - 5,
        precipitation: Math.random() * 3,
        condition: ['sunny', 'partly-cloudy', 'cloudy', 'rainy'][Math.floor(Math.random() * 4)]
      });
    }
    
    return forecast;
  }
}