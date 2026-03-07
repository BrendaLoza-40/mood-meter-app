import { useEffect, useMemo, useState } from "react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Switch } from "./ui/switch";
import { Label } from "./ui/label";

import { createLocation, fetchLocations, setLocationActive, type LocationRow } from "../services/api";

export function LocationsAdmin() {
  const [locations, setLocations] = useState<LocationRow[]>([]);
  const [name, setName] = useState("");
  const [showInactive, setShowInactive] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function reload() {
    const list = await fetchLocations();
    setLocations(list);
  }

  useEffect(() => {
    reload();
  }, []);

  const visible = useMemo(() => {
    return showInactive ? locations : locations.filter((l) => l.active);
  }, [locations, showInactive]);

  return (
    <Card className="p-6 space-y-5">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h3 className="text-lg font-semibold">Locations</h3>
          <p className="text-sm text-muted-foreground">
            Add, disable, and manage locations used by kiosk setup dropdowns.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Switch id="showInactive" checked={showInactive} onCheckedChange={setShowInactive} />
          <Label htmlFor="showInactive">Show inactive</Label>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-3">
        <Input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="New location name (e.g., Library)"
        />
        <Button
          disabled={saving || name.trim().length === 0}
          onClick={async () => {
            setSaving(true);
            setError(null);
            try {
              await createLocation(name);
              setName("");
              await reload();
            } catch (e: any) {
              console.error(e);
              setError(e?.message ?? "Failed to create location");
            } finally {
              setSaving(false);
            }
          }}
        >
          {saving ? "Adding..." : "Add location"}
        </Button>

        <Button variant="secondary" onClick={reload}>
          Refresh
        </Button>
      </div>

      {error && <div className="text-sm text-red-600">{error}</div>}

      <div className="border rounded-lg overflow-hidden">
        <div className="grid grid-cols-12 gap-2 px-3 py-2 bg-muted text-sm font-medium">
          <div className="col-span-6">Name</div>
          <div className="col-span-3">Status</div>
          <div className="col-span-3 text-right">Actions</div>
        </div>

        {visible.length === 0 ? (
          <div className="px-3 py-4 text-sm text-muted-foreground">No locations yet.</div>
        ) : (
          visible.map((loc) => (
            <div key={loc.id} className="grid grid-cols-12 gap-2 px-3 py-3 border-t items-center">
              <div className="col-span-6">{loc.name}</div>
              <div className="col-span-3">
                <span className={loc.active ? "text-green-600" : "text-muted-foreground"}>
                  {loc.active ? "Active" : "Inactive"}
                </span>
              </div>
              <div className="col-span-3 flex justify-end gap-2">
                {loc.active ? (
                  <Button
                    variant="destructive"
                    onClick={async () => {
                      setError(null);
                      try {
                        await setLocationActive(loc.id, false);
                        await reload();
                      } catch (e: any) {
                        console.error(e);
                        setError(e?.message ?? "Failed to disable location");
                      }
                    }}
                  >
                    Disable
                  </Button>
                ) : (
                  <Button
                    onClick={async () => {
                      setError(null);
                      try {
                        await setLocationActive(loc.id, true);
                        await reload();
                      } catch (e: any) {
                        console.error(e);
                        setError(e?.message ?? "Failed to enable location");
                      }
                    }}
                  >
                    Enable
                  </Button>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </Card>
  );
}
