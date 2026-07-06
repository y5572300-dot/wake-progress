// Службный скрипт PWA: держит свежую копию страницы для запуска без сети
const CACHE = "wake-shell-v1";

self.addEventListener("install", e => {
  e.waitUntil(caches.open(CACHE).then(c => c.add("./")).catch(() => {}));
  self.skipWaiting();
});

self.addEventListener("activate", e => {
  e.waitUntil(self.clients.claim());
});

self.addEventListener("fetch", e => {
  if (e.request.mode === "navigate") {
    e.respondWith(
      fetch(e.request)
        .then(r => {
          const copy = r.clone();
          caches.open(CACHE).then(c => c.put("./", copy)).catch(() => {});
          return r;
        })
        .catch(() => caches.match("./"))
    );
  }
});
