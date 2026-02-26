"use client";

import { useRef, useState, useEffect } from "react";
import { type DriftEvent } from "@/data/events";
import { useEvents } from "@/hooks/useEvents";

const categoryColors: Record<string, { bg: string; text: string }> = {
  official: { bg: "bg-badge-official/20", text: "text-badge-official" },
  grassroots: { bg: "bg-badge-grassroots/20", text: "text-badge-grassroots" },
  proam: { bg: "bg-badge-proam/20", text: "text-badge-proam" },
  practice: { bg: "bg-badge-practice/20", text: "text-badge-practice" },
};

const categoryLabels: Record<string, string> = {
  official: "Official",
  grassroots: "Grassroots",
  proam: "Pro-Am",
  practice: "Practice",
};

const participationBadge = (p: "drive" | "watch" | "both") => {
  if (p === "drive") return { label: "Drive", bg: "bg-drift-orange", text: "text-white" };
  if (p === "watch") return { label: "Watch", bg: "bg-drift-cyan", text: "text-white" };
  return { label: "Both", bg: "bg-purple-500", text: "text-white" };
};

function EventCard({ event, onSelect }: { event: DriftEvent; onSelect: (e: DriftEvent) => void }) {
  const [going, setGoing] = useState(false);
  const cat = categoryColors[event.category];
  const pb = participationBadge(event.participation);

  const gradients = [
    "from-drift-orange/30 via-red-900/20 to-surface",
    "from-drift-cyan/20 via-blue-900/20 to-surface",
    "from-purple-600/20 via-indigo-900/20 to-surface",
    "from-green-600/20 via-emerald-900/20 to-surface",
    "from-yellow-600/20 via-amber-900/20 to-surface",
    "from-pink-600/20 via-rose-900/20 to-surface",
  ];
  const gradient = gradients[event.id.charCodeAt(0) % gradients.length];

  return (
    <div className="flex-shrink-0 w-[320px] sm:w-[360px] group">
      <div className="relative h-full rounded-2xl overflow-hidden glass hover:border-drift-orange/30 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-black/40">
        {/* Image placeholder */}
        <div className={`relative h-48 bg-gradient-to-br ${gradient} overflow-hidden`}>
          <div className="absolute inset-0 carbon-bg opacity-30" />
          {/* Track silhouette decoration */}
          <svg className="absolute bottom-0 right-0 w-32 h-32 text-white/5" viewBox="0 0 100 100">
            <path d="M10 90 Q 30 20 50 50 Q 70 80 90 30" stroke="currentColor" strokeWidth="3" fill="none" />
          </svg>
          {/* Category badge */}
          <div className="absolute top-3 left-3">
            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${cat.bg} ${cat.text}`}>
              {categoryLabels[event.category]}
            </span>
          </div>
          {/* Price */}
          {event.price && (
            <div className="absolute top-3 right-3">
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-black/60 text-foreground backdrop-blur-sm">
                {event.price}
              </span>
            </div>
          )}
          {/* Hot badge */}
          {event.isHot && (
            <div className="absolute bottom-3 left-3">
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-drift-orange text-white uppercase tracking-wider">
                Hot
              </span>
            </div>
          )}
          {/* Participation badge */}
          <div className="absolute bottom-3 right-3">
            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${pb.bg} ${pb.text} uppercase tracking-wider`}>
              {pb.label}
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="p-5">
          {event.series && (
            <p className="text-xs text-drift-orange font-medium uppercase tracking-wider mb-1">{event.series}</p>
          )}
          <h3 className="font-heading font-semibold text-lg text-foreground leading-tight mb-2 line-clamp-2">
            {event.name}
          </h3>

          {/* Date & Location */}
          <div className="flex items-center gap-2 text-sm text-muted mb-1">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" />
            </svg>
            {new Date(event.date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
            {event.endDate && ` - ${new Date(event.endDate).toLocaleDateString("en-US", { month: "short", day: "numeric" })}`}
          </div>
          <div className="flex items-center gap-2 text-sm text-muted mb-4">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" />
            </svg>
            {event.location}
          </div>

          {/* Requirement badges */}
          <div className="flex flex-wrap gap-2 mb-4">
            {event.cageRequired && (
              <span className="px-2 py-0.5 rounded text-[11px] font-medium bg-red-500/10 text-red-400 border border-red-500/20">
                Cage Required
              </span>
            )}
            <span className="px-2 py-0.5 rounded text-[11px] font-medium bg-surface-lighter text-muted border border-border">
              {event.tireSize === "unlimited" ? "Any Tires" : `${event.tireSize} Max`}
            </span>
            <span className="px-2 py-0.5 rounded text-[11px] font-medium bg-surface-lighter text-muted border border-border capitalize">
              {event.skillLevel}
            </span>
          </div>

          {/* Bottom bar */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {/* Avatar stack */}
              <div className="flex -space-x-2">
                {[0, 1, 2].map((i) => (
                  <div key={i} className="w-6 h-6 rounded-full bg-surface-lighter border-2 border-surface flex items-center justify-center text-[9px] text-muted">
                    {String.fromCharCode(65 + i + event.id.charCodeAt(0))}
                  </div>
                ))}
              </div>
              <span className="text-xs text-muted">{event.attendees} going</span>
            </div>
            <button
              onClick={(e) => { e.stopPropagation(); setGoing(!going); }}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 active:scale-95 ${
                going
                  ? "bg-drift-orange text-white"
                  : "border border-border-light text-muted hover:border-drift-orange hover:text-drift-orange"
              }`}
            >
              {going ? "Going!" : "I'm Going"}
            </button>
          </div>
        </div>

        {/* Click overlay for detail */}
        <button
          onClick={() => onSelect(event)}
          className="absolute inset-0 z-10 cursor-pointer"
          aria-label={`View ${event.name} details`}
        >
          <span className="sr-only">View details</span>
        </button>
        {/* Keep I'm Going button above overlay */}
      </div>
    </div>
  );
}

export default function EventCarousel({ onSelectEvent }: { onSelectEvent: (e: DriftEvent) => void }) {
  const { events, loading } = useEvents();
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
            <EventCard key={event.id} event={event} onSelect={onSelectEvent} />
          ))}
        </div>
      </div>
    </section>
  );
}
