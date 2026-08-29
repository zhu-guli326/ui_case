import assert from "node:assert/strict";
import { existsSync, readFileSync, readdirSync } from "node:fs";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const read = (...parts) => readFileSync(path.join(root, ...parts), "utf8");

const transitionalRootImplementation = new Set([
  "brands-runtime-fix.js",
  "launcher.js",
  "learn-lens-overrides.css",
  "learn-nav-rail.css",
  "library-media-guard.mjs",
  "library-preview-config.mjs",
  "library-search.mjs",
  "library.js",
  "vocabulary-data.js",
  "vocabulary-preview.js",
  "vocabulary.js",
]);

test("repository root keeps public entry points separate from implementation", () => {
  for (const file of [
    "analytics.config.js",
    "analytics.js",
    "brands.css",
    "brands.js",
    "i18n.css",
    "i18n.js",
    "index.css",
    "index.js",
    "launcher.css",
    "launcher-state.mjs",
    "launcher-url.mjs",
    "learn.css",
    "learn.js",
    "library-effect-captures.mjs",
    "library.css",
    "reference.js",
    "site-nav.css",
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
    ["src", "features", "learn", "learn.css"],
    ["src", "features", "learn", "learn.js"],
    ["src", "features", "learn", "learn-overrides.css"],
    ["src", "features", "brands", "brands.css"],
    ["src", "features", "brands", "brands.js"],
    ["src", "features", "launcher", "launcher-url.mjs"],
    ["src", "features", "launcher", "launcher-state.mjs"],
    ["src", "features", "launcher", "launcher.css"],
    ["src", "features", "library", "library-effect-captures.mjs"],
    ["src", "features", "library", "library.css"],
    ["src", "features", "skills", "skills.css"],
    ["src", "features", "skills", "skills.js"],
    ["src", "features", "markdown", "markdown.css"],
    ["src", "features", "markdown", "markdown.js"],
    ["src", "features", "reference", "reference.js"],
    ["src", "features", "vocabulary", "vocabulary.css"],
    ["src", "legacy", "i18n.js"],
    ["src", "legacy", "site-nav.css"],
    ["docs", "ARCHITECTURE.md"],
    ["docs", "CONTEXT.md"],
    ["docs", "DESIGN.md"],
    ["docs", "PRODUCT.md"],
    ["docs", "notes", "design-system-split-workflow.md"],
    ["docs", "notes", "vocabulary-image2-prompts.md"],
    ["docs", "notes", "vocabulary-ui-deconstruction.md"],
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
  const index = read("index.html");
  const indexRedirectsToHome = /http-equiv="refresh"[^>]+(?:learn|library)\.html/.test(index) && /window\.location\.replace\(target\.href\)/.test(index);
  if (indexRedirectsToHome) {
    assert.match(index, /<link rel="canonical" href="\.\/(?:learn|library)\.html">/);
  } else {
    assert.match(index, /src\/features\/home\/index\.css/);
    assert.match(index, /src\/features\/home\/index\.js/);
  }

  assert.match(read("learn.html"), /src\/features\/learn\/learn\.css/);
  assert.match(read("learn.html"), /src\/features\/learn\/learn\.js/);
  assert.match(read("learn.html"), /src\/core\/analytics\/analytics\.js/);
  assert.match(read("brands.html"), /src\/features\/brands\/brands\.css/);
  assert.match(read("brands.html"), /src\/features\/brands\/brands\.js/);
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

  for (const page of ["brands.html", "launcher.html", "library.html", "skills.html", "markdown.html", "reference.html", "vocabulary.html"]) {
    const source = read(page);
    assert.match(source, /src\/core\/app-shell\/app-shell\.js/, `${page} should use AppShell`);
    assert.match(source, /src\/core\/app-shell\/language-switch\.css/, `${page} should use shared language switch styles`);
  }
});
