import { Resend } from "resend";

let _resend: Resend | null = null;

export function getResend() {
  if (!_resend) {
    _resend = new Resend(process.env.RESEND_API_KEY ?? "");
  }
  return _resend;
}

/**
 * Sender address. Until the driftspotter.com domain is verified in Resend,
 * set EMAIL_FROM="DriftSpotter <onboarding@resend.dev>" to test (delivers
 * only to the Resend account owner's email).
 */
export const FROM_EMAIL =
  process.env.EMAIL_FROM || "DriftSpotter <notifications@driftspotter.com>";

/** True when a real-looking Resend key is configured (not the placeholder). */
export function isEmailConfigured(): boolean {
  const key = process.env.RESEND_API_KEY ?? "";
  return key.startsWith("re_") && key.length > 20;
}

/** Fire-and-forget send that never throws — email failures must not break the action that triggered them. */
export async function sendEmailSafe(options: {
  to: string;
  subject: string;
  react: React.ReactElement;
}): Promise<boolean> {
  if (!isEmailConfigured()) return false;
  try {
    const { error } = await getResend().emails.send({ from: FROM_EMAIL, ...options });
    if (error) {
      console.error("Email send failed:", error);
      return false;
    }
    return true;
  } catch (err) {
    console.error("Email send failed:", err);
    return false;
  }
}
