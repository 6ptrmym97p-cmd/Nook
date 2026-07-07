const sleepTypes = {
  wild: { label: "Vrij kamperen", icon: "△" },
  designated: { label: "Aangewezen gratis plek", icon: "⌂" },
  hut: { label: "Hut of shelter", icon: "▰" },
  host: { label: "Gastnetwerk", icon: "♥" },
  ask: { label: "Toestemming vragen", icon: "?" },
  camping: { label: "Camping", icon: "C" },
};

const places = [
  {
    id: "smaland",
    name: "Småland: meren en productiebos",
    location: "Regio Växjö · Zweden",
    country: "SE",
    lat: 56.88,
    lng: 14.8,
    type: "wild",
    confidence: 3,
    sourceLabel: "Naturvårdsverket",
    sourceUrl: "https://www.naturvardsverket.se/en/topics/the-right-of-public-access/activities-and-places/camping--tents/",
    description: "Een kansrijke regio voor een discrete nacht volgens het allemansrätten. Zoek ongecultiveerde grond, ruim uit zicht van woningen en controleer lokale natuurreservaatregels.",
    stay: "1–2 nachten",
    cost: "Gratis",
    water: "Zelf filteren of aanvullen",
    caution: "Geen recht op vuur. Bij droogte kan een volledig vuurverbod gelden. Blijf weg van huizen, akkers en kwetsbare natuur.",
    photo: "https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=900&q=82",
  },
  {
    id: "brandenburg",
    name: "Brandenburgse merenregio",
    location: "Ten noorden van Berlijn · Duitsland",
    country: "DE",
    lat: 53.05,
    lng: 13.3,
    type: "ask",
    confidence: 2,
    sourceLabel: "Brandenburg regelgeving",
    sourceUrl: "https://bravors.brandenburg.de/gesetze/bbgnatschag_2013",
    description: "Voor niet-gemotoriseerde reizigers bestaan in Brandenburg ruimere mogelijkheden dan in veel andere deelstaten, maar eigendom, bosrecht en beschermde gebieden blijven bepalend.",
    stay: "Doorgaans 1 nacht",
    cost: "Gratis met geldige toestemming",
    water: "Niet gegarandeerd",
    caution: "Beschouw een mooi bosperceel niet automatisch als toestemming. Kies liever een trekkingplaats of vraag de eigenaar.",
    photo: "https://images.unsplash.com/photo-1449158743715-0a90ebb6d2d8?auto=format&fit=crop&w=900&q=82",
  },
  {
    id: "utrecht",
    name: "Utrechtse Heuvelrug",
    location: "Provincie Utrecht · Nederland",
    country: "NL",
    lat: 52.05,
    lng: 5.35,
    type: "host",
    confidence: 3,
    sourceLabel: "Vrienden op de Fiets",
    sourceUrl: "https://www.vriendenopdefiets.nl/",
    description: "Geen vrije kampeerregio. Wel een logische corridor om via een gastnetwerk, particuliere tuin of expliciete toestemming een betaalbare plek te regelen.",
    stay: "Op afspraak",
    cost: "Platformafhankelijk",
    water: "Bij host",
    caution: "Wildkamperen is hier geen legale standaardoptie. Gebruik een gastnetwerk of vraag vóór aankomst toestemming op privéterrein.",
    photo: "https://images.unsplash.com/photo-1521295121783-8a321d551ad2?auto=format&fit=crop&w=900&q=82",
  },
  {
    id: "skane",
    name: "Skåneleden shelters",
    location: "Skåne · Zweden",
    country: "SE",
    lat: 56.05,
    lng: 13.65,
    type: "hut",
    confidence: 2,
    sourceLabel: "OpenStreetMap + lokale routebeheerder",
    sourceUrl: "https://www.skaneleden.se/en",
    description: "Langs langeafstandsroutes staan shelters en eenvoudige rustplekken. Controleer per shelter of reserveren, vuur maken of tenten ernaast is toegestaan.",
    stay: "Meestal 1 nacht",
    cost: "Vaak gratis",
    water: "Niet altijd aanwezig",
    caution: "Een sheltermarkering zegt niets over beschikbaarheid. Neem altijd een tent mee als uitwijkmogelijkheid.",
    photo: "https://images.unsplash.com/photo-1504851149312-7a075b496cc7?auto=format&fit=crop&w=900&q=82",
  },
  {
    id: "hardangervidda",
    name: "Noorse utmark",
    location: "Hardangervidda-regio · Noorwegen",
    country: "NO",
    lat: 60.2,
    lng: 7.45,
    type: "wild",
    confidence: 3,
    sourceLabel: "Norwegian Environment Agency",
    sourceUrl: "https://www.environmentagency.no/areas-of-activity/right-to-roam/camping/",
    description: "In Noorse utmark mag je doorgaans met een kleine tent overnachten. Deze regiopin markeert geen specifieke standplaats: controleer ter plaatse of de grond werkelijk onbebouwd en ongecultiveerd is.",
    stay: "Maximaal 2 nachten; langer in afgelegen berggebied",
    cost: "Gratis",
    water: "Zelf beoordelen en behandelen",
    caution: "Blijf minstens 150 meter van bewoonde huizen en hutten. Lokale regels gelden onder meer in drukbezochte gebieden; vuur in of bij bos is normaal verboden van 15 april tot 15 september. Een DNT- of andere berghut is niet automatisch gratis.",
    photo: "https://images.unsplash.com/photo-1520769669658-f07657f5a307?auto=format&fit=crop&w=900&q=82",
  },
  {
    id: "belgium-bivouac",
    name: "Belgische bivakzones",
    location: "Ardennen en Vlaamse natuurgebieden · België",
    country: "BE",
    lat: 50.35,
    lng: 5.45,
    type: "designated",
    confidence: 2,
    sourceLabel: "Agentschap voor Natuur en Bos",
    sourceUrl: "https://natuurenbos.be/activiteiten/bivakzone",
    description: "Vrij kamperen is geen algemene optie, maar België heeft eenvoudige bivakzones langs wandel- en fietsroutes. Gebruik de losse OSM-pins om aangewezen plekken te vinden en controleer daarna de beheerder.",
    stay: "ANB-zones vooraf gratis reserveren; elders volgens beheerder",
    cost: "Vaak gratis",
    water: "Wisselend",
    caution: "Deze marker is een regio-aanwijzing, geen slaapplaats. Vlaanderen, Wallonië en lokale beheerders hanteren eigen voorwaarden; natuurreservaten zijn geen vrije kampeerterreinen.",
    photo: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=900&q=82",
  },
  {
    id: "france-bivouac",
    name: "Franse bivakregio's",
    location: "Alpen, Pyreneeën en andere routegebieden · Frankrijk",
    country: "FR",
    lat: 45.15,
    lng: 6.15,
    type: "ask",
    confidence: 2,
    sourceLabel: "Parcs nationaux de France",
    sourceUrl: "https://www.parcsnationaux.fr/fr",
    description: "Frankrijk kent geen universeel vrij-kampeerrecht. Een licht bivak kan lokaal zijn toegestaan, vooral op doorgaande routes, maar ieder nationaal park, natuurgebied en elke gemeente kan eigen zones en tijden bepalen.",
    stay: "Meestal alleen van avond tot ochtend waar toegestaan",
    cost: "Gratis waar expliciet toegestaan",
    water: "Niet gegarandeerd",
    caution: "Vraag toestemming op privégrond en controleer de parkpagina. Kusten, beschermde of geklasseerde locaties, wegen en lokaal verboden zones vallen af; in mediterrane gebieden gelden strenge vuurregels.",
    photo: "https://images.unsplash.com/photo-1486911278844-a81c5267e227?auto=format&fit=crop&w=900&q=82",
  },
  {
    id: "luxembourg",
    name: "Luxemburg: toestemming of officiële plek",
    location: "Mullerthal en Oesling · Luxemburg",
    country: "LU",
    lat: 49.85,
    lng: 6.1,
    type: "ask",
    confidence: 2,
    sourceLabel: "Visit Luxembourg",
    sourceUrl: "https://www.visitluxembourg.com/plan-your-stay/stay/camping",
    description: "Luxemburg heeft geen allemansrecht. Plan op een officiële camping of een expliciet toegestane plek en beschouw bos, natuurgebied en routeberm niet als vrije overnachtingsgrond.",
    stay: "Op afspraak of volgens terreinregels",
    cost: "Wisselend",
    water: "Bij officiële locatie",
    caution: "Deze regiopin is alleen een waarschuwing en zoekstart. Gebruik OSM voor gemarkeerde plekken of vraag de eigenaar vooraf toestemming.",
    photo: "https://images.unsplash.com/photo-1501854140801-50d01698950b?auto=format&fit=crop&w=900&q=82",
  },
  {
    id: "swiss-alps",
    name: "Zwitserse hoogalpiene bivakzone",
    location: "Boven de boomgrens · Zwitserland",
    country: "CH",
    lat: 46.65,
    lng: 8.25,
    type: "wild",
    confidence: 2,
    sourceLabel: "Swiss Alpine Club",
    sourceUrl: "https://www.sac-cas.ch/de/umwelt/bergsport-und-umwelt/campieren-und-biwakieren/",
    description: "Een enkele, zorgvuldige nacht boven de boomgrens is op veel plaatsen mogelijk, maar Zwitserland kent kantonale en gemeentelijke beperkingen en veel strikt beschermde gebieden.",
    stay: "Eén nacht, laat opzetten en vroeg vertrekken",
    cost: "Gratis waar toegestaan",
    water: "Zelf beoordelen en behandelen",
    caution: "Niet in natuurreservaten, wildrustgebieden of het Zwitsers Nationaal Park. Vermijd rivieroevers en uiterwaarden, blijf uit zicht van hutten en vraag toestemming bij alpenweiden of privégrond.",
    photo: "https://images.unsplash.com/photo-1531310197839-ccf54634509e?auto=format&fit=crop&w=900&q=82",
  },
  {
    id: "austria-alps",
    name: "Oostenrijk: bos is uitgesloten",
    location: "Alpenregio · Oostenrijk",
    country: "AT",
    lat: 47.25,
    lng: 12.25,
    type: "ask",
    confidence: 3,
    sourceLabel: "Oostenrijks Forstgesetz §33",
    sourceUrl: "https://www.ris.bka.gv.at/NormDokument.wxe?Abfrage=Bundesnormen&Gesetzesnummer=10010371&Paragraf=33",
    description: "Kamperen of 's nachts verblijven in Oostenrijks bos vereist toestemming van de eigenaar. Buiten het bos verschillen de regels per deelstaat en gemeente; hoogalpien nood- of kort bivak is geen landelijk vrijbriefje.",
    stay: "Alleen met toestemming of volgens lokale regeling",
    cost: "Wisselend",
    water: "Niet gegarandeerd",
    caution: "Zet niet zomaar een tent in bos, natuur- of landschapsbeschermingsgebied. Zoek een expliciete trekkingplek, hut of vraag de gemeente en grondeigenaar.",
    photo: "https://images.unsplash.com/photo-1464278533981-50106e6176b1?auto=format&fit=crop&w=900&q=82",
  },
  {
    id: "italian-alps",
    name: "Italiaans bivacco",
    location: "Alpen en Apennijnen · Italië",
    country: "IT",
    lat: 46.15,
    lng: 10.45,
    type: "ask",
    confidence: 2,
    sourceLabel: "Club Alpino Italiano",
    sourceUrl: "https://www.cai.it/",
    description: "Italië regelt kamperen vooral regionaal, provinciaal, gemeentelijk en per park. Een tijdelijk alpien bivak kan anders worden behandeld dan recreatief kamperen, maar is niet automatisch toegestaan.",
    stay: "Alleen volgens regionale of parkregels",
    cost: "Gratis waar bivak expliciet is toegestaan",
    water: "Niet gegarandeerd",
    caution: "Controleer de gemeente of parkbeheerder vóór aankomst. Gebruik onbemande bivacco-hutten alleen volgens hun eigen regels en neem in brandgevoelige gebieden geen enkel risico met vuur.",
    photo: "https://images.unsplash.com/photo-1530789253388-582c481c54b0?auto=format&fit=crop&w=900&q=82",
  },
];

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
  { icon: "V", name: "Vrienden op de Fiets", description: "De openbare kaartfeed levert losse kaartposities en generieke voorzieningen zonder adresvelden. Nook clustert die bij uitzoomen en toont de afzonderlijke bronpins bij inzoomen.", meta: "5.343 pins · 38 Europese landen · 7 juli 2026", url: "https://www.vriendenopdefiets.nl/zoek-een-logeeradres" },
  { icon: "G", name: "Welcome To My Garden", description: "De openbare explore-kaart levert losse tuinposities, basisvoorzieningen en waar aanwezig een tuinfoto. Die worden brongetrouw geclusterd en bij verder inzoomen afzonderlijk getoond.", meta: "5.924 pins · 4.324 foto's · 7 juli 2026", url: "https://welcometomygarden.org/nl/explore" },
  { icon: "U", name: "Ud i Naturen", description: "Officiële Deense kaartdata met concrete vrije tentgebieden, primitieve overnachtingsplekken en shelters, inclusief locatiebeschrijving, capaciteit en boekingsstatus.", meta: "2.480 officiële plekken · 14 juni 2026", url: "https://udinaturen.dk/kort" },
  { icon: "C", name: "OpenStreetMap-campings", description: "Campings en camperterreinen uit OpenStreetMap, opgehaald via de openbare OpenCampingMap-endpoint. Nook laadt ze per land als gewone kaartpins.", meta: "82.084 pins · 47 landen · 7 juli 2026", url: "https://opencampingmap.org/" },
  { icon: "CW", name: "CampWild", description: "Publieke kaart met shelters, lean-to's, bivakplekken en hutten. Nook neemt alleen de duidelijke slaap- en schuiltypes op als hut/shelterpins.", meta: "6.036 pins · publieke kaartlaag · 7 juli 2026", url: "https://map.campwild.org/" },
  { icon: "F", name: "De Wereldfietser", description: "Forum en vereniging met veel ervaringskennis over routes, materiaal en overnachten onderweg.", meta: "Forum · Nederlands", url: "https://forum.wereldfietser.nl/" },
  { icon: "R", name: "Reddit", description: "Recente ervaringen en lokale tips, nuttig als aanwijzing. Controleer elke claim daarna bij een primaire bron.", meta: "Community · wisselend", url: "https://www.reddit.com/r/bikepacking/search/?q=camping%20sweden%20denmark%20germany" },
];

