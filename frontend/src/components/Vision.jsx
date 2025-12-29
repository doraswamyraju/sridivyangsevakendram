import React from 'react';
import { Building2, Palette, Trophy, Scissors, Monitor, Shield } from 'lucide-react';

const Vision = ({ openModal }) => {
  return (
    <section id="vision" className="py-24 bg-slate-50 relative overflow-hidden">
      <div className="container mx-auto px-6 relative z-10">
        <div className="bg-blue-950 rounded-[2.5rem] overflow-hidden shadow-2xl relative">
          <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/diagmonds-light.png')]"></div>
          
          <div className="p-8 md:p-16 text-white relative z-10">
            <div className="max-w-3xl mb-12">
               <div className="flex items-center gap-2 text-amber-400 font-bold uppercase tracking-wider text-xs mb-6">
                 <Building2 size={16} /> Mega Project Proposal
               </div>
               <h2 className="text-3xl md:text-5xl font-extrabold mb-6 text-white">
                 Vision 2026: <br/>
                 <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-200 to-amber-500">
                   Sri Divyang Kalakshetram
                 </span>
               </h2>
               <p className="text-blue-100 text-lg leading-relaxed">
                 To expand our horizons, we have designed a visionary mega-project. This proposed facility is not just a building, but a holistic ecosystem designed to nurture talent, ensure livelihoods, and provide dignity.
               </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-sm hover:bg-white/10 transition-colors">
                   <div className="w-10 h-10 bg-pink-500/20 text-pink-300 rounded-lg flex items-center justify-center mb-4"><Palette size={20} /></div>
                   <h4 className="font-bold text-xl mb-3">Cultural Arts & Therapy</h4>
                   <p className="text-sm text-blue-200 mb-4">Art as a medium for therapy and confidence building.</p>
                   <ul className="text-xs text-slate-300 space-y-1.5 list-disc pl-4"><li>Bharatanatyam & Kuchipudi</li><li>Kathakali & Folk Dance</li></ul>
                </div>

                <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-sm hover:bg-white/10 transition-colors">
                   <div className="w-10 h-10 bg-green-500/20 text-green-300 rounded-lg flex items-center justify-center mb-4"><Trophy size={20} /></div>
                   <h4 className="font-bold text-xl mb-3">Sports Academy</h4>
                   <p className="text-sm text-blue-200 mb-4">Physical fitness and competitive spirit training.</p>
                   <ul className="text-xs text-slate-300 space-y-1.5 list-disc pl-4"><li>Chess (Cognitive skills)</li><li>Cricket (Team training)</li></ul>
                </div>

                <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-sm hover:bg-white/10 transition-colors">
                   <div className="w-10 h-10 bg-amber-500/20 text-amber-300 rounded-lg flex items-center justify-center mb-4"><Scissors size={20} /></div>
                   <h4 className="font-bold text-xl mb-3">Vocational Workshops</h4>
                   <p className="text-sm text-blue-200 mb-4">Production units for financial independence.</p>
                   <ul className="text-xs text-slate-300 space-y-1.5 list-disc pl-4"><li>Kalamkari Art Preservation</li><li>Embroidery & Stitching</li></ul>
                </div>

                <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-sm hover:bg-white/10 transition-colors">
                   <div className="w-10 h-10 bg-cyan-500/20 text-cyan-300 rounded-lg flex items-center justify-center mb-4"><Monitor size={20} /></div>
                   <h4 className="font-bold text-xl mb-3">Computer Education</h4>
                   <p className="text-sm text-blue-200 mb-4">Modern digital literacy for the corporate world.</p>
                   <ul className="text-xs text-slate-300 space-y-1.5 list-disc pl-4"><li>Digital Literacy Basics</li><li>Coding & Software Training</li></ul>
                </div>

                <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-sm hover:bg-white/10 transition-colors lg:col-span-2">
                   <div className="w-10 h-10 bg-purple-500/20 text-purple-300 rounded-lg flex items-center justify-center mb-4"><Shield size={20} /></div>
                   <h4 className="font-bold text-xl mb-3">Women Resource Center</h4>
                   <p className="text-sm text-blue-200 mb-4">A safe space for counseling, legal guidance, and entrepreneurship support.</p>
                </div>
            </div>

            <div className="bg-white/10 border border-white/20 p-6 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-6">
              <div>
                 <p className="text-amber-400 font-bold uppercase tracking-wider text-xs mb-1">Land Allotment Request</p>
                 <p className="text-white font-medium max-w-xl">
                    We earnestly request you to join and constribute in any way you feel fit.
                 </p>
              </div>
              <button onClick={() => openModal('donate')} className="bg-amber-500 hover:bg-amber-600 text-white py-3 px-8 rounded-xl font-bold shadow-lg shadow-amber-900/20 transition-all whitespace-nowrap">
                Support This Vision
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Vision;