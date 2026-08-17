import assert from "node:assert/strict";
import { existsSync, readdirSync, readFileSync } from "node:fs";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const demoRoot = path.join(root, "demo");
const phoneShellCss = readFileSync(path.join(root, "src", "components", "device-preview", "phone-shell.css"), "utf8");
const compatibilityCss = readFileSync(path.join(demoRoot, "iphone-frame.css"), "utf8");

const demoDirectories = readdirSync(demoRoot, { withFileTypes: true })
  .filter((entry) => entry.isDirectory())
  .map((entry) => entry.name)
  .filter((name) => existsSync(path.join(demoRoot, name, "index.html")));

function cssFiles(directory) {
  const result = [];
  for (const entry of readdirSync(directory, { withFileTypes: true })) {
    const target = path.join(directory, entry.name);
    if (entry.isDirectory()) result.push(...cssFiles(target));
    if (entry.isFile() && entry.name.endsWith(".css")) result.push(target);
  }
  return result;
}

test("PhoneShell is the single reusable owner of direct-demo device chrome", () => {
  assert.match(phoneShellCss, /--phone-shell-screen-width:\s*390px/);
  assert.match(phoneShellCss, /--phone-shell-screen-height:\s*844px/);
  assert.match(phoneShellCss, /--phone-shell-screen-ratio:\s*390\s*\/\s*844/);
  assert.match(phoneShellCss, /\.iphone-frame\s*\{[\s\S]*?aspect-ratio:\s*var\(--phone-shell-screen-ratio\)/);
  assert.match(phoneShellCss, /\.embed-mode \.iphone-frame,[\s\S]*?\.embed \.iphone-frame/);
  assert.match(phoneShellCss, /\.phone-frame:not\(\.is-artboard-preview\)/);

  assert.match(compatibilityCss, /@import\s+url\("\.\.\/src\/components\/device-preview\/phone-shell\.css"\)/);
  assert.doesNotMatch(compatibilityCss, /\b(?:border|border-radius|box-shadow|background|padding)\s*:/, "demo/iphone-frame.css must stay an import-only compatibility entry");

  const viteDemo = "smart-home-ui-v2";
  assert.ok(demoDirectories.includes(viteDemo), `${viteDemo} must remain part of the direct-demo contract`);
  const staticDemos = demoDirectories.filter((name) => name !== viteDemo);
  assert.equal(staticDemos.length, demoDirectories.length - 1, "every non-Vite direct demo must be covered by the shared PhoneShell audit");

  for (const demo of staticDemos) {
    const html = readFileSync(path.join(demoRoot, demo, "index.html"), "utf8");
    assert.match(html, /<link\s+rel="stylesheet"\s+href="\.\.\/iphone-frame\.css"/i, `${demo} invokes the shared PhoneShell compatibility entry`);
    assert.match(html, /\biphone-frame\b/, `${demo} invokes PhoneShell instead of implementing hardware`);
  }

  const smartHomeSource = readFileSync(path.join(demoRoot, viteDemo, "src", "main.jsx"), "utf8");
  const smartHomeStyles = readFileSync(path.join(demoRoot, viteDemo, "src", "styles.css"), "utf8");
  assert.match(smartHomeSource, /className=\{`phone iphone-frame/);
  assert.match(smartHomeStyles, /@import\s+"\.\.\/\.\.\/iphone-frame\.css"/);
});

test("case-local styles cannot redefine PhoneShell hardware", () => {
  const forbiddenSelector = /\.iphone-frame(?:\b|--[^\s,{]+)[^{]*\{/;
  const forbiddenTokens = /--(?:iphone-frame|phone-shell)-(?:radius|finish|edge)/;

  for (const demo of demoDirectories) {
    const directory = path.join(demoRoot, demo);
    for (const file of cssFiles(directory)) {
      const source = readFileSync(file, "utf8");
      const relative = path.relative(root, file);
      assert.doesNotMatch(source, forbiddenSelector, `${relative} must not implement PhoneShell selectors`);
      assert.doesNotMatch(source, forbiddenTokens, `${relative} must not own PhoneShell hardware tokens`);
    }
  }
});

test("special demo layouts keep one appropriate PhoneShell invocation", () => {
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

  assert.equal(liveDemos.length, 16);
  for (const liveDemo of liveDemos) {
    const html = readFileSync(path.join(root, liveDemo.replace(/^\.\//, "")), "utf8");
    assert.match(html, /\biphone-frame\b/, `${liveDemo} invokes PhoneShell and can flatten to a screen-only embed`);
  }
});
