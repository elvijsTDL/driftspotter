"use client";

import { useState } from "react";
import Link from "next/link";
import {
  useSubmittedEvents, approveEvent, rejectEvent, type SubmittedEvent,
  useOrganizers, setOrganizerStatus, type AdminOrganizer, type OrganizerStatus,
} from "@/hooks/useAdmin";
import { useToast } from "@/components/ui/Toast";

const statusTabs = [
  { key: "all", label: "All" },
  { key: "pending", label: "Pending" },
  { key: "approved", label: "Approved" },
  { key: "rejected", label: "Rejected" },
];

const statusBadge = (status: string) => {
  if (status === "pending") return { bg: "bg-yellow-500/10", text: "text-yellow-500", border: "border-yellow-500/20", label: "Pending" };
  if (status === "approved") return { bg: "bg-badge-grassroots/10", text: "text-badge-grassroots", border: "border-badge-grassroots/20", label: "Approved" };
  return { bg: "bg-red-500/10", text: "text-red-400", border: "border-red-500/20", label: "Rejected" };
};

const categoryLabels: Record<string, string> = {
  official: "Official",
  grassroots: "Grassroots",
  proam: "Pro-Am",
  practice: "Practice",
};

export default function AdminDashboard() {
  const { toast } = useToast();
  const [view, setView] = useState<"events" | "organizers">("events");
  const [filter, setFilter] = useState("all");
  const { events, loading, refetch } = useSubmittedEvents(filter);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const handleApprove = async (eventId: string) => {
    setActionLoading(eventId);
    const result = await approveEvent(eventId);
    setActionLoading(null);
    if (result.success) {
      toast("Event approved and published!");
      refetch();
    } else {
      toast(result.error || "Failed to approve", "error");
    }
  };

  const handleReject = async (eventId: string) => {
    setActionLoading(eventId);
    const result = await rejectEvent(eventId);
    setActionLoading(null);
    if (result.success) {
      toast("Event rejected");
      refetch();
    } else {
      toast(result.error || "Failed to reject", "error");
    }
  };

  return (
    <section className="relative pt-28 pb-20 md:pt-32 md:pb-28">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <div className="mb-8">
          <h1 className="font-heading font-bold text-3xl md:text-4xl text-foreground tracking-tight">ADMIN DASHBOARD</h1>
          <div className="tire-track w-20 mt-3" />
          <p className="text-muted mt-3">Review and manage submitted events and organizers.</p>
        </div>

        {/* Section toggle */}
        <div className="flex gap-2 mb-6 border-b border-border pb-4">
          {([
            { key: "events" as const, label: "Event Submissions" },
            { key: "organizers" as const, label: "Organizers" },
          ]).map((s) => (
            <button
              key={s.key}
              onClick={() => setView(s.key)}
              className={`px-5 py-2.5 rounded-xl text-sm font-heading font-semibold transition-all ${
                view === s.key ? "bg-drift-orange text-white" : "glass border border-border text-muted hover:text-foreground"
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>

        {view === "organizers" ? (
          <OrganizersPanel />
        ) : (
          <>
        {/* Status filter tabs */}
        <div className="flex gap-2 mb-6">
          {statusTabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setFilter(tab.key)}
              className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                filter === tab.key
                  ? "bg-drift-orange text-white"
                  : "glass border border-border text-muted hover:text-foreground"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-28 glass rounded-2xl animate-pulse" />
            ))}
          </div>
        ) : events.length === 0 ? (
          <div className="glass rounded-2xl p-6 sm:p-12 text-center">
            <p className="text-muted">No events found{filter !== "all" ? ` with status "${filter}"` : ""}.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {events.map((event) => (
              <EventCard
                key={event.id}
                event={event}
                isExpanded={expandedId === event.id}
                onToggle={() => setExpandedId(expandedId === event.id ? null : event.id)}
                onApprove={handleApprove}
                onReject={handleReject}
                actionLoading={actionLoading === event.id}
              />
            ))}
          </div>
        )}
          </>
        )}
      </div>
    </section>
  );
}

const organizerStatusInfo: Record<OrganizerStatus, { label: string; className: string }> = {
  none: { label: "No Access", className: "bg-surface-lighter text-muted-dark border-border" },
  pending: { label: "Pending Request", className: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20" },
  standard: { label: "Approved", className: "bg-badge-grassroots/10 text-badge-grassroots border-badge-grassroots/20" },
  trusted: { label: "Trusted", className: "bg-drift-cyan/10 text-drift-cyan border-drift-cyan/20" },
  blocked: { label: "Blocked", className: "bg-red-500/10 text-red-400 border-red-500/20" },
};

function OrganizersPanel() {
  const { toast } = useToast();
  const { organizers, loading, refetch } = useOrganizers();
  const [updating, setUpdating] = useState<string | null>(null);

  const handleSetStatus = async (userId: string, status: OrganizerStatus) => {
    setUpdating(userId);
    const result = await setOrganizerStatus(userId, status);
    setUpdating(null);
    if (result.success) {
      toast(
        status === "trusted" ? "Organizer trusted — their events now publish instantly"
        : status === "blocked" ? "Organizer blocked from submitting events"
        : status === "standard" ? "Organizer approved — submissions go through normal review"
        : "Organizer access removed"
      );
      refetch();
    } else {
      toast(result.error || "Failed to update organizer", "error");
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-24 glass rounded-2xl animate-pulse" />
        ))}
      </div>
    );
  }

  const pending = organizers.filter((o) => o.organizer_status === "pending");
  const rest = organizers.filter((o) => o.organizer_status !== "pending");

  if (organizers.length === 0) {
    return (
      <div className="glass rounded-2xl p-6 sm:p-12 text-center">
        <p className="text-muted">No organizer requests yet.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-start gap-3 p-4 rounded-xl bg-drift-cyan/5 border border-drift-cyan/10">
        <svg className="text-drift-cyan flex-shrink-0 mt-0.5" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10" /><line x1="12" y1="16" x2="12" y2="12" /><line x1="12" y1="8" x2="12.01" y2="8" /></svg>
        <p className="text-xs text-muted leading-relaxed">
          Only approved organizers can submit events. <span className="text-badge-grassroots font-semibold">Approved</span> submissions are reviewed per event;{" "}
          <span className="text-drift-cyan font-semibold">Trusted</span> ones publish instantly;{" "}
          <span className="text-red-400 font-semibold">Blocked</span> users can&apos;t submit at all.
        </p>
      </div>

      {pending.length > 0 && (
        <>
          <h3 className="font-heading font-semibold text-sm text-yellow-500 uppercase tracking-wider pt-2">
            Pending Requests ({pending.length})
          </h3>
          {pending.map((org) => (
            <div key={org.user_id} className="glass rounded-2xl p-5 border border-yellow-500/20">
              <div className="flex items-start gap-3">
                {org.avatar_url ? (
                  <img src={org.avatar_url} alt={org.username} className="w-10 h-10 rounded-full object-cover flex-shrink-0" />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-drift-orange/20 flex items-center justify-center text-sm font-semibold text-drift-orange flex-shrink-0">
                    {org.username[0]?.toUpperCase() || "?"}
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-sm font-semibold text-foreground">{org.organizer_name || org.username}</span>
                    <span className="text-xs text-muted">by {org.username}</span>
                    {org.organizer_requested_at && (
                      <span className="text-[11px] text-muted-dark">
                        requested {new Date(org.organizer_requested_at).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                      </span>
                    )}
                  </div>
                  {org.organizer_website && (
                    <a
                      href={/^https?:\/\//i.test(org.organizer_website) ? org.organizer_website : `https://${org.organizer_website}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-drift-cyan hover:underline break-all"
                    >
                      {org.organizer_website}
                    </a>
                  )}
                  {org.organizer_about && (
                    <p className="text-xs text-muted mt-2 leading-relaxed whitespace-pre-line">{org.organizer_about}</p>
                  )}
                  <div className="flex items-center gap-2 mt-3">
                    <button
                      onClick={() => handleSetStatus(org.user_id, "standard")}
                      disabled={updating === org.user_id}
                      className="px-4 py-2 rounded-lg text-xs font-semibold bg-badge-grassroots/20 text-badge-grassroots hover:bg-badge-grassroots/30 transition-colors disabled:opacity-50"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => handleSetStatus(org.user_id, "trusted")}
                      disabled={updating === org.user_id}
                      className="px-4 py-2 rounded-lg text-xs font-semibold bg-drift-cyan/10 text-drift-cyan hover:bg-drift-cyan/20 border border-drift-cyan/20 transition-colors disabled:opacity-50"
                    >
                      Approve as Trusted
                    </button>
                    <button
                      onClick={() => handleSetStatus(org.user_id, "none")}
                      disabled={updating === org.user_id}
                      className="px-4 py-2 rounded-lg text-xs font-semibold bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors disabled:opacity-50"
                    >
                      Decline
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </>
      )}

      {rest.length > 0 && (
        <>
          {pending.length > 0 && (
            <h3 className="font-heading font-semibold text-sm text-foreground uppercase tracking-wider pt-4">
              All Organizers
            </h3>
          )}
          {rest.map((org) => (
            <OrganizerRow key={org.user_id} org={org} updating={updating === org.user_id} onSetStatus={handleSetStatus} />
          ))}
        </>
      )}
    </div>
  );
}

