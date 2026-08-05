// Supabase browser client. Auth is Phase 1 — until the env vars are set the
// client stays null and the UI shows a "not configured" state instead of
// crashing. Only non-secret VITE_ vars reach the browser (BUILD_PLAN §13).
import { createClient, type SupabaseClient } from '@supabase/supabase-js'

const url = import.meta.env.VITE_SUPABASE_URL as string | undefined
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined

export const supabaseEnabled = Boolean(url && anonKey)

export const supabase: SupabaseClient | null = supabaseEnabled
  ? createClient(url as string, anonKey as string)
  : null
