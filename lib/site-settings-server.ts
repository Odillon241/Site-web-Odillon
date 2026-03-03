/**
 * Utilitaire pour récupérer les paramètres de visibilité du site (Server Component)
 * Utilise le client Supabase directement
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
 * Récupère les paramètres du site côté serveur (Server Component)
 * Utilise le client Supabase directement
 */
export async function getSiteSettingsServer(): Promise<SiteSettings> {
  try {
    const { createClient } = await import('@/lib/supabase/server')
    const supabase = await createClient()
    
    const { data, error } = await supabase
      .from('site_settings')
      .select('*')
      .eq('id', 'main')
      .single()

    if (error || !data) {
      return DEFAULT_SETTINGS
    }

    return {
      show_videos_section: data.show_videos_section ?? true,
      show_photos_section: data.show_photos_section ?? true
    }
  } catch (error) {
    console.error('Erreur lors de la récupération des paramètres serveur:', error)
    return DEFAULT_SETTINGS
  }
}
