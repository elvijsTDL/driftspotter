import { updateSession } from "@/lib/supabase/middleware";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

const apiBuckets = new Map<string, { count: number; resetAt: number }>();

export async function middleware(request: NextRequest) {
  if (request.nextUrl.pathname.startsWith("/api/") && request.method !== "GET") {
    const length = Number(request.headers.get("content-length") ?? "0");
    if (Number.isFinite(length) && length > 64 * 1024) {
      return NextResponse.json({ error: "Request body too large" }, { status: 413 });
    }

    const ip = request.headers.get("x-real-ip")
      ?? request.headers.get("x-forwarded-for")?.split(",")[0]?.trim()
      ?? "unknown";
    const key = `${ip}:${request.nextUrl.pathname}`;
    const now = Date.now();
    const bucket = apiBuckets.get(key);
    if (!bucket || bucket.resetAt <= now) {
      apiBuckets.set(key, { count: 1, resetAt: now + 60_000 });
    } else if (++bucket.count > 30) {
      return NextResponse.json(
        { error: "Too many requests" },
        { status: 429, headers: { "Retry-After": String(Math.ceil((bucket.resetAt - now) / 1000)) } }
      );
    }
  }
  return await updateSession(request);
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|sw.js|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
