"use client";

import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { type DriftEvent } from "@/data/events";
import { useEvents } from "@/hooks/useEvents";
import DatePicker from "@/components/DatePicker";

const categoryLabels: Record<string, string> = {
  official: "Official",
  grassroots: "Grassroots",
  proam: "Pro-Am",
  practice: "Practice",
};

const categoryColors: Record<string, string> = {
  official: "#FFD700",
  grassroots: "#22C55E",
  proam: "#3B82F6",
  practice: "#6B7280",
};

interface Filters {
  categories: string[];
  cageRequired: string;
  tireSize: string;
  skillLevel: string;
  search: string;
  participation: "all" | "drive" | "watch";
  dateFrom: string;
  dateTo: string;
}

const participationBadge = (p: "drive" | "watch" | "both") => {
  if (p === "drive") return { label: "Drive", color: "#FF6B00", bg: "#FF6B0020" };
  if (p === "watch") return { label: "Watch", color: "#00D4FF", bg: "#00D4FF20" };
  return { label: "Both", color: "#A855F7", bg: "#A855F720" };
};

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

function MiniEventCard({ event, onSelect, distance }: { event: DriftEvent; onSelect: (e: DriftEvent) => void; distance?: number }) {
  const color = categoryColors[event.category];
  const pb = participationBadge(event.participation);
  return (
    <button
      onClick={() => onSelect(event)}
      className="w-full text-left p-3 rounded-xl glass-light hover:border-drift-orange/30 border border-transparent transition-all group"
    >
      <div className="flex items-start gap-3">
        <div className="w-2 h-2 rounded-full mt-2 flex-shrink-0" style={{ backgroundColor: color }} />
        <div className="min-w-0">
          <p className="font-heading font-semibold text-sm text-foreground truncate group-hover:text-drift-orange transition-colors">
            {event.name}
          </p>
          <p className="text-xs text-muted mt-0.5">
            {new Date(event.date).toLocaleDateString("en-US", { month: "short", day: "numeric" })} · {event.location}
          </p>
          <div className="flex items-center gap-2 mt-1.5">
            <span className="text-[10px] font-medium px-1.5 py-0.5 rounded" style={{ backgroundColor: `${color}20`, color }}>
              {categoryLabels[event.category]}
            </span>
            <span className="text-[10px] font-medium px-1.5 py-0.5 rounded" style={{ backgroundColor: pb.bg, color: pb.color }}>
              {pb.label}
            </span>
            <span className="text-[10px] text-muted">{event.attendees} going</span>
            {distance !== undefined && (
              <span className="text-[10px] font-medium text-drift-cyan">{formatDistance(distance)}</span>
            )}
          </div>
        </div>
      </div>
    </button>
  );
}

