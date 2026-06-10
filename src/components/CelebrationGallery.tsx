import React, { useState } from 'react';
import { audio } from '../utils/audioSynth';
import { GalleryMedia } from '../types';
import { ZoomIn, Heart, Share2, Play, X, ChevronRight, ChevronLeft, Film, Image } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface CelebrationGalleryProps {
  mediaList: GalleryMedia[];
  onMediaSelect?: (media: GalleryMedia) => void;
  onLikeMedia: (id: string) => void;
}

export const CelebrationGallery: React.FC<CelebrationGalleryProps> = ({
  mediaList,
  onLikeMedia,
}) => {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const categories = ['all', ...Array.from(new Set(mediaList.map((m) => m.category)))];

  const filteredMedia = activeCategory === 'all'
    ? mediaList
    : mediaList.filter((m) => m.category === activeCategory);

  const handleOpenLightbox = (index: number) => {
    audio.playClick('gallery');
    setLightboxIndex(index);
  };

  const handleCloseLightbox = () => {
    audio.playClick('button');
    setLightboxIndex(null);
  };

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (lightboxIndex === null) return;
    audio.playClick('nav');
    setLightboxIndex((prev) => (prev !== null && prev > 0 ? prev - 1 : filteredMedia.length - 1));
  };

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (lightboxIndex === null) return;
    audio.playClick('nav');
    setLightboxIndex((prev) => (prev !== null && prev < filteredMedia.length - 1 ? prev + 1 : 0));
  };

  const handleLike = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    audio.playClick('button');
    onLikeMedia(id);
    
    // Spawn custom bursting sparkles
    window.dispatchEvent(new CustomEvent('celebrate-burst', {
      detail: { x: e.clientX, y: e.clientY }
    }));
  };

  const activeMedia = lightboxIndex !== null ? filteredMedia[lightboxIndex] : null;

  return (
    <div className="w-full">
      {/* Category Filters */}
      <div className="flex flex-wrap justify-center gap-2 mb-10">
        {categories.map((cat) => (
          <button
            key={cat}
            type="button"
            onClick={() => { audio.playClick('nav'); setActiveCategory(cat); }}
            className={`px-4 py-1.5 rounded-full text-xs font-mono font-medium tracking-wide border uppercase cursor-pointer transition-all ${
              activeCategory === cat
                ? 'bg-amber-400 border-amber-400 text-neutral-900 shadow-lg'
                : 'bg-neutral-900/40 border-white/5 text-neutral-400 hover:text-white hover:bg-neutral-800'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Masonry-grid layout */}
      <motion.div 
        layout
        className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6"
      >
        <AnimatePresence mode="popLayout">
          {filteredMedia.map((media, index) => (
            <motion.div
              layout
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.5 }}
              key={media.id}
              className="glass-card rounded-2xl overflow-hidden shadow-xl border border-white/5 group relative cursor-pointer"
              onClick={() => handleOpenLightbox(index)}
            >
              {/* Media Container Box */}
              <div className="aspect-square relative overflow-hidden bg-neutral-950">
                {media.type === 'video' ? (
                  <div className="w-full h-full relative">
                    <video 
                      src={media.url} 
                      muted 
                      loop 
                      autoPlay 
                      playsInline
                      className="w-full h-full object-cover opacity-85 group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute top-3 left-3 bg-neutral-900/80 p-1.5 rounded-lg border border-white/10">
                      <Film className="h-4 w-4 text-amber-400" />
                    </div>
                  </div>
                ) : (
                  <div className="w-full h-full relative">
                    <img 
                      src={media.url} 
                      alt={media.title}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute top-3 left-3 bg-neutral-900/80 p-1.5 rounded-lg border border-white/10">
                      <Image className="h-4 w-4 text-amber-400" />
                    </div>
                  </div>
                )}

                {/* Cover Overlay details on hover */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-5">
                  <span className="text-[10px] text-amber-400 font-mono tracking-widest font-semibold uppercase">{media.category}</span>
                  <h4 className="text-base font-semibold text-white mt-1">{media.title}</h4>
                  <p className="text-neutral-400 text-xs mt-1.5 line-clamp-2">{media.description}</p>
                  
                  <div className="flex items-center justify-between mt-4">
                    <button
                      type="button"
                      onClick={(e) => handleLike(media.id, e)}
                      className="flex items-center gap-1.5 text-xs text-rose-400 font-medium font-mono bg-rose-500/10 px-2.5 py-1 rounded-lg hover:bg-rose-500/20 transition-all cursor-pointer"
                    >
                      <Heart className="h-4 w-4 fill-current text-rose-500" />
                      <span>{media.likes}</span>
                    </button>
                    <ZoomIn className="h-4 w-4 text-white" />
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      {/* LIGHTBOX FULLSCREEN LIGHT VIEWER */}
      <AnimatePresence>
        {activeMedia && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/95 z-55 flex flex-col items-center justify-center p-4"
            onClick={handleCloseLightbox}
          >
            {/* Close button */}
            <button
              type="button"
              onClick={handleCloseLightbox}
              className="absolute top-6 right-6 p-2 bg-neutral-900/60 border border-white/10 hover:bg-neutral-800 text-neutral-400 hover:text-white rounded-full transition-colors cursor-pointer z-55"
            >
              <X className="h-6 w-6" />
            </button>

            {/* Navigation buttons */}
            <button
              type="button"
              onClick={handlePrev}
              className="absolute left-6 top-1/2 -translate-y-1/2 p-3 bg-neutral-900/60 border border-white/10 hover:bg-neutral-800 text-neutral-400 hover:text-white rounded-full transition-colors cursor-pointer z-55"
            >
              <ChevronLeft className="h-6 w-6" />
            </button>

            <button
              type="button"
              onClick={handleNext}
              className="absolute right-6 top-1/2 -translate-y-1/2 p-3 bg-neutral-900/60 border border-white/10 hover:bg-neutral-800 text-neutral-400 hover:text-white rounded-full transition-colors cursor-pointer z-55"
            >
              <ChevronRight className="h-6 w-6" />
            </button>

            {/* Main Stage Panel */}
            <div 
              className="max-w-4xl w-full max-h-[70vh] flex items-center justify-center relative overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {activeMedia.type === 'video' ? (
                <video
                  src={activeMedia.url}
                  controls
                  autoPlay
                  loop
                  playsInline
                  className="max-w-full max-h-[70vh] rounded-lg shadow-2xl object-contain border border-white/10"
                />
              ) : (
                <img
                  src={activeMedia.url}
                  alt={activeMedia.title}
                  referrerPolicy="no-referrer"
                  className="max-w-full max-h-[70vh] rounded-lg shadow-2xl object-contain border border-white/10 animate-[zoom-in_0.35s_ease-out]"
                />
              )}
            </div>

            {/* Sub metadata panel info */}
            <div 
              className="max-w-2xl w-full text-center mt-6 z-55"
              onClick={(e) => e.stopPropagation()}
            >
              <span className="text-xs text-amber-400 font-mono tracking-widest font-semibold uppercase">
                {activeMedia.category}
              </span>
              <h3 className="text-xl font-space font-bold text-white mt-1.5">{activeMedia.title}</h3>
              <p className="text-neutral-400 text-sm mt-2 font-sans">{activeMedia.description}</p>

              {/* Like action inside Lightbox */}
              <div className="flex justify-center items-center gap-6 mt-6">
                <button
                  type="button"
                  onClick={(e) => handleLike(activeMedia.id, e)}
                  className="flex items-center gap-2 text-sm text-rose-400 font-medium font-mono bg-rose-500/15 px-4 py-2 rounded-xl border border-rose-500/30 hover:bg-rose-500/25 transition-all cursor-pointer shadow"
                >
                  <Heart className="h-5 w-5 fill-current text-rose-500" />
                  <span>{activeMedia.likes} Likes</span>
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