const publicData = window.NOOK_DATA || {};
let vodfPins = publicData.vodf?.pins || [];
let wtmgPins = publicData.wtmg?.pins || [];
let denmarkPlaces = publicData.denmark?.places || [];
let campingPlaces = publicData.camping?.places || [];
let campwildPlaces = publicData.campwild?.places || [];
const overviewSourceCounts = publicData.overview?.countries || {};

const map = L.map("map", { zoomControl: false }).setView([52.4, 8.8], 4);
L.control.zoom({ position: "topright" }).addTo(map);

L.tileLayer("https://basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}.png", {
  maxZoom: 19,
  attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>',
}).addTo(map);

const routeLayer = L.layerGroup().addTo(map);
const locationLayer = L.layerGroup().addTo(map);

function clusterVisual(count) {
  if (count >= 1000) return { size: 86, density: "cluster-density-peak" };
  if (count >= 250) return { size: 76, density: "cluster-density-high" };
  if (count >= 50) return { size: 64, density: "cluster-density-medium" };
  if (count >= 10) return { size: 54, density: "cluster-density-normal" };
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
        chunkedLoading: true,
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

const curatedLayer = sourceClusterLayer("cluster-curated");
const osmLayer = sourceClusterLayer("cluster-osm");
const importedLayer = sourceClusterLayer("cluster-imported");
const vodfLayer = sourceClusterLayer("cluster-vodf");
const wtmgLayer = sourceClusterLayer("cluster-wtmg");
const campingLayer = sourceClusterLayer("cluster-camping");
const campwildLayer = sourceClusterLayer("cluster-official");
const denmarkLayer = sourceClusterLayer("cluster-official");
const markerIndex = new Map();
const visiblePlaceCounts = { curated: 0, hospitality: 0, denmark: 0, campwild: 0, osm: 0, camping: 0, imported: 0 };
const ROUTE_LIBRARY_KEY = "nook-saved-routes-v1";
const LEGACY_ROUTE_KEY = "nook-saved-route-v1";
let osmPlaces = [];
let importedWaypoints = [];
let savedRoutes = [];
let routesPersisted = true;
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
const SOURCE_LOAD_ZOOM = 6;
const START_LOCATION_RADIUS_KM = 80;
const OVERPASS_ENDPOINTS = [
  "https://overpass-api.de/api/interpreter",
  "https://overpass.kumi.systems/api/interpreter",
];
const STARTUP_LOCATION_COPY = "Nook opent dan rond 80 km van jou en rangschikt plekken vanaf je positie.";
let startupLocationTried = false;
let startupLocationPromptDismissed = false;
let startupSourceLoadPaused = true;
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

function focusMapAroundPoint(point, radiusKm = START_LOCATION_RADIUS_KM, options = {}) {
  map.fitBounds(boundsAroundPoint(point, radiusKm), {
    animate: options.animate ?? true,
    padding: [44, 44],
    maxZoom: options.maxZoom || 10,
  });
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
    iconSize: [36, 36],
    iconAnchor: [18, 34],
  });
}

