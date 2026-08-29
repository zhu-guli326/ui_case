import test from "node:test";
import assert from "node:assert/strict";

import {
  COLOR_THEME_ID_ALIASES,
  DEFAULT_COLOR_THEME_ID,
} from "../catalog/color-themes.js";
import {
  LAUNCHER_INTENTS,
  LAUNCHER_WORKSPACE_VERSION,
  createLauncherWorkspace,
  migrateLauncherWorkspace,
  normalizeCaseId,
  referenceProgress,
  resolveEffectiveDecisions,
  updateIntentDraft,
  validateReadiness,
} from "../src/features/launcher/launcher-state.mjs";

test("V2 workspaces contain every intent schema and preserve explicit empty arrays", () => {
  const initial = createLauncherWorkspace();
  assert.equal(initial.version, LAUNCHER_WORKSPACE_VERSION);
  assert.deepEqual(Object.keys(initial.intents), [...LAUNCHER_INTENTS]);

  const changed = updateIntentDraft(initial, "explore", { fields: { focus: [] } });
  const restored = migrateLauncherWorkspace(JSON.parse(JSON.stringify(changed)));
  assert.deepEqual(restored.intents.explore.fields.focus, []);
  assert.deepEqual(restored.intents.create.fields.requiredPages, []);
});

test("scalar decisions inherit defaults while references remain task-local", () => {
  const initial = createLauncherWorkspace({
    contract: {
      format: "desktop",
      system: "ant",
      style: "minimal-tech",
      colorTheme: "soft-lifestyle",
      density: "high-density",
      tokens: { spacingBase: "4pt", fontScheme: "cjk-latin-sans" },
      reference: { mode: "case", caseId: "plate", caseName: "Plate Play" },
    },
  });
  const workspace = updateIntentDraft(initial, "create", {
    overrides: {
      format: { mode: "override", value: "mobile" },
      reference: { mode: "none" },
    },
  });
  const resolved = resolveEffectiveDecisions(workspace, "create");
  assert.equal(resolved.format.value, "mobile");
  assert.equal(resolved.format.source, "task");
  assert.equal(resolved.system.value, "ant");
  assert.equal(resolved.system.source, "project");
  assert.equal(resolved.fontScheme.value, "cjk-latin-sans");
  assert.equal(resolved.fontScheme.source, "project");
  assert.equal(resolved.fontScheme.bodyFontFamily, '"Noto Sans SC", "Inter", ui-sans-serif, system-ui, sans-serif');
  assert.equal(resolved.reference.mode, "none");
  assert.equal(resolved.reference.source, "task");
});

test("theme aliases migrate to the canonical semantic theme id", () => {
  const workspace = createLauncherWorkspace({
    contract: {
      colorTheme: "editorial-commerce",
    },
  });
  assert.equal(COLOR_THEME_ID_ALIASES["editorial-commerce"], "adobe-spectrum");
  assert.equal(workspace.contract.colorTheme, "adobe-spectrum");
  assert.equal(DEFAULT_COLOR_THEME_ID, "material-3");
});

test("case aliases are canonicalized during workspace migration", () => {
  const workspace = migrateLauncherWorkspace({
    intent: "rebuild",
    values: {
      brief: "Rebuild this case",
      referenceSource: "library",
      referenceCase: "plate",
    },
  });
  assert.equal(normalizeCaseId("plate"), "plate-play");
  assert.equal(workspace.intents.rebuild.overrides.reference.caseId, "plate-play");
});

test("readiness reports actionable missing fields for create", () => {
  let workspace = createLauncherWorkspace();
  let result = validateReadiness(workspace, "create");
  assert.equal(result.ready, false);
  assert.deepEqual(result.missing.map((item) => item.key), ["audience", "coreTask", "requiredPages"]);
  assert.ok(result.missing.every((item) => item.selector && item.sectionId && item.labelKey));

  workspace = updateIntentDraft(workspace, "create", {
    fields: {
      audience: "Designers",
      coreTask: "Build a launch page",
      requiredPages: ["landing"],
    },
  });
  result = validateReadiness(workspace, "create");
  assert.equal(result.ready, true);
  assert.deepEqual(result.missing, []);
});

test("rebuild readiness distinguishes pending and complete references", () => {
  let workspace = createLauncherWorkspace();
  workspace = updateIntentDraft(workspace, "rebuild", {
    fields: { brief: "Rebuild this screenshot" },
    overrides: { reference: { mode: "upload", fileName: "shot.png", available: false } },
  });
  let result = validateReadiness(workspace, "rebuild");
  assert.equal(result.ready, false);
  assert.equal(result.referenceProgress, "pending");
  assert.deepEqual(result.missing.map((item) => item.key), ["reference"]);

  workspace = updateIntentDraft(workspace, "rebuild", {
    overrides: { reference: { mode: "upload", fileName: "shot.png", blobId: "blob-1", available: true } },
  });
  result = validateReadiness(workspace, "rebuild");
  assert.equal(result.ready, true);
  assert.equal(result.referenceProgress, "complete");
  assert.equal(referenceProgress(workspace.intents.rebuild.overrides.reference), "complete");
});

test("design-system readiness requires a brief and at least two systems", () => {
  let workspace = createLauncherWorkspace();
  workspace = updateIntentDraft(workspace, "design-system", {
    fields: { brief: "Compare navigation patterns", systems: ["material"] },
  });
  let result = validateReadiness(workspace, "design-system");
  assert.equal(result.ready, false);
  assert.deepEqual(result.missing.map((item) => item.key), ["systems"]);

  workspace = updateIntentDraft(workspace, "design-system", {
    fields: { systems: ["material", "ant"] },
  });
  result = validateReadiness(workspace, "design-system");
  assert.equal(result.ready, true);
});
