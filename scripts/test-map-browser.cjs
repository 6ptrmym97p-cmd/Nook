// Optional integration check; requires Playwright and an available Chromium.
// Start the static server first, then run: node scripts/test-map-browser.cjs
const assert = require("node:assert/strict");
const fs = require("node:fs");
const { chromium } = require("playwright");

(async () => {
  const executablePath = process.env.NOOK_CHROMIUM || (fs.existsSync("/usr/bin/chromium") ? "/usr/bin/chromium" : undefined);
  const env = process.env.NOOK_BROWSER_HOME ? { ...process.env, HOME: process.env.NOOK_BROWSER_HOME } : process.env;
  const browser = await chromium.launch({ executablePath, env, args: ["--no-sandbox"] });
  try {
    const context = await browser.newContext({
      viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true,
      userAgent: "Mozilla/5.0 (Linux; Android 13; Pixel 7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Mobile Safari/537.36",
    });
    const page = await context.newPage();
    const errors = [];
    page.on("pageerror", (error) => errors.push(error.message));
    // Remote tiles/fonts may need the platform proxy CA trusted in Chromium.
    // No external assets are needed to test canvas hit detection locally.
    await page.goto(process.env.NOOK_TEST_URL || "http://127.0.0.1:8000", { waitUntil: "domcontentloaded" });
    const settled = async () => {
      await page.waitForTimeout(160);
      await page.waitForFunction(() => typeof mapDataLoading !== "undefined" && !mapDataLoading);
      assert.equal(await page.evaluate(() => mapDataError), "");
    };
    await settled();
    await page.locator("#startup-skip-location").click();
    await page.evaluate(() => { map.setView([52.1, 5.1], 9, { animate: false }); refreshMapPlaces(); });
    await settled();
    assert.equal(await page.locator(".leaflet-sourcePins-pane canvas").count(), 1);
    assert.ok(await page.evaluate(() => mapMarkers.size > 0 && pinAccessibility.children.length === mapMarkers.size));

    // Small drags inside the fetched buffer must not rebuild map results.
    const beforePan = await page.evaluate(() => {
      window.browserCheckQueries = 0;
      const post = mapWorker.postMessage.bind(mapWorker);
      mapWorker.postMessage = (message, ...args) => {
        if (message.type === "query") window.browserCheckQueries++;
        return post(message, ...args);
      };
      return map.getCenter().lng;
    });
    for (let i = 0; i < 3; i++) {
      await page.evaluate(() => map.panBy([15, 0], { animate: false }));
      await settled();
    }
    assert.equal(await page.evaluate(() => window.browserCheckQueries), 0);
    assert.notEqual(await page.evaluate(() => map.getCenter().lng), beforePan);
    console.log("PASS: buffered pans reuse results");

    // Exercise actual canvas hit detection, not a synthetic Leaflet click.
    const target = await page.evaluate(() => {
      const frame = document.querySelector("#map").getBoundingClientRect();
      const entries = [...mapMarkers].filter(([key, marker]) => {
        const p = map.latLngToContainerPoint(marker.getLatLng());
        return key.startsWith("c:") && p.x > 70 && p.x < 310 && p.y > 120 && p.y < 600;
      });
      if (!entries.length) throw new Error("No visible cluster for hit test");
      const marker = entries[0][1];
      const p = map.latLngToContainerPoint(marker.getLatLng());
      return { x: frame.x + p.x, y: frame.y + p.y, zoom: map.getZoom() };
    });
    await page.touchscreen.tap(target.x, target.y);
    await settled();
    assert.ok(await page.evaluate((zoom) => map.getZoom() > zoom, target.zoom));
    assert.equal(await page.evaluate(() => Boolean(map._flyToFrame)), false);
    console.log("PASS: canvas touch hit detection and immediate cluster zoom");

    const zoomButton = await page.locator(".leaflet-control-zoom-in").boundingBox();
    const priorZoom = await page.evaluate(() => map.getZoom());
    await page.touchscreen.tap(zoomButton.x + zoomButton.width / 2, zoomButton.y + zoomButton.height / 2);
    await page.touchscreen.tap(zoomButton.x + zoomButton.width / 2, zoomButton.y + zoomButton.height / 2);
    await settled();
    assert.equal(await page.evaluate(() => map.getZoom()), priorZoom + 2);
    console.log("PASS: consecutive zoom-button taps both register");

    const cdp = await context.newCDPSession(page);
    const pinchZoom = await page.evaluate(() => {
      window.browserGestureRedraws = 0;
      const apply = applyMapSources;
      applyMapSources = (...args) => {
        if (mapIsMoving) window.browserGestureRedraws++;
        return apply(...args);
      };
      return map.getZoom();
    });
    await cdp.send("Input.dispatchTouchEvent", { type: "touchStart", touchPoints: [{ x: 160, y: 440, id: 1 }, { x: 240, y: 440, id: 2 }] });
    for (let step = 1; step <= 8; step++) {
      await cdp.send("Input.dispatchTouchEvent", { type: "touchMove", touchPoints: [{ x: 160 - step * 5, y: 440, id: 1 }, { x: 240 + step * 5, y: 440, id: 2 }] });
      if (step === 2) await page.evaluate(() => refreshMapPlaces());
      await page.waitForTimeout(16);
    }
    await cdp.send("Input.dispatchTouchEvent", { type: "touchEnd", touchPoints: [] });
    await settled();
    assert.ok(await page.evaluate((zoom) => map.getZoom() > zoom, pinchZoom));
    assert.equal(await page.evaluate(() => window.browserGestureRedraws), 0);
    assert.equal(await page.evaluate(() => mapIsMoving), false);
    console.log("PASS: real pinch gesture zooms without rebuilding pins mid-gesture");

    // The invisible companion controls preserve keyboard and screen reader use.
    await page.evaluate(() => { pinAccessibility.querySelector("button").focus(); });
    assert.ok(await page.evaluate(() => [...mapMarkers.values()].some((marker) => marker.options.weight === 4)));
    await page.evaluate(() => document.activeElement.blur());
    console.log("PASS: keyboard focus highlights its canvas marker");

    const originalTileSize = await page.evaluate(() => baseMap.options.tileSize);
    await page.evaluate(() => {
      lightBaseMapControl.checked = !lightBaseMapControl.checked;
      lightBaseMapControl.dispatchEvent(new Event("change"));
    });
    assert.notEqual(await page.evaluate(() => baseMap.options.tileSize), originalTileSize);
    assert.equal(await page.evaluate(() => baseMap.options.updateWhenIdle), false);
    assert.equal(await page.evaluate(() => baseMap.options.updateWhenZooming), false);
    const stored = await page.evaluate(() => localStorage.getItem(BASEMAP_DETAIL_KEY));
    await page.reload({ waitUntil: "domcontentloaded" });
    await settled();
    assert.equal(await page.evaluate(() => String(lightBaseMapControl.checked)), stored);
    assert.notEqual(await page.evaluate(() => baseMap.options.tileSize), originalTileSize);
    console.log("PASS: light/detailed basemap switch persists");
    assert.deepEqual(errors, []);
    await context.close();
  } finally {
    await browser.close();
  }
})().catch((error) => { console.error(error); process.exitCode = 1; });
