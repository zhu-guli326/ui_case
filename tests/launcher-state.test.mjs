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
} from "../launcher-state.mjs";

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

  const inherited = resolveEffectiveDecisions(initial, "create");
  assert.deepEqual(
    [inherited.format.value, inherited.system.value, inherited.style.value, inherited.colorTheme.value],
    ["desktop", "ant-design", "minimal-tech", COLOR_THEME_ID_ALIASES["soft-lifestyle"]],
  );
  assert.equal(inherited.reference.mode, "none");
  assert.equal(inherited.reference.source, "task");
  assert.equal(inherited.system.source, "project");
  assert.equal(inherited.system.text, "Ant Design（项目默认值）");
  assert.equal(inherited.density.text, "高密度工具型（项目默认值）");
  assert.equal(inherited.spacingBase.text, "4pt 间距基数（项目默认值）");
  assert.equal(inherited.fontScheme.value, "humanist-sans-cjk");
  assert.equal(inherited.fontScheme.text, "人文无衬线组合（项目默认值）");
  assert.equal(inherited.fontScheme.fontPresetId, "humanist-sans-cjk");
  assert.match(inherited.fontScheme.bodyFontFamily, /Source Sans 3/);
  assert.equal(inherited.colorTheme.text, "Claude 暖珊瑚（项目默认值）");
  assert.equal(inherited.colorTheme.designSystemId, "custom");

  const overridden = updateIntentDraft(initial, "create", {
    overrides: {
      format: { mode: "override", value: "web" },
      system: { mode: "override", value: "material" },
      style: { mode: "override", value: "soft-lifestyle" },
      colorTheme: { mode: "override", value: "future-tech" },
      density: { mode: "override", value: "low-density" },
      spacingBase: { mode: "override", value: "8pt" },
      fontScheme: { mode: "override", value: "cjk-latin-editorial" },
    },
  });
  const effective = resolveEffectiveDecisions(overridden, "create");
  assert.deepEqual(
    [effective.format.value, effective.system.value, effective.style.value, effective.colorTheme.value],
    ["web", "google-material-3", "soft-lifestyle", "google-material-3"],
  );
  assert.equal(effective.system.source, "task");
  assert.equal(effective.system.text, "Google Material Design 3（本次覆写）");
  assert.equal(effective.density.text, "低密度呼吸感（本次覆写）");
  assert.equal(effective.spacingBase.text, "8pt 间距基数（本次覆写）");
  assert.equal(effective.fontScheme.value, "editorial-serif-cjk");
  assert.equal(effective.fontScheme.text, "编辑型衬线组合（本次覆写）");
  assert.match(effective.fontScheme.displayFontFamily, /Source Serif 4/);
  assert.deepEqual(effective.fontScheme.displayFontWeights, [500, 600, 700]);
  assert.deepEqual(effective.fontScheme.bodyFontWeights, [400, 500, 600]);
  assert.equal(effective.colorTheme.text, "Material 3 紫（本次覆写）");
  assert.equal(effective.colorTheme.designSystemId, "google-material-3");
});

test("legacy inherited references migrate to intent-specific task defaults", () => {
  const migrated = migrateLauncherWorkspace({
    version: LAUNCHER_WORKSPACE_VERSION,
    contract: { reference: { mode: "case", caseId: "moe", caseName: "Moe" } },
    intents: {
      create: { overrides: { reference: { mode: "inherit" } } },
      rebuild: { overrides: { reference: { mode: "inherit" } } },
    },
  });

  assert.deepEqual(migrated.intents.create.overrides.reference, { mode: "none" });
  assert.deepEqual(migrated.intents.rebuild.overrides.reference, { mode: "case" });
  assert.equal(resolveEffectiveDecisions(migrated, "create").reference.mode, "none");
  assert.equal(resolveEffectiveDecisions(migrated, "rebuild").reference.caseId, undefined);
  assert.ok(validateReadiness(migrated, "rebuild").missing.some((item) => item.key === "reference"));
});

test("legacy library drafts never borrow case data from project history", () => {
  const project = {
    sourceCaseId: "moe",
    sourceCaseName: "Moe",
    sourceCaseStyle: "soft",
    sourceCaseImage: "./moe.png",
  };
  const missingCase = migrateLauncherWorkspace({
    intent: "rebuild",
    values: { referenceSource: "library" },
  }, { project });
  const explicitCase = migrateLauncherWorkspace({
    intent: "rebuild",
    values: { referenceSource: "library", referenceCase: "plate" },
  }, { project });

  assert.deepEqual(missingCase.intents.rebuild.overrides.reference, { mode: "case" });
  assert.ok(validateReadiness(missingCase, "rebuild").missing.some((item) => item.key === "reference"));
  assert.deepEqual(explicitCase.intents.rebuild.overrides.reference, { mode: "case", caseId: "plate-play" });
  assert.equal(explicitCase.intents.rebuild.overrides.reference.caseName, undefined);
});

