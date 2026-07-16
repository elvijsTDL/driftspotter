import * as React from "react";
import {
  EmailShell, EmailHeadline, EmailText, EmailButton, EmailCard,
  EmailCardTitle, EmailDetail, EmailSignoff,
} from "./shell";

interface MediaSharedEmailProps {
  username: string;
  eventName: string;
  linkLabel: string;
  linkUrl: string;
  imageUrl?: string;
  eventUrl: string;
}

export function MediaSharedEmail({
  username,
  eventName,
  linkLabel,
  linkUrl,
  imageUrl,
  eventUrl,
}: MediaSharedEmailProps) {
  return (
    <EmailShell
      kicker="Event Media"
      footerNote="You received this because you were an approved participant at this event."
    >
      <EmailHeadline>Fresh media just dropped.</EmailHeadline>

      <EmailText>
        Hey {username} — new photos or videos from <a href={eventUrl} style={{ color: "#f5f5f5", fontWeight: 600, textDecoration: "none", borderBottom: "2px solid #FF6B0060" }}>{eventName}</a> are up:
      </EmailText>

      <EmailCard accent="#00D4FF" imageUrl={imageUrl} imageHref={linkUrl}>
        <EmailCardTitle href={linkUrl}>{linkLabel}</EmailCardTitle>
        <EmailDetail label="Link">
          <a href={linkUrl} style={{ color: "#00D4FF", textDecoration: "none", wordBreak: "break-all" as const }}>{linkUrl}</a>
        </EmailDetail>
      </EmailCard>

      <EmailButton href={eventUrl}>See All Event Media</EmailButton>

      <EmailSignoff>Got shots of your own? Add them to the event gallery.</EmailSignoff>
    </EmailShell>
  );
}
