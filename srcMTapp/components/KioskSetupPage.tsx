import { useEffect, useMemo, useState } from "react";
import { upsertKioskLocationId } from "../services/kioskRegistry";
import { getDeviceId } from "../services/deviceId";
import { fetchLocations, type LocationRow } from "../services/locationsApi";

type KioskSetupPageProps = {
  onDone: () => void;
  onUseDemoMode?: () => void;
};

export function KioskSetupPage({ onDone, onUseDemoMode }: KioskSetupPageProps) {
  const [locations, setLocations] = useState<LocationRow[]>([]);
  const [selectedLocationId, setSelectedLocationId] = useState<string>("");
  const [loading, setLoading] = useState(true);

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const selectedName = useMemo(() => {
    return locations.find((l) => l.id === selectedLocationId)?.name ?? "";
  }, [locations, selectedLocationId]);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        setLoading(true);
        const list = await fetchLocations();
        if (cancelled) return;

        setLocations(list);

        // auto-select the first location so it’s easy
        if (list.length > 0) setSelectedLocationId(list[0].id);
      } catch (e) {
        console.error(e);
        if (!cancelled) setError("Failed to load locations. Is the server running?");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div style={{ minHeight: "100vh", display: "grid", placeItems: "center", padding: 24 }}>
      <div style={{ width: "min(520px, 100%)", border: "1px solid #ddd", borderRadius: 12, padding: 20 }}>
        <h2 style={{ marginTop: 0 }}>Kiosk Setup</h2>

        <p style={{ marginTop: 8, color: "#555" }}>
          Select the location for this kiosk.
        </p>

        <label style={{ display: "block", marginTop: 16, marginBottom: 6 }}>Location</label>

        {loading ? (
          <div style={{ padding: 12, borderRadius: 8, border: "1px solid #ccc", color: "#555" }}>
            Loading locations...
          </div>
        ) : locations.length === 0 ? (
          <div style={{ padding: 12, borderRadius: 8, border: "1px solid #ccc", color: "crimson" }}>
            No locations found. Add one in the dashboard first.
          </div>
        ) : (
          <select
            value={selectedLocationId}
            onChange={(e) => setSelectedLocationId(e.target.value)}
            style={{ width: "100%", padding: 12, borderRadius: 8, border: "1px solid #ccc" }}
          >
            {locations.map((loc) => (
              <option key={loc.id} value={loc.id}>
                {loc.name}
              </option>
            ))}
          </select>
        )}

        {selectedName && (
          <p style={{ marginTop: 10, color: "#555" }}>
            Selected: <b>{selectedName}</b>
          </p>
        )}

        {error && <p style={{ color: "crimson", marginTop: 10 }}>{error}</p>}

        {onUseDemoMode && (
          <p style={{ marginTop: 16, marginBottom: 0 }}>
            <button
              type="button"
              onClick={onUseDemoMode}
              style={{
                background: "none",
                border: "none",
                color: "#2563eb",
                textDecoration: "underline",
                cursor: "pointer",
                fontSize: 14,
                padding: 0,
              }}
            >
              Use demo mode (no server or location required)
            </button>
          </p>
        )}

        <button
          disabled={saving || loading || locations.length === 0 || !selectedLocationId}
          onClick={async () => {
            setSaving(true);
            setError(null);
            try {
              await upsertKioskLocationId(getDeviceId(), selectedLocationId, selectedName);
              onDone();
            } catch (e) {
              console.error(e);
              setError("Failed to save kiosk location. Check your internet / Supabase settings.");
            } finally {
              setSaving(false);
            }
          }}
          style={{
            marginTop: 16,
            width: "100%",
            padding: 12,
            borderRadius: 10,
            border: "none",
            background: "#111",
            color: "white",
            fontSize: 16,
            cursor: "pointer",
            opacity: saving || loading || locations.length === 0 || !selectedLocationId ? 0.6 : 1,
          }}
        >
          {saving ? "Saving..." : "Save & Start"}
        </button>
      </div>
    </div>
  );
}
