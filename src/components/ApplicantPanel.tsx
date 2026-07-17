"use client";

import Link from "next/link";
import { type EventApplicant } from "@/hooks/useMyEvents";

export const statusBadge = (status: string) => {
  if (status === "pending") return { bg: "bg-yellow-500/10", text: "text-yellow-500", border: "border-yellow-500/20", label: "Pending" };
  if (status === "approved") return { bg: "bg-badge-grassroots/10", text: "text-badge-grassroots", border: "border-badge-grassroots/20", label: "Approved" };
  return { bg: "bg-red-500/10", text: "text-red-400", border: "border-red-500/20", label: "Rejected" };
};

export function ApplicantPanel({
  eventId,
  maxParticipants,
  applicants,
  loading,
  updateStatus,
}: {
  eventId: string;
  maxParticipants: number | null;
  applicants: EventApplicant[];
  loading: boolean;
  updateStatus: (id: string, status: "approved" | "rejected") => void;
}) {
  // Only drivers count against grid capacity; media passes are separate
  const approvedCount = applicants.filter((a) => a.status === "approved" && a.role !== "media").length;
  const approvedMediaCount = applicants.filter((a) => a.status === "approved" && a.role === "media").length;

  if (loading) {
    return (
      <div className="mt-4 p-4 glass rounded-xl">
        <div className="animate-pulse space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-16 bg-surface-lighter rounded-lg" />
          ))}
        </div>
      </div>
    );
  }

  if (applicants.length === 0) {
    return (
      <div className="mt-4 p-6 glass rounded-xl text-center">
        <p className="text-sm text-muted">No applications yet.</p>
      </div>
    );
  }

  return (
    <div className="mt-4 space-y-3">
      <Link href={`/my-events/${eventId}/review`} className="group flex min-h-14 items-center justify-between rounded-2xl border border-drift-orange/30 bg-drift-orange/10 px-4 py-3 transition-colors hover:bg-drift-orange/15">
        <div>
          <p className="font-heading text-sm font-bold text-foreground">Quick review</p>
          <p className="mt-0.5 text-xs text-muted">Swipe through pending applicants or save them for later.</p>
        </div>
        <span className="ml-3 text-xl text-drift-orange transition-transform group-hover:translate-x-1" aria-hidden="true">→</span>
      </Link>
      {/* Capacity bar (drivers only — media doesn't take grid spots) */}
      {maxParticipants && (
        <div className="p-3 glass rounded-xl">
          <div className="flex items-center justify-between text-xs text-muted mb-2">
            <span>Driver capacity</span>
            <span className="font-semibold text-foreground">
              {approvedCount} / {maxParticipants}
              {approvedMediaCount > 0 && (
                <span className="text-drift-cyan font-semibold ml-2">+ {approvedMediaCount} media</span>
              )}
            </span>
          </div>
          <div className="h-2 bg-surface-lighter rounded-full overflow-hidden">
            <div
              className="h-full bg-drift-orange rounded-full transition-all"
              style={{ width: `${Math.min(100, (approvedCount / maxParticipants) * 100)}%` }}
            />
          </div>
        </div>
      )}

      {/* Applicant cards */}
      {applicants.map((applicant) => (
        <ApplicantCard key={applicant.rsvp_id} applicant={applicant} onUpdate={updateStatus} />
      ))}
    </div>
  );
}

