import assert from "node:assert/strict";
import test from "node:test";

import { styleGuides } from "../catalog/index.js";
import {
  caseOverviewImage,
  caseThumbnail,
  filterCases,
  normalizeCaseId,
  projectPatchForGuide,
  stylePreviewCaseIds,
} from "../catalog/case-utils.js";

test("the shared launcher catalog exposes every unique case", () => {
  assert.equal(styleGuides.length, 19);
  assert.equal(new Set(styleGuides.map((guide) => guide.id)).size, 19);
  assert.equal(normalizeCaseId("plate"), "plate-play");
  assert.equal(normalizeCaseId("journal"), "journal");
});

test("style filters use the catalog profile IDs", () => {
  assert.equal(filterCases(styleGuides, { styleId: "editorial-commerce" }).length, 4);
  assert.equal(filterCases(styleGuides, { styleId: "minimal-tech" }).length, 4);
  assert.equal(filterCases(styleGuides, { styleId: "soft-lifestyle" }).length, 11);
});

test("style cards use distinct complete case previews", () => {
  const previewIds = Object.values(stylePreviewCaseIds);
  assert.equal(new Set(previewIds).size, previewIds.length);
  const previews = previewIds.map((id) => {
    const guide = styleGuides.find((item) => item.id === id);
    assert.ok(guide, `missing style preview case: ${id}`);
    return caseOverviewImage(guide);
  });
  assert.equal(new Set(previews).size, previews.length);
  assert.equal(caseOverviewImage({ effectImage: "effect.png", referenceImage: "reference.png" }), "effect.png");
});

test("case thumbnails and project patches preserve complete case metadata", () => {
  const guide = styleGuides.find((item) => item.id === "moe");
  assert.ok(caseThumbnail(guide));
  assert.ok(caseOverviewImage(guide));
  assert.equal(caseThumbnail({ previewImage: "preview.png", poster: "poster.png" }), "preview.png");
  const patch = projectPatchForGuide(guide);
  assert.equal(patch.sourceCaseId, "moe");
  assert.equal(patch.sourceCaseName, guide.name);
  assert.equal(patch.sourceCaseStyle, guide.style);
  assert.equal(patch.sourceCaseImage, caseThumbnail(guide));
});
