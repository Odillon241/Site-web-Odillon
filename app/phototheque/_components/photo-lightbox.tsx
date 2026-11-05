"use client";

import Lightbox from "yet-another-react-lightbox";
import Captions from "yet-another-react-lightbox/plugins/captions";
import Counter from "yet-another-react-lightbox/plugins/counter";
import Fullscreen from "yet-another-react-lightbox/plugins/fullscreen";
import Slideshow from "yet-another-react-lightbox/plugins/slideshow";
import Thumbnails from "yet-another-react-lightbox/plugins/thumbnails";
import Video from "yet-another-react-lightbox/plugins/video";
import Zoom from "yet-another-react-lightbox/plugins/zoom";
import "yet-another-react-lightbox/styles.css";
import "yet-another-react-lightbox/plugins/captions.css";
import "yet-another-react-lightbox/plugins/counter.css";
import "yet-another-react-lightbox/plugins/thumbnails.css";
import { Play } from "lucide-react";
import { estVideo, typeVideo } from "@/lib/media";
import { imageOptimisee, type Photo } from "./types";

const FOND = "rgba(10, 31, 44, 0.97)"; // odillon-dark

interface PhotoLightboxProps {
  photos: Photo[];
  /** -1 : visionneuse fermée. */
  index: number;
  /** Démarre le diaporama automatiquement (bouton « Diaporama »). */
  autoplay?: boolean;
  onClose: () => void;
}

/**
 * Visionneuse plein écran : balayage au doigt, zoom (molette, double-clic,
 * pincement), plein écran, diaporama et bande de miniatures. Les vidéos d'un
 * album s'y lisent avec les commandes du navigateur.
 */
export function PhotoLightbox({ photos, index, autoplay = false, onClose }: PhotoLightboxProps) {
  // Pas de titre de légende : toutes les photos d'un album portent le même,
  // et il passerait sous la barre d'outils. Lieu et détails restent en bas.
  const slides = photos.map((photo) => {
    const description = [photo.location, photo.details].filter(Boolean).join(" · ") || undefined;
    if (estVideo(photo.url)) {
      return {
        type: "video" as const,
        // #t=0.1 : la première image s'affiche avant la lecture, sans affiche dédiée.
        sources: [{ src: `${photo.url}#t=0.1`, type: typeVideo(photo.url) }],
        controls: true,
        playsInline: true,
        preload: "metadata",
        description,
      };
    }
    return {
      // Redimensionnée : les originaux des téléphones dépassent souvent 700 Ko.
      src: imageOptimisee(photo.url, 1920),
      thumbnail: imageOptimisee(photo.url, 256),
      alt: photo.description,
      description,
    };
  });

  return (
    <Lightbox
      open={index >= 0}
      index={Math.max(index, 0)}
      close={onClose}
      slides={slides}
      plugins={[Captions, Counter, Fullscreen, Slideshow, Thumbnails, Video, Zoom]}
      carousel={{ finite: slides.length <= 1 }}
      slideshow={{ autoplay, delay: 3500 }}
      zoom={{ maxZoomPixelRatio: 3, scrollToZoom: true }}
      thumbnails={{ width: 96, height: 64, border: 0, borderRadius: 6, padding: 0, gap: 8, imageFit: "cover" }}
      captions={{ descriptionTextAlign: "center", descriptionMaxLines: 2 }}
      render={{
        // Miniatures légères plutôt que vingt photos en pleine taille.
        thumbnail: ({ slide }) =>
          slide.type === "video" ? (
            <span style={{ position: "relative", display: "block", width: "100%", height: "100%" }}>
              <video
                src={slide.sources?.[0]?.src}
                muted
                playsInline
                preload="metadata"
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
              <span style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Play size={18} fill="white" color="white" aria-hidden="true" />
              </span>
            </span>
          ) : (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={(slide as { thumbnail?: string }).thumbnail ?? (slide as { src: string }).src}
              alt=""
              loading="lazy"
              draggable={false}
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          ),
      }}
      styles={{
        container: { backgroundColor: FOND },
        thumbnailsContainer: { backgroundColor: FOND },
      }}
      labels={{
        Lightbox: "Visionneuse de l'album",
        Carousel: "Photos et vidéos de l'album",
        Slide: "Élément",
        Previous: "Précédent",
        Next: "Suivant",
        Close: "Fermer",
        Play: "Lancer le diaporama",
        Pause: "Mettre le diaporama en pause",
        "Zoom in": "Zoomer",
        "Zoom out": "Dézoomer",
        "Enter Fullscreen": "Plein écran",
        "Exit Fullscreen": "Quitter le plein écran",
        "Show thumbnails": "Afficher les miniatures",
        "Hide thumbnails": "Masquer les miniatures",
        "Show captions": "Afficher les légendes",
        "Hide captions": "Masquer les légendes",
      }}
    />
  );
}
