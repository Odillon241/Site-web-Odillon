"use client";

import { ArrowLeft, MapPin, Search, Camera } from "lucide-react";
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
      <DialogContent className="z-[9999] max-w-6xl w-[95vw] h-[90vh] p-0 rounded-2xl border-none bg-white shadow-2xl overflow-hidden flex flex-col">
        {album && (
          <>
            <div className="shrink-0 p-5 md:p-6 border-b border-gray-100 bg-white">
              <div className="flex flex-col gap-4">
                <div className="flex items-start gap-4">
                  <Button
                    variant="ghost"
                    onClick={onClose}
                    className="h-10 w-10 p-0 shrink-0 rounded-full bg-gray-50 hover:bg-gray-100 text-gray-500"
                    aria-label="Retour à la photothèque"
                  >
                    <ArrowLeft className="w-5 h-5" />
                  </Button>

                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-3">
                      <DialogTitle className="font-baskvill italic text-2xl md:text-3xl text-gray-950 truncate">
                        {album.title}
                      </DialogTitle>
                      <Badge variant="secondary" className="bg-odillon-teal/10 text-odillon-teal hover:bg-odillon-teal/20 border-none font-medium">
                        {album.photos.length} photo{album.photos.length > 1 ? "s" : ""}
                      </Badge>
                    </div>

                    <div className="mt-1 flex flex-wrap items-center gap-2 text-sm text-gray-500">
                      {album.date && <span>{album.date}</span>}
                      {album.date && album.location && <span>•</span>}
                      {album.location && <span>{album.location}</span>}
                    </div>

                    {(album.coverPhoto.event_description || album.coverPhoto.details) && (
                      <p className="mt-3 text-sm md:text-base text-gray-600 max-w-4xl line-clamp-2 md:line-clamp-none">
                        {album.coverPhoto.event_description || album.coverPhoto.details}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 md:p-6 bg-gray-50/50">
              <div className="columns-1 sm:columns-2 md:columns-3 lg:columns-4 gap-4 space-y-4">
                {album.photos.map((photo, idx) => (
                  <BlurFade key={photo.id} delay={0.04 * Math.min(idx, 16)}>
                    <div
                      className="break-inside-avoid relative group rounded-lg overflow-hidden cursor-zoom-in bg-white shadow-sm hover:shadow-xl transition-all duration-300 ring-1 ring-gray-950/5"
                      onClick={() => onPhotoClick(photo)}
                    >
                      <img
                        src={photo.url}
                        alt={photo.description}
                        className="w-full h-auto object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                        loading="lazy"
                      />

                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />

                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <div className="w-12 h-12 rounded-full bg-white/30 backdrop-blur-md flex items-center justify-center scale-75 group-hover:scale-100 transition-transform duration-300">
                          <Search className="w-5 h-5 text-white" />
                        </div>
                      </div>

                      {photo.location && (
                        <div className="absolute bottom-0 inset-x-0 p-3 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          <p className="text-white/90 text-xs font-medium flex items-center gap-1.5 truncate">
                            <MapPin className="w-3 h-3 shrink-0" />
                            {photo.location}
                          </p>
                        </div>
                      )}
                    </div>
                  </BlurFade>
                ))}
              </div>

              {album.photos.length === 0 && (
                <div className="flex flex-col items-center justify-center h-full py-20 text-gray-400">
                  <Camera className="w-12 h-12 mb-3 opacity-30" />
                  <p className="text-sm">Aucune photo dans cet album</p>
                </div>
              )}
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
