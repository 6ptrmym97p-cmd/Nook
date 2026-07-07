#!/usr/bin/env node

import fs from "node:fs";

const args = new Map(process.argv.slice(2).map((arg) => {
  const [key, ...value] = arg.split("=");
  return [key, value.length ? value.join("=") : "true"];
}));

const outputPath = args.get("--output") || "/tmp/campwild-places.json";
const sourceUrl = args.get("--source") || "https://map.campwild.org/map/places.json";
const timeoutSeconds = Number(args.get("--timeout") || 60);

const controller = new AbortController();
const timeout = setTimeout(() => controller.abort(), timeoutSeconds * 1000);

try {
  const response = await fetch(sourceUrl, {
    headers: {
      "Accept": "application/json",
      "User-Agent": "Nook CampWild importer",
    },
    signal: controller.signal,
  });
  if (!response.ok) throw new Error(`${sourceUrl} gaf status ${response.status}`);
  const data = await response.json();
  if (!Array.isArray(data.places)) throw new Error("CampWild-response bevat geen places-array");
  fs.writeFileSync(outputPath, `${JSON.stringify({
    generatedAt: new Date().toISOString(),
    source: sourceUrl,
    places: data.places,
  })}\n`);
  console.log(`CampWild: ${data.places.length} publieke kaartpins geschreven naar ${outputPath}`);
} finally {
  clearTimeout(timeout);
}
