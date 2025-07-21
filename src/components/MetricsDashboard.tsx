import React from 'react';
import type { GardenMetrics } from '../types';
import { 
  Droplets, 
  Leaf, 
  TrendingUp, 
  DollarSign, 
  Award,
  BarChart3
} from 'lucide-react';

interface MetricsDashboardProps {
  metrics: GardenMetrics;
}

const MetricsDashboard: React.FC<MetricsDashboardProps> = ({ metrics }) => {
  const metricCards = [
    {
      title: 'Water Usage',
      value: `${metrics.totalWaterUsage}L`,
      subtitle: 'per week',
      icon: Droplets,
      color: 'blue',
      description: 'Optimized irrigation schedule'
    },
    {
      title: 'Carbon Savings',
      value: `${metrics.carbonFootprintReduction.toFixed(1)}kg`,
      subtitle: 'CO₂ reduced',
      icon: Leaf,
      color: 'green',
      description: 'vs. store-bought produce'
    },
    {
      title: 'Expected Yield',
      value: `${metrics.expectedYield.toFixed(1)}kg`,
      subtitle: 'fresh produce',
      icon: TrendingUp,
      color: 'primary',
      description: 'Summer harvest total'
    },
    {
      title: 'Cost Savings',
      value: `$${metrics.costSavings.toFixed(0)}`,
      subtitle: 'estimated',
      icon: DollarSign,
      color: 'secondary',
      description: 'vs. organic store prices'
    },
    {
      title: 'Space Efficiency',
      value: `${metrics.spaceEfficiency.toFixed(0)}%`,
      subtitle: 'utilized',
      icon: BarChart3,
      color: 'purple',
      description: 'Garden space optimization'
    },
    {
      title: 'Sustainability Score',
      value: `${metrics.sustainabilityScore.toFixed(0)}%`,
      subtitle: 'eco-rating',
      icon: Award,
      color: 'emerald',
      description: 'Overall environmental impact'
    }
  ];

  const getColorClasses = (color: string) => {
    const colorMap = {
      blue: 'bg-blue-100 text-blue-600 border-blue-200',
      green: 'bg-green-100 text-green-600 border-green-200',
      primary: 'bg-primary-100 text-primary-600 border-primary-200',
      secondary: 'bg-secondary-100 text-secondary-600 border-secondary-200',
      purple: 'bg-purple-100 text-purple-600 border-purple-200',
      emerald: 'bg-emerald-100 text-emerald-600 border-emerald-200'
    };
    return colorMap[color as keyof typeof colorMap] || colorMap.primary;
  };

  return (
    <div className="card">
      <div className="flex items-center space-x-3 mb-6">
        <div className="p-2 bg-primary-100 rounded-lg">
          <BarChart3 className="h-6 w-6 text-primary-600" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-gray-900">Garden Performance Metrics</h3>
          <p className="text-gray-600">AI-optimized sustainability insights</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {metricCards.map((metric, index) => {
          const Icon = metric.icon;
          return (
            <div
              key={metric.title}
              className="bg-white border rounded-xl p-6 hover:shadow-lg transition-all duration-300 animate-slide-up"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="flex items-start justify-between mb-4">
                <div className={`p-3 rounded-lg border ${getColorClasses(metric.color)}`}>
                  <Icon className="h-6 w-6" />
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-gray-900">
                    {metric.value}
                  </div>
                  <div className="text-sm text-gray-500">
                    {metric.subtitle}
                  </div>
                </div>
              </div>
              
              <div>
                <h4 className="font-semibold text-gray-900 mb-1">
                  {metric.title}
                </h4>
                <p className="text-sm text-gray-600">
                  {metric.description}
                </p>
              </div>

              {/* Progress bar for percentage metrics */}
              {(metric.title.includes('Efficiency') || metric.title.includes('Score')) && (
                <div className="mt-4">
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full transition-all duration-1000 ${
                        metric.color === 'purple' ? 'bg-purple-500' : 
                        metric.color === 'emerald' ? 'bg-emerald-500' : 'bg-primary-500'
                      }`}
                      style={{ 
                        width: `${Math.min(100, parseFloat(metric.value))}%`,
                        animationDelay: `${index * 200}ms`
                      }}
                    ></div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Summary insights */}
      <div className="mt-8 p-6 bg-gradient-to-r from-primary-50 to-secondary-50 rounded-xl">
        <h4 className="font-semibold text-gray-900 mb-3">🌱 Summer Garden Insights</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div className="flex items-start space-x-2">
            <div className="w-2 h-2 bg-primary-500 rounded-full mt-2 flex-shrink-0"></div>
            <p className="text-gray-700">
              Your garden will save approximately <strong>{metrics.carbonFootprintReduction.toFixed(1)}kg of CO₂</strong> compared to buying equivalent produce from stores.
            </p>
          </div>
          <div className="flex items-start space-x-2">
            <div className="w-2 h-2 bg-secondary-500 rounded-full mt-2 flex-shrink-0"></div>
            <p className="text-gray-700">
              With <strong>{metrics.spaceEfficiency.toFixed(0)}% space efficiency</strong>, you're maximizing your garden's potential for summer growing season.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MetricsDashboard;