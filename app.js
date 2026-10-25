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
  return routeState.segments.length > 0 && document.querySelector("#route-filter-active").checked;
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
  const distanceKm = Number(document.querySelector("#route-distance").value);
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

function renderEmptyPanel(title = t("Choose a place"), message = t("Select a marker for its source, rules and practical details.")) {
  placeDetailSequence++;
  const panel = document.querySelector("#place-panel");
  if (panel.contains(document.activeElement)) document.querySelector("#map").focus({ preventScroll: true });
  panel.inert = true;
  panel.classList.remove("is-open");
  panel.setAttribute("aria-hidden", "true");
  panel.innerHTML = `
    <div class="empty-state">
      <span class="empty-icon">⌖</span>
      <h3>${escapeHtml(title)}</h3>
      <p>${escapeHtml(message)}</p>
    </div>
  `;
}

function showPlaceMessage(title, message) {
  renderEmptyPanel(title, message);
  const panel = document.querySelector("#place-panel");
  const close = document.createElement("button");
  close.className = "overlay-close place-panel-close";
  close.type = "button";
  close.setAttribute("aria-label", t("Close location information"));
  close.textContent = "×";
  close.onclick = () => renderEmptyPanel();
  panel.prepend(close);
  panel.classList.add("is-open");
  panel.setAttribute("aria-hidden", "false");
  panel.inert = false;
  panel.focus({ preventScroll: true });
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
  const certainty = place.confidence === 3 ? t("Official source") : place.confidence === 2 ? t("Source listed; check locally") : t("Community suggestion");
  const extraFacts = place.extraFacts || [];
  const hasCoordinates = !place.approximate && Number.isFinite(place.lat) && Number.isFinite(place.lng);
  const coordinates = hasCoordinates ? `${place.lat},${place.lng}` : "";
  const mapLabel = encodeURIComponent(place.name || t("Place to stay"));
  const appleMapsUrl = hasCoordinates ? `https://maps.apple.com/?ll=${coordinates}&q=${mapLabel}` : "";
  const googleMapsUrl = hasCoordinates ? `https://www.google.com/maps/search/?api=1&query=${coordinates}` : "";
  panel.innerHTML = `
    <button class="overlay-close place-panel-close" type="button" aria-label="${th("Close location information")}">×</button>
    ${place.photo ? `
      <figure class="place-photo-wrap">
        <img class="place-photo" src="${escapeHtml(place.photo)}" alt="${th("Photo of {0}", escapeHtml(place.name))}" loading="lazy" referrerpolicy="no-referrer" />
        <figcaption>${th("Photo: {0}", escapeHtml(place.photoLabel || place.sourceLabel))}</figcaption>
      </figure>
    ` : ""}
    <div class="place-badges">
      <span class="badge">${escapeHtml(sleepTypes[place.type]?.label || t("Place to stay"))}</span>
      <span class="badge badge-muted">${escapeHtml(certainty)}</span>
    </div>
    <h3>${escapeHtml(place.name)}</h3>
    <p class="place-location">${escapeHtml(place.location)}</p>
    ${place.decision ? `<p class="place-decision">${escapeHtml(place.decision)}</p>` : ""}
    <p class="place-description">${escapeHtml(place.description)}</p>
    <ul class="place-facts">
      <li><span>${th("Stay")}</span><strong>${escapeHtml(place.stay)}</strong></li>
      <li><span>${th("Cost")}</span><strong>${escapeHtml(place.cost)}</strong></li>
      <li><span>${th("Water")}</span><strong>${escapeHtml(place.water)}</strong></li>
      <li><span>${th("Source")}</span><strong>${escapeHtml(place.sourceLabel)}</strong></li>
      ${extraFacts.map(([label, value]) => `<li><span>${escapeHtml(label)}</span><strong>${escapeHtml(value)}</strong></li>`).join("")}
    </ul>
    ${hasCoordinates ? `
      <div class="place-map-actions">
        <a href="${escapeHtml(appleMapsUrl)}" target="_blank" rel="noreferrer">Apple Maps <span>↗</span></a>
        <a href="${escapeHtml(googleMapsUrl)}" target="_blank" rel="noreferrer">Google Maps <span>↗</span></a>
      </div>
    ` : ""}
    <a class="button button-primary place-link" href="${escapeHtml(place.sourceUrl)}" target="_blank" rel="noreferrer">${escapeHtml(place.sourceAction || t("Open the source"))} ↗</a>
    ${place.licenseUrl ? `<p class="place-attribution"><a href="${escapeHtml(place.licenseUrl)}" target="_blank" rel="noreferrer">${escapeHtml(place.attribution)} · ${escapeHtml(place.licenseLabel)}</a></p>` : ""}
    ${place.caution ? `<div class="place-caution"><strong>${th("Before you go:")}</strong> ${escapeHtml(place.caution)}</div>` : ""}
  `;
  panel.classList.add("is-open");
  panel.setAttribute("aria-hidden", "false");
  panel.inert = false;
  panel.querySelector(".place-panel-close").addEventListener("click", () => renderEmptyPanel());
  panel.querySelector(".place-photo")?.addEventListener("error", (event) => event.currentTarget.closest(".place-photo-wrap")?.remove());
  setFiltersOpen(false);
  panel.scrollTop = 0;
  panel.focus({ preventScroll: true });
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
  const routeDistanceKm = Number(document.querySelector("#route-distance").value);
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
    list.innerHTML = `<div class="candidate-empty"><strong>${th("Could not load places.")}</strong><span>${th("Check your connection and try again.")}</span><button class="button button-quiet" type="button" data-retry-map>${th("Try again")}</button></div>`;
    return;
  }
  if (mapDataLoading) {
    list.innerHTML = `<div class="candidate-empty">${mapManifest ? t("Looking for suitable places…") : t("Loading places…")}</div>`;
    displayedCandidates = [];
    return;
  }
  const candidates = rankedCandidates();
  const anchorText = userLocation ? t("your current position") : t("the center of the map");
  const routeText = routeFilterEnabled() && nearestRoutePosition((userLocation || map.getCenter()).lat, (userLocation || map.getCenter()).lng, 20)?.distanceKm <= 20
    ? t("further along your GPX route")
    : t("within a straight-line distance");
  intro.textContent = t("{0}Ranked from {1}, {2}. Only your active filters count.", locationMessage ? `${locationMessage} ` : "", anchorText, routeText);
  updateLocationNote();

  if (!candidates.length) {
    displayedCandidates = [];
    list.innerHTML = `
      <div class="candidate-empty">
        <strong>${th("No suitable places within {0} km.", candidateHorizonKm)}</strong>
        <span>${th("Choose a greater distance, move the map or expand your filters.")}</span>
        <button class="button button-quiet" type="button" data-open-filters>${th("Adjust filters")}</button>
      </div>`;
    return;
  }

  displayedCandidates = candidates;
  list.innerHTML = candidates.map((candidate, index) => `
    <button class="candidate-item" type="button" data-candidate-index="${index}">
      <span class="candidate-number">${index + 1}</span>
      <span class="candidate-copy">
        <strong>${escapeHtml(candidate.place.name)}</strong>
        <small>${escapeHtml(candidateDistanceLabel(candidate))}</small>
        <span><i class="candidate-type marker-${escapeHtml(candidate.place.type)}"></i>${escapeHtml(sleepTypes[candidate.place.type]?.label || t("Place to stay"))} · ${escapeHtml(candidateProviderLabel(candidate.provider))}</span>
      </span>
      <span class="candidate-arrow">→</span>
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
  if (!note) return;
  if (userLocation) {
    note.textContent = t("Location active, accurate to about {0}.", formatDistance((userLocation.accuracy || 0) / 1000));
  } else if (locationMessage) {
    note.textContent = locationMessage;
  } else {
    note.textContent = t("Without GPS, Nook uses the center of the map.");
  }
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
  const count = [...document.querySelectorAll('#sleep-filter input:not(:checked)')].length
    + Number(countrySelectionMode !== "auto") + Number(routeFilterEnabled());
  const badge = document.querySelector("#filter-count");
  badge.textContent = String(count);
  badge.hidden = !count;
  document.querySelector("#toggle-filters").setAttribute("aria-label", count ? t("Filters, {0} active restrictions", count) : t("Filters"));
}

function resetFilters() {
  document.querySelectorAll('#sleep-filter input').forEach((input) => { input.checked = true; });
  document.querySelector("#route-filter-active").checked = false;
  setAutoCountries({ announce: false });
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

const FILTER_COUNTRIES = [
  { code: "AF", name: "Afghanistan", center: [33.93, 67.69, 6], bounds: [[29.39, 60.49], [38.47, 74.89]] },
  { code: "AX", name: "Åland Islands", center: [60.18, 19.98, 10], bounds: [[59.95, 19.51], [60.41, 20.45]] },
  { code: "AL", name: "Albania", center: [41.2, 20.1, 7], bounds: [[39.6, 19.1], [42.7, 21.1]] },
  { code: "DZ", name: "Algeria", center: [28.03, 1.64, 5], bounds: [[18.98, -8.68], [37.09, 11.97]] },
  { code: "AS", name: "American Samoa", center: [-14.3, -170.14, 9], bounds: [[-14.37, -170.83], [-14.22, -169.44]] },
  { code: "VI", name: "U.S. Virgin Islands", center: [18.03, -64.8, 10], bounds: [[17.68, -65.04], [18.39, -64.56]] },
  { code: "AD", name: "Andorra", center: [42.55, 1.6, 10], bounds: [[42.4, 1.4], [42.7, 1.8]] },
  { code: "AO", name: "Angola", center: [-11.94, 17.9, 5], bounds: [[-18.03, 11.74], [-5.84, 24.06]] },
  { code: "AI", name: "Anguilla", center: [18.22, -63.07, 12], bounds: [[18.17, -63.17], [18.28, -62.97]] },
  { code: "AG", name: "Antigua & Barbuda", center: [17.36, -61.78, 9], bounds: [[16.99, -61.89], [17.73, -61.67]] },
  { code: "AR", name: "Argentina", center: [-37.09, -63.62, 4], bounds: [[-52.39, -73.57], [-21.79, -53.66]] },
  { code: "AM", name: "Armenia", center: [40.08, 45.02, 8], bounds: [[38.86, 43.44], [41.29, 46.6]] },
  { code: "AW", name: "Aruba", center: [12.52, -69.97, 11], bounds: [[12.42, -70.06], [12.63, -69.88]] },
  { code: "AU", name: "Australia", center: [-24.92, 133.39, 4], bounds: [[-39.14, 113.16], [-10.69, 153.63]] },
  { code: "AZ", name: "Azerbaijan", center: [40.14, 47.58, 7], bounds: [[38.39, 44.77], [41.89, 50.39]] },
  { code: "BS", name: "Bahamas", center: [23.92, -75.87, 6], bounds: [[20.91, -79], [26.93, -72.75]] },
  { code: "BH", name: "Bahrain", center: [25.93, 50.62, 10], bounds: [[25.58, 50.45], [26.29, 50.8]] },
  { code: "BD", name: "Bangladesh", center: [23.68, 90.33, 6], bounds: [[20.74, 88.02], [26.62, 92.64]] },
  { code: "BB", name: "Barbados", center: [13.2, -59.54, 11], bounds: [[13.05, -59.65], [13.34, -59.43]] },
  { code: "BY", name: "Belarus", center: [53.7, 27.9, 6], bounds: [[51.2, 23.1], [56.2, 32.8]] },
  { code: "BE", name: "Belgium", center: [50.7, 4.65, 7], bounds: [[49.45, 2.45], [51.55, 6.45]] },
  { code: "BZ", name: "Belize", center: [17.19, -88.66, 8], bounds: [[15.88, -89.24], [18.49, -88.08]] },
  { code: "BJ", name: "Benin", center: [9.31, 2.3, 6], bounds: [[6.21, 0.76], [12.4, 3.84]] },
  { code: "BM", name: "Bermuda", center: [32.32, -64.77, 12], bounds: [[32.25, -64.89], [32.39, -64.65]] },
  { code: "BT", name: "Bhutan", center: [27.53, 90.41, 8], bounds: [[26.7, 88.73], [28.36, 92.09]] },
  { code: "BO", name: "Bolivia", center: [-16.29, -63.57, 5], bounds: [[-22.9, -69.67], [-9.68, -57.47]] },
  { code: "BA", name: "Bosnia & Herzegovina", center: [44.1, 17.8, 7], bounds: [[42.5, 15.7], [45.3, 19.7]] },
  { code: "BW", name: "Botswana", center: [-22.34, 24.66, 6], bounds: [[-26.89, 19.98], [-17.78, 29.35]] },
  { code: "BR", name: "Brazil", center: [-14.24, -54.41, 4], bounds: [[-33.74, -74.02], [5.27, -34.79]] },
  { code: "VG", name: "British Virgin Islands", center: [18.54, -64.52, 10], bounds: [[18.33, -64.77], [18.75, -64.27]] },
  { code: "BN", name: "Brunei", center: [4.54, 114.68, 9], bounds: [[4.02, 114], [5.06, 115.36]] },
  { code: "BG", name: "Bulgaria", center: [42.7, 25.3, 7], bounds: [[41.2, 22.3], [44.3, 28.7]] },
  { code: "BF", name: "Burkina Faso", center: [12.24, -1.57, 6], bounds: [[9.39, -5.52], [15.08, 2.39]] },
  { code: "BI", name: "Burundi", center: [-3.38, 29.91, 8], bounds: [[-4.46, 28.99], [-2.3, 30.83]] },
  { code: "KH", name: "Cambodia", center: [12.56, 104.96, 7], bounds: [[10.42, 102.31], [14.7, 107.61]] },
  { code: "CA", name: "Canada", center: [62.39, -98.31, 3], bounds: [[41.67, -141.01], [83.12, -55.62]] },
  { code: "CF", name: "Central African Republic", center: [6.62, 20.91, 6], bounds: [[2.24, 14.39], [11, 27.44]] },
  { code: "CL", name: "Chile", center: [-36.23, -71.36, 4], bounds: [[-54.95, -75.71], [-17.51, -67.01]] },
  { code: "CN", name: "China", center: [36.9, 104.19, 4], bounds: [[20.24, 73.6], [53.57, 134.77]] },
  { code: "CO", name: "Colombia", center: [4.12, -72.95, 5], bounds: [[-4.24, -79.02], [12.47, -66.88]] },
  { code: "KM", name: "Comoros", center: [-11.87, 43.87, 9], bounds: [[-12.38, 43.21], [-11.36, 44.53]] },
  { code: "CG", name: "Congo - Brazzaville", center: [-0.66, 14.88, 6], bounds: [[-5.02, 11.11], [3.71, 18.64]] },
  { code: "CD", name: "Congo - Kinshasa", center: [-4.04, 21.75, 5], bounds: [[-13.46, 12.21], [5.38, 31.28]] },
  { code: "CK", name: "Cook Islands", center: [-15.44, -158.58, 5], bounds: [[-21.94, -159.85], [-8.95, -157.31]] },
  { code: "CR", name: "Costa Rica", center: [9.62, -84.25, 7], bounds: [[8.03, -85.95], [11.21, -82.56]] },
  { code: "CU", name: "Cuba", center: [21.52, -79.54, 6], bounds: [[19.83, -84.95], [23.21, -74.13]] },
  { code: "CW", name: "Curaçao", center: [12.22, -68.96, 11], bounds: [[12.04, -69.17], [12.39, -68.74]] },
  { code: "CY", name: "Cyprus", center: [35.1, 33.2, 8], bounds: [[34.5, 32.2], [35.8, 34.7]] },
  { code: "DK", name: "Denmark", center: [56.1, 9.4, 7], bounds: [[54.45, 7.7], [57.9, 15.3]] },
  { code: "DJ", name: "Djibouti", center: [11.82, 42.58, 8], bounds: [[10.93, 41.75], [12.71, 43.42]] },
  { code: "DM", name: "Dominica", center: [15.42, -61.37, 10], bounds: [[15.2, -61.49], [15.63, -61.25]] },
  { code: "DO", name: "Dominican Republic", center: [18.77, -70.17, 8], bounds: [[17.6, -72.01], [19.94, -68.33]] },
  { code: "DE", name: "Germany", center: [51.2, 10.4, 6], bounds: [[47.2, 5.5], [55.2, 15.2]] },
  { code: "EC", name: "Ecuador", center: [-1.79, -78.12, 6], bounds: [[-5.01, -81.01], [1.43, -75.23]] },
  { code: "EG", name: "Egypt", center: [26.83, 30.79, 6], bounds: [[21.99, 24.69], [31.66, 36.9]] },
  { code: "SV", name: "El Salvador", center: [13.8, -88.91, 8], bounds: [[13.16, -90.11], [14.45, -87.7]] },
  { code: "GQ", name: "Equatorial Guinea", center: [2.35, 9.88, 7], bounds: [[0.92, 8.42], [3.77, 11.34]] },
  { code: "ER", name: "Eritrea", center: [15.18, 39.77, 7], bounds: [[12.36, 36.42], [18, 43.12]] },
  { code: "EE", name: "Estonia", center: [58.7, 25.0, 7], bounds: [[57.5, 21.7], [59.8, 28.3]] },
  { code: "SZ", name: "Eswatini", center: [-26.53, 31.45, 8], bounds: [[-27.32, 30.78], [-25.74, 32.12]] },
  { code: "ET", name: "Ethiopia", center: [9.14, 40.48, 5], bounds: [[3.4, 32.99], [14.88, 47.98]] },
  { code: "FO", name: "Faroe Islands", center: [61.9, -6.85, 9], bounds: [[61.39, -7.43], [62.4, -6.28]] },
  { code: "FK", name: "Falkland Islands", center: [-51.8, -59.39, 8], bounds: [[-52.34, -61.04], [-51.25, -57.73]] },
  { code: "FJ", name: "Fiji", center: [-17.21, 178.63, 8], bounds: [[-18.27, 177.25], [-16.15, 180]] },
  { code: "PH", name: "Philippines", center: [12.11, 121.9, 5], bounds: [[5.57, 117.19], [18.65, 126.62]] },
  { code: "FI", name: "Finland", center: [63.8, 26.0, 5], bounds: [[59.7, 19.0], [70.1, 31.6]] },
  { code: "FR", name: "France", center: [46.6, 2.5, 6], bounds: [[41.2, -5.3], [51.3, 9.7]] },
  { code: "PF", name: "French Polynesia", center: [-13.33, -145.08, 6], bounds: [[-17.87, -151.54], [-8.78, -138.62]] },
  { code: "GA", name: "Gabon", center: [-0.81, 11.6, 6], bounds: [[-3.94, 8.7], [2.32, 14.5]] },
  { code: "GM", name: "Gambia", center: [13.44, -15.32, 8], bounds: [[13.07, -16.83], [13.82, -13.82]] },
  { code: "GE", name: "Georgia", center: [42.31, 43.34, 7], bounds: [[41.04, 39.99], [43.58, 46.69]] },
  { code: "GH", name: "Ghana", center: [7.95, -1.04, 6], bounds: [[4.74, -3.26], [11.16, 1.19]] },
  { code: "GI", name: "Gibraltar", center: [36.13, -5.35, 13], bounds: [[36.11, -5.36], [36.14, -5.34]] },
  { code: "GD", name: "Grenada", center: [12.27, -61.61, 10], bounds: [[12, -61.79], [12.53, -61.42]] },
  { code: "GR", name: "Greece", center: [39.1, 22.2, 6], bounds: [[34.7, 19.2], [41.8, 28.3]] },
  { code: "GL", name: "Greenland", center: [71.81, -42.22, 4], bounds: [[59.99, -73.06], [83.63, -11.38]] },
  { code: "GU", name: "Guam", center: [13.45, 144.79, 10], bounds: [[13.24, 144.62], [13.65, 144.95]] },
  { code: "GT", name: "Guatemala", center: [15.77, -90.23, 7], bounds: [[13.73, -92.25], [17.82, -88.22]] },
  { code: "GG", name: "Guernsey", center: [49.57, -2.42, 10], bounds: [[49.41, -2.67], [49.73, -2.17]] },
  { code: "GN", name: "Guinea", center: [9.93, -11.37, 7], bounds: [[7.19, -15.08], [12.67, -7.66]] },
  { code: "GW", name: "Guinea-Bissau", center: [11.8, -15.19, 8], bounds: [[10.93, -16.73], [12.68, -13.66]] },
  { code: "GY", name: "Guyana", center: [4.87, -58.94, 6], bounds: [[1.19, -61.4], [8.56, -56.48]] },
  { code: "HT", name: "Haiti", center: [18.99, -73.06, 8], bounds: [[18.03, -74.49], [19.95, -71.64]] },
  { code: "HN", name: "Honduras", center: [14.51, -86.25, 7], bounds: [[12.98, -89.36], [16.03, -83.13]] },
  { code: "HU", name: "Hungary", center: [47.1, 19.4, 7], bounds: [[45.7, 16.1], [48.6, 22.9]] },
  { code: "HK", name: "Hong Kong SAR China", center: [22.38, 114.12, 10], bounds: [[22.19, 113.84], [22.56, 114.4]] },
  { code: "IE", name: "Ireland", center: [53.3, -8.0, 7], bounds: [[51.3, -10.8], [55.4, -5.9]] },
  { code: "IS", name: "Iceland", center: [64.9, -18.7, 6], bounds: [[63.2, -24.8], [66.7, -13.4]] },
  { code: "IN", name: "India", center: [21.79, 82.75, 4], bounds: [[8.08, 68.14], [35.5, 97.36]] },
  { code: "ID", name: "Indonesia", center: [-1.73, 118.09, 4], bounds: [[-9.11, 95.2], [5.65, 140.98]] },
  { code: "IQ", name: "Iraq", center: [33.22, 43.67, 6], bounds: [[29.06, 38.77], [37.38, 48.56]] },
  { code: "IR", name: "Iran", center: [32.42, 53.67, 5], bounds: [[25.06, 44.01], [39.77, 63.32]] },
  { code: "IM", name: "Isle of Man", center: [54.24, -4.55, 10], bounds: [[54.06, -4.79], [54.42, -4.31]] },
  { code: "IL", name: "Israel", center: [31.45, 35.07, 7], bounds: [[29.49, 34.25], [33.41, 35.89]] },
  { code: "IT", name: "Italy", center: [43.2, 12.0, 6], bounds: [[35.4, 6.6], [47.2, 18.8]] },
  { code: "CI", name: "Côte d’Ivoire", center: [7.54, -5.56, 6], bounds: [[4.34, -8.62], [10.73, -2.51]] },
  { code: "JM", name: "Jamaica", center: [18.11, -77.28, 8], bounds: [[17.7, -78.37], [18.53, -76.19]] },
  { code: "JP", name: "Japan", center: [38.26, 137.69, 5], bounds: [[31, 129.55], [45.52, 145.82]] },
  { code: "YE", name: "Yemen", center: [15.8, 47.85, 6], bounds: [[12.6, 42.61], [19, 53.09]] },
  { code: "JE", name: "Jersey", center: [49.22, -2.13, 12], bounds: [[49.17, -2.24], [49.27, -2.01]] },
  { code: "JO", name: "Jordan", center: [31.28, 37.12, 7], bounds: [[29.19, 34.95], [33.37, 39.29]] },
  { code: "KY", name: "Cayman Islands", center: [19.51, -80.57, 9], bounds: [[19.26, -81.42], [19.76, -79.73]] },
  { code: "CV", name: "Cape Verde", center: [16, -24.01, 8], bounds: [[14.8, -25.36], [17.2, -22.67]] },
  { code: "CM", name: "Cameroon", center: [7.37, 12.36, 5], bounds: [[1.65, 8.51], [13.08, 16.21]] },
  { code: "KZ", name: "Kazakhstan", center: [48.01, 66.9, 4], bounds: [[40.58, 46.48], [55.43, 87.32]] },
  { code: "KE", name: "Kenya", center: [0.18, 37.89, 6], bounds: [[-4.68, 33.89], [5.03, 41.89]] },
  { code: "KG", name: "Kyrgyzstan", center: [41.23, 74.74, 6], bounds: [[39.19, 69.23], [43.26, 80.26]] },
  { code: "KI", name: "Kiribati", center: [-0.08, -170.84, 5], bounds: [[-4.09, 173.26], [3.93, 205.06]] },
  { code: "KW", name: "Kuwait", center: [29.32, 47.48, 8], bounds: [[28.53, 46.53], [30.1, 48.43]] },
  { code: "XK", name: "Kosovo", center: [42.6, 20.9, 8], bounds: [[41.8, 20.0], [43.3, 21.9]] },
  { code: "HR", name: "Croatia", center: [45.1, 16.4, 7], bounds: [[42.3, 13.3], [46.6, 19.5]] },
  { code: "LA", name: "Laos", center: [18.21, 103.88, 6], bounds: [[13.92, 100.1], [22.5, 107.66]] },
  { code: "LS", name: "Lesotho", center: [-29.61, 28.22, 8], bounds: [[-30.66, 27], [-28.57, 29.44]] },
  { code: "LV", name: "Latvia", center: [56.9, 24.6, 7], bounds: [[55.6, 20.8], [58.1, 28.3]] },
  { code: "LB", name: "Lebanon", center: [33.87, 35.85, 8], bounds: [[33.06, 35.1], [34.69, 36.6]] },
  { code: "LR", name: "Liberia", center: [6.46, -9.43, 7], bounds: [[4.35, -11.48], [8.57, -7.38]] },
  { code: "LY", name: "Libya", center: [26.34, 17.22, 5], bounds: [[19.5, 9.29], [33.18, 25.16]] },
  { code: "LI", name: "Liechtenstein", center: [47.15, 9.55, 10], bounds: [[47.0, 9.45], [47.3, 9.65]] },
  { code: "LT", name: "Lithuania", center: [55.2, 23.9, 7], bounds: [[53.9, 20.9], [56.5, 26.9]] },
  { code: "LU", name: "Luxembourg", center: [49.8, 6.1, 9], bounds: [[49.4, 5.7], [50.25, 6.6]] },
  { code: "MO", name: "Macao SAR China", center: [22.16, 113.55, 12], bounds: [[22.11, 113.52], [22.22, 113.59]] },
  { code: "MG", name: "Madagascar", center: [-18.77, 46.86, 5], bounds: [[-25.6, 43.22], [-11.94, 50.5]] },
  { code: "MW", name: "Malawi", center: [-13.26, 34.28, 6], bounds: [[-17.14, 32.66], [-9.38, 35.9]] },
  { code: "MV", name: "Maldives", center: [3.14, 73.29, 6], bounds: [[-0.64, 72.94], [6.92, 73.64]] },
  { code: "MY", name: "Malaysia", center: [3.94, 109.7, 5], bounds: [[0.85, 100.13], [7.03, 119.28]] },
  { code: "ML", name: "Mali", center: [17.57, -4.01, 5], bounds: [[10.14, -12.26], [25, 4.24]] },
  { code: "MT", name: "Malta", center: [35.9, 14.4, 10], bounds: [[35.75, 14.15], [36.1, 14.6]] },
  { code: "MA", name: "Morocco", center: [28.67, -9.02, 5], bounds: [[21.42, -17.01], [35.93, -1.03]] },
  { code: "MH", name: "Marshall Islands", center: [7.87, 169.43, 6], bounds: [[4.57, 166.84], [11.17, 172.03]] },
  { code: "MR", name: "Mauritania", center: [21.01, -10.95, 5], bounds: [[14.73, -17.08], [27.29, -4.82]] },
  { code: "MU", name: "Mauritius", center: [-20.09, 60.4, 7], bounds: [[-20.52, 57.3], [-19.67, 63.49]] },
  { code: "MX", name: "Mexico", center: [23.63, -101.93, 5], bounds: [[14.55, -117.13], [32.71, -86.74]] },
  { code: "FM", name: "Micronesia", center: [7.43, 150.56, 5], bounds: [[5.27, 138.06], [9.59, 163.05]] },
  { code: "MD", name: "Moldova", center: [47.2, 28.5, 7], bounds: [[45.4, 26.6], [48.5, 30.2]] },
  { code: "MC", name: "Monaco", center: [43.73, 7.42, 12], bounds: [[43.7, 7.38], [43.75, 7.45]] },
  { code: "MN", name: "Mongolia", center: [46.86, 103.82, 4], bounds: [[41.59, 87.74], [52.13, 119.91]] },
  { code: "ME", name: "Montenegro", center: [42.8, 19.2, 8], bounds: [[41.8, 18.4], [43.6, 20.4]] },
  { code: "MS", name: "Montserrat", center: [16.75, -62.19, 12], bounds: [[16.68, -62.23], [16.82, -62.14]] },
  { code: "MZ", name: "Mozambique", center: [-18.66, 35.53, 5], bounds: [[-26.86, 30.21], [-10.47, 40.85]] },
  { code: "MM", name: "Myanmar (Burma)", center: [19.26, 96.67, 5], bounds: [[9.99, 92.17], [28.54, 101.17]] },
  { code: "NA", name: "Namibia", center: [-22.96, 18.49, 5], bounds: [[-28.96, 11.72], [-16.95, 25.26]] },
  { code: "NR", name: "Nauru", center: [-0.52, 166.93, 13], bounds: [[-0.55, 166.91], [-0.49, 166.96]] },
  { code: "NL", name: "Netherlands", center: [52.2, 5.4, 7], bounds: [[50.7, 3.2], [53.7, 7.3]] },
  { code: "NP", name: "Nepal", center: [28.38, 84.1, 6], bounds: [[26.34, 80.03], [30.42, 88.17]] },
  { code: "NI", name: "Nicaragua", center: [12.87, -85.41, 7], bounds: [[10.71, -87.69], [15.03, -83.13]] },
  { code: "NC", name: "New Caledonia", center: [-21.24, 165.73, 8], bounds: [[-22.4, 163.99], [-20.08, 167.46]] },
  { code: "NZ", name: "New Zealand", center: [-40.54, 172.52, 5], bounds: [[-46.68, 166.47], [-34.4, 178.57]] },
  { code: "NE", name: "Niger", center: [17.61, 8.06, 5], bounds: [[11.7, 0.15], [23.52, 15.97]] },
  { code: "NG", name: "Nigeria", center: [9.08, 8.67, 6], bounds: [[4.27, 2.67], [13.88, 14.67]] },
  { code: "NU", name: "Niue", center: [-19.05, -169.87, 11], bounds: [[-19.14, -169.95], [-18.96, -169.78]] },
  { code: "KP", name: "North Korea", center: [40.34, 127.51, 7], bounds: [[37.68, 124.32], [43.01, 130.7]] },
  { code: "MK", name: "North Macedonia", center: [41.6, 21.7, 8], bounds: [[40.8, 20.4], [42.4, 23.1]] },
  { code: "MP", name: "Northern Mariana Islands", center: [17.33, 145.39, 6], bounds: [[14.11, 144.9], [20.56, 145.87]] },
  { code: "NO", name: "Norway", center: [62.2, 9.2, 5], bounds: [[57.8, 4.0], [71.4, 31.2]] },
  { code: "NF", name: "Norfolk Island", center: [-29.04, 167.95, 13], bounds: [[-29.08, 167.91], [-29, 168]] },
  { code: "UG", name: "Uganda", center: [1.37, 32.28, 6], bounds: [[-1.48, 29.55], [4.22, 35.01]] },
  { code: "UA", name: "Ukraine", center: [49.0, 31.4, 6], bounds: [[44.0, 22.1], [52.4, 40.2]] },
  { code: "UZ", name: "Uzbekistan", center: [41.37, 64.56, 5], bounds: [[37.19, 55.98], [45.56, 73.15]] },
  { code: "OM", name: "Oman", center: [20.81, 55.91, 6], bounds: [[16.64, 51.98], [24.98, 59.84]] },
  { code: "TL", name: "Timor-Leste", center: [-8.91, 125.67, 8], bounds: [[-9.5, 124.03], [-8.31, 127.31]] },
  { code: "AT", name: "Austria", center: [47.6, 14.1, 7], bounds: [[46.35, 9.5], [49.1, 17.2]] },
  { code: "PK", name: "Pakistan", center: [30.37, 68.95, 5], bounds: [[23.69, 60.84], [37.05, 77.05]] },
  { code: "PW", name: "Palau", center: [5.38, 132.9, 7], bounds: [[3.02, 131.13], [7.73, 134.66]] },
  { code: "PS", name: "Palestinian Territories", center: [31.88, 34.89, 9], bounds: [[31.21, 34.2], [32.54, 35.57]] },
  { code: "PA", name: "Panama", center: [8.42, -80.11, 7], bounds: [[7.21, -83.05], [9.63, -77.16]] },
  { code: "PG", name: "Papua New Guinea", center: [-6.65, 146.63, 6], bounds: [[-10.7, 140.85], [-2.59, 152.42]] },
  { code: "PY", name: "Paraguay", center: [-23.44, -58.45, 6], bounds: [[-27.59, -62.65], [-19.29, -54.25]] },
  { code: "PE", name: "Peru", center: [-9.18, -75.01, 5], bounds: [[-18.34, -81.34], [-0.03, -68.68]] },
  { code: "PN", name: "Pitcairn Islands", center: [-24.7, -129.21, 9], bounds: [[-25.08, -130.12], [-24.32, -128.29]] },
  { code: "PL", name: "Poland", center: [52.1, 19.4, 6], bounds: [[49.0, 14.1], [54.9, 24.2]] },
  { code: "PT", name: "Portugal", center: [39.6, -8.0, 7], bounds: [[36.9, -9.6], [42.2, -6.0]] },
  { code: "PR", name: "Puerto Rico", center: [18.22, -66.43, 9], bounds: [[17.92, -67.27], [18.52, -65.59]] },
  { code: "QA", name: "Qatar", center: [25.36, 51.18, 8], bounds: [[24.56, 50.75], [26.16, 51.62]] },
  { code: "RO", name: "Romania", center: [45.9, 24.9, 7], bounds: [[43.6, 20.2], [48.3, 29.7]] },
  { code: "RU", name: "Russia", center: [59.47, 103.66, 2], bounds: [[41.19, 27.33], [77.74, 180]] },
  { code: "RW", name: "Rwanda", center: [-1.94, 29.87, 8], bounds: [[-2.83, 28.86], [-1.06, 30.89]] },
  { code: "KN", name: "St. Kitts & Nevis", center: [17.26, -62.7, 11], bounds: [[17.1, -62.86], [17.42, -62.54]] },
  { code: "LC", name: "St. Lucia", center: [13.91, -60.98, 10], bounds: [[13.71, -61.08], [14.11, -60.88]] },
  { code: "VC", name: "St. Vincent & Grenadines", center: [13.18, -61.2, 10], bounds: [[12.97, -61.28], [13.38, -61.12]] },
  { code: "BL", name: "St. Barthélemy", center: [17.91, -62.83, 13], bounds: [[17.88, -62.87], [17.93, -62.79]] },
  { code: "MF", name: "St. Martin", center: [18.08, -63.08, 12], bounds: [[18.03, -63.15], [18.12, -63.01]] },
  { code: "PM", name: "St. Pierre & Miquelon", center: [46.95, -56.27, 10], bounds: [[46.75, -56.4], [47.14, -56.14]] },
  { code: "SB", name: "Solomon Islands", center: [-9.22, 161.3, 6], bounds: [[-11.85, 156.45], [-6.6, 166.15]] },
  { code: "WS", name: "Samoa", center: [-13.76, -172.11, 9], bounds: [[-14.05, -172.78], [-13.46, -171.44]] },
  { code: "SM", name: "San Marino", center: [43.94, 12.46, 11], bounds: [[43.88, 12.38], [44.0, 12.52]] },
  { code: "ST", name: "São Tomé & Príncipe", center: [0.86, 6.96, 8], bounds: [[0.02, 6.46], [1.7, 7.46]] },
  { code: "SA", name: "Saudi Arabia", center: [24.25, 45.11, 5], bounds: [[16.37, 34.57], [32.12, 55.64]] },
  { code: "SN", name: "Senegal", center: [14.5, -14.46, 7], bounds: [[12.31, -17.54], [16.69, -11.38]] },
  { code: "RS", name: "Serbia", center: [44.0, 20.8, 7], bounds: [[42.2, 18.8], [46.2, 23.1]] },
  { code: "SC", name: "Seychelles", center: [-6.87, 51.25, 6], bounds: [[-9.45, 46.21], [-4.29, 56.29]] },
  { code: "SL", name: "Sierra Leone", center: [8.46, -11.79, 7], bounds: [[6.92, -13.3], [10, -10.28]] },
  { code: "SG", name: "Singapore", center: [1.36, 103.82, 11], bounds: [[1.26, 103.64], [1.45, 104]] },
  { code: "SH", name: "St. Helena", center: [-24.14, -10.03, 4], bounds: [[-40.4, -14.42], [-7.88, -5.65]] },
  { code: "SX", name: "Sint Maarten", center: [18.04, -63.07, 13], bounds: [[18.02, -63.12], [18.06, -63.02]] },
  { code: "SI", name: "Slovenia", center: [46.1, 14.9, 8], bounds: [[45.4, 13.3], [46.9, 16.7]] },
  { code: "SK", name: "Slovakia", center: [48.7, 19.5, 7], bounds: [[47.7, 16.8], [49.7, 22.6]] },
  { code: "SD", name: "Sudan", center: [15.45, 30.21, 5], bounds: [[8.68, 21.81], [22.23, 38.6]] },
  { code: "SO", name: "Somalia", center: [5.15, 46.19, 5], bounds: [[-1.7, 40.97], [11.99, 51.42]] },
  { code: "ES", name: "Spain", center: [40.3, -3.7, 6], bounds: [[36.0, -9.4], [43.9, 4.4]] },
  { code: "LK", name: "Sri Lanka", center: [7.88, 80.79, 7], bounds: [[5.92, 79.7], [9.83, 81.89]] },
  { code: "SR", name: "Suriname", center: [3.92, -56.03, 7], bounds: [[1.83, -58.07], [6.01, -53.99]] },
  { code: "SY", name: "Syria", center: [34.82, 39.05, 7], bounds: [[32.31, 35.72], [37.32, 42.38]] },
  { code: "TJ", name: "Tajikistan", center: [38.86, 71.25, 7], bounds: [[36.68, 67.34], [41.04, 75.16]] },
  { code: "TW", name: "Taiwan", center: [23.6, 121.03, 7], bounds: [[21.9, 120.05], [25.29, 122.01]] },
  { code: "TZ", name: "Tanzania", center: [-6.36, 34.89, 6], bounds: [[-11.73, 29.32], [-0.99, 40.45]] },
  { code: "TH", name: "Thailand", center: [13.04, 101.5, 5], bounds: [[5.63, 97.35], [20.45, 105.65]] },
  { code: "TG", name: "Togo", center: [8.62, 0.81, 7], bounds: [[6.1, -0.17], [11.13, 1.78]] },
  { code: "TO", name: "Tonga", center: [-18.51, -174.8, 6], bounds: [[-21.45, -175.69], [-15.56, -173.91]] },
  { code: "TT", name: "Trinidad & Tobago", center: [10.7, -61.23, 9], bounds: [[10.04, -61.93], [11.35, -60.52]] },
  { code: "TD", name: "Chad", center: [15.45, 18.72, 5], bounds: [[7.46, 13.45], [23.44, 23.98]] },
  { code: "CZ", name: "Czechia", center: [49.8, 15.5, 7], bounds: [[48.5, 12.0], [51.1, 18.9]] },
  { code: "TN", name: "Tunisia", center: [33.79, 9.52, 6], bounds: [[30.23, 7.48], [37.35, 11.56]] },
  { code: "TR", name: "Türkiye", center: [39.0, 35.2, 5], bounds: [[35.8, 25.6], [42.2, 44.8]] },
  { code: "TM", name: "Turkmenistan", center: [38.97, 59.54, 6], bounds: [[35.14, 52.44], [42.79, 66.65]] },
  { code: "TC", name: "Turks & Caicos Islands", center: [21.7, -71.81, 9], bounds: [[21.43, -72.48], [21.96, -71.13]] },
  { code: "TV", name: "Tuvalu", center: [-7.55, 178.02, 7], bounds: [[-9.42, 176.13], [-5.68, 179.91]] },
  { code: "UY", name: "Uruguay", center: [-32.54, -55.78, 7], bounds: [[-34.97, -58.44], [-30.1, -53.11]] },
  { code: "VU", name: "Vanuatu", center: [-16.68, 168.01, 6], bounds: [[-19.66, 166.52], [-13.71, 169.5]] },
  { code: "VA", name: "Vatican City", center: [41.9, 12.45, 13], bounds: [[41.89, 12.44], [41.91, 12.46]] },
  { code: "VE", name: "Venezuela", center: [6.42, -66.6, 5], bounds: [[0.65, -73.39], [12.2, -59.82]] },
  { code: "GB", name: "United Kingdom", center: [54.5, -3.2, 6], bounds: [[49.8, -8.7], [60.9, 1.9]] },
  { code: "AE", name: "United Arab Emirates", center: [24.35, 53.98, 7], bounds: [[22.62, 51.57], [26.07, 56.38]] },
  { code: "US", name: "United States", center: [48.27, -117.56, 3], bounds: [[25.12, -168.14], [71.41, -66.98]] },
  { code: "VN", name: "Vietnam", center: [15.97, 105.8, 5], bounds: [[8.57, 102.12], [23.37, 109.47]] },
  { code: "WF", name: "Wallis & Futuna", center: [-13.76, -177.16, 8], bounds: [[-14.32, -178.19], [-13.21, -176.13]] },
  { code: "EH", name: "Western Sahara", center: [24.21, -12.89, 6], bounds: [[20.77, -17.1], [27.66, -8.68]] },
  { code: "ZM", name: "Zambia", center: [-13.13, 27.83, 6], bounds: [[-18.07, 21.98], [-8.19, 33.67]] },
  { code: "ZW", name: "Zimbabwe", center: [-19.01, 29.13, 6], bounds: [[-22.4, 25.22], [-15.61, 33.04]] },
  { code: "ZA", name: "South Africa", center: [-28.47, 24.68, 5], bounds: [[-34.82, 16.47], [-22.13, 32.89]] },
  { code: "KR", name: "South Korea", center: [36.46, 127.86, 7], bounds: [[34.29, 126.13], [38.62, 129.59]] },
  { code: "SS", name: "South Sudan", center: [7.85, 30.02, 6], bounds: [[3.49, 24.12], [12.22, 35.92]] },
  { code: "SE", name: "Sweden", center: [61.0, 15.2, 5], bounds: [[55.0, 10.6], [69.2, 24.3]] },
  { code: "CH", name: "Switzerland", center: [46.8, 8.2, 7], bounds: [[45.75, 5.75], [47.85, 10.65]] },
];

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
let countrySelectionMode = "auto";
let countryListExpanded = false;
let manualCountryCodes = new Set();

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
  if (countrySelectionMode === "auto") return new Set(ALL_COUNTRY_CODES);
  return new Set(orderedCountryCodes([...manualCountryCodes]).filter((code) => ALL_COUNTRY_CODES.includes(code)));
}

function syncCountryInputs() {
  const selected = selectedCountryCodes();
  document.querySelectorAll("[data-country]").forEach((input) => {
    input.checked = selected.has(input.dataset.country);
  });
}

function renderCountryFilter() {
  const grid = document.querySelector("#country-toggle-grid");
  if (!grid) return;
  grid.innerHTML = FILTER_COUNTRIES.map((country) => `
    <label class="country-chip" title="${escapeHtml(countryNames[country.code] || country.name)}">
      <input type="checkbox" data-country="${escapeHtml(country.code)}" />
      <span>${escapeHtml(country.code)}</span>
    </label>
  `).join("");
  updateCountryFilterControls();
}

function selectedCountryLabel() {
  const selected = [...selectedCountryCodes()];
  if (!selected.length) return t("No countries");
  if (countrySelectionMode === "auto") {
    return t("Map area");
  }
  if (selected.length === ALL_COUNTRY_CODES.length) return t("all countries");
  if (selected.length <= 4) return selected.map((code) => countryNames[code]).join(", ");
  return t("{0} countries", selected.length);
}

function updateCountryFilterControls() {
  const summary = document.querySelector("#country-selection-summary");
  const toggle = document.querySelector("#toggle-country-list");
  const autoButton = document.querySelector("#set-auto-countries");
  const grid = document.querySelector("#country-toggle-grid");
  syncCountryInputs();
  if (summary) {
    summary.textContent = countrySelectionMode === "auto"
      ? t("{0}. Places appear in the visible map area, including across borders.", selectedCountryLabel())
      : selectedCountryLabel();
  }
  if (toggle) {
    toggle.textContent = countryListExpanded ? t("Hide list") : t("Choose countries");
    toggle.setAttribute("aria-expanded", String(countryListExpanded));
  }
  if (autoButton) autoButton.classList.toggle("is-active", countrySelectionMode === "auto");
  if (grid) grid.hidden = !countryListExpanded;
}

function renderCountrySelectionPanel() {
  const selected = [...selectedCountryCodes()];
  renderEmptyPanel(
    countrySelectionMode === "auto" ? t("Explore the map area") : selected.length ? t("Explore {0}", selectedCountryLabel()) : t("No countries selected"),
    selected.length
      ? t("Click on clusters to zoom in. At maximum zoom, the individual source pins appear.")
      : t("Select one or more countries to show places to sleep on the map."),
  );
}

function saveCountrySelection() {
  setUserValue(COUNTRY_FILTER_KEY, JSON.stringify({
    mode: countrySelectionMode,
    countries: [...manualCountryCodes],
  }));
}

function setSelectedCountries(countryCodes, { persist = true, fit = false, announce = true } = {}) {
  const selected = new Set(countryCodes.filter((code) => ALL_COUNTRY_CODES.includes(code)));
  countrySelectionMode = "custom";
  manualCountryCodes = selected;
  updateCountryFilterControls();
  if (persist) saveCountrySelection();
  if (fit) fitSelectedCountries();
  if (announce) renderCountrySelectionPanel();
}

function setAutoCountries({ persist = true, announce = true } = {}) {
  countrySelectionMode = "auto";
  countryListExpanded = false;
  updateCountryFilterControls();
  if (persist) saveCountrySelection();
  if (announce) renderCountrySelectionPanel();
}

function restoreCountrySelection() {
  try {
    const saved = storedJson(COUNTRY_FILTER_KEY);
    if (saved?.mode === "custom" && Array.isArray(saved.countries)) {
      const countryCodes = saved.countries.filter((code) => ALL_COUNTRY_CODES.includes(code));
      if (countryCodes.length) {
        setSelectedCountries(countryCodes, { persist: false, announce: false, fit: false });
        return;
      }
    }
    if (Array.isArray(saved) && saved.some((code) => ALL_COUNTRY_CODES.includes(code)) && saved.length !== ALL_COUNTRY_CODES.length) {
      setSelectedCountries(saved, { persist: false, announce: false, fit: false });
      return;
    }
    setAutoCountries({ persist: false, announce: false });
  } catch (error) {
    console.warn(t("Country selection could not be restored."), error);
    setAutoCountries({ persist: false, announce: false });
  }
}

function fitSelectedCountries() {
  const selected = [...selectedCountryCodes()];
  if (!selected.length) return;
  if (selected.length === 1 && COUNTRY_CENTERS[selected[0]]) {
    const [lat, lng, zoom] = COUNTRY_CENTERS[selected[0]];
    navigateMapTo([lat, lng], zoom);
    return;
  }
  const points = selected.flatMap((code) => COUNTRY_BOUNDS[code] || []);
  if (points.length) map.fitBounds(L.latLngBounds(points), { padding: [48, 48], maxZoom: 6 });
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
  const distance = Number(document.querySelector("#route-distance").value);
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
    countries: countrySelectionMode === "auto" ? null : [...filters.countries].sort(),
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
    button.className = "button button-quiet";
    button.textContent = mapPointPlace(point).name;
    button.onclick = () => renderPlace(mapPointPlace(point));
    list.append(button);
    resolveMapPlace(point).then((place) => { button.textContent = place.name; }).catch(() => {});
  });
  if ((page + 1) * 20 < points.length) {
    const next = document.createElement("button");
    next.className = "button button-quiet";
    next.textContent = t("Next places");
    next.onclick = () => showCoincidentPlaces(points, page + 1);
    list.append(next);
  }
  panel.append(list);
  panel.classList.add("is-open");
  panel.setAttribute("aria-hidden", "false");
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
    decision: t("Source listed; check locally"),
    description: t("Shelter or hut; check source and local rules"),
    stay: t("Check with source"), cost: t("Not listed"), water: t("Not listed"),
    extraFacts: [[t("Capacity"), item.capacity], [t("Coordinate"), `${item.lat.toFixed(5)}, ${item.lng.toFixed(5)}`], [t("Source"), "Refuges.info contributors · CC BY-SA 2.0"]],
    licenseUrl: "https://creativecommons.org/licenses/by-sa/2.0/",
    attribution: "Refuges.info contributors", licenseLabel: "CC BY-SA 2.0",
    caution: t("Check the official source before departure."),
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
    name: sourcePlace.name || t("CampWild {0}", typeLabel),
    lat: sourcePlace.lat,
    lng: sourcePlace.lng,
    location: t("{0} · CampWild", countryNames[sourcePlace.country] || t("Europe")),
    type: placeType,
    confidence: 2,
    sourceLabel: "CampWild",
    sourceUrl: sourcePlace.sourceUrl || "https://map.campwild.org/",
    sourceAction: t("Open in CampWild"),
    decision: t("Public CampWild Map Pin."),
    description: t("Shelter, lean-to, bivouac spot or hut from the public CampWild map layer. Open the source for photos, comments and any check-ins."),
    stay: placeType === "designated" ? t("Bivouac area; check source and local rules") : t("Shelter or hut; check source and local rules"),
    cost: t("Not listed"),
    water: t("Not listed"),
    extraFacts: [
      [t("Type"), typeLabel],
      [t("CampWild ID"), String(sourcePlace.id)],
    ],
    caution: t("CampWild is community data. Check the source page, local rules, signs and current condition before planning a stay."),
  };
}

function renderCountries() {
  document.querySelector("#country-grid").innerHTML = countries.map((country) => `
    <article class="country-card">
      <div class="country-topline">
        <span class="country-flag" aria-hidden="true">${country.flag}</span>
        <span class="status-pill ${country.statusClass}">${escapeHtml(country.status)}</span>
      </div>
      <h3>${escapeHtml(country.name)}</h3>
      <p class="country-summary">${escapeHtml(country.summary)}</p>
      <ul class="country-rules">${country.rules.map((rule) => `<li>${escapeHtml(rule)}</li>`).join("")}</ul>
      <a class="country-source" href="${escapeHtml(country.url)}" target="_blank" rel="noreferrer">${escapeHtml(country.source)} ↗</a>
    </article>
  `).join("");
}

function renderSources() {
  document.querySelector("#source-grid").innerHTML = sources.map((source) => `
    <a class="source-card" href="${escapeHtml(source.url)}" target="_blank" rel="noreferrer">
      <span class="source-icon">${escapeHtml(source.icon)}</span>
      <h3>${escapeHtml(source.name)}</h3>
      <p>${escapeHtml(source.description)}</p>
      <span class="source-meta"><span>${escapeHtml(source.meta)}</span><span>↗</span></span>
    </a>
  `).join("");
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
    routeFilterActive: document.querySelector("#route-filter-active").checked,
  };
}

function saveFilterPreferences() {
  setUserValue(FILTER_PREFERENCES_KEY, JSON.stringify(filterPreferenceState()));
}

function restoreFilterPreferences() {
  const preferences = storedJson(FILTER_PREFERENCES_KEY);
  if (!preferences || typeof preferences !== "object") return;
  if (typeof preferences.routeFilterActive === "boolean") {
    document.querySelector("#route-filter-active").checked = preferences.routeFilterActive;
  }
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
      : t("Always check the official campsite website, opening hours and whether tents are welcome. OpenStreetMap may be outdated or incomplete.");
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
      description: t("Campsite or motorhome site from OpenStreetMap. Nook shows these with the same clustering and filters as other places."),
      stay: t("According to camping conditions"),
      cost: sourcePlace.fee === "no" ? t("Marked as free") : sourcePlace.fee === "yes" ? t("Paid; check rate") : t("Not listed"),
      water: sourcePlace.drinkingWater === "yes" ? t("Drinking water marked") : sourcePlace.waterPoint === "yes" ? t("Water point marked") : t("Not listed"),
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
  const distanceKm = Number(document.querySelector("#route-distance").value);
  document.querySelector("#route-distance-output").textContent = t("{0} km", distanceKm);
  document.querySelectorAll("[data-route-distance]").forEach((button) => {
    button.classList.toggle("is-active", Number(button.dataset.routeDistance) === distanceKm);
  });

  if (!routeState.segments.length) {
    if (savedRoutes.length && importedWaypoints.length) {
      status.textContent = t("{0} GPX waypoints visible. Select a route with track for the distance filter.", importedWaypoints.length.toLocaleString(NookI18n.locale));
    } else if (savedRoutes.length) {
      status.textContent = t("No active GPX track. Check a route to filter places along the route.");
    } else {
      status.textContent = t("Import a GPX track from, for example, Komoot, EuroVelo or cycle.travel.");
    }
    return;
  }

  const visibleTotal = Object.values(visiblePlaceCounts).reduce((total, count) => total + count, 0);
  const routeLength = Math.round(routeState.lengthKm).toLocaleString(NookI18n.locale);
  const savedLabel = routesPersisted ? t(" GPX list saved locally.") : t(" GPX list no longer fits in browser storage.");
  status.textContent = routeFilterEnabled()
    ? t("{0} spots within {1} km of {2} ({3} km).{4}", visibleTotal.toLocaleString(NookI18n.locale), distanceKm, routeState.name, routeLength, savedLabel)
    : t("{0} ({1} km) is on the map; the distance filter is disabled.{2}", routeState.name, routeLength, savedLabel);
}

function refreshMapPlaces() {
  requestMapSources(currentFilters());
  updateRouteStatus();
  updateCountryFilterControls();
  updateFilterSummary();
}

function setRouteControls(hasActiveTrack, hasSavedRoutes = hasActiveTrack) {
  document.querySelector("#route-distance").disabled = !hasActiveTrack;
  document.querySelector("#route-filter-active").disabled = !hasActiveTrack;
  document.querySelector("#clear-route").disabled = !hasSavedRoutes;
  document.querySelectorAll("[data-route-distance]").forEach((button) => {
    button.disabled = !hasActiveTrack;
  });
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
  const count = document.querySelector("#route-library-count");
  if (!savedRoutes.length) {
    library.hidden = true;
    list.innerHTML = "";
    count.textContent = t("0 routes");
    return;
  }

  library.hidden = false;
  const activeCount = savedRoutes.filter((route) => route.enabled).length;
  count.textContent = t("{0}/{1} active", activeCount, savedRoutes.length);
  list.innerHTML = savedRoutes.map((route) => {
    const lengthLabel = route.lengthKm ? t("{0} km", Math.round(route.lengthKm).toLocaleString(NookI18n.locale)) : t("waypoints");
    const pointLabel = route.pointCount ? t("{0} points", route.pointCount.toLocaleString(NookI18n.locale)) : t("{0} waypoints", route.waypoints.length.toLocaleString(NookI18n.locale));
    const sizeLabel = formatFileSize(route.originalSize);
    const meta = [lengthLabel, pointLabel, sizeLabel].filter(Boolean).join(" · ");
    return `
      <div class="route-list-item">
        <label>
          <input type="checkbox" data-route-toggle="${escapeHtml(route.id)}" ${route.enabled ? "checked" : ""} />
          <span>
            <strong>${escapeHtml(route.name)}</strong>
            <small>${escapeHtml(meta)}</small>
          </span>
        </label>
        <button type="button" data-route-remove="${escapeHtml(route.id)}" aria-label="${th("Remove {0}", escapeHtml(route.name))}">×</button>
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
      if (rawLines.length) document.querySelector("#route-filter-active").checked = true;
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

document.querySelector("#country-filter").addEventListener("change", (event) => {
  if (!event.target.matches("[data-country]")) return;
  const checkedCountries = [...document.querySelectorAll("[data-country]:checked")].map((input) => input.dataset.country);
  setSelectedCountries(checkedCountries, { persist: true, fit: false, announce: false });
  refreshMapPlaces();
  renderCountrySelectionPanel();
});
document.querySelector("#set-auto-countries").addEventListener("click", () => {
  setAutoCountries();
  refreshMapPlaces();
});
document.querySelector("#toggle-country-list").addEventListener("click", () => {
  countryListExpanded = !countryListExpanded;
  updateCountryFilterControls();
});
document.querySelector("#clear-countries").addEventListener("click", () => {
  setSelectedCountries([], { fit: false });
  refreshMapPlaces();
});

document.querySelector("#gpx-file").addEventListener("change", (event) => {
  const [file] = event.target.files;
  if (file) importGpx(file);
  event.target.value = "";
});
document.querySelector("#choose-gpx").addEventListener("click", () => document.querySelector("#gpx-file").click());
document.querySelector("#undo-route-removal").addEventListener("click", undoRouteRemoval);
document.querySelector("#open-my-route").addEventListener("click", openRouteImportPanelFromLink);
document.querySelector("#route-distance").addEventListener("input", updateRouteStatus);
document.querySelector("#route-distance").addEventListener("change", (event) => {
  setUserValue(ROUTE_DISTANCE_KEY, event.target.value);
  refreshMapPlaces();
});
document.querySelectorAll("[data-route-distance]").forEach((button) => {
  button.addEventListener("click", () => {
    const distance = button.dataset.routeDistance;
    document.querySelector("#route-distance").value = distance;
    setUserValue(ROUTE_DISTANCE_KEY, distance);
    refreshMapPlaces();
  });
});
document.querySelector("#route-filter-active").addEventListener("change", () => {
  saveFilterPreferences();
  refreshMapPlaces();
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
document.querySelector("#show-filtered-map").addEventListener("click", () => setFiltersOpen(false));
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

renderCountryFilter();
const savedRouteDistance = Number(getUserValue(ROUTE_DISTANCE_KEY));
if (savedRouteDistance >= 1 && savedRouteDistance <= 50) {
  document.querySelector("#route-distance").value = savedRouteDistance;
}

restoreCountrySelection();
restoreFilterPreferences();
restoreRoute();
refreshMapPlaces();
function openRouteImportPanelFromLink() {
  const sidebar = document.querySelector("#map-sidebar");
  sidebar.classList.add("no-transition");
  setFiltersOpen(true);
  const routeImport = document.querySelector("#route-import");
  routeImport.classList.add("is-highlighted");
  const positionRouteImport = () => {
    document.querySelector("#choose-gpx").focus({ preventScroll: true });
    document.querySelector(".filter-content").scrollTop = Math.max(0, routeImport.offsetTop - 12);
  };
  history.replaceState(null, "", window.location.pathname);
  positionRouteImport();
  requestAnimationFrame(positionRouteImport);
  window.setTimeout(() => sidebar.classList.remove("no-transition"), 350);
  window.setTimeout(() => routeImport.classList.remove("is-highlighted"), 2200);
}

const wantsRouteImport = new URLSearchParams(window.location.search).get("route") === "import" || window.location.hash === "#route-import";
if (wantsRouteImport) openRouteImportPanelFromLink();
window.addEventListener("hashchange", () => {
  if (window.location.hash === "#route-import") openRouteImportPanelFromLink();
});
if (document.querySelector("#country-grid")) renderCountries();
if (document.querySelector("#source-grid")) renderSources();

window.addEventListener("load", () => {
  window.setTimeout(() => map.invalidateSize(), 120);
});
