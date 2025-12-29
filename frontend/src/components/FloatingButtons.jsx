import React from 'react';
import { Phone, Heart } from 'lucide-react';

const FloatingButtons = ({ openModal }) => {
  return (
    <div className="fixed bottom-6 right-6 z-40 flex flex-col gap-4">
      {/* Call Button - Opens Phone Dialer with Primary Number */}
      <a 
        href="tel:+919959934393" 
        className="w-14 h-14 bg-green-600 text-white rounded-full flex items-center justify-center shadow-lg shadow-green-900/20 hover:bg-green-700 transition-all hover:scale-110"
        title="Call Us"
      >
        <Phone size={24} />
      </a>

      {/* Support Button - Opens Donation Modal */}
      <button 
        onClick={() => openModal('donate')}
        className="w-14 h-14 bg-amber-500 text-white rounded-full flex items-center justify-center shadow-lg shadow-amber-900/20 hover:bg-amber-600 transition-all hover:scale-110 animate-bounce"
        title="Support Us"
      >
        <Heart size={24} fill="currentColor" />
      </button>
    </div>
  );
};

export default FloatingButtons;