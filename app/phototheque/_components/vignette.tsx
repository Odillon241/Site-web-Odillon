"use client";

import Image from "next/image";
import { Play } from "lucide-react";
import { cn } from "@/lib/utils";
import { estVideo } from "@/lib/media";

interface VignetteProps {
  url: string;
  alt: string;
  sizes: string;
  priority?: boolean;
  className?: string;
  /** Taille du pictogramme de lecture posé sur les vidéos. */
  lecture?: "petite" | "grande";
}

/**
 * Aperçu d'un média d'album, en plein cadre (parent en position relative).
 * Une vidéo montre sa première image, sans son ni lecture, avec un
 * pictogramme ; la lecture se fait dans la visionneuse.
 */
export function Vignette({ url, alt, sizes, priority, className, lecture = "grande" }: VignetteProps) {
  if (!estVideo(url)) {
    return <Image src={url} alt={alt} fill priority={priority} sizes={sizes} className={cn("object-cover", className)} />;
  }

  return (
    <>
      <video
        src={`${url}#t=0.1`}
        muted
        playsInline
        preload="metadata"
        aria-label={alt || undefined}
        className={cn("absolute inset-0 h-full w-full object-cover", className)}
      />
      <span aria-hidden="true" className="pointer-events-none absolute inset-0 flex items-center justify-center">
        <span
          className={cn(
            "flex items-center justify-center rounded-full bg-black/50 text-white backdrop-blur-sm",
            lecture === "grande" ? "size-14" : "size-8"
          )}
        >
          <Play className={cn("ml-0.5 fill-current", lecture === "grande" ? "size-6" : "size-4")} />
        </span>
      </span>
    </>
  );
}
