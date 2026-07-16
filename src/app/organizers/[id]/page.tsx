import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import OrganizerProfileView from "@/components/OrganizerProfileView";

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
      .select("username, bio")
      .eq("id", id)
      .maybeSingle();

    if (!data) return { title: "Organizer Not Found — DriftSpotter" };

    const profile = data as { username: string; bio?: string | null };
    const description = profile.bio || `Drift events organized by ${profile.username} on DriftSpotter.`;
    return {
      title: `${profile.username} — Event Organizer — DriftSpotter`,
      description,
      openGraph: {
        title: `${profile.username} — Event Organizer — DriftSpotter`,
        description,
        url: `/organizers/${id}`,
        siteName: "DriftSpotter",
      },
    };
  } catch {
    return { title: "Event Organizer — DriftSpotter" };
  }
}

export default async function OrganizerPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <section className="relative pt-28 pb-20 md:pt-32 md:pb-28">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        <OrganizerProfileView userId={id} />
      </div>
    </section>
  );
}
