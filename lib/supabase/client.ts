import { createBrowserClient } from '@supabase/ssr'
import { getSupabaseConfig } from './config'

export function createClient() {
  try {
    const { supabaseUrl, supabasePublishableKey } = getSupabaseConfig()

    return createBrowserClient(supabaseUrl, supabasePublishableKey)
  } catch (error) {
    console.error('Missing Supabase environment variables:', {
      url: process.env.NEXT_PUBLIC_SUPABASE_URL ? 'present' : 'missing',
      key:
        process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
          ? 'present'
          : 'missing',
    })
    throw error
  }
}
