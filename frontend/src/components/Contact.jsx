import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, CheckCircle } from 'lucide-react';
import { API_BASE_URL } from '../config';

const Contact = () => {
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // We reuse the volunteer endpoint but mark the interest as "General Inquiry"
      const response = await fetch(`${API_BASE_URL}/volunteer.php`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName: formData.name,
          email: formData.email,
          phone: formData.phone,
          interest: 'General Contact Inquiry', // Special tag for Admin Dashboard
          message: formData.message
        })
      });

      if (response.ok) {
        setStatus('success');
        setFormData({ name: '', email: '', phone: '', message: '' });
        setTimeout(() => setStatus(null), 5000);
      } else {
        alert("Something went wrong. Please try again.");
      }
    } catch (error) {
      alert("Connection failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="contact-us" className="py-24 bg-white">
      <div className="container mx-auto px-6">
        
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-sm font-bold text-amber-600 uppercase tracking-widest mb-3">Get in Touch</h2>
          <h3 className="text-4xl font-extrabold text-blue-950">We'd Love to Hear From You</h3>
          <p className="text-slate-600 mt-4 max-w-2xl mx-auto">
            Have a question about our programs or want to get involved? Reach out to us directly.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-start">
          
          {/* Left Column: Contact Info & Map */}
          <div className="space-y-8">
            {/* Info Cards */}
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
                <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mb-4">
                  <Phone size={20} />
                </div>
                <h4 className="font-bold text-blue-950 mb-1">Call Us</h4>
                <p className="text-sm text-slate-600 font-medium">+91 99599 34393</p>
                <p className="text-sm text-slate-600 font-medium">+91 77024 31381</p>
              </div>

              <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
                <div className="w-10 h-10 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center mb-4">
                  <Mail size={20} />
                </div>
                <h4 className="font-bold text-blue-950 mb-1">Email Us</h4>
                <p className="text-sm text-slate-600">contact@ssktrust.org</p>
                <p className="text-sm text-slate-600">info@ssktrust.org</p>
              </div>
            </div>

            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 flex items-start gap-4">
               <div className="w-10 h-10 bg-green-100 text-green-600 rounded-full flex items-center justify-center shrink-0">
                  <MapPin size={20} />
               </div>
               <div>
                  <h4 className="font-bold text-blue-950 mb-1">Visit Our Office</h4>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    7-116, Padma Nagar, Jeepalem Panchayati,<br/>
                    Papanaidu Peta, Renigunta - 517520
                  </p>
               </div>
            </div>

            {/* Google Maps Embed */}
            <div className="rounded-2xl overflow-hidden shadow-lg border border-slate-200 h-64 relative bg-slate-200">
              <iframe 
                title="Office Location"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3877.106473941788!2d79.5135!3d13.6515!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTPCsDM5JzA1LjQiTiA3OcKwMzAnNDguNiJF!5e0!3m2!1sen!2sin!4v1600000000000!5m2!1sen!2sin" 
                width="100%" 
                height="100%" 
                style={{ border: 0 }} 
                allowFullScreen="" 
                loading="lazy"
              ></iframe>
            </div>
          </div>

          {/* Right Column: Contact Form */}
          <div className="bg-white p-8 md:p-10 rounded-3xl shadow-xl shadow-blue-900/5 border border-slate-100 relative overflow-hidden">
             {status === 'success' ? (
                <div className="absolute inset-0 bg-white z-10 flex flex-col items-center justify-center text-center p-8 animate-in fade-in">
                   <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-6">
                      <CheckCircle size={40} />
                   </div>
                   <h3 className="text-2xl font-bold text-blue-950 mb-2">Message Sent!</h3>
                   <p className="text-slate-600">Thank you for reaching out. We will get back to you shortly.</p>
                   <button onClick={() => setStatus(null)} className="mt-8 text-blue-600 font-bold text-sm hover:underline">Send another message</button>
                </div>
             ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <h4 className="text-2xl font-bold text-blue-950 mb-2">Send us a Message</h4>
                    <p className="text-slate-500 text-sm">Fill out the form below and we'll respond within 24 hours.</p>
                  </div>
                  
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-500 uppercase">Your Name</label>
                      <input 
                        name="name" 
                        required 
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all font-medium" 
                        placeholder="John Doe" 
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-500 uppercase">Phone Number</label>
                      <input 
                        name="phone" 
                        required 
                        value={formData.phone}
                        onChange={handleChange}
                        className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all font-medium" 
                        placeholder="+91 99999 99999" 
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 uppercase">Email Address</label>
                    <input 
                      name="email" 
                      type="email" 
                      required 
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all font-medium" 
                      placeholder="john@example.com" 
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 uppercase">Message</label>
                    <textarea 
                      name="message" 
                      rows="4" 
                      required 
                      value={formData.message}
                      onChange={handleChange}
                      className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all font-medium resize-none" 
                      placeholder="How can we help you?" 
                    ></textarea>
                  </div>

                  <button 
                    type="submit" 
                    disabled={loading}
                    className="w-full bg-blue-900 hover:bg-blue-800 text-white font-bold py-4 rounded-xl shadow-lg transition-all flex items-center justify-center gap-2"
                  >
                    {loading ? 'Sending...' : <>Send Message <Send size={18} /></>}
                  </button>
                </form>
             )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;