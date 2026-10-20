import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import vm from "node:vm";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("../", import.meta.url));
const source = fs.readFileSync(path.join(root, "i18n.js"), "utf8");
const catalogue = (code) => JSON.parse(fs.readFileSync(path.join(root, "locales", code + ".json"), "utf8"));
const placeholders = (value) => [...value.matchAll(/\{\d+\}/g)].map(([key]) => key).sort();

async function interfaceFor({ query = "", stored = "", deniedStorage = false, offline = false } = {}) {
  const downloads = [];
  const notices = [];
  const document = {
    baseURI: "https://example.test/", readyState: "complete", documentElement: {},
    querySelectorAll: () => [], querySelector: () => null,
    createElement: () => ({ setAttribute() {}, textContent: "" }),
    body: { append: (element) => notices.push(element) },
  };
  const context = vm.createContext({
    window: {}, document, Node: { TEXT_NODE: 3 }, URL, Intl, Map, Set, Object, AbortController,
    location: new URL("https://example.test/" + query), navigator: { language: "nl-NL" },
    history: { replaceState() {} }, setTimeout, clearTimeout,
    localStorage: { getItem() { if (deniedStorage) throw new Error("Blocked"); return stored; } },
    fetch: async (url) => {
      downloads.push(url.href);
      if (offline) throw new TypeError("Offline");
      const code = /\/([a-z]+)\.json/.exec(url.pathname)?.[1];
      return { ok: true, json: async () => catalogue(code) };
    },
  });
  vm.runInContext(source, context);
  await context.window.NookI18n.ready;
  return { api: context.window.NookI18n, document, downloads, notices };
}

test("English is the default regardless of the browser language or blocked storage", async () => {
  for (const deniedStorage of [false, true]) {
    const app = await interfaceFor({ deniedStorage });
    assert.equal(app.api.code, "en");
    assert.equal(app.document.documentElement.lang, "en");
    assert.equal(app.api.text("Map"), "Map");
    assert.deepEqual(app.downloads, [], "English must not download other language files");
  }
});

test("a supported URL language overrides the saved preference, while invalid languages cannot request arbitrary files", async () => {
  const app = await interfaceFor({ query: "?lang=de", stored: "nl" });
  assert.equal(app.api.code, "de");
  assert.equal(app.api.text("Map"), catalogue("de").Map);
  assert.equal(app.downloads.length, 1);
  const invalid = await interfaceFor({ query: "?lang=../../private" });
  assert.equal(invalid.api.code, "en");
  assert.equal(invalid.downloads.length, 0);
});

test("RTL, local numbers and escaped wording do not change supplied GPX names", async () => {
  const arabic = await interfaceFor({ query: "?lang=ar" });
  assert.equal(arabic.document.documentElement.dir, "rtl");
  const german = await interfaceFor({ query: "?lang=de" });
  assert.equal(german.api.number(1.5), "1,5");
  const name = '<img src=x onerror="alert(1)">';
  const escaped = german.api.escapeHtml(name);
  const markup = german.api.html("Remove {0}", escaped);
  assert.ok(markup.includes(escaped));
  assert.ok(!markup.includes("<img"));
  assert.equal(german.api.text("Unknown text {0}", name), "Unknown text " + name);
});

test("a failed language download leaves an English interface and an actionable notice", async () => {
  const app = await interfaceFor({ query: "?lang=fr", offline: true });
  assert.equal(app.api.code, "en");
  assert.equal(app.document.documentElement.dir, "ltr");
  assert.ok(app.notices.some((notice) => notice.textContent.includes("Connect to the internet")));
});

test("all 21 languages cover the entire interface with intact interpolation fields", async () => {
  const app = await interfaceFor();
  assert.equal(app.api.languages.length, 21);
  assert.ok(app.api.languages.some(([code]) => code === "nl"));
  const english = catalogue("en");
  const keys = Object.keys(english).sort();
  for (const [code] of app.api.languages) {
    const translated = catalogue(code);
    assert.deepEqual(Object.keys(translated).sort(), keys, code + " has missing or extra messages");
    for (const key of keys) {
      assert.ok(translated[key].trim(), code + " has an empty message: " + key);
      assert.deepEqual(placeholders(translated[key]), placeholders(key), code + " changed a dynamic field: " + key);
      assert.ok(!/N00KARG|N00KMSG|__\d+__/.test(translated[key]), code + " contains a build marker");
      for (const brand of ["Nook", "Vrienden op de Fiets", "Welcome To My Garden", "OpenStreetMap", "CampWild", "GPX"]) {
        if (key.includes(brand)) assert.ok(translated[key].includes(brand), code + " translated a proper name or format: " + key);
      }
    }
  }
  const decode = (value) => value.replaceAll("&quot;", '"').replaceAll("&lt;", "<").replaceAll("&gt;", ">").replaceAll("&amp;", "&");
  for (const file of ["index.html", "regels.html", "routebronnen.html", "netwerken.html", "over.html"]) {
    const html = fs.readFileSync(path.join(root, file), "utf8");
    assert.match(html, /<html lang="en"/);
    for (const [, value] of html.matchAll(/data-i18n-(?:text|attrs)="([^"]*)"/g)) {
      for (const key of Object.values(JSON.parse(decode(value))).filter(Boolean)) assert.ok(Object.hasOwn(english, key), file + ": " + key);
    }
  }
  for (const file of ["app.js", "feedback.js", "i18n.js", "bootstrap.js"]) {
    const code = fs.readFileSync(path.join(root, file), "utf8");
    for (const [, value] of code.matchAll(/\b(?:t|th|text)\("((?:[^"\\]|\\.)*)"/g)) {
      const key = JSON.parse('"' + value + '"');
      assert.ok(Object.hasOwn(english, key), file + ": " + key);
    }
  }
});
