"use client";

import { useState } from "react";
import Link from "next/link";
import { useDriverProfile, type DriverEvent } from "@/hooks/useProfile";
import { shareDriverProfile } from "@/lib/shareEvent";
import { useToast } from "@/components/ui/Toast";
import { equipmentLabel } from "@/lib/equipment";

const skillBadge: Record<string, { bg: string; text: string; border: string }> = {
  beginner: { bg: "bg-badge-grassroots/10", text: "text-badge-grassroots", border: "border-badge-grassroots/20" },
  intermediate: { bg: "bg-drift-cyan/10", text: "text-drift-cyan", border: "border-drift-cyan/20" },
  advanced: { bg: "bg-drift-orange/10", text: "text-drift-orange", border: "border-drift-orange/20" },
};

function youtubeEmbedUrl(url: string): string | null {
  const m = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/shorts\/)([\w-]{6,})/);
  return m ? `https://www.youtube.com/embed/${m[1]}` : null;
}

function socialUrl(kind: "instagram" | "tiktok" | "youtube" | "facebook", value: string): string {
  if (/^https?:\/\//i.test(value)) return value;
  const handle = value.replace(/^@/, "");
  switch (kind) {
    case "instagram": return `https://instagram.com/${handle}`;
    case "tiktok": return `https://tiktok.com/@${handle}`;
    case "youtube": return `https://youtube.com/@${handle}`;
    case "facebook": return `https://facebook.com/${handle}`;
  }
}

const socialIcons: Record<string, React.ReactNode> = {
  instagram: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" /><path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z" /><line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
    </svg>
  ),
  tiktok: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
      <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-5.2 1.74 2.89 2.89 0 012.31-4.64 2.93 2.93 0 01.88.13V9.4a6.84 6.84 0 00-1-.05A6.33 6.33 0 005 20.1a6.34 6.34 0 0010.86-4.43v-7a8.16 8.16 0 004.77 1.52v-3.4a4.85 4.85 0 01-1-.1z" />
    </svg>
  ),
  youtube: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M22.54 6.42a2.78 2.78 0 00-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 00-1.94 2A29 29 0 001 11.75a29 29 0 00.46 5.33A2.78 2.78 0 003.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 001.94-2 29 29 0 00.46-5.25 29 29 0 00-.46-5.33z" /><polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02" fill="currentColor" stroke="none" />
    </svg>
  ),
  facebook: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z" />
    </svg>
  ),
};

function EventRow({ event }: { event: DriverEvent }) {
  return (
    <Link
      href={`/events/${event.id}`}
      className="flex items-center justify-between p-3 rounded-xl glass-light hover:border-drift-orange/30 border border-transparent transition-all group"
    >
      <div className="min-w-0">
        <p className="text-sm font-semibold text-foreground truncate group-hover:text-drift-orange transition-colors">{event.name}</p>
        <p className="text-xs text-muted mt-0.5">
          {new Date(event.date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })} · {event.location}
        </p>
      </div>
      <svg className="text-muted-dark flex-shrink-0 ml-3" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="9 18 15 12 9 6" /></svg>
    </Link>
  );
}

