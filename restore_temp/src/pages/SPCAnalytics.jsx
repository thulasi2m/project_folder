import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceArea, ReferenceLine, ComposedChart
} from 'recharts';
import { Settings2, X, Square, ChevronLeft, ChevronRight, Plus, Edit } from 'lucide-react';

const ChartBlock = ({ onAdd }) => {
  const navigate = useNavigate();
  const numGauges = parseInt(localStorage.getItem('numGauges')) || 10;

  const [selectedGauge, setSelectedGauge] = useState("AG1");
  const [selectedChannel, setSelectedChannel] = useState("CH1");
  const [type, setType] = useState('Shaft');
  
  // Dynamic Limits based on localStorage Setup
  const [limits, setLimits] = useState({
    target: 27.110,
    upper: 27.120,
    lower: 27.095
  });

  useEffect(() => {
    const savedSetups = JSON.parse(localStorage.getItem('savedComponentSetups') || '[]');
    const setup = savedSetups.find(s => s.gaugeId === selectedGauge);
    
    if (setup && setup.drawingValue) {
      setType(setup.type || 'Shaft');
      const target = parseFloat(setup.drawingValue);
      const lowOffset = parseFloat(setup.lowTolerance || 0);
      const highOffset = parseFloat(setup.highTolerance || 0);
      
      setLimits({
        target: target,
        lower: target - Math.abs(lowOffset), 
        upper: target + Math.abs(highOffset)
      });
    } else {
      setLimits({ target: 27.110, upper: 27.120, lower: 27.095 });
    }
  }, [selectedGauge]);

  // Generate some mock live data for the selected gauge
  const [chartData, setChartData] = useState([]);
  
  useEffect(() => {
    const points = [];
    for (let i = 0; i < 15; i++) {
      const x = 1664 + i * 2; 
      const range = limits.upper - limits.target;
      const y = limits.target + Math.sin(i * 0.8) * range * 1.5 + (Math.random() - 0.5) * range;
      const val = parseFloat(y.toFixed(3));
      
      const isReject = val > limits.upper || val < limits.lower;
      const isWarning = !isReject && ((val > limits.upper - 0.005 && val <= limits.upper) || (val < limits.lower + 0.005 && val >= limits.lower));
      
      let statusColor = "Green";
      if (isReject) statusColor = "Red";
      else if (isWarning) statusColor = "Yellow";

      points.push({ 
        index: x, 
        value: val,
        statusColor: statusColor,
        employeeId: `EMP${Math.floor(Math.random() * 900 + 100)}`,
        accepted: Math.floor(Math.random() * 50 + 100),
        rejected: isReject ? Math.floor(Math.random() * 5 + 1) : 0,
        rework: isWarning ? Math.floor(Math.random() * 3 + 1) : 0,
        cpc: (1.2 + Math.random() * 0.5).toFixed(2),
        time: new Date(Date.now() - (15 - i) * 60000).toLocaleTimeString("en-IN", { timeZone: "Asia/Kolkata", hour: "2-digit", minute: "2-digit" }) + " IST",
        alert: isReject ? "Out of Control" : isWarning ? "Approaching Limit" : "None"
      });
    }
    setChartData(points);
  }, [selectedGauge, limits]);

  const dataMin = chartData.length > 0 ? Math.min(...chartData.map(d => d.value)) : 0;
  const dataMax = chartData.length > 0 ? Math.max(...chartData.map(d => d.value)) : 0;

  const yDomainMin = Math.min(limits.lower - Math.abs(limits.target - limits.lower) * 0.5, dataMin);
  const yDomainMax = Math.max(limits.upper + Math.abs(limits.upper - limits.target) * 0.5, dataMax);

  const dataRange = dataMax - dataMin;
  const offsetTop = dataRange > 0 ? Math.max(0, Math.min(1, (dataMax - limits.upper) / dataRange)) : 0;
  const offsetBottom = dataRange > 0 ? Math.max(0, Math.min(1, (dataMax - limits.lower) / dataRange)) : 1;

  const topZoneColor = type === 'Shaft' ? '#d97706' : '#dc2626'; 
  const bottomZoneColor = type === 'Shaft' ? '#dc2626' : '#d97706';

  const renderCustomDot = (props) => {
    const { cx, cy, payload } = props;
    let color = "#10b981"; 
    if (payload.value > limits.upper) color = topZoneColor; 
    else if (payload.value < limits.lower) color = bottomZoneColor; 
    return <circle cx={cx} cy={cy} r={6} fill={color} stroke="white" strokeWidth={2.5} filter="url(#glow)" />;
  };

  const renderCustomLabel = (props) => {
    const { x, y, value } = props;
    let color = "#10b981"; 
    if (value > limits.upper) color = topZoneColor; 
    else if (value < limits.lower) color = bottomZoneColor; 
    return (
      <text x={x} y={y} dy={12} fill={color} fontSize={9} fontWeight="bold" textAnchor="middle">
        {value}
      </text>
    );
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      let dotColor = "#10b981"; 
      if (data.value > limits.upper) dotColor = topZoneColor; 
      else if (data.value < limits.lower) dotColor = bottomZoneColor; 

      let bgColor = "bg-[#15803d]"; 
      let borderColor = "border-black border-2"; // ALWAYS BLACK BORDER
      let textColor = "text-green-200";
      let dividerColor = "border-green-600";
      let statusLabel = "Accepted";
      
      if (dotColor === '#dc2626') {
        bgColor = "bg-red-700";
        textColor = "text-red-200";
        dividerColor = "border-red-600";
        statusLabel = "Rejected";
      } else if (dotColor === '#d97706') {
        bgColor = "bg-[#b45309]"; 
        textColor = "text-orange-200";
        dividerColor = "border-orange-600";
        statusLabel = "Rework";
      }

      return (
        <div className={`${bgColor} text-white p-3 rounded-lg shadow-xl text-xs flex flex-col gap-1.5 z-50 min-w-[160px] border ${borderColor}`}>
          <p className={`font-black text-sm border-b ${dividerColor} pb-1 mb-1`}>Current Value: {data.value}</p>
          <div className="grid grid-cols-2 gap-x-2 gap-y-1">
            <span className={textColor}>Status:</span> 
            <span className="font-bold text-white">{statusLabel}</span>
            <span className={textColor}>Employee ID:</span> <span className="font-bold">{data.employeeId || 'EMP314'}</span>
            <span className={textColor}>CPC Value:</span> <span className="font-bold">{data.cpc || '1.34'}</span>
          </div>
          <p className="mt-1"><span className={textColor}>Last Updated:</span> <span className="font-bold">{data.time || new Date().toLocaleTimeString('en-IN', { timeZone: 'Asia/Kolkata', hour: '2-digit', minute: '2-digit' }) + ' IST'}</span></p>
          <p><span className={textColor}>Alerts:</span> <span className="font-bold">{statusLabel === 'Rejected' ? 'Out of Control' : statusLabel === 'Rework' ? 'Needs Rework' : 'None'}</span></p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white border-2 border-gray-300 shadow-sm flex flex-col h-[calc(100vh-120px)] rounded-sm relative mb-4">
      
      {/* Top Control Bar */}
      <div className="flex flex-wrap items-center justify-between p-2 border-b-2 border-gray-300 bg-[#f9fafb]">
        <div className="flex items-center gap-1">
          <div className="flex items-center gap-0.5">
            <span className="bg-purple-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-sm">AirGauge</span>
            <select 
              className="bg-transparent text-gray-700 font-bold text-xs py-0.5 px-0.5 w-8 appearance-none outline-none"
              value={selectedGauge}
              onChange={(e) => setSelectedGauge(e.target.value)}
            >
              {[...Array(numGauges)].map((_,i) => <option key={i} value={`AG${i+1}`}>{`0${i+1}`.slice(-2)}</option>)}
            </select>
          </div>
          
          <div className="flex items-center gap-0.5">
            <span className="bg-blue-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-sm">Channel</span>
            <select 
              className="bg-transparent text-gray-700 font-bold text-xs py-0.5 px-0.5 w-8 appearance-none outline-none"
              value={selectedChannel}
              onChange={(e) => setSelectedChannel(e.target.value)}
            >
              <option value="CH1">CH1</option>
              <option value="CH2">CH2</option>
            </select>
          </div>
          
          {/* Employee Info */}
          <div className="flex items-center ml-1 border border-gray-300 rounded overflow-hidden shadow-sm shrink-0">
            <span className="bg-sky-500 text-white text-[10px] font-bold px-1.5 py-0.5">EMP ID</span>
            <span className="font-black text-[10px] text-gray-800 px-1.5 bg-white h-full flex items-center whitespace-nowrap">EMP314 (John Doe)</span>
          </div>
        </div>
      </div>

      {/* Active Setup Info Bar */}
      <div className="bg-white border-b-2 border-gray-300 px-3 py-1.5 flex justify-between items-center text-[10px] shadow-sm">
        <div className="flex gap-4 w-full justify-around pr-2">
          <div className="flex flex-col items-center"><span className="text-gray-500 font-bold uppercase leading-tight text-center">Drawing<br/>Value</span> <span className="font-black text-gray-800 text-xs mt-1">{limits.target.toFixed(3)} (mm)</span></div>
          <div className="flex flex-col items-center"><span className="text-gray-500 font-bold uppercase leading-tight text-center">Low<br/>Tol</span> <span className="font-black text-red-600 text-xs mt-1">{limits.lower.toFixed(3)} (mm)</span></div>
          <div className="flex flex-col items-center"><span className="text-gray-500 font-bold uppercase leading-tight text-center">High<br/>Tol</span> <span className="font-black text-green-600 text-xs mt-1">{limits.upper.toFixed(3)} (mm)</span></div>
        </div>
        <button 
          onClick={() => navigate(`/setup/${selectedGauge.replace('AG', '')}`)}
          className="flex items-center gap-1 bg-[#115e59] text-white px-2 py-1 rounded-sm shadow-sm hover:bg-[#0f4c48] shrink-0"
        >
          <Edit className="w-3 h-3" />
          <span className="font-bold">Edit Setup</span>
        </button>
      </div>


      {/* Current Reading Display Area */}
      <div className="bg-white border-b border-gray-200 px-3 py-2 flex justify-center items-center relative z-10 shadow-sm">
        <div className="bg-[#22c55e] text-black px-4 py-1.5 rounded-lg shadow-md font-black border-2 border-[#15803d] flex items-center gap-2">
          <span className="text-black uppercase text-xs tracking-wider">Current Reading:</span>
          <span className="text-lg">{chartData.length > 0 ? chartData[chartData.length - 1].value.toFixed(3) : '0.000'} mm</span>
        </div>
      </div>

      {/* Chart Area */}
      <div className="flex-1 w-full relative p-2 pt-6 bg-[#f4f6f8]">
        {/* Current Value Overlay */}
        <div className="absolute top-2 right-4 z-10 bg-white/90 border border-gray-300 rounded px-2 py-1 shadow-sm flex flex-col items-center pointer-events-none">
          <span className="text-[9px] text-gray-500 font-bold uppercase leading-none mb-1">Last Updated</span>
          <span 
            className="text-sm font-black leading-none mb-1" 
            style={{ color: chartData.length > 0 ? (chartData[chartData.length - 1].value > limits.upper ? topZoneColor : chartData[chartData.length - 1].value < limits.lower ? bottomZoneColor : '#15803d') : '#000' }}
          >
            {chartData.length > 0 ? chartData[chartData.length - 1].value.toFixed(3) : '0.000'}
          </span>
          <span className="text-[8px] text-gray-600 font-medium whitespace-nowrap">
            {new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata', day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true })} IST
          </span>
        </div>

        <div className="w-full h-full bg-white relative">
          <ResponsiveContainer width="100%" height="100%" className="focus:outline-none border-none outline-none">
            <ComposedChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 5 }} style={{ border: 'none', outline: 'none' }}>
            <defs>
              <linearGradient id="splitColorLine" x1="0" y1="0" x2="0" y2="1">
                <stop offset={offsetTop} stopColor={topZoneColor} stopOpacity={1} />
                <stop offset={offsetTop} stopColor="#10b981" stopOpacity={1} />
                <stop offset={offsetBottom} stopColor="#10b981" stopOpacity={1} />
                <stop offset={offsetBottom} stopColor={bottomZoneColor} stopOpacity={1} />
              </linearGradient>
              
              <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur in="SourceGraphic" stdDeviation="2" result="coloredBlur" />
                <feMerge>
                  <feMergeNode in="coloredBlur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            {/* Background Zones - Dynamic Colors */}
            <ReferenceArea y1={limits.upper} y2={yDomainMax} fill={topZoneColor} fillOpacity={0.8} />
            <ReferenceArea y1={limits.lower} y2={limits.upper} fill="#e6f0eb" fillOpacity={1} />
            <ReferenceArea y1={yDomainMin} y2={limits.lower} fill={bottomZoneColor} fillOpacity={0.8} />

            <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#9ca3af', strokeWidth: 1, strokeDasharray: '3 3' }} />

            {/* Limit Lines - Colored as requested */}
            <ReferenceLine y={limits.upper} stroke={topZoneColor} strokeDasharray="3 3" strokeWidth={1.5} />
            <ReferenceLine y={limits.target} stroke="#22c55e" strokeDasharray="3 3" strokeWidth={1.5} />
            <ReferenceLine y={limits.lower} stroke={bottomZoneColor} strokeDasharray="3 3" strokeWidth={1.5} />

            <CartesianGrid stroke="#e5e7eb" vertical={true} horizontal={false} />

            <XAxis 
              dataKey="index" 
              stroke="#374151" 
              tick={{ fontSize: 10, fill: '#374151', fontWeight: 'bold' }} 
              axisLine={{stroke: '#9ca3af'}}
              tickLine={{stroke: '#9ca3af'}}
            />
            
            <YAxis 
              domain={[yDomainMin, yDomainMax]} 
              ticks={[limits.lower, limits.target, limits.upper]} 
              stroke="#374151" 
              tick={{ fontSize: 10, fill: '#374151', fontWeight: 'bold' }} 
              axisLine={{stroke: '#9ca3af'}}
              tickLine={{stroke: '#9ca3af'}}
              tickFormatter={(val) => val.toFixed(3)}
            />

            <Line 
              type="linear" 
              dataKey="value" 
              stroke="url(#splitColorLine)" 
              strokeWidth={3} 
              filter="url(#glow)"
              dot={renderCustomDot} 
              isAnimationActive={false}
              label={renderCustomLabel}
            />
          </ComposedChart>
          </ResponsiveContainer>
        </div>
      </div>
      
      {/* Plus Button inside Chart Block, at the very bottom */}
      <div className="bg-[#e5e7eb] px-4 py-2 border-t border-gray-300 flex justify-end shrink-0">
        <button onClick={onAdd} className="p-2 bg-white border border-gray-400 shadow-sm hover:bg-gray-100 rounded transition-colors flex items-center justify-center">
          <Plus className="w-5 h-5 text-gray-800" />
        </button>
      </div>

    </div>
  );
};

export default function SPCAnalytics() {
  const [charts, setCharts] = useState([{ id: 1 }]);

  const addChart = () => {
    setCharts([...charts, { id: Date.now() }]);
  };

  return (
    <div className="flex flex-col min-h-full bg-[#f4f6f8] font-sans pb-[80px] overflow-x-hidden">
      <div className="p-4 w-full flex flex-col">
        {charts.map((chart) => (
          <ChartBlock key={chart.id} onAdd={addChart} />
        ))}
      </div>
    </div>
  );
}
