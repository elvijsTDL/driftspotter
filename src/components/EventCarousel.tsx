"use client";

import { useRef, useState, useEffect } from "react";
import { type DriftEvent } from "@/data/events";
import { useEvents } from "@/hooks/useEvents";
import EventCard from "@/components/EventCard";

export default function EventCarousel({ onSelectEvent }: { onSelectEvent: (e: DriftEvent) => void }) {
  const { events } = useEvents();
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const hotEvents = events.filter((e) => e.isHot).concat(events.filter((e) => !e.isHot)).slice(0, 8);

  const checkScroll = () => {
    if (!scrollRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
    setCanScrollLeft(scrollLeft > 10);
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
  };

  useEffect(() => {
    checkScroll();
    const el = scrollRef.current;
    el?.addEventListener("scroll", checkScroll, { passive: true });
    return () => el?.removeEventListener("scroll", checkScroll);
  }, []);

  const scroll = (direction: "left" | "right") => {
    if (!scrollRef.current) return;
    const amount = 380;
    scrollRef.current.scrollBy({ left: direction === "left" ? -amount : amount, behavior: "smooth" });
  };

  return (
    <section className="relative py-20 md:py-28 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="flex items-end justify-between mb-10">
          <div>
            <h2 className="font-heading font-bold text-3xl md:text-4xl text-foreground tracking-tight">
              UPCOMING HOT EVENTS
            </h2>
            <div className="tire-track w-20 mt-3" />
          </div>
          <div className="hidden sm:flex gap-2">
            <button
              onClick={() => scroll("left")}
              disabled={!canScrollLeft}
              className="p-2.5 rounded-xl glass border border-border hover:border-drift-orange disabled:opacity-30 transition-all"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M15 18l-6-6 6-6" /></svg>
            </button>
            <button
              onClick={() => scroll("right")}
              disabled={!canScrollRight}
              className="p-2.5 rounded-xl glass border border-border hover:border-drift-orange disabled:opacity-30 transition-all"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M9 18l6-6-6-6" /></svg>
            </button>
          </div>
        </div>

        {/* Carousel */}
        <div
          ref={scrollRef}
          className="flex gap-5 overflow-x-auto no-scrollbar pb-4 -mx-4 px-4"
        >
          {hotEvents.map((event) => (
            <EventCard
              key={event.id}
              event={event}
              onSelect={onSelectEvent}
              className="flex-shrink-0 w-[320px] sm:w-[360px] group"
            />
          ))}
        </div>
      </div>
    </section>
  );
}
