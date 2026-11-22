// Build-time static pages for search engines, AI assistants and link previews.
// The visible design is unchanged: Dutch pages are the existing pages with the
// existing Dutch translations applied in advance, and the country pages reuse the
// markup of the rules and sources pages. Runtime i18n.js keeps working on top.
import fs from "node:fs";
import path from "node:path";

export const ORIGIN = "https://ridewithnook.com";
export const PAGES = ["index", "regels", "netwerken", "routebronnen", "over"];
const VOID = new Set(["area", "base", "br", "col", "embed", "hr", "img", "input", "link", "meta", "param", "source", "track", "wbr"]);
const RAW = new Set(["script", "style"]);
const RCDATA = new Set(["title", "textarea"]);
const TOKEN = /<!--[\s\S]*?-->|<![^>]*>|<\/([a-zA-Z][\w:-]*)\s*>|<([a-zA-Z][\w:-]*)((?:\s+[^\s"'>/=]+(?:\s*=\s*(?:"[^"]*"|'[^']*'|[^\s"'=<>`]+))?)*)\s*(\/?)>|[^<]+|</g;
const ATTR = /(\s+)([^\s"'>/=]+)(?:(\s*=\s*)(?:"([^"]*)"|'([^']*)'|([^\s"'=<>`]+)))?/g;
const NAMED = { amp: "&", lt: "<", gt: ">", quot: '"', apos: "'", nbsp: " " };

