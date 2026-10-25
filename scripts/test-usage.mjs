import test from 'node:test';
import assert from 'node:assert/strict';
import { onRequest } from '../functions/api/gpx-import.js';
const url = 'https://ridewithnook.com/api/gpx-import';
const request = (options = {}) => new Request(url, { method: 'POST', headers: { Origin: new URL(url).origin }, ...options });

test('empty import events store no route, identity or exact timestamp and expire', async () => {
  const stored = [];
  const env = { USAGE: { put: async (...args) => stored.push(args) } };
  for (let i = 0; i < 2; i++) assert.equal((await onRequest({ request: request(), env })).status, 204);
  assert.equal(stored.length, 2);
  assert.notEqual(stored[0][0], stored[1][0], 'Concurrent events have separate keys');
  for (const [key, value, options] of stored) {
    assert.match(key, /^gpx-import:\d{4}-\d{2}-\d{2}:[a-f0-9-]{36}$/);
    assert.equal(value, '1');
    assert.deepEqual(options, { expirationTtl: 90 * 86400 });
  }
});
test('foreign or missing origin, supplied data and reads are rejected without storage', async () => {
  const env = { USAGE: { put: () => assert.fail('must not store') } };
  for (const headers of [{}, { Origin: 'https://other.example' }]) assert.equal((await onRequest({ request: request({ headers }), env })).status, 403);
  assert.equal((await onRequest({ request: request({ body: '<gpx>private</gpx>' }), env })).status, 400);
  const response = await onRequest({ request: new Request(url), env });
  assert.equal(response.status, 405);
  assert.equal(response.headers.get('Allow'), 'POST');
  assert.equal(response.headers.get('Cache-Control'), 'no-store');
});
test('privacy signals skip storage; missing storage and errors fail quietly', async () => {
  const env = { USAGE: { put: () => assert.fail('must not store') } };
  for (const header of ['DNT', 'Sec-GPC']) assert.equal((await onRequest({ request: request({ headers: { Origin: new URL(url).origin, [header]: '1' } }), env })).status, 204);
  assert.equal((await onRequest({ request: request(), env: {} })).status, 503);
  assert.equal((await onRequest({ request: request(), env: { USAGE: { put: async () => { throw Error(); } } } })).status, 503);
});

test('Cloudflare-style empty request streams count without requiring a null body', async () => {
  let count = 0;
  const env = { USAGE: { put: async () => count++ } };
  const body = new ReadableStream({ start(controller) { controller.close(); } });
  assert.equal((await onRequest({ request: request({ body, duplex: 'half' }), env })).status, 204);
  assert.equal(count, 1);
});
