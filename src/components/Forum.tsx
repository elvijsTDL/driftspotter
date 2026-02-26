"use client";

import { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { useForumCategories, useForumThreads, useCreateThread, useToggleLike, type ForumThread } from "@/hooks/useForum";
import { useToast } from "@/components/ui/Toast";
import { ThreadSkeleton, CategorySkeleton } from "@/components/ui/Skeleton";

const iconMap: Record<string, React.ReactNode> = {
  "message-circle": <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" /></svg>,
  "star": <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" /></svg>,
  "wrench": <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M14.7 6.3a1 1 0 000 1.4l1.6 1.6a1 1 0 001.4 0l3.77-3.77a6 6 0 01-7.94 7.94l-6.91 6.91a2.12 2.12 0 01-3-3l6.91-6.91a6 6 0 017.94-7.94l-3.76 3.76z" /></svg>,
  "circle": <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10" /></svg>,
  "graduation-cap": <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M22 10v6M2 10l10-5 10 5-10 5z" /><path d="M6 12v5c0 1.1 2.7 3 6 3s6-1.9 6-3v-5" /></svg>,
  "shopping-bag": <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" /><line x1="3" y1="6" x2="21" y2="6" /><path d="M16 10a4 4 0 01-8 0" /></svg>,
};

const tagColors: Record<string, { bg: string; text: string }> = {
  "Build Thread": { bg: "bg-drift-cyan/10", text: "text-drift-cyan" },
  "Discussion": { bg: "bg-badge-official/10", text: "text-badge-official" },
  "Question": { bg: "bg-purple-500/10", text: "text-purple-400" },
  "For Sale": { bg: "bg-badge-grassroots/10", text: "text-badge-grassroots" },
  "Review": { bg: "bg-drift-orange/10", text: "text-drift-orange" },
  "Wanted": { bg: "bg-red-500/10", text: "text-red-400" },
};

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins} min ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs} hr ago`;
  const days = Math.floor(hrs / 24);
  return `${days}d ago`;
}

function ThreadRow({ thread, onLike }: { thread: ForumThread; onLike: () => void }) {
  const tag = tagColors[thread.tag] || { bg: "bg-surface-lighter", text: "text-muted" };
  const avatarLetter = thread.author?.username?.[0]?.toUpperCase() || "?";

  return (
    <div className={`flex items-center gap-4 p-4 rounded-xl hover:bg-surface-lighter/50 transition-colors group ${thread.pinned ? "border-l-2 border-drift-orange" : ""}`}>
      {/* Author avatar */}
      <Link href={`/forum/${thread.id}`} className="flex-shrink-0">
        {thread.author?.avatar_url ? (
          <img src={thread.author.avatar_url} alt="" className="w-10 h-10 rounded-full object-cover" />
        ) : (
          <div className="w-10 h-10 rounded-full bg-surface-lighter flex items-center justify-center text-sm font-semibold text-muted group-hover:bg-surface-light transition-colors">
            {avatarLetter}
          </div>
        )}
      </Link>

      {/* Content */}
      <Link href={`/forum/${thread.id}`} className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          {thread.pinned && (
            <svg width="12" height="12" viewBox="0 0 24 24" fill="#FF6B00" stroke="none"><path d="M12 2l2.4 7.2H22l-6 4.8 2.4 7.2L12 16.8 5.6 21.2l2.4-7.2-6-4.8h7.6z" /></svg>
          )}
          <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${tag.bg} ${tag.text}`}>
            {thread.tag}
          </span>
          <h4 className="text-sm font-medium text-foreground truncate group-hover:text-drift-orange transition-colors">
            {thread.title}
          </h4>
        </div>
        <div className="flex items-center gap-3 mt-1">
          <span className="text-xs text-muted">{thread.author?.username || "Unknown"}</span>
          <span className="text-xs text-muted-dark">&middot;</span>
          <span className="text-xs text-muted-dark">{timeAgo(thread.last_reply_at || thread.created_at)}</span>
        </div>
      </Link>

      {/* Stats */}
      <div className="hidden sm:flex items-center gap-6">
        <div className="text-center">
          <p className="text-sm font-semibold text-foreground">{thread.reply_count}</p>
          <p className="text-[10px] text-muted-dark uppercase">Replies</p>
        </div>
        <button onClick={onLike} className="text-center group/like">
          <p className={`text-sm font-semibold ${thread.user_liked ? "text-drift-orange" : "text-foreground"} group-hover/like:text-drift-orange transition-colors`}>
            {thread.like_count}
          </p>
          <p className="text-[10px] text-muted-dark uppercase">Likes</p>
        </button>
      </div>
    </div>
  );
}

