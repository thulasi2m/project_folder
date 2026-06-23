import React from 'react';
import { useTheme } from '../context/ThemeContext';

export default function Settings() {
  const { isDarkMode, toggleTheme } = useTheme();

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Settings</h2>
      
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4">
        <div className="flex justify-between items-center">
          <span className="text-slate-200 font-medium">Dark Mode</span>
          <button 
            onClick={toggleTheme}
            className={`w-12 h-6 rounded-full transition-colors relative ${isDarkMode ? 'bg-blue-600' : 'bg-slate-600'}`}
          >
            <div className={`absolute top-1 left-1 w-4 h-4 rounded-full bg-white transition-transform ${isDarkMode ? 'translate-x-6' : 'translate-x-0'}`}></div>
          </button>
        </div>
      </div>
    </div>
  );
}
