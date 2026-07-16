"use client";

import { useState, useMemo } from "react";
import { createBrowserClient } from "@supabase/ssr";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/components/ui/Toast";

const inputClass =
  "w-full px-4 py-3 bg-surface-lighter border border-border rounded-xl text-sm text-foreground placeholder:text-muted-dark focus:outline-none focus:border-drift-orange transition-colors";
const labelClass = "block text-xs text-muted uppercase tracking-wider font-medium mb-2";

/**
 * Request organizer access: saves org details and moves the account
 * from `none` to `pending` (the only self-service status transition
 * the DB trigger permits). Admins review from the dashboard.
 */
export default function OrganizerRequestForm({
  accountType = "organizer",
  onSubmitted,
}: {
  accountType?: "organizer" | "both";
  onSubmitted?: () => void;
}) {
  const { user, profile, refreshProfile } = useAuth();
  const { toast } = useToast();
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    organizerName: profile?.organizer_name ?? "",
    website: profile?.organizer_website ?? "",
    about: profile?.organizer_about ?? "",
  });
  const supabase = useMemo(() => createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL ?? "",
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? ""
  ), []);

  if (!user) {
    return (
      <div className="glass rounded-2xl p-8 text-center">
        <p className="text-sm text-muted">Sign in to request organizer access.</p>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.organizerName.trim()) { toast("Tell us your crew / company name", "error"); return; }
    if (!form.about.trim()) { toast("Tell us a bit about the events you run", "error"); return; }

    setSaving(true);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { error } = await (supabase.from("profiles") as any)
      .update({
        account_type: accountType,
        organizer_name: form.organizerName.trim(),
        organizer_website: form.website.trim() || null,
        organizer_about: form.about.trim(),
        organizer_status: "pending",
        updated_at: new Date().toISOString(),
      })
      .eq("id", user.id);
    setSaving(false);

    if (error) {
      toast(error.message, "error");
      return;
    }
    await refreshProfile();
    toast("Request submitted — we'll review it shortly!");
    onSubmitted?.();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label className={labelClass}>Crew / Company Name *</label>
        <input
          type="text"
          required
          value={form.organizerName}
          onChange={(e) => setForm({ ...form, organizerName: e.target.value })}
          placeholder="e.g. Baltic Drift Series, Slideways Crew..."
          className={inputClass}
        />
      </div>

      <div>
        <label className={labelClass}>Website / Social Link</label>
        <input
          type="text"
          value={form.website}
          onChange={(e) => setForm({ ...form, website: e.target.value })}
          placeholder="Your site, Instagram or Facebook page"
          className={inputClass}
        />
        <p className="text-xs text-muted-dark mt-1.5">Helps us verify you&apos;re a real organizer — speeds up approval a lot.</p>
      </div>

      <div>
        <label className={labelClass}>About Your Events *</label>
        <textarea
          required
          value={form.about}
          onChange={(e) => setForm({ ...form, about: e.target.value })}
          placeholder="What events do you run? Which tracks, how often, how long have you been organizing..."
          rows={4}
          className={`${inputClass} resize-none`}
        />
      </div>

      <button
        type="submit"
        disabled={saving}
        className="w-full py-3.5 bg-drift-orange hover:bg-drift-orange-light text-white font-heading font-semibold rounded-xl transition-all duration-200 hover:shadow-xl hover:shadow-drift-orange/20 active:scale-[0.98] disabled:opacity-50"
      >
        {saving ? "Submitting..." : "Request Organizer Access"}
      </button>
      <p className="text-xs text-muted-dark text-center">
        We review every organizer to keep fake and spam events off the platform. You&apos;ll get a notification once approved.
      </p>
    </form>
  );
}
