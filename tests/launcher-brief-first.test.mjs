import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const read = (file) => readFileSync(path.join(root, file), "utf8");
const html = read("launcher.html");
const core = read("launcher.js");
const css = read("src/features/launcher/launcher-brief-first.css");

test("launcher follows brief, style, then preview order", () => {
  const task = html.indexOf('id="taskDefinition"');
  const design = html.indexOf('id="designDecisions"');
  const result = html.indexOf('id="resultStage"');
  assert.ok(task >= 0 && design > task && result > design);
  assert.match(html, /先说清需求，再确定设计基调/);
  assert.match(html, />描述需求</);
  assert.match(html, />选择样式</);
  assert.match(html, /launcher-brief-first\.css/);
});

test("design stage owns a selectable typography foundation", () => {
  assert.match(html, /id="foundationTypography"/);
  assert.match(core, /function renderFoundationTypography/);
  assert.match(core, /foundationTypography\?\.addEventListener\("change"/);
  assert.match(css, /\.foundation-typography \.font-preset-grid/);
  assert.match(css, /grid-template-columns: repeat\(3, minmax\(0, 1fr\)\)/);
});

test("task-specific delivery section no longer duplicates design choices", () => {
  const start = core.indexOf("function decisionSection");
  const end = core.indexOf("function referenceMode", start);
  const section = core.slice(start, end);
  assert.match(section, /currentDecisionOptions\("format", "format"\)/);
  assert.doesNotMatch(section, /currentDecisionOptions\("system"/);
  assert.doesNotMatch(section, /tokenFoundationMarkup|fontPresetMarkup/);
});

test("first step receives clear brief-first emphasis", () => {
  assert.match(css, /#taskDefinition > \.stage-heading/);
  assert.match(css, /content: "PRODUCT BRIEF"/);
});
