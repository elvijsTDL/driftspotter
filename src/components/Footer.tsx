"use client";

import { useState } from "react";
import Link from "next/link";

const footerLinks = {
  Platform: [
    { label: "Events Map", href: "/map" },
    { label: "Submit Event", href: "/submit" },
    { label: "Calendar", href: "/map" },
    { label: "Featured Events", href: "/events" },
  ],
  Community: [
    { label: "Forum", href: "/forum" },
    { label: "Driver Profiles", href: "#" },
    { label: "Car Builds", href: "/forum" },
    { label: "Marketplace", href: "/forum" },
  ],
  Legal: [
    { label: "Privacy Policy", href: "#" },
    { label: "Terms of Service", href: "#" },
    { label: "Cookie Policy", href: "#" },
    { label: "Contact Us", href: "#" },
  ],
};

export default function Footer() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  return (
    <footer className="relative bg-surface border-t border-border">
      {/* Top gradient line */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-drift-orange/50 to-transparent" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <svg width="28" height="28" viewBox="0 0 36 36" fill="none">
                <path d="M18 2L32 10V26L18 34L4 26V10L18 2Z" stroke="#FF6B00" strokeWidth="2" fill="none" />
                <path d="M10 18C10 18 14 12 18 12C22 12 22 18 26 18C26 18 22 24 18 24C14 24 14 18 10 18Z" fill="#FF6B00" opacity="0.8" />
                <circle cx="18" cy="18" r="2" fill="#0a0a0a" />
              </svg>
              <span className="font-heading font-bold text-lg">DRIFT<span className="text-drift-orange">SPOTTER</span></span>
            </Link>
            <p className="text-sm text-muted leading-relaxed mb-6 max-w-xs">
              The ultimate community for drifting enthusiasts. Find events, connect with drivers, and never miss a session.
            </p>

            {/* Newsletter */}
            <div className="mb-6">
              <p className="font-heading font-semibold text-sm text-foreground mb-3">Never miss a slide</p>
              {subscribed ? (
                <p className="text-sm text-badge-grassroots">You&apos;re in! Check your inbox.</p>
              ) : (
                <form
                  onSubmit={(e) => { e.preventDefault(); setSubscribed(true); }}
                  className="flex gap-2"
                >
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your@email.com"
                    className="flex-1 px-4 py-2.5 bg-surface-lighter border border-border rounded-xl text-sm text-foreground placeholder:text-muted-dark focus:outline-none focus:border-drift-orange transition-colors"
                  />
                  <button
                    type="submit"
                    className="px-5 py-2.5 bg-drift-orange hover:bg-drift-orange-light text-white font-semibold text-sm rounded-xl transition-colors active:scale-95"
                  >
                    Subscribe
                  </button>
                </form>
              )}
            </div>

            {/* Social icons */}
            <div className="flex gap-3">
              {[
                { label: "Instagram", path: "M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" },
                { label: "YouTube", path: "M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" },
                { label: "Twitter", path: "M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" },
                { label: "TikTok", path: "M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z" },
              ].map((social) => (
                <a
                  key={social.label}
                  href="#"
                  className="w-10 h-10 rounded-xl bg-surface-lighter hover:bg-drift-orange/10 hover:border-drift-orange/30 border border-transparent flex items-center justify-center transition-all group"
                  aria-label={social.label}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" className="text-muted group-hover:text-drift-orange transition-colors">
                    <path d={social.path} />
                  </svg>
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([heading, links]) => (
            <div key={heading}>
              <h4 className="font-heading font-semibold text-sm text-foreground uppercase tracking-wider mb-4">{heading}</h4>
              <ul className="space-y-2.5">
                {links.map((link) => (
                  <li key={link.label}>
                    {link.href.startsWith("/") ? (
                      <Link href={link.href} className="text-sm text-muted hover:text-drift-orange transition-colors">
                        {link.label}
                      </Link>
                    ) : (
                      <a href={link.href} className="text-sm text-muted hover:text-drift-orange transition-colors">
                        {link.label}
                      </a>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Sponsors placeholder */}
        <div className="mt-12 pt-8 border-t border-border">
          <p className="text-xs text-muted-dark uppercase tracking-wider text-center mb-4">Partners & Sponsors</p>
          <div className="flex items-center justify-center gap-8 flex-wrap">
            {["Sponsor 1", "Sponsor 2", "Sponsor 3", "Sponsor 4"].map((s) => (
              <div key={s} className="w-24 h-10 rounded-lg bg-surface-lighter/50 flex items-center justify-center text-[10px] text-muted-dark">
                {s}
              </div>
            ))}
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-8 pt-6 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-muted-dark">&copy; 2026 DriftSpotter. All rights reserved.</p>
          <p className="text-xs text-muted-dark">Built with passion for the drift community</p>
        </div>
      </div>
    </footer>
  );
}
