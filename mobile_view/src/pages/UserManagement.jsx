import React, { useState } from 'react';
import { User, Shield } from 'lucide-react';
import workerImg from '../assets/worker.png';

export default function UserManagement() {
  const [userId, setUserId] = useState("UID-9901");
  const [operatorName, setOperatorName] = useState("John Doe");
  const [username, setUsername] = useState("johndoe_op");

  const handleSave = () => {
    const existingUsers = JSON.parse(localStorage.getItem('savedUsers') || '[]');
    const newUser = { userId, operatorName, username, date: new Date().toLocaleDateString() };
    localStorage.setItem('savedUsers', JSON.stringify([newUser, ...existingUsers]));
    alert('User Configuration Saved!');
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#f3f4f6] p-4 relative font-sans pb-20">
      
      <div className="flex items-center gap-2 mb-4 bg-white p-3 rounded-xl shadow-sm border border-gray-200">
        <User className="w-6 h-6 text-[#15803d]" />
        <h1 className="text-xl font-bold text-black">User Configuration</h1>
      </div>

      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200 w-full flex flex-col items-center">
        
        <div className="w-20 h-20 rounded-full flex items-center justify-center mb-3 overflow-hidden border-4 border-[#15803d]/20 bg-white shadow-md">
          <img src={workerImg} alt="Factory Worker" className="w-full h-full object-cover" />
        </div>

        <h2 className="text-xl font-bold text-black mb-6">Staff Profile</h2>

        <div className="w-full space-y-4">
          
          <div>
            <label className="block text-xs font-bold text-gray-800 mb-1 uppercase tracking-wide">User ID</label>
            <input 
              type="text" 
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg text-black bg-gray-50 focus:outline-none focus:border-[#15803d]" 
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-800 mb-1 uppercase tracking-wide">Operator Name (Staff Name)</label>
            <input 
              type="text" 
              value={operatorName}
              onChange={(e) => setOperatorName(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg text-black bg-gray-50 focus:outline-none focus:border-[#15803d]" 
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-800 mb-1 uppercase tracking-wide">Username Configuration</label>
            <input 
              type="text" 
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg text-black bg-gray-50 focus:outline-none focus:border-[#15803d]" 
            />
          </div>

        </div>

        <button 
          onClick={handleSave} 
          className="w-full bg-[#15803d] text-white font-bold py-4 rounded-xl flex items-center justify-center transition-colors shadow-lg active:bg-green-800 mt-8"
        >
          SAVE CONFIGURATION
        </button>

      </div>
    </div>
  );
}
