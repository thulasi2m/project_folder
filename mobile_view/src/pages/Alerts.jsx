import React from 'react';

export default function Alerts() {
  return (
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

      {/* Alert Card 1 */}
      <div className="bg-[#fef2f2] border border-[#f87171] rounded-xl p-4 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 left-0 w-1.5 h-full bg-[#c81e1e]"></div>
        <div className="flex items-center gap-2 mb-3 border-b border-[#fecaca] pb-2">
          <div className="w-8 h-8 rounded-full bg-[#fee2e2] flex items-center justify-center text-[#c81e1e]">
            <span className="text-lg">🔔</span>
          </div>
          <div>
            <h3 className="font-bold text-[#c81e1e]">REJECTION ALERT</h3>
            <p className="text-xs text-gray-500">10:32:15 AM</p>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-y-2 text-[14px]">
          <div className="text-gray-600 font-medium">Machine:</div>
          <div className="text-black font-semibold">Air Gauge 2</div>
          
          <div className="text-gray-600 font-medium">Part No:</div>
          <div className="text-black font-semibold">ABC-101</div>
          
          <div className="text-gray-600 font-medium">Value:</div>
          <div className="text-[#c81e1e] font-bold">10.068 mm</div>
          
          <div className="text-gray-600 font-medium">Limit:</div>
          <div className="text-black font-semibold">10.050 mm</div>
          
          <div className="text-gray-600 font-medium">Operator:</div>
          <div className="text-black font-semibold">Ravi</div>
          
          <div className="text-gray-600 font-medium">Reason:</div>
          <div className="text-[#c81e1e] font-bold bg-[#fee2e2] px-2 rounded-md inline-block">Above UTL</div>
        </div>
        
        <div className="mt-4 pt-3 border-t border-[#fecaca] space-y-2">
          <button 
            onClick={() => alert('Sending WhatsApp notification to registered customer phone number... \n\n[MOCK SUCCESS: Message Sent!]')}
            className="w-full bg-[#25D366] text-white font-bold py-2 rounded-lg flex justify-center items-center gap-2"
          >
            <span>💬</span> NOTIFY VIA WHATSAPP
          </button>
          <button className="w-full bg-[#c81e1e] text-white font-bold py-2 rounded-lg">
            ACKNOWLEDGE
          </button>
        </div>
      </div>

      {/* Alert Card 2 */}
      <div className="bg-[#fef2f2] border border-[#f87171] rounded-xl p-4 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 left-0 w-1.5 h-full bg-[#c81e1e]"></div>
        <div className="flex items-center gap-2 mb-3 border-b border-[#fecaca] pb-2">
          <div className="w-8 h-8 rounded-full bg-[#fee2e2] flex items-center justify-center text-[#c81e1e]">
            <span className="text-lg">🔔</span>
          </div>
          <div>
            <h3 className="font-bold text-[#c81e1e]">REJECTION ALERT</h3>
            <p className="text-xs text-gray-500">09:15:02 AM</p>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-y-2 text-[14px]">
          <div className="text-gray-600 font-medium">Machine:</div>
          <div className="text-black font-semibold">Air Gauge 1</div>
          
          <div className="text-gray-600 font-medium">Part No:</div>
          <div className="text-black font-semibold">ABC-101</div>
          
          <div className="text-gray-600 font-medium">Value:</div>
          <div className="text-[#c81e1e] font-bold">9.992 mm</div>
          
          <div className="text-gray-600 font-medium">Limit:</div>
          <div className="text-black font-semibold">10.000 mm</div>
          
          <div className="text-gray-600 font-medium">Operator:</div>
          <div className="text-black font-semibold">Amit</div>
          
          <div className="text-gray-600 font-medium">Reason:</div>
          <div className="text-[#c81e1e] font-bold bg-[#fee2e2] px-2 rounded-md inline-block">Below LTL</div>
        </div>
        
        <div className="mt-4 pt-3 border-t border-[#fecaca]">
          <button className="w-full bg-white border border-[#c81e1e] text-[#c81e1e] font-bold py-2 rounded-lg opacity-60">
            ACKNOWLEDGED
          </button>
        </div>
      </div>

    </div>
  );
}
