"use client";

import { useState, useMemo, useCallback } from "react";
import { type DriftEvent } from "@/data/events";
import { useEvents } from "@/hooks/useEvents";
import EventDetailModal from "@/components/EventDetailModal";
import DatePicker from "@/components/DatePicker";

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

interface Filters {
  search: string;
  categories: string[];
  participation: "all" | "drive" | "watch";
  dateFrom: string;
  dateTo: string;
  sort: "date" | "popular" | "country" | "nearby";
}

function getCountryName(code: string): string {
  try {
    const names = new Intl.DisplayNames(["en"], { type: "region" });
    return names.of(code) || code;
  } catch {
    return code;
  }
}

function haversineDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) *
    Math.sin(dLng / 2) * Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function formatDistance(km: number): string {
  if (km < 1) return "< 1 km";
  if (km < 100) return `${Math.round(km)} km`;
  return `${Math.round(km).toLocaleString()} km`;
}

function EventCard({
  event,
  onSelect,
  distance,
}: {
  event: DriftEvent;
  onSelect: (e: DriftEvent) => void;
  distance?: number;
}) {
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
    <div className="group">
      <div className="relative h-full rounded-2xl overflow-hidden glass hover:border-drift-orange/30 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-black/40">
        {/* Image placeholder */}
        <div className={`relative h-48 bg-gradient-to-br ${gradient} overflow-hidden`}>
          <div className="absolute inset-0 carbon-bg opacity-30" />
          <svg className="absolute bottom-0 right-0 w-32 h-32 text-white/5" viewBox="0 0 100 100">
            <path d="M10 90 Q 30 20 50 50 Q 70 80 90 30" stroke="currentColor" strokeWidth="3" fill="none" />
          </svg>
          <div className="absolute top-3 left-3">
            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${cat.bg} ${cat.text}`}>
              {categoryLabels[event.category]}
            </span>
          </div>
          {event.price && (
            <div className="absolute top-3 right-3">
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-black/60 text-foreground backdrop-blur-sm">
                {event.price}
              </span>
            </div>
          )}
          {event.isHot && (
            <div className="absolute bottom-3 left-3">
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-drift-orange text-white uppercase tracking-wider">
                Hot
              </span>
            </div>
          )}
          <div className="absolute bottom-3 right-3 flex items-center gap-1.5">
            {distance !== undefined && (
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-black/60 text-drift-cyan uppercase tracking-wider backdrop-blur-sm">
                {formatDistance(distance)}
              </span>
            )}
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

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
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
              className={`relative z-20 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 active:scale-95 ${
                going
                  ? "bg-drift-orange text-white"
                  : "border border-border-light text-muted hover:border-drift-orange hover:text-drift-orange"
              }`}
            >
              {going ? "Going!" : "I'm Going"}
            </button>
          </div>
        </div>

        <button
          onClick={() => onSelect(event)}
          className="absolute inset-0 z-10 cursor-pointer"
          aria-label={`View ${event.name} details`}
        >
          <span className="sr-only">View details</span>
        </button>
      </div>
    </div>
  );
}

export default function EventsPage() {
  const { events, loading } = useEvents();
  const [selectedEvent, setSelectedEvent] = useState<DriftEvent | null>(null);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [geoError, setGeoError] = useState<string | null>(null);
  const [geoLoading, setGeoLoading] = useState(false);
  const [filters, setFilters] = useState<Filters>({
    search: "",
    categories: [],
    participation: "all",
    dateFrom: "",
    dateTo: "",
    sort: "date",
  });

  const toggleCategory = (cat: string) => {
    setFilters((f) => ({
      ...f,
      categories: f.categories.includes(cat)
        ? f.categories.filter((c) => c !== cat)
        : [...f.categories, cat],
    }));
  };

  const requestLocation = useCallback(() => {
    if (!navigator.geolocation) {
      setGeoError("Geolocation is not supported by your browser");
      return;
    }
    setGeoLoading(true);
    setGeoError(null);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setUserLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        setFilters((f) => ({ ...f, sort: "nearby" }));
        setGeoLoading(false);
      },
      (err) => {
        setGeoError(err.code === 1 ? "Location access denied" : "Could not get your location");
        setGeoLoading(false);
      },
      { enableHighAccuracy: false, timeout: 10000 }
    );
  }, []);

  const distanceMap = useMemo(() => {
    if (!userLocation) return new Map<string, number>();
    const map = new Map<string, number>();
    events.forEach((e) => {
      map.set(e.id, haversineDistance(userLocation.lat, userLocation.lng, e.lat, e.lng));
    });
    return map;
  }, [events, userLocation]);

  const filteredEvents = useMemo(() => {
    let result = events.filter((e) => {
      if (filters.search && !e.name.toLowerCase().includes(filters.search.toLowerCase()) && !e.location.toLowerCase().includes(filters.search.toLowerCase())) return false;
      if (filters.categories.length > 0 && !filters.categories.includes(e.category)) return false;
      if (filters.participation === "drive" && e.participation === "watch") return false;
      if (filters.participation === "watch" && e.participation === "drive") return false;
      if (filters.dateFrom && e.date < filters.dateFrom) return false;
      if (filters.dateTo && e.date > filters.dateTo) return false;
      return true;
    });

    if (filters.sort === "date") {
      result.sort((a, b) => a.date.localeCompare(b.date));
    } else if (filters.sort === "popular") {
      result.sort((a, b) => b.attendees - a.attendees);
    } else if (filters.sort === "country") {
      result.sort((a, b) => {
        const countryCompare = getCountryName(a.country).localeCompare(getCountryName(b.country));
        if (countryCompare !== 0) return countryCompare;
        return a.date.localeCompare(b.date);
      });
    } else if (filters.sort === "nearby" && userLocation) {
      result.sort((a, b) => {
        const distA = distanceMap.get(a.id) ?? Infinity;
        const distB = distanceMap.get(b.id) ?? Infinity;
        return distA - distB;
      });
    }

    return result;
  }, [events, filters, userLocation, distanceMap]);

  const countryGroups = useMemo(() => {
    if (filters.sort !== "country") return null;
    const groups: { country: string; name: string; events: DriftEvent[] }[] = [];
    let currentCountry = "";
    for (const event of filteredEvents) {
      if (event.country !== currentCountry) {
        currentCountry = event.country;
        groups.push({ country: currentCountry, name: getCountryName(currentCountry), events: [] });
      }
      groups[groups.length - 1].events.push(event);
    }
    return groups;
  }, [filteredEvents, filters.sort]);

  const activeFilterCount = [
    filters.search,
    filters.categories.length > 0,
    filters.participation !== "all",
    filters.dateFrom,
    filters.dateTo,
  ].filter(Boolean).length;

  return (
    <section className="relative pt-28 pb-20 md:pt-32 md:pb-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-end justify-between mb-8">
          <div>
            <h2 className="font-heading font-bold text-3xl md:text-4xl text-foreground tracking-tight">
              ALL EVENTS
            </h2>
            <div className="tire-track w-20 mt-3" />
          </div>
          <div className="flex items-center gap-3">
            {/* Sort */}
            <div className="hidden sm:flex items-center gap-2">
              <span className="text-xs text-muted uppercase tracking-wider">Sort:</span>
              <button
                onClick={() => setFilters((f) => ({ ...f, sort: "date" }))}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  filters.sort === "date" ? "bg-drift-orange text-white" : "glass text-muted hover:text-foreground"
                }`}
              >
                Soonest
              </button>
              <button
                onClick={() => setFilters((f) => ({ ...f, sort: "popular" }))}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  filters.sort === "popular" ? "bg-drift-orange text-white" : "glass text-muted hover:text-foreground"
                }`}
              >
                Most Popular
              </button>
              <button
                onClick={() => setFilters((f) => ({ ...f, sort: "country" }))}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  filters.sort === "country" ? "bg-drift-orange text-white" : "glass text-muted hover:text-foreground"
                }`}
              >
                By Country
              </button>
              <button
                onClick={() => {
                  if (userLocation) {
                    setFilters((f) => ({ ...f, sort: "nearby" }));
                  } else {
                    requestLocation();
                  }
                }}
                disabled={geoLoading}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 ${
                  filters.sort === "nearby" ? "bg-drift-cyan text-white" : "glass text-muted hover:text-foreground"
                } ${geoLoading ? "opacity-50 cursor-wait" : ""}`}
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <circle cx="12" cy="12" r="10" /><circle cx="12" cy="12" r="3" /><line x1="12" y1="2" x2="12" y2="6" /><line x1="12" y1="18" x2="12" y2="22" /><line x1="2" y1="12" x2="6" y2="12" /><line x1="18" y1="12" x2="22" y2="12" />
                </svg>
                {geoLoading ? "Locating..." : "Near Me"}
              </button>
            </div>
            {/* Filter toggle */}
            <button
              onClick={() => setFiltersOpen(!filtersOpen)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                filtersOpen || activeFilterCount > 0
                  ? "bg-drift-orange text-white"
                  : "glass text-muted hover:text-foreground"
              }`}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <line x1="4" y1="6" x2="20" y2="6" />
                <line x1="8" y1="12" x2="20" y2="12" />
                <line x1="12" y1="18" x2="20" y2="18" />
              </svg>
              Filters
              {activeFilterCount > 0 && (
                <span className="w-5 h-5 rounded-full bg-white/20 text-[10px] font-bold flex items-center justify-center">
                  {activeFilterCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Geo error message */}
        {geoError && (
          <div className="mb-4 px-4 py-2.5 rounded-xl bg-red-500/10 border border-red-500/20 text-sm text-red-400 flex items-center gap-2">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
            {geoError}
            <button onClick={() => setGeoError(null)} className="ml-auto text-red-400 hover:text-red-300">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>
        )}

        {/* Filter bar */}
        <div className={`transition-all duration-300 overflow-hidden ${filtersOpen ? "max-h-[500px] opacity-100 mb-8" : "max-h-0 opacity-0"}`}>
          <div className="glass rounded-2xl p-5 space-y-5">
            {/* Row 1: Search + Date Range */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {/* Search */}
              <div className="relative">
                <svg className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-dark pointer-events-none" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" /></svg>
                <input
                  type="text"
                  placeholder="Search events or locations..."
                  value={filters.search}
                  onChange={(e) => setFilters((f) => ({ ...f, search: e.target.value }))}
                  className="w-full pl-10 pr-4 py-2.5 bg-surface-lighter border border-border rounded-xl text-sm text-foreground placeholder:text-muted-dark focus:outline-none focus:border-drift-orange transition-colors"
                />
              </div>
              {/* Date From */}
              <div>
                <label className="text-xs text-muted uppercase tracking-wider font-medium mb-1.5 block">From</label>
                <DatePicker
                  value={filters.dateFrom}
                  onChange={(v) => setFilters((f) => ({ ...f, dateFrom: v }))}
                  placeholder="Start date"
                />
              </div>
              {/* Date To */}
              <div>
                <label className="text-xs text-muted uppercase tracking-wider font-medium mb-1.5 block">To</label>
                <DatePicker
                  value={filters.dateTo}
                  onChange={(v) => setFilters((f) => ({ ...f, dateTo: v }))}
                  placeholder="End date"
                />
              </div>
            </div>

            {/* Row 2: Category + Participation */}
            <div className="flex flex-wrap items-center gap-4">
              {/* Categories */}
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs text-muted uppercase tracking-wider font-medium">Category:</span>
                {Object.entries(categoryLabels).map(([key, label]) => (
                  <button
                    key={key}
                    onClick={() => toggleCategory(key)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                      filters.categories.includes(key)
                        ? `${categoryColors[key].bg} ${categoryColors[key].text} ring-1 ring-current`
                        : "bg-surface-lighter text-muted hover:text-foreground"
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>

              <div className="w-px h-6 bg-border hidden sm:block" />

              {/* Participation */}
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted uppercase tracking-wider font-medium">I want to:</span>
                {([
                  { v: "all" as const, l: "All", active: "bg-white/10 text-foreground" },
                  { v: "drive" as const, l: "Drive", active: "bg-drift-orange text-white" },
                  { v: "watch" as const, l: "Watch", active: "bg-drift-cyan text-white" },
                ] as const).map(({ v, l, active }) => (
                  <button
                    key={v}
                    onClick={() => setFilters((f) => ({ ...f, participation: v }))}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                      filters.participation === v ? active : "bg-surface-lighter text-muted hover:text-foreground"
                    }`}
                  >
                    {l}
                  </button>
                ))}
              </div>

              <div className="w-px h-6 bg-border hidden sm:block" />

              {/* Mobile sort */}
              <div className="flex sm:hidden items-center gap-2 flex-wrap">
                <span className="text-xs text-muted uppercase tracking-wider font-medium">Sort:</span>
                <button
                  onClick={() => setFilters((f) => ({ ...f, sort: "date" }))}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    filters.sort === "date" ? "bg-drift-orange text-white" : "bg-surface-lighter text-muted"
                  }`}
                >
                  Soonest
                </button>
                <button
                  onClick={() => setFilters((f) => ({ ...f, sort: "popular" }))}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    filters.sort === "popular" ? "bg-drift-orange text-white" : "bg-surface-lighter text-muted"
                  }`}
                >
                  Popular
                </button>
                <button
                  onClick={() => setFilters((f) => ({ ...f, sort: "country" }))}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    filters.sort === "country" ? "bg-drift-orange text-white" : "bg-surface-lighter text-muted"
                  }`}
                >
                  By Country
                </button>
                <button
                  onClick={() => {
                    if (userLocation) {
                      setFilters((f) => ({ ...f, sort: "nearby" }));
                    } else {
                      requestLocation();
                    }
                  }}
                  disabled={geoLoading}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 ${
                    filters.sort === "nearby" ? "bg-drift-cyan text-white" : "bg-surface-lighter text-muted"
                  } ${geoLoading ? "opacity-50 cursor-wait" : ""}`}
                >
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                    <circle cx="12" cy="12" r="10" /><circle cx="12" cy="12" r="3" /><line x1="12" y1="2" x2="12" y2="6" /><line x1="12" y1="18" x2="12" y2="22" /><line x1="2" y1="12" x2="6" y2="12" /><line x1="18" y1="12" x2="22" y2="12" />
                  </svg>
                  {geoLoading ? "Locating..." : "Near Me"}
                </button>
              </div>

              {/* Clear all */}
              {activeFilterCount > 0 && (
                <button
                  onClick={() => setFilters({ search: "", categories: [], participation: "all", dateFrom: "", dateTo: "", sort: filters.sort })}
                  className="ml-auto text-xs text-drift-orange hover:underline"
                >
                  Clear filters
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Results count */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-sm text-muted">
            <span className="text-drift-orange font-semibold">{filteredEvents.length}</span> events found
            {filters.sort === "country" && countryGroups && (
              <span className="text-muted-dark"> across {countryGroups.length} {countryGroups.length === 1 ? "country" : "countries"}</span>
            )}
            {filters.sort === "nearby" && userLocation && (
              <span className="text-drift-cyan"> sorted by distance</span>
            )}
          </p>
        </div>

        {/* Grid */}
        {filteredEvents.length > 0 ? (
          filters.sort === "country" && countryGroups ? (
            <div className="space-y-10">
              {countryGroups.map((group) => (
                <div key={group.country}>
                  <div className="flex items-center gap-3 mb-5">
                    <h3 className="font-heading font-semibold text-xl text-foreground">
                      {group.name}
                    </h3>
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-surface-lighter text-muted border border-border">
                      {group.events.length} {group.events.length === 1 ? "event" : "events"}
                    </span>
                    <div className="flex-1 h-px bg-border" />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {group.events.map((event) => (
                      <EventCard
                        key={event.id}
                        event={event}
                        onSelect={setSelectedEvent}
                        distance={filters.sort === "nearby" ? distanceMap.get(event.id) : undefined}
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredEvents.map((event) => (
                <EventCard
                  key={event.id}
                  event={event}
                  onSelect={setSelectedEvent}
                  distance={filters.sort === "nearby" ? distanceMap.get(event.id) : undefined}
                />
              ))}
            </div>
          )
        ) : (
          <div className="glass rounded-2xl p-16 text-center">
            <svg className="mx-auto mb-4 text-muted-dark" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" />
            </svg>
            <p className="font-heading font-semibold text-lg text-foreground mb-2">No events found</p>
            <p className="text-sm text-muted">Try adjusting your filters or date range.</p>
          </div>
        )}
      </div>

      {selectedEvent && (
        <EventDetailModal event={selectedEvent} onClose={() => setSelectedEvent(null)} />
      )}
    </section>
  );
}
