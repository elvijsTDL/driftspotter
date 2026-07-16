import * as React from "react";
import {
  EmailShell, EmailHeadline, EmailText, EmailButton, EmailCard,
  EmailCardTitle, EmailDetail, EmailSafetyBlock, EmailSignoff,
} from "./shell";

interface EventReminderEmailProps {
  username: string;
  eventName: string;
  eventDate: string;
  track: string;
  location: string;
  safetyRequirements?: string;
  price?: string;
  imageUrl?: string;
  eventUrl: string;
}

export function EventReminderEmail({
  username,
  eventName,
  eventDate,
  track,
  location,
  safetyRequirements,
  price,
  imageUrl,
  eventUrl,
}: EventReminderEmailProps) {
  return (
    <EmailShell
      kicker="Event Reminder"
      footerNote="You're getting this because you have an approved spot at this event and event reminders enabled."
    >
      <EmailHeadline>Race day is close.</EmailHeadline>

      <EmailText>
        Hey {username} — your confirmed event is right around the corner. Run through the checklist and load up.
      </EmailText>

      <EmailCard accent="#FF6B00" imageUrl={imageUrl} imageHref={eventUrl}>
        <EmailCardTitle href={eventUrl}>{eventName}</EmailCardTitle>
        <EmailDetail label="Date">{eventDate}</EmailDetail>
        <EmailDetail label="Location">{track ? `${track}, ` : ""}{location}</EmailDetail>
        {price && <EmailDetail label="Entry"><span style={{ color: "#FF6B00", fontWeight: 600 }}>{price}</span></EmailDetail>}
      </EmailCard>

      {safetyRequirements && <EmailSafetyBlock text={safetyRequirements} />}

      <EmailButton href={eventUrl}>View Event Details</EmailButton>

      <EmailSignoff>Drive safe, keep it sideways.</EmailSignoff>
    </EmailShell>
  );
}
