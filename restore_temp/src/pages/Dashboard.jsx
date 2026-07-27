import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import heroImg from '../assets/machinesetup.png';

export default function Dashboard() {
  const navigate = useNavigate();
  const [numGauges, setNumGauges] = useState(10);
  const [airGauges, setAirGauges] = useState([]);
  const [gaugeChannels, setGaugeChannels] = useState({});
  const [selectedGaugeIds, setSelectedGaugeIds] = useState([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('numGauges');
    if (saved) {
      setNumGauges(parseInt(saved));
    }
    const storedChannels = localStorage.getItem('gaugeChannels');
    if (storedChannels) {
      setGaugeChannels(JSON.parse(storedChannels));
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
      const isReject = (i + 1) % 4 === 0;
      const isRework = !isReject && (i + 1) % 7 === 0;
      const isAccept = !isReject && !isRework;
      
      return {
        id: i + 1,
        customId: `Air Gauge ${i + 1}`,
        value: isReject || isRework ? (10.050 + Math.random() * 0.03).toFixed(3) : (10.0 + Math.random() * 0.02).toFixed(3),
        status: isReject ? "REJECT" : isRework ? "REWORK" : "OK",
        running: isAccept,
        componentName: componentNames[i % componentNames.length],
        isAccept,
        isRework,
        isReject
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

      {/* Consolidated Summary Column */}
      <div className="w-full grid grid-cols-3 gap-2 mt-2">
        <div className="bg-[#f0fdf4] border border-[#bbf7d0] rounded-xl p-2 shadow-sm flex flex-col items-center justify-center relative overflow-hidden">
          <p className="text-[9px] text-gray-600 font-bold mb-0.5 uppercase tracking-wider text-center leading-tight">Air Gauge<br/>Accept No</p>
          <p className="text-2xl font-black text-[#15803d]">
            {airGauges.filter(g => g.isAccept).length}
          </p>
        </div>
        <div className="bg-[#fffbeb] border border-[#fde68a] rounded-xl p-2 shadow-sm flex flex-col items-center justify-center relative overflow-hidden">
          <p className="text-[9px] text-gray-600 font-bold mb-0.5 uppercase tracking-wider text-center leading-tight">Air Gauge<br/>Rework No</p>
          <p className="text-2xl font-black text-[#d97706]">
            {airGauges.filter(g => g.isRework).length}
          </p>
        </div>
        <div className="bg-[#fef2f2] border border-[#fecaca] rounded-xl p-2 shadow-sm flex flex-col items-center justify-center relative overflow-hidden">
          <p className="text-[9px] text-gray-600 font-bold mb-0.5 uppercase tracking-wider text-center leading-tight">Air Gauge<br/>Reject No</p>
          <p className="text-2xl font-black text-[#c81e1e]">
            {airGauges.filter(g => g.isReject).length}
          </p>
        </div>
      </div>

      {/* Multi-Gauge List based on Architecture Diagram */}
      <div className="w-full space-y-3 pb-8 mt-2">
        <div className="flex justify-between items-center border-b border-gray-300 pb-1 mb-3">
          <h3 className="font-bold text-gray-800 text-lg">Air Gauge Monitor (Local)</h3>
          
          <div className="relative">
            <button 
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="border border-gray-300 rounded px-3 py-1 text-sm bg-white focus:outline-none focus:ring-1 focus:ring-[#15803d] flex items-center gap-2"
            >
              {selectedGaugeIds.length === 0 ? "Select Gauge" : selectedGaugeIds.length === airGauges.length ? "All Gauges" : `${selectedGaugeIds.length} Selected`}
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
            </button>
            
            {isDropdownOpen && (
              <div className="absolute right-0 mt-1 w-48 bg-white border border-gray-200 rounded shadow-lg z-10 max-h-60 overflow-y-auto">
                <div 
                  className="px-3 py-2 border-b border-gray-100 hover:bg-gray-50 cursor-pointer text-sm"
                  onClick={() => {
                    if (selectedGaugeIds.length === airGauges.length) {
                      setSelectedGaugeIds([]);
                    } else {
                      setSelectedGaugeIds(airGauges.map(g => g.id));
                    }
                    setIsDropdownOpen(false);
                  }}
                >
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" checked={selectedGaugeIds.length === airGauges.length && airGauges.length > 0} onChange={() => {}} className="rounded text-[#15803d] focus:ring-[#15803d]" />
                    <span>Select All</span>
                  </label>
                </div>
                {airGauges.map(gauge => (
                  <div 
                    key={gauge.id} 
                    className="px-3 py-2 hover:bg-gray-50 cursor-pointer text-sm"
                    onClick={() => {
                        setSelectedGaugeIds(prev => 
                            prev.includes(gauge.id) 
                                ? prev.filter(id => id !== gauge.id)
                                : [...prev, gauge.id]
                        );
                        setIsDropdownOpen(false);
                    }}
                  >
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input 
                        type="checkbox" 
                        checked={selectedGaugeIds.includes(gauge.id)} 
                        onChange={() => {}} 
                        className="rounded text-[#15803d] focus:ring-[#15803d]" 
                      />
                      <span>Air Gauge {gauge.id}</span>
                    </label>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
        
        {airGauges.filter(g => selectedGaugeIds.includes(g.id)).map((gauge) => (
          <div 
            key={gauge.id} 
            onClick={() => navigate(`/setup/${gauge.id}`)}
            className={`bg-white rounded-2xl p-4 shadow-sm border-l-4 cursor-pointer hover:bg-gray-50 transition-colors ${gauge.running ? 'border-l-[#15803d]' : 'border-l-[#c81e1e]'}`}
          >
            <div className="flex justify-between items-center mb-2">
              <h4 className="font-black text-black">Air Gauge {gauge.id}</h4>
              <div className="flex items-center gap-1.5">
                <div className={`w-2.5 h-2.5 rounded-full ${gauge.isAccept ? 'bg-[#15803d]' : gauge.isRework ? 'bg-[#d97706]' : 'bg-[#c81e1e]'}`}></div>
                <span className={`text-xs font-bold ${gauge.isAccept ? 'text-[#15803d]' : gauge.isRework ? 'text-[#d97706]' : 'text-[#c81e1e]'}`}>
                  {gauge.status}
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
                    onClick={(e) => e.stopPropagation()}
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
            
            {/* Individual Channel Stats */}
            {(gaugeChannels[gauge.id] || []).length > 0 && (
              <div className="flex flex-col gap-1.5 my-2 border-b border-gray-100 pb-2 max-h-32 overflow-y-auto pr-1">
                {(gaugeChannels[gauge.id] || []).map(ch => (
                  <div key={ch} className="flex justify-between items-center bg-gray-50 border border-gray-100 rounded px-2 py-1">
                    <span className="bg-[#15803d] text-white text-[10px] font-bold px-1.5 py-0.5 rounded shadow-sm">
                      CH {ch}
                    </span>
                    <div className="flex gap-3 text-[11px] font-semibold">
                      <span className="text-[#15803d]">Accept: {Math.floor(Math.random() * 50) + 20}</span>
                      <span className="text-[#d97706]">Rework: {Math.floor(Math.random() * 5)}</span>
                      <span className="text-[#c81e1e]">Reject: {Math.floor(Math.random() * 3)}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
            
            {/* Component Stats */}
            <div className="flex justify-between items-center mt-1 text-xs">
              <div className="text-gray-600 font-medium">Component Name: <span className="text-black font-bold">{gauge.componentName}</span></div>
            </div>
            
          </div>
        ))}
      </div>
    </div>
  );
}
