import assert from "node:assert/strict";
import { existsSync, readFileSync, readdirSync } from "node:fs";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";
import {
  getLibraryPreviewProfile,
  getPreviewMediaPresentation,
  libraryPreviewCaseIds,
  previewContractVersion,
  standardCanonicalPreview,
  standardPreviewDetailWidth,
  standardPreviewDevice,
} from "../library-preview-config.mjs";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const componentCss = readFileSync(path.join(root, "src", "components", "device-preview", "device-preview.css"), "utf8");
const runtime = readFileSync(path.join(root, "src", "components", "device-preview", "device-preview.js"), "utf8");
const analytics = readFileSync(path.join(root, "analytics.js"), "utf8");
const libraryHtml = readFileSync(path.join(root, "library.html"), "utf8");
const i18nCss = readFileSync(path.join(root, "i18n.css"), "utf8");

const cardPreviewOverrides = Object.freeze({
  museum: "assets/cases/museum-app/video-frames/01-home.png",
  fashion: "assets/cases/fashion-shopping-app/card-screen.png",
  news: "assets/cases/news-app/card-screen.png"
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

test("all 19 active cases share one explicit Library-owned phone preview contract", () => {
  assert.equal(previewContractVersion, "20260820-cover-capture-v1");
  assert.deepEqual(standardPreviewDevice, { width: 390, height: 844 });
  assert.deepEqual(standardCanonicalPreview, { width: 780, height: 1688 });
  assert.equal(standardPreviewDetailWidth, 300);
  assert.equal(libraryPreviewCaseIds.length, 19);
  assert.equal(new Set(libraryPreviewCaseIds).size, 19);

  for (const id of libraryPreviewCaseIds) {
    const profile = getLibraryPreviewProfile(id);
    assert.ok(profile, `missing preview profile for ${id}`);
    assert.equal(profile.presentation, "device", `${id} should use phone presentation`);
    assert.equal(profile.frameOwner, "library", `${id} must have one Library-owned frame`);
    assert.equal(profile.allowBakedDevice, false, `${id} must reject baked device chrome`);
    assert.deepEqual(profile.screen, standardPreviewDevice, `${id} screen size drifted`);
    assert.deepEqual(profile.canonical, standardCanonicalPreview, `${id} canonical preview drifted`);
    assert.equal(profile.detailWidth, standardPreviewDetailWidth, `${id} detail width drifted`);
  }
});

test("phone-shaped fallback media stays in device chrome", () => {
  assert.equal(getPreviewMediaPresentation(390, 844), "device");
  assert.equal(getPreviewMediaPresentation(375, 812), "device");
  assert.equal(getPreviewMediaPresentation(1080, 1920), "device");
});

test("unknown boards and desktop-like media still use neutral artboards", () => {
  assert.equal(getPreviewMediaPresentation(1600, 900), "artboard");
  assert.equal(getPreviewMediaPresentation(1200, 1200), "artboard");
  assert.equal(getPreviewMediaPresentation(1200, 900), "artboard");
});

test("known case media is contract-driven instead of inferred from its bitmap ratio", () => {
  assert.equal(getPreviewMediaPresentation(1200, 900, { caseId: "organique" }), "device");
  assert.equal(getPreviewMediaPresentation(1200, 1200, { caseId: "notebook" }), "device");
});

test("notebook card uses the canonical phone preview instead of the reference artboard", () => {
  const notebook = JSON.parse(readFileSync(path.join(root, "catalog", "cases", "notebook.json"), "utf8"));
  const previewPath = resolveCardPreview(notebook);
  assert.equal(previewPath, "demo/marble-note/screenshots/library-preview-2x.png");

  const dimensions = readImageDimensions(path.join(root, previewPath));
  assert.deepEqual(dimensions, standardCanonicalPreview);
  assert.equal(getPreviewMediaPresentation(dimensions.width, dimensions.height, { caseId: "notebook" }), "device");
});

test("all 19 active card previews are canonical 780 by 1688 screen assets", () => {
  const caseDirectory = path.join(root, "catalog", "cases");
  const records = readdirSync(caseDirectory)
    .filter((name) => name.endsWith(".json"))
    .sort()
    .map((name) => JSON.parse(readFileSync(path.join(caseDirectory, name), "utf8")));

  assert.equal(records.length, 19, "case library should expose 19 active records after removing Buddy, Carry Bag, Aegean, and Lumen");
  assert.deepEqual(
    records.map((record) => record.id).sort(),
    [...libraryPreviewCaseIds].sort(),
    "preview contract must cover the exact active catalog",
  );

  const audit = [];
  for (const record of records) {
    const previewPath = resolveCardPreview(record);
    assert.ok(previewPath, `missing card preview path for ${record.id}`);
    const absolutePath = path.join(root, previewPath);
    assert.ok(existsSync(absolutePath), `missing card preview asset for ${record.id}: ${previewPath}`);

    const dimensions = readImageDimensions(absolutePath);
    assert.deepEqual(
      dimensions,
      standardCanonicalPreview,
      `${record.id} card preview must be the canonical 780 x 1688 screen asset: ${previewPath}`,
    );
    audit.push(`${record.id}: ${dimensions.width}x${dimensions.height} -> ${getPreviewMediaPresentation(dimensions.width, dimensions.height, { caseId: record.id })}`);
  }

  console.log(`\nCase preview contract audit\n${audit.join("\n")}\n`);
});

test("DevicePreview runtime tags rendered frames with the explicit case contract", () => {
  assert.match(runtime, /getLibraryPreviewProfile/);
  assert.match(runtime, /getCardCaseId/);
  assert.match(runtime, /getDetailCaseId/);
  assert.match(runtime, /data-case-id/);
  assert.match(runtime, /previewContractVersion/);
  assert.match(runtime, /dataset\.frameOwner/);
  assert.match(runtime, /MutationObserver/);
});

test("notebook legacy reference preview is normalized before card sizing", () => {
  assert.match(runtime, /library-preview-reference-v2\.png/);
  assert.match(runtime, /library-preview-2x\.png/);
  assert.match(runtime, /normalizeGalleryCardSource/);
});

test("canonical phone media fills the screen while only artboards use contain", () => {
  assert.match(
    componentCss,
    /\.phone-frame:not\(\.is-artboard-preview\) \.phone-media\s*\{[\s\S]*?object-fit:\s*cover\s*!important/,
  );
  assert.match(
    componentCss,
    /\.phone-frame\.is-artboard-preview \.phone-media\s*\{[\s\S]*?object-fit:\s*contain\s*!important/,
  );
  assert.doesNotMatch(componentCss, /^\.phone-media\s*\{[^}]*object-fit:\s*contain/m);
  assert.match(componentCss, /--library-detail-device-width:\s*300px/);
  assert.match(componentCss, /aspect-ratio:\s*390\s*\/\s*844/);
  assert.match(componentCss, /transform:\s*none\s*!important/);
});

test("DevicePreview runtime and styles load from the shared component", () => {
  assert.match(analytics, /previewRuntime\.type\s*=\s*"module"/);
  assert.match(analytics, /src\/components\/device-preview\/device-preview\.js\?v=20260816-arch-v1/);
  assert.match(libraryHtml, /src\/components\/device-preview\/device-preview\.css\?v=20260816-arch-v1/);
  assert.doesNotMatch(i18nCss, /library-technical-fixes/);
});