function CalendarView({ filteredEvents, onSelect }: { filteredEvents: DriftEvent[]; onSelect: (e: DriftEvent) => void }) {
  const [currentMonth, setCurrentMonth] = useState(new Date(2026, 4, 1)); // May 2026

  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const days = [];
  for (let i = 0; i < firstDay; i++) days.push(null);
  for (let i = 1; i <= daysInMonth; i++) days.push(i);

  const getEventsForDay = (day: number) => {
    const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    return filteredEvents.filter((e) => {
      if (e.date === dateStr) return true;
      if (e.endDate && e.date <= dateStr && e.endDate >= dateStr) return true;
      return false;
    });
  };

  return (
    <div className="mt-6 glass rounded-2xl p-5">
      <div className="flex items-center justify-between mb-4">
        <button onClick={() => setCurrentMonth(new Date(year, month - 1, 1))} className="p-2 hover:bg-surface-lighter rounded-lg transition-colors">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M15 18l-6-6 6-6" /></svg>
        </button>
        <h3 className="font-heading font-semibold text-lg">
          {currentMonth.toLocaleDateString("en-US", { month: "long", year: "numeric" })}
        </h3>
        <button onClick={() => setCurrentMonth(new Date(year, month + 1, 1))} className="p-2 hover:bg-surface-lighter rounded-lg transition-colors">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 18l6-6-6-6" /></svg>
        </button>
      </div>
      <div className="grid grid-cols-7 gap-1">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
          <div key={d} className="text-center text-xs text-muted-dark font-medium py-2">{d}</div>
        ))}
        {days.map((day, i) => {
          const dayEvents = day ? getEventsForDay(day) : [];
          return (
            <div
              key={i}
              className={`relative min-h-[40px] rounded-lg flex flex-col items-center justify-center text-sm transition-colors ${
                day ? "hover:bg-surface-lighter cursor-pointer" : ""
              } ${dayEvents.length > 0 ? "bg-surface-lighter" : ""}`}
              onClick={() => dayEvents.length > 0 && onSelect(dayEvents[0])}
            >
              {day && (
                <>
                  <span className={dayEvents.length > 0 ? "text-foreground font-medium" : "text-muted"}>{day}</span>
                  {dayEvents.length > 0 && (
                    <div className="flex gap-0.5 mt-0.5">
                      {dayEvents.slice(0, 3).map((e) => (
                        <div key={e.id} className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: categoryColors[e.category] }} />
                      ))}
                    </div>
                  )}
                </>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function EventMap({ onSelectEvent }: { onSelectEvent: (e: DriftEvent) => void }) {
  const { events } = useEvents();
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<unknown>(null);
  const markersRef = useRef<Map<string, { getElement: () => HTMLElement; remove: () => void }>>(new Map());
  const userMarkerRef = useRef<{ remove: () => void } | null>(null);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [viewMode, setViewMode] = useState<"map" | "calendar">("map");
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [geoLoading, setGeoLoading] = useState(false);
  const [sortByDistance, setSortByDistance] = useState(false);
  const [filters, setFilters] = useState<Filters>({
    categories: [],
    cageRequired: "all",
    tireSize: "all",
    skillLevel: "all",
    search: "",
    participation: "all",
    dateFrom: "",
    dateTo: "",
  });

  const distanceMap = useMemo(() => {
    if (!userLocation) return new Map<string, number>();
    const map = new Map<string, number>();
    events.forEach((e) => {
      map.set(e.id, haversineDistance(userLocation.lat, userLocation.lng, e.lat, e.lng));
    });
    return map;
  }, [events, userLocation]);

  const filteredEvents = useMemo(() => {
    const result = events.filter((e) => {
      if (filters.categories.length > 0 && !filters.categories.includes(e.category)) return false;
      if (filters.cageRequired === "yes" && !e.cageRequired) return false;
      if (filters.cageRequired === "no" && e.cageRequired) return false;
      if (filters.tireSize !== "all" && e.tireSize !== filters.tireSize) return false;
      if (filters.skillLevel !== "all" && e.skillLevel !== filters.skillLevel) return false;
      if (filters.search && !e.name.toLowerCase().includes(filters.search.toLowerCase()) && !e.location.toLowerCase().includes(filters.search.toLowerCase())) return false;
      if (filters.participation === "drive" && e.participation === "watch") return false;
      if (filters.participation === "watch" && e.participation === "drive") return false;
      if (filters.dateFrom && e.date < filters.dateFrom) return false;
      if (filters.dateTo && e.date > filters.dateTo) return false;
      return true;
    });
    if (sortByDistance && userLocation) {
      result.sort((a, b) => {
        const distA = distanceMap.get(a.id) ?? Infinity;
        const distB = distanceMap.get(b.id) ?? Infinity;
        return distA - distB;
      });
    } else {
      result.sort((a, b) => a.date.localeCompare(b.date));
    }
    return result;
  }, [events, filters, sortByDistance, userLocation, distanceMap]);

  const filteredIds = useMemo(() => new Set(filteredEvents.map((e) => e.id)), [filteredEvents]);

  // Sync marker visibility with filters
  useEffect(() => {
    markersRef.current.forEach((marker, eventId) => {
      const el = marker.getElement();
      el.style.display = filteredIds.has(eventId) ? "flex" : "none";
    });
  }, [filteredIds]);

  const toggleCategory = (cat: string) => {
    setFilters((f) => ({
      ...f,
      categories: f.categories.includes(cat)
        ? f.categories.filter((c) => c !== cat)
        : [...f.categories, cat],
    }));
  };

  const requestLocation = useCallback(() => {
    if (!navigator.geolocation) return;
    setGeoLoading(true);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const loc = { lat: pos.coords.latitude, lng: pos.coords.longitude };
        setUserLocation(loc);
        setSortByDistance(true);
        setGeoLoading(false);

        // Center map and add user marker
        const map = mapRef.current;
        if (map) {
          const maplibregl = (await import("maplibre-gl")).default;
          (map as maplibregl.Map).flyTo({ center: [loc.lng, loc.lat], zoom: 5 });

          // Remove old user marker if exists
          if (userMarkerRef.current) userMarkerRef.current.remove();

          const el = document.createElement("div");
          el.style.cssText = `
            width: 20px; height: 20px; border-radius: 50%;
            background: #00D4FF; border: 3px solid #0a0a0a;
            box-shadow: 0 0 16px #00D4FF88, 0 0 40px #00D4FF44;
          `;
          const marker = new maplibregl.Marker({ element: el })
            .setLngLat([loc.lng, loc.lat])
            .addTo(map as maplibregl.Map);
          userMarkerRef.current = marker;
        }
      },
      () => {
        setGeoLoading(false);
      },
      { enableHighAccuracy: false, timeout: 10000 }
    );
  }, []);

  const initMap = useCallback(async () => {
    if (!mapContainerRef.current || mapRef.current) return;
    try {
      const maplibregl = (await import("maplibre-gl")).default;
      const map = new maplibregl.Map({
        container: mapContainerRef.current,
        style: {
          version: 8,
          sources: {
            "osm-tiles": {
              type: "raster",
              tiles: [
                "https://a.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}@2x.png",
              ],
              tileSize: 256,
              attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>',
            },
          },
          layers: [
            {
              id: "osm-tiles",
              type: "raster",
              source: "osm-tiles",
              minzoom: 0,
              maxzoom: 19,
            },
          ],
        },
        center: [15, 48],
        zoom: 3,
      });
      map.addControl(new maplibregl.NavigationControl(), "bottom-right");
      mapRef.current = map;
    } catch (err) {
      console.error("Map init error:", err);
    }
  }, []);

  useEffect(() => {
    if (viewMode === "map") initMap();
  }, [viewMode, initMap]);

  // Add markers when events load or change
  useEffect(() => {
    const map = mapRef.current;
    if (!map || events.length === 0) return;

    // Clear existing markers
    markersRef.current.forEach((marker) => (marker as { remove: () => void }).remove());
    markersRef.current.clear();

    const addMarkers = async () => {
      const maplibregl = (await import("maplibre-gl")).default;

      events.forEach((event) => {
        const color = categoryColors[event.category];
        const el = document.createElement("div");
        el.className = "drift-marker";
        el.style.cssText = `
          width: 36px; height: 36px; cursor: pointer;
          display: flex; align-items: center; justify-content: center;
        `;
        const dot = document.createElement("div");
        dot.style.cssText = `
          width: 18px; height: 18px; border-radius: 50%;
          background: ${color}; border: 3px solid #0a0a0a;
          box-shadow: 0 0 12px ${color}66, 0 2px 8px rgba(0,0,0,0.5);
          transition: width 0.2s, height 0.2s, box-shadow 0.2s;
        `;
        el.appendChild(dot);
        el.addEventListener("mouseenter", () => {
          dot.style.width = "24px";
          dot.style.height = "24px";
          dot.style.boxShadow = `0 0 20px ${color}99, 0 2px 12px rgba(0,0,0,0.6)`;
        });
        el.addEventListener("mouseleave", () => {
          dot.style.width = "18px";
          dot.style.height = "18px";
          dot.style.boxShadow = `0 0 12px ${color}66, 0 2px 8px rgba(0,0,0,0.5)`;
        });

        const pb = participationBadge(event.participation);
        const popup = new maplibregl.Popup({ offset: 15, closeButton: false, className: "drift-popup" })
          .setHTML(`
            <div style="background:#111;padding:12px 16px;border-radius:12px;min-width:200px;border:1px solid #2a2a2a;">
              <div style="display:flex;align-items:center;gap:6px;margin-bottom:6px;">
                <span style="display:inline-block;width:8px;height:8px;border-radius:50%;background:${color};"></span>
                <span style="font-size:11px;color:${color};font-weight:600;text-transform:uppercase;letter-spacing:0.05em;">${categoryLabels[event.category]}</span>
                <span style="font-size:10px;font-weight:600;padding:2px 6px;border-radius:4px;background:${pb.bg};color:${pb.color};margin-left:auto;">${pb.label}</span>
              </div>
              <p style="font-family:'Chakra Petch',sans-serif;font-weight:600;color:#f5f5f5;font-size:14px;line-height:1.3;margin-bottom:6px;">${event.name}</p>
              <p style="font-size:12px;color:#888;margin-bottom:4px;">${new Date(event.date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</p>
              <p style="font-size:12px;color:#888;margin-bottom:10px;">${event.location}</p>
              <button onclick="window.dispatchEvent(new CustomEvent('selectEvent',{detail:'${event.id}'}))" style="width:100%;padding:6px 12px;background:#FF6B00;color:white;border:none;border-radius:8px;font-size:12px;font-weight:600;cursor:pointer;font-family:'Chakra Petch',sans-serif;">View Details</button>
            </div>
          `);

        const marker = new maplibregl.Marker({ element: el })
          .setLngLat([event.lng, event.lat])
          .setPopup(popup)
          .addTo(map as maplibregl.Map);

        markersRef.current.set(event.id, marker);
      });
    };

    addMarkers();
  }, [events]);

  useEffect(() => {
    const handler = (e: Event) => {
      const id = (e as CustomEvent).detail;
      const event = events.find((ev) => ev.id === id);
      if (event) onSelectEvent(event);
    };
    window.addEventListener("selectEvent", handler);
    return () => window.removeEventListener("selectEvent", handler);
  }, [events, onSelectEvent]);

  return (
    <section className="relative py-20 md:py-28">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-8">
          <div>
            <h2 className="font-heading font-bold text-3xl md:text-4xl text-foreground tracking-tight">
              FIND YOUR NEXT EVENT
            </h2>
            <div className="tire-track w-20 mt-3" />
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setFiltersOpen(!filtersOpen)}
              className="lg:hidden px-4 py-2 rounded-lg text-sm font-medium transition-all glass text-muted hover:text-foreground flex items-center gap-2"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="4" y1="6" x2="20" y2="6" /><line x1="4" y1="12" x2="14" y2="12" /><line x1="4" y1="18" x2="10" y2="18" /></svg>
              Filters
            </button>
            <button
              onClick={() => {
                if (userLocation) {
                  setSortByDistance(!sortByDistance);
                } else {
                  requestLocation();
                }
              }}
              disabled={geoLoading}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-1.5 ${
                sortByDistance ? "bg-drift-cyan text-white" : "glass text-muted hover:text-foreground"
              } ${geoLoading ? "opacity-50 cursor-wait" : ""}`}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <circle cx="12" cy="12" r="10" /><circle cx="12" cy="12" r="3" /><line x1="12" y1="2" x2="12" y2="6" /><line x1="12" y1="18" x2="12" y2="22" /><line x1="2" y1="12" x2="6" y2="12" /><line x1="18" y1="12" x2="22" y2="12" />
              </svg>
              {geoLoading ? "Locating..." : "Near Me"}
            </button>
            <button
              onClick={() => setViewMode("map")}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${viewMode === "map" ? "bg-drift-orange text-white" : "glass text-muted hover:text-foreground"}`}
            >
              Map
            </button>
            <button
              onClick={() => setViewMode("calendar")}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${viewMode === "calendar" ? "bg-drift-orange text-white" : "glass text-muted hover:text-foreground"}`}
            >
              Calendar
            </button>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-5">
          {/* Sidebar filters */}
          <div className={`${filtersOpen ? "block" : "hidden"} lg:block lg:w-80 flex-shrink-0 transition-all duration-300 overflow-visible`}>
            <div className="glass rounded-2xl p-5 space-y-5">
              {/* Participation Toggle */}
              <div>
                <label className="text-xs text-muted uppercase tracking-wider font-medium">I Want To</label>
                <div className="mt-2 flex gap-1.5">
                  {([
                    { v: "all" as const, l: "All", active: "bg-white/10 text-foreground" },
                    { v: "drive" as const, l: "Drive", active: "bg-drift-orange text-white" },
                    { v: "watch" as const, l: "Watch", active: "bg-drift-cyan text-white" },
                  ]).map(({ v, l, active }) => (
                    <button
                      key={v}
                      onClick={() => setFilters((f) => ({ ...f, participation: v }))}
                      className={`flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                        filters.participation === v ? active : "bg-surface-lighter text-muted hover:text-foreground"
                      }`}
                    >
                      {l}
                    </button>
                  ))}
                </div>
              </div>

              {/* Search */}
              <div>
                <label className="text-xs text-muted uppercase tracking-wider font-medium">Search</label>
                <div className="relative mt-2">
                  <svg className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-dark" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" /></svg>
                  <input
                    type="text"
                    placeholder="Event name or location..."
                    value={filters.search}
                    onChange={(e) => setFilters((f) => ({ ...f, search: e.target.value }))}
                    className="w-full pl-10 pr-4 py-2.5 bg-surface-lighter border border-border rounded-xl text-sm text-foreground placeholder:text-muted-dark focus:outline-none focus:border-drift-orange transition-colors"
                  />
                </div>
              </div>

              {/* Date Range */}
              <div>
                <label className="text-xs text-muted uppercase tracking-wider font-medium">Date Range</label>
                <div className="mt-2 space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-dark w-10">From</span>
                    <div className="flex-1">
                      <DatePicker
                        value={filters.dateFrom}
                        onChange={(v) => setFilters((f) => ({ ...f, dateFrom: v }))}
                        placeholder="Start date"
                        compact
                      />
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-dark w-10">To</span>
                    <div className="flex-1">
                      <DatePicker
                        value={filters.dateTo}
                        onChange={(v) => setFilters((f) => ({ ...f, dateTo: v }))}
                        placeholder="End date"
                        compact
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Category */}
              <div>
                <label className="text-xs text-muted uppercase tracking-wider font-medium">Category</label>
                <div className="mt-2 space-y-2">
                  {Object.entries(categoryLabels).map(([key, label]) => (
                    <label key={key} onClick={() => toggleCategory(key)} className="flex items-center gap-3 cursor-pointer group">
                      <div className={`w-4 h-4 rounded border-2 transition-colors flex items-center justify-center ${
                        filters.categories.includes(key) ? "border-drift-orange bg-drift-orange" : "border-border-light group-hover:border-muted"
                      }`}>
                        {filters.categories.includes(key) && (
                          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3"><polyline points="20 6 9 17 4 12" /></svg>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: categoryColors[key] }} />
                        <span className="text-sm text-muted group-hover:text-foreground transition-colors">{label}</span>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {/* Cage Required */}
              <div>
                <label className="text-xs text-muted uppercase tracking-wider font-medium">Cage Required</label>
                <div className="mt-2 flex gap-2">
                  {[{ v: "all", l: "All" }, { v: "yes", l: "Yes" }, { v: "no", l: "No" }].map(({ v, l }) => (
                    <button
                      key={v}
                      onClick={() => setFilters((f) => ({ ...f, cageRequired: v }))}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                        filters.cageRequired === v ? "bg-drift-orange text-white" : "bg-surface-lighter text-muted hover:text-foreground"
                      }`}
                    >
                      {l}
                    </button>
                  ))}
                </div>
              </div>

              {/* Tire Size */}
              <div>
                <label className="text-xs text-muted uppercase tracking-wider font-medium">Tire Size</label>
                <div className="mt-2 flex flex-wrap gap-2">
                  {[{ v: "all", l: "All" }, { v: "205", l: "205 Max" }, { v: "225", l: "225 Max" }, { v: "unlimited", l: "Unlimited" }].map(({ v, l }) => (
                    <button
                      key={v}
                      onClick={() => setFilters((f) => ({ ...f, tireSize: v }))}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                        filters.tireSize === v ? "bg-drift-orange text-white" : "bg-surface-lighter text-muted hover:text-foreground"
                      }`}
                    >
                      {l}
                    </button>
                  ))}
                </div>
              </div>

              {/* Skill Level */}
              <div>
                <label className="text-xs text-muted uppercase tracking-wider font-medium">Skill Level</label>
                <div className="mt-2 flex flex-wrap gap-2">
                  {[{ v: "all", l: "All" }, { v: "beginner", l: "Beginner" }, { v: "intermediate", l: "Intermediate" }, { v: "advanced", l: "Advanced" }].map(({ v, l }) => (
                    <button
                      key={v}
                      onClick={() => setFilters((f) => ({ ...f, skillLevel: v }))}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                        filters.skillLevel === v ? "bg-drift-orange text-white" : "bg-surface-lighter text-muted hover:text-foreground"
                      }`}
                    >
                      {l}
                    </button>
                  ))}
                </div>
              </div>

              {/* Results count */}
              <div className="pt-3 border-t border-border">
                <p className="text-sm text-muted">
                  <span className="text-drift-orange font-semibold">{filteredEvents.length}</span> events found
                </p>
              </div>

              {/* Event list */}
              <div className="space-y-2 max-h-[300px] overflow-y-auto no-scrollbar">
                {filteredEvents.map((e) => (
                  <MiniEventCard key={e.id} event={e} onSelect={onSelectEvent} distance={sortByDistance ? distanceMap.get(e.id) : undefined} />
                ))}
              </div>
            </div>
          </div>

          {/* Map / Calendar */}
          <div className="flex-1 min-w-0">
            {viewMode === "map" ? (
              <div className="relative rounded-2xl overflow-hidden border border-border" style={{ height: "600px" }}>
                <div ref={mapContainerRef} className="w-full h-full" />
                {/* Map overlay gradient at bottom */}
                <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-background/50 to-transparent pointer-events-none" />
              </div>
            ) : (
              <CalendarView filteredEvents={filteredEvents} onSelect={onSelectEvent} />
            )}
          </div>
        </div>
      </div>

      {/* Popup style override */}
      <style jsx global>{`
        .maplibregl-popup-content { background: transparent !important; padding: 0 !important; box-shadow: none !important; }
        .maplibregl-popup-tip { border-top-color: #111 !important; }
      `}</style>
    </section>
  );
}
