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
  assert.equal(report.cases, 19);
  assert.ok(report.styles >= 1);
  assert.ok(report.brands >= 1);
  assert.ok(report.components >= 1);
});

test("the shared AppShell owns GitHub stars for the Skill repository", () => {
  const library = requireText("library.html");
  const libraryScript = requireText("library.js");
  const appShell = requireText("src/core/app-shell/app-shell.js");
  const skillRepo = "zhu-guli326/image2_UI_skill";
  assert.match(library, new RegExp(`https://github\\.com/${skillRepo}`));
  assert.match(library, /data-github-stars/);
  assert.match(appShell, new RegExp(`https://github\\.com/${skillRepo}`));
  assert.match(appShell, new RegExp(`api\\.github\\.com/repos/${skillRepo}`));
  assert.match(appShell, new RegExp(`img\\.shields\\.io/github/stars/${skillRepo}\\.json`));
  assert.doesNotMatch(libraryScript, /api\\.github\\.com|img\\.shields\\.io\/github\/stars/);
  assert.doesNotMatch(`${libraryScript}\n${appShell}`, /repos\/zhu-guli326\/ui_case/);
});

test("the shared header uses the ONDesign logo lockup", () => {
  const appShell = requireText("src/core/app-shell/app-shell.js");
  const navigation = requireText("src/components/site-header/site-header.css");

  assert.match(appShell, /assets\/branding\/ondesign-mark\.png/);
  assert.match(appShell, /assets\/branding\/ondesign-wordmark\.png/);
  assert.match(appShell, /class="site-brand-copy"/);
  assert.match(navigation, /\.site-brand-logo\s*\{/);
  assert.match(navigation, /\.site-brand-wordmark\s*\{/);
  assert.doesNotMatch(appShell, /site-brand-mark|>IMAGE2 UI<|DESIGN WORKSPACE/);
  assert.ok(readFileSync(path.join(root, "assets/branding/ondesign-mark.png")).length > 0);
  assert.ok(readFileSync(path.join(root, "assets/branding/ondesign-wordmark.png")).length > 0);
});

test("the Learn progress navigation stays in document flow", () => {
  const learn = requireText("learn.html");
  const learnStyles = requireText("learn.css");

  assert.match(learn, /learn\.css\?v=20260819-progress-nav-v2/);
  assert.match(learnStyles, /\.learning-map\s*\{[^}]*position:\s*relative/);
  assert.doesNotMatch(learnStyles, /\.learning-map\s*\{[^}]*position:\s*(?:sticky|fixed)/);
});

test("the launcher uses the complete shared case catalog through its feature entry", () => {
  const launcher = requireText("launcher.html");
  const entry = requireText("src/features/launcher/launcher-entry.js");
  const launcherScript = requireText("launcher.js");
  assert.match(launcher, /<script type="module" src="\.\/src\/features\/launcher\/launcher-entry\.js/);
  assert.match(entry, /load\("core"/);
  assert.match(entry, /\.\.\/\.\.\/\.\.\/launcher\.js\?v=/);
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
});

function requireText(relativePath) {
  return readFileSync(path.join(root, relativePath), "utf8");
}
