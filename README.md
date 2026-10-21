# Nook

Nook is een meertalige kaart voor bikepackers en tourfietsers, wereldwijd. Engels is de standaard; de taalkeuze biedt twintig veelgesproken talen plus Nederlands. De app helpt bij het vinden van slaapplekken langs een route. De vaste bronlagen bevatten OpenStreetMap-campings, CampWild-shelters en Welcome To My Garden-tuinen in 233 landen en gebieden, plus Vrienden op de Fiets en officiële Deense plekken; eigen GPX-data blijft lokaal in de browser.

## Starten

```bash
python3 -m http.server 8000
```

Open daarna `http://localhost:8000`.

De taalkeuze staat op iedere pagina en wordt onthouden. Vertalingen worden lokaal geserveerd; alleen de gekozen taal wordt geladen. Zie [de taalinstructies](docs/languages.md) voor de 21 talen, vertaalbestanden en controles.

Op een HTTPS-host kan Nook via de browser aan het beginscherm worden toegevoegd. De PWA bewaart de website, regels en routebronnen voor offline herladen. De compacte kaartindex, bekeken plekdetails en kaarttegels worden lokaal gecachet nadat ze eenmaal geladen zijn; nieuwe bronpagina's en nog niet bekeken kaartgebieden vereisen internet.

## Publiek delen

Het eigen domein is `ridewithnook.com`. De buildinstellingen en domeinkoppeling voor Cloudflare Pages staan in [de domeininstructies](docs/domein.md).

Lees vóór een publieke demo of LinkedIn-post `docs/launch-security.md`. De repository bevat security headers in `_headers`, een CSP-vangnet in de HTML en statische databestanden in plaats van bezoeker-gestuurde API-verzoeken. Voor echte hostbescherming blijven CDN- of edge-rate-limits nodig.

## Datakeuzes

