"use client";

import { useAuth } from "@/contexts/AuthContext";
import MyEventsDashboard from "@/components/MyEventsDashboard";

export default function MyEventsPage() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <section className="relative pt-28 pb-20 md:pt-32 md:pb-28">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="h-8 w-48 bg-surface-lighter rounded animate-pulse mb-8" />
          <div className="space-y-4">
            {[1, 2].map((i) => (
              <div key={i} className="h-32 glass rounded-2xl animate-pulse" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (!user) {
    return (
      <section className="relative pt-28 pb-20 md:pt-32 md:pb-28">
        <div className="max-w-2xl mx-auto px-4 text-center">
          <div className="glass rounded-2xl p-12">
            <h2 className="font-heading font-bold text-2xl text-foreground mb-3">Sign In Required</h2>
            <p className="text-muted">Please sign in to view your events.</p>
          </div>
        </div>
      </section>
    );
  }

  return <MyEventsDashboard />;
}
