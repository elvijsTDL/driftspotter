"use client";

import { useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useEventApplicants, type EventApplicant } from "@/hooks/useMyEvents";
import { useToast } from "@/components/ui/Toast";

type Decision = "approved" | "rejected" | "shortlisted";

function ReviewCard({ applicant, offset, dragging, onPointerDown, onPointerMove, onPointerUp }: {
  applicant: EventApplicant;
  offset: number;
  dragging: boolean;
  onPointerDown: (event: React.PointerEvent) => void;
  onPointerMove: (event: React.PointerEvent) => void;
  onPointerUp: (event: React.PointerEvent) => void;
}) {
  const rotation = Math.max(-8, Math.min(8, offset / 22));
  return (
    <article
      className={`relative touch-pan-y select-none overflow-hidden rounded-[1.75rem] border border-border bg-surface shadow-2xl shadow-black/40 ${dragging ? "" : "transition-transform duration-200"}`}
      style={{ transform: `translateX(${offset}px) rotate(${rotation}deg)` }}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
    >
      {offset > 45 && <div className="absolute left-5 top-5 z-20 -rotate-6 rounded-xl border-2 border-badge-grassroots px-3 py-1 font-heading text-xl font-bold text-badge-grassroots">ACCEPT</div>}
      {offset < -45 && <div className="absolute right-5 top-5 z-20 rotate-6 rounded-xl border-2 border-red-400 px-3 py-1 font-heading text-xl font-bold text-red-400">PASS</div>}

      <div className="relative aspect-[4/3] bg-gradient-to-br from-drift-orange/25 via-surface-light to-surface">
        {applicant.avatar_url ? (
          <img src={applicant.avatar_url} alt="" className="h-full w-full object-cover" draggable={false} />
        ) : (
          <div className="flex h-full items-center justify-center text-8xl font-heading font-bold text-drift-orange/70">{applicant.username[0]?.toUpperCase() || "?"}</div>
        )}
        <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-surface to-transparent" />
        <div className="absolute inset-x-0 bottom-0 p-5">
          <div className="flex flex-wrap items-end gap-2">
            <h2 className="font-heading text-3xl font-bold text-foreground">{applicant.username}</h2>
            <span className="mb-1 rounded-full border border-border bg-black/50 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wider text-muted">{applicant.role}</span>
          </div>
          <p className="mt-1 text-sm text-muted">{applicant.events_attended} event{applicant.events_attended === 1 ? "" : "s"} attended{applicant.skill_level ? ` · ${applicant.skill_level}` : ""}</p>
        </div>
      </div>

      <div className="space-y-4 p-5">
        {applicant.role !== "media" && (
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-xl bg-surface-lighter p-3">
              <p className="text-[10px] font-semibold uppercase tracking-wider text-muted">Car</p>
              <p className="mt-1 text-sm font-semibold text-foreground">{applicant.car_year ? `${applicant.car_year} ` : ""}{applicant.car || "Not listed"}</p>
            </div>
            <div className="rounded-xl bg-surface-lighter p-3">
              <p className="text-[10px] font-semibold uppercase tracking-wider text-muted">Power</p>
              <p className="mt-1 text-sm font-semibold text-foreground">{applicant.horsepower ? `${applicant.horsepower} hp` : "Not listed"}</p>
            </div>
          </div>
        )}
        {applicant.message && <blockquote className="border-l-2 border-drift-orange pl-3 text-sm italic leading-relaxed text-muted">“{applicant.message}”</blockquote>}
        <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
          <span className={applicant.has_emergency_contact ? "text-badge-grassroots" : "text-amber-400"}>{applicant.has_emergency_contact ? "✓ Emergency contact on file" : "! No emergency contact"}</span>
          <Link href={`/drivers/${applicant.user_id}`} className="relative z-10 min-h-11 inline-flex items-center text-drift-cyan hover:underline">Open full profile ↗</Link>
        </div>
      </div>
    </article>
  );
}

