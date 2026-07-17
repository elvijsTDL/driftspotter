import { NextResponse } from "next/server";
import webpush from "web-push";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { buildSamples, FALLBACK_EVENT, type SampleEventInfo } from "../samples";

/**
 * Backend for the /dev/notifications test bench. GET returns the sample
 * catalogue hydrated with a real event; POST fires a notification at the
 * signed-in user's OWN account (in-app row and/or real web push). Open in
 * dev; in production only admins can reach it (everyone else gets a 404 so
 * the route stays invisible).
 */
export const dynamic = "force-dynamic";

const notFound = () => new NextResponse("Not found", { status: 404 });

async function getCaller() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  let isAdmin = false;
  if (user) {
    const { data: profile } = await createAdminClient()
      .from("profiles")
      .select("is_admin")
      .eq("id", user.id)
      .single();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    isAdmin = Boolean((profile as any)?.is_admin);
  }
  return { user, isAdmin };
}

async function getSampleEvent(): Promise<{ ev: SampleEventInfo; isFallback: boolean }> {
  try {
    const supabase = await createClient();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data } = await (supabase as any)
      .from("events")
      .select("id, name, date")
      .eq("status", "approved")
      .order("date", { ascending: true })
      .limit(1);
    const row = data?.[0];
    if (!row) return { ev: FALLBACK_EVENT, isFallback: true };
    return {
      ev: {
        id: row.id,
        name: row.name,
        dateLabel: new Date(row.date).toLocaleDateString("en-US", {
          weekday: "long", month: "long", day: "numeric", year: "numeric",
        }),
      },
      isFallback: false,
    };
  } catch {
    return { ev: FALLBACK_EVENT, isFallback: true };
  }
}

export async function GET() {
  const { user, isAdmin } = await getCaller();
  if (process.env.NODE_ENV === "production" && !isAdmin) return notFound();

  const { ev, isFallback } = await getSampleEvent();

  let subscriptionCount = 0;
  if (user) {
    const admin = createAdminClient();
    const { count } = await admin
      .from("push_subscriptions")
      .select("id", { count: "exact", head: true })
      .eq("user_id", user.id);
    subscriptionCount = count ?? 0;
  }

  return NextResponse.json({
    signedIn: Boolean(user),
    eventLabel: isFallback ? `${ev.name} (sample)` : ev.name,
    pushConfigured: Boolean(process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY && process.env.VAPID_PRIVATE_KEY),
    subscriptionCount,
    samples: buildSamples(ev),
  });
}

export async function POST(request: Request) {
  const { user, isAdmin } = await getCaller();
  if (process.env.NODE_ENV === "production" && !isAdmin) return notFound();

  if (!user) {
    return NextResponse.json(
      { error: "Sign in first — test notifications are delivered to your own account." },
      { status: 401 }
    );
  }

  const payload = await request.json();
  const admin = createAdminClient();

  if (payload.action === "clear") {
    const { error } = await admin.from("notifications").delete().eq("user_id", user.id);
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ cleared: true });
  }

  const { title, body, link, type, channels } = payload as {
    title?: string; body?: string; link?: string; type?: string; channels?: string[];
  };
  if (!title?.trim() || !body?.trim() || !Array.isArray(channels) || channels.length === 0) {
    return NextResponse.json({ error: "Missing title, body or channels" }, { status: 400 });
  }
  const safeLink = typeof link === "string" && link.startsWith("/") ? link : null;

  const result: { inapp?: boolean; pushSent?: number; pushError?: string } = {};

  if (channels.includes("inapp")) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { error } = await (admin as any).from("notifications").insert({
      user_id: user.id,
      type: type === "system" ? "system" : "event",
      title: title.trim(),
      body: body.trim(),
      link: safeLink,
    });
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    result.inapp = true;
  }

  if (channels.includes("push")) {
    const vapidPublic = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
    const vapidPrivate = process.env.VAPID_PRIVATE_KEY;
    if (!vapidPublic || !vapidPrivate) {
      result.pushError = "VAPID keys missing (NEXT_PUBLIC_VAPID_PUBLIC_KEY / VAPID_PRIVATE_KEY in .env.local)";
    } else {
      webpush.setVapidDetails("mailto:hello@driftspotter.com", vapidPublic, vapidPrivate);
      const { data: subscriptions } = await admin
        .from("push_subscriptions")
        .select("*")
        .eq("user_id", user.id);

      if (!subscriptions?.length) {
        result.pushError = "No push subscriptions on your account — enable push in this browser first";
      } else {
        let sent = 0;
        const message = JSON.stringify({ title: title.trim(), body: body.trim(), url: safeLink ?? "/" });
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        for (const sub of subscriptions as any[]) {
          try {
            await webpush.sendNotification(
              { endpoint: sub.endpoint, keys: { p256dh: sub.keys_p256dh, auth: sub.keys_auth } },
              message
            );
            sent++;
          } catch (err: unknown) {
            if (err && typeof err === "object" && "statusCode" in err && (err as { statusCode: number }).statusCode === 410) {
              await admin.from("push_subscriptions").delete().eq("id", sub.id);
            }
          }
        }
        result.pushSent = sent;
        if (!sent) result.pushError = "No push deliveries succeeded — subscriptions may be stale";
      }
    }
  }

  return NextResponse.json(result);
}
