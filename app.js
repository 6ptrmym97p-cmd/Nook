const SOURCE_TEXT_EN = {
  "Zuid-Denemarken en Funen": "Southern Denmark and Funen",
  "De shelter staat als overnachtingsfaciliteit in Ud i Naturen. De locatiegegevens hieronder geven aan of boeken mogelijk is en hoeveel plaatsen zijn gemeld.": "The shelter is an overnight facility in Ud i Naturen. The location details below indicate whether booking is possible and how many places have been reported.",
  "Ja, dit is een officiële shelterovernachtingsplek. Er geldt wel een lokale beperking.": "Yes, this is an official overnight shelter. A local restriction applies.",
  "Volgens de locatiebeschrijving": "According to the location description",
  "Geen tarief genoemd": "No rate mentioned",
  "Niet vermeld": "Not listed",
  "Niet reserveerbaar; vrije inloop": "Not reservable; free entry",
  "Toilet genoemd in beschrijving": "Toilet mentioned in description",
  "De officiële locatiebeschrijving noemt een plaatselijke activiteit of zone die niet is toegestaan; lees de Deense toelichting hieronder voor het genoemde deel.": "The official location description mentions a local activity or zone that is not permitted; read the Danish explanation below for the mentioned part.",
  "Ja, dit is een officiële shelterovernachtingsplek.": "Yes, this is an official overnight shelter.",
  "Geen reservering vermeld": "No reservation noted",
  "Overnachten is op deze gemarkeerde plek toegestaan. Capaciteit, reservering en aanwezige voorzieningen verschillen per locatie en staan hieronder.": "Spending the night is allowed at this marked spot. Capacity, reservation and available facilities differ per location and are listed below.",
  "Ja, dit is een officiële primitieve overnachtingsplek.": "Yes, this is an official basic campsite.",
  "Nej": "No",
  "Water genoemd in beschrijving": "Water mentioned in description",
  "Gratis volgens locatiebeschrijving": "Free according to location description",
  "Delvist": "Partly accessible",
  "Geen water volgens beschrijving": "No water as described",
  "Boekbaar": "Bookable",
  "Reservering verplicht": "Reservation required",
  "Ja": "Yes",
  "De officiële locatiebeschrijving noemt een tijds- of gebruiksbeperking; de relevante Deense toelichting staat hieronder.": "The official location description mentions a time or use restriction; the relevant Danish explanation is below.",
  "Seeland": "Zealand",
  "Dit object staat zelf in de officiële categorie Frit teltningsområde. De Deense 1-2-3-regel geldt: één nacht, maximaal twee kleine tenten en maximaal drie personen per tent.": "This forest is officially listed as a Frit teltningsområde. Denmark’s 1-2-3 rule applies: one night, at most two small tents and at most three people per tent.",
  "Ja, tenten is hier expliciet toegestaan.": "Yes, tents are explicitly allowed here.",
  "1 nacht per plek": "1 night per spot",
  "Gratis": "Free",
  "Ja, dit is een officiële primitieve overnachtingsplek. Er geldt wel een lokale beperking.": "Yes, this is an official basic campsite. A local restriction applies.",
  "Ja, tenten is hier expliciet toegestaan. Er geldt wel een lokale beperking.": "Yes, tents are explicitly allowed here. A local restriction applies.",
  "Hoofdstad en Bornholm": "Capital and Bornholm",
  "Geen toilet volgens beschrijving": "No toilet as described",
  "Midden-Jutland": "Central Jutland",
  "Noord-Jutland": "North Jutland",
  "Een beschermd duin- of kustdeel is plaatselijk uitgesloten; tent alleen buiten die zone.": "A protected dune or coastal section is locally excluded; tent only outside that zone."
};
function sourceText(value) {
  if (typeof value !== "string") return value || "";
  if (value.startsWith("Tarief genoemd: ")) return t("Listed price: {0}", value.slice("Tarief genoemd: ".length));
  return t(SOURCE_TEXT_EN[value] || value);
}

const sleepTypes = {
  wild: { label: t("Wild camping"), icon: "△" },
  designated: { label: t("Designated free site"), icon: "⌂" },
  hut: { label: t("Hut or shelter"), icon: "▰" },
  host: { label: t("Host network"), icon: "♥" },
  ask: { label: t("Ask permission"), icon: "?" },
  camping: { label: t("Campsite"), icon: "C" },
};

const countries = [
  {
    code: "NL",
    flag: "🇳🇱",
    name: t("Netherlands"),
    status: t("Strict"),
    statusClass: "status-strict",
    summary: t("You cannot generally pitch a tent wherever you like. Seek permission, use host networks or choose designated sites."),
    rules: [t("Staatsbosbeheer stopped its pole campsites in 2020"), t("Private property is allowed with explicit permission"), t("Local APV and site rules may apply additionally")],
    source: t("Staatsbosbeheer: end of pole camping"),
    url: "https://www.staatsbosbeheer.nl/wat-we-doen/nieuws/2020/05/sluiten-paalkampeerterreinen",
  },
  {
    code: "DE",
    flag: "🇩🇪",
    name: t("Germany"),
    status: t("By state"),
    statusClass: "status-mixed",
    summary: t("Not a simple national yes or no. The safest free route is consent; there are also trekking locations and regional exceptions."),
    rules: [t("Protected areas are a hard no"), t("Brandenburg, Mecklenburg-Vorpommern and Schleswig-Holstein have limited exceptions"), t("Check state and land ownership")],
    source: "Bundesnaturschutzgesetz",
    url: "https://www.gesetze-im-internet.de/bnatschg_2009/__59.html",
  },
  {
    code: "DK",
    flag: "🇩🇰",
    name: t("Denmark"),
    status: t("Designated sites"),
    statusClass: "status-good",
    summary: t("Wild camping is not allowed everywhere, but there is a strong official network of designated camping forests, shelters and basic sites."),
    rules: [t("Only forests on the official fri teltning map"), t("One night, maximum two small tents"), t("Use fire only where and when permitted")],
    source: "Danish Nature Agency",
    url: "https://eng.naturstyrelsen.dk/experience-nature/sleeping-outside-in-nature",
  },
  {
    code: "SE",
    flag: "🇸🇪",
    name: t("Sweden"),
    status: t("Generally allowed, with care"),
    statusClass: "status-good",
    summary: t("The allemansrätten allows one or two nights on suitable ground, as long as you do not disturb or damage it."),
    rules: [t("Usually one or two nights"), t("Not near homes, on fields or vulnerable land"), t("Reserves and fire bans may have stricter rules")],
    source: "Naturvårdsverket",
    url: "https://www.naturvardsverket.se/en/topics/the-right-of-public-access/activities-and-places/camping--tents/",
  },
  {
    code: "NO",
    flag: "🇳🇴",
    name: t("Norway"),
    status: t("Allowed by law"),
    statusClass: "status-good",
    summary: t("The Allemansretten allows tents on Utmark, with clear distance and residence rules and local exceptions."),
    rules: [t("At least 150 meters from inhabited houses and cabins"), t("Maximum two nights, except in remote mountains"), t("Local restrictions and the fire ban from 15 April to 15 September still apply")],
    source: "Norwegian Environment Agency",
    url: "https://www.environmentagency.no/areas-of-activity/right-to-roam/camping/",
  },
  {
    code: "BE",
    flag: "🇧🇪",
    name: t("Belgium"),
    status: t("Designated only"),
    statusClass: "status-mixed",
    summary: t("No general right to wild camping. Use bivouac zones, official areas, guest gardens or explicit permission."),
    rules: [t("You can reserve Nature and Forest bivouac zones in advance and free of charge"), t("Wallonia and other managers use their own capacity, times and fire rules"), t("Nature reserve or public forest is not automatically a camping spot")],
    source: t("Nature and Forest: camping"),
    url: "https://natuurenbos.be/activiteiten/bivakzone",
  },
  {
    code: "FR",
    flag: "🇫🇷",
    name: t("France"),
    status: t("Local rules apply"),
    statusClass: "status-mixed",
    summary: t("A small bivouac may be possible locally, but permission, municipal prohibitions and rules of each nature park determine the outcome."),
    rules: [t("Ask permission on private land"), t("Coasts, protected locations and locally prohibited zones are excluded"), t("Parks publish their own times, distances and bivouac zones")],
    source: "Parcs nationaux de France",
    url: "https://www.parcsnationaux.fr/",
  },
  {
    code: "LU",
    flag: "🇱🇺",
    name: t("Luxembourg"),
    status: t("Strict"),
    statusClass: "status-strict",
    summary: t("No general right to wild camp: use an official site, stay with a host or get permission in advance."),
    rules: [t("Forests and nature reserves are not free places to sleep"), t("Municipalities and site managers can impose additional prohibitions"), t("A marked campsite or private permit is the safe route")],
    source: t("Visit Luxembourg: campsites"),
    url: "https://www.visitluxembourg.com/plan-your-stay/stay/camping",
  },
  {
    code: "CH",
    flag: "🇨🇭",
    name: t("Switzerland"),
    status: t("Locally alpine"),
    statusClass: "status-mixed",
    summary: t("A discreet night above the tree line is often possible, but cantons, municipalities and protected areas determine the boundaries."),
    rules: [t("Not in reserves, game rest areas or the National Park"), t("Avoid sensitive biotopes, floodplains and busy hut environments"), t("Ask permission on private land and alpine meadows")],
    source: "Swiss Alpine Club",
    url: "https://www.sac-cas.ch/de/umwelt/bergsport-und-umwelt/campieren-und-biwakieren/",
  },
  {
    code: "AT",
    flag: "🇦🇹",
    name: t("Austria"),
    status: t("By state"),
    statusClass: "status-strict",
    summary: t("Camping in the forest without permission is prohibited; outside of this, rules vary greatly by state, municipality and protected area."),
    rules: [t("Forstgesetz §33 excludes camping and overnight stays in forests without permission"), t("High Alpine bivouac is regulated per federal state"), t("Nature and landscape protection areas often have additional prohibitions")],
    source: t("Austrian Forstgesetz §33"),
    url: "https://www.ris.bka.gv.at/NormDokument.wxe?Abfrage=Bundesnormen&Gesetzesnummer=10010371&Paragraf=33",
  },
  {
    code: "IT",
    flag: "🇮🇹",
    name: t("Italy"),
    status: t("Regional"),
    statusClass: "status-mixed",
    summary: t("There is no simple national consent. The region, province, municipality and park management determine whether a temporary bivouac is allowed."),
    rules: [t("Distinguish between short bivouac and multi-day camping"), t("Parks and municipalities can ban both completely"), t("Unmanned bivacco huts have their own rules of use")],
    source: "Club Alpino Italiano",
    url: "https://www.cai.it/",
  },
];

const sources = [
  { icon: "R", name: "Refuges.info", description: t("Shelter or hut; check source and local rules"), meta: "CC BY-SA 2.0", url: "https://www.refuges.info/" },
  { icon: "T", name: "1NITE TENT", description: t("Camp in a host’s garden. Arrange your stay through the website first."), meta: t("One night only"), url: "https://1nitetent.com/#map" },
  { icon: "W", name: "Warmshowers", description: t("Worldwide host network with a map in its mobile app. Nook does not currently have a stable public export for including these locations."), meta: t("Map visible in official app"), url: "https://play.google.com/store/apps/details?id=org.warmshowers.app" },
  { icon: "V", name: "Vrienden op de Fiets", description: t("The public map feed provides individual map positions and generic features without address fields. Nook groups nearby places across national borders and shows individual source pins when zooming in."), meta: t("5,341 pins · 38 European countries · July 7, 2026"), url: "https://www.vriendenopdefiets.nl/zoek-een-logeeradres" },
  { icon: "G", name: "Welcome To My Garden", description: t("The public explore map provides individual garden positions, basic facilities and, where available, a garden photo. These are spatially clustered on the map and shown separately when zooming in further."), meta: t("5,921 pins · 4,321 photos · July 7, 2026"), url: "https://welcometomygarden.org/nl/explore" },
  { icon: "U", name: "Ud i Naturen", description: t("Official Danish map data with concrete free tent areas, primitive overnight accommodations and shelters, including location description, capacity and booking status."), meta: t("2,480 official spots · June 14, 2026"), url: "https://udinaturen.dk/kort" },
  { icon: "C", name: t("OpenStreetMap campsites"), description: t("Campsites and motorhome sites from OpenStreetMap via OpenCampingMap, shown as clusters and individual map pins."), meta: t("82,084 pins · 47 countries · July 7, 2026"), url: "https://opencampingmap.org/" },
  { icon: "CW", name: "CampWild", description: t("Public map of shelters, lean-tos, bivouac sites and huts. Nook includes places clearly intended for sleeping or shelter and prioritises official Ud i Naturen records in Denmark."), meta: t("5,944 places · 92 Danish duplicates removed · 7 July 2026"), url: "https://map.campwild.org/" },
  { icon: "F", name: "De Wereldfietser", description: t("Forum and association with a lot of experiential knowledge about routes, material and overnight stays along the way."), meta: t("Forum · Dutch"), url: "https://forum.wereldfietser.nl/" },
  { icon: "R", name: "Reddit", description: t("Recent experiences and local tips, useful as a guide. Then verify each claim with a primary source."), meta: t("Community · varying"), url: "https://www.reddit.com/r/bikepacking/search/?q=camping%20sweden%20denmark%20germany" },
];

