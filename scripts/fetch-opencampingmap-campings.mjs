#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { loadCountryLookup } from "./country-lookup.mjs";

const args = new Map(process.argv.slice(2).map((arg) => {
  const [key, ...value] = arg.split("=");
  return [key, value.length ? value.join("=") : "true"];
}));

const appPath = args.get("--app") || path.join(path.dirname(fileURLToPath(import.meta.url)), "..", "app.js");
const outputPath = args.get("--output") || "/tmp/nook-osm-campings.json";
const countriesGeoJsonPath = args.get("--countries-geojson") || "";
const endpoint = args.get("--endpoint") || "https://opencampingmap.org/getcampsites";
const timeoutSeconds = Number(args.get("--timeout") || 90);
const requestDelayMs = Number(args.get("--delay-ms") || 700);
const maxRetries = Number(args.get("--retries") || 2);
// --grid=DEG fetches the whole world in DEG° tiles instead of one bbox per country.
const gridDegrees = Number(args.get("--grid") || 0);
const selectedCountries = String(args.get("--countries") || "")
  .split(",")
  .map((code) => code.trim().toUpperCase())
  .filter(Boolean);

function parseCountries() {
  const source = fs.readFileSync(appPath, "utf8");
  const start = source.indexOf("const FILTER_COUNTRIES = [");
  if (start === -1) throw new Error("FILTER_COUNTRIES niet gevonden in app.js");
  const arrayStart = source.indexOf("[", start);
  const marker = "];";
  const end = source.indexOf(marker, arrayStart);
  if (end === -1) throw new Error("Einde van FILTER_COUNTRIES niet gevonden in app.js");
  return Function(`"use strict"; return (${source.slice(arrayStart, end + 1)});`)();
}

const allCountries = parseCountries();
const countries = selectedCountries.length
  ? allCountries.filter((country) => selectedCountries.includes(country.code))
  : allCountries;
const countryCodes = countries.map((country) => country.code);

const lookupCountry = loadCountryLookup(countriesGeoJsonPath, countryCodes);

