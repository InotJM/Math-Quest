// Service Worker for Math Quest PWA
const CACHE_NAME = 'math-quest-v2';

const urlsToCache = [
  './',
  './index.html',
  './manifest.json',

  // Icons (add all your icon sizes here)
  './icons/icon72.png',
  './icons/icon96.png',
  './icons/icon128.png',
  './icons/icon144.png',
  './icons/icon152.png',
  './icons/icon192.png',
  './icons/icon384.png',
  './icons/icon512.png',

  // External libraries
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css',
  'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2'
];

// INSTALL EVENT
self.addEventListener('install', event => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      console.log('Caching Math Quest files...');
      return cache.addAll(urlsToCache);
    })
  );
});

// FETCH EVENT
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      // Return cached file if found
      if (response) {
        return response;
      }
      // Otherwise fetch from network
      return fetch(event.request).catch(() => {
        // Offline fallback - show the homepage
        return caches.match('./index.html');
      });
    })
  );
});

// ACTIVATE EVENT
self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (!cacheWhitelist.includes(cacheName)) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});
