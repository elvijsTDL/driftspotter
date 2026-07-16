"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { createBrowserClient } from "@supabase/ssr";
import { useAuth } from "@/contexts/AuthContext";
import { fetchDriverStats } from "@/hooks/useProfile";

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
  media_urls: string[];
  safety_requirements: string;
  required_equipment: string[];
  accepts_media: boolean;
  requires_emergency_contact: boolean;
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
  horsepower: number | null;
  skill_level: string | null;
  instagram: string | null;
  role: "driver" | "media";
  events_attended: number;
  // Only populated for approved drivers, and only if they filled it in — the
  // driver_emergency_contacts RLS returns nothing otherwise.
  emergency_name: string | null;
  emergency_phone: string | null;
  emergency_relationship: string | null;
  // Presence-only flag (no PII), available for pending applicants too so the
  // organizer can chase a missing contact before approving.
  has_emergency_contact: boolean;
}

/** Organizer-editable fields, snake_case as stored in the DB. */
export interface MyEventUpdate {
  name?: string;
  date?: string;
  end_date?: string | null;
  location?: string;
  category?: string;
  cage_required?: boolean;
  tire_size?: string;
  skill_level?: string;
  participation?: string;
  description?: string;
  safety_requirements?: string;
  required_equipment?: string[];
  accepts_media?: boolean;
  requires_emergency_contact?: boolean;
  event_url?: string | null;
  organizer?: string;
  contact_email?: string;
  image_url?: string | null;
  media_urls?: string[];
  lat?: number | null;
  lng?: number | null;
  track?: string;
  country?: string;
  series?: string | null;
  price?: string | null;
  max_participants?: number | null;
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

  const updateEvent = async (eventId: string, updates: MyEventUpdate): Promise<{ success: boolean; error?: string }> => {
    try {
      const res = await fetch("/api/events/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ eventId, updates }),
      });
      const data = await res.json();
      if (!res.ok) return { success: false, error: data.error || "Failed to update event" };
      await fetchEvents();
      return { success: true };
    } catch {
      return { success: false, error: "Network error" };
    }
  };

  return { events, loading, refetch: fetchEvents, updateEvent };
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
      .select("id, user_id, status, message, car_id, role, created_at")
      .eq("event_id", eventId)
      .order("created_at", { ascending: false });

    if (!rsvps || rsvps.length === 0) {
      setApplicants([]);
      setLoading(false);
      return;
    }

    const userIds = rsvps.map((r) => r.user_id);
    const [{ data: profiles }, { data: cars }, { data: emergencies }, { data: emergencyPresence }, statsMap] = await Promise.all([
      supabase
        .from("profiles")
        .select("id, username, avatar_url, car, car_year, skill_level, instagram")
        .in("id", userIds),
      supabase
        .from("driver_cars")
        .select("id, user_id, car, car_year, horsepower, is_primary")
        .in("user_id", userIds),
      // RLS returns rows only for drivers approved for one of the caller's
      // events, so this is safe to fetch for the whole applicant set.
      supabase
        .from("driver_emergency_contacts")
        .select("user_id, contact_name, contact_phone, contact_relationship")
        .in("user_id", userIds),
      // Presence-only (no PII); works for pending applicants too.
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (supabase as any).rpc("applicants_with_emergency_contact", { driver_ids: userIds }),
      fetchDriverStats(supabase, userIds),
    ]);

    const profileMap = new Map(
      (profiles ?? []).map((p) => [p.id, p])
    );
    type EmergencyRow = { user_id: string; contact_name: string; contact_phone: string; contact_relationship: string | null };
    const emergencyMap = new Map(
      ((emergencies ?? []) as EmergencyRow[]).map((e) => [e.user_id, e])
    );
    const emergencyOnFile = new Set(
      ((emergencyPresence ?? []) as { user_id: string }[]).map((e) => e.user_id)
    );

    type GarageCar = { id: string; user_id: string; car: string; car_year: string | null; horsepower: number | null; is_primary: boolean };
    const allCars = (cars ?? []) as GarageCar[];
    const carById = new Map(allCars.map((c) => [c.id, c]));
    // Fallback when the application didn't pin a car: driver's default, then any car
    const defaultCarByUser = new Map<string, GarageCar>();
    for (const c of allCars) {
      if (c.is_primary || !defaultCarByUser.has(c.user_id)) defaultCarByUser.set(c.user_id, c);
    }

    setApplicants(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      rsvps.map((r: any) => {
        const profile = profileMap.get(r.user_id);
        // The car the driver said they're bringing takes priority
        const garageCar = (r.car_id ? carById.get(r.car_id) : undefined) ?? defaultCarByUser.get(r.user_id);
        const emergency = emergencyMap.get(r.user_id);
        return {
          rsvp_id: r.id,
          user_id: r.user_id,
          status: r.status as "pending" | "approved" | "rejected",
          message: r.message ?? null,
          created_at: r.created_at,
          username: profile?.username ?? "Unknown",
          avatar_url: profile?.avatar_url ?? null,
          car: garageCar?.car ?? profile?.car ?? null,
          car_year: garageCar?.car_year ?? profile?.car_year ?? null,
          horsepower: garageCar?.horsepower ?? null,
          skill_level: profile?.skill_level ?? null,
          instagram: profile?.instagram ?? null,
          role: (r.role as "driver" | "media") ?? "driver",
          events_attended: statsMap.get(r.user_id)?.events_attended ?? 0,
          emergency_name: emergency?.contact_name ?? null,
          emergency_phone: emergency?.contact_phone ?? null,
          emergency_relationship: emergency?.contact_relationship ?? null,
          has_emergency_contact: !!emergency || emergencyOnFile.has(r.user_id),
        };
      })
    );
    setLoading(false);
  }, [supabase, eventId]);

  useEffect(() => {
    fetchApplicants();
  }, [fetchApplicants]);

  const updateStatus = async (rsvpId: string, status: "approved" | "rejected") => {
    // Server route: verifies ownership, updates the RSVP, and emails the driver
    await fetch("/api/rsvp/decision", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ rsvpId, status }),
    });
    await fetchApplicants();
  };

  return { applicants, loading, refetch: fetchApplicants, updateStatus };
}
