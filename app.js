const sleepTypes = {
  wild: { label: "Vrij kamperen", icon: "△" },
  designated: { label: "Aangewezen gratis plek", icon: "⌂" },
  hut: { label: "Hut of shelter", icon: "▰" },
  host: { label: "Gastnetwerk", icon: "♥" },
  ask: { label: "Toestemming vragen", icon: "?" },
  camping: { label: "Camping", icon: "C" },
};

const countries = [
  {
    code: "NL",
    flag: "🇳🇱",
    name: "Nederland",
    status: "Streng",
    statusClass: "status-strict",
    summary: "Vrij je tent neerzetten is geen legale basisstrategie. Richt je op toestemming, gastnetwerken en erkende terreinen.",
    rules: ["Staatsbosbeheer stopte in 2020 met zijn paalkampeerterreinen", "Privéterrein kan met expliciete toestemming", "Lokale APV en terreinregels kunnen aanvullend gelden"],
    source: "Staatsbosbeheer: einde paalkamperen",
    url: "https://www.staatsbosbeheer.nl/wat-we-doen/nieuws/2020/05/sluiten-paalkampeerterreinen",
  },
  {
    code: "DE",
    flag: "🇩🇪",
    name: "Duitsland",
    status: "Per deelstaat",
    statusClass: "status-mixed",
    summary: "Geen simpel landelijk ja of nee. De veiligste gratis route is toestemming; daarnaast bestaan trekkingplaatsen en regionale uitzonderingen.",
    rules: ["Beschermde gebieden zijn een harde nee", "Brandenburg, Mecklenburg-Vorpommern en Schleswig-Holstein kennen beperkte uitzonderingen", "Controleer deelstaat én grondeigendom"],
    source: "Bundesnaturschutzgesetz",
    url: "https://www.gesetze-im-internet.de/bnatschg_2009/__59.html",
  },
  {
    code: "DK",
    flag: "🇩🇰",
    name: "Denemarken",
    status: "Aangewezen vrij",
    statusClass: "status-good",
    summary: "Niet overal wildkamperen, maar wel een sterk officieel netwerk van bossen met fri teltning, shelters en primitieve plekken.",
    rules: ["Alleen bossen op de officiële fri teltning-kaart", "Eén nacht, maximaal twee kleine tenten", "Gebruik vuur alleen waar en wanneer toegestaan"],
    source: "Danish Nature Agency",
    url: "https://eng.naturstyrelsen.dk/experience-nature/sleeping-outside-in-nature",
  },
  {
    code: "SE",
    flag: "🇸🇪",
    name: "Zweden",
    status: "Ruim, met zorg",
    statusClass: "status-good",
    summary: "Het allemansrätten maakt één of twee nachten mogelijk op geschikte grond, zolang je niet stoort of beschadigt.",
    rules: ["Gewoonlijk één of twee nachten", "Niet bij woningen, op akkers of kwetsbare grond", "Reservaten en vuurverboden kunnen strengere regels hebben"],
    source: "Naturvårdsverket",
    url: "https://www.naturvardsverket.se/en/topics/the-right-of-public-access/activities-and-places/camping--tents/",
  },
  {
    code: "NO",
    flag: "🇳🇴",
    name: "Noorwegen",
    status: "Ruim, wettelijk",
    statusClass: "status-good",
    summary: "Het allemansretten staat tenten toe op utmark, met duidelijke afstands- en verblijfsregels en plaatselijke uitzonderingen.",
    rules: ["Minstens 150 meter van bewoonde huizen en hutten", "Maximaal twee nachten, behalve in afgelegen bergen", "Lokale verboden en de vuurperiode 15 april–15 september blijven leidend"],
    source: "Norwegian Environment Agency",
    url: "https://www.environmentagency.no/areas-of-activity/right-to-roam/camping/",
  },
  {
    code: "BE",
    flag: "🇧🇪",
    name: "België",
    status: "Alleen aangewezen",
    statusClass: "status-mixed",
    summary: "Geen algemeen recht op wildkamperen. Gebruik bivakzones, officiële terreinen, gasttuinen of expliciete toestemming.",
    rules: ["Natuur-en-Bos-bivakzones reserveer je vooraf en gratis", "Wallonië en andere beheerders hanteren eigen capaciteit, tijden en vuurregels", "Natuurreservaat of openbaar bos is niet automatisch een kampeerplek"],
    source: "Natuur en Bos: kamperen",
    url: "https://natuurenbos.be/activiteiten/bivakzone",
  },
  {
    code: "FR",
    flag: "🇫🇷",
    name: "Frankrijk",
    status: "Sterk lokaal",
    statusClass: "status-mixed",
    summary: "Een klein bivak kan lokaal mogelijk zijn, maar toestemming, gemeentelijke verboden en regels van ieder natuurpark bepalen de uitkomst.",
    rules: ["Vraag toestemming op privégrond", "Kusten, beschermde locaties en lokaal verboden zones vallen af", "Parken publiceren eigen tijden, afstanden en bivakzones"],
    source: "Parcs nationaux de France",
    url: "https://www.parcsnationaux.fr/",
  },
  {
    code: "LU",
    flag: "🇱🇺",
    name: "Luxemburg",
    status: "Streng",
    statusClass: "status-strict",
    summary: "Geen allemansrecht: kies een officiële locatie, gastnetwerk of vooraf gegeven toestemming.",
    rules: ["Bos en natuurgebied zijn geen vrije slaapplaatsen", "Gemeenten en terreinbeheerders kunnen aanvullende verboden stellen", "Een gemarkeerde camping of privétoestemming is de veilige route"],
    source: "Visit Luxembourg: campings",
    url: "https://www.visitluxembourg.com/plan-your-stay/stay/camping",
  },
  {
    code: "CH",
    flag: "🇨🇭",
    name: "Zwitserland",
    status: "Lokaal alpien",
    statusClass: "status-mixed",
    summary: "Een discrete nacht boven de boomgrens is vaak mogelijk, maar kantons, gemeenten en beschermde gebieden bepalen de grenzen.",
    rules: ["Niet in reservaten, wildrustgebieden of het Nationaal Park", "Vermijd kwetsbare biotopen, uiterwaarden en drukke hutomgevingen", "Vraag toestemming op privégrond en alpenweiden"],
    source: "Swiss Alpine Club",
    url: "https://www.sac-cas.ch/de/umwelt/bergsport-und-umwelt/campieren-und-biwakieren/",
  },
  {
    code: "AT",
    flag: "🇦🇹",
    name: "Oostenrijk",
    status: "Per deelstaat",
    statusClass: "status-strict",
    summary: "In het bos is kamperen zonder toestemming verboden; daarbuiten verschillen regels sterk per deelstaat, gemeente en beschermd gebied.",
    rules: ["Forstgesetz §33 sluit kamperen en nachtelijk verblijf in bos uit zonder toestemming", "Hoogalpien bivak is per deelstaat geregeld", "Natuur- en landschapsbeschermingsgebieden hebben vaak extra verboden"],
    source: "Oostenrijks Forstgesetz §33",
    url: "https://www.ris.bka.gv.at/NormDokument.wxe?Abfrage=Bundesnormen&Gesetzesnummer=10010371&Paragraf=33",
  },
  {
    code: "IT",
    flag: "🇮🇹",
    name: "Italië",
    status: "Regionaal",
    statusClass: "status-mixed",
    summary: "Er is geen eenvoudige landelijke toestemming. Regio, provincie, gemeente en parkbeheer bepalen of een tijdelijk bivak mag.",
    rules: ["Maak onderscheid tussen kort bivak en meerdaags kamperen", "Parken en gemeenten kunnen beide volledig verbieden", "Onbemande bivacco-hutten hebben eigen gebruiksregels"],
    source: "Club Alpino Italiano",
    url: "https://www.cai.it/",
  },
];

