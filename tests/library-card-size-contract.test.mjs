import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const css = readFileSync(path.join(root, "src", "features", "library", "library-density-fixes.css"), "utf8");
const html = readFileSync(path.join(root, "library.html"), "utf8");

test("Library gallery keeps the compact fixed four-column card geometry", () => {
  assert.match(css, /--case-card-preview-height:\s*360px/);
  assert.match(css, /--case-card-info-height:\s*118px/);
  assert.match(css, /--case-screen-height:\s*318px/);
  assert.match(css, /--case-screen-width:\s*147px/);
  assert.match(css, /grid-template-columns:\s*repeat\(4,\s*minmax\(0,\s*1fr\)\)/);
  assert.match(css, /height:\s*var\(--case-card-preview-height\)/);
  assert.match(css, /width:\s*var\(--case-screen-width\)\s*!important/);
  assert.match(css, /height:\s*var\(--case-screen-height\)\s*!important/);
});

test("Library card geometry is fixed instead of scaling from a 4:5 preview board", () => {
  assert.doesNotMatch(css, /--card-preview-ratio:\s*4\s*\/\s*5/);
  assert.doesNotMatch(css, /height:\s*calc\(100%\s*-\s*6px\)\s*!important/);
});

test("Library loads the cache-busted compact card geometry stylesheet", () => {
  assert.match(html, /library-density-fixes\.css\?v=20260818-compact-card-v1/);
});
