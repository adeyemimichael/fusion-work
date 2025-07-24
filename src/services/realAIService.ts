import * as tf from '@tensorflow/tfjs';
import type { UserInput, WeatherData, CropRecommendation, GardenPlan, GardenMetrics } from '../types';

interface TrainingData {
  inputs: number[][];
  outputs: number[][];
}

interface CropPrediction {
  cropIndex: number;
  suitabilityScore: number;
  expectedYield: number;
  waterNeeds: number;
  carbonSavings: number;
}

export class RealAIService {
  private static cropRecommendationModel: tf.LayersModel | null = null;
  private static yieldPredictionModel: tf.LayersModel | null = null;
  private static isInitialized = false;
  
  // Enhanced crop database with more detailed features for AI training
  private static cropDatabase = [
    {
      id: 0, name: 'Tomatoes', variety: 'Cherry Tomatoes',
      features: [18, 35, 6, 4, 15, 2, 65, 3.5, 2.1], // [minTemp, maxTemp, sunlight, space, water, difficulty, days, yield, carbon]
      season: 'summer', difficulty: 'Medium' as const,
      nutritionalValue: { calories: 18, vitamins: ['Vitamin C', 'Vitamin K', 'Folate'], minerals: ['Potassium', 'Manganese'] },
      careInstructions: ['Water deeply 2-3 times per week', 'Provide support stakes', 'Prune suckers regularly'],
      companionPlants: ['Basil', 'Peppers', 'Marigolds']
    },
    {
      id: 1, name: 'Basil', variety: 'Sweet Basil',
      features: [20, 32, 6, 1, 8, 1, 45, 0.5, 0.3],
      season: 'summer', difficulty: 'Easy' as const,
      nutritionalValue: { calories: 22, vitamins: ['Vitamin K', 'Vitamin A'], minerals: ['Manganese', 'Iron'] },
      careInstructions: ['Pinch flowers to encourage growth', 'Water when soil feels dry', 'Harvest regularly'],
      companionPlants: ['Tomatoes', 'Peppers', 'Oregano']
    },
    {
      id: 2, name: 'Peppers', variety: 'Bell Peppers',
      features: [21, 35, 6, 2, 12, 2, 70, 2.0, 1.5],
      season: 'summer', difficulty: 'Medium' as const,
      nutritionalValue: { calories: 31, vitamins: ['Vitamin C', 'Vitamin A', 'Vitamin B6'], minerals: ['Potassium', 'Folate'] },
      careInstructions: ['Maintain consistent soil moisture', 'Support plants with stakes', 'Harvest when full size'],
      companionPlants: ['Tomatoes', 'Basil', 'Onions']
    },
    {
      id: 3, name: 'Lettuce', variety: 'Butterhead Lettuce',
      features: [15, 25, 4, 1, 10, 1, 35, 1.2, 0.8],
      season: 'summer', difficulty: 'Easy' as const,
      nutritionalValue: { calories: 15, vitamins: ['Vitamin K', 'Vitamin A', 'Folate'], minerals: ['Iron', 'Potassium'] },
      careInstructions: ['Keep soil consistently moist', 'Provide afternoon shade', 'Harvest outer leaves first'],
      companionPlants: ['Carrots', 'Radishes', 'Chives']
    },
    {
      id: 4, name: 'Zucchini', variety: 'Summer Squash',
      features: [18, 32, 6, 9, 20, 1, 50, 8.0, 4.2],
      season: 'summer', difficulty: 'Easy' as const,
      nutritionalValue: { calories: 17, vitamins: ['Vitamin C', 'Vitamin A'], minerals: ['Potassium', 'Manganese'] },
      careInstructions: ['Water at base to avoid diseases', 'Harvest when 6-8 inches', 'Check daily during peak'],
      companionPlants: ['Nasturtiums', 'Radishes', 'Beans']
    },
    {
      id: 5, name: 'Herbs', variety: 'Mediterranean Mix',
      features: [18, 35, 6, 2, 6, 1, 30, 0.8, 0.5],
      season: 'summer', difficulty: 'Easy' as const,
      nutritionalValue: { calories: 25, vitamins: ['Vitamin K', 'Vitamin C'], minerals: ['Iron', 'Calcium'] },
      careInstructions: ['Allow soil to dry between waterings', 'Harvest frequently', 'Pinch flowers'],
      companionPlants: ['Tomatoes', 'Peppers', 'Vegetables']
    }
  ];

