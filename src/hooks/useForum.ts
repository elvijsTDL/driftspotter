"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { createBrowserClient } from "@supabase/ssr";
import { useAuth } from "@/contexts/AuthContext";

type Profile = { id: string; username: string; avatar_url: string | null };

export interface ForumCategory {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  sort_order: number;
  thread_count: number;
  last_activity: string | null;
}

export interface ForumThread {
  id: string;
  category_id: string;
  author_id: string;
  title: string;
  body: string;
  tag: string;
  pinned: boolean;
  created_at: string;
  updated_at: string;
  author: Profile;
  reply_count: number;
  like_count: number;
  user_liked: boolean;
  last_reply_at: string | null;
}

export interface ForumReply {
  id: string;
  thread_id: string;
  author_id: string;
  parent_reply_id: string | null;
  body: string;
  created_at: string;
  updated_at: string;
  author: Profile;
  like_count: number;
  user_liked: boolean;
  children: ForumReply[];
}

function useSupabase() {
  return useMemo(() => createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  ), []);
}

// ─── Categories ───

export function useForumCategories() {
  const supabase = useSupabase();
  const [categories, setCategories] = useState<ForumCategory[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const { data: cats } = await supabase
        .from("forum_categories")
        .select("*")
        .order("sort_order");

      if (!cats) { setLoading(false); return; }

      const enriched: ForumCategory[] = await Promise.all(
        cats.map(async (cat) => {
          const { count } = await supabase
            .from("forum_threads")
            .select("*", { count: "exact", head: true })
            .eq("category_id", cat.id);

          const { data: latest } = await supabase
            .from("forum_threads")
            .select("created_at")
            .eq("category_id", cat.id)
            .order("created_at", { ascending: false })
            .limit(1);

          return {
            ...cat,
            thread_count: count ?? 0,
            last_activity: latest?.[0]?.created_at ?? null,
          };
        })
      );

      setCategories(enriched);
      setLoading(false);
    };

    load();
  }, [supabase]);

  return { categories, loading };
}

// ─── Thread List ───

