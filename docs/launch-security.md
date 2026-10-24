# Nook public launch security checklist

Gebruik dit als checklist voordat je Nook naar vrienden stuurt of publiek deelt.

## Status in deze repository

- Security headers staan in `_headers` voor Cloudflare Pages en Netlify.
- Alle HTML-pagina's hebben een CSP meta-tag als vangnet voor simpele statische hosting.
- De lokaal gehoste Leaflet- en markercluster-assets hebben Subresource Integrity.
- Bezoekers sturen geen live Overpass- of andere externe API-zoekopdrachten vanuit Nook. OpenStreetMap-campings staan als statische snapshot in `data/`.
- Er staan geen API keys, tokens of secrets in de client.
- GPX-imports blijven lokaal in de browser.
- De site heeft geen bezoekersaccounts. Het feedbackformulier gebruikt een Pages Function met private KV-opslag en optionele server-side e-mailmeldingen. GPX-bestanden blijven lokaal.

## Uitgevoerde versterkingen

- `script-src` staat uitsluitend Nooks eigen scripts toe. De ongebruikte externe JavaScript-CDN is verwijderd uit de edge-headers en de CSP van alle HTML-pagina's.
- De feedbackfunctie accepteert alleen POST met JSON, controleert de herkomst en wijst ongeldige JSON-objecten af. De limiet van 8.000 UTF-8-bytes wordt tijdens het streamen afgedwongen, voordat het complete bericht kan worden gebufferd. Niet-POST-methodes geven JSON met status 405.
- API-reacties hebben `no-store`, `nosniff`, een beperkende CSP, dezelfde-origin resource policy en geen referrergegevens. Er is geen endpoint voor het openbaar uitlezen van feedback.
- Honeypot en de bestaande limiet van vijf berichten per IP per uur blijven actief. KV biedt geen sterke atomaire wereldwijde rate limiting; dit is geen vervanging voor een Cloudflare-regel tegen grote aantallen aanvragen.
- In Cloudflare Pages is `fail_open` voor zowel Production als Preview op `false` gezet. Bij problemen met het toepassen van de functionconfiguratie valt het verzoek niet ongemerkt terug naar statische afhandeling. De bestaande KV- en mailbindings zijn behouden.

## Aanvullend in het domein/account

Het beschikbare token heeft Pages-toegang maar kan de domeinzone niet uitlezen of wijzigen. Zone-WAF, minimale TLS-versie en bot-/rate-limitinstellingen zijn daarom niet als gecontroleerd of ingeschakeld aangemerkt.

Zinvolle vervolgstappen in het eigen Cloudflare-dashboard:

- Activeer de beschikbare beheerde WAF-regels en laat de automatische DDoS-bescherming actief.
- Beperk overmatig POST-verkeer specifiek op `/api/feedback`, met een drempel passend bij het Cloudflare-plan. Gebruik een tijdelijke blokkade/rate-limitreactie; een browserchallenge midden in een JSON-fetch werkt niet als gewoon feedbackantwoord. Pas deze regel niet toe op alle kaartdata of kaarttegels.
- Beveilig zowel Cloudflare als GitHub met sterke MFA/passkeys. Compromittering van die accounts blijft een relevant risico voor een statische website.

Nook heeft geen PHP-installatie, SQL-server of accountwachtwoorden om te patchen. Publieke kaartbestanden zijn bedoeld om gelezen te worden; ruime toegang tot die openbare assets is geen toegang tot de private feedbackopslag.

## Waar staat de data?

Bij launch is dit het model:

- Bij jou gehost: `public-data.js`, `data/*.json`, HTML, CSS, JS, PWA-iconen en favicon.
- Extern geladen als asset: kaarttegels van OpenStreetMap en fonts van Google Fonts (Leaflet, markercluster en Supercluster worden met hun licenties lokaal geserveerd; Leaflet/markercluster behouden SRI), en bronfoto's die al door de bron als publieke afbeelding worden gepubliceerd.
- Alleen als link: bronpagina's voor contact, reservering, actuele omstandigheden en eventuele licenties.
- Alleen server-side: private feedback-KV en de mailsecret. Niet in de browser: API-secrets, betaalgegevens, privé-hostprofielen of GPX-bestanden van andere bezoekers.

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
