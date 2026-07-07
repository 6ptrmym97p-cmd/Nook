import fs from "node:fs";
import path from "node:path";

const args = new Map();
for (let index = 2; index < process.argv.length; index += 2) {
  args.set(process.argv[index], process.argv[index + 1]);
}

const appPath = args.get("--app") || path.resolve("app.js");
const outputPath = args.get("--output") || "/tmp/nook-osm-campings.json";
const countryGeoJsonPath = args.get("--countries-geojson") || "";
const onlyCountries = new Set(String(args.get("--countries") || "")
  .split(",")
  .map((value) => value.trim().toUpperCase())
  .filter(Boolean));
const timeoutSeconds = Number(args.get("--timeout") || 40);
const maxTileKm = Number(args.get("--max-tile-km") || 180);
const minTileKm = Number(args.get("--min-tile-km") || 65);
const maxElementsPerTile = Number(args.get("--max-elements") || 1200);
const requestDelayMs = Number(args.get("--delay-ms") || 1500);
const retryDelayMs = Number(args.get("--retry-delay-ms") || 15000);
const maxRetries = Number(args.get("--retries") || 3);
const endpoints = String(args.get("--endpoints") || "https://overpass-api.de/api/interpreter")
  .split(",")
  .map((value) => value.trim())
  .filter(Boolean);
let lastRequestAt = 0;

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function throttleRequest() {
  const elapsed = Date.now() - lastRequestAt;
  if (elapsed < requestDelayMs) await sleep(requestDelayMs - elapsed);
  lastRequestAt = Date.now();
}

function readCountryDefinitions() {
  const source = fs.readFileSync(appPath, "utf8");
  const block = source.match(/const FILTER_COUNTRIES = \[([\s\S]*?)\];\n\nconst countryNames/);
  if (!block) throw new Error(`Kon FILTER_COUNTRIES niet lezen uit ${appPath}`);
  return [...block[1].matchAll(/\{ code: "([^"]+)", name: "([^"]+)", center: \[[^\]]+\], bounds: \[\[([^\]]+)\], \[([^\]]+)\]\] \}/g)]
    .map((match) => ({
      code: match[1],
      name: match[2],
      bounds: [
        match[3].split(",").map((value) => Number(value.trim())),
        match[4].split(",").map((value) => Number(value.trim())),
      ],
    }));
}

const countryDefinitions = readCountryDefinitions()
  .filter((country) => !onlyCountries.size || onlyCountries.has(country.code));
const allCountryDefinitions = readCountryDefinitions();
const countryCodes = allCountryDefinitions.map((country) => country.code);
const countryBounds = Object.fromEntries(allCountryDefinitions.map((country) => [country.code, country.bounds]));

function pointInPolygon(lat, lng, polygon) {
  let inside = false;
  for (let current = 0, previous = polygon.length - 1; current < polygon.length; previous = current++) {
    const [prevLng, prevLat] = polygon[previous];
    const [currLng, currLat] = polygon[current];
    const crosses = (currLat > lat) !== (prevLat > lat)
      && lng < ((prevLng - currLng) * (lat - currLat)) / (prevLat - currLat) + currLng;
    if (crosses) inside = !inside;
  }
  return inside;
}

function coordinateBounds(coordinates, bounds = { south: 90, west: 180, north: -90, east: -180 }) {
  if (!Array.isArray(coordinates)) return bounds;
  if (coordinates.length >= 2 && Number.isFinite(coordinates[0]) && Number.isFinite(coordinates[1])) {
    const [lng, lat] = coordinates;
    bounds.south = Math.min(bounds.south, lat);
    bounds.west = Math.min(bounds.west, lng);
    bounds.north = Math.max(bounds.north, lat);
    bounds.east = Math.max(bounds.east, lng);
    return bounds;
  }
  coordinates.forEach((entry) => coordinateBounds(entry, bounds));
  return bounds;
}

function boundsContain(bounds, lat, lng) {
  return lat >= bounds.south && lat <= bounds.north && lng >= bounds.west && lng <= bounds.east;
}

function polygonContainsPoint(rings, lat, lng) {
  if (!rings?.length || !pointInPolygon(lat, lng, rings[0])) return false;
  return !rings.slice(1).some((hole) => pointInPolygon(lat, lng, hole));
}

function geometryContainsPoint(geometry, lat, lng) {
  if (!geometry) return false;
  if (geometry.type === "Polygon") return polygonContainsPoint(geometry.coordinates, lat, lng);
  if (geometry.type === "MultiPolygon") {
    return geometry.coordinates.some((polygon) => polygonContainsPoint(polygon, lat, lng));
  }
  return false;
}

