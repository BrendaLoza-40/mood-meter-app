import { supabase } from "./supabaseClient";

export async function testInsert() {
  const { error } = await supabase.from("mood_entries").insert({
    device_id: "test-device",
    quadrant: "red",
    emotion: "angry",
    sub_emotion: "frustrated",
  });

  if (error) throw error;
}
