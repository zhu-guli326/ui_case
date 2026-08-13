import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { spawnSync } from "node:child_process";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

test("the published gallery has a complete case and brand catalog", () => {
  const result = spawnSync(process.execPath, ["scripts/check_site.mjs"], { cwd: root, encoding: "utf8" });
  assert.equal(result.status, 0, result.stderr || result.stdout);
  const report = JSON.parse(result.stdout);
  assert.equal(report.status, "pass");
  assert.equal(report.cases, 23);
  assert.ok(report.styles >= 1);
  assert.ok(report.brands >= 1);
  assert.ok(report.components >= 1);
});

test("the library GitHub entry and stars use the Skill repository", () => {
  const library = requireText("library.html");
  const libraryScript = requireText("library.js");
  const i18n = requireText("i18n.js");
  const skillRepo = "zhu-guli326/image2_UI_skill";
  assert.match(library, new RegExp(`https://github\\.com/${skillRepo}`));
  assert.match(libraryScript, new RegExp(`api\\.github\\.com/repos/${skillRepo}`));
  assert.match(libraryScript, new RegExp(`img\\.shields\\.io/github/stars/${skillRepo}\\.json`));
  assert.match(i18n, new RegExp(`https://github\\.com/${skillRepo}`));
  assert.match(i18n, new RegExp(`api\\.github\\.com/repos/${skillRepo}`));
  assert.doesNotMatch(libraryScript, /repos\/zhu-guli326\/ui_case/);
});

function requireText(relativePath) {
  return readFileSync(path.join(root, relativePath), "utf8");
}
