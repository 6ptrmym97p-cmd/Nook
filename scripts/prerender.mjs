// Build-time static pages for search engines, AI assistants and link previews.
// The visible design is unchanged: Dutch pages are the existing pages with the
// existing Dutch translations applied in advance, and the country pages are the
// camping rules page with one country already rendered, exactly as rules.js would.
// Runtime i18n.js and rules.js keep working on top.
import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";

export const ORIGIN = "https://ridewithnook.com";
export const PAGES = ["index", "regels", "over"];
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
    if (href === "/" || href === "/index.html") return cleanPath("index", lang);
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
    regels: { ogTitle: "Wildkampeerregels en fietsroutes per land | Nook" },
    over: { ogTitle: "Over Nook: slaapplekken voor mensen onderweg" },
  },
};

const read = (root, file) => fs.readFileSync(path.join(root, file), "utf8");
const dictionaryFor = (root, lang) => (lang === "en" ? {} : JSON.parse(read(root, `locales/${lang}.json`)));

/** The main pages in Dutch, e.g. dist/nl/regels.html served at /nl/regels. */
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

// Country guides: every country with checked rules in country-rules.js.
const PROVIDER_KIND = {
  "Ud i Naturen": "denmark", OpenStreetMap: "camping", "Refuges.info": "refuges", CampWild: "campwild",
  "Welcome To My Garden": "wtmg", "1NITE TENT": "nitetent", "Vrienden op de Fiets": "vodf",
};
const ARTICLE = new Set(["NL", "GB", "US"]);
const COPY = {
  en: {
    dir: "wild-camping",
    country: (code) => (ARTICLE.has(code) ? "the " : "") + new Intl.DisplayNames(["en"], { type: "region" }).of(code),
    title: (n) => `Wild camping in ${n} by bike: rules and places to sleep | Nook`,
    h1: (n) => `Wild camping in ${n}`,
    intro: (n, total) => `What cyclists with a small tent need to know about staying overnight in ${n}, with the official source and ${total} places to sleep on the Nook map.`,
    description: (n, total, status) => `Wild camping in ${n} on a bike trip: the main rule (${status}), the official source and ${total} campsites, huts, shelters and host gardens on the Nook map.`,
    placesHeading: (n) => `Places to sleep in ${n} on the map`,
    placesNote: "Numbers from the current Nook snapshot. Check availability, costs and rules with the provider.",
    otherHeading: "Camping rules in other countries",
    imageAlt: "Nook: find a place to sleep on your bike trip. Campsites, shelters, huts and host gardens on one map.",
  },
  nl: {
    dir: "nl/wildkamperen",
    country: (code) => new Intl.DisplayNames(["nl"], { type: "region" }).of(code),
    title: (n) => `Wildkamperen in ${n} met de fiets: regels en slaapplekken | Nook`,
    h1: (n) => `Wildkamperen in ${n}`,
    intro: (n, total) => `Wat je als fietser met een kleine tent moet weten over overnachten in ${n}, met de officiële bron en ${total} slaapplekken op de Nook-kaart.`,
    description: (n, total, status) => `Wildkamperen in ${n} tijdens een fietsreis: de hoofdregel (${status}), de officiële bron en ${total} campings, hutten, shelters en gastvrije tuinen op de Nook-kaart.`,
    placesHeading: (n) => `Slaapplekken in ${n} op de kaart`,
    placesNote: "Aantallen uit de huidige momentopname van Nook. Controleer beschikbaarheid, kosten en regels bij de aanbieder.",
    otherHeading: "Kampeerregels in andere landen",
    imageAlt: NL.imageAlt,
  },
};
const slug = (value) => value.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase().replace(/^the\s+/, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
const escapeHtml = (value) => String(value ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);

export function countryUrl(code, lang) {
  return `${ORIGIN}/${COPY[lang].dir}/${slug(COPY[lang].country(code))}`;
}

function extract(source, re, label) {
  const m = re.exec(source);
  if (!m) throw new Error(`Cannot find ${label}`);
  return m[0];
}

export function loadCountryRules(root) {
  const context = { window: {} };
  vm.runInNewContext(read(root, "country-rules.js"), context);
  return context.window.NOOK_COUNTRY_RULES;
}

// The markup rules.js renders for a country, built from the same data and templates.
function rulesTemplates(root) {
  const source = read(root, "rules.js");
  const icon = (name) => extract(source, new RegExp(`const ${name} = '([^']*)'`), name).replace(/^[^']*'|'$/g, "");
  const status = {};
  for (const [, key, label, className] of extract(source, /const STATUS = \{[\s\S]*?\};/, "STATUS").matchAll(/(\w+): \["([^"]+)", "([^"]+)"\]/g)) status[key] = [label, className];
  return { external: icon("ICON_EXTERNAL"), chevron: icon("ICON_CHEVRON"), status };
}

function renderCountry({ code, entry, data, lang, t, templates }) {
  const localized = (value) => (!value ? "" : value.key ? t(value.key) : value[lang] || value.en || "");
  const [label, className] = templates.status[entry.status] || templates.status.unknown;
  const text = localized(entry.text);
  const card = `
      <div class="country-rule-head">
        <h2>${escapeHtml(new Intl.DisplayNames([lang], { type: "region" }).of(code))}</h2>
        <span class="status-chip ${className}">${escapeHtml(t(label))}</span>
      </div>
      <p class="country-rule-main">${escapeHtml(localized(entry.rule))}</p>
        ${text ? `<p>${escapeHtml(text)}</p>` : ""}
        ${entry.sources.map((source) => `<a class="source-link" href="${escapeHtml(source.url)}" target="_blank" rel="noreferrer">${escapeHtml(t("Source: {0}", source.name))}${templates.external}</a>`).join("")}`;
  const ids = (entry.guides || []).filter((id) => data.guides[id]);
  const guides = !ids.length ? "" : `
      <h2>${escapeHtml(t("Regions"))}</h2>
      <ul class="guide-list">
        ${ids.map((id, index) => {
          const guide = data.guides[id];
          return `
            <li id="${escapeHtml(id)}">
              <button class="disclosure-toggle" type="button" aria-expanded="${index === 0}" aria-controls="${escapeHtml(id)}-content">
                <span><span class="disclosure-title">${escapeHtml(t(guide.title))}</span><span class="disclosure-summary">${escapeHtml(t(guide.location))}</span></span>
                ${templates.chevron}
              </button>
              <div class="guide-content" id="${escapeHtml(id)}-content"${index === 0 ? "" : " hidden"}>
                <p>${escapeHtml(t(guide.text))}</p>
                <dl class="guide-facts">${guide.facts.map(([key, value]) => `<dt>${escapeHtml(t(key))}</dt><dd>${escapeHtml(t(value))}</dd>`).join("")}</dl>
                ${guide.check ? `<p><strong>${escapeHtml(t("Please check:"))}</strong> ${escapeHtml(t(guide.check))}</p>` : ""}
                <a class="source-link" href="${escapeHtml(guide.source.url)}" target="_blank" rel="noreferrer">${escapeHtml(guide.source.name)}${templates.external}</a>
              </div>
            </li>`;
        }).join("")}
      </ul>`;
  return { card, guides, statusLabel: t(label) };
}

/** English and Dutch guide per country, e.g. /wild-camping/norway and /nl/wildkamperen/noorwegen. */
export function buildCountryPages(root, outDir) {
  const rules = read(root, "regels.html");
  const about = read(root, "over.html");
  const data = loadCountryRules(root);
  const templates = rulesTemplates(root);
  const index = JSON.parse(read(root, "data/map-index.json"));
  const counts = {};
  for (const chunk of index.chunks) {
    counts[chunk.country] ??= {};
    counts[chunk.country][chunk.kind] = (counts[chunk.country][chunk.kind] || 0) + chunk.count;
  }
  const mainSource = extract(rules, /<main[\s\S]*?<\/main>/, "rules main");
  const head = rules.slice(0, rules.indexOf("<main"));
  const tail = rules.slice(rules.indexOf("</main>") + "</main>".length);
  const sourceRows = [...extract(about, /<section class="page-section" id="bronnen">[\s\S]*?<\/section>/, "sources list").matchAll(/<li><a class="list-row"[\s\S]*?<\/li>/g)].map(([row]) => {
    const name = decode(/<span class="list-title">([^<]+)<\/span>/.exec(row)[1]);
    if (!PROVIDER_KIND[name]) throw new Error("Unknown provider " + name);
    return { kind: PROVIDER_KIND[name], row };
  });
  const codes = Object.keys(data.countries);
  const written = [];
  for (const lang of ["en", "nl"]) {
    const copy = COPY[lang];
    const dictionary = dictionaryFor(root, lang);
    const t = (key, ...values) => (Object.prototype.hasOwnProperty.call(dictionary, key) ? dictionary[key] : key).replace(/\{(\d+)\}/g, (_, i) => String(values[i] ?? ""));
    const format = new Intl.NumberFormat(lang);
    const listName = (code) => copy.country(code).replace(/^the /, "The ");
    for (const code of codes) {
      const name = copy.country(code);
      const own = new URL(countryUrl(code, lang)).pathname;
      const { card, guides, statusLabel } = renderCountry({ code, entry: data.countries[code], data, lang, t, templates });
      const here = counts[code] || {};
      const total = format.format(Object.values(here).reduce((sum, n) => sum + n, 0));
      const rows = sourceRows.filter(({ kind }) => here[kind])
        .map(({ kind, row }) => row.replace(/data-i18n-number="\d+">[^<]*</, `data-i18n-number="${here[kind]}">${here[kind]}<`));
      const others = codes.filter((c) => c !== code).sort((a, b) => listName(a).replace(/^The /, "").localeCompare(listName(b).replace(/^The /, ""), lang))
        .map((c) => `<a href="${new URL(countryUrl(c, lang)).pathname}">${escapeText(listName(c))}</a>`).join(" · ");
      const places = !rows.length ? "" : `
      <section class="page-section" id="plekken">
        <h2>${escapeText(copy.placesHeading(name))}</h2>
        <p class="muted">${escapeText(copy.placesNote)}</p>
        <ul class="list">
          ${rows.join("\n          ")}
        </ul>
        <p><a class="button button-secondary" href="index.html" data-i18n-text="[&quot;Open the map&quot;]">Open the map</a></p>
      </section>`;
      let main = mainSource
        .replace(/<div class="page-intro">[\s\S]*?<\/div>/, `<div class="page-intro">
        <h1>${escapeText(copy.h1(name))}</h1>
        <p>${escapeText(copy.intro(name, total))}</p>
      </div>`)
        .replace(/<section class="country-rule" id="country-rule" aria-live="polite"><\/section>/, `<section class="country-rule" id="country-rule" aria-live="polite" data-country="${code}">${card}</section>`)
        .replace(/<section class="page-section" id="country-guides" hidden><\/section>/, `<section class="page-section" id="country-guides"${guides ? "" : " hidden"}>${guides}</section>${places}`)
        .replace(/<\/main>$/, `  <section class="page-section" id="landen">
        <h2>${escapeText(copy.otherHeading)}</h2>
        <p class="muted">${others}</p>
      </section>
    </main>`);
      for (const marker of [`data-country="${code}"`, 'id="plekken"', 'id="landen"', copy.h1(name)]) {
        if (!main.includes(escapeText(marker)) && !(marker === 'id="plekken"' && !rows.length)) throw new Error(`${code}: rules page structure changed (${marker})`);
      }
      let html = translateHtml(head + main + tail, { dictionary, locale: lang, rewriteHref: linkRewriter(lang, own) });
      const urls = { en: countryUrl(code, "en"), nl: countryUrl(code, "nl") };
      html = finishHead(html, {
        lang, canonical: urls[lang], urls, title: copy.title(name), description: copy.description(name, total, statusLabel.toLowerCase()),
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
