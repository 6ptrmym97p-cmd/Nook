# Cloudflare Pages en eigen domein

Nook gebruikt `ridewithnook.com`. De website draait volledig statisch op Cloudflare Pages; een lokale computer of backend is niet nodig. GitHub is de bron voor publicatie.

## Buildinstellingen

- Repository: `6ptrmym97p-cmd/Nook`
- Production branch: `main`
- Framework preset: `None`
- Build command: `node scripts/build-pages.mjs`
- Build output directory: `dist`
- Root directory: leeg (repository root)
- Environment variables / secrets: niet nodig

De build kopieert de bestaande HTML, CSS, JavaScript, iconen, manifest, `_headers`, `data/` en `vendor/` ongewijzigd naar `dist/`. Documentatie, ontwikkelscripts, Git-metadata en het oude GitHub Pages-bestand `CNAME` worden niet gepubliceerd. Er zijn geen npm-dependencies en er worden tijdens de build geen externe databronnen opgehaald.

## GitHub-integratie

Gebruik de officiële Git-integratie van Cloudflare Pages. Productiedeployments vanaf `main` moeten ingeschakeld zijn. Een push naar `main` start dan automatisch een build en publiceert de nieuwe versie na een succesvolle build. De build en hosting draaien bij Cloudflare, onafhankelijk van een MacBook.

## Eigen domein

Voeg `ridewithnook.com` toe onder **Workers & Pages → Nook → Custom domains**. Laat Cloudflare het bijbehorende CNAME-record naar het Pages-project instellen. Voeg ook `www.ridewithnook.com` toe als dat adres gebruikt wordt. Koppel het domein eerst in Pages; alleen een los DNS-record is niet voldoende.

Vervang alleen conflicterende webrecords voor deze hostnamen. Mail- en verificatierecords blijven staan. De eerdere GitHub Pages A-records (`185.199.*.153`) zijn voor deze Pages-hosting niet nodig. Het bestaande `CNAME`-bestand is historische GitHub Pages-configuratie; Cloudflare Pages gebruikt zijn eigen custom-domaininstellingen.

Cloudflare verzorgt HTTPS. Controleer dat de custom domain-status actief is en dat de website via HTTPS opent voordat je de koppeling als voltooid beschouwt.

## Routing en caching

Dit is een website met meerdere HTML-pagina's, geen SPA-router. Relatieve links en `?route=import` / `#route-import` werken vanaf de domeinroot. Cloudflare kan `.html`-adressen naar hun extensieloze URL omleiden.

De bestaande serviceworker bewaart de app-shell en bekeken kaartdata offline. Bij wijzigingen aan app-assets moeten de versies in HTML en `APP_SHELL` en de `SHELL_CACHE`-naam samen worden bijgewerkt, zoals in de bestaande releasewerkwijze. Bij een nieuwe dataset moeten ook de dataversies en de gedeelde runtime-cachenaam in `service-worker.js` en `map-worker.js` worden bijgewerkt. Een GitHub-deployment op zichzelf wist geen browsercaches.

## Controle

```sh
node scripts/build-pages.mjs
node --test scripts/test-service-worker.mjs scripts/test-map-data.mjs
```

Controleer na publicatie de kaart, filters, plekdetails, navigatie, GPX-import, offline herladen en HTTP-securityheaders. Controleer vervolgens met een nieuwe commit dat Cloudflare daadwerkelijk een automatische productiedeployment start.

Bronnen: [Cloudflare Git-integratie](https://developers.cloudflare.com/pages/get-started/git-integration/) en [custom domains](https://developers.cloudflare.com/pages/configuration/custom-domains/).
