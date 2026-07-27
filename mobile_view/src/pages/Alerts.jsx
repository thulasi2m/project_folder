import React, { useState, useEffect } from 'react';
import { MessageSquare } from 'lucide-react';

export default function Alerts() {
  const [isSending, setIsSending] = useState(false);
  const [sendSuccess, setSendSuccess] = useState(false);
  const [alerts, setAlerts] = useState([]);

  useEffect(() => {
    const loadAlerts = () => {
      try {
        const stored = JSON.parse(localStorage.getItem('recent_alerts') || '[]');
        setAlerts(stored);
      } catch (e) {
        console.error(e);
      }
    };
    loadAlerts();
    // Poll every 5 seconds for new alerts in case they came in while on this page
    const interval = setInterval(loadAlerts, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleSendWhatsApp = (alert) => {
    setIsSending(true);
    setSendSuccess(false);
    
    // Construct the message
    const message = `🚨 *REJECTION ALERT* 🚨\n\n` +
      `Machine: ${alert.machine}\n` +
      `Part No: ${alert.part_no}\n` +
      `Value: ${alert.value}\n` +
      `Limit: ${alert.limit}\n` +
      `Operator: ${alert.operator}\n` +
      `Reason: ${alert.reason}`;
      
    // Encode for URL
    const encodedMessage = encodeURIComponent(message);
    
    // Primary number requested by user
    const targetPhone = "919688172434";
    
    // Open WhatsApp app directly
    window.open(`https://wa.me/${targetPhone}?text=${encodedMessage}`, '_blank');
    
    setSendSuccess(true);
    setIsSending(false);
    
    setTimeout(() => setSendSuccess(false), 3000);
  };

  return (
    <>
      <div className="flex flex-col p-4 bg-[#f3f4f6] min-h-full font-sans space-y-4 pb-[80px]">
        <h2 className="text-xl font-bold text-black border-b border-gray-300 pb-2">Rejection Alerts</h2>
        
        {/* Alert Card - Machine Date & Time */}
        <div className="bg-[#fffbeb] border border-[#fcd34d] rounded-xl p-4 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 left-0 w-1.5 h-full bg-[#d97706]"></div>
          <div className="flex items-center gap-2 mb-3 border-b border-[#fde68a] pb-2">
            <div className="w-8 h-8 rounded-full bg-[#fef3c7] flex items-center justify-center text-[#d97706]">
              <span className="text-lg">🕒</span>
            </div>
            <div>
              <h3 className="font-bold text-[#d97706]">DATE & TIME OUT OF SYNC</h3>
              <p className="text-xs text-gray-500">10:45:00 AM</p>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-y-2 text-[14px]">
            <div className="text-gray-600 font-medium">Machine:</div>
            <div className="text-black font-semibold">Master Controller</div>
            
            <div className="text-gray-600 font-medium">System Time:</div>
            <div className="text-black font-semibold">10:45 AM</div>
            
            <div className="text-gray-600 font-medium">Network Time:</div>
            <div className="text-[#d97706] font-bold">10:38 AM</div>
            
            <div className="text-gray-600 font-medium">Reason:</div>
            <div className="text-[#d97706] font-bold bg-[#fef3c7] px-2 rounded-md inline-block">Time Drift &gt; 5m</div>
          </div>
          
          <div className="mt-4 pt-3 border-t border-[#fde68a] space-y-2">
            <button className="w-full bg-[#d97706] text-white font-bold py-2 rounded-lg">
              SYNC DATE & TIME NOW
            </button>
          </div>
        </div>

        {alerts.length === 0 && (
          <div className="text-center text-gray-500 py-8 bg-white rounded-xl shadow-sm border border-gray-200">
            No rejection alerts recorded yet.
          </div>
        )}

        {alerts.map((alert, idx) => (
          <div key={alert.id || idx} className={`bg-[#fef2f2] border ${alert.status === 'REWORK' ? 'border-[#ea580c]' : 'border-[#f87171]'} rounded-xl p-4 shadow-sm relative overflow-hidden`}>
            <div className={`absolute top-0 left-0 w-1.5 h-full ${alert.status === 'REWORK' ? 'bg-[#ea580c]' : 'bg-[#c81e1e]'}`}></div>
            <div className={`flex items-center gap-2 mb-3 border-b ${alert.status === 'REWORK' ? 'border-[#fed7aa]' : 'border-[#fecaca]'} pb-2`}>
              <div className={`w-8 h-8 rounded-full ${alert.status === 'REWORK' ? 'bg-[#ffedd5] text-[#ea580c]' : 'bg-[#fee2e2] text-[#c81e1e]'} flex items-center justify-center`}>
                <span className="text-lg">🔔</span>
              </div>
              <div>
                <h3 className={`font-bold ${alert.status === 'REWORK' ? 'text-[#ea580c]' : 'text-[#c81e1e]'}`}>{alert.status} ALERT</h3>
                <p className="text-xs text-gray-500">{alert.time}</p>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-y-2 text-[14px]">
              <div className="text-gray-600 font-medium">Machine:</div>
              <div className="text-black font-semibold">{alert.machine}</div>
              
              <div className="text-gray-600 font-medium">Part No:</div>
              <div className="text-black font-semibold">{alert.part_no}</div>
              
              <div className="text-gray-600 font-medium">Value:</div>
              <div className={`${alert.status === 'REWORK' ? 'text-[#ea580c]' : 'text-[#c81e1e]'} font-bold`}>{alert.value}</div>
              
              <div className="text-gray-600 font-medium">Limit:</div>
              <div className="text-black font-semibold">{alert.limit}</div>
              
              <div className="text-gray-600 font-medium">Operator:</div>
              <div className="text-black font-semibold">{alert.operator}</div>
              
              <div className="text-gray-600 font-medium">Reason:</div>
              <div className={`${alert.status === 'REWORK' ? 'text-[#ea580c] bg-[#ffedd5]' : 'text-[#c81e1e] bg-[#fee2e2]'} font-bold px-2 rounded-md inline-block`}>{alert.reason}</div>
            </div>
            
            <div className={`mt-4 pt-3 border-t ${alert.status === 'REWORK' ? 'border-[#fed7aa]' : 'border-[#fecaca]'} space-y-2`}>
              <button 
                onClick={() => handleSendWhatsApp(alert)}
                disabled={isSending || sendSuccess}
                className={`w-full text-white font-bold py-2 rounded-lg flex justify-center items-center gap-2 transition-colors ${
                  sendSuccess ? 'bg-[#15803d]' : isSending ? 'bg-gray-400' : 'bg-[#25D366]'
                }`}
              >
                {isSending ? (
                  <span>⏳ Sending...</span>
                ) : sendSuccess ? (
                  <span>✅ Sent Successfully!</span>
                ) : (
                  <><span>💬</span> NOTIFY VIA WHATSAPP</>
                )}
              </button>
              <button className={`w-full ${alert.status === 'REWORK' ? 'bg-[#ea580c]' : 'bg-[#c81e1e]'} text-white font-bold py-2 rounded-lg`}>
                ACKNOWLEDGE
              </button>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
