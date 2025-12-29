import React from 'react';
import { Activity, Users, Smile, Heart, Home, ArrowRight, HandHeart } from 'lucide-react';
import { Link } from 'react-router-dom';

// --- IMPORT LOCAL IMAGES ---
// Note: pwd is .jpeg, others are .jpg as per your file names
import imgPwd from '../assets/pwd.jpeg'; 
import imgWomen from '../assets/women.jpg';
import imgKids from '../assets/kids.jpg';
import imgElderly from '../assets/elderly.jpg';
import imgCommunity from '../assets/community.jpg';

const Programs = ({ openModal }) => {
  const programs = [
    {
      id: 'pwd-empowerment',
      title: "PwD Empowerment",
      desc: "Comprehensive support including education, vocational training, speech therapy, and assistive devices.",
      icon: Activity,
      color: "bg-blue-100 text-blue-600",
      image: imgPwd 
    },
    {
      id: 'women-empowerment',
      title: "Women Empowerment",
      desc: "Training in hand-based skills like Kalamkari, tailoring, and embroidery to support sustainable livelihoods.",
      icon: Users,
      color: "bg-pink-100 text-pink-600",
      image: imgWomen
    },
    {
      id: 'special-needs',
      title: "Children with Special Needs",
      desc: "Holistic development for hearing, visual, and physically challenged children via nutrition and education.",
      icon: Smile,
      color: "bg-amber-100 text-amber-600",
      image: imgKids
    },
    {
      id: 'elderly-care',
      title: "Elderly Care",
      desc: "Dignified aging for senior citizens. We provide medication support, nutritious food, and day care.",
      icon: Heart,
      color: "bg-red-100 text-red-600",
      image: imgElderly
    },
    {
      id: 'community-dev',
      title: "Community Development",
      desc: "Conducting personality development training, food distribution drives, and arranging talent competitions.",
      icon: Home,
      color: "bg-green-100 text-green-600",
      image: imgCommunity
    }
  ];

  return (
    <section id="programs" className="py-20 bg-slate-50">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-sm font-bold text-amber-600 uppercase tracking-widest mb-2">What We Do</h2>
          <h3 className="text-3xl md:text-4xl font-extrabold text-blue-950">Our 5 Pillars of Service</h3>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {programs.map((p) => (
            <div key={p.id} className="bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all border border-slate-100 group flex flex-col h-full overflow-hidden">
              
              {/* Image Section */}
              <div className="h-48 w-full relative overflow-hidden">
                <img 
                  src={p.image} 
                  alt={p.title} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-4 left-4">
                  <div className={`w-12 h-12 ${p.color} rounded-xl flex items-center justify-center shadow-lg`}>
                    <p.icon size={24} />
                  </div>
                </div>
              </div>

              {/* Content Section */}
              <div className="p-8 flex flex-col flex-grow">
                <h4 className="text-xl font-bold text-blue-950 mb-3">{p.title}</h4>
                <p className="text-slate-600 mb-6 leading-relaxed text-sm flex-grow">{p.desc}</p>
                
                <div className="flex items-center gap-4 mt-auto">
                   <Link to={`/program/${p.id}`} className="text-blue-600 font-bold text-sm flex items-center gap-1 hover:gap-2 transition-all">
                     Learn More <ArrowRight size={16} />
                   </Link>
                </div>
              </div>
            </div>
          ))}

          {/* 6th Card: JOIN OUR MISSION */}
          <div className="bg-blue-900 rounded-2xl p-8 shadow-xl text-white flex flex-col justify-center items-center text-center h-full overflow-hidden relative">
            <div className="absolute top-0 left-0 w-full h-full opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
            
            <div className="w-16 h-16 bg-amber-500 rounded-full flex items-center justify-center mb-6 animate-pulse z-10 shadow-lg shadow-amber-500/20">
                <HandHeart size={32} className="text-blue-900" />
            </div>
            <h4 className="text-2xl font-bold mb-3 z-10">Join Our Mission</h4>
            <p className="text-blue-200 mb-8 text-sm leading-relaxed z-10">
                We can't do this alone. Your time and skills can change a life today.
            </p>
            <button 
                onClick={() => openModal('volunteer')}
                className="bg-white text-blue-900 font-bold py-3 px-8 rounded-xl shadow-lg hover:bg-amber-50 transition-colors w-full z-10"
            >
                Become a Volunteer
            </button>
          </div>

        </div>
      </div>
    </section>
  );
};

export default Programs;