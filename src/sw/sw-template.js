/* Service worker for Minnesstigen.
 *
 * Caches only the app's own static files (the build output) so the app works
 * fully offline after the first visit. Nothing else is fetched or cached:
 * all user data lives in IndexedDB.
 *
 * This file is a template: the build fills in the precache list and the
 * version (see swPlugin in vite.config.ts).
 */
const PRECACHE = __PRECACHE__;
const VERSION = __VERSION__;
// Mattedalen lives on the same origin (isacsvensson.github.io) and deletes every
// cache named `mattedalen-*` but its own, so this prefix must stay different.
const CACHE_PREFIX = 'minnesstigen-';
const CACHE = `${CACHE_PREFIX}${VERSION}`;
const SHELL = './index.html';

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE).then((cache) => cache.addAll(PRECACHE.map((path) => new Request(path, { cache: 'reload' })))),
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    (async () => {
      for (const key of await caches.keys()) {
        if (key.startsWith(CACHE_PREFIX) && key !== CACHE) await caches.delete(key);
      }
      await self.clients.claim();
    })(),
  );
});

/** The page asks a waiting worker to take over when it is safe to update. */
self.addEventListener('message', (event) => {
  if (event.data === 'skipWaiting') self.skipWaiting();
});

self.addEventListener('fetch', (event) => {
  const request = event.request;
  if (request.method !== 'GET') return;
  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;

  if (request.mode === 'navigate') {
    // Single-page app: a navigation gets the cached shell.
    event.respondWith(
      caches
        .match(request, { cacheName: CACHE, ignoreSearch: true })
        .then((file) => file ?? caches.match(SHELL, { cacheName: CACHE }))
        .then((cached) => cached ?? fetch(request)),
    );
    return;
  }
  event.respondWith(
    caches.match(request, { cacheName: CACHE, ignoreSearch: true }).then((cached) => cached ?? fetch(request)),
  );
});
