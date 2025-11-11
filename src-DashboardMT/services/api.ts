/**
 * Dashboard API adapter
 * - Fetches raw rows from the backend (/api/moods)
 * - Maps them into the dashboard's expected MoodEntry shape
 */

// Base URL (can be overridden via Vite env)
const API_BASE_URL =
  (import.meta as any).env?.VITE_API_BASE_URL ?? 'http://localhost:4001';
console.log('[Dashboard] API_BASE_URL =', API_BASE_URL);


// ⬇️ Import the type the dashboard expects
import type {
  MoodEntry as DashboardMoodEntry,
  L1Category,
} from '../utils/mockMoodData';

/** Raw shape returned by the server's /api/moods endpoint */
export interface ApiMoodEntry {
  id?: string;
  timestamp?: string;         // ISO (created_at/client ts)
  dateOnly?: string;          // 'YYYY-MM-DD'
  l1?: { id?: string; label?: string };
  l2?: { id?: string; label?: string };
  timeToSelectMs?: number;    // ms
}

/* --------------------------- helpers --------------------------- */

function normalizeL1(idOrLabel: string | undefined): L1Category {
  const s = (idOrLabel ?? '').toLowerCase();

  // handle id or label text
  if (s.includes('high') && s.includes('pleasant')) return 'high_energy_pleasant';
  if (s.includes('high') && s.includes('unpleasant')) return 'high_energy_unpleasant';
  if (s.includes('low')  && s.includes('unpleasant')) return 'low_energy_unpleasant';
  if (s.includes('low')  && s.includes('pleasant'))  return 'low_energy_pleasant';

  // exact id styles
  switch (s) {
    case 'high-pleasant':    return 'high_energy_pleasant';
    case 'high-unpleasant':  return 'high_energy_unpleasant';
    case 'low-unpleasant':   return 'low_energy_unpleasant';
    case 'low-pleasant':     return 'low_energy_pleasant';
    default:                 return 'high_energy_pleasant';
  }
}

// simple deterministic name so charts have something to show
function pseudoStudentName(seed: string): string {
  const pool = [
    'Emma Wilson','Liam Chen','Olivia Brown','Noah Martinez','Ava Garcia',
    'Ethan Davis','Sophia Anderson','Mason Taylor','Isabella Thomas','Lucas Jackson'
  ];
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) >>> 0;
  return pool[h % pool.length];
}

/* ---------------------- raw fetch (kept) ----------------------- */

export async function fetchMoodEntries(): Promise<ApiMoodEntry[]> {
  try {
    const res = await fetch(`${API_BASE_URL}/api/moods`);
    if (!res.ok) throw new Error(`Failed to fetch mood entries: ${res.statusText}`);
    const data = await res.json();
    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.error('Error fetching mood entries:', error);
    return [];
  }
}

/* ------------- normalized fetch for dashboard charts ------------ */
/** Returns EXACTLY the shape used by mockMoodData + components. */
export async function fetchDashboardMoods(): Promise<DashboardMoodEntry[]> {
  const raw = await fetchMoodEntries();

  return raw.map((e, i) => {
    const l1Category = normalizeL1(e?.l1?.id ?? e?.l1?.label);
    const l2Emotion = e?.l2?.label ?? e?.l2?.id ?? 'Emotion';
    const ts = e?.timestamp ?? e?.dateOnly ?? new Date().toISOString();

    return {
      id: e.id ?? `row-${i}`,
      studentName: pseudoStudentName(e.id ?? `${i}-${l1Category}-${l2Emotion}`),
      l1Category,
      l2Emotion,
      timestamp: new Date(ts),                     // <-- Date object (required)
      intensity: 5,                                // placeholder until you collect it
      responseTime: Number(e.timeToSelectMs ?? 0), // ms
    };
  });
}

/* ------------------ optional date-range helper ------------------ */
export async function fetchMoodEntriesInRange(
  startDate?: Date,
  endDate?: Date
): Promise<ApiMoodEntry[]> {
  const all = await fetchMoodEntries();
  if (!startDate && !endDate) return all;

  return all.filter((entry) => {
    const entryDate = new Date(entry.dateOnly ?? entry.timestamp ?? '');
    if (Number.isNaN(entryDate.getTime())) return false;
    const afterStart = !startDate || entryDate >= startDate;
    const beforeEnd = !endDate || entryDate <= endDate;
    return afterStart && beforeEnd;
  });
}
