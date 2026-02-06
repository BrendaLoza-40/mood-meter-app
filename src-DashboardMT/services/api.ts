/**
 * API service for Dashboard (Supabase-backed)
 */

import { supabase } from "./supabaseClient";

/**
 * Interface for a mood entry object (matches dashboard expectations)
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

  l1Category?: 'high_energy_pleasant' | 'high_energy_unpleasant' | 'low_energy_pleasant' | 'low_energy_unpleasant';
  responseTime?: number;   // ms
  intensity?: number; 

  deviceId?: string;
  locationName?: string;

}

function toL1Category(quadrant: any): 'high_energy_pleasant' | 'high_energy_unpleasant' | 'low_energy_pleasant' | 'low_energy_unpleasant' {
  const q = String(quadrant ?? '').toLowerCase();

  if (q === 'high-pleasant' || q === 'high_pleasant') return 'high_energy_pleasant';
  if (q === 'high-unpleasant' || q === 'high_unpleasant') return 'high_energy_unpleasant';
  if (q === 'low-pleasant' || q === 'low_pleasant') return 'low_energy_pleasant';
  if (q === 'low-unpleasant' || q === 'low_unpleasant') return 'low_energy_unpleasant';

  // fallback (won’t break charts)
  return 'high_energy_pleasant';
}

function mapRowToMoodEntry(row: any): MoodEntry {
  const createdAt = row.created_at ?? new Date().toISOString();
  const l1Category = toL1Category(row.quadrant);

  const responseTimeMs = Number(row.time_to_select_ms ?? 0);
  const intensity = Number(row.intensity ?? 5);

  const emotion = String(row.emotion ?? "").trim() || "Unknown";

  return {
    id: row.id,
    timestamp: createdAt,
    dateOnly: createdAt.slice(0, 10),

    deviceId: row.device_id,


    l1: { id: l1Category, label: l1Category },
    l2: { id: emotion, label: emotion },
    timeToSelectMs: Number.isFinite(responseTimeMs) ? responseTimeMs : 0,

    l1Category,
    responseTime: Number.isFinite(responseTimeMs) ? responseTimeMs : 0,
    intensity: Number.isFinite(intensity) ? intensity : 5,
  };
}


/**
 * Fetches all mood entries from Supabase
 */
export async function fetchMoodEntries(): Promise<MoodEntry[]> {
  try {
    const { data, error } = await supabase
      .from("mood_entries")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw error;

    // fetch kiosk locations
    const { data: kiosks, error: kiosksError } = await supabase
      .from("kiosks")
      .select("device_id, location_name");

    if (kiosksError) {
      console.warn("Could not fetch kiosks:", kiosksError);
    }

    const kioskMap = new Map<string, string>(
      (kiosks ?? []).map((k: any) => [k.device_id, k.location_name])
    );

    const mapped = (data ?? []).map((row: any) => {
      const entry = mapRowToMoodEntry(row);
      entry.locationName = kioskMap.get(row.device_id) ?? "Unknown location";
      return entry;
    });

    console.log(`Fetched ${mapped.length} mood entries from Supabase`);
    return mapped;
  } catch (error) {
    console.error("Error fetching mood entries:", error);
    return [];
  }
}

/**
 * Fetches mood entries and filters by date range
 */
export async function fetchMoodEntriesInRange(
  startDate?: Date,
  endDate?: Date
): Promise<MoodEntry[]> {
  const allEntries = await fetchMoodEntries();

  if (!startDate && !endDate) return allEntries;

  return allEntries.filter((entry) => {
    const entryDate = new Date(entry.dateOnly);
    const afterStart = !startDate || entryDate >= startDate;
    const beforeEnd = !endDate || entryDate <= endDate;
    return afterStart && beforeEnd;
  });
}

// ===== Locations (for Admin tab) =====

export interface LocationRow {
  id: string;
  name: string;
  active: boolean;
  created_at?: string;
}

export async function fetchLocations(): Promise<LocationRow[]> {
  const { data, error } = await supabase
    .from("locations")
    .select("*")
    .order("created_at", { ascending: true });

  if (error) {
    console.error("fetchLocations error:", error);
    return [];
  }
  return (data ?? []) as LocationRow[];
}

export async function createLocation(name: string) {
  const trimmed = name.trim();
  if (!trimmed) throw new Error("Location name required");

  const { data, error } = await supabase
    .from("locations")
    .insert({ name: trimmed, active: true })
    .select("*")
    .single();

  if (error) throw error;
  return data;
}

export async function setLocationActive(locationId: string, active: boolean) {
  const { data, error } = await supabase
    .from("locations")
    .update({ active })
    .eq("id", locationId)
    .select("*")
    .single();

  if (error) throw error;
  return data;
}

