import React, { useState } from 'react';
import { X, ZoomIn } from 'lucide-react';

const ImageGallery = ({ images }) => {
  const [selectedImage, setSelectedImage] = useState(null);

  if (!images || images.length === 0) {
    return (
      <div className="w-full py-12 text-center bg-white rounded-xl border border-slate-200 border-dashed">
        <p className="text-slate-500 italic">No recent photos uploaded yet. Check back soon!</p>
      </div>
    );
  }

  return (
    <>
      {/* --- SCROLLABLE STRIP --- */}
      <div className="relative group">
        {/* Horizontal Scroll Container */}
        <div 
            className="flex overflow-x-auto gap-4 pb-4 snap-x" 
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }} // Hides scrollbar in Firefox/IE
        >
          {images.map((img, index) => (
            <div 
              key={img.id || index} 
              className="min-w-[280px] md:min-w-[350px] h-64 relative flex-shrink-0 snap-center rounded-2xl overflow-hidden border border-slate-200 bg-slate-50 cursor-pointer shadow-sm hover:shadow-md transition-all"
              onClick={() => setSelectedImage(img.image_path)}
            >
              <img 
                src={img.image_path} 
                alt="Activity" 
                className="w-full h-full object-contain p-2 hover:scale-105 transition-transform duration-500"
              />
              {/* Hover Overlay */}
              <div className="absolute inset-0 bg-black/0 hover:bg-black/10 transition-colors flex items-center justify-center group/icon">
                <ZoomIn className="text-white opacity-0 group-hover/icon:opacity-100 transform scale-75 group-hover/icon:scale-100 transition-all drop-shadow-md" size={32} />
              </div>
            </div>
          ))}
        </div>
        
        {/* Visual Fade on the right (Desktop only) to indicate scrolling */}
        <div className="absolute top-0 right-0 h-full w-20 bg-gradient-to-l from-slate-50/80 to-transparent pointer-events-none md:block hidden"></div>
      </div>

      {/* --- LIGHTBOX POPUP --- */}
      {selectedImage && (
        <div className="fixed inset-0 z-[60] bg-black/90 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200" onClick={() => setSelectedImage(null)}>
          
          {/* Close Button */}
          <button 
            onClick={() => setSelectedImage(null)}
            className="absolute top-6 right-6 text-white/70 hover:text-white bg-white/10 hover:bg-white/20 rounded-full p-2 transition-all z-50"
          >
            <X size={32} />
          </button>

          {/* Large Image */}
          <img 
            src={selectedImage} 
            alt="Full View" 
            className="max-w-full max-h-[90vh] rounded-lg shadow-2xl object-contain animate-in zoom-in-95 duration-300"
            onClick={(e) => e.stopPropagation()} // Prevent closing when clicking the image itself
          />
        </div>
      )}
    </>
  );
};

export default ImageGallery;