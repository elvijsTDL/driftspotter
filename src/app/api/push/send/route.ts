import { NextResponse } from "next/server";
import webpush from "web-push";
import { createAdminClient } from "@/lib/supabase/admin";

export async function POST(request: Request) {
  const { user_id, title, body, url } = await request.json();

  if (!user_id || !title) {
    return NextResponse.json({ error: "Missing user_id or title" }, { status: 400 });
  }

  const vapidPublic = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
  const vapidPrivate = process.env.VAPID_PRIVATE_KEY;

  if (!vapidPublic || !vapidPrivate) {
    return NextResponse.json({ error: "VAPID keys not configured" }, { status: 500 });
  }

  webpush.setVapidDetails("mailto:hello@driftspotter.com", vapidPublic, vapidPrivate);

  const supabase = createAdminClient();

  const { data: subscriptions } = await supabase
    .from("push_subscriptions")
    .select("*")
    .eq("user_id", user_id);

  if (!subscriptions || subscriptions.length === 0) {
    return NextResponse.json({ sent: 0 });
  }

  const payload = JSON.stringify({ title, body, url });
  let sent = 0;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  for (const sub of subscriptions as any[]) {
    try {
      await webpush.sendNotification(
        {
          endpoint: sub.endpoint,
          keys: { p256dh: sub.keys_p256dh, auth: sub.keys_auth },
        },
        payload
      );
      sent++;
    } catch (err: unknown) {
      if (err && typeof err === "object" && "statusCode" in err && (err as { statusCode: number }).statusCode === 410) {
        await supabase.from("push_subscriptions").delete().eq("id", sub.id);
      }
    }
  }

  return NextResponse.json({ sent });
}
