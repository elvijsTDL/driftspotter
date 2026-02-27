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
