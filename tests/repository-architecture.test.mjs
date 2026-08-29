import assert from "node:assert/strict";
import { existsSync, readFileSync, readdirSync } from "node:fs";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const read = (...parts) => readFileSync(path.join(root, ...parts), "utf8");

const forbiddenRootImplementation = [
  "analytics.config.js", "analytics.js", "brands-runtime-fix.js", "brands.css", "brands.js",
  "i18n.css", "i18n.js", "index.css", "index.js", "launcher.css", "launcher.js",
  "launcher-state.mjs", "launcher-url.mjs", "learn-lens-overrides.css", "learn-nav-rail.css",
  "learn.css", "learn.js", "library-effect-captures.mjs", "library-media-guard.mjs",
  "library-preview-config.mjs", "library-search.mjs", "library.css", "library.js", "reference.js",
  "site-nav.css", "skills.css", "skills.js", "markdown.css", "markdown.js", "vocabulary-data.js",
  "vocabulary-preview.js", "vocabulary.css", "vocabulary.js", "library-technical-fixes.css",
  "library-technical-fixes.js", "CONTEXT.md", "DESIGN.md", "PRODUCT.md",
];

test("repository root keeps public entry points separate from implementation", () => {
  for (const file of forbiddenRootImplementation) {
    assert.equal(existsSync(path.join(root, file)), false, `${file} should not live at repository root`);
  }
  assert.equal(existsSync(path.join(root, "ui-reference-benchmark")), false, "reference benchmark should live under references/");

  for (const file of [
    ["src", "core", "app-shell", "app-shell.js"],
    ["src", "core", "app-shell", "language-switch.css"],
    ["src", "core", "analytics", "analytics.config.js"],
    ["src", "core", "analytics", "analytics.js"],
    ["src", "components", "site-header", "site-header.css"],
    ["src", "components", "device-preview", "phone-shell.css"],
    ["src", "components", "device-preview", "device-preview.css"],
    ["src", "components", "device-preview", "device-preview.js"],
    ["src", "features", "home", "squarespace-home.css"],
    ["src", "features", "home", "editorial-home.js"],
    ["src", "features", "brands", "brands.css"],
    ["src", "features", "brands", "brands.js"],
    ["src", "features", "launcher", "launcher-dna.css"],
    ["src", "features", "launcher", "launcher-dna.js"],
    ["src", "features", "launcher", "README.md"],
    ["src", "features", "library", "library-effect-captures.mjs"],
    ["src", "features", "library", "library-preview-config.mjs"],
    ["src", "features", "library", "library-search.mjs"],
    ["src", "features", "library", "library.js"],
    ["src", "features", "library", "library.css"],
    ["src", "features", "skills", "skills.css"],
    ["src", "features", "skills", "skills.js"],
    ["src", "features", "markdown", "markdown.css"],
    ["src", "features", "markdown", "markdown.js"],
    ["src", "features", "reference", "reference.js"],
    ["src", "features", "vocabulary", "vocabulary-data.js"],
    ["src", "features", "vocabulary", "vocabulary-preview.js"],
    ["src", "features", "vocabulary", "vocabulary.js"],
    ["src", "features", "vocabulary", "vocabulary.css"],
    ["src", "legacy", "i18n.js"],
    ["src", "legacy", "site-nav.css"],
    ["docs", "ARCHITECTURE.md"],
    ["docs", "CONTEXT.md"],
    ["docs", "DESIGN.md"],
    ["docs", "PRODUCT.md"],
    ["docs", "notes", "design-system-split-workflow.md"],
    ["references", "ui-reference-benchmark", "INDEX.md"],
  ]) {
    assert.equal(existsSync(path.join(root, ...file)), true, `${file.join("/")} should exist`);
  }
});

test("repository root contains no implementation JavaScript or CSS", () => {
  const implementationFiles = readdirSync(root)
    .filter((name) => /\.(?:css|js|mjs)$/.test(name))
    .sort();
  assert.deepEqual(implementationFiles, [], `move implementation into src instead of root: ${implementationFiles.join(", ")}`);
});

test("Launcher feature folder contains only the canonical DNA implementation", () => {
  const names = readdirSync(path.join(root, "src", "features", "launcher")).sort();
  assert.deepEqual(names, ["README.md", "launcher-dna.css", "launcher-dna.js"]);
});

test("entry pages load implementation from src", () => {
  const index = read("index.html");
  assert.match(index, /url=\.\/learn\.html/);

  const learn = read("learn.html");
  assert.match(learn, /src\/features\/home\/squarespace-home\.css/);
  assert.match(learn, /src\/features\/home\/editorial-home\.js/);
  assert.match(learn, /src\/core\/analytics\/analytics\.js/);

  const brands = read("brands.html");
  assert.match(brands, /src\/features\/brands\/brands\.css/);
  assert.match(brands, /src\/features\/brands\/brands\.js/);

  const launcher = read("launcher.html");
  assert.match(launcher, /src\/features\/launcher\/launcher-dna\.css/);
  assert.match(launcher, /src\/features\/launcher\/launcher-dna\.js/);

  const library = read("library.html");
  assert.match(library, /src\/features\/library\/library\.css/);
  assert.match(library, /src\/features\/library\/library\.js/);
  assert.match(library, /src\/components\/device-preview\/device-preview\.css/);

  assert.match(read("skills.html"), /src\/features\/skills\/skills\.js/);
  assert.match(read("markdown.html"), /src\/features\/markdown\/markdown\.js/);
  assert.match(read("reference.html"), /src\/features\/reference\/reference\.js/);
  assert.match(read("vocabulary.html"), /src\/features\/vocabulary\/vocabulary\.js/);

  for (const page of ["brands.html", "launcher.html", "library.html", "skills.html", "markdown.html", "reference.html", "vocabulary.html"]) {
    const source = read(page);
    assert.match(source, /src\/core\/app-shell\/app-shell\.js/, `${page} should use AppShell`);
    assert.match(source, /src\/core\/app-shell\/language-switch\.css/, `${page} should use shared language switch styles`);
  }
});
