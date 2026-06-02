"use client";

import { useEffect, useCallback, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, m } from "framer-motion";
import { X, ChevronLeft, ChevronRight, MapPin } from "lucide-react";
import type { Photo } from "./types";

interface PhotoLightboxProps {
  photo: Photo | null;
  photos: Photo[];
  currentIndex: number;
  onClose: () => void;
  onNavigate: (direction: 'prev' | 'next') => void;
}

export function PhotoLightbox({ photo, photos, currentIndex, onClose, onNavigate }: PhotoLightboxProps) {
  const [direction, setDirection] = useState<1 | -1>(1);
  const [mounted, setMounted] = useState(false);
  const thumbnailsRef = useRef<HTMLDivElement>(null);

  useEffect(() => { setMounted(true); }, []);

  // Scroll active thumbnail into view
  useEffect(() => {
    if (!thumbnailsRef.current) return;
    const activeThumb = thumbnailsRef.current.querySelector('[data-active="true"]');
    if (activeThumb) {
      activeThumb.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
    }
  }, [currentIndex]);

  // Navigate with direction tracking
  const handleNavigate = useCallback((dir: 'prev' | 'next') => {
    setDirection(dir === 'next' ? 1 : -1);
    onNavigate(dir);
  }, [onNavigate]);

  // Navigate to specific index via thumbnail
  const handleThumbnailClick = useCallback((idx: number) => {
    if (idx === currentIndex) return;
    const diff = idx - currentIndex;
    const navDir = diff > 0 ? 'next' : 'prev';
    setDirection(diff > 0 ? 1 : -1);
    
    // Quick skip
    for (let i = 0; i < Math.abs(diff); i++) {
      onNavigate(navDir);
    }
  }, [currentIndex, onNavigate]);

  // Keyboard navigation
  useEffect(() => {
    if (!photo) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') {
        e.preventDefault();
        handleNavigate('next');
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        handleNavigate('prev');
      } else if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [photo, handleNavigate, onClose]);

  // Slide animation variants
  const slideVariants = {
    enter: (dir: number) => ({
      x: dir > 0 ? 100 : -100,
      opacity: 0,
      scale: 0.98,
    }),
    center: {
      x: 0,
      opacity: 1,
      scale: 1,
    },
    exit: (dir: number) => ({
      x: dir > 0 ? -100 : 100,
      opacity: 0,
      scale: 0.98,
    }),
  };

  if (!mounted) return null;

  return createPortal(
    <AnimatePresence mode="wait">
      {photo && (
        <m.div
          key="lightbox-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-[999999] bg-black/95 backdrop-blur-xl flex flex-col"
          style={{ pointerEvents: 'auto' }}
          onClick={onClose}
        >
          {/* Top Bar */}
          <div 
            className="flex-shrink-0 flex items-center justify-between p-4 sm:p-6 lg:p-8" 
            onClick={e => e.stopPropagation()}
          >
            {/* Counter */}
            <div className="text-white/50 text-xs sm:text-sm font-medium tracking-widest uppercase">
              {currentIndex + 1} <span className="mx-2 text-white/20">/</span> {photos.length}
            </div>
             
            {/* Close */}
            <button
              className="w-10 h-10 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/25 text-white transition-colors"
              onClick={onClose}
              aria-label="Fermer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Main Image Area */}
          <div className="flex-1 min-h-0 relative flex items-center justify-center px-4 sm:px-16 lg:px-24 pb-4">
            {/* Nav Prev */}
            {photos.length > 1 && (
              <button 
                className="absolute left-2 sm:left-6 top-1/2 -translate-y-1/2 z-10 w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center rounded-full bg-black/50 hover:bg-white/20 text-white/70 hover:text-white transition-colors backdrop-blur-md" 
                onClick={(e) => { e.stopPropagation(); handleNavigate('prev'); }}
              >
                <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
              </button>
            )}

            <AnimatePresence mode="wait" custom={direction}>
              <m.img
                key={photo.id}
                src={photo.url}
                alt={photo.description}
                className="max-h-full max-w-full object-contain rounded-md drop-shadow-2xl"
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
                draggable={false}
              />
            </AnimatePresence>

            {/* Nav Next */}
            {photos.length > 1 && (
              <button 
                className="absolute right-2 sm:right-6 top-1/2 -translate-y-1/2 z-10 w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center rounded-full bg-black/50 hover:bg-white/20 text-white/70 hover:text-white transition-colors backdrop-blur-md" 
                onClick={(e) => { e.stopPropagation(); handleNavigate('next'); }}
              >
                <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
              </button>
            )}
          </div>

          {/* Bottom Info and Thumbnails */}
          <div 
            className="flex-shrink-0 flex flex-col items-center pb-6 sm:pb-8 pt-2 gap-6" 
            onClick={e => e.stopPropagation()}
          >
            {/* Info */}
            <div className="text-center max-w-4xl px-4">
              <h3 className="text-xl md:text-2xl font-baskvill italic text-white/95 mb-2.5">
                {photo.description}
              </h3>
              {(photo.details || photo.location) && (
                <p className="text-sm text-white/60 flex flex-wrap items-center justify-center gap-x-3 gap-y-1">
                  {photo.location && (
                    <span className="flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-odillon-teal" /> 
                      {photo.location}
                    </span>
                  )}
                  {photo.location && photo.details && <span className="hidden sm:inline">•</span>}
                  {photo.details && <span>{photo.details}</span>}
                </p>
              )}
            </div>

            {/* Thumbnails */}
            {photos.length > 1 && (
              <div 
                ref={thumbnailsRef} 
                className="flex items-center gap-2 overflow-x-auto max-w-full px-4 scrollbar-none" 
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
              >
                {photos.map((p, idx) => (
                  <button
                    key={p.id}
                    data-active={idx === currentIndex ? "true" : "false"}
                    onClick={() => handleThumbnailClick(idx)}
                    className={`relative shrink-0 rounded-[4px] overflow-hidden transition-all duration-300
                      ${idx === currentIndex 
                        ? 'w-16 h-12 ring-2 ring-odillon-teal opacity-100 scale-105' 
                        : 'w-14 h-10 opacity-30 hover:opacity-70'
                      }
                    `}
                  >
                    <img 
                      src={p.url} 
                      alt="" 
                      className="w-full h-full object-cover" 
                      loading="lazy"
                      draggable={false}
                    />
                  </button>
                ))}
              </div>
            )}
          </div>
        </m.div>
      )}
    </AnimatePresence>,
    document.body
  );
}
