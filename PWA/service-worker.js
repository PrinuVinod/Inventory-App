// service-worker.js

const CACHE_NAME = 'my-cache-v1';
const urlsToCache = [
  '/',
  '/assets/css/styles.css',
  '/assets/images/logo.webp',
  '/index.html',
  // Add other files to cache as needed
];

self.addEventListener('install', (event) => {
  console.log('Service Worker installed');
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('Caching files');
      return cache.addAll(urlsToCache);
    })
  );
});

self.addEventListener('fetch', (event) => {
  console.log('Fetching:', event.request.url);
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});