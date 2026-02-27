"use client";

import Link from "next/link";
import { type DriftEvent } from "@/data/events";
import { useAuth } from "@/contexts/AuthContext";
import { useEventComments, useCreateComment, useToggleCommentLike } from "@/hooks/useEventComments";
import { useEventRsvp } from "@/hooks/useEventRsvp";
import { useToast } from "@/components/ui/Toast";
import { CommentSkeleton } from "@/components/ui/Skeleton";
import { shareEvent } from "@/lib/shareEvent";
import { useState } from "react";

const categoryColors: Record<string, { bg: string; text: string; label: string }> = {
  official: { bg: "bg-badge-official/20", text: "text-badge-official", label: "Official" },
  grassroots: { bg: "bg-badge-grassroots/20", text: "text-badge-grassroots", label: "Grassroots" },
  proam: { bg: "bg-badge-proam/20", text: "text-badge-proam", label: "Pro-Am" },
  practice: { bg: "bg-badge-practice/20", text: "text-badge-practice", label: "Practice" },
};

const participationInfo = (p: "drive" | "watch" | "both") => {
  if (p === "drive") return { label: "You Can Drive", bg: "bg-drift-orange/10", text: "text-drift-orange", border: "border-drift-orange/20" };
  if (p === "watch") return { label: "Spectator Event", bg: "bg-drift-cyan/10", text: "text-drift-cyan", border: "border-drift-cyan/20" };
  return { label: "Drive or Watch", bg: "bg-purple-500/10", text: "text-purple-400", border: "border-purple-500/20" };
};

const gradients = [
  "from-drift-orange/30 via-red-900/20 to-surface",
  "from-drift-cyan/20 via-blue-900/20 to-surface",
  "from-purple-600/20 via-indigo-900/20 to-surface",
  "from-green-600/20 via-emerald-900/20 to-surface",
];

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

