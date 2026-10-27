// Run against a deployed Cloudflare Pages preview or production, not Python's server.
const assert = require('node:assert/strict');
const { chromium } = require('playwright');
(async () => {
  assert.ok(process.env.NOOK_TEST_URL, 'Set NOOK_TEST_URL to the deployed Pages origin.');
  const browser = await chromium.launch({ executablePath: process.env.NOOK_CHROMIUM || '/usr/bin/chromium', args: ['--no-sandbox'], env: process.env.NOOK_BROWSER_HOME ? { ...process.env, HOME: process.env.NOOK_BROWSER_HOME } : process.env });
  try {
    const context = await browser.newContext({ viewport: { width: 390, height: 844 }, serviceWorkers: 'block' });
    const page = await context.newPage();
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    for (const [path, language, heading] of [
      ['/.env', 'nl', 'Pagina niet gevonden'],
      ['/.git/config', 'en', 'Page not found'],
      ['/wp-login.php', 'fr', 'Page introuvable'],
      ['/missing/nested/page', 'ar', 'الصفحة غير موجودة'],
    ]) {
      const url = new URL(path, process.env.NOOK_TEST_URL);
      url.searchParams.set('lang', language);
      const response = await page.goto(url.href);
      assert.equal(response.status(), 404, path);
      await page.waitForFunction(language => window.NookI18n?.code === language, language);
      assert.equal(await page.locator('h1').textContent(), heading);
      assert.equal(await page.locator('base').getAttribute('href'), '/');
      assert.equal(await page.locator('meta[name="robots"]').getAttribute('content'), 'noindex');
      assert.equal(await page.locator('a.button').evaluate(a => new URL(a.href).pathname), '/index.html');
      assert.ok(await page.evaluate(() => getComputedStyle(document.body).fontFamily.includes('DM Sans')), 'Root stylesheet must load on nested paths');
      assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth));
    }
    for (const path of ['/routebronnen', '/regels', '/netwerken', '/over']) {
      const response = await page.goto(new URL(path, process.env.NOOK_TEST_URL).href);
      assert.equal(response.status(), 200, path);
      await page.waitForFunction(() => Boolean(window.NookI18n));
    }
    const response = await page.goto(new URL('/', process.env.NOOK_TEST_URL).href);
    assert.equal(response.status(), 200);
    await page.waitForFunction(() => typeof mapDataLoading !== 'undefined' && !mapDataLoading);
    assert.equal(await page.evaluate(() => mapDataError), '');
    assert.ok(await page.evaluate(() => mapManifest.count > 200000));
    assert.deepEqual(errors, []);
    console.log('PASS: real 404 responses, nested assets and translated recovery links; existing pages and full map still load');
  } finally { await browser.close(); }
})().catch(error => { console.error(error); process.exitCode = 1; });
