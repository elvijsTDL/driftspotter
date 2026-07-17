import { NextResponse } from "next/server";
import { getResend, FROM_EMAIL } from "@/lib/email/resend";
import { WelcomeEmail } from "@/lib/email/templates/welcome";
import { createClient } from "@/lib/supabase/server";
import { rateLimit, rejectLargeRequest } from "@/lib/apiSecurity";

export async function POST(request: Request) {
  const limited = rateLimit(request, "welcome-email", 3, 60 * 60_000);
  if (limited) return limited;
  const tooLarge = rejectLargeRequest(request, 4096);
  if (tooLarge) return tooLarge;
  try {
    const { email, username } = await request.json();

    if (!email || !username) {
      return NextResponse.json({ error: "Missing email or username" }, { status: 400 });
    }

    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user || user.email?.toLowerCase() !== String(email).toLowerCase()) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    if (typeof username !== "string" || username.length > 50) {
      return NextResponse.json({ error: "Invalid username" }, { status: 400 });
    }

    const { error } = await getResend().emails.send({
      from: FROM_EMAIL,
      to: email,
      subject: "Welcome to DriftSpotter! 🏎️",
      react: WelcomeEmail({ username }),
    });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
