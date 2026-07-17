"use client";

import { use } from "react";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { useMyEvents } from "@/hooks/useMyEvents";
import ApplicantReviewDeck from "@/components/ApplicantReviewDeck";

export default function ApplicantReviewPage({ params }: { params: Promise<{ eventId: string }> }) {
  const { eventId } = use(params);
  const { user, loading: authLoading } = useAuth();
  const { events, loading } = useMyEvents();
  const event = events.find((item) => item.id === eventId);

  if (authLoading || loading) return <section className="min-h-dvh px-4 pb-16 pt-24"><div className="mx-auto h-[34rem] max-w-md animate-pulse rounded-[1.75rem] bg-surface-lighter" /></section>;
  if (!user || !event) return <section className="min-h-dvh px-4 pb-16 pt-28 text-center"><h1 className="font-heading text-2xl font-bold">Review unavailable</h1><Link href="/my-events" className="mt-4 inline-flex min-h-11 items-center text-drift-cyan">Back to My Events</Link></section>;

  return (
    <section className="min-h-dvh px-4 pb-16 pt-24 sm:pt-28">
      <div className="mx-auto mb-6 max-w-md">
        <Link href={`/my-events/${eventId}`} className="inline-flex min-h-11 items-center gap-2 text-sm text-muted hover:text-foreground">← Back to event</Link>
        <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-drift-orange">Quick review</p>
        <h1 className="mt-1 font-heading text-2xl font-bold text-foreground sm:text-3xl">Choose your grid</h1>
        <p className="mt-2 text-sm leading-relaxed text-muted">Swipe for fast decisions, or tap ♥ Later when you want another look. Nothing in the shortlist is approved yet.</p>
      </div>
      <ApplicantReviewDeck eventId={eventId} eventName={event.name} />
    </section>
  );
}
