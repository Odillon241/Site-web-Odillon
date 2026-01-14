"use client";

import React, { useState, useEffect } from "react";
import { AnimatePresence, m } from "framer-motion";
import { cn } from "@/lib/utils";
import { X, Calendar, MapPin, Search, ChevronRight, SortAsc, GraduationCap, Users2, Rocket, Lightbulb, Sparkles, LayoutGrid } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import { HeaderPro } from "@/components/layout/header-pro";
import { Footer } from "@/components/layout/footer";
import { FadeIn } from "@/components/magicui/fade-in";
import { BlurFade } from "@/components/magicui/blur-fade";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { StackedCardsInteraction } from "@/components/ui/stacked-cards-interaction";
import { VideoSection } from "@/components/sections/video-section";
import { Video } from "@/types/admin";

// Types
interface Photo {
  id: string;
  url: string;
  description: string;
  details: string | null;
  location: string | null;
  event_description?: string;
  theme_id: string | null;
  activity_type: string | null;
  month: number | null;
  year: number | null;
  is_active: boolean;
  display_order: number;
}

interface Album {
  id: string;
  title: string;
  photos: Photo[];
  coverPhoto: Photo;
  date?: string;
  location?: string | null;
  themeId?: string | null;
  activityType?: string | null;
}

interface FilterState {
  search: string;
  category: string | null;
}

// Activity Badge Component
const ActivityBadge: React.FC<{ type: string | null }> = ({ type }) => {
  if (!type) return null;

  const featured = ['Formations', 'Séminaires', 'Ateliers'];
  if (!featured.includes(type)) return null;

  const colors = {
    'Formations': 'bg-blue-500 text-white',
    'Séminaires': 'bg-purple-500 text-white',
    'Ateliers': 'bg-orange-500 text-white'
  };

  const icons = {
    'Formations': GraduationCap,
    'Séminaires': Users2,
    'Ateliers': Lightbulb
  };

  const Icon = icons[type as keyof typeof icons];

  return (
    <Badge className={cn('absolute top-2 right-2 z-10 shadow-lg', colors[type as keyof typeof colors])}>
      <Icon className="w-3 h-3 mr-1" />
      {type}
    </Badge>
  );
};

// Album Card Component
const AlbumCard: React.FC<{
  album: Album;
  onClick: () => void;
  index: number;
}> = ({ album, onClick, index }) => {

  const description = [
    (album.coverPhoto.details || "Pas de description"),
    album.date,
    album.location,
    `${album.photos.length} photos`
  ].filter(Boolean).join(" • ");

  const cardsData = album.photos.slice(0, 3).map((photo, i) => ({
    image: photo.url,
    title: i === 0 ? album.title : undefined,
    description: i === 0 ? description : undefined
  }));

  // Fallback if no photos (should not happen for valid albums)
  if (cardsData.length === 0) {
    cardsData.push({
      image: album.coverPhoto.url,
      title: album.title,
      description: description
    });
  }

  const featuredTypes = ['Formations', 'Séminaires', 'Ateliers'];
  const isFeatured = featuredTypes.includes(album.activityType || '');

  return (
    <BlurFade delay={0.05 * index}>
      <div
        className={cn(
          "relative w-full aspect-[7/8] max-w-[350px] mx-auto group perspective-1000 cursor-pointer transition-all",
          isFeatured && "ring-2 ring-odillon-teal/30 rounded-2xl hover:ring-odillon-teal/50 max-w-[400px]"
        )}
        onClick={onClick}
      >
        <ActivityBadge type={album.activityType ?? null} />
        <StackedCardsInteraction
          cards={cardsData}
          spreadDistance={20}
          rotationAngle={5}
        />
      </div>
    </BlurFade>
  );
};

