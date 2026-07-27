import React from 'react';
import { Home, BarChart2, Activity, Usb, LogOut } from 'lucide-react';
import { NavLink } from 'react-router-dom';

export default function BottomNavigation({ onLogout }) {
  return (
    <nav className="absolute bottom-0 w-full max-w-[430px] bg-[#f8f9fa] border-t border-gray-300 shadow-[0_-2px_10px_rgba(0,0,0,0.05)] z-40 h-[68px] flex justify-around items-center">
      <NavLink to="/app" end className={({isActive}) => `flex flex-col items-center justify-center w-full h-full ${isActive ? 'text-[#15803d]' : 'text-gray-500 hover:text-gray-900'} active:bg-gray-200 transition`}>
        <Home className="w-[26px] h-[26px] mb-1 text-center text-xl leading-none" />
        <span className="text-[11px] font-medium leading-none">Home</span>
      </NavLink>

      <NavLink to="/app/analytics" className={({isActive}) => `flex flex-col items-center justify-center w-full h-full ${isActive ? 'text-[#15803d]' : 'text-[#15803d]'}`}>
        <BarChart2 className="w-[26px] h-[26px] mb-1" />
        <span className="text-[11px] font-medium leading-none">Run Chart</span>
      </NavLink>

      <NavLink to="/app/admin" className={({isActive}) => `flex flex-col items-center justify-center w-full h-full ${isActive ? 'bg-[#8c1c1c] text-white' : 'bg-[#8c1c1c] text-white'} transition`}>
        <span className="w-[26px] h-[26px] mb-1 text-center text-xl leading-none">🛡️</span>
        <span className="text-[11px] font-medium leading-none">Admin</span>
      </NavLink>
      
      <NavLink to="/app/monitoring" className={({isActive}) => `flex flex-col items-center justify-center w-full h-full ${isActive ? 'text-[#15803d]' : 'text-[#15803d]'}`}>
        <Activity className="w-[26px] h-[26px] mb-1" />
        <span className="text-[11px] font-medium leading-none">Live Data</span>
      </NavLink>
      
      <button onClick={onLogout} className="flex flex-col items-center justify-center w-full h-full text-[#c81e1e] active:bg-gray-200">
        <LogOut className="w-[26px] h-[26px] mb-1" />
        <span className="text-[11px] font-medium leading-none">Logout</span>
      </button>
    </nav>
  );
}
