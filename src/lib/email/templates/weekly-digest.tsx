import * as React from "react";

interface DigestThread {
  title: string;
  replyCount: number;
  url: string;
}

interface DigestEvent {
  name: string;
  date: string;
  location: string;
}

interface WeeklyDigestEmailProps {
  username: string;
  threads: DigestThread[];
  upcomingEvents: DigestEvent[];
  weekStart: string;
}

export function WeeklyDigestEmail({
  username,
  threads,
  upcomingEvents,
  weekStart,
}: WeeklyDigestEmailProps) {
  return (
    <div style={{ fontFamily: "'Outfit', Arial, sans-serif", backgroundColor: "#0a0a0a", color: "#f5f5f5", padding: "40px 20px" }}>
      <div style={{ maxWidth: "560px", margin: "0 auto", backgroundColor: "#111111", borderRadius: "16px", overflow: "hidden", border: "1px solid #2a2a2a" }}>
        {/* Header */}
        <div style={{ background: "linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 100%)", padding: "32px", borderBottom: "1px solid #2a2a2a" }}>
          <h1 style={{ fontSize: "18px", fontWeight: "700", color: "#f5f5f5", margin: "0 0 4px", letterSpacing: "2px" }}>
            DRIFT<span style={{ color: "#FF6B00" }}>SPOTTER</span>
          </h1>
          <p style={{ fontSize: "14px", color: "#888888", margin: 0 }}>Weekly Digest — {weekStart}</p>
        </div>

        {/* Body */}
        <div style={{ padding: "32px" }}>
          <p style={{ fontSize: "14px", color: "#888888", lineHeight: "1.6", margin: "0 0 24px" }}>
            Hey {username}, here&apos;s what happened this week in the drift community:
          </p>

          {/* Hot threads */}
          {threads.length > 0 && (
            <>
              <h3 style={{ fontSize: "16px", fontWeight: "600", color: "#FF6B00", margin: "0 0 16px", textTransform: "uppercase" as const, letterSpacing: "1px" }}>
                Hot Threads
              </h3>
              {threads.map((thread, i) => (
                <a
                  key={i}
                  href={thread.url}
                  style={{
                    display: "block", padding: "16px",
                    backgroundColor: "#1a1a1a", borderRadius: "8px",
                    marginBottom: "8px", textDecoration: "none",
                    border: "1px solid #2a2a2a",
                  }}
                >
                  <p style={{ fontSize: "14px", fontWeight: "600", color: "#f5f5f5", margin: "0 0 4px" }}>
                    {thread.title}
                  </p>
                  <p style={{ fontSize: "12px", color: "#888888", margin: 0 }}>
                    {thread.replyCount} replies this week
                  </p>
                </a>
              ))}
              <div style={{ height: "24px" }} />
            </>
          )}

          {/* Upcoming events */}
          {upcomingEvents.length > 0 && (
            <>
              <h3 style={{ fontSize: "16px", fontWeight: "600", color: "#00D4FF", margin: "0 0 16px", textTransform: "uppercase" as const, letterSpacing: "1px" }}>
                Upcoming Events
              </h3>
              {upcomingEvents.map((event, i) => (
                <div
                  key={i}
                  style={{
                    padding: "16px",
                    backgroundColor: "#1a1a1a", borderRadius: "8px",
                    marginBottom: "8px", border: "1px solid #2a2a2a",
                  }}
                >
                  <p style={{ fontSize: "14px", fontWeight: "600", color: "#f5f5f5", margin: "0 0 4px" }}>
                    {event.name}
                  </p>
                  <p style={{ fontSize: "12px", color: "#888888", margin: 0 }}>
                    {event.date} — {event.location}
                  </p>
                </div>
              ))}
            </>
          )}

          <div style={{ height: "24px" }} />
          <a
            href="https://driftspotter.com/forum"
            style={{
              display: "inline-block", padding: "12px 32px",
              backgroundColor: "#FF6B00", color: "#ffffff",
              fontSize: "14px", fontWeight: "600",
              borderRadius: "12px", textDecoration: "none",
            }}
          >
            Visit Forum
          </a>
        </div>

        {/* Footer */}
        <div style={{ padding: "24px 32px", borderTop: "1px solid #2a2a2a", textAlign: "center" as const }}>
          <p style={{ fontSize: "12px", color: "#555555", margin: 0 }}>
            You received this weekly digest because you opted in. <a href="https://driftspotter.com" style={{ color: "#FF6B00" }}>Unsubscribe</a>
          </p>
        </div>
      </div>
    </div>
  );
}
