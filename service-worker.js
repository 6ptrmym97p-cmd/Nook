const SHELL_CACHE = "nook-shell-20260708-9";
const RUNTIME_CACHE = "nook-runtime-20260708-9";
const APP_SHELL = [
  "./",
  "./index.html",
  "./routebronnen.html",
  "./regels.html",
  "./netwerken.html",
  "./over.html",
  "./styles.css?v=20260708-2",
  "./app.js?v=20260708-7",
  "./public-data.js?v=20260708-1",
  "./favicon.ico?v=20260708-1",
  "./favicon.svg?v=20260708-1",
  "./icon-192.png?v=20260708-1",
  "./icon-512.png?v=20260708-1",
  "./apple-touch-icon.png?v=20260708-1",
  "./manifest.webmanifest?v=20260708-1",
  "./pwa.js?v=20260616-3"
];

self.addEventListener("install", (event) => {
  event.waitUntil(caches.open(SHELL_CACHE).then((cache) => cache.addAll(APP_SHELL)));
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((key) => ![SHELL_CACHE, RUNTIME_CACHE].includes(key)).map((key) => caches.delete(key))))
      .then(() => self.clients.claim())
  );
});

async function networkFirst(request) {
  const cache = await caches.open(RUNTIME_CACHE);
  try {
    const response = await fetch(request);
    if (response.ok) cache.put(request, response.clone());
    return response;
  } catch (error) {
    return (await cache.match(request)) || (await caches.match(request)) || caches.match("./index.html");
  }
}

async function cacheFirst(request) {
  const cached = await caches.match(request);
  if (cached) return cached;
  const response = await fetch(request);
  if (response.ok || response.type === "opaque") {
    const cache = await caches.open(RUNTIME_CACHE);
    await cache.put(request, response.clone());
    const keys = await cache.keys();
    if (keys.length > 300) await cache.delete(keys[0]);
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
  const isMapTile = url.hostname.endsWith("basemaps.cartocdn.com");
  const isStaticAsset = request.destination === "style"
    || request.destination === "script"
    || request.destination === "font"
    || request.destination === "image";

  if (url.origin === self.location.origin || isMapTile || isStaticAsset) {
    event.respondWith(cacheFirst(request));
  }
});
