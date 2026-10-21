import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import vm from "node:vm";
import crypto from "node:crypto";
import { gunzipSync } from "node:zlib";
import { fileURLToPath } from "node:url";
import { buildMapData } from "./build-map-data.mjs";

const root = fileURLToPath(new URL("../", import.meta.url));

test("PWA leaves native page zoom, map gestures and rapid control taps intact", () => {
  const listeners = new Map();
  let now = 1000;
  const context = vm.createContext({
    document: { addEventListener: (type, listener) => listeners.set(type, listener) },
    navigator: {}, window: {},
    Date: { now: () => now },
  });
  vm.runInContext(fs.readFileSync(path.join(root, "pwa.js"), "utf8"), context);
  const event = (map) => ({
    target: { closest: () => map ? {} : null },
    prevented: false,
    preventDefault() { this.prevented = true; },
  });
  for (const type of ["gesturestart", "gesturechange", "gestureend"]) {
    const mapGesture = event(true);
    listeners.get(type)?.(mapGesture);
    assert.equal(mapGesture.prevented, false, `${type} belongs to Leaflet`);
    const pageGesture = event(false);
    listeners.get(type)?.(pageGesture);
    assert.equal(pageGesture.prevented, false, "Page pinch zoom remains available");
  }
  for (let i = 0; i < 3; i++) {
    const tap = event(true);
    listeners.get("touchend")?.(tap);
    assert.equal(tap.prevented, false, "Rapid map taps must still dispatch clicks");
    now += 80;
  }
  const first = event(false);
  listeners.get("touchend")?.(first);
  assert.equal(first.prevented, false);
  now += 80;
  const second = event(false);
  listeners.get("touchend")?.(second);
  assert.equal(second.prevented, false, "Rapid taps on page controls must dispatch clicks");
});

test("vendored map styles and scripts match the HTML integrity checks", () => {
  const html = fs.readFileSync(path.join(root, "index.html"), "utf8");
  let checked = 0;
  for (const [tag] of html.matchAll(/<(?:script|link)\b[^>]*>/g)) {
    const file = tag.match(/(?:src|href)="(vendor\/[^"?]+)"/)?.[1];
    if (!file) continue;
    const integrity = tag.match(/integrity="([^"]+)"/)?.[1];
    const digest = crypto.createHash("sha256").update(fs.readFileSync(path.join(root, file))).digest("base64");
    assert.equal(integrity, `sha256-${digest}`, `${file} would be blocked by the browser`);
    checked++;
  }
  assert.equal(checked, 5);
});

function fixture(t, extraSnapshots = {}) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "nook-map-test-"));
  t.after(() => fs.rmSync(dir, { recursive: true, force: true }));
  const camping = Array.from({ length: 260 }, (_, i) => ({ lat: 51 + i / 1000, lng: 5.9, country: "NL", name: `Camping ${i} — café`, description: "Details blijven behouden" }));
  const snapshots = {
    "camping-NL": { places: camping },
    "camping-DE": { places: [{ lat: 51.1, lng: 6.1, country: "DE", name: "Over de grens" }] },
    "vodf-NL": { pins: [{ lat: 51.1, lng: 5.9, country: "NL", singleBeds: 2 }] },
    "campwild-DE": { places: [{ lat: 51.1, lng: 6.1, country: "DE", type: "hut", name: "Shelter" }] },
    ...extraSnapshots,
  };
  for (const [name, data] of Object.entries(snapshots)) fs.writeFileSync(path.join(dir, name + ".json"), JSON.stringify(data));
  const manifest = buildMapData(dir);
  return { dir, manifest, snapshots };
}

