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
    await page.goto(url("index.html?route=import"), { waitUntil: "load" });
    await settled();
    assert.ok(await page.locator("#map-sidebar").evaluate((element) => element.open));
    assert.equal(await page.evaluate(() => document.activeElement.id), "map-sidebar", "The sheet itself takes focus, so no button shows a focus ring");
    assert.ok(await page.locator("#choose-gpx").isVisible(), "GPX upload is in the map settings");
    assert.ok(await page.locator("#route-distance-group").isVisible(), "Distance can be set before a route exists");
    assert.ok(await page.locator("#route-distance-hint").isVisible());
    assert.equal(await page.locator("#route-library").isVisible(), false, "An empty saved-route library stays hidden");
    const panel = await page.locator("#map-sidebar").boundingBox();
    assert.ok(panel.y >= 58 && panel.y + panel.height <= 700, "Filter sheet must fit the screen");
    await page.keyboard.press("Shift+Tab");
    assert.ok(await page.evaluate(() => document.querySelector("#map-sidebar").contains(document.activeElement)), "Focus stays inside the modal");
    await page.keyboard.press("Escape");
    assert.equal(await page.locator("#map-sidebar").evaluate((element) => element.open), false);
    assert.equal(await page.locator("#country-filter").count(), 0, "The map no longer has a country filter");
    console.log("PASS: direct route action, fitting filter sheet and keyboard focus");

    await page.locator("#toggle-filters").click();
    await page.locator("#choose-gpx").scrollIntoViewIfNeeded();
    const [chooser] = await Promise.all([page.waitForEvent("filechooser"), page.locator("#choose-gpx").click()]);
    await chooser.setFiles(file("track.gpx", track));
    await page.waitForFunction(() => savedRoutes.length === 1);
    assert.equal(await page.locator("#route-distance-group").isVisible(), true);
    assert.equal(await page.locator("#route-distance-hint").isVisible(), false, "The hint disappears once a track is active");
    assert.match(await page.locator("#route-summary").innerText(), /Testfietstocht/);
    const saved = await page.evaluate(() => localStorage.getItem(ROUTE_LIBRARY_KEY));
    const badFiles = ["<gpx><", '<gpx><wpt lat="NaN" lon="x"/></gpx>', '<gpx><wpt lon="5"/></gpx>', '<gpx><wpt lat="999" lon="5"/></gpx>', '<xml><wpt lat="52" lon="5"/></xml>'];
    for (const [index, contents] of badFiles.entries()) {
      await page.locator("#gpx-file").setInputFiles(file(`invalid-${index}.gpx`, contents));
      await page.waitForFunction(() => document.querySelector("#route-feedback").classList.contains("is-error"));
      assert.equal(await page.evaluate(() => localStorage.getItem(ROUTE_LIBRARY_KEY)), saved);
      assert.equal(await page.evaluate(() => savedRoutes.length), 1);
    }
    await page.locator('[data-route-distance="all"]').click();
    assert.equal(await page.evaluate(() => routeFilterEnabled()), false);
    await page.reload({ waitUntil: "load" });
    await settled();
    assert.equal(await page.evaluate(() => routeFilterActive), false);
    assert.equal(await page.evaluate(() => selectedCountryCodes().size === ALL_COUNTRY_CODES.length), true);
    console.log("PASS: GPX import, invalid-file recovery and preserved route settings");

    await page.locator("#toggle-filters").click();
    await page.locator("[data-route-remove]").click();
    assert.equal(await page.evaluate(() => savedRoutes.length), 0);
    await page.locator("#undo-route-removal").click();
    assert.equal(await page.evaluate(() => savedRoutes.length), 1);
    await page.locator("#gpx-file").setInputFiles(file("second.gpx", track.replace("Testfietstocht", "Tweede tocht")));
    await page.waitForFunction(() => savedRoutes.length === 2);
    const savedTwo = await page.evaluate(() => localStorage.getItem(ROUTE_LIBRARY_KEY));
    await page.locator("#clear-route").click();
    await page.locator("#undo-route-removal").click();
    assert.equal(await page.evaluate(() => localStorage.getItem(ROUTE_LIBRARY_KEY)), savedTwo);
    await page.locator('[data-route-remove]').last().click();
    assert.equal(await page.evaluate(() => savedRoutes.length), 1);
    await page.locator("#reset-filters").click();
    assert.equal(await page.evaluate(() => savedRoutes.length), 1);
    assert.equal(await page.locator("#filter-count").innerText(), "1", "Reset restores the default: all types, 10 km along the active route");
    assert.equal(await page.evaluate(() => routeDistanceKm), 10);
    await page.locator('[data-route-distance="all"]').click();
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
        if (path === "routebronnen.html") {
          await page.goto(url(path), { waitUntil: "load" });
          await page.waitForURL(/regels\.html#planners$/);
          continue;
        }
        await page.goto(url(path), { waitUntil: "load" });
        if (path === "netwerken.html") {
          await page.waitForURL(/over\.html#bronnen$/);
          continue;
        }
        assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1), `${path}: horizontal overflow at ${width}`);
        assert.ok(await page.locator('#menu-toggle:visible, .site-nav:visible').count() >= 1, `${path}: navigation is reachable`);
        {
          const last = page.locator(".page section, .page .callout").last();
          await last.scrollIntoViewIfNeeded();
          const bounds = await last.boundingBox();
          assert.ok(bounds.y < height && bounds.y + bounds.height > 52, `${path}: last section is reachable`);
          assert.ok(await page.locator(".page p").first().evaluate((element) => parseFloat(getComputedStyle(element).fontSize) >= 13));
        }
        if (path === "regels.html") {
          await page.goto(url("regels.html?country=DE"), { waitUntil: "load" });
          await page.waitForSelector("#country-rule h2");
          assert.equal(await page.locator("#country-rule h2").innerText(), "Germany");
          assert.equal(await page.locator("#country-rule .source-link").count(), 1);
          assert.equal(await page.locator("#country-routes h2").innerText(), "Routes in Germany");
          assert.match(await page.locator("#country-routes .list-title").first().innerText(), /Radnetz Deutschland/);
          assert.ok(await page.locator("#planners .list-row").count() >= 5, "Route planners live in the guide");
          assert.equal(await page.locator("#choose-gpx, #gpx-file, [data-route-distance]").count(), 0, "Settings can only be changed on the map");
          await page.locator("#regio-brandenburg .disclosure-toggle").waitFor();
          assert.match(await page.locator("#regio-brandenburg .source-link").getAttribute("href"), /^https:\/\/bravors\.brandenburg\.de\//);
          await page.fill("#rules-country", "swe");
          await page.locator("#rules-results button").first().click();
          assert.equal(await page.locator("#country-rule h2").innerText(), "Sweden");
          await page.goto(url("regels.html?country=AX"), { waitUntil: "load" });
          await page.waitForSelector("#country-rule [data-country=FI]");
          await page.locator("#country-rule [data-country=FI]").click();
          assert.equal(await page.locator("#country-rule h2").innerText(), "Finland");
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
    await locationPage.waitForFunction(() => typeof mapDataLoading !== "undefined" && !mapDataLoading);
    assert.equal(await locationPage.evaluate(() => window.locationRequestCount), 0, "Previously granted permission must not trigger automatic GPS");
    assert.equal(await locationPage.evaluate(() => userLocation), null);
    await locationPage.locator("#locate-me").click();
    await locationPage.waitForFunction(() => userLocation && !mapDataLoading);
    assert.equal(await locationPage.evaluate(() => window.locationRequestCount), 1);
    assert.equal(await locationPage.evaluate(() => userLocation.lat), 52.1);
    await locationPage.reload({ waitUntil: "load" });
    await locationPage.waitForFunction(() => typeof mapDataLoading !== "undefined" && !mapDataLoading);
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
    await quotaPage.waitForFunction(() => typeof savedRoutes !== "undefined");
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
    await quotaPage.waitForFunction(() => typeof savedRoutes !== "undefined");
    assert.equal(await quotaPage.evaluate(() => savedRoutes[0]?.name), "Existing route");
    assert.ok(await quotaPage.evaluate(() => localStorage.getItem(LEGACY_ROUTE_KEY)));
    console.log("PASS: failed GPX migration preserves legacy route data");
    await quotaContext.close();
  } finally { await browser.close(); }
})().catch((error) => { console.error(error); process.exitCode = 1; });
