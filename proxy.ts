import { type NextRequest, NextResponse } from 'next/server'
import { updateSession } from '@/lib/supabase/middleware'

/**
 * Proxy Next.js 16 pour gérer le routage des sous-domaines
 * 
 * Conforme aux bonnes pratiques Next.js 16 :
 * - Utilise proxy.ts (remplace middleware.ts déprécié)
 * - Gère le routage basé sur le hostname
 * - Protège les routes admin avec Supabase Auth
 * 
 * @see https://nextjs.org/docs/app/api-reference/file-conventions/proxy
 */

/**
 * Récupère le hostname effectif depuis les headers de la requête
 * Supporte plusieurs configurations de reverse proxy (Apache, Nginx, etc.)
 */
function getEffectiveHost(request: NextRequest): string {
  // Priorité des headers pour déterminer le hostname:
  // 1. x-forwarded-host (standard pour les reverse proxies)
  // 2. x-original-host (certains reverse proxies)
  // 3. host (header HTTP standard)
  const forwardedHost = request.headers.get('x-forwarded-host')
  const originalHost = request.headers.get('x-original-host')
  const hostHeader = request.headers.get('host')
  
  const hostname = forwardedHost || originalHost || hostHeader || ''
  
  // Normaliser: enlever le port si présent et mettre en minuscules
  return hostname.split(':')[0].toLowerCase()
}

/**
 * Vérifie si le host correspond au sous-domaine admin
 */
function isAdminHost(host: string): boolean {
  return (
    host === 'admin.odillon.fr' ||
    host === 'admin.odillon.com' ||
    host.startsWith('admin.odillon.') ||
    host.startsWith('admin.localhost') ||
    host === 'admin'
  )
}

export async function proxy(request: NextRequest) {
  try {
    const host = getEffectiveHost(request)
    const { pathname } = request.nextUrl
    
    // Log détaillé pour débogage en production
    if (process.env.NODE_ENV === 'production') {
      const forwardedHost = request.headers.get('x-forwarded-host')
      const originalHost = request.headers.get('x-original-host')
      const hostHeader = request.headers.get('host')
      console.log(`[Proxy] Effective Host: ${host}, Path: ${pathname}`)
      console.log(`[Proxy] Headers - Host: ${hostHeader}, X-Forwarded-Host: ${forwardedHost}, X-Original-Host: ${originalHost}`)
    }

    // En développement local (localhost, 127.0.0.1), autoriser l'accès direct aux routes /admin
    const isLocalDev = host === 'localhost' || host === '127.0.0.1'

    // Gestion du sous-domaine admin.odillon.fr
    if (isAdminHost(host)) {
      // Rediriger la racine vers /admin/photos
      if (pathname === '/') {
        const photosUrl = new URL('/admin/photos', request.url)
        // Préserver le protocole HTTPS en production
        if (process.env.NODE_ENV === 'production') {
          photosUrl.protocol = 'https:'
        }
        return NextResponse.redirect(photosUrl)
      }

      // Bloquer l'accès aux pages publiques depuis admin.odillon.fr
      // Seules les routes /admin, /api et /auth sont autorisées
      const allowedPaths = ['/admin', '/api', '/auth', '/_next', '/favicon', '/fonts']
      const isAllowedPath = allowedPaths.some((path) => pathname.startsWith(path))

      if (!isAllowedPath) {
        const loginUrl = new URL('/admin/login', request.url)
        if (process.env.NODE_ENV === 'production') {
          loginUrl.protocol = 'https:'
        }
        return NextResponse.redirect(loginUrl)
      }
    }

    // Si on est sur le domaine principal (odillon.fr ou www.odillon.fr)
    // ET qu'on n'est pas en développement local
    // Rediriger les accès /admin vers admin.odillon.fr
    if (!isLocalDev && (host === 'odillon.fr' || host === 'www.odillon.fr')) {
      // Rediriger les accès /admin vers admin.odillon.fr
      if (pathname.startsWith('/admin')) {
        const adminUrl = new URL(pathname, 'https://admin.odillon.fr')
        adminUrl.search = request.nextUrl.search
        return NextResponse.redirect(adminUrl, 308) // 308 = Permanent Redirect (préserve la méthode HTTP)
      }
    }

    // Gestion de la session Supabase pour toutes les routes
    // Cela protège automatiquement les routes /admin/* (sauf /admin/login)
    return await updateSession(request)
  } catch (error) {
    // En cas d'erreur, continuer avec la requête normale
    console.error('Proxy error:', error)
    return NextResponse.next()
  }
}

/**
 * Configuration du matcher pour optimiser les performances
 * Exclut les fichiers statiques et les assets Next.js
 */
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - fichiers statiques (images, fonts, etc.)
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|woff|woff2|ttf|eot)$).*)',
  ],
}

