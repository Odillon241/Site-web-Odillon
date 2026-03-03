// Types partagés pour l'administration

export interface Photo {
  id: string
  url: string
  description: string
  location: string | null
  month: number | null
  theme_id: string | null
  section_id: string | null
  is_active: boolean
  display_order: number
}

export interface CompanyLogo {
  id: string
  name: string
  full_name: string
  logo_path: string
  fallback: string
  color: string
  display_order: number
  is_active: boolean
}

export interface Video {
  id: string
  title: string
  description: string | null
  url: string
  type: 'youtube' | 'vimeo' | 'direct'
  thumbnail: string | null
  category: 'presentation' | 'testimonial'
  is_active: boolean
  display_order: number
}

export interface PhotoSection {
  id: string
  title: string
  description: string | null
  badge: string | null
  page: string
  position_after: string | null
  display_order: number
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface Testimonial {
  id: string
  quote: string
  name: string
  position: string
  avatar_url: string
  display_order: number
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface SiteSettings {
  show_videos_section: boolean
  show_photos_section: boolean
  services_cta_image_url: string | null
  expertise_image_url: string | null
}
