import assert from "node:assert/strict";
import { existsSync, readFileSync, readdirSync } from "node:fs";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";
import { getPreviewMediaPresentation } from "../library-preview-config.mjs";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const compatibilityCss = readFileSync(path.join(root, "library-technical-fixes.css"), "utf8");
const runtime = readFileSync(path.join(root, "library-technical-fixes.js"), "utf8");
const analytics = readFileSync(path.join(root, "analytics.js"), "utf8");

const cardPreviewOverrides = Object.freeze({
  museum: "assets/cases/museum-app/video-frames/01-home.png",
  fashion: "assets/cases/fashion-shopping-app/card-screen.png",
  news: "assets/cases/news-app/card-screen.png",
  notebook: "demo/marble-note/screenshots/library-preview-reference-v2.png"
});

function resolveCardPreview(caseRecord) {
  if (cardPreviewOverrides[caseRecord.id]) return cardPreviewOverrides[caseRecord.id];
  if (caseRecord.liveDemo) {
    return caseRecord.liveDemo
      .replace(/^\.\//, "")
      .replace(/index\.html$/, "screenshots/library-preview-2x.png");
  }
  return (caseRecord.previewImage || caseRecord.poster || "").replace(/^\.\//, "");
}

function readImageDimensions(filePath) {
  const buffer = readFileSync(filePath);

  if (buffer.length >= 24 && buffer.subarray(1, 4).toString("ascii") === "PNG") {
    return { width: buffer.readUInt32BE(16), height: buffer.readUInt32BE(20) };
  }

  if (buffer.length >= 10 && buffer.subarray(0, 3).toString("ascii") === "GIF") {
    return { width: buffer.readUInt16LE(6), height: buffer.readUInt16LE(8) };
  }

  if (buffer.length >= 4 && buffer[0] === 0xff && buffer[1] === 0xd8) {
    let offset = 2;
    const startOfFrameMarkers = new Set([0xc0, 0xc1, 0xc2, 0xc3, 0xc5, 0xc6, 0xc7, 0xc9, 0xca, 0xcb, 0xcd, 0xce, 0xcf]);
    while (offset + 9 < buffer.length) {
      if (buffer[offset] !== 0xff) {
        offset += 1;
        continue;
      }
      const marker = buffer[offset + 1];
      if (startOfFrameMarkers.has(marker)) {
        return { width: buffer.readUInt16BE(offset + 7), height: buffer.readUInt16BE(offset + 5) };
      }
      if (marker === 0xd8 || marker === 0xd9) {
        offset += 2;
        continue;
      }
      if (offset + 4 > buffer.length) break;
      const segmentLength = buffer.readUInt16BE(offset + 2);
      if (segmentLength < 2) break;
      offset += 2 + segmentLength;
    }
  }

  return null;
}

test("phone-shaped media stays in device chrome", () => {
  assert.equal(getPreviewMediaPresentation(390, 844), "device");
  assert.equal(getPreviewMediaPresentation(375, 812), "device");
  assert.equal(getPreviewMediaPresentation(1080, 1920), "device");
});

test("boards and desktop-like media use neutral artboards", () => {
  assert.equal(getPreviewMediaPresentation(1600, 900), "artboard");
  assert.equal(getPreviewMediaPresentation(1200, 1200), "artboard");
  assert.equal(getPreviewMediaPresentation(1200, 900), "artboard");
});

test("all case-card preview assets exist and have readable dimensions", () => {
  const caseDirectory = path.join(root, "catalog", "cases");
  const records = readdirSync(caseDirectory)
    .filter((name) => name.endsWith(".json"))
    .sort()
    .map((name) => JSON.parse(readFileSync(path.join(caseDirectory, name), "utf8")));

  assert.equal(records.length, 23, "case library should retain all 23 records");

  const audit = [];
  for (const record of records) {
    const previewPath = resolveCardPreview(record);
    assert.ok(previewPath, `missing card preview path for ${record.id}`);
    const absolutePath = path.join(root, previewPath);
    assert.ok(existsSync(absolutePath), `missing card preview asset for ${record.id}: ${previewPath}`);

    const dimensions = readImageDimensions(absolutePath);
    assert.ok(dimensions, `unsupported or unreadable preview image for ${record.id}: ${previewPath}`);
    audit.push(`${record.id}: ${dimensions.width}x${dimensions.height} -> ${getPreviewMediaPresentation(dimensions.width, dimensions.height)}`);
  }

  console.log(`\nCase preview aspect audit\n${audit.join("\n")}\n`);
});

test("adaptive preview runtime classifies newly rendered gallery media", () => {
  assert.match(runtime, /getPreviewMediaPresentation/);
  assert.match(runtime, /MutationObserver/);
  assert.match(runtime, /is-artboard-preview/);
  assert.match(runtime, /naturalWidth/);
  assert.match(runtime, /videoWidth/);
});

test("adaptive preview layer prevents crop and magic zoom", () => {
  assert.match(compatibilityCss, /\.phone-media\s*\{[^}]*object-fit:\s*contain\s*!important/);
  assert.match(compatibilityCss, /transform:\s*none\s*!important/);
  assert.match(compatibilityCss, /\.phone-frame\.is-artboard-preview/);
  assert.match(compatibilityCss, /--adaptive-media-ratio/);
});

test("preview runtime is loaded as an ES module so it can share preview config", () => {
  assert.match(analytics, /previewRuntime\.type\s*=\s*"module"/);
  assert.match(analytics, /library-technical-fixes\.js\?v=20260816-adaptive-preview-v1/);
});
