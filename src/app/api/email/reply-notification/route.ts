import { NextResponse } from "next/server";
import { resend, FROM_EMAIL } from "@/lib/email/resend";
import { ReplyNotificationEmail } from "@/lib/email/templates/reply-notification";
import { createAdminClient } from "@/lib/supabase/admin";

export async function POST(request: Request) {
  try {
    const { recipientId, replierName, threadTitle, replyPreview, threadId } = await request.json();

    if (!recipientId || !threadId) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    const supabase = createAdminClient();

    // Check email preferences
    const { data: prefs } = await supabase
      .from("email_preferences")
      .select("reply_notifications")
      .eq("user_id", recipientId)
      .single();

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if (!(prefs as any)?.reply_notifications) {
      return NextResponse.json({ skipped: true, reason: "email_opt_out" });
    }

    // Get recipient email
    const { data: { user } } = await supabase.auth.admin.getUserById(recipientId);
    if (!user?.email) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Get recipient profile
    const { data: profile } = await supabase
      .from("profiles")
      .select("username")
      .eq("id", recipientId)
      .single();

    const threadUrl = `https://driftspotter.com/forum/${threadId}`;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const profileData = profile as any;

    const { error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: user.email,
      subject: `${replierName} replied to your thread`,
      react: ReplyNotificationEmail({
        recipientName: profileData?.username || "there",
        replierName,
        threadTitle,
        replyPreview: replyPreview?.substring(0, 200) || "",
        threadUrl,
      }),
    });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Also send push notification
    try {
      await fetch(new URL("/api/push/send", request.url).toString(), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: recipientId,
          title: `${replierName} replied to your thread`,
          body: replyPreview?.substring(0, 100) || "New reply on your thread",
          url: `/forum/${threadId}`,
        }),
      });
    } catch {
      // Push is best-effort
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
