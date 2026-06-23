import React, { useState, useEffect } from 'react';
import { MessageSquare } from 'lucide-react';

export default function LiveMonitoring() {
  const monitoringData = [
    { id: 1, date: "18/06/26", time: "11:06:16", reading: "026.0021", offset: "0", status: "ACCEPTED", airGaugeId: "2", channel: "1", drawing: "026.0050", userId: "567", componentId: "sridharrao" },
    { id: 2, date: "18/06/26", time: "11:06:16", reading: "026.0011", offset: "0", status: "ACCEPTED", airGaugeId: "2", channel: "1", drawing: "026.0050", userId: "567", componentId: "sridharrao" },
    { id: 3, date: "18/06/26", time: "11:06:16", reading: "026.0021", offset: "0", status: "ACCEPTED", airGaugeId: "2", channel: "1", drawing: "026.0050", userId: "567", componentId: "sridharrao" },
    { id: 4, date: "18/06/26", time: "11:06:16", reading: "026.0001", offset: "0", status: "ACCEPTED", airGaugeId: "2", channel: "1", drawing: "026.0050", userId: "567", componentId: "sridharrao" },
    { id: 5, date: "18/06/26", time: "11:06:16", reading: "026.0031", offset: "0", status: "ACCEPTED", airGaugeId: "2", channel: "1", drawing: "026.0050", userId: "567", componentId: "sridharrao" },
    { id: 6, date: "18/06/26", time: "11:06:16", reading: "026.0015", offset: "0", status: "ACCEPTED", airGaugeId: "2", channel: "1", drawing: "026.0050", userId: "567", componentId: "sridharrao" },
    { id: 7, date: "18/06/26", time: "11:06:16", reading: "026.0025", offset: "0", status: "ACCEPTED", airGaugeId: "2", channel: "1", drawing: "026.0050", userId: "567", componentId: "sridharrao" },
    { id: 8, date: "18/06/26", time: "11:06:16", reading: "026.0005", offset: "0", status: "ACCEPTED", airGaugeId: "2", channel: "1", drawing: "026.0050", userId: "567", componentId: "sridharrao" },
    { id: 9, date: "18/06/26", time: "11:06:16", reading: "026.0019", offset: "0", status: "ACCEPTED", airGaugeId: "2", channel: "1", drawing: "026.0050", userId: "567", componentId: "sridharrao" },
    { id: 10, date: "18/06/26", time: "11:06:16", reading: "026.0029", offset: "0", status: "ACCEPTED", airGaugeId: "2", channel: "1", drawing: "026.0050", userId: "567", componentId: "sridharrao" },
  ];
  const [modalOpen, setModalOpen] = useState(true);
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

    // Save request to localStorage so AdminPage can see it
    const requests = JSON.parse(localStorage.getItem('reportRequests') || '[]');
    requests.push({ phone, time: new Date().toLocaleTimeString(), date: new Date().toLocaleDateString() });
    localStorage.setItem('reportRequests', JSON.stringify(requests));

    const message = encodeURIComponent("Cherry Precision Daily Report\n\nMachine: Master Air Gauge\nLatest Reading: 2.155 mm\nStatus: OK\n\nPlease check the dashboard for the full data export.");
    const waUrl = `https://wa.me/91${phone}?text=${message}`;
    window.open(waUrl, '_blank');
    setModalOpen(false);
  };

  return (
    <div className="flex flex-col items-center bg-[#f3f4f6] min-h-full p-4 relative pb-20 font-sans">
      
      {/* Title Header */}
      <div className="flex items-center justify-between w-full mb-4 bg-white p-3 rounded-xl shadow-sm border border-gray-200">
        <h1 className="text-lg font-bold text-black flex items-center gap-2">
          <span className="text-[#8c1c1c] text-xl font-black">T</span> Live Data Monitoring
        </h1>
        <div className="flex items-center gap-1 text-[10px] font-bold text-[#15803d] uppercase tracking-wider bg-[#f0fdf4] px-2 py-1 rounded border border-[#bbf7d0]">
          <div className="w-2 h-2 rounded-full bg-[#15803d] animate-pulse"></div> LIVE
        </div>
      </div>

      {/* Data Table replacing cards */}
      <div className="w-full bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mb-4">
        <div className="overflow-x-auto">
          <table className="w-full text-left whitespace-nowrap text-[11px]">
            <thead className="bg-[#f0fdf4] border-b border-gray-200 text-[#15803d]">
              <tr>
                <th className="px-3 py-3 font-bold">Date</th>
                <th className="px-3 py-3 font-bold">Time</th>
                <th className="px-3 py-3 font-bold">Reading</th>
                <th className="px-3 py-3 font-bold">Offset</th>
                <th className="px-3 py-3 font-bold">Status</th>
                <th className="px-3 py-3 font-bold">AirGauge ID</th>
                <th className="px-3 py-3 font-bold">Channel</th>
                <th className="px-3 py-3 font-bold">Drawing</th>
                <th className="px-3 py-3 font-bold">User ID</th>
                <th className="px-3 py-3 font-bold">Component ID</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-gray-700">
              {monitoringData.map((data, index) => (
                <tr key={data.id} className={index % 2 === 0 ? "bg-white" : "bg-[#f8fafc]"}>
                  <td className="px-3 py-2">{data.date}</td>
                  <td className="px-3 py-2">{data.time}</td>
                  <td className="px-3 py-2 font-bold text-[#15803d]">{data.reading}</td>
                  <td className="px-3 py-2">{data.offset}</td>
                  <td className="px-3 py-2 font-bold text-[#15803d]">{data.status}</td>
                  <td className="px-3 py-2">{data.airGaugeId}</td>
                  <td className="px-3 py-2">{data.channel}</td>
                  <td className="px-3 py-2">{data.drawing}</td>
                  <td className="px-3 py-2">{data.userId}</td>
                  <td className="px-3 py-2">{data.componentId}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      
      {/* WhatsApp Action Button */}
      <div className="w-full mt-2 flex flex-col items-center gap-2">
        <button onClick={() => setModalOpen(true)} className="px-4 py-3 bg-[#25D366] text-white font-bold rounded-xl shadow-sm text-sm flex items-center justify-center gap-2 w-full transition-transform active:scale-95">
          <span>💬</span> Request Live Report via WhatsApp
        </button>
        {hasAutoSent && (
          <p className="text-[10px] text-[#15803d] font-bold text-center bg-[#f0fdf4] px-3 py-1.5 rounded-lg border border-[#bbf7d0]">
            Report successfully requested.
          </p>
        )}
      </div>

      {/* Message Overlay Modal (Absolute to wrapper) */}
      {modalOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setModalOpen(false)}></div>
          <div className="relative bg-white w-full max-w-sm rounded-2xl p-6 shadow-2xl border border-gray-100">
            <h2 className="text-lg font-bold leading-tight mb-4 flex items-center gap-2 text-black">
              <span className="text-[#25D366]">💬</span> WhatsApp Alert Settings
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
              Enter a mobile number. The current Live Monitoring data will be immediately forwarded to this number via WhatsApp.
            </p>
            <div className="flex justify-end gap-3">
              <button onClick={() => setModalOpen(false)} className="px-4 py-2.5 bg-gray-100 rounded-xl text-sm font-bold text-gray-700">Cancel</button>
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
