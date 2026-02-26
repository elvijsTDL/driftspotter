import type { Metadata } from "next";
import "./globals.css";
import ClientLayout from "@/components/ClientLayout";
import { AuthProvider } from "@/contexts/AuthContext";
import { ToastProvider } from "@/components/ui/Toast";

export const metadata: Metadata = {
  title: "DriftSpotter — Every Slide. Every Event. One Map.",
  description: "The ultimate community for drifting enthusiasts. Find events, connect with drivers, and never miss a session.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Chakra+Petch:wght@400;500;600;700&family=Outfit:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap"
          rel="stylesheet"
        />
        <link
          href="https://unpkg.com/maplibre-gl@4.1.1/dist/maplibre-gl.css"
          rel="stylesheet"
        />
      </head>
      <body className="bg-background text-foreground font-body antialiased">
        <AuthProvider>
          <ToastProvider>
            <ClientLayout>{children}</ClientLayout>
          </ToastProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
