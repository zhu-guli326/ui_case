import assert from "node:assert/strict";
import test from "node:test";

import {
  DEFAULT_FONT_PRESET_ID,
  FONT_PRESET_ID_ALIASES,
  findFontPreset,
  fontPresetFamily,
  fontPresetPrompt,
  fontPresets,
  localizeFontPreset,
  normalizeFontPresetId,
} from "../catalog/font-presets.js";

const PRESET_IDS = ["system-ui-cjk", "humanist-sans-cjk", "editorial-serif-cjk"];

test("font presets expose stable IDs, real family stacks, fallbacks, and sources", () => {
  assert.equal(DEFAULT_FONT_PRESET_ID, "system-ui-cjk");
  assert.deepEqual(fontPresets.map((preset) => preset.id), PRESET_IDS);
  assert.equal(new Set(fontPresets.map((preset) => preset.id)).size, PRESET_IDS.length);

  for (const preset of fontPresets) {
    assert.equal(Object.isFrozen(preset), true);
    assert.equal(Object.isFrozen(preset.roles), true);
    assert.deepEqual(Object.keys(preset.roles), ["display", "body"]);
    for (const role of Object.values(preset.roles)) {
      assert.match(role.fontFamily, /(sans-serif|serif)$/);
      assert.ok(role.fallbacks.length >= 2);
      assert.ok(role.weights.every((weight) => Number.isInteger(weight)));
    }
    assert.ok(preset.sources.length >= 1);
    for (const source of preset.sources) {
      assert.ok(source.family);
      assert.ok(source.provider);
      assert.match(source.sourceUrl, /^https:\/\//);
      assert.ok(source.license);
    }
    assert.ok(preset.locales.en.description);
    assert.ok(preset.locales.en.guidance);
  }
});

test("the default preset is offline-safe and remote fonts remain optional", () => {
  const system = findFontPreset(DEFAULT_FONT_PRESET_ID);
  assert.equal(system.loadStrategy, "system");
  assert.equal(system.remoteCssUrl, null);
  assert.match(system.roles.body.fontFamily, /^system-ui,/);

  for (const preset of fontPresets.slice(1)) {
    assert.equal(preset.loadStrategy, "optional-remote");
    assert.match(preset.remoteCssUrl, /^https:\/\/fonts\.googleapis\.com\/css2\?/);
    assert.match(preset.roles.body.fontFamily, /(system-ui|sans-serif)$/);
  }
});

test("legacy fontScheme values normalize to the three stable preset IDs", () => {
  assert.deepEqual(FONT_PRESET_ID_ALIASES, {
    "system-cjk": "system-ui-cjk",
    "system-sans": "system-ui-cjk",
    "humanist-cjk": "humanist-sans-cjk",
    "cjk-latin-sans": "humanist-sans-cjk",
    "serif-cjk": "editorial-serif-cjk",
    "cjk-latin-editorial": "editorial-serif-cjk",
  });
  for (const [legacyId, presetId] of Object.entries(FONT_PRESET_ID_ALIASES)) {
    assert.equal(normalizeFontPresetId(legacyId), presetId);
  }
  assert.equal(normalizeFontPresetId("unknown"), DEFAULT_FONT_PRESET_ID);
});

test("font helpers localize copy and expose role-specific CSS families", () => {
  assert.equal(localizeFontPreset("humanist-cjk", "en").name, "Humanist sans pairing");
  assert.match(fontPresetFamily("serif-cjk", "display"), /^"Source Serif 4"/);
  assert.match(fontPresetFamily("serif-cjk", "body"), /^system-ui,/);

  const prompt = fontPresetPrompt("editorial-serif-cjk", "zh");
  assert.match(prompt, /编辑型衬线组合/);
  assert.match(prompt, /Source Serif 4/);
  assert.match(prompt, /字重 500\/600\/700/);
  assert.match(prompt, /fonts\.googleapis\.com/);
});
