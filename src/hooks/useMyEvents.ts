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

export interface MyEvent {
  id: string;
  name: string;
  date: string;
  end_date: string | null;
  location: string;
  category: string;
  status: "pending" | "approved" | "rejected";
  track: string;
  country: string;
  max_participants: number | null;
  created_at: string;
  description: string;
  cage_required: boolean;
  tire_size: string;
  skill_level: string;
  participation: string;
  event_url: string | null;
  organizer: string;
  contact_email: string;
  image_url: string | null;
  lat: number | null;
  lng: number | null;
  series: string | null;
  price: string | null;
}

export interface EventApplicant {
  rsvp_id: string;
  user_id: string;
  status: "pending" | "approved" | "rejected";
  message: string | null;
  created_at: string;
  username: string;
  avatar_url: string | null;
  car: string | null;
  car_year: string | null;
  skill_level: string | null;
  instagram: string | null;
}

export function useMyEvents() {
  const supabase = useSupabase();
  const { user } = useAuth();
  const [events, setEvents] = useState<MyEvent[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchEvents = useCallback(async () => {
    if (!user) return;
    setLoading(true);

    const { data, error } = await supabase
      .from("submitted_events")
      .select("*")
      .eq("submitted_by", user.id)
      .order("created_at", { ascending: false });

    if (!error && data) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      setEvents(data as any as MyEvent[]);
    }
    setLoading(false);
  }, [supabase, user]);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  return { events, loading, refetch: fetchEvents };
}

export function useEventApplicants(eventId: string | null) {
  const supabase = useSupabase();
  const [applicants, setApplicants] = useState<EventApplicant[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchApplicants = useCallback(async () => {
    if (!eventId) return;
    setLoading(true);

    const { data: rsvps } = await supabase
      .from("event_rsvps")
      .select("id, user_id, status, message, created_at")
      .eq("event_id", eventId)
      .order("created_at", { ascending: false });

    if (!rsvps || rsvps.length === 0) {
      setApplicants([]);
      setLoading(false);
      return;
    }

    const userIds = rsvps.map((r) => r.user_id);
    const { data: profiles } = await supabase
      .from("profiles")
      .select("id, username, avatar_url, car, car_year, skill_level, instagram")
      .in("id", userIds);

    const profileMap = new Map(
      (profiles ?? []).map((p) => [p.id, p])
    );

    setApplicants(
      rsvps.map((r) => {
        const profile = profileMap.get(r.user_id);
        return {
          rsvp_id: r.id,
          user_id: r.user_id,
          status: r.status as "pending" | "approved" | "rejected",
          message: r.message ?? null,
          created_at: r.created_at,
          username: profile?.username ?? "Unknown",
          avatar_url: profile?.avatar_url ?? null,
          car: profile?.car ?? null,
          car_year: profile?.car_year ?? null,
          skill_level: profile?.skill_level ?? null,
          instagram: profile?.instagram ?? null,
        };
      })
    );
    setLoading(false);
  }, [supabase, eventId]);

  useEffect(() => {
    fetchApplicants();
  }, [fetchApplicants]);

  const updateStatus = async (rsvpId: string, status: "approved" | "rejected") => {
    await supabase
      .from("event_rsvps")
      .update({ status })
      .eq("id", rsvpId);
    await fetchApplicants();
  };

  return { applicants, loading, refetch: fetchApplicants, updateStatus };
}
