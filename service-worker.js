// Minimal service worker: caches the app shell so it still opens (with last-seen
// data) if a friend loses signal, and satisfies Chrome/Android's install criteria.
// Bump CACHE_NAME any time you push a new version so old caches get cleared out.
const CACHE_NAME = 'dr-master-shell-v14';
const SHELL_FILES = [
  './',
  './index.html',
  './manifest.json',
  './icons/icon-192.png',
  './icons/icon-512.png',
  './assets/mascots/icon_about.png',
  './assets/mascots/icon_darkmode.png',
  './assets/mascots/icon_hourglass.png',
  './assets/mascots/icon_language.png',
  './assets/mascots/icon_methodology.png',
  './assets/mascots/icon_reset.png',
  './assets/mascots/icon_resetall.png',
  './assets/mascots/icon_star_filled.png',
  './assets/mascots/icon_star_outline.png',
  './assets/mascots/mascot_check.png',
  './assets/mascots/mascot_gift.png',
  './assets/mascots/mascot_lock.png',
  './assets/mascots/mascot_milestone.png',
  './assets/mascots/mascot_persona_ai.png',
  './assets/mascots/mascot_persona_allin.png',
  './assets/mascots/mascot_persona_balanced.png',
  './assets/mascots/mascot_persona_bluechip.png',
  './assets/mascots/mascot_persona_china.png',
  './assets/mascots/mascot_persona_chips.png',
  './assets/mascots/mascot_persona_crypto.png',
  './assets/mascots/mascot_persona_dca.png',
  './assets/mascots/mascot_persona_diamond.png',
  './assets/mascots/mascot_persona_health.png',
  './assets/mascots/mascot_persona_highroller.png',
  './assets/mascots/mascot_persona_income.png',
  './assets/mascots/mascot_persona_index.png',
  './assets/mascots/mascot_persona_luxury.png',
  './assets/mascots/mascot_persona_seed.png',
  './assets/mascots/mascot_persona_space.png'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(SHELL_FILES))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

// Network-first for the HTML shell (so you always get the latest version when
// online), falling back to cache when offline. Cache-first for everything else.
self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;

  const isNavigation = event.request.mode === 'navigate';

  if (isNavigation) {
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          const copy = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put('./index.html', copy));
          return response;
        })
        .catch(() => caches.match('./index.html'))
    );
    return;
  }

  event.respondWith(
    caches.match(event.request).then((cached) => {
      return cached || fetch(event.request).then((response) => {
        const copy = response.clone();
        caches.open(CACHE_NAME).then((cache) => cache.put(event.request, copy));
        return response;
      }).catch(() => cached);
    })
  );
});
