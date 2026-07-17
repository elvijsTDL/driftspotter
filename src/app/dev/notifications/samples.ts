// Catalogue of every notification DriftSpotter sends, with realistic sample
// payloads for the /dev/notifications test bench. Keep in sync with the DB
// triggers (supabase/*.sql) and the API routes that insert into `notifications`.

export interface SampleEventInfo {
  id: string;
  name: string;
  dateLabel: string;
}

export interface NotificationSample {
  id: string;
  label: string;
  /** Where this fires in the real app */
  source: string;
  type: "event" | "system";
  title: string;
  body: string;
  link: string;
}

export const FALLBACK_EVENT: SampleEventInfo = {
  id: "sample-event",
  name: "Midnight Touge Session",
  dateLabel: "Saturday, August 1, 2026",
};

export function buildSamples(ev: SampleEventInfo): NotificationSample[] {
  const shortName = ev.name.slice(0, 50);
  return [
    {
      id: "new-application",
      label: "New event application",
      source: "DB trigger on_event_application — a driver applies to your event",
      type: "event",
      title: "New event application",
      body: `Kenji Drift applied to attend "${shortName}"`,
      link: "/my-events",
    },
    {
      id: "application-approved",
      label: "Application approved",
      source: "DB trigger on_rsvp_decision — organizer approves your application",
      type: "event",
      title: "Application approved",
      body: `Your application to "${shortName}" has been approved`,
      link: "/my-applications",
    },
    {
      id: "application-rejected",
      label: "Application rejected",
      source: "DB trigger on_rsvp_decision — organizer rejects your application",
      type: "event",
      title: "Application rejected",
      body: `Your application to "${shortName}" has been rejected`,
      link: "/my-applications",
    },
    {
      id: "event-reminder",
      label: "Event reminder",
      source: "Daily cron /api/email/event-reminders (also sends push + email)",
      type: "event",
      title: "Event coming up!",
      body: `${ev.name} is on ${ev.dateLabel} — see you there`,
      link: `/events/${ev.id}`,
    },
    {
      id: "event-update",
      label: "Organizer event update",
      source: "/api/events/post-update — organizer posts an update (also sends push)",
      type: "event",
      title: `Update #2: ${ev.name}`,
      body: "Gates open 9:00 sharp — forecast says wet, bring rain tires and a spare set.",
      link: `/events/${ev.id}`,
    },
    {
      id: "media-shared",
      label: "Event media shared",
      source: "/api/events/share-link — someone shares a gallery link with participants",
      type: "event",
      title: "New event media",
      body: `"Photo gallery" was shared from ${ev.name}`,
      link: `/events/${ev.id}`,
    },
    {
      id: "organizer-approved-standard",
      label: "Organizer approved (standard)",
      source: "/api/admin/set-organizer-status — admin grants standard access",
      type: "system",
      title: "Organizer access approved!",
      body: "You can now submit events. Each one is reviewed before going live.",
      link: "/submit",
    },
    {
      id: "organizer-approved-trusted",
      label: "Organizer approved (trusted)",
      source: "/api/admin/set-organizer-status — admin grants trusted access",
      type: "system",
      title: "Organizer access approved!",
      body: "You're a trusted organizer — your events publish instantly.",
      link: "/submit",
    },
    {
      id: "organizer-declined",
      label: "Organizer request declined",
      source: "/api/admin/set-organizer-status — admin declines the request",
      type: "system",
      title: "Organizer request declined",
      body: "We couldn't verify your organizer request. You can apply again with more details about your events.",
      link: "/submit",
    },
    {
      id: "organizer-request",
      label: "New organizer request (admin)",
      source: "DB trigger on_organizer_request — notifies all admins",
      type: "system",
      title: "New organizer request",
      body: "Kenji Drift wants to become an event organizer",
      link: "/admin",
    },
  ];
}