export default function ApplicantReviewDeck({ eventId, eventName }: { eventId: string; eventName: string }) {
  const { applicants, loading, updateStatus, updateShortlist } = useEventApplicants(eventId);
  const { toast } = useToast();
  const [mode, setMode] = useState<"queue" | "shortlist">("queue");
  const [handled, setHandled] = useState<string[]>([]);
  const [busy, setBusy] = useState(false);
  const [offset, setOffset] = useState(0);
  const [dragging, setDragging] = useState(false);
  const dragStart = useRef(0);

  const pending = useMemo(() => applicants.filter((a) => a.status === "pending" && !handled.includes(a.rsvp_id)), [applicants, handled]);
  const cards = mode === "shortlist" ? pending.filter((a) => a.shortlisted) : pending.filter((a) => !a.shortlisted);
  const current = cards[0];
  const shortlistCount = applicants.filter((a) => a.status === "pending" && a.shortlisted).length;

  const decide = async (decision: Decision) => {
    if (!current || busy) return;
    setBusy(true);
    if (decision === "shortlisted") {
      const ok = await updateShortlist(current.rsvp_id, true);
      toast(ok ? `${current.username} saved to your shortlist` : "Could not update shortlist", ok ? "success" : "error");
    } else {
      await updateStatus(current.rsvp_id, decision);
      toast(decision === "approved" ? `${current.username} accepted` : `${current.username} passed`);
    }
    setHandled((items) => [...items, current.rsvp_id]);
    setOffset(0);
    setBusy(false);
  };

  const removeFromShortlist = async () => {
    if (!current || busy) return;
    setBusy(true);
    await updateShortlist(current.rsvp_id, false);
    setHandled((items) => [...items, current.rsvp_id]);
    setBusy(false);
  };

  if (loading) return <div className="mx-auto h-[34rem] max-w-md animate-pulse rounded-[1.75rem] bg-surface-lighter" />;

  return (
    <div className="mx-auto w-full max-w-md">
      <div className="mb-5 flex rounded-xl border border-border bg-surface p-1" role="tablist" aria-label="Application review queue">
        <button role="tab" aria-selected={mode === "queue"} onClick={() => { setMode("queue"); setHandled([]); }} className={`min-h-11 flex-1 rounded-lg px-3 text-sm font-semibold ${mode === "queue" ? "bg-foreground text-background" : "text-muted"}`}>New</button>
        <button role="tab" aria-selected={mode === "shortlist"} onClick={() => { setMode("shortlist"); setHandled([]); }} className={`min-h-11 flex-1 rounded-lg px-3 text-sm font-semibold ${mode === "shortlist" ? "bg-drift-orange text-background" : "text-muted"}`}>Shortlist ({shortlistCount})</button>
      </div>

      <div className="mb-3 flex items-center justify-between px-1 text-xs text-muted">
        <span>{eventName}</span><span>{cards.length} left</span>
      </div>

      {current ? (
        <>
          <ReviewCard
            applicant={current}
            offset={offset}
            dragging={dragging}
            onPointerDown={(event) => { dragStart.current = event.clientX; setDragging(true); event.currentTarget.setPointerCapture(event.pointerId); }}
            onPointerMove={(event) => { if (dragging) setOffset(event.clientX - dragStart.current); }}
            onPointerUp={() => { setDragging(false); if (offset > 110) void decide("approved"); else if (offset < -110) void decide("rejected"); else setOffset(0); }}
          />
          <div className="mt-5 grid grid-cols-3 gap-3">
            <button disabled={busy} onClick={() => void decide("rejected")} className="min-h-14 rounded-2xl border border-red-500/40 bg-red-500/10 px-2 font-semibold text-red-400 disabled:opacity-50" aria-label="Pass on applicant">Pass</button>
            {mode === "shortlist" ? (
              <button disabled={busy} onClick={() => void removeFromShortlist()} className="min-h-14 rounded-2xl border border-drift-orange/40 bg-drift-orange/10 px-2 font-semibold text-drift-orange disabled:opacity-50">Remove</button>
            ) : (
              <button disabled={busy} onClick={() => void decide("shortlisted")} className="min-h-14 rounded-2xl border border-drift-orange/40 bg-drift-orange/10 px-2 font-semibold text-drift-orange disabled:opacity-50" aria-label="Shortlist applicant for later">♥ Later</button>
            )}
            <button disabled={busy} onClick={() => void decide("approved")} className="min-h-14 rounded-2xl border border-badge-grassroots/40 bg-badge-grassroots/10 px-2 font-semibold text-badge-grassroots disabled:opacity-50" aria-label="Accept applicant">Accept</button>
          </div>
          <p className="mt-3 text-center text-[11px] text-muted">Swipe right to accept · left to pass · use ♥ to review later</p>
        </>
      ) : (
        <div className="rounded-[1.75rem] border border-border bg-surface p-10 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-badge-grassroots/10 text-3xl text-badge-grassroots">✓</div>
          <h2 className="font-heading text-xl font-bold text-foreground">Queue cleared</h2>
          <p className="mt-2 text-sm text-muted">{mode === "queue" ? "You reviewed every new application." : "There is nobody in your shortlist right now."}</p>
        </div>
      )}
    </div>
  );
}
