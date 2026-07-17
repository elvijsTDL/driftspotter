"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import { useMyEvents, useEventApplicants, type MyEvent } from "@/hooks/useMyEvents";
import { useEventUpdates } from "@/hooks/useEventUpdates";
import { useToast } from "@/components/ui/Toast";
import EditEventModal from "@/components/EditEventModal";
import { EventDocumentsManager } from "@/components/EventDocuments";
import { ApplicantPanel, statusBadge } from "@/components/ApplicantPanel";

const UPDATE_MAX = 1000;

function daysOut(date: string, endDate: string | null) {
  const today = new Date(); today.setHours(0, 0, 0, 0);
  const start = new Date(date); start.setHours(0, 0, 0, 0);
  const end = endDate ? new Date(endDate) : start; end.setHours(0, 0, 0, 0);
  if (end < today) return { label: "Past event", tone: "text-muted-dark" };
  if (start <= today) return { label: "Happening now", tone: "text-badge-grassroots" };
  const days = Math.round((start.getTime() - today.getTime()) / 86_400_000);
  return { label: days === 1 ? "Tomorrow" : `In ${days} days`, tone: days <= 7 ? "text-drift-orange" : "text-muted" };
}

function QuickAction({ onClick, href, children }: { onClick?: () => void; href?: string; children: React.ReactNode }) {
  const cls = "flex min-h-11 items-center gap-2 rounded-xl border border-border bg-surface-lighter px-4 py-2 text-sm font-semibold text-foreground transition-colors hover:border-drift-orange/40 hover:text-drift-orange whitespace-nowrap";
  if (href) return <Link href={href} className={cls}>{children}</Link>;
  return <button onClick={onClick} className={cls}>{children}</button>;
}

