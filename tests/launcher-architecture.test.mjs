import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const read = (file) => readFileSync(path.join(root, file), "utf8");

const html = read("launcher.html");
const entry = read("src/features/launcher/launcher-entry.js");
const shell = read("src/features/launcher/launcher-shell.js");
const designSystem = read("src/features/launcher/launcher-design-system.js");
const stability = read("src/features/launcher/launcher-stability.js");
const analyticsConfig = read("src/core/analytics/analytics.config.js");

test("launcher html is a semantic shell rather than an inline application bundle", () => {
  assert.match(html, /launcher-workspace\.css/);
  assert.match(html, /launcher-entry\.js/);
  assert.doesNotMatch(html, /<style(?:\s|>)/i);
  assert.doesNotMatch(html, /<script(?![^>]+src=)[^>]*>[\s\S]*?<\/script>/i);
  assert.doesNotMatch(html, /await\s+fetch\(/);
  assert.doesNotMatch(html, /await\s+import\(/);
});

test("launcher has one explicit feature entry and analytics stays feature-agnostic", () => {
  assert.match(entry, /import\(`\.\.\/\.\.\/\.\.\/launcher\.js/);
  assert.match(entry, /launcher-shell\.js/);
  assert.match(entry, /launcher-design-system\.js/);
  assert.match(entry, /launcher-hardening\.js/);
  assert.match(entry, /launcher-stability\.js/);
  assert.doesNotMatch(entry, /launcher-preview-lab\.js/);
  assert.doesNotMatch(entry, /launcher-platform-merge\.js/);
  assert.doesNotMatch(analyticsConfig, /launcher|features\//);
});

test("information architecture follows define, constrain, output", () => {
  const task = html.indexOf('id="taskDefinition"');
  const design = html.indexOf('id="designDecisions"');
  const output = html.indexOf('id="outputPanel"');
  assert.ok(task >= 0 && design > task && output > design);
  assert.match(html, /href="#taskDefinition"/);
  assert.match(html, /href="#designDecisions"/);
  assert.match(html, /href="#outputPanel"/);
  assert.match(shell, /setCurrentStep/);
});

test("legacy launcher mount contract remains intact", () => {
  const ids = [
    "launcherForm", "intentForm", "modeTabs", "styleDirectionGrid", "colorThemeGrid",
    "pageTitle", "pageIntro", "pageKicker", "promptOutput", "taskSummary", "missingState",
    "summaryProgress", "readyState", "generatePrompt", "generatePromptWrap", "copyPrompt",
    "savePreset", "casePicker", "caseGrid", "caseSearch", "assistantToggle", "assistantPanel",
  ];
  ids.forEach((id) => assert.match(html, new RegExp(`id="${id}"`), `missing #${id}`));
});

test("platform and design-system behavior has one dedicated owner", () => {
  assert.match(designSystem, /function selectPlatform/);
  assert.match(designSystem, /function setDesignSystemTab/);
  assert.match(designSystem, /role", "radio/);
  assert.match(designSystem, /aria-checked/);
  assert.match(designSystem, /aria-selected/);
  assert.match(designSystem, /ArrowLeft/);
  assert.match(designSystem, /ArrowRight/);
});

test("stability layer no longer acts as a hidden module loader", () => {
  assert.doesNotMatch(stability, /createElement\(["']script["']\)/);
  assert.doesNotMatch(stability, /appendChild\(script\)/);
  assert.match(stability, /styleDirection/);
});
