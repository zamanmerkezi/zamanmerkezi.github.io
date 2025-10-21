self.addEventListener('install', e => {
  console.log('Service Worker kuruldu');
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  console.log('Service Worker aktif');
});

self.addEventListener('push', e => {
  const data = e.data?.json() || {};
  e.waitUntil(
    self.registration.showNotification(data.title || "ZAMAN MERKEZİ 🔔", {
      body: data.body || "Yeni bir bildirim!",
      icon: "icon-192.png"
    })
  );
});

self.addEventListener('notificationclick', e => {
  e.notification.close();
  e.waitUntil(clients.openWindow('index.html'));
});
