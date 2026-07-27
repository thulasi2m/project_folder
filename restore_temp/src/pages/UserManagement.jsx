import React, { useState } from 'react';
import { User, Shield } from 'lucide-react';
import workerImg from '../assets/worker.png';

export default function UserManagement() {
  const [userId, setUserId] = useState("UID-9901");
  const [operatorName, setOperatorName] = useState("John Doe");
  const [username, setUsername] = useState("johndoe_op");
  const [profileImage, setProfileImage] = useState(null);

  const handleSave = () => {
    const existingUsers = JSON.parse(localStorage.getItem('savedUsers') || '[]');
    const newUser = { userId, operatorName, username, date: new Date().toLocaleDateString(), profileImage };
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
        
        <div className="flex flex-col items-center mb-6">
          <div 
            className="w-20 h-20 rounded-full flex items-center justify-center mb-3 overflow-hidden border-4 border-[#15803d]/20 bg-white shadow-md relative cursor-pointer"
            onClick={() => document.getElementById('profile-upload').click()}
          >
            <img src={profileImage || workerImg} alt="Factory Worker" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
              <span className="text-white text-xs font-bold">Edit</span>
            </div>
          </div>
          
          <input 
            type="file" 
            id="profile-upload" 
            className="hidden" 
            accept="image/*"
            onChange={(e) => {
              const file = e.target.files[0];
              if (file) {
                const reader = new FileReader();
                reader.onloadend = () => {
                  setProfileImage(reader.result);
                };
                reader.readAsDataURL(file);
              }
            }}
          />
          <div className="flex gap-2">
            <button 
               type="button"
               onClick={() => document.getElementById('profile-upload').click()}
               className="text-xs font-bold text-[#15803d] border border-[#15803d] px-3 py-1 rounded-full hover:bg-[#15803d] hover:text-white transition-colors"
            >
              Upload
            </button>
            {profileImage && (
              <button 
                 type="button"
                 onClick={() => setProfileImage(null)}
                 className="text-xs font-bold text-[#c81e1e] border border-[#c81e1e] px-3 py-1 rounded-full hover:bg-[#c81e1e] hover:text-white transition-colors"
              >
                Remove
              </button>
            )}
          </div>
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