const sources = [
  { icon: "W", name: "Warmshowers", description: "Wereldwijd hospitalitynetwerk met een hostkaart in de mobiele app. Nook heeft nog geen stabiele openbare export om die kaartposities betrouwbaar als eigen laag bij te houden.", meta: "Kaart zichtbaar in officiële app", url: "https://play.google.com/store/apps/details?id=org.warmshowers.app" },
  { icon: "V", name: "Vrienden op de Fiets", description: "De openbare kaartfeed levert losse kaartposities en generieke voorzieningen zonder adresvelden. Nook groepeert nabijgelegen plekken over landsgrenzen heen en toont afzonderlijke bronpins bij inzoomen.", meta: "5.341 pins · 38 Europese landen · 7 juli 2026", url: "https://www.vriendenopdefiets.nl/zoek-een-logeeradres" },
  { icon: "G", name: "Welcome To My Garden", description: "De openbare explore-kaart levert losse tuinposities, basisvoorzieningen en waar aanwezig een tuinfoto. Die worden op de kaart ruimtelijk geclusterd en bij verder inzoomen afzonderlijk getoond.", meta: "5.921 pins · 4.321 foto's · 7 juli 2026", url: "https://welcometomygarden.org/nl/explore" },
  { icon: "U", name: "Ud i Naturen", description: "Officiële Deense kaartdata met concrete vrije tentgebieden, primitieve overnachtingsplekken en shelters, inclusief locatiebeschrijving, capaciteit en boekingsstatus.", meta: "2.480 officiële plekken · 14 juni 2026", url: "https://udinaturen.dk/kort" },
  { icon: "C", name: "OpenStreetMap-campings", description: "Campings en camperterreinen uit OpenStreetMap, opgehaald via de openbare OpenCampingMap-endpoint. Nook toont ze als ruimtelijke clusters en losse kaartpins.", meta: "82.084 pins · 47 landen · 7 juli 2026", url: "https://opencampingmap.org/" },
  { icon: "CW", name: "CampWild", description: "Publieke kaart met shelters, lean-to's, bivakplekken en hutten. Nook neemt alleen duidelijke slaap- en schuiltypes op en laat in Denemarken officiële Ud i Naturen-locaties voorgaan.", meta: "5.944 pins · 92 DK-dubbelen onderdrukt · 7 juli 2026", url: "https://map.campwild.org/" },
  { icon: "F", name: "De Wereldfietser", description: "Forum en vereniging met veel ervaringskennis over routes, materiaal en overnachten onderweg.", meta: "Forum · Nederlands", url: "https://forum.wereldfietser.nl/" },
  { icon: "R", name: "Reddit", description: "Recente ervaringen en lokale tips, nuttig als aanwijzing. Controleer elke claim daarna bij een primaire bron.", meta: "Community · wisselend", url: "https://www.reddit.com/r/bikepacking/search/?q=camping%20sweden%20denmark%20germany" },
];

const publicData = window.NOOK_DATA || {};
const MAP_VIEW_KEY = "nook-map-view-v1";
const savedMapView = storedJson(MAP_VIEW_KEY);
const hasSavedMapView = validMapPoint(savedMapView) && Number.isFinite(savedMapView.zoom) && savedMapView.zoom >= 2 && savedMapView.zoom <= 19;

const BASEMAP_DETAIL_KEY = "nook-light-basemap-v1";
const savedBaseMapDetail = getUserValue(BASEMAP_DETAIL_KEY);
const lightBaseMap = savedBaseMapDetail === null ? window.matchMedia("(pointer: coarse)").matches : savedBaseMapDetail === "true";
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
  // One native tile covers four old tiles: fewer downloads and less fine detail.
  tileSize: lightBaseMap ? 512 : 256,
  zoomOffset: lightBaseMap ? -1 : 0,
  updateWhenIdle: false,
  updateWhenZooming: false,
  updateInterval: 150,
  keepBuffer: 3,
  maxZoom: 19,
  referrerPolicy: "strict-origin-when-cross-origin",
  attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
}).addTo(map);

const routeLayer = L.layerGroup().addTo(map);
const locationLayer = L.layerGroup().addTo(map);
const sourceMapLayer = L.layerGroup().addTo(map);
map.createPane("sourcePins").style.zIndex = 450;
const pinRenderer = new L.NookCanvas({ padding: 0.25, pane: "sourcePins" }).addTo(map);
const pinAccessibility = document.createElement("div");
pinAccessibility.className = "visually-hidden";
pinAccessibility.setAttribute("role", "group");
pinAccessibility.setAttribute("aria-label", "Plekken op de kaart");
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
const visiblePlaceCounts = { hospitality: 0, denmark: 0, campwild: 0, camping: 0, imported: 0 };
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