export default function DriverProfileView({ userId }: { userId: string }) {
  const { profile, cars, stats, pastEvents, upcomingEvents, loading, notFound } = useDriverProfile(userId);
  const [lightbox, setLightbox] = useState<string | null>(null);
  const { toast } = useToast();

  const handleShare = async () => {
    if (!profile) return;
    const result = await shareDriverProfile(userId, profile.username);
    if (result === "copied") toast("Profile link copied!");
    else if (result === "failed") toast("Could not share profile", "error");
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-48 glass rounded-2xl animate-pulse" />
        <div className="h-64 glass rounded-2xl animate-pulse" />
      </div>
    );
  }

  if (notFound || !profile) {
    return (
      <div className="glass rounded-2xl p-6 sm:p-12 text-center">
        <svg className="mx-auto mb-4 text-muted-dark" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0110 0v4" />
        </svg>
        <p className="text-muted">This driver&apos;s profile is private or doesn&apos;t exist.</p>
        <p className="text-xs text-muted-dark mt-2">Organizers can view private profiles once the driver applies to their event.</p>
      </div>
    );
  }

  const skill = profile.skill_level ? skillBadge[profile.skill_level] : null;
  const socials = ([
    ["instagram", profile.instagram],
    ["tiktok", profile.tiktok],
    ["youtube", profile.youtube],
    ["facebook", profile.facebook],
  ] as const).filter(([, v]) => v);

  return (
    <div className="space-y-6">
      {/* Header card */}
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
              <h1 className="font-heading font-bold text-2xl md:text-3xl text-foreground tracking-tight">{profile.username}</h1>
              {skill && (
                <span className={`px-3 py-1 rounded-full text-xs font-semibold capitalize ${skill.bg} ${skill.text} border ${skill.border}`}>
                  {profile.skill_level}
                </span>
              )}
            </div>
            {profile.bio && <p className="text-sm text-muted leading-relaxed mb-3">{profile.bio}</p>}
            {socials.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {socials.map(([kind, value]) => (
                  <a
                    key={kind}
                    href={socialUrl(kind, value!)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg glass-light text-xs font-medium text-muted hover:text-drift-cyan border border-transparent hover:border-drift-cyan/30 transition-all capitalize"
                  >
                    {socialIcons[kind]}
                    {kind}
                  </a>
                ))}
              </div>
            )}
          </div>
          {/* Stats */}
          <div className="flex sm:flex-col gap-3 flex-shrink-0">
            <div className="px-4 py-3 rounded-xl bg-surface-lighter text-center min-w-[100px]">
              <p className="font-heading font-bold text-2xl text-drift-orange">{stats.events_attended}</p>
              <p className="text-[10px] text-muted uppercase tracking-wider">Events Attended</p>
            </div>
            <div className="px-4 py-3 rounded-xl bg-surface-lighter text-center min-w-[100px]">
              <p className="font-heading font-bold text-2xl text-drift-cyan">{stats.upcoming_events}</p>
              <p className="text-[10px] text-muted uppercase tracking-wider">Upcoming</p>
            </div>
          </div>
        </div>

        {/* Share */}
        <button
          onClick={handleShare}
          className="mt-5 flex items-center justify-center gap-2 w-full px-4 py-2.5 rounded-xl glass-light border border-border hover:border-drift-orange text-sm font-medium text-muted hover:text-drift-orange transition-all"
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="18" cy="5" r="3" /><circle cx="6" cy="12" r="3" /><circle cx="18" cy="19" r="3" /><line x1="8.59" y1="13.51" x2="15.42" y2="17.49" /><line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
          </svg>
          Share Driver Profile
        </button>
      </div>

      {/* Garage */}
      {cars.length > 0 && (
        <div className="glass rounded-2xl p-6 md:p-8">
          <h2 className="font-heading font-semibold text-sm text-foreground uppercase tracking-wider mb-4">
            Garage <span className="text-muted-dark normal-case font-normal">({cars.length} {cars.length === 1 ? "car" : "cars"})</span>
          </h2>
          <div className="space-y-6">
            {cars.map((car) => (
              <div key={car.id}>
                <div className="flex items-center gap-2.5 flex-wrap mb-1">
                  <p className="font-heading font-bold text-xl text-foreground">
                    {car.car_year ? `${car.car_year} ` : ""}{car.car}
                  </p>
                  {car.horsepower != null && (
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-heading font-bold bg-drift-cyan/10 text-drift-cyan border border-drift-cyan/20">
                      {car.horsepower} HP
                    </span>
                  )}
                </div>
                {(car.equipment?.length ?? 0) > 0 && (
                  <div className="flex flex-wrap gap-1.5 mb-3">
                    {car.equipment.map((key) => (
                      <span key={key} className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-medium bg-badge-grassroots/10 text-badge-grassroots border border-badge-grassroots/20">
                        <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round"><polyline points="20 6 9 17 4 12" /></svg>
                        {equipmentLabel(key)}
                      </span>
                    ))}
                  </div>
                )}
                {car.mods && <p className="text-sm text-muted leading-relaxed mb-4 whitespace-pre-line">{car.mods}</p>}
                {car.photos.length > 0 && (
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {car.photos.map((url) => (
                      <button
                        key={url}
                        onClick={() => setLightbox(url)}
                        className="aspect-video rounded-xl overflow-hidden border border-border hover:border-drift-orange/50 transition-colors"
                      >
                        <img src={url} alt={car.car} className="w-full h-full object-cover hover:scale-105 transition-transform duration-300" />
                      </button>
                    ))}
                  </div>
                )}
                {(car.video_urls?.length ?? 0) > 0 && (
                  <div className="mt-3 space-y-3">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {car.video_urls.filter((u) => youtubeEmbedUrl(u)).map((url) => (
                        <div key={url} className="aspect-video rounded-xl overflow-hidden border border-border">
                          <iframe
                            src={youtubeEmbedUrl(url)!}
                            title={`${car.car} video`}
                            className="w-full h-full"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                            loading="lazy"
                          />
                        </div>
                      ))}
                    </div>
                    {car.video_urls.filter((u) => !youtubeEmbedUrl(u)).length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {car.video_urls.filter((u) => !youtubeEmbedUrl(u)).map((url) => (
                          <a
                            key={url}
                            href={url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg glass-light text-xs font-medium text-muted hover:text-drift-cyan border border-transparent hover:border-drift-cyan/30 transition-all"
                          >
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3" /></svg>
                            Watch video
                          </a>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Events */}
      {(upcomingEvents.length > 0 || pastEvents.length > 0) && (
        <div className="glass rounded-2xl p-6 md:p-8 space-y-5">
          {upcomingEvents.length > 0 && (
            <div>
              <h2 className="font-heading font-semibold text-sm text-foreground uppercase tracking-wider mb-3">Upcoming Events</h2>
              <div className="space-y-2">
                {upcomingEvents.map((e) => <EventRow key={e.id} event={e} />)}
              </div>
            </div>
          )}
          {pastEvents.length > 0 && (
            <div>
              <h2 className="font-heading font-semibold text-sm text-foreground uppercase tracking-wider mb-3">Event History</h2>
              <div className="space-y-2">
                {pastEvents.map((e) => <EventRow key={e.id} event={e} />)}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Lightbox */}
      {lightbox && (
        <div
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex items-center justify-center p-4 cursor-zoom-out"
          onClick={() => setLightbox(null)}
        >
          <img src={lightbox} alt="Car" className="max-w-full max-h-full rounded-xl object-contain" />
          <button className="absolute top-4 right-4 w-10 h-10 rounded-full bg-black/50 flex items-center justify-center">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round">
              <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>
      )}
    </div>
  );
}
