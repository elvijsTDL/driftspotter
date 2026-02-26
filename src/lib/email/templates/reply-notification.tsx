import * as React from "react";

interface ReplyNotificationEmailProps {
  recipientName: string;
  replierName: string;
  threadTitle: string;
  replyPreview: string;
  threadUrl: string;
}

export function ReplyNotificationEmail({
  recipientName,
  replierName,
  threadTitle,
  replyPreview,
  threadUrl,
}: ReplyNotificationEmailProps) {
  return (
    <div style={{ fontFamily: "'Outfit', Arial, sans-serif", backgroundColor: "#0a0a0a", color: "#f5f5f5", padding: "40px 20px" }}>
      <div style={{ maxWidth: "560px", margin: "0 auto", backgroundColor: "#111111", borderRadius: "16px", overflow: "hidden", border: "1px solid #2a2a2a" }}>
        {/* Header */}
        <div style={{ padding: "24px 32px", borderBottom: "1px solid #2a2a2a" }}>
          <h1 style={{ fontSize: "18px", fontWeight: "700", color: "#f5f5f5", margin: 0, letterSpacing: "2px" }}>
            DRIFT<span style={{ color: "#FF6B00" }}>SPOTTER</span>
          </h1>
        </div>

        {/* Body */}
        <div style={{ padding: "32px" }}>
          <h2 style={{ fontSize: "18px", fontWeight: "600", color: "#f5f5f5", margin: "0 0 8px" }}>
            New reply to your thread
          </h2>
          <p style={{ fontSize: "14px", color: "#888888", lineHeight: "1.6", margin: "0 0 24px" }}>
            Hey {recipientName}, <strong style={{ color: "#FF6B00" }}>{replierName}</strong> replied to your thread:
          </p>

          {/* Thread card */}
          <div style={{ backgroundColor: "#1a1a1a", borderRadius: "12px", padding: "20px", marginBottom: "24px", border: "1px solid #2a2a2a" }}>
            <p style={{ fontSize: "16px", fontWeight: "600", color: "#f5f5f5", margin: "0 0 12px" }}>
              {threadTitle}
            </p>
            <div style={{ borderLeft: "3px solid #FF6B00", paddingLeft: "16px" }}>
              <p style={{ fontSize: "14px", color: "#cccccc", lineHeight: "1.6", margin: 0, fontStyle: "italic" }}>
                &quot;{replyPreview}&quot;
              </p>
            </div>
          </div>

          <a
            href={threadUrl}
            style={{
              display: "inline-block", padding: "12px 32px",
              backgroundColor: "#FF6B00", color: "#ffffff",
              fontSize: "14px", fontWeight: "600",
              borderRadius: "12px", textDecoration: "none",
            }}
          >
            View Thread
          </a>
        </div>

        {/* Footer */}
        <div style={{ padding: "24px 32px", borderTop: "1px solid #2a2a2a", textAlign: "center" as const }}>
          <p style={{ fontSize: "12px", color: "#555555", margin: 0 }}>
            You received this because you have reply notifications enabled. <a href="https://driftspotter.com" style={{ color: "#FF6B00" }}>Manage preferences</a>
          </p>
        </div>
      </div>
    </div>
  );
}
