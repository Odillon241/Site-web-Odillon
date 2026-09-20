import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

/**
 * Route de diagnostic pour vérifier les headers en production
 * Accessible via: GET /api/debug-headers
 *
 * Utile pour déboguer les problèmes de sous-domaine.
 * Réservée aux utilisateurs authentifiés : elle expose des détails
 * internes de routage (host, headers de proxy, NODE_ENV).
 */
export async function GET(request: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })
  }

  // Récupérer tous les headers pertinents pour le routage
  const headers: Record<string, string | null> = {
    'host': request.headers.get('host'),
    'x-forwarded-host': request.headers.get('x-forwarded-host'),
    'x-forwarded-for': request.headers.get('x-forwarded-for'),
    'x-forwarded-proto': request.headers.get('x-forwarded-proto'),
    'x-real-ip': request.headers.get('x-real-ip'),
    'origin': request.headers.get('origin'),
    'referer': request.headers.get('referer'),
  }

  // Déterminer le hostname effectif (même logique que proxy.ts)
  const forwardedHost = request.headers.get('x-forwarded-host')
  const hostname = forwardedHost || request.headers.get('host') || ''
  const host = hostname.split(':')[0].toLowerCase()

  // Vérifier si on est sur le sous-domaine admin
  const isAdminSubdomain = host === 'admin.odillon.fr' || 
                           host.startsWith('admin.odillon.') || 
                           host === 'admin'

  return NextResponse.json({
    message: 'Debug headers pour diagnostiquer le routage sous-domaine',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
    request: {
      url: request.url,
      pathname: request.nextUrl.pathname,
      method: request.method,
    },
    headers,
    computed: {
      effectiveHostname: hostname,
      normalizedHost: host,
      isAdminSubdomain,
    },
    instructions: isAdminSubdomain 
      ? '✅ Le sous-domaine admin est correctement détecté'
      : '❌ Le sous-domaine admin n\'est PAS détecté. Vérifiez que le reverse proxy transmet x-forwarded-host ou host correctement.',
  }, {
    status: 200,
    headers: {
      'Cache-Control': 'no-store',
    },
  })
}