test("compact index preserves every point, country, type and complete detail record", (t) => {
  const { dir, manifest, snapshots } = fixture(t);
  assert.equal(manifest.count, 263);
  const bytes = fs.readFileSync(path.join(dir, "map-points.bin"));
  assert.deepEqual(gunzipSync(fs.readFileSync(path.join(dir, manifest.gzip))), bytes, "Compressed and fallback indexes must contain exactly the same points");
  const binary = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
  assert.equal(bytes.length, manifest.count * 16);
  const restored = new Map();
  for (let id = 0; id < manifest.count; id++) {
    const offset = id * 16;
    const source = manifest.chunks[binary.getUint16(offset + 8, true)];
    const rows = JSON.parse(fs.readFileSync(path.join(dir, source.file)));
    assert.ok(rows.length <= 128);
    const row = rows[binary.getUint16(offset + 10, true)];
    assert.ok(Math.abs(row.lat - binary.getInt32(offset + 4, true) / 1e6) <= 0.0000005);
    assert.ok(Math.abs(row.lng - binary.getInt32(offset, true) / 1e6) <= 0.0000005);
    assert.equal(manifest.types[binary.getUint8(offset + 12)], source.kind === "camping" ? "camping" : source.kind === "vodf" ? "host" : row.type);
    const key = `${source.kind}-${source.country}`;
    if (!restored.has(key)) restored.set(key, []);
    restored.get(key).push(JSON.stringify(row));
  }
  for (const [key, snapshot] of Object.entries(snapshots)) assert.deepEqual(restored.get(key).sort(), (snapshot.pins || snapshot.places).map(JSON.stringify).sort());
  const repeated = buildMapData(dir);
  assert.deepEqual(repeated, manifest, "Rebuilding from generated detail batches must be deterministic");
});

