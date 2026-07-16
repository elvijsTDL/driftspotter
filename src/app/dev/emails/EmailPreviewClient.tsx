"use client";

import { useState } from "react";

export interface RenderedPreview {
  id: string;
  label: string;
  subject: string;
  html: string;
}

/**
 * Dark, iframe-isolated email gallery. Each email renders inside its own
 * <iframe srcDoc> so its <html>/<body>/background don't leak into the page,
 * and edits to the templates hot-reload straight into this view.
 */
export default function EmailPreviewClient({
  previews,
  eventLabel,
}: {
  previews: RenderedPreview[];
  eventLabel: string;
}) {
  const [selectedId, setSelectedId] = useState(previews[0]?.id);
  const [width, setWidth] = useState<"desktop" | "mobile">("desktop");

  const active = previews.find((p) => p.id === selectedId) ?? previews[0];
  const frameWidth = width === "desktop" ? 680 : 390;

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#0a0a0a", color: "#f5f5f5", fontFamily: "ui-sans-serif, system-ui, sans-serif" }}>
      {/* Sidebar */}
      <aside style={{ width: 260, flexShrink: 0, borderRight: "1px solid #222", padding: "20px 14px", position: "sticky", top: 0, alignSelf: "flex-start", height: "100vh", overflowY: "auto" }}>
        <p style={{ fontSize: 11, letterSpacing: 2, textTransform: "uppercase", color: "#FF6B00", fontWeight: 700, margin: "0 0 4px" }}>
          Email previews
        </p>
        <p style={{ fontSize: 12, color: "#666", margin: "0 0 18px" }}>
          Sample event: {eventLabel}
        </p>
        <nav style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          {previews.map((p) => {
            const on = p.id === active?.id;
            return (
              <button
                key={p.id}
                onClick={() => setSelectedId(p.id)}
                style={{
                  textAlign: "left",
                  padding: "10px 12px",
                  borderRadius: 8,
                  border: `1px solid ${on ? "#FF6B00" : "#242424"}`,
                  background: on ? "#1c1206" : "#141414",
                  color: on ? "#fff" : "#bbb",
                  cursor: "pointer",
                  fontSize: 13,
                  fontWeight: on ? 600 : 400,
                }}
              >
                {p.label}
              </button>
            );
          })}
        </nav>
      </aside>

      {/* Preview pane */}
      <main style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", padding: "20px 24px 60px" }}>
        <div style={{ width: "100%", maxWidth: 760, display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16, gap: 16 }}>
          <div style={{ minWidth: 0 }}>
            <p style={{ fontSize: 11, color: "#666", margin: "0 0 2px", textTransform: "uppercase", letterSpacing: 1 }}>Subject</p>
            <p style={{ fontSize: 15, fontWeight: 600, margin: 0, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
              {active?.subject}
            </p>
          </div>
          <div style={{ display: "flex", gap: 4, background: "#141414", border: "1px solid #242424", borderRadius: 8, padding: 3, flexShrink: 0 }}>
            {(["desktop", "mobile"] as const).map((m) => (
              <button
                key={m}
                onClick={() => setWidth(m)}
                style={{
                  padding: "6px 14px",
                  borderRadius: 6,
                  border: "none",
                  cursor: "pointer",
                  fontSize: 12,
                  textTransform: "capitalize",
                  fontWeight: width === m ? 600 : 400,
                  background: width === m ? "#FF6B00" : "transparent",
                  color: width === m ? "#fff" : "#999",
                }}
              >
                {m}
              </button>
            ))}
          </div>
        </div>

        {active && (
          <iframe
            key={active.id + width}
            title={active.label}
            srcDoc={active.html}
            style={{
              width: frameWidth,
              maxWidth: "100%",
              height: "80vh",
              border: "1px solid #242424",
              borderRadius: 12,
              background: "#0a0a0a",
            }}
          />
        )}
      </main>
    </div>
  );
}
