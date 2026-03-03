import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseAnonKey) {
    console.error('Missing Supabase environment variables:', {
      url: supabaseUrl ? 'present' : 'missing',
      key: supabaseAnonKey ? 'present' : 'missing'
    })
    throw new Error(
      'Missing Supabase environment variables. Please check your .env.local file and restart the dev server.'
    )
  }

  return createBrowserClient(supabaseUrl, supabaseAnonKey)
}