  /**
   * Initialize the AI models
   */
  static async initialize(): Promise<void> {
    if (this.isInitialized) return;

    try {
      console.log('🤖 Initializing Real AI Models...');
      
      // Try to load pre-trained models first
      await this.loadPreTrainedModels();
      
      // If no pre-trained models, create and train new ones
      if (!this.cropRecommendationModel || !this.yieldPredictionModel) {
        console.log('📚 Training new AI models...');
        await this.createAndTrainModels();
      }
      
      this.isInitialized = true;
      console.log('✅ Real AI Models initialized successfully!');
      
    } catch (error) {
      console.error('❌ Failed to initialize AI models:', error);
      console.log('🔄 Falling back to rule-based system...');
      this.isInitialized = true; // Continue with rule-based fallback
    }
  }

  /**
   * Load pre-trained models from storage
   */
  private static async loadPreTrainedModels(): Promise<void> {
    try {
      // Try to load from localStorage or IndexedDB
      const modelExists = localStorage.getItem('gardenAI_model_version');
      if (modelExists) {
        this.cropRecommendationModel = await tf.loadLayersModel('localstorage://crop-recommendation-model');
        this.yieldPredictionModel = await tf.loadLayersModel('localstorage://yield-prediction-model');
        console.log('✅ Loaded pre-trained models from storage');
      }
    } catch (error) {
      console.log('ℹ️ No pre-trained models found, will create new ones');
    }
  }

  /**
   * Create and train new AI models
   */
  private static async createAndTrainModels(): Promise<void> {
    // Generate synthetic training data
    const trainingData = this.generateTrainingData();
    
    // Create crop recommendation model
    this.cropRecommendationModel = this.createCropRecommendationModel();
    
    // Create yield prediction model
    this.yieldPredictionModel = this.createYieldPredictionModel();
    
    // Train the models
    await this.trainCropRecommendationModel(trainingData);
    await this.trainYieldPredictionModel(trainingData);
    
    // Save trained models
    await this.saveModels();
  }

  /**
   * Create crop recommendation neural network
   */
  private static createCropRecommendationModel(): tf.LayersModel {
    const model = tf.sequential({
      layers: [
        // Input layer: [temperature, humidity, precipitation, windSpeed, uvIndex, sunlightHours, gardenSpace, experienceLevel]
        tf.layers.dense({ inputShape: [8], units: 64, activation: 'relu' }),
        tf.layers.dropout({ rate: 0.2 }),
        
        // Hidden layers
        tf.layers.dense({ units: 32, activation: 'relu' }),
        tf.layers.dropout({ rate: 0.2 }),
        tf.layers.dense({ units: 16, activation: 'relu' }),
        
        // Output layer: suitability scores for each crop
        tf.layers.dense({ units: this.cropDatabase.length, activation: 'softmax' })
      ]
    });

    model.compile({
      optimizer: tf.train.adam(0.001),
      loss: 'categoricalCrossentropy',
      metrics: ['accuracy']
    });

    return model;
  }

  /**
   * Create yield prediction neural network
   */
  private static createYieldPredictionModel(): tf.LayersModel {
    const model = tf.sequential({
      layers: [
        // Input layer: [cropFeatures(9) + weatherFeatures(5) + userFeatures(3)]
        tf.layers.dense({ inputShape: [17], units: 32, activation: 'relu' }),
        tf.layers.dropout({ rate: 0.1 }),
        
        tf.layers.dense({ units: 16, activation: 'relu' }),
        tf.layers.dense({ units: 8, activation: 'relu' }),
        
        // Output layer: [expectedYield, waterNeeds, carbonSavings]
        tf.layers.dense({ units: 3, activation: 'linear' })
      ]
    });

    model.compile({
      optimizer: tf.train.adam(0.001),
      loss: 'meanSquaredError',
      metrics: ['mae']
    });

    return model;
  }

