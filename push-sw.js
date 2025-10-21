// ✅ ZAMAN MERKEZİ Service Worker
const CACHE_NAME = "zaman-merkezi-v2";
const FILES_TO_CACHE = [
  "index.html",
  "manifest.json",
  "icon-192.png",
  "icon-512.png",
  "script.js"
];

// Kurulumda dosyaları önbelleğe al
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(FILES_TO_CACHE))
  );
  self.skipWaiting();
});

// Ağ isteği olduğunda önbellekten yükle
self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});

// Eski cache'leri temizle
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keyList) =>
      Promise.all(
        keyList.map((key) => {
          if (key !== CACHE_NAME) return caches.delete(key);
        })
      )
    )
  );
  self.clients.claim();
});

// 🔔 Bildirim Gönderimi (Push)
self.addEventListener("push", (event) => {
  let data = {};
  if (event.data) {
    data = event.data.json();
  }

  const title = data.title || "ZAMAN MERKEZİ";
  const options = {
    body: data.body || "Zaman doldu ⏰",
    icon: "icon-192.png",
    badge: "icon-192.png",
    vibrate: [200, 100, 200],
    tag: "zamanmerkezi-notif",
    data: {
      url: data.url || "/"
    }
  };

  event.waitUntil(self.registration.showNotification(title, options));
});

// 🔔 Bildirime tıklanınca siteyi aç
self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  event.waitUntil(
    clients.matchAll({ type: "window" }).then((clientsArr) => {
      const hadWindow = clientsArr.find((w) => w.url.includes("index.html"));
      if (hadWindow) {
        hadWindow.focus();
      } else {
        clients.openWindow("/");
      }
    })
  );
});
