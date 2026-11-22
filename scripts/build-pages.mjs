// Publish only browser assets; repository metadata and tooling stay private to the build.
import { cpSync, mkdirSync, readdirSync, rmSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";
import { buildDiscoverability } from "./prerender.mjs";

const root = fileURLToPath(new URL("../", import.meta.url));
const output = path.join(root, "dist");
rmSync(output, { recursive: true, force: true });
mkdirSync(output);
const assets = readdirSync(root).filter((name) => /\.(html|css|js|png|jpg|ico|svg|webmanifest|txt|xml)$/.test(name));
for (const name of [...assets, "_headers", "data", "vendor", "locales"]) {
  cpSync(path.join(root, name), path.join(output, name), { recursive: true });
}
// Dutch pages, country guides and sitemap.xml are generated from the pages above.
const pages = buildDiscoverability(root, output);
console.log(`Published ${assets.length} root assets plus headers, data, vendor and translations to dist/`);
console.log(`Generated ${pages.length - 5} Dutch and country pages and a sitemap with ${pages.length} URLs`);