const ICON_CLOSE = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg>';
const ICON_CHEVRON = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M9 6l6 6-6 6"/></svg>';
const ICON_EXTERNAL = '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M7 17L17 7M9 7h8v8"/></svg>';
const ICON_NAVIGATE = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 3l7 18-7-4-7 4z"/></svg>';
const ROUTE_DISTANCE_PRESETS = [3, 10, 25];

const publicData = window.NOOK_DATA || {};
const MAP_VIEW_KEY = "nook-map-view-v1";
const savedMapView = storedJson(MAP_VIEW_KEY);
const hasSavedMapView = validMapPoint(savedMapView) && Number.isFinite(savedMapView.zoom) && savedMapView.zoom >= 2 && savedMapView.zoom <= 19;

const reduceMapMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const map = L.map("map", {
  zoomControl: false,
  minZoom: 2,
  fadeAnimation: false,
  markerZoomAnimation: false,
  zoomAnimation: !reduceMapMotion,
  bounceAtZoomLimits: false,
  wheelDebounceTime: 80,
  wheelPxPerZoomLevel: 60,
}).setView(hasSavedMapView ? [savedMapView.lat, savedMapView.lng] : [52.4, 8.8], hasSavedMapView ? savedMapView.zoom : 4);
const DirectZoomControl = L.Control.Zoom.extend({
  _zoomIn(event) {
    if (!this._disabled) navigateMapTo(map.getCenter(), map.getZoom() + map.options.zoomDelta * (event.shiftKey ? 3 : 1));
  },
  _zoomOut(event) {
    if (!this._disabled) navigateMapTo(map.getCenter(), map.getZoom() - map.options.zoomDelta * (event.shiftKey ? 3 : 1));
  },
});
new DirectZoomControl({ position: "topright" }).addTo(map);

const baseMap = L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
  updateWhenIdle: false,
  updateWhenZooming: false,
  updateInterval: 250,
  keepBuffer: 3,
  maxZoom: 19,
  referrerPolicy: "strict-origin-when-cross-origin",
  attribution: `&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>`,
}).addTo(map);

const routeLayer = L.layerGroup().addTo(map);
const locationLayer = L.layerGroup().addTo(map);
const sourceMapLayer = L.layerGroup().addTo(map);
map.createPane("sourcePins").style.zIndex = 450;
const pinRenderer = new L.NookCanvas({ padding: 0.25, pane: "sourcePins" }).addTo(map);
const pinAccessibility = document.createElement("div");
pinAccessibility.className = "visually-hidden";
pinAccessibility.setAttribute("role", "group");
pinAccessibility.setAttribute("aria-label", t("Places on the map"));
document.querySelector(".map-frame").append(pinAccessibility);
let accessiblePinKeys = "";
let mapIsMoving = false;

function navigateMapTo(latlng, zoom) {
  // Fly animations zoom out, travel, then zoom in and can take several seconds.
  // Keep direct navigation immediate; ordinary gestures retain native zoom.
  map.stop();
  map.setView(latlng, zoom, { animate: false });
}

function clusterVisual(count) {
  if (count >= 1000) return { size: 62, density: "cluster-density-peak" };
  if (count >= 250) return { size: 58, density: "cluster-density-high" };
  if (count >= 50) return { size: 54, density: "cluster-density-medium" };
  if (count >= 10) return { size: 48, density: "cluster-density-normal" };
  return { size: 44, density: "cluster-density-low" };
}

function countClusterIcon(className, count, { prefix = "" } = {}) {
  const visual = clusterVisual(count);
  return L.divIcon({
    className: "",
    html: `<div class="map-count-cluster ${className} ${visual.density}">${prefix ? `<span>${escapeHtml(prefix)}</span>` : ""}<strong>${escapeHtml(compactCount(count))}</strong></div>`,
    iconSize: [visual.size, visual.size],
    iconAnchor: [visual.size / 2, visual.size / 2],
  });
}

function sourceClusterLayer(className) {
  return L.markerClusterGroup
    ? L.markerClusterGroup({
        // Incremental updates must finish before the next filter or viewport update.
        chunkedLoading: false,
        disableClusteringAtZoom: 15,
        maxClusterRadius: (zoom) => {
          if (zoom < 5) return 132;
          if (zoom < 7) return 108;
          if (zoom < 10) return 76;
          return 52;
        },
        showCoverageOnHover: false,
        spiderfyOnMaxZoom: true,
        iconCreateFunction: (cluster) => countClusterIcon(className, cluster.getChildCount()),
      }).addTo(map)
    : L.layerGroup().addTo(map);
}

const importedLayer = sourceClusterLayer("cluster-imported");
const visiblePlaceCounts = { hospitality: 0, denmark: 0, campwild: 0, refuges: 0, camping: 0, imported: 0 };
const ROUTE_LIBRARY_KEY = "nook-saved-routes-v1";
const LEGACY_ROUTE_KEY = "nook-saved-route-v1";
let importedWaypoints = [];
let savedRoutes = [];
let routesPersisted = true;
let removedRoutes = [];
let currentCandidates = [];
let displayedCandidates = [];
let userLocation = null;
let locationMessage = "";
let candidatePanelOpen = false;
let candidateHorizonKm = 35;
let routeState = {
  name: "",
  pointCount: 0,
  lengthKm: 0,
  saved: false,
  lines: [],
  segments: [],
  segmentGrid: new Map(),
};

const ROUTE_GRID_DEGREES = 0.25;
let viewportRefreshTimer = 0;

