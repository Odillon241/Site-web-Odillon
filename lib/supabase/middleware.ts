import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'
import { getSupabaseConfig } from './config'

/**
 * Updates the Supabase session cookies.
 *
 * Route protection stays in pages and route handlers to avoid redirect loops.
 */
export async function updateSession(request: NextRequest) {
  let supabaseUrl: string
  let supabasePublishableKey: string

  try {
    const config = getSupabaseConfig()
    supabaseUrl = config.supabaseUrl
    supabasePublishableKey = config.supabasePublishableKey
  } catch (error) {
    console.error('Missing Supabase environment variables. Please check your .env.local file and restart the dev server.')
    return NextResponse.next()
  }

  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  const supabase = createServerClient(supabaseUrl, supabasePublishableKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll()
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) => {
          request.cookies.set(name, value)
        })

        response = NextResponse.next({
          request: {
            headers: request.headers,
          },
        })

        cookiesToSet.forEach(({ name, value, options }) => {
          response.cookies.set(name, value, options)
        })
      },
    },
  })

  await supabase.auth.getClaims()

  return response
}
