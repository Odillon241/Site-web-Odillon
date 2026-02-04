'use client'

import { useEffect, useState, useCallback, memo, useRef } from 'react'
import { m } from 'framer-motion'
import { cn } from '@/lib/utils'
import { createClient } from '@/lib/supabase/client'
import {
  Newspaper,
  TrendingUp,
  Scale,
  Users,
  Building2,
  Globe,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  Pause,
  Play
} from 'lucide-react'

// Types
export interface NewsItem {
  id: string
  title: string
  source: string
  category: 'juridique' | 'finance' | 'rh' | 'gouvernance' | 'economie' | 'afrique'
  url?: string
  publishedAt: string
  summary?: string
}

interface NewsTickerSettings {
  show_news_ticker: boolean
  news_ticker_speed: number
  news_auto_refresh: boolean
  news_refresh_interval: number
}

interface NewsTickerProps {
  className?: string
  speed?: number // pixels per second (overridden by settings)
  pauseOnHover?: boolean
  showControls?: boolean
}

// Category configuration with icons and colors
const categoryConfig = {
  juridique: {
    icon: Scale,
    label: 'Juridique',
    color: 'bg-amber-500/10 text-amber-600 border-amber-500/20',
    accentColor: 'text-amber-500'
  },
  finance: {
    icon: TrendingUp,
    label: 'Finance',
    color: 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20',
    accentColor: 'text-emerald-500'
  },
  rh: {
    icon: Users,
    label: 'RH',
    color: 'bg-blue-500/10 text-blue-600 border-blue-500/20',
    accentColor: 'text-blue-500'
  },
  gouvernance: {
    icon: Building2,
    label: 'Gouvernance',
    color: 'bg-purple-500/10 text-purple-600 border-purple-500/20',
    accentColor: 'text-purple-500'
  },
  economie: {
    icon: TrendingUp,
    label: 'Économie',
    color: 'bg-odillon-teal/10 text-odillon-teal border-odillon-teal/20',
    accentColor: 'text-odillon-teal'
  },
  afrique: {
    icon: Globe,
    label: 'Afrique',
    color: 'bg-odillon-lime/10 text-odillon-dark border-odillon-lime/30',
    accentColor: 'text-odillon-lime'
  }
}

// Format relative time
function formatRelativeTime(dateString: string): string {
  const date = new Date(dateString)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMs / 3600000)
  const diffDays = Math.floor(diffMs / 86400000)

  if (diffMins < 1) return "À l'instant"
  if (diffMins < 60) return `Il y a ${diffMins} min`
  if (diffHours < 24) return `Il y a ${diffHours}h`
  if (diffDays < 7) return `Il y a ${diffDays}j`
  return date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })
}

// Single news item component - memoized for performance
const NewsItemCard = memo(function NewsItemCard({
  item
}: {
  item: NewsItem
}) {
  const config = categoryConfig[item.category]
  const Icon = config.icon

  return (
    <m.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className={cn(
        "flex items-center gap-4 px-6 py-3 min-w-max",
        "group cursor-pointer transition-all duration-300"
      )}
    >
      {/* Category Badge */}
      <div className={cn(
        "flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold uppercase tracking-wider",
        "border backdrop-blur-sm transition-all duration-300",
        config.color
      )}>
        <Icon className="w-3 h-3" />
        <span>{config.label}</span>
      </div>

      {/* News Content */}
      <div className="flex items-center gap-3">
        <h3 className={cn(
          "text-sm font-medium text-odillon-dark/90 max-w-[400px] truncate",
          "group-hover:text-odillon-teal transition-colors duration-200"
        )}>
          {item.title}
        </h3>

        {/* Source & Time */}
        <div className="flex items-center gap-2 text-xs text-gray-500">
          <span className="font-medium">{item.source}</span>
          <span className="w-1 h-1 rounded-full bg-gray-300" />
          <span>{formatRelativeTime(item.publishedAt)}</span>
        </div>

        {/* External Link Icon */}
        {item.url && (
          <ExternalLink className={cn(
            "w-3.5 h-3.5 text-gray-400 opacity-0 group-hover:opacity-100",
            "transition-all duration-200 group-hover:text-odillon-teal"
          )} />
        )}
      </div>

      {/* Separator */}
      <div className="w-px h-4 bg-gradient-to-b from-transparent via-gray-300 to-transparent mx-2" />
    </m.div>
  )
})