function escapeHtml(value = "") {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function routeFilterEnabled() {
  return routeState.segments.length > 0 && routeFilterActive;
}

function pointToSegmentDistanceKm(lat, lng, start, end) {
  const kmPerLat = 110.574;
  const kmPerLng = 111.32 * Math.cos(lat * Math.PI / 180);
  const ax = (start.lng - lng) * kmPerLng;
  const ay = (start.lat - lat) * kmPerLat;
  const bx = (end.lng - lng) * kmPerLng;
  const by = (end.lat - lat) * kmPerLat;
  const dx = bx - ax;
  const dy = by - ay;
  const lengthSquared = dx * dx + dy * dy;
  const fraction = lengthSquared ? Math.max(0, Math.min(1, -(ax * dx + ay * dy) / lengthSquared)) : 0;
  return Math.hypot(ax + fraction * dx, ay + fraction * dy);
}

function isWithinRoute(lat, lng) {
  if (!routeFilterEnabled()) return true;
  const distanceKm = routeDistanceKm;
  const latPadding = distanceKm / 110.574;
  const lngPadding = distanceKm / Math.max(20, 111.32 * Math.cos(lat * Math.PI / 180));

  return routeSegmentCandidates(lat, lng, distanceKm).some((segment) => {
    if (lat < segment.minLat - latPadding || lat > segment.maxLat + latPadding) return false;
    if (lng < segment.minLng - lngPadding || lng > segment.maxLng + lngPadding) return false;
    return pointToSegmentDistanceKm(lat, lng, segment.start, segment.end) <= distanceKm;
  });
}

function simplifyRouteLine(points, limit) {
  if (points.length <= limit) return points;
  const step = (points.length - 1) / (limit - 1);
  const simplified = Array.from({ length: limit - 1 }, (_, index) => points[Math.round(index * step)]);
  simplified.push(points[points.length - 1]);
  return simplified;
}

function prepareRouteLines(lines) {
  const totalPoints = lines.reduce((total, line) => total + line.length, 0);
  return lines.map((line) => {
    const share = Math.max(2, Math.round(2000 * (line.length / totalPoints)));
    return simplifyRouteLine(line, share);
  });
}

function routeSegments(lines) {
  let progressKm = 0;
  let segmentId = 0;
  return lines.flatMap((line) => line.slice(1).map((end, index) => {
    const start = line[index];
    const lengthKm = distanceBetweenPointsKm(start, end);
    const segment = {
      start,
      end,
      id: segmentId++,
      lengthKm,
      progressKm,
      minLat: Math.min(start.lat, end.lat),
      maxLat: Math.max(start.lat, end.lat),
      minLng: Math.min(start.lng, end.lng),
      maxLng: Math.max(start.lng, end.lng),
    };
    progressKm += lengthKm;
    return segment;
  }));
}

function routeGridCell(value) {
  return Math.floor(value / ROUTE_GRID_DEGREES);
}

function routeGridKey(latCell, lngCell) {
  return `${latCell}:${lngCell}`;
}

function buildRouteSegmentGrid(segments) {
  const grid = new Map();
  segments.forEach((segment) => {
    const minLatCell = routeGridCell(segment.minLat);
    const maxLatCell = routeGridCell(segment.maxLat);
    const minLngCell = routeGridCell(segment.minLng);
    const maxLngCell = routeGridCell(segment.maxLng);
    for (let latCell = minLatCell; latCell <= maxLatCell; latCell += 1) {
      for (let lngCell = minLngCell; lngCell <= maxLngCell; lngCell += 1) {
        const key = routeGridKey(latCell, lngCell);
        if (!grid.has(key)) grid.set(key, []);
        grid.get(key).push(segment);
      }
    }
  });
  return grid;
}

function routeSegmentCandidates(lat, lng, distanceKm) {
  if (!routeState.segmentGrid.size) return routeState.segments;
  const latPadding = distanceKm / 110.574;
  const lngPadding = distanceKm / Math.max(20, 111.32 * Math.cos(lat * Math.PI / 180));
  const minLatCell = routeGridCell(lat - latPadding);
  const maxLatCell = routeGridCell(lat + latPadding);
  const minLngCell = routeGridCell(lng - lngPadding);
  const maxLngCell = routeGridCell(lng + lngPadding);
  const seen = new Set();
  const candidates = [];

  for (let latCell = minLatCell; latCell <= maxLatCell; latCell += 1) {
    for (let lngCell = minLngCell; lngCell <= maxLngCell; lngCell += 1) {
      (routeState.segmentGrid.get(routeGridKey(latCell, lngCell)) || []).forEach((segment) => {
        if (seen.has(segment.id)) return;
        seen.add(segment.id);
        candidates.push(segment);
      });
    }
  }
  return candidates;
}

function distanceBetweenPointsKm(start, end) {
  const earthRadiusKm = 6371;
  const latitudeDelta = (end.lat - start.lat) * Math.PI / 180;
  const longitudeDelta = (end.lng - start.lng) * Math.PI / 180;
  const startLatitude = start.lat * Math.PI / 180;
  const endLatitude = end.lat * Math.PI / 180;
  const haversine = Math.sin(latitudeDelta / 2) ** 2
    + Math.cos(startLatitude) * Math.cos(endLatitude) * Math.sin(longitudeDelta / 2) ** 2;
  return 2 * earthRadiusKm * Math.asin(Math.sqrt(haversine));
}

function boundsDiagonalKm(bounds) {
  return distanceBetweenPointsKm(
    { lat: bounds.getSouth(), lng: bounds.getWest() },
    { lat: bounds.getNorth(), lng: bounds.getEast() },
  );
}

function boundsAroundPoint(point, radiusKm) {
  const latDelta = radiusKm / 110.574;
  const lngDelta = radiusKm / Math.max(20, 111.32 * Math.cos(point.lat * Math.PI / 180));
  return L.latLngBounds(
    [point.lat - latDelta, point.lng - lngDelta],
    [point.lat + latDelta, point.lng + lngDelta],
  );
}

function focusDetailsAroundMapCenter() {
  if (map.getZoom() >= 9) return;
  const center = map.getCenter();
  navigateMapTo([center.lat, center.lng], 9);
}

function routeLengthKm(lines) {
  return lines.reduce((total, line) => total + line.slice(1).reduce(
    (lineTotal, point, index) => lineTotal + distanceBetweenPointsKm(line[index], point),
    0,
  ), 0);
}

function pointProjectionOnSegment(lat, lng, segment) {
  const kmPerLat = 110.574;
  const kmPerLng = 111.32 * Math.cos(lat * Math.PI / 180);
  const ax = (segment.start.lng - lng) * kmPerLng;
  const ay = (segment.start.lat - lat) * kmPerLat;
  const bx = (segment.end.lng - lng) * kmPerLng;
  const by = (segment.end.lat - lat) * kmPerLat;
  const dx = bx - ax;
  const dy = by - ay;
  const lengthSquared = dx * dx + dy * dy;
  const fraction = lengthSquared ? Math.max(0, Math.min(1, -(ax * dx + ay * dy) / lengthSquared)) : 0;
  return {
    distanceKm: Math.hypot(ax + fraction * dx, ay + fraction * dy),
    fraction,
  };
}

function nearestRoutePosition(lat, lng, maxSearchKm = 60) {
  if (!routeState.segments.length) return null;
  return routeSegmentCandidates(lat, lng, maxSearchKm).reduce((nearest, segment) => {
    const projection = pointProjectionOnSegment(lat, lng, segment);
    if (nearest && nearest.distanceKm <= projection.distanceKm) return nearest;
    return {
      distanceKm: projection.distanceKm,
      progressKm: segment.progressKm + (segment.lengthKm * projection.fraction),
    };
  }, null);
}

function addCandidate(lat, lng, place, provider) {
  currentCandidates.push({ lat, lng, place, provider });
}

function markerIcon(type) {
  const config = sleepTypes[type] || sleepTypes.ask;
  return L.divIcon({
    className: "",
    html: `<div class="sleep-marker marker-${type}"><span>${config.icon}</span></div>`,
    iconSize: [32, 32],
    iconAnchor: [16, 16],
  });
}

function renderEmptyPanel() {
  placeDetailSequence++;
  const panel = document.querySelector("#place-panel");
  if (panel.contains(document.activeElement)) document.querySelector("#map").focus({ preventScroll: true });
  panel.inert = true;
  panel.classList.remove("is-open");
  panel.setAttribute("aria-hidden", "true");
  panel.innerHTML = "";
}

function placeSheetHeader(title, meta = "") {
  return `
    <div class="sheet-header">
      <div><h2>${escapeHtml(title)}</h2>${meta}</div>
      <button class="icon-button place-panel-close" type="button" aria-label="${th("Close location information")}">${ICON_CLOSE}</button>
    </div>`;
}

function openPlacePanel() {
  const panel = document.querySelector("#place-panel");
  panel.querySelector(".place-panel-close").addEventListener("click", () => renderEmptyPanel());
  panel.classList.add("is-open");
  panel.setAttribute("aria-hidden", "false");
  panel.inert = false;
  panel.focus({ preventScroll: true });
}

function showPlaceMessage(title, message) {
  renderEmptyPanel();
  const panel = document.querySelector("#place-panel");
  panel.innerHTML = `${placeSheetHeader(title)}<p class="place-message">${escapeHtml(message)}</p>`;
  openPlacePanel();
}

function placeFacts(place) {
  const unknown = new Set([t("Not listed"), t("Check with source"), t("According to camping conditions")]);
  const hidden = new Set([t("CampWild ID"), t("Coordinate"), t("Source"), t("Type"), t("Website"), t("Telephone"), t("Email")]);
  const repeated = new Set([place.description, place.decision].filter(Boolean));
  return [[t("Stay"), place.stay], [t("Cost"), place.cost], [t("Water"), place.water], ...(place.extraFacts || [])]
    .filter(([label, value]) => value && !unknown.has(String(value)) && !hidden.has(label) && !repeated.has(value));
}

// Opening a place fetches a nearby photo, elevation and the nearest town. Only the
// place's coordinates are sent, never the visitor's location, and failures are silent.
const placeExtrasCache = new Map();
const NEARBY_PHOTO_RADIUS_M = 1500;

async function fetchJsonWithTimeout(url, options = {}) {
  const controller = new AbortController();
  const timer = window.setTimeout(() => controller.abort(), 6000);
  try {
    const response = await fetch(url, { credentials: "omit", ...options, signal: controller.signal });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return await response.json();
  } finally {
    window.clearTimeout(timer);
  }
}

function plainText(html) {
  return new DOMParser().parseFromString(String(html || ""), "text/html").body.textContent.trim().replace(/\s+/g, " ");
}

async function nearbyPhoto(lat, lng) {
  if (navigator.connection?.saveData) return null;
  const url = new URL("https://commons.wikimedia.org/w/api.php");
  Object.entries({
    action: "query", format: "json", origin: "*", generator: "geosearch",
    ggscoord: `${lat}|${lng}`, ggsradius: String(NEARBY_PHOTO_RADIUS_M), ggsnamespace: "6", ggslimit: "12",
    prop: "imageinfo|coordinates", iiprop: "url|mime|extmetadata", iiurlwidth: "640",
    iiextmetadatafilter: "Artist|LicenseShortName",
  }).forEach(([key, value]) => url.searchParams.set(key, value));
  const data = await fetchJsonWithTimeout(url);
  const skip = /\b(map|karte|kaart|carte|mapa|plan|diagram|logo|wappen|coat of arms|sign|schild|bord)\b/i;
  const photos = Object.values(data?.query?.pages || {})
    .map((page) => {
      const info = page.imageinfo?.[0];
      const point = page.coordinates?.[0];
      if (!info?.thumburl || !/^image\/(jpeg|webp)$/.test(info.mime || "") || skip.test(page.title || "")) return null;
      if (!/^https:\/\/upload\.wikimedia\.org\//.test(info.thumburl)) return null;
      const distanceKm = point ? distanceBetweenPointsKm({ lat, lng }, { lat: point.lat, lng: point.lon }) : NEARBY_PHOTO_RADIUS_M / 1000;
      return {
        url: info.thumburl,
        page: info.descriptionurl,
        distanceKm,
        artist: plainText(info.extmetadata?.Artist?.value),
        license: plainText(info.extmetadata?.LicenseShortName?.value),
      };
    })
    .filter(Boolean)
    .sort((a, b) => a.distanceKm - b.distanceKm);
  return photos[0] || null;
}

async function placeElevation(lat, lng) {
  const url = new URL("https://api.open-meteo.com/v1/elevation");
  url.searchParams.set("latitude", lat.toFixed(5));
  url.searchParams.set("longitude", lng.toFixed(5));
  const data = await fetchJsonWithTimeout(url);
  const value = Number(data?.elevation?.[0]);
  return Number.isFinite(value) ? Math.round(value) : null;
}

async function nearestTown(lat, lng) {
  const url = new URL("https://nominatim.openstreetmap.org/reverse");
  Object.entries({ format: "jsonv2", lat: lat.toFixed(5), lon: lng.toFixed(5), zoom: "14", "accept-language": NookI18n.code })
    .forEach(([key, value]) => url.searchParams.set(key, value));
  // Nominatim asks clients to identify themselves; send only the site origin.
  const data = await fetchJsonWithTimeout(url, { referrerPolicy: "strict-origin-when-cross-origin" });
  const address = data?.address || {};
  return {
    name: address.village || address.town || address.city || address.hamlet || address.municipality || address.suburb || "",
    countryCode: String(address.country_code || "").toUpperCase(),
  };
}

function placeExtras(place) {
  const key = `${place.lat.toFixed(4)},${place.lng.toFixed(4)}`;
  if (!placeExtrasCache.has(key)) {
    const settle = (promise) => promise.catch(() => null);
    placeExtrasCache.set(key, Promise.all([
      place.photo ? Promise.resolve(null) : settle(nearbyPhoto(place.lat, place.lng)),
      settle(placeElevation(place.lat, place.lng)),
      settle(nearestTown(place.lat, place.lng)),
    ]).then(([photo, elevation, town]) => ({ photo, elevation, town })));
  }
  return placeExtrasCache.get(key);
}

async function enrichPlacePanel(place, sequence) {
  if (!navigator.onLine || !Number.isFinite(place.lat) || !Number.isFinite(place.lng) || place.approximate) return;
  const extras = await placeExtras(place);
  const panel = document.querySelector("#place-panel");
  if (sequence !== placeDetailSequence || !panel.classList.contains("is-open")) return;
  const body = panel.querySelector(".place-body");
  if (extras.town?.name) {
    const near = document.createElement("p");
    near.className = "place-near";
    near.textContent = t("Near {0}", extras.town.name);
    panel.querySelector(".place-meta")?.after(near);
  }
  // Rough country boxes overlap at borders; the reverse lookup knows the actual country.
  const countryCode = extras.town?.countryCode;
  const rulesLink = panel.querySelector(".place-rules-link");
  if (rulesLink && countryCode && countryNames[countryCode] && !place.country) {
    rulesLink.href = `regels.html?country=${countryCode}`;
    rulesLink.firstChild.textContent = t("Camping rules in {0}", countryNames[countryCode]);
  }
  if (Number.isFinite(extras.elevation)) {
    let facts = body.querySelector(".place-facts");
    if (!facts) {
      facts = document.createElement("dl");
      facts.className = "place-facts";
      body.prepend(facts);
    }
    const item = document.createElement("div");
    item.innerHTML = `<dt>${th("Elevation")}</dt><dd>${th("{0} m", extras.elevation)}</dd>`;
    facts.prepend(item);
  }
  if (extras.photo && !body.querySelector(".place-photo-wrap")) {
    const figure = document.createElement("figure");
    figure.className = "place-photo-wrap is-nearby";
    const credit = [extras.photo.artist, extras.photo.license].filter(Boolean).map((value) => escapeHtml(value)).join(" · ");
    figure.innerHTML = `
      <img class="place-photo" src="${escapeHtml(extras.photo.url)}" alt="${th("Nearby photo, {0} away", formatDistance(extras.photo.distanceKm))}" loading="lazy" decoding="async" referrerpolicy="no-referrer" />
      <figcaption><a href="${escapeHtml(extras.photo.page)}" target="_blank" rel="noreferrer">${th("Nearby photo, {0} away", formatDistance(extras.photo.distanceKm))}</a>${credit ? ` · ${credit}` : ""}</figcaption>`;
    figure.querySelector("img").addEventListener("error", () => figure.remove());
    body.prepend(figure);
  }
}

function placeContactLinks(place) {
  const facts = new Map((place.extraFacts || []).map(([label, value]) => [label, String(value || "").trim()]));
  const links = [];
  const website = facts.get(t("Website"));
  if (website) {
    try {
      const url = new URL(/^https?:\/\//i.test(website) ? website : `https://${website}`);
      if (["http:", "https:"].includes(url.protocol)) links.push([url.href, url.hostname.replace(/^www\./, "")]);
    } catch { /* Skip malformed source websites. */ }
  }
  const phone = facts.get(t("Telephone"));
  if (phone && /^[+\d][\d\s().-]{4,}$/.test(phone)) links.push([`tel:${phone.replace(/[^\d+]/g, "")}`, phone]);
  const email = facts.get(t("Email"));
  if (email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) links.push([`mailto:${email}`, email]);
  return links;
}

function renderPlace(place) {
  if (place.mapPoint) {
    closeCandidatePanel();
    showPlaceMessage(t("Loading place…"), t("Fetching source details."));
    const sequence = ++placeDetailSequence;
    resolveMapPlace(place.mapPoint).then((details) => {
      if (sequence === placeDetailSequence) renderPlace(details);
    }).catch(() => {
      if (sequence === placeDetailSequence) showPlaceMessage(t("Could not load this place"), t("Check your connection and tap the spot again."));
    });
    return;
  }
  placeDetailSequence++;
  closeCandidatePanel();
  const panel = document.querySelector("#place-panel");
  const hasCoordinates = !place.approximate && Number.isFinite(place.lat) && Number.isFinite(place.lng);
  const coordinates = hasCoordinates ? `${place.lat},${place.lng}` : "";
  const mapLabel = encodeURIComponent(place.name || t("Place to stay"));
  const appleDevice = /iPhone|iPad|iPod|Macintosh/.test(navigator.userAgent);
  const navigateUrl = !hasCoordinates ? "" : appleDevice
    ? `https://maps.apple.com/?daddr=${coordinates}&q=${mapLabel}`
    : `https://www.google.com/maps/dir/?api=1&destination=${coordinates}`;
  const typeLabel = sleepTypes[place.type]?.label || t("Place to stay");
  const metaParts = [typeLabel, place.sourceLabel, place.confidence === 3 ? t("Official source") : ""].filter(Boolean);
  const meta = `<p class="place-meta"><i class="legend-dot dot-${escapeHtml(place.type || "")}" aria-hidden="true"></i>${escapeHtml(metaParts.join(" · "))}</p>`;
  const facts = placeFacts(place);
  const text = [place.decision, place.description].filter((value, index, all) => value && all.indexOf(value) === index);
  const countryCode = place.country || (hasCoordinates ? countryFromLatLng(place.lat, place.lng) : "");
  panel.innerHTML = `
    ${placeSheetHeader(place.name, meta)}
    <div class="sheet-body place-body">
      ${place.photo ? `
        <figure class="place-photo-wrap">
          <img class="place-photo" src="${escapeHtml(place.photo)}" alt="${th("Photo of {0}", escapeHtml(place.name))}" loading="lazy" referrerpolicy="no-referrer" />
          <figcaption>${th("Photo: {0}", escapeHtml(place.photoLabel || place.sourceLabel))}</figcaption>
        </figure>
      ` : ""}
      ${facts.length ? `<dl class="place-facts">${facts.map(([label, value]) => `<div><dt>${escapeHtml(label)}</dt><dd>${escapeHtml(value)}</dd></div>`).join("")}</dl>` : ""}
      ${text.map((value) => `<p>${escapeHtml(value)}</p>`).join("")}
      ${placeContactLinks(place).length ? `<p class="place-contact">${placeContactLinks(place).map(([href, label]) => `<a href="${escapeHtml(href)}"${href.startsWith("http") ? ' target="_blank" rel="noreferrer"' : ""}>${escapeHtml(label)}</a>`).join("")}</p>` : ""}
      ${place.caution ? `<p class="place-caution">${escapeHtml(place.caution)}</p>` : ""}
      <div class="place-actions">
        ${navigateUrl ? `<a class="button button-primary" href="${escapeHtml(navigateUrl)}" target="_blank" rel="noreferrer">${ICON_NAVIGATE}${th("Navigate")}</a>` : ""}
        <a class="button button-secondary place-link" href="${escapeHtml(place.sourceUrl)}" target="_blank" rel="noreferrer">${th("View source")}${ICON_EXTERNAL}</a>
      </div>
      ${countryCode && countryNames[countryCode] ? `<a class="row-link place-rules-link" href="regels.html?country=${escapeHtml(countryCode)}">${th("Camping rules in {0}", escapeHtml(countryNames[countryCode]))}${ICON_CHEVRON}</a>` : ""}
      ${place.licenseUrl ? `<p class="place-attribution"><a href="${escapeHtml(place.licenseUrl)}" target="_blank" rel="noreferrer">${escapeHtml(place.attribution)} · ${escapeHtml(place.licenseLabel)}</a></p>` : ""}
    </div>
  `;
  panel.querySelector(".place-photo")?.addEventListener("error", (event) => event.currentTarget.closest(".place-photo-wrap")?.remove());
  setFiltersOpen(false);
  openPlacePanel();
  panel.querySelector(".place-body").scrollTop = 0;
  enrichPlacePanel(place, placeDetailSequence);
}

function formatDistance(distanceKm) {
  if (distanceKm < 1) return `${Math.max(50, Math.round(distanceKm * 1000 / 50) * 50)} m`;
  if (distanceKm < 10) return t("{0} km", distanceKm.toFixed(1).replace(".", ","));
  return t("{0} km", Math.round(distanceKm));
}

function candidateProviderLabel(provider) {
  return {
    denmark: "Ud i Naturen",
    campwild: "CampWild",
    refuges: "Refuges.info",
    osm: "OpenStreetMap",
    imported: t("GPX waypoint"),
    vodf: "Vrienden op de Fiets",
    wtmg: "Welcome To My Garden",
    nitetent: "1NITE TENT",
    camping: t("OpenStreetMap campsite"),
  }[provider] || t("Source location");
}

function rankedCandidates() {
  const anchor = userLocation || map.getCenter();
  const anchorRoute = nearestRoutePosition(anchor.lat, anchor.lng, 20);
  const useRouteProgress = Boolean(anchorRoute && routeFilterEnabled() && anchorRoute.distanceKm <= 20);

  const ranked = currentCandidates.flatMap((candidate) => {
    const directDistanceKm = distanceBetweenPointsKm(anchor, candidate);
    const routePosition = useRouteProgress ? nearestRoutePosition(candidate.lat, candidate.lng, routeDistanceKm + 2) : null;
    const routeDeltaKm = routePosition ? routePosition.progressKm - anchorRoute.progressKm : null;
    const withinHorizon = useRouteProgress
      ? routeDeltaKm >= -2 && routeDeltaKm <= candidateHorizonKm
      : directDistanceKm <= candidateHorizonKm;
    if (!withinHorizon) return [];

    const confidencePenalty = (3 - (candidate.place.confidence || 1)) * 4;
    const score = useRouteProgress
      ? Math.max(0, routeDeltaKm) + (routePosition.distanceKm * 2) + confidencePenalty + (routeDeltaKm < 0 ? 12 : 0)
      : directDistanceKm + confidencePenalty;
    return [{ ...candidate, directDistanceKm, routePosition, routeDeltaKm, score, useRouteProgress }];
  }).sort((a, b) => a.score - b.score);

  const providerCounts = new Map();
  return ranked.filter((candidate) => {
    const count = providerCounts.get(candidate.provider) || 0;
    if (count >= 3) return false;
    providerCounts.set(candidate.provider, count + 1);
    return true;
  }).slice(0, 9);
}

function candidateDistanceLabel(candidate) {
  if (!candidate.useRouteProgress) return t("{0} as the crow flies", formatDistance(candidate.directDistanceKm));
  const direction = candidate.routeDeltaKm < 0
    ? t("{0} back along the route", formatDistance(Math.abs(candidate.routeDeltaKm)))
    : t("{0} further along the route", formatDistance(candidate.routeDeltaKm));
  return candidate.routePosition.distanceKm < 0.25
    ? direction
    : t("{0} · {1} from the route", direction, formatDistance(candidate.routePosition.distanceKm));
}

function updateCandidatePanel() {
  if (!candidatePanelOpen) return;
  const list = document.querySelector("#candidate-list");
  const intro = document.querySelector("#candidate-intro");
  if (mapDataError) {
    displayedCandidates = [];
    list.innerHTML = `<div class="candidate-empty"><strong>${th("Could not load places.")}</strong><span>${th("Check your connection and try again.")}</span><button class="button button-secondary" type="button" data-retry-map>${th("Try again")}</button></div>`;
    return;
  }
  if (mapDataLoading) {
    list.innerHTML = `<div class="candidate-empty">${mapManifest ? t("Looking for suitable places…") : t("Loading places…")}</div>`;
    displayedCandidates = [];
    return;
  }
  const candidates = rankedCandidates();
  const onRoute = routeFilterEnabled() && nearestRoutePosition((userLocation || map.getCenter()).lat, (userLocation || map.getCenter()).lng, 20)?.distanceKm <= 20;
  intro.textContent = userLocation
    ? onRoute ? t("From your location, further along your route.") : t("From your location.")
    : onRoute ? t("From the centre of the map, further along your route.") : t("From the centre of the map.");
  updateLocationNote();

  if (!candidates.length) {
    displayedCandidates = [];
    list.innerHTML = `
      <div class="candidate-empty">
        <span>${th("Nothing within {0} km. Choose a longer distance or turn on more types of place.", candidateHorizonKm)}</span>
        <button class="button button-secondary" type="button" data-open-filters>${th("Adjust filters")}</button>
      </div>`;
    return;
  }

  displayedCandidates = candidates;
  list.innerHTML = candidates.map((candidate, index) => `
    <button class="candidate-item" type="button" data-candidate-index="${index}">
      <i class="legend-dot dot-${escapeHtml(candidate.place.type)}" aria-hidden="true"></i>
      <span class="candidate-copy">
        <strong>${escapeHtml(candidate.place.name)}</strong>
        <small>${escapeHtml(candidateDistanceLabel(candidate))} · ${escapeHtml(candidateProviderLabel(candidate.provider))}</small>
      </span>
      ${ICON_CHEVRON}
    </button>
  `).join("");
}

function openCandidatePanel() {
  candidatePanelOpen = true;
  const panel = document.querySelector("#candidate-panel");
  renderEmptyPanel();
  setFiltersOpen(false);
  panel.classList.add("is-open");
  panel.setAttribute("aria-hidden", "false");
  panel.inert = false;
  panel.focus({ preventScroll: true });
  panel.scrollTop = 0;
  if (!userLocation) focusDetailsAroundMapCenter();
  refreshMapPlaces();
}

function closeCandidatePanel() {
  candidatePanelOpen = false;
  const panel = document.querySelector("#candidate-panel");
  if (panel?.contains(document.activeElement)) document.querySelector("#show-candidates").focus({ preventScroll: true });
  if (panel) panel.inert = true;
  panel?.classList.remove("is-open");
  panel?.setAttribute("aria-hidden", "true");
  if (map.getZoom() < 9) scheduleViewportRefresh();
}

function drawUserLocation() {
  locationLayer.clearLayers();
  if (!userLocation) return;
  L.circle([userLocation.lat, userLocation.lng], {
    radius: Math.max(20, userLocation.accuracy || 0),
    color: "#f2b705",
    weight: 2,
    fillColor: "#ffe45e",
    fillOpacity: 0.18,
    interactive: false,
  }).addTo(locationLayer);
  L.circleMarker([userLocation.lat, userLocation.lng], {
    radius: 9,
    color: "#123127",
    weight: 3,
    fillColor: "#ffe45e",
    fillOpacity: 1,
  }).bindTooltip(t("My location")).addTo(locationLayer);
}

function setLocationControlsLoading(isLoading) {
  const locateButton = document.querySelector("#locate-me");
  const panelButton = document.querySelector("#candidate-use-location");
  locateButton.classList.toggle("is-loading", isLoading);
  locateButton.disabled = isLoading;
  panelButton.disabled = isLoading;
  locateButton.setAttribute("aria-label", isLoading ? t("Finding your location") : t("Go to my current location"));
}

function showLocationStatus(message, tone = "neutral", { sticky = false } = {}) {
  const status = document.querySelector("#location-status");
  window.clearTimeout(showLocationStatus.hideTimer);
  if (!message) {
    status.hidden = true;
    return;
  }
  status.textContent = message;
  status.className = `location-status is-${tone}`;
  status.hidden = false;
  if (!sticky) {
    showLocationStatus.hideTimer = window.setTimeout(() => {
      status.hidden = true;
    }, 7000);
  }
}

function updateLocationNote() {
  const note = document.querySelector("#candidate-location-note");
  const button = document.querySelector("#candidate-use-location");
  if (!note) return;
  note.textContent = userLocation ? "" : locationMessage;
  note.hidden = Boolean(userLocation) || !locationMessage;
  if (button) button.hidden = Boolean(userLocation);
}

function geolocationUnavailableMessage() {
  if (!("geolocation" in navigator)) return t("This browser does not support location determination.");
  if (!window.isSecureContext) return t("GPS only works on your phone via HTTPS. Open the published GitHub Pages link or use the map center.");
  return "";
}

function requestUserLocation({ openCandidates = false, focusMap = true } = {}) {
  if (openCandidates) openCandidatePanel();
  const unavailableMessage = geolocationUnavailableMessage();
  if (unavailableMessage) {
    locationMessage = unavailableMessage;
    if (openCandidates && focusMap) focusDetailsAroundMapCenter();
    showLocationStatus(unavailableMessage, "warning", { sticky: true });
    updateLocationNote();
    refreshMapPlaces();
    return;
  }

  locationMessage = t("Finding your location…");
  setLocationControlsLoading(true);
  showLocationStatus(locationMessage, "neutral");
  updateLocationNote();
  if (openCandidates) updateCandidatePanel();

  navigator.geolocation.getCurrentPosition((position) => {
    userLocation = {
      lat: position.coords.latitude,
      lng: position.coords.longitude,
      accuracy: position.coords.accuracy,
    };
    locationMessage = t("Your current position is active.");
    drawUserLocation();
    if (focusMap) navigateMapTo([userLocation.lat, userLocation.lng], Math.max(map.getZoom(), 13));
    setLocationControlsLoading(false);
    document.querySelector("#locate-me").classList.add("has-location");
    showLocationStatus(t("Current position active. Places are now ranked from you."), "success");
    updateLocationNote();
    refreshMapPlaces();
  }, (error) => {
    setLocationControlsLoading(false);
    locationMessage = error.code === error.PERMISSION_DENIED
      ? t("Location access is denied. Turn on location for this site or use the center of the map.")
      : error.code === error.TIMEOUT
        ? t("Determining the location took too long. Nook now uses the center of the map.")
        : t("This browser did not report a position. Nook now uses the center of the map.");
    if (openCandidates && focusMap) focusDetailsAroundMapCenter();
    showLocationStatus(locationMessage, "warning", { sticky: true });
    updateLocationNote();
    refreshMapPlaces();
  }, {
    enableHighAccuracy: false,
    timeout: 15000,
    maximumAge: 300000,
  });
}

function setFiltersOpen(open) {
  const sidebar = document.querySelector("#map-sidebar");
  const toggle = document.querySelector("#toggle-filters");
  if (open) {
    closeCandidatePanel();
    renderEmptyPanel();
  }
  sidebar.classList.toggle("is-open", open);
  sidebar.setAttribute("aria-hidden", String(!open));
  toggle.setAttribute("aria-expanded", String(open));
  if (open && !sidebar.open) sidebar.showModal();
  if (!open && sidebar.open) sidebar.close();
}

function updateFilterSummary() {
  const mainTypes = [...document.querySelectorAll("#sleep-filter input[value]")];
  const allTypes = [...document.querySelectorAll("#sleep-filter input")].every((input) => input.checked);
  const count = Number(!allTypes) + Number(routeFilterEnabled());
  const badge = document.querySelector("#filter-count");
  badge.textContent = String(count);
  badge.hidden = !count;
  document.querySelector("#toggle-filters").setAttribute("aria-label", count ? t("Map settings, {0} active", count) : t("Map settings"));
  document.querySelector("#sleep-summary").textContent = allTypes
    ? t("All")
    : t("{0} of {1}", mainTypes.filter((input) => input.checked).length, mainTypes.length);
}

function resetFilters() {
  document.querySelectorAll('#sleep-filter input').forEach((input) => { input.checked = true; });
  routeFilterActive = true;
  routeDistanceKm = 10;
  setUserValue(ROUTE_DISTANCE_KEY, String(routeDistanceKm));
  saveFilterPreferences();
  refreshMapPlaces();
}

function saveMapView() {
  const center = map.getCenter().wrap();
  setUserValue(MAP_VIEW_KEY, JSON.stringify({ lat: center.lat, lng: center.lng, zoom: map.getZoom() }));
}

function currentFilters() {
  return {
    countries: selectedCountryCodes(),
    confidence: 1,
    types: new Set([...document.querySelectorAll('#sleep-filter input[value]:checked')].map((input) => input.value)),
    networks: new Set([...document.querySelectorAll('[data-network]:checked')].map((input) => input.dataset.network)),
  };
}


const countryDisplayNames = typeof Intl.DisplayNames === "function" ? new Intl.DisplayNames([NookI18n.locale], { type: "region" }) : null;
const countryNames = Object.fromEntries(FILTER_COUNTRIES.map((country) => [country.code, countryDisplayNames?.of(country.code) || country.name]));

const COUNTRY_FILTER_KEY = "nook-country-filter-v2";
const FILTER_PREFERENCES_KEY = "nook-filter-preferences-v3";
const ROUTE_DISTANCE_KEY = "nook-route-distance";
const PERSONAL_STORAGE_KEYS = [
  ROUTE_LIBRARY_KEY,
  LEGACY_ROUTE_KEY,
  COUNTRY_FILTER_KEY,
  FILTER_PREFERENCES_KEY,
  ROUTE_DISTANCE_KEY,
];
const ALL_COUNTRY_CODES = FILTER_COUNTRIES.map((country) => country.code);
const COUNTRY_CENTERS = Object.fromEntries(FILTER_COUNTRIES.map((country) => [country.code, country.center]));
const COUNTRY_BOUNDS = Object.fromEntries(FILTER_COUNTRIES.map((country) => [country.code, country.bounds]));
let routeDistanceKm = 10;
let routeFilterActive = true;

function userStorage() {
  return localStorage;
}

function getUserValue(key) {
  try {
    const value = userStorage().getItem(key);
    return value;
  } catch (error) {
    console.warn(t("User storage could not be read."), error);
    return null;
  }
}

function setUserValue(key, value) {
  try {
    userStorage().setItem(key, value);
    return true;
  } catch (error) {
    console.warn(t("User save could not be saved."), error);
    return false;
  }
}

function removeUserValue(key) {
  try {
    localStorage.removeItem(key);
    sessionStorage.removeItem(key);
  } catch (error) {
    console.warn(t("User storage could not be cleared."), error);
  }
}

function storedJson(key) {
  const value = getUserValue(key);
  if (!value) return null;
  try {
    return JSON.parse(value);
  } catch (error) {
    console.warn(t("Saved setting {0} could not be read.", key), error);
    return null;
  }
}

function orderedCountryCodes(codes) {
  const set = new Set(codes);
  return ALL_COUNTRY_CODES.filter((code) => set.has(code));
}

function selectedCountryCodes() {
  return new Set(ALL_COUNTRY_CODES);
}











function countryFromLatLng(lat, lng) {
  const matches = Object.entries(COUNTRY_BOUNDS)
    .filter(([, [[south, west], [north, east]]]) => lat >= south && lat <= north && lng >= west && lng <= east)
    .map(([code, [[south, west], [north, east]]]) => ({ code, area: (north - south) * (east - west) }))
    .sort((a, b) => a.area - b.area);
  return matches[0]?.code || "";
}

function compactCount(value) {
  const number = Number(value) || 0;
  if (number >= 1000) return `${NookI18n.number(number / 1000, { minimumFractionDigits: number >= 10000 ? 0 : 1, maximumFractionDigits: number >= 10000 ? 0 : 1, numberingSystem: "latn" })}k`;
  return number.toLocaleString(NookI18n.locale);
}

let mapWorker;
let mapManifest;
let mapQueryId = 0;
let mapDataLoading = true;
let mapDataError = "";
let lastMapQuery;
let lastWorkerRoute;
let lastWorkerDistance;
let lastWorkerRouteEnabled;
let placeDetailSequence = 0;
const mapMarkers = new Map();
const detailBatches = new Map();

function sourceLayerBounds() {
  return map.getBounds().pad(0.4);
}

function requestMapSources(filters) {
  if (!mapWorker) {
    if (!("Worker" in window)) {
      mapDataError = t("This browser does not support map calculation. Try a recent browser.");
      mapDataLoading = false;
      updateMapDataHint();
      updateCandidatePanel();
      return;
    }
    mapWorker = new Worker("map-worker.js?v=20261024-1");
    mapWorker.onmessage = ({ data }) => {
      if (data.type === "ready") {
        mapManifest = data.manifest;
        return;
      }
      if (data.type === "error") {
        mapDataLoading = false;
        mapDataError = data.message;
        updateMapDataHint();
        updateCandidatePanel();
        return;
      }
      // Ignore late results from a previous viewport or filter selection.
      if (data.requestId !== mapQueryId || mapIsMoving) return;
      mapDataLoading = false;
      mapDataError = "";
      if (data.type === "leaves") {
        showCoincidentPlaces(data.points);
        updateMapDataHint();
        return;
      }
      applyMapSources(data);
    };
    mapWorker.onerror = () => {
      mapDataLoading = false;
      mapDataError = t("The map could not load. Check your connection and reload the page.");
      updateMapDataHint();
      updateCandidatePanel();
    };
  }
  const enabled = routeFilterEnabled();
  const distance = routeDistanceKm;
  const routeChanged = lastWorkerRoute !== routeState || lastWorkerDistance !== distance || lastWorkerRouteEnabled !== enabled;
  if (routeChanged) {
    mapWorker.postMessage({ type: "route", route: enabled ? { grid: routeState.segmentGrid, distanceKm: distance } : null });
    lastWorkerRoute = routeState;
    lastWorkerDistance = distance;
    lastWorkerRouteEnabled = enabled;
  }
  const bounds = sourceLayerBounds();
  const candidateBounds = candidatePanelOpen ? boundsAroundPoint(userLocation || map.getCenter(), 95) : null;
  const selection = {
    countries: null,
    types: [...filters.types].sort(), networks: [...filters.networks].sort(), confidence: filters.confidence,
  };
  const current = map.getBounds();
  if (!routeChanged && !candidatePanelOpen && !lastMapQuery?.candidates && !mapDataLoading
    && lastMapQuery && lastMapQuery.zoom === map.getZoom()
    && JSON.stringify(lastMapQuery.filters) === JSON.stringify(selection)
    && current.getWest() >= lastMapQuery.bounds[0] && current.getSouth() >= lastMapQuery.bounds[1]
    && current.getEast() <= lastMapQuery.bounds[2] && current.getNorth() <= lastMapQuery.bounds[3]) return;
  lastMapQuery = {
    type: "query", requestId: ++mapQueryId,
    bounds: [bounds.getWest(), bounds.getSouth(), bounds.getEast(), bounds.getNorth()],
    zoom: map.getZoom(), candidates: candidatePanelOpen,
    candidateBounds: candidateBounds ? [candidateBounds.getWest(), candidateBounds.getSouth(), candidateBounds.getEast(), candidateBounds.getNorth()] : null,
    filters: selection,
  };
  mapDataLoading = true;
  mapDataError = "";
  mapWorker.postMessage(lastMapQuery);
  updateMapDataHint();
  updateCandidatePanel();
}

function mapPointPlace(point) {
  return {
    name: point.kind === "vodf" ? t("Vrienden op de Fiets host location") : point.kind === "wtmg" ? t("Welcome To My Garden location") : `${sleepTypes[point.type]?.label || t("Place to stay")} · ${candidateProviderLabel(point.kind)}`,
    lat: point.lat, lng: point.lng, type: point.type,
    confidence: point.kind === "denmark" ? 3 : point.kind === "camping" ? 1 : 2,
    mapPoint: point,
  };
}

async function resolveMapPlace(point) {
  const chunk = mapManifest.chunks[point.chunk];
  const key = chunk.file;
  if (!detailBatches.has(key)) {
    const request = fetch(`data/${key}?v=${mapManifest.version}`).then((response) => {
      if (!response.ok) throw new Error(t("Location data: HTTP {0}", response.status));
      return response.json();
    }).catch((error) => { detailBatches.delete(key); throw error; });
    detailBatches.set(key, request);
  }
  const request = detailBatches.get(key);
  detailBatches.delete(key);
  detailBatches.set(key, request);
  // Keep a bounded set of small detail batches instead of whole countries.
  while (detailBatches.size > 16) detailBatches.delete(detailBatches.keys().next().value);
  const item = (await request)[point.offset];
  if (!item) throw new Error(t("This place is missing in the source data"));
  if (point.kind === "camping") return campingPlace(item).place;
  return { vodf: vodfPlace, wtmg: wtmgPlace, nitetent: nitetentPlace, refuges: refugePlace, campwild: campwildPlace, denmark: denmarkPlace }[point.kind](item);
}

function applyMapSources(data) {
  const desired = new Set();
  for (const feature of data.features) {
    const cluster = feature.cluster !== undefined;
    const key = cluster ? `c:${feature.cluster}:${feature.lat}:${feature.lng}:${feature.count}` : `p:${feature.id}`;
    desired.add(key);
    if (mapMarkers.has(key)) continue;
    const place = cluster ? null : mapPointPlace(feature);
    const host = feature.type === "host";
    const colors = { wild: "#668c50", designated: "#dc7740", hut: "#4d7e8d", host: "#7c6894", ask: "#aa965c", camping: "#7b5b35" };
    const marker = L.nookPin([feature.lat, feature.lng], {
      renderer: pinRenderer,
      radius: cluster ? clusterVisual(feature.count).size / 2 : 16,
      fillColor: cluster ? "#123127" : host ? ({ vodf: "#3978b0", wtmg: "#cb5e8b", nitetent: "#7c6894" }[feature.kind] || colors.host) : colors[feature.type],
      pinLabel: cluster ? compactCount(feature.count) : host ? ({ vodf: "V", wtmg: "G", nitetent: "T" }[feature.kind] || "♥") : sleepTypes[feature.type]?.icon || "?",
      title: cluster ? t("{0} places · zoom in", feature.count.toLocaleString(NookI18n.locale)) : place.name,
    }).on("click", () => {
      if (!cluster) { renderPlace(place); return; }
      if (mapDataLoading) return;
      if (feature.zoom <= map.getMaxZoom()) {
        navigateMapTo([feature.lat, feature.lng], Math.max(map.getZoom() + 1, feature.zoom));
      } else {
        mapDataLoading = true;
        mapWorker.postMessage({ ...lastMapQuery, type: "leaves", cluster: feature.cluster, requestId: ++mapQueryId });
        updateMapDataHint();
      }
    });
    marker.addTo(sourceMapLayer);
    mapMarkers.set(key, marker);
  }
  for (const [key, marker] of mapMarkers) {
    if (desired.has(key)) continue;
    sourceMapLayer.removeLayer(marker);
    mapMarkers.delete(key);
  }
  updatePinAccessibility();
  visiblePlaceCounts.hospitality = data.counts.vodf + data.counts.wtmg + (data.counts.nitetent || 0);
  visiblePlaceCounts.camping = data.counts.camping;
  visiblePlaceCounts.campwild = data.counts.campwild;
  visiblePlaceCounts.refuges = data.counts.refuges || 0;
  visiblePlaceCounts.denmark = data.counts.denmark;
  currentCandidates = [];
  renderImportedWaypoints();
  data.points.forEach((point) => addCandidate(point.lat, point.lng, mapPointPlace(point), point.kind));
  updateMapDataHint();
  updateCampingStatus();
  updateRouteStatus();
  updateCandidatePanel();
  if (candidatePanelOpen) {
    const query = mapQueryId;
    const candidates = displayedCandidates.slice();
    Promise.allSettled(candidates.map(async (candidate) => {
      const point = candidate.place.mapPoint;
      if (!point) return;
      const details = await resolveMapPlace(point);
      if (query !== mapQueryId) return;
      const original = currentCandidates.find((item) => item.place.mapPoint?.id === point.id);
      if (original) original.place = details;
    })).then(() => { if (query === mapQueryId && candidatePanelOpen) updateCandidatePanel(); });
  }
}

function updatePinAccessibility() {
  const keys = [...mapMarkers.keys()].join("|");
  if (keys === accessiblePinKeys) return;
  accessiblePinKeys = keys;
  pinAccessibility.replaceChildren();
  for (const marker of mapMarkers.values()) {
    const button = document.createElement("button");
    button.type = "button";
    button.textContent = marker.options.title;
    button.onclick = () => marker.fire("click");
    button.onfocus = () => {
      marker.setStyle({ color: "#e8864a", weight: 4 });
      map.panInside(marker.getLatLng(), { padding: [36, 36], animate: false });
    };
    button.onblur = () => marker.setStyle({ color: "#fffdf8", weight: 2 });
    pinAccessibility.append(button);
  }
}

function showCoincidentPlaces(points, page = 0) {
  showPlaceMessage(t("{0} spots at this location", points.length), t("Choose a place to see its source details."));
  const panel = document.querySelector("#place-panel");
  const selection = points.slice(page * 20, (page + 1) * 20);
  const list = document.createElement("div");
  list.className = "coincident-places";
  selection.forEach((point) => {
    const button = document.createElement("button");
    button.className = "button button-secondary";
    button.type = "button";
    button.textContent = mapPointPlace(point).name;
    button.onclick = () => renderPlace(mapPointPlace(point));
    list.append(button);
    resolveMapPlace(point).then((place) => { button.textContent = place.name; }).catch(() => {});
  });
  if ((page + 1) * 20 < points.length) {
    const next = document.createElement("button");
    next.className = "button button-secondary";
    next.type = "button";
    next.textContent = t("Next places");
    next.onclick = () => showCoincidentPlaces(points, page + 1);
    list.append(next);
  }
  panel.append(list);
}

function updateMapDataHint() {
  const hint = document.querySelector("#map-data-hint");
  if (!hint) return;
  // Zooming reuses the full index; only the initial download is a loading state.
  const downloading = mapDataLoading && !mapManifest;
  const empty = !mapDataLoading && !mapMarkers.size && !visiblePlaceCounts.imported;
  document.querySelector("#map-data-copy").textContent = mapDataError
    ? t("Could not load places. Check your connection.")
    : downloading ? t("Loading places…") : empty ? t("No places in view with these filters. Move the map or adjust your filters.") : "";
  const action = document.querySelector("#map-data-action");
  action.textContent = mapDataError ? t("Try again") : t("Adjust filters");
  action.hidden = !mapDataError && !empty;
  hint.hidden = !mapDataError && !downloading && !empty;
}

function retryMapData() {
  mapWorker?.terminate();
  mapWorker = null;
  lastMapQuery = null;
  lastWorkerRoute = null;
  refreshMapPlaces();
}

function scheduleViewportRefresh() {
  window.clearTimeout(viewportRefreshTimer);
  viewportRefreshTimer = window.setTimeout(() => requestMapSources(currentFilters()), 120);
}

function hostPinIcon(provider, label) {
  return L.divIcon({ className: "", html: `<div class="host-map-pin pin-${provider}"><span>${escapeHtml(label)}</span></div>`, iconSize: [30, 38], iconAnchor: [15, 36] });
}

function addMarkers(layer, markers) {
  if (layer.addLayers) layer.addLayers(markers);
  else markers.forEach((marker) => marker.addTo(layer));
}

function vodfPlace(pin) {
  const bedCount = pin.singleBeds + (pin.doubleBeds * 2);
  const extras = [
    [t("Coordinate"), `${pin.lat.toFixed(5)}, ${pin.lng.toFixed(5)}`],
    [t("Type"), pin.stayType],
    [t("Rooms"), pin.rooms || t("Not listed")],
    [t("Beds"), bedCount || t("Not listed")],
  ];
  if (pin.wheelchair) extras.push([t("Wheelchair"), t("Reported accessible")]);
  if (pin.luggage) extras.push([t("Luggage transport"), t("Reported available")]);
  if (pin.groups) extras.push([t("Groups"), t("Reported welcome")]);
  if (pin.pets) extras.push([t("Pets"), t("Reported welcome")]);
  if (pin.laundry) extras.push([t("Laundry"), t("Reported available")]);

  return {
    name: t("Vrienden op de Fiets host location"),
    lat: pin.lat,
    lng: pin.lng,
    location: t("{0} · public map position", countryNames[pin.country]),
    type: "host",
    confidence: 2,
    sourceLabel: t("Public Vrienden op de Fiets map"),
    sourceUrl: publicData.vodf?.source || "https://www.vriendenopdefiets.nl/zoek-een-logeeradres",
    sourceAction: t("Open the official host map"),
    decision: t("This is an individual pin from the public map feed."),
    description: t("Nook uses the same published map position, without host ID, name, or address fields. Log in at the source for the host and reservation."),
    stay: t("Only after reservation with a host"),
    cost: t("According to the platform terms"),
    water: t("Depending on the host"),
    extraFacts: extras,
    caution: t("Sign in to Vrienden op de Fiets to see current hosts and availability in this area."),
  };
}

function wtmgPlace(pin) {
  const extras = [
    [t("Coordinate"), `${pin.lat.toFixed(5)}, ${pin.lng.toFixed(5)}`],
    [t("Capacity"), pin.capacity || t("Not listed")],
  ];
  if (pin.tent) extras.push([t("Tent"), t("Location reported")]);
  if (pin.toilet) extras.push([t("Toilet"), t("Reported present")]);
  if (pin.shower) extras.push([t("Shower"), t("Reported present")]);
  if (pin.electricity) extras.push([t("Electricity"), t("Reported present")]);
  if (pin.campfire) extras.push([t("Campfire"), t("Possibility reported")]);

  return {
    name: t("Welcome To My Garden location"),
    lat: pin.lat,
    lng: pin.lng,
    location: t("{0} · public map position", countryNames[pin.country]),
    type: "host",
    confidence: 2,
    photo: pin.photo,
    photoLabel: "Welcome To My Garden",
    sourceLabel: t("Public Welcome To My Garden map"),
    sourceUrl: publicData.wtmg?.source || "https://welcometomygarden.org/nl/explore",
    sourceAction: t("Open the official garden finder"),
    decision: t("This is a separate garden pin from the public explore map."),
    description: t("The map position, basic facilities and photo shown come from the public garden layer. Profile text, host details and contact details remain with Welcome To My Garden."),
    stay: t("Only after request and confirmation"),
    cost: t("Overnight stay free; check membership terms"),
    water: pin.drinkingWater ? t("Drinking water reported") : pin.water ? t("Water reported, drinkability unknown") : t("Not listed"),
    extraFacts: extras,
    caution: t("Open the official map and contact the host there. A map pin does not confirm an overnight stay."),
  };
}

function nitetentPlace(pin) {
  return {
    name: "1NITE TENT",
    lat: pin.lat, lng: pin.lng,
    location: t("{0} · public map position", countryNames[pin.country]),
    type: "host", confidence: 2,
    sourceLabel: "1NITE TENT",
    sourceUrl: publicData.nitetent?.source || "https://1nitetent.com/#map",
    sourceAction: t("Open the official host map"),
    decision: t("Only after request and confirmation"),
    description: t("Camp in a host’s garden. Arrange your stay through the website first."),
    stay: t("One night only"),
    cost: t("Free"),
    water: t("Not listed"),
    extraFacts: [[t("Coordinate"), `${pin.lat.toFixed(5)}, ${pin.lng.toFixed(5)}`]],
    caution: t("Open the official map and contact the host there. A map pin does not confirm an overnight stay."),
  };
}

function refugePlace(item) {
  return {
    name: item.name, lat: item.lat, lng: item.lng,
    location: countryNames[item.country] || item.country,
    type: "hut", confidence: 2,
    sourceLabel: "Refuges.info",
    sourceUrl: item.sourceUrl,
    sourceAction: t("Open the source"),
    stay: "", cost: "", water: "",
    extraFacts: [[t("Capacity"), item.capacity]],
    licenseUrl: "https://creativecommons.org/licenses/by-sa/2.0/",
    attribution: "Refuges.info contributors", licenseLabel: "CC BY-SA 2.0",
  };
}

function denmarkPlace(sourcePlace) {
  const capacity = sourcePlace.capacity ? t("{0} spaces listed", sourcePlace.capacity) : t("Not listed");
  const isFreeForest = sourcePlace.category === "Frit teltningsområde";
  return {
    name: sourcePlace.name,
    lat: sourcePlace.lat,
    lng: sourcePlace.lng,
    location: t("{0} · Denmark", sourceText(sourcePlace.region)),
    type: sourcePlace.type,
    confidence: 3,
    photo: sourcePlace.image,
    photoLabel: "Ud i Naturen",
    sourceLabel: "Ud i Naturen",
    sourceUrl: sourcePlace.sourceUrl,
    sourceAction: t("Open this official location"),
    decision: sourceText(sourcePlace.decision),
    description: t("{0} Official location description (Danish): {1}", sourceText(sourcePlace.rules), sourcePlace.description),
    stay: sourceText(sourcePlace.stay),
    cost: sourceText(sourcePlace.cost),
    water: sourceText(sourcePlace.water),
    extraFacts: [
      [t("Booking"), sourceText(sourcePlace.bookingStatus)],
      [t("Capacity"), capacity],
      [t("Toilet"), sourceText(sourcePlace.toilet)],
      [t("Accessible"), sourceText(sourcePlace.accessible)],
      [t("Operator"), sourcePlace.manager],
    ],
    caution: sourceText(sourcePlace.localRestriction) || (isFreeForest
      ? t("This place is officially listed as a Frit teltningsområde camping forest. Follow local signs and temporary fire restrictions.")
      : t("This place is listed as an overnight site in Ud i Naturen. Check the booking status and official description above before arriving.")),
  };
}

function campwildPlace(sourcePlace) {
  const typeLabel = sourcePlace.typeLabel || sourcePlace.sourceType || t("Shelter");
  const placeType = sourcePlace.type || "hut";
  return {
    name: String(sourcePlace.name || "").replace(/^CampWild\s+/i, "") || typeLabel,
    lat: sourcePlace.lat,
    lng: sourcePlace.lng,
    location: t("{0} · CampWild", countryNames[sourcePlace.country] || t("Europe")),
    type: placeType,
    confidence: 2,
    sourceLabel: "CampWild",
    sourceUrl: sourcePlace.sourceUrl || "https://map.campwild.org/",
    sourceAction: t("Open in CampWild"),
    stay: "",
    cost: "",
    water: "",
    extraFacts: [],
    caution: t("Community data: check the source and local rules before you go."),
  };
}



function osmPhoto(tags) {
  if (/^https?:\/\//i.test(tags.image || "")) return tags.image;
  const commonsFile = String(tags.wikimedia_commons || "").replace(/^File:/i, "");
  if (!commonsFile || /^Category:/i.test(commonsFile)) return "";
  return `https://commons.wikimedia.org/wiki/Special:Redirect/file/${encodeURIComponent(commonsFile)}?width=900`;
}

function updateCampingStatus() {
  const status = document.querySelector("#camping-status");
  if (!status) return;
  status.textContent = !currentFilters().types.has("camping") ? t("Campsites are off.")
    : t("{0} campsites in this map area, clustered when zoomed out.", visiblePlaceCounts.camping.toLocaleString(NookI18n.locale));
}

function filterPreferenceState() {
  return {
    sleepTypes: [...document.querySelectorAll('#sleep-filter input[value]')]
      .map((input) => ({ value: input.value, checked: input.checked })),
    networks: [...document.querySelectorAll("[data-network]")]
      .map((input) => ({ value: input.dataset.network, checked: input.checked })),
    candidateHorizonKm,
    routeFilterActive,
  };
}

function saveFilterPreferences() {
  setUserValue(FILTER_PREFERENCES_KEY, JSON.stringify(filterPreferenceState()));
}

function restoreFilterPreferences() {
  const preferences = storedJson(FILTER_PREFERENCES_KEY);
  if (!preferences || typeof preferences !== "object") return;
  if (typeof preferences.routeFilterActive === "boolean") routeFilterActive = preferences.routeFilterActive;
  const hasLegacyCampingLayer = Object.prototype.hasOwnProperty.call(preferences, "campingLayer");

  if (Array.isArray(preferences.sleepTypes)) {
    const selected = new Map(preferences.sleepTypes.map((item) => [item.value, Boolean(item.checked)]));
    document.querySelectorAll('#sleep-filter input[value]').forEach((input) => {
      if (selected.has(input.value)) input.checked = selected.get(input.value);
    });
    if (!selected.has("camping") && hasLegacyCampingLayer) {
      document.querySelector("#camping-layer-active").checked = Boolean(preferences.campingLayer);
    }
  } else if (hasLegacyCampingLayer) {
    document.querySelector("#camping-layer-active").checked = Boolean(preferences.campingLayer);
  }
  if (Array.isArray(preferences.networks)) {
    const selected = new Map(preferences.networks.map((item) => [item.value, Boolean(item.checked)]));
    document.querySelectorAll("[data-network]").forEach((input) => {
      if (selected.has(input.dataset.network)) input.checked = selected.get(input.dataset.network);
    });
  }
  if ([15, 35, 70].includes(Number(preferences.candidateHorizonKm))) {
    candidateHorizonKm = Number(preferences.candidateHorizonKm);
    document.querySelectorAll("[data-horizon]").forEach((button) => {
      button.classList.toggle("is-active", Number(button.dataset.horizon) === candidateHorizonKm);
      button.setAttribute("aria-pressed", String(Number(button.dataset.horizon) === candidateHorizonKm));
    });
  }
}

function campingPlace(sourcePlace) {
  const lat = Number(sourcePlace.lat);
  const lng = Number(sourcePlace.lng);
  if (!Number.isFinite(lat) || !Number.isFinite(lng)) return null;

  const name = sourcePlace.name || sourcePlace.operator || t("Unnamed campsite");
  const osmKey = sourcePlace.osmKey || "";
  const country = sourcePlace.country || countryFromLatLng(lat, lng);
  const locality = sourcePlace.locality || "";
  const typeLabel = sourcePlace.tourism === "caravan_site" ? t("Camper or caravan site") : t("Campsite");
  const website = sourcePlace.website || "";
  const phone = sourcePlace.phone || "";
  const email = sourcePlace.email || "";
  const extras = [
    [t("Type"), typeLabel],
  ];
  if (sourcePlace.category) extras.push([t("Category"), sourcePlace.category.replaceAll("_", " ")]);
  if (locality) extras.push([t("Place"), locality]);
  if (sourcePlace.access) extras.push([t("Access"), sourcePlace.access]);
  if (sourcePlace.tents) extras.push([t("Tents"), sourcePlace.tents === "yes" ? t("Yes") : sourcePlace.tents === "no" ? t("No according to OSM") : sourcePlace.tents]);
  if (sourcePlace.campers) extras.push([t("Campers"), sourcePlace.campers === "yes" ? t("Yes") : sourcePlace.campers === "no" ? t("No according to OSM") : sourcePlace.campers]);
  if (sourcePlace.caravans) extras.push([t("Caravans"), sourcePlace.caravans === "yes" ? t("Yes") : sourcePlace.caravans === "no" ? t("No according to OSM") : sourcePlace.caravans]);
  if (sourcePlace.motorhome) extras.push([t("Camper van"), sourcePlace.motorhome === "yes" ? t("Yes") : sourcePlace.motorhome === "no" ? t("No according to OSM") : sourcePlace.motorhome]);
  if (sourcePlace.cabins) extras.push([t("Huts/cabins"), sourcePlace.cabins === "yes" ? t("Marked as available") : sourcePlace.cabins]);
  if (sourcePlace.capacity) extras.push([t("Capacity"), sourcePlace.capacity]);
  if (sourcePlace.charge) extras.push([t("Rate"), sourcePlace.charge]);
  if (sourcePlace.operator) extras.push([t("Operator"), sourcePlace.operator]);
  if (sourcePlace.openingHours) extras.push([t("Opening hours"), sourcePlace.openingHours]);
  if (sourcePlace.stars) extras.push([t("Stars"), sourcePlace.stars]);
  if (sourcePlace.toilets) extras.push([t("Toilet"), sourcePlace.toilets === "yes" ? t("Marked as available") : sourcePlace.toilets]);
  if (sourcePlace.shower) extras.push([t("Shower"), sourcePlace.shower === "yes" ? t("Marked as available") : sourcePlace.shower]);
  if (sourcePlace.powerSupply) extras.push([t("Electricity"), sourcePlace.powerSupply === "yes" ? t("Marked as available") : sourcePlace.powerSupply]);
  if (website) extras.push([t("Website"), website]);
  if (phone) extras.push([t("Telephone"), phone]);
  if (email) extras.push([t("Email"), email]);
  const caution = sourcePlace.access && !["yes", "permissive", "customers"].includes(sourcePlace.access)
    ? t("OSM reports restricted access. Check membership, reservation and conditions before cycling there.")
    : sourcePlace.tents === "no"
      ? t("This place is listed in OSM as not suitable for tents. Check this extra carefully before bikepacking.")
      : t("OpenStreetMap may be out of date. Check opening hours and whether tents are welcome.");
  const photo = osmPhoto({
    image: sourcePlace.image,
    wikimedia_commons: sourcePlace.wikimediaCommons,
  });

  return {
    osmKey,
    name,
    lat,
    lng,
    country,
    place: {
      name,
      lat,
      lng,
      location: locality
        ? `${locality} · ${countryNames[country] || t("Unknown country")}`
        : t("{0} · OpenStreetMap Campsite", countryNames[country] || t("Unknown country")),
      type: "camping",
      confidence: 1,
      photo,
      photoLabel: sourcePlace.image ? t("OpenStreetMap image reference") : "Wikimedia Commons",
      sourceLabel: "OpenStreetMap",
      sourceUrl: sourcePlace.sourceUrl || "https://www.openstreetmap.org/",
      sourceAction: t("Open in OpenStreetMap"),
      description: "",
      stay: "",
      cost: sourcePlace.fee === "no" ? t("Marked as free") : sourcePlace.fee === "yes" ? t("Paid; check rate") : "",
      water: sourcePlace.drinkingWater === "yes" ? t("Drinking water marked") : sourcePlace.waterPoint === "yes" ? t("Water point marked") : "",
      extraFacts: extras,
      caution,
    },
  };
}

function xmlText(element, tagName) {
  const match = [...element.getElementsByTagNameNS("*", tagName)][0];
  return match?.textContent?.trim() || "";
}

function coordinatesFromElements(elements) {
  return elements.flatMap((element) => {
    if (!element.getAttribute("lat")?.trim() || !element.getAttribute("lon")?.trim()) return [];
    const lat = Number(element.getAttribute("lat"));
    const lng = Number(element.getAttribute("lon"));
    return validMapPoint({ lat, lng }) ? [{ lat, lng }] : [];
  });
}

function validMapPoint(point) {
  return Number.isFinite(point?.lat) && Math.abs(point.lat) <= 90 && Number.isFinite(point?.lng) && Math.abs(point.lng) <= 180;
}

function renderImportedWaypoints() {
  importedLayer.clearLayers();
  visiblePlaceCounts.imported = 0;
  const markers = importedWaypoints
    .filter((item) => isWithinRoute(item.lat, item.lng))
    .map((item) => {
      addCandidate(item.lat, item.lng, item.place, "imported");
      const marker = L.marker([item.lat, item.lng], { icon: markerIcon(item.place.type || "hut"), title: item.place.name })
        .on("click", () => renderPlace(item.place));
      visiblePlaceCounts.imported += 1;
      return marker;
    });
  addMarkers(importedLayer, markers);
}

function updateRouteStatus() {
  const status = document.querySelector("#route-status");
  const summary = document.querySelector("#route-summary");
  document.querySelectorAll("[data-route-distance]").forEach((button) => {
    const value = button.dataset.routeDistance;
    const active = value === "all" ? !routeFilterActive : routeFilterActive && Number(value) === routeDistanceKm;
    button.classList.toggle("is-active", active);
    button.setAttribute("aria-pressed", String(active));
  });

  if (!routeState.segments.length) {
    summary.textContent = savedRoutes.length && importedWaypoints.length
      ? t("{0} waypoints", importedWaypoints.length.toLocaleString(NookI18n.locale))
      : savedRoutes.length ? t("No route selected") : t("No route yet");
    status.textContent = "";
    status.hidden = true;
    return;
  }

  summary.textContent = routeFilterEnabled()
    ? t("{0} · within {1} km", routeState.name, routeDistanceKm)
    : t("{0} · all places", routeState.name);
  status.textContent = routesPersisted ? "" : t("Your routes no longer fit in browser storage.");
  status.hidden = routesPersisted;
}

function refreshMapPlaces() {
  requestMapSources(currentFilters());
  updateRouteStatus();
  updateFilterSummary();
}

function setRouteControls(hasActiveTrack, hasSavedRoutes = hasActiveTrack) {
  document.querySelector("#route-distance-group").hidden = !hasActiveTrack;
  document.querySelector("#clear-route").hidden = savedRoutes.length < 2 || !hasSavedRoutes;
}

function drawRoute() {
  routeLayer.clearLayers();
  if (!routeState.lines.length) return;
  const latLngLines = routeState.lines.map((line) => line.map((point) => [point.lat, point.lng]));
  L.polyline(latLngLines, { color: "#123127", weight: 9, opacity: 0.5, interactive: false }).addTo(routeLayer);
  L.polyline(latLngLines, { color: "#d6ec91", weight: 4, opacity: 0.96, interactive: false }).addTo(routeLayer);
}

function emptyRouteState() {
  return { name: "", pointCount: 0, lengthKm: 0, saved: false, lines: [], segments: [], segmentGrid: new Map() };
}

function validRouteLines(lines) {
  return (Array.isArray(lines) ? lines : [])
    .map((line) => (Array.isArray(line) ? line : []).filter(validMapPoint))
    .filter((line) => line.length > 1);
}

function validRouteWaypoints(waypoints) {
  return (Array.isArray(waypoints) ? waypoints : [])
    .filter((item) => validMapPoint(item) && item.place)
    .slice(0, 5000);
}

function routeId(fileName) {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}-${fileName.replace(/[^a-z0-9]+/gi, "-").replace(/^-|-$/g, "").toLowerCase() || "gpx"}`;
}

function formatFileSize(bytes) {
  if (!Number.isFinite(bytes) || bytes <= 0) return "";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return t("{0} KB", Math.round(bytes / 1024));
  return t("{0} MB", NookI18n.number(bytes / 1024 / 1024, { minimumFractionDigits: 1, maximumFractionDigits: 1 }));
}

function normalizeRouteRecord(route, index = 0) {
  const lines = validRouteLines(route?.lines);
  const waypoints = validRouteWaypoints(route?.waypoints);
  if (!lines.length && !waypoints.length) return null;
  return {
    id: route.id || routeId(route.fileName || route.name || `route-${index}`),
    name: route.name || route.fileName || t("GPX route {0}", index + 1),
    fileName: route.fileName || "",
    originalSize: Number(route.originalSize) || 0,
    pointCount: Number(route.pointCount) || lines.reduce((total, line) => total + line.length, 0),
    lengthKm: Number(route.lengthKm) || (lines.length ? routeLengthKm(lines) : 0),
    lines,
    waypoints,
    enabled: route.enabled !== false,
    importedAt: route.importedAt || new Date().toISOString(),
  };
}

function renderRouteLibrary() {
  const library = document.querySelector("#route-library");
  const list = document.querySelector("#route-list");
  if (!savedRoutes.length) {
    library.hidden = true;
    list.innerHTML = "";
    return;
  }

  library.hidden = false;
  list.innerHTML = savedRoutes.map((route) => {
    const meta = route.lengthKm
      ? t("{0} km", Math.round(route.lengthKm).toLocaleString(NookI18n.locale))
      : t("{0} waypoints", route.waypoints.length.toLocaleString(NookI18n.locale));
    return `
      <div class="route-list-item">
        <label>
          <input type="checkbox" data-route-toggle="${escapeHtml(route.id)}" ${route.enabled ? "checked" : ""} />
          <span>
            <strong>${escapeHtml(route.name)}</strong>
            <small>${escapeHtml(meta)}</small>
          </span>
        </label>
        <button type="button" data-route-remove="${escapeHtml(route.id)}" aria-label="${th("Remove {0}", escapeHtml(route.name))}">${ICON_CLOSE}</button>
      </div>
    `;
  }).join("");
}

function saveRouteLibrary() {
  const saved = setUserValue(ROUTE_LIBRARY_KEY, JSON.stringify(savedRoutes));
  if (saved) removeUserValue(LEGACY_ROUTE_KEY);
  routesPersisted = saved;
  return saved;
}

function rebuildActiveRoutes({ fitPoints = null, fit = false } = {}) {
  const activeRoutes = savedRoutes.filter((route) => route.enabled);
  const activeTrackRoutes = activeRoutes.filter((route) => route.lines.length);
  const activeLines = activeTrackRoutes.flatMap((route) => route.lines);
  importedWaypoints = activeRoutes.flatMap((route) => route.waypoints);

  if (!activeLines.length) {
    routeState = emptyRouteState();
  } else {
    routeState = {
      name: activeTrackRoutes.length === 1 ? activeTrackRoutes[0].name : t("{0} GPX routes", activeTrackRoutes.length),
      pointCount: activeTrackRoutes.reduce((total, route) => total + route.pointCount, 0),
      lengthKm: activeTrackRoutes.reduce((total, route) => total + route.lengthKm, 0),
      saved: routesPersisted,
      lines: activeLines,
      segments: routeSegments(activeLines),
      segmentGrid: new Map(),
    };
    routeState.segmentGrid = buildRouteSegmentGrid(routeState.segments);
  }

  drawRoute();
  setRouteControls(routeState.segments.length > 0, savedRoutes.length > 0);
  renderRouteLibrary();

  const boundsPoints = fitPoints || (activeLines.length ? activeLines.flat() : importedWaypoints);
  if ((fit || fitPoints) && boundsPoints.length) {
    map.fitBounds(L.latLngBounds(boundsPoints.map((point) => [point.lat, point.lng])), { padding: [34, 34], maxZoom: 11 });
  }
}

function restoreRoute() {
  try {
    const routeLibrary = storedJson(ROUTE_LIBRARY_KEY);
    const restoredRoutes = Array.isArray(routeLibrary)
      ? routeLibrary.map(normalizeRouteRecord).filter(Boolean)
      : [];

    if (restoredRoutes.length) {
      savedRoutes = restoredRoutes;
      routesPersisted = true;
      rebuildActiveRoutes({ fit: !hasSavedMapView });
      return true;
    }

    const legacy = storedJson(LEGACY_ROUTE_KEY);
    const legacyRoute = normalizeRouteRecord({
      id: "legacy-route",
      name: legacy?.name || t("Saved route"),
      pointCount: legacy?.pointCount,
      lengthKm: legacy?.lengthKm,
      lines: legacy?.lines,
      waypoints: legacy?.waypoints,
      enabled: true,
      importedAt: new Date().toISOString(),
    });
    if (!legacyRoute) return false;
    savedRoutes = [legacyRoute];
    saveRouteLibrary();
    rebuildActiveRoutes({ fit: !hasSavedMapView });
    return true;
  } catch (error) {
    console.warn(t("Saved GPX routes could not be restored."), error);
    return false;
  }
}

function clearRoute() {
  removeSavedRoutes(savedRoutes.map((route) => route.id));
}

function removeSavedRoutes(ids) {
  removedRoutes = savedRoutes.flatMap((route, index) => ids.includes(route.id) ? [{ route, index }] : []);
  if (!removedRoutes.length) return;
  savedRoutes = savedRoutes.filter((route) => !ids.includes(route.id));
  saveRouteLibrary();
  document.querySelector("#route-undo-message").textContent = removedRoutes.length === 1 ? t("{0} removed.", removedRoutes[0].route.name) : t("{0} routes removed.", removedRoutes.length);
  document.querySelector("#route-undo").hidden = false;
  rebuildActiveRoutes();
  refreshMapPlaces();
  document.querySelector("#undo-route-removal").focus({ preventScroll: true });
}

function undoRouteRemoval() {
  for (const { route, index } of removedRoutes) {
    if (!savedRoutes.some((item) => item.id === route.id)) savedRoutes.splice(Math.min(index, savedRoutes.length), 0, route);
  }
  removedRoutes = [];
  document.querySelector("#route-undo").hidden = true;
  const saved = saveRouteLibrary();
  rebuildActiveRoutes();
  refreshMapPlaces();
  showRouteFeedback(saved ? t("Deleted routes recovered and saved.") : t("Routes restored, but saving to this device failed."), !saved);
  document.querySelector("#choose-gpx").focus({ preventScroll: true });
}

function showRouteFeedback(message, error = false) {
  const feedback = document.querySelector("#route-feedback");
  feedback.textContent = message;
  feedback.hidden = !message;
  feedback.classList.toggle("is-error", error);
}

function countGpxImport() {
  if (navigator.onLine === false || navigator.doNotTrack === "1" || navigator.globalPrivacyControl === true) return;
  try {
    // No request body, cookies, route data, referrer or persistent identifier.
    void fetch(new URL("api/gpx-import", document.baseURI), {
      method: "POST", credentials: "omit", referrerPolicy: "no-referrer",
      cache: "no-store", keepalive: true,
    }).catch(() => {});
  } catch { /* Counting must never prevent a local import. */ }
}

function importGpx(file) {
  if (file.size > 20 * 1024 * 1024) {
    showRouteFeedback(t("This file is larger than 20 MB. Export a shorter or simplified GPX route and try again."), true);
    return;
  }
  const reader = new FileReader();
  showRouteFeedback(t("Reading {0}…", file.name));
  reader.onerror = () => showRouteFeedback(t("This GPX file could not be read. Choose the file again."), true);
  reader.onload = () => {
    try {
      const xml = new DOMParser().parseFromString(reader.result, "application/xml");
      if (xml.querySelector("parsererror") || xml.documentElement?.localName !== "gpx") {
        showRouteFeedback(t("This is not a valid GPX file. Your saved routes have been retained."), true);
        return;
      }
      const trackLines = [...xml.getElementsByTagNameNS("*", "trkseg")]
        .map((segment) => coordinatesFromElements([...segment.getElementsByTagNameNS("*", "trkpt")]))
        .filter((line) => line.length > 1);
      const routeLines = [...xml.getElementsByTagNameNS("*", "rte")]
        .map((route) => coordinatesFromElements([...route.getElementsByTagNameNS("*", "rtept")]))
        .filter((line) => line.length > 1);
      const rawLines = trackLines.length ? trackLines : routeLines;
      const waypoints = [...xml.getElementsByTagNameNS("*", "wpt")].slice(0, 5000).flatMap((waypoint, index) => {
        const [point] = coordinatesFromElements([waypoint]);
        if (!point) return [];
        const { lat, lng } = point;
        const name = xmlText(waypoint, "name") || t("GPX spot {0}", index + 1);
        const description = xmlText(waypoint, "desc") || xmlText(waypoint, "cmt") || t("Imported waypoint without additional description.");
        const link = [...waypoint.getElementsByTagNameNS("*", "link")][0]?.getAttribute("href");
        return [{ lat, lng, place: {
          name, lat, lng, description,
          location: t("{0}, {1} · imported from {2}", lat.toFixed(5), lng.toFixed(5), file.name),
          type: "hut", confidence: 1, sourceLabel: t("GPX: {0}", file.name),
          sourceUrl: link && /^https?:\/\//i.test(link) ? link : "https://www.openstreetmap.org/",
          stay: t("Check with source"), cost: t("Cannot be deduced from GPX"), water: t("Cannot be deduced from GPX"),
          caution: t("A GPX file may be out of date. Check price, reservation, access and current status with the original source or local administrator."),
        } }];
      });
      if (!rawLines.length && !waypoints.length) {
        showRouteFeedback(t("No route or waypoints with valid coordinates found. Your saved routes have been retained."), true);
        return;
      }
      const metadata = [...xml.getElementsByTagNameNS("*", "metadata")][0];
      const track = [...xml.getElementsByTagNameNS("*", "trk")][0];
      const route = [...xml.getElementsByTagNameNS("*", "rte")][0];
      const name = xmlText(metadata || track || route || xml, "name") || file.name.replace(/\.gpx$/i, "") || t("GPX route");
      const record = normalizeRouteRecord({
        id: routeId(file.name), name, fileName: file.name, originalSize: file.size,
        pointCount: rawLines.reduce((total, line) => total + line.length, 0),
        lengthKm: routeLengthKm(rawLines), lines: prepareRouteLines(rawLines), waypoints,
        enabled: true, importedAt: new Date().toISOString(),
      });
      if (!record) {
        showRouteFeedback(t("This GPX does not contain any usable route or waypoints. Your saved routes have been retained."), true);
        return;
      }
      savedRoutes.push(record);
      if (rawLines.length) routeFilterActive = true;
      const saved = saveRouteLibrary();
      saveFilterPreferences();
      rebuildActiveRoutes({ fitPoints: rawLines.length ? rawLines.flat() : waypoints });
      refreshMapPlaces();
      const detail = rawLines.length ? t("{0} km", Math.round(record.lengthKm).toLocaleString(NookI18n.locale)) : t("{0} waypoints", waypoints.length);
      showRouteFeedback(t("Added {0} ({1}). {2}", name, detail, saved ? t("Saved on this device.") : t("Temporarily visible: Failed to save to this device.")), !saved);
      countGpxImport();
    } catch (error) {
      console.warn(t("GPX could not be imported."), error);
      showRouteFeedback(t("This GPX could not be processed. Try a new export; your previous routes are preserved."), true);
    }
  };
  reader.readAsText(file);
}

document.querySelectorAll("#sleep-filter input").forEach((control) => {
  control.addEventListener("change", () => {
    saveFilterPreferences();
    refreshMapPlaces();
  });
});


document.querySelector("#gpx-file").addEventListener("change", (event) => {
  const [file] = event.target.files;
  if (file) importGpx(file);
  event.target.value = "";
});
document.querySelector("#choose-gpx").addEventListener("click", () => document.querySelector("#gpx-file").click());
document.querySelector("#undo-route-removal").addEventListener("click", undoRouteRemoval);
document.querySelectorAll("[data-route-distance]").forEach((button) => {
  button.addEventListener("click", () => {
    const value = button.dataset.routeDistance;
    if (value === "all") {
      routeFilterActive = false;
    } else {
      routeFilterActive = true;
      routeDistanceKm = Number(value);
      setUserValue(ROUTE_DISTANCE_KEY, value);
    }
    saveFilterPreferences();
    refreshMapPlaces();
  });
});
document.querySelectorAll("[data-disclosure]").forEach((toggle) => {
  toggle.addEventListener("click", () => setDisclosure(toggle, toggle.getAttribute("aria-expanded") !== "true"));
});
document.querySelector("#clear-route").addEventListener("click", clearRoute);
document.querySelector("#route-list").addEventListener("change", (event) => {
  const checkbox = event.target.closest("[data-route-toggle]");
  if (!checkbox) return;
  const route = savedRoutes.find((item) => item.id === checkbox.dataset.routeToggle);
  if (!route) return;
  route.enabled = checkbox.checked;
  saveRouteLibrary();
  rebuildActiveRoutes();
  refreshMapPlaces();
});
document.querySelector("#route-list").addEventListener("click", (event) => {
  const button = event.target.closest("[data-route-remove]");
  if (!button) return;
  removeSavedRoutes([button.dataset.routeRemove]);
});
document.querySelector("#locate-me").addEventListener("click", () => {
  if (userLocation) navigateMapTo([userLocation.lat, userLocation.lng], Math.max(map.getZoom(), 13));
  else requestUserLocation({ focusMap: true });
});
document.querySelector("#show-candidates").addEventListener("click", () => {
  if (userLocation) {
    navigateMapTo([userLocation.lat, userLocation.lng], Math.max(map.getZoom(), 13));
    openCandidatePanel();
  } else {
    openCandidatePanel();
  }
});
document.querySelector("#candidate-use-location").addEventListener("click", () => {
  requestUserLocation({ openCandidates: true, focusMap: true });
});
document.querySelector("#close-candidates").addEventListener("click", closeCandidatePanel);
document.querySelectorAll("[data-horizon]").forEach((button) => {
  button.addEventListener("click", () => {
    candidateHorizonKm = Number(button.dataset.horizon);
    document.querySelectorAll("[data-horizon]").forEach((item) => item.classList.toggle("is-active", item === button));
    document.querySelectorAll("[data-horizon]").forEach((item) => item.setAttribute("aria-pressed", String(item === button)));
    saveFilterPreferences();
    updateCandidatePanel();
  });
});
document.querySelector("#candidate-list").addEventListener("click", (event) => {
  if (event.target.closest("[data-open-filters]")) { setFiltersOpen(true); return; }
  if (event.target.closest("[data-retry-map]")) { retryMapData(); return; }
  const button = event.target.closest("[data-candidate-index]");
  if (!button) return;
  const candidate = displayedCandidates[Number(button.dataset.candidateIndex)];
  if (!candidate) return;
  navigateMapTo([candidate.lat, candidate.lng], Math.max(map.getZoom(), 14));
  renderPlace(candidate.place);
});

document.querySelector("#toggle-filters").addEventListener("click", () => {
  const isOpen = document.querySelector("#map-sidebar").classList.contains("is-open");
  setFiltersOpen(!isOpen);
});
document.querySelector("#close-filters").addEventListener("click", () => setFiltersOpen(false));
document.querySelector("#reset-filters").addEventListener("click", resetFilters);
document.querySelector("#map-data-action").addEventListener("click", () => mapDataError ? retryMapData() : setFiltersOpen(true));
document.querySelector("#map-sidebar").addEventListener("cancel", (event) => {
  event.preventDefault();
  setFiltersOpen(false);
});
document.querySelector("#map-sidebar").addEventListener("click", (event) => {
  if (event.target !== event.currentTarget) return;
  const bounds = event.currentTarget.getBoundingClientRect();
  if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) setFiltersOpen(false);
});
map.on("movestart zoomstart", () => {
  mapIsMoving = true;
  window.clearTimeout(viewportRefreshTimer);
});
map.on("moveend", () => {
  mapIsMoving = false;
  saveMapView();
  scheduleViewportRefresh();
});
document.addEventListener("keydown", (event) => {
  if (event.key !== "Escape") return;
  if (document.querySelector("#map-sidebar").open) return;
  if (candidatePanelOpen) closeCandidatePanel();
  else renderEmptyPanel();
});

const savedRouteDistance = Number(getUserValue(ROUTE_DISTANCE_KEY));
if (savedRouteDistance >= 1 && savedRouteDistance <= 50) {
  // Older versions saved any value from 1 to 50 km; snap it to the nearest preset.
  routeDistanceKm = ROUTE_DISTANCE_PRESETS.reduce((best, value) => Math.abs(value - savedRouteDistance) < Math.abs(best - savedRouteDistance) ? value : best);
}

removeUserValue(COUNTRY_FILTER_KEY);
restoreFilterPreferences();
restoreRoute();
refreshMapPlaces();
function setDisclosure(toggle, open) {
  toggle.setAttribute("aria-expanded", String(open));
  const body = document.getElementById(toggle.getAttribute("aria-controls"));
  if (body) body.hidden = !open;
}

function openRouteImportPanelFromLink() {
  setFiltersOpen(true);
  setDisclosure(document.querySelector('[aria-controls="route-panel"]'), true);
  history.replaceState(null, "", window.location.pathname);
  document.querySelector("#choose-gpx").focus({ preventScroll: true });
}

const wantsRouteImport = new URLSearchParams(window.location.search).get("route") === "import" || window.location.hash === "#route-import";
if (wantsRouteImport) openRouteImportPanelFromLink();
window.addEventListener("hashchange", () => {
  if (window.location.hash === "#route-import") openRouteImportPanelFromLink();
});

window.addEventListener("load", () => {
  window.setTimeout(() => map.invalidateSize(), 120);
});
