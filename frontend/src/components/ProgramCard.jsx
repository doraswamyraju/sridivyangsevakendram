import React from 'react';
import { ArrowRight } from 'lucide-react';

const ProgramCard = ({ image, icon, title, desc }) => (
  <div className="group rounded-2xl overflow-hidden cursor-pointer shadow-lg hover:shadow-2xl hover:shadow-blue-900/10 transition-all duration-300 transform hover:-translate-y-2 bg-white border border-slate-100 h-full flex flex-col">
    <div className="h-48 overflow-hidden relative shrink-0">
      <div className="absolute inset-0 bg-blue-900/20 group-hover:bg-transparent transition-colors z-10"></div>
      <img src={image} alt={title} className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700" />
      <div className="absolute top-4 right-4 z-20 bg-white p-2 rounded-lg shadow-md">
         {icon}
      </div>
    </div>
    <div className="p-8 flex flex-col flex-grow">
      <h4 className="text-xl font-bold text-blue-950 mb-3 group-hover:text-amber-600 transition-colors">{title}</h4>
      <p className="text-slate-600 text-sm leading-relaxed mb-6 flex-grow">{desc}</p>
      <span className="text-blue-600 text-sm font-bold flex items-center gap-2 group-hover:gap-3 transition-all mt-auto">
        Learn More <ArrowRight size={16}/>
      </span>
    </div>
  </div>
);

export default ProgramCard;