const CACHE_VERSION = 1;
const CACHE_STATIC_NAME  = `static-v${CACHE_VERSION}`;
const CACHE_DYNAMIC_NAME  = `dynamic-v${CACHE_VERSION}`;
const STATIC_FILES = [
  './',
  './build/bundle.css',
  './build/bundle.js',
  './build/bundle.css.map',
  './build/bundle.js.map',
  './index.html',
  './manifest.webmanifest'
];

// Cleaning up cache
function trimCache(cacheName, maxItems) {
  caches.open(cacheName)
  .then(cache => {
    cache.keys()
    .then(keys => {
    if (keys.length > maxItems) {
      cache.delete(keys[0])
      .then(trimCache(cacheName, maxItems));
    }
  });
  })
}

// Cache app shell
self.addEventListener('install', event => {
  console.log('[Service Worker] Installing service worker', event);
  event.waitUntil(
    caches.open(CACHE_STATIC_NAME)
    .then(cache => {
      console.log(`[Service Worker] Pre-caching app shell -> ${CACHE_STATIC_NAME}`);
      cache.addAll(STATIC_FILES);
    })
  )
});

self.addEventListener('activate', event => {
  console.log('[Service Worker] Activating service worker', event);
  // Clear old cached data for updates
  event.waitUntil(
    caches.keys()
    .then(function(key_list) {
      return Promise.all(key_list.map(function(key) {
        if (key !== CACHE_STATIC_NAME && key !== CACHE_DYNAMIC_NAME) {
          console.log(`[Service Worker] Removing old cache -> ${key}`)
          return caches.delete(key);
        }
      }));
    })
  );
  return self.clients.claim();
});

// Network with cache fallback strategy
self.addEventListener('fetch', event => {
  event.respondWith(
    fetch(event.request)
     .then(res => {
      return caches.open(CACHE_DYNAMIC_NAME)
        .then(cache => {
          cache.put(event.request.url, res.clone());
          return res;
        })
    })
  )
});
