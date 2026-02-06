export function getDeviceId() {
  const key = "moodmeter_device_id";
  let id = localStorage.getItem(key);
  if (!id) {
    // temporary simple id for now
    id = crypto.randomUUID();
    localStorage.setItem(key, id);
  }
  return id;
}
