/**
 * Supabase client for frontend dashboard
 * Uses anon/public key (not service role) for client-side access
 */

import { createClient } from '@supabase/supabase-js';

// Get from environment variables (you'll need to set these)
// For local dev, you can create a .env file in src-DashboardMT/
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || '';
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  console.warn(
    '⚠️ Supabase credentials not found. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in .env'
  );
}

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    persistSession: false, // Dashboard doesn't need auth persistence
  },
  realtime: {
    params: {
      eventsPerSecond: 10,
    },
  },
});

