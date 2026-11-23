import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("../", import.meta.url));
const directives = (policy) => Object.fromEntries(policy.split(";").map((value) => value.trim().split(/\s+/)).filter(([name]) => name).map(([name, ...values]) => [name, values]));

test("script execution is restricted to Nook assets in both edge and HTML policies", () => {
  const headers = fs.readFileSync(root + "_headers", "utf8");
  const policy = headers.match(/Content-Security-Policy: (.+)/)[1];
  assert.deepEqual(directives(policy)["script-src"], ["'self'"]);
  assert.deepEqual(directives(policy)["frame-ancestors"], ["'none'"]);
  assert.match(headers, /X-Content-Type-Options: nosniff/);
  for (const name of ["index", "netwerken", "regels", "over", "routebronnen", "404"]) {
    const html = fs.readFileSync(root + name + ".html", "utf8");
    const meta = html.match(/<meta[^>]+http-equiv="Content-Security-Policy"[^>]+content="([^"]+)"/);
    assert.ok(meta, name + " lacks its fallback CSP");
    const csp = directives(meta[1]);
    assert.deepEqual(csp["script-src"], ["'self'"], name + " should not allow an external script CDN");
    assert.deepEqual(csp["object-src"], ["'none'"]);
    assert.deepEqual(csp["base-uri"], ["'self'"]);
  }
});

test("fonts are served from nook itself, so no visitor IP address reaches a font CDN", () => {
  const headers = fs.readFileSync(root + "_headers", "utf8");
  const edge = directives(headers.match(/Content-Security-Policy: (.+)/)[1]);
  assert.deepEqual(edge["font-src"], ["'self'", "data:"]);
  assert.ok(!edge["style-src"].some((source) => source.startsWith("https:")), "Stylesheets only come from nook");
  for (const name of ["index", "netwerken", "regels", "over", "routebronnen", "404"]) {
    const html = fs.readFileSync(root + name + ".html", "utf8");
    assert.doesNotMatch(html, /fonts\.(googleapis|gstatic)\.com/, name + " still loads Google Fonts");
    const csp = directives(html.match(/<meta[^>]+http-equiv="Content-Security-Policy"[^>]+content="([^"]+)"/)[1]);
    assert.deepEqual(csp["font-src"], ["'self'", "data:"], name);
  }
  const css = fs.readFileSync(root + "styles.css", "utf8");
  for (const [, file] of css.matchAll(/url\("(vendor\/dm-sans[^"]+)"\)/g)) assert.ok(fs.existsSync(root + file), file);
  assert.ok(fs.existsSync(root + "vendor/dm-sans-5.3.0/OFL.txt"), "The font licence ships with the font");
});
