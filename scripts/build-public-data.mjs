import fs from "node:fs";
import path from "node:path";
import { buildMapData } from "./build-map-data.mjs";
import { loadCountryLookup } from "./country-lookup.mjs";

const args = new Map();
for (let index = 2; index < process.argv.length; index += 2) {
  args.set(process.argv[index], process.argv[index + 1]);
}

const vodfPath = args.get("--vodf") || "/tmp/vodf-public-map.js";
const wtmgPath = args.get("--wtmg") || "/tmp/wtmg-public.json";
const campingPath = args.get("--campings") || "/tmp/nook-osm-campings.json";
const campwildPath = args.get("--campwild") || "/tmp/campwild-places.json";
const udDir = args.get("--ud-dir") || "/tmp";
const outputPath = args.get("--output") || path.resolve("public-data.js");
const appPath = args.get("--app") || path.resolve("app.js");
const countryGeoJsonPath = args.get("--countries-geojson") || "";
const regions = ["81", "82", "83", "84", "85"];
const types = ["1106", "1111", "1115"];
const CAMPWILD_DK_OFFICIAL_DUPLICATE_RADIUS_METERS = 100;
const regionNames = {
  81: "Noord-Jutland",
  82: "Midden-Jutland",
  83: "Zuid-Denemarken en Funen",
  84: "Hoofdstad en Bornholm",
  85: "Seeland",
};

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

const countryDefinitions = readCountryDefinitions();
const countryCodes = countryDefinitions.map((country) => country.code);
const countryBounds = Object.fromEntries(countryDefinitions.map((country) => [country.code, country.bounds]));

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

const lookupCountry = loadCountryLookup(countryGeoJsonPath, countryCodes);

