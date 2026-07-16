import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { buildPreviews, SAMPLE_EVENT, type SampleEvent } from "@/lib/email/previews";

// The App Router's SWC pass errors on a static `react-dom/server` import even
// inside a Route Handler, so load it at runtime (Node) where it's perfectly safe.
async function getRenderer(): Promise<(el: React.ReactElement) => string> {
  const spec = "react-dom/server";
  const mod = await import(/* webpackIgnore: true */ spec);
  return (mod.renderToStaticMarkup ?? mod.default?.renderToStaticMarkup) as (el: React.ReactElement) => string;
}

/**
 * Renders every transactional email to an HTML string for the dev preview
 * page. Lives in a Route Handler because the App Router forbids importing
 * `react-dom/server` from component/page modules. Not reachable in production.
 */
export const dynamic = "force-dynamic";

async function getSampleEvent(): Promise<SampleEvent> {
  try {
    const supabase = await createClient();
    // events table isn't in the generated types — cast through any
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data } = await (supabase as any)
      .from("events")
      .select("id, name, date, track, location, price, image_url, media_urls")
      .eq("status", "approved")
      .order("date", { ascending: true })
      .limit(1);
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
  } catch {
    return SAMPLE_EVENT;
  }
}

export async function GET(request: Request) {
  if (process.env.NODE_ENV === "production") {
    return new NextResponse("Not found", { status: 404 });
  }

  // Link events back to the origin you're previewing from (e.g. localhost:3001)
  // so the URLs in the preview are clickable against your dev server.
  const origin = new URL(request.url).origin;
  const ev = await getSampleEvent();
  const renderToStaticMarkup = await getRenderer();
  const previews = buildPreviews(ev, origin).map((p) => ({
    id: p.id,
    label: p.label,
    subject: p.subject,
    html: "<!DOCTYPE html>" + renderToStaticMarkup(p.element),
  }));

  return NextResponse.json({
    eventLabel: ev === SAMPLE_EVENT ? `${ev.name} (sample)` : ev.name,
    previews,
  });
}