function OrganizerRow({
  org,
  updating,
  onSetStatus,
}: {
  org: AdminOrganizer;
  updating: boolean;
  onSetStatus: (userId: string, status: OrganizerStatus) => void;
}) {
  const info = organizerStatusInfo[org.organizer_status];
  return (
    <div className="glass rounded-2xl p-5">
      <div className="flex flex-col sm:flex-row sm:items-center gap-4">
        <div className="flex items-center gap-3 flex-1 min-w-0">
          {org.avatar_url ? (
            <img src={org.avatar_url} alt={org.username} className="w-10 h-10 rounded-full object-cover flex-shrink-0" />
          ) : (
            <div className="w-10 h-10 rounded-full bg-drift-orange/20 flex items-center justify-center text-sm font-semibold text-drift-orange flex-shrink-0">
              {org.username[0]?.toUpperCase() || "?"}
            </div>
          )}
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <Link href={`/organizers/${org.user_id}`} className="text-sm font-semibold text-foreground hover:text-drift-orange transition-colors truncate">
                {org.organizer_name || org.username}
              </Link>
              {org.organizer_name && <span className="text-xs text-muted">by {org.username}</span>}
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold border ${info.className}`}>
                {info.label}
              </span>
            </div>
            <p className="text-xs text-muted mt-0.5">
              {org.total_submitted} submitted · {org.approved_count} approved · {org.rejected_count} rejected
              {org.last_submission && ` · last ${new Date(org.last_submission).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}`}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 flex-shrink-0">
          {org.organizer_status !== "trusted" && (
            <button
              onClick={() => onSetStatus(org.user_id, "trusted")}
              disabled={updating}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-drift-cyan/10 text-drift-cyan hover:bg-drift-cyan/20 border border-drift-cyan/20 transition-colors disabled:opacity-50"
            >
              Trust
            </button>
          )}
          {org.organizer_status !== "standard" && (
            <button
              onClick={() => onSetStatus(org.user_id, "standard")}
              disabled={updating}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-surface-lighter text-muted hover:text-foreground border border-border transition-colors disabled:opacity-50"
            >
              Standard
            </button>
          )}
          {org.organizer_status !== "blocked" && (
            <button
              onClick={() => onSetStatus(org.user_id, "blocked")}
              disabled={updating}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-red-500/10 text-red-400 hover:bg-red-500/20 border border-red-500/20 transition-colors disabled:opacity-50"
            >
              Block
            </button>
          )}
          <button
            onClick={() => onSetStatus(org.user_id, "none")}
            disabled={updating}
            className="px-3 py-1.5 rounded-lg text-xs font-semibold text-muted-dark hover:text-red-400 border border-border transition-colors disabled:opacity-50"
            title="Remove organizer access entirely"
          >
            Revoke
          </button>
        </div>
      </div>
    </div>
  );
}

function EventCard({
  event,
  isExpanded,
  onToggle,
  onApprove,
  onReject,
  actionLoading,
}: {
  event: SubmittedEvent;
  isExpanded: boolean;
  onToggle: () => void;
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
  actionLoading: boolean;
}) {
  const badge = statusBadge(event.status);

  return (
    <div className="glass rounded-2xl overflow-hidden">
      <div className="p-5 cursor-pointer hover:bg-surface-lighter/30 transition-colors" onClick={onToggle}>
        <div className="flex items-center justify-between">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-heading font-semibold text-lg text-foreground truncate">{event.name}</h3>
              <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${badge.bg} ${badge.text} border ${badge.border} flex-shrink-0`}>
                {badge.label}
              </span>
            </div>
            <div className="flex items-center gap-4 text-sm text-muted">
              <span>{new Date(event.date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</span>
              <span>{event.location}</span>
              <span className="capitalize">{categoryLabels[event.category] || event.category}</span>
            </div>
            <div className="flex items-center gap-2 mt-2">
              {event.submitter?.avatar_url ? (
                <img src={event.submitter.avatar_url} alt="" className="w-5 h-5 rounded-full object-cover" />
              ) : (
                <div className="w-5 h-5 rounded-full bg-drift-orange/20 flex items-center justify-center text-[9px] font-semibold text-drift-orange">
                  {event.submitter?.username?.[0]?.toUpperCase() || "?"}
                </div>
              )}
              <span className="text-xs text-muted">by {event.submitter?.username || "Unknown"}</span>
            </div>
          </div>
          <div className="flex items-center gap-3 flex-shrink-0 ml-4">
            {event.status === "pending" && !isExpanded && (
              <div className="hidden sm:flex items-center gap-1.5">
                <button
                  onClick={(e) => { e.stopPropagation(); onApprove(event.id); }}
                  disabled={actionLoading}
                  className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-badge-grassroots/20 text-badge-grassroots hover:bg-badge-grassroots/30 transition-colors disabled:opacity-50"
                >
                  Approve
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); onReject(event.id); }}
                  disabled={actionLoading}
                  className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors disabled:opacity-50"
                >
                  Reject
                </button>
              </div>
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

      {isExpanded && (
        <div className="px-5 pb-5 border-t border-border">
          <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-3">
              <DetailRow label="Track" value={event.track || "N/A"} />
              <DetailRow label="Country" value={event.country || "N/A"} />
              <DetailRow label="Category" value={categoryLabels[event.category] || event.category} />
              <DetailRow label="Participation" value={event.participation} />
              <DetailRow label="Skill Level" value={event.skill_level} />
              <DetailRow label="Tire Size" value={event.tire_size} />
            </div>
            <div className="space-y-3">
              <DetailRow label="Organizer" value={event.organizer} />
              <DetailRow label="Contact" value={event.contact_email} />
              <DetailRow label="Cage Required" value={event.cage_required ? "Yes" : "No"} />
              <DetailRow label="Series" value={event.series || "N/A"} />
              <DetailRow label="Price" value={event.price || "N/A"} />
              <DetailRow label="Max Participants" value={event.max_participants?.toString() || "Unlimited"} />
              {event.event_url && <DetailRow label="URL" value={event.event_url} isLink />}
            </div>
          </div>
          {event.description && (
            <div className="mt-4">
              <span className="text-xs text-muted uppercase tracking-wider font-medium">Description</span>
              <p className="text-sm text-foreground mt-1 leading-relaxed">{event.description}</p>
            </div>
          )}
          {event.safety_requirements && (
            <div className="mt-4">
              <span className="text-xs text-yellow-500 uppercase tracking-wider font-medium">Safety Requirements</span>
              <p className="text-sm text-foreground mt-1 leading-relaxed whitespace-pre-line">{event.safety_requirements}</p>
            </div>
          )}
          {(event.media_urls?.length ?? 0) > 0 && (
            <div className="mt-4">
              <span className="text-xs text-muted uppercase tracking-wider font-medium">Photos ({event.media_urls.length})</span>
              <div className="mt-2 grid grid-cols-3 sm:grid-cols-4 gap-2">
                {event.media_urls.map((url) => (
                  <a key={url} href={url} target="_blank" rel="noopener noreferrer" className="aspect-video rounded-lg overflow-hidden border border-border hover:border-drift-orange/50 transition-colors">
                    <img src={url} alt="Event" className="w-full h-full object-cover" loading="lazy" />
                  </a>
                ))}
              </div>
            </div>
          )}
          {event.status === "pending" && (
            <div className="mt-4 flex items-center gap-2">
              <button
                onClick={() => onApprove(event.id)}
                disabled={actionLoading}
                className="px-5 py-2.5 rounded-xl text-sm font-semibold bg-badge-grassroots text-white hover:bg-badge-grassroots/80 transition-colors disabled:opacity-50"
              >
                {actionLoading ? "Processing..." : "Approve Event"}
              </button>
              <button
                onClick={() => onReject(event.id)}
                disabled={actionLoading}
                className="px-5 py-2.5 rounded-xl text-sm font-semibold bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-colors disabled:opacity-50"
              >
                Reject Event
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function DetailRow({ label, value, isLink }: { label: string; value: string; isLink?: boolean }) {
  return (
    <div>
      <span className="text-xs text-muted uppercase tracking-wider font-medium">{label}</span>
      {isLink ? (
        <a href={value} target="_blank" rel="noopener noreferrer" className="block text-sm text-drift-orange hover:underline truncate">{value}</a>
      ) : (
        <p className="text-sm text-foreground capitalize">{value}</p>
      )}
    </div>
  );
}
