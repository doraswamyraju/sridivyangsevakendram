import React, { useState } from 'react';
import { X, Heart, ShieldCheck } from 'lucide-react';
import { API_BASE_URL } from '../config';

const SupportModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  // --- STATE ---
  const [amount, setAmount] = useState(1000); // Default amount
  const [customAmount, setCustomAmount] = useState(''); // For the input field
  const [activePreset, setActivePreset] = useState(1000); // To highlight selected button
  
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    pan: '',
    address: ''
  });
  
  const [loading, setLoading] = useState(false);

  // --- HANDLERS ---
  
  // Handle Preset Button Click
  const handlePresetClick = (val) => {
    setAmount(val);
    setActivePreset(val);
    setCustomAmount(''); // Clear custom input if a preset is clicked
  };

  // Handle Custom Amount Typing
  const handleCustomChange = (e) => {
    const val = e.target.value;
    setCustomAmount(val);
    setAmount(val); // Update the actual donation amount
    setActivePreset(null); // Remove highlight from preset buttons
  };

  // Handle Form Inputs
  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle Razorpay Payment
  const handleDonate = async () => {
    if (!amount || amount < 1) {
      alert("Please enter a valid donation amount.");
      return;
    }
    if (!formData.firstName || !formData.email || !formData.phone || !formData.pan) {
      alert("Please fill in all mandatory fields (Name, Email, Phone, PAN).");
      return;
    }

    setLoading(true);

    try {
        // 1. Create Order
        const res = await fetch(`${API_BASE_URL}/donate.php`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                amount: amount, 
                ...formData,
                fullName: `${formData.firstName} ${formData.lastName}` 
            })
        });
        
        const data = await res.json();
        if (!data.order_id) throw new Error(data.message || "Order creation failed");

        // 2. Open Razorpay
        const options = {
            key: data.key,
            amount: data.amount,
            currency: "INR",
            name: "SSK Trust",
            description: "Donation",
            order_id: data.order_id,
            handler: function (response) {
                alert("Payment Successful! Payment ID: " + response.razorpay_payment_id);
                onClose();
            },
            prefill: {
                name: `${formData.firstName} ${formData.lastName}`,
                email: formData.email,
                contact: formData.phone
            },
            theme: { color: "#F59E0B" }
        };

        const rzp1 = new window.Razorpay(options);
        rzp1.open();

    } catch (error) {
        console.error("Payment Error:", error);
        alert("Network Error: " + error.message);
    }
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden relative flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="bg-amber-500 p-6 text-white flex justify-between items-center shrink-0">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <Heart className="fill-white" /> Make a Donation
          </h2>
          <button onClick={onClose} className="hover:bg-amber-600 p-1 rounded-full transition"><X size={24} /></button>
        </div>

        {/* Scrollable Content */}
        <div className="p-6 overflow-y-auto custom-scrollbar space-y-6">
          
          {/* 1. Amount Selection */}
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Select Amount</label>
            
            {/* Presets Grid */}
            <div className="grid grid-cols-3 gap-3 mb-3">
              {[500, 1000, 2500, 5000, 10000].map((val) => (
                <button
                  key={val}
                  onClick={() => handlePresetClick(val)}
                  className={`py-3 rounded-xl font-bold border transition-all ${
                    activePreset === val 
                      ? 'bg-amber-100 border-amber-500 text-amber-700 shadow-sm ring-1 ring-amber-500' 
                      : 'bg-white border-slate-200 text-slate-600 hover:border-amber-300'
                  }`}
                >
                  ₹{val.toLocaleString()}
                </button>
              ))}
              
              {/* "Other" Visual Placeholder if needed, or just let the input below do the job */}
            </div>

            {/* Custom Amount Input */}
            <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 font-bold">₹</span>
                <input 
                    type="number" 
                    placeholder="Or enter custom amount" 
                    value={customAmount}
                    onChange={handleCustomChange}
                    className="w-full pl-8 pr-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-amber-500 outline-none font-bold text-slate-700"
                />
            </div>
          </div>

          {/* 2. Personal Details */}
          <div className="grid grid-cols-2 gap-4">
            <input name="firstName" placeholder="First Name *" onChange={handleInputChange} className="p-3 border rounded-lg outline-none focus:border-amber-500" />
            <input name="lastName" placeholder="Last Name" onChange={handleInputChange} className="p-3 border rounded-lg outline-none focus:border-amber-500" />
          </div>
          
          <input name="email" type="email" placeholder="Email Address *" onChange={handleInputChange} className="w-full p-3 border rounded-lg outline-none focus:border-amber-500" />
          <input name="phone" type="tel" placeholder="Phone Number *" onChange={handleInputChange} className="w-full p-3 border rounded-lg outline-none focus:border-amber-500" />

          {/* 3. 80G Details (Highlighted) */}
          <div className="bg-blue-50 p-4 rounded-xl border border-blue-100">
             <div className="flex items-center gap-2 text-blue-800 font-bold text-xs uppercase mb-2">
                <ShieldCheck size={14} /> Details for 80G Receipt
             </div>
             <input name="pan" placeholder="PAN NUMBER (MANDATORY)" onChange={handleInputChange} className="w-full p-3 border border-blue-200 rounded-lg outline-none focus:border-blue-500 bg-white mb-3 text-sm" />
             <textarea name="address" placeholder="Billing Address" onChange={handleInputChange} className="w-full p-3 border border-blue-200 rounded-lg outline-none focus:border-blue-500 bg-white text-sm h-20 resize-none"></textarea>
          </div>

        </div>

        {/* Footer Action */}
        <div className="p-6 border-t bg-slate-50 shrink-0">
          <button 
            onClick={handleDonate} 
            disabled={loading}
            className="w-full bg-amber-500 hover:bg-amber-600 text-white font-bold py-4 rounded-xl shadow-lg transition-all flex items-center justify-center gap-2"
          >
            {loading ? "Processing..." : `Donate ₹${amount ? Number(amount).toLocaleString() : '0'}`}
          </button>
          <p className="text-center text-xs text-slate-400 mt-3 flex items-center justify-center gap-1">
            <ShieldCheck size={12} /> Secured by Razorpay
          </p>
        </div>

      </div>
    </div>
  );
};

export default SupportModal;