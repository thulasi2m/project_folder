import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Save, Trash2, ChevronDown } from 'lucide-react';
import logoImage from '../assets/cherry_full_logo.png'; // Make sure this is a transparent or white logo if possible, but we'll use what's there

const initialChannels = {
  'CH1': { selected: true, drawingValue: '', lowTolerance: '', highTolerance: '' },
  'CH2': { selected: false, drawingValue: '', lowTolerance: '', highTolerance: '' },
  'CH3': { selected: false, drawingValue: '', lowTolerance: '', highTolerance: '' },
  'CH4': { selected: false, drawingValue: '', lowTolerance: '', highTolerance: '' },
  'CH6': { selected: false, drawingValue: '', lowTolerance: '', highTolerance: '' },
  'CH7': { selected: false, drawingValue: '', lowTolerance: '', highTolerance: '' },
  'CH8': { selected: false, drawingValue: '', lowTolerance: '', highTolerance: '' },
};

export default function ComponentSetup() {
  const navigate = useNavigate();
  const { id } = useParams();
  
  // State for form
  const [gaugeId, setGaugeId] = useState(`AG${id || '1'}`);
  const [numGauges, setNumGauges] = useState(10);
  const [type, setType] = useState('Shaft');
  
  const [channelsData, setChannelsData] = useState(initialChannels);

  React.useEffect(() => {
    const savedNum = localStorage.getItem('numGauges');
    if (savedNum) {
      setNumGauges(parseInt(savedNum, 10));
    }

    const savedSetups = JSON.parse(localStorage.getItem('savedComponentSetups') || '[]');
    const existing = savedSetups.find(s => s.gaugeId === `AG${id || '1'}`);
    if (existing) {
      setType(existing.type || 'Shaft');
      if (existing.channelsData) {
        setChannelsData(existing.channelsData);
      } else if (existing.channel) {
        // Backwards compatibility
        setChannelsData(prev => ({
          ...initialChannels,
          [existing.channel]: { 
            selected: true, 
            drawingValue: existing.drawingValue || '', 
            lowTolerance: existing.lowTolerance || '', 
            highTolerance: existing.highTolerance || '' 
          }
        }));
      }
    }
  }, [id]);

  const handleSave = () => {
    const setup = { gaugeId, type, channelsData };
    const saved = JSON.parse(localStorage.getItem('savedComponentSetups') || '[]');
    const existingIndex = saved.findIndex(s => s.gaugeId === gaugeId);
    if (existingIndex >= 0) {
      saved[existingIndex] = setup;
    } else {
      saved.push(setup);
    }
    localStorage.setItem('savedComponentSetups', JSON.stringify(saved));
    alert('Setup saved successfully!');
  };

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this setup?')) {
      const saved = JSON.parse(localStorage.getItem('savedComponentSetups') || '[]');
      const filtered = saved.filter(s => s.gaugeId !== gaugeId);
      localStorage.setItem('savedComponentSetups', JSON.stringify(filtered));
      setChannelsData(initialChannels);
      setType('Shaft');
      alert('Setup deleted successfully!');
    }
  };

  const toggleChannel = (ch) => {
    setChannelsData(prev => ({
      ...prev,
      [ch]: { ...prev[ch], selected: !prev[ch].selected }
    }));
  };

  const updateChannelData = (ch, field, value) => {
    setChannelsData(prev => ({
      ...prev,
      [ch]: { ...prev[ch], [field]: value }
    }));
  };

  return (
    <div className="flex flex-col min-h-screen bg-white font-sans">
      {/* Header */}
      <div className="flex flex-col w-full">
        <div className="bg-[#22c55e] flex justify-center items-center py-3">
          <div className="flex items-center gap-2">
            <div className="bg-white p-1 rounded-lg">
              <img src={logoImage} alt="Cherry Logo" className="h-7 object-contain" />
            </div>
            <div className="flex flex-col items-center">
              <span className="font-black text-xl text-white tracking-wider leading-tight">CHERRY</span>
              <span className="text-[10px] text-white leading-tight">Precision Products</span>
            </div>
          </div>
        </div>
        <div className="bg-white flex items-center px-4 py-3 border-b border-gray-200">
          <button 
            onClick={() => navigate(-1)} 
            className="flex items-center gap-1 text-black font-medium"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back</span>
          </button>
        </div>
      </div>

      {/* Form Content */}
      <div className="flex-1 p-4 overflow-y-auto pb-24">
        
        {/* AirGauge ID */}
        <div className="mb-4">
          <label className="block text-black font-bold mb-1">AirGauge ID:</label>
          <div className="relative">
            <select 
              value={gaugeId}
              onChange={(e) => setGaugeId(e.target.value)}
              className="w-full p-3 border-2 border-[#22c55e] rounded-lg appearance-none bg-white font-medium focus:outline-none"
            >
              {[...Array(numGauges)].map((_, i) => (
                <option key={i} value={`AG${i+1}`}>AG{i+1}</option>
              ))}
            </select>
            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
              <div className="bg-[#e6f0eb] p-1 rounded">
                <ChevronDown className="w-5 h-5 text-[#22c55e]" />
              </div>
            </div>
          </div>
        </div>

        {/* Item */}
        <div className="mb-4">
          <label className="block text-black font-bold mb-1">Item:</label>
          <div className="relative">
            <select className="w-full p-3 border-2 border-[#22c55e] rounded-lg appearance-none bg-white font-medium focus:outline-none">
              <option value=""></option>
            </select>
            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
              <div className="bg-[#e6f0eb] p-1 rounded">
                <ChevronDown className="w-5 h-5 text-[#22c55e]" />
              </div>
            </div>
          </div>
        </div>
        {/* Type */}
        <div className="mb-4">
          <label className="block text-black font-bold mb-1">Type:</label>
          <div className="flex flex-col gap-2 w-32">
            <label className="flex items-center gap-2 p-2 border-2 border-[#22c55e] rounded-lg bg-[#e6f0eb]">
              <div className={`w-5 h-5 rounded-full border-2 border-[#22c55e] flex items-center justify-center`}>
                {type === 'Shaft' && <div className="w-2.5 h-2.5 rounded-full bg-[#22c55e]"></div>}
              </div>
              <input type="radio" name="type" value="Shaft" checked={type === 'Shaft'} onChange={() => setType('Shaft')} className="hidden" />
              <span className="font-medium text-[#22c55e]">Shaft</span>
            </label>
            <label className="flex items-center gap-2 p-2 border-2 border-[#22c55e] rounded-lg bg-[#e6f0eb]">
              <div className={`w-5 h-5 rounded-full border-2 border-[#22c55e] flex items-center justify-center`}>
                {type === 'Hole' && <div className="w-2.5 h-2.5 rounded-full bg-[#22c55e]"></div>}
              </div>
              <input type="radio" name="type" value="Hole" checked={type === 'Hole'} onChange={() => setType('Hole')} className="hidden" />
              <span className="font-medium text-[#22c55e]">Hole</span>
            </label>
          </div>
        </div>

        {/* Select Channel */}
        <div className="mb-4">
          <label className="block text-black font-bold mb-2">Select Channel:</label>
          <div className="grid grid-cols-4 gap-y-3 gap-x-2">
            {Object.keys(channelsData).map(ch => (
              <label key={ch} className="flex items-center gap-1 cursor-pointer">
                <div className={`w-5 h-5 rounded border-2 border-[#22c55e] flex items-center justify-center`}>
                  {channelsData[ch].selected && <div className="w-3 h-3 rounded-sm bg-[#22c55e]"></div>}
                </div>
                <input type="checkbox" checked={channelsData[ch].selected} onChange={() => toggleChannel(ch)} className="hidden" />
                <span className="text-sm font-medium">{ch}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Selected Channel Inputs */}
        <div className="mb-8 space-y-6">
          {Object.keys(channelsData).filter(ch => channelsData[ch].selected).map(ch => (
            <div key={ch} className="p-4 bg-[#f0fdf4] border-2 border-[#22c55e] rounded-xl relative mt-4">
              <div className="absolute -top-3 left-3 bg-[#22c55e] text-white px-2 py-0.5 rounded text-xs font-bold shadow-sm">
                {ch} Settings
              </div>
              
              <div className="mt-2 space-y-4">
                <div>
                  <label className="block text-black font-bold mb-1 text-sm">Drawing Value (mm):</label>
                  <input 
                    type="text" 
                    value={channelsData[ch].drawingValue}
                    onChange={(e) => updateChannelData(ch, 'drawingValue', e.target.value)}
                    className="w-full p-2.5 border border-[#22c55e] rounded-lg focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-black font-bold mb-1 text-sm">Low Tolerance (mm):</label>
                  <input 
                    type="text" 
                    value={channelsData[ch].lowTolerance}
                    onChange={(e) => updateChannelData(ch, 'lowTolerance', e.target.value)}
                    className="w-full p-2.5 border border-[#22c55e] rounded-lg focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-black font-bold mb-1 text-sm">High Tolerance (mm):</label>
                  <input 
                    type="text" 
                    value={channelsData[ch].highTolerance}
                    onChange={(e) => updateChannelData(ch, 'highTolerance', e.target.value)}
                    className="w-full p-2.5 border border-[#22c55e] rounded-lg focus:outline-none"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {/* Action Buttons */}
        <div className="flex gap-4 w-full">
          <button onClick={handleSave} className="flex-1 bg-[#22c55e] text-white py-4 rounded-xl flex items-center justify-center gap-2 font-bold shadow-lg">
            <Save className="w-5 h-5" />
            Save Setup
          </button>
          <button onClick={handleDelete} className="flex-1 bg-[#dc2626] text-white py-4 rounded-xl flex items-center justify-center gap-2 font-bold shadow-lg">
            <Trash2 className="w-5 h-5" />
            Delete Selected
          </button>
        </div>
        
      </div>

    </div>
  );
}
