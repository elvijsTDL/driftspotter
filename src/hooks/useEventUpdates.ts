"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { createBrowserClient } from "@supabase/ssr";

export interface EventUpdate {
  id: string;
  number: number;
  body: string;
  created_at: string;
}

/**
 * Numbered organizer updates for an event. Reading is public; posting goes
 * through /api/events/post-update, which verifies ownership and fans out
 * in-app + email + push to approved participants.
 */
export function useEventUpdates(eventId: string | null) {
  const supabase = useMemo(() => createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL ?? "",
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? ""
  ), []);
  const [updates, setUpdates] = useState<EventUpdate[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchUpdates = useCallback(async () => {
    if (!eventId) return;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data } = await (supabase as any)
      .from("event_updates")
      .select("id, number, body, created_at")
      .eq("event_id", eventId)
      .order("number", { ascending: false });
    setUpdates((data ?? []) as EventUpdate[]);
    setLoading(false);
  }, [supabase, eventId]);

  useEffect(() => {
    fetchUpdates();
  }, [fetchUpdates]);

  const postUpdate = async (body: string): Promise<{ error: string | null; notified?: number }> => {
    if (!eventId) return { error: "No event" };
    const res = await fetch("/api/events/post-update", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ eventId, body }),
    });
    const json = await res.json().catch(() => ({}));
    if (!res.ok) return { error: json.error ?? "Failed to post update" };
    await fetchUpdates();
    return { error: null, notified: json.notified };
  };

  return { updates, loading, postUpdate, refetch: fetchUpdates };
}