function UpdatesSection({ eventId, approvedCount }: { eventId: string; approvedCount: number }) {
  const { updates, loading, postUpdate } = useEventUpdates(eventId);
  const { toast } = useToast();
  const [draft, setDraft] = useState("");
  const [sending, setSending] = useState(false);

  const send = async () => {
    if (!draft.trim() || sending) return;
    setSending(true);
    const { error, notified } = await postUpdate(draft);
    setSending(false);
    if (error) { toast(error, "error"); return; }
    setDraft("");
    toast(notified ? `Update posted — ${notified} participant${notified === 1 ? "" : "s"} notified` : "Update posted");
  };

  return (
    <div className="space-y-3">
      <div className="glass rounded-xl p-4">
        <textarea
          id="update-composer"
          value={draft}
          onChange={(e) => setDraft(e.target.value.slice(0, UPDATE_MAX))}
          rows={3}
          placeholder="Schedule change? Gate info? Post it here — approved participants get notified instantly (in-app, email and push), and the update stays pinned on your event page."
          className="w-full bg-surface-lighter border border-border rounded-lg px-3 py-2.5 text-sm text-foreground placeholder:text-muted-dark focus:outline-none focus:border-drift-orange/50 resize-none"
        />
        <div className="mt-2 flex items-center justify-between gap-3">
          <span className="text-[11px] text-muted-dark">{draft.length}/{UPDATE_MAX}</span>
          <button
            onClick={send}
            disabled={!draft.trim() || sending}
            className="min-h-11 px-5 py-2 rounded-xl bg-drift-orange text-white text-sm font-heading font-semibold hover:bg-drift-orange-light transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {sending ? "Sending..." : `Send Update #${updates.length + 1}${approvedCount > 0 ? ` to ${approvedCount}` : ""}`}
          </button>
        </div>
      </div>

      {loading ? (
        <div className="h-16 glass rounded-xl animate-pulse" />
      ) : updates.length === 0 ? (
        <p className="text-xs text-muted-dark px-1">No updates posted yet. Updates are numbered like bulletins — participants can always refer back to them.</p>
      ) : (
        updates.map((u) => (
          <div key={u.id} className="glass rounded-xl p-4">
            <div className="flex items-center gap-2 mb-1.5">
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-drift-orange/10 text-drift-orange border border-drift-orange/20">
                UPDATE #{u.number}
              </span>
              <span className="text-[11px] text-muted-dark">
                {new Date(u.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric" })}{" · "}
                {new Date(u.created_at).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" })}
              </span>
            </div>
            <p className="text-sm text-muted whitespace-pre-wrap leading-relaxed">{u.body}</p>
          </div>
        ))
      )}
    </div>
  );
}

export default function EventCommandCenter({ eventId }: { eventId: string }) {
  const { events, loading, updateEvent } = useMyEvents();
  const { applicants, loading: applicantsLoading, updateStatus } = useEventApplicants(eventId);
  const [editing, setEditing] = useState(false);
  const composerRef = useRef<HTMLDivElement>(null);
  const docsRef = useRef<HTMLDivElement>(null);
  const applicantsRef = useRef<HTMLDivElement>(null);

  const event: MyEvent | undefined = events.find((e) => e.id === eventId);

  if (loading) {
    return (
      <section className="relative pt-28 pb-20 md:pt-32 md:pb-28">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 space-y-4">
          <div className="h-8 w-64 bg-surface-lighter rounded animate-pulse" />
          <div className="h-40 glass rounded-2xl animate-pulse" />
          <div className="h-64 glass rounded-2xl animate-pulse" />
        </div>
      </section>
    );
  }

  if (!event) {
    return (
      <section className="relative pt-28 pb-20 md:pt-32 md:pb-28">
        <div className="max-w-2xl mx-auto px-4 text-center">
          <div className="glass rounded-2xl p-6 sm:p-12">
            <h2 className="font-heading font-bold text-2xl text-foreground mb-3">Event not found</h2>
            <p className="text-muted mb-4">This event doesn&apos;t exist or you don&apos;t organize it.</p>
            <Link href="/my-events" className="text-drift-cyan hover:underline text-sm">← Back to My Events</Link>
          </div>
        </div>
      </section>
    );
  }

  const badge = statusBadge(event.status);
  const countdown = daysOut(event.date, event.end_date);
  const pendingCount = applicants.filter((a) => a.status === "pending").length;
  const approvedDrivers = applicants.filter((a) => a.status === "approved" && a.role !== "media").length;
  const approvedMedia = applicants.filter((a) => a.status === "approved" && a.role === "media").length;
  const approvedTotal = approvedDrivers + approvedMedia;

  const focusComposer = () => {
    composerRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
    setTimeout(() => document.getElementById("update-composer")?.focus(), 350);
  };

  return (
    <section className="relative pt-24 pb-20 md:pt-28 md:pb-28">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <Link href="/my-events" className="inline-flex min-h-11 items-center gap-2 text-sm text-muted hover:text-foreground">← My Events</Link>
        <div className="mt-2 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2.5">
              <h1 className="font-heading font-bold text-2xl md:text-3xl text-foreground tracking-tight">{event.name}</h1>
              <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${badge.bg} ${badge.text} border ${badge.border}`}>{badge.label}</span>
            </div>
            <p className="mt-1.5 text-sm text-muted">
              {new Date(event.date).toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric", year: "numeric" })}
              {event.end_date && event.end_date !== event.date && ` – ${new Date(event.end_date).toLocaleDateString("en-US", { month: "short", day: "numeric" })}`}
              {" · "}{event.location}
              {" · "}<span className={`font-semibold ${countdown.tone}`}>{countdown.label}</span>
            </p>
          </div>
          {event.status === "approved" && (
            <Link
              href={`/events/${event.id}`}
              className="flex min-h-11 items-center gap-1.5 self-start rounded-xl border border-border bg-surface-lighter px-4 py-2 text-sm font-semibold text-muted transition-colors hover:border-drift-cyan/40 hover:text-drift-cyan flex-shrink-0"
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6" /><polyline points="15 3 21 3 21 9" /><line x1="10" y1="14" x2="21" y2="3" /></svg>
              View Live
            </Link>
          )}
        </div>

        {event.status === "approved" ? (
          <>
            {/* Vitals */}
            <div className="mt-5 grid grid-cols-3 gap-3">
              <div className="glass rounded-xl p-3.5 text-center">
                <p className="font-heading font-bold text-2xl text-drift-orange">{pendingCount}</p>
                <p className="text-[10px] text-muted uppercase tracking-wider mt-0.5">Pending</p>
              </div>
              <div className="glass rounded-xl p-3.5 text-center">
                <p className="font-heading font-bold text-2xl text-badge-grassroots">
                  {approvedDrivers}{event.max_participants ? <span className="text-sm text-muted font-semibold">/{event.max_participants}</span> : null}
                </p>
                <p className="text-[10px] text-muted uppercase tracking-wider mt-0.5">Drivers In</p>
              </div>
              <div className="glass rounded-xl p-3.5 text-center">
                <p className="font-heading font-bold text-2xl text-drift-cyan">{approvedMedia}</p>
                <p className="text-[10px] text-muted uppercase tracking-wider mt-0.5">Media</p>
              </div>
            </div>

            {/* Quick actions */}
            <div className="mt-4 flex gap-2 overflow-x-auto no-scrollbar pb-1">
              <QuickAction onClick={focusComposer}>
                <span aria-hidden="true">📣</span> Post Update
              </QuickAction>
              {pendingCount > 0 && (
                <QuickAction href={`/my-events/${event.id}/review`}>
                  <span aria-hidden="true">⚡</span> Review {pendingCount} Pending
                </QuickAction>
              )}
              <QuickAction onClick={() => docsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" })}>
                <span aria-hidden="true">📄</span> Docs &amp; Media
              </QuickAction>
              <QuickAction onClick={() => applicantsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" })}>
                <span aria-hidden="true">👥</span> Applicants
              </QuickAction>
              <QuickAction onClick={() => setEditing(true)}>
                <span aria-hidden="true">✏️</span> Edit Event
              </QuickAction>
            </div>

            {/* Updates */}
            <div ref={composerRef} className="mt-8">
              <h2 className="font-heading font-semibold text-sm text-foreground uppercase tracking-wider mb-3">Updates</h2>
              <UpdatesSection eventId={event.id} approvedCount={approvedTotal} />
            </div>

            {/* Applicants */}
            <div ref={applicantsRef} className="mt-10">
              <h2 className="font-heading font-semibold text-sm text-foreground uppercase tracking-wider mb-1">Applicants</h2>
              <ApplicantPanel
                eventId={event.id}
                maxParticipants={event.max_participants}
                applicants={applicants}
                loading={applicantsLoading}
                updateStatus={updateStatus}
              />
            </div>

            {/* Documents & media */}
            <div ref={docsRef} className="mt-10">
              <h2 className="font-heading font-semibold text-sm text-foreground uppercase tracking-wider mb-3">Documents &amp; Media</h2>
              <EventDocumentsManager eventId={event.id} />
            </div>
          </>
        ) : (
          <div className="mt-6 space-y-4">
            <div className="p-5 rounded-xl bg-surface-lighter">
              <p className="text-sm text-muted">
                {event.status === "pending"
                  ? "This event is awaiting admin approval. You'll be able to post updates and manage applicants once it's approved."
                  : "This event was not approved."}
              </p>
            </div>
            <button
              onClick={() => setEditing(true)}
              className="flex min-h-11 items-center gap-2 rounded-xl border border-border bg-surface-lighter px-4 py-2 text-sm font-semibold text-foreground transition-colors hover:border-drift-orange/40 hover:text-drift-orange"
            >
              <span aria-hidden="true">✏️</span> Edit Event
            </button>
          </div>
        )}
      </div>

      {editing && (
        <EditEventModal
          event={event}
          onClose={() => setEditing(false)}
          onSave={updateEvent}
        />
      )}
    </section>
  );
}
