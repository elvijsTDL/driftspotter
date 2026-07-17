"use client";

import { use } from "react";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import EventCommandCenter from "@/components/EventCommandCenter";

export default function EventCommandCenterPage({ params }: { params: Promise<{ eventId: string }> }) {
  const { eventId } = use(params);
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <section className="relative pt-28 pb-20 md:pt-32 md:pb-28">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 space-y-4">
          <div className="h-8 w-64 bg-surface-lighter rounded animate-pulse" />
          <div className="h-40 glass rounded-2xl animate-pulse" />
        </div>
      </section>
    );
  }

  if (!user) {
    return (
      <section className="relative pt-28 pb-20 md:pt-32 md:pb-28">
        <div className="max-w-2xl mx-auto px-4 text-center">
          <div className="glass rounded-2xl p-6 sm:p-12">
            <h2 className="font-heading font-bold text-2xl text-foreground mb-3">Sign In Required</h2>
            <p className="text-muted mb-4">Please sign in to manage your events.</p>
            <Link href="/my-events" className="text-drift-cyan hover:underline text-sm">← Back to My Events</Link>
          </div>
        </div>
      </section>
    );
  }

  return <EventCommandCenter eventId={eventId} />;
}
