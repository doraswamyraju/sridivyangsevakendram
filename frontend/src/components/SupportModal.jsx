import React, { useState, useEffect } from 'react';
import { X, Check, ShieldCheck, Heart, HandHeart } from 'lucide-react';
import { API_BASE_URL } from '../config';

const SupportModal = ({ isOpen, onClose, initialTab }) => {
  const [activeTab, setActiveTab] = useState(initialTab);
  
  // --- DONATION STATE ---
  const [amount, setAmount] = useState(1000); 
  const [customAmount, setCustomAmount] = useState(''); // New State for Input
  const [activePreset, setActivePreset] = useState(1000); // New State to track button highlight

  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(null); // 'success' or null

  // Form States
  const [formData, setFormData] = useState({
    firstName: '', lastName: '', email: '', phone: '',
    pan: '', address: '',
    interest: 'Teaching / Skill Training', message: ''
  });

  useEffect(() => {
    setActiveTab(initialTab);
    setStatus(null);
  }, [initialTab, isOpen]);

  // Load Razorpay Script
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    document.body.appendChild(script);
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // --- NEW HANDLERS FOR CUSTOM AMOUNT ---
  const handlePresetClick = (val) => {
    setAmount(val);
    setActivePreset(val);
    setCustomAmount(''); // Clear custom input when a button is clicked
  };

  const handleCustomChange = (e) => {
    const val = e.target.value;
    setCustomAmount(val);
    setAmount(val); // Update donation amount
    setActivePreset(null); // Remove highlight from buttons
  };

  // --- VOLUNTEER SUBMISSION ---
  const handleVolunteerSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/volunteer.php`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName: `${formData.firstName} ${formData.lastName}`,
          email: formData.email, phone: formData.phone,
          interest: formData.interest, message: formData.message
        })
      });
      if (response.ok) { 
        setStatus('success'); 
        setTimeout(onClose, 4000); // Close after 4 seconds
      }
    } catch (error) { alert("Connection error."); } 
    finally { setLoading(false); }
  };

  // --- PAYMENT HANDLING ---
  const handlePayment = async () => {
    if(!amount || amount < 1) {
        alert("Please enter a valid donation amount.");
        return;
    }
    if(!formData.firstName || !formData.email || !formData.pan) {
      alert("Please fill Name, Email, and PAN for 80G Receipt.");
      return;
    }

    setLoading(true);

    const options = {
      key: "rzp_test_RuKdTFadwm3UGT", // <--- REPLACE WITH YOUR KEY ID
      amount: amount * 100, 
      currency: "INR",
      name: "SSK Trust",
      description: "Donation for Social Welfare",
      handler: async function (response) {
        await saveDonation(response.razorpay_payment_id);
      },
      prefill: {
        name: `${formData.firstName} ${formData.lastName}`,
        email: formData.email,
        contact: formData.phone
      },
      theme: { color: "#1e3a8a" }
    };

    const rzp1 = new window.Razorpay(options);
    rzp1.open();
    setLoading(false);
  };

  const saveDonation = async (txnId) => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/donate.php`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          phone: formData.phone,
          pan: formData.pan,
          address: formData.address,
          amount: amount,
          transaction_id: txnId
        })
      });
      
      const result = await response.json();
      if (result.status === 'success') {
        setStatus('success');
      } else {
        alert("Payment successful, but receipt generation failed. Contact Admin.");
      }
    } catch (error) {
      alert("Network Error saving donation.");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm">
      <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden relative flex flex-col max-h-[90vh]">
        <button onClick={onClose} className="absolute top-4 right-4 p-2 bg-slate-100 rounded-full hover:bg-slate-200 z-20"><X size={20} /></button>
        
        {/* TABS */}
        <div className="flex border-b border-slate-100 shrink-0">
           <button className={`flex-1 py-4 font-bold text-sm uppercase ${activeTab === 'donate' ? 'bg-amber-500 text-white' : 'bg-slate-50 text-slate-500'}`} onClick={() => setActiveTab('donate')}>Make a Donation</button>
           <button className={`flex-1 py-4 font-bold text-sm uppercase ${activeTab === 'volunteer' ? 'bg-blue-900 text-white' : 'bg-slate-50 text-slate-500'}`} onClick={() => setActiveTab('volunteer')}>Volunteer</button>
        </div>

        <div className="overflow-y-auto p-8 custom-scrollbar">
           {status === 'success' ? (
             // --- DYNAMIC SUCCESS MESSAGE ---
             <div className="text-center py-10 animate-in fade-in zoom-in duration-300">
               <div className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 ${activeTab === 'donate' ? 'bg-green-100 text-green-600' : 'bg-blue-100 text-blue-600'}`}>
                 {activeTab === 'donate' ? <Check size={40} /> : <HandHeart size={40} />}
               </div>
               
               {activeTab === 'donate' ? (
                 <>
                   <h3 className="text-2xl font-bold text-slate-800">Donation Successful!</h3>
                   <p className="text-slate-500 mt-2 max-w-xs mx-auto">Thank you for your generosity. Your 80G Receipt has been sent to your email.</p>
                 </>
               ) : (
                 <>
                   <h3 className="text-2xl font-bold text-slate-800">Application Received!</h3>
                   <p className="text-slate-500 mt-2 max-w-xs mx-auto">Thank you for stepping forward. Our team will contact you shortly.</p>
                 </>
               )}
             </div>
           ) : (
             activeTab === 'donate' ? (
               <div className="space-y-5">
                 
                 {/* --- AMOUNT SELECTION SECTION --- */}
                 <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Select Amount</label>
                    <div className="grid grid-cols-3 gap-3 mb-3">
                    {[500, 1000, 2500, 5000, 10000].map((amt) => (
                        <button 
                            key={amt} 
                            onClick={() => handlePresetClick(amt)} 
                            className={`py-2 border rounded-lg text-sm font-bold transition-all ${activePreset === amt ? 'bg-amber-100 border-amber-500 text-amber-700 shadow-sm' : 'border-slate-200 text-slate-600 hover:border-amber-300'}`}
                        >
                            ₹{amt.toLocaleString()}
                        </button>
                    ))}
                    </div>
                    {/* Custom Input */}
                    <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-bold">₹</span>
                        <input 
                            type="number" 
                            placeholder="Enter other amount" 
                            value={customAmount}
                            onChange={handleCustomChange}
                            className="w-full pl-7 p-3 border rounded-lg text-sm font-bold outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
                        />
                    </div>
                 </div>
                 {/* -------------------------------- */}

                 <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-3">
                      <input name="firstName" placeholder="First Name *" onChange={handleChange} className="p-3 border rounded-lg w-full text-sm outline-none focus:border-amber-500" />
                      <input name="lastName" placeholder="Last Name" onChange={handleChange} className="p-3 border rounded-lg w-full text-sm outline-none focus:border-amber-500" />
                    </div>
                    <input name="email" type="email" placeholder="Email Address *" onChange={handleChange} className="p-3 border rounded-lg w-full text-sm outline-none focus:border-amber-500" />
                    <input name="phone" placeholder="Phone Number" onChange={handleChange} className="p-3 border rounded-lg w-full text-sm outline-none focus:border-amber-500" />
                    
                    <div className="bg-blue-50 p-4 rounded-xl border border-blue-100">
                      <div className="flex items-center gap-2 text-blue-800 font-bold text-xs uppercase mb-3">
                        <ShieldCheck size={14} /> Details for 80G Receipt
                      </div>
                      <input name="pan" placeholder="PAN Number (Mandatory)" onChange={handleChange} className="p-3 border rounded-lg w-full text-sm mb-3 uppercase outline-none focus:border-blue-500 bg-white" />
                      <textarea name="address" rows="2" placeholder="Billing Address" onChange={handleChange} className="p-3 border rounded-lg w-full text-sm outline-none focus:border-blue-500 bg-white resize-none"></textarea>
                    </div>

                    <button onClick={handlePayment} disabled={loading} className="w-full bg-amber-500 text-white font-bold py-4 rounded-xl shadow-lg hover:shadow-xl hover:bg-amber-600 transition-all">
                       {loading ? 'Processing...' : `Donate ₹${amount ? Number(amount).toLocaleString() : '0'}`}
                    </button>
                    <p className="text-[10px] text-center text-slate-400">Secured by Razorpay</p>
                 </div>
               </div>
             ) : (
               <form onSubmit={handleVolunteerSubmit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                      <input name="firstName" required placeholder="First Name" onChange={handleChange} className="p-3 border rounded-lg w-full text-sm outline-none focus:border-blue-500" />
                      <input name="lastName" required placeholder="Last Name" onChange={handleChange} className="p-3 border rounded-lg w-full text-sm outline-none focus:border-blue-500" />
                  </div>
                  <input name="email" required type="email" placeholder="Email Address" onChange={handleChange} className="p-3 border rounded-lg w-full text-sm outline-none focus:border-blue-500" />
                  <input name="phone" required placeholder="Phone Number" onChange={handleChange} className="p-3 border rounded-lg w-full text-sm outline-none focus:border-blue-500" />
                  <select name="interest" onChange={handleChange} className="p-3 border rounded-lg w-full text-sm bg-white text-slate-600 outline-none focus:border-blue-500">
                     <option>Teaching / Skill Training</option>
                     <option>Elderly Care Support</option>
                     <option>Event Organization</option>
                     <option>Other</option>
                  </select>
                  <textarea name="message" rows="3" placeholder="Why do you want to join us? (Optional)" onChange={handleChange} className="p-3 border rounded-lg w-full text-sm outline-none focus:border-blue-500"></textarea>
                  <button type="submit" disabled={loading} className="w-full bg-blue-900 text-white font-bold py-4 rounded-xl shadow-lg hover:bg-blue-800 transition-all">{loading ? 'Submitting...' : 'Submit Application'}</button>
               </form>
             )
           )}
        </div>
      </div>
    </div>
  );
};

export default SupportModal;