"use client";

import { useEffect, useState, useMemo } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { createBrowserClient } from "@supabase/ssr";
import AdminDashboard from "@/components/AdminDashboard";

export default function AdminPage() {
  const { user, loading: authLoading } = useAuth();
  const [isAdmin, setIsAdmin] = useState(false);
  const [checking, setChecking] = useState(true);

  const supabase = useMemo(() => createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL ?? "",
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? ""
  ), []);

  useEffect(() => {
    if (authLoading) return;
    if (!user) { setChecking(false); return; }

    supabase
      .from("profiles")
      .select("is_admin")
      .eq("id", user.id)
      .single()
      .then(({ data }) => {
        setIsAdmin(data?.is_admin ?? false);
        setChecking(false);
      });
  }, [user, authLoading, supabase]);

  if (authLoading || checking) {
    return (
      <section className="relative pt-28 pb-20 md:pt-32 md:pb-28">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="h-8 w-48 bg-surface-lighter rounded animate-pulse mb-8" />
          <div className="space-y-4">
            {[1, 2].map((i) => (
              <div key={i} className="h-28 glass rounded-2xl animate-pulse" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (!user || !isAdmin) {
    return (
      <section className="relative pt-28 pb-20 md:pt-32 md:pb-28">
        <div className="max-w-2xl mx-auto px-4 text-center">
          <div className="glass rounded-2xl p-12">
            <h2 className="font-heading font-bold text-2xl text-foreground mb-3">Access Denied</h2>
            <p className="text-muted">You do not have permission to view this page.</p>
          </div>
        </div>
      </section>
    );
  }

  return <AdminDashboard />;
}
