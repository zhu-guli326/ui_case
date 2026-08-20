import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const read = (file) => readFileSync(path.join(root, file), "utf8");

test("the workspace is task-first and grouped into three stages", () => {
  const html = read("launcher.html");
  assert.ok(html.indexOf('id="modeTabs"') < html.indexOf('id="launcherForm"'));
  assert.ok(html.indexOf('id="launcherForm"') < html.indexOf('id="styleDirectionGrid"'));
  assert.ok(html.indexOf('id="styleDirectionGrid"') < html.indexOf('id="platformGrid"'));
  assert.ok(html.indexOf('id="platformGrid"') < html.indexOf('id="colorThemeGrid"'));
  assert.match(html, /id="taskDefinition"/);
  assert.match(html, /id="designDecisions"/);
  assert.match(html, /id="outputPanel"/);
  assert.match(html, /class="launcher-step-nav"/);
  assert.doesNotMatch(html, /READY FOR CODEX/);
  assert.doesNotMatch(html, /id="styleSource"/);
});

test("semantic color themes remain selectable inside the design-system stage", () => {
  const html = read("launcher.html");
  const script = read("launcher.js");
  const css = read("src/features/launcher/launcher.css");
  const workspaceCss = read("src/features/launcher/launcher-workspace.css");
  assert.match(html, /id="colorThemeGrid"[^>]+role="radiogroup"/);
  assert.match(html, /id="designSystemWorkbench"/);
  assert.match(script, /function renderColorThemes\(\)/);
  assert.match(script, /theme\.guidelineUrl/);
  assert.match(script, /system: inheritedSystem \? \{ mode: "inherit" \} : \{ mode: "override", value: theme\.designSystemId \}/);
  assert.match(script, /function syncColorThemeToDesignSystem\(value\)/);
  assert.match(script, /colorThemePrompt\(decisions\.colorTheme\.value, language\(\)\)/);
  assert.match(script, /tr\("主题色", "Color theme"\), decisions\.colorTheme\.label/);
  assert.match(workspaceCss, /\.color-theme-grid\s*\{[^}]*grid-template-columns:\s*repeat\(4,/s);
  assert.match(css, /@media \(max-width:\s*560px\)[\s\S]*?\.color-theme-grid\s*\{[^}]*grid-template-columns:\s*minmax\(0, 1fr\)/);
});

test("the form, summary, case modal, and assistant share one page", () => {
  const html = read("launcher.html");
  assert.match(html, /id="launcherForm"/);
  assert.match(html, /id="taskSummary"/);
  assert.match(html, /id="casePicker"/);
  assert.match(html, /id="assistantPanel"/);
  assert.match(html, /<textarea[^>]+id="promptOutput"/);
  assert.doesNotMatch(html, /id="(?:editProjectContract|contractDialog)"/);
  assert.ok(html.indexOf('</form>') < html.indexOf('id="casePicker"'));
});

test("launcher state is versioned per project and task progress does not overwrite the contract", () => {
  const script = read("launcher.js");
  assert.match(script, /image2-ui-launcher:v2:/);
  assert.match(script, /taskReferenceCaseName/);
  assert.match(script, /taskReferenceMode/);
  assert.match(script, /indexedDB\.open\(UPLOAD_DB/);
  assert.doesNotMatch(script, /projectPatch\.(?:system|template|theme|device)\s*=/);
});

test("responsive workspace styles keep the summary sticky and overlays usable on mobile", () => {
  const css = read("src/features/launcher/launcher.css");
  const workspaceCss = read("src/features/launcher/launcher-workspace.css");
  const script = read("launcher.js");
  assert.match(workspaceCss, /\.workspace-side\s*\{[^}]*position:\s*sticky/s);
  assert.match(css, /\.case-picker\s*\{/);
  assert.match(css, /\.case-picker\s*\{[^}]*inset:\s*0;[^}]*width:\s*min\(1100px, calc\(100vw - 48px\)\);[^}]*height:\s*min\(820px, calc\(100dvh - 48px\)\);[^}]*margin:\s*auto;[^}]*border-radius:\s*8px/s);
  assert.match(css, /\.case-picker\[open\]\s*\{[^}]*animation:\s*modal-in/s);
  assert.doesNotMatch(css, /\.case-picker\s*\{[^}]*inset:\s*0 0 0 auto/s);
  assert.match(css, /\.style-card-media img[\s\S]*?object-fit:\s*contain/);
  assert.match(css, /\.case-card-media img[\s\S]*?object-fit:\s*contain/);
  assert.match(css, /body\.assistant-open \.launcher-shell/);
  assert.match(css, /@media \(max-width:\s*390px\)/);
  assert.match(css, /\.intent-form\s*\{[^}]*gap:\s*64px/s);
  assert.match(script, /selected-case-facts/);
  assert.match(script, /case-card-details/);
});

