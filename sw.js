const CACHE_NAME = 'airsense-static-v1';
const urlsToCache = [
  '/airsense/',
  '/airsense/index.html',
  '/airsense/core/static/core/css/home.css',
  '/airsense/core/static/core/js/home.js',
  '/airsense/core/static/core/js/translations.js',
  '/airsense/core/static/core/js/static-sentiment.js',
  '/airsense/core/static/core/js/local-storage-ui.js',
  '/airsense/core/static/core/icons/cloud.png',
  '/airsense/core/static/core/icons/favicon_airsense.ico',
  'https://cdn.jsdelivr.net/npm/chart.js'
];

// Install event - cache resources
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache.map(url => new Request(url, { cache: 'reload' })));
      })
      .catch(error => {
        console.error('Cache installation failed:', error);
      })
  );
  self.skipWaiting();
});

// Activate event - clean up old caches
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  return self.clients.claim();
});

// Fetch event - serve from cache, fallback to network
self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);
  
  // Cache API responses for 1 hour
  if (url.hostname === 'api.open-meteo.com' || url.hostname === 'air-quality-api.open-meteo.com') {
    event.respondWith(
      caches.open(CACHE_NAME).then(cache => {
        return cache.match(event.request).then(response => {
          const fetchPromise = fetch(event.request).then(networkResponse => {
            // Clone and cache the response
            cache.put(event.request, networkResponse.clone());
            return networkResponse;
          });
          
          // Return cached response if available, otherwise wait for network
          return response || fetchPromise;
        });
      })
    );
    return;
  }
  
  // For other requests, network first, fallback to cache
  event.respondWith(
    fetch(event.request)
      .then(response => {
        // Clone the response
        const responseClone = response.clone();
        
        // Cache successful responses
        if (response.status === 200) {
          caches.open(CACHE_NAME).then(cache => {
            cache.put(event.request, responseClone);
          });
        }
        
        return response;
      })
      .catch(() => {
        // If network fails, try cache
        return caches.match(event.request);
      })
  );
});
