import { type NextRequest, NextResponse } from 'next/server'
import { updateSession } from '@/lib/supabase/middleware'

export async function middleware(request: NextRequest) {
  const hostname = request.headers.get('host') || ''
  const { pathname } = request.nextUrl

  // Si on est sur admin.odillon.fr
  if (hostname.startsWith('admin.odillon.')) {
    // Rediriger la racine vers /admin/login
    if (pathname === '/') {
      return NextResponse.redirect(new URL('/admin/login', request.url))
    }

    // Bloquer l'accès aux pages publiques depuis admin.odillon.fr
    if (!pathname.startsWith('/admin') && !pathname.startsWith('/api') && !pathname.startsWith('/auth')) {
      return NextResponse.redirect(new URL('/admin/login', request.url))
    }
  }

  // Si on est sur odillon.fr (domaine principal)
  if (hostname === 'odillon.fr' || hostname === 'www.odillon.fr' || hostname.startsWith('odillon.fr')) {
    // Rediriger les accès admin vers admin.odillon.fr
    if (pathname.startsWith('/admin')) {
      const adminUrl = new URL(request.url)
      adminUrl.hostname = 'admin.odillon.fr'
      return NextResponse.redirect(adminUrl)
    }
  }

  // Gestion de la session Supabase
  return await updateSession(request)
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}

