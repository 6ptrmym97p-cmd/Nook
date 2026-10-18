// Publish only browser assets; repository metadata and tooling stay private to the build.
import { cpSync, mkdirSync, readdirSync, rmSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";

const root = fileURLToPath(new URL("../", import.meta.url));
const output = path.join(root, "dist");
rmSync(output, { recursive: true, force: true });
mkdirSync(output);
const assets = readdirSync(root).filter((name) => /\.(html|css|js|png|ico|svg|webmanifest)$/.test(name));
for (const name of [...assets, "_headers", "data", "vendor"]) {
  cpSync(path.join(root, name), path.join(output, name), { recursive: true });
}
console.log(`Published ${assets.length} root assets plus headers, data and vendor to dist/`);
