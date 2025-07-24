import React, { useState } from 'react';
import { MapPin, Square, Sun, Leaf, User, Brain } from 'lucide-react';
import type { UserInput } from '../types';
import AIProcessViewer from './AIProcessViewer';

interface UserInputFormProps {
  onSubmit: (input: UserInput) => void;
  loading: boolean;
  onBack?: () => void;
}

const UserInputForm: React.FC<UserInputFormProps> = ({ onSubmit, loading }) => {
  const [formData, setFormData] = useState<UserInput>({
    location: '',
    gardenSpace: 0,
    sunlightHours: 6,
    cropPreferences: [],
    soilType: 'loamy',
    experienceLevel: 'beginner'
  });

  const [errors, setErrors] = useState<Partial<Record<keyof UserInput, string>>>({});
  const [showAIViewer, setShowAIViewer] = useState(false);

  const cropOptions = [
    'Tomatoes', 'Peppers', 'Lettuce', 'Herbs', 'Zucchini', 'Basil',
    'Carrots', 'Radishes', 'Spinach', 'Kale', 'Cucumbers', 'Beans'
  ];

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof UserInput, string>> = {};

    if (!formData.location.trim()) {
      newErrors.location = 'Location is required';
    }

    if (formData.gardenSpace <= 0) {
      newErrors.gardenSpace = 'Garden space must be greater than 0';
    }

    if (formData.sunlightHours < 0 || formData.sunlightHours > 24) {
      newErrors.sunlightHours = 'Sunlight hours must be between 0 and 24';
    }

    if (formData.cropPreferences.length === 0) {
      newErrors.cropPreferences = 'Please select at least one crop preference';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  const handleCropPreferenceChange = (crop: string) => {
    setFormData(prev => ({
      ...prev,
      cropPreferences: prev.cropPreferences.includes(crop)
        ? prev.cropPreferences.filter(c => c !== crop)
        : [...prev.cropPreferences, crop]
    }));
  };

  return (
    <div className="card animate-fade-in">
      <div className="flex items-center space-x-3 mb-6">
        <div className="p-2 bg-emerald-100 rounded-lg">
          <Leaf className="h-6 w-6 text-emerald-600" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Plan Your Summer Garden</h2>
          <p className="text-gray-600">Tell us about your space and preferences</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Location */}
        <div>
          <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 mb-2">
            <MapPin className="h-4 w-4" />
            <span>Location (City, State or ZIP Code)</span>
          </label>
          <input
            type="text"
            className={`input-field ${errors.location ? 'border-red-500' : ''}`}
            placeholder="e.g., San Francisco, CA or 94102"
            value={formData.location}
            onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
          />
          {errors.location && <p className="text-red-500 text-sm mt-1">{errors.location}</p>}
        </div>

        {/* Garden Space */}
        <div>
          <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 mb-2">
            <Square className="h-4 w-4" />
            <span>Available Garden Space (sq ft)</span>
          </label>
          <input
            type="number"
            min="1"
            max="1000"
            className={`input-field ${errors.gardenSpace ? 'border-red-500' : ''}`}
            placeholder="e.g., 50"
            value={formData.gardenSpace || ''}
            onChange={(e) => setFormData(prev => ({ ...prev, gardenSpace: parseInt(e.target.value) || 0 }))}
          />
          {errors.gardenSpace && <p className="text-red-500 text-sm mt-1">{errors.gardenSpace}</p>}
          <p className="text-xs text-gray-500 mt-1">Include containers, raised beds, or ground space</p>
        </div>

        {/* Sunlight Hours */}
        <div>
          <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 mb-2">
            <Sun className="h-4 w-4" />
            <span>Daily Sunlight Hours: {formData.sunlightHours}h</span>
          </label>
          <input
            type="range"
            min="0"
            max="12"
            step="0.5"
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
            value={formData.sunlightHours}
            onChange={(e) => setFormData(prev => ({ ...prev, sunlightHours: parseFloat(e.target.value) }))}
          />
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>Shade (0-3h)</span>
            <span>Partial Sun (4-6h)</span>
            <span>Full Sun (7-12h)</span>
          </div>
          {errors.sunlightHours && <p className="text-red-500 text-sm mt-1">{errors.sunlightHours}</p>}
        </div>

        {/* Crop Preferences */}
        <div>
          <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 mb-3">
            <Leaf className="h-4 w-4" />
            <span>Crop Preferences (select all that interest you)</span>
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {cropOptions.map(crop => (
              <label key={crop} className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  className="rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
                  checked={formData.cropPreferences.includes(crop)}
                  onChange={() => handleCropPreferenceChange(crop)}
                />
                <span className="text-sm text-gray-700">{crop}</span>
              </label>
            ))}
          </div>
          {errors.cropPreferences && <p className="text-red-500 text-sm mt-1">{errors.cropPreferences}</p>}
        </div>

        {/* Soil Type */}
        <div>
          <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 mb-2">
            <Leaf className="h-4 w-4" />
            <span>Soil Type</span>
          </label>
          <select
            className="input-field"
            value={formData.soilType}
            onChange={(e) => setFormData(prev => ({ ...prev, soilType: e.target.value }))}
          >
            <option value="clay">Clay (heavy, retains water)</option>
            <option value="sandy">Sandy (light, drains quickly)</option>
            <option value="loamy">Loamy (balanced, ideal for most crops)</option>
            <option value="unknown">Not sure</option>
          </select>
        </div>

        {/* Experience Level */}
        <div>
          <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 mb-2">
            <User className="h-4 w-4" />
            <span>Gardening Experience</span>
          </label>
          <select
            className="input-field"
            value={formData.experienceLevel}
            onChange={(e) => setFormData(prev => ({ ...prev, experienceLevel: e.target.value }))}
          >
            <option value="beginner">Beginner (new to gardening)</option>
            <option value="intermediate">Intermediate (some experience)</option>
            <option value="expert">Expert (experienced gardener)</option>
          </select>
        </div>

        <div className="space-y-3">
          <button
            type="submit"
            disabled={loading}
            className={`w-full btn-primary ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {loading ? (
              <div className="flex items-center justify-center space-x-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                <span>Generating Your Garden Plan...</span>
              </div>
            ) : (
              <div className="flex items-center justify-center space-x-2">
                <Sun className="h-5 w-5" />
                <span>Create My Summer Garden Plan</span>
              </div>
            )}
          </button>

          <button
            type="button"
            onClick={() => setShowAIViewer(true)}
            className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
          >
            <div className="flex items-center justify-center space-x-2">
              <Brain className="h-5 w-5" />
              <span>👀 See How AI Processes Your Data</span>
            </div>
          </button>
        </div>
      </form>

      {/* AI Process Viewer */}
      <AIProcessViewer
        userInput={formData}
        weatherData={{
          temperature: 22.5,
          humidity: 65,
          precipitation: 0.2,
          windSpeed: 12.3,
          uvIndex: 7.2,
          location: formData.location || 'Sample Location'
        }}
        isVisible={showAIViewer}
        onClose={() => setShowAIViewer(false)}
      />
    </div>
  );
};

export default UserInputForm;