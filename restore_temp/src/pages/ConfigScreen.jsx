import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Settings, Bell, PieChart as PieChartIcon } from 'lucide-react';

import bgImage from '../assets/machinesetup.png';
import logoImage from '../assets/cherry_full_logo.png';

export default function ConfigScreen() {
  const navigate = useNavigate();
  const [numGauges, setNumGauges] = useState(() => {
    const saved = localStorage.getItem('numGauges');
    return saved ? parseInt(saved) : 10;
  });

  useEffect(() => {
    localStorage.setItem('numGauges', numGauges);
  }, [numGauges]);
  const [utl, setUtl] = useState("10.050");
  const [ltl, setLtl] = useState("10.000");
  const [openDropdown, setOpenDropdown] = useState(null);
  const [updateTrigger, setUpdateTrigger] = useState(0);
  const [shift1Break, setShift1Break] = useState("");
  const [shift2Break, setShift2Break] = useState("");
  const [shift3Break, setShift3Break] = useState("");
  const [shift1Start, setShift1Start] = useState("09:00");
  const [shift1End, setShift1End] = useState("17:00");
  const [shift2Start, setShift2Start] = useState("17:00");
  const [shift2End, setShift2End] = useState("00:00");
  const [shift3Start, setShift3Start] = useState("00:00");
  const [shift3End, setShift3End] = useState("09:00");
  const [openGaugeDropdown, setOpenGaugeDropdown] = useState(null);
  const [openMasterDropdown, setOpenMasterDropdown] = useState(false);
  const [openEmployeeMaster, setOpenEmployeeMaster] = useState(false);
  return (
    <div className="flex flex-col items-center min-h-screen bg-[#f5f5f5] relative overflow-y-auto font-sans pb-10">
      
      <div className="z-10 w-full max-w-[430px] p-4 flex flex-col gap-4 mt-4">
        
        <div className="flex justify-center w-full mb-2 bg-white p-3 rounded-2xl shadow-sm">
          <img src={logoImage} alt="Cherry Precision Products" className="h-10 object-contain" />
        </div>

        {/* Column 1: Number Configuration */}
        <div className="bg-white rounded-2xl p-6 shadow-xl w-full flex flex-col items-center">
          <div className="w-16 h-16 bg-[#eef2ef] rounded-full flex items-center justify-center mb-3 overflow-hidden shadow-inner">
            <img src={bgImage} alt="Air Gauge" className="w-full h-full object-contain mix-blend-multiply p-1.5" />
          </div>
          <h2 className="text-xl font-bold text-black mb-1">Gauge Setup</h2>
          
          <div className="w-full mt-4 flex flex-col items-center">
            <label className="block text-xs font-bold text-gray-800 mb-3 uppercase tracking-wide text-center">Number of Air Gauges</label>
            <div className="flex items-center justify-center gap-3 sm:gap-4 w-full max-w-[280px]">
              <button 
                type="button" 
                onClick={() => setNumGauges(Math.max(1, numGauges - 1))}
                className="w-12 h-12 shrink-0 rounded-xl bg-gray-100 border border-gray-300 flex items-center justify-center text-xl font-bold text-black active:bg-gray-200 transition"
              >-</button>
              <input 
                type="number" 
                value={numGauges}
                onChange={(e) => setNumGauges(parseInt(e.target.value) || 1)}
                className="flex-1 w-full text-center py-3 border-2 border-[#15803d] rounded-xl text-black font-bold text-2xl focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none" 
              />
              <button 
                type="button" 
                onClick={() => setNumGauges(Math.min(30, numGauges + 1))}
                className="w-12 h-12 shrink-0 rounded-xl bg-gray-100 border border-gray-300 flex items-center justify-center text-xl font-bold text-black active:bg-gray-200 transition"
              >+</button>
            </div>
          </div>
          
          {/* Channel Selection for each Air Gauge */}
          <div className="w-full mt-6 flex flex-col gap-3">
            <div 
              className="flex justify-between items-center bg-white border border-gray-300 rounded-xl p-4 cursor-pointer shadow-sm active:bg-gray-50 transition"
              onClick={() => setOpenMasterDropdown(!openMasterDropdown)}
            >
              <span className="text-sm font-bold text-gray-800 uppercase tracking-wide">NO. OF CHANNELS</span>
              <span className="text-gray-400 text-xs">{openMasterDropdown ? '▲' : '▼'}</span>
            </div>
            
            {openMasterDropdown && (
              <div className="flex flex-col gap-3 mt-1 p-2 bg-gray-50 border border-gray-200 rounded-xl shadow-inner">
                {Array.from({ length: numGauges }, (_, i) => i + 1).map((gaugeNum) => {
                  const currentSelections = JSON.parse(localStorage.getItem('gaugeChannels') || '{}')[gaugeNum] || [];
                  const toggleChannel = (ch) => {
                    const stored = JSON.parse(localStorage.getItem('gaugeChannels') || '{}');
                    const selections = stored[gaugeNum] || [];
                    if (selections.includes(ch)) {
                      stored[gaugeNum] = selections.filter(x => x !== ch);
                    } else {
                      stored[gaugeNum] = [...selections, ch].sort();
                    }
                    localStorage.setItem('gaugeChannels', JSON.stringify(stored));
                    setUpdateTrigger(prev => prev + 1); // trigger render
                  };
                  
                  return (
                    <div key={gaugeNum} className="bg-white border border-gray-200 rounded-xl flex flex-col shadow-sm overflow-hidden">
                      <div 
                        className="p-3 flex justify-between items-center cursor-pointer active:bg-gray-50"
                        onClick={() => setOpenGaugeDropdown(openGaugeDropdown === gaugeNum ? null : gaugeNum)}
                      >
                        <span className="text-sm font-bold text-[#15803d] uppercase tracking-wider">
                          AG {gaugeNum} CHANNELS
                        </span>
                        <span className="text-gray-400 text-xs">{openGaugeDropdown === gaugeNum ? '▲' : '▼'}</span>
                      </div>
                      {openGaugeDropdown === gaugeNum && (
                        <div className="p-3 bg-gray-50 border-t border-gray-100">
                          <div className="flex flex-wrap gap-2 justify-start">
                        {[1, 2, 3, 4, 5, 6, 7, 8].map(ch => (
                          <button
                            key={ch}
                            type="button"
                            onClick={() => toggleChannel(ch)}
                            className={`w-11 h-14 shrink-0 rounded-xl flex flex-col items-center justify-center text-sm font-bold transition-all border-2
                              ${currentSelections.includes(ch) 
                                ? 'bg-[#15803d] border-[#15803d] text-white shadow-md scale-105' 
                                : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-100'}`}
                          >
                            <span className="text-[10px] leading-none opacity-80">CH</span>
                            <span className="leading-none">{ch}</span>
                          </button>
                        ))}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
          
          {/* Employee Master for each Air Gauge */}
          <div className="w-full mt-3 flex flex-col gap-3">
            <div 
              className="flex justify-between items-center bg-white border border-gray-300 rounded-xl p-4 cursor-pointer shadow-sm active:bg-gray-50 transition"
              onClick={() => setOpenEmployeeMaster(!openEmployeeMaster)}
            >
              <span className="text-sm font-bold text-gray-800 uppercase tracking-wide">EMPLOYEE MASTER</span>
              <span className="text-gray-400 text-xs">{openEmployeeMaster ? '▲' : '▼'}</span>
            </div>
            
            {openEmployeeMaster && (
              <div className="flex flex-col gap-3 mt-1 p-2 bg-gray-50 border border-gray-200 rounded-xl shadow-inner max-h-[300px] overflow-y-auto">
                {Array.from({ length: numGauges }, (_, i) => i + 1).map((gaugeNum) => {
                  return (
                    <div key={gaugeNum} className="bg-white border border-gray-200 rounded-xl flex flex-col shadow-sm p-3">
                      <div className="text-xs font-bold text-[#15803d] uppercase tracking-wider mb-2">AG {gaugeNum} Employee</div>
                      <select 
                         className="w-full p-2 text-sm border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-1 focus:ring-[#15803d]"
                         onChange={(e) => {
                           const stored = JSON.parse(localStorage.getItem('gaugeEmployees') || '{}');
                           stored[gaugeNum] = e.target.value;
                           localStorage.setItem('gaugeEmployees', JSON.stringify(stored));
                         }}
                         defaultValue={JSON.parse(localStorage.getItem('gaugeEmployees') || '{}')[gaugeNum] || ""}
                      >
                        <option value="">Select Employee</option>
                        <option value="EMP001 - John Doe">EMP001 - John Doe</option>
                        <option value="EMP002 - Jane Smith">EMP002 - Jane Smith</option>
                        <option value="EMP003 - Mike Johnson">EMP003 - Mike Johnson</option>
                        <option value="EMP004 - Sarah Williams">EMP004 - Sarah Williams</option>
                        <option value="EMP005 - Michael Brown">EMP005 - Michael Brown</option>
                      </select>
                      
                      <div className="mt-3 flex items-center justify-between border-t border-gray-100 pt-3">
                        <span className="text-[10px] font-bold text-gray-500 uppercase">Select Shift</span>
                        <div className="flex gap-2">
                          {[1, 2, 3].map(shift => {
                            const storedRaw = JSON.parse(localStorage.getItem('gaugeShifts') || '{}')[gaugeNum];
                            const currentShifts = Array.isArray(storedRaw) ? storedRaw : (storedRaw ? [storedRaw] : []);
                            const isSelected = currentShifts.includes(shift);
                            
                            return (
                              <button 
                                key={shift}
                                type="button"
                                onClick={() => {
                                   const stored = JSON.parse(localStorage.getItem('gaugeShifts') || '{}');
                                   const current = Array.isArray(stored[gaugeNum]) ? stored[gaugeNum] : (stored[gaugeNum] ? [stored[gaugeNum]] : []);
                                   
                                   if (current.includes(shift)) {
                                     stored[gaugeNum] = current.filter(s => s !== shift);
                                   } else {
                                     stored[gaugeNum] = [...current, shift].sort();
                                   }
                                   
                                   localStorage.setItem('gaugeShifts', JSON.stringify(stored));
                                   setUpdateTrigger(prev => prev + 1);
                                }}
                                className={`w-8 h-8 flex items-center justify-center rounded-full text-xs font-bold transition-colors ${
                                  isSelected
                                    ? 'bg-[#15803d] text-white shadow-md'
                                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                }`}
                              >
                                {shift}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Column 2: Shift Timings */}
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-xl w-full flex flex-col">
          <h2 className="text-lg font-bold text-black mb-4 flex items-center gap-2 border-b pb-2">
            <Settings className="w-5 h-5 text-[#15803d]" /> SHIFT TIMINGS
          </h2>

          <div className="flex flex-col gap-4">
            {/* First Shift */}
            <div className="bg-[#f0fdf4] border border-[#bbf7d0] rounded-lg p-3">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-bold text-[#15803d]">First Shift</span>
                <div className="flex items-center gap-1 text-xs font-semibold text-gray-700">
                  <input type="time" value={shift1Start} onChange={e => setShift1Start(e.target.value)} className="border border-green-300 rounded px-1 bg-white focus:outline-none" />
                  <span>to</span>
                  <input type="time" value={shift1End} onChange={e => setShift1End(e.target.value)} className="border border-green-300 rounded px-1 bg-white focus:outline-none" />
                </div>
              </div>
              <div className="relative w-full mt-2">
                <div 
                  className="w-full text-xs p-2.5 border border-green-300 rounded bg-white text-gray-700 flex justify-between items-center cursor-pointer shadow-sm"
                  onClick={() => setOpenDropdown(openDropdown === 1 ? null : 1)}
                >
                  <span className="font-medium text-gray-500">Set Break Timings</span>
                  <span className="text-gray-400 text-[10px]">▼</span>
                </div>
                {openDropdown === 1 && (
                  <div className="absolute z-20 w-full mt-1 bg-[#f0fdf4] border border-green-300 rounded-lg shadow-xl p-3 flex flex-col gap-3">
                    <div className="flex justify-between items-center text-xs font-semibold text-gray-600">
                      <span>Tea Time 1</span>
                      <div className="flex items-center gap-1">
                        <input type="time" defaultValue="10:00" className="border border-green-300 rounded px-1 bg-white focus:outline-none" /> to <input type="time" defaultValue="10:30" className="border border-green-300 rounded px-1 bg-white focus:outline-none" />
                      </div>
                    </div>
                    <div className="flex justify-between items-center text-xs font-semibold text-gray-600">
                      <span>Lunch Time</span>
                      <div className="flex items-center gap-1">
                        <input type="time" defaultValue="13:00" className="border border-green-300 rounded px-1 bg-white focus:outline-none" /> to <input type="time" defaultValue="13:15" className="border border-green-300 rounded px-1 bg-white focus:outline-none" />
                      </div>
                    </div>
                    <div className="flex justify-between items-center text-xs font-semibold text-gray-600">
                      <span>Tea Time 2</span>
                      <div className="flex items-center gap-1">
                        <input type="time" defaultValue="15:00" className="border border-green-300 rounded px-1 bg-white focus:outline-none" /> to <input type="time" defaultValue="15:15" className="border border-green-300 rounded px-1 bg-white focus:outline-none" />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Second Shift */}
            <div className="bg-[#f0fdf4] border border-[#bbf7d0] rounded-lg p-3">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-bold text-[#15803d]">Second Shift</span>
                <div className="flex items-center gap-1 text-xs font-semibold text-gray-700">
                  <input type="time" value={shift2Start} onChange={e => setShift2Start(e.target.value)} className="border border-green-300 rounded px-1 bg-white focus:outline-none" />
                  <span>to</span>
                  <input type="time" value={shift2End} onChange={e => setShift2End(e.target.value)} className="border border-green-300 rounded px-1 bg-white focus:outline-none" />
                </div>
              </div>
              <div className="relative w-full mt-2">
                <div 
                  className="w-full text-xs p-2.5 border border-green-300 rounded bg-white text-gray-700 flex justify-between items-center cursor-pointer shadow-sm"
                  onClick={() => setOpenDropdown(openDropdown === 2 ? null : 2)}
                >
                  <span className="font-medium text-gray-500">Set Break Timings</span>
                  <span className="text-gray-400 text-[10px]">▼</span>
                </div>
                {openDropdown === 2 && (
                  <div className="absolute z-20 w-full mt-1 bg-[#f0fdf4] border border-green-300 rounded-lg shadow-xl p-3 flex flex-col gap-3">
                    <div className="flex justify-between items-center text-xs font-semibold text-gray-600">
                      <span>Tea Break 1</span>
                      <div className="flex items-center gap-1">
                        <input type="time" defaultValue="19:00" className="border border-green-300 rounded px-1 bg-white focus:outline-none" /> to <input type="time" defaultValue="19:15" className="border border-green-300 rounded px-1 bg-white focus:outline-none" />
                      </div>
                    </div>
                    <div className="flex justify-between items-center text-xs font-semibold text-gray-600">
                      <span>Dinner Time</span>
                      <div className="flex items-center gap-1">
                        <input type="time" defaultValue="21:00" className="border border-green-300 rounded px-1 bg-white focus:outline-none" /> to <input type="time" defaultValue="21:30" className="border border-green-300 rounded px-1 bg-white focus:outline-none" />
                      </div>
                    </div>
                    <div className="flex justify-between items-center text-xs font-semibold text-gray-600">
                      <span>Tea Break 2</span>
                      <div className="flex items-center gap-1">
                        <input type="time" defaultValue="23:45" className="border border-green-300 rounded px-1 bg-white focus:outline-none" /> to <input type="time" defaultValue="23:59" className="border border-green-300 rounded px-1 bg-white focus:outline-none" />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Third Shift */}
            <div className="bg-[#f0fdf4] border border-[#bbf7d0] rounded-lg p-3">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-bold text-[#15803d]">Third Shift</span>
                <div className="flex items-center gap-1 text-xs font-semibold text-gray-700">
                  <input type="time" value={shift3Start} onChange={e => setShift3Start(e.target.value)} className="border border-green-300 rounded px-1 bg-white focus:outline-none" />
                  <span>to</span>
                  <input type="time" value={shift3End} onChange={e => setShift3End(e.target.value)} className="border border-green-300 rounded px-1 bg-white focus:outline-none" />
                </div>
              </div>
              <div className="relative w-full mt-2">
                <div 
                  className="w-full text-xs p-2.5 border border-green-300 rounded bg-white text-gray-700 flex justify-between items-center cursor-pointer shadow-sm"
                  onClick={() => setOpenDropdown(openDropdown === 3 ? null : 3)}
                >
                  <span className="font-medium text-gray-500">Set Break Timings</span>
                  <span className="text-gray-400 text-[10px]">▼</span>
                </div>
                {openDropdown === 3 && (
                  <div className="absolute z-20 bottom-full mb-1 w-full bg-[#f0fdf4] border border-green-300 rounded-lg shadow-xl p-3 flex flex-col gap-3">
                    <div className="flex justify-between items-center text-xs font-semibold text-gray-600">
                      <span>Tea Break 1</span>
                      <div className="flex items-center gap-1">
                        <input type="time" defaultValue="02:15" className="border border-green-300 rounded px-1 bg-white focus:outline-none" /> to <input type="time" defaultValue="02:30" className="border border-green-300 rounded px-1 bg-white focus:outline-none" />
                      </div>
                    </div>
                    <div className="flex justify-between items-center text-xs font-semibold text-gray-600">
                      <span>Rest Time</span>
                      <div className="flex items-center gap-1">
                        <input type="time" defaultValue="03:00" className="border border-green-300 rounded px-1 bg-white focus:outline-none" /> to <input type="time" defaultValue="03:30" className="border border-green-300 rounded px-1 bg-white focus:outline-none" />
                      </div>
                    </div>
                    <div className="flex justify-between items-center text-xs font-semibold text-gray-600">
                      <span>Tea Break 2</span>
                      <div className="flex items-center gap-1">
                        <input type="time" defaultValue="06:00" className="border border-green-300 rounded px-1 bg-white focus:outline-none" /> to <input type="time" defaultValue="06:15" className="border border-green-300 rounded px-1 bg-white focus:outline-none" />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

        </div>

        <button 
          onClick={() => navigate('/app')} 
          className="w-full bg-[#15803d] text-white font-bold py-4 rounded-xl flex items-center justify-center transition-colors shadow-lg active:bg-green-800 mt-2"
        >
          START MONITORING →
        </button>

      </div>
    </div>
  );
}
