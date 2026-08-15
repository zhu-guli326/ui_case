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

<<<<<<< HEAD
test("the shared site shell owns GitHub stars for the Skill repository", () => {
=======
test("the library GitHub entry and stars use the Skill repository", () => {
>>>>>>> b0afc67405740d9ad16be3979c2e00244622a074
  const library = requireText("library.html");
  const libraryScript = requireText("library.js");
  const i18n = requireText("i18n.js");
  const skillRepo = "zhu-guli326/image2_UI_skill";
  assert.match(library, new RegExp(`https://github\\.com/${skillRepo}`));
<<<<<<< HEAD
  assert.match(library, /data-github-stars/);
  assert.match(i18n, new RegExp(`https://github\\.com/${skillRepo}`));
  assert.match(i18n, new RegExp(`api\\.github\\.com/repos/${skillRepo}`));
  assert.match(i18n, new RegExp(`img\\.shields\\.io/github/stars/${skillRepo}\\.json`));
  assert.doesNotMatch(libraryScript, /api\\.github\\.com|img\\.shields\\.io\/github\/stars/);
  assert.doesNotMatch(`${libraryScript}\n${i18n}`, /repos\/zhu-guli326\/ui_case/);
});

test("the shared header uses the ONDesign logo lockup", () => {
  const i18n = requireText("i18n.js");
  const navigation = requireText("site-nav.css");

  assert.match(i18n, /assets\/branding\/ondesign-mark\.png/);
  assert.match(i18n, /assets\/branding\/ondesign-wordmark\.png/);
  assert.match(i18n, /class="site-brand-copy"/);
  assert.match(navigation, /\.site-brand-logo\s*\{/);
  assert.match(navigation, /\.site-brand-wordmark\s*\{/);
  assert.doesNotMatch(i18n, /site-brand-mark|>IMAGE2 UI<|DESIGN WORKSPACE/);
  assert.ok(readFileSync(path.join(root, "assets/branding/ondesign-mark.png")).length > 0);
  assert.ok(readFileSync(path.join(root, "assets/branding/ondesign-wordmark.png")).length > 0);
});

test("the launcher uses the complete shared case catalog", () => {
  const launcher = requireText("launcher.html");
  const launcherScript = requireText("launcher.js");
  assert.match(launcher, /<script type="module" src="\.\/launcher\.js/);
  assert.match(launcherScript, /import \{ brandProfiles, styleGuides, styleProfiles \} from "\.\/catalog\/index\.js"/);
  assert.match(launcherScript, /filterCases\(styleGuides/);
  assert.match(launcherScript, /caseThumbnail\(guide\)/);
  assert.doesNotMatch(launcherScript, /<option value="plate"/);
});

test("the launcher renders every design system from the shared catalog", () => {
  const launcherScript = requireText("launcher.js");
  assert.match(launcherScript, /designSystemOptions\(brandProfiles, language\(\)\)/);
  assert.match(launcherScript, /brandProfiles\.length/);
  assert.doesNotMatch(launcherScript, /value:\s*"(?:ant|material|apple)"/);
});

test("the launcher keeps case selection and prompt editing inside one workspace", () => {
  const launcher = requireText("launcher.html");
  const launcherScript = requireText("launcher.js");
  assert.match(launcher, /<dialog class="case-picker" id="casePicker"/);
  assert.match(launcher, /<textarea class="prompt-output" id="promptOutput"/);
  assert.match(launcher, /id="styleDirectionGrid"/);
  assert.doesNotMatch(launcher, /id="(?:editProjectContract|contractDialog)"/);
  assert.doesNotMatch(launcher, /<select[^>]+id="referenceCase"/);
  assert.match(launcherScript, /selectCaseUrl\(window\.location\.href/);
  assert.match(launcherScript, /taskReferenceCaseName/);
  assert.match(launcherScript, /indexedDB\.open\(UPLOAD_DB/);
=======
  assert.match(libraryScript, new RegExp(`api\\.github\\.com/repos/${skillRepo}`));
  assert.match(libraryScript, new RegExp(`img\\.shields\\.io/github/stars/${skillRepo}\\.json`));
  assert.match(i18n, new RegExp(`https://github\\.com/${skillRepo}`));
  assert.match(i18n, new RegExp(`api\\.github\\.com/repos/${skillRepo}`));
  assert.doesNotMatch(libraryScript, /repos\/zhu-guli326\/ui_case/);
>>>>>>> b0afc67405740d9ad16be3979c2e00244622a074
});

function requireText(relativePath) {
  return readFileSync(path.join(root, relativePath), "utf8");
}
