"use client";

import { useState, useEffect } from "react";
import { Search, Images, RotateCcw } from "lucide-react";

import { HeaderPro } from "@/components/layout/header-pro";
import { Footer } from "@/components/layout/footer";
import { FadeIn } from "@/components/magicui/fade-in";
import { VideoSection } from "@/components/sections/video-section";
import { Video } from "@/types/admin";

import { AlbumCard, AlbumUne } from "./_components/album-card";
import { AlbumModal } from "./_components/album-modal";
import { PhotoLightbox } from "./_components/photo-lightbox";
import { PhotoFilters } from "./_components/photo-filters";

import {
  compareAlbumsByDateDesc,
  groupPhotosByEvent,
} from "./_components/types";

import type {
  Photo,
  Album,
  FilterState,
} from "./_components/types";

export default function PhotothequePage() {
  const [albums, setAlbums] = useState<Album[]>([]);
  const [loading, setLoading] = useState(true);

  const [selectedAlbum, setSelectedAlbum] =
    useState<Album | null>(null);

  // Visionneuse : -1 = fermée. Elle s'ouvre par-dessus l'album, que l'on
  // masque le temps de la consultation (une fenêtre modale bloquerait les
  // interactions de la visionneuse) puis que l'on retrouve à la fermeture.
  const [visionneuse, setVisionneuse] = useState<{
    photos: Photo[];
    index: number;
    autoplay: boolean;
  }>({ photos: [], index: -1, autoplay: false });

  const ouvrirVisionneuse = (photos: Photo[], index: number, autoplay = false) =>
    setVisionneuse({ photos, index, autoplay });

  const [video, setVideo] =
    useState<Video | null>(null);

  const [filters, setFilters] =
    useState<FilterState>({
      search: "",
      category: null,
      year: null,
      month: null,
    });

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch(
          `/api/photos?active=true&section=phototheque&t=${Date.now()}`
        );

        const data = await response.json();

        const loadedPhotos = data.photos || [];

        setAlbums(
          groupPhotosByEvent(loadedPhotos)
        );

        const videoRes =
          await fetch("/api/videos?active=true");

        if (videoRes.ok) {
          const vData =
            await videoRes.json();

          const found =
            (vData.videos || []).find(
              (v: Video) =>
                (
                  v.page === "Photothèque" ||
                  v.page === "PhotothÃ¨que"
                ) &&
                v.section === "Contenu"
            );

          if (found) {
            setVideo(found);
          }
        }
      } catch (error) {
        console.error(
          "Erreur lors du chargement des données:",
          error
        );
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  /**
   * FILTRES
   */
  const filteredAlbums =
    albums.filter((album) => {
      const search =
        filters.search.toLowerCase();

      const searchMatch =
        !search ||
        album.title
          .toLowerCase()
          .includes(search) ||
        (
          album.location &&
          album.location
            .toLowerCase()
            .includes(search)
        );

      const categoryMatch =
        !filters.category ||
        album.activityType ===
          filters.category;

      const yearMatch =
        !filters.year ||
        album.coverPhoto.year ===
          filters.year;

      const monthMatch =
        !filters.month ||
        album.coverPhoto.month ===
          filters.month;

      return (
        searchMatch &&
        categoryMatch &&
        yearMatch &&
        monthMatch
      );
    });

  /**
   * Classement global :
   * plus récent → plus ancien.
   */
  const sortedAlbums =
    [...filteredAlbums].sort(
      compareAlbumsByDateDesc
    );

  const [albumUne, ...autresAlbums] = sortedAlbums;

  const filtresActifs =
    !!filters.search ||
    !!filters.category ||
    filters.year !== null ||
    filters.month !== null;

  const anneesDisponibles = Array.from(
    new Set(
      albums
        .map((album) => album.coverPhoto.year)
        .filter((annee): annee is number => !!annee)
    )
  ).sort((a, b) => b - a);

  /**
   * Compteurs par catégorie.
   */
  const albumCounts =
    albums.reduce(
      (acc, album) => {
        if (album.activityType) {
          acc[album.activityType] =
            (acc[album.activityType] ||
              0) + 1;
        }

        return acc;
      },
      {} as Record<string, number>
    );

  return (
    <>
      <HeaderPro />

      <main id="contenu" tabIndex={-1} className="outline-none od-page pt-14 md:pt-16">
        <section className="od-section scroll-mt-24 border-t-0 py-12 md:py-16">
          <div className="od-container">

            <div className="max-w-2xl">
              <div className="od-eyebrow mb-3">
                <Images className="w-4 h-4" />
                Photothèque
              </div>

              <h1 className="od-heading-display text-4xl md:text-5xl">
                Nos événements en images
              </h1>

              <p className="mt-3 text-sm md:text-base text-gray-600">
                Formations, séminaires et temps forts du Cabinet, du plus récent au plus ancien.
              </p>
            </div>

            <div className="mt-8 border-y border-gray-100 py-4">
              <PhotoFilters
                filters={filters}
                onFiltersChange={setFilters}
                albumCounts={albumCounts}
                annees={anneesDisponibles}
              />
              {!loading && filtresActifs && (
                <p className="mt-3 flex flex-wrap items-center gap-3 text-sm text-gray-500" aria-live="polite">
                  {sortedAlbums.length} album{sortedAlbums.length > 1 ? "s" : ""} trouvé{sortedAlbums.length > 1 ? "s" : ""}
                  <button
                    type="button"
                    onClick={() => setFilters({ search: "", category: null, year: null, month: null })}
                    className="inline-flex items-center gap-1.5 font-semibold text-odillon-teal hover:text-odillon-teal/80"
                  >
                    <RotateCcw className="size-3.5" aria-hidden="true" />
                    Réinitialiser
                  </button>
                </p>
              )}
            </div>

            <div className="mt-10">
              {loading ? (
                <div className="space-y-8" aria-busy="true">
                  <div className="h-[440px] rounded-2xl bg-gray-100 animate-pulse" />
                  <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="aspect-[4/3] rounded-xl bg-gray-100 animate-pulse" />
                    ))}
                  </div>
                </div>
              ) : albumUne ? (
                <div className="space-y-10 md:space-y-12">
                  <AlbumUne
                    key={albumUne.id}
                    album={albumUne}
                    onOpen={() => setSelectedAlbum(albumUne)}
                    onPhotoClick={(index) => ouvrirVisionneuse(albumUne.photos, index)}
                    onDiaporama={() => ouvrirVisionneuse(albumUne.photos, 0, true)}
                  />

                  {autresAlbums.length > 0 && (
                    <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                      {autresAlbums.map((album, idx) => (
                        <AlbumCard
                          key={album.id}
                          album={album}
                          index={idx}
                          onOpen={() => setSelectedAlbum(album)}
                        />
                      ))}
                    </ul>
                  )}
                </div>
              ) : (
                <FadeIn>
                  <div className="od-surface-muted text-center py-20 md:py-24">
                    <div className="w-16 h-16 bg-white rounded-xl flex items-center justify-center mx-auto mb-5 border border-[#00a795]/10">
                      <Search className="w-7 h-7 text-gray-300" />
                    </div>

                    <h2 className="od-heading-display text-2xl mb-2">
                      Aucun album
                    </h2>

                    <p className="text-gray-500 text-sm max-w-sm mx-auto">
                      Aucun album ne correspond aux critères sélectionnés.
                    </p>
                  </div>
                </FadeIn>
              )}
            </div>
          </div>
        </section>

        <VideoSection video={video} />
      </main>

      <Footer />

      <AlbumModal
        album={visionneuse.index >= 0 ? null : selectedAlbum}
        onClose={() => setSelectedAlbum(null)}
        onPhotoClick={(photo) => {
          if (!selectedAlbum) return;
          const index = selectedAlbum.photos.findIndex((p) => p.id === photo.id);
          ouvrirVisionneuse(selectedAlbum.photos, Math.max(index, 0));
        }}
      />

      <PhotoLightbox
        photos={visionneuse.photos}
        index={visionneuse.index}
        autoplay={visionneuse.autoplay}
        onClose={() => setVisionneuse((v) => ({ ...v, index: -1, autoplay: false }))}
      />
    </>
  );
}