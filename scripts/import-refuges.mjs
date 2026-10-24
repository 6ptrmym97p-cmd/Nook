import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";
import { fileURLToPath } from "node:url";
import { buildMapData } from "./build-map-data.mjs";
import { loadCountryLookup } from "./country-lookup.mjs";

export const LICENSE = "https://creativecommons.org/licenses/by-sa/2.0/";
const ENDPOINT = "https://www.refuges.info/api/bbox?bbox=world&type_points=7&nb_points=all&detail=simple&format=geojson&cache=86400";

export function nearbyHuts(points, radius = 50) {
  const grid = new Map();
  for (const point of points) {
    const key = `${Math.floor(point.lat * 100)}:${Math.floor(point.lng * 100)}`;
    if (!grid.has(key)) grid.set(key, []);
    grid.get(key).push(point);
  }
  return (lat, lng) => {
    const row = Math.floor(lat * 100), col = Math.floor(lng * 100);
    const lngSpan = Math.max(1, Math.ceil(radius / (111000 * Math.max(0.01, Math.cos(lat * Math.PI / 180))) * 100));
    for (let y = row - 1; y <= row + 1; y++) for (let x = col - lngSpan; x <= col + lngSpan; x++) {
      for (const point of grid.get(`${y}:${x}`) || []) {
        const dy = (point.lat - lat) * Math.PI / 180;
        const dx = (point.lng - lng) * Math.PI / 180;
        const h = Math.sin(dy / 2) ** 2 + Math.cos(lat * Math.PI / 180) * Math.cos(point.lat * Math.PI / 180) * Math.sin(dx / 2) ** 2;
        if (12742000 * Math.asin(Math.sqrt(Math.min(1, h))) <= radius) return true;
      }
    }
    return false;
  };
}

export function normalizeRefuges(data, lookupCountry, existingHut = () => false) {
  if (data?.type !== "FeatureCollection" || !Array.isArray(data.features)) throw new Error("Expected the Refuges.info GeoJSON feed");
  if (!/CC By-Sa 2\.0/i.test(data.copyright || "")) throw new Error("Source license changed; review before importing");
  const places = [], seen = new Set();
  const stats = { received: data.features.length, otherType: 0, noBeds: 0, restricted: 0, invalid: 0, duplicates: 0, unmapped: 0, existing: 0 };
  for (const feature of data.features) {
    const p = feature?.properties || {};
    // Filter locally even if an upstream parameter is ignored. Springs,
    // shelters without reported beds and staffed accommodation are excluded.
    if (Number(p.type?.id) !== 7) { stats.otherType++; continue; }
    const capacity = Number(p.places?.valeur);
    if (!Number.isFinite(capacity) || capacity < 1) { stats.noBeds++; continue; }
    if (String(p.etat?.valeur || "").trim()) { stats.restricted++; continue; }
    const coordinates = feature.geometry?.coordinates;
    const [lng, lat] = Array.isArray(coordinates) ? coordinates : [];
    const id = Number(p.id || feature.id);
    if (feature.geometry?.type !== "Point" || !Number.isFinite(lat) || !Number.isFinite(lng) || Math.abs(lat) > 85 || Math.abs(lng) > 180 || (lat === 0 && lng === 0) || !Number.isSafeInteger(id) || id <= 0) { stats.invalid++; continue; }
    if (seen.has(id)) { stats.duplicates++; continue; }
    seen.add(id);
    const country = lookupCountry(lat, lng);
    if (!country) { stats.unmapped++; continue; }
    if (existingHut(lat, lng)) { stats.existing++; continue; }
    // Construct a trusted provider URL rather than accepting a link supplied
    // in community content. The provider resolves IDs to its canonical page.
    places.push({ id, country, lat: Number(lat.toFixed(6)), lng: Number(lng.toFixed(6)), name: String(p.nom || `Refuges.info ${id}`).trim().slice(0, 180), type: "hut", capacity: Math.floor(capacity), sourceUrl: `https://www.refuges.info/point/${id}/`, attribution: "Refuges.info contributors", license: LICENSE });
  }
  return { places, stats };
}

async function main() {
  const args = new Map();
  for (let i = 2; i < process.argv.length; i += 2) args.set(process.argv[i], process.argv[i + 1]);
  const countries = args.get("--countries-geojson");
  if (!countries || !fs.existsSync(countries)) throw new Error("Provide --countries-geojson with country boundaries");
  const root = path.resolve(args.get("--root") || "."), dataDir = path.join(root, "data");
  const context = { window: {} };
  vm.runInNewContext(fs.readFileSync(path.join(root, "public-data.js"), "utf8"), context);
  const metadata = context.window.NOOK_DATA;
  const manifest = JSON.parse(fs.readFileSync(path.join(dataDir, "map-index.json"), "utf8"));
  const points = fs.readFileSync(path.join(dataDir, "map-points.bin"));
  const existing = [];
  for (let i = 0; i < manifest.count; i++) {
    const offset = i * manifest.recordBytes;
    if (manifest.types[points.readUInt8(offset + 12)] !== "hut" || manifest.chunks[points.readUInt16LE(offset + 8)].kind === "refuges") continue;
    existing.push({ lat: points.readInt32LE(offset + 4) / 1e6, lng: points.readInt32LE(offset) / 1e6 });
  }
  let raw;
  if (args.has("--input")) raw = JSON.parse(fs.readFileSync(args.get("--input"), "utf8"));
  else {
    const response = await fetch(ENDPOINT, { signal: AbortSignal.timeout(45000), headers: { "User-Agent": "Nook map importer (ridewithnook.com)" } });
    if (!response.ok) throw new Error(`Refuges.info HTTP ${response.status}`);
    raw = await response.json();
  }
  const allowed = Object.keys(metadata.overview.countries);
  const { places, stats } = normalizeRefuges(raw, loadCountryLookup(countries, allowed), nearbyHuts(existing));
  if (!places.length) throw new Error("No usable places; keeping the published data unchanged");
  const grouped = new Map();
  for (const place of places) {
    if (!grouped.has(place.country)) grouped.set(place.country, []);
    grouped.get(place.country).push(place);
  }
  for (const [country, items] of grouped) fs.writeFileSync(path.join(dataDir, `refuges-${country}.json`), JSON.stringify({ country, places: items }) + "\n");
  const updated = buildMapData(dataDir);
  for (const country of allowed) metadata.overview.countries[country].refuges = grouped.get(country)?.length || 0;
  metadata.refuges = { source: "https://www.refuges.info/", totalVisible: places.length, generatedAt: new Date().toISOString().slice(0, 10), attribution: "Refuges.info contributors", license: LICENSE, changes: "Unguarded huts with reported beds and no reported restriction; coordinates rounded, existing huts within 50 m omitted.", places: [] };
  fs.writeFileSync(path.join(root, "public-data.js"), `window.NOOK_DATA = ${JSON.stringify(metadata)};\n`);
  console.log(JSON.stringify({ imported: places.length, countries: grouped.size, totalMapPoints: updated.count, ...stats }));
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) await main();
