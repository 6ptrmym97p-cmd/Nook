// Requires Playwright, Chromium and a static server; no feedback is sent live.
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
    const context = await browser.newContext({ viewport: { width: 390, height: 844 }, serviceWorkers: "block" });
    const page = await context.newPage();
    const errors = [];
    page.on("pageerror", (error) => errors.push(error.message));
    let reply = { status: 200, contentType: "text/html", body: "<!doctype html><title>Nook</title>" };
    let requests = 0;
    await context.route("**/api/feedback", async (route) => {
      const body = route.request().postDataJSON();
      assert.equal(body.message, "The map stopped loading on my route.");
      assert.equal(body.email, "cyclist@example.com");
      assert.equal(body.context.language, "nl");
      requests++;
      await route.fulfill(reply);
    });
    const url = new URL("over.html", base.endsWith("/") ? base : base + "/");
    url.searchParams.set("lang", "nl");
    await page.goto(url.href, { waitUntil: "load" });
    await page.locator(".feedback-fab").click();
    const message = page.locator('.feedback-form [name="message"]');
    const email = page.locator('.feedback-form [name="email"]');
    const send = page.locator('.feedback-form [type="submit"]');
    const status = page.locator(".feedback-status");
    await message.fill("The map stopped loading on my route.");
    await email.fill("cyclist@example.com");

    for (const response of [reply,
      { status: 200, contentType: "application/json", body: "{}" },
      { status: 200, contentType: "application/json", body: "null" },
      { status: 503, contentType: "application/json", body: JSON.stringify({ error: "Feedback is nog niet ingesteld." }) },
    ]) {
      reply = response;
      await send.click();
      await page.waitForFunction(() => document.querySelector(".feedback-status").classList.contains("is-error"));
      assert.equal(await message.inputValue(), "The map stopped loading on my route.");
      assert.equal(await email.inputValue(), "cyclist@example.com");
      assert.ok(await send.isEnabled());
      assert.equal(await page.locator(".feedback-dialog").evaluate((dialog) => dialog.open), true);
    }
    assert.match(await status.innerText(), /nog niet ingesteld/);
    console.log("PASS: HTML fallbacks, missing acknowledgements and unavailable storage preserve the message and allow retry");

    reply = { status: 201, contentType: "application/json", body: JSON.stringify({ ok: true }) };
    await send.click();
    await page.waitForFunction(() => document.querySelector('.feedback-form [name="message"]').value === "");
    assert.equal(await email.inputValue(), "");
    assert.equal(await status.evaluate((element) => element.classList.contains("is-error")), false);
    assert.match(await status.innerText(), /ontvangen/);
    assert.equal(requests, 5);
    assert.deepEqual(errors, []);
    await context.close();
    console.log("PASS: retry clears the form only after the server confirms receipt");
  } finally {
    await browser.close();
  }
})().catch((error) => { console.error(error); process.exitCode = 1; });
