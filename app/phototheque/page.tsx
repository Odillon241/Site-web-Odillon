"use client";

import { useState, useEffect, useCallback } from "react";
import { Search, Images } from "lucide-react";

import { HeaderPro } from "@/components/layout/header-pro";
import { Footer } from "@/components/layout/footer";
import { FadeIn } from "@/components/magicui/fade-in";
import { VideoSection } from "@/components/sections/video-section";
import { Video } from "@/types/admin";

import { AlbumCard } from "./_components/album-card";
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

  const [selectedPhoto, setSelectedPhoto] =
    useState<Photo | null>(null);

  const [lightboxIndex, setLightboxIndex] =
    useState(0);

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

  const lightboxPhotos =
    selectedAlbum?.photos || [];

  const openLightbox = useCallback(
    (photo: Photo) => {
      const idx =
        lightboxPhotos.findIndex(
          (p) => p.id === photo.id
        );

      setLightboxIndex(
        idx >= 0 ? idx : 0
      );

      setSelectedPhoto(photo);
    },
    [lightboxPhotos]
  );

  const navigateLightbox =
    useCallback(
      (
        direction: "prev" | "next"
      ) => {
        if (
          lightboxPhotos.length === 0
        ) {
          return;
        }

        const newIndex =
          direction === "next"
            ? (
                lightboxIndex + 1
              ) %
              lightboxPhotos.length
            : (
                lightboxIndex -
                1 +
                lightboxPhotos.length
              ) %
              lightboxPhotos.length;

        setLightboxIndex(newIndex);
        setSelectedPhoto(
          lightboxPhotos[newIndex]
        );
      },
      [
        lightboxPhotos,
        lightboxIndex,
      ]
    );

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

  /**
   * GROUPES :
   *
   * 2026
   *   Septembre
   *   Avril
   *
   * 2025
   *   Décembre
   *   Juin
   *
   * 2023
   *   Avril
   *
   * Autres
   */
  const groupedAlbumsByYear =
    sortedAlbums.reduce(
      (
        acc,
        album
      ) => {
        const year =
          album.coverPhoto.year ??
          null;

        const month =
          album.coverPhoto.month ??
          null;

        let yearGroup =
          acc.find(
            (group) =>
              group.year === year
          );

        if (!yearGroup) {
          yearGroup = {
            year,
            months: [],
          };

          acc.push(yearGroup);
        }

        let monthGroup =
          yearGroup.months.find(
            (group) =>
              group.month === month
          );

        if (!monthGroup) {
          monthGroup = {
            month,
            albums: [],
          };

          yearGroup.months.push(
            monthGroup
          );
        }

        monthGroup.albums.push(
          album
        );

        return acc;
      },
      [] as {
        year: number | null;
        months: {
          month: number | null;
          albums: Album[];
        }[];
      }[]
    );

  /**
   * Tri explicite des années
   * et des mois.
   */
  groupedAlbumsByYear.sort(
    (a, b) => {
      if (a.year === null) {
        return 1;
      }

      if (b.year === null) {
        return -1;
      }

      return b.year - a.year;
    }
  );

  groupedAlbumsByYear.forEach(
    (yearGroup) => {
      yearGroup.months.sort(
        (a, b) => {
          if (a.month === null) {
            return 1;
          }

          if (b.month === null) {
            return -1;
          }

          return b.month - a.month;
        }
      );

      yearGroup.months.forEach(
        (monthGroup) => {
          monthGroup.albums.sort(
            compareAlbumsByDateDesc
          );
        }
      );
    }
  );

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

      <main className="od-page pt-[88px] md:pt-[104px]">
        <section className="od-section scroll-mt-24 border-t-0 py-12 md:py-16">
          <div className="od-container">

            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6 mb-10 md:mb-12">

              <div className="max-w-2xl">
                <div className="od-eyebrow mb-3">
                  <Images className="w-4 h-4" />
                  Photothèque
                </div>

                <h1 className="od-heading-display text-4xl md:text-5xl">
                  Albums
                </h1>

                <p className="mt-3 text-sm md:text-base text-gray-600">
                  Les albums sont classés par année et par mois,
                  du plus récent au plus ancien.
                </p>
              </div>

              <PhotoFilters
                filters={filters}
                onFiltersChange={setFilters}
                albumCounts={albumCounts}
              />
            </div>

            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-6 gap-y-10">
                {[
                  1, 2, 3, 4,
                  5, 6, 7, 8
                ].map((i) => (
                  <div
                    key={i}
                    className="space-y-3"
                  >
                    <div className="aspect-[7/8] bg-gray-100 rounded-xl animate-pulse" />
                  </div>
                ))}
              </div>
            ) : groupedAlbumsByYear.length > 0 ? (
              <div className="space-y-14 md:space-y-16">

                {groupedAlbumsByYear.map(
                  (yearGroup) => (
                    <div
                      key={
                        yearGroup.year ??
                        "autres"
                      }
                      className="space-y-8 md:space-y-10"
                    >

                      <h2 className="od-heading-display text-3xl md:text-4xl border-b border-odillon-teal/10 pb-3">
                        {yearGroup.year ??
                          "Autres"}
                      </h2>

                      <div className="space-y-12">

                        {yearGroup.months.map(
                          (monthGroup) => (
                            <div
                              key={`${yearGroup.year ?? "autres"}-${monthGroup.month ?? "none"}`}
                            >

                              {monthGroup.month && (
                                <h3 className="text-sm font-semibold uppercase text-gray-500 mb-6 tracking-[0.14em]">
                                  {new Date(
                                    2000,
                                    monthGroup.month -
                                      1,
                                    1
                                  ).toLocaleDateString(
                                    "fr-FR",
                                    {
                                      month:
                                        "long",
                                    }
                                  )}
                                </h3>
                              )}

                              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-6 gap-y-10">

                                {monthGroup.albums.map(
                                  (
                                    album,
                                    idx
                                  ) => (
                                    <AlbumCard
                                      key={
                                        album.id
                                      }
                                      album={
                                        album
                                      }
                                      index={
                                        idx
                                      }
                                      onClick={() =>
                                        setSelectedAlbum(
                                          album
                                        )
                                      }
                                    />
                                  )
                                )}

                              </div>
                            </div>
                          )
                        )}

                      </div>
                    </div>
                  )
                )}

              </div>
            ) : (
              <FadeIn>
                <div className="od-surface-muted text-center py-20 md:py-24">

                  <div className="w-16 h-16 bg-white rounded-xl flex items-center justify-center mx-auto mb-5 border border-[#00a795]/10">
                    <Search className="w-7 h-7 text-gray-300" />
                  </div>

                  <h3 className="od-heading-display text-2xl mb-2">
                    Aucun album
                  </h3>

                  <p className="text-gray-500 text-sm max-w-sm mx-auto">
                    Aucun album ne correspond aux
                    critères sélectionnés.
                  </p>

                </div>
              </FadeIn>
            )}

          </div>
        </section>

        <VideoSection video={video} />
      </main>

      <Footer />

      <AlbumModal
        album={selectedAlbum}
        onClose={() =>
          setSelectedAlbum(null)
        }
        onPhotoClick={
          openLightbox
        }
      />

      <PhotoLightbox
        photo={selectedPhoto}
        photos={lightboxPhotos}
        currentIndex={
          lightboxIndex
        }
        onClose={() =>
          setSelectedPhoto(null)
        }
        onNavigate={
          navigateLightbox
        }
      />
    </>
  );
}