function ApplicantCard({ applicant, onUpdate }: { applicant: EventApplicant; onUpdate: (id: string, status: "approved" | "rejected") => void }) {
  const badge = statusBadge(applicant.status);
  return (
    <div className="p-4 glass rounded-xl">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start">
        {applicant.avatar_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={applicant.avatar_url} alt={applicant.username} className="w-10 h-10 rounded-full object-cover flex-shrink-0" />
        ) : (
          <div className="w-10 h-10 rounded-full bg-drift-orange/20 flex items-center justify-center text-sm font-semibold text-drift-orange flex-shrink-0">
            {applicant.username[0]?.toUpperCase() || "?"}
          </div>
        )}
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2 mb-1">
            <Link
              href={`/drivers/${applicant.user_id}`}
              className="text-sm font-semibold text-foreground hover:text-drift-orange transition-colors"
            >
              {applicant.username}
            </Link>
            <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${badge.bg} ${badge.text} border ${badge.border}`}>
              {badge.label}
            </span>
            {applicant.role === "media" && (
              <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-drift-cyan/10 text-drift-cyan border border-drift-cyan/20 uppercase tracking-wider">
                Media
              </span>
            )}
            <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-drift-orange/10 text-drift-orange border border-drift-orange/20">
              {applicant.events_attended} {applicant.events_attended === 1 ? "event" : "events"} attended
            </span>
          </div>
          <div className="flex flex-wrap gap-x-3 gap-y-1 text-xs text-muted mb-1">
            {applicant.role !== "media" && applicant.car && (
              <span>
                {applicant.car_year ? `${applicant.car_year} ` : ""}{applicant.car}
                {applicant.horsepower != null && <span className="text-drift-cyan font-semibold"> · {applicant.horsepower} hp</span>}
              </span>
            )}
            {applicant.skill_level && (
              <span className="capitalize">{applicant.skill_level}</span>
            )}
            {applicant.instagram && (
              <span className="text-drift-cyan">{applicant.instagram}</span>
            )}
          </div>
          {applicant.message && (
            <p className="text-xs text-muted-dark italic mt-1">&ldquo;{applicant.message}&rdquo;</p>
          )}
          {applicant.emergency_name && applicant.emergency_phone ? (
            <div className="mt-2 flex items-start gap-1.5 rounded-lg bg-drift-orange/5 border border-drift-orange/20 px-2.5 py-1.5">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mt-0.5 flex-shrink-0 text-drift-orange">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0110 0v4" />
              </svg>
              <p className="text-xs text-muted leading-snug">
                <span className="text-drift-orange font-semibold uppercase tracking-wide text-[10px]">Emergency</span>{" "}
                <span className="text-foreground">{applicant.emergency_name}</span>
                {applicant.emergency_relationship && <span className="text-muted-dark"> ({applicant.emergency_relationship})</span>}
                {" · "}
                <a href={`tel:${applicant.emergency_phone}`} className="text-drift-cyan hover:underline">{applicant.emergency_phone}</a>
              </p>
            </div>
          ) : applicant.role !== "media" && (
            // Presence-only indicator (no PII) — full details unlock once approved
            <div className="mt-2 inline-flex items-center gap-1.5">
              {applicant.has_emergency_contact ? (
                <span className="inline-flex items-center gap-1 text-[11px] text-badge-grassroots">
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
                  Emergency contact on file
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 text-[11px] text-amber-400/80">
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" /><line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" /></svg>
                  No emergency contact
                </span>
              )}
            </div>
          )}
          <Link
            href={`/drivers/${applicant.user_id}`}
            className="inline-flex items-center gap-1 text-xs text-drift-cyan hover:underline mt-1"
          >
            View driver profile
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="9 18 15 12 9 6" /></svg>
          </Link>
        </div>
        {applicant.status === "pending" && (
          <div className="grid grid-cols-2 gap-2 sm:flex sm:items-center sm:gap-1.5 sm:flex-shrink-0">
            <button
              onClick={() => onUpdate(applicant.rsvp_id, "approved")}
              className="min-h-11 px-3 py-1.5 rounded-lg text-xs font-semibold bg-badge-grassroots/20 text-badge-grassroots hover:bg-badge-grassroots/30 transition-colors"
            >
              Approve
            </button>
            <button
              onClick={() => onUpdate(applicant.rsvp_id, "rejected")}
              className="min-h-11 px-3 py-1.5 rounded-lg text-xs font-semibold bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors"
            >
              Reject
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
