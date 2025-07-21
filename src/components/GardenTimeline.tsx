import React from 'react';
import { Calendar, Sprout, Scissors, Wrench } from 'lucide-react';

interface TimelineItem {
  month: string;
  activities: string[];
}

interface GardenTimelineProps {
  timeline: TimelineItem[];
}

const GardenTimeline: React.FC<GardenTimelineProps> = ({ timeline }) => {
  const getActivityIcon = (activity: string) => {
    if (activity.toLowerCase().includes('plant')) {
      return <Sprout className="h-4 w-4 text-green-600" />;
    } else if (activity.toLowerCase().includes('harvest')) {
      return <Scissors className="h-4 w-4 text-orange-600" />;
    } else {
      return <Wrench className="h-4 w-4 text-blue-600" />;
    }
  };

  const getMonthColor = (index: number) => {
    const colors = [
      'bg-green-100 border-green-200 text-green-800',
      'bg-yellow-100 border-yellow-200 text-yellow-800',
      'bg-orange-100 border-orange-200 text-orange-800',
      'bg-red-100 border-red-200 text-red-800',
      'bg-purple-100 border-purple-200 text-purple-800'
    ];
    return colors[index % colors.length];
  };

  return (
    <div className="card">
      <div className="flex items-center space-x-3 mb-6">
        <div className="p-2 bg-primary-100 rounded-lg">
          <Calendar className="h-6 w-6 text-primary-600" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-gray-900">Summer Garden Timeline</h3>
          <p className="text-gray-600">Month-by-month activity schedule</p>
        </div>
      </div>

      <div className="relative">
        {/* Timeline line */}
        <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary-200 via-secondary-200 to-primary-200"></div>

        <div className="space-y-8">
          {timeline.map((item, index) => (
            <div
              key={item.month}
              className="relative flex items-start space-x-6 animate-slide-up"
              style={{ animationDelay: `${index * 200}ms` }}
            >
              {/* Timeline dot */}
              <div className={`relative z-10 flex items-center justify-center w-16 h-16 rounded-full border-4 ${getMonthColor(index)}`}>
                <span className="text-sm font-bold">
                  {item.month.slice(0, 3)}
                </span>
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
                  <h4 className="text-lg font-semibold text-gray-900 mb-4">
                    {item.month} Activities
                  </h4>
                  
                  <div className="space-y-3">
                    {item.activities.map((activity, activityIndex) => (
                      <div
                        key={activityIndex}
                        className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                      >
                        <div className="flex-shrink-0">
                          {getActivityIcon(activity)}
                        </div>
                        <span className="text-sm text-gray-700 font-medium">
                          {activity}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Progress indicator */}
                  <div className="mt-4 flex items-center justify-between text-xs text-gray-500">
                    <span>Month {index + 1} of {timeline.length}</span>
                    <div className="flex space-x-1">
                      {timeline.map((_, i) => (
                        <div
                          key={i}
                          className={`w-2 h-2 rounded-full ${
                            i <= index ? 'bg-primary-400' : 'bg-gray-200'
                          }`}
                        ></div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Summer season highlight */}
      <div className="mt-8 p-6 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl border border-yellow-200">
        <div className="flex items-center space-x-2 mb-3">
          <div className="text-2xl">☀️</div>
          <h4 className="font-semibold text-gray-900">Summer Growing Season</h4>
        </div>
        <p className="text-sm text-gray-700">
          Your timeline is optimized for summer growing conditions. Peak harvest months are typically 
          July through September, when warm weather crops reach their full potential. Remember to 
          maintain consistent watering during hot spells and provide shade for heat-sensitive varieties.
        </p>
      </div>
    </div>
  );
};

export default GardenTimeline;