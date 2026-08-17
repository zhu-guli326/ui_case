#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { styleGuides } from "../catalog/index.js";
import { applyLibraryCaseOverrides, libraryCaseOverrides } from "../src/features/library/library-case-overrides.mjs";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const guides = styleGuides.map((guide) => ({ ...guide }));
applyLibraryCaseOverrides(guides);

const errors = [];
const warnings = [];
const rows = [];
const ids = new Set();

function stripQuery(value) {
  return String(value || "").split("#", 1)[0].split("?", 1)[0];
}

function localFile(value) {
  const clean = stripQuery(value);
  if (!clean.startsWith("./")) return null;
  return path.resolve(root, clean.slice(2));
}

function checkLocalAsset(guide, key, value, { required = false } = {}) {
  if (!value) {
    if (required) errors.push(`${guide.id}: missing ${key}`);
    return { key, value: "", exists: false, local: false };
  }
  const file = localFile(value);
  if (!file) return { key, value, exists: true, local: false };
  const exists = fs.existsSync(file) && fs.statSync(file).isFile();
  if (!exists) errors.push(`${guide.id}: ${key} does not exist -> ${value}`);
  return { key, value, exists, local: true };
}

for (const guide of guides) {
  if (ids.has(guide.id)) errors.push(`duplicate case id: ${guide.id}`);
  ids.add(guide.id);

  const assets = [
    checkLocalAsset(guide, "referenceImage", guide.referenceImage, { required: true }),
    checkLocalAsset(guide, "poster", guide.poster),
    checkLocalAsset(guide, "previewImage", guide.previewImage),
    checkLocalAsset(guide, "video", guide.video),
    checkLocalAsset(guide, "liveDemo", guide.liveDemo)
  ];

  if (!guide.poster && !guide.previewImage && !guide.referenceImage) errors.push(`${guide.id}: no usable card image source`);
  if (!guide.video && !guide.liveDemo) warnings.push(`${guide.id}: static-only case (no video/live demo)`);
  if (guide.video && !/\.mp4(?:$|[?#])/i.test(guide.video)) warnings.push(`${guide.id}: video is not MP4 -> ${guide.video}`);
  if (guide.liveDemo && !/\.html(?:$|[?#])/i.test(guide.liveDemo)) errors.push(`${guide.id}: liveDemo must resolve to HTML -> ${guide.liveDemo}`);

  const override = libraryCaseOverrides[guide.id];
  for (const fallback of override?.fallbacks || []) checkLocalAsset(guide, "fallback", fallback);

  rows.push({
    id: guide.id,
    category: guide.category,
    video: Boolean(guide.video),
    liveDemo: Boolean(guide.liveDemo),
    localAssets: assets.filter((asset) => asset.local).length,
    missingAssets: assets.filter((asset) => asset.local && !asset.exists).map((asset) => asset.key)
  });
}

const libraryHtml = fs.readFileSync(path.join(root, "library.html"), "utf8");
if (!libraryHtml.includes("library-quality-fixes.css")) errors.push("library.html: missing library-quality-fixes.css");
if (!libraryHtml.includes("library-quality-fixes.js")) errors.push("library.html: missing library-quality-fixes.js");

for (const id of Object.keys(libraryCaseOverrides)) {
  if (!ids.has(id)) errors.push(`library override points to unknown case: ${id}`);
}

const report = {
  generatedAt: new Date().toISOString(),
  summary: {
    cases: guides.length,
    videos: guides.filter((guide) => guide.video).length,
    liveDemos: guides.filter((guide) => guide.liveDemo).length,
    errors: errors.length,
    warnings: warnings.length
  },
  errors,
  warnings,
  cases: rows
};

console.log(JSON.stringify(report, null, 2));
if (errors.length) process.exitCode = 1;
