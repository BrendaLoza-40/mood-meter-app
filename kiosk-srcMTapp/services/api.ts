/**
 * API service for Mood Meter App
 * Handles communication with the backend API to submit mood entries
 */

// Backend API base URL - can be overridden via Vite env (VITE_API_BASE_URL)
const API_BASE_URL = (import.meta as any).env?.VITE_API_BASE_URL ?? 'http://localhost:4000';

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
 * Submits a mood entry to the backend API
 * @param entry - The mood entry data to submit
 * @returns Promise that resolves when the entry is successfully saved
 */
export async function submitMoodEntry(entry: MoodEntry): Promise<void> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/moods`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(entry),
    });

    if (!response.ok) {
      throw new Error(`Failed to submit mood entry: ${response.statusText}`);
    }

    const data = await response.json();
    console.log('Mood entry submitted successfully:', data);
  } catch (error) {
    console.error('Error submitting mood entry:', error);
    // Also save to localStorage as fallback
    saveToLocalStorage(entry);
    throw error;
  }
}

/**
 * Fallback function to save mood entry to localStorage if API fails
 * @param entry - The mood entry to save locally
 */
function saveToLocalStorage(entry: MoodEntry): void {
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
