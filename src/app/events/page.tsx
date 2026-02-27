"use client";

import { useState, useMemo, useCallback, useEffect } from "react";
import { type DriftEvent } from "@/data/events";
import { useEvents } from "@/hooks/useEvents";
import EventDetailModal from "@/components/EventDetailModal";
import EventCard from "@/components/EventCard";
import { categoryColors, categoryLabels } from "@/components/EventCard";
import DatePicker from "@/components/DatePicker";

type TimeRange = "week" | "month" | "all";

const EVENTS_PER_PAGE = 12;

function getWeekRange(): { from: string; to: string } {
  const now = new Date();
  const from = now.toISOString().split("T")[0];
  const dayOfWeek = now.getDay();
  const daysUntilSunday = dayOfWeek === 0 ? 0 : 7 - dayOfWeek;
  const endOfWeek = new Date(now);
  endOfWeek.setDate(now.getDate() + daysUntilSunday);
  return { from, to: endOfWeek.toISOString().split("T")[0] };
}

function getMonthRange(): { from: string; to: string } {
  const now = new Date();
  const from = now.toISOString().split("T")[0];
  const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);
  return { from, to: endOfMonth.toISOString().split("T")[0] };
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

function SkeletonGrid() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: 6 }).map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  );
}


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


export default function EventsPage() {
  const { events, loading } = useEvents();
  const [selectedEvent, setSelectedEvent] = useState<DriftEvent | null>(null);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [geoError, setGeoError] = useState<string | null>(null);
  const [geoLoading, setGeoLoading] = useState(false);
  const [timeRange, setTimeRange] = useState<TimeRange>("week");
  const [page, setPage] = useState(1);

  const initialWeek = useMemo(() => getWeekRange(), []);
  const [filters, setFilters] = useState<Filters>({
    search: "",
    categories: [],
    participation: "all",
    dateFrom: initialWeek.from,
    dateTo: initialWeek.to,
    sort: "date",
  });

  const handleTimeRange = useCallback((range: TimeRange) => {
    setTimeRange(range);
    if (range === "week") {
      const { from, to } = getWeekRange();
      setFilters((f) => ({ ...f, dateFrom: from, dateTo: to }));
    } else if (range === "month") {
      const { from, to } = getMonthRange();
      setFilters((f) => ({ ...f, dateFrom: from, dateTo: to }));
    } else {
      const from = new Date().toISOString().split("T")[0];
      setFilters((f) => ({ ...f, dateFrom: from, dateTo: "" }));
    }
  }, []);

  // Reset page to 1 when filters change
  useEffect(() => {
    setPage(1);
  }, [filters]);

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
                  onChange={(v) => { setTimeRange("all"); setFilters((f) => ({ ...f, dateFrom: v })); }}
                  placeholder="Start date"
                />
              </div>
              {/* Date To */}
              <div>
                <label className="text-xs text-muted uppercase tracking-wider font-medium mb-1.5 block">To</label>
                <DatePicker
                  value={filters.dateTo}
                  onChange={(v) => { setTimeRange("all"); setFilters((f) => ({ ...f, dateTo: v })); }}
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
                  onClick={() => { setTimeRange("all"); setFilters({ search: "", categories: [], participation: "all", dateFrom: new Date().toISOString().split("T")[0], dateTo: "", sort: filters.sort }); }}
                  className="ml-auto text-xs text-drift-orange hover:underline"
                >
                  Clear filters
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Time range tabs */}
        <div className="flex items-center gap-1 mb-6 p-1 glass rounded-xl w-fit">
          {([
            { key: "week" as TimeRange, label: "This Week" },
            { key: "month" as TimeRange, label: "This Month" },
            { key: "all" as TimeRange, label: "All Upcoming" },
          ]).map(({ key, label }) => (
            <button
              key={key}
              onClick={() => handleTimeRange(key)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                timeRange === key
                  ? "bg-drift-orange text-white shadow-lg shadow-drift-orange/20"
                  : "text-muted hover:text-foreground"
              }`}
            >
              {label}
            </button>
          ))}
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
        {loading ? (
          <SkeletonGrid />
        ) : filteredEvents.length > 0 ? (
          filters.sort === "country" && countryGroups ? (
            (() => {
              // Paginate across all country-grouped events
              const allGroupedEvents = countryGroups.flatMap((g) => g.events);
              const totalPages = Math.ceil(allGroupedEvents.length / EVENTS_PER_PAGE);
              const startIdx = (page - 1) * EVENTS_PER_PAGE;
              const endIdx = startIdx + EVENTS_PER_PAGE;
              const pageEvents = new Set(allGroupedEvents.slice(startIdx, endIdx).map((e) => e.id));

              // Filter groups to only include events on the current page
              const pagedGroups = countryGroups
                .map((g) => ({ ...g, events: g.events.filter((e) => pageEvents.has(e.id)) }))
                .filter((g) => g.events.length > 0);

              return (
                <>
                  <div className="space-y-10">
                    {pagedGroups.map((group) => (
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
                  {totalPages > 1 && (
                    <div className="flex items-center justify-center gap-3 mt-10">
                      <button
                        onClick={() => setPage((p) => Math.max(1, p - 1))}
                        disabled={page === 1}
                        className="px-4 py-2 rounded-xl text-sm font-medium glass text-muted hover:text-foreground transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                      >
                        Previous
                      </button>
                      <span className="text-sm text-muted">
                        Page <span className="text-foreground font-semibold">{page}</span> of{" "}
                        <span className="text-foreground font-semibold">{totalPages}</span>
                      </span>
                      <button
                        onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                        disabled={page === totalPages}
                        className="px-4 py-2 rounded-xl text-sm font-medium glass text-muted hover:text-foreground transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                      >
                        Next
                      </button>
                    </div>
                  )}
                </>
              );
            })()
          ) : (
            (() => {
              const totalPages = Math.ceil(filteredEvents.length / EVENTS_PER_PAGE);
              const paginatedEvents = filteredEvents.slice(
                (page - 1) * EVENTS_PER_PAGE,
                page * EVENTS_PER_PAGE
              );
              return (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {paginatedEvents.map((event) => (
                      <EventCard
                        key={event.id}
                        event={event}
                        onSelect={setSelectedEvent}
                        distance={filters.sort === "nearby" ? distanceMap.get(event.id) : undefined}
                      />
                    ))}
                  </div>
                  {totalPages > 1 && (
                    <div className="flex items-center justify-center gap-3 mt-10">
                      <button
                        onClick={() => setPage((p) => Math.max(1, p - 1))}
                        disabled={page === 1}
                        className="px-4 py-2 rounded-xl text-sm font-medium glass text-muted hover:text-foreground transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                      >
                        Previous
                      </button>
                      <span className="text-sm text-muted">
                        Page <span className="text-foreground font-semibold">{page}</span> of{" "}
                        <span className="text-foreground font-semibold">{totalPages}</span>
                      </span>
                      <button
                        onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                        disabled={page === totalPages}
                        className="px-4 py-2 rounded-xl text-sm font-medium glass text-muted hover:text-foreground transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                      >
                        Next
                      </button>
                    </div>
                  )}
                </>
              );
            })()
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
