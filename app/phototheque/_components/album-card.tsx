"use client";

import React, { useState } from "react";
import { m, useMotionValue, useSpring, useTransform } from "framer-motion";
import { cn } from "@/lib/utils";
import {
  Calendar,
  MapPin,
  GraduationCap,
  Users2,
  Lightbulb,
  Camera,
} from "lucide-react";
import { BlurFade } from "@/components/magicui/blur-fade";
import { Badge } from "@/components/ui/badge";
import { StackedCardsInteraction } from "@/components/ui/stacked-cards-interaction";
import type { Album } from "./types";

// Activity Badge Component - Design raffiné
const ActivityBadge: React.FC<{ type: string | null }> = ({ type }) => {
  if (!type) return null;

  const featured = ["Formations", "Séminaires", "Ateliers"];
  if (!featured.includes(type)) return null;

  const styles: Record<
    string,
    { gradient: string; icon: React.ElementType; glow: string }
  > = {
    Formations: {
      gradient:
        "bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-blue-500/30",
      icon: GraduationCap,
      glow: "shadow-lg shadow-blue-500/20",
    },
    Séminaires: {
      gradient:
        "bg-gradient-to-r from-purple-500 to-purple-600 text-white shadow-purple-500/30",
      icon: Users2,
      glow: "shadow-lg shadow-purple-500/20",
    },
    Ateliers: {
      gradient:
        "bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-orange-500/30",
      icon: Lightbulb,
      glow: "shadow-lg shadow-orange-500/20",
    },
  };

  const style = styles[type];
  if (!style) return null;
  const Icon = style.icon;

  return (
    <m.div
      initial={{ opacity: 0, scale: 0.8, y: -8 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ delay: 0.3, type: "spring", stiffness: 200, damping: 15 }}
      className="absolute top-3 right-3 z-20"
    >
      <Badge
        className={cn(
          "px-3 py-1.5 text-xs font-semibold backdrop-blur-md border-0 rounded-full",
          style.gradient,
          style.glow
        )}
      >
        <Icon className="w-3.5 h-3.5 mr-1.5" />
        {type}
      </Badge>
    </m.div>
  );
};

// Photo count badge
const PhotoCountBadge: React.FC<{ count: number }> = ({ count }) => (
  <div className="absolute top-3 left-3 z-20">
    <div className="flex items-center gap-1.5 bg-black/50 backdrop-blur-md text-white rounded-full px-2.5 py-1 text-xs font-medium">
      <Camera className="w-3.5 h-3.5" />
      <span>{count}</span>
    </div>
  </div>
);

interface AlbumCardProps {
  album: Album;
  onClick: () => void;
  index: number;
}

export function AlbumCard({ album, onClick, index }: AlbumCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  // 3D tilt effect
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [6, -6]), {
    stiffness: 200,
    damping: 20,
  });
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-6, 6]), {
    stiffness: 200,
    damping: 20,
  });

  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    mouseX.set(x);
    mouseY.set(y);
  }

  function handleMouseLeave() {
    mouseX.set(0);
    mouseY.set(0);
    setIsHovered(false);
  }

  const description = [
    album.coverPhoto.details || "Pas de description",
    `${album.photos.length} photos`,
  ]
    .filter(Boolean)
    .join(" \u2022 ");

  const cardsData = album.photos.slice(0, 3).map((photo, i) => ({
    image: photo.url,
    title: i === 0 ? album.title : undefined,
    description: i === 0 ? description : undefined,
  }));

  if (cardsData.length === 0) {
    cardsData.push({
      image: album.coverPhoto.url,
      title: album.title,
      description: description,
    });
  }

  const featuredTypes = ["Formations", "Séminaires", "Ateliers"];
  const isFeatured = featuredTypes.includes(album.activityType || "");

  return (
    <BlurFade delay={0.06 * Math.min(index, 10)}>
      <m.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{
          delay: 0.04 * Math.min(index, 10),
          duration: 0.4,
          ease: "easeOut",
        }}
        style={{
          perspective: 800,
        }}
      >
        <m.div
          onMouseMove={handleMouseMove}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={handleMouseLeave}
          onClick={onClick}
          style={{
            rotateX,
            rotateY,
            transformStyle: "preserve-3d",
          }}
          className={cn(
            "relative w-full aspect-[7/8] max-w-[350px] mx-auto group cursor-pointer",
            "rounded-lg transition-shadow duration-500 ease-out",
            // Ombres dynamiques
            isHovered
              ? "shadow-2xl shadow-black/20 dark:shadow-black/40"
              : "shadow-md shadow-black/5",
            // Ring pour featured
            isFeatured &&
              cn(
                "ring-2 ring-odillon-teal/20 max-w-[400px]",
                isHovered && "ring-odillon-teal/50"
              )
          )}
        >
          {/* Activity badge */}
          <ActivityBadge type={album.activityType ?? null} />

          {/* Photo count badge */}
          <PhotoCountBadge count={album.photos.length} />

          {/* Stacked cards */}
          <StackedCardsInteraction
            cards={cardsData}
            spreadDistance={20}
            rotationAngle={5}
          />

          {/* Gradient overlay on hover */}
          <m.div
            className="absolute inset-0 z-10 rounded-lg pointer-events-none"
            initial={false}
            animate={{
              opacity: isHovered ? 1 : 0,
            }}
            transition={{ duration: 0.35, ease: "easeOut" }}
            style={{
              background:
                "linear-gradient(to top, rgba(0,0,0,0.45) 0%, rgba(0,0,0,0.1) 40%, transparent 70%)",
            }}
          />

          {/* Date and Location Badges - redesign intégré */}
          <div className="absolute bottom-3 left-3 right-3 z-20 flex flex-wrap gap-1.5 pointer-events-none">
            {album.date && (
              <m.div
                initial={false}
                animate={{
                  y: isHovered ? 0 : 4,
                  opacity: isHovered ? 1 : 0.85,
                }}
                transition={{ duration: 0.3, ease: "easeOut" }}
              >
                <Badge className="bg-white/95 text-gray-700 border border-white/60 shadow-md backdrop-blur-xl text-[11px] rounded-full px-2.5 py-0.5">
                  <Calendar className="w-3 h-3 mr-1 text-odillon-teal" />
                  {album.date}
                </Badge>
              </m.div>
            )}
            {album.location && (
              <m.div
                initial={false}
                animate={{
                  y: isHovered ? 0 : 4,
                  opacity: isHovered ? 1 : 0.85,
                }}
                transition={{ duration: 0.3, ease: "easeOut", delay: 0.05 }}
              >
                <Badge className="bg-white/95 text-gray-700 border border-white/60 shadow-md backdrop-blur-xl text-[11px] rounded-full px-2.5 py-0.5">
                  <MapPin className="w-3 h-3 mr-1 text-odillon-teal" />
                  {album.location}
                </Badge>
              </m.div>
            )}
          </div>

          {/* Shine effect on hover */}
          <m.div
            className="absolute inset-0 z-10 rounded-lg pointer-events-none overflow-hidden"
            initial={false}
            animate={{
              opacity: isHovered ? 1 : 0,
            }}
            transition={{ duration: 0.4 }}
          >
            <m.div
              className="absolute inset-0"
              style={{
                background:
                  "linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.12) 45%, rgba(255,255,255,0.18) 50%, rgba(255,255,255,0.12) 55%, transparent 60%)",
              }}
              animate={{
                x: isHovered ? ["-100%", "200%"] : "-100%",
              }}
              transition={{
                duration: 0.8,
                ease: "easeInOut",
              }}
            />
          </m.div>
        </m.div>
      </m.div>
    </BlurFade>
  );
}
