"use client";

import Link from "next/link";
import { useOrganizerProfile, type OrganizerEvent } from "@/hooks/useProfile";

const categoryColors: Record<string, string> = {
  official: "#FFD700",
  grassroots: "#22C55E",
  proam: "#3B82F6",
  practice: "#6B7280",
};

const categoryLabels: Record<string, string> = {
  official: "Official",
  grassroots: "Grassroots",
  proam: "Pro-Am",
  practice: "Practice",
};

function getCountryName(code: string): string {
  try {
    const names = new Intl.DisplayNames(["en"], { type: "region" });
    return names.of(code.toUpperCase()) || code;
  } catch {
    return code;
  }
}

export function TrustedBadge() {
  return (
    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-drift-cyan/10 text-drift-cyan border border-drift-cyan/20">
      <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 1l3.09 1.9L18.5 2.5l1 3.41L22.5 8l-1.9 3.09.31 3.41-3.41 1-2.41 2.91L12 17.5l-3.09.91L6.5 15.5l-3.41-1 .31-3.41L1.5 8l3-2.09 1-3.41 3.41.4L12 1z" opacity="0.3" />
        <path d="M9 12l2 2 4-4" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.5" fill="none" />
      </svg>
      Trusted Organizer
    </span>
  );
}

function OrganizerEventCard({ event, past }: { event: OrganizerEvent; past?: boolean }) {
  const color = categoryColors[event.category] ?? "#6B7280";
  return (
    <Link
      href={`/events/${event.id}`}
      className={`flex items-center gap-4 p-3 rounded-xl glass-light hover:border-drift-orange/30 border border-transparent transition-all group ${past ? "opacity-70 hover:opacity-100" : ""}`}
    >
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
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded" style={{ backgroundColor: `${color}20`, color }}>
            {categoryLabels[event.category] ?? event.category}
          </span>
          {event.price && <span className="text-[10px] text-drift-orange font-semibold">{event.price}</span>}
        </div>
        <p className="text-sm font-semibold text-foreground truncate group-hover:text-drift-orange transition-colors mt-1">{event.name}</p>
        <p className="text-xs text-muted mt-0.5 truncate">
          {new Date(event.date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
          {" · "}{event.location}{event.country ? ` · ${getCountryName(event.country)}` : ""}
        </p>
      </div>
      <svg className="text-muted-dark flex-shrink-0" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="9 18 15 12 9 6" /></svg>
    </Link>
  );
}

export default function OrganizerProfileView({ userId }: { userId: string }) {
  const { profile, pastEvents, upcomingEvents, loading, notFound } = useOrganizerProfile(userId);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-40 glass rounded-2xl animate-pulse" />
        <div className="h-64 glass rounded-2xl animate-pulse" />
      </div>
    );
  }

  if (notFound || !profile) {
    return (
      <div className="glass rounded-2xl p-6 sm:p-12 text-center">
        <p className="text-muted">This organizer&apos;s profile is private or doesn&apos;t exist.</p>
      </div>
    );
  }

  const hostedCount = pastEvents.length + upcomingEvents.length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="glass rounded-2xl p-6 md:p-8">
        <div className="flex flex-col sm:flex-row sm:items-start gap-5">
          {profile.avatar_url ? (
            <img src={profile.avatar_url} alt={profile.username} className="w-24 h-24 rounded-full object-cover border-2 border-drift-orange/30 flex-shrink-0" />
          ) : (
            <div className="w-24 h-24 rounded-full bg-drift-orange/20 flex items-center justify-center text-3xl font-semibold text-drift-orange flex-shrink-0">
              {profile.username[0]?.toUpperCase() || "?"}
            </div>
          )}
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-3 mb-2">
              <h1 className="font-heading font-bold text-2xl md:text-3xl text-foreground tracking-tight">
                {profile.organizer_name || profile.username}
              </h1>
              {profile.organizer_status === "trusted" && <TrustedBadge />}
            </div>
            <p className="text-xs text-muted uppercase tracking-wider font-medium mb-2">
              Event Organizer{profile.organizer_name ? ` · run by ${profile.username}` : ""}
            </p>
            {(profile.organizer_about || profile.bio) && (
              <p className="text-sm text-muted leading-relaxed mb-3">{profile.organizer_about || profile.bio}</p>
            )}
            {profile.organizer_website && (
              <a
                href={/^https?:\/\//i.test(profile.organizer_website) ? profile.organizer_website : `https://${profile.organizer_website}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block text-xs text-drift-cyan hover:underline mb-2 break-all"
              >
                {profile.organizer_website}
              </a>
            )}
            <Link href={`/drivers/${userId}`} className="text-xs text-drift-cyan hover:underline">
              View driver profile
            </Link>
          </div>
          <div className="flex sm:flex-col gap-3 flex-shrink-0">
            <div className="px-4 py-3 rounded-xl bg-surface-lighter text-center min-w-[100px]">
              <p className="font-heading font-bold text-2xl text-drift-orange">{hostedCount}</p>
              <p className="text-[10px] text-muted uppercase tracking-wider">Events Hosted</p>
            </div>
            <div className="px-4 py-3 rounded-xl bg-surface-lighter text-center min-w-[100px]">
              <p className="font-heading font-bold text-2xl text-drift-cyan">{upcomingEvents.length}</p>
              <p className="text-[10px] text-muted uppercase tracking-wider">Upcoming</p>
            </div>
          </div>
        </div>
      </div>

      {/* Upcoming events */}
      <div className="glass rounded-2xl p-6 md:p-8">
        <h2 className="font-heading font-semibold text-sm text-foreground uppercase tracking-wider mb-3">Upcoming Events</h2>
        {upcomingEvents.length > 0 ? (
          <div className="space-y-2">
            {upcomingEvents.map((e) => <OrganizerEventCard key={e.id} event={e} />)}
          </div>
        ) : (
          <p className="text-sm text-muted">No upcoming events right now.</p>
        )}
      </div>

      {/* Past events */}
      {pastEvents.length > 0 && (
        <div className="glass rounded-2xl p-6 md:p-8">
          <h2 className="font-heading font-semibold text-sm text-foreground uppercase tracking-wider mb-3">Past Events</h2>
          <div className="space-y-2">
            {pastEvents.map((e) => <OrganizerEventCard key={e.id} event={e} past />)}
          </div>
        </div>
      )}
    </div>
  );
}
