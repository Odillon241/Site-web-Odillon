"use client";

import Lightbox from "yet-another-react-lightbox";
import Captions from "yet-another-react-lightbox/plugins/captions";
import Counter from "yet-another-react-lightbox/plugins/counter";
import Fullscreen from "yet-another-react-lightbox/plugins/fullscreen";
import Slideshow from "yet-another-react-lightbox/plugins/slideshow";
import Thumbnails from "yet-another-react-lightbox/plugins/thumbnails";
import Zoom from "yet-another-react-lightbox/plugins/zoom";
import "yet-another-react-lightbox/styles.css";
import "yet-another-react-lightbox/plugins/captions.css";
import "yet-another-react-lightbox/plugins/counter.css";
import "yet-another-react-lightbox/plugins/thumbnails.css";
import type { Photo } from "./types";

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
 * pincement), plein écran, diaporama et bande de miniatures.
 */
export function PhotoLightbox({ photos, index, autoplay = false, onClose }: PhotoLightboxProps) {
  // Pas de titre de légende : toutes les photos d'un album portent le même,
  // et il passerait sous la barre d'outils. Lieu et détails restent en bas.
  const slides = photos.map((photo) => ({
    src: photo.url,
    alt: photo.description,
    description: [photo.location, photo.details].filter(Boolean).join(" · ") || undefined,
  }));

  return (
    <Lightbox
      open={index >= 0}
      index={Math.max(index, 0)}
      close={onClose}
      slides={slides}
      plugins={[Captions, Counter, Fullscreen, Slideshow, Thumbnails, Zoom]}
      carousel={{ finite: slides.length <= 1 }}
      slideshow={{ autoplay, delay: 3500 }}
      zoom={{ maxZoomPixelRatio: 3, scrollToZoom: true }}
      thumbnails={{ width: 96, height: 64, border: 0, borderRadius: 6, padding: 0, gap: 8, imageFit: "cover" }}
      captions={{ descriptionTextAlign: "center", descriptionMaxLines: 2 }}
      styles={{
        container: { backgroundColor: FOND },
        thumbnailsContainer: { backgroundColor: FOND },
      }}
      labels={{
        Lightbox: "Visionneuse de photos",
        Carousel: "Photos de l'album",
        Slide: "Photo",
        Previous: "Photo précédente",
        Next: "Photo suivante",
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
