import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { gzipSync } from "node:zlib";
import { fileURLToPath } from "node:url";

export const POINT_TYPES = ["host", "camping", "hut", "designated"];
export const RECORD_BYTES = 16;
const DETAIL_BATCH_SIZE = 128;

// Keep only coordinates and filter fields in the initial map download. Full
// descriptions, photos and facilities live in small, lazily requested batches.
export function buildMapData(dataDir) {
  const snapshots = fs.readdirSync(dataDir).filter((file) => /^(vodf|wtmg|camping|campwild|denmark)-[A-Z]{2}\.json$/.test(file)).sort();
  const sources = new Map();
  const append = (kind, country, items) => {
    const key = `${kind}-${country}`;
    if (!sources.has(key)) sources.set(key, { kind, country, items: [] });
    sources.get(key).items.push(...items);
  };
  if (snapshots.length) {
    for (const file of snapshots) {
      const [kind, country] = file.replace(".json", "").split("-");
      const payload = JSON.parse(fs.readFileSync(path.join(dataDir, file), "utf8"));
      append(kind, country, payload.pins || payload.places || []);
    }
  } else {
    const previous = JSON.parse(fs.readFileSync(path.join(dataDir, "map-index.json"), "utf8"));
    for (const chunk of previous.chunks) {
      append(chunk.kind, chunk.country, JSON.parse(fs.readFileSync(path.join(dataDir, chunk.file), "utf8")));
    }
  }
  const count = [...sources.values()].reduce((sum, source) => sum + source.items.length, 0);
  const buffer = Buffer.alloc(count * RECORD_BYTES);
  const chunks = [];
  const detailDir = path.join(dataDir, "map-details");
  fs.mkdirSync(detailDir, { recursive: true });
  const hash = crypto.createHash("sha256");
  let point = 0;
  for (const [key, source] of [...sources.entries()].sort(([a], [b]) => a.localeCompare(b))) {
    // Nearby places usually share a detail request (including candidate lists).
    source.items.sort((a, b) => Math.floor(a.lat * 4) - Math.floor(b.lat * 4) || Math.floor(a.lng * 4) - Math.floor(b.lng * 4) || a.lat - b.lat || a.lng - b.lng);
    for (let start = 0; start < source.items.length; start += DETAIL_BATCH_SIZE) {
      const items = source.items.slice(start, start + DETAIL_BATCH_SIZE);
      const file = `map-details/${key}-${String(start / DETAIL_BATCH_SIZE).padStart(3, "0")}.json`;
      const chunk = chunks.length;
      if (chunk > 65535) throw new Error("Too many map detail batches");
      chunks.push({ file, kind: source.kind, country: source.country, count: items.length });
      const json = JSON.stringify(items) + "\n";
      hash.update(json);
      fs.writeFileSync(path.join(dataDir, file), json);
      items.forEach((item, offset) => {
        const type = source.kind === "vodf" || source.kind === "wtmg" ? "host" : source.kind === "camping" ? "camping" : item.type;
        if (!Number.isFinite(item.lat) || !Number.isFinite(item.lng) || !POINT_TYPES.includes(type)) throw new Error(`Invalid map point in ${key}`);
        const position = point++ * RECORD_BYTES;
        buffer.writeInt32LE(Math.round(item.lng * 1e6), position);
        buffer.writeInt32LE(Math.round(item.lat * 1e6), position + 4);
        buffer.writeUInt16LE(chunk, position + 8);
        buffer.writeUInt16LE(offset, position + 10);
        buffer.writeUInt8(POINT_TYPES.indexOf(type), position + 12);
      });
    }
  }
  hash.update(buffer);
  const manifest = { version: hash.digest("hex").slice(0, 16), count, recordBytes: RECORD_BYTES, gzip: "map-points.bin.gz", types: POINT_TYPES, chunks };
  fs.writeFileSync(path.join(dataDir, "map-points.bin"), buffer);
  fs.writeFileSync(path.join(dataDir, "map-points.bin.gz"), gzipSync(buffer, { level: 9 }));
  fs.writeFileSync(path.join(dataDir, "map-index.json"), JSON.stringify(manifest) + "\n");
  // The batches replace the original snapshots without duplicating the dataset.
  for (const file of snapshots) fs.unlinkSync(path.join(dataDir, file));
  const retained = new Set(chunks.map((chunk) => path.basename(chunk.file)));
  for (const file of fs.readdirSync(detailDir)) {
    if (!retained.has(file) && /^(vodf|wtmg|camping|campwild|denmark)-[A-Z]{2}-\d+\.json$/.test(file)) fs.unlinkSync(path.join(detailDir, file));
  }
  return manifest;
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const dir = path.resolve(process.argv[2] || "data");
  const manifest = buildMapData(dir);
  console.log(`${manifest.count} map points, ${manifest.chunks.length} detail batches, ${manifest.count * RECORD_BYTES} index bytes`);
}
