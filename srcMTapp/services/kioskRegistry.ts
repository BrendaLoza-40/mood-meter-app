import { supabase } from "./supabaseClient";

export async function getKioskLocation(deviceId: string): Promise<string | null> {
  const { data, error } = await supabase
    .from("kiosks")
    .select("location_name")
    .eq("device_id", deviceId)
    .maybeSingle();

  if (error) {
    console.error("getKioskLocation error:", error);
    return null;
  }

  return data?.location_name ?? null;
}

export async function upsertKioskLocationId(
  deviceId: string,
  locationId: string,
  locationName: string
) {
  const { error } = await supabase
    .from("kiosks")
    .upsert({
      device_id: deviceId,
      location_id: locationId,
      location_name: locationName.trim(), // ✅ required NOT NULL column
    });

  if (error) throw error;
}



export async function upsertKioskLocation(deviceId: string, locationName: string) {
  const { error } = await supabase.from("kiosks").upsert({
    device_id: deviceId,
    location_name: locationName.trim(),
  });

  if (error) throw error;
}

export type LocationRow = { id: string; name: string; active: boolean };

export async function fetchActiveLocations(): Promise<LocationRow[]> {
  const { data, error } = await supabase
    .from("locations")
    .select("id,name,active")
    .eq("active", true)
    .order("name", { ascending: true });

  if (error) {
    console.error("fetchActiveLocations error:", error);
    return [];
  }
  return (data ?? []) as LocationRow[];
}

