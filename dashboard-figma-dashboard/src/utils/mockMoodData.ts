// Mock mood data generator for the dashboard with updated emotion structure

import { emotions } from './emotions';
import { L1Category, L2_EMOTIONS, getRandomL2Emotion, L1_LABELS } from './emotionCategories';

export type { L1Category } from './emotionCategories';

export interface MoodEntry {
  id: string;
  l1Category: L1Category;
  l2Emotion: string;
  emotion: string; // Direct emotion name from new structure
  quadrant: 'high-pleasant' | 'high-unpleasant' | 'low-unpleasant' | 'low-pleasant'; // New quadrant mapping
  timestamp: Date;
  intensity: number; // 1-10
  responseTime: number; // milliseconds to select emotion
  themePreference?: 'day' | 'dark' | 'lightblue' | 'yellow'; // Updated theme options to match mood app
  locationId?: string; // Track which kiosk location was used
}

export interface AggregatedMoodData {
  date: string;
  high_energy_pleasant: number;
  high_energy_unpleasant: number;
  low_energy_unpleasant: number;
  low_energy_pleasant: number;
  total: number;
}

export interface L2AggregatedData {
  emotion: string;
  count: number;
  l1Category: L1Category;
  avgResponseTime: number;
}

// Mapping between L1 categories and new quadrant structure
const l1ToQuadrantMap: Record<L1Category, 'high-pleasant' | 'high-unpleasant' | 'low-unpleasant' | 'low-pleasant'> = {
  'high_energy_pleasant': 'high-pleasant',
  'high_energy_unpleasant': 'high-unpleasant',
  'low_energy_unpleasant': 'low-unpleasant',
  'low_energy_pleasant': 'low-pleasant'
};

function getRandomEmotionFromQuadrant(quadrant: 'high-pleasant' | 'high-unpleasant' | 'low-unpleasant' | 'low-pleasant'): string {
  const emotionList = emotions[quadrant];
  return emotionList[Math.floor(Math.random() * emotionList.length)];
}

const l1Categories: L1Category[] = [
  'high_energy_pleasant',
  'high_energy_unpleasant', 
  'low_energy_unpleasant',
  'low_energy_pleasant'
];

function getRandomL1Category(): L1Category {
  // Weighted distribution - more pleasant moods
  const weights = [0.35, 0.15, 0.15, 0.35]; // Pleasant moods more common
  const random = Math.random();
  let sum = 0;
  
  for (let i = 0; i < l1Categories.length; i++) {
    sum += weights[i];
    if (random < sum) return l1Categories[i];
  }
  
  return 'high_energy_pleasant';
}

function generateResponseTime(l1Category: L1Category): number {
  // Pleasant emotions are selected faster, unpleasant take longer (student reflection)
  const baseTime = l1Category.includes('pleasant') ? 2000 : 3500;
  const variance = Math.random() * 2000;
  return Math.floor(baseTime + variance);
}

function generateMoodEntriesForDate(date: Date, count: number): MoodEntry[] {
  const entries: MoodEntry[] = [];
  
  // Possible location IDs from default config
  const locationIds = ['1', '2', '3', '4', '5'];
  
  for (let i = 0; i < count; i++) {
    const hour = Math.floor(Math.random() * 8) + 8; // Between 8am and 4pm
    const minute = Math.floor(Math.random() * 60);
    const timestamp = new Date(date);
    timestamp.setHours(hour, minute, 0, 0);
    
    const l1Category = getRandomL1Category();
    const l2Emotion = getRandomL2Emotion(l1Category);
    
    // 60% prefer light theme, 40% prefer dark theme
    const themePreference = Math.random() < 0.4 ? 'day' : Math.random() < 0.3 ? 'lightblue' : Math.random() < 0.2 ? 'yellow' : 'dark';
    
    // Random location selection
    const locationId = locationIds[Math.floor(Math.random() * locationIds.length)];
    
    // Map L1 category to quadrant and get corresponding emotion
    const quadrant = l1ToQuadrantMap[l1Category];
    const emotion = getRandomEmotionFromQuadrant(quadrant);
    
    entries.push({
      id: `${date.getTime()}-${i}`,
      l1Category,
      l2Emotion,
      emotion,
      quadrant,
      timestamp,
      intensity: Math.floor(Math.random() * 5) + 6, // 6-10 for more positive skew
      responseTime: generateResponseTime(l1Category),
      themePreference,
      locationId
    });
  }
  
  return entries;
}

