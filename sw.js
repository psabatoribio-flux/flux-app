const CACHE_VERSION = 'flux-v' + Date.now();

self.addEventListener('install', event => {
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_VERSION).map(k => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', event => {
  // Per a index.html, sempre va al servidor (no cache)
  if (event.request.url.includes('index.html') || event.request.url.endsWith('/flux-app/') || event.request.url.endsWith('/flux-app')) {
    event.respondWith(
      fetch(event.request, { cache: 'no-store' }).catch(() => caches.match(event.request))
    );
    return;
  }
  // La resta, xarxa primer
  event.respondWith(
    fetch(event.request).catch(() => caches.match(event.request))
  );
});
