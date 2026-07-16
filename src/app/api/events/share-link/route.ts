import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { sendEmailSafe } from "@/lib/email/resend";
import { MediaSharedEmail } from "@/lib/email/templates/media-shared";

const SITE_URL = "https://driftspotter.com";

/**
 * Adds an event link and notifies every approved participant (in-app +
 * email). The insert runs under the caller's session, so the RLS policy
 * (organizer or approved participant) is what actually grants permission.
 */
export async function POST(request: Request) {
  const { eventId, label, url } = await request.json();
  if (!eventId || !label?.trim() || !/^https?:\/\/\S+\.\S+/.test(url?.trim() ?? "")) {
    return NextResponse.json({ error: "Missing or invalid eventId, label or url" }, { status: 400 });
  }

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  // RLS enforces who may add links — no manual permission check needed
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { error: insertErr } = await (supabase as any).from("event_links").insert({
    event_id: eventId,
    added_by: user.id,
    label: label.trim(),
    url: url.trim(),
  });
  if (insertErr) {
    const denied = insertErr.message?.includes("row-level security");
    return NextResponse.json(
      { error: denied ? "Only the organizer and approved participants can share links" : insertErr.message },
      { status: denied ? 403 : 500 }
    );
  }

  // Fan out to approved participants (skip the poster)
  const adminClient = createAdminClient();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: event } = await (adminClient as any)
    .from("events")
    .select("id, name, image_url, media_urls")
    .eq("id", eventId)
    .single();

  const { data: rsvps } = await adminClient
    .from("event_rsvps")
    .select("user_id")
    .eq("event_id", eventId)
    .eq("status", "approved");

  const recipientIds = [...new Set(
    ((rsvps ?? []) as { user_id: string }[])
      .map((r) => r.user_id)
      .filter((id) => id !== user.id)
  )];

  const eventUrl = `${SITE_URL}/events/${eventId}`;
  let notified = 0;

  for (const recipientId of recipientIds) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await (adminClient as any).from("notifications").insert({
      user_id: recipientId,
      type: "event",
      title: "New event media",
      body: `"${label.trim()}" was shared from ${event?.name ?? "your event"}`,
      link: `/events/${eventId}`,
    });

    const { data: { user: recipient } } = await adminClient.auth.admin.getUserById(recipientId);
    if (recipient?.email) {
      const { data: profile } = await adminClient
        .from("profiles")
        .select("username")
        .eq("id", recipientId)
        .single();
      await sendEmailSafe({
        to: recipient.email,
        subject: `New media from ${event?.name ?? "your event"}`,
        react: MediaSharedEmail({
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          username: (profile as any)?.username || "Drifter",
          eventName: event?.name ?? "your event",
          linkLabel: label.trim(),
          linkUrl: url.trim(),
          imageUrl: event?.image_url || event?.media_urls?.[0] || undefined,
          eventUrl,
        }),
      });
    }
    notified++;
  }

  return NextResponse.json({ success: true, notified });
}
