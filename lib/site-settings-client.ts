/**
 * Utilitaire pour récupérer les paramètres de visibilité du site (côté client)
 */

export interface SiteSettings {
  show_videos_section: boolean
  show_photos_section: boolean
}

const DEFAULT_SETTINGS: SiteSettings = {
  show_videos_section: true,
  show_photos_section: true
}

/**
 * Récupère les paramètres du site depuis l'API (côté client)
 * Utilise le cache par défaut pour les performances
 */
export async function getSiteSettings(): Promise<SiteSettings> {
  try {
    const res = await fetch('/api/settings', {
      cache: 'default', // Utilise le cache pour les performances
      next: { revalidate: 60 } // Revalide toutes les 60 secondes
    })

    if (!res.ok) {
      console.warn('Impossible de charger les paramètres du site, utilisation des valeurs par défaut')
      return DEFAULT_SETTINGS
    }

    const data = await res.json()
    return {
      show_videos_section: data.settings?.show_videos_section ?? true,
      show_photos_section: data.settings?.show_photos_section ?? true
    }
  } catch (error) {
    console.error('Erreur lors de la récupération des paramètres:', error)
    return DEFAULT_SETTINGS
  }
}
