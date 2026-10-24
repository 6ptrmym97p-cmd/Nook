import test from "node:test";
import assert from "node:assert/strict";
import { normalizeRefuges, nearbyHuts, LICENSE } from "./import-refuges.mjs";

const hut = (id, changes = {}) => ({ type: "Feature", id, geometry: { type: "Point", coordinates: [6, 45] }, properties: { id, nom: "Cabane des Cyclistes", type: { id: 7 }, places: { valeur: 4 }, etat: { valeur: "" }, ...changes } });
const feed = (features) => ({ type: "FeatureCollection", copyright: "Refuges.info: CC By-Sa 2.0", features });

test("Refuges.info retains attribution and license while filtering to overnight huts", () => {
  const result = normalizeRefuges(feed([hut(1), hut(2, { type: { id: 23 } }), hut(3, { places: { valeur: 0 } }), hut(4, { etat: { valeur: "Fermée" } }), hut(5, { etat: { valeur: "Détruite" } }), hut(6, { etat: { valeur: "Clés à récupérer" } })]), () => "FR");
  assert.equal(result.places.length, 1);
  assert.equal(result.places[0].license, LICENSE);
  assert.equal(result.places[0].attribution, "Refuges.info contributors");
  assert.equal(result.places[0].capacity, 4);
  assert.equal(result.places[0].sourceUrl, "https://www.refuges.info/point/1/");
  assert.equal(result.places[0].type, "hut");
  assert.equal(result.stats.otherType, 1);
  assert.equal(result.stats.noBeds, 1);
  assert.equal(result.stats.restricted, 3);
  assert.throws(() => normalizeRefuges({ ...feed([]), copyright: "All rights reserved" }, () => "FR"), /license changed/);
});

test("invalid or duplicate entries and existing huts do not inflate the map", () => {
  const invalid = { ...hut(2), geometry: { type: "Point", coordinates: {} } };
  const result = normalizeRefuges(feed([hut(1), hut(1), invalid, hut(3)]), () => "FR", (lat, lng) => false);
  assert.equal(result.places.length, 2);
  assert.equal(result.stats.duplicates, 1);
  assert.equal(result.stats.invalid, 1);
  const occupied = normalizeRefuges(feed([hut(1)]), () => "FR", () => true);
  assert.equal(occupied.places.length, 0);
  assert.equal(occupied.stats.existing, 1);
  assert.equal(normalizeRefuges(feed([hut(1)]), () => null).stats.unmapped, 1);
});

test("nearby-hut matching works across grid cells and at northern latitudes", () => {
  const near = nearbyHuts([{ lat: 45.00999, lng: 6 }, { lat: 70, lng: 20.00999 }]);
  assert.equal(near(45.0101, 6), true);
  assert.equal(near(70, 20.0102), true);
  assert.equal(near(45.02, 6), false);
});
