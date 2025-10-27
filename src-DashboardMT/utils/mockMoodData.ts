// Mock mood data generator for the dashboard with L1/L2 emotion structure

import { L1Category, L2_EMOTIONS, getRandomL2Emotion, L1_LABELS } from './emotionCategories';

export type { L1Category } from './emotionCategories';

export interface MoodEntry {
  id: string;
  studentName: string;
  l1Category: L1Category;
  l2Emotion: string;
  timestamp: Date;
  intensity: number; // 1-10
  responseTime: number; // milliseconds to select emotion
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

const l1Categories: L1Category[] = [
  'high_energy_pleasant',
  'high_energy_unpleasant', 
  'low_energy_unpleasant',
  'low_energy_pleasant'
];

const studentNames = [
  'Emma Wilson', 'Liam Chen', 'Olivia Brown', 'Noah Martinez', 'Ava Garcia',
  'Ethan Davis', 'Sophia Anderson', 'Mason Taylor', 'Isabella Thomas', 'Lucas Jackson',
  'Mia White', 'Aiden Harris', 'Charlotte Martin', 'Jackson Lee', 'Amelia Thompson',
  'James Kim', 'Emily Rodriguez', 'Benjamin Park', 'Harper Singh', 'Alexander Wong'
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
  
  for (let i = 0; i < count; i++) {
    const hour = Math.floor(Math.random() * 8) + 8; // Between 8am and 4pm
    const minute = Math.floor(Math.random() * 60);
    const timestamp = new Date(date);
    timestamp.setHours(hour, minute, 0, 0);
    
    const l1Category = getRandomL1Category();
    const l2Emotion = getRandomL2Emotion(l1Category);
    
    entries.push({
      id: `${date.getTime()}-${i}`,
      studentName: studentNames[Math.floor(Math.random() * studentNames.length)],
      l1Category,
      l2Emotion,
      timestamp,
      intensity: Math.floor(Math.random() * 5) + 6, // 6-10 for more positive skew
      responseTime: generateResponseTime(l1Category)
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
  
  entries.forEach(entry => {
    l1Counts[entry.l1Category]++;
    totalResponseTime += entry.responseTime;
  });
  
  const total = entries.length;
  const averageIntensity = entries.reduce((sum, e) => sum + e.intensity, 0) / total;
  const avgResponseTime = totalResponseTime / total;
  
  return {
    l1Counts,
    total,
    averageIntensity,
    avgResponseTime,
    percentages: {
      high_energy_pleasant: Math.round((l1Counts.high_energy_pleasant / total) * 100),
      high_energy_unpleasant: Math.round((l1Counts.high_energy_unpleasant / total) * 100),
      low_energy_unpleasant: Math.round((l1Counts.low_energy_unpleasant / total) * 100),
      low_energy_pleasant: Math.round((l1Counts.low_energy_pleasant / total) * 100)
    }
  };
}
