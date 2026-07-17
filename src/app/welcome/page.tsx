"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { createBrowserClient } from "@supabase/ssr";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/components/ui/Toast";
import OrganizerRequestForm from "@/components/OrganizerRequestForm";

export default function WelcomePage() {
  const { user, profile, loading, refreshProfile } = useAuth();
  const { toast } = useToast();
  const router = useRouter();
  const [path, setPath] = useState<"choose" | "organizer">("choose");
  const [saving, setSaving] = useState(false);
  const supabase = useMemo(() => createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL ?? "",
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? ""
  ), []);

  const chooseDriver = async () => {
    if (!user) return;
    setSaving(true);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { error } = await (supabase.from("profiles") as any)
      .update({ account_type: "driver" })
      .eq("id", user.id);
    setSaving(false);
    if (error) { toast(error.message, "error"); return; }
    await refreshProfile();
    router.push("/profile");
  };

  if (loading) {
    return (
      <section className="relative pt-28 pb-20 md:pt-32 md:pb-28">
        <div className="max-w-2xl mx-auto px-4 sm:px-6">
          <div className="h-64 glass rounded-2xl animate-pulse" />
        </div>
      </section>
    );
  }

  if (!user || !profile) {
    return (
      <section className="relative pt-28 pb-20 md:pt-32 md:pb-28">
        <div className="max-w-2xl mx-auto px-4 sm:px-6">
          <div className="glass rounded-2xl p-6 sm:p-12 text-center">
            <p className="text-muted">Please sign in first.</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="relative pt-28 pb-20 md:pt-32 md:pb-28">
      <div className="max-w-2xl mx-auto px-4 sm:px-6">
        <div className="mb-10 text-center">
          <h1 className="font-heading font-bold text-3xl md:text-4xl text-foreground tracking-tight">
            WELCOME TO DRIFT<span className="text-drift-orange">SPOTTER</span>
          </h1>
          <div className="tire-track w-20 mt-3 mx-auto" />
          <p className="text-muted mt-4">
            Hey {profile.username} — what brings you here? This just tailors your setup; you can always do both.
          </p>
        </div>

        {path === "choose" ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <button
              onClick={chooseDriver}
              disabled={saving}
              className="glass rounded-2xl p-8 text-left hover:border-drift-orange/40 border border-transparent transition-all group disabled:opacity-50"
            >
              <div className="w-12 h-12 rounded-xl bg-drift-orange/10 flex items-center justify-center mb-4 group-hover:bg-drift-orange/20 transition-colors">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#FF6B00" strokeWidth="2" strokeLinecap="round">
                  <circle cx="12" cy="12" r="10" /><circle cx="12" cy="12" r="3" /><path d="M12 2v3M12 19v3M2 12h3M19 12h3" />
                </svg>
              </div>
              <h2 className="font-heading font-bold text-xl text-foreground mb-2 group-hover:text-drift-orange transition-colors">
                I&apos;m Here to Drive
              </h2>
              <p className="text-sm text-muted leading-relaxed">
                Find events, apply with your driver card, and skip the Google Forms. Next stop: your garage.
              </p>
            </button>

            <button
              onClick={() => setPath("organizer")}
              className="glass rounded-2xl p-8 text-left hover:border-drift-cyan/40 border border-transparent transition-all group"
            >
              <div className="w-12 h-12 rounded-xl bg-drift-cyan/10 flex items-center justify-center mb-4 group-hover:bg-drift-cyan/20 transition-colors">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#00D4FF" strokeWidth="2" strokeLinecap="round">
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" />
                </svg>
              </div>
              <h2 className="font-heading font-bold text-xl text-foreground mb-2 group-hover:text-drift-cyan transition-colors">
                I Organize Events
              </h2>
              <p className="text-sm text-muted leading-relaxed">
                Publish events, manage driver applications, and see every applicant&apos;s car and history. Requires a quick verification.
              </p>
            </button>
          </div>
        ) : (
          <div className="glass rounded-2xl p-6 md:p-8">
            <button
              onClick={() => setPath("choose")}
              className="flex items-center gap-1.5 text-sm text-muted hover:text-foreground transition-colors mb-6"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="15 18 9 12 15 6" /></svg>
              Back
            </button>
            <h2 className="font-heading font-bold text-xl text-foreground mb-2">Tell us about your events</h2>
            <p className="text-sm text-muted mb-6">
              We verify every organizer to keep fake events off the platform — usually within 24 hours.
            </p>
            <OrganizerRequestForm accountType="both" onSubmitted={() => router.push("/profile")} />
          </div>
        )}

        {path === "choose" && (
          <>
            <p className="text-center mt-6 text-xs text-muted-dark">
              Not sure yet?{" "}
              <a href="/how-it-works" target="_blank" className="text-drift-orange hover:underline">
                See how DriftSpotter works
              </a>
            </p>
            <p className="text-center mt-3">
              <button onClick={chooseDriver} disabled={saving} className="text-xs text-muted-dark hover:text-muted transition-colors underline">
                Skip for now
              </button>
            </p>
          </>
        )}
      </div>
    </section>
  );
}
