import assert from "node:assert/strict";
import { existsSync, readdirSync, readFileSync } from "node:fs";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const demoRoot = path.join(root, "demo");
const frameCss = readFileSync(path.join(demoRoot, "iphone-frame.css"), "utf8");

const demoDirectories = readdirSync(demoRoot, { withFileTypes: true })
  .filter((entry) => entry.isDirectory())
  .map((entry) => entry.name)
  .filter((name) => existsSync(path.join(demoRoot, name, "index.html")));

test("every direct demo opts into the shared Apple-sized device frame", () => {
  assert.match(frameCss, /--iphone-viewport-width:\s*390px/);
  assert.match(frameCss, /--iphone-viewport-height:\s*844px/);
  assert.match(frameCss, /--iphone-viewport-ratio:\s*390\s*\/\s*844/);
  assert.match(frameCss, /\.iphone-frame\s*\{[\s\S]*?aspect-ratio:\s*var\(--iphone-viewport-ratio\)/);
  assert.match(frameCss, /\.embed-mode \.iphone-frame,[\s\S]*?\.embed \.iphone-frame/);

  const viteDemo = "smart-home-ui-v2";
  const staticDemos = demoDirectories.filter((name) => name !== viteDemo);
  assert.equal(staticDemos.length, 27);

  for (const demo of staticDemos) {
    const html = readFileSync(path.join(demoRoot, demo, "index.html"), "utf8");
    assert.match(html, /<link\s+rel="stylesheet"\s+href="\.\.\/iphone-frame\.css"/i, `${demo} loads the shared frame stylesheet`);
    assert.match(html, /\biphone-frame\b/, `${demo} has a frame owner`);
  }

  const smartHomeSource = readFileSync(path.join(demoRoot, viteDemo, "src", "main.jsx"), "utf8");
  const smartHomeStyles = readFileSync(path.join(demoRoot, viteDemo, "src", "styles.css"), "utf8");
  assert.match(smartHomeSource, /className=\{`phone iphone-frame/);
  assert.match(smartHomeStyles, /@import\s+"\.\.\/\.\.\/iphone-frame\.css"/);
});

test("special demo layouts keep one appropriate frame owner", () => {
  const museum = readFileSync(path.join(demoRoot, "museum-explorer", "index.html"), "utf8");
  const generatedHome = readFileSync(path.join(demoRoot, "generated-home-ui", "index.html"), "utf8");
  const relay = readFileSync(path.join(demoRoot, "relay-music", "index.html"), "utf8");
  const softly = readFileSync(path.join(demoRoot, "softly-reflections", "index.html"), "utf8");

  assert.match(museum, /class="museum-device iphone-frame iphone-frame--flat"/);
  assert.equal((generatedHome.match(/iphone-frame--flat/g) || []).length, 3);
  assert.equal((relay.match(/iphone-frame--viewport-shell/g) || []).length, 3);
  assert.equal((softly.match(/iphone-frame--viewport-shell/g) || []).length, 3);
});

test("every catalog live demo supplies a screen-only embedded source", () => {
  const caseFiles = readdirSync(path.join(root, "catalog", "cases")).filter((file) => file.endsWith(".json"));
  const liveDemos = caseFiles
    .map((file) => JSON.parse(readFileSync(path.join(root, "catalog", "cases", file), "utf8")))
    .map((caseRecord) => caseRecord.liveDemo)
    .filter(Boolean);

  assert.equal(liveDemos.length, 20);
  for (const liveDemo of liveDemos) {
    const html = readFileSync(path.join(root, liveDemo.replace(/^\.\//, "")), "utf8");
    assert.match(html, /\biphone-frame\b/, `${liveDemo} exposes a frame that can switch to screen-only embed mode`);
  }
});
