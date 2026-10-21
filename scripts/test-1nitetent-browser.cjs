// Requires Playwright, Chromium and a running static server.
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const { chromium } = require("playwright");
const root = path.join(__dirname, "..");
const base = process.env.NOOK_TEST_URL || "http://127.0.0.1:8000/";
const manifest = JSON.parse(fs.readFileSync(path.join(root, "data/map-index.json")));
const chunk = manifest.chunks.find((item) => item.kind === "nitetent" && item.country === "DE");
const sample = JSON.parse(fs.readFileSync(path.join(root, "data", chunk.file)))[0];

(async () => {
  const browser = await chromium.launch({
    executablePath: process.env.NOOK_CHROMIUM || "/usr/bin/chromium",
    env: process.env.NOOK_BROWSER_HOME ? { ...process.env, HOME: process.env.NOOK_BROWSER_HOME } : process.env,
    args: ["--no-sandbox"],
  });
  try {
    const context = await browser.newContext({ viewport: { width: 390, height: 844 } });
    await context.addInitScript(() => {
      if (!localStorage.getItem("nook-filter-preferences-v3")) localStorage.setItem("nook-filter-preferences-v3", JSON.stringify({ networks: [{ value: "vodf", checked: true }, { value: "wtmg", checked: false }] }));
    });
    const page = await context.newPage();
    const errors = [];
    page.on("pageerror", (error) => errors.push(error.message));
    const detailDownloads = [];
    page.on("request", (request) => { if (/\/map-details\/nitetent-/.test(request.url())) detailDownloads.push(request.url()); });
    const settled = async () => {
      await page.waitForTimeout(180);
      await page.waitForFunction(() => typeof mapDataLoading !== "undefined" && !mapDataLoading);
      assert.equal(await page.evaluate(() => mapDataError), "");
    };
    const openPin = async () => {
      const position = await page.evaluate(([lat, lng]) => {
        const frame = document.querySelector("#map").getBoundingClientRect();
        const point = map.latLngToContainerPoint([lat, lng]);
        return { x: frame.x + point.x, y: frame.y + point.y };
      }, [sample.lat, sample.lng]);
      await page.mouse.click(position.x, position.y);
      await page.waitForSelector('#place-panel .place-link[href="https://1nitetent.com/#map"]');
    };
    const url = new URL(base);
    url.searchParams.set("lang", "nl");
    await page.goto(url.href, { waitUntil: "domcontentloaded" });
    await settled();
    assert.equal(await page.evaluate(() => mapManifest.count), manifest.count);
    assert.ok(await page.locator('[data-network="nitetent"]').isChecked(), "Existing users see the new network by default");
    assert.equal(await page.locator('[data-network="wtmg"]').isChecked(), false, "Existing filter preferences are preserved");
    await page.locator("#toggle-filters").click();
    for (const input of await page.locator('#sleep-filter input[value]').all()) {
      if (await input.getAttribute("value") !== "host") await input.uncheck();
    }
    await page.locator('[data-network="vodf"]').uncheck();
    await page.locator("#close-filters").click();
    await page.evaluate(([lat, lng]) => { map.setView([lat, lng], 17, { animate: false }); refreshMapPlaces(); }, [sample.lat, sample.lng]);
    await settled();
    assert.ok(await page.evaluate(() => [...mapMarkers.values()].some((marker) => marker.options.pinLabel === "T")));
    await openPin();
    assert.ok((await page.locator("#place-panel").innerText()).includes("Alleen één nacht"));
    assert.ok((await page.locator("#place-panel").innerText()).includes(sample.lat.toFixed(5)));
    assert.ok(detailDownloads.length > 0, "The detail batch is loaded when the place is opened");
    console.log("PASS: new network respects saved preferences and its real canvas pin opens localized details and the official source link");

    await page.locator("#place-panel .place-panel-close").click();
    await page.locator("#toggle-filters").click();
    await page.locator('[data-network="nitetent"]').uncheck();
    await settled();
    assert.equal(await page.evaluate(() => mapMarkers.size), 0);
    await page.locator('[data-network="nitetent"]').check();
    await page.locator("#close-filters").click();
    await settled();
    console.log("PASS: the network filter actually removes and restores its map pins");

    await page.evaluate(() => navigator.serviceWorker.ready);
    await page.waitForFunction(() => Boolean(navigator.serviceWorker.controller));
    await page.reload({ waitUntil: "load" });
    await settled();
    await openPin();
    await page.locator("#place-panel .place-panel-close").click();
    await context.setOffline(true);
    await page.reload({ waitUntil: "load" });
    await settled();
    await openPin();
    assert.ok((await page.locator("#place-panel").innerText()).includes("Alleen één nacht"));
    assert.deepEqual(errors, []);
    console.log("PASS: the new index, saved filters, Dutch wording and visited place details survive offline reload");
    await context.close();
  } finally { await browser.close(); }
})().catch((error) => { console.error(error); process.exitCode = 1; });
