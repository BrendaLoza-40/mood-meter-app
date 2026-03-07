/**
 * Testing/demo mode: skip kiosk setup and server/Supabase; demo front-end only.
 * Can be enabled via env (VITE_TESTING_MODE=true), localStorage, or ?testing=1.
 */

const STORAGE_KEY = "moodMeterTestingMode";

function fromEnv(): boolean {
  return import.meta.env.VITE_TESTING_MODE === "true" || import.meta.env.VITE_TESTING_MODE === "1";
}

function fromStorage(): boolean {
  if (typeof window === "undefined") return false;
  return localStorage.getItem(STORAGE_KEY) === "true";
}

function fromSearch(): boolean {
  if (typeof window === "undefined") return false;
  return new URLSearchParams(window.location.search).get("testing") === "1";
}

/** Whether testing/demo mode is on (no setup, no Supabase insert). */
export function getTestingMode(): boolean {
  return fromEnv() || fromSearch() || fromStorage();
}

/** Set testing mode in localStorage (persists across reloads). */
export function setTestingMode(on: boolean): void {
  if (typeof window === "undefined") return;
  if (on) localStorage.setItem(STORAGE_KEY, "true");
  else localStorage.removeItem(STORAGE_KEY);
}
