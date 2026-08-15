import test from "node:test";
import assert from "node:assert/strict";

import { brandProfiles } from "../catalog/index.js";
import {
  DESIGN_SYSTEM_ID_ALIASES,
  designSystemLabel,
  designSystemOptions,
  normalizeDesignSystemId,
  normalizeDesignSystemIds,
} from "../catalog/design-system-utils.js";

test("design-system options expose the complete unique shared catalog", () => {
  const options = designSystemOptions(brandProfiles, "zh");
  assert.equal(options.length, 19);
  assert.equal(new Set(options.map((option) => option.value)).size, 19);
  assert.deepEqual(options.map((option) => option.value), brandProfiles.map((profile) => profile.id));
  assert.equal(options.find((option) => option.value === "ant-design").optionLabel, "Ant Design · Ant Group");
  assert.match(options.find((option) => option.value === "google-material-3").detail, /Material Design 3/);
});

test("legacy design-system IDs canonicalize without discarding unknown custom values", () => {
  assert.equal(normalizeDesignSystemId("ant"), "ant-design");
  assert.equal(normalizeDesignSystemId("material"), "google-material-3");
  assert.equal(normalizeDesignSystemId("primer"), "github-primer");
  assert.equal(normalizeDesignSystemId("internal-system"), "internal-system");
  assert.deepEqual(normalizeDesignSystemIds(["apple", "apple-hig", "custom-system"]), ["apple-hig", "custom-system"]);
  assert.ok(Object.isFrozen(DESIGN_SYSTEM_ID_ALIASES));
});

test("catalog labels stay human-readable for prompts and summaries", () => {
  assert.equal(designSystemLabel("material", brandProfiles, "zh"), "Google Material Design 3");
  assert.equal(designSystemLabel("apple-hig", brandProfiles, "en"), "Apple Human Interface Guidelines");
  assert.equal(designSystemLabel("auto", brandProfiles, "zh"), "自动推荐");
  assert.equal(designSystemLabel("custom-system", brandProfiles, "en"), "custom-system");
});
