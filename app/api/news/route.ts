import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

// Types
interface NewsItem {
  id: string
  title: string
  source: string
  category: 'juridique' | 'finance' | 'rh' | 'gouvernance' | 'economie' | 'afrique'
  url?: string
  publishedAt: string
  summary?: string
}

interface RSSFeedConfig {
  url: string
  source: string
  category: NewsItem['category']
}

// RSS Feed sources relevant to Odillon's domains
const RSS_FEEDS: RSSFeedConfig[] = [
  // Gabon & Central Africa
  {
    url: 'https://www.gabonreview.com/feed/',
    source: 'Gabon Review',
    category: 'economie'
  },
  // African Business & Economy
  {
    url: 'https://www.jeuneafrique.com/feed/',
    source: 'Jeune Afrique',
    category: 'afrique'
  },
  // OHADA Legal
  {
    url: 'https://www.ohada.com/feed/',
    source: 'OHADA.com',
    category: 'juridique'
  }
]

// Keywords to filter relevant news
const RELEVANCE_KEYWORDS = {
  juridique: ['droit', 'juridique', 'légal', 'tribunal', 'justice', 'loi', 'réglementation', 'contrat', 'litige', 'ohada', 'code'],
  finance: ['finance', 'banque', 'investissement', 'bourse', 'économie', 'fiscal', 'comptable', 'audit', 'cemac', 'beac', 'crédit'],
  rh: ['rh', 'ressources humaines', 'emploi', 'travail', 'recrutement', 'formation', 'salaire', 'social', 'personnel'],
  gouvernance: ['gouvernance', 'conseil', 'administration', 'compliance', 'conformité', 'éthique', 'transparence', 'direction'],
  economie: ['économie', 'croissance', 'pib', 'inflation', 'développement', 'marché', 'commerce', 'export', 'import'],
  afrique: ['gabon', 'cemac', 'afrique centrale', 'libreville', 'cameroun', 'congo', 'guinée équatoriale', 'tchad', 'rca']
}

// Simple XML parser for RSS feeds (no external dependency)
function parseRSSItem(itemXml: string): { title: string; link: string; pubDate: string; description: string } | null {
  try {
    const getTagContent = (xml: string, tag: string): string => {
      const regex = new RegExp(`<${tag}[^>]*>(?:<!\\[CDATA\\[)?([\\s\\S]*?)(?:\\]\\]>)?<\\/${tag}>`, 'i')
      const match = xml.match(regex)
      return match ? match[1].trim() : ''
    }

    const title = getTagContent(itemXml, 'title')
    const link = getTagContent(itemXml, 'link')
    const pubDate = getTagContent(itemXml, 'pubDate')
    const description = getTagContent(itemXml, 'description')

    if (!title) return null

    return { title, link, pubDate, description }
  } catch {
    return null
  }
}

// Fetch and parse RSS feed
async function fetchRSSFeed(config: RSSFeedConfig): Promise<NewsItem[]> {
  try {
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 5000) // 5s timeout

    const response = await fetch(config.url, {
      signal: controller.signal,
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; OdillonNewsBot/1.0)',
        'Accept': 'application/rss+xml, application/xml, text/xml'
      },
      next: { revalidate: 900 } // Cache for 15 minutes
    })

    clearTimeout(timeoutId)

    if (!response.ok) {
      console.warn(`RSS fetch failed for ${config.source}: ${response.status}`)
      return []
    }

    const xml = await response.text()

    // Extract items from RSS
    const itemRegex = /<item>([\s\S]*?)<\/item>/gi
    const items: NewsItem[] = []
    let match

    while ((match = itemRegex.exec(xml)) !== null && items.length < 5) {
      const parsed = parseRSSItem(match[1])
      if (parsed && isRelevant(parsed.title, parsed.description)) {
        const category = detectCategory(parsed.title, parsed.description) || config.category
        items.push({
          id: generateId(parsed.link || parsed.title),
          title: cleanText(parsed.title),
          source: config.source,
          category,
          url: parsed.link,
          publishedAt: parsed.pubDate ? new Date(parsed.pubDate).toISOString() : new Date().toISOString(),
          summary: parsed.description ? cleanText(parsed.description).slice(0, 200) : undefined
        })
      }
    }

    return items
  } catch (error) {
    console.warn(`Error fetching RSS from ${config.source}:`, error)
    return []
  }
}

// Check if news is relevant to Odillon's domains
function isRelevant(title: string, description: string): boolean {
  const text = `${title} ${description}`.toLowerCase()
  const allKeywords = Object.values(RELEVANCE_KEYWORDS).flat()
  return allKeywords.some(keyword => text.includes(keyword.toLowerCase()))
}

// Detect the most appropriate category
function detectCategory(title: string, description: string): NewsItem['category'] | null {
  const text = `${title} ${description}`.toLowerCase()
  let maxScore = 0
  let bestCategory: NewsItem['category'] | null = null

  for (const [category, keywords] of Object.entries(RELEVANCE_KEYWORDS)) {
    const score = keywords.filter(kw => text.includes(kw.toLowerCase())).length
    if (score > maxScore) {
      maxScore = score
      bestCategory = category as NewsItem['category']
    }
  }

  return bestCategory
}

// Generate a deterministic ID from content
function generateId(content: string): string {
  let hash = 0
  for (let i = 0; i < content.length; i++) {
    const char = content.charCodeAt(i)
    hash = ((hash << 5) - hash) + char
    hash = hash & hash
  }
  return Math.abs(hash).toString(36)
}

