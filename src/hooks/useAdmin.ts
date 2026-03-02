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

export interface SubmittedEvent {
  id: string;
  submitted_by: string;
  name: string;
  date: string;
  end_date: string | null;
  location: string;
  category: string;
  cage_required: boolean;
  tire_size: string;
  skill_level: string;
  participation: string;
  description: string;
  event_url: string | null;
  organizer: string;
  contact_email: string;
  image_url: string | null;
  lat: number | null;
  lng: number | null;
  track: string;
  country: string;
  series: string | null;
  price: string | null;
  max_participants: number | null;
  status: "pending" | "approved" | "rejected";
  created_at: string;
  submitter?: {
    username: string;
    avatar_url: string | null;
  };
}

export function useSubmittedEvents(statusFilter?: string) {
  const supabase = useSupabase();
  const { user } = useAuth();
  const [events, setEvents] = useState<SubmittedEvent[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchEvents = useCallback(async () => {
    if (!user) return;
    setLoading(true);

    let query = supabase
      .from("submitted_events")
      .select("*")
      .order("created_at", { ascending: false });

    if (statusFilter && statusFilter !== "all") {
      query = query.eq("status", statusFilter);
    }

    const { data, error } = await query;
    if (error || !data) {
      setEvents([]);
      setLoading(false);
      return;
    }

    // Fetch submitter profiles
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const submitterIds = [...new Set((data as any[]).map((e) => e.submitted_by))];
    const { data: profiles } = await supabase
      .from("profiles")
      .select("id, username, avatar_url")
      .in("id", submitterIds);

    const profileMap = new Map(
      (profiles ?? []).map((p) => [p.id, { username: p.username, avatar_url: p.avatar_url }])
    );

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    setEvents((data as any[]).map((e) => ({
      ...e,
      submitter: profileMap.get(e.submitted_by) || { username: "Unknown", avatar_url: null },
    })));
    setLoading(false);
  }, [supabase, user, statusFilter]);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  return { events, loading, refetch: fetchEvents };
}

export async function approveEvent(eventId: string): Promise<{ success: boolean; error?: string }> {
  const res = await fetch("/api/admin/approve-event", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ eventId }),
  });
  const data = await res.json();
  if (!res.ok) return { success: false, error: data.error };
  return { success: true };
}

export async function rejectEvent(eventId: string): Promise<{ success: boolean; error?: string }> {
  const res = await fetch("/api/admin/reject-event", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ eventId }),
  });
  const data = await res.json();
  if (!res.ok) return { success: false, error: data.error };
  return { success: true };
}