function countryFor(lat, lng) {
  const match = lookupCountry(lat, lng);
  if (match) return match;
  const matches = countries
    .filter((country) => {
      const [[south, west], [north, east]] = country.bounds;
      return lat >= south && lat <= north && lng >= west && lng <= east;
    })
    .map((country) => {
      const [[south, west], [north, east]] = country.bounds;
      return { code: country.code, area: (north - south) * (east - west) };
    })
    .sort((a, b) => a.area - b.area);
  return matches[0]?.code || "";
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

let lastRequestAt = 0;
async function throttle() {
  const elapsed = Date.now() - lastRequestAt;
  if (elapsed < requestDelayMs) await sleep(requestDelayMs - elapsed);
  lastRequestAt = Date.now();
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

function osmKeyFromFeature(feature) {
  const id = String(feature.id || "");
  const match = id.match(/openstreetmap\.org\/(node|way|relation)\/(\d+)/);
  if (match) return `${match[1]}/${match[2]}`;
  return id || "";
}

function normalizeFeature(feature) {
  const coords = feature.geometry?.coordinates || [];
  const lng = Number(coords[0]);
  const lat = Number(coords[1]);
  if (!Number.isFinite(lat) || !Number.isFinite(lng)) return null;
  const tags = feature.properties || {};
  if (!["camp_site", "caravan_site"].includes(tags.tourism)) return null;
  const country = countryFor(lat, lng);
  if (!countryCodes.includes(country)) return null;
  const osmKey = osmKeyFromFeature(feature);
  if (!osmKey) return null;
  const sourceUrl = String(feature.id || "").startsWith("http")
    ? feature.id
    : `https://www.openstreetmap.org/${osmKey}`;

  return {
    osmKey,
    country,
    lat: Number(lat.toFixed(6)),
    lng: Number(lng.toFixed(6)),
    name: plainText(tags.name || tags.operator || "Naamloze camping"),
    tourism: tags.tourism,
    category: String(tags.category || ""),
    locality: plainText(pick(tags, ["addr:city", "addr:town", "addr:village", "addr:place", "is_in:city", "is_in:town"])),
    website: pick(tags, ["website", "contact:website", "url"]),
    phone: pick(tags, ["phone", "contact:phone", "mobile", "contact:mobile"]),
    email: pick(tags, ["email", "contact:email"]),
    access: tags.access || "",
    tents: tags.tents || "",
    campers: tags.campers || tags.motorhome || "",
    caravans: tags.caravans || "",
    motorhome: tags.motorhome || "",
    cabins: tags.cabins || "",
    capacity: pick(tags, ["capacity", "capacity:pitches", "capacity:persons", "capacity:tents", "capacity:caravans"]),
    charge: tags.charge || "",
    operator: plainText(tags.operator || ""),
    openingHours: tags.opening_hours || "",
    stars: tags.stars || "",
    toilets: tags.toilets || "",
    shower: tags.shower || "",
    powerSupply: tags.power_supply || "",
    fee: tags.fee || (tags.charge ? "yes" : ""),
    drinkingWater: tags.drinking_water || "",
    waterPoint: tags.water_point || "",
    image: /^https?:\/\//i.test(tags.image || "") ? tags.image : "",
    wikimediaCommons: String(tags.wikimedia_commons || "").replace(/^File:/i, ""),
    sourceUrl,
  };
}

function nonEmptyFieldCount(place) {
  return Object.values(place).filter((value) => value !== "" && value !== null && value !== undefined).length;
}

async function fetchCountry(country) {
  const [[south, west], [north, east]] = country.bounds;
  const body = new URLSearchParams({ bbox: [west, south, east, north].join(",") });
  let lastError = null;

  for (let attempt = 0; attempt <= maxRetries; attempt += 1) {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), timeoutSeconds * 1000);
    try {
      await throttle();
      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
          "User-Agent": "Nook OpenCampingMap importer",
          "Accept": "application/json",
        },
        body,
        signal: controller.signal,
      });
      if (!response.ok) throw new Error(`${endpoint} gaf status ${response.status}`);
      const data = await response.json();
      return data.features || [];
    } catch (error) {
      lastError = error;
      if (attempt < maxRetries) await sleep(2500 * (attempt + 1));
    } finally {
      clearTimeout(timeout);
    }
  }

  throw lastError || new Error("OpenCampingMap-query mislukt");
}

const placeMap = new Map();
const failedCountries = [];

const targets = gridDegrees > 0 ? worldTiles(gridDegrees) : countries;

function worldTiles(step) {
  const tiles = [];
  for (let south = -60; south < 84; south += step) {
    for (let west = -180; west < 180; west += step) {
      const north = Math.min(84, south + step);
      const east = Math.min(180, west + step);
      tiles.push({ code: `${south},${west}`, bounds: [[south, west], [north, east]] });
    }
  }
  return tiles;
}

for (const country of targets) {
  try {
    const features = await fetchCountry(country);
    let added = 0;
    for (const feature of features) {
      const place = normalizeFeature(feature);
      if (!place) continue;
      const existing = placeMap.get(place.osmKey);
      if (!existing || nonEmptyFieldCount(place) > nonEmptyFieldCount(existing)) {
        if (!existing) added += 1;
        placeMap.set(place.osmKey, place);
      }
    }
    console.log(`${country.code}: ${features.length} features, ${added} nieuw, totaal ${placeMap.size}`);
  } catch (error) {
    failedCountries.push({ country: country.code, error: error.message });
    console.warn(`${country.code}: mislukt: ${error.message}`);
  }
}

fs.writeFileSync(outputPath, `${JSON.stringify({
  generatedAt: new Date().toISOString(),
  source: "OpenCampingMap / OpenStreetMap",
  endpoint,
  places: [...placeMap.values()].sort((a, b) => a.country.localeCompare(b.country) || a.name.localeCompare(b.name)),
  failedCountries,
})}\n`);

console.log(`Klaar: ${placeMap.size} OSM-campings in ${outputPath}`);
if (failedCountries.length) {
  console.warn(`Mislukte landen: ${failedCountries.map((item) => item.country).join(", ")}`);
}
