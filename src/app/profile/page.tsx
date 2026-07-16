"use client";

import { useAuth } from "@/contexts/AuthContext";
import ProfileEditor from "@/components/ProfileEditor";

export default function ProfilePage() {
  const { profile, loading } = useAuth();

  return (
    <section className="relative pt-28 pb-20 md:pt-32 md:pb-28">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        <div className="mb-8">
          <h1 className="font-heading font-bold text-3xl md:text-4xl text-foreground tracking-tight">DRIVER PROFILE</h1>
          <div className="tire-track w-20 mt-3" />
          <p className="text-muted mt-3">
            Your driver card — organizers see this when you apply to events. Add your car, photos and socials so you never fill a Google Form again.
          </p>
        </div>

        {loading ? (
          <div className="space-y-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-48 glass rounded-2xl animate-pulse" />
            ))}
          </div>
        ) : profile ? (
          <ProfileEditor key={profile.id} />
        ) : (
          <div className="glass rounded-2xl p-12 text-center">
            <p className="text-muted">Please sign in to edit your driver profile.</p>
          </div>
        )}
      </div>
    </section>
  );
}