// Helper: Group photos by description (Event Name)
function groupPhotosByEvent(photos: Photo[]): Album[] {
  const albumsMap = new Map<string, Photo[]>();

  photos.forEach(photo => {
    const key = photo.description.trim();
    if (!albumsMap.has(key)) {
      albumsMap.set(key, []);
    }
    albumsMap.get(key)!.push(photo);
  });

  return Array.from(albumsMap.entries()).map(([title, eventPhotos]) => {
    const cover = eventPhotos[0];
    const date = cover.month && cover.year
      ? new Date(cover.year, cover.month - 1).toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })
      : cover.month
        ? new Date(2024, cover.month - 1).toLocaleDateString('fr-FR', { month: 'long' })
        : undefined;

    return {
      id: title,
      title: title,
      photos: eventPhotos,
      coverPhoto: cover,
      date,
      location: cover.location,
      themeId: cover.theme_id,
      activityType: cover.activity_type
    };
  });
}

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
  const [video, setVideo] = useState<Video | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        // Fetch Photos
        const response = await fetch(`/api/photos?active=true&section=phototheque&t=${Date.now()}`);
        const data = await response.json();
        const loadedPhotos = data.photos || [];
        setPhotos(loadedPhotos);
        setAlbums(groupPhotosByEvent(loadedPhotos));

        // Fetch Video
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

  const filteredAlbums = albums.filter((album) => {
    const searchMatch = !filters.search ||
      album.title.toLowerCase().includes(filters.search.toLowerCase()) ||
      (album.location && album.location.toLowerCase().includes(filters.search.toLowerCase()));

    const categoryMatch = !filters.category ||
      album.activityType === filters.category;

    return searchMatch && categoryMatch;
  });

  // Sort albums: Featured types first (Formations, Séminaires, Ateliers)
  const featuredTypes = ['Formations', 'Séminaires', 'Ateliers'];
  const sortedFilteredAlbums = [...filteredAlbums].sort((a, b) => {
    const aIsFeatured = featuredTypes.includes(a.activityType || '');
    const bIsFeatured = featuredTypes.includes(b.activityType || '');
    if (aIsFeatured && !bIsFeatured) return -1;
    if (!aIsFeatured && bIsFeatured) return 1;
    return 0;
  });

  const activityOptions = [
    { id: "formation", label: "Formations", icon: GraduationCap },
    { id: "seminaire", label: "Séminaires", icon: Users2 },
    { id: "team-building", label: "Team Building", icon: Rocket },
    { id: "atelier", label: "Ateliers", icon: Lightbulb },
    { id: "evenement", label: "Événements", icon: Sparkles },
  ];

  return (
    <>
      <HeaderPro />
      <main className="min-h-screen bg-transparent">
        {/* Modern Hero Section */}
        <section className="relative pt-32 pb-20 overflow-hidden">
          <div className="absolute inset-0 -z-10">
            <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-odillon-teal/10 rounded-full blur-[100px]" />
            <div className="absolute bottom-[-10%] left-[-5%] w-[500px] h-[500px] bg-odillon-lime/10 rounded-full blur-[100px]" />
          </div>

          <div className="container mx-auto px-4 text-center">
            <FadeIn>
              <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-gray-900 mb-6">
                Revivez nos <span className="text-odillon-teal relative inline-block">
                  moments forts
                  <svg className="absolute w-full h-3 -bottom-1 left-0 text-odillon-lime/40 -z-10" viewBox="0 0 100 10" preserveAspectRatio="none">
                    <path d="M0 5 Q 50 10 100 5 L 100 10 L 0 10 Z" fill="currentColor" />
                  </svg>
                </span>
              </h1>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-10 leading-relaxed">
                Une collection d'instants capturés lors de nos événements, séminaires et activités. Plongez au cœur de la vie de notre communauté.
              </p>
            </FadeIn>

            {/* Structured Categories (Rubriques) */}
            <FadeIn delay={0.2} className="max-w-5xl mx-auto space-y-12">
              {/* Minimal Search at the top */}
              <div className="relative max-w-md mx-auto group">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300 group-focus-within:text-odillon-teal transition-colors" />
                <Input
                  placeholder="Rechercher par nom d'événement..."
                  className="pl-11 bg-white/50 border-gray-100 focus:bg-white transition-all rounded-full h-12 shadow-sm focus:shadow-md"
                  value={filters.search}
                  onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                />
              </div>

              {/* Activity Categories Section */}
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                    <span className="w-8 h-8 rounded-lg bg-odillon-lime/10 flex items-center justify-center">
                      <ChevronRight className="w-4 h-4 text-odillon-lime-dark" />
                    </span>
                    Explorer par Activité
                  </h2>
                </div>
                <div className="flex flex-wrap justify-center gap-3">
                  <button
                    onClick={() => setFilters(prev => ({ ...prev, category: null }))}
                    className={cn(
                      "px-6 py-4 rounded-2xl text-sm font-semibold transition-all border flex items-center gap-2 shadow-sm",
                      filters.category === null
                        ? "bg-gray-900 border-gray-900 text-white scale-105"
                        : "bg-white border-gray-100 text-gray-600 hover:border-odillon-teal/30 hover:shadow-md"
                    )}
                  >
                    <LayoutGrid className="w-5 h-5" />
                    Tout voir
                  </button>
                  {activityOptions.map(activity => {
                    const Icon = activity.icon;
                    return (
                      <button
                        key={activity.id}
                        onClick={() => setFilters(prev => ({ ...prev, category: prev.category === activity.label ? null : activity.label }))}
                        className={cn(
                          "px-6 py-4 rounded-2xl text-sm font-semibold transition-all border flex items-center gap-2 shadow-sm",
                          filters.category === activity.label
                            ? "bg-odillon-teal border-odillon-teal text-white scale-105 shadow-lg"
                            : "bg-white border-gray-100 text-gray-600 hover:border-odillon-teal/30 hover:shadow-md"
                        )}
                      >
                        <Icon className="w-5 h-5 opacity-80" />
                        {activity.label}
                      </button>
                    );
                  })}
                </div>
              </div>
            </FadeIn>
          </div>
        </section>

        <VideoSection video={video} />

        {/* Gallery Grid */}
        <section className="container mx-auto px-4 pb-24">
          <div className="flex justify-between items-end mb-8 border-b border-gray-100 pb-4">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Albums</h2>
              <p className="text-sm text-gray-500 mt-1">{sortedFilteredAlbums.length} événement(s) trouvé(s)</p>
            </div>

            {/* Optional: Add sort functionality here if needed */}
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="aspect-[4/3] bg-gray-100 rounded-xl animate-pulse" />
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
            <div className="text-center py-20">
              <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="w-6 h-6 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900">Aucun résultat</h3>
              <p className="text-gray-500">Essayez d'autres termes de recherche ou filtres.</p>
              <Button
                variant="link"
                onClick={() => setFilters({ search: "", category: null })}
                className="mt-2 text-odillon-teal"
              >
                Réinitialiser tout
              </Button>
            </div>
          )}
        </section>
      </main >

      <Footer />

      {/* Album Detail Modal - Full Screen */}
      <Dialog open={!!selectedAlbum} onOpenChange={(open) => !open && setSelectedAlbum(null)}>
        <DialogContent className="max-w-[100vw] h-[100vh] p-0 rounded-none border-none bg-white overflow-hidden flex flex-col">
          {selectedAlbum && (
            <>
              {/* Modal Header */}
              <div className="flex-shrink-0 px-6 py-4 border-b flex items-center justify-between bg-white z-50">
                <div className="flex items-center gap-4">
                  <Button variant="ghost" size="icon" onClick={() => setSelectedAlbum(null)} className="rounded-full">
                    <X className="w-5 h-5" />
                  </Button>
                  <div>
                    <DialogTitle className="text-xl font-bold">{selectedAlbum.title}</DialogTitle>
                    <div className="flex items-center gap-3 text-sm text-gray-500">
                      {selectedAlbum.date && <span>{selectedAlbum.date}</span>}
                      {selectedAlbum.location && (
                        <>
                          <span>•</span>
                          <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {selectedAlbum.location}</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Badge variant="secondary">{selectedAlbum.photos.length} photos</Badge>
                </div>
              </div>

              {/* Masonry Grid Content */}
              <div className="flex-1 overflow-y-auto p-4 md:p-8 bg-gray-50">
                <div className="container mx-auto max-w-7xl">
                  <div className="columns-1 sm:columns-2 md:columns-3 lg:columns-4 gap-4 space-y-4">
                    {selectedAlbum.photos.map((photo, idx) => (
                      <BlurFade key={photo.id} delay={0.05 * idx}>
                        <div
                          className="break-inside-avoid relative group rounded-xl overflow-hidden cursor-zoom-in bg-gray-200"
                          onClick={() => setSelectedPhoto(photo)}
                        >
                          <img
                            src={photo.url}
                            alt={photo.description}
                            className="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-105"
                            loading="lazy"
                          />
                          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
                        </div>
                      </BlurFade>
                    ))}
                  </div>
                </div>
              </div>
            </>
          )}
          {/* Lightbox moved inside Dialog to share Portal context */}
          <AnimatePresence>
            {selectedPhoto && (
              <m.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-[9999] bg-black/95 backdrop-blur-xl flex items-center justify-center"
                onClick={() => setSelectedPhoto(null)}
              >
                {/* Close Button - High Z-index */}
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute top-4 right-4 z-[10000] text-white/70 hover:text-white hover:bg-white/10 rounded-full w-12 h-12"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedPhoto(null);
                  }}
                >
                  <X className="w-6 h-6" />
                </Button>

                <div className="relative w-full h-full flex flex-col items-center justify-center pb-20 p-4">
                  <m.img
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    src={selectedPhoto.url}
                    alt={selectedPhoto.description}
                    className="max-h-full max-w-full w-auto h-auto object-contain rounded-lg shadow-2xl"
                    onClick={(e) => e.stopPropagation()}
                  />
                </div>

                {/* Blurred Bottom Bar */}
                <div
                  className="absolute bottom-0 inset-x-0 z-[10000] p-6 bg-black/60 backdrop-blur-md border-t border-white/10 flex flex-col items-center text-center"
                  onClick={(e) => e.stopPropagation()}
                >
                  <h3 className="text-white font-semibold text-lg">{selectedPhoto.description}</h3>
                  {selectedPhoto.details && (
                    <p className="text-white/80 text-sm mt-1 max-w-2xl leading-relaxed">
                      {selectedPhoto.details}
                    </p>
                  )}
                </div>
              </m.div>
            )}
          </AnimatePresence>
        </DialogContent>
      </Dialog>

      {/* Lightbox */}

    </>
  );
}
