"use client";

import { useEffect, useCallback, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, m } from "framer-motion";
import { X, ChevronLeft, ChevronRight, MapPin, Info } from "lucide-react";
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
  const [showInfo, setShowInfo] = useState(true);
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
    const dir = idx > currentIndex ? 'next' : 'prev';
    setDirection(idx > currentIndex ? 1 : -1);
    // Navigate step by step to reach the target
    // Since we only have prev/next, we simulate direct navigation
    const diff = idx - currentIndex;
    const navDir = diff > 0 ? 'next' : 'prev';
    const steps = Math.abs(diff);
    for (let i = 0; i < steps; i++) {
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
      } else if (e.key === 'i' || e.key === 'I') {
        e.preventDefault();
        setShowInfo(prev => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [photo, handleNavigate, onClose]);

  // Slide animation variants
  const slideVariants = {
    enter: (dir: number) => ({
      x: dir > 0 ? 300 : -300,
      opacity: 0,
      scale: 0.95,
    }),
    center: {
      x: 0,
      opacity: 1,
      scale: 1,
    },
    exit: (dir: number) => ({
      x: dir > 0 ? -300 : 300,
      opacity: 0,
      scale: 0.95,
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
          className="fixed inset-0 z-[999999] bg-black"
          style={{ pointerEvents: 'auto' }}
          onClick={onClose}
        >
          {/* Progress bar at top */}
          <div className="absolute top-0 left-0 right-0 z-[100002] h-[2px] bg-white/5">
            <m.div
              className="h-full bg-gradient-to-r from-odillon-teal/80 to-odillon-teal"
              initial={false}
              animate={{ width: `${((currentIndex + 1) / photos.length) * 100}%` }}
              transition={{ duration: 0.3, ease: "easeOut" }}
            />
          </div>

          {/* Top bar */}
          <div
            className="absolute top-[2px] left-0 right-0 z-[100001] flex items-center justify-between px-4 sm:px-6 py-3"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Counter pill */}
            <m.div
              className="bg-white/8 backdrop-blur-2xl rounded-full px-5 py-2 text-white/90 text-sm font-medium border border-white/10"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <span className="text-odillon-teal font-semibold">{currentIndex + 1}</span>
              <span className="text-white/40 mx-1.5">/</span>
              <span>{photos.length}</span>
            </m.div>

            {/* Actions */}
            <div className="flex items-center gap-2">
              {/* Toggle info button */}
              <button
                className={`hidden md:flex text-white/60 hover:text-white rounded-full w-10 h-10 items-center justify-center transition-all ${showInfo ? 'bg-white/10' : 'hover:bg-white/10'}`}
                onClick={() => setShowInfo(prev => !prev)}
                type="button"
                title="Toggle info (I)"
              >
                <Info className="w-5 h-5" />
              </button>

              {/* Close Button */}
              <button
                className="text-white/60 hover:text-white hover:bg-white/10 rounded-full w-10 h-10 flex items-center justify-center transition-all"
                onClick={onClose}
                type="button"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Navigation Buttons */}
          {photos.length > 1 && (
            <>
              <button
                className="absolute left-3 sm:left-6 top-1/2 -translate-y-1/2 z-[100001] w-12 h-12 rounded-full bg-white/5 backdrop-blur-2xl border border-white/10 flex items-center justify-center text-white/60 hover:text-white hover:bg-white/15 hover:border-white/20 transition-all duration-200 group"
                onClick={(e) => {
                  e.stopPropagation();
                  handleNavigate('prev');
                }}
                type="button"
              >
                <ChevronLeft className="w-5 h-5 group-hover:-translate-x-0.5 transition-transform" />
              </button>

              <button
                className="absolute right-3 sm:right-6 top-1/2 -translate-y-1/2 z-[100001] w-12 h-12 rounded-full bg-white/5 backdrop-blur-2xl border border-white/10 flex items-center justify-center text-white/60 hover:text-white hover:bg-white/15 hover:border-white/20 transition-all duration-200 group"
                onClick={(e) => {
                  e.stopPropagation();
                  handleNavigate('next');
                }}
                type="button"
              >
                <ChevronRight className="w-5 h-5 group-hover:translate-x-0.5 transition-transform" />
              </button>
            </>
          )}

          {/* Main Content Area */}
          <div className="flex flex-col h-full" onClick={(e) => e.stopPropagation()}>
            {/* Image + Sidebar */}
            <div className="flex flex-col md:flex-row flex-1 min-h-0 pt-14">
              {/* Image Area */}
              <div className="flex-1 flex items-center justify-center px-16 sm:px-20 py-4 min-h-0 overflow-hidden">
                <AnimatePresence mode="wait" custom={direction}>
                  <m.img
                    key={photo.id}
                    src={photo.url}
                    alt={photo.description}
                    className="max-h-full max-w-full object-contain rounded-lg select-none shadow-2xl"
                    draggable={false}
                    custom={direction}
                    variants={slideVariants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={{ duration: 0.25, ease: [0.25, 0.1, 0.25, 1] }}
                  />
                </AnimatePresence>
              </div>

              {/* Info Sidebar */}
              <AnimatePresence>
                {showInfo && (
                  <m.div
                    initial={{ width: 0, opacity: 0 }}
                    animate={{ width: 'auto', opacity: 1 }}
                    exit={{ width: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    className="hidden md:block shrink-0 overflow-hidden"
                  >
                    <div className="w-80 lg:w-[360px] h-full bg-zinc-900 border-l border-zinc-800 flex flex-col">
                      <div className="p-7 space-y-6 overflow-y-auto flex-1">
                        {/* Title section */}
                        <div className="space-y-4">
                          <div className="w-8 h-[2px] bg-gradient-to-r from-odillon-teal to-odillon-teal/40 rounded-full" />
                          <h3 className="text-white font-baskvill text-2xl leading-tight tracking-tight">
                            {photo.description}
                          </h3>
                          {photo.location && (
                            <div className="flex items-center gap-2.5 text-white/50 text-sm">
                              <MapPin className="w-3.5 h-3.5 text-odillon-teal/70 shrink-0" />
                              <span>{photo.location}</span>
                            </div>
                          )}
                        </div>

                        {/* Details */}
                        {photo.details && (
                          <div className="space-y-3">
                            <div className="w-full h-px bg-gradient-to-r from-white/10 via-white/5 to-transparent" />
                            <p className="text-white/55 text-sm leading-relaxed">
                              {photo.details}
                            </p>
                          </div>
                        )}

                        {/* Photo metadata */}
                        {(photo.year || photo.activity_type) && (
                          <div className="space-y-3">
                            <div className="w-full h-px bg-gradient-to-r from-white/10 via-white/5 to-transparent" />
                            <div className="space-y-2">
                              {photo.year && (
                                <div className="flex items-center justify-between text-xs">
                                  <span className="text-white/30 uppercase tracking-wider">Annee</span>
                                  <span className="text-white/60">{photo.year}</span>
                                </div>
                              )}
                              {photo.activity_type && (
                                <div className="flex items-center justify-between text-xs">
                                  <span className="text-white/30 uppercase tracking-wider">Activite</span>
                                  <span className="text-white/60 capitalize">{photo.activity_type}</span>
                                </div>
                              )}
                            </div>
                          </div>
                        )}

                        {/* Keyboard hints */}
                        <div className="space-y-3 mt-auto">
                          <div className="w-full h-px bg-gradient-to-r from-white/10 via-white/5 to-transparent" />
                          <div className="flex flex-wrap items-center gap-3 text-white/25 text-xs">
                            <span className="flex items-center gap-1.5">
                              <kbd className="px-1.5 py-0.5 rounded bg-white/8 text-white/40 font-mono text-[10px] border border-white/5">&larr;</kbd>
                              <kbd className="px-1.5 py-0.5 rounded bg-white/8 text-white/40 font-mono text-[10px] border border-white/5">&rarr;</kbd>
                              <span className="ml-0.5">Naviguer</span>
                            </span>
                            <span className="flex items-center gap-1.5">
                              <kbd className="px-1.5 py-0.5 rounded bg-white/8 text-white/40 font-mono text-[10px] border border-white/5">I</kbd>
                              <span className="ml-0.5">Info</span>
                            </span>
                            <span className="flex items-center gap-1.5">
                              <kbd className="px-1.5 py-0.5 rounded bg-white/8 text-white/40 font-mono text-[10px] border border-white/5">Esc</kbd>
                              <span className="ml-0.5">Fermer</span>
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </m.div>
                )}
              </AnimatePresence>

              {/* Mobile Info Bar */}
              <div className="md:hidden flex-shrink-0 bg-gradient-to-t from-black via-black/90 to-transparent px-5 py-4 border-t border-white/5">
                <h3 className="text-white font-baskvill text-lg leading-tight truncate">
                  {photo.description}
                </h3>
                {photo.location && (
                  <div className="flex items-center gap-2 text-white/50 text-xs mt-1.5">
                    <MapPin className="w-3 h-3 text-odillon-teal/70" />
                    <span>{photo.location}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Thumbnail strip */}
            {photos.length > 1 && (
              <div
                className="flex-shrink-0 border-t border-white/5 bg-black/60 backdrop-blur-xl"
                onClick={(e) => e.stopPropagation()}
              >
                <div
                  ref={thumbnailsRef}
                  className="flex items-center gap-2 px-4 py-3 overflow-x-auto scrollbar-none"
                  style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                >
                  {photos.map((p, idx) => (
                    <button
                      key={p.id}
                      data-active={idx === currentIndex ? "true" : "false"}
                      onClick={() => handleThumbnailClick(idx)}
                      className={`
                        relative shrink-0 rounded-md overflow-hidden transition-all duration-200
                        ${idx === currentIndex
                          ? 'w-16 h-12 sm:w-20 sm:h-14 ring-2 ring-odillon-teal ring-offset-1 ring-offset-black opacity-100 scale-105'
                          : 'w-12 h-9 sm:w-14 sm:h-10 opacity-40 hover:opacity-70 hover:scale-105'
                        }
                      `}
                      type="button"
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
              </div>
            )}
          </div>
        </m.div>
      )}
    </AnimatePresence>,
    document.body
  );
}
