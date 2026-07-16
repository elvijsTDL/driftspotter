"use client";

import { useEffect, useState } from "react";
import EmailPreviewClient, { type RenderedPreview } from "./EmailPreviewClient";

/**
 * Dev-only live email gallery. Renders every transactional email with real
 * event data (falls back to a sample) so you can eyeball copy, layout and the
 * cover images without sending anything. Edits to the templates hot-reload here.
 * The HTML is rendered by the co-located Route Handler (`./previews`).
 */
export default function EmailPreviewPage() {
  const [data, setData] = useState<{ eventLabel: string; previews: RenderedPreview[] } | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/dev/emails/previews")
      .then((r) => {
        if (r.status === 404) throw new Error("Email previews aren't available here.");
        if (!r.ok) throw new Error(`Failed to load previews (${r.status})`);
        return r.json();
      })
      .then(setData)
      .catch((e) => setError(String(e.message ?? e)));
  }, []);

  const center: React.CSSProperties = {
    minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center",
    background: "#0a0a0a", color: "#888", fontFamily: "ui-sans-serif, system-ui, sans-serif", fontSize: 14,
  };

  if (error) return <div style={center}>{error}</div>;
  if (!data) return <div style={center}>Loading previews…</div>;
  return <EmailPreviewClient previews={data.previews} eventLabel={data.eventLabel} />;
}
