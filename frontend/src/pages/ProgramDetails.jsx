import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, CheckCircle, Heart, Activity, Users, Smile, Home, Camera } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import SupportModal from '../components/SupportModal';
import FloatingButtons from '../components/FloatingButtons';

// --- IMPORT THE NEW GALLERY COMPONENT ---
import ImageGallery from '../components/ImageGallery';

// --- CONFIGURATION ---
import { API_BASE_URL } from '../config'; 

// --- IMPORT LOCAL HERO IMAGES ---
import imgPwd from '../assets/pwd.jpeg';
import imgWomen from '../assets/women.jpg';
import imgKids from '../assets/kids.jpg';
import imgElderly from '../assets/elderly.jpg';
import imgCommunity from '../assets/community.jpg';

const ProgramDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  // State for Modals & Data
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [galleryImages, setGalleryImages] = useState([]); 

  // --- STATIC CONTENT DATABASE ---
  const programData = {
    "pwd-empowerment": {
      title: "PwD Empowerment",
      subtitle: "Comprehensive support for Persons with Disabilities.",
      image: imgPwd,
      icon: Activity,
      color: "text-blue-600",
      bg: "bg-blue-50",
      description: `
        Persons with Disabilities (PwDs) often face social isolation and a lack of economic opportunities. Our PwD Empowerment program focuses on holistic rehabilitation.
        
        We provide assistive devices (wheelchairs, crutches, hearing aids), specialized therapy (physiotherapy, speech therapy), and vocational training to ensure they can live with dignity. We also help them access government schemes and disability certificates.
      `,
      stats: [
        { label: "Assistive Devices", value: "500+" },
        { label: "Therapy Sessions", value: "1,200+" },
        { label: "Beneficiaries", value: "850" }
      ],
      impact: [
        "Enabled 200 individuals to walk independently.",
        "Facilitated government pensions for 150 families.",
        "Provided speech therapy to 80 children."
      ]
    },
    "women-empowerment": {
      title: "Women Empowerment",
      subtitle: "Training in hand-based skills like Kalamkari & Tailoring.",
      image: imgWomen,
      icon: Users,
      color: "text-pink-600",
      bg: "bg-pink-50",
      description: `
        Financial independence is the key to empowering women. We run skill development centers that train rural women and mothers of special children in traditional crafts.
        
        Our courses include Kalamkari painting, tailoring, embroidery, and jute bag making. We not only teach the craft but also help them market their products, ensuring a steady source of income.
      `,
      stats: [
        { label: "Women Trained", value: "350+" },
        { label: "Self-Help Groups", value: "12" },
        { label: "Monthly Income", value: "₹5L+" }
      ],
      impact: [
        "Established a Kalamkari production unit.",
        "Trained 50 mothers of special children.",
        "Provided sewing machines to 100 graduates."
      ]
    },
    "special-needs": {
      title: "Children with Special Needs",
      subtitle: "Holistic development for hearing, visual, and physically challenged children.",
      image: imgKids,
      icon: Smile,
      color: "text-amber-600",
      bg: "bg-amber-50",
      description: `
        Every child deserves a childhood filled with learning and joy. Our Special Education Centre caters to children with Autism, Cerebral Palsy, and Intellectual Disabilities.
        
        We provide individualized educational plans (IEPs), nutritious mid-day meals, and sensory integration therapy. Our goal is to mainstream these children into regular schools wherever possible.
      `,
      stats: [
        { label: "Children Enrolled", value: "120" },
        { label: "Special Educators", value: "15" },
        { label: "Mainstreamed", value: "25" }
      ],
      impact: [
        "Saw a 90% improvement in daily living skills.",
        "Regular health checkups reduced illness by 60%.",
        "Parent counseling helped 200 families."
      ]
    },
    "elderly-care": {
      title: "Elderly Care",
      subtitle: "Dignified aging for senior citizens.",
      image: imgElderly,
      icon: Heart,
      color: "text-red-600",
      bg: "bg-red-50",
      description: `
        Many elderly people in rural areas are abandoned or left without care. We provide a safety net for them.
        
        Our services include free medical camps for geriatric issues, distribution of medicines, cataract surgeries, and day-care facilities where they can socialize and receive nutritious meals.
      `,
      stats: [
        { label: "Seniors Supported", value: "400+" },
        { label: "Cataract Surgeries", value: "80" },
        { label: "Ration Kits", value: "150" }
      ],
      impact: [
        "Restored vision for 80 elderly people.",
        "Provide daily lunch to 50 destitute seniors.",
        "Organized pilgrimage tours for mental peace."
      ]
    },
    "community-dev": {
      title: "Community Development",
      subtitle: "Personality development and food distribution drives.",
      image: imgCommunity,
      icon: Home,
      color: "text-green-600",
      bg: "bg-green-50",
      description: `
        A strong community is built on empathy. We organize broad-based initiatives to uplift society as a whole.
        
        This includes 'Personality Development' workshops for rural youth, 'Food Drives' for the homeless during festivals, and 'Talent Competitions' to showcase the hidden skills of the differently-abled.
      `,
      stats: [
        { label: "Youth Trained", value: "1,000+" },
        { label: "Food Packets", value: "10k+" },
        { label: "Villages Adopted", value: "5" }
      ],
      impact: [
        "Conducted massive flood relief operations.",
        "Organized district-level sports meets.",
        "Planted 2,000 saplings in barren lands."
      ]
    }
  };

  const data = programData[id];

  // --- EFFECT 1: VALIDATE ID & SCROLL TOP ---
  useEffect(() => {
    if (!data) navigate('/');
    window.scrollTo(0, 0);
  }, [id, data, navigate]);

  // --- EFFECT 2: FETCH GALLERY IMAGES FROM ADMIN ---
  useEffect(() => {
    if (id) {
        fetch(`${API_BASE_URL}/gallery.php?program_id=${id}`)
          .then(res => res.json())
          .then(data => setGalleryImages(data))
          .catch(err => console.error("Gallery Fetch Error:", err));
    }
  }, [id]);

  if (!data) return null;

  return (
    <>
      <Header onOpenDonate={() => setIsModalOpen(true)} />
      <SupportModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} initialTab="donate" />
      <FloatingButtons openModal={() => setIsModalOpen(true)} />

      {/* Main Content */}
      <main className="min-h-screen pt-24 pb-20 bg-slate-50"> 
        
        {/* HERO IMAGE SECTION */}
        <div className="relative h-96 w-full shadow-lg">
            <img src={data.image} alt={data.title} className="w-full h-full object-cover brightness-50" />
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-white p-6">
                <div className={`w-16 h-16 ${data.bg} rounded-full flex items-center justify-center mb-4 shadow-lg animate-in zoom-in`}>
                    <data.icon size={32} className={data.color} />
                </div>
                <h1 className="text-4xl md:text-5xl font-extrabold mb-4 drop-shadow-lg">{data.title}</h1>
                <p className="text-lg md:text-xl text-slate-100 max-w-2xl drop-shadow-md">{data.subtitle}</p>
            </div>
        </div>

        {/* CONTENT CONTAINER */}
        <div className="container mx-auto px-6 -mt-16 relative z-10">
            
            {/* 1. INFO CARD */}
            <div className="bg-white rounded-3xl shadow-xl p-8 md:p-12 border border-slate-100 mb-12">
                <button onClick={() => navigate('/')} className="flex items-center gap-2 text-slate-500 hover:text-blue-900 font-bold mb-8 transition-colors">
                    <ArrowLeft size={20} /> Back to Home
                </button>

                <div className="grid lg:grid-cols-3 gap-12">
                    {/* Left: Text & Impact */}
                    <div className="lg:col-span-2 space-y-8">
                        <div>
                            <h2 className="text-2xl font-bold text-blue-950 mb-4">About this Program</h2>
                            <p className="text-slate-600 leading-relaxed whitespace-pre-line text-lg">
                                {data.description}
                            </p>
                        </div>

                        <div>
                            <h3 className="text-xl font-bold text-blue-950 mb-4">Our Impact</h3>
                            <div className="space-y-4">
                                {data.impact.map((item, index) => (
                                    <div key={index} className="flex items-start gap-3 p-4 bg-slate-50 rounded-xl border border-slate-100">
                                        <CheckCircle className="text-green-500 shrink-0 mt-1" size={20} />
                                        <span className="text-slate-700 font-medium">{item}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Right: Stats & Donate */}
                    <div className="space-y-6">
                        <div className="bg-slate-900 text-white p-8 rounded-2xl shadow-lg">
                            <h3 className="font-bold text-lg mb-6 text-amber-500 uppercase tracking-widest">At a Glance</h3>
                            <div className="space-y-6">
                                {data.stats.map((stat, i) => (
                                    <div key={i}>
                                        <div className="text-3xl font-bold mb-1">{stat.value}</div>
                                        <div className="text-slate-400 text-sm uppercase">{stat.label}</div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="bg-amber-50 p-8 rounded-2xl border border-amber-100 text-center">
                            <Heart size={40} className="text-amber-500 mx-auto mb-4 fill-current animate-pulse" />
                            <h3 className="text-xl font-bold text-amber-900 mb-2">Support this Cause</h3>
                            <p className="text-amber-800/80 mb-6 text-sm">Your help reaches directly to those in need.</p>
                            <button onClick={() => setIsModalOpen(true)} className="w-full bg-amber-500 hover:bg-amber-600 text-white font-bold py-4 rounded-xl shadow-lg transition-all">
                                Donate Now
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* 2. DYNAMIC GALLERY SECTION (USING NEW COMPONENT) */}
            <div className="space-y-6">
                <div className="flex items-center gap-3">
                    <Camera className="text-blue-900" size={28} />
                    <h2 className="text-2xl font-bold text-blue-900">Recent Activities</h2>
                </div>
                
                {/* Scrollable Gallery & Lightbox */}
                <ImageGallery images={galleryImages} />
            </div>

        </div>
      </main>
      <Footer />
    </>
  );
};

export default ProgramDetails;