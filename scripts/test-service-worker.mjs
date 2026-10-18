import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import vm from "node:vm";

const origin = "https://example.test/Nook/";
const absolute = (request) => new URL(typeof request === "string" ? request : request.url, origin).href;

function setup() {
  const stores = new Map();
  const listeners = new Map();
  let offline = false;
  class Cache {
    entries = new Map();
    failWrites = false;
    async match(request, { ignoreSearch = false } = {}) {
      const url = absolute(request);
      const key = ignoreSearch ? [...this.entries.keys()].find((key) => key.split("?")[0] === url.split("?")[0]) : url;
      return this.entries.get(key)?.clone();
    }
    async put(request, response) {
      if (this.failWrites) throw new Error("QuotaExceededError");
      this.entries.set(absolute(request), response.clone());
    }
    async keys() { return [...this.entries.keys()].map((url) => ({ url })); }
    async delete(request) { return this.entries.delete(absolute(request)); }
  }
  const caches = {
    async open(name) { if (!stores.has(name)) stores.set(name, new Cache()); return stores.get(name); },
    async keys() { return [...stores.keys()]; },
    async delete(name) { return stores.delete(name); },
    async match(request) {
      for (const cache of stores.values()) { const response = await cache.match(request); if (response) return response; }
    },
  };
  const context = vm.createContext({
    caches, URL, Response, console,
    fetch: async () => { if (offline) throw new TypeError("Offline"); return new Response("network response"); },
    self: { location: { origin: new URL(origin).origin }, addEventListener: (name, listener) => listeners.set(name, listener), skipWaiting() {}, clients: { async claim() {} } },
  });
  vm.runInContext(fs.readFileSync(new URL("../service-worker.js", import.meta.url), "utf8"), context);
  return {
    caches,
    names: vm.runInContext("({ shell: SHELL_CACHE, runtime: RUNTIME_CACHE, tiles: TILE_CACHE })", context),
    setOffline() { offline = true; },
    async activate() { let promise; listeners.get("activate")({ waitUntil(value) { promise = value; } }); await promise; },
    async fetch(url, mode = "cors", destination = "image") {
      let promise;
      listeners.get("fetch")({ request: { url: absolute(url), method: "GET", mode, destination }, respondWith(value) { promise = value; } });
      return promise;
    },
  };
}

test("tile eviction preserves the map index, place details and app shell", async () => {
  const app = setup();
  const data = await app.caches.open(app.names.runtime);
  await data.put("data/map-index.json", new Response("index"));
  await data.put("data/map-points.bin.gz", new Response("points"));
  await data.put("data/map-details/visited.json", new Response("details"));
  const tiles = await app.caches.open(app.names.tiles);
  for (let i = 0; i < 256; i++) await tiles.put(`https://tile.openstreetmap.org/10/${i}/1.png`, new Response("tile"));
  const response = await app.fetch("https://tile.openstreetmap.org/10/999/1.png");
  assert.equal(await response.text(), "network response");
  assert.equal((await tiles.keys()).length, 256);
  assert.equal(await (await data.match("data/map-points.bin.gz")).text(), "points");
  assert.equal(await (await data.match("data/map-details/visited.json")).text(), "details");
});

test("activation only removes obsolete Nook caches on a shared GitHub Pages origin", async () => {
  const app = setup();
  for (const name of ["another-app-v1", "nook-shell-old", "nook-runtime-old", app.names.shell, app.names.runtime, app.names.tiles]) await app.caches.open(name);
  await app.activate();
  assert.deepEqual(await app.caches.keys(), ["another-app-v1", app.names.shell, app.names.runtime, app.names.tiles]);
});

test("offline navigation uses the current release rather than an old runtime page", async () => {
  const app = setup();
  const runtime = await app.caches.open(app.names.runtime);
  const shell = await app.caches.open(app.names.shell);
  await runtime.put("index.html", new Response("old release"));
  await shell.put("index.html", new Response("current release"));
  app.setOffline();
  const response = await app.fetch("index.html?route=import", "navigate", "document");
  assert.equal(await response.text(), "current release");
});

test("a full browser cache does not block successful network responses", async () => {
  const app = setup();
  (await app.caches.open(app.names.runtime)).failWrites = true;
  (await app.caches.open(app.names.tiles)).failWrites = true;
  for (const [url, mode, destination] of [["over.html", "navigate", "document"], ["icon-512.png", "cors", "image"], ["https://tile.openstreetmap.org/1/1/1.png", "cors", "image"]]) {
    const response = await app.fetch(url, mode, destination);
    assert.equal(await response.text(), "network response");
  }
});

test("offline navigation resolves Cloudflare Pages extensionless HTML URLs", async () => {
  const app = setup();
  const shell = await app.caches.open(app.names.shell);
  await shell.put("over.html", new Response("about page"));
  await shell.put("index.html", new Response("map page"));
  app.setOffline();
  const response = await app.fetch("over?from=map", "navigate", "document");
  assert.equal(await response.text(), "about page");
});
