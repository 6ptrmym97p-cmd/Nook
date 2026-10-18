/* Supercluster is the spatial index used by Mapbox. Keep index construction,
 * filtering and cluster queries off the UI thread. */
importScripts("vendor/supercluster-8.0.1.min.js");

let manifest;
let points;
let tree;
let filterKey;
let route = null;
const providers = ["vodf", "wtmg", "camping", "campwild", "denmark"];

const ready = (async () => {
  const response = await cachedData("data/map-index.json?v=20261016-4");
  if (!response.ok) throw new Error(`Kaartindex: HTTP ${response.status}`);
  manifest = await response.json();
  const compressed = manifest.gzip && typeof DecompressionStream !== "undefined";
  const binary = await cachedData(`data/${compressed ? manifest.gzip : "map-points.bin"}?v=${manifest.version}`);
  if (!binary.ok) throw new Error(`Kaartpunten: HTTP ${binary.status}`);
  let buffer = await binary.arrayBuffer();
  // GitHub Pages does not compress .bin responses. Use explicit compression,
  // while retaining the plain index for browsers without DecompressionStream.
  const magic = new Uint8Array(buffer);
  if (compressed && magic[0] === 0x1f && magic[1] === 0x8b) {
    buffer = await new Response(new Blob([buffer]).stream().pipeThrough(new DecompressionStream("gzip"))).arrayBuffer();
  }
  if (manifest.recordBytes !== 16 || buffer.byteLength !== manifest.count * 16) throw new Error("Kaartindex is onvolledig");
  const view = new DataView(buffer);
  points = Array.from({ length: manifest.count }, (_, id) => {
    const offset = id * 16;
    const chunk = view.getUint16(offset + 8, true);
    const source = manifest.chunks[chunk];
    return {
      type: "Feature",
      geometry: { type: "Point", coordinates: [view.getInt32(offset, true) / 1e6, view.getInt32(offset + 4, true) / 1e6] },
      properties: { id, chunk, offset: view.getUint16(offset + 10, true), kind: source.kind, country: source.country, type: manifest.types[view.getUint8(offset + 12)] },
    };
  });
  self.postMessage({ type: "ready", manifest });
})();
// Report initialization failures even before the first query arrives.
ready.catch((error) => self.postMessage({ type: "error", message: error.message }));

async function cachedData(url) {
  // Workers may start before the service worker controls the first page load.
  // Retain the compact index explicitly so one online visit also works offline.
  if (!("caches" in self)) return fetch(url);
  let cache;
  try {
    cache = await caches.open("nook-runtime-20261016-4");
    const cached = await cache.match(url);
    if (cached) return cached;
  } catch { /* Private browsing or unavailable storage: use the network. */ }
  const response = await fetch(url);
  if (response.ok && cache) {
    try { await cache.put(url, response.clone()); } catch { /* A full cache must not hide downloaded points. */ }
  }
  return response;
}

function withinRoute(point) {
  if (!route) return true;
  const [lng, lat] = point.geometry.coordinates;
  const distance = route.distanceKm;
  const latPadding = distance / 110.574;
  const lngPadding = distance / Math.max(20, 111.32 * Math.cos(lat * Math.PI / 180));
  const seen = new Set();
  for (let y = Math.floor((lat - latPadding) / 0.25); y <= Math.floor((lat + latPadding) / 0.25); y++) {
    for (let x = Math.floor((lng - lngPadding) / 0.25); x <= Math.floor((lng + lngPadding) / 0.25); x++) {
      for (const segment of route.grid.get(`${y}:${x}`) || []) {
        if (seen.has(segment.id)) continue;
        seen.add(segment.id);
        const scale = 111.32 * Math.cos(lat * Math.PI / 180);
        const ax = (segment.start.lng - lng) * scale;
        const ay = (segment.start.lat - lat) * 110.574;
        const bx = (segment.end.lng - lng) * scale;
        const by = (segment.end.lat - lat) * 110.574;
        const dx = bx - ax;
        const dy = by - ay;
        const length = dx * dx + dy * dy;
        const fraction = length ? Math.max(0, Math.min(1, -(ax * dx + ay * dy) / length)) : 0;
        if (Math.hypot(ax + fraction * dx, ay + fraction * dy) <= distance) return true;
      }
    }
  }
  return false;
}

function makeTree(filters) {
  const types = new Set(filters.types);
  const networks = new Set(filters.networks);
  const countries = filters.countries ? new Set(filters.countries) : null;
  const selected = points.filter((point) => {
    const p = point.properties;
    const confidence = p.kind === "denmark" ? 3 : p.kind === "camping" ? 1 : 2;
    return types.has(p.type) && confidence >= filters.confidence
      && (!countries || countries.has(p.country))
      && (p.type !== "host" || networks.has(p.kind))
      && withinRoute(point);
  });
  return new Supercluster({
    radius: 80,
    extent: 256,
    maxZoom: 19,
    // Counts preserve per-provider status without sending thousands of pins.
    map: (p) => Object.fromEntries(providers.map((kind) => [kind, Number(p.kind === kind)])),
    reduce: (total, counts) => providers.forEach((kind) => { total[kind] += counts[kind]; }),
  }).load(selected);
}

// Initialization may be slow on mobile: retain just the latest map request.
let pending;
let processing = false;
self.onmessage = (event) => {
  if (event.data.type === "route") {
    route = event.data.route;
    filterKey = undefined;
    return;
  }
  pending = event.data;
  processQueries();
};

async function processQueries() {
  if (processing) return;
  processing = true;
  try {
    await ready;
    while (pending) {
      const request = pending;
      pending = null;
      const key = JSON.stringify(request.filters);
      if (!tree || filterKey !== key) {
        tree = makeTree(request.filters);
        filterKey = key;
      }
      if (request.type === "leaves") {
        self.postMessage({ type: "leaves", requestId: request.requestId, points: tree.getLeaves(request.cluster, Infinity).map(compactPoint) });
        continue;
      }
      const features = tree.getClusters(request.bounds, Math.floor(request.zoom));
      const counts = Object.fromEntries(providers.map((kind) => [kind, 0]));
      for (const feature of features) {
        const p = feature.properties;
        if (p.cluster) providers.forEach((kind) => { counts[kind] += p[kind]; });
        else counts[p.kind]++;
      }
      self.postMessage({
        type: "clusters", requestId: request.requestId, counts,
        features: features.map((feature) => feature.properties.cluster ? {
          lat: feature.geometry.coordinates[1], lng: feature.geometry.coordinates[0],
          cluster: feature.properties.cluster_id, count: feature.properties.point_count,
          zoom: tree.getClusterExpansionZoom(feature.properties.cluster_id),
        } : compactPoint(feature)),
        // Candidate ranking is only needed when its panel is open.
        points: request.candidates ? tree.getClusters(request.candidateBounds || request.bounds, 20).map(compactPoint) : [],
      });
    }
  } catch (error) {
    self.postMessage({ type: "error", message: error.message });
  } finally {
    processing = false;
  }
}

function compactPoint(feature) {
  return { ...feature.properties, lat: feature.geometry.coordinates[1], lng: feature.geometry.coordinates[0] };
}
