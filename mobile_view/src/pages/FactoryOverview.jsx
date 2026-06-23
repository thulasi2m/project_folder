import React from 'react';
import { useTheme } from '../context/ThemeContext';

export default function FactoryOverview() {
  const { isDarkMode } = useTheme();

  const machines = [
    { id: 'M-01', name: 'CNC LINE 1', status: 'RUNNING', oee: 88.5, color: '#10B981' },
    { id: 'M-02', name: 'CNC LINE 2', status: 'RUNNING', oee: 92.1, color: '#10B981' },
    { id: 'M-03', name: 'MILLING C4', status: 'WARNING', oee: 74.2, color: '#F59E0B' },
    { id: 'M-04', name: 'GRINDING 1', status: 'STOPPED', oee: 0.0, color: '#EF4444' },
  ];

  const headerClass = `text-xs font-mono font-bold p-1 pl-2 mb-2 ${isDarkMode ? 'bg-slate-800 text-white' : 'bg-[#1E40AF] text-white'}`;

  return (
    <div className="p-2 space-y-2 font-sans pb-24">
      <div className={`border-2 ${isDarkMode ? 'border-slate-700 bg-slate-900' : 'border-slate-400 bg-white'} rounded-sm overflow-hidden`}>
        <div className={headerClass}>PLANT A - FLOOR STATUS</div>
        <div className="grid grid-cols-2 gap-2 p-2">
          {machines.map(m => (
            <div key={m.id} className={`border-2 ${isDarkMode ? 'border-slate-700 bg-slate-800' : 'border-slate-300 bg-slate-50'} p-2 flex flex-col`}>
              <div className="flex justify-between items-center mb-2">
                <span className={`text-[10px] font-mono font-bold ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>{m.id}</span>
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: m.color, boxShadow: `0 0 5px ${m.color}` }}></div>
              </div>
              <span className={`text-xs font-mono font-bold ${isDarkMode ? 'text-slate-200' : 'text-slate-800'}`}>{m.name}</span>
              <div className="mt-2 flex justify-between items-end">
                <span className={`text-[10px] font-mono font-bold`} style={{ color: m.color }}>{m.status}</span>
                <span className={`text-sm font-mono font-black ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>{m.oee.toFixed(1)}%</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
