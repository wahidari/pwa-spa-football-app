importScripts('https://storage.googleapis.com/workbox-cdn/releases/3.6.3/workbox-sw.js');
const CACHE_NAME = "football-v1";
const urlsToCache = [
  { url: '/', revision: '1' },
  { url: '/nav.html', revision: '1' },
  { url: '/index.html', revision: '1' },
  { url: '/manifest.json', revision: '1' },

  { url: '/pages/home.html', revision: '1' },
  { url: '/pages/teams.html', revision: '1' },
  { url: '/pages/favorite.html', revision: '1' },

  { url: '/css/materialize.min.css', revision: '1' },
  { url: '/js/materialize.min.js', revision: '1' },

  { url: '/js/api.js', revision: '1' },
  { url: '/js/db.js', revision: '1' },
  { url: '/js/idb.js', revision: '1' },
  { url: '/js/nav.js', revision: '1' },

  { url: '/icons/logo-72.png', revision: '1' },
  { url: '/icons/logo-96.png', revision: '1' },
  { url: '/icons/logo-128.png', revision: '1' },
  { url: '/icons/logo-144.png', revision: '1' },
  { url: '/icons/logo-192.png', revision: '1' },
  { url: '/icons/logo-256.png', revision: '1' },
  { url: '/icons/logo-512.png', revision: '1' },

  { url: '/icons/apple-touch-icon-57.png', revision: '1' },
  { url: '/icons/apple-touch-icon-60.png', revision: '1' },
  { url: '/icons/apple-touch-icon-72.png', revision: '1' },
  { url: '/icons/apple-touch-icon-76.png', revision: '1' },
  { url: '/icons/apple-touch-icon-114.png', revision: '1' },
  { url: '/icons/apple-touch-icon-120.png', revision: '1' },
  { url: '/icons/apple-touch-icon-144.png', revision: '1' },
  { url: '/icons/apple-touch-icon-152.png', revision: '1' },
  { url: '/icons/apple-touch-icon-180.png', revision: '1' }
];

if (workbox) {
  console.log(`Workbox berhasil dimuat`);

  workbox.precaching.precacheAndRoute(urlsToCache);

  workbox.routing.registerRoute(
    /.*(?:png|gif|jpg|jpeg|svg)$/,
    workbox.strategies.cacheFirst({
      cacheName: 'images',
      plugins: [
        new workbox.cacheableResponse.Plugin({
          statuses: [0, 200]
        }),
        new workbox.expiration.Plugin({
          maxEntries: 100,
          maxAgeSeconds: 30 * 24 * 60 * 60, // 30 hari
        }),
      ]
    })
  );

  workbox.routing.registerRoute(
    new RegExp('https://api.football-data.org/v2/'),
    workbox.strategies.staleWhileRevalidate()
  );

  workbox.routing.registerRoute(
    new RegExp('/pages/'),
    workbox.strategies.staleWhileRevalidate({
      cacheName: 'pages'
    })
  );
} else {
  console.log(`Workbox gagal dimuat`);
};

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