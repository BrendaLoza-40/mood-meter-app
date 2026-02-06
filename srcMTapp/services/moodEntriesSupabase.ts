import { supabase } from "./supabaseClient";

export async function insertMoodEntry(args: {
  deviceId: string;
  quadrant: string;
  emotion: string;
  timeToSelectMs: number;
}) {
  const { error } = await supabase.from("mood_entries").insert({
    device_id: args.deviceId,
    quadrant: args.quadrant,
    emotion: args.emotion,
    time_to_select_ms: args.timeToSelectMs,
  });

  if (error) throw error;
}
