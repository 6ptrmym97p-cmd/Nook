// Checks the generated Dutch pages and country guides in a real browser.
// Run after `node scripts/build-pages.mjs`; serves dist/ with Pages-style clean URLs.
const assert = require("node:assert/strict");
const fs = require("node:fs");
const http = require("node:http");
const path = require("node:path");
const { chromium } = require("playwright");

const dist = path.join(__dirname, "..", "dist");
const TYPES = { ".html": "text/html; charset=utf-8", ".js": "text/javascript", ".css": "text/css", ".json": "application/json", ".svg": "image/svg+xml", ".png": "image/png", ".jpg": "image/jpeg", ".ico": "image/x-icon", ".webmanifest": "application/manifest+json", ".xml": "application/xml", ".txt": "text/plain", ".gz": "application/gzip", ".bin": "application/octet-stream" };

const hits = []; // every request the server sees, including those of the map's Web Worker
function serve() {
  const server = http.createServer((request, response) => {
    const pathname = decodeURIComponent(new URL(request.url, "http://x").pathname);
    hits.push(pathname);
    const candidates = [pathname, pathname + ".html", path.posix.join(pathname, "index.html")];
    const file = candidates.map((p) => path.join(dist, p)).find((p) => p.startsWith(dist) && fs.existsSync(p) && fs.statSync(p).isFile());
    if (!file) { hits.push("404 " + pathname); response.writeHead(404, { "content-type": "text/html" }); response.end(fs.readFileSync(path.join(dist, "404.html"))); return; }
    response.writeHead(200, { "content-type": TYPES[path.extname(file)] || "application/octet-stream" });
    response.end(fs.readFileSync(file));
  });
  return new Promise((resolve) => server.listen(0, "127.0.0.1", () => resolve(server)));
}

// Same rules as translateDocument() in i18n.js, applied to a parsed document.
function signature(doc, translate) {
  const out = [];
  doc.querySelectorAll("[data-i18n-text]").forEach((element) => {
    const keys = JSON.parse(element.getAttribute("data-i18n-text"));
    const nodes = [...element.childNodes].filter((node) => node.nodeType === 3 && node.nodeValue.trim());
    keys.forEach((key, index) => { if (key && nodes[index]) out.push(translate ? translate.text(key) : nodes[index].nodeValue.trim()); });
  });
  doc.querySelectorAll("[data-i18n-attrs]").forEach((element) => {
    for (const [attribute, key] of Object.entries(JSON.parse(element.getAttribute("data-i18n-attrs")))) out.push(translate ? translate.text(key) : element.getAttribute(attribute));
  });
  doc.querySelectorAll("[data-i18n-number]").forEach((element) => out.push(translate ? translate.number(Number(element.dataset.i18nNumber)) : element.textContent));
  return out;
}

