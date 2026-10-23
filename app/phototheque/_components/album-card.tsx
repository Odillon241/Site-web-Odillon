"use client";

import Image from "next/image";
import { m, useReducedMotion } from "framer-motion";
import { ArrowRight, Calendar, Camera, MapPin, Play } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Album } from "./types";

const focusRing =
  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-odillon-teal";

function nombrePhotos(n: number) {
  return `${n} photo${n > 1 ? "s" : ""}`;
}

/** Date et lieu sur une ligne, comme une légende de reportage. */
function Meta({ album, className }: { album: Album; className?: string }) {
  if (!album.date && !album.location) return null;
  return (
    // <span> et non <p> : la ligne est aussi placée dans un bouton.
    <span className={cn("flex flex-wrap items-center gap-x-3 gap-y-1", className)}>
      {album.date && (
        <span className="inline-flex items-center gap-1.5">
          <Calendar className="size-3.5 shrink-0" aria-hidden="true" />
          {album.date}
        </span>
      )}
      {album.location && (
        <span className="inline-flex min-w-0 items-center gap-1.5">
          <MapPin className="size-3.5 shrink-0" aria-hidden="true" />
          <span className="truncate">{album.location}</span>
        </span>
      )}
    </span>
  );
}

/** Apparition au défilement, désactivée si l'utilisateur limite les animations. */
function useApparition(index: number) {
  const reduire = useReducedMotion();
  return reduire
    ? {}
    : {
        initial: { opacity: 0, y: 18 },
        whileInView: { opacity: 1, y: 0 },
        viewport: { once: true, margin: "-40px" },
        transition: { duration: 0.5, delay: Math.min(index, 5) * 0.06, ease: [0.22, 1, 0.36, 1] as const },
      };
}

interface AlbumCardProps {
  album: Album;
  index: number;
  onOpen: () => void;
}

export function AlbumCard({ album, index, onOpen }: AlbumCardProps) {
  const apparition = useApparition(index);

  return (
    <m.li {...apparition}>
      <button
        type="button"
        onClick={onOpen}
        aria-label={`Ouvrir l'album ${album.title}, ${nombrePhotos(album.photos.length)}`}
        className={cn(
          "group relative block aspect-[4/3] w-full overflow-hidden rounded-xl bg-gray-100 text-left shadow-sm ring-1 ring-black/5 transition-shadow duration-300 hover:shadow-xl",
          focusRing
        )}
      >
        <Image
          src={album.coverPhoto.url}
          alt=""
          fill
          sizes="(min-width: 1024px) 400px, (min-width: 640px) 50vw, 100vw"
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.06]"
        />
        <span aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent" />

        <span className="absolute left-3 top-3 inline-flex items-center gap-1.5 rounded-full bg-black/45 px-2.5 py-1 text-xs font-medium text-white backdrop-blur-md">
          <Camera className="size-3.5" aria-hidden="true" />
          {album.photos.length}
        </span>
        {album.activityType && (
          <span className="absolute right-3 top-3 rounded-full bg-white/90 px-2.5 py-1 text-xs font-semibold text-odillon-teal backdrop-blur-md">
            {album.activityType}
          </span>
        )}

        <span className="absolute inset-x-0 bottom-0 block p-5">
          <Meta album={album} className="text-xs text-white/75" />
          <span className="mt-1.5 block font-baskvill text-xl italic leading-snug text-white line-clamp-2 md:text-2xl">
            {album.title}
          </span>
          <span className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-odillon-lime transition-all duration-300 sm:translate-y-1 sm:opacity-0 sm:group-hover:translate-y-0 sm:group-hover:opacity-100 sm:group-focus-visible:translate-y-0 sm:group-focus-visible:opacity-100">
            Voir l&apos;album
            <ArrowRight className="size-4" aria-hidden="true" />
          </span>
        </span>
      </button>
    </m.li>
  );
}

interface AlbumUneProps {
  album: Album;
  onOpen: () => void;
  onPhotoClick: (index: number) => void;
  onDiaporama: () => void;
}

/** Album le plus récent, présenté en grand en tête de page. */
export function AlbumUne({ album, onOpen, onPhotoClick, onDiaporama }: AlbumUneProps) {
  const apparition = useApparition(0);
  const description = album.coverPhoto.event_description || album.coverPhoto.details;
  // La couverture est déjà en grand : les miniatures montrent la suite de l'album.
  const apercus = album.photos.slice(1, 5);
  const restantes = album.photos.length - 1 - apercus.length;

  return (
    <m.article
      {...apparition}
      className="grid overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-black/5 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]"
    >
      <button
        type="button"
        onClick={() => onPhotoClick(0)}
        aria-label={`Agrandir la photo de couverture de l'album ${album.title}`}
        className={cn("group relative aspect-[16/10] overflow-hidden bg-gray-100 lg:aspect-auto lg:min-h-[440px]", focusRing)}
      >
        <Image
          src={album.coverPhoto.url}
          alt={album.title}
          fill
          priority
          sizes="(min-width: 1024px) 760px, 100vw"
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
        />
      </button>

      <div className="flex flex-col p-6 md:p-8 lg:p-10">
        <p className="od-eyebrow">Dernier album</p>
        <h2 className="mt-3 font-baskvill text-3xl italic leading-tight text-odillon-dark md:text-4xl">{album.title}</h2>
        <Meta album={album} className="mt-3 text-sm text-gray-500" />
        {description && <p className="mt-4 leading-relaxed text-gray-600 line-clamp-4">{description}</p>}

        {apercus.length > 0 && (
          <ul className="mt-6 grid grid-cols-4 gap-2">
            {apercus.map((photo, i) => {
              const dernier = i === apercus.length - 1 && restantes > 0;
              return (
                <li key={photo.id}>
                  <button
                    type="button"
                    onClick={() => (dernier ? onOpen() : onPhotoClick(i + 1))}
                    aria-label={dernier ? `Voir les ${restantes + 1} autres photos de l'album` : `Agrandir la photo ${i + 2}`}
                    className={cn("group relative block aspect-square w-full overflow-hidden rounded-lg bg-gray-100", focusRing)}
                  >
                    <Image
                      src={photo.url}
                      alt=""
                      fill
                      sizes="120px"
                      className="object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    {dernier && (
                      <span className="absolute inset-0 flex items-center justify-center bg-odillon-dark/60 text-sm font-semibold text-white">
                        +{restantes + 1}
                      </span>
                    )}
                  </button>
                </li>
              );
            })}
          </ul>
        )}

        <div className="mt-auto flex flex-wrap gap-3 pt-8">
          <button
            type="button"
            onClick={onOpen}
            className={cn(
              "group inline-flex items-center gap-2 rounded-md bg-odillon-teal px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-odillon-teal/90",
              focusRing
            )}
          >
            Voir l&apos;album · {nombrePhotos(album.photos.length)}
            <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
          </button>
          <button
            type="button"
            onClick={onDiaporama}
            className={cn(
              "inline-flex items-center gap-2 rounded-md border border-odillon-dark/15 px-5 py-3 text-sm font-semibold text-odillon-dark transition-colors hover:border-odillon-teal/40 hover:text-odillon-teal",
              focusRing
            )}
          >
            <Play className="size-4" aria-hidden="true" />
            Diaporama
          </button>
        </div>
      </div>
    </m.article>
  );
}
