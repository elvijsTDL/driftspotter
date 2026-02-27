"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { createBrowserClient } from "@supabase/ssr";
import type { DriftEvent } from "@/data/events";

function useSupabase() {
  return useMemo(
    () =>
      createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL ?? "",
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? ""
      ),
    []
  );
}

export function useEvents() {
  const supabase = useSupabase();
  const [events, setEvents] = useState<DriftEvent[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchEvents = useCallback(async () => {
    setLoading(true);

    const todayISO = new Date().toISOString().split("T")[0];
    const { data, error } = await supabase
      .from("events")
      .select("*")
      .eq("status", "approved")
      .gte("date", todayISO)
      .order("date", { ascending: true });

    if (error || !data) {
      console.error("Failed to fetch events:", error);
      setLoading(false);
      return;
    }

    // Batch-fetch RSVP counts
    const eventIds = data.map((e: { id: string }) => e.id);
    const { data: rsvpCounts } = await supabase
      .from("event_rsvps")
      .select("event_uuid")
      .in("event_uuid", eventIds);

    const countMap = new Map<string, number>();
    if (rsvpCounts) {
      for (const r of rsvpCounts as { event_uuid: string }[]) {
        countMap.set(r.event_uuid, (countMap.get(r.event_uuid) || 0) + 1);
      }
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const mapped: DriftEvent[] = (data as any[])
      .filter((row) => row.lat != null && row.lng != null)
      .map((row) => ({
        id: row.id,
        name: row.name,
        series: row.series || undefined,
        date: row.date,
        endDate: row.end_date || undefined,
        location: row.location,
        country: row.country,
        track: row.track,
        lat: Number(row.lat),
        lng: Number(row.lng),
        category: row.category,
        cageRequired: row.cage_required,
        tireSize: row.tire_size,
        skillLevel: row.skill_level,
        description: row.description,
        eventUrl: row.event_url || undefined,
        imageUrl: row.image_url || undefined,
        price: row.price || undefined,
        attendees: countMap.get(row.id) || 0,
        isHot: row.is_hot,
        participation: row.participation,
        organizer: row.organizer,
      }));

    setEvents(mapped);
    setLoading(false);
  }, [supabase]);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  return { events, loading, refetch: fetchEvents };
}
