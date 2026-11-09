import React, { useState, useMemo, useEffect } from 'react';
import {
  X, ZoomIn, Layers, ChevronLeft, ChevronRight, Calendar, MapPin,
  Camera, ArrowLeft, ArrowRight, Sparkles
} from 'lucide-react';

const ImageGallery = ({ images }) => {
  const [activeAlbum, setActiveAlbum] = useState(null);
  const [lightboxIndex, setLightboxIndex] = useState(null);

  // Prevent background scrolling when modal is open
  useEffect(() => {
    if (activeAlbum || lightboxIndex !== null) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [activeAlbum, lightboxIndex]);

  // Group images into Albums and Singles
  const content = useMemo(() => {
    if (!images || !Array.isArray(images)) return { singles: [], albums: [] };

    const singles = [];
    const albums = [];

    images.forEach(item => {
      if (item.images && Array.isArray(item.images)) {
        albums.push({
          id: item.id,
          title: item.title || 'Program Event',
          description: item.description || '',
          event_date: item.event_date || null,
          venue: item.venue || '',
          cover: item.cover || item.image_path,
          images: item.images
        });
      } else if (item.group_id) {
        let existing = albums.find(a => a.id === item.group_id);
        if (!existing) {
          existing = {
            id: item.group_id,
            title: item.title || 'Event Gallery',
            description: '',
            cover: item.image_path,
            images: []
          };
          albums.push(existing);
        }
        existing.images.push(item);
      } else {
        singles.push(item);
      }
    });

    return { singles, albums };
  }, [images]);

  // Current active photos list for the lightbox
  const currentPhotoList = useMemo(() => {
    if (activeAlbum) return activeAlbum.images;
    return content.singles;
  }, [activeAlbum, content.singles]);

  const activePhoto = lightboxIndex !== null ? currentPhotoList[lightboxIndex] : null;

  const handlePrevPhoto = (e) => {
    e?.stopPropagation();
    if (lightboxIndex > 0) setLightboxIndex(lightboxIndex - 1);
    else setLightboxIndex(currentPhotoList.length - 1);
  };

  const handleNextPhoto = (e) => {
    e?.stopPropagation();
    if (lightboxIndex < currentPhotoList.length - 1) setLightboxIndex(lightboxIndex + 1);
    else setLightboxIndex(0);
  };

  if (!images || images.length === 0 || (content.singles.length === 0 && content.albums.length === 0)) {
    return (
      <div className="w-full py-16 text-center bg-white rounded-3xl border border-slate-200 border-dashed shadow-sm">
        <Camera className="mx-auto text-slate-300 mb-3 animate-pulse" size={44} />
        <h4 className="text-slate-700 font-bold text-lg">No recent activity photos yet</h4>
        <p className="text-slate-400 text-sm mt-1">Our latest program photos and stories will appear here soon.</p>
      </div>
    );
  }

  // --- FULLSCREEN ALBUM MODAL ---
  if (activeAlbum) {
    return (
      <div
        className="fixed inset-0 z-[100] bg-black/70 backdrop-blur-sm flex flex-col justify-end md:justify-center p-0 md:p-6 animate-in fade-in duration-200"
        onClick={() => setActiveAlbum(null)}
      >
        <div
          className="bg-slate-50 w-full h-[95vh] md:h-[90vh] md:max-w-6xl md:mx-auto rounded-t-3xl md:rounded-3xl shadow-2xl flex flex-col overflow-hidden border border-slate-200"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Top Header Bar */}
          <div className="bg-gradient-to-r from-blue-950 via-blue-900 to-slate-900 text-white px-5 py-4 md:px-8 flex items-center justify-between shadow-md shrink-0">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); setActiveAlbum(null); }}
                className="flex items-center gap-1.5 bg-white/15 hover:bg-white/25 text-white px-4 py-2 rounded-full text-xs md:text-sm font-bold backdrop-blur-md transition-all shadow-sm cursor-pointer"
              >
                <ArrowLeft size={16} /> Back to Program
              </button>
              <span className="text-blue-300 text-xs hidden sm:inline">|</span>
              <span className="text-xs text-blue-200 hidden sm:inline flex items-center gap-1">
                <Layers size={13} /> {activeAlbum.images.length} Photos
              </span>
            </div>

            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); setActiveAlbum(null); }}
              className="p-2 text-white/70 hover:text-white bg-white/10 hover:bg-white/20 rounded-full transition-all cursor-pointer"
              title="Close Album"
            >
              <X size={22} />
            </button>
          </div>

          {/* Scrollable Body */}
          <div className="flex-1 overflow-y-auto p-5 md:p-8 space-y-6">

            {/* Event Story Card */}
            <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-slate-100">
              <div className="flex flex-wrap items-center gap-3 text-xs font-semibold mb-3">
                {activeAlbum.event_date && (
                  <span className="flex items-center gap-1.5 bg-blue-50 text-blue-700 px-3 py-1 rounded-full">
                    <Calendar size={13} /> {new Date(activeAlbum.event_date).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' })}
                  </span>
                )}
                {activeAlbum.venue && (
                  <span className="flex items-center gap-1.5 bg-amber-50 text-amber-700 px-3 py-1 rounded-full">
                    <MapPin size={13} /> {activeAlbum.venue}
                  </span>
                )}
              </div>

              <h2 className="text-2xl md:text-3xl font-extrabold text-slate-800 leading-tight">
                {activeAlbum.title}
              </h2>

              {activeAlbum.description && (
                <div className="mt-4 pt-4 border-t border-slate-100">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">About This Program</h4>
                  <p className="text-slate-600 text-sm md:text-base leading-relaxed whitespace-pre-line">
                    {activeAlbum.description}
                  </p>
                </div>
              )}
            </div>

            {/* Photos Header */}
            <div className="flex items-center justify-between pt-2">
              <h3 className="font-bold text-slate-800 text-lg flex items-center gap-2">
                <Camera size={20} className="text-blue-600" />
                Event Photos ({activeAlbum.images.length})
              </h3>
              <span className="text-xs text-slate-400">Click any photo to view full size</span>
            </div>

            {/* Photos Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 pb-8">
              {activeAlbum.images.map((img, idx) => (
                <div
                  key={img.id || idx}
                  onClick={(e) => { e.stopPropagation(); setLightboxIndex(idx); }}
                  className="group relative aspect-[4/3] rounded-2xl overflow-hidden bg-slate-100 border border-slate-200 cursor-pointer shadow-sm hover:shadow-lg transition-all duration-300"
                >
                  <img
                    src={img.image_path}
                    alt=""
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />

                  {img.is_featured == 1 && (
                    <div className="absolute top-2.5 left-2.5 bg-amber-500/95 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow flex items-center gap-1 backdrop-blur-sm">
                      <Sparkles size={10} /> Featured
                    </div>
                  )}

                  <div className="absolute inset-0 bg-blue-950/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <div className="bg-white/90 text-slate-900 rounded-full p-2.5 shadow-lg transform scale-90 group-hover:scale-100 transition-transform">
                      <ZoomIn size={20} />
                    </div>
                  </div>
                </div>
              ))}
            </div>

          </div>
        </div>

        {/* --- LIGHTBOX MODAL --- */}
        {lightboxIndex !== null && activePhoto && (
          <div
            className="fixed inset-0 z-[110] bg-black/95 backdrop-blur-md flex flex-col justify-between p-4 md:p-6 animate-in fade-in duration-150"
            onClick={(e) => { e.stopPropagation(); setLightboxIndex(null); }}
          >
            {/* Lightbox Topbar */}
            <div className="flex items-center justify-between text-white z-10 px-2" onClick={e => e.stopPropagation()}>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={(e) => { e.stopPropagation(); setLightboxIndex(null); }}
                  className="flex items-center gap-1.5 bg-white/15 hover:bg-white/25 text-white px-3 py-1.5 rounded-full text-xs font-semibold backdrop-blur-md transition-all cursor-pointer"
                >
                  <ArrowLeft size={14} /> Back to Album
                </button>
                <span className="text-xs text-white/70 hidden sm:inline">
                  Photo {lightboxIndex + 1} of {currentPhotoList.length}
                </span>
              </div>

              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); setLightboxIndex(null); }}
                className="p-2 text-white/70 hover:text-white bg-white/10 hover:bg-white/20 rounded-full transition-all cursor-pointer"
              >
                <X size={24} />
              </button>
            </div>

            {/* Image & Navigation */}
            <div className="relative flex-1 flex items-center justify-center p-2" onClick={e => e.stopPropagation()}>
              {currentPhotoList.length > 1 && (
                <button
                  type="button"
                  onClick={handlePrevPhoto}
                  className="absolute left-2 md:left-6 z-20 p-3 rounded-full bg-white/15 hover:bg-white/30 text-white backdrop-blur-md transition-all shadow-xl cursor-pointer"
                  title="Previous"
                >
                  <ChevronLeft size={28} />
                </button>
              )}

              <img
                src={activePhoto.image_path}
                alt=""
                className="max-w-full max-h-[78vh] rounded-xl object-contain shadow-2xl animate-in zoom-in-95 duration-200"
              />

              {currentPhotoList.length > 1 && (
                <button
                  type="button"
                  onClick={handleNextPhoto}
                  className="absolute right-2 md:right-6 z-20 p-3 rounded-full bg-white/15 hover:bg-white/30 text-white backdrop-blur-md transition-all shadow-xl cursor-pointer"
                  title="Next"
                >
                  <ChevronRight size={28} />
                </button>
              )}
            </div>

            {/* Bottom Caption */}
            <div className="text-center text-white/70 text-xs py-2 pointer-events-none">
              {activeAlbum.title} • {lightboxIndex + 1} / {currentPhotoList.length}
            </div>
          </div>
        )}
      </div>
    );
  }

  // --- PROGRAM PAGE ALBUMS GRID ---
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {content.albums.map(album => (
          <div
            key={album.id}
            onClick={() => setActiveAlbum(album)}
            className="group bg-white rounded-3xl overflow-hidden border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col cursor-pointer hover:-translate-y-1"
          >
            {/* Cover Image Container */}
            <div className="h-56 relative overflow-hidden bg-slate-100">
              <img
                src={album.cover}
                alt={album.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                loading="lazy"
              />

              {/* Photo Count Badge */}
              <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-md text-white text-xs font-semibold px-2.5 py-1 rounded-full flex items-center gap-1.5 shadow">
                <Layers size={13} /> {album.images.length}
              </div>

              {/* Gradient Bottom Fade */}
              <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black/60 to-transparent pointer-events-none"></div>

              {/* Date & Venue on image overlay */}
              <div className="absolute bottom-3 left-3 right-3 flex items-center gap-2 text-[11px] text-white/90 font-medium">
                {album.event_date && (
                  <span className="flex items-center gap-1 bg-black/40 px-2 py-0.5 rounded-full backdrop-blur-sm">
                    <Calendar size={11} /> {new Date(album.event_date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                  </span>
                )}
                {album.venue && (
                  <span className="flex items-center gap-1 bg-black/40 px-2 py-0.5 rounded-full backdrop-blur-sm truncate max-w-[140px]">
                    <MapPin size={11} /> {album.venue}
                  </span>
                )}
              </div>
            </div>

            {/* Card Content */}
            <div className="p-6 flex-1 flex flex-col justify-between">
              <div>
                <h3 className="font-extrabold text-slate-800 text-lg group-hover:text-blue-600 transition-colors line-clamp-1 leading-snug">
                  {album.title}
                </h3>

                {album.description && (
                  <p className="text-slate-500 text-xs md:text-sm mt-2 line-clamp-2 leading-relaxed">
                    {album.description}
                  </p>
                )}
              </div>

              {/* Action Button */}
              <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between text-blue-600 font-bold text-xs">
                <span className="flex items-center gap-1.5 group-hover:translate-x-1 transition-transform">
                  Explore Album & Story <ArrowRight size={14} />
                </span>
                <span className="text-slate-400 font-normal">{album.images.length} Photos</span>
              </div>
            </div>
          </div>
        ))}

        {/* Render singles if present */}
        {content.singles.map((img, idx) => (
          <div
            key={img.id || idx}
            onClick={() => setLightboxIndex(idx)}
            className="group aspect-[4/3] rounded-3xl overflow-hidden bg-slate-100 border border-slate-100 shadow-sm hover:shadow-md transition-all cursor-pointer relative"
          >
            <img src={img.image_path} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
            <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <ZoomIn className="text-white drop-shadow" size={28} />
            </div>
          </div>
        ))}
      </div>

      {/* Lightbox for Singles */}
      {lightboxIndex !== null && !activeAlbum && activePhoto && (
        <div
          className="fixed inset-0 z-[110] bg-black/95 backdrop-blur-md flex flex-col justify-between p-4 animate-in fade-in"
          onClick={() => setLightboxIndex(null)}
        >
          <div className="flex justify-end p-2">
            <button onClick={() => setLightboxIndex(null)} className="text-white/80 hover:text-white p-2">
              <X size={28} />
            </button>
          </div>
          <div className="flex-1 flex items-center justify-center p-2">
            <img src={activePhoto.image_path} alt="" className="max-w-full max-h-[85vh] object-contain rounded-xl shadow-2xl" />
          </div>
        </div>
      )}
    </>
  );
};

export default ImageGallery;
