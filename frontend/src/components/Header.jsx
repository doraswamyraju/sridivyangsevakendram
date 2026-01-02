import React, { useState } from 'react';
import { Menu, X, Heart } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import logo from '../assets/logo.png'; 

const Header = ({ onOpenDonate }) => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const handleNavClick = (sectionId) => {
    setIsOpen(false);
    
    // Logic for Resources page (External link behavior)
    if (sectionId === 'resources') {
        navigate('/resources');
        return;
    }

    // Logic for Scrolling on Home Page
    if (location.pathname === '/') {
      const element = document.getElementById(sectionId);
      if (element) element.scrollIntoView({ behavior: 'smooth' });
    } else {
      navigate('/');
      setTimeout(() => {
        const element = document.getElementById(sectionId);
        if (element) element.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }
  };

  const navLinks = [
    { name: 'Home', id: 'home' },
    { name: 'Programs', id: 'programs' },
    { name: 'Resources', id: 'resources' }, // <--- NEW LINK
    { name: 'Stories', id: 'stories' },
    { name: 'Vision 2026', id: 'vision' },
    { name: 'Contact', id: 'contact-us' },
  ];

  return (
    <header className="fixed w-full z-50 bg-white shadow-md py-3">
      <div className="container mx-auto px-6 flex justify-between items-center">
        
        {/* LOGO SECTION */}
        <div onClick={() => handleNavClick('home')} className="flex items-center gap-4 cursor-pointer">
          <img 
            src={logo} 
            alt="SSK Trust Logo" 
            className="h-20 w-auto object-contain" 
          />
          <div className="flex flex-col leading-tight text-blue-900">
            <span className="font-extrabold text-2xl tracking-tight">SSK Trust</span>
            <span className="text-xs font-bold tracking-widest uppercase opacity-70">Sri Divyang Seva Kendram</span>
          </div>
        </div>

        {/* DESKTOP NAVIGATION */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <button
              key={link.name}
              onClick={() => handleNavClick(link.id)}
              className="text-sm font-bold text-slate-600 hover:text-blue-900 transition-colors uppercase tracking-wide"
            >
              {link.name}
            </button>
          ))}
          <button 
            onClick={() => onOpenDonate('donate')}
            className="bg-amber-500 hover:bg-amber-600 text-white px-6 py-3 rounded-full font-bold text-sm transition-all shadow-lg flex items-center gap-2"
          >
            Support Us <Heart size={18} fill="currentColor" />
          </button>
        </nav>

        {/* MOBILE MENU BUTTON */}
        <button className="md:hidden text-blue-900" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X size={32} /> : <Menu size={32} />}
        </button>
      </div>

      {/* MOBILE DROPDOWN */}
      {isOpen && (
        <div className="md:hidden bg-white absolute top-full left-0 w-full shadow-xl border-t border-slate-100">
          <div className="flex flex-col p-6 space-y-4">
            {navLinks.map((link) => (
              <button
                key={link.name}
                onClick={() => handleNavClick(link.id)}
                className="text-left text-blue-900 font-bold py-3 border-b border-slate-50 last:border-0"
              >
                {link.name}
              </button>
            ))}
            <button 
              onClick={() => { setIsOpen(false); onOpenDonate('donate'); }}
              className="bg-amber-500 text-white w-full py-4 rounded-xl font-bold mt-2 flex justify-center gap-2"
            >
              Support Us <Heart size={18} fill="currentColor" />
            </button>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;