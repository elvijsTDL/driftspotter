import * as React from "react";

/**
 * Shared DriftSpotter email shell + building blocks.
 *
 * All transactional emails render through <EmailShell>, so the brand
 * lives in one place. The `brand` prop is the future hook for paid
 * per-organizer personalization (logo, accent color, footer line).
 *
 * Email-client constraints honored here: inline styles only, no web
 * fonts (font stacks with wide fallbacks), table-free layout that
 * degrades gracefully in Outlook. The header logo mark is an inline SVG —
 * it renders in the preview, Apple Mail and iOS; Gmail/Outlook drop it and
 * fall back to the wordmark alone.
 */

export interface EmailBrand {
  accent: string;
  accentLight: string;
  name: React.ReactNode;
  tagline: string;
}

export const DRIFTSPOTTER_BRAND: EmailBrand = {
  accent: "#FF6B00",
  accentLight: "#FF8C33",
  name: (
    <>
      DRIFT<span style={{ color: "#FF6B00" }}>SPOTTER</span>
    </>
  ),
  tagline: "EVERY SLIDE. EVERY EVENT. ONE MAP.",
};

// Gmail never loads web fonts (falls back to the stack); Apple Mail and
// iOS Mail load them via the @import in <EmailShell>'s <style> block.
const headingFont = "'Chakra Petch', 'Segoe UI', Arial, 'Helvetica Neue', sans-serif";
const bodyFont = "'Outfit', 'Segoe UI', 'Helvetica Neue', Helvetica, Arial, sans-serif";

export function EmailShell({
  kicker,
  children,
  footerNote,
  brand = DRIFTSPOTTER_BRAND,
}: {
  /** Context line under the logo, e.g. "You're in! 🤘" */
  kicker: string;
  children: React.ReactNode;
  /** "You received this because..." line */
  footerNote: string;
  brand?: EmailBrand;
}) {
  return (
    <html>
      {/* eslint-disable-next-line @next/next/no-head-element */}
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        {/* Real brand fonts for clients that allow them (Apple Mail, iOS, some Outlook) — Gmail falls back to the inline stacks */}
        <style
          dangerouslySetInnerHTML={{
            __html: `@import url('https://fonts.googleapis.com/css2?family=Chakra+Petch:wght@600;700&family=Outfit:wght@400;500;600&display=swap');`,
          }}
        />
      </head>
      <body style={{ margin: 0, padding: 0, backgroundColor: "#0a0a0a" }}>
    <div style={{ fontFamily: bodyFont, backgroundColor: "#0a0a0a", color: "#f5f5f5", padding: "40px 16px", margin: 0 }}>
      <div style={{ maxWidth: "560px", margin: "0 auto", backgroundColor: "#111111", borderRadius: "16px", overflow: "hidden", border: "1px solid #2a2a2a" }}>
        {/* Racing stripe */}
        <div style={{ height: "4px", background: `linear-gradient(90deg, ${brand.accent} 0%, ${brand.accentLight} 60%, #00D4FF 100%)`, backgroundColor: brand.accent }} />

        {/* Header */}
        <div style={{ background: "linear-gradient(135deg, #0a0a0a 0%, #191919 100%)", backgroundColor: "#0d0d0d", padding: "30px 32px 26px", borderBottom: "1px solid #2a2a2a" }}>
          <a href="https://driftspotter.com" style={{ textDecoration: "none", display: "inline-block" }}>
            <span style={{ display: "inline-block", verticalAlign: "middle", marginRight: "10px", lineHeight: 0 }}>
              {/* DriftSpotter hexagon mark — matches the site navbar */}
              <svg width="28" height="28" viewBox="0 0 36 36" fill="none" style={{ display: "block" }}>
                <path d="M18 2L32 10V26L18 34L4 26V10L18 2Z" stroke={brand.accent} strokeWidth="2" fill="none" />
                <path d="M10 18C10 18 14 12 18 12C22 12 22 18 26 18C26 18 22 24 18 24C14 24 14 18 10 18Z" fill={brand.accent} opacity="0.8" />
                <circle cx="18" cy="18" r="2" fill="#0a0a0a" />
              </svg>
            </span>
            <span style={{ display: "inline-block", verticalAlign: "middle", fontFamily: headingFont, fontSize: "21px", fontWeight: 700, color: "#f5f5f5", letterSpacing: "1px" }}>
              {brand.name}
            </span>
          </a>
          <p style={{ fontFamily: headingFont, fontSize: "12px", fontWeight: 600, color: "#888888", margin: "12px 0 0", letterSpacing: "2px", textTransform: "uppercase" as const }}>
            {kicker}
          </p>
        </div>

        {/* Body */}
        <div style={{ padding: "32px" }}>{children}</div>

        {/* Footer */}
        <div style={{ padding: "22px 32px 26px", borderTop: "1px solid #2a2a2a", textAlign: "center" as const, backgroundColor: "#0d0d0d" }}>
          <p style={{ fontFamily: headingFont, fontSize: "10px", fontWeight: 600, color: "#555555", letterSpacing: "2px", margin: "0 0 8px" }}>
            {brand.tagline}
          </p>
          <p style={{ fontSize: "12px", color: "#555555", margin: 0, lineHeight: 1.5 }}>{footerNote}</p>
        </div>
      </div>
    </div>
      </body>
    </html>
  );
}

