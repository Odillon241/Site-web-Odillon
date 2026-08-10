import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Ponctuation double à la française : espace insécable avant le deux-points et
 * le guillemet fermant, fine insécable avant point-virgule, exclamation et
 * interrogation. Empêche le signe d'être rejeté en début de ligne, ce qui
 * arrive dès qu'un titre passe sur deux lignes.
 */
export function typoFr(texte: string) {
  return texte
    .replace(/ ([:»])/g, " $1")
    .replace(/ ([;!?])/g, " $1")
}
