"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useEvents } from "@/hooks/useEvents";
import EventCard from "@/components/EventCard";
import { type DriftEvent } from "@/data/events";
import EventDetailModal from "@/components/EventDetailModal";

function getCountryName(code: string): string {
  try {
    const names = new Intl.DisplayNames(["en"], { type: "region" });
    return names.of(code.toUpperCase()) || code;
  } catch {
    return code;
  }
}

function SkeletonCard() {
  return (
    <div className="rounded-2xl overflow-hidden glass animate-pulse">
      <div className="h-48 bg-gradient-to-br from-white/5 via-white/3 to-surface" />
      <div className="p-5 space-y-3">
        <div className="h-3 w-20 bg-white/5 rounded" />
        <div className="h-5 w-3/4 bg-white/5 rounded" />
        <div className="h-3 w-1/2 bg-white/5 rounded" />
        <div className="h-3 w-2/3 bg-white/5 rounded" />
        <div className="flex gap-2 pt-1">
          <div className="h-5 w-16 bg-white/5 rounded" />
          <div className="h-5 w-14 bg-white/5 rounded" />
        </div>
        <div className="flex items-center justify-between pt-2">
          <div className="h-4 w-20 bg-white/5 rounded" />
          <div className="h-7 w-20 bg-white/5 rounded-lg" />
        </div>
      </div>
    </div>
  );
}

export default function CountryEventsPage({ country }: { country: string }) {
  const { events, loading } = useEvents();
  const [selectedEvent, setSelectedEvent] = useState<DriftEvent | null>(null);
  const countryName = getCountryName(country);

  const filtered = useMemo(
    () => events.filter((e) => e.country.toUpperCase() === country.toUpperCase()),
    [events, country]
  );

  return (
    <section className="relative pt-28 pb-20 md:pt-32 md:pb-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="mb-6 flex items-center gap-2 text-sm text-muted">
          <Link href="/events" className="hover:text-drift-orange transition-colors">Events</Link>
          <span>/</span>
          <span className="text-foreground">{countryName}</span>
        </nav>

        {/* Header */}
        <div className="mb-8">
          <h1 className="font-heading font-bold text-3xl md:text-4xl text-foreground tracking-tight">
            Drift Events in {countryName}
          </h1>
          <div className="tire-track w-20 mt-3" />
          <p className="text-muted mt-3 text-sm">
            Browse upcoming grassroots days, pro competitions, and practice sessions in {countryName}.
          </p>
        </div>

        {/* Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        ) : filtered.length > 0 ? (
          <>
            <p className="text-sm text-muted mb-6">
              <span className="text-drift-orange font-semibold">{filtered.length}</span>{" "}
              {filtered.length === 1 ? "event" : "events"} found
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map((event) => (
                <EventCard key={event.id} event={event} onSelect={setSelectedEvent} />
              ))}
            </div>
          </>
        ) : (
          <div className="glass rounded-2xl p-16 text-center">
            <svg className="mx-auto mb-4 text-muted-dark" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" />
            </svg>
            <p className="font-heading font-semibold text-lg text-foreground mb-2">
              No upcoming events in {countryName}
            </p>
            <p className="text-sm text-muted mb-4">Check back soon or browse all events.</p>
            <Link
              href="/events"
              className="inline-flex px-5 py-2.5 rounded-xl bg-drift-orange text-white text-sm font-semibold hover:bg-drift-orange-light transition-colors"
            >
              View All Events
            </Link>
          </div>
        )}
      </div>

      {selectedEvent && (
        <EventDetailModal event={selectedEvent} onClose={() => setSelectedEvent(null)} />
      )}
    </section>
  );
}
