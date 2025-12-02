import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

/**
 * Route API pour gérer la redirection depuis Supabase après clic sur le lien de réinitialisation
 * 
 * Supabase génère un lien vers son endpoint /auth/v1/verify qui vérifie le token
 * et redirige vers cette route. On peut recevoir :
 * - Un 'code' dans les query params (PKCE flow)
 * - Un 'token_hash' et 'type' dans les query params (direct flow)
 * - Rien dans les query params mais une session active (token déjà vérifié par Supabase)
 */
export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  
  const supabase = await createClient()
  
  // Cas 1: On a un code (PKCE flow)
  const code = searchParams.get('code')
  if (code) {
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    
    if (!error) {
      // Session créée, rediriger vers la page de mise à jour
      return NextResponse.redirect(`${origin}/admin/update-password`)
    }
  }
  
  // Cas 2: On a un token_hash et type (direct flow)
  const tokenHash = searchParams.get('token_hash')
  const type = searchParams.get('type')
  if (tokenHash && type === 'recovery') {
    // Vérifier le token avant de rediriger
    const { error: verifyError } = await supabase.auth.verifyOtp({
      token_hash: tokenHash,
      type: 'recovery',
    })
    
    if (!verifyError) {
      // Token valide, rediriger vers la page de mise à jour
      return NextResponse.redirect(`${origin}/admin/update-password`)
    }
  }
  
  // Cas 3: Vérifier si on a déjà une session active (Supabase a peut-être déjà vérifié le token)
  const { data: { session } } = await supabase.auth.getSession()
  if (session) {
    // On a une session, rediriger vers la page de mise à jour
    return NextResponse.redirect(`${origin}/admin/update-password`)
  }
  
  // Aucun cas valide, rediriger vers la page de demande de réinitialisation
  return NextResponse.redirect(`${origin}/admin/reset-password?error=invalid_link`)
}
