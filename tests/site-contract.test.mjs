import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { spawnSync } from "node:child_process";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const requireText = (relativePath) => readFileSync(path.join(root, relativePath), "utf8");

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
  const libraryScript = requireText("src/features/library/library.js");
  const appShell = requireText("src/core/app-shell/app-shell.js");
  const skillRepo = "zhu-guli326/image2_UI_skill";

  assert.match(library, new RegExp(`https://github\\.com/${skillRepo}`));
  assert.match(library, /data-github-stars/);
  assert.match(appShell, new RegExp(`https://github\\.com/${skillRepo}`));
  assert.match(appShell, new RegExp(`api\\.github\\.com/repos/${skillRepo}`));
  assert.match(appShell, new RegExp(`img\\.shields\\.io/github/stars/${skillRepo}\\.json`));
  assert.doesNotMatch(libraryScript, /api\\.github\\.com|img\\.shields\\.io\/github\/stars/);
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

test("the shared navigation follows the product information architecture", () => {
  const appShell = requireText("src/core/app-shell/app-shell.js");
  const navigation = requireText("src/components/site-header/site-header.css");
  const vocabulary = requireText("vocabulary.html");

  assert.match(appShell, /href:\s*"\.\/learn\.html",\s*key:\s*"nav\.explore"/);
  assert.match(appShell, /href:\s*"\.\/library\.html",\s*key:\s*"nav\.caseLibrary"/);
  assert.match(appShell, /href:\s*"\.\/vocabulary\.html",\s*key:\s*"nav\.uiVocabulary"/);
  assert.match(appShell, /href:\s*"\.\/skills\.html",\s*key:\s*"nav\.designSkills"/);
  assert.match(appShell, /"nav\.launcher":\s*\{\s*zh:\s*"开始设计",\s*en:\s*"Start Designing"\s*\}/);
  assert.match(appShell, /site-nav-xhs/);
  assert.match(appShell, /navigator\.languages/);
  assert.match(navigation, /\.site-header\s*\{[^}]*border-radius:\s*999px/s);
  assert.ok(vocabulary.indexOf("<image2-site-header data-site-header>") < vocabulary.indexOf("<main>"));
});

test("the Learn homepage is implemented from src and exposes the AI UI workflow", () => {
  const learn = requireText("learn.html");
  const editorialHome = requireText("src/features/home/editorial-home.js");

  assert.match(learn, /src\/features\/home\/squarespace-home\.css/);
  assert.match(learn, /src\/features\/home\/editorial-home\.js/);
  assert.match(learn, /src\/core\/analytics\/analytics\.js/);
  assert.match(learn, /launcher\.html\?lang=zh/);
  assert.match(learn, /library\.html\?lang=zh/);
  assert.doesNotMatch(learn, /(?:src|href)="\.\/(?:learn|i18n|analytics)\.(?:js|css)/);
  assert.ok(editorialHome.length > 0);
});

test("the root route opens the Learn homepage", () => {
  const index = requireText("index.html");
  assert.match(index, /url=\.\/learn\.html/);
  assert.match(index, /canonical" href="\.\/learn\.html"/);
  assert.match(index, /ONDesign/);
});

test("the shared shell never inserts a global project workflow bar", () => {
  const appShell = requireText("src/core/app-shell/app-shell.js");
  const navigation = requireText("src/components/site-header/site-header.css");
  assert.doesNotMatch(appShell, /project-workflow|mountWorkflowBar|PROJECT FLOW/);
  assert.doesNotMatch(navigation, /\.project-workflow/);
});

test("the launcher uses the Design DNA production runtime", () => {
  const launcher = requireText("launcher.html");
  const runtime = requireText("src/features/launcher/launcher-dna.js");

  assert.match(launcher, /src\/features\/launcher\/launcher-dna\.css/);
  assert.match(launcher, /src\/features\/launcher\/launcher-dna\.js/);
  assert.doesNotMatch(launcher, /launcher-entry\.js|\.\/launcher\.js/);
  assert.match(runtime, /import \{ labThemes \} from "\.\.\/\.\.\/\.\.\/catalog\/color-themes\.js"/);
  assert.match(runtime, /const STORAGE_KEY = "ondesign:interface-dna:v1"/);
  assert.match(runtime, /basePalettes/);
  assert.match(runtime, /catalogPresets = labThemes\.map/);
});

test("Library and Vocabulary load their canonical feature runtimes", () => {
  const library = requireText("library.html");
  const vocabulary = requireText("vocabulary.html");

  assert.match(library, /src\/features\/library\/library\.js/);
  assert.match(library, /src\/features\/library\/library-runtime\.js/);
  assert.doesNotMatch(library, /src="\.\/library\.js/);
  assert.match(vocabulary, /src\/features\/vocabulary\/vocabulary\.js/);
  assert.match(vocabulary, /src\/features\/vocabulary\/vocabulary\.css/);
  assert.doesNotMatch(vocabulary, /src="\.\/vocabulary\.js/);
});
