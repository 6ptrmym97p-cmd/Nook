# GPX-importtellingen

Nook telt sinds deze release iedere geslaagde GPX-bestandsimport eenmaal. Track-, route- en waypointbestanden tellen mee; ongeldige of lege bestanden, herladen en het herstellen van eerder opgeslagen routes niet. Een import die alleen tijdelijk in het geheugen past telt ook: de bezoeker kan de route dan gebruiken.

## Waar vind je het aantal?

Cloudflare-dashboard → Storage & databases → KV → **nook-usage** → KV Pairs. Iedere sleutel `gpx-import:YYYY-MM-DD:…` staat voor één import. Filter op `gpx-import:2026-10-25:` voor die UTC-dag. Dit is een privé-opslag in jouw account, geen openbaar overzicht.

Voor een tabel met aantallen per UTC-dag en het totaal:

```sh
node scripts/usage-report.mjs
```

In een Node 24-cloudomgeving met een verplichte HTTPS-proxy: `NODE_USE_ENV_PROXY=1 node scripts/usage-report.mjs`.

Dit gebruikt `CLOUDFLARE_API_TOKEN` uit de omgeving, met toegang tot het Pages-project en Workers KV Storage Read. Het token komt nooit in de browser. Het rapport doorloopt alle pagina's met maximaal 1.000 sleutels per API-antwoord. De bewaarde tellingen verlopen na 90 dagen; het totaal is dus geen levenslang totaal. KV is eventually consistent: recente imports kunnen even ontbreken.

## Privacy en beperkingen

- De browser stuurt één lege POST naar `/api/gpx-import`, zonder cookies, referrer, bestandsnaam, route, coördinaten, bestandsgrootte of bezoeker-ID.
- De functie slaat uitsluitend `1` op onder de UTC-dag en een willekeurig eenmalig event-ID. Dat ID wordt niet naar de browser gestuurd en koppelt geen bezoeken aan elkaar. Er wordt geen IP, user-agent, land of exact tijdstip door de functie opgeslagen. Cloudflare verwerkt als infrastructuuraanbieder wel de normale netwerkgegevens van het verzoek.
- Geen analytische cookies, localStorage-identificatie of fingerprinting. De bestaande lokale opslag van routes en instellingen blijft bestaan voor de werking van de app.
- Do Not Track en Global Privacy Control worden gerespecteerd. Offline imports en geblokkeerde of mislukte verzoeken worden niet later opnieuw verstuurd. Dit voorkomt een wachtrij met bezoekgegevens, maar onderschat het gebruik.
- Het aantal betreft **imports, niet unieke mensen**. Dezelfde persoon kan meerdere bestanden importeren. Automatisering kan ook importeren; dit is geen bewijs van menselijke bezoeken. Het endpoint vereist dezelfde Origin en een lege POST, maar is geen fraudebestendige teller; een directe client kan headers nabootsen.
- Er is bewust geen KV-read/modify/write-dagteller: gelijktijdige imports zouden verloren kunnen gaan. Afzonderlijke entries worden bij het rapport opgeteld.
- Importeren blijft werken als tellen mislukt. Er worden geen e-mails verstuurd en er is geen openbare API om de tellingen uit te lezen. Alleen productie heeft een USAGE-binding.
- Informatie voor bezoekers staat op Over in alle 21 interfacetalen. Historisch gebruik van vóór deze release is niet te reconstrueren.

## Verificatie

```sh
node --test scripts/test-usage.mjs
NOOK_TEST_URL=http://127.0.0.1:8087/ node scripts/test-usage-browser.cjs
```

De browsertest onderschept alle telverzoeken en voegt dus geen testimports toe aan productie. Hij controleert ook ongeldige bestanden, herstel na herladen, een mislukte telverbinding en Global Privacy Control.
