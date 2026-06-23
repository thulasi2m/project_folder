import React, { useState } from 'react';
import { Lock, Check, User as UserIcon, IdCard } from 'lucide-react';

export default function AdminPage() {
  const [password, setPassword] = useState('');
  const [authenticated, setAuthenticated] = useState(false);
  const [error, setError] = useState('');
  const [requests, setRequests] = useState([]);
  const [savedUsers, setSavedUsers] = useState([]);

  React.useEffect(() => {
    if (authenticated) {
      const stored = JSON.parse(localStorage.getItem('reportRequests') || '[]');
      const initialized = stored.map(req => ({ ...req, status: req.status || 'waiting' }));
      setRequests(initialized);
      
      const loadedUsers = JSON.parse(localStorage.getItem('savedUsers') || '[]');
      setSavedUsers(loadedUsers);
    }
  }, [authenticated]);

  const updateStatus = (index, newStatus) => {
    const updated = [...requests];
    updated[index].status = newStatus;
    setRequests(updated);
    localStorage.setItem('reportRequests', JSON.stringify(updated));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const baseUrl = `http://${window.location.hostname}:8005`;
      const response = await fetch(`${baseUrl}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password })
      });
      if (response.ok) {
        setAuthenticated(true);
        setError('');
      } else {
        setError('Incorrect password');
        setPassword('');
      }
    } catch (err) {
      setError('Connection error');
    }
  };

  if (!authenticated) {
    return (
      <div className="flex flex-col items-center justify-center p-4 bg-[#f3f4f6] min-h-[calc(100vh-120px)] relative">
        {/* Background placeholder image blurred slightly like the screenshot */}
        <div className="absolute inset-0 bg-gray-200 blur-sm opacity-50 z-0"></div>
        
        {/* Modal */}
        <div className="bg-white rounded-3xl p-6 shadow-2xl w-full max-w-[320px] z-10 text-center relative border border-gray-100">
          <div className="absolute top-4 right-4 cursor-pointer hover:bg-gray-100 rounded-full p-1" onClick={() => window.history.back()}>
            <div className="w-6 h-6 rounded-full bg-black text-white flex items-center justify-center text-xs font-bold pb-0.5">x</div>
          </div>
          
          <h2 className="text-xl font-bold text-black mt-2 mb-2 leading-tight">Admin Authorization<br/>Required</h2>
          <p className="text-sm text-gray-700 mb-6 font-medium">Enter password to modify system<br/>settings.</p>
          
          <form onSubmit={handleSubmit} className="flex flex-col items-center">
            <div className="relative w-full mb-4">
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 border border-gray-400 rounded-lg text-black focus:outline-none"
              />
              <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
                <Lock className="w-4 h-4 text-gray-500" />
              </div>
            </div>
            
            {error && <p className="text-xs text-red-500 mb-2 font-bold">{error}</p>}
            
            <button type="submit" className="bg-black text-white font-bold py-2.5 px-8 rounded-3xl flex items-center justify-center gap-2">
              <Check className="w-5 h-5" /> Submit
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center p-4 bg-[#f3f4f6] min-h-[calc(100vh-120px)] pb-[80px]">
      <div className="w-full bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mt-4 text-center">
        <h2 className="text-xl font-bold text-black mb-2">Admin Dashboard</h2>
        <p className="text-sm text-gray-500">System settings and configurations will appear here.</p>
      </div>

      <div className="w-full bg-white rounded-2xl p-4 shadow-sm border border-gray-100 mt-4">
        <h3 className="font-bold text-gray-800 text-sm mb-3 border-b pb-2">Live Data Report Requests</h3>
        {requests.length === 0 ? (
          <p className="text-xs text-gray-500 text-center py-2">No requests currently.</p>
        ) : (
          <div className="space-y-2">
            {requests.map((req, idx) => {
              let cardClass = 'bg-[#fffbeb] border-[#fde68a]';
              let badgeClass = 'bg-[#d97706]';
              let statusText = 'WAITING';
              
              if (req.status === 'approved') {
                cardClass = 'bg-[#f0fdf4] border-[#bbf7d0]';
                badgeClass = 'bg-[#15803d]';
                statusText = 'APPROVED';
              } else if (req.status === 'rejected') {
                cardClass = 'bg-[#fef2f2] border-[#fecaca]';
                badgeClass = 'bg-[#b91c1c]';
                statusText = 'REJECTED';
              }

              return (
              <div key={idx} className={`border p-3 rounded-lg flex flex-col gap-2 ${cardClass}`}>
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-xs font-bold text-gray-800">Phone: +91 {req.phone}</p>
                    <p className="text-[10px] text-gray-500">{req.date} {req.time}</p>
                  </div>
                  <div className={`text-white text-[10px] font-bold px-2 py-1 rounded ${badgeClass}`}>
                    {statusText}
                  </div>
                </div>
                
                {req.status === 'waiting' && (
                  <div className="flex gap-2 mt-1 border-t border-[#fde68a] pt-2">
                    <button 
                      onClick={() => updateStatus(idx, 'approved')}
                      className="flex-1 bg-[#15803d] text-white text-[11px] font-bold py-1.5 rounded shadow-sm"
                    >
                      Approve
                    </button>
                    <button 
                      onClick={() => updateStatus(idx, 'rejected')}
                      className="flex-1 bg-[#b91c1c] text-white text-[11px] font-bold py-1.5 rounded shadow-sm"
                    >
                      Reject
                    </button>
                  </div>
                )}
              </div>
            )})}
          </div>
        )}
      </div>

      {/* User Configurations Section */}
      <div className="w-full bg-white rounded-2xl p-4 shadow-sm border border-gray-100 mt-4 mb-4">
        <h3 className="font-bold text-gray-800 text-sm mb-3 border-b pb-2 flex items-center gap-2">
          <UserIcon className="w-4 h-4 text-[#8c1c1c]" /> User Configurations
        </h3>
        {savedUsers.length === 0 ? (
          <p className="text-xs text-gray-500 text-center py-2">No user configurations saved.</p>
        ) : (
          <div className="space-y-3">
            {savedUsers.map((user, idx) => (
              <div key={idx} className="bg-[#f8fafc] border border-gray-200 p-3 rounded-lg flex items-center gap-3">
                <div className="bg-[#e2e8f0] p-2 rounded-full">
                  <IdCard className="w-5 h-5 text-gray-700" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-bold text-gray-900">{user.operatorName}</p>
                  <p className="text-[11px] text-gray-600 font-medium">Username: {user.username}</p>
                </div>
                <div className="bg-[#15803d]/10 border border-[#15803d]/30 px-2 py-1 rounded text-[#15803d] text-[10px] font-bold tracking-wide">
                  {user.userId}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}