export function useForumThreads(categoryId?: string | null) {
  const supabase = useSupabase();
  const { user } = useAuth();
  const [threads, setThreads] = useState<ForumThread[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchThreads = useCallback(async () => {
    setLoading(true);
    let query = supabase
      .from("forum_threads")
      .select("*, author:profiles!forum_threads_author_id_fkey(id, username, avatar_url)")
      .order("pinned", { ascending: false })
      .order("created_at", { ascending: false });

    if (categoryId) {
      query = query.eq("category_id", categoryId);
    }

    const { data: rawThreads } = await query;
    if (!rawThreads) { setLoading(false); return; }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const enriched: ForumThread[] = await Promise.all(
      (rawThreads as any[]).map(async (t: any) => {
        const { count: replyCount } = await supabase
          .from("forum_replies")
          .select("*", { count: "exact", head: true })
          .eq("thread_id", t.id);

        const { count: likeCount } = await supabase
          .from("likes")
          .select("*", { count: "exact", head: true })
          .eq("thread_id", t.id);

        let userLiked = false;
        if (user) {
          const { data: like } = await supabase
            .from("likes")
            .select("id")
            .eq("thread_id", t.id)
            .eq("user_id", user.id)
            .maybeSingle();
          userLiked = !!like;
        }

        const { data: lastReply } = await supabase
          .from("forum_replies")
          .select("created_at")
          .eq("thread_id", t.id)
          .order("created_at", { ascending: false })
          .limit(1);

        const author = Array.isArray(t.author) ? t.author[0] : t.author;

        return {
          id: t.id,
          category_id: t.category_id,
          author_id: t.author_id,
          title: t.title,
          body: t.body,
          tag: t.tag,
          pinned: t.pinned,
          created_at: t.created_at,
          updated_at: t.updated_at,
          author: author as Profile,
          reply_count: replyCount ?? 0,
          like_count: likeCount ?? 0,
          user_liked: userLiked,
          last_reply_at: lastReply?.[0]?.created_at ?? null,
        };
      })
    );

    setThreads(enriched);
    setLoading(false);
  }, [supabase, categoryId, user]);

  useEffect(() => {
    fetchThreads();
  }, [fetchThreads]);

  return { threads, loading, refetch: fetchThreads };
}

// ─── Single Thread + Replies ───

export function useThread(threadId: string | null) {
  const supabase = useSupabase();
  const { user } = useAuth();
  const [thread, setThread] = useState<ForumThread | null>(null);
  const [replies, setReplies] = useState<ForumReply[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchThread = useCallback(async () => {
    if (!threadId) return;
    setLoading(true);

    const { data: rawT } = await supabase
      .from("forum_threads")
      .select("*, author:profiles!forum_threads_author_id_fkey(id, username, avatar_url)")
      .eq("id", threadId)
      .single();

    if (!rawT) { setLoading(false); return; }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const t = rawT as any;

    const { count: replyCount } = await supabase
      .from("forum_replies")
      .select("*", { count: "exact", head: true })
      .eq("thread_id", threadId);

    const { count: likeCount } = await supabase
      .from("likes")
      .select("*", { count: "exact", head: true })
      .eq("thread_id", threadId);

    let userLiked = false;
    if (user) {
      const { data: like } = await supabase
        .from("likes")
        .select("id")
        .eq("thread_id", threadId)
        .eq("user_id", user.id)
        .maybeSingle();
      userLiked = !!like;
    }

    const author = Array.isArray(t.author) ? t.author[0] : t.author;

    setThread({
      id: t.id,
      category_id: t.category_id,
      author_id: t.author_id,
      title: t.title,
      body: t.body,
      tag: t.tag,
      pinned: t.pinned,
      created_at: t.created_at,
      updated_at: t.updated_at,
      author: author as Profile,
      reply_count: replyCount ?? 0,
      like_count: likeCount ?? 0,
      user_liked: userLiked,
      last_reply_at: null,
    });

    // Fetch replies
    const { data: rawReplies } = await supabase
      .from("forum_replies")
      .select("*, author:profiles!forum_replies_author_id_fkey(id, username, avatar_url)")
      .eq("thread_id", threadId)
      .order("created_at", { ascending: true });

    if (rawReplies) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const enrichedReplies: ForumReply[] = await Promise.all(
        (rawReplies as any[]).map(async (r: any) => {
          const { count: rLikeCount } = await supabase
            .from("likes")
            .select("*", { count: "exact", head: true })
            .eq("reply_id", r.id);

          let rUserLiked = false;
          if (user) {
            const { data: like } = await supabase
              .from("likes")
              .select("id")
              .eq("reply_id", r.id)
              .eq("user_id", user.id)
              .maybeSingle();
            rUserLiked = !!like;
          }

          const rAuthor = Array.isArray(r.author) ? r.author[0] : r.author;

          return {
            id: r.id,
            thread_id: r.thread_id,
            author_id: r.author_id,
            parent_reply_id: r.parent_reply_id,
            body: r.body,
            created_at: r.created_at,
            updated_at: r.updated_at,
            author: rAuthor as Profile,
            like_count: rLikeCount ?? 0,
            user_liked: rUserLiked,
            children: [],
          };
        })
      );

      // Build tree (max 2 levels)
      const topLevel: ForumReply[] = [];
      const childMap = new Map<string, ForumReply[]>();

      for (const reply of enrichedReplies) {
        if (!reply.parent_reply_id) {
          topLevel.push(reply);
        } else {
          const existing = childMap.get(reply.parent_reply_id) || [];
          existing.push(reply);
          childMap.set(reply.parent_reply_id, existing);
        }
      }

      for (const reply of topLevel) {
        reply.children = childMap.get(reply.id) || [];
      }

      setReplies(topLevel);
    }

    setLoading(false);
  }, [supabase, threadId, user]);

  useEffect(() => {
    fetchThread();
  }, [fetchThread]);

  // Realtime subscription for new replies
  useEffect(() => {
    if (!threadId) return;

    const channel = supabase
      .channel(`thread-${threadId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "forum_replies",
          filter: `thread_id=eq.${threadId}`,
        },
        () => {
          fetchThread();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase, threadId, fetchThread]);

  return { thread, replies, loading, refetch: fetchThread };
}

// ─── Mutations ───

export function useCreateThread() {
  const supabase = useSupabase();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);

  const createThread = async (data: { category_id: string; title: string; body: string; tag: string }) => {
    if (!user) return { error: "Not authenticated", thread: null };
    setLoading(true);

    const { data: thread, error } = await supabase
      .from("forum_threads")
      .insert({ ...data, author_id: user.id })
      .select()
      .single();

    setLoading(false);
    return { thread, error: error?.message ?? null };
  };

  return { createThread, loading };
}

export function useUpdateThread() {
  const supabase = useSupabase();
  const [loading, setLoading] = useState(false);

  const updateThread = async (id: string, data: { title?: string; body?: string; tag?: string }) => {
    setLoading(true);
    const { error } = await supabase
      .from("forum_threads")
      .update({ ...data, updated_at: new Date().toISOString() })
      .eq("id", id);
    setLoading(false);
    return { error: error?.message ?? null };
  };

  return { updateThread, loading };
}

export function useDeleteThread() {
  const supabase = useSupabase();

  const deleteThread = async (id: string) => {
    const { error } = await supabase.from("forum_threads").delete().eq("id", id);
    return { error: error?.message ?? null };
  };

  return { deleteThread };
}

export function useCreateReply() {
  const supabase = useSupabase();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);

  const createReply = async (data: { thread_id: string; body: string; parent_reply_id?: string }) => {
    if (!user) return { error: "Not authenticated" };
    setLoading(true);

    const { error } = await supabase
      .from("forum_replies")
      .insert({ ...data, author_id: user.id });

    setLoading(false);
    return { error: error?.message ?? null };
  };

  return { createReply, loading };
}

export function useUpdateReply() {
  const supabase = useSupabase();

  const updateReply = async (id: string, body: string) => {
    const { error } = await supabase
      .from("forum_replies")
      .update({ body, updated_at: new Date().toISOString() })
      .eq("id", id);
    return { error: error?.message ?? null };
  };

  return { updateReply };
}

export function useDeleteReply() {
  const supabase = useSupabase();

  const deleteReply = async (id: string) => {
    const { error } = await supabase.from("forum_replies").delete().eq("id", id);
    return { error: error?.message ?? null };
  };

  return { deleteReply };
}

export function useToggleLike() {
  const supabase = useSupabase();
  const { user } = useAuth();

  const toggleLike = async (opts: { threadId?: string; replyId?: string }) => {
    if (!user) return { error: "Not authenticated", liked: false };

    const col = opts.threadId ? "thread_id" : "reply_id";
    const val = opts.threadId || opts.replyId;

    const { data: existing } = await supabase
      .from("likes")
      .select("id")
      .eq("user_id", user.id)
      .eq(col, val!)
      .maybeSingle();

    if (existing) {
      await supabase.from("likes").delete().eq("id", existing.id);
      return { liked: false, error: null };
    } else {
      const insertData: Record<string, string> = { user_id: user.id };
      if (opts.threadId) insertData.thread_id = opts.threadId;
      if (opts.replyId) insertData.reply_id = opts.replyId;

      const { error } = await supabase.from("likes").insert(insertData);
      return { liked: !error, error: error?.message ?? null };
    }
  };

  return { toggleLike };
}