  /**
   * Generate synthetic training data for the models
   */
  private static generateTrainingData(): TrainingData {
    const inputs: number[][] = [];
    const outputs: number[][] = [];
    const yieldInputs: number[][] = [];
    const yieldOutputs: number[][] = [];

    // Generate 1000 synthetic training examples
    for (let i = 0; i < 1000; i++) {
      // Random weather conditions
      const temperature = 15 + Math.random() * 25; // 15-40°C
      const humidity = 40 + Math.random() * 40; // 40-80%
      const precipitation = Math.random() * 5; // 0-5mm
      const windSpeed = 5 + Math.random() * 15; // 5-20 m/s
      const uvIndex = 3 + Math.random() * 8; // 3-11
      const sunlightHours = 4 + Math.random() * 8; // 4-12 hours
      const gardenSpace = 10 + Math.random() * 90; // 10-100 sq ft
      const experienceLevel = Math.floor(Math.random() * 3); // 0=beginner, 1=intermediate, 2=expert

      const weatherInput = [temperature, humidity, precipitation, windSpeed, uvIndex, sunlightHours, gardenSpace, experienceLevel];

      // Calculate suitability for each crop
      const cropSuitability = this.cropDatabase.map(crop => {
        const features = crop.features;
        let score = 0;

        // Temperature suitability
        if (temperature >= features[0] && temperature <= features[1]) {
          score += 0.3;
        } else {
          score -= Math.abs(temperature - (features[0] + features[1]) / 2) * 0.01;
        }

        // Sunlight suitability
        if (sunlightHours >= features[2]) {
          score += 0.25;
        } else {
          score -= (features[2] - sunlightHours) * 0.05;
        }

        // Space suitability
        if (features[3] <= gardenSpace / 3) {
          score += 0.2;
        }

        // Experience level matching
        const difficultyScore = features[5]; // difficulty level
        if (experienceLevel >= difficultyScore) {
          score += 0.15;
        }

        // Weather condition bonuses
        if (humidity > 60 && features[4] > 10) score += 0.1; // High water needs in humid conditions
        if (uvIndex > 7 && features[2] >= 6) score += 0.1; // Full sun crops in high UV

        return Math.max(0, Math.min(1, score));
      });

      // Normalize to create probability distribution
      const sum = cropSuitability.reduce((a, b) => a + b, 0);
      const normalizedSuitability = sum > 0 ? cropSuitability.map(s => s / sum) : cropSuitability;

      inputs.push(weatherInput);
      outputs.push(normalizedSuitability);

      // Generate yield prediction data for each crop
      this.cropDatabase.forEach((crop, cropIndex) => {
        const cropFeatures = crop.features;
        const yieldInput = [...cropFeatures, ...weatherInput.slice(0, 5), gardenSpace, sunlightHours, experienceLevel];
        
        // Calculate expected outputs based on conditions
        let yieldMultiplier = 1;
        if (temperature >= cropFeatures[0] && temperature <= cropFeatures[1]) yieldMultiplier *= 1.2;
        if (sunlightHours >= cropFeatures[2]) yieldMultiplier *= 1.1;
        if (experienceLevel >= cropFeatures[5]) yieldMultiplier *= 1.15;

        const expectedYield = cropFeatures[7] * yieldMultiplier * (0.8 + Math.random() * 0.4);
        const waterNeeds = cropFeatures[4] * (0.9 + Math.random() * 0.2);
        const carbonSavings = cropFeatures[8] * yieldMultiplier * (0.9 + Math.random() * 0.2);

        yieldInputs.push(yieldInput);
        yieldOutputs.push([expectedYield, waterNeeds, carbonSavings]);
      });
    }

    return { inputs, outputs };
  }

  /**
   * Train the crop recommendation model
   */
  private static async trainCropRecommendationModel(trainingData: TrainingData): Promise<void> {
    if (!this.cropRecommendationModel) return;

    const xs = tf.tensor2d(trainingData.inputs);
    const ys = tf.tensor2d(trainingData.outputs);

    console.log('🎯 Training crop recommendation model...');
    
    await this.cropRecommendationModel.fit(xs, ys, {
      epochs: 50,
      batchSize: 32,
      validationSplit: 0.2,
      callbacks: {
        onEpochEnd: (epoch, logs) => {
          if (epoch % 10 === 0) {
            console.log(`Epoch ${epoch}: loss = ${logs?.loss?.toFixed(4)}, accuracy = ${logs?.acc?.toFixed(4)}`);
          }
        }
      }
    });

    xs.dispose();
    ys.dispose();
    console.log('✅ Crop recommendation model trained!');
  }

