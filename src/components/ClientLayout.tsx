"use client";

import { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import LoginModal from "@/components/LoginModal";
import PushPermissionBanner from "@/components/PushPermissionBanner";

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const [showLogin, setShowLogin] = useState(false);
  const { user, profile, loading } = useAuth();
  const pathname = usePathname();
  const router = useRouter();

  // First-login onboarding: route new accounts to the role picker once
  useEffect(() => {
    if (loading || !user || !profile) return;
    if (!profile.account_type && pathname !== "/welcome" && !pathname.startsWith("/auth")) {
      router.replace("/welcome");
    }
  }, [loading, user, profile, pathname, router]);

  return (
    <main className="min-h-screen bg-background noise-overlay">
      <Navbar
        user={user}
        profile={profile}
        onLoginClick={() => setShowLogin(true)}
      />
      {children}
      <Footer />
      {showLogin && <LoginModal onClose={() => setShowLogin(false)} />}
      <PushPermissionBanner />
    </main>
  );
}
