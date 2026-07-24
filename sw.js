const CACHE_NAME = 'nominas-pwa-v2';
const urlsToCache = [
  './',
  './index.html',
  './style.css',
  './js/app.js',
  './js/state.js',
  './js/config.js',
  './js/utils.js',
  './js/modules/storage.js',
  './js/modules/auth.js',
  './js/modules/holidays.js',
  './js/modules/contracts.js',
  './js/modules/hours.js',
  './js/modules/salary.js',
  './js/modules/charts.js',
  './js/modules/pdf.js',
  './js/modules/excel.js',
  './js/modules/notifications.js',
  './js/modules/ui.js',
  './js/modules/calendar.js',
  './manifest.json',
  'https://cdn.jsdelivr.net/npm/remixicon@3.5.0/fonts/remixicon.css'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(urlsToCache))
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request);
    })
  );
});