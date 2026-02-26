"use client";

import { useState } from "react";
import EventMap from "@/components/EventMap";
import EventDetailModal from "@/components/EventDetailModal";
import { type DriftEvent } from "@/data/events";

export default function MapPage() {
  const [selectedEvent, setSelectedEvent] = useState<DriftEvent | null>(null);

  return (
    <div className="pt-20">
      <EventMap onSelectEvent={setSelectedEvent} />

      {selectedEvent && (
        <EventDetailModal event={selectedEvent} onClose={() => setSelectedEvent(null)} />
      )}
    </div>
  );
}
