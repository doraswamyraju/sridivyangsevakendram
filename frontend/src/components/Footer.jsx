import React from 'react';
import { Mail, Phone, MapPin, ChevronRight, Heart } from 'lucide-react';

const Footer = () => {
  return (
    <footer id="contact" className="bg-slate-900 text-white pt-24 pb-12 border-t border-slate-800">
      <div className="container mx-auto px-6">
        <div className="grid md:grid-cols-4 gap-12 mb-20">
          
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-amber-500 rounded-lg flex items-center justify-center text-blue-900 font-bold text-xl shadow-lg shadow-amber-500/20">S</div>
              <h4 className="text-2xl font-bold">SSK Trust</h4>
            </div>
            <p className="text-slate-400 text-sm leading-relaxed max-w-sm mb-8">
              Sri Divyang Seva Kendram Trust is a registered charitable organization committed to the welfare and empowerment of vulnerable sections of society in Tirupati District.
            </p>
            <div className="flex gap-4">
              {[Mail, Phone, MapPin].map((Icon, i) => (
                <div key={i} className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-amber-500 hover:text-blue-900 transition-all cursor-pointer group">
                  <Icon size={18} className="text-slate-400 group-hover:text-blue-900" />
                </div>
              ))}
            </div>
          </div>

          <div>
            <h5 className="font-bold text-white text-lg mb-6">Quick Links</h5>
            <ul className="space-y-4 text-sm text-slate-400">
              {['About Us', 'Our Programs', 'Expansion Vision', 'Contact Us', 'Privacy Policy'].map((link) => (
                <li key={link} className="cursor-pointer hover:text-amber-400 transition-colors flex items-center gap-2">
                  <ChevronRight size={12} className="text-slate-600" /> {link}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h5 className="font-bold text-white text-lg mb-6">Get in Touch</h5>
            <ul className="space-y-6 text-sm text-slate-400">
              <li className="flex items-start gap-3 group cursor-pointer">
                <MapPin size={20} className="mt-1 text-amber-500 shrink-0 group-hover:text-white transition-colors" />
                <span className="group-hover:text-white transition-colors leading-relaxed">
                  7-116, Padma Nagar, <br/>
                  Jeepalem Panchayati, Papanaidu Peta, <br/>
                  Renigunta - 517520
                </span>
              </li>
              <li className="flex items-center gap-3 group cursor-pointer">
                <Phone size={20} className="text-amber-500 shrink-0 group-hover:text-white transition-colors" />
                <span className="group-hover:text-white transition-colors">
                  +91 99599 34393 <br/> +91 77024 31381
                </span>
              </li>
              <li className="flex items-center gap-3 group cursor-pointer">
                <Mail size={20} className="text-amber-500 shrink-0 group-hover:text-white transition-colors" />
                <span className="group-hover:text-white transition-colors">contact@ssktrust.org</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-800 pt-8 flex flex-col md:flex-row justify-between items-center text-xs text-slate-500">
          <p>&copy; {new Date().getFullYear()} Sri Divyang Seva Kendram Trust. All Rights Reserved.</p>
          <p className="mt-2 md:mt-0 flex items-center gap-1">
            Designed with 
            <Heart size={14} className="text-red-600 fill-current animate-pulse" strokeWidth={0} /> 
            by 
            <a 
              href="https://www.rajugariventures.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-slate-300 hover:text-amber-400 hover:underline transition-colors font-medium"
            >
              Rajugari Ventures
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;