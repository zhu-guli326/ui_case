import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";
import { getPreviewMediaPresentation } from "../library-preview-config.mjs";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const compatibilityCss = readFileSync(path.join(root, "library-technical-fixes.css"), "utf8");
const runtime = readFileSync(path.join(root, "library-technical-fixes.js"), "utf8");
const analytics = readFileSync(path.join(root, "analytics.js"), "utf8");

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
