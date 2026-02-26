// DriftSpotter Service Worker — Push Notifications

self.addEventListener("push", (event) => {
  const data = event.data?.json() ?? {};
  const title = data.title || "DriftSpotter";
  const options = {
    body: data.body || "You have a new notification",
    icon: "/favicon.ico",
    badge: "/favicon.ico",
    data: { url: data.url || "/" },
    vibrate: [200, 100, 200],
  };

  event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  const url = event.notification.data?.url || "/";
  event.waitUntil(clients.openWindow(url));
});
