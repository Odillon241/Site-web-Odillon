"use client";

import { useState, useRef } from "react";
import { cn } from "@/lib/utils";
import {
  Search,
  GraduationCap,
  Users2,
  Rocket,
  Lightbulb,
  Sparkles,
  LayoutGrid,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { FadeIn } from "@/components/magicui/fade-in";
import { m, AnimatePresence } from "framer-motion";
import type { FilterState } from "./types";

const activityOptions = [
  { id: "formation", label: "Formations", icon: GraduationCap },
  { id: "seminaire", label: "Séminaires", icon: Users2 },
  { id: "team-building", label: "Team Building", icon: Rocket },
  { id: "atelier", label: "Ateliers", icon: Lightbulb },
  { id: "evenement", label: "Événements", icon: Sparkles },
];

interface PhotoFiltersProps {
  filters: FilterState;
  onFiltersChange: (filters: FilterState) => void;
  albumCounts?: Record<string, number>;
  onFilterClick?: () => void;
}

export function PhotoFilters({
  filters,
  onFiltersChange,
  albumCounts,
  onFilterClick,
}: PhotoFiltersProps) {
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [activeButtonId, setActiveButtonId] = useState<string | null>(null);
  const searchRef = useRef<HTMLInputElement>(null);

  const totalCount = albumCounts
    ? Object.values(albumCounts).reduce((sum, c) => sum + c, 0)
    : undefined;

  function handleCategoryClick(category: string | null) {
    setActiveButtonId(category);
    onFiltersChange({
      ...filters,
      category: filters.category === category ? null : category,
    });
    // Scroll to albums section
    if (onFilterClick) {
      setTimeout(() => onFilterClick(), 100);
    }
    // Reset pulse animation
    setTimeout(() => setActiveButtonId(null), 300);
  }

  return (
    <FadeIn delay={0.2} className="mt-10 md:mt-14">
      <div className="max-w-3xl mx-auto space-y-6">
        {/* Fine separator from hero */}
        <div className="flex items-center gap-4 px-4">
          <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent" />
          <span className="text-[10px] uppercase tracking-[0.2em] text-gray-400 font-medium">
            Filtrer
          </span>
          <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent" />
        </div>

        {/* Search Bar */}
        <div className="relative group">
          <Search
            className={cn(
              "absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 z-10 transition-colors duration-200",
              isSearchFocused ? "text-odillon-teal" : "text-gray-400"
            )}
          />
          <Input
            ref={searchRef}
            placeholder="Rechercher un événement, un lieu, une formation..."
            className={cn(
              "pl-12 pr-4 h-12 text-sm rounded-lg transition-all duration-200",
              "bg-white border-gray-200 shadow-sm",
              isSearchFocused
                ? "border-odillon-teal/50 shadow-md ring-2 ring-odillon-teal/10"
                : "hover:border-gray-300 hover:shadow-md"
            )}
            value={filters.search}
            onChange={(e) =>
              onFiltersChange({ ...filters, search: e.target.value })
            }
            onFocus={() => setIsSearchFocused(true)}
            onBlur={() => setIsSearchFocused(false)}
          />
        </div>

        {/* Category Pills - Staggered animation */}
        <div className="flex flex-wrap items-center justify-center gap-2 md:gap-2.5">
          {/* "Tout" button */}
          <m.button
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.4, ease: [0.21, 0.47, 0.32, 0.98] }}
            onClick={() => handleCategoryClick(null)}
            whileTap={{ scale: 0.95 }}
            className={cn(
              "relative px-4 py-2.5 md:px-5 md:py-2.5 rounded-full text-xs font-medium transition-all duration-300 border flex items-center gap-2 cursor-pointer overflow-hidden",
              filters.category === null
                ? "bg-odillon-dark border-odillon-dark text-white shadow-lg shadow-odillon-dark/20"
                : "bg-white/70 backdrop-blur-sm border-gray-200 text-gray-600 hover:border-gray-300 hover:bg-white hover:shadow-sm"
            )}
          >
            {/* Active glow */}
            {filters.category === null && (
              <m.div
                className="absolute inset-0 bg-gradient-to-r from-odillon-dark via-odillon-dark/90 to-odillon-dark rounded-full"
                layoutId="activeFilter"
                transition={{ type: "spring", bounce: 0.2, duration: 0.5 }}
              />
            )}
            <span className="relative z-10 flex items-center gap-2">
              <LayoutGrid className="w-3.5 h-3.5" />
              Tout
              {totalCount !== undefined && (
                <span
                  className={cn(
                    "text-[10px] px-1.5 py-0.5 rounded-full font-semibold min-w-[20px] text-center",
                    filters.category === null
                      ? "bg-white/20 text-white"
                      : "bg-gray-100 text-gray-500"
                  )}
                >
                  {totalCount}
                </span>
              )}
            </span>
            {/* Pulse on click */}
            <AnimatePresence>
              {activeButtonId === null && filters.category === null && (
                <m.div
                  initial={{ scale: 0.5, opacity: 0.5 }}
                  animate={{ scale: 2, opacity: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.4 }}
                  className="absolute inset-0 rounded-full bg-odillon-dark/30"
                />
              )}
            </AnimatePresence>
          </m.button>

          {/* Category buttons */}
          {activityOptions.map((activity, index) => {
            const Icon = activity.icon;
            const isActive = filters.category === activity.label;
            const count = albumCounts?.[activity.label];

            return (
              <m.button
                key={activity.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  delay: 0.35 + index * 0.06,
                  duration: 0.4,
                  ease: [0.21, 0.47, 0.32, 0.98],
                }}
                onClick={() => handleCategoryClick(activity.label)}
                whileTap={{ scale: 0.95 }}
                className={cn(
                  "relative px-4 py-2.5 md:px-5 md:py-2.5 rounded-full text-xs font-medium transition-all duration-300 border flex items-center gap-2 cursor-pointer overflow-hidden",
                  isActive
                    ? "bg-odillon-teal border-odillon-teal text-white shadow-lg shadow-odillon-teal/25"
                    : "bg-white/70 backdrop-blur-sm border-gray-200 text-gray-600 hover:border-odillon-teal/30 hover:bg-white hover:shadow-sm"
                )}
              >
                {/* Active glow effect */}
                {isActive && (
                  <m.div
                    className="absolute inset-0 bg-gradient-to-r from-odillon-teal via-odillon-teal/95 to-odillon-teal rounded-full"
                    layoutId="activeFilter"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.5 }}
                  />
                )}
                <span className="relative z-10 flex items-center gap-2">
                  <m.span
                    animate={isActive ? { rotate: [0, -10, 10, 0] } : { rotate: 0 }}
                    transition={{ duration: 0.4, delay: 0.1 }}
                    className="inline-flex"
                  >
                    <Icon className="w-3.5 h-3.5" />
                  </m.span>
                  {activity.label}
                  {count !== undefined && (
                    <span
                      className={cn(
                        "text-[10px] px-1.5 py-0.5 rounded-full font-semibold min-w-[20px] text-center transition-colors duration-300",
                        isActive
                          ? "bg-white/20 text-white"
                          : "bg-gray-100 text-gray-500"
                      )}
                    >
                      {count}
                    </span>
                  )}
                </span>
                {/* Pulse on click */}
                <AnimatePresence>
                  {activeButtonId === activity.label && (
                    <m.div
                      initial={{ scale: 0.5, opacity: 0.5 }}
                      animate={{ scale: 2, opacity: 0 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.4 }}
                      className="absolute inset-0 rounded-full bg-odillon-teal/30"
                    />
                  )}
                </AnimatePresence>
              </m.button>
            );
          })}
        </div>
      </div>
    </FadeIn>
  );
}
