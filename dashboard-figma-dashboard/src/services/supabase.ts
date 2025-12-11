import { createClient } from '@supabase/supabase-js'

// Supabase configuration for dashboard
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || ''
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || ''

// Create Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Types for dashboard
// This shape matches the backend Supabase table `moods`
export interface DashboardMoodEntry {
  id: string
  created_at: string | null
  client_timestamp?: string | null
  date_only: string
  l1_id: string
  l1_label: string
  l2_id: string
  l2_label: string
  time_to_select_ms?: number | null
  kiosk_id?: string | null
  user_id?: string | null
}

export default supabase