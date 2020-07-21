const CACHE_NAME = "football-v1";
const urlsToCache = [
  "/",
  "/nav.html",
  "/index.html",
  "/manifest.json",

  "/pages/home.html",
  "/pages/teams.html",
  "/pages/favorite.html",

  "/css/materialize.min.css",
  "/js/materialize.min.js",
  
  "/js/api.js",
  "/js/db.js",
  "/js/idb.js",
  "/js/nav.js",

  "/icons/logo-72.png",
  "/icons/logo-96.png",
  "/icons/logo-128.png",
  "/icons/logo-144.png",
  "/icons/logo-192.png",
  "/icons/logo-256.png",
  "/icons/logo-512.png",

  "/icons/apple-touch-icon-57.png",
  "/icons/apple-touch-icon-60.png",
  "/icons/apple-touch-icon-72.png",
  "/icons/apple-touch-icon-76.png",
  "/icons/apple-touch-icon-114.png",
  "/icons/apple-touch-icon-120.png",
  "/icons/apple-touch-icon-144.png",
  "/icons/apple-touch-icon-152.png",
  "/icons/apple-touch-icon-180.png"
];

// Install Cache
self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(function(cache) {
      return cache.addAll(urlsToCache);
    })
  );
});

// Fetch Cache
self.addEventListener("fetch", event => {
  if (event.request.url.includes("football-data.org")) {
    event.respondWith(async function () {
      const cache = await caches.open(CACHE_NAME);
      const cachedResponse = await cache.match(event.request);
      if (cachedResponse) return cachedResponse;
      const networkResponse = await fetch(event.request);
      event.waitUntil(
        cache.put(event.request, networkResponse.clone())
      );
      return networkResponse;
    }());
  }
  else {
    event.respondWith(
      caches.match(event.request).then(function (response) {
        return response || fetch(event.request);
      })
    )
  }
});

// Activate Cache
self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(function(cacheNames) {
      return Promise.all(
        cacheNames.map(function(cacheName) {
          if (cacheName != CACHE_NAME && cacheName.startsWith("football")) {
            console.log("ServiceWorker: cache " + cacheName + " dihapus");
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// Push Notification
self.addEventListener('push', event => {
  let body;
  if (event.data) {
    body = event.data.text();
  } else {
    body = 'Push message no payload';
  }
  let options = {
    body: body,
    icon: '/icons/logo-72.png',
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1
    }
  };
  event.waitUntil(
    self.registration.showNotification('Push Notification', options)
  );
});