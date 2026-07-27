import React from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

export default function SessionSummary() {
  const navigate = useNavigate();

  const data = [
    { name: 'Accepted', value: 850 },
    { name: 'Rejected', value: 42 }
  ];
  
  const COLORS = ['#15803d', '#c81e1e'];

  return (
    <div className="flex flex-col min-h-screen bg-[#f5f5f5] p-4 relative overflow-hidden font-sans">
      <div className="flex-1 flex flex-col items-center justify-center">
        
        <div className="bg-white rounded-3xl p-6 md:p-8 shadow-xl w-full max-w-[400px] flex flex-col items-center">
          <div className="w-16 h-16 rounded-full bg-[#15803d]/10 flex items-center justify-center mb-4">
            <LogOut className="w-8 h-8 text-[#15803d]" />
          </div>
          
          <h1 className="text-2xl font-bold text-black mb-1">Session Summary</h1>
          <p className="text-sm text-gray-600 mb-6 text-center">Here is a quick breakdown of your production session before you log out.</p>

          <div className="w-full h-64 mb-6">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  fill="#8884d8"
                  paddingAngle={5}
                  dataKey="value"
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

          <div className="w-full grid grid-cols-2 gap-4 mb-8 text-center">
            <div className="bg-[#f0fdf4] border border-[#bbf7d0] rounded-xl p-3">
              <p className="text-xs text-gray-600 font-semibold mb-1">Total Accepted</p>
              <p className="text-2xl font-bold text-[#15803d]">850</p>
            </div>
            <div className="bg-[#fef2f2] border border-[#fecaca] rounded-xl p-3">
              <p className="text-xs text-gray-600 font-semibold mb-1">Total Rejected</p>
              <p className="text-2xl font-bold text-[#c81e1e]">42</p>
            </div>
          </div>

          <div className="w-full space-y-3">
            <button 
              onClick={() => navigate('/')} 
              className="w-full bg-[#c81e1e] text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2"
            >
              CONFIRM LOGOUT
            </button>
            <button 
              onClick={() => navigate('/app')} 
              className="w-full bg-white text-[#15803d] border-2 border-[#15803d] font-bold py-4 rounded-xl flex items-center justify-center"
            >
              RETURN TO DASHBOARD
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
