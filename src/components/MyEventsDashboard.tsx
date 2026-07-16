"use client";

import { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { useMyEvents, useEventApplicants, type MyEvent, type EventApplicant } from "@/hooks/useMyEvents";
import EditEventModal from "@/components/EditEventModal";
import { EventDocumentsManager } from "@/components/EventDocuments";

const statusBadge = (status: string) => {
  if (status === "pending") return { bg: "bg-yellow-500/10", text: "text-yellow-500", border: "border-yellow-500/20", label: "Pending" };
  if (status === "approved") return { bg: "bg-badge-grassroots/10", text: "text-badge-grassroots", border: "border-badge-grassroots/20", label: "Approved" };
  return { bg: "bg-red-500/10", text: "text-red-400", border: "border-red-500/20", label: "Rejected" };
};

function ApplicantPanel({ eventId, maxParticipants }: { eventId: string; maxParticipants: number | null }) {
  const { applicants, loading, updateStatus } = useEventApplicants(eventId);
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
  const { user } = useAuth();
  const { events, loading, updateEvent } = useMyEvents();
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [editingEvent, setEditingEvent] = useState<MyEvent | null>(null);

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
          {user && events.length > 0 && (
            <Link href={`/organizers/${user.id}`} className="inline-flex items-center gap-1.5 mt-2 text-sm text-drift-cyan hover:underline">
              View your public organizer page
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="9 18 15 12 9 6" /></svg>
            </Link>
          )}
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
                      <div className="flex items-center gap-2 flex-shrink-0 ml-4">
                        <button
                          onClick={(e) => { e.stopPropagation(); setEditingEvent(event); }}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-surface-lighter text-muted hover:text-drift-orange border border-border hover:border-drift-orange/40 transition-colors"
                        >
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                            <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" />
                          </svg>
                          Edit
                        </button>
                        {event.status === "approved" && (
                          <Link
                            href={`/events/${event.id}`}
                            onClick={(e) => e.stopPropagation()}
                            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-surface-lighter text-muted hover:text-drift-cyan border border-border hover:border-drift-cyan/40 transition-colors"
                          >
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6" /><polyline points="15 3 21 3 21 9" /><line x1="10" y1="14" x2="21" y2="3" /></svg>
                            View Live
                          </Link>
                        )}
                        <svg
                          width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                          className={`text-muted transition-transform ${isExpanded ? "rotate-180" : ""}`}
                        >
                          <polyline points="6 9 12 15 18 9" />
                        </svg>
                      </div>
                    </div>
                  </div>

                  {isExpanded && event.status === "approved" && (
                    <div className="px-5 pb-5 border-t border-border">
                      <h4 className="font-heading font-semibold text-sm text-foreground uppercase tracking-wider mt-4 mb-2">Documents</h4>
                      <EventDocumentsManager eventId={event.id} />
                      <h4 className="font-heading font-semibold text-sm text-foreground uppercase tracking-wider mt-6 mb-2">Applicants</h4>
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

      {editingEvent && (
        <EditEventModal
          event={editingEvent}
          onClose={() => setEditingEvent(null)}
          onSave={updateEvent}
        />
      )}
    </section>
  );
}
