import * as React from "react";
import { ApplicationDecisionEmail } from "./templates/application-decision";
import { EventStatusEmail } from "./templates/event-status";
import { EventReminderEmail } from "./templates/event-reminder";
import { MediaSharedEmail } from "./templates/media-shared";

/**
 * Shared sample data + preview catalogue for every transactional email.
 *
 * Both the live preview page (`/dev/emails`) and the "send me one of each"
 * script (`scripts/send-email-previews.tsx`) build their emails from here, so
 * what you preview in the browser is exactly what lands in an inbox.
 */

export interface SampleEvent {
  id: string;
  name: string;
  date: string; // ISO date
  track: string;
  location: string;
  price: string | null;
  imageUrl?: string;
}

/** Realistic stand-in used when we can't pull a real event from the database. */
export const SAMPLE_EVENT: SampleEvent = {
  id: "sample-event",
  name: "Baltic Night Slide",
  date: "2026-08-15",
  track: "Bikernieki Ring",
  location: "Riga, Latvia",
  price: "€45",
  imageUrl:
    "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=1200&q=80&auto=format&fit=crop",
};

export interface EmailPreview {
  /** URL-safe id for anchors / sidebar keys. */
  id: string;
  /** Human label shown in the preview sidebar. */
  label: string;
  /** Subject line (also used by the send script). */
  subject: string;
  element: React.ReactElement;
}

const SAFETY =
  "Helmet mandatory (SNELL rated)\nFire extinguisher within reach\nBattery tie-down\nTow hooks front & rear\nLong sleeves on track";

/**
 * @param baseUrl origin for event links. Defaults to production; the live
 * preview page passes the current request origin so links are clickable
 * against the local dev server.
 */
export function buildPreviews(ev: SampleEvent, baseUrl = "https://driftspotter.com"): EmailPreview[] {
  const eventUrl = `${baseUrl}/events/${ev.id}`;
  const eventDate = new Date(ev.date).toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });
  const location = ev.track ? `${ev.track}, ${ev.location}` : ev.location;

  return [
    {
      id: "application-approved",
      label: "Application · Approved",
      subject: `You're in: ${ev.name}`,
      element: (
        <ApplicationDecisionEmail
          driverName="Kristaps"
          eventName={ev.name}
          eventDate={eventDate}
          location={location}
          approved
          safetyRequirements={SAFETY}
          imageUrl={ev.imageUrl}
          eventUrl={eventUrl}
        />
      ),
    },
    {
      id: "application-declined",
      label: "Application · Declined",
      subject: `Application update: ${ev.name}`,
      element: (
        <ApplicationDecisionEmail
          driverName="Kristaps"
          eventName={ev.name}
          eventDate={eventDate}
          location={location}
          approved={false}
          imageUrl={ev.imageUrl}
          eventUrl={eventUrl}
        />
      ),
    },
    {
      id: "event-live",
      label: "Event · Approved (live)",
      subject: `Your event "${ev.name}" is live`,
      element: (
        <EventStatusEmail
          organizerName="Team Baltic Slide"
          eventName={ev.name}
          eventDate={eventDate}
          approved
          imageUrl={ev.imageUrl}
          eventUrl={eventUrl}
        />
      ),
    },
    {
      id: "event-rejected",
      label: "Event · Not approved",
      subject: `Update on your event "${ev.name}"`,
      element: (
        <EventStatusEmail
          organizerName="Team Baltic Slide"
          eventName={ev.name}
          eventDate={eventDate}
          approved={false}
          imageUrl={ev.imageUrl}
          eventUrl={eventUrl}
        />
      ),
    },
    {
      id: "event-reminder",
      label: "Event reminder",
      subject: `Reminder: ${ev.name}`,
      element: (
        <EventReminderEmail
          username="Kristaps"
          eventName={ev.name}
          eventDate={eventDate}
          track={ev.track}
          location={ev.location}
          safetyRequirements={"Helmet mandatory\nFire extinguisher within reach\nBattery tie-down"}
          price={ev.price ?? "€45"}
          imageUrl={ev.imageUrl}
          eventUrl={eventUrl}
        />
      ),
    },
    {
      id: "media-shared",
      label: "Media shared",
      subject: `New media from ${ev.name}`,
      element: (
        <MediaSharedEmail
          username="Kristaps"
          eventName={ev.name}
          linkLabel="Full photo gallery by @slideframe"
          linkUrl="https://drive.google.com/drive/folders/example"
          imageUrl={ev.imageUrl}
          eventUrl={eventUrl}
        />
      ),
    },
  ];
}