function countryFor(lat, lng) {
  const geoMatch = lookupCountry(lat, lng);
  if (geoMatch) return geoMatch;

  const inJutland = lat >= 54.78 && lat <= 57.85 && lng >= 7.65 && lng <= 10.95;
  const inDanishIslands = lat >= 54.45 && lat <= 56.25 && lng > 10.5 && lng <= 12.95;
  const inBornholm = lat >= 54.85 && lat <= 55.35 && lng >= 14.55 && lng <= 15.25;
  if (inJutland || inDanishIslands || inBornholm) return "DK";

  const norway = [
    [4.3, 58.0], [4.5, 61.0], [6.0, 63.0], [9.0, 65.0], [12.0, 67.5],
    [17.0, 71.4], [31.2, 71.2], [29.0, 69.0], [24.0, 68.0], [21.0, 66.0],
    [18.0, 64.0], [15.5, 62.0], [12.2, 60.0], [11.7, 58.0], [4.3, 58.0],
  ];
  if (pointInPolygon(lat, lng, norway)) return "NO";

  const sweden = [
    [11.0, 58.0], [12.0, 56.0], [14.4, 55.2], [16.2, 56.0],
    [19.2, 58.1], [18.3, 60.8], [17.2, 62.4], [19.0, 64.6],
    [24.2, 65.8], [23.4, 68.8], [19.0, 68.6], [16.1, 66.0],
    [14.1, 63.8], [12.3, 61.0], [11.0, 58.0],
  ];
  if (pointInPolygon(lat, lng, sweden)) return "SE";

  const netherlands = [
    [3.25, 51.35], [3.7, 51.22], [4.15, 51.35], [4.45, 51.43],
    [4.8, 51.42], [5.1, 51.24], [5.5, 51.26], [5.62, 50.84],
    [5.9, 50.74], [6.02, 50.74],
    [6.18, 51.08], [6.0, 51.5], [6.85, 51.85], [7.25, 53.2],
    [6.65, 53.65], [5.3, 53.55], [4.55, 53.1], [3.25, 51.35],
  ];
  if (pointInPolygon(lat, lng, netherlands)) return "NL";

  const belgium = [
    [2.45, 51.1], [3.25, 51.4], [4.8, 51.52], [6.42, 50.82],
    [6.13, 50.08], [4.42, 49.48], [2.55, 50.72], [2.45, 51.1],
  ];
  if (pointInPolygon(lat, lng, belgium)) return "BE";

  const luxembourg = [[5.72, 49.42], [6.55, 49.42], [6.55, 50.2], [5.72, 50.2], [5.72, 49.42]];
  if (pointInPolygon(lat, lng, luxembourg)) return "LU";

  const switzerland = [
    [5.85, 46.0], [6.15, 46.65], [6.8, 47.65], [8.7, 47.85],
    [9.65, 47.55], [10.55, 46.85], [10.45, 46.1], [8.9, 45.75],
    [7.0, 45.75], [5.85, 46.0],
  ];
  if (pointInPolygon(lat, lng, switzerland)) return "CH";

  const austria = [
    [9.45, 46.72], [10.45, 46.25], [12.5, 46.45], [13.75, 46.35],
    [15.0, 46.65], [16.95, 47.65], [17.15, 48.05], [16.4, 48.75],
    [14.7, 48.75], [13.0, 48.55], [11.0, 47.5], [9.45, 47.6], [9.45, 46.72],
  ];
  if (pointInPolygon(lat, lng, austria)) return "AT";

  const france = [
    [-5.2, 48.7], [-1.8, 43.2], [3.1, 42.25], [7.65, 43.65],
    [7.6, 48.0], [6.2, 49.55], [2.55, 51.15], [-1.9, 49.75], [-5.2, 48.7],
  ];
  const corsica = [[8.5, 41.25], [9.65, 41.25], [9.65, 43.1], [8.5, 43.1], [8.5, 41.25]];
  if (pointInPolygon(lat, lng, france) || pointInPolygon(lat, lng, corsica)) return "FR";

  const italy = [
    [6.6, 45.8], [8.0, 43.6], [10.0, 44.0], [12.0, 42.0], [15.8, 37.8],
    [18.6, 39.8], [16.0, 42.3], [13.6, 46.6], [11.0, 47.1], [6.6, 45.8],
  ];
  const sardinia = [[8.0, 38.8], [9.9, 38.8], [9.9, 41.4], [8.0, 41.4], [8.0, 38.8]];
  const sicily = [[12.2, 36.5], [15.7, 36.5], [15.7, 38.5], [12.2, 38.5], [12.2, 36.5]];
  if (pointInPolygon(lat, lng, italy) || pointInPolygon(lat, lng, sardinia) || pointInPolygon(lat, lng, sicily)) return "IT";

  const germany = [
    [6.1, 47.55], [10.5, 47.25], [13.8, 48.55], [12.8, 50.0],
    [14.95, 50.85], [14.65, 53.0], [13.8, 54.65], [9.5, 54.9],
    [8.3, 53.5], [6.8, 53.7], [6.15, 51.8], [5.85, 50.5], [6.1, 47.55],
  ];
  if (pointInPolygon(lat, lng, germany)) return "DE";

  const boundsMatch = Object.entries(countryBounds)
    .filter(([, [[south, west], [north, east]]]) => lat >= south && lat <= north && lng >= west && lng <= east)
    .map(([code, [[south, west], [north, east]]]) => ({ code, area: (north - south) * (east - west) }))
    .sort((a, b) => a.area - b.area)[0];
  if (boundsMatch) return boundsMatch.code;

  return null;
}

function numeric(value) {
  const number = Number(value);
  return Number.isFinite(number) ? number : 0;
}

function distanceMeters(first, second) {
  const earthRadiusMeters = 6371000;
  const firstLat = Number(first.lat) * Math.PI / 180;
  const secondLat = Number(second.lat) * Math.PI / 180;
  const latDelta = secondLat - firstLat;
  const lngDelta = (Number(second.lng) - Number(first.lng)) * Math.PI / 180;
  const haversine = Math.sin(latDelta / 2) ** 2
    + Math.cos(firstLat) * Math.cos(secondLat) * Math.sin(lngDelta / 2) ** 2;
  return 2 * earthRadiusMeters * Math.asin(Math.sqrt(haversine));
}

