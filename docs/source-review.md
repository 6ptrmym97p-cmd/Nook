# Aanvullende bronnen voor Nook

## Refuges.info — toegevoegd aan de kaart

[API-documentatie](https://www.refuges.info/api/) en [bronlicentie](https://www.refuges.info/wiki/licence/) staan hergebruik toe onder [CC BY-SA 2.0](https://creativecommons.org/licenses/by-sa/2.0/). De gedownloade GeoJSON bevestigt die licentie zelf. Er is geen login of sleutel nodig. Nook haalt de bron alleen tijdens een expliciete snapshotimport op, niet bij ieder bezoek.

De bekeken export bevat 8.712 records, waaronder waterpunten en andere voorzieningen. De importer controleert de inhoud onafhankelijk van eventuele upstream typefilters:

- Alleen type 7: onbewaakte hutten.
- Alleen hutten met een positief opgegeven aantal slaapplaatsen.
- Geen gemelde sluiting, verwoesting of verplicht sleutels ophalen.
- Alleen valide coördinaten en een betrouwbare landkoppeling.
- Bestaande hutten uit andere bronnen binnen 50 meter worden niet nogmaals toegevoegd.

Resultaat van deze import: **1.280 aanvullende hutten in 18 landen**. Er zijn onder meer 19 overlappende locaties en 8 locaties zonder betrouwbare landkoppeling overgeslagen. Alle bestaande bronrecords blijven behouden. De selectie betekent dat slapen volgens de bron is voorzien; zij garandeert geen actuele toegang, reservering of gratis verblijf. Nook vermeldt daarom geen verzonnen prijs en verwijst naar de actuele bronpagina.

De afgeleide Refuges.info-records in `data/map-details/refuges-*.json` blijven onder CC BY-SA 2.0 beschikbaar. Elk record bevat een bronlink, attributie en licentielink. Nook filtert de selectie, rondt coördinaten af en laat de hierboven beschreven overlap weg. Deze wijzigingen staan ook in `public-data.js`; de plekdetails en het bronnenoverzicht tonen attributie en licentie. Andere bronbestanden houden hun eigen licenties.

Vernieuwen met hetzelfde Natural Earth-landenbestand dat de andere importers gebruiken:

```sh
node scripts/import-refuges.mjs --countries-geojson /tmp/countries.geojson
node --test scripts/test-refuges.mjs scripts/test-map-data.mjs
```

`--input` kan een al gedownloade GeoJSON aanwijzen. Bij een gewijzigde bronlicentie of een lege selectie stopt de import voor publicatie. Verhoog na een datavernieuwing de gezamenlijke index-, worker-, app- en serviceworkerversies en werk het aantal in het bronnenoverzicht bij.

## Bivakzone.be — aanvullende link

[Overzichtskaart](https://www.bivakzone.be/overzichtskaart.html): informatie over erkende bivakplaatsen in België, met eigen verblijfsregels, mogelijke reserveringen en wijzigingen in toegankelijkheid. De website is een onafhankelijk vrijwilligersproject en niet de beheerder van alle terreinen. Er is bij deze scan geen geschikte, duidelijk herbruikbare datalaag vastgesteld. De website staat daarom onder aanvullende links; er zijn geen ongecontroleerde nieuwe kaartpins uit overgenomen. Sommige locaties kunnen al bij de bestaande OSM-campings zitten.

## Statskog — aanvullende link

[Officiële kaart](https://kart.statskog.no/): relevante Noorse bron voor terreinen en buitenvoorzieningen. De publieke viewer is bereikbaar, maar de geschiktheid en hergebruiklicentie van een concrete huttenexport zijn nog niet vastgesteld. Daarom een bronlink voor bezoekers, geen bulkimport of claim dat alle Statskog-voorzieningen al in Nook staan.
