"use client";

import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { useDriverCars } from "@/hooks/useProfile";
import { shareDriverProfile } from "@/lib/shareEvent";
import { useToast } from "@/components/ui/Toast";

const skillBadge: Record<string, string> = {
  beginner: "bg-badge-grassroots/10 text-badge-grassroots border-badge-grassroots/20",
  intermediate: "bg-drift-cyan/10 text-drift-cyan border-drift-cyan/20",
  advanced: "bg-drift-orange/10 text-drift-orange border-drift-orange/20",
};

/** Post-save celebration: the driver card they just built + where to go next. */
export default function ProfileSavedScreen({ onKeepEditing }: { onKeepEditing: () => void }) {
  const { user, profile } = useAuth();
  const { cars, loading: carsLoading } = useDriverCars(user?.id ?? null);
  const { toast } = useToast();

  if (!user || !profile) return null;

  const handleShare = async () => {
    const result = await shareDriverProfile(user.id, profile.username);
    if (result === "copied") toast("Profile link copied — send it anywhere!");
    else if (result === "failed") toast("Could not share profile", "error");
  };

  const socials = [profile.instagram, profile.tiktok, profile.youtube, profile.facebook].filter(Boolean).length;
  const photoCount = cars.reduce((sum, c) => sum + c.photos.length, 0);
  const videoCount = cars.reduce((sum, c) => sum + (c.video_urls?.length ?? 0), 0);

  const levelUps: string[] = [];
  if (cars.length === 0) levelUps.push("Add your car — organizers want to see what you're bringing");
  else if (photoCount === 0) levelUps.push("Add car photos — cards with photos get approved faster");
  if (!profile.avatar_url) levelUps.push("Add a profile photo");
  if (!profile.skill_level) levelUps.push("Set your skill level");
  if (socials === 0) levelUps.push("Link a social — it builds trust with organizers");

  return (
    <div className="animate-fade-in-up">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="w-20 h-20 rounded-full bg-badge-grassroots/15 glow-orange flex items-center justify-center mx-auto mb-5 animate-float">
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#22C55E" strokeWidth="2.5" strokeLinecap="round"><polyline points="20 6 9 17 4 12" /></svg>
        </div>
        <h2 className="font-heading font-bold text-3xl md:text-4xl text-foreground tracking-tight">
          YOU&apos;RE SET, <span className="text-drift-orange uppercase">{profile.username}</span>
        </h2>
        <div className="tire-track w-20 mx-auto mt-4" />
        <p className="text-muted mt-4 max-w-md mx-auto">
          This is the driver card organizers see when you apply. One click, no forms — that&apos;s the whole pitch.
        </p>
      </div>

      {/* The card they just built */}
      <div className="glass rounded-2xl p-6 mb-6 glow-orange">
        <div className="flex items-center gap-4 mb-4">
          {profile.avatar_url ? (
            <img src={profile.avatar_url} alt={profile.username} className="w-14 h-14 rounded-full object-cover border-2 border-drift-orange/30" />
          ) : (
            <div className="w-14 h-14 rounded-full bg-drift-orange/20 flex items-center justify-center text-xl font-semibold text-drift-orange">
              {profile.username[0]?.toUpperCase() || "?"}
            </div>
          )}
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <p className="font-heading font-semibold text-lg text-foreground">{profile.username}</p>
              {profile.skill_level && (
                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-semibold capitalize border ${skillBadge[profile.skill_level]}`}>
                  {profile.skill_level}
                </span>
              )}
            </div>
            {profile.bio && <p className="text-xs text-muted truncate">{profile.bio}</p>}
          </div>
        </div>

        {carsLoading ? (
          <div className="h-16 bg-surface-lighter rounded-xl animate-pulse" />
        ) : cars.length > 0 ? (
          <div className="space-y-2">
            {cars.map((car) => (
              <div key={car.id} className="flex items-center gap-3 p-3 rounded-xl bg-surface-lighter/50 border border-border">
                <div className="w-16 h-11 rounded-lg overflow-hidden bg-surface-lighter flex-shrink-0">
                  {car.photos[0] ? (
                    <img src={car.photos[0]} alt={car.car} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full carbon-bg" />
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="text-sm font-semibold text-foreground truncate">
                      {car.car_year ? `${car.car_year} ` : ""}{car.car}
                    </p>
                    {car.horsepower != null && (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-drift-cyan/10 text-drift-cyan border border-drift-cyan/20">
                        {car.horsepower} HP
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-muted-dark">
                    {car.photos.length} {car.photos.length === 1 ? "photo" : "photos"}
                    {(car.video_urls?.length ?? 0) > 0 && ` · ${car.video_urls.length} ${car.video_urls.length === 1 ? "video" : "videos"}`}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-muted-dark text-center py-3">No cars in the garage yet.</p>
        )}

        <div className="flex flex-wrap gap-2 mt-4">
          <span className="px-2.5 py-1 rounded-lg bg-surface-lighter text-[11px] text-muted font-medium">
            {photoCount} {photoCount === 1 ? "photo" : "photos"}
          </span>
          {videoCount > 0 && (
            <span className="px-2.5 py-1 rounded-lg bg-surface-lighter text-[11px] text-muted font-medium">
              {videoCount} {videoCount === 1 ? "video" : "videos"}
            </span>
          )}
          <span className="px-2.5 py-1 rounded-lg bg-surface-lighter text-[11px] text-muted font-medium">
            {socials} {socials === 1 ? "social" : "socials"} linked
          </span>
          <span className={`px-2.5 py-1 rounded-lg text-[11px] font-medium ${profile.profile_visibility === "public" ? "bg-surface-lighter text-muted" : "bg-drift-cyan/10 text-drift-cyan"}`}>
            {profile.profile_visibility === "public" ? "Public profile" : "Organizers-only profile"}
          </span>
        </div>
      </div>

      {/* Level-up hints */}
      {levelUps.length > 0 && (
        <div className="rounded-2xl bg-yellow-500/5 border border-yellow-500/15 p-5 mb-6">
          <p className="text-xs font-heading font-semibold text-yellow-500 uppercase tracking-wider mb-2.5">Level up your card</p>
          <ul className="space-y-1.5">
            {levelUps.map((tip) => (
              <li key={tip} className="flex items-start gap-2 text-xs text-muted">
                <svg className="text-yellow-500 flex-shrink-0 mt-0.5" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="9 18 15 12 9 6" /></svg>
                {tip}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Where to next */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
        <Link
          href="/events"
          className="flex items-center justify-center gap-2 px-6 py-4 bg-drift-orange hover:bg-drift-orange-light text-white font-heading font-semibold rounded-xl transition-all duration-200 hover:shadow-xl hover:shadow-drift-orange/30 active:scale-[0.98]"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" /></svg>
          Explore Events
        </Link>
        <Link
          href="/map"
          className="flex items-center justify-center gap-2 px-6 py-4 glass border border-border hover:border-drift-cyan text-foreground hover:text-drift-cyan font-heading font-semibold rounded-xl transition-all"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" /></svg>
          See the Map
        </Link>
      </div>

      {/* Shareable card */}
      <button
        onClick={handleShare}
        className="flex items-center justify-center gap-2 w-full px-6 py-3.5 mb-4 rounded-xl glass border border-border hover:border-drift-orange text-sm font-heading font-semibold text-foreground hover:text-drift-orange transition-all"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="18" cy="5" r="3" /><circle cx="6" cy="12" r="3" /><circle cx="18" cy="19" r="3" /><line x1="8.59" y1="13.51" x2="15.42" y2="17.49" /><line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
        </svg>
        Share Your Driver Card
      </button>
      <p className="text-xs text-muted-dark text-center mb-4 -mt-1">
        {profile.profile_visibility === "organizers"
          ? "Heads up: your profile is set to organizers-only — people you share the link with will see a private-profile notice."
          : "Your card is a link — send it to any organizer, even ones not on DriftSpotter yet."}
      </p>

      <div className="flex items-center justify-center gap-6">
        <Link href={`/drivers/${user.id}`} className="text-sm text-drift-cyan hover:underline">
          View public profile
        </Link>
        <button onClick={onKeepEditing} className="text-sm text-muted hover:text-foreground transition-colors underline">
          Keep editing
        </button>
      </div>
    </div>
  );
}
