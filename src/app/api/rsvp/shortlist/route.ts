import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { rejectLargeRequest } from "@/lib/apiSecurity";

export async function POST(request: Request) {
  const tooLarge = rejectLargeRequest(request, 2048);
  if (tooLarge) return tooLarge;

  const body = await request.json().catch(() => null);
  if (!body?.rsvpId || typeof body.shortlisted !== "boolean") {
    return NextResponse.json({ error: "Invalid shortlist request" }, { status: 400 });
  }

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const admin = createAdminClient();
  const { data: rsvp } = await admin.from("event_rsvps").select("id, event_id, status").eq("id", body.rsvpId).single();
  if (!rsvp) return NextResponse.json({ error: "Application not found" }, { status: 404 });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: event } = await (admin as any).from("events").select("submitted_by").eq("id", (rsvp as any).event_id).single();
  const { data: profile } = await admin.from("profiles").select("is_admin").eq("id", user.id).single();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  if (event?.submitted_by !== user.id && !(profile as any)?.is_admin) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  if ((rsvp as any).status !== "pending") {
    return NextResponse.json({ error: "Only pending applications can be shortlisted" }, { status: 409 });
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { error } = await (admin as any).from("event_rsvps").update({ shortlisted: body.shortlisted }).eq("id", body.rsvpId);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}
