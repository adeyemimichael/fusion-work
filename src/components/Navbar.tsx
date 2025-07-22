import React, { useState } from 'react';
import { Leaf, Menu, X, User, Home, FileText, BarChart3 } from 'lucide-react';

interface NavbarProps {
  currentView: 'landing' | 'form' | 'dashboard';
  onNavigate: (view: 'landing' | 'form' | 'dashboard') => void;
  userName: string;
  hasGardenPlan: boolean;
}

const Navbar: React.FC<NavbarProps> = ({ currentView, onNavigate, userName, hasGardenPlan }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'landing', label: 'Home', icon: Home, enabled: true },
    { id: 'form', label: 'Plan Garden', icon: FileText, enabled: true },
    { id: 'dashboard', label: 'Dashboard', icon: BarChart3, enabled: hasGardenPlan },
  ];

  const handleNavClick = (view: 'landing' | 'form' | 'dashboard') => {
    onNavigate(view);
    setIsMobileMenuOpen(false);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => handleNavClick('landing')}>
            <div className="relative">
              <Leaf className="h-8 w-8 text-emerald-600 animate-bounce-gentle" />
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-amber-400 rounded-full animate-pulse"></div>
            </div>
            <div className="hidden sm:block">
              <h1 className="text-xl font-bold gradient-text">
                Smart Garden Planner
              </h1>
              <p className="text-xs text-gray-500">AI-Powered Gardening</p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentView === item.id;
              const isEnabled = item.enabled;
              
              return (
                <button
                  key={item.id}
                  onClick={() => isEnabled && handleNavClick(item.id as any)}
                  disabled={!isEnabled}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? 'bg-emerald-100 text-emerald-700 shadow-sm'
                      : isEnabled
                      ? 'text-gray-600 hover:text-emerald-600 hover:bg-emerald-50'
                      : 'text-gray-400 cursor-not-allowed'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>

          {/* User Info & Mobile Menu Button */}
          <div className="flex items-center space-x-4">
            {userName && (
              <div className="hidden sm:flex items-center space-x-2 px-3 py-2 bg-emerald-50 rounded-lg">
                <User className="h-4 w-4 text-emerald-600" />
                <span className="text-sm font-medium text-emerald-700">
                  {userName}
                </span>
              </div>
            )}
            
            {/* Mobile menu button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 rounded-lg text-gray-600 hover:text-emerald-600 hover:bg-emerald-50 transition-colors"
            >
              {isMobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-gray-200 bg-white/95 backdrop-blur-md animate-fade-in">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = currentView === item.id;
                const isEnabled = item.enabled;
                
                return (
                  <button
                    key={item.id}
                    onClick={() => isEnabled && handleNavClick(item.id as any)}
                    disabled={!isEnabled}
                    className={`w-full flex items-center space-x-3 px-3 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                      isActive
                        ? 'bg-emerald-100 text-emerald-700 shadow-sm'
                        : isEnabled
                        ? 'text-gray-600 hover:text-emerald-600 hover:bg-emerald-50'
                        : 'text-gray-400 cursor-not-allowed'
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                    <span>{item.label}</span>
                  </button>
                );
              })}
              
              {userName && (
                <div className="flex items-center space-x-3 px-3 py-3 bg-emerald-50 rounded-lg mt-4">
                  <User className="h-5 w-5 text-emerald-600" />
                  <span className="text-sm font-medium text-emerald-700">
                    Welcome, {userName}!
                  </span>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;