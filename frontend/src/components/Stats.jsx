import React from 'react';
import { Users, Heart, HandHeart, Building2 } from 'lucide-react';

const Stats = () => {
  return (
    <section className="relative py-20 bg-blue-900 text-white overflow-hidden">
      <div className="container mx-auto px-6 relative z-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center divide-x divide-white/10">
          {[
            { num: "500+", label: "Beneficiaries Served", icon: Users },
            { num: "50+", label: "Women Empowered", icon: Heart },
            { num: "100%", label: "Free Support", icon: HandHeart },
            { num: "24/7", label: "Care Facilities", icon: Building2 }
          ].map((stat, idx) => (
            <div key={idx} className="px-4 group">
              <stat.icon className="mx-auto mb-4 text-blue-300 group-hover:text-amber-400 transition-colors" size={32} />
              <div className="text-4xl md:text-5xl font-extrabold text-white mb-2">{stat.num}</div>
              <div className="text-blue-200 text-xs font-bold uppercase tracking-widest">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Stats;