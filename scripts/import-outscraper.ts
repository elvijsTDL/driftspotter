/**
 * Import Outscraper Google Maps data into Supabase events table.
 *
 * Usage:
 *   npx tsx scripts/import-outscraper.ts <path-to-outscraper-json>
 *
 * The script expects Outscraper "Google Maps Search" JSON output.
 * Each record should have fields like: name, full_address, latitude, longitude,
 * site, phone, rating, reviews, place_id, etc.
 *
 * Requires env vars: NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY
 */

import { createClient } from "@supabase/supabase-js";
import * as fs from "fs";
import * as path from "path";

// Load .env.local
const envPath = path.resolve(__dirname, "../.env.local");
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, "utf-8");
  for (const line of envContent.split("\n")) {
    const match = line.match(/^([^#=]+)=(.*)$/);
    if (match) {
      process.env[match[1].trim()] = match[2].trim();
    }
  }
}

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
  console.error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local");
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

// ─── Country code mapping from Outscraper country names ───
const COUNTRY_MAP: Record<string, string> = {
  "united states": "US", "usa": "US", "us": "US",
  "united kingdom": "GB", "uk": "GB", "great britain": "GB", "england": "GB", "scotland": "GB", "wales": "GB",
  "germany": "DE", "france": "FR", "italy": "IT", "spain": "ES", "portugal": "PT",
  "netherlands": "NL", "belgium": "BE", "austria": "AT", "switzerland": "CH",
  "sweden": "SE", "norway": "NO", "denmark": "DK", "finland": "FI",
  "poland": "PL", "czech republic": "CZ", "czechia": "CZ",
  "hungary": "HU", "romania": "RO", "bulgaria": "BG", "croatia": "HR",
  "ireland": "IE", "lithuania": "LT", "latvia": "LV", "estonia": "EE",
  "japan": "JP", "australia": "AU", "canada": "CA", "new zealand": "NZ",
  "south africa": "ZA", "brazil": "BR", "mexico": "MX",
  "uae": "AE", "united arab emirates": "AE", "saudi arabia": "SA",
  "thailand": "TH", "malaysia": "MY", "china": "CN", "south korea": "KR",
  "greece": "GR", "turkey": "TR", "serbia": "RS", "slovakia": "SK", "slovenia": "SI",
};

function extractCountryCode(record: Record<string, unknown>): string {
  // Try country field directly
  const country = (record.country || record.country_code || "") as string;
  if (country.length === 2) return country.toUpperCase();
  const lower = country.toLowerCase().trim();
  if (COUNTRY_MAP[lower]) return COUNTRY_MAP[lower];

  // Try extracting from full_address (last part is usually the country)
  const addr = (record.full_address || record.address || "") as string;
  const parts = addr.split(",").map((s: string) => s.trim().toLowerCase());
  for (const part of parts.reverse()) {
    if (COUNTRY_MAP[part]) return COUNTRY_MAP[part];
    // Check for US states
    if (part.length === 2 && /^[a-z]{2}$/.test(part)) {
      // Could be a US state abbreviation in address
    }
  }

  return "";
}

function categorizePlace(record: Record<string, unknown>): string {
  const name = ((record.name || "") as string).toLowerCase();
  const types = ((record.types || record.type || "") as string).toLowerCase();
  const desc = ((record.description || record.about || "") as string).toLowerCase();
  const combined = `${name} ${types} ${desc}`;

  if (combined.includes("championship") || combined.includes("formula d") || combined.includes("d1 grand prix"))
    return "official";
  if (combined.includes("pro-am") || combined.includes("proam") || combined.includes("semi-pro"))
    return "proam";
  if (combined.includes("practice") || combined.includes("open track") || combined.includes("track day"))
    return "practice";
  return "grassroots";
}

interface OutscraperRecord {
  name?: string;
  full_address?: string;
  address?: string;
  latitude?: number;
  longitude?: number;
  site?: string;
  phone?: string;
  rating?: number;
  reviews?: number;
  reviews_count?: number;
  place_id?: string;
  country?: string;
  country_code?: string;
  types?: string;
  type?: string;
  description?: string;
  about?: string;
  [key: string]: unknown;
}

function mapRecord(record: OutscraperRecord) {
  const name = (record.name || "").trim();
  const lat = Number(record.latitude) || 0;
  const lng = Number(record.longitude) || 0;

  if (!name || (!lat && !lng)) return null;

  const location = (record.full_address || record.address || "").trim();
  const country = extractCountryCode(record);
  const category = categorizePlace(record);

  return {
    name,
    location,
    country,
    track: name, // Use the place name as the track name
    lat,
    lng,
    category,
    cage_required: false,
    tire_size: "unlimited",
    skill_level: "all",
    description: "",
    event_url: ((record.site || "") as string).trim() || null,
    price: null,
    is_hot: false,
    participation: "both",
    organizer: name,
    google_place_id: ((record.place_id || "") as string).trim() || null,
    google_rating: record.rating ? Number(record.rating) : null,
    google_reviews_count: record.reviews ? Number(record.reviews) : (record.reviews_count ? Number(record.reviews_count) : null),
    phone: ((record.phone || "") as string).trim() || null,
    website: ((record.site || "") as string).trim() || null,
    source: "outscraper" as const,
    status: "approved" as const,
    // date is required — we'll set a placeholder that should be updated
    date: "2026-12-31",
  };
}

async function main() {
  const filePath = process.argv[2];
  if (!filePath) {
    console.error("Usage: npx tsx scripts/import-outscraper.ts <path-to-json>");
    console.error("");
    console.error("The JSON file should be Outscraper Google Maps Search output.");
    console.error("Supported formats: JSON array or newline-delimited JSON.");
    process.exit(1);
  }

  const absPath = path.resolve(filePath);
  if (!fs.existsSync(absPath)) {
    console.error(`File not found: ${absPath}`);
    process.exit(1);
  }

  console.log(`Reading ${absPath}...`);
  const raw = fs.readFileSync(absPath, "utf-8").trim();

  let records: OutscraperRecord[];
  try {
    const parsed = JSON.parse(raw);
    // Outscraper sometimes wraps results in nested arrays
    if (Array.isArray(parsed) && Array.isArray(parsed[0])) {
      records = parsed.flat();
    } else if (Array.isArray(parsed)) {
      records = parsed;
    } else {
      records = [parsed];
    }
  } catch {
    // Try newline-delimited JSON
    records = raw.split("\n").filter(Boolean).map((line) => JSON.parse(line));
  }

  console.log(`Parsed ${records.length} records from Outscraper export.`);

  // Map and filter
  const mapped = records.map(mapRecord).filter(Boolean) as NonNullable<ReturnType<typeof mapRecord>>[];
  console.log(`${mapped.length} valid records after filtering (skipped ${records.length - mapped.length} with missing name/coords).`);

  if (mapped.length === 0) {
    console.log("Nothing to import.");
    return;
  }

  // Deduplicate by google_place_id
  const seen = new Set<string>();
  const deduped = mapped.filter((r) => {
    if (!r.google_place_id) return true; // No place_id, can't dedup
    if (seen.has(r.google_place_id)) return false;
    seen.add(r.google_place_id);
    return true;
  });
  console.log(`${deduped.length} records after deduplication (removed ${mapped.length - deduped.length} duplicates).`);

  // Check existing place_ids in DB to skip already-imported
  const placeIds = deduped.map((r) => r.google_place_id).filter(Boolean) as string[];
  let existingPlaceIds = new Set<string>();
  if (placeIds.length > 0) {
    const { data: existing } = await supabase
      .from("events")
      .select("google_place_id")
      .in("google_place_id", placeIds);
    if (existing) {
      existingPlaceIds = new Set(
        (existing as { google_place_id: string }[]).map((e) => e.google_place_id)
      );
    }
  }

  const toInsert = deduped.filter(
    (r) => !r.google_place_id || !existingPlaceIds.has(r.google_place_id)
  );
  console.log(`${toInsert.length} new records to insert (skipping ${deduped.length - toInsert.length} already in DB).`);

  if (toInsert.length === 0) {
    console.log("All records already exist in DB. Nothing to do.");
    return;
  }

  // Insert in batches of 50
  const BATCH_SIZE = 50;
  let inserted = 0;
  let errors = 0;

  for (let i = 0; i < toInsert.length; i += BATCH_SIZE) {
    const batch = toInsert.slice(i, i + BATCH_SIZE);
    const { error } = await supabase.from("events").insert(batch);

    if (error) {
      console.error(`Batch ${Math.floor(i / BATCH_SIZE) + 1} error:`, error.message);
      errors += batch.length;
    } else {
      inserted += batch.length;
    }
  }

  console.log("");
  console.log("=== Import Complete ===");
  console.log(`  Inserted: ${inserted}`);
  console.log(`  Errors:   ${errors}`);
  console.log(`  Skipped:  ${records.length - mapped.length} (invalid) + ${mapped.length - deduped.length} (dups) + ${deduped.length - toInsert.length} (existing)`);
  console.log("");
  console.log("NOTE: Imported venues have a placeholder date of 2026-12-31.");
  console.log("You may want to update dates for specific events, or set is_hot/series/description.");
}

main().catch(console.error);
