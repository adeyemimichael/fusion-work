import React from 'react';
import { Leaf, Sun, Droplets } from 'lucide-react';

const Header: React.FC = () => {
  return (
    <header className="bg-white shadow-sm border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-3">
            <div className="relative">
              <Leaf className="h-8 w-8 text-emerald-600 animate-bounce-gentle" />
              <Sun className="h-4 w-4 text-amber-500 absolute -top-1 -right-1" />
            </div>
            <div>
              <h1 className="text-xl font-bold gradient-text">
                Smart Urban Garden Planner
              </h1>
              <p className="text-xs text-gray-500">Fusion Hacks 2 - Summer 2025</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="hidden sm:flex items-center space-x-2 text-sm text-gray-600">
              <Droplets className="h-4 w-4 text-blue-500" />
              <span>Sustainable • AI-Powered • Summer-Ready</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;