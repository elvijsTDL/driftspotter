import * as React from "react";
import {
  EmailShell, EmailHeadline, EmailText, EmailButton, EmailCard,
  EmailCardTitle, EmailDetail, EmailSignoff,
} from "./shell";

interface EventStatusEmailProps {
  organizerName: string;
  eventName: string;
  eventDate: string;
  approved: boolean;
  imageUrl?: string;
  eventUrl?: string;
}

export function EventStatusEmail({
  organizerName,
  eventName,
  eventDate,
  approved,
  imageUrl,
  eventUrl,
}: EventStatusEmailProps) {
  const liveUrl = eventUrl || "https://driftspotter.com/my-events";
  return (
    <EmailShell
      kicker="Event Review"
      footerNote="You received this because you submitted an event on DriftSpotter."
    >
      <EmailHeadline>{approved ? "Your event is live." : "We couldn't approve this one."}</EmailHeadline>

      <EmailText>
        {approved ? (
          <>Hey {organizerName} — your event is on the map and open for applications. Every applicant arrives with their car, photos and event history attached; manage the grid from your dashboard.</>
        ) : (
          <>Hey {organizerName} — we couldn&apos;t verify the details on this submission. Update the information and submit again from your dashboard.</>
        )}
      </EmailText>

      <EmailCard
        accent={approved ? "#22C55E" : "#555555"}
        imageUrl={imageUrl}
        imageHref={approved ? liveUrl : undefined}
        stampLabel={approved ? "Live" : "Not Approved"}
        stampColor={approved ? "#22C55E" : "#EF4444"}
        grayscaleImage={!approved}
      >
        <EmailCardTitle href={approved ? liveUrl : undefined}>{eventName}</EmailCardTitle>
        <EmailDetail label="Date">{eventDate}</EmailDetail>
      </EmailCard>

      {approved ? (
        <EmailButton href={liveUrl}>View Your Live Event</EmailButton>
      ) : (
        <EmailButton href="https://driftspotter.com/submit" variant="ghost">Submit Again</EmailButton>
      )}

      <EmailSignoff>
        {approved
          ? "Thanks for putting on an event — every driver who applies lands straight in your dashboard."
          : "Make your edits and resubmit whenever you're ready."}
      </EmailSignoff>
    </EmailShell>
  );
}
