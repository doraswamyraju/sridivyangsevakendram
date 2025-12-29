import React from 'react';
import { MessageSquareHeart } from 'lucide-react';
import TestimonialCard from './TestimonialCard';

const Testimonials = () => {
  const stories = [
    {
      id: 1,
      quote: "The tailoring training I received at SSK gave me a second life. I can now support my children independently without relying on anyone else.",
      author: "Lakshmi Devi",
      role: "Women's Program Beneficiary",
      image: "https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?q=80&w=200&auto=format&fit=crop"
    },
    {
      id: 2,
      quote: "SSK provided my son with hearing aids and speech therapy. Seeing him communicate with confidence in school is a miracle I prayed for.",
      author: "Ravi Kumar",
      role: "Parent of Special Child",
      image: "https://images.unsplash.com/photo-1566492031773-4f4e44671857?q=80&w=200&auto=format&fit=crop"
    },
    {
      id: 3,
      quote: "The elderly day care center is like a second home. I find companionship, medical help, and care here that I missed for years.",
      author: "Srinivas Rao",
      role: "Senior Citizen",
      image: "https://images.unsplash.com/photo-1552562547-669d06b3a042?q=80&w=200&auto=format&fit=crop"
    }
  ];

  return (
    <section id="stories" className="py-24 bg-gradient-to-b from-slate-50 to-white relative overflow-hidden">
      
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent"></div>

      <div className="container mx-auto px-6 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-800 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest mb-4">
            <MessageSquareHeart size={14} />
            Real Impact
          </div>
          <h2 className="text-3xl md:text-4xl font-extrabold text-blue-950 mb-4">
            Voices of <span className="text-amber-500">Change</span>
          </h2>
          <p className="text-slate-600 text-lg">
            Behind every statistic is a human story. Here is what our beneficiaries have to say about their journey with SSK Trust.
          </p>
        </div>

        {/* Cards Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {stories.map((story) => (
            <TestimonialCard 
              key={story.id}
              quote={story.quote}
              author={story.author}
              role={story.role}
              image={story.image}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;