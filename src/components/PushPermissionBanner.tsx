"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { usePushNotifications } from "@/hooks/usePushNotifications";

export default function PushPermissionBanner() {
  const { user } = useAuth();
  const { permission, subscribed, subscribe } = usePushNotifications();
  const [dismissed, setDismissed] = useState(true);

  useEffect(() => {
    if (user && permission === "default" && !subscribed) {
      const key = `push_banner_dismissed_${user.id}`;
      if (!sessionStorage.getItem(key)) {
        setDismissed(false);
      }
    }
  }, [user, permission, subscribed]);

  if (dismissed || !user || permission !== "default") return null;

  const handleDismiss = () => {
    sessionStorage.setItem(`push_banner_dismissed_${user.id}`, "1");
    setDismissed(true);
  };

  const handleEnable = async () => {
    await subscribe();
    setDismissed(true);
  };

  return (
    <div className="fixed bottom-6 left-6 right-6 sm:left-auto sm:right-6 sm:w-96 z-[90] glass rounded-2xl border border-border p-5 animate-fade-in-up shadow-xl">
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-xl bg-drift-orange/20 flex items-center justify-center flex-shrink-0">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#FF6B00" strokeWidth="2" strokeLinecap="round">
            <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9" />
            <path d="M13.73 21a2 2 0 01-3.46 0" />
          </svg>
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="font-heading font-semibold text-sm text-foreground">Enable Push Notifications</h4>
          <p className="text-xs text-muted mt-1">Get notified when someone replies to your threads or likes your posts.</p>
          <div className="flex gap-2 mt-3">
            <button
              onClick={handleEnable}
              className="px-4 py-1.5 bg-drift-orange hover:bg-drift-orange-light text-white text-xs font-semibold rounded-lg transition-colors"
            >
              Enable
            </button>
            <button
              onClick={handleDismiss}
              className="px-4 py-1.5 text-xs text-muted hover:text-foreground transition-colors"
            >
              Not now
            </button>
          </div>
        </div>
        <button onClick={handleDismiss} className="text-muted-dark hover:text-foreground">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      </div>
    </div>
  );
}
