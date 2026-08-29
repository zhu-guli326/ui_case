import assert from "node:assert/strict";
import test from "node:test";

import {
  CASE_PICKER,
  normalizeCaseId,
  openCasePickerUrl,
  parseCasePickerUrl,
  replaceCasePickerFiltersUrl,
  selectCaseUrl,
} from "../src/features/launcher/launcher-url.mjs";

const styleIds = new Set(["minimal-tech", "soft-lifestyle", "editorial-commerce"]);
const caseIds = new Set(["moe", "plate-play", "volt-route"]);
const catalog = { styleIds, caseIds };

test("parses case picker filters and canonicalizes legacy case IDs", () => {
  const state = parseCasePickerUrl(
    "https://example.test/launcher.html?picker=cases&style=minimal-tech&q=route&category=creative&source=library&case=plate",
    catalog,
  );

  assert.deepEqual(state, {
    picker: CASE_PICKER,
    style: "minimal-tech",
    q: "route",
    category: "creative",
    source: "library",
    caseId: "plate-play",
    invalid: { picker: null, style: null, caseId: null },
  });
  assert.equal(normalizeCaseId("plate"), "plate-play");
  assert.equal(normalizeCaseId("moe"), "moe");
});

test("reports unknown styles and cases without selecting a fallback", () => {
  const state = parseCasePickerUrl(
    "https://example.test/launcher.html?picker=other&style=unknown-style&case=unknown-case",
    catalog,
  );

  assert.equal(state.picker, null);
  assert.equal(state.style, null);
  assert.equal(state.caseId, null);
  assert.deepEqual(state.invalid, {
    picker: "other",
    style: "unknown-style",
    caseId: "unknown-case",
  });
});

test("opening the picker preserves unrelated launcher parameters", () => {
  const initial = new URL("https://example.test/launcher.html?lang=zh&intent=create&source=library&case=moe&utm_source=test#summary");
  const opened = openCasePickerUrl(initial, {
    style: "minimal-tech",
    q: " route ",
    category: "creative",
  }, catalog);

  assert.notEqual(opened, initial);
  assert.equal(initial.searchParams.has("picker"), false);
  assert.equal(opened.searchParams.get("picker"), "cases");
  assert.equal(opened.searchParams.get("style"), "minimal-tech");
  assert.equal(opened.searchParams.get("q"), "route");
  assert.equal(opened.searchParams.get("category"), "creative");
  assert.equal(opened.searchParams.get("lang"), "zh");
  assert.equal(opened.searchParams.get("intent"), "create");
  assert.equal(opened.searchParams.get("source"), "library");
  assert.equal(opened.searchParams.get("case"), "moe");
  assert.equal(opened.searchParams.get("utm_source"), "test");
  assert.equal(opened.hash, "#summary");
});

test("opening with a legacy case produces its canonical URL", () => {
  const opened = openCasePickerUrl(
    "https://example.test/launcher.html?lang=en&intent=rebuild&source=library&case=plate",
    {},
    catalog,
  );

  assert.equal(opened.searchParams.get("case"), "plate-play");
});

test("an unknown requested style is removed instead of replaced by a default", () => {
  const opened = openCasePickerUrl(
    "https://example.test/launcher.html?intent=create&style=soft-lifestyle",
    { style: "not-a-style" },
    catalog,
  );

  assert.equal(opened.searchParams.has("style"), false);
  assert.equal(parseCasePickerUrl(opened, catalog).style, null);
});

test("filter serialization is suitable for replaceState and preserves unrelated parameters", () => {
  const replaced = replaceCasePickerFiltersUrl(
    "https://example.test/launcher.html?lang=en&intent=create&picker=cases&style=minimal-tech&q=old&category=wellness&case=moe&debug=1",
    { style: "soft-lifestyle", q: " cafe ", category: null },
    catalog,
  );

  assert.equal(replaced.searchParams.get("picker"), "cases");
  assert.equal(replaced.searchParams.get("style"), "soft-lifestyle");
  assert.equal(replaced.searchParams.get("q"), "cafe");
  assert.equal(replaced.searchParams.has("category"), false);
  assert.equal(replaced.searchParams.get("lang"), "en");
  assert.equal(replaced.searchParams.get("intent"), "create");
  assert.equal(replaced.searchParams.get("case"), "moe");
  assert.equal(replaced.searchParams.get("debug"), "1");
});

test("selecting a case closes picker state and writes the library reference", () => {
  const selected = selectCaseUrl(
    "https://example.test/launcher.html?lang=zh&intent=create&picker=cases&style=minimal-tech&q=food&category=commerce&source=upload&case=moe&keep=yes#prompt",
    "plate",
    catalog,
  );

  assert.equal(selected.searchParams.has("picker"), false);
  assert.equal(selected.searchParams.has("q"), false);
  assert.equal(selected.searchParams.has("category"), false);
  assert.equal(selected.searchParams.get("source"), "library");
  assert.equal(selected.searchParams.get("case"), "plate-play");
  assert.equal(selected.searchParams.get("style"), "minimal-tech");
  assert.equal(selected.searchParams.get("lang"), "zh");
  assert.equal(selected.searchParams.get("intent"), "create");
  assert.equal(selected.searchParams.get("keep"), "yes");
  assert.equal(selected.hash, "#prompt");
});

test("selecting an unknown case fails explicitly and does not mutate the input URL", () => {
  const initial = new URL("https://example.test/launcher.html?picker=cases&case=moe");

  assert.throws(
    () => selectCaseUrl(initial, "unknown-case", catalog),
    { name: "RangeError", message: "Unknown case ID: unknown-case" },
  );
  assert.equal(initial.searchParams.get("picker"), "cases");
  assert.equal(initial.searchParams.get("case"), "moe");
});
