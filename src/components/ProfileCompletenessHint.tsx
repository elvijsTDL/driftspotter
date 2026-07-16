"use client";

import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { useDriverCars } from "@/hooks/useProfile";

/**
 * Shown inside the apply form when the event allows driving. Nudges (but
 * doesn't block) drivers whose profile is missing what organizers look at.
 */
export default function ProfileCompletenessHint({ participation }: { participation: "drive" | "watch" | "both" }) {
  const { user, profile } = useAuth();
  const { cars, loading } = useDriverCars(user?.id ?? null);

  if (!user || !profile || loading || participation === "watch") return null;

  const missing: string[] = [];
  if (cars.length === 0) missing.push("your car");
  else if (!cars.some((c) => c.photos.length > 0)) missing.push("car photos");
  if (!profile.skill_level) missing.push("skill level");
  if (!profile.avatar_url) missing.push("a profile photo");

  if (missing.length === 0) return null;

  const missingText =
    missing.length === 1
      ? missing[0]
      : `${missing.slice(0, -1).join(", ")} and ${missing[missing.length - 1]}`;

  return (
    <div className="flex items-start gap-3 p-3.5 rounded-xl bg-yellow-500/5 border border-yellow-500/20">
      <svg className="text-yellow-500 flex-shrink-0 mt-0.5" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
        <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" /><line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" />
      </svg>
      <p className="text-xs text-muted leading-relaxed">
        <span className="text-yellow-500 font-semibold">Your driver profile is missing {missingText}.</span>{" "}
        Organizers review your profile to decide on applications — a complete one gets approved faster.{" "}
        <Link href="/profile" className="text-drift-orange hover:underline font-medium">Complete it now</Link>
      </p>
    </div>
  );
}
