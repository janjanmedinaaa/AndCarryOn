var cacheName = 'AndCarryOn-v1';
var filesToCache = [
  '/AndCarryOn/index.html',
  '/AndCarryOn/css/index.css',
  '/AndCarryOn/js/loading.css',
  '/AndCarryOn/js/index.js',

  '/AndCarryOn/code.html',
  '/AndCarryOn/css/code.css',
  '/AndCarryOn/js/code.js',

  '/AndCarryOn/lib/ezss/css/ezss-assets.css',
  '/AndCarryOn/lib/ezss/css/ezss-basics.css',
  '/AndCarryOn/lib/ezss/css/ezss-fonts.css',
  '/AndCarryOn/lib/ezss/css/ezss.css',
  '/AndCarryOn/lib/ezss/css/reset.css',

  '/AndCarryOn/chrome-extension/images/icon.png'
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