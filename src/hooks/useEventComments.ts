"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { createBrowserClient } from "@supabase/ssr";
import { useAuth } from "@/contexts/AuthContext";

type Profile = { id: string; username: string; avatar_url: string | null };

function useSupabase() {
  return useMemo(() => createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL ?? "",
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? ""
  ), []);
}

export interface EventComment {
  id: string;
  event_id: string;
  author_id: string;
  parent_comment_id: string | null;
  body: string;
  created_at: string;
  author: Profile;
  like_count: number;
  user_liked: boolean;
  replies: EventComment[];
}

export function useEventComments(eventId: string | null) {
  const supabase = useSupabase();
  const { user } = useAuth();
  const [comments, setComments] = useState<EventComment[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchComments = useCallback(async () => {
    if (!eventId) return;
    setLoading(true);

    const { data: raw } = await supabase
      .from("event_comments")
      .select("*, author:profiles!event_comments_author_id_fkey(id, username, avatar_url)")
      .eq("event_id", eventId)
      .order("created_at", { ascending: true });

    if (!raw) { setLoading(false); return; }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const enriched = await Promise.all(
      (raw as any[]).map(async (c: any) => {
        const { count } = await supabase
          .from("event_comment_likes")
          .select("*", { count: "exact", head: true })
          .eq("comment_id", c.id);

        let userLiked = false;
        if (user) {
          const { data: like } = await supabase
            .from("event_comment_likes")
            .select("id")
            .eq("comment_id", c.id)
            .eq("user_id", user.id)
            .maybeSingle();
          userLiked = !!like;
        }

        const author = Array.isArray(c.author) ? c.author[0] : c.author;

        return {
          id: c.id,
          event_id: c.event_id,
          author_id: c.author_id,
          parent_comment_id: c.parent_comment_id,
          body: c.body,
          created_at: c.created_at,
          author: author as Profile,
          like_count: count ?? 0,
          user_liked: userLiked,
          replies: [] as EventComment[],
        };
      })
    );

    // Build tree
    const topLevel: EventComment[] = [];
    const childMap = new Map<string, EventComment[]>();

    for (const c of enriched) {
      if (!c.parent_comment_id) {
        topLevel.push(c);
      } else {
        const arr = childMap.get(c.parent_comment_id) || [];
        arr.push(c);
        childMap.set(c.parent_comment_id, arr);
      }
    }

    for (const c of topLevel) {
      c.replies = childMap.get(c.id) || [];
    }

    setComments(topLevel);
    setLoading(false);
  }, [supabase, eventId, user]);

  useEffect(() => {
    fetchComments();
  }, [fetchComments]);

  return { comments, loading, refetch: fetchComments };
}

export function useCreateComment() {
  const supabase = useSupabase();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);

  const createComment = async (data: { event_id: string; body: string; parent_comment_id?: string }) => {
    if (!user) return { error: "Not authenticated" };
    setLoading(true);

    const { error } = await supabase
      .from("event_comments")
      .insert({ ...data, author_id: user.id });

    setLoading(false);
    return { error: error?.message ?? null };
  };

  return { createComment, loading };
}

export function useToggleCommentLike() {
  const supabase = useSupabase();
  const { user } = useAuth();

  const toggleLike = async (commentId: string) => {
    if (!user) return { error: "Not authenticated", liked: false };

    const { data: existing } = await supabase
      .from("event_comment_likes")
      .select("id")
      .eq("comment_id", commentId)
      .eq("user_id", user.id)
      .maybeSingle();

    if (existing) {
      await supabase.from("event_comment_likes").delete().eq("id", existing.id);
      return { liked: false, error: null };
    } else {
      const { error } = await supabase
        .from("event_comment_likes")
        .insert({ comment_id: commentId, user_id: user.id });
      return { liked: !error, error: error?.message ?? null };
    }
  };

  return { toggleLike };
}
