# Nook

Nook is een Nederlandstalige kaart voor bikepackers en tourfietsers in Europa. De app helpt bij het vinden van slaapplekken langs een route. De vaste bronlagen bevatten netwerkdata voor 38 Europese landen, officiële Deense plekken en OpenStreetMap-campings; eigen GPX-data blijft lokaal in de browser.

## Starten

```bash
python3 -m http.server 8000
```

Open daarna `http://localhost:8000`.

Op een HTTPS-host kan Nook via de browser aan het beginscherm worden toegevoegd. De PWA bewaart de website, regels en routebronnen voor offline herladen. Brondata en kaarttegels worden per bekeken land/kaartgebied lokaal gecachet nadat ze eenmaal geladen zijn; nieuwe bronpagina's en nog niet bekeken kaartgebieden vereisen internet.

## Publiek delen

Lees vóór een publieke demo of LinkedIn-post `docs/launch-security.md`. De repository bevat security headers in `_headers`, een CSP-vangnet in de HTML en statische databestanden in plaats van bezoeker-gestuurde API-verzoeken. Voor echte hostbescherming blijven CDN- of edge-rate-limits nodig.

## Datakeuzes

- De ingebouwde regiomarkers zijn oriëntatiepunten, geen exacte kampeeradressen.
- OpenStreetMap-campings worden als lokale momentopname in `data/` geserveerd. Bezoekers sturen geen live Overpass-zoekopdrachten vanuit Nook.
- GPX-tracks en routes uit onder meer Komoot kunnen lokaal worden geïmporteerd. Een instelbare corridor van 1–50 kilometer verbergt slaapplaatsen die te ver van de fietsroute liggen; de inhoud verlaat de browser niet.
- Geïmporteerde GPX-routes blijven als lokale routebibliotheek in de browser staan. Je kunt routes aan- en uitvinken; de afstandsfilter gebruikt alle actieve routes samen. De app bewaart de vereenvoudigde routepunten, niet het ruwe GPX-bestand.
- Bij openen vraagt Nook om locatietoestemming en probeert de kaart op ongeveer 80 kilometer rond je huidige positie te zetten. Zo blijft de kaart meteen relevant en hoeft niet heel Europa tegelijk te laden.
- `Plek voor vannacht` gebruikt, na toestemming, de actuele telefoonpositie. Met 15, 35 of 70 kilometer resterende fietsafstand worden maximaal negen kandidaten gerangschikt. Bij een actieve GPX gebeurt dat op voortgang langs de route; zonder GPX op hemelsbrede afstand.
- De kandidatenlijst gebruikt dezelfde land-, slaapvorm-, netwerk- en routefilters als de kaart en beperkt het aantal resultaten per bron, zodat één gastnetwerk de lijst niet volledig vult.
- Als locatietoegang niet beschikbaar of geweigerd is, blijft de functie werken vanaf het midden van het huidige kaartbeeld.
- Losse GPX-waypoints blijven eveneens zichtbaar als eigen slaapplaatsenlaag.
- Denemarken bevat een momentopname van 2.480 officiële [Ud i Naturen](https://udinaturen.dk/kort)-objecten: vrije tentgebieden, primitieve overnachtingsplekken en shelters. Iedere marker bevat de eigen officiële beschrijving, capaciteit, boekingsstatus en detailpagina.
- Vrienden op de Fiets en Welcome To My Garden worden bij ver uitzoomen per land samengevat. Dicht ingezoomd verschijnen de afzonderlijke, openbaar gepubliceerde kaartposities. De huidige momentopname van 7 juli 2026 bevat 5.341 respectievelijk 5.921 pins in de Europese landen waar die brondata is gepubliceerd.
- Nook gebruikt gewone kaartclusters: ver uitgezoomd zie je tellingen, bij verder inzoomen vallen die uiteen in kleinere clusters en daarna losse pins.
- Campings staan standaard aan als gewone slaapvorm in het filtermenu. Nook gebruikt OpenStreetMap-objecten met `tourism=camp_site` en `tourism=caravan_site`, opgehaald via OpenCampingMap, als normale bronpins met dezelfde clustering, filters en detailpanelen als andere locaties. De momentopname van 7 juli 2026 bevat 82.084 camping- en camperterreinpins in 47 landen. Losse `camp_pitch`-objecten worden niet als aparte campings getoond, omdat dat vaak individuele staanplaatsen binnen één camping zijn.
- CampWild publiceert een compacte kaartlaag en GPX/KML-export voor shelters, lean-to's, bivakplekken en hutten. Nook neemt daarvan de duidelijke slaap- en schuiltypes op als vaste hut/shelterlaag: 5.944 pins binnen de app-landen. In Denemarken wint de officiële Ud i Naturen-bron; 92 CampWild-punten binnen 100 meter van een officiële Deense locatie zijn onderdrukt. Per-plekdetails en foto's blijven op de CampWild-detailpagina's.
- Locatiefoto's van Welcome To My Garden en Ud i Naturen worden in het detailpaneel getoond wanneer de bron een openbare afbeelding publiceert. OpenStreetMap-afbeeldingen worden gebruikt wanneer een `image`- of Wikimedia Commons-verwijzing aanwezig is.
- De openbare Vrienden-op-de-Fiets-feed bevat geen fotoveld; die pins blijven daarom zonder afbeelding.
- De hospitalitypins bevatten alleen coördinaten en generieke voorzieningen. Host-ID's, namen, adressen, profielteksten en contactgegevens worden niet opgenomen.
- De Warmshowers-app toont hosts op een kaart. Er is momenteel geen stabiele openbare export of gedocumenteerde feed in Nook opgenomen; daarom verwijst de website naar de officiële app.
- De landenwijzer beschrijft de hoofdregel én uitzonderingen. Frankrijk, België, Zwitserland, Oostenrijk en Italië zijn bewust als lokaal of regionaal aangemerkt; controleer daar altijd gemeente, park, kanton/deelstaat en terreinbeheerder.
- Noorwegen volgt het allemansretten voor `utmark`: minimaal 150 meter van bewoonde huizen of hutten en doorgaans maximaal twee nachten op dezelfde plek. Plaatselijke regels en brandgevaar kunnen dit beperken.
- Iedere plek blijft een aanleiding om de primaire bron en lokale bebording te controleren.

## Openbare data vernieuwen

`scripts/fetch-wtmg-public.mjs` haalt de openbare WTMG-tuinlaag op. `scripts/fetch-opencampingmap-campings.mjs` haalt OSM-campings op via OpenCampingMap en bewaart die als lokale momentopname; `scripts/fetch-osm-campings.mjs` blijft beschikbaar als directe Overpass-fallback. `scripts/fetch-campwild-public.mjs` haalt de publieke CampWild-kaartlaag op. De bouwstap bewaart in de website alleen kaartpositie en praktische bronvelden. `scripts/build-public-data.mjs` genereert daarna een kleine `public-data.js` met metadata en losse JSON-bestanden in `data/` voor Vrienden op de Fiets, Welcome To My Garden, Ud i Naturen, OpenStreetMap-campings en CampWild.