export function generateMockData(period: 'day' | 'week' | 'month' | 'year' | 'custom', customDays?: number): MoodEntry[] {
  const now = new Date();
  const entries: MoodEntry[] = [];
  
  let daysToGenerate = 0;
  let entriesPerDay = 15;
  
  switch (period) {
    case 'day':
      daysToGenerate = 1;
      entriesPerDay = 15;
      break;
    case 'week':
      daysToGenerate = 7;
      entriesPerDay = 12;
      break;
    case 'month':
      daysToGenerate = 30;
      entriesPerDay = 10;
      break;
    case 'year':
      daysToGenerate = 365;
      entriesPerDay = 8;
      break;
    case 'custom':
      daysToGenerate = customDays || 7;
      entriesPerDay = 12;
      break;
  }
  
  for (let i = 0; i < daysToGenerate; i++) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    entries.push(...generateMoodEntriesForDate(date, entriesPerDay));
  }
  
  return entries;
}

export function generateMockDataForDateRange(startDate: Date, endDate: Date): MoodEntry[] {
  const entries: MoodEntry[] = [];
  const currentDate = new Date(startDate);
  
  while (currentDate <= endDate) {
    entries.push(...generateMoodEntriesForDate(new Date(currentDate), 12));
    currentDate.setDate(currentDate.getDate() + 1);
  }
  
  return entries;
}

export function filterDataByDate(entries: MoodEntry[], targetDate: Date): MoodEntry[] {
  return entries.filter(entry => {
    const entryDate = new Date(entry.timestamp);
    return (
      entryDate.getFullYear() === targetDate.getFullYear() &&
      entryDate.getMonth() === targetDate.getMonth() &&
      entryDate.getDate() === targetDate.getDate()
    );
  });
}

export function aggregateMoodData(
  entries: MoodEntry[],
  period: 'day' | 'week' | 'month' | 'year'
): AggregatedMoodData[] {
  const groupedData = new Map<string, Record<L1Category, number> & { total: number }>();
  
  entries.forEach(entry => {
    let dateKey: string;
    const date = new Date(entry.timestamp);
    
    switch (period) {
      case 'day':
        dateKey = `${date.getHours()}:00`;
        break;
      case 'week':
        const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        dateKey = weekdays[date.getDay()];
        break;
      case 'month':
        dateKey = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        break;
      case 'year':
        dateKey = date.toLocaleDateString('en-US', { month: 'short' });
        break;
    }
    
    if (!groupedData.has(dateKey)) {
      groupedData.set(dateKey, {
        high_energy_pleasant: 0,
        high_energy_unpleasant: 0,
        low_energy_unpleasant: 0,
        low_energy_pleasant: 0,
        total: 0
      });
    }
    
    const data = groupedData.get(dateKey)!;
    data[entry.l1Category]++;
    data.total++;
  });
  
  return Array.from(groupedData.entries()).map(([date, counts]) => ({
    date,
    ...counts
  }));
}

export function aggregateL2Emotions(entries: MoodEntry[]): L2AggregatedData[] {
  const emotionMap = new Map<string, { count: number; totalResponseTime: number; l1Category: L1Category }>();
  
  entries.forEach(entry => {
    if (!emotionMap.has(entry.l2Emotion)) {
      emotionMap.set(entry.l2Emotion, {
        count: 0,
        totalResponseTime: 0,
        l1Category: entry.l1Category
      });
    }
    
    const data = emotionMap.get(entry.l2Emotion)!;
    data.count++;
    data.totalResponseTime += entry.responseTime;
  });
  
  return Array.from(emotionMap.entries())
    .map(([emotion, data]) => ({
      emotion,
      count: data.count,
      l1Category: data.l1Category,
      avgResponseTime: Math.round(data.totalResponseTime / data.count)
    }))
    .sort((a, b) => b.count - a.count);
}

export function getMoodStats(entries: MoodEntry[]) {
  const l1Counts: Record<L1Category, number> = {
    high_energy_pleasant: 0,
    high_energy_unpleasant: 0,
    low_energy_unpleasant: 0,
    low_energy_pleasant: 0
  };
  
  let totalResponseTime = 0;
  let lightThemeCount = 0;
  let darkThemeCount = 0;
  
  entries.forEach(entry => {
    l1Counts[entry.l1Category]++;
    totalResponseTime += entry.responseTime;
    
    if (entry.themePreference === 'day' || entry.themePreference === 'lightblue' || entry.themePreference === 'yellow') {
      lightThemeCount++;
    } else if (entry.themePreference === 'dark') {
      darkThemeCount++;
    }
  });
  
  const total = entries.length;
  const averageIntensity = entries.reduce((sum, e) => sum + e.intensity, 0) / total;
  const avgResponseTime = totalResponseTime / total;
  
  return {
    l1Counts,
    total,
    averageIntensity,
    avgResponseTime,
    lightThemeCount,
    darkThemeCount,
    percentages: {
      high_energy_pleasant: Math.round((l1Counts.high_energy_pleasant / total) * 100),
      high_energy_unpleasant: Math.round((l1Counts.high_energy_unpleasant / total) * 100),
      low_energy_unpleasant: Math.round((l1Counts.low_energy_unpleasant / total) * 100),
      low_energy_pleasant: Math.round((l1Counts.low_energy_pleasant / total) * 100)
    }
  };
}
