import test from "node:test";
import assert from "node:assert/strict";
import { normalizeTentPositions } from "./import-1nitetent.mjs";

const point = (lng, lat, properties = {}) => ({ type: "Feature", geometry: { type: "Point", coordinates: [lng, lat] }, properties });

test("1NITE TENT imports geographic facts without copying host names, prose or contact details", () => {
  const data = { type: "FeatureCollection", features: [point(6.25, 51.25, { name: "Private host name", description: "<script>bad()</script> personal description", link: "host@example.com" })] };
  const { pins, stats } = normalizeTentPositions(data, () => "DE");
  assert.equal(pins.length, 1);
  assert.deepEqual(Object.keys(pins[0]).sort(), ["country", "id", "lat", "lng", "type"]);
  assert.equal(pins[0].type, "host");
  assert.equal(pins[0].country, "DE");
  assert.ok(!JSON.stringify(pins).includes("Private"));
  assert.ok(!JSON.stringify(pins).includes("@"));
  assert.equal(stats.received, 1);
  assert.equal(normalizeTentPositions(data, () => "DE").pins[0].id, pins[0].id);
});

test("duplicate positions, invalid coordinates and locations without a known country do not become pins", () => {
  const data = { type: "FeatureCollection", features: [point(6, 51), point(6, 51), point(0, 0), point(200, 51), point("6", 51), point(7, 52), { geometry: null }] };
  const result = normalizeTentPositions(data, (lat) => lat === 51 ? "DE" : null);
  assert.equal(result.pins.length, 1);
  assert.deepEqual(result.stats, { received: 7, invalid: 4, duplicates: 1, unmapped: 1 });
  assert.throws(() => normalizeTentPositions({}, () => "DE"), /GeoJSON/);
});
