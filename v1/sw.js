var cacheName = 'AndCarryOn-v1';
var filesToCache = [
  '/AndCarryOn/v1/index.html',
  '/AndCarryOn/v1/css/index.css',
  '/AndCarryOn/v1/css/loading.css',
  '/AndCarryOn/v1/js/index.js',

  '/AndCarryOn/v1/lib/ezss/css/ezss-assets.css',
  '/AndCarryOn/v1/lib/ezss/css/ezss-basics.css',
  '/AndCarryOn/v1/lib/ezss/css/ezss-fonts.css',
  '/AndCarryOn/v1/lib/ezss/css/ezss-nav.css',
  '/AndCarryOn/v1/lib/ezss/css/ezss.css',
  '/AndCarryOn/v1/lib/ezss/css/reset.css',

  '/AndCarryOn/v1/chrome-extension/images/icon.png'
];

self.addEventListener('install', function(e) {
  console.log('[ServiceWorker] Install');
  e.waitUntil(
    caches.open(cacheName).then(function(cache) {
      console.log('[ServiceWorker] Caching app shell');
      return cache.addAll(filesToCache);
    })
  );
});

self.addEventListener('activate', function(e) {
  console.log('[ServiceWorker] Activate');
  e.waitUntil(
    caches.keys().then(function(keyList) {
      return Promise.all(keyList.map(function(key) {
        if (key !== cacheName) {
          console.log('[ServiceWorker] Removing old cache', key);
          return caches.delete(key);
        }
      }));
    })
  );
});

self.addEventListener('fetch', function(e) {
  console.log('[ServiceWorker] Fetch', e.request.url);
  e.respondWith(
    caches.match(e.request).then(function(response) {
      return response || fetch(e.request);
    })
  );
});