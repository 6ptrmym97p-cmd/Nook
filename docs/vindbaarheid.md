# Vindbaarheid: zoekmachines, AI-assistenten en gedeelde links

Nook is een kaart-app; de meeste inhoud verschijnt pas na JavaScript. Google en Bing voeren dat uit, maar AI-crawlers (ChatGPT Search, Claude, Perplexity) en linkvoorvertoningen (WhatsApp, LinkedIn) lezen vrijwel alleen de statische HTML. Deze bestanden geven hen houvast.

## Bestanden

- `robots.txt`: alle openbare pagina's en kaartdata mogen geïndexeerd worden; `/api/` niet. `Content-Signal: search=yes, ai-input=yes` staat zoekresultaten en AI-antwoorden met bronvermelding toe. Over AI-training (`ai-train`) zegt het bestand bewust niets. Cloudflare zet zijn eigen uitleg over contentsignalen bovenaan het gepubliceerde bestand.
- `sitemap.xml`: de vijf pagina's met hun extensieloze URL (Pages leidt `.html` om). Werk `lastmod` bij als een pagina inhoudelijk verandert.
- `llms.txt`: een korte, feitelijke beschrijving van Nook voor AI-assistenten, met pagina's en bronnen. Werk de aantallen bij na een nieuwe datasetversie.
- `og-image.jpg` (1200×630): de voorvertoning bij gedeelde links. Houd het bestand onder ~300 kB; WhatsApp laat grotere afbeeldingen soms weg.
- In iedere HTML-pagina: `canonical` naar `https://ridewithnook.com/…` (ook voor `www` en `.html`-varianten), een Engelse `description` en Open Graph-/Twitter-tags. `index.html` bevat daarnaast schema.org-gegevens (`WebSite` + `WebApplication`) als JSON-LD. Dat is een datablok, geen uitvoerbaar script; de CSP `script-src 'self'` blijft ongewijzigd.

`scripts/build-pages.mjs` publiceert `.txt`-, `.xml`- en `.jpg`-bestanden uit de root mee naar `dist/`.

## Bewust nog niet gedaan

- De paginatitels (`Rules | Nook` enz.) worden vertaald via `data-i18n-text`. Een beschrijvender titel vraagt nieuwe vertalingen in alle 21 talen.
- Talen bestaan alleen via `?lang=` en JavaScript. Er zijn daarom geen `hreflang`-varianten; de canonical wijst naar de Engelse standaard-URL. Eigen, vooraf gerenderde taalpagina's (bijvoorbeeld `/nl/`) zijn de volgende stap voor anderstalige zoekresultaten.

## Eenmalig door de eigenaar

1. **Google Search Console**: voeg het domein `ridewithnook.com` toe (verificatie via Cloudflare/DNS) en dien `https://ridewithnook.com/sitemap.xml` in.
2. **Bing Webmaster Tools**: importeer de site vanuit Search Console. ChatGPT Search en Copilot gebruiken de Bing-index.
