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

## Feedbackformulier (tips, klachten, bugs)

De knop **Feedback** stuurt meldingen naar de Pages Function `functions/api/feedback.js`, die ze bewaart in Cloudflare KV. Cloudflare Pages pakt de map `functions/` automatisch op. Eenmalig instellen:

1. **Storage & Databases → KV → Create namespace**, naam bijvoorbeeld `nook-feedback`.
2. **Workers & Pages → Nook → Settings → Bindings → Add → KV namespace**: variabelenaam `FEEDBACK`, namespace `nook-feedback`. Doe dit voor Production (en eventueel Preview).
3. Start een nieuwe deployment (**Deployments → … → Retry deployment**) zodat de koppeling actief wordt.

Zolang de koppeling ontbreekt, krijgt een bezoeker de melding dat feedback nog niet is ingesteld. Meldingen lezen: open de namespace onder **KV**; sleutels `feedback:<tijdstip>:<id>` staan op datum, met soort en een voorvertoning als metadata. Het IP-adres wordt niet opgeslagen; alleen gehasht en één uur lang als limiet van vijf berichten per bezoeker per uur.

Controleer de koppeling na de nieuwe deployment met onderstaand onvolledige bericht. Dit slaat niets op: **400** met `Schrijf iets meer in je bericht.` betekent dat de functie en opslagkoppeling beschikbaar zijn; **503** met `Feedback is nog niet ingesteld.` betekent dat `FEEDBACK` nog ontbreekt in de actieve productie-deployment. Een GET in de adresbalk is geen geldige controle: die kan de gewone website teruggeven.

```sh
curl -i https://ridewithnook.com/api/feedback \
  -H 'Content-Type: application/json' \
  -H 'Origin: https://ridewithnook.com' \
  --data '{"kind":"bug","message":""}'
```

Controleer daarna één echte inzending via het formulier en zoek die op in de KV-namespace. De bezoeker ziet pas een bevestiging wanneer de server `{ "ok": true }` terugstuurt na het opslaan.

### Feedback per e-mail ontvangen

Het formulier kan na het opslaan een melding naar de beheerder mailen via [Resend](https://resend.com). Een bezoeker hoeft geen mailprogramma te openen en het eigen e-mailadres blijft optioneel. Stel onder **Workers & Pages → Nook → Settings → Variables and Secrets** voor Production in:

- `RESEND_API_KEY`: een **secret** met een Resend API-sleutel die e-mail mag versturen.
- `FEEDBACK_EMAIL_TO`: het e-mailadres van de beheerder. Dit adres staat alleen op de server, niet in de openbare broncode of de formulierreactie.
- `FEEDBACK_EMAIL_FROM`: optioneel een afzender op een in Resend geverifieerd domein, bijvoorbeeld `Nook <feedback@jouw-domein.nl>`.

Zonder eigen afzender gebruikt Nook `Nook feedback <onboarding@resend.dev>`. Daarmee mag Resend alleen naar het e-mailadres van het Resend-account sturen: maak het account dus met het gewenste ontvangstadres aan. Voor andere ontvangers moet eerst een eigen verzenddomein worden geverifieerd. Er is geen DNS-wijziging nodig voor de standaardafzender.

Publiceer na het wijzigen van deze instellingen een nieuwe deployment. De melding bevat het bericht, de soort feedback en technische context. Als de bezoeker een e-mailadres invult, wordt dat het Reply-To-adres. Mails gebruiken gewone tekst en de ontvanger wordt uitsluitend door de serverinstellingen bepaald.

De e-mail wordt op de achtergrond verstuurd nadat feedback veilig is opgeslagen. Bij een storing krijgt de bezoeker gewoon een bevestiging en blijft het bericht in KV staan. In elk nieuw feedbackrecord staat `notification.status`: `not_configured`, `pending`, `sent` of `failed`. `sent` betekent dat Resend het bericht heeft aangenomen; uiteindelijke bezorging kun je in het Resend-dashboard bekijken. Mislukte meldingen worden niet automatisch opnieuw verstuurd en zijn via KV te verwerken. Controleer na het activeren één echte inzending zowel in KV als in de inbox.

## Controle

```sh
node scripts/build-pages.mjs
node --test scripts/test-service-worker.mjs scripts/test-map-data.mjs scripts/test-feedback.mjs
```

Controleer na publicatie de kaart, filters, plekdetails, navigatie, GPX-import, offline herladen en HTTP-securityheaders. Controleer vervolgens met een nieuwe commit dat Cloudflare daadwerkelijk een automatische productiedeployment start.

Bronnen: [Cloudflare Git-integratie](https://developers.cloudflare.com/pages/get-started/git-integration/) en [custom domains](https://developers.cloudflare.com/pages/configuration/custom-domains/).
