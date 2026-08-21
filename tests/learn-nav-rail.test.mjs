import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const read = file => readFileSync(path.join(root, file), "utf8");
const html = read("learn.html");
const css = read("learn-nav-rail.css");
const learn = read("learn.js");
const analyticsConfig = read("analytics.config.js");

test("desktop chapter rail has no card shell", () => {
  assert.match(css, /\.chapter-nav \{[\s\S]*padding: 0 !important;/);
  assert.match(css, /border: 0 !important;/);
  assert.match(css, /background: transparent !important;/);
  assert.match(css, /box-shadow: none !important;/);
});

test("rail dots scale around the current chapter", () => {
  assert.match(css, /rail-near-1/);
  assert.match(css, /rail-near-2/);
  assert.match(css, /\.is-current span \{[\s\S]*width: 20px/);
  assert.match(css, /rail-near-1 span \{[\s\S]*width: 12px/);
  assert.match(css, /rail-near-2 span \{[\s\S]*width: 6px/);
  assert.match(css, /\.chapter-nav a span \{[\s\S]*width: 4px/);
  assert.match(learn, /distance === 0/);
  assert.match(learn, /distance === 1/);
  assert.match(learn, /distance === 2/);
});

test("cache-busted formal assets replace the runtime hotfix", () => {
  assert.match(html, /learn\.css\?v=20260821-bare-rail-v6/);
  assert.match(html, /analytics\.config\.js\?v=20260821-bare-rail-v2/);
  assert.doesNotMatch(analyticsConfig, /learn-right-center-rail-hotfix|rail-near/);
});
