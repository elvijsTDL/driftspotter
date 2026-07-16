"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { createBrowserClient } from "@supabase/ssr";
import { useAuth } from "@/contexts/AuthContext";
import type { Database } from "@/lib/supabase/database.types";

function useSupabase() {
  return useMemo(() => createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL ?? "",
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? ""
  ), []);
}

export type EventDocument = Database["public"]["Tables"]["event_documents"]["Row"];
export type EventLink = Database["public"]["Tables"]["event_links"]["Row"];

const MAX_DOC_SIZE = 10 * 1024 * 1024; // 10MB
const ALLOWED_DOC_TYPES = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/vnd.ms-excel",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  "text/plain",
  "image/png",
  "image/jpeg",
];

export function validateDocument(file: File): string | null {
  if (!ALLOWED_DOC_TYPES.includes(file.type)) return "Allowed formats: PDF, Word, Excel, text or image";
  if (file.size > MAX_DOC_SIZE) return "Documents must be under 10MB";
  return null;
}

export function formatFileSize(bytes: number | null): string {
  if (!bytes) return "";
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

/**
 * Event documents (briefings, timetables, regulations). RLS restricts
 * reads to the organizer, admins and approved applicants — for everyone
 * else the list simply comes back empty.
 */
export function useEventDocuments(eventId: string | null) {
  const supabase = useSupabase();
  const { user } = useAuth();
  const [documents, setDocuments] = useState<EventDocument[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchDocuments = useCallback(async () => {
    if (!eventId || !user) {
      setDocuments([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data } = await (supabase as any)
      .from("event_documents")
      .select("*")
      .eq("event_id", eventId)
      .order("created_at", { ascending: true });
    setDocuments((data ?? []) as EventDocument[]);
    setLoading(false);
  }, [supabase, eventId, user]);

  useEffect(() => {
    fetchDocuments();
  }, [fetchDocuments]);

  const uploadDocument = async (file: File): Promise<{ error: string | null }> => {
    if (!eventId || !user) return { error: "Not signed in" };
    const invalid = validateDocument(file);
    if (invalid) return { error: invalid };

    const safeName = file.name.replace(/[^\w.\-() ]/g, "_");
    const path = `${eventId}/${Date.now()}-${safeName}`;

    const { error: uploadErr } = await supabase.storage
      .from("event-docs")
      .upload(path, file, { contentType: file.type });
    if (uploadErr) return { error: uploadErr.message };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { error: insertErr } = await (supabase as any).from("event_documents").insert({
      event_id: eventId,
      uploaded_by: user.id,
      name: file.name,
      file_path: path,
      size_bytes: file.size,
    });
    if (insertErr) {
      await supabase.storage.from("event-docs").remove([path]);
      return { error: insertErr.message };
    }

    await fetchDocuments();
    return { error: null };
  };

  const deleteDocument = async (doc: EventDocument): Promise<{ error: string | null }> => {
    await supabase.storage.from("event-docs").remove([doc.file_path]);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { error } = await (supabase as any).from("event_documents").delete().eq("id", doc.id);
    if (!error) await fetchDocuments();
    return { error: error?.message ?? null };
  };

  /** Signed URL (1h) — the bucket is private, direct links don't work. */
  const getDownloadUrl = async (doc: EventDocument): Promise<string | null> => {
    const { data } = await supabase.storage
      .from("event-docs")
      .createSignedUrl(doc.file_path, 3600);
    return data?.signedUrl ?? null;
  };

  return { documents, loading, uploadDocument, deleteDocument, getDownloadUrl, refetch: fetchDocuments };
}

/**
 * Post-event links (galleries, Google Drive folders, aftermovies).
 * Same visibility circle as documents; organizer AND approved
 * participants can add, so photographers post their own galleries.
 */
export function useEventLinks(eventId: string | null) {
  const supabase = useSupabase();
  const { user } = useAuth();
  const [links, setLinks] = useState<EventLink[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchLinks = useCallback(async () => {
    if (!eventId || !user) {
      setLinks([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data } = await (supabase as any)
      .from("event_links")
      .select("*")
      .eq("event_id", eventId)
      .order("created_at", { ascending: false });
    setLinks((data ?? []) as EventLink[]);
    setLoading(false);
  }, [supabase, eventId, user]);

  useEffect(() => {
    fetchLinks();
  }, [fetchLinks]);

  const addLink = async (label: string, url: string): Promise<{ error: string | null }> => {
    if (!eventId || !user) return { error: "Not signed in" };
    if (!/^https?:\/\/\S+\.\S+/.test(url.trim())) return { error: "That doesn't look like a valid link" };
    // Server route inserts (RLS-enforced) and notifies approved participants
    try {
      const res = await fetch("/api/events/share-link", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ eventId, label, url }),
      });
      const data = await res.json();
      if (!res.ok) return { error: data.error || "Failed to share link" };
    } catch {
      return { error: "Network error" };
    }
    await fetchLinks();
    return { error: null };
  };

  const deleteLink = async (linkId: string): Promise<{ error: string | null }> => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { error } = await (supabase as any).from("event_links").delete().eq("id", linkId);
    if (!error) await fetchLinks();
    return { error: error?.message ?? null };
  };

  return { links, loading, addLink, deleteLink, refetch: fetchLinks };
}
