// The About page explains storage and lets visitors clear what nook saved in their browser.
const assert = require("node:assert/strict");
const { chromium } = require("playwright");
const base = process.env.NOOK_TEST_URL || "http://127.0.0.1:8000/";

(async () => {
  const browser = await chromium.launch({ executablePath: process.env.NOOK_CHROMIUM || "/usr/bin/chromium", args: ["--no-sandbox"] });
  try {
    const context = await browser.newContext({ viewport: { width: 390, height: 844 }, serviceWorkers: "block" });
    const page = await context.newPage();
    const errors = [];
    const hosts = new Set();
    page.on("pageerror", (error) => errors.push(error.message));
    page.on("request", (request) => hosts.add(new URL(request.url()).host));
    await page.goto(new URL("over.html?lang=nl", base).href, { waitUntil: "networkidle" });
    assert.deepEqual([...hosts], [new URL(base).host], "The About page loads nothing from other sites, fonts included");
    assert.ok(await page.evaluate(async () => { await document.fonts.ready; return document.fonts.check('600 16px "DM Sans"'); }), "DM Sans loads from nook");
    assert.equal(await page.locator("#cookies").innerText(), "Privacy en cookies");
    console.log("PASS: fonts load from nook itself and the page names cookies");

    await page.evaluate(() => {
      localStorage.setItem("nook-saved-routes-v1", "[]");
      localStorage.setItem("nook-language-v1", "nl");
      sessionStorage.setItem("nook-map-view-v1", "{}");
      localStorage.setItem("another-site-key", "keep");
    });
    page.once("dialog", (dialog) => dialog.dismiss());
    await page.locator("#clear-saved-data").click();
    assert.equal(await page.evaluate(() => localStorage.getItem("nook-saved-routes-v1")), "[]", "Cancelling keeps the data");
    assert.equal(await page.locator("#clear-saved-data-status").innerText(), "");

    page.once("dialog", (dialog) => {
      assert.equal(dialog.message(), "Je bewaarde routes en instellingen uit deze browser verwijderen?");
      dialog.accept();
    });
    await page.locator("#clear-saved-data").click();
    await page.waitForFunction(() => document.querySelector("#clear-saved-data-status").textContent !== "");
    assert.equal(await page.locator("#clear-saved-data-status").innerText(), "Bewaarde gegevens gewist.");
    assert.deepEqual(await page.evaluate(() => [Object.keys(localStorage), Object.keys(sessionStorage)]), [["another-site-key"], []]);
    assert.deepEqual(errors, []);
    console.log("PASS: clearing removes only nook's saved data, after confirmation");
  } finally { await browser.close(); }
})().catch((error) => { console.error(error); process.exitCode = 1; });
