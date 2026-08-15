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

const THEME_IDS = [
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

test("color-theme catalog provides eight branded, immutable semantic palettes", () => {
  assert.equal(DEFAULT_COLOR_THEME_ID, "ant-design");
  assert.deepEqual(colorThemes.map((theme) => theme.id), THEME_IDS);
  assert.equal(new Set(colorThemes.map((theme) => theme.id)).size, THEME_IDS.length);

  for (const theme of colorThemes) {
    const profile = brandProfiles.find((item) => item.id === theme.designSystemId);
    assert.ok(profile, `${theme.id} brand profile`);
    assert.equal(theme.id, theme.designSystemId);
    assert.equal(theme.organization, profile.organization);
    assert.equal(theme.sourceUrl, profile.sourceUrl);
    assert.match(theme.sourceUrl, /^https:\/\//);
    assert.match(theme.guidelineUrl, /^https:\/\//);
    assert.notEqual(theme.guidelineUrl, theme.sourceUrl);
    assert.ok(theme.description.length > 0);
    assert.ok(theme.guidance.length > 0);
    assert.ok(theme.mappingNote.length > 0);
    assert.ok(theme.locales.en.description.length > 0);
    assert.ok(theme.locales.en.guidance.length > 0);
    assert.ok(theme.locales.en.mappingNote.length > 0);
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

test("legacy generic theme IDs migrate to branded V2 IDs", () => {
  assert.deepEqual(COLOR_THEME_ID_ALIASES, {
    "minimal-tech": "ant-design",
    "editorial-commerce": "adobe-spectrum",
    "soft-lifestyle": "apple-hig",
    "future-tech": "google-material-3",
    "neo-brutal": "tdesign",
    glass: "fluent-2",
    retro: "github-primer",
  });
  for (const [legacyId, brandedId] of Object.entries(COLOR_THEME_ID_ALIASES)) {
    assert.equal(normalizeColorThemeId(legacyId), brandedId);
    assert.equal(colorThemeDesignSystemId(legacyId), brandedId);
  }
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
