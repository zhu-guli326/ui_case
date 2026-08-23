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
  assert.match(css, /\.is-current span \{[\s\S]*width: 26px/);
  assert.match(css, /rail-near-1 span \{[\s\S]*width: 14px/);
  assert.match(css, /rail-near-2 span \{[\s\S]*width: 7px/);
  assert.match(css, /\.chapter-nav a span \{[\s\S]*width: 3px/);
  assert.match(learn, /distance === 0/);
  assert.match(learn, /distance === 1/);
  assert.match(learn, /distance === 2/);
});

test("rail transitions and current-dot motion make chapter changes visible", () => {
  assert.match(css, /rail-dot-arrive/);
  assert.match(css, /rail-dot-breathe/);
  assert.match(css, /translateX\(-6px\)/);
  assert.match(css, /prefers-reduced-motion: reduce/);
  assert.match(html, /analytics\.js\?v=20260821-motion-scale-v4/);
});

test("cache-busted formal assets replace the runtime hotfix", () => {
  assert.match(html, /learn\.css\?v=20260823-public-ready-v1/);
  assert.match(html, /analytics\.config\.js\?v=20260821-bare-rail-v2/);
  assert.doesNotMatch(analyticsConfig, /learn-right-center-rail-hotfix|rail-near/);
});
