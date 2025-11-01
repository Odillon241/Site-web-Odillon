// Système de gestion des photos par thématique et mois

export interface Photo {
  id: string
  src: string
  alt: string
  theme?: string
  month?: number // 1-12
  year?: number
  active: boolean
  order: number
}

export interface PhotoTheme {
  id: string
  name: string
  description: string
  color: string
  month?: number
  startDate?: string
  endDate?: string
}

// Thématiques mensuelles connues
export const MONTHLY_THEMES: PhotoTheme[] = [
  {
    id: "octobre-rose",
    name: "Octobre Rose",
    description: "Sensibilisation au cancer du sein",
    color: "#FF69B4",
    month: 10
  },
  {
    id: "novembre-bleu",
    name: "Novembre Bleu",
    description: "Sensibilisation au cancer de la prostate et santé masculine",
    color: "#4169E1",
    month: 11
  },
  {
    id: "decembre-solidarite",
    name: "Décembre Solidaire",
    description: "Solidarité et partage",
    color: "#C4D82E",
    month: 12
  }
]

// Photos par défaut avec professionnels noirs/africains
export const DEFAULT_PHOTOS: Photo[] = [
  {
    id: "1",
    src: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=1920&q=85",
    alt: "Équipe professionnelle africaine en réunion",
    active: true,
    order: 1
  },
  {
    id: "2",
    src: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=1920&q=85",
    alt: "Professionnels africains collaborant",
    active: true,
    order: 2
  },
  {
    id: "3",
    src: "https://images.unsplash.com/photo-1600880292089-90a7e086ee0c?w=1920&q=85",
    alt: "Homme d'affaires africain confiant",
    active: true,
    order: 3
  },
  {
    id: "4",
    src: "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=1920&q=85",
    alt: "Équipe diverse en réunion stratégique",
    active: true,
    order: 4
  },
  {
    id: "5",
    src: "https://images.unsplash.com/photo-1600878459550-1cf6f36c5f66?w=1920&q=85",
    alt: "Femme d'affaires africaine leader",
    active: true,
    order: 5
  },
  {
    id: "6",
    src: "https://images.unsplash.com/photo-1556157382-97eda2d62296?w=1920&q=85",
    alt: "Équipe professionnelle au bureau moderne",
    active: true,
    order: 6
  },
  {
    id: "7",
    src: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=1920&q=85",
    alt: "Professionnelle africaine au travail",
    active: true,
    order: 7
  },
  {
    id: "8",
    src: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=1920&q=85",
    alt: "Équipe collaborative au bureau",
    active: true,
    order: 8
  }
]

// Photos thématiques pour Novembre Bleu (exemple)
export const NOVEMBRE_BLEU_PHOTOS: Photo[] = [
  {
    id: "nb-1",
    src: "/uploads/novembre-bleu-1.jpg",
    alt: "Sensibilisation Novembre Bleu - Santé masculine",
    theme: "novembre-bleu",
    month: 11,
    active: true,
    order: 1
  },
  // À compléter avec vos propres photos
]

// Fonction pour obtenir les photos du mois actuel
export function getCurrentMonthPhotos(allPhotos: Photo[]): Photo[] {
  const currentMonth = new Date().getMonth() + 1
  
  // Filtrer les photos du mois actuel
  const monthPhotos = allPhotos.filter(
    photo => photo.active && photo.month === currentMonth
  )
  
  // Si pas de photos pour ce mois, retourner les photos par défaut
  return monthPhotos.length > 0 
    ? monthPhotos.sort((a, b) => a.order - b.order)
    : DEFAULT_PHOTOS.filter(p => p.active).sort((a, b) => a.order - b.order)
}

// Fonction pour obtenir les photos d'une thématique
export function getThemePhotos(allPhotos: Photo[], themeId: string): Photo[] {
  return allPhotos
    .filter(photo => photo.active && photo.theme === themeId)
    .sort((a, b) => a.order - b.order)
}

