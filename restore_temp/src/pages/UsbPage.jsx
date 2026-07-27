import React from 'react';

export default function UsbPage() {
  return (
    <div className="flex flex-col items-center bg-[#f3f4f6] min-h-full p-4 relative font-sans">
      
      {/* Live Measurement Card matching the screenshot */}
      <div className="w-full bg-[#ebf2ec] border border-[#a3b8aa] rounded-xl p-4 shadow-sm mb-4 flex justify-between items-center">
        <div>
          <div className="text-gray-800 text-lg mb-1">Live Measurement:</div>
          <div className="text-[42px] text-[#15803d] leading-none tracking-tight">
            2.155 <span className="text-2xl text-[#15803d]">mm</span>
          </div>
        </div>
        
        {/* Mock Sparkline Bar Chart */}
        <div className="flex items-end gap-[3px] h-14 border-b border-gray-400 pb-1">
          <div className="w-2.5 h-6 bg-[#15803d]"></div>
          <div className="w-2.5 h-7 bg-[#15803d]"></div>
          <div className="w-2.5 h-5 bg-[#15803d]"></div>
          <div className="w-2.5 h-8 bg-[#15803d]"></div>
          <div className="w-2.5 h-6 bg-[#15803d]"></div>
          <div className="w-2.5 h-10 bg-[#15803d]"></div>
          <div className="w-2.5 h-12 bg-[#15803d]"></div>
          <div className="w-2.5 h-9 bg-[#15803d]"></div>
        </div>
      </div>

      {/* Data Table */}
      <div className="w-full bg-[#ebf2ec] border border-[#a3b8aa] rounded-xl p-3 shadow-sm">
        <table className="w-full text-left text-gray-800 text-[15px]">
          <tbody>
            <tr><td className="py-1">09:45:10</td><td className="py-1">2.155</td><td className="py-1 text-[#15803d] font-bold">OK</td></tr>
            <tr><td className="py-1">09:45:05</td><td className="py-1">2.154</td><td className="py-1 text-[#15803d] font-bold">OK</td></tr>
            <tr><td className="py-1">09:45:06</td><td className="py-1">2.154</td><td className="py-1 text-[#15803d] font-bold">OK</td></tr>
            <tr><td className="py-1">09:45:07</td><td className="py-1">2.153</td><td className="py-1 text-[#15803d] font-bold">OK</td></tr>
            <tr><td className="py-1">09:45:03</td><td className="py-1">2.153</td><td className="py-1 text-[#15803d] font-bold">OK</td></tr>
            <tr><td className="py-1">09:45:10</td><td className="py-1">2.155</td><td className="py-1 text-[#15803d] font-bold">OK</td></tr>
            <tr><td className="py-1">09:45:05</td><td className="py-1">2.154</td><td className="py-1 text-[#15803d] font-bold">OK</td></tr>
            <tr><td className="py-1">09:45:03</td><td className="py-1">2.154</td><td className="py-1 text-[#c81e1e] font-bold">FAIL</td></tr>
            <tr><td className="py-1">09:45:28</td><td className="py-1">2.154</td><td className="py-1 text-[#c81e1e] font-bold">FAIL</td></tr>
            <tr><td className="py-1">09:45:29</td><td className="py-1">2.158</td><td className="py-1 text-[#c81e1e] font-bold">FAIL</td></tr>
          </tbody>
        </table>
        
        <div className="flex justify-between items-center mt-4 pt-3 border-t border-[#a3b8aa]">
          <div className="flex gap-1.5 flex-wrap">
            <button className="px-3 py-1.5 bg-white border border-gray-300 rounded-md text-[13px] text-black shadow-sm">Refresh</button>
            <button className="px-3 py-1.5 bg-white border border-gray-300 rounded-md text-[13px] text-black shadow-sm">Clear Data</button>
            <button onClick={() => {
              const csvContent = "data:application/vnd.ms-excel;charset=utf-8,Time,Value,Status\n09:45:10,2.155,OK\n09:45:03,2.154,FAIL\n";
              const encodedUri = encodeURI(csvContent);
              const link = document.createElement("a");
              link.setAttribute("href", encodedUri);
              link.setAttribute("download", "report.xls");
              document.body.appendChild(link);
              link.click();
              document.body.removeChild(link);
              setTimeout(() => {
                alert("Excel Report downloaded!\n\nSending consolidated report to registered WhatsApp number...\n\n[MOCK SUCCESS: WhatsApp Sent]");
              }, 500);
            }} className="px-3 py-1.5 bg-[#25D366] border border-[#25D366] text-white rounded-md text-[13px] shadow-sm font-bold flex items-center gap-1">
              <span>💬</span> Send Excel Report
            </button>
          </div>
          <div className="flex items-center gap-1.5 text-[#15803d] text-[15px] font-medium">
            <div className="w-3 h-3 rounded-full bg-[#15803d]"></div> Sensor Status
          </div>
        </div>
      </div>
      
    </div>
  );
}
