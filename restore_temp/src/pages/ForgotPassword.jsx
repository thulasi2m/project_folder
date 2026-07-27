import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Lock, Eye, EyeOff, Phone, KeyRound } from 'lucide-react';
import logoImage from '../assets/cherry_full_logo.png';

export default function ForgotPassword() {
  const navigate = useNavigate();
  
  // Steps: 1 = Request OTP, 2 = Verify OTP, 3 = Reset Password
  const [step, setStep] = useState(1);
  const [username, setUsername] = useState('');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleSendOTP = (e) => {
    e.preventDefault();
    if (!username || !phone) {
      alert("Please enter both username and phone number");
      return;
    }
    // Simulate sending OTP
    alert(`OTP sent to +91 ${phone}`);
    setStep(2);
  };

  const handleVerifyOTP = (e) => {
    e.preventDefault();
    if (otp === '1234') { // Mock verification
      alert("OTP Verified Successfully!");
      setStep(3);
    } else {
      alert("Invalid OTP. Try 1234 for testing.");
    }
  };

  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    
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
      <div className="bg-white rounded-2xl p-6 md:p-8 shadow-xl w-full max-w-[400px] z-10 flex flex-col">
        
        <div className="flex justify-center w-full mb-6">
          <img src={logoImage} alt="Cherry Precision Products" className="h-14 object-contain" />
        </div>

        <div className="text-center mb-6 w-full">
          <p className="text-sm text-gray-800 mb-1 font-semibold">Cherry Precision Product</p>
          <h1 className="text-2xl font-bold text-[#8c1c1c] mb-1">Manage Password</h1>
          <p className="text-sm text-gray-600">
            {step === 1 && "Enter details to receive an OTP."}
            {step === 2 && "Enter the OTP sent to your phone."}
            {step === 3 && "Create a new secure password."}
          </p>
        </div>

        {/* STEP 1: Request OTP */}
        {step === 1 && (
          <form onSubmit={handleSendOTP} className="space-y-6 w-full">
            <div className="space-y-4">
              <div className="relative w-full">
                <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                  <User className="w-5 h-5 text-gray-500" />
                </div>
                <input 
                  type="text" 
                  placeholder="Username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
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
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                  className="flex-1 px-4 py-3.5 border border-[#8c1c1c] rounded-lg text-black focus:outline-none focus:border-[#8c1c1c] bg-[#fafafa]" 
                />
              </div>
            </div>
            <button type="submit" className="w-full bg-[#1e7b7e] text-white font-bold py-3.5 rounded-lg transition-colors hover:bg-[#155d5f] active:bg-[#104b4d]">
              Send OTP
            </button>
          </form>
        )}

        {/* STEP 2: Verify OTP */}
        {step === 2 && (
          <form onSubmit={handleVerifyOTP} className="space-y-6 w-full">
            <div className="space-y-4 text-center">
              <p className="text-sm font-medium text-gray-700">OTP sent to: <span className="font-bold text-black">+91 {phone}</span></p>
              <div className="relative w-full">
                <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                  <KeyRound className="w-5 h-5 text-gray-500" />
                </div>
                <input 
                  type="text" 
                  placeholder="Enter 4-digit OTP"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  required
                  maxLength={4}
                  className="w-full pl-10 pr-4 py-3.5 border border-[#8c1c1c] rounded-lg text-center tracking-widest text-lg font-bold text-black focus:outline-none focus:border-[#8c1c1c] bg-[#fafafa]" 
                />
              </div>
            </div>
            <button type="submit" className="w-full bg-[#1e7b7e] text-white font-bold py-3.5 rounded-lg transition-colors hover:bg-[#155d5f] active:bg-[#104b4d]">
              Verify OTP
            </button>
            <button type="button" onClick={() => setStep(1)} className="w-full text-sm text-[#8c1c1c] font-bold mt-2">
              Back to Phone
            </button>
          </form>
        )}

        {/* STEP 3: Reset Password */}
        {step === 3 && (
          <form onSubmit={handleUpdatePassword} className="space-y-6 w-full">
            <div className="space-y-4">
              <div className="relative w-full">
                <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                  <Lock className="w-5 h-5 text-gray-400" />
                </div>
                <input 
                  type={showPassword ? "text" : "password"} 
                  placeholder="New Password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                  className="w-full pl-10 pr-10 py-3.5 border border-[#15803d] rounded-lg text-black focus:outline-none bg-[#fafafa]" 
                />
                <div className="absolute inset-y-0 right-3 flex items-center cursor-pointer" onClick={() => setShowPassword(!showPassword)}>
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
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  className="w-full pl-10 pr-10 py-3.5 border border-[#15803d] rounded-lg text-black focus:outline-none bg-[#fafafa]" 
                />
                <div className="absolute inset-y-0 right-3 flex items-center cursor-pointer" onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
                  {showConfirmPassword ? <EyeOff className="w-5 h-5 text-[#15803d]" /> : <Eye className="w-5 h-5 text-[#15803d]" />}
                </div>
              </div>
            </div>
            <button type="submit" className="w-full bg-[#15803d] text-white font-bold py-3.5 rounded-lg transition-colors hover:bg-[#166534]">
              Update Password
            </button>
          </form>
        )}

        <div className="mt-6 text-center w-full">
          <button onClick={() => navigate('/')} className="text-xs text-gray-600 hover:text-gray-900 hover:underline">
            Return to Login
          </button>
        </div>
      </div>
    </div>
  );
}
