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

export type RsvpStatus = "pending" | "approved" | "rejected";

export interface RsvpAttendee {
  user_id: string;
  status: RsvpStatus;
  username: string;
  avatar_url: string | null;
}

export function useEventRsvp(eventId: string | null) {
  const supabase = useSupabase();
  const { user } = useAuth();
  const [userStatus, setUserStatus] = useState<RsvpStatus | null>(null);
  const [approvedCount, setApprovedCount] = useState(0);
  const [pendingCount, setPendingCount] = useState(0);
  const [attendees, setAttendees] = useState<RsvpAttendee[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchRsvp = useCallback(async () => {
    if (!eventId) return;
    setLoading(true);

    const { count: approved } = await supabase
      .from("event_rsvps")
      .select("*", { count: "exact", head: true })
      .eq("event_id", eventId)
      .eq("status", "approved");

    const { count: pending } = await supabase
      .from("event_rsvps")
      .select("*", { count: "exact", head: true })
      .eq("event_id", eventId)
      .eq("status", "pending");

    setApprovedCount(approved ?? 0);
    setPendingCount(pending ?? 0);

    if (user) {
      const { data } = await supabase
        .from("event_rsvps")
        .select("status")
        .eq("event_id", eventId)
        .eq("user_id", user.id)
        .maybeSingle();
      setUserStatus((data?.status as RsvpStatus) ?? null);
    }

    // Fetch approved attendee profiles (most recent 8)
    const { data: rsvpData } = await supabase
      .from("event_rsvps")
      .select("user_id, status")
      .eq("event_id", eventId)
      .eq("status", "approved")
      .order("created_at", { ascending: false })
      .limit(8);

    if (rsvpData && rsvpData.length > 0) {
      const userIds = rsvpData.map((r: { user_id: string }) => r.user_id);
      const { data: profiles } = await supabase
        .from("profiles")
        .select("id, username, avatar_url")
        .in("id", userIds);

      const profileMap = new Map(
        (profiles ?? []).map((p: { id: string; username: string; avatar_url: string | null }) => [p.id, p])
      );

      setAttendees(
        rsvpData.map((r: { user_id: string; status: string }) => {
          const profile = profileMap.get(r.user_id);
          return {
            user_id: r.user_id,
            status: r.status as RsvpStatus,
            username: profile?.username ?? "Unknown",
            avatar_url: profile?.avatar_url ?? null,
          };
        })
      );
    } else {
      setAttendees([]);
    }

    setLoading(false);
  }, [supabase, eventId, user]);

  useEffect(() => {
    fetchRsvp();
  }, [fetchRsvp]);

  const applyToAttend = async (message?: string) => {
    if (!user || !eventId) return;

    await supabase.from("event_rsvps").insert({
      event_id: eventId,
      user_id: user.id,
      status: "pending" as const,
      ...(message ? { message } : {}),
    });
    setUserStatus("pending");
    setPendingCount((c) => c + 1);
  };

  const withdrawApplication = async () => {
    if (!user || !eventId) return;

    const currentStatus = userStatus;
    await supabase
      .from("event_rsvps")
      .delete()
      .eq("event_id", eventId)
      .eq("user_id", user.id);
    setUserStatus(null);
    if (currentStatus === "pending") setPendingCount((c) => Math.max(0, c - 1));
    if (currentStatus === "approved") setApprovedCount((c) => Math.max(0, c - 1));
  };

  return {
    userStatus,
    approvedCount,
    pendingCount,
    attendees,
    loading,
    applyToAttend,
    withdrawApplication,
  };
}
