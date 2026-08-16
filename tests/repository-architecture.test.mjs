import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const read = (...parts) => readFileSync(path.join(root, ...parts), "utf8");

test("repository root keeps public entry points separate from implementation", () => {
  for (const file of [
    "skills.css",
    "skills.js",
    "markdown.css",
    "markdown.js",
    "library-technical-fixes.css",
    "CONTEXT.md",
    "DESIGN.md",
    "PRODUCT.md",
  ]) {
    assert.equal(existsSync(path.join(root, file)), false, `${file} should not live at repository root`);
  }

  for (const file of [
    ["src", "features", "skills", "skills.css"],
    ["src", "features", "skills", "skills.js"],
    ["src", "features", "markdown", "markdown.css"],
    ["src", "features", "markdown", "markdown.js"],
    ["src", "components", "device-preview", "device-preview.css"],
    ["docs", "ARCHITECTURE.md"],
    ["docs", "CONTEXT.md"],
    ["docs", "DESIGN.md"],
    ["docs", "PRODUCT.md"],
  ]) {
    assert.equal(existsSync(path.join(root, ...file)), true, `${file.join("/")} should exist`);
  }
});

test("entry pages load feature and component implementation from src", () => {
  assert.match(read("skills.html"), /src\/features\/skills\/skills\.css/);
  assert.match(read("skills.html"), /src\/features\/skills\/skills\.js/);
  assert.match(read("markdown.html"), /src\/features\/markdown\/markdown\.css/);
  assert.match(read("markdown.html"), /src\/features\/markdown\/markdown\.js/);
  assert.match(read("library.html"), /src\/components\/device-preview\/device-preview\.css/);
  assert.doesNotMatch(read("i18n.css"), /library-technical-fixes/);
});
