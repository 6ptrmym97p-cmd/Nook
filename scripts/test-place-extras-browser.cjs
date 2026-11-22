// Place details lazily add a nearby photo, elevation and nearest town. External services are mocked.
const assert = require("node:assert/strict");
const { chromium } = require("playwright");
const base = process.env.NOOK_TEST_URL || "http://127.0.0.1:8000/";
const pixel = Buffer.from("iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=", "base64");

(async () => {
  const browser = await chromium.launch({ executablePath: process.env.NOOK_CHROMIUM || "/usr/bin/chromium", args: ["--no-sandbox"] });
  try {
    const context = await browser.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true, serviceWorkers: "block" });
    const page = await context.newPage();
    const errors = [];
    const requests = [];
    page.on("pageerror", (error) => errors.push(error.message));
    await context.route("**/commons.wikimedia.org/w/api.php**", (route) => {
      requests.push(new URL(route.request().url()));
      route.fulfill({ contentType: "application/json", body: JSON.stringify({ query: { pages: {
        1: { title: "File:Map of the valley.jpg", coordinates: [{ lat: 42.5001, lon: 2.0301 }], imageinfo: [{ thumburl: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/aa/Map.jpg/640px-Map.jpg", descriptionurl: "https://commons.wikimedia.org/wiki/File:Map.jpg", mime: "image/jpeg" }] },
        2: { title: "File:Valley view.jpg", coordinates: [{ lat: 42.503, lon: 2.03 }], imageinfo: [{ thumburl: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/bb/Valley.jpg/640px-Valley.jpg", descriptionurl: "https://commons.wikimedia.org/wiki/File:Valley_view.jpg", mime: "image/jpeg", extmetadata: { Artist: { value: '<a href="//commons.wikimedia.org/wiki/User:Example">Example Photographer</a>' }, LicenseShortName: { value: "CC BY-SA 4.0" } } }] },
        3: { title: "File:Far away.jpg", coordinates: [{ lat: 42.51, lon: 2.03 }], imageinfo: [{ thumburl: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/cc/Far.jpg/640px-Far.jpg", descriptionurl: "https://commons.wikimedia.org/wiki/File:Far.jpg", mime: "image/jpeg" }] },
      } } }) });
    });
    await context.route("**/upload.wikimedia.org/**", (route) => route.fulfill({ contentType: "image/png", body: pixel }));
    await context.route("**/api.open-meteo.com/v1/elevation**", (route) => {
      requests.push(new URL(route.request().url()));
      route.fulfill({ contentType: "application/json", body: JSON.stringify({ elevation: [1849.6] }) });
    });
    await context.route("**/nominatim.openstreetmap.org/reverse**", (route) => {
      requests.push(new URL(route.request().url()));
      route.fulfill({ contentType: "application/json", body: JSON.stringify({ address: { village: "Font-Romeu", country_code: "fr" } }) });
    });

    await page.goto(new URL("index.html", base).href, { waitUntil: "load" });
    await page.waitForFunction(() => typeof mapDataLoading !== "undefined" && !mapDataLoading);
    const place = { name: "Basic shelter", lat: 42.5, lng: 2.03, type: "hut", sourceLabel: "CampWild", sourceUrl: "https://map.campwild.org/places/1/", confidence: 2, stay: "", cost: "", water: "", extraFacts: [] };
    await page.evaluate((item) => renderPlace(item), place);
    await page.waitForSelector("#place-panel .place-near");
    assert.equal(await page.locator("#place-panel .place-near").innerText(), "Near Font-Romeu");
    assert.match(await page.locator("#place-panel .place-facts").innerText(), /Elevation\s+1,850 m/);
    const photo = page.locator("#place-panel .place-photo-wrap.is-nearby");
    await photo.waitFor();
    assert.match(await photo.locator("img").getAttribute("src"), /Valley\.jpg/, "Maps are skipped and the nearest real photo wins");
    assert.match(await photo.locator("figcaption").innerText(), /Nearby photo, 350 m away · Example Photographer · CC BY-SA 4\.0/);
    assert.equal(await photo.locator("figcaption a").getAttribute("href"), "https://commons.wikimedia.org/wiki/File:Valley_view.jpg");
    assert.ok(requests.every((url) => !/52\.|5\.1/.test(url.search)), "Only the place's coordinates are sent");
    assert.equal(await page.locator("#place-panel .place-rules-link").getAttribute("href"), "regels.html?country=FR", "The reverse lookup corrects border-area countries");
    assert.equal(requests.length, 3, "Each service is asked once");

    await page.locator("#place-panel .place-panel-close").click();
    await page.evaluate((item) => renderPlace(item), place);
    await page.waitForSelector("#place-panel .place-near");
    assert.equal(requests.length, 3, "Reopening a place reuses the cached details");
    console.log("PASS: opening a place lazily adds a nearby photo with credit, elevation and nearest town");

    await context.unroute("**/commons.wikimedia.org/w/api.php**");
    await context.unroute("**/api.open-meteo.com/v1/elevation**");
    await context.unroute("**/nominatim.openstreetmap.org/reverse**");
    await context.route(/commons\.wikimedia\.org|api\.open-meteo\.com|nominatim\.openstreetmap\.org/, (route) => route.abort("failed"));
    await page.locator("#place-panel .place-panel-close").click();
    await page.evaluate((item) => renderPlace({ ...item, name: "Other shelter", lat: 46.1, lng: 7.2 }), place);
    await page.waitForTimeout(500);
    assert.equal(await page.locator("#place-panel h2").innerText(), "Other shelter");
    assert.equal(await page.locator("#place-panel .place-near, #place-panel .place-photo-wrap").count(), 0);
    assert.ok(await page.locator("#place-panel .place-link").isVisible(), "The panel still works when the services fail");
    assert.deepEqual(errors, []);
    console.log("PASS: unavailable services leave the place panel intact");
  } finally { await browser.close(); }
})().catch((error) => { console.error(error); process.exitCode = 1; });
