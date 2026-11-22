# Vindbaarheid: zoekmachines, AI-assistenten en gedeelde links

Nook is een kaart-app; de meeste inhoud verschijnt pas na JavaScript. Google en Bing voeren dat uit, maar AI-crawlers (ChatGPT Search, Claude, Perplexity) en linkvoorvertoningen (WhatsApp, LinkedIn) lezen vrijwel alleen de statische HTML. Deze bestanden en gegenereerde pagina's geven hen houvast. Het uiterlijk, de titels en de navigatie van de bestaande pagina's blijven ongewijzigd.

## Vaste bestanden

- `robots.txt`: alle openbare pagina's en kaartdata mogen geïndexeerd worden; `/api/` niet. `Content-Signal: search=yes, ai-input=yes` staat zoekresultaten en AI-antwoorden met bronvermelding toe. Over AI-training (`ai-train`) zegt het bestand bewust niets. Cloudflare zet zijn eigen uitleg over contentsignalen bovenaan het gepubliceerde bestand.
- `llms.txt`: een korte, feitelijke beschrijving van Nook voor AI-assistenten, met pagina's, landengidsen en bronnen. Werk de aantallen bij na een nieuwe datasetversie.
- `og-image.jpg` (1200×630): de voorvertoning bij gedeelde links. Houd het bestand onder ~300 kB; WhatsApp laat grotere afbeeldingen soms weg.
- In iedere HTML-pagina: `canonical` naar `https://ridewithnook.com/…` (ook voor `www` en `.html`-varianten), `hreflang`-verwijzingen naar de Nederlandse versie, een Engelse `description` en Open Graph-/Twitter-tags. `index.html` bevat daarnaast schema.org-gegevens (`WebSite` + `WebApplication`) als JSON-LD. Dat is een datablok, geen uitvoerbaar script; de CSP `script-src 'self'` blijft ongewijzigd.

## Gegenereerd tijdens de build

`scripts/build-pages.mjs` roept `scripts/prerender.mjs` aan. Die maakt in `dist/`:

- **Nederlandse pagina's** onder `/nl/` (`/nl/`, `/nl/regels`, `/nl/netwerken`, `/nl/routebronnen`, `/nl/over`). Dit zijn de bestaande pagina's waarop vooraf dezelfde vertaalregels zijn toegepast als `i18n.js` in de browser doet, met `locales/nl.json`. Ze zien er dus identiek uit aan `?lang=nl`, maar zoekmachines zien direct Nederlandse tekst. Een `<base href="/">` laat alle assets en kaartdata vanaf de root laden; interne links wijzen naar de Nederlandse versie.
- **Landengidsen** voor de elf landen uit de Regels-matrix, in het Engels (`/wild-camping/norway`) en Nederlands (`/nl/wildkamperen/noorwegen`). Ze hergebruiken de rij uit de landenmatrix, de bijbehorende regiogids en de bronnentabel van Netwerken, met de aantallen van dat land uit `data/map-index.json`. Ze gebruiken het raster en de stijl van de Regels-pagina en zijn alleen via sitemap, `llms.txt` en elkaar gelinkt; de navigatie van de site is niet uitgebreid.
- **`sitemap.xml`** met alle 32 URL's en hun taalvarianten. Er staat geen sitemap meer in de repository-root.

Inhoud wijzigen gaat dus via de bestaande HTML-pagina's en vertaalbestanden; de build neemt de wijziging automatisch over. Teksten die alleen op de landengidsen staan (kop, inleiding, beschrijving) staan in `COPY` in `scripts/prerender.mjs`. Lokaal bekijken: `node scripts/build-pages.mjs` en `dist/` serveren met extensieloze URL's (zoals Cloudflare Pages doet).

## Taalgedrag in de browser

Gegenereerde pagina's hebben `data-prerendered-lang`. `i18n.js` geeft die taal voorrang boven een opgeslagen taalvoorkeur (alleen `?lang=` gaat erboven) en voegt daar geen `?lang=` aan links toe. Kies je op zo'n pagina een taal waarvoor een `hreflang`-variant bestaat, dan ga je naar die pagina op hetzelfde domein; voor andere talen blijft `?lang=` werken. Op de bestaande rootpagina's is het taalgedrag ongewijzigd.

## Controles

```sh
node --test scripts/test-prerender.mjs
node scripts/build-pages.mjs && node scripts/test-prerender-browser.cjs
```

De browsertest vergelijkt iedere `/nl/`-pagina met de runtimevertaling van de Engelse pagina, laadt alle sitemap-pagina's (zonder ontbrekende bestanden of scriptfouten), controleert dat de Nederlandse kaart zijn data uit `/data/` haalt en dat landengidsen het Regels-ontwerp gebruiken.

## Eenmalig door de eigenaar

1. **Google Search Console**: voeg het domein `ridewithnook.com` toe (verificatie via Cloudflare/DNS) en dien `https://ridewithnook.com/sitemap.xml` in.
2. **Bing Webmaster Tools**: importeer de site vanuit Search Console. ChatGPT Search en Copilot gebruiken de Bing-index.
