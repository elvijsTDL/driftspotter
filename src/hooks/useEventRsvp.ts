"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { createBrowserClient } from "@supabase/ssr";
import { useAuth } from "@/contexts/AuthContext";

function useSupabase() {
  return useMemo(() => createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  ), []);
}

export function useEventRsvp(eventId: string | null) {
  const supabase = useSupabase();
  const { user } = useAuth();
  const [userStatus, setUserStatus] = useState<"going" | "interested" | null>(null);
  const [goingCount, setGoingCount] = useState(0);
  const [interestedCount, setInterestedCount] = useState(0);
  const [loading, setLoading] = useState(true);

  const fetchRsvp = useCallback(async () => {
    if (!eventId) return;
    setLoading(true);

    const { count: going } = await supabase
      .from("event_rsvps")
      .select("*", { count: "exact", head: true })
      .eq("event_id", eventId)
      .eq("status", "going");

    const { count: interested } = await supabase
      .from("event_rsvps")
      .select("*", { count: "exact", head: true })
      .eq("event_id", eventId)
      .eq("status", "interested");

    setGoingCount(going ?? 0);
    setInterestedCount(interested ?? 0);

    if (user) {
      const { data } = await supabase
        .from("event_rsvps")
        .select("status")
        .eq("event_id", eventId)
        .eq("user_id", user.id)
        .maybeSingle();
      setUserStatus((data?.status as "going" | "interested") ?? null);
    }

    setLoading(false);
  }, [supabase, eventId, user]);

  useEffect(() => {
    fetchRsvp();
  }, [fetchRsvp]);

  const toggleRsvp = async (status: "going" | "interested") => {
    if (!user || !eventId) return;

    if (userStatus === status) {
      await supabase
        .from("event_rsvps")
        .delete()
        .eq("event_id", eventId)
        .eq("user_id", user.id);
      setUserStatus(null);
      if (status === "going") setGoingCount((c) => Math.max(0, c - 1));
      else setInterestedCount((c) => Math.max(0, c - 1));
    } else {
      if (userStatus) {
        await supabase.from("event_rsvps").update({ status })
          .eq("event_id", eventId)
          .eq("user_id", user.id);
        if (userStatus === "going") setGoingCount((c) => Math.max(0, c - 1));
        else setInterestedCount((c) => Math.max(0, c - 1));
      } else {
        await supabase.from("event_rsvps").insert({ event_id: eventId, user_id: user.id, status });
      }
      setUserStatus(status);
      if (status === "going") setGoingCount((c) => c + 1);
      else setInterestedCount((c) => c + 1);
    }
  };

  return { userStatus, goingCount, interestedCount, loading, toggleRsvp };
}
