import React, { useState } from 'react';
import { Grid, Maximize2, Info } from 'lucide-react';

interface LayoutItem {
  crop: string;
  position: { x: number; y: number };
  size: { width: number; height: number };
}

interface GardenLayoutProps {
  layout: LayoutItem[];
}

const GardenLayout: React.FC<GardenLayoutProps> = ({ layout }) => {
  const [selectedCrop, setSelectedCrop] = useState<string | null>(null);
  const [showGrid, setShowGrid] = useState(true);

  // Calculate grid dimensions
  const maxX = Math.max(...layout.map(item => item.position.x + item.size.width));
  const maxY = Math.max(...layout.map(item => item.position.y + item.size.height));
  const gridWidth = Math.max(maxX, 8);
  const gridHeight = Math.max(maxY, 6);

  // Crop colors for visual distinction
  const cropColors = [
    'bg-green-200 border-green-400 text-green-800',
    'bg-blue-200 border-blue-400 text-blue-800',
    'bg-yellow-200 border-yellow-400 text-yellow-800',
    'bg-purple-200 border-purple-400 text-purple-800',
    'bg-pink-200 border-pink-400 text-pink-800',
    'bg-indigo-200 border-indigo-400 text-indigo-800',
  ];

  const getCropColor = (_cropName: string, index: number) => {
    return cropColors[index % cropColors.length];
  };

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-primary-100 rounded-lg">
            <Grid className="h-6 w-6 text-primary-600" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-900">Garden Layout Plan</h3>
            <p className="text-gray-600">Optimized spatial arrangement for your crops</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setShowGrid(!showGrid)}
            className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
              showGrid 
                ? 'bg-primary-100 text-primary-700' 
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            <Grid className="h-4 w-4 inline mr-1" />
            Grid
          </button>
        </div>
      </div>

      {/* Layout Visualization */}
      <div className="bg-green-50 rounded-xl p-6 mb-6">
        <div className="relative mx-auto" style={{ maxWidth: '600px' }}>
          <div 
            className="relative bg-amber-50 border-2 border-amber-200 rounded-lg overflow-hidden"
            style={{ 
              aspectRatio: `${gridWidth}/${gridHeight}`,
              minHeight: '300px'
            }}
          >
            {/* Grid lines */}
            {showGrid && (
              <div className="absolute inset-0">
                {/* Vertical lines */}
                {Array.from({ length: gridWidth + 1 }, (_, i) => (
                  <div
                    key={`v-${i}`}
                    className="absolute top-0 bottom-0 border-l border-amber-300 opacity-30"
                    style={{ left: `${(i / gridWidth) * 100}%` }}
                  />
                ))}
                {/* Horizontal lines */}
                {Array.from({ length: gridHeight + 1 }, (_, i) => (
                  <div
                    key={`h-${i}`}
                    className="absolute left-0 right-0 border-t border-amber-300 opacity-30"
                    style={{ top: `${(i / gridHeight) * 100}%` }}
                  />
                ))}
              </div>
            )}

            {/* Crop plots */}
            {layout.map((item, index) => (
              <div
                key={item.crop}
                className={`absolute border-2 rounded-lg cursor-pointer transition-all duration-200 hover:scale-105 hover:shadow-lg ${
                  getCropColor(item.crop, index)
                } ${selectedCrop === item.crop ? 'ring-2 ring-primary-500 ring-offset-2' : ''}`}
                style={{
                  left: `${(item.position.x / gridWidth) * 100}%`,
                  top: `${(item.position.y / gridHeight) * 100}%`,
                  width: `${(item.size.width / gridWidth) * 100}%`,
                  height: `${(item.size.height / gridHeight) * 100}%`,
                  minHeight: '60px'
                }}
                onClick={() => setSelectedCrop(selectedCrop === item.crop ? null : item.crop)}
              >
                <div className="flex items-center justify-center h-full p-2">
                  <div className="text-center">
                    <div className="text-xs font-bold mb-1">
                      {item.crop}
                    </div>
                    <div className="text-xs opacity-75">
                      {item.size.width}×{item.size.height} sq ft
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Legend */}
          <div className="mt-4 flex flex-wrap gap-2 justify-center">
            {layout.map((item, index) => (
              <div
                key={item.crop}
                className={`flex items-center space-x-2 px-3 py-1 rounded-full text-xs cursor-pointer transition-all ${
                  getCropColor(item.crop, index)
                } ${selectedCrop === item.crop ? 'ring-2 ring-primary-400' : ''}`}
                onClick={() => setSelectedCrop(selectedCrop === item.crop ? null : item.crop)}
              >
                <div className="w-2 h-2 rounded-full bg-current opacity-60"></div>
                <span className="font-medium">{item.crop}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Layout Tips */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="p-4 bg-blue-50 rounded-lg">
          <div className="flex items-center space-x-2 mb-2">
            <Info className="h-4 w-4 text-blue-600" />
            <h4 className="font-semibold text-blue-900">Layout Tips</h4>
          </div>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• Taller plants are positioned to avoid shading shorter ones</li>
            <li>• Companion plants are grouped together for mutual benefits</li>
            <li>• High-water crops are clustered for efficient irrigation</li>
            <li>• Pathways are planned for easy access and maintenance</li>
          </ul>
        </div>

        <div className="p-4 bg-green-50 rounded-lg">
          <div className="flex items-center space-x-2 mb-2">
            <Maximize2 className="h-4 w-4 text-green-600" />
            <h4 className="font-semibold text-green-900">Space Optimization</h4>
          </div>
          <div className="text-sm text-green-800 space-y-1">
            <div>• Total plots: {layout.length} crops</div>
            <div>• Grid size: {gridWidth}×{gridHeight} sq ft</div>
            <div>• Space utilization: Maximized for summer growing</div>
            <div>• Companion planting: Integrated for plant health</div>
          </div>
        </div>
      </div>

      {/* Selected crop details */}
      {selectedCrop && (
        <div className="mt-6 p-4 bg-white border border-primary-200 rounded-lg">
          <h4 className="font-semibold text-gray-900 mb-2">
            Selected: {selectedCrop}
          </h4>
          <p className="text-sm text-gray-600">
            Click on different crop plots to see their placement details. This layout is optimized 
            for sunlight exposure, water efficiency, and companion planting benefits.
          </p>
        </div>
      )}
    </div>
  );
};

export default GardenLayout;