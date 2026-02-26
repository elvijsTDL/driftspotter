"use client";

import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/components/ui/Toast";
import { createBrowserClient } from "@supabase/ssr";

export default function SubmitEvent() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [form, setForm] = useState({
    name: "", date: "", location: "", category: "grassroots",
    cageRequired: false, tireSize: "unlimited", skillLevel: "all",
    participation: "both" as "drive" | "watch" | "both",
    description: "", eventUrl: "", organizer: "", contactEmail: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      toast("Please sign in to submit an event", "error");
      return;
    }

    setLoading(true);
    const supabase = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    const { error } = await supabase.from("submitted_events").insert({
      submitted_by: user.id,
      name: form.name,
      date: form.date,
      location: form.location,
      category: form.category,
      cage_required: form.cageRequired,
      tire_size: form.tireSize,
      skill_level: form.skillLevel,
      participation: form.participation,
      description: form.description,
      event_url: form.eventUrl || null,
      organizer: form.organizer,
      contact_email: form.contactEmail,
    });

    setLoading(false);

    if (error) {
      toast(error.message, "error");
    } else {
      setSubmitted(true);
    }
  };

  if (submitted) {
    return (
      <section className="relative py-20 md:py-28">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
        <div className="max-w-2xl mx-auto px-4 text-center">
          <div className="glass rounded-2xl p-12">
            <div className="w-16 h-16 rounded-full bg-badge-grassroots/20 flex items-center justify-center mx-auto mb-5">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#22C55E" strokeWidth="2" strokeLinecap="round"><polyline points="20 6 9 17 4 12" /></svg>
            </div>
            <h3 className="font-heading font-bold text-2xl text-foreground mb-3">Event Submitted!</h3>
            <p className="text-muted mb-2">Your event is now pending review.</p>
            <p className="text-sm text-muted-dark mb-6">We typically review submissions within 24 hours. You&apos;ll receive an email confirmation once approved.</p>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-yellow-500/10 border border-yellow-500/20">
              <span className="w-2 h-2 rounded-full bg-yellow-500 animate-pulse" />
              <span className="text-xs font-semibold text-yellow-500 uppercase tracking-wider">Pending Review</span>
            </div>
            <button
              onClick={() => { setSubmitted(false); setForm({ name: "", date: "", location: "", category: "grassroots", cageRequired: false, tireSize: "unlimited", skillLevel: "all", participation: "both", description: "", eventUrl: "", organizer: "", contactEmail: "" }); }}
              className="block mx-auto mt-6 text-sm text-drift-orange hover:underline"
            >
              Submit another event
            </button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="relative py-20 md:py-28">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" />

      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-10">
          <h2 className="font-heading font-bold text-3xl md:text-4xl text-foreground tracking-tight">
            SUBMIT AN EVENT
          </h2>
          <div className="tire-track w-20 mt-3" />
          <p className="text-muted mt-3">Know about an upcoming drift event? Submit it and we&apos;ll add it to the map.</p>
        </div>

        {!user && (
          <div className="glass rounded-2xl p-5 mb-6 border border-drift-orange/20 bg-drift-orange/5">
            <p className="text-sm text-drift-orange">Please sign in to submit an event. Your submissions will be linked to your account.</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="glass rounded-2xl p-6 md:p-8 space-y-5">
          {/* Event Name */}
          <div>
            <label className="block text-xs text-muted uppercase tracking-wider font-medium mb-2">Event Name *</label>
            <input
              type="text"
              required
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="e.g. Grassroots Drift Day - Round 3"
              className="w-full px-4 py-3 bg-surface-lighter border border-border rounded-xl text-sm text-foreground placeholder:text-muted-dark focus:outline-none focus:border-drift-orange transition-colors"
            />
          </div>

          {/* Date & Location */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs text-muted uppercase tracking-wider font-medium mb-2">Date *</label>
              <input
                type="date"
                required
                value={form.date}
                onChange={(e) => setForm({ ...form, date: e.target.value })}
                className="w-full px-4 py-3 bg-surface-lighter border border-border rounded-xl text-sm text-foreground focus:outline-none focus:border-drift-orange transition-colors"
              />
            </div>
            <div>
              <label className="block text-xs text-muted uppercase tracking-wider font-medium mb-2">Location *</label>
              <input
                type="text"
                required
                value={form.location}
                onChange={(e) => setForm({ ...form, location: e.target.value })}
                placeholder="Track name, City, Country"
                className="w-full px-4 py-3 bg-surface-lighter border border-border rounded-xl text-sm text-foreground placeholder:text-muted-dark focus:outline-none focus:border-drift-orange transition-colors"
              />
            </div>
          </div>

          {/* Category & Cage */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs text-muted uppercase tracking-wider font-medium mb-2">Category</label>
              <select
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                className="w-full px-4 py-3 bg-surface-lighter border border-border rounded-xl text-sm text-foreground focus:outline-none focus:border-drift-orange transition-colors"
              >
                <option value="official">Official Championship</option>
                <option value="proam">Pro-Am</option>
                <option value="grassroots">Grassroots</option>
                <option value="practice">Practice Day</option>
              </select>
            </div>
            <div>
              <label className="block text-xs text-muted uppercase tracking-wider font-medium mb-2">Cage Required</label>
              <div className="flex items-center gap-3 mt-1">
                <button
                  type="button"
                  onClick={() => setForm({ ...form, cageRequired: !form.cageRequired })}
                  className={`relative w-12 h-7 rounded-full transition-colors ${form.cageRequired ? "bg-drift-orange" : "bg-surface-lighter border border-border"}`}
                >
                  <div className={`absolute top-1 w-5 h-5 rounded-full bg-white transition-all ${form.cageRequired ? "left-6" : "left-1"}`} />
                </button>
                <span className="text-sm text-muted">{form.cageRequired ? "Yes" : "No"}</span>
              </div>
            </div>
          </div>

          {/* Tire Size & Skill */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs text-muted uppercase tracking-wider font-medium mb-2">Max Tire Size</label>
              <select
                value={form.tireSize}
                onChange={(e) => setForm({ ...form, tireSize: e.target.value })}
                className="w-full px-4 py-3 bg-surface-lighter border border-border rounded-xl text-sm text-foreground focus:outline-none focus:border-drift-orange transition-colors"
              >
                <option value="205">205 Max</option>
                <option value="225">225 Max</option>
                <option value="unlimited">Unlimited</option>
              </select>
            </div>
            <div>
              <label className="block text-xs text-muted uppercase tracking-wider font-medium mb-2">Skill Level</label>
              <select
                value={form.skillLevel}
                onChange={(e) => setForm({ ...form, skillLevel: e.target.value })}
                className="w-full px-4 py-3 bg-surface-lighter border border-border rounded-xl text-sm text-foreground focus:outline-none focus:border-drift-orange transition-colors"
              >
                <option value="all">All Levels</option>
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced / Pro</option>
              </select>
            </div>
          </div>

          {/* Who Can Attend */}
          <div>
            <label className="block text-xs text-muted uppercase tracking-wider font-medium mb-2">Who Can Attend?</label>
            <div className="flex gap-2">
              {([
                { v: "drive" as const, l: "Drivers", active: "bg-drift-orange text-white" },
                { v: "watch" as const, l: "Spectators", active: "bg-drift-cyan text-white" },
                { v: "both" as const, l: "Both", active: "bg-purple-500 text-white" },
              ]).map(({ v, l, active }) => (
                <button
                  key={v}
                  type="button"
                  onClick={() => setForm({ ...form, participation: v })}
                  className={`flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                    form.participation === v ? active : "bg-surface-lighter text-muted hover:text-foreground border border-border"
                  }`}
                >
                  {l}
                </button>
              ))}
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs text-muted uppercase tracking-wider font-medium mb-2">Description</label>
            <textarea
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              placeholder="Tell us about the event..."
              rows={4}
              className="w-full px-4 py-3 bg-surface-lighter border border-border rounded-xl text-sm text-foreground placeholder:text-muted-dark focus:outline-none focus:border-drift-orange transition-colors resize-none"
            />
          </div>

          {/* Event URL */}
          <div>
            <label className="block text-xs text-muted uppercase tracking-wider font-medium mb-2">Event URL / Social Link</label>
            <input
              type="url"
              value={form.eventUrl}
              onChange={(e) => setForm({ ...form, eventUrl: e.target.value })}
              placeholder="https://..."
              className="w-full px-4 py-3 bg-surface-lighter border border-border rounded-xl text-sm text-foreground placeholder:text-muted-dark focus:outline-none focus:border-drift-orange transition-colors"
            />
          </div>

          {/* Organizer & Contact */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs text-muted uppercase tracking-wider font-medium mb-2">Organizer Name *</label>
              <input
                type="text"
                required
                value={form.organizer}
                onChange={(e) => setForm({ ...form, organizer: e.target.value })}
                placeholder="Who organizes this event?"
                className="w-full px-4 py-3 bg-surface-lighter border border-border rounded-xl text-sm text-foreground placeholder:text-muted-dark focus:outline-none focus:border-drift-orange transition-colors"
              />
            </div>
            <div>
              <label className="block text-xs text-muted uppercase tracking-wider font-medium mb-2">Contact Email *</label>
              <input
                type="email"
                required
                value={form.contactEmail}
                onChange={(e) => setForm({ ...form, contactEmail: e.target.value })}
                placeholder="your@email.com"
                className="w-full px-4 py-3 bg-surface-lighter border border-border rounded-xl text-sm text-foreground placeholder:text-muted-dark focus:outline-none focus:border-drift-orange transition-colors"
              />
            </div>
          </div>

          {/* Image Upload placeholder */}
          <div>
            <label className="block text-xs text-muted uppercase tracking-wider font-medium mb-2">Event Image</label>
            <div className="border-2 border-dashed border-border rounded-xl p-8 text-center hover:border-drift-orange/50 transition-colors cursor-pointer">
              <svg className="mx-auto mb-3 text-muted-dark" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="3" y="3" width="18" height="18" rx="2" ry="2" /><circle cx="8.5" cy="8.5" r="1.5" /><polyline points="21 15 16 10 5 21" /></svg>
              <p className="text-sm text-muted-dark">Click to upload or drag and drop</p>
              <p className="text-xs text-muted-dark mt-1">PNG, JPG up to 5MB</p>
            </div>
          </div>

          {/* Note */}
          <div className="flex items-start gap-3 p-4 rounded-xl bg-drift-orange/5 border border-drift-orange/10">
            <svg className="text-drift-orange flex-shrink-0 mt-0.5" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10" /><line x1="12" y1="16" x2="12" y2="12" /><line x1="12" y1="8" x2="12.01" y2="8" /></svg>
            <p className="text-xs text-muted leading-relaxed">
              All events are reviewed before publishing to ensure quality and legitimacy. We&apos;ll get back to you within 24 hours.
            </p>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading || !user}
            className="w-full py-4 bg-drift-orange hover:bg-drift-orange-light text-white font-heading font-semibold text-lg rounded-xl transition-all duration-200 hover:shadow-xl hover:shadow-drift-orange/20 active:scale-[0.98] disabled:opacity-50"
          >
            {loading ? "Submitting..." : "Submit for Review"}
          </button>
        </form>
      </div>
    </section>
  );
}
