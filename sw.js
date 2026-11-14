// Always load the newest page: the page itself is fetched past the browser cache,
// so a home-screen app picks up a new version as soon as it is opened.
self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', e => e.waitUntil(self.clients.claim()));
self.addEventListener('fetch', e => {
  const r = e.request;
  if (r.mode === 'navigate') e.respondWith(fetch(r, { cache: 'no-store' }).catch(() => fetch(r)));
});
