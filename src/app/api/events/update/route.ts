import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

// Fields an organizer may change on their own event.
const ALLOWED_FIELDS = [
  "name", "date", "end_date", "location", "category", "cage_required",
  "tire_size", "skill_level", "participation", "description",
  "safety_requirements", "required_equipment", "accepts_media", "requires_emergency_contact", "event_url", "organizer", "contact_email",
  "image_url", "media_urls", "lat", "lng", "track", "country",
  "series", "price", "max_participants",
] as const;

// contact_email lives only on submitted_events; everything else mirrors
// to the live events row when the event is already approved.
const EVENTS_TABLE_FIELDS = ALLOWED_FIELDS.filter((f) => f !== "contact_email");

export async function POST(request: Request) {
  const { eventId, updates } = await request.json();
  if (!eventId || !updates || typeof updates !== "object") {
    return NextResponse.json({ error: "Missing eventId or updates" }, { status: 400 });
  }

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const adminClient = createAdminClient();
  const { data: submitted, error: fetchErr } = await adminClient
    .from("submitted_events")
    .select("id, submitted_by, status")
    .eq("id", eventId)
    .single();

  if (fetchErr || !submitted) {
    return NextResponse.json({ error: "Event not found" }, { status: 404 });
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const row = submitted as any;
  if (row.submitted_by !== user.id) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const filtered: Record<string, unknown> = {};
  for (const field of ALLOWED_FIELDS) {
    if (field in updates) filtered[field] = updates[field];
  }
  if (Object.keys(filtered).length === 0) {
    return NextResponse.json({ error: "No valid fields to update" }, { status: 400 });
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { error: updateErr } = await (adminClient as any)
    .from("submitted_events")
    .update(filtered)
    .eq("id", eventId);

  if (updateErr) {
    return NextResponse.json({ error: updateErr.message }, { status: 500 });
  }

  // Keep the live event in sync (approved events share the same UUID).
  if (row.status === "approved") {
    const liveUpdates: Record<string, unknown> = {};
    for (const field of EVENTS_TABLE_FIELDS) {
      if (field in filtered) liveUpdates[field] = filtered[field];
    }
    if (Object.keys(liveUpdates).length > 0) {
      liveUpdates.updated_at = new Date().toISOString();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { error: syncErr } = await (adminClient as any)
        .from("events")
        .update(liveUpdates)
        .eq("id", eventId);

      if (syncErr) {
        return NextResponse.json({ error: "Saved, but failed to sync the live event: " + syncErr.message }, { status: 500 });
      }
    }
  }

  return NextResponse.json({ success: true });
}
