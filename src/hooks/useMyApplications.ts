"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { createBrowserClient } from "@supabase/ssr";
import { useAuth } from "@/contexts/AuthContext";

function useSupabase() {
  return useMemo(() => createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL ?? "",
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? ""
  ), []);
}

export interface MyApplication {
  rsvp_id: string;
  event_id: string;
  status: "pending" | "approved" | "rejected";
  message: string | null;
  applied_at: string;
  event: {
    name: string;
    date: string;
    end_date: string | null;
    location: string;
    country: string;
    track: string;
    category: string;
    image_url: string | null;
    organizer: string;
    price: string | null;
  } | null;
}

export function useMyApplications() {
  const supabase = useSupabase();
  const { user } = useAuth();
  const [applications, setApplications] = useState<MyApplication[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchApplications = useCallback(async () => {
    if (!user) {
      setApplications([]);
      setLoading(false);
      return;
    }
    setLoading(true);

    const { data: rsvps } = await supabase
      .from("event_rsvps")
      .select("id, event_id, status, message, created_at")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (!rsvps || rsvps.length === 0) {
      setApplications([]);
      setLoading(false);
      return;
    }

    const eventIds = rsvps.map((r) => r.event_id).filter(Boolean);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: events } = await (supabase as any)
      .from("events")
      .select("id, name, date, end_date, location, country, track, category, image_url, organizer, price")
      .in("id", eventIds);

    const eventMap = new Map(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ((events ?? []) as any[]).map((e) => [e.id, e])
    );

    setApplications(
      rsvps
        .map((r) => ({
          rsvp_id: r.id,
          event_id: r.event_id,
          status: r.status as "pending" | "approved" | "rejected",
          message: r.message ?? null,
          applied_at: r.created_at,
          event: eventMap.get(r.event_id) ?? null,
        }))
        // Soonest event first — what's coming up matters more than when you
        // applied; applications with no event data sink to the bottom
        .sort((a, b) => {
          if (!a.event) return 1;
          if (!b.event) return -1;
          return a.event.date < b.event.date ? -1 : a.event.date > b.event.date ? 1 : 0;
        })
    );
    setLoading(false);
  }, [supabase, user]);

  useEffect(() => {
    fetchApplications();
  }, [fetchApplications]);

  const withdraw = async (rsvpId: string) => {
    await supabase.from("event_rsvps").delete().eq("id", rsvpId);
    setApplications((prev) => prev.filter((a) => a.rsvp_id !== rsvpId));
  };

  return { applications, loading, refetch: fetchApplications, withdraw };
}