async function worker(t, cacheFailure = null, extraSnapshots = {}) {
  const { dir } = fixture(t, extraSnapshots);
  const messages = [];
  const context = vm.createContext({
    console, DataView, Set, Map,
    fetch: async (url) => {
      const bytes = fs.readFileSync(path.join(dir, url.replace(/^data\//, "").split("?")[0]));
      return { ok: true, clone: () => ({}), json: async () => JSON.parse(bytes), arrayBuffer: async () => bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength) };
    },
    self: { postMessage: (message) => messages.push(message) },
  });
  if (cacheFailure) {
    const caches = { open: async () => {
      if (cacheFailure === "open") throw new Error("Storage unavailable");
      return { match: async () => null, put: async () => { throw new Error("QuotaExceededError"); } };
    } };
    context.caches = caches;
    context.self.caches = caches;
  }
  context.importScripts = (file) => vm.runInContext(fs.readFileSync(path.join(root, file), "utf8"), context);
  vm.runInContext(fs.readFileSync(path.join(root, "map-worker.js"), "utf8"), context);
  let id = 0;
  const filters = { countries: null, types: ["host", "camping", "hut"], networks: ["vodf", "wtmg"], confidence: 1 };
  return {
    route: (route) => context.self.onmessage({ data: { type: "route", route } }),
    query: async (overrides = {}) => {
      const requestId = ++id;
      context.self.onmessage({ data: { type: "query", requestId, filters, zoom: 6, bounds: [-180, -85, 180, 85], candidates: true, ...overrides } });
      for (let i = 0; i < 100; i++) {
        await new Promise((resolve) => setImmediate(resolve));
        const error = messages.find((message) => message.type === "error");
        if (error) throw new Error(error.message);
        const result = messages.find((message) => message.requestId === requestId);
        if (result) return result;
      }
      throw new Error("Worker did not respond");
    },
    filters,
  };
}

test("worker uses downloaded points when browser storage is unavailable or full", async (t) => {
  for (const failure of ["open", "write"]) {
    const w = await worker(t, failure);
    const result = await w.query();
    assert.equal(result.points.length, 263, `${failure}: downloaded places remain available`);
  }
});

test("refreshing 1NITE TENT preserves other providers and removes stale source countries", (t) => {
  const { dir, manifest } = fixture(t);
  const original = new Map(manifest.chunks.map((chunk) => [chunk.file, fs.readFileSync(path.join(dir, chunk.file), "utf8")]));
  fs.writeFileSync(path.join(dir, "nitetent-DE.json"), JSON.stringify({ pins: [{ lat: 51.2, lng: 6.2, country: "DE", type: "host" }] }));
  fs.writeFileSync(path.join(dir, "nitetent-NL.json"), JSON.stringify({ pins: [{ lat: 52, lng: 5, country: "NL", type: "host" }] }));
  assert.equal(buildMapData(dir).count, 265);
  fs.writeFileSync(path.join(dir, "nitetent-DE.json"), JSON.stringify({ pins: [{ lat: 51.3, lng: 6.3, country: "DE", type: "host" }] }));
  const refreshed = buildMapData(dir);
  assert.equal(refreshed.count, 264);
  assert.ok(!refreshed.chunks.some((chunk) => chunk.kind === "nitetent" && chunk.country === "NL"));
  assert.ok(!fs.existsSync(path.join(dir, "map-details/nitetent-NL-000.json")));
  for (const [file, bytes] of original) assert.equal(fs.readFileSync(path.join(dir, file), "utf8"), bytes);
  assert.deepEqual(buildMapData(dir), refreshed);
});

test("1NITE TENT is a host network included in clusters, candidates and source filtering", async (t) => {
  const w = await worker(t, null, { "nitetent-DE": { pins: [{ lat: 51.15, lng: 6.15, country: "DE", type: "host" }] } });
  const selected = await w.query({ filters: { ...w.filters, networks: ["nitetent"], types: ["host"] } });
  assert.equal(selected.counts.nitetent, 1);
  assert.equal(selected.points.length, 1);
  assert.equal(selected.points[0].kind, "nitetent");
  assert.equal(selected.points[0].type, "host");
  const hidden = await w.query({ filters: { ...w.filters, networks: [], types: ["host"] } });
  assert.equal(hidden.counts.nitetent, 0);
  assert.equal(hidden.features.length, 0);
});

test("worker clusters spatially across borders and queries only the viewport", async (t) => {
  const w = await worker(t);
  const result = await w.query();
  assert.equal(result.points.length, 263);
  assert.ok(result.features.length < 10, "Hundreds of points should become a few spatial clusters");
  assert.equal(result.counts.camping, 261);
  assert.ok(result.features.some((feature) => feature.count > 261), "Clusters must cross country borders");
  const localCandidates = await w.query({ candidateBounds: [6, 51, 6.2, 51.2] });
  assert.equal(localCandidates.points.length, 2, "Candidate requests must stay near the anchor even on a continental map");
  const empty = await w.query({ bounds: [-10, 20, -9, 21] });
  assert.equal(empty.features.length, 0);
  const nl = await w.query({ filters: { ...w.filters, countries: ["NL"] } });
  assert.equal(nl.points.length, 261);
  assert.ok(nl.points.every((point) => point.country === "NL"));
  const noHosts = await w.query({ filters: { ...w.filters, networks: [] } });
  assert.equal(noHosts.counts.vodf, 0);
  const shelters = await w.query({ filters: { ...w.filters, types: ["hut"] } });
  assert.equal(shelters.points.length, 1);
  assert.equal(shelters.points[0].kind, "campwild");
});

test("worker route filter affects counts, cluster contents and candidate points", async (t) => {
  const w = await worker(t);
  const segment = { id: 0, start: { lat: 51, lng: 5.9 }, end: { lat: 51.3, lng: 5.9 } };
  const grid = new Map([["204:23", [segment]], ["205:23", [segment]]]);
  w.route({ grid, distanceKm: 1 });
  const result = await w.query();
  assert.equal(result.counts.camping, 260);
  assert.equal(result.counts.campwild, 0);
  assert.equal(result.points.length, 261);
  w.route(null);
  const restored = await w.query();
  assert.equal(restored.points.length, 263);
});

test("coincident locations remain accessible when the map cannot zoom further", async (t) => {
  const w = await worker(t);
  const result = await w.query({ zoom: 19 });
  const cluster = result.features.find((feature) => feature.count === 2);
  assert.ok(cluster);
  const leaves = await w.query({ type: "leaves", cluster: cluster.cluster });
  assert.equal(leaves.points.length, 2);
  assert.ok(leaves.points.every((point) => Number.isInteger(point.chunk) && Number.isInteger(point.offset)));
});
