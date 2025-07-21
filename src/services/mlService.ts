// import * as tf from '@tensorflow/tfjs';
import type { UserInput, WeatherData, CropRecommendation, GardenPlan, GardenMetrics } from '../types';

export class MLService {
  // private static model: tf.LayersModel | null = null;
  private static isInitialized = false;

  // Crop database with summer-focused varieties
  private static cropDatabase = [
    {
      name: 'Tomatoes',
      variety: 'Cherry Tomatoes',
      season: 'summer',
      minTemp: 18,
      maxTemp: 35,
      sunlightHours: 6,
      spaceRequired: 4,
      waterNeeds: 15,
      difficulty: 'Medium' as const,
      expectedYield: 3.5,
      carbonSavings: 2.1,
      daysToHarvest: 65,
      nutritionalValue: {
        calories: 18,
        vitamins: ['Vitamin C', 'Vitamin K', 'Folate'],
        minerals: ['Potassium', 'Manganese']
      },
      careInstructions: [
        'Water deeply 2-3 times per week',
        'Provide support stakes or cages',
        'Prune suckers regularly',
        'Mulch around base to retain moisture'
      ],
      companionPlants: ['Basil', 'Peppers', 'Marigolds']
    },
    {
      name: 'Basil',
      variety: 'Sweet Basil',
      season: 'summer',
      minTemp: 20,
      maxTemp: 32,
      sunlightHours: 6,
      spaceRequired: 1,
      waterNeeds: 8,
      difficulty: 'Easy' as const,
      expectedYield: 0.5,
      carbonSavings: 0.3,
      daysToHarvest: 45,
      nutritionalValue: {
        calories: 22,
        vitamins: ['Vitamin K', 'Vitamin A'],
        minerals: ['Manganese', 'Iron']
      },
      careInstructions: [
        'Pinch flowers to encourage leaf growth',
        'Water when soil feels dry',
        'Harvest regularly for continuous growth'
      ],
      companionPlants: ['Tomatoes', 'Peppers', 'Oregano']
    },
    {
      name: 'Peppers',
      variety: 'Bell Peppers',
      season: 'summer',
      minTemp: 21,
      maxTemp: 35,
      sunlightHours: 6,
      spaceRequired: 2,
      waterNeeds: 12,
      difficulty: 'Medium' as const,
      expectedYield: 2.0,
      carbonSavings: 1.5,
      daysToHarvest: 70,
      nutritionalValue: {
        calories: 31,
        vitamins: ['Vitamin C', 'Vitamin A', 'Vitamin B6'],
        minerals: ['Potassium', 'Folate']
      },
      careInstructions: [
        'Maintain consistent soil moisture',
        'Support plants with stakes',
        'Harvest when peppers reach full size'
      ],
      companionPlants: ['Tomatoes', 'Basil', 'Onions']
    },
    {
      name: 'Lettuce',
      variety: 'Butterhead Lettuce',
      season: 'summer',
      minTemp: 15,
      maxTemp: 25,
      sunlightHours: 4,
      spaceRequired: 1,
      waterNeeds: 10,
      difficulty: 'Easy' as const,
      expectedYield: 1.2,
      carbonSavings: 0.8,
      daysToHarvest: 35,
      nutritionalValue: {
        calories: 15,
        vitamins: ['Vitamin K', 'Vitamin A', 'Folate'],
        minerals: ['Iron', 'Potassium']
      },
      careInstructions: [
        'Keep soil consistently moist',
        'Provide afternoon shade in hot climates',
        'Harvest outer leaves first'
      ],
      companionPlants: ['Carrots', 'Radishes', 'Chives']
    },
    {
      name: 'Zucchini',
      variety: 'Summer Squash',
      season: 'summer',
      minTemp: 18,
      maxTemp: 32,
      sunlightHours: 6,
      spaceRequired: 9,
      waterNeeds: 20,
      difficulty: 'Easy' as const,
      expectedYield: 8.0,
      carbonSavings: 4.2,
      daysToHarvest: 50,
      nutritionalValue: {
        calories: 17,
        vitamins: ['Vitamin C', 'Vitamin A'],
        minerals: ['Potassium', 'Manganese']
      },
      careInstructions: [
        'Water at base to avoid leaf diseases',
        'Harvest when 6-8 inches long',
        'Check daily during peak season'
      ],
      companionPlants: ['Nasturtiums', 'Radishes', 'Beans']
    },
    {
      name: 'Herbs',
      variety: 'Mediterranean Mix',
      season: 'summer',
      minTemp: 18,
      maxTemp: 35,
      sunlightHours: 6,
      spaceRequired: 2,
      waterNeeds: 6,
      difficulty: 'Easy' as const,
      expectedYield: 0.8,
      carbonSavings: 0.5,
      daysToHarvest: 30,
      nutritionalValue: {
        calories: 25,
        vitamins: ['Vitamin K', 'Vitamin C'],
        minerals: ['Iron', 'Calcium']
      },
      careInstructions: [
        'Allow soil to dry between waterings',
        'Harvest frequently to encourage growth',
        'Pinch flowers for better leaf production'
      ],
      companionPlants: ['Tomatoes', 'Peppers', 'Vegetables']
    }
  ];