// Sources without a fresh raw export keep their currently published places.
function publishedItems(kind) {
  const indexPath = path.join(path.dirname(outputPath), "data", "map-index.json");
  if (!fs.existsSync(indexPath)) return [];
  return JSON.parse(fs.readFileSync(indexPath, "utf8")).chunks
    .filter((chunk) => chunk.kind === kind)
    .flatMap((chunk) => JSON.parse(fs.readFileSync(path.join(path.dirname(indexPath), chunk.file), "utf8")));
}

function buildVodfPins() {
  if (!fs.existsSync(vodfPath)) return publishedItems("vodf");
  const raw = fs.readFileSync(vodfPath, "utf8")
    .replace(/^var gastadressen = /, "")
    .replace(/;?\s*$/, "");
  const addresses = JSON.parse(raw);
  const pins = [];

  for (const address of addresses) {
    const lat = Number(address.latitude);
    const lng = Number(address.longitude);
    if (!Number.isFinite(lat) || !Number.isFinite(lng)) continue;
    const country = countryFor(lat, lng);
    if (!country) continue;

    pins.push({
      country,
      lat: Number(lat.toFixed(6)),
      lng: Number(lng.toFixed(6)),
      stayType: plainText(address.verblijftype) || "Logeeradres",
      rooms: numeric(address.kamers),
      singleBeds: numeric(address.eenpersoonsbedden),
      doubleBeds: numeric(address.tweepersoonsbedden),
      wheelchair: Boolean(address.rolstoeltoegankelijk),
      luggage: Boolean(numeric(address.bagagevervoer)),
      groups: Boolean(numeric(address.groepen)),
      pets: Boolean(numeric(address.huisdierenwelkom)),
      laundry: Boolean(numeric(address.wasruimte)),
    });
  }

  return pins;
}

function buildWtmgPins() {
  if (!fs.existsSync(wtmgPath)) return [];
  const gardens = JSON.parse(fs.readFileSync(wtmgPath, "utf8"));
  const pins = [];

  for (const garden of gardens) {
    const lat = Number(garden.latitude);
    const lng = Number(garden.longitude);
    if (!Number.isFinite(lat) || !Number.isFinite(lng)) continue;
    const country = countryFor(lat, lng);
    if (!country) continue;
    const facilities = garden.facilities || {};
    const extension = String(garden.photo || "").split(".").at(-1).toLowerCase();
    const hasPhoto = garden.id && ["jpg", "jpeg", "png", "webp"].includes(extension);
    const photoPath = hasPhoto ? `gardens/${garden.id}/garden_360x360.${extension}` : "";

    pins.push({
      country,
      lat: Number(lat.toFixed(6)),
      lng: Number(lng.toFixed(6)),
      capacity: numeric(facilities.capacity || facilities.maxGuests || facilities.guests),
      tent: Boolean(facilities.tent),
      drinkingWater: Boolean(facilities.drinkableWater),
      water: Boolean(facilities.water),
      toilet: Boolean(facilities.toilet),
      shower: Boolean(facilities.shower),
      electricity: Boolean(facilities.electricity),
      campfire: Boolean(facilities.bonfire || facilities.campfire || facilities.fireplace),
      photo: photoPath
        ? `https://firebasestorage.googleapis.com/v0/b/wtmg-production.appspot.com/o/${encodeURIComponent(photoPath)}?alt=media`
        : "",
    });
  }

  return pins;
}

