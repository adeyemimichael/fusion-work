export interface UserInput {
  location: string;
  gardenSpace: number;
  sunlightHours: number;
  cropPreferences: string[];
  soilType: string;
  experienceLevel: string;
}

export interface WeatherData {
  temperature: number;
  humidity: number;
  precipitation: number;
  windSpeed: number;
  uvIndex: number;
  location: string;
}

export interface CropRecommendation {
  name: string;
  variety: string;
  plantingDate: string;
  harvestDate: string;
  waterNeeds: number; // liters per week
  spaceRequired: number; // sq ft
  difficulty: 'Easy' | 'Medium' | 'Hard';
  expectedYield: number; // kg
  carbonSavings: number; // kg CO2
  nutritionalValue: {
    calories: number;
    vitamins: string[];
    minerals: string[];
  };
  careInstructions: string[];
  companionPlants: string[];
}

export interface GardenMetrics {
  totalWaterUsage: number;
  carbonFootprintReduction: number;
  expectedYield: number;
  spaceEfficiency: number;
  sustainabilityScore: number;
  costSavings: number;
}

export interface GardenPlan {
  recommendations: CropRecommendation[];
  metrics: GardenMetrics;
  timeline: {
    month: string;
    activities: string[];
  }[];
  layout: {
    crop: string;
    position: { x: number; y: number };
    size: { width: number; height: number };
  }[];
}