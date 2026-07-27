import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { MessageSquare } from 'lucide-react';
export default function Reports() {
  const [showGraph, setShowGraph] = useState(false);
  const [waModalOpen, setWaModalOpen] = useState(false);
  const [phone, setPhone] = useState("");
  const [hasAutoSent, setHasAutoSent] = useState(false);

  useEffect(() => {
    if (phone.length === 10 && !hasAutoSent) {
      handleSendWhatsApp();
      setHasAutoSent(true);
    } else if (phone.length !== 10) {
      setHasAutoSent(false);
    }
  }, [phone, hasAutoSent]);

  const handleSendWhatsApp = () => {
    if (!phone || phone.length < 10) {
      alert("Please enter a valid mobile number.");
      return;
    }

    const message = encodeURIComponent("Cherry Precision: Your requested Excel Data Report is ready for download.\n\nLink: https://example.com/download/report.xlsx");
    const waUrl = `https://wa.me/91${phone}?text=${message}`;
    window.open(waUrl, '_blank');
    setWaModalOpen(false);
  };

  const dummyData = [
    { name: '08:00', value: 20 },
    { name: '10:00', value: 45 },
    { name: '12:00', value: 28 },
    { name: '14:00', value: 80 },
    { name: '16:00', value: 39 },
    { name: '18:00', value: 55 },
  ];

  return (
    <div className="flex flex-col bg-white min-h-[calc(100vh-120px)] p-4 font-sans">
      <h1 className="text-center text-xl font-bold mb-4">Data Reports</h1>
      
      <div className="w-full bg-gray-500 text-white text-center py-3 rounded-lg text-lg font-medium mb-4 flex items-center justify-center gap-2">
        Collapse Filters <span className="text-sm">∨</span>
      </div>

      <div className="space-y-3 w-full">
        <input type="datetime-local" className="w-full border-2 border-gray-400 rounded-lg p-3 text-gray-700 bg-white" placeholder="Date Time (From)" />
        <input type="datetime-local" className="w-full border-2 border-gray-400 rounded-lg p-3 text-gray-700 bg-white" placeholder="Date Time (To)" />
        <select className="w-full border-2 border-gray-400 rounded-lg p-3 text-gray-700 bg-white">
          <option value="">Select Item</option>
          <option value="item1">Item 1</option>
          <option value="item2">Item 2</option>
        </select>
        <select className="w-full border-2 border-gray-400 rounded-lg p-3 text-gray-700 bg-white">
          <option value="">Select Operator</option>
          <option value="op1">Operator A</option>
          <option value="op2">Operator B</option>
        </select>
        <select className="w-full border-2 border-gray-400 rounded-lg p-3 text-gray-700 bg-white">
          <option value="">Select Machine ID</option>
          <option value="m1">Machine 01</option>
          <option value="m2">Machine 02</option>
        </select>
        <select className="w-full border-2 border-gray-400 rounded-lg p-3 text-gray-700 bg-white">
          <option value="">Select Customer</option>
          <option value="c1">Customer X</option>
          <option value="c2">Customer Y</option>
        </select>
      </div>

      <div className="flex flex-wrap gap-4 w-full mt-4 mb-6">
        <button 
          onClick={() => setShowGraph(true)}
          className="flex-1 bg-[#2563eb] text-white font-bold py-3 px-4 rounded-lg text-lg min-w-[120px]"
        >
          Analyze
        </button>
        <button 
          onClick={() => {
            setShowGraph(false);
            alert("Data cleared.");
          }}
          className="flex-1 bg-[#dc2626] text-white font-bold py-3 px-4 rounded-lg text-lg min-w-[120px]">
          Delete
        </button>
        <button className="w-full bg-[#15803d] text-white font-bold py-3 px-4 rounded-lg text-lg" onClick={() => setWaModalOpen(true)}>
          Download to Excel (via WhatsApp)
        </button>
      </div>

      <div className="w-full pb-8">
        {showGraph ? (
          <div className="w-full h-[300px] bg-white border border-gray-300 rounded-lg p-2 shadow-sm">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={dummyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="value" stroke="#8c1c1c" activeDot={{ r: 8 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="w-full border border-gray-300 rounded-lg py-4 text-center text-gray-700 bg-white shadow-sm">
              No data available
            </div>
          </div>
        )}
      </div>

      {/* WhatsApp Message Overlay Modal */}
      {waModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setWaModalOpen(false)}></div>
          <div className="relative bg-white w-full max-w-sm rounded-2xl p-6 shadow-2xl border border-gray-100">
            <h2 className="text-lg font-bold leading-tight mb-4 flex items-center gap-2 text-black">
              <span className="text-[#25D366]">💬</span> Send Excel Report
            </h2>
            <div className="flex gap-2 mb-4">
              <div className="w-[60px] py-3 px-2 border border-gray-300 rounded-xl text-black bg-gray-50 flex items-center justify-center font-bold">
                +91
              </div>
              <input 
                type="tel" 
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Mobile Number"
                className="flex-1 px-4 py-3 border border-gray-300 rounded-xl bg-white text-black focus:outline-none focus:border-[#25D366]" 
              />
            </div>
            <p className="text-xs text-gray-500 leading-relaxed mb-6 font-medium">
              Enter a mobile number. The download link for the Excel report will be immediately forwarded to this number via WhatsApp.
            </p>
            <div className="flex justify-end gap-3">
              <button onClick={() => setWaModalOpen(false)} className="px-4 py-2.5 bg-gray-100 rounded-xl text-sm font-bold text-gray-700">Cancel</button>
              <button onClick={handleSendWhatsApp} className="px-5 py-2.5 bg-[#25D366] text-white rounded-xl text-sm font-bold flex items-center gap-2 shadow-sm">
                <MessageSquare className="w-4 h-4" /> Send Now
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
