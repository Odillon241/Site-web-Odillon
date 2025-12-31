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
export async function proxy(request: NextRequest) {
  try {
    // Récupérer le hostname depuis plusieurs sources (pour compatibilité reverse proxy)
    const forwardedHost = request.headers.get('x-forwarded-host')
    const hostname = forwardedHost || request.headers.get('host') || ''
    const { pathname } = request.nextUrl

    // Normaliser le hostname (enlever le port si présent)
    const host = hostname.split(':')[0].toLowerCase()

    // Log pour débogage en production (visible dans les logs serveur)
    if (process.env.NODE_ENV === 'production') {
      console.log(`[Proxy] Host: ${host}, Path: ${pathname}, Forwarded-Host: ${forwardedHost || 'none'}`)
    }

    // En développement local (localhost, 127.0.0.1), autoriser l'accès direct aux routes /admin
    const isLocalDev = host === 'localhost' || host === '127.0.0.1'

    // Gestion du sous-domaine admin.odillon.fr
    if (host === 'admin.odillon.fr' || host.startsWith('admin.odillon.') || host === 'admin') {
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

