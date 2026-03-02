"use client";

import { useState } from "react";
import { useMyEvents, useEventApplicants, type MyEvent, type EventApplicant } from "@/hooks/useMyEvents";

const statusBadge = (status: string) => {
  if (status === "pending") return { bg: "bg-yellow-500/10", text: "text-yellow-500", border: "border-yellow-500/20", label: "Pending" };
  if (status === "approved") return { bg: "bg-badge-grassroots/10", text: "text-badge-grassroots", border: "border-badge-grassroots/20", label: "Approved" };
  return { bg: "bg-red-500/10", text: "text-red-400", border: "border-red-500/20", label: "Rejected" };
};

function ApplicantPanel({ eventId, maxParticipants }: { eventId: string; maxParticipants: number | null }) {
  const { applicants, loading, updateStatus } = useEventApplicants(eventId);
  const approvedCount = applicants.filter((a) => a.status === "approved").length;

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
      {/* Capacity bar */}
      {maxParticipants && (
        <div className="p-3 glass rounded-xl">
          <div className="flex items-center justify-between text-xs text-muted mb-2">
            <span>Capacity</span>
            <span className="font-semibold text-foreground">{approvedCount} / {maxParticipants}</span>
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
      <div className="flex items-start gap-3">
        {applicant.avatar_url ? (
          <img src={applicant.avatar_url} alt={applicant.username} className="w-10 h-10 rounded-full object-cover flex-shrink-0" />
        ) : (
          <div className="w-10 h-10 rounded-full bg-drift-orange/20 flex items-center justify-center text-sm font-semibold text-drift-orange flex-shrink-0">
            {applicant.username[0]?.toUpperCase() || "?"}
          </div>
        )}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-sm font-semibold text-foreground">{applicant.username}</span>
            <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${badge.bg} ${badge.text} border ${badge.border}`}>
              {badge.label}
            </span>
          </div>
          <div className="flex flex-wrap gap-x-3 gap-y-1 text-xs text-muted mb-1">
            {applicant.car && (
              <span>{applicant.car_year ? `${applicant.car_year} ` : ""}{applicant.car}</span>
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
        </div>
        {applicant.status === "pending" && (
          <div className="flex items-center gap-1.5 flex-shrink-0">
            <button
              onClick={() => onUpdate(applicant.rsvp_id, "approved")}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-badge-grassroots/20 text-badge-grassroots hover:bg-badge-grassroots/30 transition-colors"
            >
              Approve
            </button>
            <button
              onClick={() => onUpdate(applicant.rsvp_id, "rejected")}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors"
            >
              Reject
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default function MyEventsDashboard() {
  const { events, loading } = useMyEvents();
  const [expandedId, setExpandedId] = useState<string | null>(null);

  if (loading) {
    return (
      <section className="relative pt-28 pb-20 md:pt-32 md:pb-28">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <h1 className="font-heading font-bold text-3xl md:text-4xl text-foreground tracking-tight mb-8">MY EVENTS</h1>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-32 glass rounded-2xl animate-pulse" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="relative pt-28 pb-20 md:pt-32 md:pb-28">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <div className="mb-8">
          <h1 className="font-heading font-bold text-3xl md:text-4xl text-foreground tracking-tight">MY EVENTS</h1>
          <div className="tire-track w-20 mt-3" />
          <p className="text-muted mt-3">Manage your submitted events and applicants.</p>
        </div>

        {events.length === 0 ? (
          <div className="glass rounded-2xl p-12 text-center">
            <svg className="mx-auto mb-4 text-muted-dark" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" />
            </svg>
            <p className="text-muted mb-4">You haven&apos;t submitted any events yet.</p>
            <a href="/submit" className="inline-flex px-5 py-2.5 bg-drift-orange text-white rounded-xl text-sm font-semibold hover:bg-drift-orange-light transition-colors">
              Submit Your First Event
            </a>
          </div>
        ) : (
          <div className="space-y-4">
            {events.map((event) => {
              const badge = statusBadge(event.status);
              const isExpanded = expandedId === event.id;

              return (
                <div key={event.id} className="glass rounded-2xl overflow-hidden">
                  <div
                    className="p-5 cursor-pointer hover:bg-surface-lighter/30 transition-colors"
                    onClick={() => setExpandedId(isExpanded ? null : event.id)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-heading font-semibold text-lg text-foreground truncate">{event.name}</h3>
                          <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${badge.bg} ${badge.text} border ${badge.border} flex-shrink-0`}>
                            {badge.label}
                          </span>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-muted">
                          <span className="flex items-center gap-1.5">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                              <rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" />
                            </svg>
                            {new Date(event.date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                          </span>
                          <span className="flex items-center gap-1.5">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" />
                            </svg>
                            {event.location}
                          </span>
                        </div>
                      </div>
                      <svg
                        width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                        className={`text-muted transition-transform flex-shrink-0 ml-4 ${isExpanded ? "rotate-180" : ""}`}
                      >
                        <polyline points="6 9 12 15 18 9" />
                      </svg>
                    </div>
                  </div>

                  {isExpanded && event.status === "approved" && (
                    <div className="px-5 pb-5 border-t border-border">
                      <h4 className="font-heading font-semibold text-sm text-foreground uppercase tracking-wider mt-4 mb-2">Applicants</h4>
                      <ApplicantPanel eventId={event.id} maxParticipants={event.max_participants} />
                    </div>
                  )}

                  {isExpanded && event.status !== "approved" && (
                    <div className="px-5 pb-5 border-t border-border">
                      <div className="mt-4 p-4 rounded-xl bg-surface-lighter">
                        <p className="text-sm text-muted">
                          {event.status === "pending" ? "This event is awaiting admin approval. You'll be able to manage applicants once it's approved." : "This event was not approved."}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
