import React, { useState, useEffect } from 'react';
import { useTheme } from '../context/ThemeContext';

export default function Settings() {
  const { isDarkMode, toggleTheme } = useTheme();
  
  const [numGauges, setNumGauges] = useState(1);
  const [selectedGauge, setSelectedGauge] = useState(1);
  const [channelSelections, setChannelSelections] = useState({});
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('numGauges');
    if (saved) {
      setNumGauges(parseInt(saved, 10));
    }
    const savedChannels = localStorage.getItem('gaugeChannels');
    if (savedChannels) {
      setChannelSelections(JSON.parse(savedChannels));
    }
  }, []);

  const handleChannelToggle = (channel) => {
    setChannelSelections(prev => {
      const currentSelections = prev[selectedGauge] || [];
      const isSelected = currentSelections.includes(channel);
      
      let newSelections;
      if (isSelected) {
        newSelections = currentSelections.filter(c => c !== channel);
      } else {
        newSelections = [...currentSelections, channel].sort((a, b) => a - b);
      }
      
      const updated = { ...prev, [selectedGauge]: newSelections };
      localStorage.setItem('gaugeChannels', JSON.stringify(updated));
      return updated;
    });
  };

  const currentChannels = channelSelections[selectedGauge] || [];
  const channels = [1, 2, 3, 4, 5, 6, 7, 8];

  return (
    <div className={`p-4 min-h-screen ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
      <h2 className="text-xl font-bold mb-4">Settings</h2>
      
      <div className={`border rounded-2xl p-4 mb-4 ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-gray-200'}`}>
        <div className="flex justify-between items-center">
          <span className={`font-medium ${isDarkMode ? 'text-slate-200' : 'text-gray-800'}`}>Dark Mode</span>
          <button 
            onClick={toggleTheme}
            className={`w-12 h-6 rounded-full transition-colors relative ${isDarkMode ? 'bg-blue-600' : 'bg-slate-400'}`}
          >
            <div className={`absolute top-1 left-1 w-4 h-4 rounded-full bg-white transition-transform ${isDarkMode ? 'translate-x-6' : 'translate-x-0'}`}></div>
          </button>
        </div>
      </div>

      <div className={`border rounded-2xl p-4 ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-gray-200'}`}>
        <h3 className={`text-lg font-bold mb-4 ${isDarkMode ? 'text-slate-200' : 'text-gray-800'}`}>Airgauge Channels Configuration</h3>
        
        <div className="mb-4">
          <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-slate-400' : 'text-gray-600'}`}>Select Airgauge</label>
          <div className="relative">
            <select 
              value={selectedGauge}
              onChange={(e) => setSelectedGauge(parseInt(e.target.value))}
              className={`w-full p-3 rounded-xl border appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                isDarkMode 
                  ? 'bg-slate-800 border-slate-700 text-white' 
                  : 'bg-gray-50 border-gray-300 text-gray-900'
              }`}
            >
              {Array.from({ length: numGauges }, (_, i) => i + 1).map(gaugeNum => (
                <option key={gaugeNum} value={gaugeNum}>Airgauge {gaugeNum}</option>
              ))}
            </select>
            <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
              <span className={`text-xs ${isDarkMode ? 'text-slate-400' : 'text-gray-500'}`}>▼</span>
            </div>
          </div>
        </div>

        <div>
          <label className={`block text-sm font-medium mb-3 ${isDarkMode ? 'text-slate-400' : 'text-gray-600'}`}>Select Channels (1-8)</label>
          <div className="grid grid-cols-4 gap-3">
            {channels.map(channel => {
              const isSelected = currentChannels.includes(channel);
              return (
                <button
                  key={channel}
                  onClick={() => handleChannelToggle(channel)}
                  className={`
                    w-full aspect-square rounded-xl flex flex-col items-center justify-center transition-all duration-200 border-2
                    ${isSelected 
                      ? 'bg-blue-600 border-blue-600 text-white shadow-md transform scale-105' 
                      : isDarkMode 
                        ? 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700' 
                        : 'bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100'
                    }
                  `}
                >
                  <span className="text-xs opacity-80 mb-1">CH</span>
                  <span className="text-xl font-bold leading-none">{channel}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
