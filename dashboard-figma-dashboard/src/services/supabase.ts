import { createClient } from '@supabase/supabase-js'

// Supabase configuration for dashboard
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || ''
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || ''

// Create Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Types for dashboard
export interface DashboardMoodEntry {
  id: string
  created_at: string
  date_only: string
  l1_id: string
  l1_label: string
  l2_id: string
  l2_label: string
  l3_id: string
  l3_label: string
  l4_id: string
  l4_label: string
  user_id?: string
  session_id?: string
  additional_notes?: string
}

export default supabase