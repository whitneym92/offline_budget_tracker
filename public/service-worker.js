const FILES_TO_CACHE = [
    '/',
    '/styles.css',
    '/index.js',
    '/manifest.webmanifest',
    '/db.js',
    '/index.html',
    '/icons/icon-192x192.png',
    '/icons/icon-512x512.png',
]

const CACHE_NAME = 'static-cache-v2';
const DATA_CACHE_NAME = 'data-cache-v1';

// Call install event
self.addEventListener("install", evt => {  
  // pre cache all static assets
  evt.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      cache.addAll(FILES_TO_CACHE);
    })
    .then(() => self.skipWaiting())
  );   
});

// Call Activate Event
self.addEventListener("activate", evt => {
  const currentCaches = [CACHE_NAME, DATA_CACHE_NAME]; 
  evt.waitUntil(
    caches.keys().then(keyList => {
      return keyList.filter(keyList => !currentCaches.includes(keyList));
    })
    .then((cachesToDelete) => {
      return Promise.all(
        cachesToDelete.map(cacheToDelete => {
          return caches.delete(cacheToDelete);
        })
      )
    })
  .then(() => self.clients.claim())
  );
});

// Call Fetch Event
self.addEventListener('fetch', function(evt) {
  // code to handle requests goes here
  evt.respondWith(
      caches.open(CACHE_NAME).then(cache => {
        return cache.match(evt.request).then(response => {
          return response || fetch(evt.request);
      });
    })
  );
});