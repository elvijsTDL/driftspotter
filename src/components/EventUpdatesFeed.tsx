"use client";

import { useEventUpdates } from "@/hooks/useEventUpdates";

/**
 * Read-only pinned organizer updates on the public event page. Numbered
 * like motorsport bulletins; visible to everyone (pending applicants and
 * spectators included). Renders nothing when there are no updates.
 */
export default function EventUpdatesFeed({ eventId }: { eventId: string }) {
  const { updates, loading } = useEventUpdates(eventId);

  if (loading || updates.length === 0) return null;

  return (
    <div className="mb-6 rounded-xl border border-drift-orange/25 bg-drift-orange/5 p-4">
      <div className="flex items-center gap-2 mb-3">
        <span aria-hidden="true">📣</span>
        <h3 className="font-heading font-semibold text-sm text-drift-orange uppercase tracking-wider">Organizer Updates</h3>
      </div>
      <div className="space-y-3">
        {updates.map((u) => (
          <div key={u.id} className="flex gap-3">
            <span className="flex-shrink-0 font-heading font-bold text-xs text-drift-orange/70 pt-0.5">#{u.number}</span>
            <div className="min-w-0">
              <p className="text-sm text-foreground/90 whitespace-pre-wrap leading-relaxed">{u.body}</p>
              <p className="text-[11px] text-muted-dark mt-1">
                {new Date(u.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric" })}{" · "}
                {new Date(u.created_at).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" })}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
