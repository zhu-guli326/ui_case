import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const read = file => readFileSync(path.join(root, file), "utf8");
const html = read("learn.html");
const learn = read("learn.js");

test("breakdown lesson uses a balanced guide and live-lab layout", () => {
  assert.match(learn, /class="breakdown-guide"/);
  assert.match(learn, /grid-template-columns:minmax\(0,1\.08fr\) minmax\(360px,\.92fr\)/);
  assert.match(learn, /class="anatomy-title"/);
  assert.match(learn, /#breakdown \.anatomy-card>div:not\(\.anatomy-title\)/);
  assert.match(learn, /#breakdown \.breakdown-board\{margin-right:140px\}/);
});

test("decomposition levels and component rows stay visually separated", () => {
  assert.match(learn, /<small>01<\/small><strong>PAGE<\/strong>/);
  assert.match(learn, /<small>06<\/small><strong>STATE<\/strong>/);
  assert.match(learn, /Brand and utility actions/);
  assert.match(learn, /Three destinations and selected state/);
});

test("localized heading line breaks render instead of showing escaped text", () => {
  assert.match(learn, /value\.replace\(\/\\\\n\/g, "\\n"\)/);
  assert.match(learn, /white-space:pre-line/);
  assert.match(html, /learn\.js\?v=20260821-breakdown-layout-v3/);
});
