import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import EventDetailPage from "./EventDetailPage";
import CountryEventsPage from "./CountryEventsPage";

function getCountryName(code: string): string {
  try {
    const names = new Intl.DisplayNames(["en"], { type: "region" });
    return names.of(code.toUpperCase()) || code;
  } catch {
    return code;
  }
}

// 2-letter uppercase = country code
function isCountryCode(slug: string): boolean {
  return /^[A-Z]{2}$/.test(slug);
}

const COMMON_COUNTRIES = ["US", "JP", "GB", "DE", "PL", "NO", "IE", "IT", "LV", "LT", "EE", "AT", "AU", "NZ", "CA"];

export async function generateStaticParams() {
  return COMMON_COUNTRIES.map((c) => ({ slug: c }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;

  if (isCountryCode(slug)) {
    const name = getCountryName(slug);
    return {
      title: `Drift Events in ${name} — DriftSpotter`,
      description: `Find upcoming drift events in ${name}. Browse grassroots days, pro competitions, and practice sessions.`,
      openGraph: {
        title: `Drift Events in ${name} — DriftSpotter`,
        description: `Find upcoming drift events in ${name}. Browse grassroots days, pro competitions, and practice sessions.`,
        url: `/events/${slug}`,
        siteName: "DriftSpotter",
      },
      twitter: {
        card: "summary_large_image",
        title: `Drift Events in ${name} — DriftSpotter`,
        description: `Find upcoming drift events in ${name}. Browse grassroots days, pro competitions, and practice sessions.`,
      },
    };
  }

  // Event detail — `events` table is not in Database types, so cast client
  try {
    const supabase = await createClient();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data, error } = await (supabase as any)
      .from("events")
      .select("*")
      .eq("id", slug)
      .single();

    if (error || !data) return { title: "Event Not Found — DriftSpotter" };

    const event = data as Record<string, unknown>;
    const desc = String(event.description ?? "");
    const description = desc.length > 160 ? desc.slice(0, 157) + "..." : desc;

    return {
      title: `${event.name} — DriftSpotter`,
      description,
      openGraph: {
        title: `${event.name} — DriftSpotter`,
        description,
        url: `/events/${slug}`,
        siteName: "DriftSpotter",
      },
      twitter: {
        card: "summary_large_image",
        title: `${event.name} — DriftSpotter`,
        description,
      },
    };
  } catch {
    return { title: "Event Not Found — DriftSpotter" };
  }
}

export default async function EventSlugPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  if (isCountryCode(slug)) {
    return <CountryEventsPage country={slug} />;
  }

  // Event detail — `events` table is not in Database types, so cast client
  try {
    const supabase = await createClient();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: row, error } = await (supabase as any)
      .from("events")
      .select("*")
      .eq("id", slug)
      .single();

    if (error || !row) notFound();

    const event = {
      id: row.id,
      name: row.name,
      series: row.series || undefined,
      date: row.date,
      endDate: row.end_date || undefined,
      location: row.location,
      country: row.country,
      track: row.track,
      lat: Number(row.lat),
      lng: Number(row.lng),
      category: row.category,
      cageRequired: row.cage_required,
      tireSize: row.tire_size,
      skillLevel: row.skill_level,
      description: row.description,
      eventUrl: row.event_url || undefined,
      imageUrl: row.image_url || undefined,
      price: row.price || undefined,
      attendees: 0,
      isHot: row.is_hot,
      participation: row.participation,
      organizer: row.organizer,
    };

    return <EventDetailPage event={event} />;
  } catch {
    notFound();
  }
}
