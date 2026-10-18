import fs from "node:fs";

// Features in datasets/geo-countries without a usable ISO code, mapped to the country travellers would expect.
const NAME_ALIASES = {
  "Kosovo": "XK",
  "Taiwan": "TW",
  "Somaliland": "SO",
  "Northern Cyprus": "CY",
  "Cyprus No Mans Area": "CY",
  "Akrotiri Sovereign Base Area": "CY",
  "Dhekelia Sovereign Base Area": "CY",
  "Baykonur Cosmodrome": "KZ",
};

export function featureCode(feature) {
  const props = feature.properties || {};
  const name = props.name || props.NAME || props.ADMIN || "";
  if (NAME_ALIASES[name]) return NAME_ALIASES[name];
  const code = props["ISO3166-1-Alpha-2"] || props.ISO_A2 || props.iso_a2 || props.ISO2 || props.WB_A2 || "";
  return /^[A-Z]{2}$/.test(code) ? code : "";
}

function ringBounds(ring, bounds) {
  for (const [lng, lat] of ring) {
    bounds.south = Math.min(bounds.south, lat);
    bounds.north = Math.max(bounds.north, lat);
    bounds.west = Math.min(bounds.west, lng);
    bounds.east = Math.max(bounds.east, lng);
  }
  return bounds;
}

export function polygonsOf(geometry) {
  if (geometry?.type === "Polygon") return [geometry.coordinates];
  if (geometry?.type === "MultiPolygon") return geometry.coordinates;
  return [];
}

function pointInRing(lat, lng, ring) {
  let inside = false;
  for (let current = 0, previous = ring.length - 1; current < ring.length; previous = current++) {
    const [prevLng, prevLat] = ring[previous];
    const [currLng, currLat] = ring[current];
    if ((currLat > lat) !== (prevLat > lat)
      && lng < ((prevLng - currLng) * (lat - currLat)) / (prevLat - currLat) + currLng) inside = !inside;
  }
  return inside;
}

// Returns (lat, lng) => ISO code for points inside the given countries, or null.
export function loadCountryLookup(geojsonPath, allowedCodes) {
  if (!geojsonPath || !fs.existsSync(geojsonPath)) return () => null;
  const allowed = allowedCodes ? new Set(allowedCodes) : null;
  const polygons = [];
  for (const feature of JSON.parse(fs.readFileSync(geojsonPath, "utf8")).features || []) {
    const code = featureCode(feature);
    if (!code || (allowed && !allowed.has(code))) continue;
    for (const rings of polygonsOf(feature.geometry)) {
      polygons.push({ code, rings, bounds: ringBounds(rings[0], { south: 90, north: -90, west: 180, east: -180 }) });
    }
  }
  return (lat, lng) => {
    for (const { code, rings, bounds } of polygons) {
      if (lat < bounds.south || lat > bounds.north || lng < bounds.west || lng > bounds.east) continue;
      if (pointInRing(lat, lng, rings[0]) && !rings.slice(1).some((hole) => pointInRing(lat, lng, hole))) return code;
    }
    return null;
  };
}