// Main News Ticker Component
export function NewsTicker({
  className,
  speed = 10, // Very slow scrolling
  pauseOnHover = true,
  showControls = true
}: NewsTickerProps) {
  const [news, setNews] = useState<NewsItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isPaused, setIsPaused] = useState(false)
  const [settings, setSettings] = useState<NewsTickerSettings>({
    show_news_ticker: true,
    news_ticker_speed: 10, // Very slow speed
    news_auto_refresh: true,
    news_refresh_interval: 15
  })
  const [settingsLoaded, setSettingsLoaded] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  // Fetch settings from Supabase
  const fetchSettings = useCallback(async () => {
    try {
      const supabase = createClient()
      const { data } = await supabase
        .from('site_settings')
        .select('show_news_ticker, news_ticker_speed, news_auto_refresh, news_refresh_interval')
        .single()

      if (data) {
        setSettings({
          show_news_ticker: data.show_news_ticker ?? true,
          news_ticker_speed: data.news_ticker_speed ?? speed,
          news_auto_refresh: data.news_auto_refresh ?? true,
          news_refresh_interval: data.news_refresh_interval ?? 15
        })
      }
    } catch {
      // Use default settings
    } finally {
      setSettingsLoaded(true)
    }
  }, [speed])

  // Fetch news from API
  const fetchNews = useCallback(async () => {
    try {
      setIsLoading(true)
      const response = await fetch('/api/news')
      if (!response.ok) throw new Error('Erreur de chargement des actualités')
      const data = await response.json()
      setNews(data.news || [])
    } catch {
      // Fallback to demo news
      setNews(getDemoNews())
    } finally {
      setIsLoading(false)
    }
  }, [])

  // Initial fetch
  useEffect(() => {
    let isMounted = true

    const init = async () => {
      if (isMounted) await fetchSettings()
      if (isMounted) await fetchNews()
    }

    init()

    return () => { isMounted = false }
  }, [fetchSettings, fetchNews])

  // Auto-refresh interval
  useEffect(() => {
    if (!settings.news_auto_refresh || !settingsLoaded) return

    const refreshMs = settings.news_refresh_interval * 60 * 1000
    const interval = setInterval(fetchNews, refreshMs)
    return () => clearInterval(interval)
  }, [settings.news_auto_refresh, settings.news_refresh_interval, settingsLoaded, fetchNews])

  // Handle news item click
  const handleNewsClick = useCallback((item: NewsItem) => {
    if (item.url) {
      window.open(item.url, '_blank', 'noopener,noreferrer')
    }
  }, [])

  // Show placeholder if ticker is disabled (keeps layout consistent)
  if (settingsLoaded && !settings.show_news_ticker) {
    return (
      <div
        className={cn(
          "bg-white/95 backdrop-blur-md border-b border-gray-200/50",
          className
        )}
      />
    )
  }

  // CSS-based infinite scroll animation - double for seamless loop
  const duplicatedNews = [...news, ...news]

  if (isLoading) {
    return (
      <div className={cn(
        "relative bg-white/95 backdrop-blur-md border-b border-gray-200/50 overflow-hidden",
        "flex items-center justify-center",
        className
      )}>
        <div className="flex items-center gap-3 text-gray-400">
          <m.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          >
            <Newspaper className="w-4 h-4" />
          </m.div>
          <span className="text-sm">Chargement des actualités...</span>
        </div>
      </div>
    )
  }

  // Show placeholder when no news (keeps layout consistent)
  if (news.length === 0) {
    return (
      <div
        className={cn(
          "bg-white/95 backdrop-blur-md border-b border-gray-200/50",
          "flex items-center justify-center",
          className
        )}
      >
        <span className="text-sm text-gray-400">Aucune actualité disponible</span>
      </div>
    )
  }

  return (
    <div
      className={cn(
        "relative bg-white/95 backdrop-blur-md border-b border-gray-200/50 overflow-hidden",
        "shadow-[0_4px_12px_-4px_rgba(0,0,0,0.1)]",
        className
      )}
      role="region"
      aria-label="Bandeau d'actualités"
    >
      {/* Live Badge */}
      <div className="absolute left-0 top-0 bottom-0 z-20 flex items-center pl-4 pr-6 bg-gradient-to-r from-white via-white to-transparent">
        <div className="flex items-center gap-2 px-3 py-1.5 bg-odillon-dark rounded-full">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-odillon-lime opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-odillon-lime" />
          </span>
          <span className="text-xs font-bold text-white uppercase tracking-wider">
            Actualités
          </span>
        </div>
      </div>

      {/* Ticker Content */}
      <div
        ref={containerRef}
        className="overflow-hidden ml-32 h-full flex items-center"
        onMouseEnter={() => pauseOnHover && setIsPaused(true)}
        onMouseLeave={() => pauseOnHover && setIsPaused(false)}
        aria-live="polite"
      >
        <m.div
          className="flex whitespace-nowrap"
          animate={{
            x: isPaused ? undefined : [0, "-50%"]
          }}
          transition={{
            x: {
              repeat: Infinity,
              repeatType: "loop",
              duration: news.length * (600 / settings.news_ticker_speed), // Ultra slow scroll - ~6 minutes for full cycle
              ease: "linear"
            }
          }}
        >
          {duplicatedNews.map((item, index) => (
            <div
              key={`${item.id}-${index}`}
              onClick={() => handleNewsClick(item)}
            >
              <NewsItemCard item={item} />
            </div>
          ))}
        </m.div>
      </div>

      {/* Right Controls */}
      {showControls && (
        <div className="absolute right-0 top-0 bottom-0 z-20 flex items-center gap-1 pr-4 pl-6 bg-gradient-to-l from-white via-white to-transparent">
          <button
            onClick={() => setIsPaused(!isPaused)}
            className={cn(
              "p-1.5 rounded-full transition-all duration-200",
              "text-gray-400 hover:text-odillon-teal hover:bg-odillon-teal/10"
            )}
            aria-label={isPaused ? "Reprendre le défilement" : "Mettre en pause"}
          >
            {isPaused ? (
              <Play className="w-3.5 h-3.5" />
            ) : (
              <Pause className="w-3.5 h-3.5" />
            )}
          </button>
          <button
            className={cn(
              "p-1.5 rounded-full transition-all duration-200",
              "text-gray-400 hover:text-odillon-teal hover:bg-odillon-teal/10"
            )}
            aria-label="Actualité précédente"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
          </button>
          <button
            className={cn(
              "p-1.5 rounded-full transition-all duration-200",
              "text-gray-400 hover:text-odillon-teal hover:bg-odillon-teal/10"
            )}
            aria-label="Actualité suivante"
          >
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}
    </div>
  )
}

