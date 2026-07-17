import * as React from "react";
import {
  EmailShell, EmailHeadline, EmailText, EmailButton, EmailCard,
  EmailCardTitle, EmailSignoff,
} from "./shell";

interface EventUpdateEmailProps {
  username: string;
  eventName: string;
  updateNumber: number;
  updateBody: string;
  organizerName?: string;
  imageUrl?: string;
  eventUrl: string;
}

export function EventUpdateEmail({
  username,
  eventName,
  updateNumber,
  updateBody,
  organizerName,
  imageUrl,
  eventUrl,
}: EventUpdateEmailProps) {
  return (
    <EmailShell
      kicker={`Update #${updateNumber}`}
      footerNote="You received this because you have an approved spot at this event."
    >
      <EmailHeadline>Organizer update for {eventName}.</EmailHeadline>

      <EmailText>
        Hey {username} — {organizerName || "the organizer"} posted an update for{" "}
        <a href={eventUrl} style={{ color: "#f5f5f5", fontWeight: 600, textDecoration: "none", borderBottom: "2px solid #FF6B0060" }}>{eventName}</a>:
      </EmailText>

      <EmailCard accent="#FF6B00" imageUrl={imageUrl} imageHref={eventUrl}>
        <EmailCardTitle href={eventUrl}>Update #{updateNumber}</EmailCardTitle>
        <EmailText style={{ whiteSpace: "pre-wrap" as const, margin: 0 }}>{updateBody}</EmailText>
      </EmailCard>

      <EmailButton href={eventUrl}>Open Event Page</EmailButton>

      <EmailSignoff>All updates stay pinned on the event page.</EmailSignoff>
    </EmailShell>
  );
}
