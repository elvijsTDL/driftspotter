"use client";

import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { useMyEvents } from "@/hooks/useMyEvents";
import { statusBadge } from "@/components/ApplicantPanel";

export default function MyEventsDashboard() {
  const { user } = useAuth();
  const { events, loading } = useMyEvents();

  if (loading) {
    return (
      <section className="relative pt-28 pb-20 md:pt-32 md:pb-28">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <h1 className="font-heading font-bold text-3xl md:text-4xl text-foreground tracking-tight mb-8">MY EVENTS</h1>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-28 glass rounded-2xl animate-pulse" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="relative pt-28 pb-20 md:pt-32 md:pb-28">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <div className="mb-8">
          <h1 className="font-heading font-bold text-3xl md:text-4xl text-foreground tracking-tight">MY EVENTS</h1>
          <div className="tire-track w-20 mt-3" />
          <p className="text-muted mt-3">Open an event to post updates, review applicants and manage documents.</p>
          {user && events.length > 0 && (
            <Link href={`/organizers/${user.id}`} className="inline-flex items-center gap-1.5 mt-2 text-sm text-drift-cyan hover:underline">
              View your public organizer page
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="9 18 15 12 9 6" /></svg>
            </Link>
          )}
        </div>

        {events.length === 0 ? (
          <div className="glass rounded-2xl p-6 sm:p-12 text-center">
            <svg className="mx-auto mb-4 text-muted-dark" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" />
            </svg>
            <p className="text-muted mb-4">You haven&apos;t submitted any events yet.</p>
            <a href="/submit" className="inline-flex px-5 py-2.5 bg-drift-orange text-white rounded-xl text-sm font-semibold hover:bg-drift-orange-light transition-colors">
              Submit Your First Event
            </a>
          </div>
        ) : (
          <div className="space-y-4">
            {events.map((event) => {
              const badge = statusBadge(event.status);
              return (
                <Link
                  key={event.id}
                  href={`/my-events/${event.id}`}
                  className="group block glass rounded-2xl p-5 transition-colors hover:bg-surface-lighter/30"
                >
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        <h3 className="font-heading font-semibold text-lg text-foreground truncate">{event.name}</h3>
                        <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${badge.bg} ${badge.text} border ${badge.border} flex-shrink-0`}>
                          {badge.label}
                        </span>
                      </div>
                      <div className="flex flex-col gap-1.5 text-sm text-muted sm:flex-row sm:items-center sm:gap-4">
                        <span className="flex items-center gap-1.5">
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                            <rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" />
                          </svg>
                          {new Date(event.date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                        </span>
                        <span className="flex items-center gap-1.5">
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" />
                          </svg>
                          {event.location}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0 text-sm font-semibold text-muted transition-colors group-hover:text-drift-orange">
                      <span className="hidden sm:inline">Manage</span>
                      <span className="text-xl transition-transform group-hover:translate-x-1" aria-hidden="true">→</span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
