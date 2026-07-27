import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Lock, Eye, EyeOff } from 'lucide-react';
import bgImage from '../assets/welcome_bg.png';
import logoImage from '../assets/cherry_full_logo.png';

export default function Login() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#f5f5f5] p-4 relative overflow-hidden">
      {/* Blurred background image mock matching the screenshot */}
      <div 
        className="absolute inset-0 z-0 bg-cover bg-center blur-sm opacity-50"
        style={{ backgroundImage: `url(${bgImage})` }}
      ></div>
      
      {/* Main Card - Optimized for mobile 360-430px */}
      <div className="bg-white rounded-2xl p-6 md:p-8 shadow-xl w-full max-w-[400px] z-10 flex flex-col items-center">
        
        {/* Logo Section matching the image layout */}
        <div className="flex justify-center w-full mb-6">
          <img src={logoImage} alt="Cherry Precision Products" className="h-14 object-contain" />
        </div>

        {/* Welcome Text */}
        <div className="text-center mb-6 w-full relative">
          <p className="text-sm text-gray-800 mb-1 font-semibold">Air Gauge Monitoring</p>
          <h1 className="text-[28px] mb-1">
            <span className="font-bold text-black">Welcome </span>
            <span className="font-bold text-[#8c1c1c]">Back!</span>
          </h1>
          <p className="text-sm text-gray-600">Sign in to continue</p>
        </div>

        {/* Form Inputs */}
        <form onSubmit={async (e) => { 
          e.preventDefault(); 
          const pwd = e.target.elements[1].value;
          try {
            const baseUrl = `http://${window.location.hostname}:8005`;
            const response = await fetch(`${baseUrl}/api/auth/login`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ password: pwd })
            });
            if (response.ok) {
              navigate('/config');
            } else {
              navigate('/forgot-password');
            }
          } catch (error) {
            console.error("Login error:", error);
            alert("Error connecting to server.");
          }
        }} className="space-y-4 w-full">
          
          <div className="relative w-full">
            <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
              <User className="w-5 h-5 text-gray-500" />
            </div>
            <input 
              type="text" 
              placeholder="Username"
              className="w-full pl-10 pr-4 py-3.5 border border-gray-300 rounded-lg text-black focus:outline-none focus:border-gray-400" 
            />
          </div>

          <div className="relative w-full">
            <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
              <Lock className="w-5 h-5 text-gray-500" />
            </div>
            <input 
              type={showPassword ? "text" : "password"} 
              placeholder="Password"
              className="w-full pl-10 pr-10 py-3.5 border-2 border-[#8c1c1c] rounded-lg text-black focus:outline-none" 
            />
            <div 
              className="absolute inset-y-0 right-3 flex items-center cursor-pointer"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff className="w-5 h-5 text-gray-500" /> : <Eye className="w-5 h-5 text-gray-500" />}
            </div>
          </div>

          {/* Added Phone Number Field fixed to India */}
          <div className="flex gap-2 w-full">
            <div className="w-[80px] py-3.5 px-2 border border-gray-300 rounded-lg text-black bg-gray-100 flex items-center justify-center font-bold">
              +91
            </div>
            <input 
              type="tel" 
              placeholder="Phone Number"
              className="flex-1 px-4 py-3.5 border border-gray-300 rounded-lg text-black focus:outline-none focus:border-gray-400" 
            />
          </div>

          <div className="flex justify-end w-full">
            <button type="button" onClick={() => navigate('/forgot-password')} className="text-xs font-medium text-[#15803d] hover:underline">Forgot Password?</button>
          </div>

          <div className="pt-2 space-y-4 w-full">
            <button type="submit" className="w-full bg-[#8c1c1c] text-white font-bold py-3.5 rounded-lg flex items-center justify-center gap-2 transition-colors active:bg-red-900">
              <Lock className="w-4 h-4" /> LOGIN
            </button>
            
            <div className="text-center text-xs text-gray-800 my-2">OR</div>
            
            <button type="button" onClick={() => navigate('/app')} className="w-full bg-white text-[#15803d] font-bold py-3.5 rounded-lg border-2 border-[#15803d] flex items-center justify-center gap-2 transition-colors active:bg-green-50">
              <User className="w-4 h-4" /> CREATE ACCOUNT
            </button>
          </div>
        </form>

        <div className="mt-8 text-center w-full">
          <p className="text-[11px] text-gray-600">Secure Terminal v1.0</p>
        </div>
      </div>
    </div>
  );
}