function renderEmptyPanel(title = "Kies een plek", message = "Klik op een marker voor regels, bron en praktische aandachtspunten.") {
  const panel = document.querySelector("#place-panel");
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

function renderPlace(place) {
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
  panel.querySelector(".place-panel-close").addEventListener("click", () => renderEmptyPanel());
  panel.querySelector(".place-photo")?.addEventListener("error", (event) => event.currentTarget.closest(".place-photo-wrap")?.remove());
  setFiltersOpen(false);
}

function formatDistance(distanceKm) {
  if (distanceKm < 1) return `${Math.max(50, Math.round(distanceKm * 1000 / 50) * 50)} m`;
  if (distanceKm < 10) return `${distanceKm.toFixed(1).replace(".", ",")} km`;
  return `${Math.round(distanceKm)} km`;
}

function candidateProviderLabel(provider) {
  return {
    curated: "Nook-regiogids",
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
        <span>Vergroot “nog fietsen”, verruim je filters of zoek openbare OSM-plekken in dit kaartbeeld.</span>
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
  document.querySelector("#place-panel").classList.remove("is-open");
  document.querySelector("#place-panel").setAttribute("aria-hidden", "true");
  setFiltersOpen(false);
  panel.classList.add("is-open");
  panel.setAttribute("aria-hidden", "false");
  refreshMapPlaces();
}

function closeCandidatePanel() {
  candidatePanelOpen = false;
  const panel = document.querySelector("#candidate-panel");
  panel?.classList.remove("is-open");
  panel?.setAttribute("aria-hidden", "true");
  if (map.getZoom() < SOURCE_LOAD_ZOOM) scheduleViewportRefresh();
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

function hideStartupLocationPrompt() {
  const prompt = document.querySelector("#startup-location-card");
  if (prompt) prompt.hidden = true;
}

function showStartupLocationPrompt({ title = "Gebruik je locatie", message = STARTUP_LOCATION_COPY, primaryLabel = "Gebruik locatie" } = {}) {
  const prompt = document.querySelector("#startup-location-card");
  if (!prompt || userLocation || startupLocationPromptDismissed) return;
  const titleElement = document.querySelector("#startup-location-title");
  const copy = document.querySelector("#startup-location-copy");
  const primaryButton = document.querySelector("#startup-use-location");
  if (titleElement) titleElement.textContent = title;
  if (copy) copy.textContent = message;
  if (primaryButton) primaryButton.textContent = primaryLabel;
  prompt.hidden = false;
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

function resumeStartupSourceLoading() {
  startupSourceLoadPaused = false;
  refreshMapPlaces();
}

function geolocationUnavailableMessage() {
  if (!("geolocation" in navigator)) return "Deze browser ondersteunt geen locatiebepaling.";
  if (!window.isSecureContext) return "GPS werkt op je telefoon alleen via HTTPS. Open de gepubliceerde GitHub Pages-link of gebruik het kaartmidden.";
  return "";
}

function requestUserLocation({ openCandidates = false, focusMap = true, focusRadiusKm = 0, quiet = false, promptOnError = false } = {}) {
  if (openCandidates) openCandidatePanel();
  const unavailableMessage = geolocationUnavailableMessage();
  if (unavailableMessage) {
    locationMessage = unavailableMessage;
    resumeStartupSourceLoading();
    if (promptOnError) {
      startupLocationPromptDismissed = false;
      showStartupLocationPrompt({
        title: "Locatie niet beschikbaar",
        message: unavailableMessage,
        primaryLabel: "Opnieuw proberen",
      });
    } else if (!quiet) {
      showLocationStatus(unavailableMessage, "warning", { sticky: true });
    }
    updateLocationNote();
    updateCandidatePanel();
    return;
  }

  hideStartupLocationPrompt();
  locationMessage = "Je positie bepalen...";
  setLocationControlsLoading(true);
  if (!quiet) showLocationStatus("Je positie bepalen...", "neutral");
  updateLocationNote();
  if (openCandidates) updateCandidatePanel();

  navigator.geolocation.getCurrentPosition((position) => {
    userLocation = {
      lat: position.coords.latitude,
      lng: position.coords.longitude,
      accuracy: position.coords.accuracy,
    };
    locationMessage = "Je huidige positie is actief.";
    startupLocationPromptDismissed = true;
    hideStartupLocationPrompt();
    drawUserLocation();
    if (focusMap && focusRadiusKm) focusMapAroundPoint(userLocation, focusRadiusKm, { animate: !quiet });
    else if (focusMap) map.flyTo([userLocation.lat, userLocation.lng], Math.max(map.getZoom(), 13));
    setLocationControlsLoading(false);
    document.querySelector("#locate-me").classList.add("has-location");
    if (!quiet) showLocationStatus("Huidige positie actief. Plekken worden nu vanaf jou gerangschikt.", "success");
    updateLocationNote();
    resumeStartupSourceLoading();
  }, (error) => {
    setLocationControlsLoading(false);
    const explanation = error.code === error.PERMISSION_DENIED
      ? "Locatietoegang is geweigerd. Zet locatie aan voor deze site of gebruik het midden van de kaart."
      : error.code === error.TIMEOUT
        ? "Locatie bepalen duurde te lang. Nook gebruikt nu het midden van de kaart."
        : "Deze browser gaf geen positie door. Nook gebruikt nu het midden van de kaart.";
    locationMessage = explanation;
    if (quiet || promptOnError) {
      startupLocationPromptDismissed = false;
      showStartupLocationPrompt({
        title: error.code === error.PERMISSION_DENIED ? "Locatie staat uit" : "Locatie lukte niet",
        message: `${explanation} Probeer opnieuw of gebruik het kaartmidden.`,
        primaryLabel: "Opnieuw proberen",
      });
    } else {
      showLocationStatus(explanation, "warning", { sticky: true });
    }
    updateLocationNote();
    updateCandidatePanel();
    resumeStartupSourceLoading();
  }, {
    enableHighAccuracy: false,
    timeout: 15000,
    maximumAge: 300000,
  });
}

async function openAroundCurrentLocation() {
  if (startupLocationTried || userLocation) return;
  startupLocationTried = true;
  const unavailableMessage = geolocationUnavailableMessage();
  if (unavailableMessage) {
    showStartupLocationPrompt({
      title: "Locatie niet beschikbaar",
      message: unavailableMessage,
      primaryLabel: "Toch proberen",
    });
    return;
  }
  try {
    if (navigator.permissions?.query) {
      const permission = await navigator.permissions.query({ name: "geolocation" });
      if (permission.state === "denied") {
        resumeStartupSourceLoading();
        showStartupLocationPrompt({
          title: "Locatie staat geblokkeerd",
          message: "Zet locatie aan voor deze site in je browserinstellingen, of gebruik voorlopig het kaartmidden.",
          primaryLabel: "Opnieuw proberen",
        });
        return;
      }
      if (permission.state === "granted") {
        requestUserLocation({ focusMap: true, focusRadiusKm: START_LOCATION_RADIUS_KM, quiet: true, promptOnError: true });
        return;
      }
    }
  } catch (error) {
    console.warn("Locatierechten konden niet vooraf worden gelezen.", error);
  }
  showStartupLocationPrompt();
  window.setTimeout(() => {
    if (!userLocation && !startupLocationPromptDismissed) {
      requestUserLocation({ focusMap: true, focusRadiusKm: START_LOCATION_RADIUS_KM, promptOnError: true });
    }
  }, 700);
  window.setTimeout(() => {
    if (!userLocation && startupSourceLoadPaused) resumeStartupSourceLoading();
  }, 9000);
}

function setFiltersOpen(open) {
  const sidebar = document.querySelector("#map-sidebar");
  const toggle = document.querySelector("#toggle-filters");
  const scrim = document.querySelector("#map-overlay-scrim");
  sidebar.classList.toggle("is-open", open);
  sidebar.setAttribute("aria-hidden", String(!open));
  toggle.setAttribute("aria-expanded", String(open));
  scrim.hidden = !open;
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
const STORAGE_MODE_KEY = "nook-storage-mode-v1";
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
const DEFAULT_COUNTRY_CODES = ALL_COUNTRY_CODES;
const SOURCE_COUNTRY_CODES = new Set(Object.entries(overviewSourceCounts)
  .filter(([, counts]) => Object.values(counts || {}).some((value) => Number(value) > 0))
  .map(([country]) => country));
const COUNTRY_CENTERS = Object.fromEntries(FILTER_COUNTRIES.map((country) => [country.code, country.center]));
const COUNTRY_BOUNDS = Object.fromEntries(FILTER_COUNTRIES.map((country) => [country.code, country.bounds]));
const SOURCE_DATA_VERSION = "20260707-3";
const loadedSourceChunks = {
  vodf: new Set(),
  wtmg: new Set(),
  camping: new Set(),
  campwild: new Set(),
  denmark: new Set(),
};
const loadingSourceChunks = new Map();

function selectedCountryCodes() {
  return new Set([...document.querySelectorAll("[data-country]:checked")].map((input) => input.dataset.country));
}

function storageMode() {
  try {
    const stored = localStorage.getItem(STORAGE_MODE_KEY);
    return stored === "session" ? "session" : "device";
  } catch (error) {
    return "session";
  }
}

function userStorage() {
  return storageMode() === "session" ? sessionStorage : localStorage;
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

function setStorageMode(mode) {
  const nextMode = mode === "session" ? "session" : "device";
  const nextStorage = nextMode === "session" ? sessionStorage : localStorage;
  const previousStorage = nextMode === "session" ? localStorage : sessionStorage;

  PERSONAL_STORAGE_KEYS.forEach((key) => {
    try {
      const value = previousStorage.getItem(key);
      if (value !== null) nextStorage.setItem(key, value);
      previousStorage.removeItem(key);
    } catch (error) {
      console.warn("Opslagmodus kon niet volledig worden omgezet.", error);
    }
  });

  try {
    localStorage.setItem(STORAGE_MODE_KEY, nextMode);
  } catch (error) {
    console.warn("Opslagmodus kon niet worden onthouden.", error);
  }
  updateStorageStatus();
}

function countryAllowed(countryCode, filters = currentFilters()) {
  return Boolean(countryCode && filters.countries.has(countryCode));
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
}

function selectedCountryLabel() {
  const selected = [...selectedCountryCodes()];
  if (!selected.length) return "Geen landen";
  if (selected.length === ALL_COUNTRY_CODES.length) return "alle landen";
  if (selected.length <= 3) return selected.map((code) => countryNames[code]).join(", ");
  return `${selected.length} landen`;
}

function renderCountrySelectionPanel() {
  const selected = [...selectedCountryCodes()];
  renderEmptyPanel(
    selected.length ? `Verken ${selectedCountryLabel()}` : "Geen landen geselecteerd",
    selected.length
      ? "Klik op clusters om in te zoomen. Bij maximale zoom verschijnen de afzonderlijke bronpins."
      : "Zet één of meer landen aan om slaapplekken op de kaart te tonen.",
  );
}

function saveCountrySelection() {
  setUserValue(COUNTRY_FILTER_KEY, JSON.stringify([...selectedCountryCodes()]));
}

function setSelectedCountries(countryCodes, { persist = true, fit = false, announce = true } = {}) {
  const selected = new Set(countryCodes.filter((code) => ALL_COUNTRY_CODES.includes(code)));
  document.querySelectorAll("[data-country]").forEach((input) => {
    input.checked = selected.has(input.dataset.country);
  });
  if (persist) saveCountrySelection();
  if (fit) fitSelectedCountries();
  if (announce) renderCountrySelectionPanel();
}

function restoreCountrySelection() {
  try {
    const saved = storedJson(COUNTRY_FILTER_KEY);
    const countryCodes = Array.isArray(saved) && saved.some((code) => ALL_COUNTRY_CODES.includes(code))
      ? saved
      : DEFAULT_COUNTRY_CODES;
    setSelectedCountries(countryCodes, {
      persist: false,
      announce: false,
      fit: countryCodes.length !== ALL_COUNTRY_CODES.length,
    });
  } catch (error) {
    console.warn("Landselectie kon niet worden hersteld.", error);
    setSelectedCountries(DEFAULT_COUNTRY_CODES, { persist: false, announce: false, fit: false });
  }
}

function fitSelectedCountries() {
  const selected = [...selectedCountryCodes()];
  if (!selected.length) return;
  if (selected.length === 1 && COUNTRY_CENTERS[selected[0]]) {
    const [lat, lng, zoom] = COUNTRY_CENTERS[selected[0]];
    map.flyTo([lat, lng], zoom);
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

function overviewCountValue(countryCode, key) {
  return Number(overviewSourceCounts[countryCode]?.[key]) || 0;
}

function sourceChunkHasPins(countryCode, kind) {
  if (kind === "denmark") return overviewCountValue(countryCode, "denmark") > 0;
  return overviewCountValue(countryCode, kind) > 0;
}

function overviewModeActive() {
  return false;
}

function countryIntersectsBounds(countryCode, bounds = sourceLayerBounds()) {
  const countryBounds = COUNTRY_BOUNDS[countryCode];
  if (!countryBounds) return false;
  const [[south, west], [north, east]] = countryBounds;
  return !(north < bounds.getSouth()
    || south > bounds.getNorth()
    || east < bounds.getWest()
    || west > bounds.getEast());
}

function neededSourceChunks(filters) {
  if (startupSourceLoadPaused) return [];
  const countriesToLoad = [...filters.countries]
    .filter((country) => SOURCE_COUNTRY_CODES.has(country))
    .filter((country) => countryIntersectsBounds(country));
  const chunks = [];

  if (filters.types.has("host") && filters.confidence <= 2) {
    if (filters.networks.has("vodf")) {
      countriesToLoad
        .filter((country) => sourceChunkHasPins(country, "vodf"))
        .forEach((country) => chunks.push({ kind: "vodf", country }));
    }
    if (filters.networks.has("wtmg")) {
      countriesToLoad
        .filter((country) => sourceChunkHasPins(country, "wtmg"))
        .forEach((country) => chunks.push({ kind: "wtmg", country }));
    }
  }

  if (filters.types.has("camping")) {
    countriesToLoad
      .filter((country) => sourceChunkHasPins(country, "camping"))
      .forEach((country) => chunks.push({ kind: "camping", country }));
  }

  if (filters.types.has("hut") || filters.types.has("designated")) {
    countriesToLoad
      .filter((country) => sourceChunkHasPins(country, "campwild"))
      .forEach((country) => chunks.push({ kind: "campwild", country }));
  }

  const wantsDenmarkTypes = filters.types.has("designated") || filters.types.has("hut");
  if (countryAllowed("DK", filters) && wantsDenmarkTypes && filters.confidence <= 3 && sourceChunkHasPins("DK", "denmark")) {
    chunks.push({ kind: "denmark", country: "DK" });
  }

  return chunks;
}

function sourceDataReadyForFilters(filters) {
  return neededSourceChunks(filters).every(({ kind, country }) => loadedSourceChunks[kind].has(country));
}

function renderOverviewMarkers() {
}

function sourceChunkUrl(kind, country) {
  if (kind === "denmark") return `data/denmark-DK.json?v=${SOURCE_DATA_VERSION}`;
  return `data/${kind}-${country}.json?v=${SOURCE_DATA_VERSION}`;
}

function mergeSourceChunk(kind, country, payload) {
  if (kind === "vodf") vodfPins = vodfPins.concat(payload.pins || []);
  if (kind === "wtmg") wtmgPins = wtmgPins.concat(payload.pins || []);
  if (kind === "camping") campingPlaces = campingPlaces.concat(payload.places || []);
  if (kind === "campwild") campwildPlaces = campwildPlaces.concat(payload.places || []);
  if (kind === "denmark") denmarkPlaces = denmarkPlaces.concat(payload.places || []);
  loadedSourceChunks[kind].add(country);
}

function sourceDataLoading() {
  return loadingSourceChunks.size > 0;
}

function loadSourceChunk(kind, country) {
  const key = `${kind}:${country}`;
  if (loadedSourceChunks[kind].has(country) || loadingSourceChunks.has(key)) return;

  const request = fetch(sourceChunkUrl(kind, country))
    .then((response) => {
      if (!response.ok) throw new Error(`Databestand ${key} gaf status ${response.status}`);
      return response.json();
    })
    .then((payload) => {
      mergeSourceChunk(kind, country, payload);
    })
    .catch((error) => {
      console.warn("Brondata kon niet worden geladen.", error);
    })
    .finally(() => {
      loadingSourceChunks.delete(key);
      refreshMapPlaces();
    });

  loadingSourceChunks.set(key, request);
  updateMapDataHint();
}

function ensureSourceData(filters) {
  neededSourceChunks(filters).forEach(({ kind, country }) => loadSourceChunk(kind, country));
}

function sourceLayerBounds() {
  return map.getBounds().pad(map.getZoom() >= 10 ? 0.16 : 0.32);
}

function inSourceViewport(item, bounds) {
  return bounds.contains([item.lat, item.lng]);
}

function updateMapDataHint() {
  const hint = document.querySelector("#map-data-hint");
  if (!hint) return;
  if (sourceDataLoading()) {
    hint.textContent = "Plekken in dit kaartbeeld laden...";
    hint.hidden = false;
    return;
  }
  hint.hidden = true;
}

function scheduleViewportRefresh() {
  window.clearTimeout(viewportRefreshTimer);
  viewportRefreshTimer = window.setTimeout(refreshMapPlaces, 90);
}

function hostPinIcon(provider, label) {
  return L.divIcon({
    className: "",
    html: `<div class="host-map-pin pin-${provider}"><span>${escapeHtml(label)}</span></div>`,
    iconSize: [30, 38],
    iconAnchor: [15, 36],
  });
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

function renderHospitalityPins() {
  const filters = currentFilters();
  vodfLayer.clearLayers();
  wtmgLayer.clearLayers();
  visiblePlaceCounts.hospitality = 0;
  if (overviewModeActive()) return;
  if (!filters.types.has("host") || filters.confidence > 2) return;
  const bounds = sourceLayerBounds();

  if (filters.networks.has("vodf")) {
    const markers = vodfPins
      .filter((pin) => countryAllowed(pin.country, filters))
      .filter((pin) => inSourceViewport(pin, bounds))
      .filter((pin) => isWithinRoute(pin.lat, pin.lng))
      .map((pin) => {
        const place = vodfPlace(pin);
        addCandidate(pin.lat, pin.lng, place, "vodf");
        return L.marker([pin.lat, pin.lng], {
          icon: hostPinIcon("vodf", "V"),
          title: "Vrienden op de Fiets-hostpin",
        }).on("click", () => renderPlace(place));
      });
    addMarkers(vodfLayer, markers);
    visiblePlaceCounts.hospitality += markers.length;
  }

  if (filters.networks.has("wtmg")) {
    const markers = wtmgPins
      .filter((pin) => countryAllowed(pin.country, filters))
      .filter((pin) => inSourceViewport(pin, bounds))
      .filter((pin) => isWithinRoute(pin.lat, pin.lng))
      .map((pin) => {
        const place = wtmgPlace(pin);
        addCandidate(pin.lat, pin.lng, place, "wtmg");
        return L.marker([pin.lat, pin.lng], {
          icon: hostPinIcon("wtmg", "G"),
          title: "Welcome To My Garden-tuinpin",
        }).on("click", () => renderPlace(place));
      });
    addMarkers(wtmgLayer, markers);
    visiblePlaceCounts.hospitality += markers.length;
  }
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

function renderDenmarkPlaces() {
  const filters = currentFilters();
  denmarkLayer.clearLayers();
  visiblePlaceCounts.denmark = 0;
  if (overviewModeActive()) return;
  if (!countryAllowed("DK", filters)) return;
  if (filters.confidence > 3) return;
  const bounds = sourceLayerBounds();

  const markers = denmarkPlaces
    .filter((place) => filters.types.has(place.type))
    .filter((place) => inSourceViewport(place, bounds))
    .filter((place) => isWithinRoute(place.lat, place.lng))
    .map((sourcePlace) => {
      const place = denmarkPlace(sourcePlace);
      addCandidate(sourcePlace.lat, sourcePlace.lng, place, "denmark");
      return L.marker([sourcePlace.lat, sourcePlace.lng], {
        icon: markerIcon(sourcePlace.type),
        title: `${sourcePlace.name} · ${sourcePlace.decision}`,
      }).on("click", () => renderPlace(place));
    });

  denmarkLayer.addLayers ? denmarkLayer.addLayers(markers) : markers.forEach((marker) => marker.addTo(denmarkLayer));
  visiblePlaceCounts.denmark = markers.length;
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

function renderCampwildPlaces() {
  const filters = currentFilters();
  campwildLayer.clearLayers();
  visiblePlaceCounts.campwild = 0;
  if (overviewModeActive()) return;
  const wantsType = filters.types.has("hut") || filters.types.has("designated");
  if (!wantsType) return;
  const bounds = sourceLayerBounds();

  const markers = campwildPlaces
    .filter((place) => countryAllowed(place.country, filters))
    .filter((place) => filters.types.has(place.type))
    .filter((place) => inSourceViewport(place, bounds))
    .filter((place) => isWithinRoute(place.lat, place.lng))
    .map((sourcePlace) => {
      const place = campwildPlace(sourcePlace);
      addCandidate(sourcePlace.lat, sourcePlace.lng, place, "campwild");
      return L.marker([sourcePlace.lat, sourcePlace.lng], {
        icon: markerIcon(place.type),
        title: place.name,
      }).on("click", () => renderPlace(place));
    });

  addMarkers(campwildLayer, markers);
  visiblePlaceCounts.campwild = markers.length;
}

function renderCuratedMarkers() {
  const filters = currentFilters();
  curatedLayer.clearLayers();
  markerIndex.clear();
  visiblePlaceCounts.curated = 0;
  if (overviewModeActive()) return;

  const markers = places
    .filter((place) => countryAllowed(place.country, filters))
    .filter((place) => filters.types.has(place.type))
    .filter((place) => place.confidence >= filters.confidence)
    .filter((place) => isWithinRoute(place.lat, place.lng))
    .map((place) => {
      const displayPlace = { ...place, approximate: true };
      addCandidate(place.lat, place.lng, displayPlace, "curated");
      const marker = L.marker([place.lat, place.lng], { icon: markerIcon(place.type), title: place.name })
        .on("click", () => renderPlace(displayPlace));
      markerIndex.set(place.id, marker);
      visiblePlaceCounts.curated += 1;
      return marker;
    });
  addMarkers(curatedLayer, markers);
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

function osmType(tags) {
  if (tags.tourism === "wilderness_hut" || tags.amenity === "shelter") return "hut";
  return "designated";
}

function osmDescription(tags, type) {
  if (type === "hut") return "Openbaar in OpenStreetMap opgenomen shelter of hut. Beschikbaarheid, toegang en overnachten zijn niet automatisch gegarandeerd.";
  return "OpenStreetMap-plek die expliciet als gratis of eenvoudig/backcountry is gemarkeerd. Controleer de actuele terreinregels vóór gebruik.";
}

function osmPhoto(tags) {
  if (/^https?:\/\//i.test(tags.image || "")) return tags.image;
  const commonsFile = String(tags.wikimedia_commons || "").replace(/^File:/i, "");
  if (!commonsFile) return "";
  return `https://commons.wikimedia.org/wiki/Special:Redirect/file/${encodeURIComponent(commonsFile)}?width=900`;
}

async function fetchOverpass(query, { timeoutMs = 32000 } = {}) {
  let lastError = null;

  for (const endpoint of OVERPASS_ENDPOINTS) {
    const controller = new AbortController();
    const timeout = window.setTimeout(() => controller.abort(), timeoutMs);
    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8" },
        body: new URLSearchParams({ data: query }),
        signal: controller.signal,
      });
      if (!response.ok) throw new Error(`Overpass gaf status ${response.status}`);
      return response.json();
    } catch (error) {
      lastError = error;
    } finally {
      window.clearTimeout(timeout);
    }
  }

  throw lastError || new Error("Overpass kon niet worden bereikt");
}

function renderOsmPlaces() {
  const filters = currentFilters();
  osmLayer.clearLayers();
  visiblePlaceCounts.osm = 0;
  if (overviewModeActive()) return;
  const markers = osmPlaces
    .filter((item) => item.country ? countryAllowed(item.country, filters) : filters.countries.size === ALL_COUNTRY_CODES.length)
    .filter((item) => isWithinRoute(item.lat, item.lng))
    .map((item) => {
      addCandidate(item.lat, item.lng, item.place, "osm");
      const marker = L.marker([item.lat, item.lng], { icon: markerIcon(item.place.type), title: item.place.name })
        .on("click", () => renderPlace(item.place));
      visiblePlaceCounts.osm += 1;
      return marker;
    });
  addMarkers(osmLayer, markers);
}

async function loadOsmPlaces() {
  const status = document.querySelector("#osm-status");
  if (map.getZoom() < 7) {
    status.textContent = "Zoom verder in op het gebied waar je wilt zoeken.";
    return;
  }

  const bounds = map.getBounds();
  const bbox = [bounds.getSouth(), bounds.getWest(), bounds.getNorth(), bounds.getEast()].join(",");
  const query = `[out:json][timeout:25];(
    nwr["tourism"="camp_site"]["fee"="no"](${bbox});
    nwr["tourism"="camp_site"]["backcountry"="yes"](${bbox});
    nwr["tourism"="camp_pitch"]["fee"="no"](${bbox});
    nwr["tourism"="wilderness_hut"](${bbox});
    nwr["amenity"="shelter"]["shelter_type"~"basic_hut|lean_to|weather_shelter|picnic_shelter"](${bbox});
  );out center tags 120;`;

  status.textContent = "Openbare kaartdata ophalen…";
  document.querySelector("#load-osm").disabled = true;

  try {
    const data = await fetchOverpass(query, { timeoutMs: 35000 });
    osmPlaces = data.elements.flatMap((element) => {
      const lat = element.lat ?? element.center?.lat;
      const lng = element.lon ?? element.center?.lon;
      if (!lat || !lng) return [];
      const tags = element.tags || {};
      const type = osmType(tags);
      const name = tags.name || (type === "hut" ? "Naamloze shelter / hut" : "Naamloze gratis kampeerplek");
      const place = {
        name,
        lat,
        lng,
        location: "Openbare OSM-locatie in huidig kaartbeeld",
        type,
        confidence: tags.fee === "no" || tags.tourism === "wilderness_hut" ? 2 : 1,
        photo: osmPhoto(tags),
        photoLabel: tags.image ? "OpenStreetMap-bronverwijzing" : "Wikimedia Commons",
        sourceLabel: "OpenStreetMap",
        sourceUrl: `https://www.openstreetmap.org/${element.type}/${element.id}`,
        description: osmDescription(tags, type),
        stay: tags.maxstay || "Niet vermeld",
        cost: tags.fee === "no" ? "Als gratis gemarkeerd" : "Onbekend",
        water: tags.drinking_water === "yes" ? "Drinkwater gemarkeerd" : "Niet vermeld",
        caution: "OpenStreetMap is gemeenschapsdata en kan verouderd of onvolledig zijn. Bekijk borden en lokale regels ter plaatse.",
      };
      return [{ lat, lng, country: countryFromLatLng(lat, lng), place }];
    });
    renderOsmPlaces();
    renderOverviewMarkers();
    updateRouteStatus();

    status.textContent = osmPlaces.length ? `${osmPlaces.length} openbare plekken gevonden in dit kaartbeeld.` : "Geen geschikte openbare plekken gevonden. Verschuif de kaart of zoom iets uit.";
  } catch (error) {
    console.error(error);
    status.textContent = error.name === "AbortError"
      ? "De openbare kaartserver deed er te lang over. Zoom verder in en probeer opnieuw."
      : "De openbare kaartserver reageert nu niet. Probeer het over een minuut opnieuw.";
  } finally {
    document.querySelector("#load-osm").disabled = false;
  }
}

function updateCampingStatus(message = "") {
  const status = document.querySelector("#camping-status");
  if (!status) return;
  const filters = currentFilters();
  if (!filters.types.has("camping")) {
    status.textContent = "Uit. Zet Campings aan om OSM-campingpins te tonen.";
    return;
  }
  if (message) {
    status.textContent = message;
    return;
  }
  if (!campingPlaces.length) {
    status.textContent = sourceDataLoading()
      ? "OSM-campings laden als gewone bronlaag per land."
      : "Nog geen OSM-campings geladen voor je huidige landfilter.";
    return;
  }
  const visible = visiblePlaceCounts.camping.toLocaleString("nl-NL");
  const loaded = campingPlaces.length.toLocaleString("nl-NL");
  status.textContent = visiblePlaceCounts.camping
    ? `${visible} OSM-campings zichtbaar. ${loaded} geladen in actieve landen.`
    : `${loaded} OSM-campings geladen, maar niets zichtbaar met je huidige route- of landfilter.`;
}

function filterPreferenceState() {
  return {
    sleepTypes: [...document.querySelectorAll('#sleep-filter input[value]')]
      .map((input) => ({ value: input.value, checked: input.checked })),
    networks: [...document.querySelectorAll("[data-network]")]
      .map((input) => ({ value: input.dataset.network, checked: input.checked })),
    candidateHorizonKm,
  };
}

function saveFilterPreferences() {
  setUserValue(FILTER_PREFERENCES_KEY, JSON.stringify(filterPreferenceState()));
}

function restoreFilterPreferences() {
  const preferences = storedJson(FILTER_PREFERENCES_KEY);
  if (!preferences || typeof preferences !== "object") return;
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
    });
  }
}

function updateStorageStatus() {
  const modeSelect = document.querySelector("#storage-mode");
  const status = document.querySelector("#storage-status");
  if (!modeSelect || !status) return;
  const mode = storageMode();
  modeSelect.value = mode;
  status.textContent = mode === "session"
    ? "Sessie-opslag actief: routes, eigen plekken en voorkeuren verdwijnen als deze browsersessie eindigt."
    : "Apparaat-opslag actief: routes, eigen plekken en voorkeuren blijven alleen in deze browser staan.";
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

function renderCampingPlaces() {
  const filters = currentFilters();
  campingLayer.clearLayers();
  visiblePlaceCounts.camping = 0;
  if (overviewModeActive()) {
    updateCampingStatus();
    return;
  }
  if (!filters.types.has("camping")) {
    updateCampingStatus();
    return;
  }

  const bounds = sourceLayerBounds();
  const markers = campingPlaces
    .filter((item) => item.country ? countryAllowed(item.country, filters) : filters.countries.size === ALL_COUNTRY_CODES.length)
    .filter((item) => inSourceViewport(item, bounds))
    .filter((item) => isWithinRoute(item.lat, item.lng))
    .flatMap((sourcePlace) => {
      const item = campingPlace(sourcePlace);
      if (!item) return [];
      addCandidate(item.lat, item.lng, item.place, "camping");
      return L.marker([item.lat, item.lng], {
        icon: markerIcon("camping"),
        title: item.place.name,
      }).on("click", () => renderPlace(item.place));
    });

  addMarkers(campingLayer, markers);
  visiblePlaceCounts.camping = markers.length;
  updateCampingStatus();
}

function xmlText(element, tagName) {
  const match = [...element.getElementsByTagNameNS("*", tagName)][0];
  return match?.textContent?.trim() || "";
}

function coordinatesFromElements(elements) {
  return elements.flatMap((element) => {
    const lat = Number(element.getAttribute("lat"));
    const lng = Number(element.getAttribute("lon"));
    return Number.isFinite(lat) && Number.isFinite(lng) ? [{ lat, lng }] : [];
  });
}

function renderImportedWaypoints() {
  importedLayer.clearLayers();
  visiblePlaceCounts.imported = 0;
  if (overviewModeActive()) return;
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
  const filters = currentFilters();
  ensureSourceData(filters);
  currentCandidates = [];
  renderOverviewMarkers();
  renderCuratedMarkers();
  renderHospitalityPins();
  renderDenmarkPlaces();
  renderCampwildPlaces();
  renderOsmPlaces();
  renderCampingPlaces();
  renderImportedWaypoints();
  updateMapDataHint();
  updateRouteStatus();
  updateCandidatePanel();
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
    .map((line) => (Array.isArray(line) ? line : []).filter((point) => Number.isFinite(point.lat) && Number.isFinite(point.lng)))
    .filter((line) => line.length > 1);
}

function validRouteWaypoints(waypoints) {
  return (Array.isArray(waypoints) ? waypoints : [])
    .filter((item) => Number.isFinite(item.lat) && Number.isFinite(item.lng) && item.place)
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
  removeUserValue(LEGACY_ROUTE_KEY);
  routesPersisted = saved;
  return saved;
}

function rebuildActiveRoutes({ fitPoints = null } = {}) {
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
  if (boundsPoints.length) {
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
      document.querySelector("#route-filter-active").checked = true;
      rebuildActiveRoutes();
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
    document.querySelector("#route-filter-active").checked = true;
    rebuildActiveRoutes();
    return true;
  } catch (error) {
    console.warn("Bewaarde GPX-routes konden niet worden hersteld.", error);
    removeUserValue(ROUTE_LIBRARY_KEY);
    return false;
  }
}

function clearRoute() {
  routeLayer.clearLayers();
  importedLayer.clearLayers();
  savedRoutes = [];
  importedWaypoints = [];
  routeState = emptyRouteState();
  removeUserValue(ROUTE_LIBRARY_KEY);
  removeUserValue(LEGACY_ROUTE_KEY);
  routesPersisted = true;
  setRouteControls(false, false);
  renderRouteLibrary();
  refreshMapPlaces();
}

function resetUserControlsToDefaults() {
  setSelectedCountries(DEFAULT_COUNTRY_CODES, { persist: false, fit: true, announce: false });
  document.querySelectorAll('#sleep-filter input[value]').forEach((input) => {
    input.checked = true;
  });
  document.querySelectorAll("[data-network]").forEach((input) => {
    input.checked = true;
  });
  document.querySelector("#route-distance").value = "10";
  candidateHorizonKm = 35;
  document.querySelectorAll("[data-horizon]").forEach((button) => {
    button.classList.toggle("is-active", Number(button.dataset.horizon) === candidateHorizonKm);
  });
}

function clearUserData() {
  PERSONAL_STORAGE_KEYS.forEach(removeUserValue);
  savedRoutes = [];
  importedWaypoints = [];
  routeState = emptyRouteState();
  routesPersisted = true;
  routeLayer.clearLayers();
  importedLayer.clearLayers();
  campingLayer.clearLayers();
  campwildLayer.clearLayers();
  setRouteControls(false, false);
  renderRouteLibrary();
  resetUserControlsToDefaults();
  document.querySelector("#custom-data-status").textContent = "Je lokale routes, eigen plekken en voorkeuren zijn gewist.";
  updateStorageStatus();
  refreshMapPlaces();
}

function importGpx(file) {
  const status = document.querySelector("#route-status");
  const reader = new FileReader();
  status.textContent = `${file.name} lezen…`;

  reader.onerror = () => {
    status.textContent = "Dit GPX-bestand kon niet worden gelezen.";
  };

  reader.onload = () => {
    const documentXml = new DOMParser().parseFromString(reader.result, "application/xml");
    if (documentXml.querySelector("parsererror")) {
      status.textContent = "Dit bestand bevat geen geldige GPX-XML.";
      return;
    }

    const trackLines = [...documentXml.getElementsByTagNameNS("*", "trkseg")]
      .map((segment) => coordinatesFromElements([...segment.getElementsByTagNameNS("*", "trkpt")]))
      .filter((line) => line.length > 1);
    const routeLines = [...documentXml.getElementsByTagNameNS("*", "rte")]
      .map((route) => coordinatesFromElements([...route.getElementsByTagNameNS("*", "rtept")]))
      .filter((line) => line.length > 1);
    const rawLines = trackLines.length ? trackLines : routeLines;
    const waypointElements = [...documentXml.getElementsByTagNameNS("*", "wpt")];

    if (!rawLines.length && !waypointElements.length) {
      status.textContent = "Geen track, route of waypoint in dit GPX-bestand gevonden.";
      return;
    }

    const routeWaypoints = waypointElements.slice(0, 5000).flatMap((waypoint, index) => {
      const lat = Number(waypoint.getAttribute("lat"));
      const lng = Number(waypoint.getAttribute("lon"));
      if (!Number.isFinite(lat) || !Number.isFinite(lng)) return [];

      const name = xmlText(waypoint, "name") || `GPX-plek ${index + 1}`;
      const description = xmlText(waypoint, "desc") || xmlText(waypoint, "cmt") || "Geïmporteerd waypoint zonder aanvullende beschrijving.";
      const linkElement = [...waypoint.getElementsByTagNameNS("*", "link")][0];
      const link = linkElement?.getAttribute("href");
      const sourceUrl = link && /^https?:\/\//i.test(link) ? link : "https://www.openstreetmap.org/";
      const place = {
        name,
        lat,
        lng,
        location: `${lat.toFixed(5)}, ${lng.toFixed(5)} · geïmporteerd uit ${file.name}`,
        type: "hut",
        confidence: 1,
        sourceLabel: `GPX: ${file.name}`,
        sourceUrl,
        description,
        stay: "Controleer bij bron",
        cost: "Niet uit GPX af te leiden",
        water: "Niet uit GPX af te leiden",
        caution: "Een GPX-bestand kan verouderd zijn. Controleer prijs, reservering, toegang en actuele staat bij de oorspronkelijke bron of lokale beheerder.",
      };
      return [{ lat, lng, place }];
    });

    if (rawLines.length) {
      const allRawPoints = rawLines.flat();
      const preparedLines = prepareRouteLines(rawLines);
      const metadata = [...documentXml.getElementsByTagNameNS("*", "metadata")][0];
      const track = [...documentXml.getElementsByTagNameNS("*", "trk")][0];
      const route = [...documentXml.getElementsByTagNameNS("*", "rte")][0];
      const routeName = xmlText(metadata || documentXml, "name")
        || xmlText(track || documentXml, "name")
        || xmlText(route || documentXml, "name")
        || file.name.replace(/\.gpx$/i, "");
      const routeRecord = normalizeRouteRecord({
        id: routeId(file.name),
        name: routeName,
        fileName: file.name,
        originalSize: file.size,
        pointCount: allRawPoints.length,
        lengthKm: routeLengthKm(rawLines),
        lines: preparedLines,
        waypoints: routeWaypoints,
        enabled: true,
        importedAt: new Date().toISOString(),
      });
      savedRoutes.push(routeRecord);
      const saved = saveRouteLibrary();
      document.querySelector("#route-filter-active").checked = true;
      setSelectedCountries(ALL_COUNTRY_CODES, { fit: false, announce: false });
      rebuildActiveRoutes({ fitPoints: allRawPoints });
      refreshMapPlaces();
      const sizeLabel = formatFileSize(file.size);
      status.textContent = `${routeName} toegevoegd (${Math.round(routeRecord.lengthKm).toLocaleString("nl-NL")} km${sizeLabel ? ` · ${sizeLabel}` : ""}).${saved ? " Lokaal bewaard." : " Staat tijdelijk op de kaart, maar paste niet in browseropslag."}`;
    } else {
      const waypointRoute = normalizeRouteRecord({
        id: routeId(file.name),
        name: file.name.replace(/\.gpx$/i, "") || "GPX-waypoints",
        fileName: file.name,
        originalSize: file.size,
        lines: [],
        waypoints: routeWaypoints,
        enabled: true,
        importedAt: new Date().toISOString(),
      });
      savedRoutes.push(waypointRoute);
      const saved = saveRouteLibrary();
      rebuildActiveRoutes({ fitPoints: routeWaypoints });
      refreshMapPlaces();
      const sizeLabel = formatFileSize(file.size);
      status.textContent = `${routeWaypoints.length} losse GPX-waypoints toegevoegd${sizeLabel ? ` (${sizeLabel})` : ""}; dit bestand bevat geen route of track.${saved ? " Lokaal bewaard." : " Staat tijdelijk op de kaart, maar paste niet in browseropslag."}`;
    }
  };

  reader.readAsText(file);
}

function customDataPointFromFeature(feature, index, fileName) {
  const geometry = feature?.geometry || {};
  if (geometry.type !== "Point" || !Array.isArray(geometry.coordinates)) return null;
  const [lng, lat] = geometry.coordinates.map(Number);
  if (!Number.isFinite(lat) || !Number.isFinite(lng)) return null;
  const properties = feature.properties || {};
  const type = sleepTypes[properties.type] ? properties.type : "ask";
  const sourceUrl = /^https?:\/\//i.test(properties.url || properties.sourceUrl || "")
    ? (properties.url || properties.sourceUrl)
    : "https://www.openstreetmap.org/";
  const place = {
    name: properties.name || properties.title || `Eigen plek ${index + 1}`,
    lat,
    lng,
    location: `${lat.toFixed(5)}, ${lng.toFixed(5)} · geïmporteerd uit ${fileName}`,
    type,
    confidence: 1,
    photo: /^https?:\/\//i.test(properties.photo || properties.image || "") ? (properties.photo || properties.image) : "",
    photoLabel: "Eigen data",
    sourceLabel: `Eigen data: ${fileName}`,
    sourceUrl,
    description: properties.description || properties.desc || "Eigen geïmporteerde plek zonder aanvullende beschrijving.",
    stay: properties.stay || "Controleer zelf",
    cost: properties.cost || "Niet vermeld",
    water: properties.water || "Niet vermeld",
    caution: "Deze plek komt uit je eigen lokale import. Controleer toegang, regels en actualiteit vóór gebruik.",
  };
  return { lat, lng, place };
}

function customDataPointFromObject(item, index, fileName) {
  const lat = Number(item.lat ?? item.latitude);
  const lng = Number(item.lng ?? item.lon ?? item.longitude);
  if (!Number.isFinite(lat) || !Number.isFinite(lng)) return null;
  return customDataPointFromFeature({
    geometry: { type: "Point", coordinates: [lng, lat] },
    properties: item,
  }, index, fileName);
}

function customDataWaypoints(data, fileName) {
  if (data?.type === "FeatureCollection" && Array.isArray(data.features)) {
    return data.features.slice(0, 5000).flatMap((feature, index) => customDataPointFromFeature(feature, index, fileName) || []);
  }
  if (data?.type === "Feature") {
    const point = customDataPointFromFeature(data, 0, fileName);
    return point ? [point] : [];
  }
  if (Array.isArray(data)) {
    return data.slice(0, 5000).flatMap((item, index) => customDataPointFromObject(item, index, fileName) || []);
  }
  return [];
}

function importCustomData(file) {
  const status = document.querySelector("#custom-data-status");
  const reader = new FileReader();
  status.textContent = `${file.name} lezen...`;

  reader.onerror = () => {
    status.textContent = "Dit databestand kon niet worden gelezen.";
  };

  reader.onload = () => {
    try {
      const data = JSON.parse(reader.result);
      const waypoints = customDataWaypoints(data, file.name);
      if (!waypoints.length) {
        status.textContent = "Geen punten gevonden. Gebruik GeoJSON Point-features of JSON-objecten met lat/lng.";
        return;
      }

      const routeRecord = normalizeRouteRecord({
        id: routeId(file.name),
        name: file.name.replace(/\.(geo)?json$/i, "") || "Eigen plekken",
        fileName: file.name,
        originalSize: file.size,
        lines: [],
        waypoints,
        enabled: true,
        importedAt: new Date().toISOString(),
      });
      savedRoutes.push(routeRecord);
      const saved = saveRouteLibrary();
      rebuildActiveRoutes({ fitPoints: waypoints });
      refreshMapPlaces();
      const sizeLabel = formatFileSize(file.size);
      status.textContent = `${waypoints.length.toLocaleString("nl-NL")} eigen plekken toegevoegd${sizeLabel ? ` (${sizeLabel})` : ""}.${saved ? " Lokaal bewaard." : " Staat tijdelijk op de kaart, maar paste niet in browseropslag."}`;
    } catch (error) {
      console.warn(error);
      status.textContent = "Dit bestand bevat geen geldige JSON of GeoJSON.";
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
  saveCountrySelection();
  refreshMapPlaces();
  renderCountrySelectionPanel();
});

document.querySelector("#load-osm").addEventListener("click", loadOsmPlaces);
document.querySelector("#storage-mode").addEventListener("change", (event) => {
  saveCountrySelection();
  saveFilterPreferences();
  if (savedRoutes.length) saveRouteLibrary();
  setUserValue(ROUTE_DISTANCE_KEY, document.querySelector("#route-distance").value);
  setStorageMode(event.target.value);
  saveCountrySelection();
  saveFilterPreferences();
  if (savedRoutes.length) saveRouteLibrary();
  setUserValue(ROUTE_DISTANCE_KEY, document.querySelector("#route-distance").value);
});
document.querySelector("#clear-user-data").addEventListener("click", () => {
  const confirmed = window.confirm("Wis je lokale routes, eigen plekken en voorkeuren uit deze browser?");
  if (confirmed) clearUserData();
});
document.querySelector("#custom-data-file").addEventListener("change", (event) => {
  const [file] = event.target.files;
  if (file) importCustomData(file);
  event.target.value = "";
});
document.querySelector("#gpx-file").addEventListener("change", (event) => {
  const [file] = event.target.files;
  if (file) importGpx(file);
  event.target.value = "";
});
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
document.querySelector("#route-filter-active").addEventListener("change", refreshMapPlaces);
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
  savedRoutes = savedRoutes.filter((route) => route.id !== button.dataset.routeRemove);
  saveRouteLibrary();
  rebuildActiveRoutes();
  refreshMapPlaces();
});
document.querySelector("#locate-me").addEventListener("click", () => {
  if (userLocation) map.flyTo([userLocation.lat, userLocation.lng], Math.max(map.getZoom(), 13));
  else requestUserLocation({ focusMap: true });
});
document.querySelector("#startup-use-location").addEventListener("click", () => {
  requestUserLocation({ focusMap: true, focusRadiusKm: START_LOCATION_RADIUS_KM, promptOnError: true });
});
document.querySelector("#startup-skip-location").addEventListener("click", () => {
  startupLocationPromptDismissed = true;
  hideStartupLocationPrompt();
  locationMessage = "Nook gebruikt het midden van de kaart.";
  showLocationStatus(locationMessage, "neutral");
  updateLocationNote();
  updateCandidatePanel();
  resumeStartupSourceLoading();
});
document.querySelector("#show-candidates").addEventListener("click", () => {
  if (userLocation) {
    map.flyTo([userLocation.lat, userLocation.lng], Math.max(map.getZoom(), 13));
    openCandidatePanel();
  } else {
    requestUserLocation({ openCandidates: true, focusMap: true });
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
    saveFilterPreferences();
    updateCandidatePanel();
  });
});
document.querySelector("#candidate-list").addEventListener("click", (event) => {
  const button = event.target.closest("[data-candidate-index]");
  if (!button) return;
  const candidate = displayedCandidates[Number(button.dataset.candidateIndex)];
  if (!candidate) return;
  map.flyTo([candidate.lat, candidate.lng], Math.max(map.getZoom(), 14));
  renderPlace(candidate.place);
});

document.querySelector("#toggle-filters").addEventListener("click", () => {
  const isOpen = document.querySelector("#map-sidebar").classList.contains("is-open");
  setFiltersOpen(!isOpen);
});
document.querySelector("#close-filters").addEventListener("click", () => setFiltersOpen(false));
document.querySelector("#map-overlay-scrim").addEventListener("click", () => setFiltersOpen(false));
map.on("moveend zoomend", scheduleViewportRefresh);
document.addEventListener("keydown", (event) => {
  if (event.key !== "Escape") return;
  setFiltersOpen(false);
  closeCandidatePanel();
  renderEmptyPanel();
});

updateStorageStatus();
renderCountryFilter();
const savedRouteDistance = Number(getUserValue(ROUTE_DISTANCE_KEY));
if (savedRouteDistance >= 1 && savedRouteDistance <= 50) {
  document.querySelector("#route-distance").value = savedRouteDistance;
}

restoreCountrySelection();
restoreFilterPreferences();
restoreRoute();
refreshMapPlaces();
openAroundCurrentLocation();
function openRouteImportPanelFromLink() {
  const sidebar = document.querySelector("#map-sidebar");
  const mapShell = document.querySelector(".map-shell");
  sidebar.classList.add("no-transition");
  setFiltersOpen(true);
  const routeImport = document.querySelector("#route-import");
  routeImport.classList.add("is-highlighted");
  const positionRouteImport = () => {
    mapShell.scrollTop = 0;
    sidebar.scrollTop = Math.max(0, routeImport.offsetTop - 18);
  };
  history.replaceState(null, "", window.location.pathname);
  positionRouteImport();
  requestAnimationFrame(positionRouteImport);
  window.setTimeout(positionRouteImport, 120);
  window.setTimeout(positionRouteImport, 500);
  window.setTimeout(positionRouteImport, 1000);
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
