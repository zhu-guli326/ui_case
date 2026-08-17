import assert from "node:assert/strict";
import test from "node:test";

import { brandProfiles } from "../catalog/index.js";
import {
  COLOR_THEME_ID_ALIASES,
  DEFAULT_COLOR_THEME_ID,
  colorThemeDesignSystemId,
  colorThemePrompt,
  colorThemes,
  labThemes,
  localizeColorTheme,
  normalizeColorThemeId,
} from "../catalog/color-themes.js";

const CORE_SYSTEM_IDS = [
  "ant-design",
  "tdesign",
  "google-material-3",
  "apple-hig",
  "fluent-2",
  "carbon-design",
  "adobe-spectrum",
  "github-primer",
];

const REQUIRED_ROLES = ["canvas", "surface", "ink", "muted", "accent", "actionAccent", "accentSoft", "success", "warning", "danger", "border", "onAccent"];

function luminance(hex) {
  const channels = hex.slice(1).match(/../g).map((value) => parseInt(value, 16) / 255).map(function (value) {
    return value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * channels[0] + 0.7152 * channels[1] + 0.0722 * channels[2];
}

function contrastRatio(first, second) {
  const values = [luminance(first), luminance(second)].sort((a, b) => b - a);
  return (values[0] + 0.05) / (values[1] + 0.05);
}

test("color-theme catalog exposes an immutable mixed brand and system palette registry", () => {
  assert.ok(colorThemes.length >= CORE_SYSTEM_IDS.length);
  assert.ok(colorThemes.some((theme) => theme.id === DEFAULT_COLOR_THEME_ID), "default theme must exist in the catalog");
  assert.equal(new Set(colorThemes.map((theme) => theme.id)).size, colorThemes.length);
  for (const id of CORE_SYSTEM_IDS) assert.ok(colorThemes.some((theme) => theme.id === id), `missing core system palette: ${id}`);
  for (const id of ["airbnb", "claude", "cursor", "binance", "bmw-m", "coinbase"]) {
    assert.ok(colorThemes.some((theme) => theme.id === id), `missing branded palette: ${id}`);
  }

  for (const theme of colorThemes) {
    if (theme.designSystemId !== "custom") {
      const profile = brandProfiles.find((item) => item.id === theme.designSystemId);
      assert.ok(profile, `${theme.id} design-system profile`);
      assert.equal(theme.id, theme.designSystemId);
      assert.equal(theme.organization, profile.organization);
      assert.equal(theme.sourceUrl, profile.sourceUrl);
    }
    assert.match(theme.sourceUrl, /^https:\/\//);
    assert.match(theme.guidelineUrl, /^https:\/\//);
    assert.notEqual(theme.guidelineUrl, theme.sourceUrl);
    assert.ok(theme.description.length > 0);
    assert.ok(theme.guidance.length > 0);
    assert.ok(theme.mappingNote.length > 0);
    assert.ok(theme.locales.en.name.length > 0);
    assert.ok(theme.locales.en.description.length > 0);
    assert.equal(Object.isFrozen(theme), true);
    assert.equal(Object.isFrozen(theme.colors), true);
    assert.deepEqual(Object.keys(theme.colors), REQUIRED_ROLES);
    for (const role of REQUIRED_ROLES) assert.match(theme.colors[role], /^#[0-9a-f]{6}$/i);
  }
});

test("palette copy and text-bearing action colors meet normal-text contrast", () => {
  for (const theme of colorThemes) {
    assert.ok(contrastRatio(theme.colors.ink, theme.colors.canvas) >= 4.5, `${theme.id} ink/canvas`);
    assert.ok(contrastRatio(theme.colors.muted, theme.colors.canvas) >= 4.5, `${theme.id} muted/canvas`);
    assert.ok(contrastRatio(theme.colors.ink, theme.colors.surface) >= 4.5, `${theme.id} ink/surface`);
    assert.ok(contrastRatio(theme.colors.onAccent, theme.colors.actionAccent) >= 4.5, `${theme.id} onAccent/actionAccent`);
    assert.ok(contrastRatio(theme.colors.accent, theme.colors.canvas) >= 3, `${theme.id} accent/canvas`);
  }
});

test("legacy generic theme IDs migrate to valid current branded or system IDs", () => {
  assert.ok(Object.keys(COLOR_THEME_ID_ALIASES).length >= 7);
  for (const [legacyId, currentId] of Object.entries(COLOR_THEME_ID_ALIASES)) {
    assert.ok(colorThemes.some((theme) => theme.id === currentId), `${legacyId} points to an unknown theme`);
    assert.equal(normalizeColorThemeId(legacyId), currentId);
    assert.equal(colorThemeDesignSystemId(legacyId), colorThemes.find((theme) => theme.id === currentId).designSystemId);
  }
  assert.equal(COLOR_THEME_ID_ALIASES["minimal-tech"], "cursor");
  assert.equal(COLOR_THEME_ID_ALIASES["editorial-commerce"], "airbnb");
  assert.equal(COLOR_THEME_ID_ALIASES["soft-lifestyle"], "claude");
  assert.equal(normalizeColorThemeId("unknown"), DEFAULT_COLOR_THEME_ID);
});

test("launcher palettes remain the single source for the Lab theme API", () => {
  assert.deepEqual(labThemes.map((theme) => theme.id), colorThemes.map((theme) => theme.id));
  assert.equal(labThemes[0].colors, colorThemes[0].colors);
});

test("theme localization and prompts include provenance and every semantic role", () => {
  assert.equal(localizeColorTheme("google-material-3", "en").name, "Material 3 purple");
  const theme = colorThemes.find((item) => item.id === "adobe-spectrum");
  const prompt = colorThemePrompt(theme.id, "zh");
  assert.match(prompt, /Spectrum 蓝/);
  assert.match(prompt, /Adobe/);
  assert.match(prompt, /https:\/\/spectrum\.adobe\.com\/page\/color-system\//);
  for (const role of REQUIRED_ROLES) assert.match(prompt, new RegExp(theme.colors[role], "i"));
});
