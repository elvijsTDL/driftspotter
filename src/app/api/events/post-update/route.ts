import { NextResponse } from "next/server";
import webpush from "web-push";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { sendEmailSafe } from "@/lib/email/resend";
import { EventUpdateEmail } from "@/lib/email/templates/event-update";
import { rejectLargeRequest } from "@/lib/apiSecurity";

const SITE_URL = "https://driftspotter.com";

/**
 * Posts a numbered organizer update ("blast") to an event and fans it out
 * to every approved participant: in-app notification + email + push. The
 * update itself is public and stays pinned on the event page.
 *
 * event_updates has no client-role write policies — this route is the only
 * write path, so it must verify the caller organizes the event.
 */
export async function POST(request: Request) {
  const tooLarge = rejectLargeRequest(request);
  if (tooLarge) return tooLarge;

  const { eventId, body } = await request.json();
  if (!eventId || typeof body !== "string" || !body.trim() || body.trim().length > 1000) {
    return NextResponse.json({ error: "Update text is required (max 1000 characters)" }, { status: 400 });
  }
  const text = body.trim();

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const adminClient = createAdminClient();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: event } = await (adminClient as any)
    .from("events")
    .select("id, name, organizer, submitted_by, image_url, media_urls")
    .eq("id", eventId)
    .single();
  if (!event) return NextResponse.json({ error: "Event not found" }, { status: 404 });

  const { data: profile } = await adminClient
    .from("profiles")
    .select("is_admin")
    .eq("id", user.id)
    .single();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const isAdmin = (profile as any)?.is_admin === true;
  if (event.submitted_by !== user.id && !isAdmin) {
    return NextResponse.json({ error: "Only the organizer can post updates" }, { status: 403 });
  }

  // Next bulletin number; the (event_id, number) unique constraint catches
  // a concurrent post, in which case we recount once and retry.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let update: any = null;
  for (let attempt = 0; attempt < 2 && !update; attempt++) {
    const { count } = await adminClient
      .from("event_updates")
      .select("*", { count: "exact", head: true })
      .eq("event_id", eventId);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data, error } = await (adminClient as any)
      .from("event_updates")
      .insert({ event_id: eventId, author_id: user.id, number: (count ?? 0) + 1, body: text })
      .select()
      .single();
    if (error && attempt === 1) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    update = data;
  }

  // Fan out to approved participants (not the poster)
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

  const vapidPublic = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
  const vapidPrivate = process.env.VAPID_PRIVATE_KEY;
  let pushEnabled = !!(vapidPublic && vapidPrivate);
  if (pushEnabled) {
    try {
      webpush.setVapidDetails("mailto:hello@driftspotter.com", vapidPublic!, vapidPrivate!);
    } catch (err) {
      console.error("Invalid VAPID keys, skipping push:", err);
      pushEnabled = false;
    }
  }

  const eventUrl = `${SITE_URL}/events/${eventId}`;
  const preview = text.length > 140 ? `${text.slice(0, 137)}...` : text;
  let notified = 0;

  for (const recipientId of recipientIds) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await (adminClient as any).from("notifications").insert({
      user_id: recipientId,
      type: "event",
      title: `Update #${update.number}: ${event.name}`,
      body: preview,
      link: `/events/${eventId}`,
    });

    if (pushEnabled) {
      const { data: subscriptions } = await adminClient
        .from("push_subscriptions")
        .select("*")
        .eq("user_id", recipientId);
      const payload = JSON.stringify({
        title: `Update #${update.number}: ${event.name}`,
        body: preview,
        url: eventUrl,
      });
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      for (const sub of (subscriptions ?? []) as any[]) {
        try {
          await webpush.sendNotification(
            { endpoint: sub.endpoint, keys: { p256dh: sub.keys_p256dh, auth: sub.keys_auth } },
            payload
          );
        } catch (err: unknown) {
          if (err && typeof err === "object" && "statusCode" in err && (err as { statusCode: number }).statusCode === 410) {
            await adminClient.from("push_subscriptions").delete().eq("id", sub.id);
          }
        }
      }
    }

    const { data: { user: recipient } } = await adminClient.auth.admin.getUserById(recipientId);
    if (recipient?.email) {
      const { data: recipientProfile } = await adminClient
        .from("profiles")
        .select("username")
        .eq("id", recipientId)
        .single();
      await sendEmailSafe({
        to: recipient.email,
        subject: `Update #${update.number} — ${event.name}`,
        react: EventUpdateEmail({
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          username: (recipientProfile as any)?.username || "Drifter",
          eventName: event.name,
          updateNumber: update.number,
          updateBody: text,
          organizerName: event.organizer || undefined,
          imageUrl: event.image_url || event.media_urls?.[0] || undefined,
          eventUrl,
        }),
      });
    }
    notified++;
  }

  return NextResponse.json({ success: true, update, notified });
}