// Clean HTML entities and tags from text - enhanced for XSS protection
function cleanText(text: string): string {
  return text
    // Remove script and style tags with content
    .replace(/<script[\s\S]*?<\/script>/gi, '')
    .replace(/<style[\s\S]*?<\/style>/gi, '')
    // Remove all remaining HTML tags
    .replace(/<[^>]*>/g, '')
    // Decode common HTML entities
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'")
    .replace(/&apos;/g, "'")
    .replace(/&nbsp;/g, ' ')
    .replace(/&#x27;/g, "'")
    .replace(/&#x2F;/g, '/')
    .replace(/&#60;/g, '<')
    .replace(/&#62;/g, '>')
    // Remove potential XSS vectors
    .replace(/javascript:/gi, '')
    .replace(/on\w+=/gi, '')
    .replace(/data:/gi, '')
    // Normalize whitespace
    .replace(/\s+/g, ' ')
    .trim()
}

// Get fallback news when RSS fails
function getFallbackNews(): NewsItem[] {
  const now = new Date()
  return [
    {
      id: 'fallback-1',
      title: "Nouveau Code du Travail au Gabon : les principales modifications à connaître",
      source: "Gabon Review",
      category: 'juridique',
      publishedAt: new Date(now.getTime() - 2 * 3600000).toISOString()
    },
    {
      id: 'fallback-2',
      title: "CEMAC : Révision des normes prudentielles pour les établissements bancaires",
      source: "BEAC",
      category: 'finance',
      publishedAt: new Date(now.getTime() - 4 * 3600000).toISOString()
    },
    {
      id: 'fallback-3',
      title: "Transformation digitale RH : les entreprises africaines accélèrent leur transition",
      source: "Africa HR Magazine",
      category: 'rh',
      publishedAt: new Date(now.getTime() - 6 * 3600000).toISOString()
    },
    {
      id: 'fallback-4',
      title: "Gouvernance d'entreprise : nouvelles recommandations de l'OHADA pour 2026",
      source: "OHADA.com",
      category: 'gouvernance',
      publishedAt: new Date(now.getTime() - 8 * 3600000).toISOString()
    },
    {
      id: 'fallback-5',
      title: "Zone CEMAC : Croissance économique prévue à 3,2% pour l'année 2026",
      source: "Jeune Afrique",
      category: 'economie',
      publishedAt: new Date(now.getTime() - 10 * 3600000).toISOString()
    },
    {
      id: 'fallback-6',
      title: "Sommet de l'UA à Addis-Abeba : Focus sur l'intégration économique africaine",
      source: "RFI Afrique",
      category: 'afrique',
      publishedAt: new Date(now.getTime() - 12 * 3600000).toISOString()
    }
  ]
}

// GET handler
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category') as NewsItem['category'] | null
    const limit = parseInt(searchParams.get('limit') || '20', 10)

    // Try to get cached news from Supabase first
    const supabase = await createClient()
    const { data: cachedNews, error: cacheError } = await supabase
      .from('news_cache')
      .select('*')
      .gte('cached_at', new Date(Date.now() - 15 * 60 * 1000).toISOString()) // 15 min cache
      .order('published_at', { ascending: false })
      .limit(limit)

    // If we have fresh cached news, return them
    if (!cacheError && cachedNews && cachedNews.length > 0) {
      let news = cachedNews.map(item => ({
        id: item.id,
        title: item.title,
        source: item.source,
        category: item.category as NewsItem['category'],
        url: item.url,
        publishedAt: item.published_at,
        summary: item.summary
      }))

      if (category) {
        news = news.filter(item => item.category === category)
      }

      return NextResponse.json({
        news,
        cached: true,
        updatedAt: cachedNews[0]?.cached_at
      })
    }

    // Fetch fresh news from RSS feeds
    const feedPromises = RSS_FEEDS.map(feed => fetchRSSFeed(feed))
    const feedResults = await Promise.allSettled(feedPromises)

    let allNews: NewsItem[] = []
    for (const result of feedResults) {
      if (result.status === 'fulfilled') {
        allNews = [...allNews, ...result.value]
      }
    }

    // If RSS failed, use fallback
    if (allNews.length === 0) {
      allNews = getFallbackNews()
    }

    // Sort by date and dedupe
    allNews = allNews
      .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
      .filter((item, index, self) =>
        index === self.findIndex(t => t.title.toLowerCase() === item.title.toLowerCase())
      )
      .slice(0, limit)

    // Cache the news in Supabase (best effort)
    try {
      const cacheItems = allNews.map(item => ({
        id: item.id,
        title: item.title,
        source: item.source,
        category: item.category,
        url: item.url,
        published_at: item.publishedAt,
        summary: item.summary,
        cached_at: new Date().toISOString()
      }))

      await supabase
        .from('news_cache')
        .upsert(cacheItems, { onConflict: 'id' })
    } catch (cacheErr) {
      console.warn('Failed to cache news:', cacheErr)
    }

    // Filter by category if requested
    if (category) {
      allNews = allNews.filter(item => item.category === category)
    }

    return NextResponse.json({
      news: allNews,
      cached: false,
      updatedAt: new Date().toISOString()
    })

  } catch (error) {
    console.error('News API error:', error)

    // Return fallback news on any error
    return NextResponse.json({
      news: getFallbackNews(),
      cached: false,
      error: 'Utilisation des actualités de démonstration',
      updatedAt: new Date().toISOString()
    })
  }
}

// Force revalidation
export const revalidate = 900 // 15 minutes