test("color themes persist per intent without consuming the legacy style alias", () => {
  const migrated = migrateLauncherWorkspace({
    version: LAUNCHER_WORKSPACE_VERSION,
    contract: { theme: "editorial-commerce" },
    intents: {
      create: { overrides: { colorTheme: { mode: "override", value: "glass" } } },
      rebuild: { overrides: { colorTheme: { mode: "override", value: "retro" } } },
    },
  });

  assert.equal(migrated.contract.style, "editorial-commerce");
  assert.equal(migrated.version, LAUNCHER_WORKSPACE_VERSION);
  assert.equal(migrated.contract.colorTheme, DEFAULT_COLOR_THEME_ID);
  assert.equal(resolveEffectiveDecisions(migrated, "create").colorTheme.value, COLOR_THEME_ID_ALIASES.glass);
  assert.equal(resolveEffectiveDecisions(migrated, "create").colorTheme.designSystemId, "fluent-2");
  assert.equal(resolveEffectiveDecisions(migrated, "rebuild").colorTheme.value, COLOR_THEME_ID_ALIASES.retro);
  assert.equal(resolveEffectiveDecisions(migrated, "explore").colorTheme.value, DEFAULT_COLOR_THEME_ID);
});

test("font presets migrate within V2, stay isolated per intent, and persist only their IDs", () => {
  const migrated = migrateLauncherWorkspace({
    version: LAUNCHER_WORKSPACE_VERSION,
    contract: { fontScheme: "system-cjk" },
    intents: {
      create: { overrides: { fontScheme: { mode: "override", value: "humanist-cjk" } } },
      rebuild: { overrides: { fontScheme: { mode: "override", value: "serif-cjk" } } },
    },
  });

  assert.equal(migrated.version, LAUNCHER_WORKSPACE_VERSION);
  assert.equal(migrated.contract.fontScheme, "system-ui-cjk");
  assert.equal(migrated.intents.create.overrides.fontScheme.value, "humanist-sans-cjk");
  assert.equal(migrated.intents.rebuild.overrides.fontScheme.value, "editorial-serif-cjk");
  assert.equal(migrated.intents.explore.overrides.fontScheme.mode, "inherit");

  const decision = resolveEffectiveDecisions(migrated, "rebuild", { locale: "en" }).fontScheme;
  assert.equal(decision.fontPresetId, "editorial-serif-cjk");
  assert.match(decision.displayFontFamily, /Source Serif 4/);
  assert.equal(decision.source, "task");

  const serialized = JSON.stringify(migrated);
  assert.match(serialized, /editorial-serif-cjk/);
  assert.doesNotMatch(serialized, /fontFamily|remoteCssUrl|fontSources|Source Serif 4/);
});

test("density and token-foundation decisions survive V2 normalization for every intent", () => {
  const changed = updateIntentDraft(createLauncherWorkspace(), "improve", {
    overrides: {
      density: { mode: "override", value: "high-density" },
      spacingBase: { mode: "override", value: "8pt" },
      fontScheme: { mode: "override", value: "cjk-latin-sans" },
    },
  });
  const restored = migrateLauncherWorkspace(JSON.parse(JSON.stringify(changed)));
  const effective = resolveEffectiveDecisions(restored, "improve", { locale: "en" });

  assert.equal(effective.density.text, "High-density tool (Task override)");
  assert.equal(effective.spacingBase.text, "8pt spacing base (Task override)");
  assert.equal(effective.fontScheme.text, "Humanist sans pairing (Task override)");
  assert.equal(effective.fontScheme.fontPresetId, "humanist-sans-cjk");
  assert.match(effective.fontScheme.remoteCssUrl, /^https:\/\/fonts\.googleapis\.com/);
  assert.equal(restored.intents.create.overrides.density.mode, "inherit");
  assert.equal(restored.intents.create.overrides.spacingBase.mode, "inherit");
  assert.equal(restored.intents.create.overrides.fontScheme.mode, "inherit");
});

test("an explicit no-reference override is skipped instead of pending", () => {
  const initial = createLauncherWorkspace({
    contract: { reference: { mode: "case", caseId: "moe" } },
  });
  const changed = updateIntentDraft(initial, "create", {
    overrides: { reference: { mode: "none" } },
  });
  const reference = resolveEffectiveDecisions(changed, "create").reference;

  assert.equal(reference.source, "task");
  assert.equal(reference.mode, "none");
  assert.equal(referenceProgress(reference), "skipped");
  assert.equal(validateReadiness(changed, "create").referenceProgress, "skipped");
});

