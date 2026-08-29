import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync, readdirSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const read = (file) => readFileSync(path.join(root, file), "utf8");
const html = read("launcher.html");
const runtime = read("src/features/launcher/launcher-dna.js");
const css = read("src/features/launcher/launcher-dna.css");

test("Launcher production is one Design DNA implementation", () => {
  assert.match(html, /src\/features\/launcher\/launcher-dna\.css/);
  assert.match(html, /src\/features\/launcher\/launcher-dna\.js/);
  assert.doesNotMatch(html, /launcher-entry|launcher-workspace|launcher-simplified|launcher-hardening|\.\/launcher\.js/);
  assert.match(runtime, /import \{ labThemes \} from "\.\.\/\.\.\/\.\.\/catalog\/color-themes\.js"/);
  assert.match(runtime, /const STORAGE_KEY = "ondesign:interface-dna:v1"/);
});

test("Design DNA keeps one linear direction, rules, save flow", () => {
  const direction = html.indexOf('id="dna-direction"');
  const rules = html.indexOf('id="dna-rules"');
  const save = html.indexOf('id="dna-save"');
  assert.ok(direction >= 0 && rules > direction && save > rules);
  assert.match(html, /data-style="restrained"/);
  assert.match(html, /data-style="editorial"/);
  assert.match(html, /data-style="vivid"/);
  assert.match(html, /data-style="future"/);
  assert.match(html, /data-choice-group="density"/);
  assert.match(html, /data-choice-group="palette"/);
  assert.match(html, /data-choice-select="font"/);
  assert.match(html, /data-choice-group="radius"/);
  assert.match(html, /data-choice-group="spacing"/);
});

test("Design DNA owns presets, persistence, localization, and prompt generation", () => {
  assert.match(runtime, /const basePalettes =/);
  assert.match(runtime, /const catalogPresets = labThemes\.map/);
  assert.match(runtime, /const labelSets =/);
  assert.match(runtime, /const STR =/);
  assert.match(runtime, /localStorage/);
  assert.match(runtime, /STORAGE_KEY/);
  assert.match(runtime, /clipboard|writeText/);
  assert.match(runtime, /data-style/);
});

test("Launcher styling is owned by one canonical stylesheet", () => {
  assert.ok(css.length > 10000);
  assert.match(css, /\.dna-app/);
  assert.match(css, /\.dna-workspace/);
  assert.match(css, /\.dna-section/);
  assert.match(css, /\.direction-grid/);
  assert.match(css, /\.palette-list/);
  assert.match(css, /@media/);
});

test("retired Launcher implementation files stay out of the feature folder", () => {
  const names = readdirSync(path.join(root, "src", "features", "launcher"));
  const retired = names.filter((name) => /launcher-(?:entry|workspace|simplified|hardening|preview|design-system|live-preview|platform-merge)/.test(name));
  assert.deepEqual(retired, []);
});