- De regiogidsen staan als uitklapbare achtergrondinformatie bij **Regels**, niet als kaartpins of kandidaten voor vannacht. De kaart telt alleen bronlocaties en eigen GPX-waypoints. Clusterbollen gebruiken dezelfde groene, ronde stijl. Vrij kamperen en toestemming zijn gebiedsregels, geen aparte locatiecategorieën zonder bronpunten.
- OpenStreetMap-campings worden als lokale momentopname in `data/` geserveerd. Bezoekers sturen geen live Overpass-zoekopdrachten vanuit Nook.
- GPX-tracks en routes uit onder meer Komoot kunnen lokaal worden geïmporteerd. Een instelbare corridor van 1–50 kilometer verbergt slaapplaatsen die te ver van de fietsroute liggen; de inhoud verlaat de browser niet.
- Geïmporteerde GPX-routes blijven als lokale routebibliotheek in de browser staan. Je kunt routes aan- en uitvinken; de afstandsfilter gebruikt alle actieve routes samen. De app bewaart de vereenvoudigde routepunten, niet het ruwe GPX-bestand.
- Nook opent direct op de kaart, zonder locatiepop-up of automatische GPS-aanvraag. Je locatie wordt pas gebruikt na een tik op de locatieknop of op **Gebruik huidige locatie** in de kandidatenlijst. Het laatste kaartbeeld wordt op dit apparaat onthouden, zodat een bezoek aan Regels of Routes je positie niet kwijtraakt.
- **Mijn route** opent direct de GPX-import. Ongeldige bestanden veranderen de bestaande routelijst niet; landkeuze en de routefilter blijven bewaard. Verwijderde routes kun je tijdens dezelfde sessie herstellen.
- `Plek voor vannacht` gebruikt, na toestemming, de actuele telefoonpositie. Met 15, 35 of 70 kilometer resterende fietsafstand worden maximaal negen kandidaten gerangschikt. Bij een actieve GPX gebeurt dat op voortgang langs de route; zonder GPX op hemelsbrede afstand.
- De kandidatenlijst gebruikt dezelfde land-, slaapvorm-, netwerk- en routefilters als de kaart en beperkt het aantal resultaten per bron, zodat één gastnetwerk de lijst niet volledig vult.
- Als locatietoegang niet beschikbaar of geweigerd is, blijft de functie werken vanaf het midden van het huidige kaartbeeld.
- Losse GPX-waypoints blijven eveneens zichtbaar als eigen slaapplaatsenlaag.
- Denemarken bevat een momentopname van 2.480 officiële [Ud i Naturen](https://udinaturen.dk/kort)-objecten: vrije tentgebieden, primitieve overnachtingsplekken en shelters. Iedere marker bevat de eigen officiële beschrijving, capaciteit, boekingsstatus en detailpagina.
- Vrienden op de Fiets en Welcome To My Garden worden bij ver uitzoomen ruimtelijk geclusterd. Dicht ingezoomd verschijnen de afzonderlijke, openbaar gepubliceerde kaartposities. Vrienden op de Fiets is een momentopname van 7 juli 2026 (5.341 pins); Welcome To My Garden van 18 oktober 2026 (6.772 pins, wereldwijd).
- Nook gebruikt gewone kaartclusters: ver uitgezoomd zie je tellingen, bij verder inzoomen vallen die uiteen in kleinere clusters en daarna losse pins.
- Campings staan standaard aan als gewone slaapvorm in het filtermenu. Nook gebruikt OpenStreetMap-objecten met `tourism=camp_site` en `tourism=caravan_site`, opgehaald via OpenCampingMap, als normale bronpins met dezelfde clustering, filters en detailpanelen als andere locaties. De momentopname van 18 oktober 2026 bevat 199.621 camping- en camperterreinpins wereldwijd. Het land van iedere plek volgt uit exacte landsgrenzen (datasets/geo-countries), niet uit een rechthoek om het land. Losse `camp_pitch`-objecten worden niet als aparte campings getoond, omdat dat vaak individuele staanplaatsen binnen één camping zijn.
- CampWild publiceert een compacte kaartlaag en GPX/KML-export voor shelters, lean-to's, bivakplekken en hutten. Nook neemt daarvan de duidelijke slaap- en schuiltypes op als vaste hut/shelterlaag: 6.095 pins wereldwijd (18 oktober 2026). In Denemarken wint de officiële Ud i Naturen-bron; 93 CampWild-punten binnen 100 meter van een officiële Deense locatie zijn onderdrukt. Per-plekdetails en foto's blijven op de CampWild-detailpagina's.
- Locatiefoto's van Welcome To My Garden en Ud i Naturen worden in het detailpaneel getoond wanneer de bron een openbare afbeelding publiceert. OpenStreetMap-afbeeldingen worden gebruikt wanneer een `image`- of Wikimedia Commons-verwijzing aanwezig is.
- De openbare Vrienden-op-de-Fiets-feed bevat geen fotoveld; die pins blijven daarom zonder afbeelding.
- De hospitalitypins bevatten alleen coördinaten en generieke voorzieningen. Host-ID's, namen, adressen, profielteksten en contactgegevens worden niet opgenomen.
- De Warmshowers-app toont hosts op een kaart. Er is momenteel geen stabiele openbare export of gedocumenteerde feed in Nook opgenomen; daarom verwijst de website naar de officiële app.
- De landenwijzer beschrijft de hoofdregel én uitzonderingen. Frankrijk, België, Zwitserland, Oostenrijk en Italië zijn bewust als lokaal of regionaal aangemerkt; controleer daar altijd gemeente, park, kanton/deelstaat en terreinbeheerder.
- Noorwegen volgt het allemansretten voor `utmark`: minimaal 150 meter van bewoonde huizen of hutten en doorgaans maximaal twee nachten op dezelfde plek. Plaatselijke regels en brandgevaar kunnen dit beperken.
- Iedere plek blijft een aanleiding om de primaire bron en lokale bebording te controleren.

## Openbare data vernieuwen

`scripts/fetch-wtmg-public.mjs` haalt de openbare WTMG-tuinlaag op. `scripts/fetch-opencampingmap-campings.mjs` haalt OSM-campings op via OpenCampingMap en bewaart die als lokale momentopname; `scripts/fetch-osm-campings.mjs` blijft beschikbaar als directe Overpass-fallback. `scripts/fetch-campwild-public.mjs` haalt de publieke CampWild-kaartlaag op. De bouwstap bewaart in de website alleen kaartpositie en praktische bronvelden. `scripts/build-public-data.mjs` genereert daarna `public-data.js` met metadata en via `scripts/build-map-data.mjs` een compacte binaire kaartindex en kleine detailbestanden in `data/map-details/`. Alle bronvelden blijven behouden.

Wereldwijd vernieuwen (landsgrenzen uit [datasets/geo-countries](https://github.com/datasets/geo-countries), publiek domein via Natural Earth):

```bash
curl -sSL -o /tmp/countries.geojson https://raw.githubusercontent.com/datasets/geo-countries/main/data/countries.geojson
node scripts/fetch-opencampingmap-campings.mjs --grid=15 --countries-geojson=/tmp/countries.geojson --output=/tmp/nook-osm-campings.json --timeout=180
node scripts/fetch-campwild-public.mjs --output=/tmp/campwild-places.json
node scripts/fetch-wtmg-public.mjs /tmp/wtmg-public.json
node scripts/build-public-data.mjs --countries-geojson /tmp/countries.geojson
```

Zonder ruwe Vrienden-op-de-Fiets- of Ud-i-Naturen-export houdt de build de nu gepubliceerde plekken van die bronnen aan. `scripts/generate-countries.mjs --countries-geojson=…` vult de landenlijst in `app.js` aan voor nieuwe landen; bestaande, handmatig afgestelde landen blijven staan.

## 1NITE TENT vernieuwen

1NITE TENT staat op de kaart als apart gastnetwerk. De import gebruikt uitsluitend openbare kaartcoördinaten, een afgeleide locatie-ID en landcode. Hostnamen, beschrijvingen en e-mailadressen worden niet overgenomen. Vooraf afspreken en contact verlopen via de [oorspronkelijke kaart](https://1nitetent.com/#map); het gaat om één gratis nacht, geen bevestigde reservering. De detailkaart toont de coördinaten om de locatie op de bronkaart terug te vinden.

```bash
node scripts/import-1nitetent.mjs --countries-geojson /tmp/countries.geojson
node --test scripts/test-1nitetent.mjs scripts/test-map-data.mjs
```

Gebruik het hierboven genoemde landenbestand. Met `--input /pad/naar/campgrounds.geojson` kun je een al gedownloade openbare feed verwerken. De import bewaart alle andere providers en vervangt alleen de 1NITE TENT-laag. Dubbele posities, ongeldige coördinaten en punten zonder betrouwbare landkoppeling worden overgeslagen; het script rapporteert de aantallen. De momentopname van 21 oktober 2026 bevat 2.655 unieke plaatsen in 38 landen uit 2.675 bronrecords. Na het vernieuwen gelden dezelfde gezamenlijke cache-/dataversiestappen als voor de andere kaartbronnen.

## Kaartprestaties en controles

De kaart gebruikt OpenStreetMap-kaarttegels en Supercluster 8.0.1 (de ruimtelijke clusteringbibliotheek van Mapbox). Landen zijn een optioneel filter; de kaart opent en clustert op echte locaties, ook over de grens. `map-worker.js` bouwt en filtert de index buiten de hoofdthread en stuurt alleen zichtbare clusters/pins terug. Er worden geen duizenden Leaflet-markers meer gemaakt voordat er geclusterd wordt.

Alle 222.964 kaartposities worden meteen bij het openen geladen, ongeacht land of zoomniveau. Inzoomen gebruikt diezelfde reeds geladen index; de aantallen zijn clusters van bestaande plekken. De eerste kaartdownload bestaat uit `data/map-index.json` en `data/map-points.bin.gz` (circa 2 MB gecomprimeerd voor 222.964 punten). Browsers zonder `DecompressionStream` gebruiken dezelfde punten via `data/map-points.bin` (circa 3,6 MB). Volledige beschrijvingen, bronlinks en voorzieningen worden pas opgehaald bij een plekdetail of kandidatenlijst, in batches van maximaal 128 plekken. De oorspronkelijke landbestanden zijn daarmee vervangen, zonder verlies van bronrecords.

Na het vernieuwen van de openbare data maakt `scripts/build-public-data.mjs` automatisch de kaartindex en detailbestanden. De bestaande index/batches kun je zonder externe brondata opnieuw opbouwen met:

```bash
node scripts/build-map-data.mjs
node --test scripts/test-map-data.mjs scripts/test-service-worker.mjs scripts/test-feedback.mjs
```

Bij een datavernieuwing: verhoog ook de asset-/dataversie in `app.js`, `map-worker.js`, `index.html` en `service-worker.js`, zodat offlinecaches de nieuwe index en bijbehorende details samen verversen. Gebruik geen losse oude index met nieuwe detailbestanden.

De kaartbibliotheken staan met hun licenties in `vendor/`; er is geen pakketinstallatie of externe JavaScript-CDN nodig. De Leaflet-stylesheet is gecontroleerd tegen het officiële npm-pakket; de HTML behoudt integriteitscontrole.


Bij schuiven en knijpzoomen transformeert Leaflet één canvaslaag met de bronpins; er is geen afzonderlijk bewegend HTML-element per pin. Op grote schermen begrenst Nook de Retina-bitmap tot ongeveer zes miljoen pixels, met behoud van ten minste de CSS-pixelresolutie; kleine schermen houden hun oorspronkelijke scherpte. Tekenen en hitdetectie gebruiken dezelfde geografische projectie. Chromium kan de kaarttegels en pins als afzonderlijke oppervlakken verplaatsen. Tegelupdates tijdens het slepen zijn begrensd tot circa vier per seconde om extra layout- en tekenwerk te beperken. Resultaten worden pas na het gebaar ververst. Een buffer rondom het kaartbeeld voorkomt herberekenen bij kleine verschuivingen. Toetsenbord- en schermlezerbediening blijft beschikbaar via bijbehorende knoppen die hun canvaspin markeren bij focus.

Clusterklikken gaan direct naar het volgende kaartgebied. Browserzoom blijft beschikbaar voor tekst en panelen; de kaart verwerkt eigen knijpgebaren. Er zijn geen globale touch-handlers die snelle tikken op knoppen annuleren. Kaarttegels laden tijdens het schuiven en alleen voor het uiteindelijke zoomniveau. Permanente kaartknoppen en plekpanelen gebruiken geen achtergrondblur tijdens kaartbewegingen.

Kaarttegels hebben een eigen cache met maximaal 256 tegels. Het weggooien van oude tegels verwijdert geen compacte kaartindex of bekeken plekdetails. Offline HTML komt uit de huidige app-versie; een update bewaart lokale routes, voorkeuren en caches van andere apps op hetzelfde domein. Als browseropslag vol is, blijven geslaagde netwerkdownloads bruikbaar.

De onderkaart gebruikt altijd de gedetailleerde OSM-tegels (256 px), op elk apparaat.

Een extra browsercontrole is beschikbaar met een geïnstalleerde Playwright/Chromium (aanwezig in de cloudomgeving):

```bash
node scripts/test-map-browser.cjs
node scripts/test-desktop-map-browser.cjs
node scripts/test-app-browser.cjs
```

Start daarvoor de lokale server. Met `NOOK_TEST_URL` kun je ook een andere testhost controleren en met `NOOK_CHROMIUM` een lokaal Chromium-pad kiezen. In een proxyomgeving kun je met `NOOK_BROWSER_HOME` een apart browserprofiel met de vertrouwde platform-CA aanwijzen; TLS-controle blijft aan. De controle test echte touch-hitdetectie op canvas, hergebruik bij kleine verschuivingen, toetsenbordfocus en bewaren van het kaartdetailniveau. De native tests controleren daarnaast dat kaartgebaren niet worden geannuleerd en dat de gzip-index exact dezelfde punten bevat als de fallback. De browsercontrole test ook snel achter elkaar tikken op de zoomknop en een echt tweevinger-knijpgebaar, met een controle dat de pinlaag tijdens het gebaar niet wordt herbouwd.

De aanpak volgt de optimalisatieprincipes uit [MapLibre's richtlijnen voor grote datasets](https://maplibre.org/maplibre-gl-js/docs/guides/large-data/) en [deck.gl's performance guide](https://deck.gl/docs/developer-guide/performance): minder tekenen, stabiele lagen, minder updates en gecomprimeerde data.

De tweede browsercontrole doorloopt import, ongeldige GPX-bestanden, verwijderen/herstellen, instellingen en kaartbeeld bewaren, snelle touchkeuzes, plekdetails, downloadherstel en offline herladen. De informatiepagina's worden op 320, 390, 844 en 1440 pixels gecontroleerd op leesbaarheid, bereikbare laatste rijen en zichtbare bronlinks. Zie [de productreview van 18 oktober 2026](docs/product-review-2026-10-18.md) voor bevindingen en resterende verbeterpunten.
