import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { calculateSPC } from '../utils/spcCalculations';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ReferenceLine, ResponsiveContainer } from 'recharts';
import { Calendar, Clock, BarChart2, MoveHorizontal, Info, Tag, Activity, FileText, User, Settings } from 'lucide-react';

export default function LiveMonitoring() {
  const location = useLocation();
  const [currentGauge, setCurrentGauge] = useState(location.state?.selectedGauge || "ALL");

  const [erpData, setErpData] = useState(null);
  const [liveReading, setLiveReading] = useState(null);
  const [monitoringData, setMonitoringData] = useState([]);
  const [readingBuffers, setReadingBuffers] = useState({});
  const [allSpcMetrics, setAllSpcMetrics] = useState({});
  const [operatorNameMap, setOperatorNameMap] = useState({});

  useEffect(() => {
    // Load user mappings from localStorage to display real names
    const savedUsers = JSON.parse(localStorage.getItem('savedUsers') || '[]');
    const mapping = {};
    savedUsers.forEach(u => {
      if (u.userId) mapping[u.userId] = u.operatorName;
    });
    setOperatorNameMap(mapping);
    
    // Fetch ERP Data
    const apiHost = window.location.hostname;
    fetch(`http://${apiHost}:8005/api/erp/current-order`)
      .then(res => res.json())
      .then(data => setErpData(data))
      .catch(err => {
        console.error("ERP fetch error:", err);
        // Mock data for UI preview
        setErpData({
          part_number: "PN-89024",
          work_order_id: "WO-2026-X9",
          completed_quantity: 450,
          target_quantity: 1000,
          customer: "TATA Motors"
        });
      });
  }, []);

  useEffect(() => {
    // Clear buffers when component mounts
    setReadingBuffers({});
    setLiveReading(null);
    setAllSpcMetrics({});

    const wsHost = window.location.hostname;
    const ws = new WebSocket(`ws://${wsHost}:8005/ws/live-data`);

    const processIncomingData = (data) => {
      if (data.type === "DISCONNECT") {
        setMonitoringData([]);
        setLiveReading(null);
        return;
      }

      const incomingGaugeId = data.machine_id || "AG01";

      if (currentGauge === "ALL" || incomingGaugeId === currentGauge) {
        setLiveReading(data);
      }

      const gaugeNum = parseInt(incomingGaugeId.replace("AG", ""));
      if (gaugeNum >= 1 && gaugeNum <= 10) {
        setReadingBuffers(prev => {
          const currentBuffer = prev[incomingGaugeId] || [];
          const newBuffer = [data.reading, ...currentBuffer].slice(0, 50);
          
          if (newBuffer.length >= 5) {
            const metrics = calculateSPC([...newBuffer].reverse());
            setAllSpcMetrics(prevMetrics => ({ ...prevMetrics, [incomingGaugeId]: metrics }));
          }
          
          return { ...prev, [incomingGaugeId]: newBuffer };
        });

        setMonitoringData(prev => {
          const newData = {
            id: Date.now() + Math.random(),
            date: new Date().toLocaleDateString(),
            time: data.timestamp || new Date().toLocaleTimeString(),
            reading: data.reading ? parseFloat(data.reading).toFixed(4) : "0.0000",
            offset: "0",
            status: data.status ? data.status.toUpperCase() : "ACCEPTED",
            airGaugeId: incomingGaugeId,
            operator: data.operator || "admin",
            channel: "1",
            drawing: "DEF-202",
            userId: data.operator || "admin",
            componentId: "stream"
          };
          return [newData, ...prev].slice(0, 50);
        });
      }
    };

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      processIncomingData(data);
    };

    ws.onerror = (error) => {
      console.error("WebSocket error:", error);
    };

    ws.onclose = () => {
      // Intentionally doing nothing on close.
      // We want it to remain showing just what was received from the live connection.
    };

    return () => {
      ws.close();
    };
  }, [currentGauge]);

  return (
    <div className="flex flex-col items-center bg-[#f3f4f6] min-h-full p-4 relative pb-20 font-sans">
      
      {/* Title Header */}
      <div className="flex items-center justify-between w-full mb-4 bg-white p-3 rounded-xl shadow-sm border border-gray-200">
        <h1 className="text-lg font-bold text-black flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-red-600 animate-pulse shadow-[0_0_8px_rgba(220,38,38,0.8)]"></div> Live Data Monitoring
        </h1>
        <div className="flex items-center gap-1 text-[10px] font-bold text-[#15803d] uppercase tracking-wider bg-[#f0fdf4] px-2 py-1 rounded border border-[#bbf7d0]">
          <div className="w-2 h-2 rounded-full bg-[#15803d] animate-pulse"></div> LIVE
        </div>
      </div>

      {/* ERP Context Card */}
      <div className="w-full bg-[#f8fafc] border border-gray-200 rounded-xl p-4 shadow-sm mb-4">
        <h2 className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-2 flex items-center gap-2">
          <span>🏭</span> ERP Work Order
        </h2>
        {erpData ? (
          <div className="grid grid-cols-2 gap-y-2 text-sm">
            <div className="text-gray-600">Part Number:</div>
            <div className="font-bold text-black">{erpData.part_number}</div>
            
            <div className="text-gray-600">Work Order:</div>
            <div className="font-bold text-[#15803d]">{erpData.work_order_id}</div>
            
            <div className="text-gray-600">Target Qty:</div>
            <div className="font-bold text-black">{erpData.completed_quantity} / {erpData.target_quantity}</div>
            
            <div className="text-gray-600">Customer:</div>
            <div className="font-bold text-black">{erpData.customer}</div>
          </div>
        ) : (
          <div className="text-sm text-gray-500 italic">Loading ERP Data...</div>
        )}
      </div>

      {/* Big Live Value Display */}
      <div className="w-full bg-white border border-[#bbf7d0] rounded-xl p-6 shadow-sm mb-4 text-center relative overflow-hidden">
        <div className="absolute top-0 left-0 w-1.5 h-full bg-[#15803d]"></div>
        
        <div className="flex justify-between items-center mb-2 px-2">
            <h2 className="text-xs font-bold text-[#15803d] uppercase tracking-wide">Air Gauge Current Reading</h2>
            <div className="text-[10px] text-gray-500 font-semibold bg-gray-50 px-2 py-1 rounded border border-gray-100 flex items-center gap-1">
               Air Gauge: 
               <select 
                 className="bg-white border border-gray-300 text-black font-bold rounded px-1 py-0.5"
                 value={currentGauge}
                 onChange={(e) => setCurrentGauge(e.target.value)}
               >
                 <option value="ALL">ALL</option>
                 {['AG01','AG02','AG03','AG04','AG05','AG06','AG07','AG08','AG09','AG10'].map(ag => (
                   <option key={ag} value={ag}>{ag}</option>
                 ))}
               </select> 
               <span className="ml-1">| Employee: <span className="text-black font-bold">
                 {currentGauge === 'ALL' ? 'Multiple' : liveReading?.operator ? `${liveReading.operator} ${operatorNameMap[liveReading.operator] ? `(${operatorNameMap[liveReading.operator]})` : ''}` : 'Wait...'}
               </span></span>
            </div>
        </div>

        <div className="text-4xl font-black text-[#15803d] font-mono tracking-tight">
          {liveReading ? `${parseFloat(liveReading.reading).toFixed(4)} mm` : '--.---- mm'}
        </div>
        <div className="flex justify-center items-center gap-2 mt-2">
          <div className={`text-xs font-bold px-2 py-1 rounded ${liveReading?.status === 'Rejected' ? 'bg-[#fef2f2] text-[#b91c1c]' : liveReading?.status === 'Rework' ? 'bg-[#fff7ed] text-[#ea580c]' : 'bg-[#f0fdf4] text-[#15803d]'}`}>
            {liveReading?.status || 'Waiting for stream...'}
          </div>
          <div className="text-xs font-bold px-2 py-1 rounded bg-[#fff7ed] border border-[#fed7aa] text-[#ea580c] shadow-sm">
            SPC (CPK): {allSpcMetrics[currentGauge] ? allSpcMetrics[currentGauge].cpk : '--'}
          </div>
        </div>
      </div>


      {/* Data Table */}
      <div className="w-full bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mb-4">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-[10px] leading-tight">
            <thead className="bg-[#f0fdf4] border-b border-gray-200 text-[#15803d]">
              <tr>
                <th className="px-2 py-2 font-bold whitespace-nowrap border border-gray-200 text-gray-800"><div className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5 text-[#15803d]" /> Date</div></th>
                <th className="px-2 py-2 font-bold whitespace-nowrap border border-gray-200 text-gray-800"><div className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5 text-[#15803d]" /> Time</div></th>
                <th className="px-2 py-2 font-bold whitespace-nowrap border border-gray-200 text-gray-800"><div className="flex items-center gap-1.5"><BarChart2 className="w-3.5 h-3.5 text-[#15803d]" /> Reading</div></th>
                <th className="px-2 py-2 font-bold whitespace-nowrap border border-gray-200 text-gray-800"><div className="flex items-center gap-1.5"><MoveHorizontal className="w-3.5 h-3.5 text-[#15803d]" /> Offset</div></th>
                <th className="px-2 py-2 font-bold whitespace-nowrap border border-gray-200 text-gray-800"><div className="flex items-center gap-1.5"><Info className="w-3.5 h-3.5 text-[#15803d]" /> Status</div></th>
                <th className="px-2 py-2 font-bold whitespace-nowrap border border-gray-200 text-gray-800"><div className="flex items-center gap-1.5"><Tag className="w-3.5 h-3.5 text-[#15803d]" /> AirGauge ID</div></th>
                <th className="px-2 py-2 font-bold whitespace-nowrap border border-gray-200 text-gray-800"><div className="flex items-center gap-1.5"><Activity className="w-3.5 h-3.5 text-[#15803d]" /> Channel</div></th>
                <th className="px-2 py-2 font-bold whitespace-nowrap border border-gray-200 text-gray-800"><div className="flex items-center gap-1.5"><FileText className="w-3.5 h-3.5 text-[#15803d]" /> Drawing</div></th>
                <th className="px-2 py-2 font-bold whitespace-nowrap border border-gray-200 text-gray-800"><div className="flex items-center gap-1.5"><User className="w-3.5 h-3.5 text-[#15803d]" /> User ID</div></th>
                <th className="px-2 py-2 font-bold whitespace-nowrap border border-gray-200 text-gray-800"><div className="flex items-center gap-1.5"><Settings className="w-3.5 h-3.5 text-[#15803d]" /> Component ID</div></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-[10px]">
              {monitoringData.length === 0 ? (
                <tr>
                  <td colSpan="10" className="px-2 py-6 text-center text-gray-400 italic border border-gray-200">Listening for live stream...</td>
                </tr>
              ) : (
                monitoringData.map((row, index) => (
                  <tr key={index} className="hover:bg-gray-100 transition-colors even:bg-gray-50">
                    <td className="px-2 py-2 text-gray-800 border border-gray-200 font-medium whitespace-nowrap">{row.date}</td>
                    <td className="px-2 py-2 text-gray-800 border border-gray-200 font-medium whitespace-nowrap">{row.time}</td>
                    <td className="px-2 py-2 text-gray-800 border border-gray-200 font-medium whitespace-nowrap">{row.reading}</td>
                    <td className="px-2 py-2 text-gray-800 border border-gray-200 font-medium whitespace-nowrap">{row.offset}</td>
                    <td className={`px-2 py-2 border border-gray-200 font-medium whitespace-nowrap text-gray-800`}>
                      {row.status}
                    </td>
                    <td className="px-2 py-2 text-gray-800 border border-gray-200 font-medium whitespace-nowrap">{row.airGaugeId}</td>
                    <td className="px-2 py-2 text-gray-800 border border-gray-200 font-medium whitespace-nowrap">{row.channel || '1'}</td>
                    <td className="px-2 py-2 text-gray-800 border border-gray-200 font-medium whitespace-nowrap">{row.drawing}</td>
                    <td className="px-2 py-2 text-gray-800 border border-gray-200 font-medium whitespace-nowrap">
                      {row.userId} {operatorNameMap[row.userId] ? `(${operatorNameMap[row.userId]})` : ''}
                    </td>
                    <td className="px-2 py-2 text-gray-800 border border-gray-200 font-medium whitespace-nowrap">{row.componentId}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
      
    </div>
  );
}
