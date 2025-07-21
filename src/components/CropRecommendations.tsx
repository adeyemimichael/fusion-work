import React, { useState } from 'react';
import type { CropRecommendation } from '../types';
import { 
  Leaf, 
  Calendar, 
  Droplets, 
  Square, 
  TrendingUp,
  Clock,
  Users,
  ChevronDown,
  ChevronUp,
  Lightbulb
} from 'lucide-react';

interface CropRecommendationsProps {
  recommendations: CropRecommendation[];
}

const CropRecommendations: React.FC<CropRecommendationsProps> = ({ recommendations }) => {
  const [expandedCrop, setExpandedCrop] = useState<string | null>(null);

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return 'bg-green-100 text-green-800 border-green-200';
      case 'Medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Hard': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const toggleExpanded = (cropName: string) => {
    setExpandedCrop(expandedCrop === cropName ? null : cropName);
  };

  return (
    <div className="card">
      <div className="flex items-center space-x-3 mb-6">
        <div className="p-2 bg-primary-100 rounded-lg">
          <Leaf className="h-6 w-6 text-primary-600" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-gray-900">AI-Recommended Summer Crops</h3>
          <p className="text-gray-600">Personalized selections for your garden conditions</p>
        </div>
      </div>

      <div className="grid gap-6">
        {recommendations.map((crop, index) => (
          <div
            key={crop.name}
            className="border border-gray-200 rounded-xl overflow-hidden hover:shadow-lg transition-all duration-300 animate-slide-up"
            style={{ animationDelay: `${index * 150}ms` }}
          >
            {/* Crop Header */}
            <div className="p-6 bg-white">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h4 className="text-xl font-bold text-gray-900">{crop.name}</h4>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getDifficultyColor(crop.difficulty)}`}>
                      {crop.difficulty}
                    </span>
                  </div>
                  <p className="text-gray-600 font-medium">{crop.variety}</p>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-primary-600">
                    {crop.expectedYield}kg
                  </div>
                  <div className="text-sm text-gray-500">expected yield</div>
                </div>
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                <div className="flex items-center space-x-2">
                  <Calendar className="h-4 w-4 text-gray-500" />
                  <div>
                    <div className="text-sm font-medium text-gray-900">Plant</div>
                    <div className="text-xs text-gray-600">
                      {new Date(crop.plantingDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Clock className="h-4 w-4 text-gray-500" />
                  <div>
                    <div className="text-sm font-medium text-gray-900">Harvest</div>
                    <div className="text-xs text-gray-600">
                      {new Date(crop.harvestDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Droplets className="h-4 w-4 text-blue-500" />
                  <div>
                    <div className="text-sm font-medium text-gray-900">{crop.waterNeeds}L</div>
                    <div className="text-xs text-gray-600">per week</div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Square className="h-4 w-4 text-gray-500" />
                  <div>
                    <div className="text-sm font-medium text-gray-900">{crop.spaceRequired} sq ft</div>
                    <div className="text-xs text-gray-600">required</div>
                  </div>
                </div>
              </div>

              {/* Sustainability Impact */}
              <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg mb-4">
                <div className="flex items-center space-x-2">
                  <TrendingUp className="h-4 w-4 text-green-600" />
                  <span className="text-sm font-medium text-green-800">
                    Carbon Savings: {crop.carbonSavings}kg CO₂
                  </span>
                </div>
                <div className="text-xs text-green-600">
                  vs. store-bought
                </div>
              </div>

              {/* Expand/Collapse Button */}
              <button
                onClick={() => toggleExpanded(crop.name)}
                className="w-full flex items-center justify-center space-x-2 py-2 text-primary-600 hover:text-primary-700 transition-colors"
              >
                <span className="text-sm font-medium">
                  {expandedCrop === crop.name ? 'Show Less' : 'Show Care Instructions & Details'}
                </span>
                {expandedCrop === crop.name ? (
                  <ChevronUp className="h-4 w-4" />
                ) : (
                  <ChevronDown className="h-4 w-4" />
                )}
              </button>
            </div>

            {/* Expanded Details */}
            {expandedCrop === crop.name && (
              <div className="px-6 pb-6 bg-gray-50 border-t border-gray-100">
                <div className="grid md:grid-cols-2 gap-6 pt-6">
                  {/* Care Instructions */}
                  <div>
                    <h5 className="flex items-center space-x-2 font-semibold text-gray-900 mb-3">
                      <Lightbulb className="h-4 w-4 text-yellow-500" />
                      <span>Care Instructions</span>
                    </h5>
                    <ul className="space-y-2">
                      {crop.careInstructions.map((instruction, idx) => (
                        <li key={idx} className="flex items-start space-x-2 text-sm text-gray-700">
                          <div className="w-1.5 h-1.5 bg-primary-500 rounded-full mt-2 flex-shrink-0"></div>
                          <span>{instruction}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Nutritional Value & Companions */}
                  <div className="space-y-4">
                    {/* Nutritional Value */}
                    <div>
                      <h5 className="font-semibold text-gray-900 mb-2">Nutritional Benefits</h5>
                      <div className="text-sm text-gray-700 mb-2">
                        <strong>{crop.nutritionalValue.calories} calories</strong> per 100g
                      </div>
                      <div className="flex flex-wrap gap-1 mb-2">
                        {crop.nutritionalValue.vitamins.map((vitamin, idx) => (
                          <span key={idx} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                            {vitamin}
                          </span>
                        ))}
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {crop.nutritionalValue.minerals.map((mineral, idx) => (
                          <span key={idx} className="px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded-full">
                            {mineral}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Companion Plants */}
                    <div>
                      <h5 className="flex items-center space-x-2 font-semibold text-gray-900 mb-2">
                        <Users className="h-4 w-4 text-green-500" />
                        <span>Companion Plants</span>
                      </h5>
                      <div className="flex flex-wrap gap-2">
                        {crop.companionPlants.map((companion, idx) => (
                          <span key={idx} className="px-3 py-1 bg-green-100 text-green-800 text-sm rounded-full">
                            {companion}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Summary */}
      <div className="mt-6 p-4 bg-gradient-to-r from-primary-50 to-secondary-50 rounded-lg">
        <h4 className="font-semibold text-gray-900 mb-2">🌞 Summer Growing Tips</h4>
        <p className="text-sm text-gray-700">
          These crops are optimized for summer conditions in your area. Remember to provide adequate water during hot days 
          and consider companion planting to maximize your garden's health and productivity.
        </p>
      </div>
    </div>
  );
};

export default CropRecommendations;