"use client";

import { useState, useMemo } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/components/ui/Toast";
import { createBrowserClient } from "@supabase/ssr";
import EventForm, { type EventFormValues } from "@/components/EventForm";
import OrganizerRequestForm from "@/components/OrganizerRequestForm";
import { uploadImages } from "@/lib/uploadMedia";

export default function SubmitEvent() {
  const { user, profile } = useAuth();
  const { toast } = useToast();
  const isTrusted = profile?.organizer_status === "trusted";
  const isBlocked = profile?.organizer_status === "blocked";
  // Admins can always submit; everyone else needs approved organizer access
  const canSubmit = !!profile && (profile.is_admin || profile.organizer_status === "standard" || isTrusted);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formKey, setFormKey] = useState(0);
  const supabase = useMemo(() => createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL ?? "",
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? ""
  ), []);

  const handleSubmit = async (form: EventFormValues, newImages: File[]) => {
    if (!user) {
      toast("Please sign in to submit an event", "error");
      return;
    }

    setLoading(true);

    // Upload media
    const { urls: uploaded, error: uploadError } = await uploadImages(supabase, "event-images", user.id, newImages);
    if (uploadError) {
      toast("Image upload failed: " + uploadError, "error");
      setLoading(false);
      return;
    }
    const mediaUrls = [...form.mediaUrls, ...uploaded];

    const { error } = await supabase.from("submitted_events").insert({
      submitted_by: user.id,
      name: form.name,
      date: form.date,
      end_date: form.endDate || null,
      location: form.location,
      category: form.category,
      cage_required: form.cageRequired,
      tire_size: form.tireSize,
      skill_level: form.skillLevel,
      participation: form.participation,
      description: form.description,
      safety_requirements: form.safetyRequirements,
      required_equipment: form.requiredEquipment,
      accepts_media: form.acceptsMedia,
      requires_emergency_contact: form.requiresEmergencyContact,
      event_url: form.eventUrl || null,
      organizer: form.organizer,
      contact_email: form.contactEmail,
      image_url: mediaUrls[0] ?? null,
      media_urls: mediaUrls,
      lat: form.lat,
      lng: form.lng,
      track: form.track,
      country: form.country,
      series: form.series || null,
      price: form.price || null,
      max_participants: form.maxParticipants ? parseInt(form.maxParticipants) : null,
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
            {isTrusted ? (
              <>
                <h3 className="font-heading font-bold text-2xl text-foreground mb-3">Event Published!</h3>
                <p className="text-muted mb-2">As a trusted organizer, your event is live immediately.</p>
                <p className="text-sm text-muted-dark mb-6">It&apos;s now visible on the map and events pages. Manage it and review applications from <a href="/my-events" className="text-drift-orange hover:underline">My Events</a>.</p>
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-badge-grassroots/10 border border-badge-grassroots/20">
                  <span className="w-2 h-2 rounded-full bg-badge-grassroots" />
                  <span className="text-xs font-semibold text-badge-grassroots uppercase tracking-wider">Live</span>
                </div>
              </>
            ) : (
              <>
                <h3 className="font-heading font-bold text-2xl text-foreground mb-3">Event Submitted!</h3>
                <p className="text-muted mb-2">Your event is now pending review.</p>
                <p className="text-sm text-muted-dark mb-6">We typically review submissions within 24 hours. You&apos;ll receive an email confirmation once approved. Manage it anytime from <a href="/my-events" className="text-drift-orange hover:underline">My Events</a>.</p>
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-yellow-500/10 border border-yellow-500/20">
                  <span className="w-2 h-2 rounded-full bg-yellow-500 animate-pulse" />
                  <span className="text-xs font-semibold text-yellow-500 uppercase tracking-wider">Pending Review</span>
                </div>
              </>
            )}
            <button
              onClick={() => { setSubmitted(false); setFormKey((k) => k + 1); }}
              className="block mx-auto mt-6 text-sm text-drift-orange hover:underline"
            >
              Submit another event
            </button>
          </div>
        </div>
      </section>
    );
  }

  if (isBlocked) {
    return (
      <section className="relative py-20 md:py-28">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
        <div className="max-w-2xl mx-auto px-4 text-center">
          <div className="glass rounded-2xl p-12 border border-red-500/20">
            <h3 className="font-heading font-bold text-2xl text-foreground mb-3">Submissions Disabled</h3>
            <p className="text-muted">Your account is currently not allowed to submit events. If you believe this is a mistake, contact us and we&apos;ll take a look.</p>
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
          <p className="text-muted mt-3">Organizing a drift event? Submit it and manage applications directly from your dashboard — no Google Forms needed.</p>
        </div>

        {!user ? (
          <div className="glass rounded-2xl p-8 md:p-10">
            <h3 className="font-heading font-bold text-xl text-foreground mb-3">For Real Organizers</h3>
            <p className="text-sm text-muted leading-relaxed mb-4">
              Publishing on DriftSpotter is reserved for verified event organizers — that&apos;s how we keep fake and spam events off the map. Sign in, request organizer access with a few details about your events, and you&apos;ll typically be approved within 24 hours.
            </p>
            <p className="text-sm text-drift-orange">Sign in from the top right to get started.</p>
          </div>
        ) : profile?.organizer_status === "pending" ? (
          <div className="glass rounded-2xl p-10 text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-yellow-500/10 border border-yellow-500/20 mb-5">
              <span className="w-2 h-2 rounded-full bg-yellow-500 animate-pulse" />
              <span className="text-xs font-semibold text-yellow-500 uppercase tracking-wider">Request Under Review</span>
            </div>
            <h3 className="font-heading font-bold text-xl text-foreground mb-2">Hang tight, {profile.organizer_name || profile.username}</h3>
            <p className="text-sm text-muted leading-relaxed max-w-md mx-auto">
              We&apos;re reviewing your organizer request — usually done within 24 hours. You&apos;ll get a notification the moment you&apos;re approved, and this page will unlock.
            </p>
          </div>
        ) : !canSubmit ? (
          <div className="glass rounded-2xl p-6 md:p-8">
            <h3 className="font-heading font-bold text-xl text-foreground mb-2">Become an Organizer</h3>
            <p className="text-sm text-muted leading-relaxed mb-6">
              Publishing events is reserved for verified organizers — that&apos;s how we keep fake and spam events off the map. Tell us about the events you run and we&apos;ll get you approved, usually within 24 hours.
            </p>
            <OrganizerRequestForm />
          </div>
        ) : (
          <>
            <div className="mb-6 flex items-start gap-3 p-4 rounded-xl bg-drift-orange/5 border border-drift-orange/10">
              <svg className="text-drift-orange flex-shrink-0 mt-0.5" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10" /><line x1="12" y1="16" x2="12" y2="12" /><line x1="12" y1="8" x2="12.01" y2="8" /></svg>
              <p className="text-xs text-muted leading-relaxed">
                {isTrusted
                  ? "You're a trusted organizer — your events publish instantly, no review needed. You can edit them and manage driver applications from My Events."
                  : "All events are reviewed before publishing to ensure quality and legitimacy. We'll get back to you within 24 hours. Once approved, you can edit the event and manage driver applications from My Events."}
              </p>
            </div>

            <EventForm
              key={formKey}
              submitLabel="Submit for Review"
              submitting={loading}
              onSubmit={handleSubmit}
            />
          </>
        )}
      </div>
    </section>
  );
}
