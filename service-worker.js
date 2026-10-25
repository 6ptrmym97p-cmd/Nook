const SHELL_CACHE = "nook-shell-20261025-1";
const RUNTIME_CACHE = "nook-runtime-20261024-1";
const TILE_CACHE = "nook-tiles-v1";
const MAX_TILES = 256;
const APP_SHELL = [
  "./",
  "./index.html",
  "./routebronnen.html",
  "./regels.html",
  "./netwerken.html",
  "./over.html",
  "./i18n.js?v=20261025-1",
  "./bootstrap.js?v=20261020-2",
  "./styles.css?v=20261024-2",
  "./app.js?v=20261025-1",
  "./map-canvas.js?v=20261021-2",
  "./map-worker.js?v=20261024-1",
  "./vendor/supercluster-8.0.1.min.js",
  "./vendor/leaflet-1.9.4/leaflet.js",
  "./vendor/leaflet-1.9.4/leaflet.css",
  "./vendor/leaflet.markercluster-1.5.3/leaflet.markercluster.js",
  "./vendor/leaflet.markercluster-1.5.3/MarkerCluster.css",
  "./vendor/leaflet.markercluster-1.5.3/MarkerCluster.Default.css",
  "./public-data.js?v=20261024-1",
  "./favicon.ico?v=20261016-5",
  "./favicon.svg?v=20261016-5",
  "./icon-192.png?v=20261016-5",
  "./icon-512.png?v=20261016-5",
  "./apple-touch-icon.png?v=20261016-5",
  "./manifest.webmanifest?v=20261020-2",
  "./pwa.js?v=20261018-1",
  "./feedback.js?v=20261020-3"
];

self.addEventListener("install", (event) => {
  event.waitUntil(caches.open(SHELL_CACHE).then((cache) => cache.addAll(APP_SHELL)));
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((key) => /^nook-(shell|runtime|tiles)-/.test(key) && ![SHELL_CACHE, RUNTIME_CACHE, TILE_CACHE].includes(key)).map((key) => caches.delete(key))))
      .then(() => self.clients.claim())
  );
});

async function networkFirst(request) {
  const cache = await caches.open(RUNTIME_CACHE);
  try {
    const response = await fetch(request);
    if (response.ok) {
      try { await cache.put(request, response.clone()); } catch { /* Full storage must not block an online page. */ }
    }
    return response;
  } catch (error) {
    // Prefer this release's HTML when an older navigation remains in runtime.
    const shell = await caches.open(SHELL_CACHE);
    const url = new URL(request.url);
    // Pages redirects /over.html to /over; retain the correct offline page.
    const htmlUrl = new URL(url);
    if (!htmlUrl.pathname.split("/").pop().includes(".")) {
      htmlUrl.pathname += htmlUrl.pathname.endsWith("/") ? "index.html" : ".html";
    }
    return (await shell.match(request, { ignoreSearch: true }))
      || (await shell.match(htmlUrl.href, { ignoreSearch: true }))
      || (await cache.match(request))
      || shell.match("./index.html");
  }
}

async function cacheFirst(request, isMapTile = false) {
  const cached = await caches.match(request);
  if (cached) return cached;
  const response = await fetch(request);
  if (response.ok || response.type === "opaque") {
    try {
      const cache = await caches.open(isMapTile ? TILE_CACHE : RUNTIME_CACHE);
      await cache.put(request, response.clone());
      if (isMapTile) {
        const keys = await cache.keys();
        await Promise.all(keys.slice(0, Math.max(0, keys.length - MAX_TILES)).map((key) => cache.delete(key)));
      }
    } catch { /* Keep serving a successful download if browser storage is full. */ }
  }
  return response;
}

self.addEventListener("fetch", (event) => {
  const request = event.request;
  if (request.method !== "GET") return;

  if (request.mode === "navigate") {
    event.respondWith(networkFirst(request));
    return;
  }

  const url = new URL(request.url);
  const isMapTile = url.hostname === "tile.openstreetmap.org";

  // Other cross-origin requests bypass the worker: its CSP (connect-src) would block them.
  if (url.origin === self.location.origin || isMapTile) {
    event.respondWith(cacheFirst(request, isMapTile));
  }
});