  /**
   * Train the yield prediction model
   */
  private static async trainYieldPredictionModel(trainingData: TrainingData): Promise<void> {
    if (!this.yieldPredictionModel) return;

    // Generate yield training data
    const yieldData = this.generateYieldTrainingData();
    const xs = tf.tensor2d(yieldData.inputs);
    const ys = tf.tensor2d(yieldData.outputs);

    console.log('📈 Training yield prediction model...');
    
    await this.yieldPredictionModel.fit(xs, ys, {
      epochs: 30,
      batchSize: 16,
      validationSplit: 0.2,
      callbacks: {
        onEpochEnd: (epoch, logs) => {
          if (epoch % 5 === 0) {
            console.log(`Epoch ${epoch}: loss = ${logs?.loss?.toFixed(4)}, mae = ${logs?.mae?.toFixed(4)}`);
          }
        }
      }
    });

    xs.dispose();
    ys.dispose();
    console.log('✅ Yield prediction model trained!');
  }

  /**
   * Generate training data specifically for yield prediction
   */
  private static generateYieldTrainingData(): { inputs: number[][], outputs: number[][] } {
    const inputs: number[][] = [];
    const outputs: number[][] = [];

    for (let i = 0; i < 500; i++) {
      this.cropDatabase.forEach(crop => {
        const temperature = 15 + Math.random() * 25;
        const humidity = 40 + Math.random() * 40;
        const precipitation = Math.random() * 5;
        const windSpeed = 5 + Math.random() * 15;
        const uvIndex = 3 + Math.random() * 8;
        const gardenSpace = 10 + Math.random() * 90;
        const sunlightHours = 4 + Math.random() * 8;
        const experienceLevel = Math.floor(Math.random() * 3);

        const input = [
          ...crop.features, // 9 crop features
          temperature, humidity, precipitation, windSpeed, uvIndex, // 5 weather features
          gardenSpace, sunlightHours, experienceLevel // 3 user features
        ];

        // Calculate realistic outputs based on conditions
        let multiplier = 1;
        if (temperature >= crop.features[0] && temperature <= crop.features[1]) multiplier *= 1.2;
        if (sunlightHours >= crop.features[2]) multiplier *= 1.1;
        if (experienceLevel >= crop.features[5]) multiplier *= 1.15;

        const output = [
          crop.features[7] * multiplier * (0.8 + Math.random() * 0.4), // yield
          crop.features[4] * (0.9 + Math.random() * 0.2), // water needs
          crop.features[8] * multiplier * (0.9 + Math.random() * 0.2) // carbon savings
        ];

        inputs.push(input);
        outputs.push(output);
      });
    }

    return { inputs, outputs };
  }

  /**
   * Save trained models to browser storage
   */
  private static async saveModels(): Promise<void> {
    try {
      if (this.cropRecommendationModel) {
        await this.cropRecommendationModel.save('localstorage://crop-recommendation-model');
      }
      if (this.yieldPredictionModel) {
        await this.yieldPredictionModel.save('localstorage://yield-prediction-model');
      }
      localStorage.setItem('gardenAI_model_version', '1.0');
      console.log('💾 Models saved to browser storage');
    } catch (error) {
      console.warn('⚠️ Could not save models:', error);
    }
  }

  /**
   * Generate AI-powered garden recommendations
   */
  static async generateRecommendations(userInput: UserInput, weatherData: WeatherData): Promise<GardenPlan> {
    await this.initialize();

    let recommendations: CropRecommendation[];

    if (this.cropRecommendationModel && this.yieldPredictionModel) {
      console.log('🤖 Using AI models for recommendations...');
      recommendations = await this.generateAIRecommendations(userInput, weatherData);
    } else {
      console.log('📋 Using rule-based fallback...');
      recommendations = this.generateRuleBasedRecommendations(userInput, weatherData);
    }

    // Calculate metrics, timeline, and layout
    const metrics = this.calculateMetrics(recommendations, userInput.gardenSpace);
    const timeline = this.generateTimeline(recommendations);
    const layout = this.generateLayout(recommendations, userInput.gardenSpace);

    return { recommendations, metrics, timeline, layout };
  }