test("reference progress handles complete cases, persisted uploads, and incomplete uploads", () => {
  assert.equal(referenceProgress({ mode: "case", caseId: "moe" }), "complete");
  assert.equal(referenceProgress({ mode: "upload", blobId: "reference:42" }), "complete");
  assert.equal(referenceProgress({ mode: "upload", fileName: "reference.png" }), "pending");
  assert.equal(referenceProgress({ mode: "inherit" }), "pending");
});

test("readiness returns ordered, focusable metadata for an incomplete task", () => {
  const initial = createLauncherWorkspace({ activeIntent: "create" });
  const incomplete = validateReadiness(initial, "create");

  assert.equal(incomplete.ready, false);
  assert.deepEqual(incomplete.missing.map((item) => item.key), ["audience", "coreTask", "requiredPages"]);
  assert.deepEqual(incomplete.missing[0], {
    key: "audience",
    labelKey: "launcher.fields.audience",
    label: { zh: "给谁用", en: "Audience" },
    selector: '[name="audience"]',
    sectionId: "briefTitle",
  });

  const complete = updateIntentDraft(initial, "create", {
    fields: {
      audience: "附近居民与远程办公者",
      coreTask: "查看菜单并加入会员",
      requiredPages: ["首页", "菜单", "会员卡"],
    },
  });
  assert.equal(validateReadiness(complete, "create").ready, true);
});

test("editing one intent keeps every other intent draft isolated", () => {
  const withCreateDraft = updateIntentDraft(createLauncherWorkspace(), "create", {
    fields: { audience: "设计团队", coreTask: "整理设计规范", requiredPages: ["规范首页"] },
  });
  const withExploreDraft = updateIntentDraft(withCreateDraft, "explore", {
    fields: { targetType: "repo", target: "D:/work/product", focus: [] },
  });

  assert.equal(withExploreDraft.intents.create.fields.audience, "设计团队");
  assert.deepEqual(withExploreDraft.intents.create.fields.requiredPages, ["规范首页"]);
  assert.equal(withExploreDraft.intents.explore.fields.target, "D:/work/product");
  assert.deepEqual(withExploreDraft.intents.explore.fields.focus, []);
});

test("legacy launcher state migrates into one V2 intent without contaminating the others", () => {
  const migrated = migrateLauncherWorkspace({
    intent: "rebuild",
    values: {
      brief: "还原参考图并适配移动端",
      format: "mobile",
      density: "high-density",
      spacingBase: "8pt",
      fontScheme: "cjk-latin-sans",
      referenceSource: "library",
      referenceCase: "plate",
    },
  }, {
    projectId: "atlas",
    contract: { system: "ant", style: "minimal-tech", format: "desktop" },
  });

  assert.equal(migrated.version, LAUNCHER_WORKSPACE_VERSION);
  assert.equal(migrated.projectId, "atlas");
  assert.equal(migrated.intents.rebuild.fields.brief, "还原参考图并适配移动端");
  assert.deepEqual(migrated.intents.rebuild.overrides.reference, { mode: "case", caseId: "plate-play" });
  assert.equal(migrated.intents.rebuild.overrides.format.value, "mobile");
  assert.equal(migrated.intents.rebuild.overrides.density.value, "high-density");
  assert.equal(migrated.intents.rebuild.overrides.spacingBase.value, "8pt");
  assert.equal(migrated.intents.rebuild.overrides.fontScheme.value, "humanist-sans-cjk");
  assert.equal(migrated.intents.create.fields.brief, "");
  assert.equal(normalizeCaseId("plate"), "plate-play");
  assert.equal(validateReadiness(migrated, "rebuild").ready, true);
});

test("legacy design-system IDs migrate across contracts, overrides, and comparison fields", () => {
  const migrated = migrateLauncherWorkspace({
    version: LAUNCHER_WORKSPACE_VERSION,
    activeIntent: "design-system",
    contract: { system: "fluent" },
    intents: {
      create: { overrides: { system: { mode: "override", value: "polaris" } } },
      "design-system": {
        fields: {
          brief: "比较企业后台的表格和表单体验",
          systems: ["apple", "material", "ant"],
        },
      },
    },
  });

  assert.equal(migrated.contract.system, "fluent-2");
  assert.equal(migrated.intents.create.overrides.system.value, "shopify-polaris");
  assert.deepEqual(migrated.intents["design-system"].fields.systems, [
    "apple-hig",
    "google-material-3",
    "ant-design",
  ]);
  assert.equal(resolveEffectiveDecisions(migrated, "create").system.text, "Shopify Polaris（本次覆写）");
  assert.equal(validateReadiness(migrated, "design-system").ready, true);
});
