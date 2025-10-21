self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open("zaman-merkezi-v1").then((cache) => {
      return cache.addAll([
        "index.html",
        "manifest.json",
        "script.js",
        "style.css",
        "icons/icon-192.png",
        "icons/icon-512.png",
        "hakkinda.html",
        "gizlilik.html",
        "iletisim.html"
      ]);
    })
  );
  console.log("✅ Service Worker yüklendi.");
});

self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});
