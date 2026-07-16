import * as React from "react";
import {
  EmailShell, EmailHeadline, EmailText, EmailButton, EmailCard,
  EmailCardTitle, EmailDetail, EmailSafetyBlock, EmailSignoff,
} from "./shell";

interface ApplicationDecisionEmailProps {
  driverName: string;
  eventName: string;
  eventDate: string;
  location: string;
  approved: boolean;
  safetyRequirements?: string;
  imageUrl?: string;
  eventUrl: string;
}

export function ApplicationDecisionEmail({
  driverName,
  eventName,
  eventDate,
  location,
  approved,
  safetyRequirements,
  imageUrl,
  eventUrl,
}: ApplicationDecisionEmailProps) {
  return (
    <EmailShell
      kicker="Application Decision"
      footerNote="You received this because you applied to an event on DriftSpotter."
    >
      <EmailHeadline>{approved ? "You're in." : "Not this time."}</EmailHeadline>

      <EmailText>
        {approved ? (
          <>Hey {driverName} — your spot at the event below is confirmed. Time to check the car over.</>
        ) : (
          <>Hey {driverName} — your application wasn&apos;t accepted this time. Spots are limited; keep your driver card sharp and catch the next one.</>
        )}
      </EmailText>

      <EmailCard
        accent={approved ? "#22C55E" : "#555555"}
        imageUrl={imageUrl}
        imageHref={eventUrl}
        stampLabel={approved ? "Approved" : "Declined"}
        stampColor={approved ? "#22C55E" : "#EF4444"}
        grayscaleImage={!approved}
      >
        <EmailCardTitle href={eventUrl}>{eventName}</EmailCardTitle>
        <EmailDetail label="Date">{eventDate}</EmailDetail>
        <EmailDetail label="Location">{location}</EmailDetail>
      </EmailCard>

      {approved && safetyRequirements && <EmailSafetyBlock text={safetyRequirements} />}

      <EmailButton href={approved ? eventUrl : "https://driftspotter.com/events"}>
        {approved ? "View Event Details" : "Find More Events"}
      </EmailButton>

      <EmailSignoff>
        {approved
          ? "Everything you need is on the event page. See you in the pits."
          : "Plenty more slides on the map — we'd love to see you at the next one."}
      </EmailSignoff>
    </EmailShell>
  );
}
