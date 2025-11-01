// Événements et jours fériés du Gabon

export interface GabonEvent {
  id: string
  date: Date
  title: string
  description: string
  type: 'holiday' | 'national' | 'awareness' | 'cultural'
  color: string
}

export const gabonEvents: GabonEvent[] = [
  // Janvier
  {
    id: 'new-year',
    date: new Date(2025, 0, 1),
    title: 'Nouvel An',
    description: 'Jour férié - Célébration du Nouvel An',
    type: 'holiday',
    color: '#10B981'
  },
  
  // Février
  {
    id: 'women-day-gabon',
    date: new Date(2025, 1, 17),
    title: 'Journée de la Femme Gabonaise',
    description: 'Célébration nationale de la femme gabonaise',
    type: 'national',
    color: '#EC4899'
  },
  
  // Mars
  {
    id: 'renovation',
    date: new Date(2025, 2, 12),
    title: 'Fête de la Rénovation',
    description: 'Jour férié - Commémoration de la Rénovation',
    type: 'holiday',
    color: '#10B981'
  },
  
  // Avril
  {
    id: 'easter-monday',
    date: new Date(2025, 3, 21),
    title: 'Lundi de Pâques',
    description: 'Jour férié religieux',
    type: 'holiday',
    color: '#10B981'
  },
  
  // Mai
  {
    id: 'labor-day',
    date: new Date(2025, 4, 1),
    title: 'Fête du Travail',
    description: 'Jour férié international du travail',
    type: 'holiday',
    color: '#10B981'
  },
  {
    id: 'whit-monday',
    date: new Date(2025, 4, 9),
    title: 'Lundi de Pentecôte',
    description: 'Jour férié religieux',
    type: 'holiday',
    color: '#10B981'
  },
  
  // Août
  {
    id: 'independence',
    date: new Date(2025, 7, 17),
    title: 'Fête de l\'Indépendance',
    description: 'Jour férié - Indépendance du Gabon (1960)',
    type: 'national',
    color: '#3B82F6'
  },
  {
    id: 'assumption',
    date: new Date(2025, 7, 15),
    title: 'Assomption',
    description: 'Jour férié religieux',
    type: 'holiday',
    color: '#10B981'
  },
  
  // Octobre
  {
    id: 'octobre-rose',
    date: new Date(2025, 9, 1),
    title: 'Octobre Rose',
    description: 'Mois de sensibilisation au cancer du sein',
    type: 'awareness',
    color: '#FF69B4'
  },
  
  // Novembre
  {
    id: 'all-saints',
    date: new Date(2025, 10, 1),
    title: 'Toussaint',
    description: 'Jour férié religieux',
    type: 'holiday',
    color: '#10B981'
  },
  {
    id: 'novembre-bleu',
    date: new Date(2025, 10, 1),
    title: 'Novembre Bleu',
    description: 'Mois de sensibilisation à la santé masculine',
    type: 'awareness',
    color: '#4A90E2'
  },
  
  // Décembre
  {
    id: 'christmas',
    date: new Date(2025, 11, 25),
    title: 'Noël',
    description: 'Jour férié religieux',
    type: 'holiday',
    color: '#10B981'
  },
  {
    id: 'decembre-solidaire',
    date: new Date(2025, 11, 1),
    title: 'Décembre Solidaire',
    description: 'Mois de la solidarité et du partage',
    type: 'awareness',
    color: '#C4D82E'
  }
]

// Fonction pour obtenir les événements d'un mois donné
export function getEventsForMonth(month: number, year: number = 2025): GabonEvent[] {
  return gabonEvents.filter(event => {
    const eventDate = new Date(event.date)
    return eventDate.getMonth() === month && eventDate.getFullYear() === year
  })
}

// Fonction pour obtenir l'événement d'une date donnée
export function getEventForDate(date: Date): GabonEvent | undefined {
  return gabonEvents.find(event => {
    const eventDate = new Date(event.date)
    return eventDate.getDate() === date.getDate() &&
           eventDate.getMonth() === date.getMonth() &&
           eventDate.getFullYear() === date.getFullYear()
  })
}

// Fonction pour vérifier si une date a un événement
export function hasEvent(date: Date): boolean {
  return getEventForDate(date) !== undefined
}

// Fonction pour obtenir tous les événements à venir
export function getUpcomingEvents(limit: number = 5): GabonEvent[] {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  
  return gabonEvents
    .filter(event => new Date(event.date) >= today)
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(0, limit)
}

