import assert from "node:assert/strict";
import { existsSync, readFileSync, readdirSync } from "node:fs";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const read = (...parts) => readFileSync(path.join(root, ...parts), "utf8");

const transitionalRootImplementation = new Set([
  "analytics.config.js",
  "analytics.js",
  "brands.js",
  "i18n.css",
  "i18n.js",
  "launcher-state.mjs",
  "launcher-url.mjs",
  "launcher.js",
  "learn.css",
  "learn.js",
  "library-effect-captures.mjs",
  "library-preview-config.mjs",
  "library-search.mjs",
  "library.js",
  "site-nav.css",
  "vocabulary-data.js",
  "vocabulary-preview.js",
  "vocabulary.js",
]);

test("repository root keeps public entry points separate from implementation", () => {
  for (const file of [
    "brands.css",
    "index.css",
    "index.js",
    "launcher.css",
    "library.css",
    "reference.js",
    "skills.css",
    "skills.js",
    "markdown.css",
    "markdown.js",
    "vocabulary.css",
    "library-technical-fixes.css",
    "library-technical-fixes.js",
    "CONTEXT.md",
    "DESIGN.md",
    "PRODUCT.md",
  ]) {
    assert.equal(existsSync(path.join(root, file)), false, `${file} should not live at repository root`);
  }

  for (const file of [
    ["src", "core", "app-shell", "app-shell.js"],
    ["src", "core", "app-shell", "language-switch.css"],
    ["src", "core", "analytics", "analytics.config.js"],
    ["src", "core", "analytics", "analytics.js"],
    ["src", "components", "site-header", "site-header.css"],
    ["src", "components", "device-preview", "phone-shell.css"],
    ["src", "components", "device-preview", "device-preview.css"],
    ["src", "components", "device-preview", "device-preview.js"],
    ["src", "features", "home", "index.css"],
    ["src", "features", "home", "index.js"],
    ["src", "features", "brands", "brands.css"],
    ["src", "features", "launcher", "launcher.css"],
    ["src", "features", "library", "library.css"],
    ["src", "features", "skills", "skills.css"],
    ["src", "features", "skills", "skills.js"],
    ["src", "features", "markdown", "markdown.css"],
    ["src", "features", "markdown", "markdown.js"],
    ["src", "features", "reference", "reference.js"],
    ["src", "features", "vocabulary", "vocabulary.css"],
    ["docs", "ARCHITECTURE.md"],
    ["docs", "CONTEXT.md"],
    ["docs", "DESIGN.md"],
    ["docs", "PRODUCT.md"],
  ]) {
    assert.equal(existsSync(path.join(root, ...file)), true, `${file.join("/")} should exist`);
  }
});

test("new root implementation files are forbidden outside the migration allowlist", () => {
  const implementationFiles = readdirSync(root)
    .filter((name) => /\.(?:css|js|mjs)$/.test(name))
    .sort();
  const unexpected = implementationFiles.filter((name) => !transitionalRootImplementation.has(name));
  assert.deepEqual(unexpected, [], `move new implementation into src instead of root: ${unexpected.join(", ")}`);
});

test("entry pages load feature and component implementation from src", () => {
  assert.match(read("index.html"), /src\/features\/home\/index\.css/);
  assert.match(read("index.html"), /src\/features\/home\/index\.js/);
  assert.match(read("brands.html"), /src\/features\/brands\/brands\.css/);
  assert.match(read("launcher.html"), /src\/features\/launcher\/launcher\.css/);
  assert.match(read("library.html"), /src\/features\/library\/library\.css/);
  assert.match(read("library.html"), /src\/components\/device-preview\/device-preview\.css/);
  assert.match(read("src", "components", "device-preview", "device-preview.css"), /@import\s+url\("\.\/phone-shell\.css"\)/);
  assert.match(read("skills.html"), /src\/features\/skills\/skills\.css/);
  assert.match(read("skills.html"), /src\/features\/skills\/skills\.js/);
  assert.match(read("markdown.html"), /src\/features\/markdown\/markdown\.css/);
  assert.match(read("markdown.html"), /src\/features\/markdown\/markdown\.js/);
  assert.match(read("reference.html"), /src\/features\/reference\/reference\.js/);
  assert.match(read("reference.html"), /src\/features\/markdown\/markdown\.css/);
  assert.match(read("reference.html"), /src\/features\/markdown\/markdown\.js/);
  assert.match(read("vocabulary.html"), /src\/features\/vocabulary\/vocabulary\.css/);

  for (const page of ["index.html", "brands.html", "launcher.html", "library.html", "skills.html", "markdown.html", "reference.html", "vocabulary.html"]) {
    const source = read(page);
    assert.match(source, /src\/core\/app-shell\/app-shell\.js/, `${page} should use AppShell`);
    assert.match(source, /src\/core\/app-shell\/language-switch\.css/, `${page} should use shared language switch styles`);
  }
});
