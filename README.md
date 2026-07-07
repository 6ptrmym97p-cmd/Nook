# Nook

Nook is een Nederlandstalige kaart voor bikepackers en tourfietsers in Europa. De app helpt bij het vinden van slaapplekken langs een route. De vaste bronlagen bevatten nu netwerkdata voor 38 Europese landen; OpenStreetMap-zoeklagen, eigen GPX-data en de campinglaag werken Europa-breed in het huidige kaartbeeld.

## Starten

```bash
python3 -m http.server 8000
```

Open daarna `http://localhost:8000`.

Op een HTTPS-host kan Nook via de browser aan het beginscherm worden toegevoegd. De PWA bewaart de website, regels en routebronnen voor offline herladen. Brondata en kaarttegels worden per bekeken land/kaartgebied lokaal gecachet nadat ze eenmaal geladen zijn; nieuwe bronpagina's en nog niet bekeken kaartgebieden vereisen internet.

## Datakeuzes

- De ingebouwde regiomarkers zijn oriëntatiepunten, geen exacte kampeeradressen.
- De knop op de kaart zoekt live in OpenStreetMap via Overpass naar gratis gemarkeerde kampeerplekken, shelters en wilderness huts.
- GPX-tracks en routes uit onder meer Komoot kunnen lokaal worden geïmporteerd. Een instelbare corridor van 1–50 kilometer verbergt slaapplaatsen die te ver van de fietsroute liggen; de inhoud verlaat de browser niet.
- Geïmporteerde GPX-routes blijven als lokale routebibliotheek in de browser staan. Je kunt routes aan- en uitvinken; de afstandsfilter gebruikt alle actieve routes samen. De app bewaart de vereenvoudigde routepunten, niet het ruwe GPX-bestand.
- Bij openen probeert Nook, na locatietoestemming, de kaart op ongeveer 300 kilometer rond je huidige positie te zetten. Zo blijven live bronnen zoals OSM-campings relevant en hoeft niet heel Europa tegelijk te laden.
- `Plek voor vannacht` gebruikt, na toestemming, de actuele telefoonpositie. Met 15, 35 of 70 kilometer resterende fietsafstand worden maximaal negen kandidaten gerangschikt. Bij een actieve GPX gebeurt dat op voortgang langs de route; zonder GPX op hemelsbrede afstand.
- De kandidatenlijst gebruikt dezelfde land-, slaapvorm-, netwerk- en routefilters als de kaart en beperkt het aantal resultaten per bron, zodat één gastnetwerk de lijst niet volledig vult.
- Als locatietoegang niet beschikbaar of geweigerd is, blijft de functie werken vanaf het midden van het huidige kaartbeeld.
- Losse GPX-waypoints blijven eveneens zichtbaar als eigen slaapplaatsenlaag.
- Denemarken bevat een momentopname van 2.480 officiële [Ud i Naturen](https://udinaturen.dk/kort)-objecten: vrije tentgebieden, primitieve overnachtingsplekken en shelters. Iedere marker bevat de eigen officiële beschrijving, capaciteit, boekingsstatus en detailpagina.
- Vrienden op de Fiets en Welcome To My Garden worden bij uitzoomen geclusterd. Dicht ingezoomd verschijnen de afzonderlijke, openbaar gepubliceerde kaartposities. De huidige momentopname van 7 juli 2026 bevat 5.343 respectievelijk 5.924 pins in de Europese landen waar die brondata is gepubliceerd.
- Nook gebruikt gewone kaartclusters: ver uitgezoomd zie je tellingen, bij verder inzoomen vallen die uiteen in kleinere clusters en daarna losse pins.
- Campings staan standaard aan als gewone slaapvorm in het filtermenu. Nook zoekt live in OpenStreetMap naar `tourism=camp_site` en `tourism=caravan_site`. Bij een te breed kaartbeeld laadt Nook pas na verder inzoomen, of rond je huidige locatie als die beschikbaar is. Zo toont de kaart geen toevallige campingclusters rond een willekeurig kaartmidden. Losse `camp_pitch`-objecten worden niet als aparte campings getoond, omdat dat vaak individuele staanplaatsen binnen één camping zijn.
- Locatiefoto's van Welcome To My Garden en Ud i Naturen worden in het detailpaneel getoond wanneer de bron een openbare afbeelding publiceert. OpenStreetMap-afbeeldingen worden gebruikt wanneer een `image`- of Wikimedia Commons-verwijzing aanwezig is.
- De openbare Vrienden-op-de-Fiets-feed bevat geen fotoveld; die pins blijven daarom zonder afbeelding.
- De hospitalitypins bevatten alleen coördinaten en generieke voorzieningen. Host-ID's, namen, adressen, profielteksten en contactgegevens worden niet opgenomen.
- De Warmshowers-app toont hosts op een kaart. Er is momenteel geen stabiele openbare export of gedocumenteerde feed in Nook opgenomen; daarom verwijst de website naar de officiële app.
- De landenwijzer beschrijft de hoofdregel én uitzonderingen. Frankrijk, België, Zwitserland, Oostenrijk en Italië zijn bewust als lokaal of regionaal aangemerkt; controleer daar altijd gemeente, park, kanton/deelstaat en terreinbeheerder.
- Noorwegen volgt het allemansretten voor `utmark`: minimaal 150 meter van bewoonde huizen of hutten en doorgaans maximaal twee nachten op dezelfde plek. Plaatselijke regels en brandgevaar kunnen dit beperken.
- Iedere plek blijft een aanleiding om de primaire bron en lokale bebording te controleren.

## Openbare data vernieuwen

`scripts/fetch-wtmg-public.mjs` haalt de openbare WTMG-tuinlaag op. De bouwstap bewaart in de website alleen positie, basisvoorzieningen en de uiteindelijke openbare thumbnail-URL. `scripts/build-public-data.mjs` genereert daarna een kleine `public-data.js` met metadata en losse JSON-bestanden in `data/` voor Vrienden op de Fiets, Welcome To My Garden en Ud i Naturen.
