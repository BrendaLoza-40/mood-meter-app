const API_BASE_URL =
  (import.meta as any).env?.VITE_API_BASE_URL ?? "http://localhost:4000";

export type LocationRow = {
  id: string;
  name: string;
  active: boolean;
  created_at: string;
};

export async function fetchLocations(): Promise<LocationRow[]> {
  const res = await fetch(`${API_BASE_URL}/api/locations`);
  if (!res.ok) throw new Error("Failed to fetch locations");
  return res.json();
}
