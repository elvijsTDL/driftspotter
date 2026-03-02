"use client";

import { useState } from "react";
import { useSubmittedEvents, approveEvent, rejectEvent, type SubmittedEvent } from "@/hooks/useAdmin";
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
          <p className="text-muted mt-3">Review and manage submitted events.</p>
        </div>

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
          <div className="glass rounded-2xl p-12 text-center">
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
      </div>
    </section>
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
