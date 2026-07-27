import React, { useState, useEffect } from 'react';
import { Camera, Save, User, CheckCircle, Trash2 } from 'lucide-react';

export default function CustomerSetup() {
  const [customerName, setCustomerName] = useState('');
  const [photoBase64, setPhotoBase64] = useState(null);
  const [success, setSuccess] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    let customerData = null;
    const stored = localStorage.getItem('savedCustomer');
    if (stored) {
      customerData = JSON.parse(stored);
    } else {
      const storedArray = localStorage.getItem('savedCustomers');
      if (storedArray) {
        const parsed = JSON.parse(storedArray);
        if (parsed && parsed.length > 0) {
          customerData = parsed[parsed.length - 1];
        }
      }
    }
    
    if (customerData) {
      setCustomerName(customerData.customerName || '');
      setPhotoBase64(customerData.customerPhoto || null);
      setIsSaved(true);
    }
  }, []);

  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoBase64(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    if (!customerName || !photoBase64) {
      alert('Please provide both customer name and photo.');
      return;
    }

    const newCustomer = {
      customerName,
      customerPhoto: photoBase64,
      dateSaved: new Date().toLocaleDateString()
    };

    localStorage.setItem('savedCustomer', JSON.stringify(newCustomer));
    window.dispatchEvent(new Event('storage'));
    
    setIsSaved(true);
    setSuccess(true);
    setTimeout(() => {
      setSuccess(false);
    }, 1500);
  };

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this customer?')) {
      localStorage.removeItem('savedCustomer');
      localStorage.removeItem('savedCustomers'); // Clear array fallback as well
      setCustomerName('');
      setPhotoBase64(null);
      setIsSaved(false);
      window.dispatchEvent(new Event('storage'));
    }
  };

  return (
    <div className="flex flex-col p-4 bg-[#f3f4f6] min-h-[calc(100vh-120px)] pb-[80px]">
      <h2 className="text-xl font-bold text-black mb-4">Customer Setup</h2>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 w-full flex flex-col gap-5 relative">
        {success && (
          <div className="absolute top-0 left-0 w-full h-full bg-white/90 z-10 rounded-2xl flex flex-col items-center justify-center gap-3">
            <CheckCircle className="w-12 h-12 text-[#15803d]" />
            <p className="font-bold text-[#15803d]">Saved Successfully!</p>
          </div>
        )}

        <div className="flex flex-col gap-2">
          <label className="text-sm font-bold text-gray-700 flex items-center gap-2">
            <User className="w-4 h-4 text-[#8c1c1c]" /> Customer Name
          </label>
          <input
            type="text"
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
            placeholder="Enter customer name..."
            className="w-full px-4 py-3 border border-gray-300 rounded-lg text-black focus:outline-none focus:border-[#8c1c1c]"
          />
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-sm font-bold text-gray-700 flex items-center gap-2">
            <Camera className="w-4 h-4 text-[#8c1c1c]" /> Customer Photo
          </label>
          
          <div className="border-2 border-dashed border-gray-300 rounded-xl flex flex-col items-center justify-center p-6 bg-gray-50 relative overflow-hidden h-40">
            {photoBase64 ? (
              <img src={photoBase64} alt="Customer" className="absolute inset-0 w-full h-full object-contain p-2" />
            ) : (
              <div className="flex flex-col items-center gap-2 text-gray-500">
                <Camera className="w-8 h-8" />
                <span className="text-sm font-medium">Tap to upload photo</span>
              </div>
            )}
            <input 
              type="file" 
              accept="image/*" 
              onChange={handlePhotoUpload}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
          </div>
        </div>

        <div className="flex flex-col gap-3 mt-2">
          <button 
            onClick={handleSave}
            className="w-full bg-[#8c1c1c] text-white font-bold py-3.5 rounded-xl flex items-center justify-center gap-2 shadow-md hover:bg-red-800 transition-colors"
          >
            <Save className="w-5 h-5" /> Save Configuration
          </button>
          
          {isSaved && (
            <button 
              onClick={handleDelete}
              className="w-full bg-white text-[#c81e1e] border-2 border-[#c81e1e] font-bold py-3.5 rounded-xl flex items-center justify-center gap-2 shadow-sm hover:bg-red-50 transition-colors"
            >
              <Trash2 className="w-5 h-5" /> Delete Configuration
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
