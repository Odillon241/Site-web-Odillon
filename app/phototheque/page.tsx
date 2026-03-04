"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { Search, Images } from "lucide-react";
import { Button } from "@/components/ui/button";
import { HeaderPro } from "@/components/layout/header-pro";
import { Footer } from "@/components/layout/footer";
import { FadeIn } from "@/components/magicui/fade-in";
import { VideoSection } from "@/components/sections/video-section";
import { Video } from "@/types/admin";

import { HeroSection } from "./_components/hero-section";
import { PhotoFilters } from "./_components/photo-filters";
import { AlbumCard } from "./_components/album-card";
import { AlbumModal } from "./_components/album-modal";
import { PhotoLightbox } from "./_components/photo-lightbox";
import { groupPhotosByEvent } from "./_components/types";
import type { Photo, Album, FilterState } from "./_components/types";

export default function PhotothequePage() {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [albums, setAlbums] = useState<Album[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<FilterState>({
    search: "",
    category: null,
  });
  const [selectedAlbum, setSelectedAlbum] = useState<Album | null>(null);
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [video, setVideo] = useState<Video | null>(null);
  const albumsRef = useRef<HTMLDivElement>(null);

  const scrollToAlbums = useCallback(() => {
    albumsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, []);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch(`/api/photos?active=true&section=phototheque&t=${Date.now()}`);
        const data = await response.json();
        const loadedPhotos = data.photos || [];
        setPhotos(loadedPhotos);
        setAlbums(groupPhotosByEvent(loadedPhotos));

        const videoRes = await fetch('/api/videos?active=true')
        if (videoRes.ok) {
          const vData = await videoRes.json()
          const found = (vData.videos || []).find((v: Video) => v.page === 'Photothèque' && v.section === 'Contenu')
          if (found) setVideo(found)
        }
      } catch (error) {
        console.error('Erreur lors du chargement des données:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const lightboxPhotos = selectedAlbum?.photos || [];

  const openLightbox = useCallback((photo: Photo) => {
    const idx = lightboxPhotos.findIndex(p => p.id === photo.id);
    setLightboxIndex(idx >= 0 ? idx : 0);
    setSelectedPhoto(photo);
  }, [lightboxPhotos]);

  const navigateLightbox = useCallback((direction: 'prev' | 'next') => {
    if (lightboxPhotos.length === 0) return;
    const newIndex = direction === 'next'
      ? (lightboxIndex + 1) % lightboxPhotos.length
      : (lightboxIndex - 1 + lightboxPhotos.length) % lightboxPhotos.length;
    setLightboxIndex(newIndex);
    setSelectedPhoto(lightboxPhotos[newIndex]);
  }, [lightboxPhotos, lightboxIndex]);

  const filteredAlbums = albums.filter((album) => {
    const searchMatch = !filters.search ||
      album.title.toLowerCase().includes(filters.search.toLowerCase()) ||
      (album.location && album.location.toLowerCase().includes(filters.search.toLowerCase()));

    const categoryMatch = !filters.category ||
      album.activityType === filters.category;

    return searchMatch && categoryMatch;
  });

  const featuredTypes = ['Formations', 'Séminaires', 'Ateliers'];
  const sortedFilteredAlbums = [...filteredAlbums].sort((a, b) => {
    const aIsFeatured = featuredTypes.includes(a.activityType || '');
    const bIsFeatured = featuredTypes.includes(b.activityType || '');
    if (aIsFeatured && !bIsFeatured) return -1;
    if (!aIsFeatured && bIsFeatured) return 1;
    return 0;
  });

  return (
    <>
      <HeaderPro />
      <main className="min-h-screen bg-white pt-[88px] md:pt-[104px]">
        <HeroSection>
          <PhotoFilters filters={filters} onFiltersChange={setFilters} onFilterClick={scrollToAlbums} />
        </HeroSection>

        <VideoSection video={video} />

        {/* Gallery Grid */}
        <section ref={albumsRef} className="container mx-auto px-4 pt-8 md:pt-12 pb-24 scroll-mt-24">
          <div className="flex justify-between items-end mb-10">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Images className="w-5 h-5 text-odillon-teal" />
                <h2 className="font-baskvill text-2xl md:text-3xl text-gray-900">Albums</h2>
              </div>
              <p className="text-sm text-gray-500">
                {sortedFilteredAlbums.length} événement{sortedFilteredAlbums.length > 1 ? 's' : ''} trouvé{sortedFilteredAlbums.length > 1 ? 's' : ''}
              </p>
            </div>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-6 gap-y-10">
              {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
                <div key={i} className="space-y-3">
                  <div className="aspect-[7/8] bg-gray-100 rounded-lg animate-pulse" />
                </div>
              ))}
            </div>
          ) : sortedFilteredAlbums.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-6 gap-y-10">
              {sortedFilteredAlbums.map((album, idx) => (
                <AlbumCard
                  key={album.id}
                  album={album}
                  index={idx}
                  onClick={() => setSelectedAlbum(album)}
                />
              ))}
            </div>
          ) : (
            <FadeIn>
              <div className="text-center py-24">
                <div className="w-20 h-20 bg-gray-50 rounded-lg flex items-center justify-center mx-auto mb-5 border border-gray-100">
                  <Search className="w-8 h-8 text-gray-300" />
                </div>
                <h3 className="font-baskvill text-xl text-gray-900 mb-2">Aucun résultat</h3>
                <p className="text-gray-500 text-sm max-w-sm mx-auto">
                  Aucun album ne correspond à vos critères. Essayez d&apos;autres termes de recherche ou filtres.
                </p>
                <Button
                  variant="outline"
                  onClick={() => setFilters({ search: "", category: null })}
                  className="mt-5 rounded-full border-odillon-teal/30 text-odillon-teal hover:bg-odillon-teal/5"
                >
                  Réinitialiser les filtres
                </Button>
              </div>
            </FadeIn>
          )}
        </section>
      </main>

      <Footer />

      <AlbumModal
        album={selectedAlbum}
        onClose={() => setSelectedAlbum(null)}
        onPhotoClick={openLightbox}
      />

      <PhotoLightbox
        photo={selectedPhoto}
        photos={lightboxPhotos}
        currentIndex={lightboxIndex}
        onClose={() => setSelectedPhoto(null)}
        onNavigate={navigateLightbox}
      />
    </>
  );
}
