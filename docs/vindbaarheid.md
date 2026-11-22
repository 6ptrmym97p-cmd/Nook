# Vindbaarheid: zoekmachines, AI-assistenten en gedeelde links

Nook is een kaart-app; de meeste inhoud verschijnt pas na JavaScript. Google en Bing voeren dat uit, maar AI-crawlers (ChatGPT Search, Claude, Perplexity) en linkvoorvertoningen (WhatsApp, LinkedIn) lezen vrijwel alleen de statische HTML. Deze bestanden en gegenereerde pagina's geven hen houvast. Het uiterlijk, de titels en de navigatie van de bestaande pagina's blijven ongewijzigd.

## Vaste bestanden

- `robots.txt`: alle openbare pagina's en kaartdata mogen geïndexeerd worden; `/api/` niet. `Content-Signal: search=yes, ai-input=yes` staat zoekresultaten en AI-antwoorden met bronvermelding toe. Over AI-training (`ai-train`) zegt het bestand bewust niets. Cloudflare zet zijn eigen uitleg over contentsignalen bovenaan het gepubliceerde bestand.
- `llms.txt`: een korte, feitelijke beschrijving van Nook voor AI-assistenten, met pagina's, landengidsen en bronnen. Werk de aantallen en de landenlijst bij na een nieuwe dataset of nieuwe landen in `country-rules.js`.
- `og-image.jpg` (1200×630): de voorvertoning bij gedeelde links. Houd het bestand onder ~300 kB; WhatsApp laat grotere afbeeldingen soms weg.
- In iedere HTML-pagina: `canonical` naar `https://ridewithnook.com/…` (ook voor `www` en `.html`-varianten), `hreflang`-verwijzingen naar de Nederlandse versie, een Engelse `description` en Open Graph-/Twitter-tags. `index.html` bevat daarnaast schema.org-gegevens (`WebSite` + `WebApplication`) als JSON-LD. Dat is een datablok, geen uitvoerbaar script; de CSP `script-src 'self'` blijft ongewijzigd.

## Gegenereerd tijdens de build

`scripts/build-pages.mjs` roept `scripts/prerender.mjs` aan. Die maakt in `dist/`:

- **Nederlandse pagina's** onder `/nl/` (`/nl/`, `/nl/regels`, `/nl/routebronnen`, `/nl/over`). Dit zijn de bestaande pagina's waarop vooraf dezelfde vertaalregels zijn toegepast als `i18n.js` in de browser doet, met `locales/nl.json`. Ze zien er identiek uit aan `?lang=nl`, maar zoekmachines zien direct Nederlandse tekst. Een `<base href="/">` laat alle assets en kaartdata vanaf de root laden; interne links wijzen naar de Nederlandse versie. `netwerken.html` is een doorverwijzing naar Over en krijgt geen eigen versie.
- **Landengidsen** voor ieder land in `country-rules.js` (nu 35), in het Engels (`/wild-camping/norway`) en Nederlands (`/nl/wildkamperen/noorwegen`). Zo'n gids is de Kampeerregels-pagina met dat land al ingevuld: de landkaart en regio's zijn exact de markup die `rules.js` maakt (zelfde templates, statussen en iconen, uit `rules.js` gelezen), aangevuld met een kop, de aantallen plekken per bron in dat land (uit `data/map-index.json`, in de lijststijl van Over) en links naar de andere landen. De zoekbalk blijft werken. `rules.js` leest het land uit `data-country` en zet dan geen `?country=` in de URL. De gidsen zijn alleen via sitemap, `llms.txt` en elkaar gelinkt; de navigatie is niet uitgebreid.
- **`sitemap.xml`** met alle URL's (vier hoofdpagina's, hun Nederlandse versies en 2 × 35 landengidsen) en hun taalvarianten. Er staat geen sitemap meer in de repository-root.

Inhoud wijzigen gaat via de bestaande HTML-pagina's, `country-rules.js` en de vertaalbestanden; de build neemt het automatisch over. Teksten die alleen op de landengidsen staan (kop, inleiding, beschrijving) staan in `COPY` in `scripts/prerender.mjs`. Verandert de opbouw van `regels.html` of de templates in `rules.js`, dan stopt de build met een duidelijke fout in plaats van een halve pagina te publiceren. Lokaal bekijken: `node scripts/build-pages.mjs` en `dist/` serveren met extensieloze URL's (zoals Cloudflare Pages doet).

## Taalgedrag in de browser

Gegenereerde pagina's hebben `data-prerendered-lang`. `i18n.js` geeft die taal voorrang boven een opgeslagen taalvoorkeur (alleen `?lang=` gaat erboven) en voegt daar geen `?lang=` aan links toe. Kies je op zo'n pagina een taal waarvoor een `hreflang`-variant bestaat, dan ga je naar die pagina op hetzelfde domein; voor andere talen blijft `?lang=` werken. Op de bestaande rootpagina's is het taalgedrag ongewijzigd.

## Controles

```sh
node --test scripts/test-prerender.mjs
node scripts/build-pages.mjs && node scripts/test-prerender-browser.cjs
```

De browsertest vergelijkt iedere `/nl/`-pagina met de runtimevertaling van de Engelse pagina, laadt alle sitemap-pagina's (zonder ontbrekende bestanden of scriptfouten), controleert dat de Nederlandse kaart zijn data uit `/data/` haalt, en dat een landengids het ontwerp van Kampeerregels gebruikt en dezelfde landkaart en regio's toont als `rules.js` zelf rendert.

## Eenmalig door de eigenaar

1. **Google Search Console**: voeg het domein `ridewithnook.com` toe (verificatie via Cloudflare/DNS) en dien `https://ridewithnook.com/sitemap.xml` in.
2. **Bing Webmaster Tools**: importeer de site vanuit Search Console. ChatGPT Search en Copilot gebruiken de Bing-index.