  static async initialize(): Promise<void> {
    if (this.isInitialized) return;

    try {
      // For demo purposes, we'll create a simple decision-making system
      // In a real implementation, you would load a pre-trained model
      this.isInitialized = true;
      console.log('ML Service initialized successfully');
    } catch (error) {
      console.error('Failed to initialize ML model:', error);
      this.isInitialized = true; // Continue with rule-based system
    }
  }

  static async generateRecommendations(
    userInput: UserInput,
    weatherData: WeatherData
  ): Promise<GardenPlan> {
    await this.initialize();

    // Score crops based on user input and weather conditions
    const scoredCrops = this.cropDatabase.map(crop => {
      let score = 0;

      // Temperature compatibility
      if (weatherData.temperature >= crop.minTemp && weatherData.temperature <= crop.maxTemp) {
        score += 30;
      } else {
        score -= Math.abs(weatherData.temperature - (crop.minTemp + crop.maxTemp) / 2) * 2;
      }

      // Sunlight requirements
      if (userInput.sunlightHours >= crop.sunlightHours) {
        score += 25;
      } else {
        score -= (crop.sunlightHours - userInput.sunlightHours) * 5;
      }

      // Space efficiency
      if (crop.spaceRequired <= userInput.gardenSpace / 3) {
        score += 20;
      }

      // User preferences
      if (userInput.cropPreferences.some(pref => 
        crop.name.toLowerCase().includes(pref.toLowerCase()) ||
        crop.variety.toLowerCase().includes(pref.toLowerCase())
      )) {
        score += 25;
      }

      // Experience level matching
      const difficultyScore = {
        'Easy': userInput.experienceLevel === 'beginner' ? 15 : 10,
        'Medium': userInput.experienceLevel === 'intermediate' ? 15 : 5,
        'Hard': userInput.experienceLevel === 'expert' ? 15 : -10
      };
      score += difficultyScore[crop.difficulty];

      // Summer season bonus
      if (crop.season === 'summer') {
        score += 10;
      }

      return { ...crop, score: Math.max(0, score) };
    });

    // Select top crops that fit in the available space
    const selectedCrops: CropRecommendation[] = [];
    let usedSpace = 0;
    
    scoredCrops
      .sort((a, b) => b.score - a.score)
      .forEach(crop => {
        if (usedSpace + crop.spaceRequired <= userInput.gardenSpace && selectedCrops.length < 6) {
          const plantingDate = new Date();
          plantingDate.setDate(plantingDate.getDate() + 7); // Start planting next week
          
          const harvestDate = new Date(plantingDate);
          harvestDate.setDate(harvestDate.getDate() + crop.daysToHarvest);

          selectedCrops.push({
            name: crop.name,
            variety: crop.variety,
            plantingDate: plantingDate.toISOString().split('T')[0],
            harvestDate: harvestDate.toISOString().split('T')[0],
            waterNeeds: crop.waterNeeds,
            spaceRequired: crop.spaceRequired,
            difficulty: crop.difficulty,
            expectedYield: crop.expectedYield,
            carbonSavings: crop.carbonSavings,
            nutritionalValue: crop.nutritionalValue,
            careInstructions: crop.careInstructions,
            companionPlants: crop.companionPlants
          });
          
          usedSpace += crop.spaceRequired;
        }
      });

    // Calculate garden metrics
    const metrics = this.calculateMetrics(selectedCrops, userInput.gardenSpace);
    
    // Generate timeline
    const timeline = this.generateTimeline(selectedCrops);
    
    // Generate layout
    const layout = this.generateLayout(selectedCrops, userInput.gardenSpace);

    return {
      recommendations: selectedCrops,
      metrics,
      timeline,
      layout
    };
  }

