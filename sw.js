// Keeps the app's own files on the device so it opens without internet. Your data syncs separately.
const CACHE = 'leave-manager-7b490c22c3';
const FILES = ["./", "index.html", "forms/cl_rh.js", "forms/departure_report.js", "forms/examinership.js", "forms/food_bill.js", "forms/international_workshop.js", "forms/joining_report.js", "forms/leave_application.js", "forms/national_conference.js", "forms/private_foreign.js", "forms/ta_bill.js", "forms/visit_report.js"];
self.addEventListener('install', e => { e.waitUntil(caches.open(CACHE).then(c => c.addAll(FILES)).then(() => self.skipWaiting())); });
self.addEventListener('activate', e => { e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim())); });
self.addEventListener('fetch', e => {
  const u = new URL(e.request.url);
  if (e.request.method !== 'GET' || u.origin !== location.origin) return;
  // Network first so updates show at once; the saved copy when offline.
  e.respondWith(fetch(e.request).then(r => { const copy = r.clone(); caches.open(CACHE).then(c => c.put(e.request, copy)); return r; })
    .catch(() => caches.match(e.request, { ignoreSearch: true }).then(r => r || caches.match('index.html'))));
});
