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
        },
        timeout: 10000 // 10 second timeout
      });

      const data = response.data;

      // Validate response data
      if (!data.main || !data.wind) {
        throw new Error('Invalid weather data received');
      }

      return {
        temperature: Math.round(data.main.temp * 10) / 10, // Round to 1 decimal
        humidity: data.main.humidity,
        precipitation: (data.rain?.['1h'] || 0) + (data.snow?.['1h'] || 0), // Include snow
        windSpeed: Math.round(data.wind.speed * 10) / 10, // Round to 1 decimal
        uvIndex: await this.getUVIndex(data.coord.lat, data.coord.lon), // Get real UV data
        location: `${data.name}, ${data.sys.country}` // Include country
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

  private static async getUVIndex(lat: number, lon: number): Promise<number> {
    try {
      // OpenWeatherMap UV Index API
      const response = await axios.get(`${WEATHER_BASE_URL}/uvi`, {
        params: {
          lat: lat,
          lon: lon,
          appid: WEATHER_API_KEY
        },
        timeout: 5000
      });

      return Math.round(response.data.value * 10) / 10; // Round to 1 decimal
    } catch (error) {
      console.warn('UV Index API error, using estimated value:', error);
      // Return estimated UV index based on season and latitude
      const season = new Date().getMonth(); // 0-11
      const isSummer = season >= 5 && season <= 8; // June-September
      const latitudeFactor = Math.max(0, (90 - Math.abs(lat)) / 90); // Higher UV closer to equator

      return Math.round((isSummer ? 8 : 5) * latitudeFactor * 10) / 10;
    }
  }

  static async getForecast(location: string, days: number = 7) {
    try {
      // Use real forecast API if API key is available
      if (WEATHER_API_KEY !== 'demo_key') {
        const response = await axios.get(`${WEATHER_BASE_URL}/forecast`, {
          params: {
            q: location,
            appid: WEATHER_API_KEY,
            units: 'metric',
            cnt: Math.min(days * 8, 40) // API returns 3-hour intervals, max 40 entries (5 days)
          },
          timeout: 10000
        });

        const forecastData = response.data.list;
        const dailyForecasts = [];

        // Group by day and get daily averages
        for (let i = 0; i < Math.min(days, 5); i++) {
          const dayData = forecastData.slice(i * 8, (i + 1) * 8); // 8 entries per day (3-hour intervals)
          if (dayData.length === 0) break;

          const avgTemp = dayData.reduce((sum: number, entry: any) => sum + entry.main.temp, 0) / dayData.length;
          const avgHumidity = dayData.reduce((sum: number, entry: any) => sum + entry.main.humidity, 0) / dayData.length;
          const totalPrecipitation = dayData.reduce((sum: number, entry: any) => sum + (entry.rain?.['3h'] || 0) + (entry.snow?.['3h'] || 0), 0);

          // Get most common weather condition
          const conditions = dayData.map((entry: any) => entry.weather[0].main.toLowerCase());
          const mostCommonCondition = conditions.sort((a: string, b: string) =>
            conditions.filter((v: string) => v === a).length - conditions.filter((v: string) => v === b).length
          ).pop();

          dailyForecasts.push({
            date: new Date(Date.now() + i * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            temperature: Math.round(avgTemp * 10) / 10,
            humidity: Math.round(avgHumidity),
            precipitation: Math.round(totalPrecipitation * 10) / 10,
            condition: this.mapWeatherCondition(mostCommonCondition || 'clear')
          });
        }

        return dailyForecasts;
      }
    } catch (error) {
      console.warn('Forecast API error, using mock data:', error);
    }

    // Fallback to mock data
    const forecast = [];
    const baseWeather = await this.getWeatherData(location);

    for (let i = 0; i < days; i++) {
      forecast.push({
        date: new Date(Date.now() + i * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        temperature: Math.round((baseWeather.temperature + Math.random() * 6 - 3) * 10) / 10,
        humidity: Math.round(baseWeather.humidity + Math.random() * 10 - 5),
        precipitation: Math.round(Math.random() * 3 * 10) / 10,
        condition: ['sunny', 'partly-cloudy', 'cloudy', 'rainy'][Math.floor(Math.random() * 4)]
      });
    }

    return forecast;
  }

  private static mapWeatherCondition(apiCondition: string): string {
    const conditionMap: { [key: string]: string } = {
      'clear': 'sunny',
      'clouds': 'cloudy',
      'rain': 'rainy',
      'drizzle': 'rainy',
      'thunderstorm': 'rainy',
      'snow': 'cloudy',
      'mist': 'partly-cloudy',
      'fog': 'partly-cloudy',
      'haze': 'partly-cloudy'
    };

    return conditionMap[apiCondition.toLowerCase()] || 'partly-cloudy';
  }
}