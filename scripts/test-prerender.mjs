import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { translateHtml, linkRewriter, buildDiscoverability, COUNTRIES, ORIGIN, PAGES } from "./prerender.mjs";

const root = fileURLToPath(new URL("../", import.meta.url));
const nl = JSON.parse(fs.readFileSync(path.join(root, "locales", "nl.json"), "utf8"));
const out = fs.mkdtempSync(path.join(os.tmpdir(), "nook-prerender-"));
const entries = buildDiscoverability(root, out);
const fileFor = (url) => {
  const p = new URL(url).pathname;
  if (!p.startsWith("/nl/") && !p.startsWith("/wild-camping/")) return path.join(root, p === "/" ? "index.html" : p.slice(1) + ".html");
  return path.join(out, p.endsWith("/") ? p.slice(1) + "index.html" : p.slice(1) + ".html");
};

test("translation follows the runtime rules for text nodes, attributes, numbers and titles", () => {
  const html = '<title data-i18n-text="[&quot;Map&quot;]">Map</title><p data-i18n-text="[&quot;Map&quot;,&quot;Routes&quot;]" data-i18n-attrs="{&quot;aria-label&quot;:&quot;Rules&quot;}" aria-label="Rules"> Map <strong>x</strong> Routes </p><td data-i18n-number="2480">2,480</td><script>const a = "<p>Map</p>";</script>';
  const result = translateHtml(html, { dictionary: nl, locale: "nl" });
  assert.ok(result.includes(`<title data-i18n-text="[&quot;Map&quot;]">${nl.Map}</title>`));
  assert.ok(result.includes(` ${nl.Map} <strong>x</strong> ${nl.Routes} </p>`));
  assert.ok(result.includes(`aria-label="${nl.Rules}"`));
  assert.ok(result.includes(">2.480</td>"));
  assert.ok(result.includes('<script>const a = "<p>Map</p>";</script>'), "scripts stay untouched");
});

test("internal links map to the same page in the target language; external links stay", () => {
  const rewrite = linkRewriter("nl", "/nl/regels");
  assert.equal(rewrite("over.html"), "/nl/over");
  assert.equal(rewrite("index.html"), "/nl/");
  assert.equal(rewrite("index.html?route=import"), "/nl/?route=import");
  assert.equal(rewrite("regels.html#regiogids"), "/nl/regels#regiogids");
  assert.equal(rewrite("#main-content"), "/nl/regels#main-content");
  assert.equal(rewrite("https://www.refuges.info/"), "https://www.refuges.info/");
});

test("the sitemap lists the main pages, their Dutch versions and every country guide in two languages", () => {
  const sitemap = fs.readFileSync(path.join(out, "sitemap.xml"), "utf8");
  const locs = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map(([, url]) => url);
  assert.equal(locs.length, PAGES.length * 2 + Object.keys(COUNTRIES).length * 2);
  assert.equal(new Set(locs).size, locs.length);
  for (const url of locs) assert.ok(fs.existsSync(fileFor(url)), `${url} has no page`);
  assert.ok(locs.includes(`${ORIGIN}/wild-camping/norway`) && locs.includes(`${ORIGIN}/nl/wildkamperen/noorwegen`));
});

test("every generated page declares its language, canonical URL, reciprocal alternates and root base", () => {
  for (const { url, alternates } of entries.filter((e) => /\/(nl|wild-camping)\//.test(e.url))) {
    const html = fs.readFileSync(fileFor(url), "utf8");
    const lang = url.includes("/nl/") ? "nl" : "en";
    assert.ok(html.includes(`<html lang="${lang}" dir="ltr" data-prerendered-lang="${lang}">`), url);
    assert.ok(/<meta charset="UTF-8" \/>\s*<base href="\/" \/>/.test(html), `${url} needs <base href="/"> before relative URLs`);
    assert.ok(html.includes(`<link rel="canonical" href="${url}" />`), url);
    assert.ok(html.includes(`<meta property="og:url" content="${url}" />`), url);
    for (const [hreflang, href] of Object.entries(alternates)) {
      assert.ok(html.includes(`<link rel="alternate" hreflang="${hreflang}" href="${href}" />`), `${url} lacks ${hreflang}`);
      const other = fs.readFileSync(fileFor(href), "utf8");
      assert.ok(other.includes(`hreflang="${lang}" href="${url}"`), `${href} does not point back to ${url}`);
    }
    assert.equal((html.match(/rel="canonical"/g) || []).length, 1);
    assert.ok(!/<a [^>]*href="(?:#|[a-z]+\.html)/.test(html), `${url} keeps a link that resolves against <base>`);
  }
});

test("Dutch pages are fully translated and translating them again changes nothing", () => {
  for (const page of PAGES) {
    const html = fs.readFileSync(path.join(out, "nl", page === "index" ? "index.html" : `${page}.html`), "utf8");
    assert.equal(translateHtml(html, { dictionary: nl, locale: "nl" }), html, `${page} is not stable`);
    assert.ok(html.includes(`>${nl.Map}</a>`), `${page} navigation is not Dutch`);
    assert.ok(!html.includes('type="application/ld+json"'));
  }
});

test("country guides combine the rules row, region guide and the country's map counts", () => {
  const norway = fs.readFileSync(path.join(out, "wild-camping", "norway.html"), "utf8");
  assert.ok(norway.includes("<title>Wild camping in Norway by bike: rules and places to sleep | Nook</title>"));
  assert.ok(norway.includes("Utmark, 150 m away, usually max 2 nights."));
  assert.ok(norway.includes('<details open class="region-guide" id="regio-hardangervidda">'));
  assert.ok(norway.includes('data-i18n-number="1752"') && norway.includes(">1,752<"));
  const noorwegen = fs.readFileSync(path.join(out, "nl", "wildkamperen", "noorwegen.html"), "utf8");
  assert.ok(noorwegen.includes("<h1>Wildkamperen in Noorwegen</h1>") && noorwegen.includes(">1.752<"));
  const denmark = fs.readFileSync(path.join(out, "wild-camping", "denmark.html"), "utf8");
  assert.ok(!denmark.includes('class="region-guide"') && denmark.includes("Other country guides"));
  assert.ok(denmark.includes('data-i18n-number="2480"'), "Denmark lists the official Ud i Naturen places");
});
