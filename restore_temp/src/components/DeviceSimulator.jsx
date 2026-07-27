import React, { useState } from 'react';
import { Smartphone } from 'lucide-react';

const DEVICES = [
  { name: 'iPhone 14 Pro Max', width: 430, height: 932 },
  { name: 'iPhone 14 Pro', width: 393, height: 852 },
  { name: 'iPhone SE', width: 375, height: 667 },
  { name: 'Pixel 7', width: 412, height: 915 },
  { name: 'Samsung Galaxy S22', width: 360, height: 800 },
  { name: 'Desktop/Tablet (Responsive)', width: '100%', height: '100vh' }
];

export default function DeviceSimulator({ children }) {
  const [selectedDevice, setSelectedDevice] = useState(DEVICES[0]);

  // If the viewport is already too small (like an actual phone), don't force simulator styles
  const isMobileViewport = window.innerWidth <= 430;

  if (isMobileViewport) {
    return <div className="w-full h-full">{children}</div>;
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 py-4 font-sans">
      
      {/* Top Device Selector Menu */}
      <div className="flex items-center gap-3 bg-white px-4 py-2 rounded-full shadow-lg mb-6 z-50 relative">
        <Smartphone className="w-5 h-5 text-gray-700" />
        <span className="text-sm font-bold text-gray-800">Preview Device:</span>
        <select 
          className="bg-gray-100 border border-gray-300 text-gray-800 text-sm rounded-lg focus:ring-[#15803d] focus:border-[#15803d] block w-full p-1.5 font-medium outline-none cursor-pointer"
          onChange={(e) => setSelectedDevice(DEVICES[parseInt(e.target.value)])}
        >
          {DEVICES.map((device, idx) => (
            <option key={device.name} value={idx}>{device.name}</option>
          ))}
        </select>
      </div>

      {/* Device Container */}
      <div 
        className="relative bg-white shadow-2xl transition-all duration-300 ease-in-out overflow-hidden"
        style={{
          width: selectedDevice.width,
          height: selectedDevice.height,
          borderRadius: typeof selectedDevice.width === 'number' ? '40px' : '0',
          border: typeof selectedDevice.width === 'number' ? '12px solid #1f2937' : 'none',
        }}
      >
        <div className="absolute inset-0 w-full h-full overflow-y-auto custom-scrollbar">
          {children}
        </div>
      </div>
      
    </div>
  );
}
