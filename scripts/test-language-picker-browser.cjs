const assert = require("node:assert/strict");
const { chromium } = require("playwright");
const base = process.env.NOOK_TEST_URL || "http://127.0.0.1:8000/";

(async () => {
  const browser = await chromium.launch({ executablePath: process.env.NOOK_CHROMIUM || "/usr/bin/chromium", env: process.env.NOOK_BROWSER_HOME ? { ...process.env, HOME: process.env.NOOK_BROWSER_HOME } : process.env, args: ["--no-sandbox"] });
  try {
    const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
    const target = new URL("over.html?lang=nl", base);
    await page.goto(target.href, { waitUntil: "domcontentloaded" });
    await page.waitForFunction(() => window.NookI18n?.code === "nl" && !document.querySelector("#language-select").disabled);
    const picker = page.locator("#language-select");
    const control = page.locator(".language-control");
    assert.equal(await picker.locator("option").count(), 21);
    assert.equal(await picker.inputValue(), "nl");
    assert.equal(await page.locator(".language-code").textContent(), "NL");
    assert.equal(await page.locator(".language-code").isVisible(), false);
    const mobile = await control.boundingBox();
    assert.ok(mobile.width <= 48 && mobile.height >= 44, "Mobile keeps a small globe with a touch-sized native picker");
    await control.click();
    await page.keyboard.press("Escape");
    await picker.focus();
    assert.equal(await control.evaluate((element) => element.matches(":focus-within")), true);
    assert.equal(await control.evaluate((element) => getComputedStyle(element).outlineStyle), "solid");
    await Promise.all([page.waitForURL((url) => url.searchParams.get("lang") === "ar"), picker.selectOption("ar")]);
    await page.waitForFunction(() => window.NookI18n?.code === "ar");
    assert.equal(await page.getAttribute("html", "dir"), "rtl");
    await page.setViewportSize({ width: 1440, height: 900 });
    const desktop = await control.boundingBox();
    assert.ok(desktop.width <= 75, "Desktop shows a short code instead of the full language name");
    assert.equal(await page.locator(".language-code").innerText(), "AR");
    assert.ok(await page.locator(".language-code").isVisible());
    assert.equal(await picker.locator("option:checked").innerText(), "العربية");
    assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth));
    console.log("PASS: compact mobile/desktop language picker retains all languages, native clicking, focus, saved choice and RTL support");
  } finally { await browser.close(); }
})().catch((error) => { console.error(error); process.exitCode = 1; });
