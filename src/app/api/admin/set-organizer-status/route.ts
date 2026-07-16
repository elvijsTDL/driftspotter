import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

const VALID_STATUSES = ["none", "standard", "trusted", "blocked"] as const;

export async function POST(request: Request) {
  const { userId, status } = await request.json();
  if (!userId || !VALID_STATUSES.includes(status)) {
    return NextResponse.json({ error: "Missing userId or invalid status" }, { status: 400 });
  }

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

  if (userId === user.id && status === "blocked") {
    return NextResponse.json({ error: "You can't block yourself" }, { status: 400 });
  }

  const { data: target } = await adminClient
    .from("profiles")
    .select("organizer_status")
    .eq("id", userId)
    .single();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const previousStatus = (target as any)?.organizer_status as string | undefined;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { error } = await (adminClient as any)
    .from("profiles")
    .update({ organizer_status: status })
    .eq("id", userId);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // Tell the user what happened to their access
  let notification: { title: string; body: string; link: string } | null = null;
  if ((status === "standard" || status === "trusted") && previousStatus !== "standard" && previousStatus !== "trusted") {
    notification = {
      title: "Organizer access approved!",
      body: status === "trusted"
        ? "You're a trusted organizer — your events publish instantly."
        : "You can now submit events. Each one is reviewed before going live.",
      link: "/submit",
    };
  } else if (status === "none" && previousStatus === "pending") {
    notification = {
      title: "Organizer request declined",
      body: "We couldn't verify your organizer request. You can apply again with more details about your events.",
      link: "/submit",
    };
  }
  if (notification) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await (adminClient as any).from("notifications").insert({
      user_id: userId,
      type: "system",
      ...notification,
    });
  }

  return NextResponse.json({ success: true });
}
