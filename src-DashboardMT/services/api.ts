/**
 * API service for Dashboard
 * Handles fetching mood data from the backend API
 */

// Backend API base URL - can be overridden via Vite env (VITE_API_BASE_URL)
const API_BASE_URL = (import.meta as any).env?.VITE_API_BASE_URL ?? 'http://localhost:4000';

/**
 * Interface for a mood entry object (matches backend format)
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
 * Fetches all mood entries from the backend API
 * @returns Promise that resolves to an array of mood entries
 */
export async function fetchMoodEntries(): Promise<MoodEntry[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/moods`);

    if (!response.ok) {
      throw new Error(`Failed to fetch mood entries: ${response.statusText}`);
    }

    const data = await response.json();
    console.log(`Fetched ${data.length} mood entries from API`);
    return data;
  } catch (error) {
    console.error('Error fetching mood entries:', error);
    // Return empty array if API fails
    return [];
  }
}

/**
 * Fetches mood entries and filters by date range
 * @param startDate - Start date for filtering (optional)
 * @param endDate - End date for filtering (optional)
 * @returns Promise that resolves to filtered mood entries
 */
export async function fetchMoodEntriesInRange(
  startDate?: Date,
  endDate?: Date
): Promise<MoodEntry[]> {
  const allEntries = await fetchMoodEntries();

  if (!startDate && !endDate) {
    return allEntries;
  }

  return allEntries.filter((entry) => {
    const entryDate = new Date(entry.dateOnly);
    const afterStart = !startDate || entryDate >= startDate;
    const beforeEnd = !endDate || entryDate <= endDate;
    return afterStart && beforeEnd;
  });
}