function utm32ToWgs84(easting, northing) {
  const semiMajor = 6378137;
  const eccentricity = 0.08181919084262149;
  const eccentricitySquared = eccentricity ** 2;
  const secondEccentricitySquared = eccentricitySquared / (1 - eccentricitySquared);
  const scale = 0.9996;
  const x = easting - 500000;
  const meridionalArc = northing / scale;
  const mu = meridionalArc / (semiMajor * (1 - eccentricitySquared / 4 - 3 * eccentricitySquared ** 2 / 64 - 5 * eccentricitySquared ** 3 / 256));
  const e1 = (1 - Math.sqrt(1 - eccentricitySquared)) / (1 + Math.sqrt(1 - eccentricitySquared));
  const footprint = mu
    + (3 * e1 / 2 - 27 * e1 ** 3 / 32) * Math.sin(2 * mu)
    + (21 * e1 ** 2 / 16 - 55 * e1 ** 4 / 32) * Math.sin(4 * mu)
    + (151 * e1 ** 3 / 96) * Math.sin(6 * mu)
    + (1097 * e1 ** 4 / 512) * Math.sin(8 * mu);
  const sinFootprint = Math.sin(footprint);
  const cosFootprint = Math.cos(footprint);
  const tanFootprint = Math.tan(footprint);
  const c1 = secondEccentricitySquared * cosFootprint ** 2;
  const t1 = tanFootprint ** 2;
  const n1 = semiMajor / Math.sqrt(1 - eccentricitySquared * sinFootprint ** 2);
  const r1 = semiMajor * (1 - eccentricitySquared) / (1 - eccentricitySquared * sinFootprint ** 2) ** 1.5;
  const d = x / (n1 * scale);
  const latitude = footprint - (n1 * tanFootprint / r1) * (
    d ** 2 / 2
    - (5 + 3 * t1 + 10 * c1 - 4 * c1 ** 2 - 9 * secondEccentricitySquared) * d ** 4 / 24
    + (61 + 90 * t1 + 298 * c1 + 45 * t1 ** 2 - 252 * secondEccentricitySquared - 3 * c1 ** 2) * d ** 6 / 720
  );
  const longitude = (
    d
    - (1 + 2 * t1 + c1) * d ** 3 / 6
    + (5 - 2 * c1 + 28 * t1 - 3 * c1 ** 2 + 8 * secondEccentricitySquared + 24 * t1 ** 2) * d ** 5 / 120
  ) / cosFootprint;

  return {
    lat: latitude * 180 / Math.PI,
    lng: 9 + longitude * 180 / Math.PI,
  };
}

