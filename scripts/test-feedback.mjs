import test from "node:test";
import assert from "node:assert/strict";
import { onRequest } from "../functions/api/feedback.js";

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
  const response = await onRequest({ request: post(valid), env: { FEEDBACK: kv } });
  assert.equal(response.status, 201);
  const [[key, entry]] = saved(kv);
  const record = JSON.parse(entry.value);
  assert.match(key, /^feedback:\d{4}-\d\d-\d\dT/);
  assert.equal(record.kind, "bug");
  assert.equal(record.mapView, "60.1,10.2,7");
  assert.equal(record.userAgent, "test-agent");
  assert.equal(record.notification.status, "not_configured");
  assert.ok(!entry.value.includes("203.0.113.7"));
  assert.deepEqual(entry.metadata, { kind: "bug", preview: valid.message });
});

test("rejects invalid input and foreign origins", async () => {
  const kv = fakeKv();
  const env = { FEEDBACK: kv };
  assert.equal((await onRequest({ request: post({ ...valid, kind: "spam" }), env })).status, 400);
  assert.equal((await onRequest({ request: post({ ...valid, message: " " }), env })).status, 400);
  assert.equal((await onRequest({ request: post({ ...valid, email: "geen-adres" }), env })).status, 400);
  assert.equal((await onRequest({ request: post("{", {}), env })).status, 400);
  assert.equal((await onRequest({ request: post(valid, { origin: "https://evil.example" }), env })).status, 403);
  assert.equal((await onRequest({ request: post(valid, { contentType: "text/plain" }), env })).status, 415);
  assert.equal((await onRequest({ request: post({ ...valid, message: "x".repeat(9000) }), env })).status, 413);
  assert.equal(saved(kv).length, 0);
});

test("honeypot submissions look successful but are not stored", async () => {
  const kv = fakeKv();
  const response = await onRequest({ request: post({ ...valid, website: "http://spam" }), env: { FEEDBACK: kv } });
  assert.equal(response.status, 201);
  assert.equal(saved(kv).length, 0);
});

test("limits each visitor to five messages per hour", async () => {
  const kv = fakeKv();
  const env = { FEEDBACK: kv };
  for (let i = 0; i < 5; i++) assert.equal((await onRequest({ request: post(valid), env })).status, 201);
  assert.equal((await onRequest({ request: post(valid), env })).status, 429);
  assert.equal((await onRequest({ request: post(valid, { ip: "198.51.100.1" }), env })).status, 201);
});

test("reports a clear error until the KV binding exists", async () => {
  const response = await onRequest({ request: post(valid), env: {} });
  assert.equal(response.status, 503);
});

test("non-POST requests receive a JSON method error with security headers", async () => {
  for (const method of ["GET", "OPTIONS", "PUT"]) {
    const response = await onRequest({ request: new Request("https://ridewithnook.com/api/feedback", { method }), env: {} });
    assert.equal(response.status, 405);
    assert.equal(response.headers.get("Allow"), "POST");
    assert.equal(response.headers.get("X-Content-Type-Options"), "nosniff");
    assert.equal(response.headers.get("Cross-Origin-Resource-Policy"), "same-origin");
    assert.deepEqual(await response.json(), { error: "Method not allowed." });
  }
});

test("rejects non-object JSON and incorrect media types without storing anything", async () => {
  const kv = fakeKv();
  for (const body of ["null", "[]", "true", "42", '"message"']) {
    assert.equal((await onRequest({ request: post(body), env: { FEEDBACK: kv } })).status, 400);
  }
  assert.equal((await onRequest({ request: post(valid, { contentType: "application/jsonp" }), env: { FEEDBACK: kv } })).status, 415);
  assert.equal(saved(kv).length, 0);
  assert.equal((await onRequest({ request: post(valid, { contentType: "Application/JSON; charset=utf-8" }), env: { FEEDBACK: kv } })).status, 201);
});

test("limits UTF-8 bytes and cancels oversized streaming bodies before reading them in full", async () => {
  const env = { FEEDBACK: fakeKv() };
  assert.equal((await onRequest({ request: post({ ...valid, message: "é".repeat(5000) }), env })).status, 413);
  let emitted = 0;
  let cancelled = false;
  const stream = new ReadableStream({
    pull(controller) { emitted++; controller.enqueue(new Uint8Array(1000)); if (emitted === 30) controller.close(); },
    cancel() { cancelled = true; },
  });
  const request = new Request("https://ridewithnook.com/api/feedback", { method: "POST", headers: { "Content-Type": "application/json" }, body: stream, duplex: "half" });
  assert.equal((await onRequest({ request, env })).status, 413);
  assert.ok(cancelled);
  assert.ok(emitted < 30, "The complete oversized body must not be buffered");
  assert.equal(saved(env.FEEDBACK).length, 0);
});

