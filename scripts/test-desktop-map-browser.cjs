// Desktop mouse-drag regression checks; requires Playwright and a static server.
const assert = require("node:assert/strict");
const { chromium } = require("playwright");
const base = process.env.NOOK_TEST_URL || "http://127.0.0.1:8000/";

(async () => {
  const browser = await chromium.launch({
    executablePath: process.env.NOOK_CHROMIUM || "/usr/bin/chromium",
    env: process.env.NOOK_BROWSER_HOME ? { ...process.env, HOME: process.env.NOOK_BROWSER_HOME } : process.env,
    args: ["--no-sandbox"],
  });
  try {
    for (const deviceScaleFactor of [1, 2]) {
      const context = await browser.newContext({ viewport: { width: 1680, height: 1050 }, deviceScaleFactor, serviceWorkers: "block" });
      const page = await context.newPage();
      const errors = [];
      page.on("pageerror", (error) => errors.push(error.message));
      const settled = async () => {
        await page.waitForTimeout(220);
        await page.waitForFunction(() => typeof mapDataLoading !== "undefined" && !mapDataLoading);
        assert.equal(await page.evaluate(() => mapDataError), "");
      };
      await page.goto(base, { waitUntil: "domcontentloaded" });
      await settled();
      await page.evaluate(() => { map.setView([51.7, 6], 6, { animate: false }); });
      await settled();
      const checkCanvasAndTarget = () => page.evaluate(() => {
        const canvas = pinRenderer._container;
        const width = parseFloat(canvas.style.width);
        const height = parseFloat(canvas.style.height);
        const ratio = canvas.width / width;
        const marker = [...mapMarkers.values()].find((item) => {
          const p = map.latLngToContainerPoint(item.getLatLng());
          return item.options.fillColor === "#123127" && p.x > 160 && p.x < map.getSize().x - 160 && p.y > 160 && p.y < map.getSize().y - 160;
        });
        if (!marker) throw new Error("No visible cluster for desktop hit test");
        const layerPoint = marker._point;
        // Sample inside the fill, below the white cluster label. This catches
        // bitmap scaling/translation errors independently of DOM hit testing.
        const shift = marker.options.radius * 0.55;
        const x = Math.round((layerPoint.x - pinRenderer._bounds.min.x + shift) * ratio);
        const y = Math.round((layerPoint.y - pinRenderer._bounds.min.y + shift) * (canvas.height / height));
        const pixel = [...pinRenderer._ctx.getImageData(x, y, 1, 1).data];
        const frame = document.querySelector("#map").getBoundingClientRect();
        const point = map.latLngToContainerPoint(marker.getLatLng());
        return { ratio, pixels: canvas.width * canvas.height, cssPixels: width * height, pixel, zoom: map.getZoom(), x: frame.x + point.x, y: frame.y + point.y };
      });
      const before = await checkCanvasAndTarget();
      assert.ok(before.ratio >= 0.999 && before.ratio <= 2.001);
      if (deviceScaleFactor === 2) assert.ok(before.pixels < 6010000, "A large Retina desktop must not allocate a 15 MP pin bitmap");
      else assert.ok(Math.abs(before.pixels - before.cssPixels) < 10000, "Ordinary desktop rendering keeps native resolution");
      assert.deepEqual(before.pixel, [18, 49, 39, 255], "Pin paint and geographic click positions must line up");

      await page.evaluate(() => {
        window.desktopDrag = { active: false, redraws: 0, queries: 0, tileUpdates: 0 };
        const redraw = pinRenderer._redraw;
        pinRenderer._redraw = function (...args) { if (desktopDrag.active) desktopDrag.redraws++; return redraw.apply(this, args); };
        const post = mapWorker.postMessage.bind(mapWorker);
        mapWorker.postMessage = function (message, ...args) { if (desktopDrag.active && message.type === "query") desktopDrag.queries++; return post(message, ...args); };
        const update = baseMap._update;
        baseMap._update = function (...args) { if (desktopDrag.active) desktopDrag.tileUpdates++; return update.apply(this, args); };
      });
      const frame = await page.locator("#map").boundingBox();
      await page.mouse.move(frame.x + frame.width * 0.4, frame.y + frame.height * 0.5);
      await page.mouse.down();
      await page.evaluate(() => { desktopDrag.active = true; desktopDrag.started = performance.now(); });
      for (let step = 1; step <= 42; step++) {
        await page.mouse.move(frame.x + frame.width * 0.4 + step * 9, frame.y + frame.height * 0.5 + Math.sin(step / 8) * 40);
        await page.waitForTimeout(12);
      }
      const drag = await page.evaluate(() => { desktopDrag.active = false; return { ...desktopDrag, elapsed: performance.now() - desktopDrag.started }; });
      await page.mouse.up();
      await settled();
      assert.equal(drag.redraws, 0, "Dragging moves the existing pin surface without repainting it");
      assert.equal(drag.queries, 0, "Mouse movement must not recalculate places while dragging");
      assert.ok(drag.tileUpdates <= Math.ceil(drag.elapsed / 200) + 2, "Tile layout must stay below five updates per second during a desktop drag");
      const target = await checkCanvasAndTarget();
      assert.deepEqual(target.pixel, [18, 49, 39, 255], "Pins stay painted at the correct position after panning");
      await page.mouse.click(target.x, target.y);
      await settled();
      assert.ok(await page.evaluate((zoom) => map.getZoom() > zoom, target.zoom), "The real mouse click must still hit its cluster");
      assert.deepEqual(errors, []);
      console.log(`PASS: ${deviceScaleFactor}x desktop: ${before.pixels.toLocaleString("en-US")} backing pixels, no pin repaint or point query during dragging, correct paint and mouse hit detection`);
      await context.close();
    }
  } finally { await browser.close(); }
})().catch((error) => { console.error(error); process.exitCode = 1; });
