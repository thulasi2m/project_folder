import React, { useState } from 'react';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine
} from 'recharts';
import { ChevronDown } from 'lucide-react';

export default function SPCAnalytics() {
  const [selectedGauge, setSelectedGauge] = useState('Air Gauge 1');
  const [dropdownOpen, setDropdownOpen] = useState(false);

  // Generate Run Chart Data
  const runChartData = [
    { time: '10:10', value: 10.005 },
    { time: '10:12', value: 10.012 },
    { time: '10:14', value: 10.022 },
    { time: '10:16', value: 10.005 },
    { time: '10:18', value: 10.015 },
    { time: '10:20', value: 10.008 },
    { time: '10:22', value: 10.012 },
    { time: '10:24', value: 10.005 },
    { time: '10:26', value: 10.010 }
  ];

  const gauges = Array.from({ length: 10 }).map((_, i) => {
    const isReject = (i + 1) % 4 === 0 || (i + 1) % 7 === 0;
    return {
      name: `Air Gauge ${i + 1}`,
      running: !isReject
    };
  });

  const currentGaugeObj = gauges.find(g => g.name === selectedGauge);
  const isRunning = currentGaugeObj ? currentGaugeObj.running : true;
  const graphColor = isRunning ? '#15803d' : '#c81e1e';

  return (
    <div className="flex flex-col min-h-full bg-[#f4f6f8] font-sans pb-[80px] overflow-x-hidden">
      
      {/* Dashboard Wrapper */}
      <div className="p-4 w-full flex flex-col gap-4">
        
        {/* Top Stats Row */}
        <div className="flex gap-4 w-full">
          {/* Total Accepted */}
          <div className="flex-1 bg-[#f0fdf4] border border-[#bbf7d0] rounded-lg p-3 shadow-sm flex flex-col justify-center">
            <div className="text-[10px] font-semibold text-gray-500 uppercase tracking-wide mb-1">Current Running</div>
            <div className="text-2xl font-bold text-[#15803d]">850</div>
          </div>
          
          {/* Total Rejected */}
          <div className="flex-1 bg-[#fef2f2] border border-[#fecaca] rounded-lg p-3 shadow-sm flex flex-col justify-center">
            <div className="text-[10px] font-semibold text-gray-500 uppercase tracking-wide mb-1">Not Running</div>
            <div className="text-2xl font-bold text-[#b91c1c]">42</div>
          </div>
        </div>

        {/* Run Chart Card */}
        <div className="bg-white border border-gray-200 shadow-sm rounded-xl p-4 flex flex-col relative">
          
          {/* Card Header */}
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-base font-bold text-gray-800">Run Chart</h2>
            
            {/* Custom Dropdown */}
            <div className="relative">
              <button 
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className={`flex items-center gap-2 border px-3 py-1.5 rounded-md text-xs font-semibold ${
                  isRunning 
                    ? 'border-[#bbf7d0] bg-[#f0fdf4] text-[#15803d]' 
                    : 'border-[#fecaca] bg-[#fef2f2] text-[#c81e1e]'
                }`}
              >
                {selectedGauge}
                <ChevronDown className="w-3 h-3" />
              </button>
              
              {dropdownOpen && (
                <div className="absolute right-0 top-full mt-1 w-32 bg-[#f0fdf4] border border-[#bbf7d0] rounded-md shadow-lg z-50 overflow-hidden">
                  {gauges.map(gauge => (
                    <div 
                      key={gauge.name}
                      onClick={() => {
                        setSelectedGauge(gauge.name);
                        setDropdownOpen(false);
                      }}
                      className={`px-3 py-2 text-xs cursor-pointer hover:bg-gray-500 hover:text-white ${selectedGauge === gauge.name ? 'bg-gray-500 text-white' : (gauge.running ? 'text-[#15803d]' : 'text-[#c81e1e]')}`}
                    >
                      {gauge.name}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
          
          {/* Current Value Display */}
          <div className="mb-4">
            <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wide mb-1">Current Value</div>
            <div className="flex items-baseline gap-1">
              <span className={`text-3xl font-extrabold ${isRunning ? 'text-black' : 'text-[#c81e1e]'}`}>10.005</span>
              <span className="text-sm font-semibold text-gray-500">mm</span>
            </div>
          </div>

          {/* Chart Area */}
          <div className="h-[200px] w-full mt-2">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={runChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                <XAxis 
                  dataKey="time" 
                  stroke="#9ca3af" 
                  tick={{ fontSize: 10, fill: '#6b7280' }} 
                  tickLine={false} 
                  axisLine={false} 
                />
                <YAxis 
                  domain={['10.005', '10.025']} 
                  ticks={[10.005, 10.010, 10.015, 10.020, 10.025]} 
                  stroke="#9ca3af" 
                  tick={{ fontSize: 10, fill: '#6b7280' }} 
                  tickLine={false} 
                  axisLine={false} 
                  tickFormatter={(val) => val.toFixed(3)}
                />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'white', border: '1px solid #e5e7eb', borderRadius: '8px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }} 
                  itemStyle={{ color: graphColor, fontWeight: 'bold' }}
                  labelStyle={{ color: '#6b7280', marginBottom: '4px' }}
                />
                <ReferenceLine y={10.015} stroke="#cbd5e1" strokeDasharray="3 3" />
                <Line 
                  type="linear" 
                  dataKey="value" 
                  stroke={graphColor} 
                  strokeWidth={2} 
                  dot={{ r: 4, fill: graphColor, strokeWidth: 2, stroke: 'white' }} 
                  activeDot={{ r: 6, fill: graphColor, stroke: 'white', strokeWidth: 2 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

        </div>
      </div>
    </div>
  );
}
