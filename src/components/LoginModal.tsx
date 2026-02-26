"use client";

import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";

export default function LoginModal({ onClose }: { onClose: () => void }) {
  const { signInWithOAuth, signInWithEmail, signUpWithEmail } = useAuth();
  const [mode, setMode] = useState<"login" | "register">("login");
  const [agreed, setAgreed] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [confirmSent, setConfirmSent] = useState(false);

  const handleOAuth = async (provider: "google" | "facebook") => {
    setError(null);
    setLoading(true);
    await signInWithOAuth(provider);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    if (mode === "register") {
      if (!agreed) {
        setError("Please agree to the Terms of Service and Privacy Policy.");
        setLoading(false);
        return;
      }
      if (!username.trim()) {
        setError("Please enter a username.");
        setLoading(false);
        return;
      }
      const { error: err } = await signUpWithEmail(email, password, username);
      if (err) {
        setError(err);
        setLoading(false);
      } else {
        setConfirmSent(true);
        setLoading(false);
      }
    } else {
      const { error: err } = await signInWithEmail(email, password);
      if (err) {
        setError(err);
        setLoading(false);
      } else {
        onClose();
      }
    }
  };

  if (confirmSent) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center" onClick={onClose}>
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm" />
        <div className="relative w-full max-w-md mx-4 rounded-2xl glass overflow-hidden animate-fade-in-up" onClick={(e) => e.stopPropagation()}>
          <div className="p-8 text-center">
            <div className="w-16 h-16 rounded-full bg-badge-grassroots/20 flex items-center justify-center mx-auto mb-5">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#22C55E" strokeWidth="2" strokeLinecap="round"><polyline points="20 6 9 17 4 12" /></svg>
            </div>
            <h2 className="font-heading font-bold text-2xl text-foreground mb-3">Check Your Email</h2>
            <p className="text-sm text-muted mb-6">
              We&apos;ve sent a confirmation link to <strong className="text-foreground">{email}</strong>. Click the link to activate your account.
            </p>
            <button onClick={onClose} className="px-6 py-2.5 bg-drift-orange hover:bg-drift-orange-light text-white font-semibold rounded-xl transition-colors">
              Got it
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center" onClick={onClose}>
      <div className="fixed inset-0 bg-black/70 backdrop-blur-sm" />

      <div
        className="relative w-full max-w-md mx-4 rounded-2xl glass overflow-hidden animate-fade-in-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 w-8 h-8 rounded-full bg-surface-lighter flex items-center justify-center hover:bg-surface-light transition-colors"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>

        <div className="p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-2 mb-4">
              <svg width="28" height="28" viewBox="0 0 36 36" fill="none">
                <path d="M18 2L32 10V26L18 34L4 26V10L18 2Z" stroke="#FF6B00" strokeWidth="2" fill="none" />
                <path d="M10 18C10 18 14 12 18 12C22 12 22 18 26 18C26 18 22 24 18 24C14 24 14 18 10 18Z" fill="#FF6B00" opacity="0.8" />
              </svg>
              <span className="font-heading font-bold text-lg">DRIFT<span className="text-drift-orange">SPOTTER</span></span>
            </div>
            <h2 className="font-heading font-bold text-2xl text-foreground">
              {mode === "login" ? "Welcome Back" : "Join the Community"}
            </h2>
            <p className="text-sm text-muted mt-2">
              {mode === "login" ? "Sign in to track events and connect with drivers" : "Create your account and start your drift journey"}
            </p>
          </div>

          {/* Error */}
          {error && (
            <div className="mb-4 px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/20 text-sm text-red-400">
              {error}
            </div>
          )}

          {/* Social buttons */}
          <div className="space-y-3 mb-6">
            <button
              onClick={() => handleOAuth("google")}
              disabled={loading}
              className="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-xl bg-white hover:bg-gray-100 text-gray-800 font-medium text-sm transition-colors disabled:opacity-50"
            >
              <svg width="18" height="18" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
              </svg>
              Continue with Google
            </button>

            <button
              onClick={() => handleOAuth("facebook")}
              disabled={loading}
              className="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-xl bg-[#1877F2] hover:bg-[#166FE5] text-white font-medium text-sm transition-colors disabled:opacity-50"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="white">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
              </svg>
              Continue with Facebook
            </button>

            <button
              onClick={() => handleOAuth("facebook")}
              disabled={loading}
              className="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-xl text-white font-medium text-sm transition-colors disabled:opacity-50" style={{ background: "linear-gradient(45deg, #f09433, #e6683c, #dc2743, #cc2366, #bc1888)" }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="white">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
              </svg>
              Continue with Instagram
            </button>
          </div>

          {/* Divider */}
          <div className="flex items-center gap-4 mb-6">
            <div className="flex-1 h-px bg-border" />
            <span className="text-xs text-muted-dark uppercase">or</span>
            <div className="flex-1 h-px bg-border" />
          </div>

          {/* Email form */}
          <form onSubmit={handleSubmit} className="space-y-3 mb-6">
            {mode === "register" && (
              <input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-4 py-3 bg-surface-lighter border border-border rounded-xl text-sm text-foreground placeholder:text-muted-dark focus:outline-none focus:border-drift-orange transition-colors"
              />
            )}
            <input
              type="email"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-3 bg-surface-lighter border border-border rounded-xl text-sm text-foreground placeholder:text-muted-dark focus:outline-none focus:border-drift-orange transition-colors"
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              className="w-full px-4 py-3 bg-surface-lighter border border-border rounded-xl text-sm text-foreground placeholder:text-muted-dark focus:outline-none focus:border-drift-orange transition-colors"
            />

            {/* Terms */}
            {mode === "register" && (
              <label className="flex items-start gap-3 cursor-pointer">
                <div
                  onClick={() => setAgreed(!agreed)}
                  className={`w-4 h-4 rounded border-2 mt-0.5 flex-shrink-0 transition-colors flex items-center justify-center ${agreed ? "border-drift-orange bg-drift-orange" : "border-border-light"}`}
                >
                  {agreed && <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3"><polyline points="20 6 9 17 4 12" /></svg>}
                </div>
                <span className="text-xs text-muted leading-relaxed">
                  I agree to the <a href="#" className="text-drift-orange hover:underline">Terms of Service</a> and <a href="#" className="text-drift-orange hover:underline">Privacy Policy</a>
                </span>
              </label>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-drift-orange hover:bg-drift-orange-light text-white font-heading font-semibold rounded-xl transition-all active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading && (
                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
              )}
              {mode === "login" ? "Sign In" : "Create Account"}
            </button>
          </form>

          {/* Toggle mode */}
          <p className="text-center text-sm text-muted">
            {mode === "login" ? "Don't have an account?" : "Already have an account?"}{" "}
            <button
              onClick={() => { setMode(mode === "login" ? "register" : "login"); setError(null); }}
              className="text-drift-orange hover:underline font-medium"
            >
              {mode === "login" ? "Sign up" : "Sign in"}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
