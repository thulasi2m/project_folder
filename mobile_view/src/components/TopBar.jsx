import React from 'react';
import { Factory, Settings, Menu, SignalHigh } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useNavigate } from 'react-router-dom';

export default function TopBar() {
  const { isDarkMode } = useTheme();
  const navigate = useNavigate();

  return (
    <header className={`sticky top-0 z-50 ${isDarkMode ? 'bg-slate-900 border-slate-700 text-slate-100' : 'bg-[#1E40AF] border-blue-900 text-white'} border-b-2 shadow-md p-2 flex flex-col`}>
      <div className="flex justify-between items-center px-2 py-1">
        <div className="flex items-center gap-3">
          <Menu className="w-6 h-6 cursor-pointer" onClick={() => navigate('/settings')} />
          <div className="flex flex-col">
            <h1 className="text-lg font-bold tracking-widest uppercase leading-none">Cherry QMS</h1>
            <span className="text-[10px] font-mono opacity-75 uppercase">HMI Terminal v2.4</span>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5 bg-black/20 px-2 py-1 rounded-sm border border-black/10">
            <SignalHigh className="w-4 h-4 text-emerald-400" />
            <span className="text-xs font-mono font-bold text-emerald-400 tracking-wider">ONLINE</span>
          </div>
          <Settings className="w-5 h-5 cursor-pointer opacity-80 hover:opacity-100" onClick={() => navigate('/settings')} />
        </div>
      </div>
      
      <div className={`mt-2 flex items-center bg-black/10 border ${isDarkMode ? 'border-slate-700' : 'border-blue-800'} rounded-sm p-1`}>
        <div className="pl-2">
          <Factory className="w-4 h-4 opacity-70" />
        </div>
        <select 
          className="w-full bg-transparent text-sm font-bold font-mono tracking-wide py-1 pl-2 pr-4 focus:outline-none appearance-none cursor-pointer"
        >
          <option className="text-slate-900">PLANT A - CNC LINE 1 - OP 20</option>
          <option className="text-slate-900">PLANT A - ASSEMBLY - OP 40</option>
          <option className="text-slate-900">PLANT B - FINAL INSPECTION</option>
        </select>
      </div>
    </header>
  );
}