function buildGeoCountryFeatures() {
  if (!countryGeoJsonPath || !fs.existsSync(countryGeoJsonPath)) return [];
  const allowed = new Set(countryCodes);
  const geojson = JSON.parse(fs.readFileSync(countryGeoJsonPath, "utf8"));
  return (geojson.features || [])
    .map((feature) => ({
      code: feature.properties?.["ISO3166-1-Alpha-2"],
      geometry: feature.geometry,
      bounds: coordinateBounds(feature.geometry?.coordinates),
    }))
    .filter((feature) => allowed.has(feature.code));
}

const geoCountryFeatures = buildGeoCountryFeatures();

function countryFor(lat, lng) {
  const geoMatch = geoCountryFeatures.find((feature) => (
    boundsContain(feature.bounds, lat, lng) && geometryContainsPoint(feature.geometry, lat, lng)
  ));
  if (geoMatch) return geoMatch.code;

  const boundsMatch = Object.entries(countryBounds)
    .filter(([, [[south, west], [north, east]]]) => lat >= south && lat <= north && lng >= west && lng <= east)
    .map(([code, [[south, west], [north, east]]]) => ({ code, area: (north - south) * (east - west) }))
    .sort((a, b) => a.area - b.area)[0];
  return boundsMatch?.code || "";
}

function distanceKm(a, b) {
  const radius = 6371;
  const dLat = (b.lat - a.lat) * Math.PI / 180;
  const dLng = (b.lng - a.lng) * Math.PI / 180;
  const lat1 = a.lat * Math.PI / 180;
  const lat2 = b.lat * Math.PI / 180;
  const h = Math.sin(dLat / 2) ** 2
    + Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2;
  return 2 * radius * Math.asin(Math.sqrt(h));
}

function boundsDiagonalKm(bounds) {
  return distanceKm(
    { lat: bounds.south, lng: bounds.west },
    { lat: bounds.north, lng: bounds.east },
  );
}

function splitBounds(bounds) {
  const latSpan = bounds.north - bounds.south;
  const lngSpan = bounds.east - bounds.west;
  if (latSpan >= lngSpan) {
    const middle = (bounds.south + bounds.north) / 2;
    return [
      { ...bounds, north: middle },
      { ...bounds, south: middle },
    ];
  }
  const middle = (bounds.west + bounds.east) / 2;
  return [
    { ...bounds, east: middle },
    { ...bounds, west: middle },
  ];
}

function tileKey(country, bounds) {
  return [
    country,
    bounds.south.toFixed(4),
    bounds.west.toFixed(4),
    bounds.north.toFixed(4),
    bounds.east.toFixed(4),
  ].join(",");
}

function tileTouchesCountry(country, bounds) {
  const points = [
    [bounds.south, bounds.west],
    [bounds.south, bounds.east],
    [bounds.north, bounds.west],
    [bounds.north, bounds.east],
    [(bounds.south + bounds.north) / 2, (bounds.west + bounds.east) / 2],
  ];
  return points.some(([lat, lng]) => countryFor(lat, lng) === country);
}

