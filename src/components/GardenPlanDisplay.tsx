import React from 'react';
import type { GardenPlan } from '../types';
import CropRecommendations from './CropRecommendations';
import MetricsDashboard from './MetricsDashboard';
import GardenTimeline from './GardenTimeline';
import GardenLayout from './GardenLayout';
import { Leaf, ArrowLeft } from 'lucide-react';

interface GardenPlanDisplayProps {
  gardenPlan: GardenPlan;
  onBack: () => void;
}

const GardenPlanDisplay: React.FC<GardenPlanDisplayProps> = ({ gardenPlan, onBack }) => {
  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-primary-100 rounded-lg">
              <Leaf className="h-6 w-6 text-primary-600" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Your Personalized Summer Garden Plan</h2>
              <p className="text-gray-600">AI-optimized for your space, climate, and preferences</p>
            </div>
          </div>
          <button
            onClick={onBack}
            className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Form</span>
          </button>
        </div>
        
        <div className="bg-gradient-to-r from-primary-50 to-secondary-50 rounded-lg p-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-primary-600">
                {gardenPlan.recommendations.length}
              </div>
              <div className="text-sm text-gray-600">Recommended Crops</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-secondary-600">
                {gardenPlan.metrics.expectedYield.toFixed(1)}kg
              </div>
              <div className="text-sm text-gray-600">Expected Harvest</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-green-600">
                {gardenPlan.metrics.sustainabilityScore.toFixed(0)}%
              </div>
              <div className="text-sm text-gray-600">Sustainability Score</div>
            </div>
          </div>
        </div>
      </div>

      {/* Metrics Dashboard */}
      <MetricsDashboard metrics={gardenPlan.metrics} />

      {/* Crop Recommendations */}
      <CropRecommendations recommendations={gardenPlan.recommendations} />

      {/* Garden Timeline */}
      <GardenTimeline timeline={gardenPlan.timeline} />

      {/* Garden Layout */}
      <GardenLayout layout={gardenPlan.layout} />
    </div>
  );
};

export default GardenPlanDisplay;