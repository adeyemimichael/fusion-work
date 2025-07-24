import React from 'react';
import { Leaf, Menu, X, Github } from 'lucide-react';

interface NavbarProps {
  isMenuOpen: boolean;
  setIsMenuOpen: (open: boolean) => void;
}

const Navbar: React.FC<NavbarProps> = ({ isMenuOpen, setIsMenuOpen }) => {
  return (
    <nav className="bg-white/95 backdrop-blur-sm shadow-lg border-b border-emerald-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <div className="relative">
              <Leaf className="h-8 w-8 text-emerald-600 animate-bounce-gentle" />
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-amber-400 rounded-full animate-pulse"></div>
            </div>
            <div>
              <h1 className="text-xl font-bold gradient-text">
                GardenAI
              </h1>
              <p className="text-xs text-gray-500 hidden sm:block">Smart Garden Planning</p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <a href="#features" className="text-gray-700 hover:text-emerald-600 transition-colors font-medium">
              Features
            </a>
            <a href="#how-it-works" className="text-gray-700 hover:text-emerald-600 transition-colors font-medium">
              How It Works
            </a>
            <a href="#about" className="text-gray-700 hover:text-emerald-600 transition-colors font-medium">
              About
            </a>
            <div className="flex items-center space-x-4">
              <a 
                href="https://github.com/yourusername/garden-planner" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-600 hover:text-emerald-600 transition-colors"
              >
                <Github className="h-5 w-5" />
              </a>
              <button className="btn-primary text-sm px-4 py-2">
                Get Started
              </button>
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-700 hover:text-emerald-600 transition-colors"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-gray-200 py-4 animate-fade-in">
            <div className="flex flex-col space-y-4">
              <a href="#features" className="text-gray-700 hover:text-emerald-600 transition-colors font-medium">
                Features
              </a>
              <a href="#how-it-works" className="text-gray-700 hover:text-emerald-600 transition-colors font-medium">
                How It Works
              </a>
              <a href="#about" className="text-gray-700 hover:text-emerald-600 transition-colors font-medium">
                About
              </a>
              <div className="flex items-center space-x-4 pt-4 border-t border-gray-200">
                <a 
                  href="https://github.com/adeyemimichael/fusion-work.git" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center space-x-2 text-gray-600 hover:text-emerald-600 transition-colors"
                >
                  <Github className="h-5 w-5" />
                  <span>GitHub</span>
                </a>
                <button className="btn-primary text-sm px-4 py-2 flex-1">
                  Get Started
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;