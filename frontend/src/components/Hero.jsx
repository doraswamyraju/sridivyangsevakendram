import React from 'react';
import { ArrowRight, Play } from 'lucide-react';
// We use the 'kids.jpg' you already saved for the hero image
import heroImg from '../assets/kids.jpg'; 

const Hero = ({ scrollToSection, openModal }) => {
  return (
    // ADDED pt-36 TO PUSH CONTENT DOWN BELOW THE FIXED HEADER
    <section id="home" className="relative pt-36 pb-20 bg-white overflow-hidden">
      
      {/* Background Decor (Optional faint shape) */}
      <div className="absolute top-0 right-0 w-1/2 h-full bg-blue-50/50 -skew-x-12 translate-x-20 z-0"></div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          
          {/* LEFT CONTENT */}
          <div className="space-y-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-amber-100 text-amber-700 rounded-full text-xs font-bold uppercase tracking-wider">
              <span className="w-2 h-2 bg-amber-500 rounded-full animate-pulse"></span>
              Serving Tirupati Since 2021
            </div>

            <h1 className="text-5xl md:text-6xl font-extrabold text-blue-900 leading-tight">
              Empowering <br/>
              <span className="text-blue-600">Every Ability.</span>
            </h1>

            <p className="text-slate-600 text-lg leading-relaxed max-w-lg">
              We don't just provide aid; we build independence. SSK Trust is dedicated to the welfare of PwDs, women, children, and the elderly through holistic care and skill training.
            </p>

            <div className="flex flex-wrap gap-4">
              <button 
                onClick={() => scrollToSection('vision')}
                className="bg-blue-900 text-white px-8 py-4 rounded-xl font-bold shadow-lg hover:bg-blue-800 transition-all flex items-center gap-2"
              >
                Our Future Vision <ArrowRight size={18} />
              </button>
              
              <button 
                onClick={() => openModal('volunteer')}
                className="px-8 py-4 rounded-xl font-bold text-blue-900 border-2 border-slate-200 hover:border-blue-900 hover:bg-blue-50 transition-all flex items-center gap-2"
              >
                Get Involved
              </button>
            </div>

            {/* Social Proof / Supporters */}
            <div className="flex items-center gap-4 pt-4">
              <div className="flex -space-x-4">
                 {[1,2,3].map(i => (
                   <div key={i} className="w-10 h-10 rounded-full bg-slate-200 border-2 border-white flex items-center justify-center text-xs font-bold text-slate-500">
                     User
                   </div>
                 ))}
                 <div className="w-10 h-10 rounded-full bg-amber-100 border-2 border-white flex items-center justify-center text-xs font-bold text-amber-600">
                   +2k
                 </div>
              </div>
              <p className="text-sm font-medium text-slate-500">Community Supporters</p>
            </div>
          </div>

          {/* RIGHT IMAGE */}
          <div className="relative">
            <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-white">
              <img 
                src={heroImg} 
                alt="Happy Children" 
                className="w-full h-[500px] object-cover hover:scale-105 transition-transform duration-700"
              />
              
              {/* Floating Quote Card */}
              <div className="absolute bottom-6 left-6 right-6 bg-white/90 backdrop-blur-sm p-6 rounded-xl border border-white/50 shadow-lg">
                <div className="flex gap-4">
                   <div className="w-10 h-10 bg-amber-500 rounded-full flex items-center justify-center text-white shrink-0">
                     <span className="text-2xl font-serif">"</span>
                   </div>
                   <div>
                     <p className="text-slate-700 font-medium italic text-sm">
                       "This initiative will uplift marginalized groups by equipping them with education, skills, dignity, and independence."
                     </p>
                     <p className="text-amber-600 text-xs font-bold mt-2 uppercase">
                       - N. Munilakshmi, President
                     </p>
                   </div>
                </div>
              </div>
            </div>

            {/* Decorative Dots */}
            <div className="absolute -z-10 -top-6 -right-6 grid grid-cols-4 gap-2">
               {[...Array(16)].map((_,i) => (
                 <div key={i} className="w-2 h-2 bg-blue-200 rounded-full"></div>
               ))}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default Hero;