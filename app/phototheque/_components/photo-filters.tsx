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
  {
    id: "formation",
    label: "Formations",
  },
  {
    id: "seminaire",
    label: "Séminaires",
  },
  {
    id: "team-building",
    label: "Team Building",
  },
  {
    id: "atelier",
    label: "Ateliers",
  },
  {
    id: "evenement",
    label: "Événements",
  },
];

const months = [
  {
    id: 1,
    label: "Janvier",
  },
  {
    id: 2,
    label: "Février",
  },
  {
    id: 3,
    label: "Mars",
  },
  {
    id: 4,
    label: "Avril",
  },
  {
    id: 5,
    label: "Mai",
  },
  {
    id: 6,
    label: "Juin",
  },
  {
    id: 7,
    label: "Juillet",
  },
  {
    id: 8,
    label: "Août",
  },
  {
    id: 9,
    label: "Septembre",
  },
  {
    id: 10,
    label: "Octobre",
  },
  {
    id: 11,
    label: "Novembre",
  },
  {
    id: 12,
    label: "Décembre",
  },
];

interface PhotoFiltersProps {
  filters: FilterState;
  onFiltersChange: (
    filters: FilterState
  ) => void;
  albumCounts?: Record<string, number>;
  onFilterClick?: () => void;
}

export function PhotoFilters({
  filters,
  onFiltersChange,
  albumCounts,
  onFilterClick,
}: PhotoFiltersProps) {
  const [
    isSearchFocused,
    setIsSearchFocused,
  ] = useState(false);

  const searchRef =
    useRef<HTMLInputElement>(null);

  /**
   * Année
   */
  function handleYearChange(
    value: string
  ) {
    const year =
      value === "all"
        ? null
        : parseInt(value);

    onFiltersChange({
      ...filters,
      year,
    });

    if (onFilterClick) {
      setTimeout(
        () => onFilterClick(),
        100
      );
    }
  }

  /**
   * Mois
   */
  function handleMonthChange(
    value: string
  ) {
    const month =
      value === "all"
        ? null
        : parseInt(value);

    onFiltersChange({
      ...filters,
      month,
    });

    if (onFilterClick) {
      setTimeout(
        () => onFilterClick(),
        100
      );
    }
  }

  /**
   * Catégorie
   */
  function handleCategoryChange(
    value: string
  ) {
    const category =
      value === "all"
        ? null
        : value;

    onFiltersChange({
      ...filters,
      category,
    });

    if (onFilterClick) {
      setTimeout(
        () => onFilterClick(),
        100
      );
    }
  }

  /**
   * Génère les années disponibles.
   *
   * On affiche les 10 dernières années
   * jusqu'à l'année actuelle.
   */
  const currentYear =
    new Date().getFullYear();

  const years = Array.from(
    { length: 10 },
    (_, index) =>
      currentYear - index
  );

  return (
    <div className="flex flex-col sm:flex-row sm:flex-wrap items-center gap-3 w-full lg:w-auto">

      {/* Recherche */}
      <div className="relative group w-full sm:w-64 lg:w-72">

        <Search
          className={cn(
            "absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 z-10 transition-colors duration-200",
            isSearchFocused
              ? "text-odillon-teal"
              : "text-gray-400"
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
            onFiltersChange({
              ...filters,
              search:
                e.target.value,
            })
          }
          onFocus={() =>
            setIsSearchFocused(true)
          }
          onBlur={() =>
            setIsSearchFocused(false)
          }
        />

      </div>

      {/* Année */}
      <Select
        value={
          filters.year?.toString() ||
          "all"
        }
        onValueChange={
          handleYearChange
        }
      >
        <SelectTrigger className="w-full sm:w-32 h-10 bg-white border-gray-200 hover:border-gray-300 transition-colors shadow-sm rounded-lg">
          <SelectValue placeholder="Année" />
        </SelectTrigger>

        <SelectContent>
          <SelectItem value="all">
            Toutes les années
          </SelectItem>

          {years.map((year) => (
            <SelectItem
              key={year}
              value={year.toString()}
            >
              {year}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Mois */}
      <Select
        value={
          filters.month?.toString() ||
          "all"
        }
        onValueChange={
          handleMonthChange
        }
      >
        <SelectTrigger className="w-full sm:w-36 h-10 bg-white border-gray-200 hover:border-gray-300 transition-colors shadow-sm rounded-lg">
          <SelectValue placeholder="Mois" />
        </SelectTrigger>

        <SelectContent>
          <SelectItem value="all">
            Tous les mois
          </SelectItem>

          {months.map((month) => (
            <SelectItem
              key={month.id}
              value={month.id.toString()}
            >
              {month.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Catégorie */}
      <Select
        value={
          filters.category ||
          "all"
        }
        onValueChange={
          handleCategoryChange
        }
      >
        <SelectTrigger className="w-full sm:w-48 h-10 bg-white border-gray-200 hover:border-gray-300 transition-colors shadow-sm rounded-lg">
          <SelectValue placeholder="Catégorie" />
        </SelectTrigger>

        <SelectContent>
          <SelectItem value="all">
            Toutes les catégories
          </SelectItem>

          {activityOptions.map(
            (opt) => (
              <SelectItem
                key={opt.id}
                value={opt.label}
              >
                {opt.label}

                {albumCounts?.[
                  opt.label
                ]
                  ? ` (${albumCounts[opt.label]})`
                  : ""}
              </SelectItem>
            )
          )}
        </SelectContent>
      </Select>

    </div>
  );
}