import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import DriverProfileView from "@/components/DriverProfileView";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from("profiles")
      .select("username, bio, avatar_url")
      .eq("id", id)
      .maybeSingle();

    if (!data) return { title: "Driver Not Found — DriftSpotter" };

    const profile = data as { username: string; bio?: string | null; avatar_url?: string | null };
    const description = profile.bio || `${profile.username}'s driver profile on DriftSpotter — car, photos and event history.`;
    return {
      title: `${profile.username} — Driver Profile — DriftSpotter`,
      description,
      openGraph: {
        title: `${profile.username} — Driver Profile — DriftSpotter`,
        description,
        url: `/drivers/${id}`,
        siteName: "DriftSpotter",
        ...(profile.avatar_url ? { images: [{ url: profile.avatar_url }] } : {}),
      },
      twitter: {
        card: "summary",
        title: `${profile.username} — Driver Profile — DriftSpotter`,
        description,
      },
    };
  } catch {
    return { title: "Driver Profile — DriftSpotter" };
  }
}

export default async function DriverPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <section className="relative pt-28 pb-20 md:pt-32 md:pb-28">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        <DriverProfileView userId={id} />
      </div>
    </section>
  );
}
