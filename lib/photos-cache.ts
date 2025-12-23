import { unstable_cache } from "next/cache"
import { createClient } from "@supabase/supabase-js"

export interface Photo {
  id: string
  src?: string
  url?: string
  alt?: string
  description?: string
  month: number | null
  display_order?: number
}

/**
 * Fetch active photos from API with caching
 * Revalidates every 5 minutes
 */
export const getActivePhotos = unstable_cache(
  async (): Promise<Photo[]> => {
    try {
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
      const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
      const supabase = createClient(supabaseUrl, supabaseKey)

      const { data, error } = await supabase
        .from('photos')
        .select('*')
        .eq('is_active', true)
        .eq('section_id', 'a2aca9ff-af21-4e5c-8f5a-89d00c5a671b') // Hero section ID
        .order('display_order', { ascending: true })

      if (error) {
        console.error(`❌ Failed to fetch photos: ${error.message}`)
        return []
      }

      return data || []
    } catch (error) {
      console.error("❌ Error fetching photos:", error)
      return []
    }
  },
  ['active-photos'],
  {
    revalidate: 300, // Cache for 5 minutes
    tags: ['photos']
  }
)

/**
 * Get photos filtered for current month
 * Returns photos for current month OR photos without month specified
 */
export async function getHeroPhotos(): Promise<Array<{ src: string; alt: string }>> {
  const allPhotos = await getActivePhotos()
  const currentMonth = new Date().getMonth() + 1

  // Filter: photos for current month OR photos without month (null/undefined)
  const filteredPhotos = allPhotos.filter(
    (p) => p.month === currentMonth || p.month === null || p.month === undefined
  )

  // Remove duplicates by ID
  const uniquePhotos = Array.from(
    new Map(filteredPhotos.map((p) => [p.id, p])).values()
  )

  // Transform and sort
  const images = uniquePhotos
    .filter((photo) => {
      const photoUrl = photo.url || photo.src
      return photoUrl && typeof photoUrl === 'string' && photoUrl.length > 0
    })
    .sort((a, b) => {
      const orderA = a.display_order || 999
      const orderB = b.display_order || 999
      return orderA - orderB
    })
    .map((photo) => ({
      src: photo.url || photo.src || '',
      alt: photo.description || photo.alt || 'Photo Odillon'
    }))

  console.log(`✅ ${images.length} photo(s) cached for Hero (month ${currentMonth})`)
  return images
}
