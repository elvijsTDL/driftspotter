/** Generic native-share with clipboard fallback. */
export async function shareLink(
  title: string,
  text: string,
  url: string
): Promise<"shared" | "copied" | "failed"> {
  if (navigator.share) {
    try {
      await navigator.share({ title, text, url });
      return "shared";
    } catch {
      // User cancelled or share failed — fall through to clipboard
    }
  }
  try {
    await navigator.clipboard.writeText(url);
    return "copied";
  } catch {
    return "failed";
  }
}

export async function shareDriverProfile(userId: string, username: string) {
  return shareLink(
    `${username} — Driver Profile`,
    `${username}'s driver card on DriftSpotter — car, photos and event history`,
    `${window.location.origin}/drivers/${userId}`
  );
}

export async function shareEvent(event: {
  id: string;
  name: string;
  location: string;
  date: string;
}): Promise<"shared" | "copied" | "failed"> {
  const url = `${window.location.origin}/events/${event.id}`;
  const text = `${event.name} — ${event.location} — ${new Date(event.date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}`;

  if (navigator.share) {
    try {
      await navigator.share({ title: event.name, text, url });
      return "shared";
    } catch {
      // User cancelled or share failed — fall through to clipboard
    }
  }

  try {
    await navigator.clipboard.writeText(url);
    return "copied";
  } catch {
    return "failed";
  }
}
