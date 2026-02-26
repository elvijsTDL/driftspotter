import * as React from "react";

interface WelcomeEmailProps {
  username: string;
}

export function WelcomeEmail({ username }: WelcomeEmailProps) {
  return (
    <div style={{ fontFamily: "'Outfit', Arial, sans-serif", backgroundColor: "#0a0a0a", color: "#f5f5f5", padding: "40px 20px" }}>
      <div style={{ maxWidth: "560px", margin: "0 auto", backgroundColor: "#111111", borderRadius: "16px", overflow: "hidden", border: "1px solid #2a2a2a" }}>
        {/* Header */}
        <div style={{ background: "linear-gradient(135deg, #FF6B00 0%, #CC5500 100%)", padding: "32px 32px 24px", textAlign: "center" as const }}>
          <h1 style={{ fontSize: "24px", fontWeight: "700", color: "#ffffff", margin: "0 0 8px", letterSpacing: "2px" }}>
            DRIFT<span style={{ opacity: 0.9 }}>SPOTTER</span>
          </h1>
          <p style={{ fontSize: "14px", color: "rgba(255,255,255,0.8)", margin: 0 }}>Every Slide. Every Event. One Map.</p>
        </div>

        {/* Body */}
        <div style={{ padding: "32px" }}>
          <h2 style={{ fontSize: "20px", fontWeight: "600", color: "#f5f5f5", margin: "0 0 16px" }}>
            Welcome to DriftSpotter, {username}!
          </h2>
          <p style={{ fontSize: "14px", color: "#888888", lineHeight: "1.6", margin: "0 0 24px" }}>
            You&apos;re now part of the global drifting community. Here&apos;s what you can do:
          </p>

          <div style={{ margin: "0 0 24px" }}>
            {[
              { emoji: "🗺️", text: "Discover drift events worldwide on our interactive map" },
              { emoji: "💬", text: "Join the forum — share builds, ask questions, trade parts" },
              { emoji: "🔔", text: "Get notified when events are happening near you" },
              { emoji: "📅", text: "RSVP to events and plan your trip" },
            ].map((item, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: "12px", padding: "8px 0" }}>
                <span style={{ fontSize: "18px" }}>{item.emoji}</span>
                <span style={{ fontSize: "14px", color: "#cccccc" }}>{item.text}</span>
              </div>
            ))}
          </div>

          <a
            href="https://driftspotter.com"
            style={{
              display: "inline-block", padding: "12px 32px",
              backgroundColor: "#FF6B00", color: "#ffffff",
              fontSize: "14px", fontWeight: "600",
              borderRadius: "12px", textDecoration: "none",
            }}
          >
            Explore Events
          </a>
        </div>

        {/* Footer */}
        <div style={{ padding: "24px 32px", borderTop: "1px solid #2a2a2a", textAlign: "center" as const }}>
          <p style={{ fontSize: "12px", color: "#555555", margin: 0 }}>
            DriftSpotter — The drifting community platform
          </p>
        </div>
      </div>
    </div>
  );
}