  private static calculateMetrics(crops: CropRecommendation[], totalSpace: number): GardenMetrics {
    const totalWaterUsage = crops.reduce((sum, crop) => sum + crop.waterNeeds, 0);
    const carbonFootprintReduction = crops.reduce((sum, crop) => sum + crop.carbonSavings, 0);
    const expectedYield = crops.reduce((sum, crop) => sum + crop.expectedYield, 0);
    const usedSpace = crops.reduce((sum, crop) => sum + crop.spaceRequired, 0);
    const spaceEfficiency = (usedSpace / totalSpace) * 100;
    
    // Calculate sustainability score (0-100)
    const sustainabilityScore = Math.min(100, 
      (carbonFootprintReduction * 10) + 
      (spaceEfficiency * 0.5) + 
      (expectedYield * 5)
    );
    
    // Estimate cost savings (assuming $3/kg for organic produce)
    const costSavings = expectedYield * 3;

    return {
      totalWaterUsage,
      carbonFootprintReduction,
      expectedYield,
      spaceEfficiency,
      sustainabilityScore,
      costSavings
    };
  }

  private static generateTimeline(crops: CropRecommendation[]): { month: string; activities: string[] }[] {
    const timeline: { month: string; activities: string[] }[] = [];
    const months = ['June', 'July', 'August', 'September', 'October'];
    
    months.forEach((month, index) => {
      const activities = [];
      
      crops.forEach(crop => {
        const plantingMonth = new Date(crop.plantingDate).getMonth();
        const harvestMonth = new Date(crop.harvestDate).getMonth();
        const currentMonth = new Date().getMonth() + index;
        
        if (currentMonth === plantingMonth) {
          activities.push(`Plant ${crop.name}`);
        }
        if (currentMonth === harvestMonth) {
          activities.push(`Harvest ${crop.name}`);
        }
        if (currentMonth > plantingMonth && currentMonth < harvestMonth) {
          activities.push(`Care for ${crop.name}`);
        }
      });
      
      if (activities.length === 0) {
        activities.push('General garden maintenance');
      }
      
      timeline.push({ month, activities });
    });
    
    return timeline;
  }

  private static generateLayout(crops: CropRecommendation[], totalSpace: number): { crop: string; position: { x: number; y: number }; size: { width: number; height: number } }[] {
    const layout: { crop: string; position: { x: number; y: number }; size: { width: number; height: number } }[] = [];
    const gridSize = Math.ceil(Math.sqrt(totalSpace));
    let currentX = 0;
    let currentY = 0;
    
    crops.forEach(crop => {
      const size = Math.ceil(Math.sqrt(crop.spaceRequired));
      
      layout.push({
        crop: crop.name,
        position: { x: currentX, y: currentY },
        size: { width: size, height: size }
      });
      
      currentX += size + 1;
      if (currentX >= gridSize) {
        currentX = 0;
        currentY += size + 1;
      }
    });
    
    return layout;
  }
}