(async () => {
  assert.ok(fs.existsSync(path.join(dist, "nl", "regels.html")), "Run node scripts/build-pages.mjs first");
  const server = await serve();
  const base = `http://127.0.0.1:${server.address().port}`;
  const browser = await chromium.launch({ executablePath: process.env.NOOK_CHROMIUM || undefined, args: ["--no-sandbox"] });
  const context = await browser.newContext({ viewport: { width: 1280, height: 900 } });
  await context.route(/tile\.openstreetmap\.org|fonts\.(googleapis|gstatic)\.com/, (route) => route.abort());
  try {
    const page = await context.newPage();

    // 1. Each Dutch page equals the runtime ?lang=nl translation of the English page.
    for (const name of ["index", "regels", "routebronnen", "over"]) {
      await page.goto(`${base}/${name}.html?lang=nl`);
      await page.waitForFunction(() => window.NookI18n?.code === "nl");
      await page.evaluate(() => window.NookI18n.ready);
      const result = await page.evaluate(async ({ name, signatureSource }) => {
        const sign = new Function(`return (${signatureSource})`)();
        const parse = async (url) => new DOMParser().parseFromString(await (await fetch(url)).text(), "text/html");
        const english = await parse(`/${name}.html`);
        const dutch = await parse(name === "index" ? "/nl/" : `/nl/${name}`);
        return { expected: sign(english, window.NookI18n), actual: sign(dutch, null), lang: dutch.documentElement.lang, base: dutch.querySelector("base")?.getAttribute("href") };
      }, { name, signatureSource: signature.toString() });
      assert.equal(result.lang, "nl");
      assert.equal(result.base, "/");
      assert.deepEqual(result.actual, result.expected, `/nl/${name} differs from the runtime Dutch translation`);
    }
    console.log("PASS: all Dutch pages match the runtime Dutch translation exactly");

    // 2. The URL language wins over a saved preference; switching uses the alternate page.
    await page.goto(`${base}/regels.html`);
    await page.evaluate(() => localStorage.setItem("nook-language-v1", "de"));
    await page.goto(`${base}/nl/regels?country=NO`);
    await page.waitForFunction(() => window.NookI18n?.code === "nl");
    await page.evaluate(() => window.NookI18n.ready);
    assert.ok(!new URL(page.url()).searchParams.has("lang"), "a Dutch page must not add ?lang=nl");
    assert.equal(await page.getAttribute('nav a[href="/nl/over"]', "href"), "/nl/over");
    await Promise.all([page.waitForURL(`${base}/regels?country=NO`), page.selectOption("#language-select", "en")]);
    await page.waitForFunction(() => window.NookI18n?.code === "en" && document.querySelector("#country-rule h2")?.textContent === "Norway");
    await page.goto(`${base}/nl/regels`);
    await page.waitForFunction(() => window.NookI18n?.code === "nl" && !document.querySelector("#language-select").disabled);
    await Promise.all([page.waitForURL(/\/nl\/regels\?(?:.*&)?lang=de(?:&|$)/), page.selectOption("#language-select", "de")]);
    await page.waitForFunction(() => window.NookI18n?.code === "de");
    await page.evaluate(() => localStorage.clear());
    console.log("PASS: Dutch URL beats a saved preference, English switches to the English page (keeping ?country=), other languages still use ?lang=");

    // 3. Every page in the sitemap loads without missing same-origin files or script errors.
    const sitemap = fs.readFileSync(path.join(dist, "sitemap.xml"), "utf8");
    const urls = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map(([, url]) => new URL(url).pathname);
    assert.equal(urls.length, 4 * 2 + 35 * 2);
    for (const pathname of urls) {
      const missing = []; const errors = [];
      const onResponse = (response) => { if (response.url().startsWith(base) && response.status() >= 400) missing.push(`${response.status()} ${response.url()}`); };
      const onError = (error) => errors.push(error.message);
      page.on("response", onResponse); page.on("pageerror", onError);
      hits.length = 0;
      const response = await page.goto(base + pathname);
      assert.equal(response.status(), 200, pathname);
      await page.waitForFunction(() => window.NookI18n).then(() => page.evaluate(() => window.NookI18n.ready));
      if (pathname === "/nl/" || pathname === "/") await page.waitForFunction(() => !document.querySelector(".map-status:not([hidden])") || document.querySelector(".leaflet-marker-icon, .leaflet-overlay-pane canvas, .marker-cluster"), null, { timeout: 15000 }).catch(() => {});
      await page.waitForLoadState("networkidle");
      page.off("response", onResponse); page.off("pageerror", onError);
      missing.push(...hits.filter((hit) => hit.startsWith("404 ")));
      assert.deepEqual(missing, [], `${pathname} requested missing files`);
      assert.deepEqual(errors, [], `${pathname} threw script errors`);
      const lang = await page.evaluate(() => document.documentElement.lang);
      assert.equal(lang, pathname.startsWith("/nl/") ? "nl" : "en", pathname);
    }
    console.log(`PASS: ${urls.length} sitemap pages load with all assets and no script errors`);

    // 4. The Dutch map loads its data from the site root, like the English map.
    // A fresh context, so no service worker serves the map data from its cache.
    const fresh = await browser.newContext();
    await fresh.route(/tile\.openstreetmap\.org|fonts\.(googleapis|gstatic)\.com/, (route) => route.abort());
    const mapPage = await fresh.newPage();
    hits.length = 0;
    await mapPage.goto(`${base}/nl/`);
    await mapPage.waitForFunction(() => window.NookI18n?.code === "nl");
    await mapPage.waitForLoadState("networkidle");
    await fresh.close();
    const dataRequests = hits.filter((hit) => hit.includes("/data/"));
    assert.ok(dataRequests.some((p) => p.startsWith("/data/map-")), "the Dutch map must load /data/ files");
    assert.ok(!dataRequests.some((p) => p.startsWith("/nl/")), "map data must not be requested under /nl/");
    console.log("PASS: the Dutch map loads map data from /data/");

    // 5. Country guides look like the rules page and switch language to their counterpart.
    await page.goto(`${base}/regels`);
    const rulesStyle = await page.evaluate(() => { const s = getComputedStyle(document.body); return [s.fontFamily, s.backgroundColor, getComputedStyle(document.querySelector(".site-header")).height]; });
    await page.goto(`${base}/wild-camping/norway`);
    await page.waitForFunction(() => window.NookI18n?.code === "en" && !document.querySelector("#language-select").disabled);
    await page.evaluate(() => window.NookI18n.ready);
    const guide = await page.evaluate(async () => {
      const text = (element) => element?.textContent.replace(/\s+/g, " ").trim();
      const stored = new DOMParser().parseFromString(await (await fetch(location.pathname)).text(), "text/html");
      return {
        style: (() => { const s = getComputedStyle(document.body); return [s.fontFamily, s.backgroundColor, getComputedStyle(document.querySelector(".site-header")).height]; })(),
        h1: text(document.querySelector("h1")), country: text(document.querySelector("#country-rule h2")),
        staticCard: text(stored.querySelector("#country-rule")), liveCard: text(document.querySelector("#country-rule")),
        staticGuides: text(stored.querySelector("#country-guides")), liveGuides: text(document.querySelector("#country-guides")),
        places: document.querySelectorAll("#plekken .list-row").length, others: document.querySelectorAll("#landen a").length,
        title: document.title, search: location.search,
      };
    });
    assert.deepEqual(guide.style, rulesStyle, "country guide must use the rules page design");
    assert.equal(guide.h1, "Wild camping in Norway");
    assert.equal(guide.country, "Norway");
    assert.equal(guide.staticCard, guide.liveCard, "the built country card must equal what rules.js renders");
    assert.equal(guide.staticGuides, guide.liveGuides, "the built region guides must equal what rules.js renders");
    assert.ok(guide.places >= 3 && guide.others === 34 && guide.title.includes("Norway"));
    assert.equal(guide.search, "", "rules.js must not add ?country= on a country guide: " + JSON.stringify({ country: guide.country, h1: guide.h1, url: page.url() }));
    await Promise.all([page.waitForURL(`${base}/nl/wildkamperen/noorwegen`), page.selectOption("#language-select", "nl")]);
    await page.waitForFunction(() => window.NookI18n?.code === "nl");
    assert.equal(await page.textContent("h1"), "Wildkamperen in Noorwegen");
    await page.evaluate(() => localStorage.clear());
    console.log("PASS: country guides use the existing design and switch to their Dutch counterpart");
  } finally {
    await browser.close();
    server.close();
  }
})().catch((error) => { console.error(error); process.exit(1); });
