// DriftSpotter Service Worker — Push Notifications

self.addEventListener("push", (event) => {
  let data = {};
  try {
    data = event.data?.json() ?? {};
  } catch {
    // Non-JSON payload — fall back to plain text as the body
    data = { body: event.data?.text() };
  }

  const title = data.title || "DriftSpotter";
  const options = {
    body: data.body || "You have a new notification",
    icon: "/icons/icon-192.png",
    // badge must be monochrome (alpha silhouette) — an opaque icon renders as a solid square on Android
    badge: "/icons/badge-96.png",
    data: { url: data.url || "/" },
    vibrate: [200, 100, 200],
  };

  event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  const url = event.notification.data?.url || "/";

  event.waitUntil(
    (async () => {
      const windowClients = await clients.matchAll({ type: "window", includeUncontrolled: true });
      for (const client of windowClients) {
        if ("focus" in client) {
          await client.focus();
          if ("navigate" in client) await client.navigate(url);
          return;
        }
      }
      await clients.openWindow(url);
    })()
  );
});
