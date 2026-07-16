import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { sendEmailSafe } from "@/lib/email/resend";
import { EventStatusEmail } from "@/lib/email/templates/event-status";

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

  // Fetch details for the notification email before updating
  const { data: submitted } = await adminClient
    .from("submitted_events")
    .select("name, date, organizer, contact_email, image_url, media_urls")
    .eq("id", eventId)
    .single();

  // Update submitted_events status
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { error } = await (adminClient as any)
    .from("submitted_events")
    .update({ status: "rejected" })
    .eq("id", eventId);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const ev = submitted as any;
  if (ev?.contact_email) {
    await sendEmailSafe({
      to: ev.contact_email,
      subject: `About your event submission "${ev.name}"`,
      react: EventStatusEmail({
        organizerName: ev.organizer || "there",
        eventName: ev.name,
        eventDate: new Date(ev.date).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" }),
        approved: false,
        imageUrl: ev.image_url || ev.media_urls?.[0] || undefined,
      }),
    });
  }

  return NextResponse.json({ success: true });
}