export const decode = (value) => value.replace(/&(#x[0-9a-f]+|#\d+|[a-z]+);/gi, (match, entity) => entity[0] === "#"
  ? String.fromCodePoint(entity[1].toLowerCase() === "x" ? parseInt(entity.slice(2), 16) : parseInt(entity.slice(1), 10))
  : NAMED[entity.toLowerCase()] ?? match);
export const escapeText = (value) => String(value).replace(/[&<>]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;" })[c]);
export const escapeAttr = (value) => String(value).replace(/[&"<>]/g, (c) => ({ "&": "&amp;", '"': "&quot;", "<": "&lt;", ">": "&gt;" })[c]);

function parseAttrs(source) {
  const attrs = [];
  for (const m of source.matchAll(ATTR)) {
    attrs.push({ name: m[2].toLowerCase(), raw: m[0], value: decode(m[4] ?? m[5] ?? m[6] ?? ""), changed: false });
  }
  return attrs;
}

/**
 * Apply the runtime translateDocument() rules of i18n.js to an HTML string:
 * direct, non-empty text nodes of [data-i18n-text] elements, [data-i18n-attrs]
 * attributes and [data-i18n-number] contents. `rewriteHref` may map <a href>.
 */
export function translateHtml(html, { dictionary = {}, locale = "en", rewriteHref } = {}) {
  const text = (key) => (Object.prototype.hasOwnProperty.call(dictionary, key) ? dictionary[key] : key).replace(/\{\d+\}/g, "");
  const format = new Intl.NumberFormat(locale === "zh" ? "zh-CN" : locale);
  const stack = [];
  let out = "";
  let skipUntil = null; // { name, depth } while replacing a data-i18n-number element
  TOKEN.lastIndex = 0;
  let m;
  const handleText = (raw) => {
    const parent = stack[stack.length - 1];
    if (!parent?.keys || !decode(raw).trim()) return raw;
    const key = parent.keys[parent.index++];
    if (!key) return raw;
    return raw.match(/^\s*/)[0] + escapeText(text(key)) + raw.match(/\s*$/)[0];
  };
  while ((m = TOKEN.exec(html))) {
    const [token, endName, startName, attrSource, selfClose] = m;
    if (skipUntil) {
      if (startName && startName.toLowerCase() === skipUntil.name && !VOID.has(skipUntil.name)) skipUntil.depth++;
      if (endName && endName.toLowerCase() === skipUntil.name && --skipUntil.depth === 0) { out += token; skipUntil = null; }
      continue;
    }
    if (endName) {
      const name = endName.toLowerCase();
      const at = stack.map((e) => e.name).lastIndexOf(name);
      if (at >= 0) stack.length = at;
      out += token;
    } else if (startName) {
      const name = startName.toLowerCase();
      const attrs = parseAttrs(attrSource);
      const get = (n) => attrs.find((a) => a.name === n);
      const i18nAttrs = get("data-i18n-attrs");
      if (i18nAttrs) {
        for (const [attribute, key] of Object.entries(JSON.parse(i18nAttrs.value))) {
          const target = get(attribute.toLowerCase());
          if (target) { target.value = text(key); target.changed = true; }
          else attrs.push({ name: attribute, value: text(key), changed: true, raw: "" });
        }
      }
      const href = get("href");
      if (name === "a" && href && rewriteHref) {
        const next = rewriteHref(href.value);
        if (next !== href.value) { href.value = next; href.changed = true; }
      }
      const tag = attrs.some((a) => a.changed)
        ? `<${startName}${attrs.map((a) => (a.changed ? ` ${a.name}="${escapeAttr(a.value)}"` : a.raw)).join("")}${selfClose ? " /" : ""}>`
        : token;
      out += tag;
      const numberAttr = get("data-i18n-number");
      if (numberAttr && !VOID.has(name)) {
        out += escapeText(format.format(Number(numberAttr.value)));
        skipUntil = { name, depth: 1 };
        continue;
      }
      if (RAW.has(name) || RCDATA.has(name)) {
        const close = html.toLowerCase().indexOf(`</${name}`, TOKEN.lastIndex);
        const end = close < 0 ? html.length : close;
        const content = html.slice(TOKEN.lastIndex, end);
        if (RCDATA.has(name)) {
          stack.push({ name, keys: get("data-i18n-text") ? JSON.parse(get("data-i18n-text").value) : null, index: 0 });
          out += handleText(content);
          stack.pop();
        } else out += content;
        TOKEN.lastIndex = end;
        continue;
      }
      if (!VOID.has(name)) {
        const keys = get("data-i18n-text");
        stack.push({ name, keys: keys ? JSON.parse(keys.value) : null, index: 0 });
      }
    } else if (token.startsWith("<!") || token.startsWith("<!--")) {
      out += token;
    } else {
      out += handleText(token);
    }
  }
  return out;
}

const cleanPath = (page, lang) => (lang === "en" ? "" : `/${lang}`) + (page === "index" ? "/" : `/${page}`);
const urlFor = (page, lang) => ORIGIN + cleanPath(page, lang);

/** Map an internal link of an original root page to the same page in `lang`. */
export function linkRewriter(lang, ownPath) {
  return (href) => {
    if (/^[a-z][a-z0-9+.-]*:|^\/\//i.test(href)) return href;
    if (href.startsWith("#")) return ownPath + href;
    const m = /^([a-z0-9-]+)\.html([?#].*)?$/i.exec(href);
    if (!m || !PAGES.includes(m[1])) return href;
    return cleanPath(m[1], lang) + (m[2] || "");
  };
}

function alternates(urls) {
  return Object.entries(urls).map(([lang, url]) => `    <link rel="alternate" hreflang="${lang}" href="${url}" />`)
    .concat(`    <link rel="alternate" hreflang="x-default" href="${urls.en}" />`).join("\n");
}

function setMeta(html, selector, value) {
  const re = new RegExp(`(<meta\\s+${selector}\\s+content=")[^"]*(")`);
  if (!re.test(html)) throw new Error(`Missing meta ${selector}`);
  return html.replace(re, `$1${escapeAttr(value)}$2`);
}

function finishHead(html, { lang, canonical, urls, title, description, ogTitle, imageAlt }) {
  let out = html.replace(/<html lang="[^"]*" dir="ltr">/, `<html lang="${lang}" dir="ltr" data-prerendered-lang="${lang}">`);
  out = out.replace(/<meta charset="UTF-8" \/>/, '<meta charset="UTF-8" />\n    <base href="/" />');
  if (title !== undefined) out = out.replace(/<title[^>]*>[\s\S]*?<\/title>/, `<title>${escapeText(title)}</title>`);
  if (description !== undefined) {
    out = out.replace(/<meta\s+name="description"[\s\S]*?\/>/, `<meta name="description" content="${escapeAttr(description)}" />`);
  }
  const finalDescription = decode(/<meta\s+name="description"\s+content="([^"]*)"/.exec(out)[1]);
  out = out.replace(/\s*<link rel="alternate" hreflang="[^"]*" href="[^"]*" \/>/g, "");
  out = out.replace(/<link rel="canonical" href="[^"]*" \/>/, `<link rel="canonical" href="${canonical}" />\n${alternates(urls)}`);
  out = setMeta(out, 'property="og:url"', canonical);
  out = setMeta(out, 'property="og:title"', ogTitle);
  out = setMeta(out, 'property="og:description"', finalDescription);
  if (imageAlt) out = setMeta(out, 'property="og:image:alt"', imageAlt);
  out = out.replace(/(<meta property="og:site_name" content="Nook" \/>)/, `$1\n    <meta property="og:locale" content="${lang === "nl" ? "nl_NL" : "en_GB"}" />`);
  if (!out.includes('data-prerendered-lang=') || !out.includes('<base href="/" />') || !out.includes(`rel="canonical" href="${canonical}"`)) {
    throw new Error("Could not prepare head for " + canonical);
  }
  return out;
}

const NL = {
  imageAlt: "Nook: vind een slaapplek op je fietsreis. Campings, shelters, hutten en gastvrije tuinen op één kaart.",
  pages: {
    index: { ogTitle: "Nook: slaapplekken voor bikepackers en fietsreizigers" },
    regels: {
      ogTitle: "Waar mag je overnachten? Regels voor wildkamperen per land | Nook",
      description: "Landenwijzer voor fietsers met een kleine tent: waar wildkamperen mag, gedoogd wordt of verboden is, met de hoofdregel en officiële bron per land.",
    },
    netwerken: {
      ogTitle: "Plekken en aanbieders op de Nook-kaart",
      description: "Alle bronnen op de Nook-kaart: OpenStreetMap-campings, CampWild-shelters, Ud i Naturen, hutten van Refuges.info en gastvrije tuinen van Welcome To My Garden, 1NITE TENT en Vrienden op de Fiets.",
    },
    routebronnen: { ogTitle: "Routebronnen voor fietsen en bikepacking | Nook" },
    over: {
      ogTitle: "Over Nook: slaapplekken voor mensen onderweg",
      description: "Nook helpt bikepackers en fietsreizigers een slaapplek langs hun route te vinden: één gratis kaart met officiële plekken, gastnetwerken, campings en je eigen GPX.",
    },
  },
};

const read = (root, file) => fs.readFileSync(path.join(root, file), "utf8");
const dictionaryFor = (root, lang) => (lang === "en" ? {} : JSON.parse(read(root, `locales/${lang}.json`)));

/** The five main pages in Dutch, e.g. dist/nl/regels.html served at /nl/regels. */
export function buildLanguagePages(root, outDir, lang = "nl") {
  const dictionary = dictionaryFor(root, lang);
  const written = [];
  for (const page of PAGES) {
    const source = read(root, `${page}.html`);
    const own = cleanPath(page, lang);
    let html = translateHtml(source, { dictionary, locale: lang, rewriteHref: linkRewriter(lang, own) });
    const meta = NL.pages[page];
    html = finishHead(html, {
      lang, canonical: urlFor(page, lang), urls: { en: urlFor(page, "en"), [lang]: urlFor(page, lang) },
      description: meta.description, ogTitle: meta.ogTitle, imageAlt: NL.imageAlt,
    });
    html = html.replace(/\s*<script type="application\/ld\+json">[\s\S]*?<\/script>/, "");
    const file = path.join(outDir, lang, page === "index" ? "index.html" : `${page}.html`);
    fs.mkdirSync(path.dirname(file), { recursive: true });
    fs.writeFileSync(file, html);
    written.push({ url: urlFor(page, lang), alternates: { en: urlFor(page, "en"), [lang]: urlFor(page, lang) } });
  }
  return written;
}

// Country guides: the countries of the rules matrix, each with its region guide.
export const COUNTRIES = {
  NL: { guides: ["regio-utrecht"] }, BE: { guides: ["regio-belgium-bivouac"] }, LU: { guides: ["regio-luxembourg"] },
  DE: { guides: ["regio-brandenburg"] }, DK: { guides: [] }, SE: { guides: ["regio-smaland", "regio-skane"] },
  NO: { guides: ["regio-hardangervidda"] }, FR: { guides: ["regio-france-bivouac"] }, CH: { guides: ["regio-swiss-alps"] },
  AT: { guides: ["regio-austria-alps"] }, IT: { guides: ["regio-italian-alps"] },
};
const PROVIDER_KIND = {
  "Ud i Naturen": "denmark", OpenStreetMap: "camping", "Refuges.info": "refuges", CampWild: "campwild",
  "Welcome To My Garden": "wtmg", "1NITE TENT": "nitetent", "Vrienden op de Fiets": "vodf",
};
const COPY = {
  en: {
    dir: "wild-camping",
    country: (code) => (code === "NL" ? "the Netherlands" : new Intl.DisplayNames(["en"], { type: "region" }).of(code)),
    title: (n) => `Wild camping in ${n} by bike: rules and places to sleep | Nook`,
    h1: (n) => `Wild camping in ${n}`,
    intro: (n, total) => `What cyclists with a small tent need to know about staying overnight in ${n}, with the official source and ${total} places to sleep on the Nook map.`,
    description: (n, total, status) => `Wild camping in ${n} on a bike trip: the main rule (${status}), the official source and ${total} campsites, huts, shelters and host gardens on the Nook map.`,
    ruleHeading: "Main rule and official source",
    placesHeading: (n) => `Places to sleep in ${n} on the map`,
    placesNote: "Numbers from the current Nook snapshot. Check availability, costs and rules with the provider.",
    otherHeading: "Other country guides",
    imageAlt: "Nook: find a place to sleep on your bike trip. Campsites, shelters, huts and host gardens on one map.",
  },
  nl: {
    dir: "nl/wildkamperen",
    country: (code) => new Intl.DisplayNames(["nl"], { type: "region" }).of(code),
    title: (n) => `Wildkamperen in ${n} met de fiets: regels en slaapplekken | Nook`,
    h1: (n) => `Wildkamperen in ${n}`,
    intro: (n, total) => `Wat je als fietser met een kleine tent moet weten over overnachten in ${n}, met de officiële bron en ${total} slaapplekken op de Nook-kaart.`,
    description: (n, total, status) => `Wildkamperen in ${n} tijdens een fietsreis: de hoofdregel (${status}), de officiële bron en ${total} campings, hutten, shelters en gastvrije tuinen op de Nook-kaart.`,
    ruleHeading: "Hoofdregel en officiële bron",
    placesHeading: (n) => `Slaapplekken in ${n} op de kaart`,
    placesNote: "Aantallen uit de huidige momentopname van Nook. Controleer beschikbaarheid, kosten en regels bij de aanbieder.",
    otherHeading: "Andere landen",
    imageAlt: NL.imageAlt,
  },
};
const slug = (value) => value.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase().replace(/^the\s+/, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

export function countryUrl(code, lang) {
  return `${ORIGIN}/${COPY[lang].dir}/${slug(COPY[lang].country(code))}`;
}

function extract(source, re, label) {
  const m = re.exec(source);
  if (!m) throw new Error(`Cannot find ${label}`);
  return m[0];
}

/** English and Dutch guide per country, e.g. /wild-camping/norway and /nl/wildkamperen/noorwegen. */
export function buildCountryPages(root, outDir) {
  const rules = read(root, "regels.html");
  const sources = read(root, "netwerken.html");
  const index = JSON.parse(read(root, "data/map-index.json"));
  const counts = {};
  for (const chunk of index.chunks) {
    counts[chunk.country] ??= {};
    counts[chunk.country][chunk.kind] = (counts[chunk.country][chunk.kind] || 0) + chunk.count;
  }
  const head = rules.slice(0, rules.indexOf("<main"));
  const tail = rules.slice(rules.indexOf("</main>") + "</main>".length);
  const principles = extract(rules, /<article class="rules-principles">[\s\S]*?<\/article>/, "rules principles");
  const rulesThead = extract(rules, /<thead role="rowgroup">[\s\S]*?<\/thead>/, "rules table head");
  const sourcesTable = extract(sources, /<table role="table" class="source-table">\s*<thead[\s\S]*?<\/table>/, "sources table");
  const sourcesThead = extract(sourcesTable, /<thead role="rowgroup">[\s\S]*?<\/thead>/, "sources table head");
  const sourceRows = [...sourcesTable.matchAll(/<tr role="row">(?:(?!<\/tr>)[\s\S])*data-i18n-number="\d+"[\s\S]*?<\/tr>/g)].map(([row]) => {
    const name = decode(/<a [^>]*>([^<]+)<\/a>/.exec(row)[1]);
    if (!PROVIDER_KIND[name]) throw new Error("Unknown provider " + name);
    return { kind: PROVIDER_KIND[name], row };
  });
  const disclaimer = extract(rules, /<p data-i18n-text="\[&quot;Summary for cyclists[\s\S]*?<\/p>/, "rules disclaimer");
  const written = [];
  for (const lang of ["en", "nl"]) {
    const copy = COPY[lang];
    const dictionary = dictionaryFor(root, lang);
    const format = new Intl.NumberFormat(lang);
    for (const code of Object.keys(COUNTRIES)) {
      const name = copy.country(code);
      const own = new URL(countryUrl(code, lang)).pathname;
      const row = extract(rules, new RegExp(`<tr role="row"><td role="cell" data-label="Country"[^>]*>${code}</td>[\\s\\S]*?</tr>`), `${code} rules row`);
      const statusKey = JSON.parse(decode(/class="status-chip[^"]*" data-i18n-text="([^"]*)"/.exec(row)[1]))[0];
      const status = Object.prototype.hasOwnProperty.call(dictionary, statusKey) ? dictionary[statusKey] : statusKey;
      const here = counts[code] || {};
      const total = format.format(Object.values(here).reduce((sum, n) => sum + n, 0));
      const rows = sourceRows.filter(({ kind }) => here[kind]).map(({ kind, row: r }) => r.replace(/data-i18n-number="\d+">[^<]*</, `data-i18n-number="${here[kind]}" style="white-space: nowrap">${here[kind]}<`));
      const guides = COUNTRIES[code].guides.map((id) => extract(rules, new RegExp(`<details class="region-guide" id="${id}">[\\s\\S]*?</details>`), id).replace('<details class="region-guide"', '<details open class="region-guide"'));
      const others = Object.keys(COUNTRIES).filter((c) => c !== code)
        .map((c) => `<a href="${new URL(countryUrl(c, lang)).pathname}">${escapeText(copy.country(c).replace(/^the /, "The "))}</a>`).join(" · ");
      // Same three-part grid as the rules page: header, rules layout (left), region guides (right).
      const main = `<main id="main-content" tabindex="-1" class="compact-main">
      <section class="compact-header">
        <div>
          <p class="eyebrow" data-i18n-text="[&quot;Country guide&quot;]">Country guide</p>
          <h1>${escapeText(copy.h1(name))}</h1>
        </div>
        <p>${escapeText(copy.intro(name, total))}</p>
      </section>
      <section class="rules-layout" aria-label="${escapeAttr(copy.ruleHeading)}">
        ${principles}
        <article class="source-table-card">
          <h2>${escapeText(copy.ruleHeading)}</h2>
          <table role="table" class="source-table rules-table">
            ${rulesThead}
            <tbody role="rowgroup">
              ${row}
            </tbody>
          </table>
          ${disclaimer.replace("<p ", '<p class="page-note" ')}
          <h2 id="places-title" style="margin-top: 22px">${escapeText(copy.placesHeading(name))}</h2>
          <p class="page-note">${escapeText(copy.placesNote)}</p>
          <table role="table" class="source-table" aria-labelledby="places-title">
            ${sourcesThead}
            <tbody role="rowgroup">
              ${rows.join("\n              ")}
            </tbody>
          </table>
          <p><a class="info-link" href="index.html" data-i18n-text="[&quot;Open the map&quot;]">Open the map <span>→</span></a></p>
        </article>
      </section>
      <section class="region-guide-section" aria-labelledby="${guides.length ? "region-guide-title" : "other-countries-title"}">${guides.length ? `
        <h2 id="region-guide-title" data-i18n-text="[&quot;Background by region&quot;]">Background by region</h2>
        <div class="region-guide-list">
          ${guides.join("\n          ")}
        </div>` : ""}
        <h2 id="other-countries-title"${guides.length ? ' style="margin-top: 22px"' : ""}>${escapeText(copy.otherHeading)}</h2>
        <p class="page-note">${others}</p>
        <p class="microcopy"><a href="regels.html" data-i18n-text="[&quot;Rules for free camping and permission →&quot;]">Rules for free camping and permission →</a></p>
      </section>
    </main>`;
      let html = translateHtml(head + main + tail, { dictionary, locale: lang, rewriteHref: linkRewriter(lang, own) });
      const urls = { en: countryUrl(code, "en"), nl: countryUrl(code, "nl") };
      html = finishHead(html, {
        lang, canonical: urls[lang], urls, title: copy.title(name), description: copy.description(name, total, status.toLowerCase()),
        ogTitle: copy.title(name), imageAlt: copy.imageAlt,
      });
      const file = path.join(outDir, `${own.slice(1)}.html`);
      fs.mkdirSync(path.dirname(file), { recursive: true });
      fs.writeFileSync(file, html);
      written.push({ url: urls[lang], alternates: urls });
    }
  }
  return written;
}

export function buildSitemap(outDir, entries) {
  const body = entries.map(({ url, alternates: alt }) => `  <url>
    <loc>${url}</loc>
${Object.entries(alt).map(([lang, href]) => `    <xhtml:link rel="alternate" hreflang="${lang}" href="${href}" />`).join("\n")}
    <xhtml:link rel="alternate" hreflang="x-default" href="${alt.en}" />
  </url>`).join("\n");
  fs.writeFileSync(path.join(outDir, "sitemap.xml"), `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${body}
</urlset>
`);
}

export function buildDiscoverability(root, outDir) {
  const main = PAGES.map((page) => ({ url: urlFor(page, "en"), alternates: { en: urlFor(page, "en"), nl: urlFor(page, "nl") } }));
  const dutch = buildLanguagePages(root, outDir, "nl");
  const countries = buildCountryPages(root, outDir);
  const entries = [...main, ...dutch, ...countries];
  buildSitemap(outDir, entries);
  return entries;
}
