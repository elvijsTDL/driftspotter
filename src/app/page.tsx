"use client";

import { useState } from "react";
import Hero from "@/components/Hero";
import EventCarousel from "@/components/EventCarousel";
import VideoHighlights from "@/components/VideoHighlights";
import EventDetailModal from "@/components/EventDetailModal";
import { type DriftEvent } from "@/data/events";

export default function Home() {
  const [selectedEvent, setSelectedEvent] = useState<DriftEvent | null>(null);

  return (
    <>
      <Hero />
      <EventCarousel onSelectEvent={setSelectedEvent} />
      <VideoHighlights />

      {selectedEvent && (
        <EventDetailModal event={selectedEvent} onClose={() => setSelectedEvent(null)} />
      )}
    </>
  );
}
