"use client";

import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import LoginModal from "@/components/LoginModal";
import PushPermissionBanner from "@/components/PushPermissionBanner";

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const [showLogin, setShowLogin] = useState(false);
  const { user, profile } = useAuth();

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