  /**
   * Generate recommendations using AI models
   */
  private static async generateAIRecommendations(userInput: UserInput, weatherData: WeatherData): Promise<CropRecommendation[]> {
    if (!this.cropRecommendationModel || !this.yieldPredictionModel) {
      throw new Error('AI models not initialized');
    }

    // Prepare input features
    const experienceMap = { 'beginner': 0, 'intermediate': 1, 'expert': 2 };
    const experienceLevel = experienceMap[userInput.experienceLevel as keyof typeof experienceMap] || 0;

    const inputFeatures = [
      weatherData.temperature,
      weatherData.humidity,
      weatherData.precipitation,
      weatherData.windSpeed,
      weatherData.uvIndex,
      userInput.sunlightHours,
      userInput.gardenSpace,
      experienceLevel
    ];

    // Get crop suitability predictions
    const inputTensor = tf.tensor2d([inputFeatures]);
    const predictions = this.cropRecommendationModel.predict(inputTensor) as tf.Tensor;
    const suitabilityScores = await predictions.data();

    inputTensor.dispose();
    predictions.dispose();

    // Select top crops based on AI predictions and user preferences
    const cropPredictions: CropPrediction[] = Array.from(suitabilityScores).map((score, index) => ({
      cropIndex: index,
      suitabilityScore: score,
      expectedYield: 0,
      waterNeeds: 0,
      carbonSavings: 0
    }));

    // Apply user preferences boost
    cropPredictions.forEach(pred => {
      const crop = this.cropDatabase[pred.cropIndex];
      if (userInput.cropPreferences.some(pref => 
        crop.name.toLowerCase().includes(pref.toLowerCase()) ||
        crop.variety.toLowerCase().includes(pref.toLowerCase())
      )) {
        pred.suitabilityScore *= 1.5; // Boost preferred crops
      }
    });

    // Sort by suitability and select crops that fit in garden space
    cropPredictions.sort((a, b) => b.suitabilityScore - a.suitabilityScore);

    const selectedCrops: CropRecommendation[] = [];
    let usedSpace = 0;

    for (const pred of cropPredictions) {
      const crop = this.cropDatabase[pred.cropIndex];
      const spaceRequired = crop.features[3]; // space requirement from features

      if (usedSpace + spaceRequired <= userInput.gardenSpace && selectedCrops.length < 6) {
        // Use yield prediction model for this specific crop
        const yieldInput = [
          ...crop.features,
          weatherData.temperature,
          weatherData.humidity,
          weatherData.precipitation,
          weatherData.windSpeed,
          weatherData.uvIndex,
          userInput.gardenSpace,
          userInput.sunlightHours,
          experienceLevel
        ];

        const yieldTensor = tf.tensor2d([yieldInput]);
        const yieldPrediction = this.yieldPredictionModel.predict(yieldTensor) as tf.Tensor;
        const [expectedYield, waterNeeds, carbonSavings] = await yieldPrediction.data();

        yieldTensor.dispose();
        yieldPrediction.dispose();

        // Calculate planting and harvest dates
        const plantingDate = new Date();
        plantingDate.setDate(plantingDate.getDate() + 7);
        const harvestDate = new Date(plantingDate);
        harvestDate.setDate(harvestDate.getDate() + crop.features[6]); // days to harvest

        selectedCrops.push({
          name: crop.name,
          variety: crop.variety,
          plantingDate: plantingDate.toISOString().split('T')[0],
          harvestDate: harvestDate.toISOString().split('T')[0],
          waterNeeds: Math.max(1, waterNeeds),
          spaceRequired: spaceRequired,
          difficulty: crop.difficulty,
          expectedYield: Math.max(0.1, expectedYield),
          carbonSavings: Math.max(0.1, carbonSavings),
          nutritionalValue: crop.nutritionalValue,
          careInstructions: crop.careInstructions,
          companionPlants: crop.companionPlants
        });

        usedSpace += spaceRequired;
      }
    }

    return selectedCrops;
  }

