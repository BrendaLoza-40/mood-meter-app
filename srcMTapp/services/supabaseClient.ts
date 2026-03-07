import { createClient, SupabaseClient } from "@supabase/supabase-js";

const url = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const key = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

/** Only create client when env vars exist so the app doesn't crash on load (e.g. missing Vercel env). */
export const supabase: SupabaseClient | null =
  url && key ? createClient(url, key) : null;
