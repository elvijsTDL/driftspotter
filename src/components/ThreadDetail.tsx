"use client";

import { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import {
  useThread,
  useCreateReply,
  useUpdateThread,
  useDeleteThread,
  useUpdateReply,
  useDeleteReply,
  useToggleLike,
  type ForumReply,
} from "@/hooks/useForum";
import { useToast } from "@/components/ui/Toast";
import { Skeleton } from "@/components/ui/Skeleton";

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

function ReplyItem({
  reply,
  depth,
  threadId,
  onRefetch,
}: {
  reply: ForumReply;
  depth: number;
  threadId: string;
  onRefetch: () => void;
}) {
  const { user } = useAuth();
  const { toast } = useToast();
  const { createReply, loading: replyLoading } = useCreateReply();
  const { updateReply } = useUpdateReply();
  const { deleteReply } = useDeleteReply();
  const { toggleLike } = useToggleLike();
  const [showReply, setShowReply] = useState(false);
  const [replyText, setReplyText] = useState("");
  const [editing, setEditing] = useState(false);
  const [editText, setEditText] = useState(reply.body);

  const handleReply = async () => {
    if (!replyText.trim()) return;
    const { error } = await createReply({
      thread_id: threadId,
      body: replyText,
      parent_reply_id: reply.id,
    });
    if (error) toast(error, "error");
    else {
      setReplyText("");
      setShowReply(false);
      onRefetch();
    }
  };

  const handleEdit = async () => {
    const { error } = await updateReply(reply.id, editText);
    if (error) toast(error, "error");
    else { setEditing(false); onRefetch(); }
  };

  const handleDelete = async () => {
    const { error } = await deleteReply(reply.id);
    if (error) toast(error, "error");
    else onRefetch();
  };

  const handleLike = async () => {
    if (!user) { toast("Please sign in to like", "error"); return; }
    await toggleLike({ replyId: reply.id });
    onRefetch();
  };

  const avatarLetter = reply.author?.username?.[0]?.toUpperCase() || "?";
  const isOwner = user?.id === reply.author_id;

  return (
    <div className={depth > 0 ? "ml-4 pl-4 border-l border-border" : ""}>
      <div className="flex gap-3 py-3">
        {reply.author?.avatar_url ? (
          <img src={reply.author.avatar_url} alt="" className="w-8 h-8 rounded-full object-cover flex-shrink-0" />
        ) : (
          <div className="w-8 h-8 rounded-full bg-surface-lighter flex items-center justify-center text-xs font-semibold text-muted flex-shrink-0">
            {avatarLetter}
          </div>
        )}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-sm font-semibold text-foreground">{reply.author?.username || "Unknown"}</span>
            <span className="text-xs text-muted-dark">{timeAgo(reply.created_at)}</span>
            {reply.updated_at !== reply.created_at && (
              <span className="text-[10px] text-muted-dark">(edited)</span>
            )}
          </div>

          {editing ? (
            <div className="space-y-2">
              <textarea
                value={editText}
                onChange={(e) => setEditText(e.target.value)}
                rows={3}
                className="w-full px-3 py-2 bg-surface-lighter border border-border rounded-lg text-sm text-foreground focus:outline-none focus:border-drift-orange transition-colors resize-none"
              />
              <div className="flex gap-2">
                <button onClick={handleEdit} className="px-3 py-1 bg-drift-orange text-white text-xs font-semibold rounded-lg">Save</button>
                <button onClick={() => setEditing(false)} className="px-3 py-1 text-xs text-muted hover:text-foreground">Cancel</button>
              </div>
            </div>
          ) : (
            <p className="text-sm text-muted leading-relaxed whitespace-pre-wrap">{reply.body}</p>
          )}

          <div className="flex items-center gap-4 mt-2">
            <button onClick={handleLike} className={`flex items-center gap-1 text-xs transition-colors ${reply.user_liked ? "text-drift-orange" : "text-muted-dark hover:text-drift-orange"}`}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill={reply.user_liked ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2"><path d="M20.42 4.58a5.4 5.4 0 00-7.65 0l-.77.78-.77-.78a5.4 5.4 0 00-7.65 7.65l.78.77L12 20.64l7.64-7.64.78-.77a5.4 5.4 0 000-7.65z" /></svg>
              {reply.like_count}
            </button>
            {depth < 1 && (
              <button
                onClick={() => { if (!user) { toast("Please sign in to reply", "error"); return; } setShowReply(!showReply); }}
                className="text-xs text-muted-dark hover:text-drift-orange transition-colors"
              >
                Reply
              </button>
            )}
            {isOwner && !editing && (
              <>
                <button onClick={() => setEditing(true)} className="text-xs text-muted-dark hover:text-drift-cyan transition-colors">Edit</button>
                <button onClick={handleDelete} className="text-xs text-muted-dark hover:text-red-400 transition-colors">Delete</button>
              </>
            )}
          </div>

          {showReply && (
            <div className="mt-3 flex gap-2">
              <textarea
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                placeholder="Write a reply..."
                rows={2}
                className="flex-1 px-3 py-2 bg-surface-lighter border border-border rounded-lg text-sm text-foreground placeholder:text-muted-dark focus:outline-none focus:border-drift-orange transition-colors resize-none"
              />
              <button
                onClick={handleReply}
                disabled={replyLoading}
                className="self-end px-4 py-2 bg-drift-orange text-white text-xs font-semibold rounded-lg disabled:opacity-50"
              >
                Reply
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Children */}
      {reply.children.map((child) => (
        <ReplyItem key={child.id} reply={child} depth={depth + 1} threadId={threadId} onRefetch={onRefetch} />
      ))}
    </div>
  );
}

export default function ThreadDetail({ threadId }: { threadId: string }) {
  const { user } = useAuth();
  const { toast } = useToast();
  const { thread, replies, loading, refetch } = useThread(threadId);
  const { createReply, loading: replyLoading } = useCreateReply();
  const { updateThread } = useUpdateThread();
  const { deleteThread } = useDeleteThread();
  const { toggleLike } = useToggleLike();
  const [replyText, setReplyText] = useState("");
  const [editing, setEditing] = useState(false);
  const [editTitle, setEditTitle] = useState("");
  const [editBody, setEditBody] = useState("");

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-24 space-y-4">
        <Skeleton className="h-8 w-2/3" />
        <Skeleton className="h-4 w-1/3" />
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-20 w-full" />
        <Skeleton className="h-20 w-full" />
      </div>
    );
  }

  if (!thread) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-24 text-center">
        <p className="text-muted text-lg">Thread not found.</p>
        <Link href="/forum" className="text-drift-orange hover:underline text-sm mt-4 inline-block">Back to Forum</Link>
      </div>
    );
  }

  const isOwner = user?.id === thread.author_id;
  const avatarLetter = thread.author?.username?.[0]?.toUpperCase() || "?";

  const handleReply = async () => {
    if (!user) { toast("Please sign in to reply", "error"); return; }
    if (!replyText.trim()) return;
    const { error } = await createReply({ thread_id: threadId, body: replyText });
    if (error) toast(error, "error");
    else { setReplyText(""); refetch(); }
  };

  const handleEdit = async () => {
    const { error } = await updateThread(threadId, { title: editTitle, body: editBody });
    if (error) toast(error, "error");
    else { setEditing(false); refetch(); }
  };

  const handleDelete = async () => {
    const { error } = await deleteThread(threadId);
    if (error) toast(error, "error");
    else window.location.href = "/forum";
  };

  const handleLikeThread = async () => {
    if (!user) { toast("Please sign in to like", "error"); return; }
    await toggleLike({ threadId });
    refetch();
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-24">
      {/* Breadcrumb */}
      <Link href="/forum" className="flex items-center gap-2 text-sm text-muted hover:text-drift-orange transition-colors mb-6">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M15 18l-6-6 6-6" /></svg>
        Back to Forum
      </Link>

      {/* Thread */}
      <div className="glass rounded-2xl p-6 mb-6">
        {editing ? (
          <div className="space-y-4">
            <input
              type="text"
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              className="w-full px-4 py-3 bg-surface-lighter border border-border rounded-xl text-lg font-heading font-semibold text-foreground focus:outline-none focus:border-drift-orange transition-colors"
            />
            <textarea
              value={editBody}
              onChange={(e) => setEditBody(e.target.value)}
              rows={6}
              className="w-full px-4 py-3 bg-surface-lighter border border-border rounded-xl text-sm text-foreground focus:outline-none focus:border-drift-orange transition-colors resize-none"
            />
            <div className="flex gap-3">
              <button onClick={handleEdit} className="px-5 py-2 bg-drift-orange text-white font-semibold text-sm rounded-xl">Save Changes</button>
              <button onClick={() => setEditing(false)} className="px-5 py-2 text-sm text-muted hover:text-foreground">Cancel</button>
            </div>
          </div>
        ) : (
          <>
            <div className="flex items-start gap-4">
              {thread.author?.avatar_url ? (
                <img src={thread.author.avatar_url} alt="" className="w-12 h-12 rounded-full object-cover flex-shrink-0" />
              ) : (
                <div className="w-12 h-12 rounded-full bg-surface-lighter flex items-center justify-center text-sm font-semibold text-muted flex-shrink-0">
                  {avatarLetter}
                </div>
              )}
              <div className="flex-1 min-w-0">
                <h1 className="font-heading font-bold text-xl md:text-2xl text-foreground leading-tight">{thread.title}</h1>
                <div className="flex items-center gap-3 mt-2">
                  <span className="text-sm text-muted">{thread.author?.username || "Unknown"}</span>
                  <span className="text-xs text-muted-dark">{timeAgo(thread.created_at)}</span>
                  {thread.updated_at !== thread.created_at && (
                    <span className="text-[10px] text-muted-dark">(edited)</span>
                  )}
                </div>
              </div>
            </div>

            <div className="mt-4 text-sm text-muted leading-relaxed whitespace-pre-wrap">{thread.body}</div>

            <div className="flex items-center gap-4 mt-5 pt-4 border-t border-border">
              <button onClick={handleLikeThread} className={`flex items-center gap-1.5 text-sm transition-colors ${thread.user_liked ? "text-drift-orange" : "text-muted hover:text-drift-orange"}`}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill={thread.user_liked ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2"><path d="M20.42 4.58a5.4 5.4 0 00-7.65 0l-.77.78-.77-.78a5.4 5.4 0 00-7.65 7.65l.78.77L12 20.64l7.64-7.64.78-.77a5.4 5.4 0 000-7.65z" /></svg>
                {thread.like_count} {thread.like_count === 1 ? "Like" : "Likes"}
              </button>
              <span className="text-sm text-muted">
                {thread.reply_count} {thread.reply_count === 1 ? "Reply" : "Replies"}
              </span>
              {isOwner && (
                <>
                  <button onClick={() => { setEditTitle(thread.title); setEditBody(thread.body); setEditing(true); }} className="text-sm text-muted hover:text-drift-cyan transition-colors ml-auto">Edit</button>
                  <button onClick={handleDelete} className="text-sm text-muted hover:text-red-400 transition-colors">Delete</button>
                </>
              )}
            </div>
          </>
        )}
      </div>

      {/* Reply form */}
      <div className="glass rounded-2xl p-5 mb-6">
        <div className="flex gap-3">
          {user ? (
            <>
              <div className="w-9 h-9 rounded-full bg-drift-orange/20 flex items-center justify-center text-xs text-drift-orange font-semibold flex-shrink-0">
                {user.email?.[0]?.toUpperCase() || "?"}
              </div>
              <div className="flex-1">
                <textarea
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  placeholder="Write a reply..."
                  rows={3}
                  className="w-full px-4 py-3 bg-surface-lighter border border-border rounded-xl text-sm text-foreground placeholder:text-muted-dark focus:outline-none focus:border-drift-orange transition-colors resize-none"
                />
                {replyText.trim() && (
                  <button
                    onClick={handleReply}
                    disabled={replyLoading}
                    className="mt-2 px-5 py-2 bg-drift-orange hover:bg-drift-orange-light text-white text-sm font-semibold rounded-xl transition-colors disabled:opacity-50"
                  >
                    {replyLoading ? "Posting..." : "Post Reply"}
                  </button>
                )}
              </div>
            </>
          ) : (
            <p className="text-sm text-muted text-center w-full py-2">
              <Link href="#" className="text-drift-orange hover:underline">Sign in</Link> to reply to this thread.
            </p>
          )}
        </div>
      </div>

      {/* Replies */}
      <div className="glass rounded-2xl divide-y divide-border/50 overflow-hidden px-4">
        {replies.length === 0 ? (
          <div className="py-8 text-center text-sm text-muted">No replies yet. Be the first to respond!</div>
        ) : (
          replies.map((reply) => (
            <ReplyItem key={reply.id} reply={reply} depth={0} threadId={threadId} onRefetch={refetch} />
          ))
        )}
      </div>
    </div>
  );
}
