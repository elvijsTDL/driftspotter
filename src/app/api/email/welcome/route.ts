import { NextResponse } from "next/server";
import { getResend, FROM_EMAIL } from "@/lib/email/resend";
import { WelcomeEmail } from "@/lib/email/templates/welcome";

export async function POST(request: Request) {
  try {
    const { email, username } = await request.json();

    if (!email || !username) {
      return NextResponse.json({ error: "Missing email or username" }, { status: 400 });
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
