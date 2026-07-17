"use client";

import { useCallback, useEffect, useState } from "react";
import { usePushNotifications } from "@/hooks/usePushNotifications";
import { useToast } from "@/components/ui/Toast";
import type { NotificationSample } from "./samples";

interface BenchData {
  signedIn: boolean;
  eventLabel: string;
  pushConfigured: boolean;
  subscriptionCount: number;
  samples: NotificationSample[];
}

type Channel = "inapp" | "push";

/**
 * Dev-only notification test bench. Fires every notification the app can send
 * at YOUR account — in-app rows land in the navbar bell live (realtime
 * subscription), push hits this browser if subscribed. Backend: ./send route.
 */
export default function NotificationBenchPage() {
  const { toast } = useToast();
  const { permission, subscribe } = usePushNotifications();
  const [data, setData] = useState<BenchData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState<string | null>(null);
  const [custom, setCustom] = useState({ title: "", body: "", link: "/events" });

  const load = useCallback(() => {
    fetch("/dev/notifications/send")
      .then((r) => {
        if (r.status === 404) throw new Error("The notification bench isn't available here.");
        if (!r.ok) throw new Error(`Failed to load (${r.status})`);
        return r.json();
      })
      .then(setData)
      .catch((e) => setError(String(e.message ?? e)));
  }, []);

  useEffect(load, [load]);

  const send = async (
    key: string,
    payload: { title: string; body: string; link: string; type: string },
    channels: Channel[]
  ) => {
    setBusy(key);
    try {
      const res = await fetch("/dev/notifications/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...payload, channels }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || `Request failed (${res.status})`);

      const parts: string[] = [];
      if (json.inapp) parts.push("in-app sent — check the bell");
      if (json.pushSent) parts.push(`push sent to ${json.pushSent} subscription${json.pushSent > 1 ? "s" : ""}`);
      if (json.pushError) parts.push(`push: ${json.pushError}`);
      toast(parts.join(" · ") || "Sent", json.pushError && !json.inapp ? "error" : "success");
    } catch (e) {
      toast(e instanceof Error ? e.message : "Failed to send", "error");
    } finally {
      setBusy(null);
    }
  };

  const clearAll = async () => {
    if (!window.confirm("Delete ALL notifications on your account (including real ones)?")) return;
    setBusy("clear");
    try {
      const res = await fetch("/dev/notifications/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "clear" }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Failed to clear");
      toast("Notifications cleared — reload to reset the bell", "success");
    } catch (e) {
      toast(e instanceof Error ? e.message : "Failed to clear", "error");
    } finally {
      setBusy(null);
    }
  };

  const enablePush = async () => {
    setBusy("push-enable");
    await subscribe();
    load();
    setBusy(null);
  };

  if (error) {
    return <div className="min-h-[60vh] flex items-center justify-center text-sm text-muted">{error}</div>;
  }
  if (!data) {
    return <div className="min-h-[60vh] flex items-center justify-center text-sm text-muted">Loading test bench…</div>;
  }

  const sendButtons = (key: string, payload: { title: string; body: string; link: string; type: string }, disabled = false) => (
    <div className="flex gap-2 flex-shrink-0">
      <button
        onClick={() => send(key, payload, ["inapp"])}
        disabled={disabled || busy !== null}
        className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-drift-orange text-white hover:opacity-90 disabled:opacity-40 transition-opacity"
      >
        In-app
      </button>
      <button
        onClick={() => send(key, payload, ["push"])}
        disabled={disabled || busy !== null}
        className="px-3 py-1.5 text-xs font-semibold rounded-lg border border-border hover:bg-surface-lighter disabled:opacity-40 transition-colors"
      >
        Push
      </button>
      <button
        onClick={() => send(key, payload, ["inapp", "push"])}
        disabled={disabled || busy !== null}
        className="px-3 py-1.5 text-xs font-semibold rounded-lg border border-border hover:bg-surface-lighter disabled:opacity-40 transition-colors"
      >
        Both
      </button>
    </div>
  );

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <p className="text-[11px] tracking-[2px] uppercase text-drift-orange font-bold mb-1">Dev tools</p>
      <h1 className="font-heading text-2xl font-bold text-foreground mb-2">Notification test bench</h1>
      <p className="text-sm text-muted mb-1">
        Everything sends to <span className="text-foreground font-medium">your own account</span>. In-app notifications
        appear in the navbar bell instantly (realtime); push arrives in this browser if subscribed.
      </p>
      <p className="text-xs text-muted-dark mb-8">Sample event: {data.eventLabel}</p>

      {!data.signedIn && (
        <div className="glass rounded-xl border border-drift-orange/40 p-4 mb-8 text-sm text-foreground">
          You&apos;re not signed in — sign in first, then reload this page.
        </div>
      )}

      {/* Push status */}
      <div className="glass rounded-xl border border-border p-4 mb-8 flex items-center justify-between gap-4 flex-wrap">
        <div className="text-sm">
          <p className="font-medium text-foreground mb-0.5">Web push status</p>
          <p className="text-xs text-muted">
            Browser permission: <span className="text-foreground">{permission}</span>
            {" · "}Subscriptions on account: <span className="text-foreground">{data.subscriptionCount}</span>
            {!data.pushConfigured && (
              <span className="text-drift-orange"> · VAPID keys not configured in .env.local</span>
            )}
          </p>
        </div>
        <button
          onClick={enablePush}
          disabled={!data.signedIn || busy !== null || permission === "denied"}
          className="px-3 py-1.5 text-xs font-semibold rounded-lg border border-border hover:bg-surface-lighter disabled:opacity-40 transition-colors"
        >
          {permission === "denied" ? "Push blocked in browser settings" : "Enable push in this browser"}
        </button>
      </div>

      {/* Sample catalogue */}
      <div className="space-y-3 mb-10">
        {data.samples.map((s) => (
          <div key={s.id} className="glass rounded-xl border border-border p-4">
            <div className="flex items-start justify-between gap-4 flex-wrap">
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span
                    className={`text-[10px] font-bold uppercase tracking-wide px-1.5 py-0.5 rounded ${
                      s.type === "event" ? "bg-drift-orange/10 text-drift-orange" : "bg-surface-lighter text-muted"
                    }`}
                  >
                    {s.type}
                  </span>
                  <p className="text-sm font-medium text-foreground truncate">{s.title}</p>
                </div>
                <p className="text-xs text-muted mb-1">{s.body}</p>
                <p className="text-[10px] text-muted-dark">
                  {s.source} · links to <span className="font-mono">{s.link}</span>
                </p>
              </div>
              {sendButtons(s.id, s, !data.signedIn)}
            </div>
          </div>
        ))}
      </div>

      {/* Custom composer */}
      <div className="glass rounded-xl border border-border p-4 mb-10">
        <p className="text-sm font-medium text-foreground mb-3">Custom notification</p>
        <div className="grid gap-2 mb-3">
          <input
            value={custom.title}
            onChange={(e) => setCustom((c) => ({ ...c, title: e.target.value }))}
            placeholder="Title"
            className="bg-surface-lighter border border-border rounded-lg px-3 py-2 text-sm text-foreground placeholder:text-muted-dark focus:outline-none focus:border-drift-orange"
          />
          <textarea
            value={custom.body}
            onChange={(e) => setCustom((c) => ({ ...c, body: e.target.value }))}
            placeholder="Body"
            rows={2}
            className="bg-surface-lighter border border-border rounded-lg px-3 py-2 text-sm text-foreground placeholder:text-muted-dark focus:outline-none focus:border-drift-orange resize-none"
          />
          <input
            value={custom.link}
            onChange={(e) => setCustom((c) => ({ ...c, link: e.target.value }))}
            placeholder="Link (must start with /)"
            className="bg-surface-lighter border border-border rounded-lg px-3 py-2 text-sm font-mono text-foreground placeholder:text-muted-dark focus:outline-none focus:border-drift-orange"
          />
        </div>
        {sendButtons(
          "custom",
          { ...custom, type: "event" },
          !data.signedIn || !custom.title.trim() || !custom.body.trim()
        )}
      </div>

      {/* Cleanup */}
      <div className="flex items-center justify-between gap-4 border-t border-border pt-6">
        <p className="text-xs text-muted-dark">Removes every notification row on your account, test or real.</p>
        <button
          onClick={clearAll}
          disabled={!data.signedIn || busy !== null}
          className="px-3 py-1.5 text-xs font-semibold rounded-lg border border-red-500/40 text-red-400 hover:bg-red-500/10 disabled:opacity-40 transition-colors flex-shrink-0"
        >
          Clear all my notifications
        </button>
      </div>
    </div>
  );
}
