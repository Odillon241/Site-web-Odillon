export interface Photo {
    id: string
    url: string
    description: string
    details: string | null
    location: string | null
    month: number | null
    theme_id: string | null
    section_id: string | null
    is_active: boolean
    display_order: number
    activity_type?: string | null
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
    page?: string | null
    section?: string | null
    is_active: boolean
    display_order: number
    presenter_name?: string | null
    presenter_position?: string | null
    activity_type?: string | null
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
    page?: string | null
    section?: string | null
    created_at: string
    updated_at: string
}

export interface SiteSettings {
    id: string
    show_videos_section: boolean
    show_photos_section: boolean
    services_cta_image_url: string | null
    expertise_image_url: string | null
    expertise_cta_title: string | null
    expertise_cta_description: string | null
    expertise_cta_button_text: string | null
    expertise_cta_button_link: string | null
    expertise_cta_badge_text: string | null
    show_blog_banner: boolean
    blog_banner_image_url: string | null
    blog_banner_link: string | null
    created_at: string
    updated_at: string
}
