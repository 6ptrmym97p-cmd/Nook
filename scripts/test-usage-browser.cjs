const assert = require('node:assert/strict');
const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.launch({ executablePath: process.env.NOOK_CHROMIUM || '/usr/bin/chromium', args: ['--no-sandbox'], env: process.env.NOOK_BROWSER_HOME ? { ...process.env, HOME: process.env.NOOK_BROWSER_HOME } : process.env });
  try {
    const context = await browser.newContext();
    const page = await context.newPage();
    const events = [];
    let fail = false;
    await page.route('**/api/gpx-import', async route => {
      const request = route.request();
      events.push(request);
      assert.equal(request.method(), 'POST');
      assert.equal(request.postData(), null, 'No file, name, coordinates or other payload');
      assert.equal(request.headers().cookie, undefined);
      assert.equal(request.headers().referer, undefined);
      if (fail) await route.abort();
      else await route.fulfill({ status: 204 });
    });
    const ready = async () => {
      await page.waitForFunction(() => typeof savedRoutes !== 'undefined' && typeof importGpx === 'function' && !mapDataLoading);
    };
    await page.goto(process.env.NOOK_TEST_URL || 'http://127.0.0.1:8087/');
    await ready();
    const upload = async (content, name = 'private-route.gpx') => {
      await page.locator('#gpx-file').setInputFiles({ name, mimeType: 'application/gpx+xml', buffer: Buffer.from(content) });
      await page.waitForTimeout(350);
    };
    await upload('<not-gpx/>');
    await upload('<gpx><metadata><name>Empty route</name></metadata></gpx>');
    assert.equal(events.length, 0, 'Invalid and empty files are not counted');
    const valid = '<gpx version="1.1"><trk><name>Private route</name><trkseg><trkpt lat="52.1" lon="5.1"/><trkpt lat="52.11" lon="5.11"/></trkseg></trk></gpx>';
    await upload(valid);
    assert.equal(events.length, 1);
    assert.equal(await page.evaluate(() => savedRoutes.length), 1);
    await page.reload();
    await ready();
    assert.equal(await page.evaluate(() => savedRoutes.length), 1);
    assert.equal(events.length, 1, 'Restoring a saved route is not a new import');
    fail = true;
    await upload(valid, 'second.gpx');
    assert.equal(events.length, 2);
    assert.equal(await page.evaluate(() => savedRoutes.length), 2, 'A failed count never blocks import');
    await page.evaluate(() => Object.defineProperty(navigator, 'globalPrivacyControl', { value: true, configurable: true }));
    await upload(valid, 'third.gpx');
    assert.equal(events.length, 2, 'Global Privacy Control is respected');
    assert.equal(await page.evaluate(() => savedRoutes.length), 3);
    console.log('PASS: imports counted without payload or cookies; invalid/empty files and restored routes excluded; failed analytics and privacy signals do not block importing');
  } finally { await browser.close(); }
})().catch(error => { console.error(error); process.exitCode = 1; });
