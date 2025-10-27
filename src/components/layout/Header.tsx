import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="bg-white shadow-sm">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <h1 className="text-2xl font-bold text-blue-600">🏋️ GetFit</h1>
          </div>
          
          <div className="hidden md:flex space-x-8">
            <a href="#" className="text-gray-700 hover:text-blue-600 px-3 py-2">
              Dashboard
            </a>
            <a href="#" className="text-gray-700 hover:text-blue-600 px-3 py-2">
              Workouts
            </a>
            <a href="#" className="text-gray-700 hover:text-blue-600 px-3 py-2">
              Nutrition
            </a>
            <a href="#" className="text-gray-700 hover:text-blue-600 px-3 py-2">
              Progress
            </a>
          </div>
          
          <div className="flex items-center space-x-4">
            <button className="text-gray-700 hover:text-blue-600">
              Profile
            </button>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;



