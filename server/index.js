// Import required dependencies
import express from 'express';
import cors from 'cors';  // Enables cross-origin requests from frontend apps
import bodyParser from 'body-parser';  // Parses JSON request bodies
import moodsRouter from './routes/moods.js';  // Import mood data routes
import dotenv from "dotenv";
import { createClient } from "@supabase/supabase-js";

dotenv.config();

// Initialize Express application
const app = express();

// Set server port (use environment variable or default to 4000)
const PORT = process.env.PORT || 4000;

// Middleware setup
app.use(cors());  // Allow requests from React apps running on different ports
app.use(bodyParser.json());  // Parse incoming JSON payloads

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  console.error("Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in server/.env");
}

const supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

function requireAdmin(req, res, next) {
  const expected = process.env.ADMIN_DASHBOARD_PASSWORD;
  const provided = req.header("x-admin-password");

  if (!expected) return res.status(500).json({ error: "ADMIN_DASHBOARD_PASSWORD not set" });
  if (!provided || provided !== expected) return res.status(401).json({ error: "Unauthorized" });

  next();
}


// Mount the moods API routes at /api/moods
// All mood-related endpoints will be prefixed with /api/moods
app.use('/api/moods', moodsRouter);

// Root endpoint to verify server is running
app.get('/', (req, res) => {
  res.send('Mood Meter API is running.');
});

// Public: list active locations (kiosk + dashboard)
app.get("/api/locations", async (req, res) => {
  try {
    const { data, error } = await supabaseAdmin
      .from("locations")
      .select("id,name,active,created_at")
      .eq("active", true)
      .order("name", { ascending: true });

    if (error) throw error;
    res.json(data ?? []);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Failed to fetch locations" });
  }
});

// Admin: login test (dashboard uses this)
app.post("/api/admin/login", requireAdmin, (req, res) => {
  res.json({ ok: true });
});

// Admin: create location
app.post("/api/admin/locations", requireAdmin, async (req, res) => {
  try {
    const name = String(req.body?.name ?? "").trim();
    if (!name) return res.status(400).json({ error: "name is required" });

    const { data, error } = await supabaseAdmin
      .from("locations")
      .insert({ name, active: true })
      .select("id,name,active,created_at")
      .single();

    if (error) throw error;
    res.json(data);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Failed to create location" });
  }
});

// Admin: update location (rename / activate)
app.patch("/api/admin/locations/:id", requireAdmin, async (req, res) => {
  try {
    const id = req.params.id;
    const patch = {};
    if (req.body?.name !== undefined) patch.name = String(req.body.name).trim();
    if (req.body?.active !== undefined) patch.active = !!req.body.active;

    const { data, error } = await supabaseAdmin
      .from("locations")
      .update(patch)
      .eq("id", id)
      .select("id,name,active,created_at")
      .single();

    if (error) throw error;
    res.json(data);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Failed to update location" });
  }
});

// Admin: delete location
app.delete("/api/admin/locations/:id", requireAdmin, async (req, res) => {
  try {
    const id = req.params.id;
    const { error } = await supabaseAdmin.from("locations").delete().eq("id", id);
    if (error) throw error;
    res.json({ ok: true });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Failed to delete location" });
  }
});

// Admin: assign kiosk -> location
app.patch("/api/admin/kiosks/:deviceId", requireAdmin, async (req, res) => {
  try {
    const deviceId = req.params.deviceId;
    const locationId = String(req.body?.location_id ?? "").trim();
    if (!locationId) return res.status(400).json({ error: "location_id is required" });

    const { data, error } = await supabaseAdmin
      .from("kiosks")
      .upsert({ device_id: deviceId, location_id: locationId })
      .select("device_id, location_id")
      .single();

    if (error) throw error;
    res.json(data);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Failed to assign kiosk" });
  }
});


// Start the server and listen on the specified port
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
