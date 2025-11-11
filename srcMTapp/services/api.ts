/**
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
 */
export async function submitMoodEntry(entry: SubmitMoodPayload): Promise<void> {
  try {
    const res = await fetch(`${API_BASE_URL}/api/moods`, {
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

    const data = await res.json().catch(() => ({}));
    console.log('Mood entry submitted successfully:', data);
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
