import React, { useState, useMemo } from 'react';
import { X, ZoomIn, Layers, ChevronLeft, ChevronRight, Grid } from 'lucide-react';

const ImageGallery = ({ images }) => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [activeAlbum, setActiveAlbum] = useState(null);

  // Group images into Albums and Singles
  const content = useMemo(() => {
    if (!images) return { singles: [], albums: {} };

    const singles = [];
    const albums = {};

    images.forEach(img => {
      if (img.group_id) {
        if (!albums[img.group_id]) {
          albums[img.group_id] = {
            title: img.title || 'Untitled Event',
            images: [],
            cover: img.image_path,
            date: img.created_at
          };
        }
        albums[img.group_id].images.push(img);
      } else {
        singles.push(img);
      }
    });

    return { singles, albums };
  }, [images]);

  if (!images || images.length === 0) {
    return (
      <div className="w-full py-12 text-center bg-white rounded-xl border border-slate-200 border-dashed">
        <p className="text-slate-500 italic">No recent photos uploaded yet. Check back soon!</p>
      </div>
    );
  }

  // --- ALBUM VIEW MODAL ---
  if (activeAlbum) {
    return (
      <div className="fixed inset-0 z-[50] bg-slate-50 flex flex-col animate-in slide-in-from-right duration-300">
        <div className="p-4 bg-white shadow-sm flex items-center justify-between z-10">
          <div className="flex items-center gap-3">
            <button onClick={() => setActiveAlbum(null)} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
              <ChevronLeft className="text-slate-700" size={24} />
            </button>
            <div>
              <h3 className="font-bold text-lg text-slate-900">{activeAlbum.title}</h3>
              <p className="text-xs text-slate-500">{activeAlbum.images.length} Photos</p>
            </div>
          </div>
          <button onClick={() => setActiveAlbum(null)} className="p-2 bg-slate-100 rounded-full">
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 max-w-7xl mx-auto">
            {activeAlbum.images.map((img, idx) => (
              <div
                key={idx}
                className="aspect-square relative group cursor-pointer overflow-hidden rounded-xl bg-slate-100 border border-slate-200"
                onClick={() => setSelectedImage(img)}
              >
                <img src={img.image_path} alt="" className="w-full h-full object-contain p-2 transition-transform duration-500 group-hover:scale-105" />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                  <ZoomIn className="text-slate-700 drop-shadow-md" size={28} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Reuse Lightbox for Album Images */}
        {selectedImage && (
          <div className="fixed inset-0 z-[60] bg-black/95 backdrop-blur flex items-center justify-center p-4 animate-in fade-in duration-200" onClick={(e) => { e.stopPropagation(); setSelectedImage(null); }}>
            <button onClick={() => setSelectedImage(null)} className="absolute top-6 right-6 text-white/70 hover:text-white bg-white/10 hover:bg-white/20 rounded-full p-2 transition-all z-50"><X size={32} /></button>
            <img src={selectedImage.image_path} alt="Full View" className="max-w-full max-h-[85vh] rounded shadow-2xl object-contain animate-in zoom-in-95 duration-300" onClick={(e) => e.stopPropagation()} />
            {/* Title Capability */}
            <div className="absolute bottom-6 left-0 w-full text-center pointer-events-none">
              <p className="inline-block bg-black/50 text-white px-4 py-2 rounded-full backdrop-blur-md text-sm font-medium">{selectedImage.title || activeAlbum.title}</p>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <>
      {/* --- SCROLLABLE STRIP --- */}
      <div className="relative group">
        <div
          className="flex overflow-x-auto gap-4 p-1 pb-4 snap-x"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {/* 1. RENDER ALBUMS FIRST */}
          {Object.entries(content.albums).map(([groupId, album]) => (
            <div
              key={groupId}
              className="min-w-[280px] md:min-w-[320px] h-64 relative flex-shrink-0 snap-center rounded-2xl overflow-hidden border border-slate-200 bg-white cursor-pointer shadow-sm hover:shadow-xl transition-all group/card"
              onClick={() => setActiveAlbum(album)}
            >
              {/* Stack Effect */}
              <div className="absolute top-2 right-2 bg-black/60 text-white text-xs px-2 py-1 rounded flex items-center gap-1 z-10 backdrop-blur-sm">
                <Layers size={14} /> {album.images.length}
              </div>

              <img src={album.cover} alt={album.title} className="w-full h-full object-contain p-1 transition-transform duration-700 group-hover/card:scale-105" />

              {/* Title Overlay */}
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-slate-900/90 via-slate-900/50 to-transparent p-4 pt-12">
                <h3 className="text-white font-bold text-lg leading-tight line-clamp-2 drop-shadow-md">{album.title}</h3>
                <p className="text-white/80 text-xs mt-1">View Album</p>
              </div>
            </div>
          ))}

          {/* 2. RENDER SINGLES */}
          {content.singles.map((img, index) => (
            <div
              key={img.id || index}
              className="min-w-[280px] md:min-w-[350px] h-64 relative flex-shrink-0 snap-center rounded-2xl overflow-hidden border border-slate-200 bg-slate-50 cursor-pointer shadow-sm hover:shadow-md transition-all"
              onClick={() => setSelectedImage(img)}
            >
              <img
                src={img.image_path}
                alt="Activity"
                className="w-full h-full object-contain p-2 hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-black/0 hover:bg-black/10 transition-colors flex items-center justify-center group/icon">
                <ZoomIn className="text-white opacity-0 group-hover/icon:opacity-100 transform scale-75 group-hover/icon:scale-100 transition-all drop-shadow-md" size={32} />
              </div>
            </div>
          ))}
        </div>

        {/* Visual Fade (Desktop only) */}
        <div className="absolute top-0 right-0 h-full w-20 bg-gradient-to-l from-slate-50/80 to-transparent pointer-events-none md:block hidden"></div>
      </div>

      {/* --- LIGHTBOX POPUP (FOR SINGLES) --- */}
      {selectedImage && !activeAlbum && (
        <div className="fixed inset-0 z-[60] bg-black/90 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200" onClick={() => setSelectedImage(null)}>
          <button onClick={() => setSelectedImage(null)} className="absolute top-6 right-6 text-white/70 hover:text-white bg-white/10 hover:bg-white/20 rounded-full p-2 transition-all z-50"><X size={32} /></button>
          <img src={selectedImage.image_path} alt="Full View" className="max-w-full max-h-[85vh] rounded-lg shadow-2xl object-contain animate-in zoom-in-95 duration-300" onClick={(e) => e.stopPropagation()} />
          {/* Title Capability */}
          {selectedImage.title && (
            <div className="absolute bottom-6 left-0 w-full text-center pointer-events-none">
              <p className="inline-block bg-black/50 text-white px-4 py-2 rounded-full backdrop-blur-md text-sm font-medium">{selectedImage.title}</p>
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default ImageGallery;