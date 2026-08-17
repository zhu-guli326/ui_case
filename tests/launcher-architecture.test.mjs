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
const stability = read("src/features/launcher/launcher-stability.js");
const analyticsConfig = read("src/core/analytics/analytics.config.js");

test("launcher html remains a semantic shell", () => {
  assert.match(html, /launcher-workspace\.css/);
  assert.match(html, /launcher-simplified\.css/);
  assert.match(html, /launcher-entry\.js/);
  assert.doesNotMatch(html, /<style(?:\s|>)/i);
  assert.doesNotMatch(html, /<script(?![^>]+src=)[^>]*>[\s\S]*?<\/script>/i);
});

test("launcher production entry has only current runtime owners", () => {
  assert.match(entry, /import\(`\.\.\/\.\.\/\.\.\/launcher\.js/);
  assert.match(entry, /launcher-design-system\.js/);
  assert.match(entry, /launcher-live-preview\.js/);
  assert.match(entry, /launcher-simplified-runtime\.js/);
  assert.doesNotMatch(entry, /launcher-shell\.js/);
  assert.doesNotMatch(entry, /launcher-preview-lab\.js/);
  assert.doesNotMatch(entry, /launcher-preview-templates\.js/);
  assert.doesNotMatch(entry, /launcher-preview-modern-cases\.js/);
  assert.doesNotMatch(entry, /launcher-preview-editorial-images\.js/);
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
  assert.match(simplifiedRuntime, /function applyCopy/);
  assert.doesNotMatch(html, /class="requirement-stage"/);
});

test("Design System has one visible summary and no duplicate Page Preview tab", () => {
  assert.match(html, /class="ds-summary-grid"/);
  assert.match(html, /data-ds-panel="foundation"/);
  assert.match(html, /data-ds-panel="components"/);
  assert.doesNotMatch(html, /data-ds-tab="preview"/);
  assert.doesNotMatch(html, /class="ds-tabs"/);
  assert.match(html, /class="preview-source"/);
  assert.match(simplifiedRuntime, /showSystemSummary/);
  assert.match(simplifiedCss, /\.preview-source/);
});

test("legacy launcher mount contract remains intact", () => {
  const ids = [
    "launcherForm", "intentForm", "modeTabs", "styleDirectionGrid", "colorThemeGrid",
    "pageTitle", "pageIntro", "pageKicker", "promptOutput", "taskSummary", "missingState",
    "summaryProgress", "readyState", "generatePrompt", "generatePromptWrap", "copyPrompt",
    "savePreset", "casePicker", "caseGrid", "caseSearch", "assistantToggle", "assistantPanel",
    "previewDevice", "previewSystemName", "previewPlatformName", "resultStage", "resultStageBody",
  ];
  ids.forEach((id) => assert.match(html, new RegExp(`id="${id}"`), `missing #${id}`));
});

test("platform and design-system behavior keeps one dedicated owner", () => {
  assert.match(designSystem, /function selectPlatform/);
  assert.match(designSystem, /function setDesignSystemTab/);
  assert.match(designSystem, /role", "radio/);
  assert.match(designSystem, /aria-checked/);
  assert.match(designSystem, /ArrowLeft/);
  assert.match(designSystem, /ArrowRight/);
});

test("visible final Preview owns its rendering and presentation", () => {
  assert.match(livePreview, /resultStageBody/);
  assert.match(livePreview, /previewLabSection/);
  assert.match(livePreview, /livePreviewDevice/);
  assert.match(livePreview, /previewPageTemplate/);
  assert.match(livePreview, /pageTemplates/);
  assert.match(livePreview, /syncPlatformFromUi/);
  assert.match(livePreviewCss, /\.preview-template/);
  assert.match(livePreviewCss, /\.pt-kpis/);
  assert.match(livePreviewCss, /\.pt-product/);
  assert.doesNotMatch(livePreview, /restructureCreateFlow/);
  assert.doesNotMatch(legacyPreviewLab, /create-flow-refactored/);
  assert.doesNotMatch(legacyPreviewLab, /restructureCreateFlow/);
  assert.match(legacyPreviewLab, /launcher-live-preview\.js/);
});

test("output is no longer a sticky competing side rail", () => {
  assert.match(html, /class="workspace-stage result-stage"/);
  assert.match(html, /id="outputPanel"/);
  assert.match(simplifiedCss, /#outputPanel\{position:static/);
  assert.match(simplifiedCss, /\.output-review-grid/);
});

test("stability layer no longer acts as a hidden module loader", () => {
  assert.doesNotMatch(stability, /createElement\(["']script["']\)/);
  assert.doesNotMatch(stability, /appendChild\(script\)/);
  assert.match(stability, /styleDirection/);
});