export default function EventDetailPage({ event }: { event: DriftEvent }) {
  const { user } = useAuth();
  const { toast } = useToast();
  const { comments, loading: commentsLoading, refetch: refetchComments } = useEventComments(event.id);
  const { userStatus, goingCount, toggleRsvp } = useEventRsvp(event.id);
  const { createComment, loading: commentLoading } = useCreateComment();
  const { toggleLike: toggleCommentLike } = useToggleCommentLike();
  const [commentText, setCommentText] = useState("");
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyText, setReplyText] = useState("");

  const cat = categoryColors[event.category];
  const gradient = gradients[event.id.charCodeAt(0) % gradients.length];

  const handleRsvp = async (status: "going" | "interested") => {
    if (!user) { toast("Please sign in to RSVP", "error"); return; }
    await toggleRsvp(status);
  };

  const handleComment = async () => {
    if (!user) { toast("Please sign in to comment", "error"); return; }
    if (!commentText.trim()) return;
    const { error } = await createComment({ event_id: event.id, body: commentText });
    if (error) toast(error, "error");
    else { setCommentText(""); refetchComments(); }
  };

  const handleReply = async (parentId: string) => {
    if (!user) { toast("Please sign in to reply", "error"); return; }
    if (!replyText.trim()) return;
    const { error } = await createComment({ event_id: event.id, body: replyText, parent_comment_id: parentId });
    if (error) toast(error, "error");
    else { setReplyText(""); setReplyingTo(null); refetchComments(); }
  };

  const handleLikeComment = async (commentId: string) => {
    if (!user) { toast("Please sign in to like", "error"); return; }
    await toggleCommentLike(commentId);
    refetchComments();
  };

  return (
    <section className="relative pt-28 pb-20 md:pt-32 md:pb-28">
      <div className="max-w-2xl mx-auto px-4 sm:px-6">
        {/* Breadcrumb */}
        <nav className="mb-6 flex items-center gap-2 text-sm text-muted">
          <Link href="/events" className="hover:text-drift-orange transition-colors">Events</Link>
          <span>/</span>
          <span className="text-foreground">{event.name}</span>
        </nav>

        <div className="rounded-2xl glass overflow-hidden">
          {/* Header image */}
          <div className={`relative h-56 bg-gradient-to-br ${gradient}`}>
            <div className="absolute inset-0 carbon-bg opacity-20" />
            <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-surface to-transparent" />
            <div className="absolute bottom-4 left-6">
              <span className={`px-3 py-1 rounded-full text-xs font-semibold ${cat.bg} ${cat.text}`}>
                {cat.label}
              </span>
            </div>
          </div>

          {/* Content */}
          <div className="p-6">
            {event.series && (
              <p className="text-xs text-drift-orange font-medium uppercase tracking-wider mb-1">{event.series}</p>
            )}
            <h1 className="font-heading font-bold text-2xl text-foreground leading-tight mb-2">
              {event.name}
            </h1>

            <p className="text-sm text-muted mb-4">Organized by <span className="text-foreground font-medium">{event.organizer}</span></p>

            {/* Date & Location */}
            <div className="flex flex-col sm:flex-row gap-4 mb-5">
              <div className="flex items-center gap-2 text-sm text-muted">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#FF6B00" strokeWidth="2" strokeLinecap="round">
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" />
                </svg>
                {new Date(event.date).toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" })}
                {event.endDate && ` - ${new Date(event.endDate).toLocaleDateString("en-US", { month: "long", day: "numeric" })}`}
              </div>
              <div className="flex items-center gap-2 text-sm text-muted">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#FF6B00" strokeWidth="2" strokeLinecap="round">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" />
                </svg>
                {event.track}, {event.location}
              </div>
            </div>

            {/* Requirement badges */}
            <div className="flex flex-wrap gap-2 mb-5">
              {(() => {
                const pi = participationInfo(event.participation);
                return (
                  <span className={`px-3 py-1 rounded-lg text-xs font-semibold ${pi.bg} ${pi.text} border ${pi.border}`}>
                    {pi.label}
                  </span>
                );
              })()}
              {event.cageRequired && (
                <span className="px-3 py-1 rounded-lg text-xs font-medium bg-red-500/10 text-red-400 border border-red-500/20">
                  Roll Cage Required
                </span>
              )}
              <span className="px-3 py-1 rounded-lg text-xs font-medium bg-surface-lighter text-muted border border-border">
                Tires: {event.tireSize === "unlimited" ? "Unlimited" : `${event.tireSize} Max`}
              </span>
              <span className="px-3 py-1 rounded-lg text-xs font-medium bg-surface-lighter text-muted border border-border capitalize">
                {event.skillLevel} Level
              </span>
              {event.price && (
                <span className="px-3 py-1 rounded-lg text-xs font-semibold bg-drift-orange/10 text-drift-orange border border-drift-orange/20">
                  {event.price}
                </span>
              )}
            </div>

            {/* Description */}
            <p className="text-sm text-muted leading-relaxed mb-6">{event.description}</p>

            {/* RSVP */}
            <div className="flex items-center gap-3 mb-6">
              <button
                onClick={() => handleRsvp("going")}
                className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition-all active:scale-95 ${
                  userStatus === "going" ? "bg-drift-orange text-white glow-orange" : "glass border border-border hover:border-drift-orange hover:text-drift-orange"
                }`}
              >
                I&apos;m Going
              </button>
              <button
                onClick={() => handleRsvp("interested")}
                className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition-all active:scale-95 ${
                  userStatus === "interested" ? "bg-drift-cyan/20 text-drift-cyan border border-drift-cyan/30" : "glass border border-border hover:border-drift-cyan hover:text-drift-cyan"
                }`}
              >
                Interested
              </button>
              <div className="flex items-center gap-2 ml-auto">
                <div className="flex -space-x-2">
                  {[0, 1, 2, 3].map((i) => (
                    <div key={i} className="w-7 h-7 rounded-full bg-surface-lighter border-2 border-surface flex items-center justify-center text-[10px] text-muted">
                      {String.fromCharCode(65 + i)}
                    </div>
                  ))}
                </div>
                <span className="text-sm text-muted">{event.attendees + goingCount} going</span>
              </div>
            </div>

            {/* Share */}
            <button
              onClick={async () => {
                const result = await shareEvent(event);
                if (result === "copied") toast("Link copied!");
                else if (result === "failed") toast("Could not share event", "error");
              }}
              className="flex items-center justify-center gap-2 w-full px-4 py-3 rounded-xl glass border border-border hover:border-drift-orange text-sm font-medium text-muted hover:text-drift-orange transition-all mb-6"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="18" cy="5" r="3" /><circle cx="6" cy="12" r="3" /><circle cx="18" cy="19" r="3" /><line x1="8.59" y1="13.51" x2="15.42" y2="17.49" /><line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
              </svg>
              Share Event
            </button>

            {/* Plan Your Trip */}
            <div className="rounded-xl bg-surface-lighter border border-border p-5 mb-6">
              <h3 className="font-heading font-semibold text-sm text-foreground mb-3 uppercase tracking-wider">
                Plan Your Trip
              </h3>
              <p className="text-xs text-muted mb-4">
                Find accommodation near {event.track} for the event
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <a
                  href={`https://www.booking.com/searchresults.html?ss=${encodeURIComponent(event.location)}&checkin=${event.date}&checkout=${event.endDate || event.date}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#003580] hover:bg-[#00264d] text-white text-sm font-semibold transition-colors"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" /><polyline points="9 22 9 12 15 12 15 22" /></svg>
                  Find Hotels
                </a>
                <a
                  href={`https://www.tripadvisor.com/Search?q=${encodeURIComponent(event.location)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#34E0A1]/10 hover:bg-[#34E0A1]/20 text-[#34E0A1] border border-[#34E0A1]/20 text-sm font-semibold transition-colors"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10" /><path d="M12 6v6l4 2" /></svg>
                  See Accommodation
                </a>
              </div>
            </div>

            {/* External link */}
            {event.eventUrl && (
              <a
                href={event.eventUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full px-4 py-3 rounded-xl glass border border-border hover:border-drift-orange text-sm font-medium text-muted hover:text-drift-orange transition-all mb-8"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6" /><polyline points="15 3 21 3 21 9" /><line x1="10" y1="14" x2="21" y2="3" /></svg>
                Visit Official Event Page
              </a>
            )}

            {/* Comments */}
            <div className="border-t border-border pt-6">
              <h3 className="font-heading font-semibold text-lg text-foreground mb-4">
                Comments <span className="text-muted text-sm font-normal">({comments.length})</span>
              </h3>

              {/* Comment input */}
              <div className="flex gap-3 mb-6">
                <div className="w-9 h-9 rounded-full bg-drift-orange/20 flex items-center justify-center text-xs text-drift-orange font-semibold flex-shrink-0">
                  {user?.email?.[0]?.toUpperCase() || "?"}
                </div>
                <div className="flex-1">
                  <textarea
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    placeholder={user ? "Add a comment..." : "Sign in to comment..."}
                    rows={2}
                    disabled={!user}
                    className="w-full px-4 py-3 bg-surface-lighter border border-border rounded-xl text-sm text-foreground placeholder:text-muted-dark focus:outline-none focus:border-drift-orange transition-colors resize-none disabled:opacity-50"
                  />
                  {commentText.trim() && (
                    <button
                      onClick={handleComment}
                      disabled={commentLoading}
                      className="mt-2 px-4 py-1.5 bg-drift-orange text-white text-xs font-semibold rounded-lg hover:bg-drift-orange-light transition-colors disabled:opacity-50"
                    >
                      {commentLoading ? "Posting..." : "Post Comment"}
                    </button>
                  )}
                </div>
              </div>

              {/* Comments list */}
              <div className="space-y-5">
                {commentsLoading ? (
                  Array.from({ length: 3 }).map((_, i) => <CommentSkeleton key={i} />)
                ) : comments.length === 0 ? (
                  <p className="text-sm text-muted text-center py-4">No comments yet. Be the first!</p>
                ) : (
                  comments.map((comment) => (
                    <div key={comment.id}>
                      <div className="flex gap-3">
                        {comment.author?.avatar_url ? (
                          <img src={comment.author.avatar_url} alt="" className="w-9 h-9 rounded-full object-cover flex-shrink-0" />
                        ) : (
                          <div className="w-9 h-9 rounded-full bg-surface-lighter flex items-center justify-center text-xs text-muted font-semibold flex-shrink-0">
                            {comment.author?.username?.[0]?.toUpperCase() || "?"}
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-sm font-semibold text-foreground">{comment.author?.username || "Unknown"}</span>
                            <span className="text-xs text-muted-dark">{timeAgo(comment.created_at)}</span>
                          </div>
                          <p className="text-sm text-muted leading-relaxed">{comment.body}</p>
                          <div className="flex items-center gap-4 mt-2">
                            <button
                              onClick={() => handleLikeComment(comment.id)}
                              className={`flex items-center gap-1 text-xs transition-colors ${comment.user_liked ? "text-drift-orange" : "text-muted-dark hover:text-drift-orange"}`}
                            >
                              <svg width="12" height="12" viewBox="0 0 24 24" fill={comment.user_liked ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2"><path d="M20.42 4.58a5.4 5.4 0 00-7.65 0l-.77.78-.77-.78a5.4 5.4 0 00-7.65 7.65l.78.77L12 20.64l7.64-7.64.78-.77a5.4 5.4 0 000-7.65z" /></svg>
                              {comment.like_count}
                            </button>
                            <button
                              onClick={() => { if (!user) { toast("Sign in to reply", "error"); return; } setReplyingTo(replyingTo === comment.id ? null : comment.id); setReplyText(""); }}
                              className="text-xs text-muted-dark hover:text-drift-orange transition-colors"
                            >
                              Reply
                            </button>
                          </div>

                          {/* Reply input */}
                          {replyingTo === comment.id && (
                            <div className="mt-3 flex gap-2">
                              <textarea
                                value={replyText}
                                onChange={(e) => setReplyText(e.target.value)}
                                placeholder="Write a reply..."
                                rows={2}
                                className="flex-1 px-3 py-2 bg-surface-lighter border border-border rounded-lg text-sm text-foreground placeholder:text-muted-dark focus:outline-none focus:border-drift-orange transition-colors resize-none"
                              />
                              <button
                                onClick={() => handleReply(comment.id)}
                                className="self-end px-4 py-2 bg-drift-orange text-white text-xs font-semibold rounded-lg"
                              >
                                Reply
                              </button>
                            </div>
                          )}

                          {/* Nested replies */}
                          {comment.replies.length > 0 && (
                            <div className="mt-3 ml-2 pl-4 border-l border-border space-y-3">
                              {comment.replies.map((reply) => (
                                <div key={reply.id} className="flex gap-3">
                                  {reply.author?.avatar_url ? (
                                    <img src={reply.author.avatar_url} alt="" className="w-7 h-7 rounded-full object-cover flex-shrink-0" />
                                  ) : (
                                    <div className="w-7 h-7 rounded-full bg-surface-lighter flex items-center justify-center text-[10px] text-muted font-semibold flex-shrink-0">
                                      {reply.author?.username?.[0]?.toUpperCase() || "?"}
                                    </div>
                                  )}
                                  <div>
                                    <div className="flex items-center gap-2 mb-0.5">
                                      <span className="text-sm font-semibold text-foreground">{reply.author?.username || "Unknown"}</span>
                                      <span className="text-xs text-muted-dark">{timeAgo(reply.created_at)}</span>
                                    </div>
                                    <p className="text-sm text-muted">{reply.body}</p>
                                    <button
                                      onClick={() => handleLikeComment(reply.id)}
                                      className={`flex items-center gap-1 text-xs mt-1 transition-colors ${reply.user_liked ? "text-drift-orange" : "text-muted-dark hover:text-drift-orange"}`}
                                    >
                                      <svg width="10" height="10" viewBox="0 0 24 24" fill={reply.user_liked ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2"><path d="M20.42 4.58a5.4 5.4 0 00-7.65 0l-.77.78-.77-.78a5.4 5.4 0 00-7.65 7.65l.78.77L12 20.64l7.64-7.64.78-.77a5.4 5.4 0 000-7.65z" /></svg>
                                      {reply.like_count}
                                    </button>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
