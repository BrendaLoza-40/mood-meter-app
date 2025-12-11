/**
<<<<<<< HEAD:kiosk-srcMTapp/services/api.ts
 * API service for Mood Meter App
 * Handles communication with the backend API to submit mood entries
 * Supports both traditional API and Supabase
 */

import { SupabaseApiService } from './supabaseApi';

// Backend API base URL - can be overridden via Vite env (VITE_API_BASE_URL)
const API_BASE_URL = (import.meta as any).env?.VITE_API_BASE_URL ?? 'http://localhost:4000';

// Check if Supabase is configured
const USE_SUPABASE = !!(import.meta as any).env?.VITE_SUPABASE_URL && !!(import.meta as any).env?.VITE_SUPABASE_ANON_KEY;

/**
 * Interface for a mood entry object
 */
export interface MoodEntry {
  id: string;
  timestamp: string;
  dateOnly: string;
  l1: {
    id: string;
    label: string;
  };
  l2: {
    id: string;
    label: string;
  };
  timeToSelectMs: number;
}

/**
 * Submits a mood entry to the backend API or Supabase
 * @param entry - The mood entry data to submit
 * @returns Promise that resolves when the entry is successfully saved
=======
 * API service for Mood Meter App (kiosk)
 * Sends mood entries to the backend server, which writes to Supabase.
 */

// Server base URL — can be overridden with Vite env (VITE_API_BASE_URL)
const API_BASE_URL =
  (import.meta as any).env?.VITE_API_BASE_URL ?? 'http://localhost:4001';

/** Payload the server expects at POST /api/moods */
export interface SubmitMoodPayload {
  timestamp: string;                 // ISO string
  dateOnly: string;                  // YYYY-MM-DD
  l1: { id: string; label: string };
  l2: { id: string; label: string };
  timeToSelectMs?: number;           // optional
  kioskId?: string;                  // optional
}

/**
 * Submit a mood entry to the server (which inserts into Supabase).
 * If the network/DB fails, we also stash a backup in localStorage.
>>>>>>> 74d17279f63b48d08bed459a8caf08f582ab6fcc:srcMTapp/services/api.ts
 */
export async function submitMoodEntry(entry: SubmitMoodPayload): Promise<void> {
  try {
<<<<<<< HEAD:kiosk-srcMTapp/services/api.ts
    // Use Supabase if configured, otherwise use traditional API
    if (USE_SUPABASE) {
      console.log('Using Supabase for mood entry submission');
      const result = await SupabaseApiService.submitMoodEntry(entry);
      
      if (!result.success) {
        throw new Error(result.error || 'Failed to submit to Supabase');
      }
      
      console.log('Mood entry submitted successfully to Supabase:', result.data);
      return;
    }

    // Traditional API submission
    const response = await fetch(`${API_BASE_URL}/api/moods`, {
=======
    const res = await fetch(`${API_BASE_URL}/api/moods`, {
>>>>>>> 74d17279f63b48d08bed459a8caf08f582ab6fcc:srcMTapp/services/api.ts
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(entry),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(
        `Failed to submit mood entry: ${res.status} ${JSON.stringify(err)}`
      );
    }

<<<<<<< HEAD:kiosk-srcMTapp/services/api.ts
    const data = await response.json();
    console.log('Mood entry submitted successfully to API:', data);
=======
    const data = await res.json().catch(() => ({}));
    console.log('Mood entry submitted successfully:', data);
>>>>>>> 74d17279f63b48d08bed459a8caf08f582ab6fcc:srcMTapp/services/api.ts
  } catch (error) {
    console.error('Error submitting mood entry:', error);
    saveToLocalStorage(entry);
    throw error;
  }
}

/** Local backup if the POST fails (helps you re-send later) */
function saveToLocalStorage(entry: SubmitMoodPayload): void {
  try {
    const existing = localStorage.getItem('mood_entries_backup') || '[]';
    const entries = JSON.parse(existing);
    entries.push(entry);
    localStorage.setItem('mood_entries_backup', JSON.stringify(entries));
    console.log('Mood entry saved to localStorage as backup');
  } catch (error) {
    console.error('Error saving to localStorage:', error);
  }
}

/** Optional quick health check for your server from the kiosk */
export async function pingServer(): Promise<boolean> {
  try {
    const res = await fetch(`${API_BASE_URL}/api/health`);
    return res.ok;
  } catch {
    return false;
  }
}