export default function Forum() {
  const { user } = useAuth();
  const { toast } = useToast();
  const { categories, loading: catsLoading } = useForumCategories();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const { threads, loading: threadsLoading, refetch } = useForumThreads(selectedCategory);
  const { createThread, loading: createLoading } = useCreateThread();
  const { toggleLike } = useToggleLike();
  const [showNewThread, setShowNewThread] = useState(false);
  const [newThread, setNewThread] = useState({ title: "", body: "", tag: "Discussion", category_id: "" });

  const handleCreateThread = async () => {
    if (!user) {
      toast("Please sign in to create a thread", "error");
      return;
    }
    if (!newThread.title.trim() || !newThread.body.trim()) {
      toast("Please fill in title and content", "error");
      return;
    }

    const categoryId = newThread.category_id || selectedCategory || "general";
    const { error } = await createThread({
      category_id: categoryId,
      title: newThread.title,
      body: newThread.body,
      tag: newThread.tag,
    });

    if (error) {
      toast(error, "error");
    } else {
      toast("Thread created!", "success");
      setShowNewThread(false);
      setNewThread({ title: "", body: "", tag: "Discussion", category_id: "" });
      refetch();
    }
  };

  const handleLike = async (threadId: string) => {
    if (!user) {
      toast("Please sign in to like", "error");
      return;
    }
    await toggleLike({ threadId });
    refetch();
  };

  const selectedCat = categories.find((c) => c.id === selectedCategory);

  return (
    <section className="relative py-20 md:py-28">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-10">
          <div>
            <h2 className="font-heading font-bold text-3xl md:text-4xl text-foreground tracking-tight">
              COMMUNITY FORUM
            </h2>
            <div className="tire-track w-20 mt-3" />
            <p className="text-muted mt-3">Connect with drifters worldwide. Share builds, ask questions, trade parts.</p>
          </div>
          <button
            onClick={() => {
              if (!user) { toast("Please sign in to create a thread", "error"); return; }
              setShowNewThread(!showNewThread);
            }}
            className="hidden sm:flex items-center gap-2 px-5 py-2.5 bg-drift-orange hover:bg-drift-orange-light text-white font-heading font-semibold text-sm rounded-xl transition-all active:scale-95"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
            New Thread
          </button>
        </div>

        {/* Categories */}
        {!selectedCategory ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-10">
            {catsLoading
              ? Array.from({ length: 6 }).map((_, i) => <CategorySkeleton key={i} />)
              : categories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    className="text-left glass rounded-2xl p-5 hover:border-drift-orange/30 border border-transparent transition-all group hover:-translate-y-0.5"
                  >
                    <div className="flex items-start gap-4">
                      <div
                        className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
                        style={{ backgroundColor: `${cat.color}15`, color: cat.color }}
                      >
                        {iconMap[cat.icon]}
                      </div>
                      <div className="min-w-0">
                        <h3 className="font-heading font-semibold text-foreground group-hover:text-drift-orange transition-colors">
                          {cat.name}
                        </h3>
                        <p className="text-xs text-muted mt-1 line-clamp-2">{cat.description}</p>
                        <div className="flex items-center gap-3 mt-2 text-xs text-muted-dark">
                          <span>{cat.thread_count} threads</span>
                          {cat.last_activity && (
                            <>
                              <span className="w-1 h-1 rounded-full bg-muted-dark" />
                              <span>Active {timeAgo(cat.last_activity)}</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  </button>
                ))}
          </div>
        ) : (
          <>
            {/* Back to categories */}
            <button
              onClick={() => setSelectedCategory(null)}
              className="flex items-center gap-2 text-sm text-muted hover:text-drift-orange transition-colors mb-6"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M15 18l-6-6 6-6" /></svg>
              All Categories
            </button>

            {/* Category header */}
            {selectedCat && (
              <div className="glass rounded-2xl p-5 mb-6">
                <div className="flex items-center gap-4">
                  <div
                    className="w-11 h-11 rounded-xl flex items-center justify-center"
                    style={{ backgroundColor: `${selectedCat.color}15`, color: selectedCat.color }}
                  >
                    {iconMap[selectedCat.icon]}
                  </div>
                  <div>
                    <h3 className="font-heading font-semibold text-xl text-foreground">{selectedCat.name}</h3>
                    <p className="text-sm text-muted">{selectedCat.description}</p>
                  </div>
                </div>
              </div>
            )}
          </>
        )}

        {/* New thread form */}
        {showNewThread && (
          <div className="glass rounded-2xl p-6 mb-6 animate-fade-in-up">
            <h3 className="font-heading font-semibold text-lg text-foreground mb-4">Create New Thread</h3>
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Thread title..."
                value={newThread.title}
                onChange={(e) => setNewThread({ ...newThread, title: e.target.value })}
                className="w-full px-4 py-3 bg-surface-lighter border border-border rounded-xl text-sm text-foreground placeholder:text-muted-dark focus:outline-none focus:border-drift-orange transition-colors"
              />
              <div className="flex gap-3">
                <select
                  value={newThread.category_id || selectedCategory || ""}
                  onChange={(e) => setNewThread({ ...newThread, category_id: e.target.value })}
                  className="px-4 py-3 bg-surface-lighter border border-border rounded-xl text-sm text-foreground focus:outline-none focus:border-drift-orange transition-colors"
                >
                  <option value="">Select Category</option>
                  {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
                <select
                  value={newThread.tag}
                  onChange={(e) => setNewThread({ ...newThread, tag: e.target.value })}
                  className="px-4 py-3 bg-surface-lighter border border-border rounded-xl text-sm text-foreground focus:outline-none focus:border-drift-orange transition-colors"
                >
                  <option>Discussion</option>
                  <option>Question</option>
                  <option>Build Thread</option>
                  <option>Review</option>
                  <option>For Sale</option>
                  <option>Wanted</option>
                </select>
              </div>
              <textarea
                placeholder="What's on your mind?"
                rows={5}
                value={newThread.body}
                onChange={(e) => setNewThread({ ...newThread, body: e.target.value })}
                className="w-full px-4 py-3 bg-surface-lighter border border-border rounded-xl text-sm text-foreground placeholder:text-muted-dark focus:outline-none focus:border-drift-orange transition-colors resize-none"
              />
              <div className="flex justify-end gap-3">
                <button onClick={() => setShowNewThread(false)} className="px-5 py-2.5 text-sm text-muted hover:text-foreground transition-colors">
                  Cancel
                </button>
                <button
                  onClick={handleCreateThread}
                  disabled={createLoading}
                  className="px-5 py-2.5 bg-drift-orange hover:bg-drift-orange-light text-white font-semibold text-sm rounded-xl transition-colors active:scale-95 disabled:opacity-50"
                >
                  {createLoading ? "Posting..." : "Post Thread"}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Threads */}
        <div className="glass rounded-2xl divide-y divide-border overflow-hidden">
          {threadsLoading ? (
            Array.from({ length: 5 }).map((_, i) => <ThreadSkeleton key={i} />)
          ) : threads.length > 0 ? (
            threads.map((thread) => (
              <ThreadRow
                key={thread.id}
                thread={thread}
                onLike={() => handleLike(thread.id)}
              />
            ))
          ) : (
            <div className="p-12 text-center">
              <p className="text-muted">No threads in this category yet.</p>
              <button
                onClick={() => {
                  if (!user) { toast("Please sign in to create a thread", "error"); return; }
                  setShowNewThread(true);
                }}
                className="mt-3 text-sm text-drift-orange hover:underline"
              >
                Be the first to post!
              </button>
            </div>
          )}
        </div>

        {/* Mobile new thread button */}
        <button
          onClick={() => {
            if (!user) { toast("Please sign in to create a thread", "error"); return; }
            setShowNewThread(true);
          }}
          className="sm:hidden fixed bottom-6 right-6 w-14 h-14 rounded-full bg-drift-orange text-white shadow-lg shadow-drift-orange/30 flex items-center justify-center z-40 active:scale-95"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
        </button>
      </div>
    </section>
  );
}
