#!/usr/bin/env node
// Rewrites FILTER_COUNTRIES in app.js for every country in a datasets/geo-countries GeoJSON.
// Hand-tuned existing entries are kept unless listed in --regenerate.
import fs from "node:fs";
import path from "node:path";
import { featureCode, polygonsOf } from "./country-lookup.mjs";

const args = new Map(process.argv.slice(2).map((arg) => {
  const [key, ...value] = arg.split("=");
  return [key, value.length ? value.join("=") : "true"];
}));
const appPath = path.resolve(args.get("--app") || "app.js");
const geojsonPath = args.get("--countries-geojson");
if (!geojsonPath) throw new Error("Gebruik --countries-geojson=pad/naar/countries.geojson");
const regenerate = new Set(String(args.get("--regenerate") || "").split(",").filter(Boolean));
// Uninhabited territories without sleeping places.
const exclude = new Set(String(args.get("--exclude") ?? "AQ,UM,HM,TF,IO,GS,BV").split(",").filter(Boolean));

const source = fs.readFileSync(appPath, "utf8");
const block = source.match(/const FILTER_COUNTRIES = \[\n([\s\S]*?)\n\];\n/);
if (!block) throw new Error("FILTER_COUNTRIES niet gevonden in app.js");
const existing = new Map(block[1].split("\n").map((line) => [line.match(/code: "([A-Z]{2})"/)?.[1], line]).filter(([code]) => code));

function ringArea(ring) {
  let area = 0;
  for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) area += (ring[j][0] + ring[i][0]) * (ring[j][1] - ring[i][1]);
  return Math.abs(area / 2);
}

function boundsOf(rings, shift) {
  const b = { south: 90, north: -90, west: Infinity, east: -Infinity };
  for (const ring of rings) for (const [rawLng, lat] of ring) {
    const lng = shift && rawLng < 0 ? rawLng + 360 : rawLng;
    b.south = Math.min(b.south, lat); b.north = Math.max(b.north, lat);
    b.west = Math.min(b.west, lng); b.east = Math.max(b.east, lng);
  }
  return b;
}

const polygonsByCode = new Map();
for (const feature of JSON.parse(fs.readFileSync(geojsonPath, "utf8")).features) {
  const code = featureCode(feature);
  if (!code || exclude.has(code)) continue;
  if (!polygonsByCode.has(code)) polygonsByCode.set(code, []);
  polygonsByCode.get(code).push(...polygonsOf(feature.geometry));
}

const names = new Intl.DisplayNames(["en"], { type: "region" });
const round = (value, digits) => Number(value.toFixed(digits));
const entries = [];
for (const [code, polygons] of polygonsByCode) {
  if (existing.has(code) && !regenerate.has(code)) {
    entries.push({ code, name: existing.get(code).match(/name: "([^"]+)"/)[1], line: existing.get(code).trim().replace(/,$/, "") });
    continue;
  }
  // Frame the main landmasses; remote islands would otherwise zoom the country out to an ocean.
  const largest = Math.max(...polygons.map((rings) => ringArea(rings[0])));
  const outer = polygons.filter((rings) => ringArea(rings[0]) >= largest * 0.05).map((rings) => rings[0]);
  const plain = boundsOf(outer, false);
  const shifted = boundsOf(outer, true);
  // Only use the antimeridian-shifted frame when the country really crosses 180°.
  const b = shifted.east - shifted.west < plain.east - plain.west - 1 ? shifted : plain;
  if (b.west >= 180) { b.west -= 360; b.east -= 360; }
  const span = Math.max(b.east - b.west, (b.north - b.south) * 1.4, 0.01);
  const zoom = Math.max(2, Math.min(13, Math.round(Math.log2(360 / span)) + 1));
  let centerLng = (b.west + b.east) / 2;
  if (centerLng > 180) centerLng -= 360;
  const name = names.of(code);
  if (!name || name === code) throw new Error(`Geen Nederlandse naam voor ${code}`);
  const line = `{ code: "${code}", name: "${name.replaceAll('"', "'")}", center: [${round((b.south + b.north) / 2, 2)}, ${round(centerLng, 2)}, ${zoom}], bounds: [[${round(b.south, 2)}, ${round(b.west, 2)}], [${round(b.north, 2)}, ${round(b.east, 2)}]] }`;
  entries.push({ code, name, line });
}
for (const code of existing.keys()) {
  if (!polygonsByCode.has(code)) throw new Error(`${code} staat in app.js maar niet in de GeoJSON`);
}

entries.sort((a, b) => a.name.localeCompare(b.name, "nl"));
const body = entries.map((entry) => `  ${entry.line},`).join("\n");
fs.writeFileSync(appPath, source.replace(block[0], `const FILTER_COUNTRIES = [\n${body}\n];\n`));
console.log(`${entries.length} landen in FILTER_COUNTRIES (${entries.length - existing.size} nieuw)`);