/** Big display heading at the top of the email body. */
export function EmailHeadline({ children }: { children: React.ReactNode }) {
  return (
    <p style={{ fontFamily: headingFont, fontSize: "26px", fontWeight: 700, color: "#f5f5f5", margin: "0 0 16px", lineHeight: 1.25, letterSpacing: "0.5px", textTransform: "uppercase" as const }}>
      {children}
    </p>
  );
}

export function EmailText({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) {
  return (
    <p style={{ fontSize: "14px", color: "#999999", lineHeight: 1.65, margin: "0 0 20px", ...style }}>
      {children}
    </p>
  );
}

export function EmailButton({
  href,
  children,
  variant = "primary",
}: {
  href: string;
  children: React.ReactNode;
  variant?: "primary" | "ghost";
}) {
  const base: React.CSSProperties = {
    display: "block",
    padding: "14px 34px",
    fontFamily: headingFont,
    fontSize: "14px",
    fontWeight: 600,
    borderRadius: "12px",
    textDecoration: "none",
    letterSpacing: "1px",
    textAlign: "center" as const,
    textTransform: "uppercase" as const,
  };
  const styles: React.CSSProperties =
    variant === "primary"
      ? { ...base, backgroundColor: "#FF6B00", color: "#ffffff" }
      : { ...base, backgroundColor: "#1a1a1a", color: "#f5f5f5", border: "1px solid #333333" };
  return (
    <a href={href} style={styles}>
      {children}
    </a>
  );
}

/**
 * Dark info card with a racing accent edge — event summaries, link previews.
 * Pass `imageUrl` to give the card a full-bleed cover photo (the event image);
 * `imageHref` makes that photo clickable. `stampLabel`/`stampColor` slap a
 * rotated rubber-stamp over the photo (APPROVED on your car, etc.), and
 * `grayscaleImage` desaturates the photo (used for declines).
 */
export function EmailCard({
  children,
  accent = "#FF6B00",
  imageUrl,
  imageHref,
  stampLabel,
  stampColor,
  grayscaleImage,
}: {
  children: React.ReactNode;
  accent?: string;
  imageUrl?: string;
  imageHref?: string;
  stampLabel?: string;
  stampColor?: string;
  grayscaleImage?: boolean;
}) {
  if (imageUrl) {
    const cover = (
      <img
        src={imageUrl}
        alt=""
        width="100%"
        style={{
          display: "block",
          width: "100%",
          height: "190px",
          objectFit: "cover",
          border: 0,
          borderTopLeftRadius: "9px",
          borderTopRightRadius: "11px",
          backgroundColor: "#0a0a0a",
          ...(grayscaleImage ? { filter: "grayscale(100%) contrast(0.95) brightness(0.9)" } : {}),
        }}
      />
    );
    return (
      <div style={{ backgroundColor: "#1a1a1a", borderRadius: "12px", border: "1px solid #2a2a2a", boxShadow: "0 10px 30px rgba(0,0,0,0.5)", marginBottom: "26px" }}>
        <div style={{ position: "relative" as const, lineHeight: 0 }}>
          {imageHref ? (
            <a href={imageHref} style={{ display: "block", textDecoration: "none" }}>{cover}</a>
          ) : (
            cover
          )}
          {stampLabel && (
            <div style={{ position: "absolute" as const, top: "-20px", right: "14px" }}>
              <span
                style={{
                  display: "inline-block",
                  transform: "rotate(9deg)",
                  border: `4px solid ${stampColor ?? accent}`,
                  boxShadow: `inset 0 0 0 3px ${stampColor ?? accent}55, 0 6px 16px rgba(0,0,0,0.55)`,
                  color: stampColor ?? accent,
                  backgroundColor: "rgba(10,10,10,0.62)",
                  fontFamily: headingFont,
                  fontSize: "27px",
                  fontWeight: 700,
                  letterSpacing: "4px",
                  lineHeight: 1,
                  textTransform: "uppercase" as const,
                  padding: "12px 14px 11px 20px",
                  borderRadius: "10px",
                  textShadow: "0 1px 4px rgba(0,0,0,0.7)",
                }}
              >
                {stampLabel}
              </span>
            </div>
          )}
        </div>
        <div style={{ height: "3px", backgroundColor: accent }} />
        <div style={{ padding: "20px 22px" }}>{children}</div>
      </div>
    );
  }
  return (
    <div style={{ padding: "20px 22px", backgroundColor: "#1a1a1a", borderRadius: "12px", border: "1px solid #2a2a2a", boxShadow: "0 10px 30px rgba(0,0,0,0.5)", marginBottom: "26px" }}>
      {children}
    </div>
  );
}

/** Card title — pass `href` to make the event name itself the link. */
export function EmailCardTitle({ children, href }: { children: React.ReactNode; href?: string }) {
  const style: React.CSSProperties = {
    fontFamily: headingFont,
    fontSize: "17px",
    fontWeight: 600,
    color: "#f5f5f5",
    margin: "0 0 12px",
    textDecoration: "none",
  };
  if (href) {
    return (
      <p style={{ margin: "0 0 12px" }}>
        <a href={href} style={{ ...style, margin: 0, borderBottom: "2px solid #FF6B0060" }}>
          {children}
        </a>
      </p>
    );
  }
  return <p style={style}>{children}</p>;
}

export function EmailMeta({ children }: { children: React.ReactNode }) {
  return <p style={{ fontSize: "13px", color: "#888888", margin: "0 0 5px", lineHeight: 1.5 }}>{children}</p>;
}

/** Labeled detail row — "DATE  Saturday, August 15" — no icons, no emoji. */
export function EmailDetail({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <p style={{ fontSize: "13px", margin: "0 0 6px", lineHeight: 1.5 }}>
      <span style={{ fontFamily: headingFont, fontSize: "10px", fontWeight: 700, color: "#666666", letterSpacing: "1.5px", textTransform: "uppercase" as const, display: "inline-block", width: "76px" }}>
        {label}
      </span>
      <span style={{ color: "#cccccc" }}>{children}</span>
    </p>
  );
}

/** Status pill, e.g. APPROVED / LIVE / DECLINED. */
export function EmailBadge({ color, children }: { color: string; children: React.ReactNode }) {
  return (
    <span
      style={{
        display: "inline-block",
        padding: "5px 14px",
        borderRadius: "999px",
        fontFamily: headingFont,
        fontSize: "11px",
        fontWeight: 700,
        letterSpacing: "1.5px",
        textTransform: "uppercase" as const,
        color,
        backgroundColor: `${color}1A`,
        border: `1px solid ${color}40`,
        marginBottom: "18px",
      }}
    >
      {children}
    </span>
  );
}

/** Personable closing line — sits under the CTA, above the footer. */
export function EmailSignoff({ children }: { children: React.ReactNode }) {
  return (
    <p style={{ fontSize: "13px", color: "#777777", lineHeight: 1.6, margin: "22px 0 0" }}>
      {children}
      <br />
      <span style={{ fontFamily: headingFont, color: "#999999", letterSpacing: "0.5px" }}>— The DriftSpotter crew</span>
    </p>
  );
}

/** Yellow safety checklist block. */
export function EmailSafetyBlock({ text }: { text: string }) {
  return (
    <div style={{ padding: "16px 18px", backgroundColor: "#1a1710", borderRadius: "12px", border: "1px solid #4a4212", marginBottom: "22px" }}>
      <p style={{ fontFamily: headingFont, fontSize: "11px", fontWeight: 700, color: "#EAB308", margin: "0 0 8px", textTransform: "uppercase" as const, letterSpacing: "1.5px" }}>
        Safety Checklist
      </p>
      <p style={{ fontSize: "13px", color: "#999999", lineHeight: 1.65, margin: 0, whiteSpace: "pre-line" as const }}>{text}</p>
    </div>
  );
}