// Demo/Fallback news data
function getDemoNews(): NewsItem[] {
  const now = new Date()
  return [
    {
      id: '1',
      title: "Nouveau Code du Travail au Gabon : les principales modifications à connaître",
      source: "Gabon Review",
      category: 'juridique',
      publishedAt: new Date(now.getTime() - 2 * 3600000).toISOString(),
      url: '#'
    },
    {
      id: '2',
      title: "CEMAC : Révision des normes prudentielles pour les établissements bancaires",
      source: "Jeune Afrique",
      category: 'finance',
      publishedAt: new Date(now.getTime() - 4 * 3600000).toISOString(),
      url: '#'
    },
    {
      id: '3',
      title: "Transformation digitale RH : les entreprises africaines accélèrent",
      source: "Africa HR Magazine",
      category: 'rh',
      publishedAt: new Date(now.getTime() - 6 * 3600000).toISOString(),
      url: '#'
    },
    {
      id: '4',
      title: "Gouvernance d'entreprise : nouvelles recommandations de l'OHADA",
      source: "OHADA.com",
      category: 'gouvernance',
      publishedAt: new Date(now.getTime() - 8 * 3600000).toISOString(),
      url: '#'
    },
    {
      id: '5',
      title: "Zone CEMAC : Croissance économique prévue à 3,2% en 2026",
      source: "BEAC",
      category: 'economie',
      publishedAt: new Date(now.getTime() - 10 * 3600000).toISOString(),
      url: '#'
    },
    {
      id: '6',
      title: "Sommet de l'UA : Focus sur l'intégration économique africaine",
      source: "RFI",
      category: 'afrique',
      publishedAt: new Date(now.getTime() - 12 * 3600000).toISOString(),
      url: '#'
    }
  ]
}

export default NewsTicker
