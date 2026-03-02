"use client";

import { useMemo } from "react";
import useSWR from "swr";
import { createBrowserClient } from "@supabase/ssr";
import type { DriftEvent } from "@/data/events";

function getSupabase() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL ?? "",
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? ""
  );
}

async function fetchEvents(): Promise<DriftEvent[]> {
  const supabase = getSupabase();

  const todayISO = new Date().toISOString().split("T")[0];
  const { data, error } = await supabase
    .from("events")
    .select("*")
    .eq("status", "approved")
    .gte("date", todayISO)
    .order("date", { ascending: true });

  if (error || !data) {
    console.error("Failed to fetch events:", error);
    return [];
  }

  // Batch-fetch approved RSVP counts only
  const eventIds = data.map((e: { id: string }) => e.id);
  const { data: rsvpCounts } = await supabase
    .from("event_rsvps")
    .select("event_uuid")
    .in("event_uuid", eventIds)
    .eq("status", "approved");

  const countMap = new Map<string, number>();
  if (rsvpCounts) {
    for (const r of rsvpCounts as { event_uuid: string }[]) {
      countMap.set(r.event_uuid, (countMap.get(r.event_uuid) || 0) + 1);
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (data as any[])
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
      maxParticipants: row.max_participants || undefined,
    }));
}

export function useEvents() {
  const { data, error, isLoading, mutate } = useSWR("events", fetchEvents, {
    revalidateOnFocus: false,
    dedupingInterval: 60_000,      // dedup identical requests within 60s
    revalidateIfStale: true,
    revalidateOnReconnect: true,
  });

  const events = useMemo(() => data ?? [], [data]);

  return {
    events,
    loading: isLoading,
    error,
    refetch: () => mutate(),
  };
}
