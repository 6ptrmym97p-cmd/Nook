# Security policy

Nook is een statische, client-side website. Er zijn geen gebruikersaccounts, formulieren, cookies, betalingen of server-side persoonsgegevens in deze repository.

## Wat bezoekers lokaal delen

- Locatie: alleen na browsertoestemming, alleen in de browser gebruikt.
- GPX-routes: blijven in `localStorage` of `sessionStorage`.
- OpenStreetMap-data: staat als statische momentopname in `data/`; bezoekers sturen geen live Overpass-zoekopdrachten vanuit Nook.

## Meldingen

Meld securityproblemen niet via een publieke post. Gebruik een privébericht aan de beheerder of maak een private security advisory in de repository voordat je details openbaar deelt.

## Host-hardening

Gebruik voor publieke hosting bij voorkeur Cloudflare Pages, Netlify, of GitHub Pages achter Cloudflare. De repository bevat een `_headers` bestand voor hosts die custom headers ondersteunen. GitHub Pages zelf is statische hosting en past `_headers` niet als response-headerconfig toe.

Zie ook `docs/launch-security.md` voor de publicatiechecklist en rate-limitadvies.
