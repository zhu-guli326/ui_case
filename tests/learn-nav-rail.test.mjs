import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const read = file => readFileSync(path.join(root, file), "utf8");
const html = read("learn.html");
const css = read("learn.css");
const learn = read("learn.js");
const analyticsConfig = read("analytics.config.js");

test("chapter navigation follows the hero and becomes a sticky horizontal index", () => {
  assert.ok(html.indexOf('class="story-hero"') < html.indexOf('class="chapter-nav"'));
  assert.match(css, /\.chapter-nav\{[\s\S]*position:sticky!important/);
  assert.match(css, /flex-direction:row!important/);
  assert.match(css, /background:rgba\(7,17,12,\.94\)!important/);
});

test("current chapter remains synchronized with scroll state", () => {
  assert.match(css, /\.chapter-nav a\.is-current\{background:var\(--electric\)!important/);
  assert.match(learn, /distance === 0/);
  assert.match(learn, /distance === 1/);
  assert.match(learn, /distance === 2/);
});

test("navigation remains motion-safe and is no longer replaced at runtime", () => {
  assert.match(css, /prefers-reduced-motion:reduce/);
  assert.match(html, /analytics\.js\?v=20260825-editorial-nav-v1/);
  assert.doesNotMatch(read("analytics.js"), /data-learn-nav-rail|learn-nav-rail\.css/);
});

test("cache-busted editorial stylesheet replaces the retired desktop rail", () => {
  assert.match(html, /learn\.css\?v=20260825-fullpage-type-v2/);
  assert.doesNotMatch(html, /learn-nav-rail\.css/);
  assert.match(html, /analytics\.config\.js\?v=20260821-bare-rail-v2/);
  assert.doesNotMatch(analyticsConfig, /learn-right-center-rail-hotfix|rail-near/);
});

test("desktop chapters use editorial type and one-gesture full-page snapping", () => {
  assert.match(css, /--font-editorial-cjk:/);
  assert.match(css, /font-family:var\(--font-editorial-cjk\)/);
  assert.match(css, /html\.learn-snap-enabled\{scroll-snap-type:y mandatory/);
  assert.match(css, /scroll-snap-stop:always/);
  assert.match(learn, /addEventListener\("wheel", onSnapWheel, \{ passive: false \}\)/);
  assert.match(learn, /snapPanels\[nextIndex\]\.scrollIntoView/);
  assert.match(learn, /}, 760\)/);
});
