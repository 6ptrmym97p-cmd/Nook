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
  for (const name of ["index", "netwerken", "regels", "over", "routebronnen"]) {
    const html = fs.readFileSync(root + name + ".html", "utf8");
    const meta = html.match(/<meta[^>]+http-equiv="Content-Security-Policy"[^>]+content="([^"]+)"/);
    assert.ok(meta, name + " lacks its fallback CSP");
    const csp = directives(meta[1]);
    assert.deepEqual(csp["script-src"], ["'self'"], name + " should not allow an external script CDN");
    assert.deepEqual(csp["object-src"], ["'none'"]);
    assert.deepEqual(csp["base-uri"], ["'self'"]);
  }
});
