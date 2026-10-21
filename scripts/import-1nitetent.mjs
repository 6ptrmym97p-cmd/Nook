import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import vm from "node:vm";
import { fileURLToPath } from "node:url";
import { buildMapData } from "./build-map-data.mjs";
import { loadCountryLookup } from "./country-lookup.mjs";

export const SOURCE_URL = "https://1nitetent.com/#map";
const FEED_URL = "https://1nitetent.com/app/themes/1nitetent/assets/json/campgrounds.geojson";

export function normalizeTentPositions(data, lookupCountry) {
  if (data?.type !== "FeatureCollection" || !Array.isArray(data.features)) throw new Error("Expected the public 1NITE TENT GeoJSON map");
  const pins = [];
  const seen = new Set();
  const stats = { received: data.features.length, invalid: 0, duplicates: 0, unmapped: 0 };
  for (const feature of data.features) {
    const coordinates = feature?.geometry?.coordinates;
    if (feature?.geometry?.type !== "Point" || !Array.isArray(coordinates)) { stats.invalid++; continue; }
    const [lng, lat] = coordinates;
    if (!Number.isFinite(lat) || !Number.isFinite(lng) || Math.abs(lat) > 90 || Math.abs(lng) > 180 || (lat === 0 && lng === 0)) { stats.invalid++; continue; }
    const position = `${lat.toFixed(6)},${lng.toFixed(6)}`;
    if (seen.has(position)) { stats.duplicates++; continue; }
    seen.add(position);
    const country = lookupCountry(lat, lng);
    if (!country) { stats.unmapped++; continue; }
    // Copy geographic facts only. Names, prose, email addresses and other
    // host details remain on the original map, including in build artifacts.
    pins.push({ id: crypto.createHash("sha256").update(position).digest("hex").slice(0, 16), country, lat: Number(lat.toFixed(6)), lng: Number(lng.toFixed(6)), type: "host" });
  }
  return { pins, stats };
}

async function main() {
  const args = new Map();
  for (let i = 2; i < process.argv.length; i += 2) args.set(process.argv[i], process.argv[i + 1]);
  const countries = args.get("--countries-geojson");
  if (!countries || !fs.existsSync(countries)) throw new Error("Provide --countries-geojson with the country boundary dataset");
  const root = path.resolve(args.get("--root") || ".");
  const dataDir = path.join(root, "data");
  const context = { window: {} };
  vm.runInNewContext(fs.readFileSync(path.join(root, "public-data.js"), "utf8"), context);
  const metadata = context.window.NOOK_DATA;
  const allowedCountries = Object.keys(metadata.overview.countries);
  let raw;
  if (args.has("--input")) raw = JSON.parse(fs.readFileSync(args.get("--input"), "utf8"));
  else {
    const response = await fetch(FEED_URL, { headers: { "User-Agent": "Nook public map importer (ridewithnook.com)" }, signal: AbortSignal.timeout(30000) });
    if (!response.ok) throw new Error(`1NITE TENT HTTP ${response.status}`);
    raw = await response.json();
  }
  const { pins, stats } = normalizeTentPositions(raw, loadCountryLookup(countries, allowedCountries));
  if (!pins.length) throw new Error("No usable map positions; keeping the published dataset unchanged");
  const generatedAt = new Date().toISOString().slice(0, 10);
  const grouped = new Map();
  for (const pin of pins) {
    if (!grouped.has(pin.country)) grouped.set(pin.country, []);
    grouped.get(pin.country).push(pin);
  }
  for (const [country, items] of grouped) fs.writeFileSync(path.join(dataDir, `nitetent-${country}.json`), JSON.stringify({ country, pins: items }) + "\n");
  const manifest = buildMapData(dataDir);
  for (const country of allowedCountries) metadata.overview.countries[country].nitetent = grouped.get(country)?.length || 0;
  metadata.nitetent = { source: SOURCE_URL, totalVisible: pins.length, generatedAt, pins: [] };
  fs.writeFileSync(path.join(root, "public-data.js"), `window.NOOK_DATA = ${JSON.stringify(metadata)};\n`);
  console.log(JSON.stringify({ imported: pins.length, countries: grouped.size, totalMapPoints: manifest.count, ...stats }));
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) await main();
