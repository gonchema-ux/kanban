/* Service worker M1g: la app abre aunque haya mala cobertura. Nunca guarda las llamadas a Google (datos siempre del servidor). */
const CACHE = 'kanban-movil-m1g';
self.addEventListener('install', e => { self.skipWaiting(); });
self.addEventListener('activate', e => { e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim())); });
self.addEventListener('fetch', e => {
  const r = e.request, u = new URL(r.url);
  if (r.method !== 'GET' || u.origin !== location.origin) return;           // Google Sheets y demás: directo a la red
  e.respondWith(fetch(r).then(res => { const c = res.clone(); caches.open(CACHE).then(ca => ca.put(r, c)); return res; }).catch(() => caches.match(r).then(m => m || caches.match('./'))));
});
