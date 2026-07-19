"use client";

import { useState } from "react";
import Hero from "@/components/Hero";
import EventCarousel from "@/components/EventCarousel";
import LandingShowcase from "@/components/LandingShowcase";
import EventDetailModal from "@/components/EventDetailModal";
import { type DriftEvent } from "@/data/events";

export default function Home() {
  const [selectedEvent, setSelectedEvent] = useState<DriftEvent | null>(null);

  return (
    <>
      <Hero />

      {/* How-It-Works-style backdrop: diagonal speed lines + soft glow orbs
          behind everything below the hero (the hero paints its own bg) */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 speed-lines pointer-events-none" />
        <div className="absolute -top-24 right-0 w-[500px] h-[500px] bg-drift-orange/10 rounded-full blur-[140px] pointer-events-none" />
        <div className="absolute bottom-0 -left-40 w-[450px] h-[450px] bg-drift-cyan/5 rounded-full blur-[140px] pointer-events-none" />

        <EventCarousel onSelectEvent={setSelectedEvent} />
        <LandingShowcase />
      </div>

      {selectedEvent && (
        <EventDetailModal event={selectedEvent} onClose={() => setSelectedEvent(null)} />
      )}
    </>
  );
}