function renderEmptyPanel(title = "Kies een plek", message = "Klik op een marker voor regels, bron en praktische aandachtspunten.") {
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
  close.setAttribute("aria-label", "Locatie-informatie sluiten");
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
    showPlaceMessage("Plek laden…", "De brongegevens worden opgehaald.");
    const sequence = ++placeDetailSequence;
    resolveMapPlace(place.mapPoint).then((details) => {
      if (sequence === placeDetailSequence) renderPlace(details);
    }).catch(() => {
      if (sequence === placeDetailSequence) showPlaceMessage("Plek kon niet laden", "Controleer je verbinding en tik de plek opnieuw aan.");
    });
    return;
  }
  placeDetailSequence++;
  closeCandidatePanel();
  const panel = document.querySelector("#place-panel");
  const certainty = place.confidence === 3 ? "Officiële bron" : place.confidence === 2 ? "Bron aanwezig, controleer lokaal" : "Community-aanwijzing";
  const extraFacts = place.extraFacts || [];
  const hasCoordinates = !place.approximate && Number.isFinite(place.lat) && Number.isFinite(place.lng);
  const coordinates = hasCoordinates ? `${place.lat},${place.lng}` : "";
  const mapLabel = encodeURIComponent(place.name || "Slaapplek");
  const appleMapsUrl = hasCoordinates ? `https://maps.apple.com/?ll=${coordinates}&q=${mapLabel}` : "";
  const googleMapsUrl = hasCoordinates ? `https://www.google.com/maps/search/?api=1&query=${coordinates}` : "";
  panel.innerHTML = `
    <button class="overlay-close place-panel-close" type="button" aria-label="Locatie-informatie sluiten">×</button>
    ${place.photo ? `
      <figure class="place-photo-wrap">
        <img class="place-photo" src="${escapeHtml(place.photo)}" alt="Foto van ${escapeHtml(place.name)}" loading="lazy" referrerpolicy="no-referrer" />
        <figcaption>Foto: ${escapeHtml(place.photoLabel || place.sourceLabel)}</figcaption>
      </figure>
    ` : ""}
    <div class="place-badges">
      <span class="badge">${escapeHtml(sleepTypes[place.type]?.label || "Slaapplek")}</span>
      <span class="badge badge-muted">${escapeHtml(certainty)}</span>
    </div>
    <h3>${escapeHtml(place.name)}</h3>
    <p class="place-location">${escapeHtml(place.location)}</p>
    ${place.decision ? `<p class="place-decision">${escapeHtml(place.decision)}</p>` : ""}
    <p class="place-description">${escapeHtml(place.description)}</p>
    <ul class="place-facts">
      <li><span>Verblijf</span><strong>${escapeHtml(place.stay)}</strong></li>
      <li><span>Kosten</span><strong>${escapeHtml(place.cost)}</strong></li>
      <li><span>Water</span><strong>${escapeHtml(place.water)}</strong></li>
      <li><span>Bron</span><strong>${escapeHtml(place.sourceLabel)}</strong></li>
      ${extraFacts.map(([label, value]) => `<li><span>${escapeHtml(label)}</span><strong>${escapeHtml(value)}</strong></li>`).join("")}
    </ul>
    ${hasCoordinates ? `
      <div class="place-map-actions">
        <a href="${escapeHtml(appleMapsUrl)}" target="_blank" rel="noreferrer">Apple Maps <span>↗</span></a>
        <a href="${escapeHtml(googleMapsUrl)}" target="_blank" rel="noreferrer">Google Maps <span>↗</span></a>
      </div>
    ` : ""}
    <a class="button button-primary place-link" href="${escapeHtml(place.sourceUrl)}" target="_blank" rel="noreferrer">${escapeHtml(place.sourceAction || "Open de bron")} ↗</a>
    ${place.caution ? `<div class="place-caution"><strong>Praktisch:</strong> ${escapeHtml(place.caution)}</div>` : ""}
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
  if (distanceKm < 10) return `${distanceKm.toFixed(1).replace(".", ",")} km`;
  return `${Math.round(distanceKm)} km`;
}

function candidateProviderLabel(provider) {
  return {
    denmark: "Ud i Naturen",
    campwild: "CampWild",
    osm: "OpenStreetMap",
    imported: "GPX-waypoint",
    vodf: "Vrienden op de Fiets",
    wtmg: "Welcome To My Garden",
    camping: "OpenStreetMap-camping",
  }[provider] || "Bronlocatie";
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
  if (!candidate.useRouteProgress) return `${formatDistance(candidate.directDistanceKm)} hemelsbreed`;
  const direction = candidate.routeDeltaKm < 0
    ? `${formatDistance(Math.abs(candidate.routeDeltaKm))} terug langs route`
    : `${formatDistance(candidate.routeDeltaKm)} verder op route`;
  return candidate.routePosition.distanceKm < 0.25
    ? direction
    : `${direction} · ${formatDistance(candidate.routePosition.distanceKm)} van lijn`;
}

function updateCandidatePanel() {
  if (!candidatePanelOpen) return;
  const list = document.querySelector("#candidate-list");
  const intro = document.querySelector("#candidate-intro");
  if (mapDataError) {
    displayedCandidates = [];
    list.innerHTML = '<div class="candidate-empty"><strong>Plekken konden niet laden.</strong><span>Controleer je verbinding en probeer opnieuw.</span><button class="button button-quiet" type="button" data-retry-map>Opnieuw proberen</button></div>';
    return;
  }
  if (mapDataLoading) {
    list.innerHTML = `<div class="candidate-empty">${mapManifest ? "Geschikte plekken zoeken…" : "Plekken laden…"}</div>`;
    displayedCandidates = [];
    return;
  }
  const candidates = rankedCandidates();
  const anchorText = userLocation ? "je huidige positie" : "het midden van de kaart";
  const routeText = routeFilterEnabled() && nearestRoutePosition((userLocation || map.getCenter()).lat, (userLocation || map.getCenter()).lng, 20)?.distanceKm <= 20
    ? "verderop langs je GPX-route"
    : "binnen hemelsbrede afstand";
  intro.textContent = `${locationMessage ? `${locationMessage} ` : ""}Gerangschikt vanaf ${anchorText}, ${routeText}. Alleen je actieve filters tellen mee.`;
  updateLocationNote();

  if (!candidates.length) {
    displayedCandidates = [];
    list.innerHTML = `
      <div class="candidate-empty">
        <strong>Geen passende plekken binnen ${candidateHorizonKm} km.</strong>
        <span>Kies een grotere afstand, verplaats de kaart of verruim je filters.</span>
        <button class="button button-quiet" type="button" data-open-filters>Filters aanpassen</button>
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
        <span><i class="candidate-type marker-${escapeHtml(candidate.place.type)}"></i>${escapeHtml(sleepTypes[candidate.place.type]?.label || "Slaapplek")} · ${escapeHtml(candidateProviderLabel(candidate.provider))}</span>
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
  }).bindTooltip("Mijn positie").addTo(locationLayer);
}

function setLocationControlsLoading(isLoading) {
  const locateButton = document.querySelector("#locate-me");
  const panelButton = document.querySelector("#candidate-use-location");
  locateButton.classList.toggle("is-loading", isLoading);
  locateButton.disabled = isLoading;
  panelButton.disabled = isLoading;
  locateButton.setAttribute("aria-label", isLoading ? "Positie bepalen" : "Ga naar mijn huidige positie");
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
    note.textContent = `Positie actief, nauwkeurigheid ongeveer ${formatDistance((userLocation.accuracy || 0) / 1000)}.`;
  } else if (locationMessage) {
    note.textContent = locationMessage;
  } else {
    note.textContent = "Zonder GPS gebruikt Nook het midden van de kaart.";
  }
}

