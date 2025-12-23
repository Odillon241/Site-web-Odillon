import { unstable_cache } from "next/cache"

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
      const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'
      const res = await fetch(`${baseUrl}/api/photos?active=true&section=hero`, {
        next: { revalidate: 300 }, // Revalidate every 5 minutes
      })

      if (!res.ok) {
        console.error(`❌ Failed to fetch photos: ${res.status}`)
        return []
      }

      const data = await res.json()
      return data.photos || []
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
