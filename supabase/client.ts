import { createClient } from '@supabase/supabase-js'

// Create a single Supabase client for the client-side
let supabase: ReturnType<typeof createClient> | undefined

export function getSupabaseBrowserClient() {
  if (!supabase) {
    supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!)
  }
  return supabase
}
