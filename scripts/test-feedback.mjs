import test from "node:test";
import assert from "node:assert/strict";
import { onRequestPost } from "../functions/api/feedback.js";

function fakeKv() {
  const store = new Map();
  return {
    store,
    async get(key) { return store.get(key)?.value ?? null; },
    async put(key, value, options = {}) { store.set(key, { value, ...options }); },
  };
}

function post(body, { origin = "https://ridewithnook.com", ip = "203.0.113.7", contentType = "application/json" } = {}) {
  return new Request("https://ridewithnook.com/api/feedback", {
    method: "POST",
    headers: { "Content-Type": contentType, Origin: origin, "CF-Connecting-IP": ip, "User-Agent": "test-agent" },
    body: typeof body === "string" ? body : JSON.stringify(body),
  });
}

const valid = { kind: "bug", message: "De kaart laadt niet in Noorwegen.", email: "", context: { page: "/", mapView: "60.1,10.2,7" } };
const saved = (kv) => [...kv.store.entries()].filter(([key]) => key.startsWith("feedback:"));

test("stores valid feedback without the visitor IP", async () => {
  const kv = fakeKv();
  const response = await onRequestPost({ request: post(valid), env: { FEEDBACK: kv } });
  assert.equal(response.status, 201);
  const [[key, entry]] = saved(kv);
  const record = JSON.parse(entry.value);
  assert.match(key, /^feedback:\d{4}-\d\d-\d\dT/);
  assert.equal(record.kind, "bug");
  assert.equal(record.mapView, "60.1,10.2,7");
  assert.equal(record.userAgent, "test-agent");
  assert.ok(!entry.value.includes("203.0.113.7"));
  assert.deepEqual(entry.metadata, { kind: "bug", preview: valid.message });
});

test("rejects invalid input and foreign origins", async () => {
  const kv = fakeKv();
  const env = { FEEDBACK: kv };
  assert.equal((await onRequestPost({ request: post({ ...valid, kind: "spam" }), env })).status, 400);
  assert.equal((await onRequestPost({ request: post({ ...valid, message: " " }), env })).status, 400);
  assert.equal((await onRequestPost({ request: post({ ...valid, email: "geen-adres" }), env })).status, 400);
  assert.equal((await onRequestPost({ request: post("{", {}), env })).status, 400);
  assert.equal((await onRequestPost({ request: post(valid, { origin: "https://evil.example" }), env })).status, 403);
  assert.equal((await onRequestPost({ request: post(valid, { contentType: "text/plain" }), env })).status, 415);
  assert.equal((await onRequestPost({ request: post({ ...valid, message: "x".repeat(9000) }), env })).status, 413);
  assert.equal(saved(kv).length, 0);
});

test("honeypot submissions look successful but are not stored", async () => {
  const kv = fakeKv();
  const response = await onRequestPost({ request: post({ ...valid, website: "http://spam" }), env: { FEEDBACK: kv } });
  assert.equal(response.status, 201);
  assert.equal(saved(kv).length, 0);
});

test("limits each visitor to five messages per hour", async () => {
  const kv = fakeKv();
  const env = { FEEDBACK: kv };
  for (let i = 0; i < 5; i++) assert.equal((await onRequestPost({ request: post(valid), env })).status, 201);
  assert.equal((await onRequestPost({ request: post(valid), env })).status, 429);
  assert.equal((await onRequestPost({ request: post(valid, { ip: "198.51.100.1" }), env })).status, 201);
});

test("reports a clear error until the KV binding exists", async () => {
  const response = await onRequestPost({ request: post(valid), env: {} });
  assert.equal(response.status, 503);
});
