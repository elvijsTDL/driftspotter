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

export type ApplicationRole = "driver" | "media";

export interface UserApplication {
  message: string | null;
  carId: string | null;
  role: ApplicationRole;
}

export function useEventRsvp(eventId: string | null) {
  const supabase = useSupabase();
  const { user } = useAuth();
  const [userStatus, setUserStatus] = useState<RsvpStatus | null>(null);
  const [userApplication, setUserApplication] = useState<UserApplication | null>(null);
  const [approvedCount, setApprovedCount] = useState(0);
  const [approvedMediaCount, setApprovedMediaCount] = useState(0);
  const [pendingCount, setPendingCount] = useState(0);
  const [attendees, setAttendees] = useState<RsvpAttendee[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchRsvp = useCallback(async () => {
    if (!eventId) return;
    setLoading(true);

    // Drivers count against capacity; media passes are tracked separately
    const { count: approvedDrivers } = await supabase
      .from("event_rsvps")
      .select("*", { count: "exact", head: true })
      .eq("event_id", eventId)
      .eq("status", "approved")
      .eq("role", "driver");

    const { count: approvedMedia } = await supabase
      .from("event_rsvps")
      .select("*", { count: "exact", head: true })
      .eq("event_id", eventId)
      .eq("status", "approved")
      .eq("role", "media");

    const { count: pending } = await supabase
      .from("event_rsvps")
      .select("*", { count: "exact", head: true })
      .eq("event_id", eventId)
      .eq("status", "pending");

    setApprovedCount(approvedDrivers ?? 0);
    setApprovedMediaCount(approvedMedia ?? 0);
    setPendingCount(pending ?? 0);

    if (user) {
      const { data } = await supabase
        .from("event_rsvps")
        .select("status, message, car_id, role")
        .eq("event_id", eventId)
        .eq("user_id", user.id)
        .maybeSingle();
      setUserStatus((data?.status as RsvpStatus) ?? null);
      setUserApplication(data ? {
        message: data.message ?? null,
        carId: data.car_id ?? null,
        role: (data.role as ApplicationRole) ?? "driver",
      } : null);
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
      // SECURITY DEFINER lookup so private profiles still show name + avatar
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { data: profiles } = await (supabase as any)
        .rpc("get_public_profiles", { profile_ids: userIds });

      type PublicProfile = { id: string; username: string; avatar_url: string | null };
      const profileMap = new Map<string, PublicProfile>(
        ((profiles ?? []) as PublicProfile[]).map((p) => [p.id, p])
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

  const applyToAttend = async (
    message?: string,
    carId?: string | null,
    role: ApplicationRole = "driver"
  ): Promise<{ error: string | null }> => {
    if (!user || !eventId) return { error: "Not signed in" };

    const { error } = await supabase.from("event_rsvps").insert({
      event_id: eventId,
      user_id: user.id,
      status: "pending" as const,
      role,
      ...(message ? { message } : {}),
      ...(carId && role === "driver" ? { car_id: carId } : {}),
    });

    if (error) {
      // The enforce_emergency_contact_on_rsvp trigger raises this when a
      // required emergency contact is missing.
      const missingContact = error.message?.includes("EMERGENCY_CONTACT_REQUIRED");
      return {
        error: missingContact
          ? "This event requires an emergency contact on your profile before you can apply."
          : error.message,
      };
    }

    setUserStatus("pending");
    setUserApplication({ message: message ?? null, carId: role === "driver" ? (carId ?? null) : null, role });
    setPendingCount((c) => c + 1);
    return { error: null };
  };

  const updateApplication = async (message: string | null, carId: string | null) => {
    if (!user || !eventId) return;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await (supabase.from("event_rsvps") as any)
      .update({ message: message || null, car_id: carId })
      .eq("event_id", eventId)
      .eq("user_id", user.id);
    setUserApplication((prev) => ({ message: message || null, carId, role: prev?.role ?? "driver" }));
  };

  const withdrawApplication = async () => {
    if (!user || !eventId) return;

    const currentStatus = userStatus;
    const currentRole = userApplication?.role ?? "driver";
    await supabase
      .from("event_rsvps")
      .delete()
      .eq("event_id", eventId)
      .eq("user_id", user.id);
    setUserStatus(null);
    setUserApplication(null);
    if (currentStatus === "pending") setPendingCount((c) => Math.max(0, c - 1));
    if (currentStatus === "approved") {
      if (currentRole === "media") setApprovedMediaCount((c) => Math.max(0, c - 1));
      else setApprovedCount((c) => Math.max(0, c - 1));
    }
  };

  return {
    userStatus,
    userApplication,
    approvedCount,
    approvedMediaCount,
    pendingCount,
    attendees,
    loading,
    applyToAttend,
    updateApplication,
    withdrawApplication,
  };
}