test("emails the configured owner after saving feedback, with optional reply-to and plain text", async (t) => {
  const kv = fakeKv();
  const tasks = [];
  let outgoing;
  t.mock.method(globalThis, "fetch", async (url, options) => {
    assert.equal(saved(kv).length, 1, "Feedback must be saved before email is attempted");
    assert.equal(url, "https://api.resend.com/emails");
    assert.equal(options.headers.Authorization, "Bearer server-only-test-key");
    assert.equal(options.headers["Idempotency-Key"], saved(kv)[0][0]);
    outgoing = JSON.parse(options.body);
    return Response.json({ id: "notification-123" });
  });
  const response = await onRequest({
    request: post({ ...valid, email: "visitor@example.com", message: "A <b>missing</b> place" }),
    env: { FEEDBACK: kv, RESEND_API_KEY: "server-only-test-key", FEEDBACK_EMAIL_TO: "owner@example.com" },
    waitUntil(task) { tasks.push(task); },
  });
  assert.equal(response.status, 201);
  assert.deepEqual(await response.json(), { ok: true });
  await Promise.all(tasks);
  assert.equal(tasks.length, 1);
  assert.deepEqual(outgoing.to, ["owner@example.com"]);
  assert.equal(outgoing.reply_to, "visitor@example.com");
  assert.equal(outgoing.subject, "[Nook] Nieuwe feedback: Bug");
  assert.ok(outgoing.text.includes("A <b>missing</b> place"));
  assert.ok(outgoing.text.includes("60.1,10.2,7"));
  assert.ok(!("html" in outgoing));
  const record = JSON.parse(saved(kv)[0][1].value);
  assert.equal(record.notification.status, "sent");
  assert.equal(record.notification.id, "notification-123");
});

test("visitors without an email address can still submit feedback and trigger a notification", async (t) => {
  const kv = fakeKv();
  t.mock.method(globalThis, "fetch", async (url, options) => {
    const outgoing = JSON.parse(options.body);
    assert.ok(!("reply_to" in outgoing));
    assert.ok(outgoing.text.includes("Niet opgegeven"));
    assert.equal(outgoing.from, "Nook <feedback@example.com>");
    return Response.json({ id: "notification-no-visitor-email" });
  });
  const response = await onRequest({ request: post(valid), env: {
    FEEDBACK: kv, RESEND_API_KEY: "test", FEEDBACK_EMAIL_TO: "owner@example.com", FEEDBACK_EMAIL_FROM: "Nook <feedback@example.com>",
  } });
  assert.equal(response.status, 201);
  assert.equal(JSON.parse(saved(kv)[0][1].value).notification.status, "sent");
});

test("failed or unconfirmed email delivery preserves accepted feedback and records the failure", async (t) => {
  t.mock.method(console, "error", () => {});
  for (const failure of ["provider", "network", "no-acknowledgement"]) {
    const kv = fakeKv();
    const tasks = [];
    t.mock.method(globalThis, "fetch", async () => {
      if (failure === "network") throw new Error("Network timeout");
      if (failure === "provider") return Response.json({ error: "Unavailable" }, { status: 503 });
      return Response.json({});
    });
    const response = await onRequest({ request: post(valid), env: {
      FEEDBACK: kv, RESEND_API_KEY: "test", FEEDBACK_EMAIL_TO: "owner@example.com",
    }, waitUntil(task) { tasks.push(task); } });
    assert.equal(response.status, 201);
    await Promise.all(tasks);
    const record = JSON.parse(saved(kv)[0][1].value);
    assert.equal(record.message, valid.message);
    assert.equal(record.notification.status, "failed");
  }
});

test("honeypot and rate-limited submissions never trigger notification email", async (t) => {
  const kv = fakeKv();
  let sent = 0;
  t.mock.method(globalThis, "fetch", async () => {
    sent++;
    return Response.json({ id: "mail-" + sent });
  });
  const env = { FEEDBACK: kv, RESEND_API_KEY: "test", FEEDBACK_EMAIL_TO: "owner@example.com" };
  assert.equal((await onRequest({ request: post({ ...valid, website: "spam" }), env })).status, 201);
  assert.equal(sent, 0);
  for (let index = 0; index < 5; index++) await onRequest({ request: post(valid), env });
  assert.equal(sent, 5);
  assert.equal((await onRequest({ request: post(valid), env })).status, 429);
  assert.equal(sent, 5);
});
