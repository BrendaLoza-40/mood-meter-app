/**
 * Realtime subscription service for mood data
 * Listens to Supabase Realtime changes on the 'moods' table
 */

import { supabase } from './supabase';
import type { MoodEntry as DashboardMoodEntry } from '../utils/mockMoodData';

type RealtimeCallback = (newEntry: DashboardMoodEntry, allEntries: DashboardMoodEntry[]) => void;

/**
 * Subscribe to realtime changes on the moods table
 * @param onNewEntry - Callback when a new mood entry is inserted
 * @param onUpdate - Callback when data is updated (optional)
 * @returns Cleanup function to unsubscribe
 */
export function subscribeToMoodsRealtime(
  onNewEntry: RealtimeCallback,
  onUpdate?: (allEntries: DashboardMoodEntry[]) => void
): () => void {
  // First, fetch all existing data
  let currentEntries: DashboardMoodEntry[] = [];

  // Transform DB row to dashboard format (same as api.ts)
  function transformRow(row: any): DashboardMoodEntry {
    const l1Id = row.l1_id ?? row.l1?.id ?? '';
    const l2Label = row.l2_label ?? row.l2?.label ?? 'Emotion';
    const timestamp = row.client_timestamp ?? row.created_at ?? new Date().toISOString();

    // Normalize L1 category (same logic as api.ts)
    let l1Category: 'high_energy_pleasant' | 'high_energy_unpleasant' | 'low_energy_pleasant' | 'low_energy_unpleasant';
    const s = l1Id.toLowerCase();
    if (s.includes('high') && s.includes('pleasant')) l1Category = 'high_energy_pleasant';
    else if (s.includes('high') && s.includes('unpleasant')) l1Category = 'high_energy_unpleasant';
    else if (s.includes('low') && s.includes('unpleasant')) l1Category = 'low_energy_unpleasant';
    else if (s.includes('low') && s.includes('pleasant')) l1Category = 'low_energy_pleasant';
    else l1Category = 'high_energy_pleasant';

    // Generate pseudo student name (same as api.ts)
    const pool = [
      'Emma Wilson', 'Liam Chen', 'Olivia Brown', 'Noah Martinez', 'Ava Garcia',
      'Ethan Davis', 'Sophia Anderson', 'Mason Taylor', 'Isabella Thomas', 'Lucas Jackson'
    ];
    let h = 0;
    const seed = row.id ?? `${l1Category}-${l2Label}`;
    for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) >>> 0;

    return {
      id: row.id ?? `row-${Date.now()}`,
      studentName: pool[h % pool.length],
      l1Category,
      l2Emotion: l2Label,
      timestamp: new Date(timestamp),
      intensity: 5, // placeholder
      responseTime: Number(row.time_to_select_ms ?? 0),
    };
  }

  // Initial fetch
  async function loadInitialData() {
    try {
      const { data, error } = await supabase
        .from('moods')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error loading initial moods:', error);
        return;
      }

      currentEntries = (data ?? []).map(transformRow);
      if (onUpdate) onUpdate(currentEntries);
    } catch (error) {
      console.error('Failed to load initial moods:', error);
    }
  }

  // Load initial data
  loadInitialData();

  // Subscribe to INSERT events
  const channel = supabase
    .channel('moods-changes')
    .on(
      'postgres_changes',
      {
        event: 'INSERT',
        schema: 'public',
        table: 'moods',
      },
      (payload) => {
        console.log('🆕 New mood entry received:', payload.new);
        const newEntry = transformRow(payload.new);
        currentEntries = [newEntry, ...currentEntries]; // Add to front
        onNewEntry(newEntry, currentEntries);
        if (onUpdate) onUpdate(currentEntries);
      }
    )
    .on(
      'postgres_changes',
      {
        event: 'UPDATE',
        schema: 'public',
        table: 'moods',
      },
      () => {
        // On update, refetch all to ensure consistency
        loadInitialData();
      }
    )
    .subscribe((status) => {
      if (status === 'SUBSCRIBED') {
        console.log('✅ Subscribed to realtime mood updates');
      } else if (status === 'CHANNEL_ERROR') {
        console.error('❌ Realtime subscription error');
      }
    });

  // Return cleanup function
  return () => {
    console.log('🔌 Unsubscribing from realtime updates');
    supabase.removeChannel(channel);
  };
}