function geolocationUnavailableMessage() {
  if (!("geolocation" in navigator)) return "Deze browser ondersteunt geen locatiebepaling.";
  if (!window.isSecureContext) return "GPS werkt op je telefoon alleen via HTTPS. Open de gepubliceerde GitHub Pages-link of gebruik het kaartmidden.";
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

  locationMessage = "Je positie bepalen...";
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
    locationMessage = "Je huidige positie is actief.";
    drawUserLocation();
    if (focusMap) navigateMapTo([userLocation.lat, userLocation.lng], Math.max(map.getZoom(), 13));
    setLocationControlsLoading(false);
    document.querySelector("#locate-me").classList.add("has-location");
    showLocationStatus("Huidige positie actief. Plekken worden nu vanaf jou gerangschikt.", "success");
    updateLocationNote();
    refreshMapPlaces();
  }, (error) => {
    setLocationControlsLoading(false);
    locationMessage = error.code === error.PERMISSION_DENIED
      ? "Locatietoegang is geweigerd. Zet locatie aan voor deze site of gebruik het midden van de kaart."
      : error.code === error.TIMEOUT
        ? "Locatie bepalen duurde te lang. Nook gebruikt nu het midden van de kaart."
        : "Deze browser gaf geen positie door. Nook gebruikt nu het midden van de kaart.";
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
  document.querySelector("#toggle-filters").setAttribute("aria-label", count ? `Filters, ${count} actieve beperkingen` : "Filters");
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
  { code: "AL", name: "Albanië", center: [41.2, 20.1, 7], bounds: [[39.6, 19.1], [42.7, 21.1]] },
  { code: "AD", name: "Andorra", center: [42.55, 1.6, 10], bounds: [[42.4, 1.4], [42.7, 1.8]] },
  { code: "AT", name: "Oostenrijk", center: [47.6, 14.1, 7], bounds: [[46.35, 9.5], [49.1, 17.2]] },
  { code: "BY", name: "Belarus", center: [53.7, 27.9, 6], bounds: [[51.2, 23.1], [56.2, 32.8]] },
  { code: "BE", name: "België", center: [50.7, 4.65, 7], bounds: [[49.45, 2.45], [51.55, 6.45]] },
  { code: "BA", name: "Bosnië en Herzegovina", center: [44.1, 17.8, 7], bounds: [[42.5, 15.7], [45.3, 19.7]] },
  { code: "BG", name: "Bulgarije", center: [42.7, 25.3, 7], bounds: [[41.2, 22.3], [44.3, 28.7]] },
  { code: "HR", name: "Kroatië", center: [45.1, 16.4, 7], bounds: [[42.3, 13.3], [46.6, 19.5]] },
  { code: "CY", name: "Cyprus", center: [35.1, 33.2, 8], bounds: [[34.5, 32.2], [35.8, 34.7]] },
  { code: "CZ", name: "Tsjechië", center: [49.8, 15.5, 7], bounds: [[48.5, 12.0], [51.1, 18.9]] },
  { code: "DK", name: "Denemarken", center: [56.1, 9.4, 7], bounds: [[54.45, 7.7], [57.9, 15.3]] },
  { code: "EE", name: "Estland", center: [58.7, 25.0, 7], bounds: [[57.5, 21.7], [59.8, 28.3]] },
  { code: "FI", name: "Finland", center: [63.8, 26.0, 5], bounds: [[59.7, 19.0], [70.1, 31.6]] },
  { code: "FR", name: "Frankrijk", center: [46.6, 2.5, 6], bounds: [[41.2, -5.3], [51.3, 9.7]] },
  { code: "DE", name: "Duitsland", center: [51.2, 10.4, 6], bounds: [[47.2, 5.5], [55.2, 15.2]] },
  { code: "GR", name: "Griekenland", center: [39.1, 22.2, 6], bounds: [[34.7, 19.2], [41.8, 28.3]] },
  { code: "HU", name: "Hongarije", center: [47.1, 19.4, 7], bounds: [[45.7, 16.1], [48.6, 22.9]] },
  { code: "IS", name: "IJsland", center: [64.9, -18.7, 6], bounds: [[63.2, -24.8], [66.7, -13.4]] },
  { code: "IE", name: "Ierland", center: [53.3, -8.0, 7], bounds: [[51.3, -10.8], [55.4, -5.9]] },
  { code: "IT", name: "Italië", center: [43.2, 12.0, 6], bounds: [[35.4, 6.6], [47.2, 18.8]] },
  { code: "XK", name: "Kosovo", center: [42.6, 20.9, 8], bounds: [[41.8, 20.0], [43.3, 21.9]] },
  { code: "LV", name: "Letland", center: [56.9, 24.6, 7], bounds: [[55.6, 20.8], [58.1, 28.3]] },
  { code: "LI", name: "Liechtenstein", center: [47.15, 9.55, 10], bounds: [[47.0, 9.45], [47.3, 9.65]] },
  { code: "LT", name: "Litouwen", center: [55.2, 23.9, 7], bounds: [[53.9, 20.9], [56.5, 26.9]] },
  { code: "LU", name: "Luxemburg", center: [49.8, 6.1, 9], bounds: [[49.4, 5.7], [50.25, 6.6]] },
  { code: "MT", name: "Malta", center: [35.9, 14.4, 10], bounds: [[35.75, 14.15], [36.1, 14.6]] },
  { code: "MD", name: "Moldavië", center: [47.2, 28.5, 7], bounds: [[45.4, 26.6], [48.5, 30.2]] },
  { code: "MC", name: "Monaco", center: [43.73, 7.42, 12], bounds: [[43.7, 7.38], [43.75, 7.45]] },
  { code: "ME", name: "Montenegro", center: [42.8, 19.2, 8], bounds: [[41.8, 18.4], [43.6, 20.4]] },
  { code: "NL", name: "Nederland", center: [52.2, 5.4, 7], bounds: [[50.7, 3.2], [53.7, 7.3]] },
  { code: "MK", name: "Noord-Macedonië", center: [41.6, 21.7, 8], bounds: [[40.8, 20.4], [42.4, 23.1]] },
  { code: "NO", name: "Noorwegen", center: [62.2, 9.2, 5], bounds: [[57.8, 4.0], [71.4, 31.2]] },
  { code: "PL", name: "Polen", center: [52.1, 19.4, 6], bounds: [[49.0, 14.1], [54.9, 24.2]] },
  { code: "PT", name: "Portugal", center: [39.6, -8.0, 7], bounds: [[36.9, -9.6], [42.2, -6.0]] },
  { code: "RO", name: "Roemenië", center: [45.9, 24.9, 7], bounds: [[43.6, 20.2], [48.3, 29.7]] },
  { code: "RU", name: "Rusland", center: [56.0, 38.0, 5], bounds: [[41.2, 27.0], [69.5, 60.0]] },
  { code: "SM", name: "San Marino", center: [43.94, 12.46, 11], bounds: [[43.88, 12.38], [44.0, 12.52]] },
  { code: "RS", name: "Servië", center: [44.0, 20.8, 7], bounds: [[42.2, 18.8], [46.2, 23.1]] },
  { code: "SK", name: "Slowakije", center: [48.7, 19.5, 7], bounds: [[47.7, 16.8], [49.7, 22.6]] },
  { code: "SI", name: "Slovenië", center: [46.1, 14.9, 8], bounds: [[45.4, 13.3], [46.9, 16.7]] },
  { code: "ES", name: "Spanje", center: [40.3, -3.7, 6], bounds: [[36.0, -9.4], [43.9, 4.4]] },
  { code: "SE", name: "Zweden", center: [61.0, 15.2, 5], bounds: [[55.0, 10.6], [69.2, 24.3]] },
  { code: "CH", name: "Zwitserland", center: [46.8, 8.2, 7], bounds: [[45.75, 5.75], [47.85, 10.65]] },
  { code: "TR", name: "Turkije", center: [39.0, 35.2, 5], bounds: [[35.8, 25.6], [42.2, 44.8]] },
  { code: "UA", name: "Oekraïne", center: [49.0, 31.4, 6], bounds: [[44.0, 22.1], [52.4, 40.2]] },
  { code: "GB", name: "Verenigd Koninkrijk", center: [54.5, -3.2, 6], bounds: [[49.8, -8.7], [60.9, 1.9]] },
  { code: "VA", name: "Vaticaanstad", center: [41.9, 12.45, 13], bounds: [[41.89, 12.44], [41.91, 12.46]] },
];

