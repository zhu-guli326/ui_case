import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const read = file => readFileSync(path.join(root, file), "utf8");
const html = read("learn.html");
const learn = read("learn.js");

test("inspection lens tags are mounted inside the preview canvas", () => {
  const previewStart = learn.indexOf('<div class="fashion-preview"');
  const controlsStart = learn.indexOf('<div class="see-controls"');
  const asideStart = learn.indexOf('<aside class="lens-note"');

  assert.ok(previewStart >= 0);
  assert.ok(controlsStart > previewStart);
  assert.ok(controlsStart < asideStart);
});

test("inspection lens tags float at the horizontal center of the canvas", () => {
  assert.match(learn, /#see \.see-controls\{position:absolute;z-index:5;left:50%;bottom:18px;/);
  assert.match(learn, /transform:translateX\(-50%\)/);
  assert.match(learn, /\.see-controls button\[data-lens\]/);
});

test("learn script cache key includes the current layout update", () => {
  assert.match(html, /learn\.js\?v=20260821-breakdown-layout-v3/);
});