function plainText(value = "") {
  return String(value)
    .replace(/<br\s*\/?>/gi, " ")
    .replace(/<\/p>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&quot;/gi, '"')
    .replace(/&#39;|&apos;/gi, "'")
    .replace(/\s+/g, " ")
    .trim();
}

function pick(tags, keys) {
  return keys.map((key) => tags[key]).find((value) => value) || "";
}

function normalizeElement(element) {
  const lat = element.lat ?? element.center?.lat;
  const lng = element.lon ?? element.center?.lon;
  const tags = element.tags || {};
  if (!Number.isFinite(lat) || !Number.isFinite(lng)) return null;
  if (!["camp_site", "caravan_site"].includes(tags.tourism)) return null;
  const country = countryFor(lat, lng);
  if (!country) return null;
  const osmKey = `${element.type}/${element.id}`;
  return {
    osmKey,
    country,
    lat: Number(lat.toFixed(6)),
    lng: Number(lng.toFixed(6)),
    name: plainText(tags.name || tags.operator || "Naamloze camping"),
    tourism: tags.tourism,
    locality: plainText(pick(tags, ["addr:city", "addr:town", "addr:village", "addr:place", "is_in:city", "is_in:town"])),
    website: pick(tags, ["website", "contact:website", "url"]),
    phone: pick(tags, ["phone", "contact:phone", "mobile", "contact:mobile"]),
    email: pick(tags, ["email", "contact:email"]),
    access: tags.access || "",
    tents: tags.tents || "",
    campers: tags.campers || tags.motorhome || "",
    operator: plainText(tags.operator || ""),
    openingHours: tags.opening_hours || "",
    stars: tags.stars || "",
    toilets: tags.toilets || "",
    shower: tags.shower || "",
    powerSupply: tags.power_supply || "",
    fee: tags.fee || "",
    drinkingWater: tags.drinking_water || "",
    waterPoint: tags.water_point || "",
    image: /^https?:\/\//i.test(tags.image || "") ? tags.image : "",
    wikimediaCommons: String(tags.wikimedia_commons || "").replace(/^File:/i, ""),
    sourceUrl: `https://www.openstreetmap.org/${element.type}/${element.id}`,
  };
}

function readSnapshot() {
  if (!fs.existsSync(outputPath)) {
    return { generatedAt: "", source: "OpenStreetMap via Overpass", places: [], doneTiles: [], failedTiles: [] };
  }
  return JSON.parse(fs.readFileSync(outputPath, "utf8"));
}

function writeSnapshot(snapshot) {
  fs.writeFileSync(outputPath, `${JSON.stringify({
    ...snapshot,
    generatedAt: new Date().toISOString(),
    places: [...snapshot.placeMap.values()].sort((a, b) => a.country.localeCompare(b.country) || a.name.localeCompare(b.name)),
    doneTiles: [...snapshot.doneSet].sort(),
    failedTiles: snapshot.failedTiles,
  })}\n`);
}

async function fetchTile(bounds) {
  const bbox = [bounds.south, bounds.west, bounds.north, bounds.east].join(",");
  const query = `[out:json][timeout:${timeoutSeconds}];(
    nwr["tourism"="camp_site"](${bbox});
    nwr["tourism"="caravan_site"](${bbox});
  );out center tags qt;`;

  let lastError = null;
  for (const endpoint of endpoints) {
    for (let attempt = 0; attempt <= maxRetries; attempt += 1) {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), (timeoutSeconds + 10) * 1000);
      try {
        await throttleRequest();
        const response = await fetch(endpoint, {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
            "User-Agent": "Nook camping importer",
          },
          body: new URLSearchParams({ data: query }),
          signal: controller.signal,
        });
        if (response.status === 429 && attempt < maxRetries) {
          await sleep(retryDelayMs * (attempt + 1));
          continue;
        }
        if (!response.ok) throw new Error(`${endpoint} gaf status ${response.status}`);
        const data = await response.json();
        if (data.remark) throw new Error(data.remark);
        return data.elements || [];
      } catch (error) {
        lastError = error;
        if (attempt < maxRetries && /429|Too Many Requests|aborted|timeout/i.test(error.message)) {
          await sleep(retryDelayMs * (attempt + 1));
          continue;
        }
        break;
      } finally {
        clearTimeout(timeout);
      }
    }
  }
  throw lastError || new Error("Overpass-query mislukt");
}

async function fetchAdaptive(country, bounds, snapshot) {
  const key = tileKey(country, bounds);
  if (snapshot.doneSet.has(key)) return;
  const diagonal = boundsDiagonalKm(bounds);
  if (!tileTouchesCountry(country, bounds)) {
    snapshot.doneSet.add(key);
    writeSnapshot(snapshot);
    return;
  }
  if (diagonal > maxTileKm) {
    for (const part of splitBounds(bounds)) await fetchAdaptive(country, part, snapshot);
    return;
  }

  try {
    const elements = await fetchTile(bounds);
    if (elements.length > maxElementsPerTile && diagonal > minTileKm) {
      for (const part of splitBounds(bounds)) await fetchAdaptive(country, part, snapshot);
      return;
    }
    let added = 0;
    for (const element of elements) {
      const place = normalizeElement(element);
      if (!place) continue;
      if (!countryCodes.includes(place.country)) continue;
      if (!snapshot.placeMap.has(place.osmKey)) added += 1;
      snapshot.placeMap.set(place.osmKey, place);
    }
    snapshot.doneSet.add(key);
    console.log(`${country} ${key}: ${elements.length} objecten, ${added} nieuw, totaal ${snapshot.placeMap.size}`);
    writeSnapshot(snapshot);
  } catch (error) {
    if (diagonal > minTileKm) {
      console.warn(`${country} ${key}: split na fout: ${error.message}`);
      for (const part of splitBounds(bounds)) await fetchAdaptive(country, part, snapshot);
      return;
    }
    console.warn(`${country} ${key}: mislukt op minimumtegel: ${error.message}`);
    snapshot.failedTiles.push({ country, key, error: error.message });
    writeSnapshot(snapshot);
  }
}

const snapshot = readSnapshot();
snapshot.placeMap = new Map((snapshot.places || []).map((place) => [place.osmKey, place]));
snapshot.doneSet = new Set(snapshot.doneTiles || []);
snapshot.failedTiles = snapshot.failedTiles || [];

for (const country of countryDefinitions) {
  const [[south, west], [north, east]] = country.bounds;
  await fetchAdaptive(country.code, { south, west, north, east }, snapshot);
}

writeSnapshot(snapshot);
console.log(`Klaar: ${snapshot.placeMap.size} OSM-campings in ${outputPath}`);