const countryNames = Object.fromEntries(FILTER_COUNTRIES.map((country) => [country.code, country.name]));

const COUNTRY_FILTER_KEY = "nook-country-filter-v2";
const FILTER_PREFERENCES_KEY = "nook-filter-preferences-v3";
const ROUTE_DISTANCE_KEY = "nook-route-distance";
const PERSONAL_STORAGE_KEYS = [
  ROUTE_LIBRARY_KEY,
  LEGACY_ROUTE_KEY,
  COUNTRY_FILTER_KEY,
  FILTER_PREFERENCES_KEY,
  ROUTE_DISTANCE_KEY,
  BASEMAP_DETAIL_KEY,
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
    console.warn("Gebruikersopslag kon niet worden gelezen.", error);
    return null;
  }
}

function setUserValue(key, value) {
  try {
    userStorage().setItem(key, value);
    return true;
  } catch (error) {
    console.warn("Gebruikersopslag kon niet worden bewaard.", error);
    return false;
  }
}

function removeUserValue(key) {
  try {
    localStorage.removeItem(key);
    sessionStorage.removeItem(key);
  } catch (error) {
    console.warn("Gebruikersopslag kon niet worden gewist.", error);
  }
}

function storedJson(key) {
  const value = getUserValue(key);
  if (!value) return null;
  try {
    return JSON.parse(value);
  } catch (error) {
    console.warn(`Bewaarde instelling ${key} kon niet worden gelezen.`, error);
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
    <label class="country-chip" title="${escapeHtml(country.name)}">
      <input type="checkbox" data-country="${escapeHtml(country.code)}" />
      <span>${escapeHtml(country.code)}</span>
    </label>
  `).join("");
  updateCountryFilterControls();
}

function selectedCountryLabel() {
  const selected = [...selectedCountryCodes()];
  if (!selected.length) return "Geen landen";
  if (countrySelectionMode === "auto") {
    return "Kaartgebied";
  }
  if (selected.length === ALL_COUNTRY_CODES.length) return "alle landen";
  if (selected.length <= 4) return selected.map((code) => countryNames[code]).join(", ");
  return `${selected.length} landen`;
}

function updateCountryFilterControls() {
  const summary = document.querySelector("#country-selection-summary");
  const toggle = document.querySelector("#toggle-country-list");
  const autoButton = document.querySelector("#set-auto-countries");
  const grid = document.querySelector("#country-toggle-grid");
  syncCountryInputs();
  if (summary) {
    summary.textContent = countrySelectionMode === "auto"
      ? `${selectedCountryLabel()}. Plekken laden in het zichtbare kaartgebied, ook over de grens.`
      : selectedCountryLabel();
  }
  if (toggle) {
    toggle.textContent = countryListExpanded ? "Verberg lijst" : "Kies landen";
    toggle.setAttribute("aria-expanded", String(countryListExpanded));
  }
  if (autoButton) autoButton.classList.toggle("is-active", countrySelectionMode === "auto");
  if (grid) grid.hidden = !countryListExpanded;
}

function renderCountrySelectionPanel() {
  const selected = [...selectedCountryCodes()];
  renderEmptyPanel(
    countrySelectionMode === "auto" ? "Verken het kaartgebied" : selected.length ? `Verken ${selectedCountryLabel()}` : "Geen landen geselecteerd",
    selected.length
      ? "Klik op clusters om in te zoomen. Bij maximale zoom verschijnen de afzonderlijke bronpins."
      : "Zet één of meer landen aan om slaapplekken op de kaart te tonen.",
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
    console.warn("Landselectie kon niet worden hersteld.", error);
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
  if (number >= 1000) return `${(number / 1000).toFixed(number >= 10000 ? 0 : 1).replace(".", ",")}k`;
  return number.toLocaleString("nl-NL");
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
      mapDataError = "Deze browser ondersteunt de kaartberekening niet. Probeer een recente browser.";
      mapDataLoading = false;
      updateMapDataHint();
      updateCandidatePanel();
      return;
    }
    mapWorker = new Worker("map-worker.js?v=20261018-1");
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
      mapDataError = "De kaart kon niet laden. Controleer je verbinding en laad de pagina opnieuw.";
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
    name: point.kind === "vodf" ? "Vrienden op de Fiets-hostpin" : point.kind === "wtmg" ? "Welcome To My Garden-tuinpin" : `${sleepTypes[point.type]?.label || "Slaapplek"} · ${candidateProviderLabel(point.kind)}`,
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
      if (!response.ok) throw new Error(`Plekgegevens: HTTP ${response.status}`);
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
  if (!item) throw new Error("Deze plek ontbreekt in de brondata");
  if (point.kind === "camping") return campingPlace(item).place;
  return { vodf: vodfPlace, wtmg: wtmgPlace, campwild: campwildPlace, denmark: denmarkPlace }[point.kind](item);
}

function applyMapSources(data) {
  const desired = new Set();
  for (const feature of data.features) {
    const cluster = feature.cluster !== undefined;
    const key = cluster ? `c:${feature.cluster}:${feature.lat}:${feature.lng}:${feature.count}` : `p:${feature.id}`;
    desired.add(key);
    if (mapMarkers.has(key)) continue;
    const place = cluster ? null : mapPointPlace(feature);
    const host = feature.kind === "vodf" || feature.kind === "wtmg";
    const colors = { wild: "#668c50", designated: "#dc7740", hut: "#4d7e8d", host: "#7c6894", ask: "#aa965c", camping: "#7b5b35" };
    const marker = L.nookPin([feature.lat, feature.lng], {
      renderer: pinRenderer,
      radius: cluster ? clusterVisual(feature.count).size / 2 : 16,
      fillColor: cluster ? "#123127" : host ? (feature.kind === "vodf" ? "#3978b0" : "#cb5e8b") : colors[feature.type],
      pinLabel: cluster ? compactCount(feature.count) : host ? (feature.kind === "vodf" ? "V" : "G") : sleepTypes[feature.type]?.icon || "?",
      title: cluster ? `${feature.count.toLocaleString("nl-NL")} plekken · zoom in` : place.name,
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
  visiblePlaceCounts.hospitality = data.counts.vodf + data.counts.wtmg;
  visiblePlaceCounts.camping = data.counts.camping;
  visiblePlaceCounts.campwild = data.counts.campwild;
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
  showPlaceMessage(`${points.length} plekken op deze locatie`, "Kies een plek voor de brongegevens.");
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
    next.textContent = "Volgende plekken";
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
    ? "Plekken konden niet laden. Controleer je verbinding."
    : downloading ? "Plekken laden…" : empty ? "Geen plekken in beeld met deze filters. Verplaats de kaart of pas je filters aan." : "";
  const action = document.querySelector("#map-data-action");
  action.textContent = mapDataError ? "Opnieuw proberen" : "Filters aanpassen";
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
    ["Coördinaat", `${pin.lat.toFixed(5)}, ${pin.lng.toFixed(5)}`],
    ["Type", pin.stayType],
    ["Kamers", pin.rooms || "Niet vermeld"],
    ["Bedplaatsen", bedCount || "Niet vermeld"],
  ];
  if (pin.wheelchair) extras.push(["Rolstoel", "Toegankelijk gemeld"]);
  if (pin.luggage) extras.push(["Bagagevervoer", "Beschikbaar gemeld"]);
  if (pin.groups) extras.push(["Groepen", "Welkom gemeld"]);
  if (pin.pets) extras.push(["Huisdieren", "Welkom gemeld"]);
  if (pin.laundry) extras.push(["Wasruimte", "Beschikbaar gemeld"]);

  return {
    name: "Vrienden op de Fiets-hostpin",
    lat: pin.lat,
    lng: pin.lng,
    location: `${countryNames[pin.country]} · openbare kaartpositie`,
    type: "host",
    confidence: 2,
    sourceLabel: "Openbare Vrienden op de Fiets-kaart",
    sourceUrl: publicData.vodf?.source || "https://www.vriendenopdefiets.nl/zoek-een-logeeradres",
    sourceAction: "Open de officiële zoekkaart",
    decision: "Dit is een afzonderlijke pin uit de openbare kaartfeed.",
    description: "Nook gebruikt dezelfde gepubliceerde kaartpositie, zonder host-ID, naam of adresvelden. Log bij de bron in voor de host en reservering.",
    stay: "Alleen na reservering bij een host",
    cost: "Volgens de platformvoorwaarden",
    water: "Afhankelijk van de host",
    extraFacts: extras,
    caution: "Log in bij Vrienden op de Fiets om binnen dit gebied de actuele hosts en beschikbaarheid te bekijken.",
  };
}

function wtmgPlace(pin) {
  const extras = [
    ["Coördinaat", `${pin.lat.toFixed(5)}, ${pin.lng.toFixed(5)}`],
    ["Capaciteit", pin.capacity || "Niet vermeld"],
  ];
  if (pin.tent) extras.push(["Tent", "Plek gemeld"]);
  if (pin.toilet) extras.push(["Toilet", "Aanwezig gemeld"]);
  if (pin.shower) extras.push(["Douche", "Aanwezig gemeld"]);
  if (pin.electricity) extras.push(["Stroom", "Aanwezig gemeld"]);
  if (pin.campfire) extras.push(["Kampvuur", "Mogelijkheid gemeld"]);

  return {
    name: "Welcome To My Garden-tuinpin",
    lat: pin.lat,
    lng: pin.lng,
    location: `${countryNames[pin.country]} · openbare kaartpositie`,
    type: "host",
    confidence: 2,
    photo: pin.photo,
    photoLabel: "Welcome To My Garden",
    sourceLabel: "Openbare Welcome To My Garden-kaart",
    sourceUrl: publicData.wtmg?.source || "https://welcometomygarden.org/nl/explore",
    sourceAction: "Open de officiële tuinzoeker",
    decision: "Dit is een afzonderlijke tuinpin van de openbare explore-kaart.",
    description: "De kaartpositie, basisvoorzieningen en getoonde foto komen uit de publieke tuinlaag. Profieltekst, hostgegevens en contactgegevens blijven bij Welcome To My Garden.",
    stay: "Alleen na aanvraag en bevestiging",
    cost: "Overnachting gratis; controleer lidmaatschapsvoorwaarden",
    water: pin.drinkingWater ? "Drinkwater gemeld" : pin.water ? "Water gemeld, drinkbaarheid onbekend" : "Niet vermeld",
    extraFacts: extras,
    caution: "Open de officiële kaart en neem daar contact op. Een kaartpin is nog geen bevestigde overnachting.",
  };
}

function denmarkPlace(sourcePlace) {
  const capacity = sourcePlace.capacity ? `${sourcePlace.capacity} plaatsen gemeld` : "Niet vermeld";
  const isFreeForest = sourcePlace.category === "Frit teltningsområde";
  return {
    name: sourcePlace.name,
    lat: sourcePlace.lat,
    lng: sourcePlace.lng,
    location: `${sourcePlace.region} · Denemarken`,
    type: sourcePlace.type,
    confidence: 3,
    photo: sourcePlace.image,
    photoLabel: "Ud i Naturen",
    sourceLabel: "Ud i Naturen",
    sourceUrl: sourcePlace.sourceUrl,
    sourceAction: "Open deze officiële locatie",
    decision: sourcePlace.decision,
    description: `${sourcePlace.rules} Officiële locatiebeschrijving (Deens): ${sourcePlace.description}`,
    stay: sourcePlace.stay,
    cost: sourcePlace.cost,
    water: sourcePlace.water,
    extraFacts: [
      ["Boeken", sourcePlace.bookingStatus],
      ["Capaciteit", capacity],
      ["Toilet", sourcePlace.toilet],
      ["Toegankelijk", sourcePlace.accessible],
      ["Beheerder", sourcePlace.manager],
    ],
    caution: sourcePlace.localRestriction || (isFreeForest
      ? "Deze specifieke marker staat in de officiële categorie Frit teltningsområde. Je hoeft dus niet meer uit te zoeken of dit bos aan de regeling deelneemt; houd wel lokale borden en tijdelijke brandregels aan."
      : "Deze specifieke marker staat als overnachtingsplek in Ud i Naturen. Gebruik de boekingsstatus en officiële locatiebeschrijving hierboven voor aankomst en gebruik."),
  };
}

function campwildPlace(sourcePlace) {
  const typeLabel = sourcePlace.typeLabel || sourcePlace.sourceType || "Shelter";
  const placeType = sourcePlace.type || "hut";
  return {
    name: sourcePlace.name || `CampWild ${typeLabel}`,
    lat: sourcePlace.lat,
    lng: sourcePlace.lng,
    location: `${countryNames[sourcePlace.country] || "Europa"} · CampWild`,
    type: placeType,
    confidence: 2,
    sourceLabel: "CampWild",
    sourceUrl: sourcePlace.sourceUrl || "https://map.campwild.org/",
    sourceAction: "Open in CampWild",
    decision: "Publieke CampWild-kaartpin.",
    description: "Shelter, lean-to, bivakplek of hut uit de publieke CampWild-kaartlaag. Open de bron voor foto's, opmerkingen en eventuele check-ins.",
    stay: placeType === "designated" ? "Bivakplek; controleer bron en lokale regels" : "Schuilplek of hut; controleer bron en lokale regels",
    cost: "Niet vermeld",
    water: "Niet vermeld",
    extraFacts: [
      ["Type", typeLabel],
      ["CampWild-ID", String(sourcePlace.id)],
    ],
    caution: "CampWild is communitydata. Controleer de bronpagina, lokale regels, borden en actuele staat voordat je deze plek als overnachting plant.",
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
  status.textContent = !currentFilters().types.has("camping") ? "Campings staan uit."
    : `${visiblePlaceCounts.camping.toLocaleString("nl-NL")} campingplekken in dit kaartbeeld, gegroepeerd bij uitzoomen.`;
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

  const name = sourcePlace.name || sourcePlace.operator || "Naamloze camping";
  const osmKey = sourcePlace.osmKey || "";
  const country = sourcePlace.country || countryFromLatLng(lat, lng);
  const locality = sourcePlace.locality || "";
  const typeLabel = sourcePlace.tourism === "caravan_site" ? "Camper- of caravanterrein" : "Camping";
  const website = sourcePlace.website || "";
  const phone = sourcePlace.phone || "";
  const email = sourcePlace.email || "";
  const extras = [
    ["Type", typeLabel],
  ];
  if (sourcePlace.category) extras.push(["Categorie", sourcePlace.category.replaceAll("_", " ")]);
  if (locality) extras.push(["Plaats", locality]);
  if (sourcePlace.access) extras.push(["Toegang", sourcePlace.access]);
  if (sourcePlace.tents) extras.push(["Tenten", sourcePlace.tents === "yes" ? "Ja" : sourcePlace.tents === "no" ? "Nee volgens OSM" : sourcePlace.tents]);
  if (sourcePlace.campers) extras.push(["Campers", sourcePlace.campers === "yes" ? "Ja" : sourcePlace.campers === "no" ? "Nee volgens OSM" : sourcePlace.campers]);
  if (sourcePlace.caravans) extras.push(["Caravans", sourcePlace.caravans === "yes" ? "Ja" : sourcePlace.caravans === "no" ? "Nee volgens OSM" : sourcePlace.caravans]);
  if (sourcePlace.motorhome) extras.push(["Camperbus", sourcePlace.motorhome === "yes" ? "Ja" : sourcePlace.motorhome === "no" ? "Nee volgens OSM" : sourcePlace.motorhome]);
  if (sourcePlace.cabins) extras.push(["Hutten/cabins", sourcePlace.cabins === "yes" ? "Aanwezig gemarkeerd" : sourcePlace.cabins]);
  if (sourcePlace.capacity) extras.push(["Capaciteit", sourcePlace.capacity]);
  if (sourcePlace.charge) extras.push(["Tarief", sourcePlace.charge]);
  if (sourcePlace.operator) extras.push(["Beheerder", sourcePlace.operator]);
  if (sourcePlace.openingHours) extras.push(["Open", sourcePlace.openingHours]);
  if (sourcePlace.stars) extras.push(["Sterren", sourcePlace.stars]);
  if (sourcePlace.toilets) extras.push(["Toilet", sourcePlace.toilets === "yes" ? "Aanwezig gemarkeerd" : sourcePlace.toilets]);
  if (sourcePlace.shower) extras.push(["Douche", sourcePlace.shower === "yes" ? "Aanwezig gemarkeerd" : sourcePlace.shower]);
  if (sourcePlace.powerSupply) extras.push(["Stroom", sourcePlace.powerSupply === "yes" ? "Aanwezig gemarkeerd" : sourcePlace.powerSupply]);
  if (website) extras.push(["Website", website]);
  if (phone) extras.push(["Telefoon", phone]);
  if (email) extras.push(["E-mail", email]);
  const caution = sourcePlace.access && !["yes", "permissive", "customers"].includes(sourcePlace.access)
    ? "OSM meldt beperkte toegang. Controleer lidmaatschap, reservering en voorwaarden voordat je erheen fietst."
    : sourcePlace.tents === "no"
      ? "Deze plek staat in OSM als niet geschikt voor tenten. Controleer dit voor bikepacking extra goed."
      : "Controleer altijd de officiële campingwebsite, openingstijden en of tenten welkom zijn. OSM kan verouderd of onvolledig zijn.";
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
        ? `${locality} · ${countryNames[country] || "Onbekend land"}`
        : `${countryNames[country] || "Onbekend land"} · OpenStreetMap-camping`,
      type: "camping",
      confidence: 1,
      photo,
      photoLabel: sourcePlace.image ? "OpenStreetMap-bronverwijzing" : "Wikimedia Commons",
      sourceLabel: "OpenStreetMap",
      sourceUrl: sourcePlace.sourceUrl || "https://www.openstreetmap.org/",
      sourceAction: "Open in OpenStreetMap",
      description: "Camping of camperterrein uit OpenStreetMap. Nook toont deze als gewone bronpin, met dezelfde clustering en filters als de andere locatiepins.",
      stay: "Volgens campingvoorwaarden",
      cost: sourcePlace.fee === "no" ? "Als gratis gemarkeerd" : sourcePlace.fee === "yes" ? "Betaald; controleer tarief" : "Niet vermeld",
      water: sourcePlace.drinkingWater === "yes" ? "Drinkwater gemarkeerd" : sourcePlace.waterPoint === "yes" ? "Waterpunt gemarkeerd" : "Niet vermeld",
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
  document.querySelector("#route-distance-output").textContent = `${distanceKm} km`;
  document.querySelectorAll("[data-route-distance]").forEach((button) => {
    button.classList.toggle("is-active", Number(button.dataset.routeDistance) === distanceKm);
  });

  if (!routeState.segments.length) {
    if (savedRoutes.length && importedWaypoints.length) {
      status.textContent = `${importedWaypoints.length.toLocaleString("nl-NL")} GPX-waypoints zichtbaar. Vink een route met track aan voor de afstandsfilter.`;
    } else if (savedRoutes.length) {
      status.textContent = "Geen actieve GPX-track. Vink een route aan om plekken langs de route te filteren.";
    } else {
      status.textContent = "Importeer een GPX-track uit bijvoorbeeld Komoot, EuroVelo of cycle.travel.";
    }
    return;
  }

  const visibleTotal = Object.values(visiblePlaceCounts).reduce((total, count) => total + count, 0);
  const routeLength = Math.round(routeState.lengthKm).toLocaleString("nl-NL");
  const savedLabel = routesPersisted ? " GPX-lijst lokaal bewaard." : " GPX-lijst past niet meer in browseropslag.";
  status.textContent = routeFilterEnabled()
    ? `${visibleTotal.toLocaleString("nl-NL")} plekken in beeld binnen ${distanceKm} km van ${routeState.name} (${routeLength} km).${savedLabel}`
    : `${routeState.name} (${routeLength} km) staat op de kaart; de afstandsfilter is uitgeschakeld.${savedLabel}`;
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
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(1).replace(".", ",")} MB`;
}

function normalizeRouteRecord(route, index = 0) {
  const lines = validRouteLines(route?.lines);
  const waypoints = validRouteWaypoints(route?.waypoints);
  if (!lines.length && !waypoints.length) return null;
  return {
    id: route.id || routeId(route.fileName || route.name || `route-${index}`),
    name: route.name || route.fileName || `GPX-route ${index + 1}`,
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
    count.textContent = "0 routes";
    return;
  }

  library.hidden = false;
  const activeCount = savedRoutes.filter((route) => route.enabled).length;
  count.textContent = `${activeCount}/${savedRoutes.length} actief`;
  list.innerHTML = savedRoutes.map((route) => {
    const lengthLabel = route.lengthKm ? `${Math.round(route.lengthKm).toLocaleString("nl-NL")} km` : "waypoints";
    const pointLabel = route.pointCount ? `${route.pointCount.toLocaleString("nl-NL")} punten` : `${route.waypoints.length.toLocaleString("nl-NL")} waypoints`;
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
        <button type="button" data-route-remove="${escapeHtml(route.id)}" aria-label="${escapeHtml(route.name)} verwijderen">×</button>
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
      name: activeTrackRoutes.length === 1 ? activeTrackRoutes[0].name : `${activeTrackRoutes.length} GPX-routes`,
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
      name: legacy?.name || "Bewaarde route",
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
    console.warn("Bewaarde GPX-routes konden niet worden hersteld.", error);
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
  document.querySelector("#route-undo-message").textContent = removedRoutes.length === 1 ? `${removedRoutes[0].route.name} verwijderd.` : `${removedRoutes.length} routes verwijderd.`;
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
  showRouteFeedback(saved ? "Verwijderde routes hersteld en bewaard." : "Routes hersteld, maar opslaan op dit apparaat is niet gelukt.", !saved);
  document.querySelector("#choose-gpx").focus({ preventScroll: true });
}

function showRouteFeedback(message, error = false) {
  const feedback = document.querySelector("#route-feedback");
  feedback.textContent = message;
  feedback.hidden = !message;
  feedback.classList.toggle("is-error", error);
}

function importGpx(file) {
  if (file.size > 20 * 1024 * 1024) {
    showRouteFeedback("Dit bestand is groter dan 20 MB. Exporteer een kortere of vereenvoudigde GPX-route en probeer opnieuw.", true);
    return;
  }
  const reader = new FileReader();
  showRouteFeedback(`${file.name} lezen…`);
  reader.onerror = () => showRouteFeedback("Dit GPX-bestand kon niet worden gelezen. Kies het bestand opnieuw.", true);
  reader.onload = () => {
    try {
      const xml = new DOMParser().parseFromString(reader.result, "application/xml");
      if (xml.querySelector("parsererror") || xml.documentElement?.localName !== "gpx") {
        showRouteFeedback("Dit is geen geldig GPX-bestand. Je bewaarde routes zijn behouden.", true);
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
        const name = xmlText(waypoint, "name") || `GPX-plek ${index + 1}`;
        const description = xmlText(waypoint, "desc") || xmlText(waypoint, "cmt") || "Geïmporteerd waypoint zonder aanvullende beschrijving.";
        const link = [...waypoint.getElementsByTagNameNS("*", "link")][0]?.getAttribute("href");
        return [{ lat, lng, place: {
          name, lat, lng, description,
          location: `${lat.toFixed(5)}, ${lng.toFixed(5)} · geïmporteerd uit ${file.name}`,
          type: "hut", confidence: 1, sourceLabel: `GPX: ${file.name}`,
          sourceUrl: link && /^https?:\/\//i.test(link) ? link : "https://www.openstreetmap.org/",
          stay: "Controleer bij bron", cost: "Niet uit GPX af te leiden", water: "Niet uit GPX af te leiden",
          caution: "Een GPX-bestand kan verouderd zijn. Controleer prijs, reservering, toegang en actuele staat bij de oorspronkelijke bron of lokale beheerder.",
        } }];
      });
      if (!rawLines.length && !waypoints.length) {
        showRouteFeedback("Geen route of waypoints met geldige coördinaten gevonden. Je bewaarde routes zijn behouden.", true);
        return;
      }
      const metadata = [...xml.getElementsByTagNameNS("*", "metadata")][0];
      const track = [...xml.getElementsByTagNameNS("*", "trk")][0];
      const route = [...xml.getElementsByTagNameNS("*", "rte")][0];
      const name = xmlText(metadata || track || route || xml, "name") || file.name.replace(/\.gpx$/i, "") || "GPX-route";
      const record = normalizeRouteRecord({
        id: routeId(file.name), name, fileName: file.name, originalSize: file.size,
        pointCount: rawLines.reduce((total, line) => total + line.length, 0),
        lengthKm: routeLengthKm(rawLines), lines: prepareRouteLines(rawLines), waypoints,
        enabled: true, importedAt: new Date().toISOString(),
      });
      if (!record) {
        showRouteFeedback("Deze GPX bevat geen bruikbare route of waypoints. Je bewaarde routes zijn behouden.", true);
        return;
      }
      savedRoutes.push(record);
      if (rawLines.length) document.querySelector("#route-filter-active").checked = true;
      const saved = saveRouteLibrary();
      saveFilterPreferences();
      rebuildActiveRoutes({ fitPoints: rawLines.length ? rawLines.flat() : waypoints });
      refreshMapPlaces();
      const detail = rawLines.length ? `${Math.round(record.lengthKm).toLocaleString("nl-NL")} km` : `${waypoints.length} waypoints`;
      showRouteFeedback(`${name} toegevoegd (${detail}). ${saved ? "Bewaard op dit apparaat." : "Tijdelijk zichtbaar: opslaan op dit apparaat is niet gelukt."}`, !saved);
    } catch (error) {
      console.warn("GPX kon niet worden geïmporteerd.", error);
      showRouteFeedback("Deze GPX kon niet worden verwerkt. Probeer een nieuwe export; je eerdere routes zijn behouden.", true);
    }
  };
  reader.readAsText(file);
}

const lightBaseMapControl = document.querySelector("#light-basemap");
lightBaseMapControl.checked = lightBaseMap;
lightBaseMapControl.addEventListener("change", () => {
  const light = lightBaseMapControl.checked;
  baseMap.remove();
  L.setOptions(baseMap, { tileSize: light ? 512 : 256, zoomOffset: light ? -1 : 0 });
  baseMap.addTo(map);
  setUserValue(BASEMAP_DETAIL_KEY, String(light));
});

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
