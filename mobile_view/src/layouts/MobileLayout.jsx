import React, { useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { Menu, X, Home, Settings, Activity, Usb, FileText, LogOut, BarChart2 } from 'lucide-react';
import BottomNavigation from '../components/BottomNavigation';
import cherryLogo from '../assets/cherry_full_logo.png';

export default function MobileLayout() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [logoutModal, setLogoutModal] = useState(false);
  const navigate = useNavigate();

  return (
    <div className="flex flex-col h-full w-full bg-[#e5e5e5] font-sans relative overflow-hidden">
      {/* Top Header */}
      <header className="bg-white px-4 py-2 flex items-center justify-between border-b border-gray-300 shadow-sm z-40 sticky top-0">
        <div className="flex items-center gap-1.5">
          <img src={cherryLogo} className="h-8 object-contain" alt="Cherry Precision Products" />
          <div className="h-6 w-px bg-gray-300 mx-2"></div>
          <h1 className="text-xs font-bold text-black leading-tight">Airgauge<br/>Monitoring</h1>
        </div>
        <button onClick={() => setMenuOpen(true)} className="p-1">
          <Menu className="w-6 h-6 text-black" />
        </button>
      </header>

      {/* Sidebar Overlay (Absolute to stay inside wrapper) */}
      {menuOpen && (
        <div className="absolute inset-0 z-50 flex">
          <div className="absolute inset-0 bg-black/40" onClick={() => setMenuOpen(false)}></div>
          <div className="relative w-3/4 max-w-xs bg-white h-full shadow-2xl flex flex-col">
            <div className="p-4 flex justify-between items-center border-b border-gray-200">
              <div className="flex items-center gap-2">
                <img src={cherryLogo} alt="Cherry Logo" className="h-6 object-contain" />
                <h2 className="text-sm font-bold text-black">PRECISION PRODUCTS MENU</h2>
              </div>
              <button onClick={() => setMenuOpen(false)}>
                <X className="w-6 h-6 text-gray-500" />
              </button>
            </div>
            
            <nav className="flex flex-col p-4 space-y-2">
              <button onClick={() => {navigate('/app'); setMenuOpen(false);}} className="flex items-center gap-3 px-4 py-3 text-left hover:bg-gray-100 rounded-lg">
                <Home className="w-5 h-5 text-gray-500" /> <span className="text-[15px] font-medium">Home</span>
              </button>
              <button onClick={() => {navigate('/config'); setMenuOpen(false);}} className="flex items-center gap-3 px-4 py-3 text-left hover:bg-gray-100 rounded-lg">
                <Settings className="w-5 h-5 text-gray-500" /> <span className="text-[15px] font-medium">Settings</span>
              </button>
              <button onClick={() => {navigate('/app/analytics'); setMenuOpen(false);}} className="flex items-center gap-3 px-4 py-3 text-left hover:bg-gray-100 rounded-lg">
                <Activity className="w-5 h-5 text-gray-500" /> <span className="text-[15px] font-medium">Run Chart</span>
              </button>
              <button onClick={() => {navigate('/app/monitoring'); setMenuOpen(false);}} className="flex items-center gap-3 px-4 py-3 text-left hover:bg-gray-100 rounded-lg">
                <span className="w-5 h-5 text-center text-lg leading-none">📈</span> <span className="text-[15px] font-medium">Live Data</span>
              </button>
              <button onClick={() => {navigate('/app/admin'); setMenuOpen(false);}} className="flex items-center gap-3 px-4 py-3 text-left hover:bg-gray-100 rounded-lg">
                <span className="w-5 h-5 text-center text-lg leading-none">🛡️</span> <span className="text-[15px] font-medium">Admin</span>
              </button>
              <button onClick={() => {navigate('/app/alerts'); setMenuOpen(false);}} className="flex items-center gap-3 px-4 py-3 text-left hover:bg-gray-100 rounded-lg text-[#c81e1e] font-semibold">
                <span className="w-5 h-5 text-center text-lg leading-none">🔔</span> <span className="text-[15px]">Alerts</span>
              </button>
              <button onClick={() => {navigate('/app/reports'); setMenuOpen(false);}} className="flex items-center gap-3 px-4 py-3 bg-[#15803d] text-white rounded-lg">
                <FileText className="w-5 h-5 text-white" /> <span className="text-[15px]">Report</span>
              </button>
              <button onClick={() => {navigate('/app/summary'); setMenuOpen(false);}} className="flex items-center gap-3 px-4 py-3 text-left hover:bg-gray-100 rounded-lg">
                <span className="w-5 h-5 text-center text-lg leading-none">📊</span> <span className="text-[15px]">Summary</span>
              </button>
              <button onClick={() => {navigate('/app/user-config'); setMenuOpen(false);}} className="flex items-center gap-3 px-4 py-3 text-left hover:bg-gray-100 rounded-lg">
                <span className="w-5 h-5 text-center text-lg leading-none">👤</span> <span className="text-[15px]">User Config</span>
              </button>
              <button onClick={() => {setLogoutModal(true); setMenuOpen(false);}} className="flex items-center gap-3 px-4 py-3 text-left hover:bg-gray-100 rounded-lg">
                <LogOut className="w-5 h-5 text-[#15803d]" /> <span className="text-[15px]">Logout</span>
              </button>
            </nav>
          </div>
        </div>
      )}

      {/* Logout Modal (Absolute to stay inside wrapper) */}
      {logoutModal && (
        <div className="absolute inset-0 z-[60] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40" onClick={() => setLogoutModal(false)}></div>
          <div className="relative bg-white w-full max-w-sm rounded-3xl p-6 shadow-2xl text-center">
            <div className="mx-auto w-12 h-12 border-2 border-green-700 text-green-700 rounded flex items-center justify-center mb-4">
              <LogOut className="w-6 h-6" />
            </div>
            <h2 className="text-xl font-bold mb-2">Confirm Logout</h2>
            <p className="text-gray-600 mb-6">Are you sure you want to log out of the system?</p>
            <div className="space-y-3">
              <button onClick={() => {setLogoutModal(false); navigate('/login');}} className="w-full bg-[#c81e1e] text-white font-medium py-3 rounded-xl flex items-center justify-center gap-2">
                <span>→</span> Yes, Logout
              </button>
              <button onClick={() => setLogoutModal(false)} className="w-full bg-[#15803d] text-white font-medium py-3 rounded-xl flex items-center justify-center gap-2">
                <span>✕</span> Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <main className="flex-1 overflow-y-auto pb-[68px] bg-[#e5e5e5]">
        <Outlet />
      </main>

      <BottomNavigation onLogout={() => setLogoutModal(true)} />
    </div>
  );
}
