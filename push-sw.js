self.addEventListener('install', e => {
  console.log('Service Worker: yüklendi');
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  console.log('Service Worker: aktif');
});

self.addEventListener('push', e => {
  const data = e.data ? e.data.text() : 'Yeni bildirim!';
  e.waitUntil(
    self.registration.showNotification('ZAMAN MERKEZİ ⏰', {
      body: data,
      icon: 'icon-192.png',
      badge: 'icon-192.png'
    })
  );
});

self.addEventListener('notificationclick', e => {
  e.notification.close();
  e.waitUntil(
    clients.openWindow('https://zamanmerkezi.github.io')
  );
});
