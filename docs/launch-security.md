# Nook public launch security checklist

Gebruik dit als checklist voordat je Nook naar vrienden stuurt of publiek deelt.

## Status in deze repository

- Security headers staan in `_headers` voor Cloudflare Pages en Netlify.
- Alle HTML-pagina's hebben een CSP meta-tag als vangnet voor simpele statische hosting.
- Leaflet en Leaflet.markercluster gebruiken Subresource Integrity op de CDN-assets.
- Bezoekers sturen geen live Overpass- of andere externe API-zoekopdrachten vanuit Nook. OpenStreetMap-campings staan als statische snapshot in `data/`.
- Er staan geen API keys, tokens of secrets in de client.
- GPX-imports blijven lokaal in de browser.
- De site gebruikt geen cookies, accounts, formulieren of eigen backend.

## Waar staat de data?

Bij launch is dit het model:

- Bij jou gehost: `public-data.js`, `data/*.json`, HTML, CSS, JS, PWA-iconen en favicon.
- Extern geladen als asset: kaarttegels van OpenStreetMap en fonts van Google Fonts (Leaflet, markercluster en Supercluster worden met hun licenties lokaal geserveerd; Leaflet/markercluster behouden SRI), en bronfoto's die al door de bron als publieke afbeelding worden gepubliceerd.
- Alleen als link: platformpagina's zoals Vrienden op de Fiets, Welcome To My Garden, Ud i Naturen, CampWild en routebronnen.
- Niet aanwezig: API keys, login, database, betaalgegevens, privé-hostprofielen, ruwe GPX-bestanden van bezoekers.

Eenmalig downloaden en als snapshot hosten is voor deze launch het handigst: het is sneller, beter te cachen, makkelijker te rate-limiten en voorkomt dat bezoekers jouw site als API-proxy of scraper gebruiken. Controleer bij elke bron wel of de publieke data en attributie passen bij jouw gebruik.

## Aanbevolen hosting

Kies voor publicatie bij voorkeur een host waar je security headers en edge/rate-limitregels kunt afdwingen.

1. Cloudflare Pages
   - Plaats de repo als statische site.
   - Zorg dat `_headers` in de gepubliceerde root staat.
   - Zet Web Analytics alleen aan als je bewust analytics wilt tonen in je privacy-uitleg.
   - Gebruik een custom domain en HTTPS.

2. Netlify
   - Publiceer de repository root.
   - Netlify leest `_headers` vanuit de publish directory.
   - Zet eventueel Cloudflare voor Netlify als je strengere WAF/rate-limitregels wilt.

3. GitHub Pages
   - Prima voor een kleine demo, maar niet ideaal als enige laag voor professionele publicatie.
   - GitHub Pages serveert statische HTML/CSS/JS, maar biedt geen project-eigen `_headers` responseconfig.
   - Gebruik GitHub Pages bij voorkeur achter Cloudflare als je rate limits en security headers op edge-niveau wilt.

## CDN/rate-limitregels

Client-side limits zijn nuttig, maar niet afdwingbaar tegen misbruik. Zet daarom op je CDN/edge ook server-side limieten.

Aanbevolen startwaarden:

- Alle paden: maximaal 300 requests per 5 minuten per IP. Actie: managed challenge of tijdelijk block.
- `data/*`: maximaal 120 requests per 10 minuten per IP. Actie: managed challenge of tijdelijk block.
- `service-worker.js`, `app.js`, `styles.css`, `public-data.js`: niet strenger dan normaal cachen; deze worden door echte bezoekers en de PWA regelmatig gevraagd.
- Bot Fight Mode of vergelijkbare botbescherming: aanzetten, maar test de kaart daarna mobiel en desktop.

Omdat Nook nu geen bezoeker-gestuurde externe API-verzoeken meer doet, gaan rate limits vooral over jouw statische host: HTML, JS, kaartdata en assets. Kaarttegels en externe bronlinks blijven bij hun eigen aanbieders.

## Headers die nu verwacht worden

Controleer na deploy met `curl -I https://jouwdomein/` of ten minste deze headers aanwezig zijn:

- `Content-Security-Policy`
- `X-Content-Type-Options: nosniff`
- `X-Frame-Options: DENY`
- `Referrer-Policy: no-referrer`
- `Permissions-Policy`
- `Strict-Transport-Security`
- `Cross-Origin-Opener-Policy: same-origin`

Gebruik `includeSubDomains` bij HSTS pas wanneer je zeker weet dat alle subdomeinen permanent via HTTPS beschikbaar zijn.

## Privacytekst voor delen

Korte publieke uitleg:

> Nook draait in je browser. Routes blijven lokaal op je apparaat. Locatie wordt alleen gebruikt na browsertoestemming. De kaart gebruikt openbare brondata als statische momentopname vanaf de website.

## Wanneer de CSP moet worden aangepast

Pas `_headers` en de CSP meta-tags in alle HTML-bestanden aan wanneer je een nieuwe externe bron toevoegt voor:

- scripts;
- stylesheets;
- fonts;
- kaarttegels;
- afbeeldingen die automatisch in de pagina laden;
- live API-verzoeken.

Gewone links naar bronwebsites hoeven niet in de CSP.

## Pre-launch test

1. Open de site in een incognito/private venster.
2. Controleer desktop en mobiel.
3. Klik filters, landselectie, `Plek voor vannacht` en GPX-import.
4. Controleer de browserconsole op CSP- of JavaScriptfouten.
5. Controleer de response headers op de publieke URL.
6. Controleer dat `/data/*` alleen statische JSON-bestanden serveert en geen secrets bevat.
7. Deel pas daarna de link.
