"use client";

import { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { useMyApplications, type MyApplication } from "@/hooks/useMyApplications";
import { useToast } from "@/components/ui/Toast";

const statusBadge = (status: string) => {
  if (status === "pending") return { bg: "bg-yellow-500/10", text: "text-yellow-500", border: "border-yellow-500/20", label: "Pending" };
  if (status === "approved") return { bg: "bg-badge-grassroots/10", text: "text-badge-grassroots", border: "border-badge-grassroots/20", label: "You're In" };
  return { bg: "bg-red-500/10", text: "text-red-400", border: "border-red-500/20", label: "Declined" };
};

const categoryColors: Record<string, string> = {
  official: "#FFD700",
  grassroots: "#22C55E",
  proam: "#3B82F6",
  practice: "#6B7280",
};

function ApplicationCard({
  application,
  past,
  onWithdraw,
}: {
  application: MyApplication;
  past?: boolean;
  onWithdraw: (rsvpId: string) => void;
}) {
  const badge = statusBadge(application.status);
  const event = application.event;

  if (!event) {
    return (
      <div className="glass rounded-2xl p-5 opacity-60">
        <p className="text-sm text-muted">This event is no longer available.</p>
      </div>
    );
  }

  const color = categoryColors[event.category] ?? "#6B7280";

  return (
    <div className={`glass rounded-2xl p-4 ${past ? "opacity-70 hover:opacity-100 transition-opacity" : ""}`}>
      <div className="flex flex-col sm:flex-row sm:items-center gap-4">
        <Link href={`/events/${application.event_id}`} className="flex items-center gap-4 flex-1 min-w-0 group">
          <div className="w-24 h-16 rounded-lg overflow-hidden bg-surface-lighter flex-shrink-0">
            {event.image_url ? (
              <img src={event.image_url} alt={event.name} className="w-full h-full object-cover" loading="lazy" />
            ) : (
              <div className="w-full h-full carbon-bg flex items-center justify-center">
                <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: color }} />
              </div>
            )}
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${badge.bg} ${badge.text} border ${badge.border}`}>
                {badge.label}
              </span>
              {event.price && <span className="text-[10px] text-drift-orange font-semibold">{event.price}</span>}
            </div>
            <p className="text-sm font-semibold text-foreground truncate group-hover:text-drift-orange transition-colors mt-1">
              {event.name}
            </p>
            <p className="text-xs text-muted mt-0.5 truncate">
              {new Date(event.date).toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric", year: "numeric" })}
              {" · "}{event.track ? `${event.track}, ` : ""}{event.location}
            </p>
            <p className="text-[11px] text-muted-dark mt-0.5">
              by {event.organizer} · applied {new Date(application.applied_at).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
            </p>
          </div>
        </Link>

        {!past && application.status === "pending" && (
          <button
            onClick={() => onWithdraw(application.rsvp_id)}
            className="self-start sm:self-center px-3 py-1.5 rounded-lg text-xs font-semibold text-muted hover:text-red-400 border border-border hover:border-red-500/40 transition-colors flex-shrink-0"
          >
            Withdraw
          </button>
        )}
      </div>
      {application.message && (
        <p className="text-xs text-muted-dark italic mt-3 pl-1">Your note: &ldquo;{application.message}&rdquo;</p>
      )}
    </div>
  );
}

export default function MyApplicationsPage() {
  const { user, loading: authLoading } = useAuth();
  const { applications, loading, withdraw } = useMyApplications();
  const { toast } = useToast();
  const [confirmingWithdraw, setConfirmingWithdraw] = useState<string | null>(null);

  const today = new Date().toISOString().split("T")[0];
  const upcoming = applications.filter((a) => a.event && (a.event.end_date ?? a.event.date) >= today);
  const past = applications.filter((a) => !a.event || (a.event.end_date ?? a.event.date) < today);

  const handleWithdraw = async (rsvpId: string) => {
    if (confirmingWithdraw !== rsvpId) {
      setConfirmingWithdraw(rsvpId);
      toast("Click Withdraw again to confirm", "error");
      return;
    }
    setConfirmingWithdraw(null);
    await withdraw(rsvpId);
    toast("Application withdrawn");
  };

  return (
    <section className="relative pt-28 pb-20 md:pt-32 md:pb-28">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        <div className="mb-8">
          <h1 className="font-heading font-bold text-3xl md:text-4xl text-foreground tracking-tight">MY APPLICATIONS</h1>
          <div className="tire-track w-20 mt-3" />
          <p className="text-muted mt-3">Every event you&apos;ve applied to, in one place.</p>
        </div>

        {authLoading || loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-24 glass rounded-2xl animate-pulse" />
            ))}
          </div>
        ) : !user ? (
          <div className="glass rounded-2xl p-12 text-center">
            <p className="text-muted">Please sign in to see your applications.</p>
          </div>
        ) : applications.length === 0 ? (
          <div className="glass rounded-2xl p-12 text-center">
            <svg className="mx-auto mb-4 text-muted-dark" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" />
            </svg>
            <p className="text-muted mb-4">You haven&apos;t applied to any events yet.</p>
            <Link href="/events" className="inline-flex px-5 py-2.5 bg-drift-orange text-white rounded-xl text-sm font-semibold hover:bg-drift-orange-light transition-colors">
              Browse Events
            </Link>
          </div>
        ) : (
          <div className="space-y-8">
            <div>
              <h2 className="font-heading font-semibold text-sm text-foreground uppercase tracking-wider mb-3">
                Upcoming <span className="text-muted font-normal normal-case">({upcoming.length})</span>
              </h2>
              {upcoming.length > 0 ? (
                <div className="space-y-3">
                  {upcoming.map((a) => (
                    <ApplicationCard key={a.rsvp_id} application={a} onWithdraw={handleWithdraw} />
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted">No upcoming applications — <Link href="/events" className="text-drift-orange hover:underline">find your next event</Link>.</p>
              )}
            </div>

            {past.length > 0 && (
              <div>
                <h2 className="font-heading font-semibold text-sm text-foreground uppercase tracking-wider mb-3">
                  Past <span className="text-muted font-normal normal-case">({past.length})</span>
                </h2>
                <div className="space-y-3">
                  {past.map((a) => (
                    <ApplicationCard key={a.rsvp_id} application={a} past onWithdraw={handleWithdraw} />
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
