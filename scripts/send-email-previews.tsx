/**
 * Sends one preview of every transactional email template to PREVIEW_TO
 * with realistic sample data. Uses the SAME catalogue as the live preview
 * page (src/lib/email/previews.tsx), so inboxes match the browser.
 *
 * Prefer the live preview page for iterating:  npm run dev  ->  /dev/emails
 * Use this only when you want to check real-client rendering (Gmail, Outlook).
 *
 * Run with:  npx tsx scripts/send-email-previews.tsx
 */
import * as fs from "fs";
import * as path from "path";
import { renderToStaticMarkup } from "react-dom/server";
import { buildPreviews, SAMPLE_EVENT, type SampleEvent } from "../src/lib/email/previews";

const PREVIEW_TO = "dzirkals@gmail.com";

// Read env from .env.local (tsx doesn't auto-load it)
const env = fs.readFileSync(path.join(__dirname, "..", ".env.local"), "utf8");
const envVal = (name: string) => env.split(/\r?\n/).find((l) => l.startsWith(`${name}=`))?.split("=").slice(1).join("=").trim();
const key = envVal("RESEND_API_KEY");
if (!key) throw new Error("RESEND_API_KEY not found in .env.local");

// Grab a real approved event so links + cover images in the previews are real
async function getSampleEvent(): Promise<SampleEvent> {
  const supabaseUrl = envVal("NEXT_PUBLIC_SUPABASE_URL");
  const anonKey = envVal("NEXT_PUBLIC_SUPABASE_ANON_KEY");
  if (!supabaseUrl || !anonKey) return SAMPLE_EVENT;
  const res = await fetch(
    `${supabaseUrl}/rest/v1/events?select=id,name,date,track,location,price,image_url,media_urls&status=eq.approved&order=date.asc&limit=1`,
    { headers: { apikey: anonKey, Authorization: `Bearer ${anonKey}` } }
  );
  const data = await res.json();
  const ev = data?.[0];
  if (!ev) return SAMPLE_EVENT;
  return {
    id: ev.id,
    name: ev.name,
    date: ev.date,
    track: ev.track || "",
    location: ev.location,
    price: ev.price ?? null,
    imageUrl: ev.image_url || ev.media_urls?.[0] || SAMPLE_EVENT.imageUrl,
  };
}

async function main() {
  const ev = await getSampleEvent();
  console.log(`linking previews to event: ${ev.name} (${ev.id})`);
  const previews = buildPreviews(ev);
  for (const p of previews) {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from: "DriftSpotter <notifications@driftspotter.com>",
        to: [PREVIEW_TO],
        subject: `[PREVIEW] ${p.subject}`,
        html: "<!DOCTYPE html>" + renderToStaticMarkup(p.element),
      }),
    });
    const data = await res.json();
    console.log(res.ok ? `sent: ${p.subject}` : `FAILED: ${p.subject} — ${JSON.stringify(data)}`);
    // stay under rate limits
    await new Promise((r) => setTimeout(r, 600));
  }
}

main();
