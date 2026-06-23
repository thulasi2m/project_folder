import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Lock, Eye, EyeOff, Phone } from 'lucide-react';
import logoImage from '../assets/cherry_full_logo.png';

export default function ForgotPassword() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    const username = e.target.elements[0].value;
    // index 1 is the prefix div, index 2 is phone, index 3 is new password, index 4 is confirm
    const newPassword = e.target.elements[2].value;
    const confirmPassword = e.target.elements[3].value;
    
    if (newPassword !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }
    
    try {
      const baseUrl = `http://${window.location.hostname}:8005`;
      const response = await fetch(`${baseUrl}/api/auth/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, new_password: newPassword })
      });
      
      if (response.ok) {
        alert("Password updated successfully!");
        navigate('/');
      } else {
        const errorData = await response.json();
        alert(`Failed to update password: ${errorData.detail}`);
      }
    } catch (error) {
      console.error("Reset error:", error);
      alert("Error connecting to server.");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#f5f5f5] p-4 relative overflow-hidden">
      {/* Main Card */}
      <div className="bg-white rounded-2xl p-6 md:p-8 shadow-xl w-full max-w-[400px] z-10 flex flex-col">
        
        {/* Logo Section */}
        <div className="flex justify-center w-full mb-6">
          <img src={logoImage} alt="Cherry Precision Products" className="h-14 object-contain" />
        </div>

        {/* Header Text */}
        <div className="text-center mb-6 w-full">
          <p className="text-sm text-gray-800 mb-1 font-semibold">Cherry Precision Product</p>
          <h1 className="text-2xl font-bold text-[#8c1c1c] mb-1">Manage Password</h1>
          <p className="text-sm text-gray-600">Recover your account using your details.</p>
        </div>

        <form onSubmit={handleUpdatePassword} className="space-y-6 w-full">
          
          {/* User Details Section */}
          <div className="space-y-4">
            <h2 className="text-sm font-bold text-black">User Details</h2>
            
            <div className="relative w-full">
              <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                <User className="w-5 h-5 text-gray-500" />
              </div>
              <input 
                type="text" 
                placeholder="Username"
                required
                className="w-full pl-10 pr-4 py-3.5 border border-[#8c1c1c] rounded-lg text-black focus:outline-none focus:border-[#8c1c1c] bg-[#fafafa]" 
              />
            </div>

            <div className="flex gap-2 w-full">
              <div className="w-[90px] py-3.5 px-2 border border-[#8c1c1c] rounded-lg text-black bg-gray-50 flex items-center justify-center gap-1">
                <Phone className="w-4 h-4 text-gray-500" />
                <span className="font-medium">+91</span>
              </div>
              <input 
                type="tel" 
                placeholder="Phone Number"
                required
                className="flex-1 px-4 py-3.5 border border-[#8c1c1c] rounded-lg text-black focus:outline-none focus:border-[#8c1c1c] bg-[#fafafa]" 
              />
            </div>
          </div>

          {/* Reset Password Section */}
          <div className="space-y-4">
            <h2 className="text-sm font-bold text-black">Reset Password</h2>
            
            <div className="relative w-full">
              <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                <Lock className="w-5 h-5 text-gray-400" />
              </div>
              <input 
                type={showPassword ? "text" : "password"} 
                placeholder="New Password"
                required
                className="w-full pl-10 pr-10 py-3.5 border border-[#15803d] rounded-lg text-black focus:outline-none bg-[#fafafa]" 
              />
              <div 
                className="absolute inset-y-0 right-3 flex items-center cursor-pointer"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff className="w-5 h-5 text-[#15803d]" /> : <Eye className="w-5 h-5 text-[#15803d]" />}
              </div>
            </div>

            <div className="relative w-full">
              <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                <Lock className="w-5 h-5 text-gray-400" />
              </div>
              <input 
                type={showConfirmPassword ? "text" : "password"} 
                placeholder="Confirm New Password"
                required
                className="w-full pl-10 pr-10 py-3.5 border border-[#15803d] rounded-lg text-black focus:outline-none bg-[#fafafa]" 
              />
              <div 
                className="absolute inset-y-0 right-3 flex items-center cursor-pointer"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? <EyeOff className="w-5 h-5 text-[#15803d]" /> : <Eye className="w-5 h-5 text-[#15803d]" />}
              </div>
            </div>
          </div>

          <div className="pt-4">
            <button type="submit" className="w-full bg-[#1e7b7e] text-white font-bold py-3.5 rounded-lg transition-colors hover:bg-[#155d5f] active:bg-[#104b4d]">
              Update Password
            </button>
          </div>
        </form>

        <div className="mt-6 text-center w-full">
          <button onClick={() => navigate('/')} className="text-xs text-gray-600 hover:text-gray-900 hover:underline">
            Return to Login
          </button>
        </div>
      </div>
    </div>
  );
}
