import { getHeroPhotos } from "@/lib/photos-cache"
import { HeroClient } from "./hero-client"
import { CompanyLogo } from "@/types/admin"

/**
 * Hero Section - Server Component
 * Fetches photos server-side with caching for optimal performance
 */
export async function Hero({ logos }: { logos: CompanyLogo[] }) {
  const images = await getHeroPhotos()

  return <HeroClient images={images} logos={logos} />
}