  /**
   * Fallback rule-based recommendations (same as original MLService)
   */
  private static generateRuleBasedRecommendations(userInput: UserInput, weatherData: WeatherData): CropRecommendation[] {
    // Implementation similar to original MLService but using the enhanced crop database
    const scoredCrops = this.cropDatabase.map(crop => {
      let score = 0;
      const features = crop.features;

      // Temperature compatibility
      if (weatherData.temperature >= features[0] && weatherData.temperature <= features[1]) {
        score += 30;
      } else {
        score -= Math.abs(weatherData.temperature - (features[0] + features[1]) / 2) * 2;
      }

      // Sunlight requirements
      if (userInput.sunlightHours >= features[2]) {
        score += 25;
      } else {
        score -= (features[2] - userInput.sunlightHours) * 5;
      }

      // Space efficiency
      if (features[3] <= userInput.gardenSpace / 3) {
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
      const experienceMap = { 'beginner': 0, 'intermediate': 1, 'expert': 2 };
      const userExp = experienceMap[userInput.experienceLevel as keyof typeof experienceMap] || 0;
      if (userExp >= features[5]) {
        score += 15;
      } else {
        score -= (features[5] - userExp) * 5;
      }

      return { ...crop, score: Math.max(0, score) };
    });

    // Select top crops that fit in available space
    const selectedCrops: CropRecommendation[] = [];
    let usedSpace = 0;
    
    scoredCrops
      .sort((a, b) => b.score - a.score)
      .forEach(crop => {
        if (usedSpace + crop.features[3] <= userInput.gardenSpace && selectedCrops.length < 6) {
          const plantingDate = new Date();
          plantingDate.setDate(plantingDate.getDate() + 7);
          
          const harvestDate = new Date(plantingDate);
          harvestDate.setDate(harvestDate.getDate() + crop.features[6]);

          selectedCrops.push({
            name: crop.name,
            variety: crop.variety,
            plantingDate: plantingDate.toISOString().split('T')[0],
            harvestDate: harvestDate.toISOString().split('T')[0],
            waterNeeds: crop.features[4],
            spaceRequired: crop.features[3],
            difficulty: crop.difficulty,
            expectedYield: crop.features[7],
            carbonSavings: crop.features[8],
            nutritionalValue: crop.nutritionalValue,
            careInstructions: crop.careInstructions,
            companionPlants: crop.companionPlants
          });
          
          usedSpace += crop.features[3];
        }
      });

    return selectedCrops;
  }

  // Helper methods (same as original MLService)
  private static calculateMetrics(crops: CropRecommendation[], totalSpace: number): GardenMetrics {
    const totalWaterUsage = crops.reduce((sum, crop) => sum + crop.waterNeeds, 0);
    const carbonFootprintReduction = crops.reduce((sum, crop) => sum + crop.carbonSavings, 0);
    const expectedYield = crops.reduce((sum, crop) => sum + crop.expectedYield, 0);
    const usedSpace = crops.reduce((sum, crop) => sum + crop.spaceRequired, 0);
    const spaceEfficiency = (usedSpace / totalSpace) * 100;
    
    const sustainabilityScore = Math.min(100, 
      (carbonFootprintReduction * 10) + 
      (spaceEfficiency * 0.5) + 
      (expectedYield * 5)
    );
    
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
      const activities: string[] = [];
      
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

  /**
   * Get model information for debugging
   */
  static getModelInfo(): { isAIEnabled: boolean; modelsSaved: boolean; trainingStatus: string } {
    return {
      isAIEnabled: this.isInitialized && !!this.cropRecommendationModel && !!this.yieldPredictionModel,
      modelsSaved: !!localStorage.getItem('gardenAI_model_version'),
      trainingStatus: this.isInitialized ? 'Ready' : 'Not initialized'
    };
  }

  /**
   * Clear saved models (for testing)
   */
  static clearSavedModels(): void {
    localStorage.removeItem('gardenAI_model_version');
    localStorage.removeItem('tensorflowjs_models/crop-recommendation-model/info');
    localStorage.removeItem('tensorflowjs_models/crop-recommendation-model/model_topology');
    localStorage.removeItem('tensorflowjs_models/yield-prediction-model/info');
    localStorage.removeItem('tensorflowjs_models/yield-prediction-model/model_topology');
    console.log('🗑️ Cleared saved AI models');
  }
}