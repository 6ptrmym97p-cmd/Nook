// Optional user-flow regression checks. Requires Playwright, Chromium and a static server.
const assert = require("node:assert/strict");
const { chromium } = require("playwright");
const base = process.env.NOOK_TEST_URL || "http://127.0.0.1:8000/";
const url = (path = "") => new URL(path, base.endsWith("/") ? base : `${base}/`).href;
const track = '<?xml version="1.0"?><gpx version="1.1" creator="Nook test"><trk><name>Testfietstocht</name><trkseg><trkpt lat="52.1" lon="5.1"/><trkpt lat="52.12" lon="5.12"/></trkseg></trk></gpx>';
const file = (name, contents) => ({ name, mimeType: "application/gpx+xml", buffer: Buffer.from(contents) });

(async () => {
  const browser = await chromium.launch({ executablePath: process.env.NOOK_CHROMIUM || "/usr/bin/chromium", env: process.env.NOOK_BROWSER_HOME ? { ...process.env, HOME: process.env.NOOK_BROWSER_HOME } : process.env, args: ["--no-sandbox"] });
  try {
    const context = await browser.newContext({ viewport: { width: 390, height: 700 }, hasTouch: true, isMobile: true });
    const page = await context.newPage();
    const errors = [];
    page.on("pageerror", (error) => errors.push(error.message));
    const settled = async () => {
      await page.waitForFunction(() => typeof mapDataLoading !== "undefined" && !mapDataLoading);
      assert.equal(await page.evaluate(() => mapDataError), "");
    };
    await page.goto(url(), { waitUntil: "load" });
    await settled();
    assert.equal(await page.locator("#startup-location-card").count(), 0, "The initial map has no location popup");
    assert.equal(await page.evaluate(() => userLocation), null);
    assert.equal(await page.locator(".leaflet-marker-icon").count(), 0, "General region guides are not represented as campsite pins or separate clusters");
    await page.evaluate(() => { map.setView([53.05, 13.3], 9, { animate: false }); refreshMapPlaces(); });
    await page.locator("#show-candidates").click();
    await settled();
    assert.ok(await page.evaluate(() => currentCandidates.length > 0));
    assert.equal(await page.evaluate(() => currentCandidates.some((candidate) => candidate.place.approximate || candidate.provider === "curated")), false, "Only location records, not regional guidance, may become overnight candidates");
    await page.keyboard.press("Escape");
    console.log("PASS: region guides do not appear as map locations, cluster counts or overnight candidates");
    await page.locator("#open-my-route").click();
    assert.ok(await page.locator("#map-sidebar").evaluate((element) => element.open));
    assert.equal(await page.evaluate(() => document.activeElement.id), "choose-gpx");
    assert.equal(await page.locator("#route-library").isVisible(), false, "An empty saved-route library stays hidden");
    const panel = await page.locator("#map-sidebar").boundingBox();
    assert.ok(panel.y >= 58 && panel.y + panel.height <= 700, "Filter sheet must fit the screen");
    await page.keyboard.press("Shift+Tab");
    assert.ok(await page.evaluate(() => document.querySelector("#map-sidebar").contains(document.activeElement)), "Focus stays inside the modal");
    await page.keyboard.press("Escape");
    assert.equal(await page.evaluate(() => document.activeElement.id), "open-my-route");
    console.log("PASS: direct route action, fitting filter sheet and keyboard focus");

    await page.locator("#toggle-filters").click();
    await page.locator("#clear-countries").click();
    await page.locator("#toggle-country-list").click();
    await page.locator('[data-country="NL"]').check();
    await page.locator("#choose-gpx").scrollIntoViewIfNeeded();
    const [chooser] = await Promise.all([page.waitForEvent("filechooser"), page.locator("#choose-gpx").click()]);
    await chooser.setFiles(file("track.gpx", track));
    await page.waitForFunction(() => savedRoutes.length === 1);
    assert.deepEqual(await page.evaluate(() => [...selectedCountryCodes()]), ["NL"]);
    const saved = await page.evaluate(() => localStorage.getItem(ROUTE_LIBRARY_KEY));
    const badFiles = ["<gpx><", '<gpx><wpt lat="NaN" lon="x"/></gpx>', '<gpx><wpt lon="5"/></gpx>', '<gpx><wpt lat="999" lon="5"/></gpx>', '<xml><wpt lat="52" lon="5"/></xml>'];
    for (const [index, contents] of badFiles.entries()) {
      await page.locator("#gpx-file").setInputFiles(file(`invalid-${index}.gpx`, contents));
      await page.waitForFunction(() => document.querySelector("#route-feedback").classList.contains("is-error"));
      assert.equal(await page.evaluate(() => localStorage.getItem(ROUTE_LIBRARY_KEY)), saved);
      assert.equal(await page.evaluate(() => savedRoutes.length), 1);
    }
    await page.locator("#route-filter-active").uncheck();
    await page.reload({ waitUntil: "load" });
    await settled();
    assert.equal(await page.locator("#route-filter-active").isChecked(), false);
    assert.deepEqual(await page.evaluate(() => [...selectedCountryCodes()]), ["NL"]);
    console.log("PASS: GPX import, invalid-file recovery and preserved country/route settings");

    await page.locator("#open-my-route").click();
    await page.locator("[data-route-remove]").click();
    assert.equal(await page.evaluate(() => savedRoutes.length), 0);
    await page.locator("#undo-route-removal").click();
    assert.equal(await page.evaluate(() => savedRoutes.length), 1);
    await page.locator("#clear-route").click();
    await page.locator("#undo-route-removal").click();
    assert.equal(await page.evaluate(() => localStorage.getItem(ROUTE_LIBRARY_KEY)), saved);
    await page.locator("#reset-filters").click();
    assert.equal(await page.evaluate(() => savedRoutes.length), 1);
    assert.equal(await page.locator("#filter-count").isVisible(), false);
    await page.keyboard.press("Escape");
    console.log("PASS: undo single/all route deletion; resetting filters retains routes");

    await page.evaluate(() => map.setView([48.85, 2.35], 12, { animate: false }));
    await page.goto(url("regels.html"), { waitUntil: "load" });
    await page.goto(url(), { waitUntil: "load" });
    await settled();
    const view = await page.evaluate(() => ({ lat: map.getCenter().lat, lng: map.getCenter().lng, zoom: map.getZoom() }));
    assert.ok(Math.abs(view.lat - 48.85) < .01 && Math.abs(view.lng - 2.35) < .01 && view.zoom === 12);
    await page.locator("#show-candidates").click();
    await page.waitForTimeout(250);
    for (const value of ["15", "70"]) {
      const bounds = await page.locator(`[data-horizon="${value}"]`).boundingBox();
      await page.touchscreen.tap(bounds.x + bounds.width / 2, bounds.y + bounds.height / 2);
    }
    assert.equal(await page.evaluate(() => candidateHorizonKm), 70, "Both rapid taps must register");
    await settled();
    await page.waitForFunction(() => document.querySelectorAll(".candidate-item").length > 0);
    await page.locator(".candidate-item").first().click();
    await page.waitForFunction(() => document.querySelector("#place-panel .place-link"));
    assert.match(await page.locator(".place-link").getAttribute("href"), /^https?:\/\//);
    await page.keyboard.press("Escape");
    assert.equal(await page.locator("#place-panel").getAttribute("aria-hidden"), "true");
    console.log("PASS: map position survives navigation, rapid touch choices and real place details");

    await page.evaluate(() => navigator.serviceWorker.ready);
    await page.waitForFunction(() => navigator.serviceWorker.controller);
    await context.setOffline(true);
    await page.reload({ waitUntil: "load" });
    await settled();
    assert.equal(await page.evaluate(() => savedRoutes.length), 1);
    assert.equal(await page.evaluate(() => map.getZoom()), 14);
    await context.setOffline(false);
    console.log("PASS: offline reload retains the map index and saved route");
    for (const [width, height] of [[320, 568], [390, 700], [844, 390], [1440, 900]]) {
      await page.setViewportSize({ width, height });
      for (const path of ["regels.html", "routebronnen.html", "netwerken.html", "over.html"]) {
        await page.goto(url(path), { waitUntil: "load" });
        assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1), `${path}: horizontal overflow at ${width}`);
        assert.ok(await page.locator('.mobile-about:visible, .header-action:visible').count() >= 1);
        if (path !== "over.html") {
          const last = page.locator(".source-table tbody tr").last();
          await last.scrollIntoViewIfNeeded();
          const bounds = await last.boundingBox();
          assert.ok(bounds.y < height && bounds.y + bounds.height > 58, `${path}: last row is reachable`);
          assert.ok(await page.locator(".source-table td").first().evaluate((element) => parseFloat(getComputedStyle(element).fontSize) >= 14));
          if (path === "regels.html") {
            assert.equal(await page.locator('.rules-table td:last-child a:visible').count(), 11);
            assert.equal(await page.locator("#regiogids .region-guide").count(), 11);
            await page.locator("#regio-brandenburg summary").click();
            assert.ok(await page.locator("#regio-brandenburg").evaluate((element) => element.open));
            assert.match(await page.locator("#regio-brandenburg a").getAttribute("href"), /^https:\/\/bravors\.brandenburg\.de\//);
          }
        }
      }
    }
    console.log("PASS: readable, scrollable information pages and source links at four screen sizes");
    assert.deepEqual(errors, []);
    await context.close();

    const retryContext = await browser.newContext({ serviceWorkers: "block" });
    const retryPage = await retryContext.newPage();
    await retryContext.route("**/data/map-index.json**", (route) => route.abort("failed"));
    await retryPage.goto(url(), { waitUntil: "load" });
    await retryPage.waitForFunction(() => typeof mapDataError !== "undefined" && Boolean(mapDataError));
    await retryContext.unroute("**/data/map-index.json**");
    await retryPage.locator("#map-data-action").click();
    await retryPage.waitForFunction(() => !mapDataLoading && !mapDataError && mapMarkers.size > 0);
    console.log("PASS: failed map download recovers via retry without reloading the app");
    await retryContext.close();

    const locationContext = await browser.newContext({ permissions: ["geolocation"], geolocation: { latitude: 52.1, longitude: 5.1, accuracy: 20 } });
    const locationPage = await locationContext.newPage();
    await locationPage.addInitScript(() => {
      window.locationRequestCount = 0;
      const request = navigator.geolocation.getCurrentPosition.bind(navigator.geolocation);
      navigator.geolocation.getCurrentPosition = (...args) => { window.locationRequestCount++; return request(...args); };
    });
    await locationPage.goto(url(), { waitUntil: "load" });
    await locationPage.waitForFunction(() => !mapDataLoading);
    assert.equal(await locationPage.evaluate(() => window.locationRequestCount), 0, "Previously granted permission must not trigger automatic GPS");
    assert.equal(await locationPage.evaluate(() => userLocation), null);
    await locationPage.locator("#locate-me").click();
    await locationPage.waitForFunction(() => userLocation && !mapDataLoading);
    assert.equal(await locationPage.evaluate(() => window.locationRequestCount), 1);
    assert.equal(await locationPage.evaluate(() => userLocation.lat), 52.1);
    await locationPage.reload({ waitUntil: "load" });
    await locationPage.waitForFunction(() => !mapDataLoading);
    assert.equal(await locationPage.evaluate(() => window.locationRequestCount), 0);
    await locationPage.locator("#show-candidates").click();
    assert.equal(await locationPage.evaluate(() => window.locationRequestCount), 0, "Candidate browsing uses the map until GPS is requested");
    await locationPage.locator("#candidate-use-location").click();
    await locationPage.waitForFunction(() => userLocation && !mapDataLoading);
    assert.equal(await locationPage.evaluate(() => window.locationRequestCount), 1);
    console.log("PASS: no startup location popup or automatic GPS; both explicit location controls work");
    await locationContext.close();

    // Storage quota failures must not delete the old GPX during migration.
    const quotaContext = await browser.newContext();
    const quotaPage = await quotaContext.newPage();
    await quotaPage.goto(url(), { waitUntil: "domcontentloaded" });
    await quotaPage.evaluate(() => {
      localStorage.setItem(LEGACY_ROUTE_KEY, JSON.stringify({ name: "Existing route", lines: [[{ lat: 52, lng: 5 }, { lat: 52.1, lng: 5.1 }]], waypoints: [] }));
    });
    await quotaPage.addInitScript(() => {
      const write = Storage.prototype.setItem;
      Storage.prototype.setItem = function (key, value) {
        if (key === "nook-saved-routes-v1") throw new DOMException("Storage full", "QuotaExceededError");
        return write.call(this, key, value);
      };
    });
    await quotaPage.reload({ waitUntil: "load" });
    assert.equal(await quotaPage.evaluate(() => savedRoutes[0]?.name), "Existing route");
    assert.ok(await quotaPage.evaluate(() => localStorage.getItem(LEGACY_ROUTE_KEY)));
    console.log("PASS: failed GPX migration preserves legacy route data");
    await quotaContext.close();
  } finally { await browser.close(); }
})().catch((error) => { console.error(error); process.exitCode = 1; });
