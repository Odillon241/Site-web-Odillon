"use client";

import { X, Calendar, MapPin, Search, Camera, Images } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import { BlurFade } from "@/components/magicui/blur-fade";
import { Badge } from "@/components/ui/badge";
import type { Album, Photo } from "./types";

interface AlbumModalProps {
  album: Album | null;
  onClose: () => void;
  onPhotoClick: (photo: Photo) => void;
}

export function AlbumModal({ album, onClose, onPhotoClick }: AlbumModalProps) {
  return (
    <Dialog open={!!album} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-[100vw] h-[100vh] p-0 rounded-none border-none bg-white overflow-hidden flex flex-col">
        {album && (
          <>
            {/* Modal Header - Enhanced with gradient background */}
            <div className="flex-shrink-0 relative overflow-hidden">
              {/* Subtle gradient background */}
              <div className="absolute inset-0 bg-gradient-to-r from-odillon-teal/[0.03] via-transparent to-odillon-teal/[0.02]" />

              <div className="relative px-5 sm:px-8 py-5 border-b border-gray-100/80 flex items-center justify-between z-10">
                <div className="flex items-center gap-4 sm:gap-5 min-w-0">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={onClose}
                    className="rounded-full shrink-0 hover:bg-gray-100 w-10 h-10"
                  >
                    <X className="w-5 h-5" />
                  </Button>

                  {/* Title and meta */}
                  <div className="min-w-0">
                    <DialogTitle className="font-baskvill text-xl sm:text-2xl truncate text-gray-900">
                      {album.title}
                    </DialogTitle>
                    <div className="flex items-center gap-3 text-xs sm:text-sm text-gray-400 mt-1">
                      {album.date && (
                        <span className="flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5 text-odillon-teal/60" />
                          <span>{album.date}</span>
                        </span>
                      )}
                      {album.location && (
                        <>
                          <span className="w-1 h-1 rounded-full bg-gray-200" />
                          <span className="flex items-center gap-1.5">
                            <MapPin className="w-3.5 h-3.5 text-odillon-teal/60" />
                            <span>{album.location}</span>
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                {/* Photo count badge */}
                <Badge
                  variant="secondary"
                  className="shrink-0 bg-odillon-teal/8 text-odillon-teal border border-odillon-teal/15 px-3.5 py-1.5 text-sm font-medium"
                >
                  <Images className="w-3.5 h-3.5 mr-1.5" />
                  {album.photos.length}
                </Badge>
              </div>
            </div>

            {/* Masonry Grid Content */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 md:p-10 bg-gradient-to-b from-gray-50/50 to-gray-50/80">
              <div className="container mx-auto max-w-7xl">
                <div className="columns-1 sm:columns-2 md:columns-3 lg:columns-4 gap-3 sm:gap-4 space-y-3 sm:space-y-4">
                  {album.photos.map((photo, idx) => (
                    <BlurFade key={photo.id} delay={0.04 * Math.min(idx, 16)}>
                      <div
                        className="break-inside-avoid relative group rounded-xl overflow-hidden cursor-zoom-in bg-gray-100 shadow-sm hover:shadow-xl transition-shadow duration-500"
                        onClick={() => onPhotoClick(photo)}
                      >
                        <img
                          src={photo.url}
                          alt={photo.description}
                          className="w-full h-auto object-cover transition-all duration-700 ease-out group-hover:scale-[1.04] group-hover:brightness-[0.85]"
                          loading="lazy"
                        />

                        {/* Hover overlay - gradient */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-400" />

                        {/* Hover content - zoom icon + description */}
                        <div className="absolute inset-0 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
                          <div className="w-11 h-11 rounded-full bg-white/20 backdrop-blur-md border border-white/20 flex items-center justify-center mb-3 transform scale-75 group-hover:scale-100 transition-transform duration-300">
                            <Search className="w-4.5 h-4.5 text-white" />
                          </div>
                        </div>

                        {/* Bottom caption on hover */}
                        {photo.location && (
                          <div className="absolute bottom-0 left-0 right-0 p-3 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-1 group-hover:translate-y-0">
                            <p className="text-white/90 text-xs font-medium flex items-center gap-1.5 truncate">
                              <MapPin className="w-3 h-3 shrink-0 text-odillon-teal/80" />
                              {photo.location}
                            </p>
                          </div>
                        )}
                      </div>
                    </BlurFade>
                  ))}
                </div>

                {/* Empty state */}
                {album.photos.length === 0 && (
                  <div className="flex flex-col items-center justify-center py-20 text-gray-400">
                    <Camera className="w-12 h-12 mb-3 opacity-30" />
                    <p className="text-sm">Aucune photo dans cet album</p>
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
