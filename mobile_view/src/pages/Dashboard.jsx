import React, { useState, useEffect } from 'react';
import heroImg from '../assets/machinesetup.png';

export default function Dashboard() {
  const [numGauges, setNumGauges] = useState(10);
  const [airGauges, setAirGauges] = useState([]);

  useEffect(() => {
    const saved = localStorage.getItem('numGauges');
    if (saved) {
      setNumGauges(parseInt(saved));
    }
  }, []);

  useEffect(() => {
    // Generate air gauges dynamically based on numGauges
    const componentNames = [
      "Connecting Rod", "Crankshaft", "Cylinder Head", "Piston", 
      "Camshaft", "Flywheel", "Brake Rotor", "Transmission Gear", 
      "Bearing Journal", "Valve Body"
    ];

    const initialGauges = Array.from({ length: numGauges }, (_, i) => {
      const isReject = (i + 1) % 4 === 0 || (i + 1) % 7 === 0;
      return {
        id: i + 1,
        customId: `Air Gauge ${i + 1}`,
        value: isReject ? (10.050 + Math.random() * 0.03).toFixed(3) : (10.0 + Math.random() * 0.02).toFixed(3),
        status: isReject ? "10.050" : "OK",
        running: !isReject,
        componentName: componentNames[i % componentNames.length]
      };
    });
    setAirGauges(initialGauges);
  }, [numGauges]);

  const handleCustomIdChange = (id, newCustomId) => {
    setAirGauges(prev => prev.map(g => g.id === id ? { ...g, customId: newCustomId } : g));
  };

  return (
    <div className="flex flex-col items-center p-4 bg-[#f3f4f6] min-h-[calc(100vh-120px)] space-y-4">
      {/* Machine Image Card */}
      <div className="w-full bg-white rounded-3xl p-4 shadow-sm flex justify-center items-center">
        <img 
          src={heroImg} 
          alt="Airgauge Machine" 
          className="w-full h-auto object-contain max-h-56 mix-blend-multiply"
        />
      </div>

      {/* Active/Inactive Summary Column */}
      <div className="w-full grid grid-cols-2 gap-3 mt-2">
        <div className="bg-[#f0fdf4] border border-[#bbf7d0] rounded-xl p-3 shadow-sm flex flex-col items-center justify-center relative overflow-hidden">
          <div className="absolute top-0 right-0 w-8 h-8 bg-[#15803d]/10 rounded-bl-full flex items-center justify-center"><div className="w-2 h-2 bg-[#15803d] rounded-full animate-pulse mr-1 mt-1"></div></div>
          <p className="text-[10px] text-gray-600 font-bold mb-1 uppercase tracking-wider text-center">Active Gauges</p>
          <p className="text-3xl font-black text-[#15803d]">8</p>
          <p className="text-[10px] text-[#15803d] font-semibold mt-1">Running OK</p>
        </div>
        <div className="bg-[#fef2f2] border border-[#fecaca] rounded-xl p-3 shadow-sm flex flex-col items-center justify-center relative overflow-hidden">
          <div className="absolute top-0 right-0 w-8 h-8 bg-[#c81e1e]/10 rounded-bl-full flex items-center justify-center"><div className="w-2 h-2 bg-[#c81e1e] rounded-full mr-1 mt-1"></div></div>
          <p className="text-[10px] text-gray-600 font-bold mb-1 uppercase tracking-wider text-center">Inactive Gauges</p>
          <p className="text-3xl font-black text-[#c81e1e]">2</p>
          <p className="text-[10px] text-[#c81e1e] font-semibold mt-1">Rejected / Offline</p>
        </div>
      </div>

      {/* Multi-Gauge List based on Architecture Diagram */}
      <div className="w-full space-y-3 pb-8 mt-2">
        <h3 className="font-bold text-gray-800 text-lg border-b border-gray-300 pb-1 mb-3">Air Gauge Monitor (Local)</h3>
        
        {airGauges.map((gauge) => (
          <div 
            key={gauge.id} 
            className={`bg-white rounded-2xl p-4 shadow-sm border-l-4 ${gauge.running ? 'border-l-[#15803d]' : 'border-l-[#c81e1e]'}`}
          >
            <div className="flex justify-between items-center mb-2">
              <h4 className="font-black text-black">Air Gauge {gauge.id}</h4>
              <div className="flex items-center gap-1.5">
                <div className={`w-2.5 h-2.5 rounded-full ${gauge.running ? 'bg-[#15803d]' : 'bg-[#c81e1e]'}`}></div>
                <span className={`text-xs font-bold ${gauge.running ? 'text-[#15803d]' : 'text-[#c81e1e]'}`}>
                  {gauge.running ? 'Running' : 'REJECT'}
                </span>
              </div>
            </div>
            
            <div className="flex justify-between items-end border-b border-gray-100 pb-2 mb-2">
              <div>
                <p className="text-[10px] text-gray-500 uppercase font-semibold mb-0.5">Air Gauge ID</p>
                <div className="text-xl font-bold flex items-baseline gap-1">
                  <input 
                    type="text" 
                    value={gauge.customId}
                    onChange={(e) => handleCustomIdChange(gauge.id, e.target.value)}
                    className={`bg-transparent border-b border-dashed border-gray-300 focus:border-[#15803d] focus:outline-none transition-colors w-[120px] ${gauge.running ? 'text-black' : 'text-[#c81e1e]'}`}
                  />
                </div>
              </div>
              <div className="text-right">
                <p className="text-[10px] text-gray-500 uppercase font-semibold mb-0.5">{gauge.running ? 'Status' : 'Limit'}</p>
                <div className={`font-bold ${gauge.running ? 'text-[#15803d] text-lg' : 'text-[#c81e1e] text-lg'}`}>
                  {gauge.status}
                </div>
              </div>
            </div>
            
            {/* Added Component Stats */}
            <div className="flex justify-between items-center mt-1 text-xs">
              <div className="text-gray-600 font-medium">Component Name: <span className="text-black font-bold">{gauge.componentName}</span></div>
              <div className="flex gap-3 font-semibold">
                <span className="text-[#15803d]">{Math.floor(Math.random() * 50) + 100} Running</span>
                <span className="text-[#c81e1e]">{Math.floor(Math.random() * 10)} Stopped</span>
              </div>
            </div>
            
          </div>
        ))}
      </div>
    </div>
  );
}
