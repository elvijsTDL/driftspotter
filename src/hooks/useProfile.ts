"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { createBrowserClient } from "@supabase/ssr";
import type { Database } from "@/lib/supabase/database.types";

function useSupabase() {
  return useMemo(() => createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL ?? "",
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? ""
  ), []);
}

export type Profile = Database["public"]["Tables"]["profiles"]["Row"];

export interface ProfileUpdate {
  username?: string;
  avatar_url?: string | null;
  bio?: string;
  car?: string | null;
  car_year?: string | null;
  mods?: string | null;
  skill_level?: "beginner" | "intermediate" | "advanced" | null;
  instagram?: string | null;
  facebook?: string | null;
  tiktok?: string | null;
  youtube?: string | null;
  car_photos?: string[];
  profile_visibility?: "public" | "organizers";
}

export interface DriverStats {
  events_attended: number;
  upcoming_events: number;
}

export type DriverCar = Database["public"]["Tables"]["driver_cars"]["Row"];

export interface DriverCarInput {
  car: string;
  car_year?: string | null;
  horsepower?: number | null;
  mods?: string | null;
  photos?: string[];
  video_urls?: string[];
  equipment?: string[];
  is_primary?: boolean;
}

function sortCars(cars: DriverCar[]): DriverCar[] {
  return [...cars].sort((a, b) => {
    if (a.is_primary !== b.is_primary) return a.is_primary ? -1 : 1;
    return a.created_at.localeCompare(b.created_at);
  });
}