function collectCoordinatePairs(value, pairs = []) {
  if (!Array.isArray(value)) return pairs;
  if (value.length >= 2 && Number.isFinite(value[0]) && Number.isFinite(value[1])) {
    pairs.push([value[0], value[1]]);
    return pairs;
  }
  value.forEach((entry) => collectCoordinatePairs(entry, pairs));
  return pairs;
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

function typeInfo(type) {
  if (type === "1106") {
    return {
      mapType: "designated",
      decision: "Ja, tenten is hier expliciet toegestaan.",
      stay: "1 nacht per plek",
      cost: "Gratis",
      rules: "Dit object staat zelf in de officiële categorie Frit teltningsområde. De Deense 1-2-3-regel geldt: één nacht, maximaal twee kleine tenten en maximaal drie personen per tent.",
    };
  }
  if (type === "1111") {
    return {
      mapType: "designated",
      decision: "Ja, dit is een officiële primitieve overnachtingsplek.",
      stay: "Volgens de locatiebeschrijving",
      cost: "Geen algemeen tarief vermeld",
      rules: "Overnachten is op deze gemarkeerde plek toegestaan. Capaciteit, reservering en aanwezige voorzieningen verschillen per locatie en staan hieronder.",
    };
  }
  return {
    mapType: "hut",
    decision: "Ja, dit is een officiële shelterovernachtingsplek.",
    stay: "Volgens de locatiebeschrijving",
    cost: "Geen algemeen tarief vermeld",
    rules: "De shelter staat als overnachtingsfaciliteit in Ud i Naturen. De locatiegegevens hieronder geven aan of boeken mogelijk is en hoeveel plaatsen zijn gemeld.",
  };
}

function practicalFacts(text, type, bookingFlag) {
  const normalized = text.toLowerCase();
  const price = normalized.match(/(?:kr\.?\s*)?(\d+(?:[.,]\d+)?)\s*(?:kr\.?|dkk)(?:\s*\/\s*[^.,;]+)?/i);
  let cost = type === "1106" ? "Gratis" : "Geen tarief genoemd";
  if (/gratis|fri afbenyttelse|free of charge/.test(normalized)) cost = "Gratis volgens locatiebeschrijving";
  if (price) cost = `Tarief genoemd: ${price[0].replace(/\s+/g, " ").trim()}`;

  let booking = bookingFlag ? "Boekbaar" : "Geen reservering vermeld";
  if (/kan ikke bookes|ikke muligt at booke|først til mølle/.test(normalized)) booking = "Niet reserveerbaar; vrije inloop";
  if (/skal bookes|skal reserveres|reservation er påkrævet/.test(normalized)) booking = "Reservering verplicht";

  let water = "Niet vermeld";
  if (/ingen (?:drikke)?vand|ikke adgang til vand/.test(normalized)) water = "Geen water volgens beschrijving";
  else if (/drikkevand|vandpost|vandhane|adgang til vand|vand i sommer/.test(normalized)) water = "Water genoemd in beschrijving";

  let toilet = "Niet vermeld";
  if (/ingen toilet/.test(normalized)) toilet = "Geen toilet volgens beschrijving";
  else if (/toilet/.test(normalized)) toilet = "Toilet genoemd in beschrijving";

  return { cost, booking, water, toilet };
}

function localRestriction(text) {
  const normalized = text.toLowerCase();
  if (/klitfredet[^.]*ikke (?:er )?tilladt|ikke (?:er )?tilladt[^.]*klitfredet/.test(normalized)) {
    return "Een beschermd duin- of kustdeel is plaatselijk uitgesloten; tent alleen buiten die zone.";
  }
  if (/ikke (?:er )?tilladt|må ikke|forbudt/.test(normalized)) {
    return "De officiële locatiebeschrijving noemt een plaatselijke activiteit of zone die niet is toegestaan; lees de Deense toelichting hieronder voor het genoemde deel.";
  }
  if (/udenfor (?:skoleferierne|åbningstid)|kun (?:efter|mellem)|mandag|tirsdag|onsdag|torsdag|fredag/.test(normalized)) {
    return "De officiële locatiebeschrijving noemt een tijds- of gebruiksbeperking; de relevante Deense toelichting staat hieronder.";
  }
  return "";
}

function detailUrl(item) {
  const slug = item.type.toLowerCase().replaceAll(" ", "-");
  return `https://udinaturen.dk/facilitet/${encodeURIComponent(slug)}/?id=${encodeURIComponent(item.id)}`;
}

function buildDenmarkPlaces() {
  const places = [];
  const seen = new Set();
  const existingSnapshotPath = path.join(path.dirname(outputPath), "data", "denmark-DK.json");
  const hasRawUdData = regions.some((region) => types.some((type) => fs.existsSync(path.join(udDir, `ud-${region}-${type}.json`))));

  if (!hasRawUdData) {
    if (!fs.existsSync(existingSnapshotPath)) return publishedItems("denmark").sort((a, b) => a.name.localeCompare(b.name, "da"));
    return (JSON.parse(fs.readFileSync(existingSnapshotPath, "utf8")).places || [])
      .sort((a, b) => a.name.localeCompare(b.name, "da"));
  }

  for (const region of regions) {
    for (const type of types) {
      const filePath = path.join(udDir, `ud-${region}-${type}.json`);
      if (!fs.existsSync(filePath)) continue;
      const items = JSON.parse(fs.readFileSync(filePath, "utf8"));

      for (const item of items) {
        if (seen.has(item.id)) continue;
        seen.add(item.id);
        const pairs = collectCoordinatePairs(item.geometry);
        if (!pairs.length) continue;
        const center = pairs.reduce((sum, [x, y]) => ({ x: sum.x + x, y: sum.y + y }), { x: 0, y: 0 });
        const coordinate = utm32ToWgs84(center.x / pairs.length, center.y / pairs.length);
        const info = typeInfo(type);
        const officialDescription = plainText(item.longDescription || item.description).slice(0, 1400);
        const bookingUrl = /^https?:\/\//i.test(item.bookingLink || "") ? item.bookingLink.trim() : "";
        const facts = practicalFacts(officialDescription, type, Boolean(item.booking));
        const restriction = localRestriction(officialDescription);

        places.push({
          id: item.id,
          country: "DK",
          name: plainText(item.name) || item.type,
          region: regionNames[region],
          lat: Number(coordinate.lat.toFixed(6)),
          lng: Number(coordinate.lng.toFixed(6)),
          type: info.mapType,
          category: item.type,
          decision: restriction ? `${info.decision} Er geldt wel een lokale beperking.` : info.decision,
          description: officialDescription || plainText(item.description) || "Geen aanvullende locatiebeschrijving gepubliceerd.",
          rules: info.rules,
          stay: info.stay,
          cost: facts.cost || info.cost,
          capacity: Number(item.antalPladser) > 0 ? Number(item.antalPladser) : null,
          booking: Boolean(item.booking),
          bookingStatus: facts.booking,
          bookingUrl,
          water: facts.water,
          toilet: facts.toilet,
          localRestriction: restriction,
          accessible: plainText(item.handicapAccessible) || "Niet vermeld",
          manager: plainText(item.ansvar_Org) || "Niet vermeld",
          image: /^https?:\/\//i.test(item.image || "") ? item.image.trim() : "",
          sourceUrl: detailUrl(item),
        });
      }
    }
  }

  return places.sort((a, b) => a.name.localeCompare(b.name, "da"));
}

function normalizeCampingPlace(place) {
  const lat = Number(place.lat);
  const lng = Number(place.lng);
  if (!Number.isFinite(lat) || !Number.isFinite(lng)) return null;
  const country = place.country || countryFor(lat, lng);
  if (!countryCodes.includes(country)) return null;
  return {
    osmKey: String(place.osmKey || ""),
    country,
    lat: Number(lat.toFixed(6)),
    lng: Number(lng.toFixed(6)),
    name: plainText(place.name || place.operator || "Naamloze camping"),
    tourism: place.tourism === "caravan_site" ? "caravan_site" : "camp_site",
    locality: plainText(place.locality || ""),
    website: String(place.website || ""),
    phone: String(place.phone || ""),
    email: String(place.email || ""),
    access: String(place.access || ""),
    tents: String(place.tents || ""),
    campers: String(place.campers || ""),
    category: String(place.category || ""),
    capacity: String(place.capacity || ""),
    charge: String(place.charge || ""),
    cabins: String(place.cabins || ""),
    caravans: String(place.caravans || ""),
    motorhome: String(place.motorhome || ""),
    operator: plainText(place.operator || ""),
    openingHours: String(place.openingHours || ""),
    stars: String(place.stars || ""),
    toilets: String(place.toilets || ""),
    shower: String(place.shower || ""),
    powerSupply: String(place.powerSupply || ""),
    fee: String(place.fee || ""),
    drinkingWater: String(place.drinkingWater || ""),
    waterPoint: String(place.waterPoint || ""),
    image: String(place.image || ""),
    wikimediaCommons: String(place.wikimediaCommons || ""),
    sourceUrl: String(place.sourceUrl || ""),
  };
}

function buildCampingPlaces() {
  if (fs.existsSync(campingPath)) {
    const snapshot = JSON.parse(fs.readFileSync(campingPath, "utf8"));
    return (snapshot.places || [])
      .map(normalizeCampingPlace)
      .filter(Boolean)
      .sort((a, b) => a.country.localeCompare(b.country) || a.name.localeCompare(b.name));
  }

  const existingDataDir = path.join(path.dirname(outputPath), "data");
  return countryCodes.flatMap((country) => {
    const filePath = path.join(existingDataDir, `camping-${country}.json`);
    if (!fs.existsSync(filePath)) return [];
    const payload = JSON.parse(fs.readFileSync(filePath, "utf8"));
    return (payload.places || []).map(normalizeCampingPlace).filter(Boolean);
  });
}

function campwildTypeLabel(type) {
  return {
    hut: "Hut",
    "lean-to": "Lean-to",
    basic_shelter: "Basic shelter",
    weather_shelter: "Weather shelter",
    bivouac: "Bivouac",
  }[type] || "";
}

function normalizeCampwildPlace(place) {
  const lat = Number(place.lat);
  const lng = Number(place.lng);
  if (!Number.isFinite(lat) || !Number.isFinite(lng)) return null;
  const sourceType = String(place.type || "");
  const typeLabel = campwildTypeLabel(sourceType);
  if (!typeLabel) return null;
  const country = place.country || countryFor(lat, lng);
  if (!countryCodes.includes(country)) return null;
  const id = Number(place.id);
  if (!Number.isFinite(id)) return null;
  const nookType = sourceType === "bivouac" ? "designated" : "hut";
  return {
    id,
    country,
    lat: Number(lat.toFixed(6)),
    lng: Number(lng.toFixed(6)),
    sourceType,
    typeLabel,
    type: nookType,
    name: `CampWild ${typeLabel}`,
    sourceUrl: `https://map.campwild.org/places/${id}/`,
  };
}

function buildCampwildPlaces() {
  let places = [];
  if (fs.existsSync(campwildPath)) {
    const snapshot = JSON.parse(fs.readFileSync(campwildPath, "utf8"));
    places = snapshot.places || [];
  } else {
    const existingDataDir = path.join(path.dirname(outputPath), "data");
    places = countryCodes.flatMap((country) => {
      const filePath = path.join(existingDataDir, `campwild-${country}.json`);
      if (!fs.existsSync(filePath)) return [];
      const payload = JSON.parse(fs.readFileSync(filePath, "utf8"));
      return payload.places || [];
    });
  }
  return places
    .map(normalizeCampwildPlace)
    .filter(Boolean)
    .sort((a, b) => a.country.localeCompare(b.country) || a.id - b.id);
}

function officialDenmarkDuplicate(sourcePlace, officialPlaces) {
  if (sourcePlace.country !== "DK") return null;
  return officialPlaces.find((officialPlace) => distanceMeters(sourcePlace, officialPlace) <= CAMPWILD_DK_OFFICIAL_DUPLICATE_RADIUS_METERS) || null;
}

function filterCampwildOfficialDuplicates(sourcePlaces, officialPlaces) {
  const officialDenmarkPlaces = officialPlaces
    .filter((place) => Number.isFinite(Number(place.lat)) && Number.isFinite(Number(place.lng)));
  const suppressed = [];
  const places = sourcePlaces.filter((place) => {
    const duplicate = officialDenmarkDuplicate(place, officialDenmarkPlaces);
    if (!duplicate) return true;
    suppressed.push({ campwildId: place.id, officialId: duplicate.id });
    return false;
  });
  return { places, suppressed };
}

const vodfPins = buildVodfPins();
const wtmgPins = buildWtmgPins();
const nitetentPins = publishedItems("nitetent");
const denmarkPlaces = buildDenmarkPlaces();
const campingPlaces = buildCampingPlaces();
const campwildRawPlaces = buildCampwildPlaces();
const campwildDedupe = filterCampwildOfficialDuplicates(campwildRawPlaces, denmarkPlaces);
const campwildPlaces = campwildDedupe.places;
const overviewCountries = Object.fromEntries(countryCodes.map((country) => [
  country,
  {
    vodf: vodfPins.filter((pin) => pin.country === country).length,
    wtmg: wtmgPins.filter((pin) => pin.country === country).length,
    nitetent: nitetentPins.filter((pin) => pin.country === country).length,
    camping: campingPlaces.filter((place) => place.country === country).length,
    campwild: campwildPlaces.filter((place) => place.country === country).length,
    campwildHut: campwildPlaces.filter((place) => place.country === country && place.type === "hut").length,
    campwildDesignated: campwildPlaces.filter((place) => place.country === country && place.type === "designated").length,
    denmark: country === "DK" ? denmarkPlaces.length : 0,
    denmarkDesignated: country === "DK" ? denmarkPlaces.filter((place) => place.type === "designated").length : 0,
    denmarkHut: country === "DK" ? denmarkPlaces.filter((place) => place.type === "hut").length : 0,
  },
]));
const output = {
  generatedAt: new Date().toISOString().slice(0, 10),
  overview: {
    countries: overviewCountries,
  },
  vodf: {
    source: "https://www.vriendenopdefiets.nl/zoek-een-logeeradres",
    totalVisible: vodfPins.length,
    uniqueLocations: new Set(vodfPins.map((pin) => `${pin.lat}:${pin.lng}`)).size,
    pins: vodfPins,
  },
  wtmg: {
    source: "https://welcometomygarden.org/nl/explore",
    totalVisible: wtmgPins.length,
    pins: wtmgPins,
  },
  denmark: {
    source: "https://udinaturen.dk/kort",
    places: denmarkPlaces,
  },
  camping: {
    source: "https://opencampingmap.org/",
    totalVisible: campingPlaces.length,
    places: campingPlaces,
  },
  campwild: {
    source: "https://map.campwild.org/",
    totalVisible: campwildPlaces.length,
    suppressedOfficialDuplicates: campwildDedupe.suppressed.length,
    places: campwildPlaces,
  },
};

const dataDir = path.join(path.dirname(outputPath), "data");
fs.mkdirSync(dataDir, { recursive: true });

for (const country of countryCodes) {
  fs.writeFileSync(
    path.join(dataDir, `vodf-${country}.json`),
    `${JSON.stringify({
      generatedAt: output.generatedAt,
      source: output.vodf.source,
      country,
      pins: vodfPins.filter((pin) => pin.country === country),
    })}\n`,
  );
  fs.writeFileSync(
    path.join(dataDir, `wtmg-${country}.json`),
    `${JSON.stringify({
      generatedAt: output.generatedAt,
      source: output.wtmg.source,
      country,
      pins: wtmgPins.filter((pin) => pin.country === country),
    })}\n`,
  );
  fs.writeFileSync(
    path.join(dataDir, `camping-${country}.json`),
    `${JSON.stringify({
      generatedAt: output.generatedAt,
      source: output.camping.source,
      country,
      places: campingPlaces.filter((place) => place.country === country),
    })}\n`,
  );
  fs.writeFileSync(
    path.join(dataDir, `campwild-${country}.json`),
    `${JSON.stringify({
      generatedAt: output.generatedAt,
      source: output.campwild.source,
      country,
      suppressedOfficialDuplicates: country === "DK" ? campwildDedupe.suppressed.length : 0,
      places: campwildPlaces.filter((place) => place.country === country),
    })}\n`,
  );
}

fs.writeFileSync(
  path.join(dataDir, "denmark-DK.json"),
  `${JSON.stringify({
    generatedAt: output.generatedAt,
    source: output.denmark.source,
    country: "DK",
    places: denmarkPlaces,
  })}\n`,
);

const shellData = {
  generatedAt: output.generatedAt,
  overview: output.overview,
  nitetent: { source: "https://1nitetent.com/#map", totalVisible: nitetentPins.length, pins: [] },
  vodf: {
    source: output.vodf.source,
    totalVisible: output.vodf.totalVisible,
    uniqueLocations: output.vodf.uniqueLocations,
    pins: [],
  },
  wtmg: {
    source: output.wtmg.source,
    totalVisible: output.wtmg.totalVisible,
    pins: [],
  },
  denmark: {
    source: output.denmark.source,
    places: [],
  },
  camping: {
    source: output.camping.source,
    totalVisible: output.camping.totalVisible,
    places: [],
  },
  campwild: {
    source: output.campwild.source,
    totalVisible: output.campwild.totalVisible,
    suppressedOfficialDuplicates: output.campwild.suppressedOfficialDuplicates,
    places: [],
  },
};

fs.writeFileSync(outputPath, `window.NOOK_DATA = ${JSON.stringify(shellData)};\n`);
console.log(`Geschreven: ${outputPath} en ${dataDir}`);
console.log(`Vrienden op de Fiets: ${vodfPins.length} openbare kaartpins op ${output.vodf.uniqueLocations} locaties`);
console.log(`Welcome To My Garden: ${wtmgPins.length} openbare kaartpins in de app-landen`);
console.log(`Ud i Naturen: ${denmarkPlaces.length} officiële slaapplekken`);
console.log(`OpenStreetMap-campings: ${campingPlaces.length} kaartpins in de app-landen`);
console.log(`CampWild: ${campwildPlaces.length} hutten, bivakplekken en shelters in de app-landen`);
console.log(`CampWild DK-dubbelen onderdrukt via Ud i Naturen: ${campwildDedupe.suppressed.length}`);

const mapIndex = buildMapData(dataDir);
console.log(`Kaartindex: ${mapIndex.count} plekken in ${mapIndex.chunks.length} detailbestanden`);
