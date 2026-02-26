import { NextResponse } from "next/server";
import { resend, FROM_EMAIL } from "@/lib/email/resend";
import { WeeklyDigestEmail } from "@/lib/email/templates/weekly-digest";
import { createAdminClient } from "@/lib/supabase/admin";

export async function GET() {
  try {
    const supabase = createAdminClient();

    // Get users who opted into weekly digest
    const { data: prefs } = await supabase
      .from("email_preferences")
      .select("user_id")
      .eq("weekly_digest", true);

    if (!prefs || prefs.length === 0) {
      return NextResponse.json({ sent: 0 });
    }

    // Get hot threads from the past week
    const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();
    const { data: hotThreads } = await supabase
      .from("forum_threads")
      .select("id, title")
      .gte("created_at", weekAgo)
      .order("created_at", { ascending: false })
      .limit(5);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const threads = ((hotThreads || []) as any[]).map((t) => ({
      title: t.title as string,
      replyCount: 0,
      url: `https://driftspotter.com/forum/${t.id}`,
    }));

    // Get upcoming events from DB (next 2 weeks)
    const now = new Date().toISOString().split("T")[0];
    const twoWeeks = new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split("T")[0];

    const { data: upcomingRaw } = await supabase
      .from("events")
      .select("name, date, location")
      .eq("status", "approved")
      .gte("date", now)
      .lte("date", twoWeeks)
      .order("date", { ascending: true })
      .limit(5);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const upcomingEvents = ((upcomingRaw || []) as any[]).map((e) => ({
      name: e.name as string,
      date: e.date as string,
      location: e.location as string,
    }));

    const weekStart = new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });

    let sent = 0;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    for (const pref of prefs as any[]) {
      const { data: { user } } = await supabase.auth.admin.getUserById(pref.user_id);
      if (!user?.email) continue;

      const { data: profile } = await supabase
        .from("profiles")
        .select("username")
        .eq("id", pref.user_id)
        .single();

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const profileData = profile as any;

      await resend.emails.send({
        from: FROM_EMAIL,
        to: user.email,
        subject: `Your Weekly Drift Digest — ${weekStart}`,
        react: WeeklyDigestEmail({
          username: profileData?.username || "Drifter",
          threads,
          upcomingEvents,
          weekStart,
        }),
      });

      sent++;
    }

    return NextResponse.json({ sent });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
