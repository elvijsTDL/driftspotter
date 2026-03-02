import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function POST(request: Request) {
  const { eventId } = await request.json();
  if (!eventId) return NextResponse.json({ error: "Missing eventId" }, { status: 400 });

  // Verify caller is admin
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const adminClient = createAdminClient();
  const { data: profile } = await adminClient
    .from("profiles")
    .select("is_admin")
    .eq("id", user.id)
    .single();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  if (!(profile as any)?.is_admin) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  // Fetch submitted event
  const { data: submitted, error: fetchErr } = await adminClient
    .from("submitted_events")
    .select("*")
    .eq("id", eventId)
    .single();

  if (fetchErr || !submitted) {
    return NextResponse.json({ error: "Event not found" }, { status: 404 });
  }

  // Insert into events table with same UUID
  // events table is not in database.types.ts — use `as any`
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const ev = submitted as any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { error: insertErr } = await (adminClient as any)
    .from("events")
    .insert({
      id: ev.id,
      name: ev.name,
      date: ev.date,
      end_date: ev.end_date,
      location: ev.location,
      country: ev.country || "",
      track: ev.track || "",
      lat: ev.lat,
      lng: ev.lng,
      category: ev.category,
      cage_required: ev.cage_required,
      tire_size: ev.tire_size,
      skill_level: ev.skill_level,
      description: ev.description,
      event_url: ev.event_url,
      image_url: ev.image_url,
      price: ev.price,
      participation: ev.participation,
      organizer: ev.organizer,
      series: ev.series,
      max_participants: ev.max_participants,
      source: "user_submitted",
      status: "approved",
      submitted_by: ev.submitted_by,
    });

  if (insertErr) {
    return NextResponse.json({ error: insertErr.message }, { status: 500 });
  }

  // Update submitted_events status
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  await (adminClient as any)
    .from("submitted_events")
    .update({ status: "approved" })
    .eq("id", eventId);

  return NextResponse.json({ success: true });
}
