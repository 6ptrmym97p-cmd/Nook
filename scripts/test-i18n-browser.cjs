// Language integration checks. Requires Playwright, Chromium and a static server.
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const { chromium } = require("playwright");
const root = path.join(__dirname, "..");
const base = process.env.NOOK_TEST_URL || "http://127.0.0.1:8000/";
const url = (file = "", language) => {
  const result = new URL(file, base.endsWith("/") ? base : base + "/");
  if (language) result.searchParams.set("lang", language);
  return result.href;
};
const catalogue = (code) => JSON.parse(fs.readFileSync(path.join(root, "locales", code + ".json"), "utf8"));
const expectedPlaces = JSON.parse(fs.readFileSync(path.join(root, "data/map-index.json"), "utf8")).count;
const settled = async (page) => {
  await page.waitForFunction(() => typeof mapDataLoading !== "undefined" && !mapDataLoading);
  assert.equal(await page.evaluate(() => mapDataError), "");
};

(async () => {
  const browser = await chromium.launch({ executablePath: process.env.NOOK_CHROMIUM || "/usr/bin/chromium", env: process.env.NOOK_BROWSER_HOME ? { ...process.env, HOME: process.env.NOOK_BROWSER_HOME } : process.env, args: ["--no-sandbox"] });
  try {
    const context = await browser.newContext({ viewport: { width: 390, height: 844 }, locale: "nl-NL", serviceWorkers: "block" });
    const page = await context.newPage();
    const errors = [];
    const downloads = [];
    page.on("pageerror", (error) => errors.push(error.message));
    context.on("request", (request) => { if (/\/locales\//.test(request.url())) downloads.push(request.url()); });
    await page.goto(url(), { waitUntil: "load" });
    await settled(page);
    assert.equal(await page.getAttribute("html", "lang"), "en");
    assert.equal(await page.locator('nav a[href="index.html"]').innerText(), "Map");
    assert.equal(downloads.length, 0, "The English default does not download other languages");
    assert.equal(await page.locator("#language-select option").count(), 21);
    console.log("PASS: English is the default for a Dutch browser, with 21 selectable languages and no extra language downloads");

    const languages = fs.readdirSync(path.join(root, "locales")).filter((name) => name.endsWith(".json")).map((name) => name.slice(0, -5));
    for (const language of languages) {
      const words = catalogue(language);
      await page.goto(url("", language), { waitUntil: "load" });
      await settled(page);
      assert.equal(await page.getAttribute("html", "lang"), language);
      assert.equal(await page.getAttribute("html", "dir"), ["ar", "ur"].includes(language) ? "rtl" : "ltr");
      assert.equal(await page.evaluate(() => mapManifest.count), expectedPlaces);
      assert.equal(await page.locator("#show-candidates strong").innerText(), words["A place for tonight"]);
      await page.locator("#toggle-filters").click();
      assert.equal(await page.locator("#filters-title").innerText(), words["What do you want to see?"]);
      assert.equal(await page.locator("#choose-gpx").innerText(), words["Choose GPX from Files"]);
      await page.keyboard.press("Escape");
      await page.locator(".feedback-fab").click();
      assert.equal(await page.locator("#feedback-title").innerText(), words["Suggestion, complaint or bug?"]);
      await page.locator("[data-feedback-close]").click();
      for (const file of ["netwerken.html", "regels.html", "routebronnen.html", "over.html"]) {
        await page.goto(url(file, language), { waitUntil: "load" });
        await page.waitForFunction((code) => window.NookI18n?.code === code, language);
        assert.ok(await page.locator("h1").isVisible());
        assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1), file + ": overflow in " + language);
      }
      console.log("PASS: " + language + " map, filters, feedback and all information pages");
    }
    for (const width of [320, 844, 1440]) {
      await page.setViewportSize({ width, height: 900 });
      for (const language of ["en", "nl", "de", "ar", "ta", "zh"]) {
        for (const file of ["", "netwerken.html", "regels.html"]) {
          await page.goto(url(file, language), { waitUntil: "load" });
          await page.waitForFunction((code) => window.NookI18n?.code === code, language);
          assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1), `${file}: overflow at ${width}px in ${language}`);
          assert.ok(await page.locator("#language-select").isVisible());
        }
      }
    }
    assert.deepEqual(errors, []);
    await context.close();
    console.log("PASS: narrow mobile, landscape and desktop layouts in long and RTL languages");

    const flow = await browser.newContext({ viewport: { width: 390, height: 844 } });
    const flowPage = await flow.newPage();
    await flowPage.goto(url(), { waitUntil: "load" });
    await settled(flowPage);
    await flowPage.locator("#open-my-route").click();
    const routeName = 'My <img src=x onerror="window.unexpectedMarkup=true"> & route';
    const track = `<gpx version="1.1"><trk><name><![CDATA[${routeName}]]></name><trkseg><trkpt lat="52.1" lon="5.1"/><trkpt lat="52.12" lon="5.12"/></trkseg></trk></gpx>`;
    await flowPage.locator("#gpx-file").setInputFiles({ name: "route.gpx", mimeType: "application/gpx+xml", buffer: Buffer.from(track) });
    await flowPage.waitForFunction(() => savedRoutes.length === 1);
    await flowPage.locator("#route-filter-active").uncheck();
    await flowPage.keyboard.press("Escape");
    await flowPage.evaluate(() => map.setView([52.1, 5.1], 11, { animate: false }));
    await Promise.all([flowPage.waitForURL((value) => value.searchParams.get("lang") === "fr"), flowPage.locator("#language-select").selectOption("fr")]);
    await settled(flowPage);
    assert.equal(await flowPage.getAttribute("html", "lang"), "fr");
    assert.equal(await flowPage.evaluate(() => savedRoutes[0].name), routeName);
    assert.equal(await flowPage.locator("#route-filter-active").isChecked(), false);
    assert.equal(await flowPage.evaluate(() => map.getZoom()), 11);
    assert.equal(await flowPage.locator(".route-list-item img").count(), 0);
    assert.equal(await flowPage.evaluate(() => Boolean(window.unexpectedMarkup)), false);
    await flowPage.evaluate(() => navigator.serviceWorker.ready);
    await flowPage.waitForFunction(async () => navigator.serviceWorker.controller && Boolean(await caches.match(new URL("locales/fr.json", document.baseURI), { ignoreSearch: true })));
    await flow.setOffline(true);
    await flowPage.reload({ waitUntil: "load" });
    await settled(flowPage);
    assert.equal(await flowPage.getAttribute("html", "lang"), "fr");
    assert.equal(await flowPage.evaluate(() => savedRoutes[0].name), routeName);
    await flow.setOffline(false);
    await flowPage.locator('nav a[href*="over.html"]').click();
    await flowPage.waitForFunction(() => window.NookI18n?.code === "fr");
    assert.equal(await flowPage.getAttribute("html", "lang"), "fr");
    console.log("PASS: language selection preserves GPX names, map view and filters, survives offline reload and follows navigation");

    await flow.route("**/api/feedback", async (route) => {
      const body = route.request().postDataJSON();
      assert.equal(body.context.language, "fr");
      await route.fulfill({ status: 503, contentType: "application/json", body: JSON.stringify({ error: "Feedback is nog niet ingesteld." }) });
    });
    await flowPage.locator(".feedback-fab").click();
    await flowPage.locator('[name="message"]').fill("Interface language test");
    await flowPage.locator('.feedback-form [type="submit"]').click();
    await flowPage.waitForFunction(() => document.querySelector(".feedback-status").classList.contains("is-error"));
    assert.ok((await flowPage.locator(".feedback-status").innerText()).includes(catalogue("fr")["Feedback is not available yet."]));
    await flow.close();
    console.log("PASS: feedback context uses the chosen language and server errors are translated without sending a real message");
  } finally { await browser.close(); }
})().catch((error) => { console.error(error); process.exitCode = 1; });
