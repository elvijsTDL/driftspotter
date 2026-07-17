import { timingSafeEqual } from "crypto";
import { NextResponse } from "next/server";

type Bucket = { count: number; resetAt: number };
const buckets = new Map<string, Bucket>();

function clientAddress(request: Request) {
  return request.headers.get("x-real-ip")
    ?? request.headers.get("x-forwarded-for")?.split(",")[0]?.trim()
    ?? "unknown";
}

export function rateLimit(request: Request, scope: string, limit = 10, windowMs = 60_000) {
  const now = Date.now();
  const key = `${scope}:${clientAddress(request)}`;
  const current = buckets.get(key);
  if (!current || current.resetAt <= now) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return null;
  }
  current.count += 1;
  if (current.count <= limit) return null;
  return NextResponse.json(
    { error: "Too many requests" },
    { status: 429, headers: { "Retry-After": String(Math.ceil((current.resetAt - now) / 1000)) } }
  );
}

export function rejectLargeRequest(request: Request, maxBytes = 16_384) {
  const length = Number(request.headers.get("content-length") ?? "0");
  if (Number.isFinite(length) && length > maxBytes) {
    return NextResponse.json({ error: "Request body too large" }, { status: 413 });
  }
  return null;
}

export function hasBearerSecret(request: Request, secret: string | undefined) {
  if (!secret) return false;
  const supplied = request.headers.get("authorization")?.replace(/^Bearer\s+/i, "") ?? "";
  const expectedBuffer = Buffer.from(secret);
  const suppliedBuffer = Buffer.from(supplied);
  return suppliedBuffer.length === expectedBuffer.length
    && timingSafeEqual(suppliedBuffer, expectedBuffer);
}

export function requireCronSecret(request: Request) {
  return hasBearerSecret(request, process.env.CRON_SECRET)
    ? null
    : NextResponse.json({ error: "Unauthorized" }, { status: 401 });
}

export function requireInternalSecret(request: Request) {
  return hasBearerSecret(request, process.env.INTERNAL_API_SECRET)
    ? null
    : NextResponse.json({ error: "Unauthorized" }, { status: 401 });
}
