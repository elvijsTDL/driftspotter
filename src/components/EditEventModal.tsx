"use client";

import { useState, useMemo } from "react";
import { createBrowserClient } from "@supabase/ssr";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/components/ui/Toast";
import EventForm, { type EventFormValues } from "@/components/EventForm";
import { uploadImages } from "@/lib/uploadMedia";
import type { MyEvent, MyEventUpdate } from "@/hooks/useMyEvents";
import { useDialogAccessibility } from "@/hooks/useDialogAccessibility";

export default function EditEventModal({
  event,
  onClose,
  onSave,
}: {
  event: MyEvent;
  onClose: () => void;
  onSave: (eventId: string, updates: MyEventUpdate) => Promise<{ success: boolean; error?: string }>;
}) {
  const dialogRef = useDialogAccessibility(onClose);
  const { user } = useAuth();
  const { toast } = useToast();
  const [saving, setSaving] = useState(false);
  const supabase = useMemo(() => createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL ?? "",
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? ""
  ), []);

  const initial: Partial<EventFormValues> = {
    name: event.name,
    date: event.date,
    endDate: event.end_date ?? "",
    location: event.location,
    category: event.category,
    cageRequired: event.cage_required,
    tireSize: event.tire_size,
    skillLevel: event.skill_level,
    participation: (event.participation as "drive" | "watch" | "both") || "both",
    description: event.description,
    safetyRequirements: event.safety_requirements ?? "",
    requiredEquipment: event.required_equipment ?? (event.cage_required ? ["roll_cage"] : []),
    acceptsMedia: event.accepts_media ?? false,
    requiresEmergencyContact: event.requires_emergency_contact ?? false,
    eventUrl: event.event_url ?? "",
    organizer: event.organizer,
    contactEmail: event.contact_email,
    lat: event.lat,
    lng: event.lng,
    track: event.track,
    country: event.country,
    series: event.series ?? "",
    price: event.price ?? "",
    maxParticipants: event.max_participants != null ? String(event.max_participants) : "",
    mediaUrls: event.media_urls ?? (event.image_url ? [event.image_url] : []),
  };

  const handleSubmit = async (form: EventFormValues, newImages: File[]) => {
    if (!user) return;
    setSaving(true);

    const { urls: uploaded, error: uploadError } = await uploadImages(supabase, "event-images", user.id, newImages);
    if (uploadError) {
      toast("Image upload failed: " + uploadError, "error");
      setSaving(false);
      return;
    }
    const mediaUrls = [...form.mediaUrls, ...uploaded];

    const { success, error } = await onSave(event.id, {
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

    setSaving(false);

    if (!success) {
      toast(error || "Failed to save changes", "error");
    } else {
      toast(event.status === "approved" ? "Event updated — changes are live!" : "Event updated!");
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto" onClick={onClose}>
      <div className="fixed inset-0 bg-black/70 backdrop-blur-sm" />

      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="edit-event-title"
        tabIndex={-1}
        className="relative w-[calc(100%-1rem)] max-w-2xl mx-2 my-4 sm:mx-4 sm:my-8 md:my-16 animate-fade-in-up"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 id="edit-event-title" className="font-heading font-bold text-2xl text-foreground tracking-tight">EDIT EVENT</h2>
            {event.status === "approved" && (
              <p className="text-xs text-muted mt-1">This event is live — saved changes update the public listing immediately.</p>
            )}
          </div>
          <button
            onClick={onClose}
            aria-label="Close event editor"
            className="w-10 h-10 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center hover:bg-black/70 transition-colors flex-shrink-0"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round">
              <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        <EventForm
          initial={initial}
          submitLabel="Save Changes"
          submitting={saving}
          onSubmit={handleSubmit}
        />
      </div>
    </div>
  );
}
