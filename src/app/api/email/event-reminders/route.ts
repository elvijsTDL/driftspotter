import { NextResponse } from "next/server";
import webpush from "web-push";
import { sendEmailSafe } from "@/lib/email/resend";
import { EventReminderEmail } from "@/lib/email/templates/event-reminder";
import { createAdminClient } from "@/lib/supabase/admin";
import { requireCronSecret } from "@/lib/apiSecurity";

const SITE_URL = "https://driftspotter.com";
const REMINDER_DAYS_AHEAD = 2;

/**
 * Daily cron: remind drivers with an approved spot about events starting
 * within the next REMINDER_DAYS_AHEAD days. Deduped via event_reminder_log,
 * gated by email_preferences.event_reminders. Also fires push + in-app
 * notification.
 */
export async function GET(request: Request) {
  const unauthorized = requireCronSecret(request);
  if (unauthorized) return unauthorized;

  try {
    const supabase = createAdminClient();

    const today = new Date().toISOString().split("T")[0];
    const horizon = new Date(Date.now() + REMINDER_DAYS_AHEAD * 24 * 60 * 60 * 1000)
      .toISOString().split("T")[0];

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: events } = await (supabase as any)
      .from("events")
      .select("id, name, date, track, location, safety_requirements, price, image_url, media_urls")
      .eq("status", "approved")
      .gte("date", today)
      .lte("date", horizon);

    if (!events || events.length === 0) {
      return NextResponse.json({ sent: 0, events: 0 });
    }

    const vapidPublic = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
    const vapidPrivate = process.env.VAPID_PRIVATE_KEY;
    const pushEnabled = !!(vapidPublic && vapidPrivate);
    if (pushEnabled) {
      webpush.setVapidDetails("mailto:hello@driftspotter.com", vapidPublic!, vapidPrivate!);
    }

    let sent = 0;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    for (const event of events as any[]) {
      // Approved attendees for this event
      const { data: rsvps } = await supabase
        .from("event_rsvps")
        .select("user_id")
        .eq("event_id", event.id)
        .eq("status", "approved");

      if (!rsvps || rsvps.length === 0) continue;

      for (const rsvp of rsvps as { user_id: string }[]) {
        // Already reminded for this event?
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const { data: logged } = await (supabase as any)
          .from("event_reminder_log")
          .select("id")
          .eq("event_id", event.id)
          .eq("user_id", rsvp.user_id)
          .maybeSingle();
        if (logged) continue;

        // Respect preferences (default true when no row exists)
        const { data: pref } = await supabase
          .from("email_preferences")
          .select("event_reminders")
          .eq("user_id", rsvp.user_id)
          .maybeSingle();
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        if (pref && !(pref as any).event_reminders) continue;

        const { data: { user } } = await supabase.auth.admin.getUserById(rsvp.user_id);
        const { data: profile } = await supabase
          .from("profiles")
          .select("username")
          .eq("id", rsvp.user_id)
          .single();
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const username = (profile as any)?.username || "Drifter";

        const eventDate = new Date(event.date).toLocaleDateString("en-US", {
          weekday: "long", month: "long", day: "numeric", year: "numeric",
        });
        const eventUrl = `${SITE_URL}/events/${event.id}`;

        if (user?.email) {
          await sendEmailSafe({
            to: user.email,
            subject: `Reminder: ${event.name} is on ${eventDate}`,
            react: EventReminderEmail({
              username,
              eventName: event.name,
              eventDate,
              track: event.track || "",
              location: event.location,
              safetyRequirements: event.safety_requirements || undefined,
              price: event.price || undefined,
              imageUrl: event.image_url || event.media_urls?.[0] || undefined,
              eventUrl,
            }),
          });
        }

        // In-app notification
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        await (supabase as any).from("notifications").insert({
          user_id: rsvp.user_id,
          type: "event",
          title: "Event coming up!",
          body: `${event.name} is on ${eventDate} — see you there`,
          link: `/events/${event.id}`,
        });

        // Push notification
        if (pushEnabled) {
          const { data: subscriptions } = await supabase
            .from("push_subscriptions")
            .select("*")
            .eq("user_id", rsvp.user_id);
          const payload = JSON.stringify({
            title: "Event coming up!",
            body: `${event.name} is on ${eventDate}`,
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
                await supabase.from("push_subscriptions").delete().eq("id", sub.id);
              }
            }
          }
        }

        // Log so we never double-send
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        await (supabase as any).from("event_reminder_log").insert({
          event_id: event.id,
          user_id: rsvp.user_id,
        });

        sent++;
      }
    }

    return NextResponse.json({ sent, events: events.length });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
