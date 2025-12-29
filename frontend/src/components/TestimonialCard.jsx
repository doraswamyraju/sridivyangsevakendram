import React from 'react';
import { Quote, Star } from 'lucide-react';

const TestimonialCard = ({ quote, author, role, image }) => (
  <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 relative overflow-hidden group hover:-translate-y-2 hover:shadow-xl transition-all duration-300 h-full flex flex-col">
    
    {/* Decorative Background Quote - Fades in on hover */}
    <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity text-blue-900">
      <Quote size={80} fill="currentColor" />
    </div>

    {/* Star Rating */}
    <div className="flex gap-1 text-amber-500 mb-6">
      {[1, 2, 3, 4, 5].map((i) => (
        <Star key={i} size={16} fill="currentColor" className="drop-shadow-sm" />
      ))}
    </div>

    {/* Quote Text */}
    <p className="text-slate-600 italic mb-8 leading-relaxed relative z-10 text-lg flex-grow">
      "{quote}"
    </p>

    {/* Author Section */}
    <div className="flex items-center gap-4 border-t border-slate-100 pt-6 mt-auto">
      {/* Avatar Image */}
      <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-amber-100 shrink-0">
        <img 
          src={image} 
          alt={author} 
          className="w-full h-full object-cover"
        />
      </div>
      
      {/* Name & Role */}
      <div>
        <h4 className="font-bold text-blue-900 leading-tight">{author}</h4>
        <p className="text-xs text-amber-600 font-bold uppercase tracking-wider mt-1">{role}</p>
      </div>
    </div>
  </div>
);

export default TestimonialCard;