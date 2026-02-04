'use client'

import { usePathname } from 'next/navigation'
import dynamic from 'next/dynamic'

// Lazy load the NewsTicker component
const NewsTicker = dynamic(
  () => import('@/components/sections/news-ticker').then(mod => ({ default: mod.NewsTicker })),
  {
    loading: () => (
      <div className="h-full bg-white/95 backdrop-blur-md border-b border-gray-200/50" />
    ),
    ssr: false
  }
)

// Pages where the ticker should NOT appear
const EXCLUDED_PATHS = [
  '/admin',
  '/auth',
  '/login',
]

export function GlobalNewsTicker() {
  const pathname = usePathname()

  // Don't show on admin or auth pages
  const shouldHide = EXCLUDED_PATHS.some(path => pathname?.startsWith(path))

  if (shouldHide) {
    return null
  }

  // Fixed position container that always takes 60px height
  return (
    <div className="fixed top-[88px] md:top-[104px] left-0 right-0 z-40 h-[60px]">
      <NewsTicker className="h-full w-full" />
    </div>
  )
}
