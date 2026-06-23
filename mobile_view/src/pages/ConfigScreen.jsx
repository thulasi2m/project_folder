import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Settings, Bell, PieChart as PieChartIcon } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import bgImage from '../assets/machinesetup.png';
import logoImage from '../assets/cherry_full_logo.png';

export default function ConfigScreen() {
  const navigate = useNavigate();
  const [numGauges, setNumGauges] = useState(() => {
    const saved = localStorage.getItem('numGauges');
    return saved ? parseInt(saved) : 10;
  });

  useEffect(() => {
    localStorage.setItem('numGauges', numGauges);
  }, [numGauges]);
  const [utl, setUtl] = useState("10.050");
  const [ltl, setLtl] = useState("10.000");

  const pieData = [
    { name: 'Target OK', value: 75 },
    { name: 'Target REJECT', value: 25 }
  ];
  const COLORS = ['#15803d', '#c81e1e'];

  return (
    <div className="flex flex-col items-center min-h-screen bg-[#f5f5f5] relative overflow-y-auto font-sans pb-10">
      
      <div className="z-10 w-full max-w-[430px] p-4 flex flex-col gap-4 mt-4">
        
        <div className="flex justify-center w-full mb-2 bg-white p-3 rounded-2xl shadow-sm">
          <img src={logoImage} alt="Cherry Precision Products" className="h-10 object-contain" />
        </div>

        {/* Column 1: Number Configuration */}
        <div className="bg-white rounded-2xl p-6 shadow-xl w-full flex flex-col items-center">
          <div className="w-16 h-16 bg-[#eef2ef] rounded-full flex items-center justify-center mb-3 overflow-hidden shadow-inner">
            <img src={bgImage} alt="Air Gauge" className="w-full h-full object-contain mix-blend-multiply p-1.5" />
          </div>
          <h2 className="text-xl font-bold text-black mb-1">Gauge Setup</h2>
          
          <div className="w-full mt-4 flex flex-col items-center">
            <label className="block text-xs font-bold text-gray-800 mb-3 uppercase tracking-wide text-center">Number of Air Gauges</label>
            <div className="flex items-center justify-center gap-3 sm:gap-4 w-full max-w-[280px]">
              <button 
                type="button" 
                onClick={() => setNumGauges(Math.max(1, numGauges - 1))}
                className="w-12 h-12 shrink-0 rounded-xl bg-gray-100 border border-gray-300 flex items-center justify-center text-xl font-bold text-black active:bg-gray-200 transition"
              >-</button>
              <input 
                type="number" 
                value={numGauges}
                onChange={(e) => setNumGauges(parseInt(e.target.value) || 1)}
                className="flex-1 w-full text-center py-3 border-2 border-[#15803d] rounded-xl text-black font-bold text-2xl focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none" 
              />
              <button 
                type="button" 
                onClick={() => setNumGauges(Math.min(30, numGauges + 1))}
                className="w-12 h-12 shrink-0 rounded-xl bg-gray-100 border border-gray-300 flex items-center justify-center text-xl font-bold text-black active:bg-gray-200 transition"
              >+</button>
            </div>
          </div>
        </div>

        {/* Column 2: Alert Configuration & Pie Chart */}
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-xl w-full flex flex-col">
          <h2 className="text-lg font-bold text-black mb-4 flex items-center gap-2 border-b border-gray-300 pb-2">
            <Bell className="w-5 h-5 text-[#c81e1e]" /> Alert Configuration
          </h2>
          
          <div className="flex flex-col gap-3 mb-6">
            <div className="flex gap-3">
              <div className="flex-1">
                <label className="block text-[10px] font-bold text-gray-500 mb-1 uppercase tracking-wide">Upper Limit (UTL)</label>
                <input 
                  type="text" 
                  value={utl}
                  onChange={(e) => setUtl(e.target.value)}
                  className="w-full px-3 py-2 border border-[#fecaca] bg-[#fef2f2] text-[#c81e1e] font-bold rounded-lg focus:outline-none" 
                />
              </div>
              <div className="flex-1">
                <label className="block text-[10px] font-bold text-gray-500 mb-1 uppercase tracking-wide">Lower Limit (LTL)</label>
                <input 
                  type="text" 
                  value={ltl}
                  onChange={(e) => setLtl(e.target.value)}
                  className="w-full px-3 py-2 border border-[#fecaca] bg-[#fef2f2] text-[#c81e1e] font-bold rounded-lg focus:outline-none" 
                />
              </div>
            </div>
            
            {/* Machine Date & Time Alert Toggle */}
            <div className="flex items-center justify-between p-3 bg-[#f0fdf4] border border-[#bbf7d0] rounded-lg mt-2">
              <div className="flex flex-col">
                <span className="text-xs font-bold text-[#15803d]">Machine Date & Time Alert</span>
                <span className="text-[10px] text-gray-600">Notify if time drifts &gt; 5 mins</span>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" defaultChecked />
                <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#15803d]"></div>
              </label>
            </div>
          </div>

          <h2 className="text-lg font-bold text-black mb-2 flex items-center gap-2 border-b pb-2">
            <PieChartIcon className="w-5 h-5 text-[#15803d]" /> Target Value Ratio
          </h2>
          
          <div className="w-full h-40 relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={0}
                  outerRadius={70}
                  paddingAngle={0}
                  dataKey="value"
                  animationDuration={1500}
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            {/* Removed the center text since there is no inner hole anymore */}
          </div>
          
          <div className="flex justify-center gap-4 text-xs font-semibold text-gray-600">
            <div className="flex items-center gap-1"><div className="w-3 h-3 bg-[#15803d] rounded-sm"></div> OK Target</div>
            <div className="flex items-center gap-1"><div className="w-3 h-3 bg-[#c81e1e] rounded-sm"></div> REJECT Target</div>
          </div>

        </div>

        <button 
          onClick={() => navigate('/app')} 
          className="w-full bg-[#15803d] text-white font-bold py-4 rounded-xl flex items-center justify-center transition-colors shadow-lg active:bg-green-800 mt-2"
        >
          START MONITORING →
        </button>

      </div>
    </div>
  );
}
