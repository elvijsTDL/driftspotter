"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import NotificationBell from "@/components/NotificationBell";
import type { User } from "@supabase/supabase-js";
import type { Database } from "@/lib/supabase/database.types";

type Profile = Database["public"]["Tables"]["profiles"]["Row"];

const navLinks = [
  { label: "Home", href: "/" },
  { label: "Events", href: "/events" },
  { label: "Map", href: "/map" },
  { label: "Forum", href: "/forum" },
  { label: "Submit Event", href: "/submit" },
];

export default function Navbar({
  user,
  profile,
  onLoginClick,
}: {
  user: User | null;
  profile: Profile | null;
  onLoginClick: () => void;
}) {
  const { signOut } = useAuth();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const avatarLetter = profile?.username?.[0]?.toUpperCase() || user?.email?.[0]?.toUpperCase() || "?";
  const displayName = profile?.username || user?.email?.split("@")[0] || "User";
  const avatarUrl = profile?.avatar_url || user?.user_metadata?.avatar_url;

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? "glass shadow-lg shadow-black/30"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="relative">
              <svg width="36" height="36" viewBox="0 0 36 36" fill="none" className="transition-transform group-hover:rotate-12 duration-300">
                <path d="M18 2L32 10V26L18 34L4 26V10L18 2Z" stroke="#FF6B00" strokeWidth="2" fill="none" />
                <path d="M10 18C10 18 14 12 18 12C22 12 22 18 26 18C26 18 22 24 18 24C14 24 14 18 10 18Z" fill="#FF6B00" opacity="0.8" />
                <circle cx="18" cy="18" r="2" fill="#0a0a0a" />
              </svg>
              <div className="absolute inset-0 bg-drift-orange/20 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            <span className="font-heading font-bold text-xl tracking-wider">
              DRIFT<span className="text-drift-orange">SPOTTER</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="px-4 py-2 text-sm font-medium text-muted hover:text-foreground transition-colors relative group"
              >
                {link.label}
                <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-drift-orange transition-all duration-300 group-hover:w-2/3" />
              </Link>
            ))}
          </div>

          {/* Auth area */}
          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <>
                <NotificationBell />
                <div className="relative" ref={dropdownRef}>
                  <button
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                    className="flex items-center gap-2 px-3 py-1.5 rounded-xl hover:bg-surface-lighter transition-colors"
                  >
                    {avatarUrl ? (
                      <img
                        src={avatarUrl}
                        alt={displayName}
                        className="w-8 h-8 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-drift-orange/20 flex items-center justify-center text-sm font-semibold text-drift-orange">
                        {avatarLetter}
                      </div>
                    )}
                    <span className="text-sm font-medium text-foreground max-w-[120px] truncate">
                      {displayName}
                    </span>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={`transition-transform ${dropdownOpen ? "rotate-180" : ""}`}>
                      <polyline points="6 9 12 15 18 9" />
                    </svg>
                  </button>

                  {dropdownOpen && (
                    <div className="absolute right-0 top-full mt-2 w-56 glass rounded-xl border border-border shadow-xl overflow-hidden animate-fade-in-up">
                      <div className="px-4 py-3 border-b border-border">
                        <p className="text-sm font-semibold text-foreground">{displayName}</p>
                        <p className="text-xs text-muted truncate">{user.email}</p>
                      </div>
                      <div className="py-1">
                        <button
                          onClick={async () => { setDropdownOpen(false); await signOut(); }}
                          className="w-full text-left px-4 py-2.5 text-sm text-red-400 hover:bg-surface-lighter transition-colors flex items-center gap-2"
                        >
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                            <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" />
                          </svg>
                          Sign Out
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <button
                onClick={onLoginClick}
                className="px-5 py-2 text-sm font-medium text-foreground bg-drift-orange hover:bg-drift-orange-light rounded-lg transition-all duration-200 hover:shadow-lg hover:shadow-drift-orange/20 active:scale-95"
              >
                Sign In
              </button>
            )}
          </div>

          {/* Mobile Hamburger */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden flex flex-col gap-1.5 p-2"
            aria-label="Toggle menu"
          >
            <span className={`block w-6 h-0.5 bg-foreground transition-all duration-300 ${mobileOpen ? "rotate-45 translate-y-2" : ""}`} />
            <span className={`block w-6 h-0.5 bg-foreground transition-all duration-300 ${mobileOpen ? "opacity-0" : ""}`} />
            <span className={`block w-6 h-0.5 bg-foreground transition-all duration-300 ${mobileOpen ? "-rotate-45 -translate-y-2" : ""}`} />
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`md:hidden glass transition-all duration-300 overflow-hidden ${
          mobileOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="px-4 py-4 space-y-2">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMobileOpen(false)}
              className="block px-4 py-3 text-sm font-medium text-muted hover:text-foreground hover:bg-surface-lighter rounded-lg transition-colors"
            >
              {link.label}
            </Link>
          ))}
          {user ? (
            <div className="pt-2 border-t border-border">
              <div className="flex items-center gap-3 px-4 py-3">
                {avatarUrl ? (
                  <img src={avatarUrl} alt={displayName} className="w-8 h-8 rounded-full object-cover" />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-drift-orange/20 flex items-center justify-center text-sm font-semibold text-drift-orange">
                    {avatarLetter}
                  </div>
                )}
                <span className="text-sm font-medium text-foreground">{displayName}</span>
              </div>
              <button
                onClick={async () => { setMobileOpen(false); await signOut(); }}
                className="w-full text-left px-4 py-3 text-sm text-red-400 hover:bg-surface-lighter rounded-lg transition-colors"
              >
                Sign Out
              </button>
            </div>
          ) : (
            <button
              onClick={() => { onLoginClick(); setMobileOpen(false); }}
              className="w-full mt-2 px-5 py-3 text-sm font-medium text-foreground bg-drift-orange hover:bg-drift-orange-light rounded-lg transition-colors"
            >
              Sign In
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}
