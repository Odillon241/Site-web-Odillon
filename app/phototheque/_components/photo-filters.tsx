"use client";

import { useState, useRef } from "react";
import { cn } from "@/lib/utils";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { FilterState } from "./types";

const activityOptions = [
  { id: "formation", label: "Formations" },
  { id: "seminaire", label: "Séminaires" },
  { id: "team-building", label: "Team Building" },
  { id: "atelier", label: "Ateliers" },
  { id: "evenement", label: "Événements" },
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
  const searchRef = useRef<HTMLInputElement>(null);

  function handleCategoryChange(value: string) {
    const category = value === "all" ? null : value;
    onFiltersChange({ ...filters, category });
    if (onFilterClick) {
      setTimeout(() => onFilterClick(), 100);
    }
  }

  return (
    <div className="flex flex-col sm:flex-row items-center gap-3 w-full lg:w-auto">
      {/* Search Bar */}
      <div className="relative group w-full sm:w-64 lg:w-72">
        <Search
          className={cn(
            "absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 z-10 transition-colors duration-200",
            isSearchFocused ? "text-odillon-teal" : "text-gray-400"
          )}
        />
        <Input
          ref={searchRef}
          placeholder="Rechercher..."
          className={cn(
            "pl-9 pr-4 h-10 text-sm rounded-lg transition-all duration-200",
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

      {/* Category Select */}
      <Select
        value={filters.category || "all"}
        onValueChange={handleCategoryChange}
      >
        <SelectTrigger className="w-full sm:w-48 h-10 bg-white border-gray-200 hover:border-gray-300 transition-colors shadow-sm rounded-lg">
          <SelectValue placeholder="Catégorie" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Toutes les catégories</SelectItem>
          {activityOptions.map((opt) => (
            <SelectItem key={opt.id} value={opt.label}>
              {opt.label} {albumCounts?.[opt.label] ? `(${albumCounts[opt.label]})` : ""}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
