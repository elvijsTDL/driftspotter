import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { sendEmailSafe } from "@/lib/email/resend";
import { ApplicationDecisionEmail } from "@/lib/email/templates/application-decision";

/**
 * Organizer decides on an application. Updates the RSVP (which fires the
 * in-app notification trigger) and emails the driver.
 */
export async function POST(request: Request) {
  const { rsvpId, status } = await request.json();
  if (!rsvpId || !["approved", "rejected"].includes(status)) {
    return NextResponse.json({ error: "Missing rsvpId or invalid status" }, { status: 400 });
  }

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const adminClient = createAdminClient();

  const { data: rsvp } = await adminClient
    .from("event_rsvps")
    .select("id, event_id, user_id, status")
    .eq("id", rsvpId)
    .single();
  if (!rsvp) return NextResponse.json({ error: "Application not found" }, { status: 404 });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const rsvpRow = rsvp as any;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: event } = await (adminClient as any)
    .from("events")
    .select("id, name, date, track, location, safety_requirements, submitted_by, image_url, media_urls")
    .eq("id", rsvpRow.event_id)
    .single();
  if (!event) return NextResponse.json({ error: "Event not found" }, { status: 404 });

  // Only the event's organizer (or an admin) may decide
  const { data: callerProfile } = await adminClient
    .from("profiles")
    .select("is_admin")
    .eq("id", user.id)
    .single();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const isAdmin = !!(callerProfile as any)?.is_admin;
  if (event.submitted_by !== user.id && !isAdmin) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  // Update fires the notify_rsvp_decision trigger (in-app notification)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { error: updateErr } = await (adminClient as any)
    .from("event_rsvps")
    .update({ status })
    .eq("id", rsvpId);
  if (updateErr) return NextResponse.json({ error: updateErr.message }, { status: 500 });

  // Email the driver
  if (rsvpRow.status !== status) {
    const { data: { user: driver } } = await adminClient.auth.admin.getUserById(rsvpRow.user_id);
    const { data: driverProfile } = await adminClient
      .from("profiles")
      .select("username")
      .eq("id", rsvpRow.user_id)
      .single();

    if (driver?.email) {
      const approved = status === "approved";
      await sendEmailSafe({
        to: driver.email,
        subject: approved
          ? `You're in: ${event.name}`
          : `Application update: ${event.name}`,
        react: ApplicationDecisionEmail({
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          driverName: (driverProfile as any)?.username || "Drifter",
          eventName: event.name,
          eventDate: new Date(event.date).toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" }),
          location: `${event.track ? `${event.track}, ` : ""}${event.location}`,
          approved,
          safetyRequirements: event.safety_requirements || undefined,
          imageUrl: event.image_url || event.media_urls?.[0] || undefined,
          eventUrl: `https://driftspotter.com/events/${event.id}`,
        }),
      });
    }
  }

  return NextResponse.json({ success: true });
}