test("foundation decisions show values without project provenance", () => {
  const css = read("src/features/launcher/launcher.css");
  const script = read("launcher.js");
  assert.match(script, /tokenFoundationMarkup\(decisions\)/);
  assert.match(script, /item\.decision\.label/);
  assert.doesNotMatch(script, /foundationSourceLabel/);
  assert.doesNotMatch(script, /继承项目|Inherit project|项目默认|Project defaults/);
  assert.match(css, /\.token-foundation-block\s*\{/);
  assert.match(css, /\.token-foundation dd strong\s*\{[^}]*font-size:\s*13px/s);
  assert.doesNotMatch(css, /\.token-foundation > div \+ div\s*\{[^}]*border-left/s);
});

test("font presets provide a live, resilient page specimen", () => {
  const script = read("launcher.js");
  const css = read("src/features/launcher/launcher.css");

  assert.match(script, /from "\.\/catalog\/font-presets\.js"/);
  assert.match(script, /function fontPresetMarkup\(decision\)/);
  assert.match(script, /name="fontScheme"/);
  assert.match(script, /class="font-preview-page" data-font-preview/);
  assert.match(script, /setProperty\("--preview-heading-font", preset\.roles\.display\.fontFamily\)/);
  assert.match(script, /setProperty\("--preview-body-font", preset\.roles\.body\.fontFamily\)/);
  assert.match(script, /fontPresetPrompt\(decisions\.fontScheme\.value, language\(\)\)/);
  assert.match(script, /document\.head\.append\(link\)/);
  assert.match(script, /已使用系统回退/);
  assert.match(script, /FONT_LOAD_TIMEOUT_MS = 10000/);
  assert.match(script, /existing\.status === "failed"/);
  assert.match(script, /warmFontPresetSamples\(\)/);
  assert.match(css, /\.font-preset-grid\s*\{[^}]*grid-template-columns:\s*repeat\(3,/s);
  assert.match(css, /\.font-preview-page\s*\{[^}]*height:\s*360px/s);
  assert.match(css, /\.font-preview-title\s*\{[^}]*font-weight:\s*var\(--preview-heading-weight, 700\)/s);
  assert.match(css, /@media \(max-width:\s*560px\)[\s\S]*?\.font-preset-grid\s*\{[^}]*grid-template-columns:\s*minmax\(0, 1fr\)/);
  assert.match(css, /@media \(max-width:\s*560px\)[\s\S]*?\.font-preview-toolbar\s*\{[^}]*display:\s*grid/s);
});

test("the global workflow is collapsed into the launcher summary", () => {
  const shell = read("src/core/app-shell/app-shell.js");
  assert.match(shell, /currentPage\(\) === "launcher\.html"/);
  assert.match(shell, /document\.querySelector\("\.project-workflow"\)\?\.remove\(\)/);
  assert.doesNotMatch(shell, /current-project-bar|mountProjectBar|项目契约/);
});

test("create flow has one visible design-system owner and refreshes merged copy on language changes", () => {
  const script = read("launcher.js");
  const merge = read("src/features/launcher/launcher-platform-merge.js");
  assert.match(script, /launcher-intent-create/);
  assert.match(merge, /launcher-intent-create #intentForm select\[name="designSystem"\]/);
  assert.match(merge, /function syncCreateDuplicate\(\)/);
  assert.match(merge, /picker\.setAttribute\("aria-hidden", String\(hidden\)\)/);
  assert.match(merge, /image2:languagechange/);
});

test("cross-page task routes never reuse a previously browsed case", () => {
  const shell = read("src/core/app-shell/app-shell.js");
  const brands = read("brands.js");

  assert.match(shell, /project\.taskReferenceMode === "case" && project\.taskReferenceCaseId/);
  assert.match(shell, /url\.searchParams\.set\("case", project\.taskReferenceCaseId\)/);
  assert.doesNotMatch(shell, /project\.taskIntent \|\| \(project\.sourceCaseId \? "rebuild" : "create"\)/);
  assert.doesNotMatch(shell, /Boolean\(project\.taskReferenceCaseId \|\| project\.sourceCaseId/);
  assert.match(brands, /state\.taskReferenceMode==="case"&&Boolean\(state\.taskReferenceCaseId\)/);
  assert.match(brands, /taskUrl\.searchParams\.set\("case",state\.taskReferenceCaseId\)/);
  assert.doesNotMatch(brands, /state\.taskIntent\|\| \(state\.sourceCaseId\?"rebuild":"create"\)/);
  assert.doesNotMatch(brands, /const source=state\.sourceCaseName/);
  assert.match(brands, /<span>任务参考<\/span>/);
});

test("the Lab consumes the shared branded theme default", () => {
  const lab = read("lab/lab.js");
  const preview = read("lab/preview.js");
  assert.match(lab, /DEFAULT_COLOR_THEME_ID/);
  assert.match(preview, /DEFAULT_COLOR_THEME_ID/);
  assert.doesNotMatch(lab, /theme:\s*"minimal-tech"/);
  assert.doesNotMatch(preview, /theme:\s*query\.get\("theme"\) \|\| "minimal-tech"/);
});
