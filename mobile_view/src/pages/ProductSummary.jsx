import React from 'react';
import { PieChart as PieChartIcon, Gauge } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

export default function ProductSummary() {
  const data = [
    { name: 'Accepted', value: 850 },
    { name: 'Rejected', value: 42 }
  ];
  
  const COLORS = ['#15803d', '#c81e1e'];

  return (
    <div className="flex flex-col min-h-screen bg-[#f3f4f6] p-4 relative font-sans pb-20">
      
      <div className="flex items-center gap-3 mb-4 bg-white p-3 rounded-xl shadow-sm border border-gray-200">
        <div className="bg-[#f0fdf4] p-2 rounded-lg border border-[#bbf7d0]">
          <Gauge className="w-6 h-6 text-[#15803d]" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-black leading-tight">Product Summary</h1>
          <p className="text-xs text-[#8c1c1c] font-bold">Air Gauge Monitoring</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200 w-full flex flex-col items-center">
        
        <p className="text-sm text-gray-600 mb-6 text-center font-medium">Overview of all inspected parts for the current session.</p>

        <div className="w-full h-64 mb-6">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={0}
                outerRadius={90}
                paddingAngle={0}
                dataKey="value"
                animationDuration={1500}
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend verticalAlign="bottom" height={36}/>
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="w-full grid grid-cols-2 gap-4 text-center mt-2">
          <div className="bg-[#f0fdf4] border border-[#bbf7d0] rounded-xl p-3 shadow-sm">
            <p className="text-xs text-gray-600 font-bold mb-1 uppercase tracking-wide">Total Accepted</p>
            <p className="text-3xl font-black text-[#15803d]">850</p>
          </div>
          <div className="bg-[#fef2f2] border border-[#fecaca] rounded-xl p-3 shadow-sm">
            <p className="text-xs text-gray-600 font-bold mb-1 uppercase tracking-wide">Total Rejected</p>
            <p className="text-3xl font-black text-[#c81e1e]">42</p>
          </div>
        </div>

      </div>
    </div>
  );
}
