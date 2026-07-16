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
  safety_requirements: string;
  event_url: string | null;
  organizer: string;
  contact_email: string;
  image_url: string | null;
  media_urls: string[];
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

export type OrganizerStatus = "none" | "pending" | "standard" | "trusted" | "blocked";

export interface AdminOrganizer {
  user_id: string;
  username: string;
  avatar_url: string | null;
  organizer_status: OrganizerStatus;
  organizer_name: string | null;
  organizer_website: string | null;
  organizer_about: string | null;
  organizer_requested_at: string | null;
  total_submitted: number;
  approved_count: number;
  rejected_count: number;
  last_submission: string | null;
}

const statusOrder: Record<OrganizerStatus, number> = {
  pending: 0, trusted: 1, standard: 2, blocked: 3, none: 4,
};

/** Everyone in the organizer pipeline (requests + approved + blocked), with submission counts. */
export function useOrganizers() {
  const supabase = useSupabase();
  const { user } = useAuth();
  const [organizers, setOrganizers] = useState<AdminOrganizer[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchOrganizers = useCallback(async () => {
    if (!user) return;
    setLoading(true);

    // Admins can read all profiles (can_view_profile allows it)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [{ data: profiles }, { data: submissions }] = await Promise.all([
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (supabase as any)
        .from("profiles")
        .select("id, username, avatar_url, organizer_status, organizer_name, organizer_website, organizer_about, organizer_requested_at")
        .neq("organizer_status", "none"),
      supabase
        .from("submitted_events")
        .select("submitted_by, status, created_at"),
    ]);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const rows = (submissions ?? []) as any[];
    const byUser = new Map<string, { total: number; approved: number; rejected: number; last: string }>();
    for (const s of rows) {
      const entry = byUser.get(s.submitted_by) ?? { total: 0, approved: 0, rejected: 0, last: s.created_at };
      entry.total += 1;
      if (s.status === "approved") entry.approved += 1;
      if (s.status === "rejected") entry.rejected += 1;
      if (s.created_at > entry.last) entry.last = s.created_at;
      byUser.set(s.submitted_by, entry);
    }

    setOrganizers(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (((profiles ?? []) as any[]))
        .map((p) => {
          const stats = byUser.get(p.id);
          return {
            user_id: p.id as string,
            username: (p.username ?? "Unknown") as string,
            avatar_url: (p.avatar_url ?? null) as string | null,
            organizer_status: (p.organizer_status ?? "none") as OrganizerStatus,
            organizer_name: (p.organizer_name ?? null) as string | null,
            organizer_website: (p.organizer_website ?? null) as string | null,
            organizer_about: (p.organizer_about ?? null) as string | null,
            organizer_requested_at: (p.organizer_requested_at ?? null) as string | null,
            total_submitted: stats?.total ?? 0,
            approved_count: stats?.approved ?? 0,
            rejected_count: stats?.rejected ?? 0,
            last_submission: stats?.last ?? null,
          };
        })
        .sort((a, b) =>
          statusOrder[a.organizer_status] - statusOrder[b.organizer_status]
          || b.total_submitted - a.total_submitted
        )
    );
    setLoading(false);
  }, [supabase, user]);

  useEffect(() => {
    fetchOrganizers();
  }, [fetchOrganizers]);

  return { organizers, loading, refetch: fetchOrganizers };
}

export async function setOrganizerStatus(userId: string, status: OrganizerStatus): Promise<{ success: boolean; error?: string }> {
  const res = await fetch("/api/admin/set-organizer-status", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ userId, status }),
  });
  const data = await res.json();
  if (!res.ok) return { success: false, error: data.error };
  return { success: true };
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
