import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const read = (file) => readFileSync(path.join(root, file), "utf8");

const html = read("launcher.html");
const entry = read("src/features/launcher/launcher-entry.js");
const designSystem = read("src/features/launcher/launcher-design-system.js");
const livePreview = read("src/features/launcher/launcher-live-preview.js");
const livePreviewCss = read("src/features/launcher/launcher-live-preview.css");
const legacyPreviewLab = read("src/features/launcher/launcher-preview-lab.js");
const simplifiedCss = read("src/features/launcher/launcher-simplified.css");
const simplifiedRuntime = read("src/features/launcher/launcher-simplified-runtime.js");
const analyticsConfig = read("src/core/analytics/analytics.config.js");

test("launcher html remains a semantic shell", () => {
  assert.match(html, /launcher-workspace\.css/);
  assert.match(html, /launcher-simplified\.css/);
  assert.match(html, /launcher-entry\.js/);
  assert.doesNotMatch(html, /<style(?:\s|>)/i);
  assert.doesNotMatch(html, /<script(?![^>]+src=)[^>]*>[\s\S]*?<\/script>/i);
});

test("production boot is an explicit Core -> Design System -> Final Preview -> Runtime chain", () => {
  const core = entry.indexOf('load("core"');
  const design = entry.indexOf('load("design-system"');
  const preview = entry.indexOf('load("final-preview"');
  const runtime = entry.indexOf('load("runtime"');
  assert.ok(core >= 0 && design > core && preview > design && runtime > preview);
  assert.doesNotMatch(entry, /Promise\.allSettled|launcher-shell\.js|launcher-hardening\.js|launcher-stability\.js|launcher-workspace-compat\.css/);
  assert.doesNotMatch(entry, /launcher-preview-lab\.js|launcher-preview-templates\.js|launcher-preview-modern-cases\.js|launcher-preview-editorial-images\.js/);
  assert.doesNotMatch(analyticsConfig, /launcher|features\//);
});

test("information architecture is one linear three-step flow", () => {
  const task = html.indexOf('id="taskDefinition"');
  const design = html.indexOf('id="designDecisions"');
  const result = html.indexOf('id="resultStage"');
  const output = html.indexOf('id="outputPanel"');
  assert.ok(task >= 0 && design > task && result > design && output > result);
  assert.match(html, /href="#taskDefinition"/);
  assert.match(html, /href="#designDecisions"/);
  assert.match(html, /href="#resultStage"/);
  assert.match(simplifiedRuntime, /function setCurrentStep/);
  assert.match(simplifiedRuntime, /function installStepNavigation/);
  assert.doesNotMatch(html, /class="requirement-stage"/);
});

test("Design System exposes Foundation and Components together without a tab controller", () => {
  assert.match(html, /class="ds-summary-grid"/);
  assert.match(html, /data-ds-panel="foundation"/);
  assert.match(html, /data-ds-panel="components"/);
  assert.doesNotMatch(html, /data-ds-tab="preview"|class="ds-tabs"/);
  assert.doesNotMatch(designSystem, /setDesignSystemTab|\.ds-tabs|\.preview-controls|setPreviewSize/);
  assert.match(simplifiedRuntime, /ensureSystemSummarySemantics/);
  assert.match(simplifiedCss, /#designSystemWorkbench\.design-system-workbench\{display:block!important/);
});

test("retired hidden Preview DOM cannot return", () => {
  assert.doesNotMatch(html, /class="preview-source"/);
  for (const id of ["previewSystemName", "previewPlatformName", "previewUsing", "previewDevice", "previewPrimary"]) {
    assert.doesNotMatch(html, new RegExp(`id="${id}"`), `retired #${id} returned`);
  }
  assert.doesNotMatch(simplifiedCss, /\.preview-source/);
});

test("Design System is the single owner of platform and design profile state", () => {
  assert.match(designSystem, /findColorTheme/);
  assert.match(designSystem, /localizeColorTheme/);
  assert.match(designSystem, /function selectPlatform/);
  assert.match(designSystem, /function resolveDesignState/);
  assert.match(designSystem, /function publishDesignState/);
  assert.match(designSystem, /image2:launcherdesignchange/);
  assert.match(designSystem, /dataset\.systemName/);
  assert.match(designSystem, /dataset\.accent/);
  assert.doesNotMatch(designSystem, /previewDevice|previewSystemName|previewPlatformName/);
  assert.match(designSystem, /ArrowLeft/);
  assert.match(designSystem, /ArrowRight/);
});

test("visible final Preview consumes design state directly and owns page rendering", () => {
  assert.match(livePreview, /resultStageBody/);
  assert.match(livePreview, /previewLabSection/);
  assert.match(livePreview, /livePreviewDevice/);
  assert.match(livePreview, /previewPageTemplate/);
  assert.match(livePreview, /pageTemplates/);
  assert.match(livePreview, /designStateFromWorkbench/);
  assert.match(livePreview, /image2:launcherdesignchange/);
  assert.match(livePreview, /image2:launcherplatformchange/);
  assert.doesNotMatch(livePreview, /sourceDevice|previewSystemName|previewPlatformName/);
  assert.match(livePreviewCss, /--preview-canvas/);
  assert.match(livePreviewCss, /background:var\(--preview-surface/);
  assert.match(livePreviewCss, /\.pt-kpis/);
  assert.match(livePreviewCss, /\.pt-product/);
  assert.doesNotMatch(livePreview, /restructureCreateFlow/);
  assert.doesNotMatch(legacyPreviewLab, /create-flow-refactored|restructureCreateFlow/);
});

test("Runtime owns flow semantics and compatibility without extra production modules", () => {
  assert.match(simplifiedRuntime, /installPrimaryTabKeys/);
  assert.match(simplifiedRuntime, /installGenerateFeedback/);
  assert.match(simplifiedRuntime, /hardenDialog/);
  assert.match(simplifiedRuntime, /installLegacyIntentPreservationGuard/);
  assert.doesNotMatch(simplifiedRuntime, /setDesignSystemTab|setPreviewSize|previewDevice/);
  assert.match(simplifiedCss, /field-validation-error/);
  assert.match(simplifiedCss, /prefers-reduced-motion/);
  assert.match(simplifiedCss, /html\[lang="en"\].*Complete key details/);
});

test("structured brief heading spans the full grid and the obsolete font specimen stays out of the UI", () => {
  assert.match(simplifiedCss, /\.structured-brief::before\{grid-column:1\/-1;/);
  assert.match(simplifiedCss, /\.font-preview-shell\{display:none!important\}/);
});

test("legacy core mount contract remains intact for task state and output", () => {
  const ids = [
    "launcherForm", "intentForm", "modeTabs", "styleDirectionGrid", "colorThemeGrid",
    "pageTitle", "pageIntro", "pageKicker", "promptOutput", "taskSummary", "missingState",
    "summaryProgress", "readyState", "generatePrompt", "generatePromptWrap", "copyPrompt",
    "savePreset", "casePicker", "caseGrid", "caseSearch", "assistantToggle", "assistantPanel",
    "resultStage", "resultStageBody", "designSystemWorkbench",
  ];
  ids.forEach((id) => assert.match(html, new RegExp(`id="${id}"`), `missing #${id}`));
});

test("prompt output remains a viewport-fixed rail throughout the desktop flow", () => {
  assert.match(html, /class="workspace-stage result-stage"/);
  assert.match(html, /id="outputPanel"/);
  assert.match(simplifiedCss, /\.workspace-flow\{display:block;margin-top:20px;padding-right:calc\(clamp\(320px,30vw,380px\) \+ 20px\)\}/);
  assert.match(simplifiedCss, /#outputPanel\{position:fixed;z-index:30;top:80px;/);
  assert.match(simplifiedCss, /width:clamp\(320px,30vw,380px\);height:calc\(100vh - 104px\)/);
  assert.match(simplifiedCss, /\.output-review-grid\{[^}]*overflow-y:auto/);
  assert.match(simplifiedCss, /@media\(max-width:980px\)[\s\S]*\.workspace-flow\{padding-right:0\}[\s\S]*#outputPanel\{position:static/);
});
