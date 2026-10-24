const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const { chromium } = require("playwright");
const base = process.env.NOOK_TEST_URL || "http://127.0.0.1:8000/";
const root = path.join(__dirname, "..");
const manifest = JSON.parse(fs.readFileSync(path.join(root, "data/map-index.json")));
const chunk = manifest.chunks.find((item) => item.kind === "refuges" && item.country === "FR");
const sample = JSON.parse(fs.readFileSync(path.join(root, "data", chunk.file)))[0];

(async () => {
  const browser = await chromium.launch({ executablePath: process.env.NOOK_CHROMIUM || "/usr/bin/chromium", env: process.env.NOOK_BROWSER_HOME ? { ...process.env, HOME: process.env.NOOK_BROWSER_HOME } : process.env, args: ["--no-sandbox"] });
  try {
    const context = await browser.newContext({ viewport: { width: 390, height: 844 } });
    const page = await context.newPage();
    const errors = [];
    page.on("pageerror", (error) => errors.push(error.message));
    const settled = async () => {
      await page.waitForTimeout(180);
      await page.waitForFunction(() => typeof mapDataLoading !== "undefined" && !mapDataLoading);
      assert.equal(await page.evaluate(() => mapDataError), "");
    };
    const open = async () => {
      const position = await page.evaluate(([lat, lng]) => {
        const frame = document.querySelector("#map").getBoundingClientRect();
        const point = map.latLngToContainerPoint([lat, lng]);
        return { x: frame.x + point.x, y: frame.y + point.y };
      }, [sample.lat, sample.lng]);
      await page.mouse.click(position.x, position.y);
      await page.waitForSelector('#place-panel .place-link[href="' + sample.sourceUrl + '"]');
    };
    await page.goto(base, { waitUntil: "domcontentloaded" });
    await settled();
    await page.locator("#toggle-filters").click();
    for (const input of await page.locator('#sleep-filter input[value]').all()) if (await input.getAttribute("value") !== "hut") await input.uncheck();
    await page.locator("#close-filters").click();
    await page.evaluate(([lat, lng]) => { map.setView([lat, lng], 17, { animate: false }); refreshMapPlaces(); }, [sample.lat, sample.lng]);
    await settled();
    assert.ok(await page.evaluate(() => visiblePlaceCounts.refuges > 0));
    await open();
    assert.equal(await page.locator("#place-panel h3").innerText(), sample.name);
    assert.ok(await page.locator('.place-attribution a[href="https://creativecommons.org/licenses/by-sa/2.0/"]').isVisible());
    assert.match(await page.locator("#place-panel").innerText(), /Refuges.info contributors/);
    assert.match(await page.locator(".place-facts li").filter({ hasText: /^Cost/ }).innerText(), /Not listed/);
    await page.locator("#place-panel .place-panel-close").click();
    await page.evaluate(() => navigator.serviceWorker.ready);
    await page.waitForFunction(() => Boolean(navigator.serviceWorker.controller));
    await context.setOffline(true);
    await page.reload({ waitUntil: "load" });
    await settled();
    await open();
    assert.equal(await page.locator("#place-panel h3").innerText(), sample.name);
    assert.deepEqual(errors, []);
    console.log("PASS: real Refuges.info pin, source page, attribution, unknown price, hut filter and visited details work offline");
    await context.close();
  } finally { await browser.close(); }
})().catch((error) => { console.error(error); process.exitCode = 1; });
