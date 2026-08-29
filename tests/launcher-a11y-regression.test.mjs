import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const html = readFileSync(new URL("../launcher.html", import.meta.url), "utf8");
const runtime = readFileSync(new URL("../src/features/launcher/launcher-dna.js", import.meta.url), "utf8");
const shell = readFileSync(new URL("../src/core/app-shell/app-shell.js", import.meta.url), "utf8");

test("Design DNA controls expose native and radio semantics", () => {
  assert.match(html, /<main class="dna-app" aria-labelledby="dnaTitle">/);
  assert.match(html, /class="direction-grid" role="radiogroup" aria-label="界面风格"/);
  assert.match(html, /role="radio" aria-checked="true" data-style="restrained"/);
  assert.match(html, /class="palette-list"[^>]+role="radiogroup"/);
  assert.match(html, /data-choice-select="font" aria-label="字体气质"/);
});

test("preset picker exposes disclosure semantics", () => {
  assert.match(html, /data-preset-toggle[^>]*aria-expanded="false"[^>]*aria-haspopup="listbox"/);
  assert.match(html, /data-preset-list[^>]*role="listbox"/);
  assert.match(runtime, /aria-expanded/);
});

test("direction examples are not keyboard traps", () => {
  assert.match(html, /<iframe[^>]+tabindex="-1"[^>]+scrolling="no"/);
  assert.match(html, /title="克制方向绑定的案例/);
  assert.match(html, /title="编辑感方向绑定的案例/);
});

test("language shell honors URL language before persisted language", () => {
  assert.match(shell, /searchParams\.get\("lang"\)/);
  assert.match(shell, /if \(isSupported\(queryLanguage\)\) return queryLanguage/);
});
