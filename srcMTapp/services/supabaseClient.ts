import { createClient } from "@supabase/supabase-js";

const url = import.meta.env.VITE_SUPABASE_URL;
const key = import.meta.env.VITE_SUPABASE_ANON_KEY;

console.log("KIOSK ENV URL =", url);
console.log("KIOSK ENV KEY present =", !!key);

export const supabase = createClient(url as string, key as string);