/** A driver's garage. Mutations only succeed for the signed-in owner (RLS). */
export function useDriverCars(userId: string | null) {
  const supabase = useSupabase();
  const [cars, setCars] = useState<DriverCar[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchCars = useCallback(async () => {
    if (!userId) {
      setCars([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    const { data } = await supabase
      .from("driver_cars")
      .select("*")
      .eq("user_id", userId);
    setCars(sortCars((data ?? []) as DriverCar[]));
    setLoading(false);
  }, [supabase, userId]);

  useEffect(() => {
    fetchCars();
  }, [fetchCars]);

  const addCar = async (input: DriverCarInput): Promise<{ error: string | null }> => {
    if (!userId) return { error: "Not signed in" };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { error } = await (supabase.from("driver_cars") as any).insert({
      user_id: userId,
      ...input,
      // first car automatically becomes primary
      is_primary: input.is_primary ?? cars.length === 0,
    });
    if (!error) await fetchCars();
    return { error: error?.message ?? null };
  };

  const updateCar = async (carId: string, input: DriverCarInput): Promise<{ error: string | null }> => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { error } = await (supabase.from("driver_cars") as any)
      .update(input)
      .eq("id", carId);
    if (!error) await fetchCars();
    return { error: error?.message ?? null };
  };

  const deleteCar = async (carId: string): Promise<{ error: string | null }> => {
    const wasPrimary = cars.find((c) => c.id === carId)?.is_primary;
    const { error } = await supabase.from("driver_cars").delete().eq("id", carId);
    if (!error && wasPrimary) {
      // promote the next car so the driver always has a primary
      const next = cars.find((c) => c.id !== carId);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      if (next) await (supabase.from("driver_cars") as any).update({ is_primary: true }).eq("id", next.id);
    }
    if (!error) await fetchCars();
    return { error: error?.message ?? null };
  };

  const setPrimary = async (carId: string): Promise<{ error: string | null }> => {
    const current = cars.find((c) => c.is_primary);
    // clear the old primary first — a partial unique index enforces one per driver
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if (current && current.id !== carId) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      await (supabase.from("driver_cars") as any).update({ is_primary: false }).eq("id", current.id);
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { error } = await (supabase.from("driver_cars") as any).update({ is_primary: true }).eq("id", carId);
    if (!error) await fetchCars();
    return { error: error?.message ?? null };
  };

  return { cars, loading, refetch: fetchCars, addCar, updateCar, deleteCar, setPrimary };
}

export interface DriverEvent {
  id: string;
  name: string;
  date: string;
  location: string;
  country: string;
  category: string;
}

export type EmergencyContact = Database["public"]["Tables"]["driver_emergency_contacts"]["Row"];

export interface EmergencyContactInput {
  contact_name: string;
  contact_phone: string;
  contact_relationship?: string | null;
}

/**
 * A driver's emergency contact (sensitive PII). RLS returns a row only to
 * the owner, admins, or organizers of an event the driver is approved for —
 * so an organizer calling this for another user simply gets null unless
 * they're allowed to see it.
 */
export function useEmergencyContact(userId: string | null) {
  const supabase = useSupabase();
  const [contact, setContact] = useState<EmergencyContact | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchContact = useCallback(async () => {
    if (!userId) {
      setContact(null);
      setLoading(false);
      return;
    }
    setLoading(true);
    const { data } = await supabase
      .from("driver_emergency_contacts")
      .select("*")
      .eq("user_id", userId)
      .maybeSingle();
    setContact((data as EmergencyContact) ?? null);
    setLoading(false);
  }, [supabase, userId]);

  useEffect(() => {
    fetchContact();
  }, [fetchContact]);

  /** Upsert the signed-in driver's own contact; pass null fields to clear. */
  const saveContact = async (input: EmergencyContactInput): Promise<{ error: string | null }> => {
    if (!userId) return { error: "Not signed in" };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { error } = await (supabase.from("driver_emergency_contacts") as any).upsert({
      user_id: userId,
      contact_name: input.contact_name,
      contact_phone: input.contact_phone,
      contact_relationship: input.contact_relationship ?? null,
      updated_at: new Date().toISOString(),
    });
    if (!error) await fetchContact();
    return { error: error?.message ?? null };
  };

  const clearContact = async (): Promise<{ error: string | null }> => {
    if (!userId) return { error: "Not signed in" };
    const { error } = await supabase.from("driver_emergency_contacts").delete().eq("user_id", userId);
    if (!error) await fetchContact();
    return { error: error?.message ?? null };
  };

  return { contact, loading, refetch: fetchContact, saveContact, clearContact };
}

export function useUpdateProfile() {
  const supabase = useSupabase();
  const [saving, setSaving] = useState(false);

  const updateProfile = async (userId: string, updates: ProfileUpdate): Promise<{ error: string | null }> => {
    setSaving(true);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { error } = await (supabase.from("profiles") as any)
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq("id", userId);
    setSaving(false);
    return { error: error?.message ?? null };
  };

  return { updateProfile, saving };
}

/** Fetch driver stats (events attended / upcoming) for a set of users. */
export async function fetchDriverStats(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  supabase: any,
  userIds: string[]
): Promise<Map<string, DriverStats>> {
  const map = new Map<string, DriverStats>();
  if (userIds.length === 0) return map;
  const { data } = await supabase.rpc("get_driver_stats", { driver_ids: userIds });
  for (const row of (data ?? []) as { user_id: string; events_attended: number; upcoming_events: number }[]) {
    map.set(row.user_id, {
      events_attended: Number(row.events_attended),
      upcoming_events: Number(row.upcoming_events),
    });
  }
  return map;
}

export interface OrganizerEvent {
  id: string;
  name: string;
  date: string;
  end_date: string | null;
  location: string;
  country: string;
  category: string;
  image_url: string | null;
  price: string | null;
}

/** Public organizer profile: profile row + their published events. */
export function useOrganizerProfile(userId: string | null) {
  const supabase = useSupabase();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [pastEvents, setPastEvents] = useState<OrganizerEvent[]>([]);
  const [upcomingEvents, setUpcomingEvents] = useState<OrganizerEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  const fetchOrganizer = useCallback(async () => {
    if (!userId) return;
    setLoading(true);

    const { data: profileData, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .maybeSingle();

    if (error || !profileData) {
      setNotFound(true);
      setLoading(false);
      return;
    }
    setProfile(profileData as Profile);

    // Approved events are publicly readable
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: events } = await (supabase as any)
      .from("events")
      .select("id, name, date, end_date, location, country, category, image_url, price")
      .eq("submitted_by", userId)
      .eq("status", "approved")
      .order("date", { ascending: false });

    const today = new Date().toISOString().split("T")[0];
    const all = (events ?? []) as OrganizerEvent[];
    setPastEvents(all.filter((e) => e.date < today));
    setUpcomingEvents(all.filter((e) => e.date >= today).reverse());

    setLoading(false);
  }, [supabase, userId]);

  useEffect(() => {
    fetchOrganizer();
  }, [fetchOrganizer]);

  return { profile, pastEvents, upcomingEvents, loading, notFound };
}

/** Public driver profile: profile row + stats + approved event history. */
export function useDriverProfile(userId: string | null) {
  const supabase = useSupabase();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [cars, setCars] = useState<DriverCar[]>([]);
  const [stats, setStats] = useState<DriverStats>({ events_attended: 0, upcoming_events: 0 });
  const [pastEvents, setPastEvents] = useState<DriverEvent[]>([]);
  const [upcomingEvents, setUpcomingEvents] = useState<DriverEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  const fetchDriver = useCallback(async () => {
    if (!userId) return;
    setLoading(true);

    const { data: profileData, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .maybeSingle();

    if (error || !profileData) {
      setNotFound(true);
      setLoading(false);
      return;
    }
    setProfile(profileData as Profile);

    const [{ data: carData }, statsMap] = await Promise.all([
      supabase.from("driver_cars").select("*").eq("user_id", userId),
      fetchDriverStats(supabase, [userId]),
    ]);
    setCars(sortCars((carData ?? []) as DriverCar[]));
    setStats(statsMap.get(userId) ?? { events_attended: 0, upcoming_events: 0 });

    // Approved applications are publicly readable; join to live events.
    const { data: rsvps } = await supabase
      .from("event_rsvps")
      .select("event_id")
      .eq("user_id", userId)
      .eq("status", "approved");

    const eventIds = (rsvps ?? []).map((r: { event_id: string }) => r.event_id).filter(Boolean);
    if (eventIds.length > 0) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { data: events } = await (supabase as any)
        .from("events")
        .select("id, name, date, location, country, category")
        .in("id", eventIds)
        .order("date", { ascending: false });

      const today = new Date().toISOString().split("T")[0];
      const all = (events ?? []) as DriverEvent[];
      setPastEvents(all.filter((e) => e.date < today));
      setUpcomingEvents(all.filter((e) => e.date >= today).reverse());
    } else {
      setPastEvents([]);
      setUpcomingEvents([]);
    }

    setLoading(false);
  }, [supabase, userId]);

  useEffect(() => {
    fetchDriver();
  }, [fetchDriver]);

  return { profile, cars, stats, pastEvents, upcomingEvents, loading, notFound };
}
