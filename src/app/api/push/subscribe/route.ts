import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { endpoint, keys_p256dh, keys_auth } = await request.json();

  if (!endpoint || !keys_p256dh || !keys_auth) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { error } = await supabase.from("push_subscriptions").upsert(
    { user_id: user.id, endpoint, keys_p256dh, keys_auth } as any,
    { onConflict: "user_id,endpoint" }
  );

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
