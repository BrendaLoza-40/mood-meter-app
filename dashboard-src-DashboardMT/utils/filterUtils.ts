// Utility functions for filtering mood data by location and other criteria

import { MoodEntry } from './mockMoodData';

export function filterByLocation(entries: MoodEntry[], locationId: string | 'all'): MoodEntry[] {
  if (locationId === 'all') {
    return entries;
  }
  
  return entries.filter(entry => entry.locationId === locationId);
}

export function getLocationStats(entries: MoodEntry[]): Record<string, number> {
  const stats: Record<string, number> = {};
  
  entries.forEach(entry => {
    if (entry.locationId) {
      stats[entry.locationId] = (stats[entry.locationId] || 0) + 1;
    }
  });
  
  return stats;
}
