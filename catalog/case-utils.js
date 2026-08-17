export const legacyCaseIds = Object.freeze({
  plate: "plate-play",
});

export const mergedCaseIds = Object.freeze({});

export const stylePreviewCaseIds = Object.freeze({
  "editorial-commerce": "still-form",
  "minimal-tech": "cleanbite",
  "soft-lifestyle": "softly-reflections",
  "dense-tool": "signal-grid",
});

export function normalizeCaseId(id) {
  const value = String(id || "");
  return legacyCaseIds[value] || value;
}

export function activeCases(guides = []) {
  return guides.filter((guide) => !mergedCaseIds[guide?.id]);
}

export function localizeCase(guide, language = "zh") {
  if (!guide) return null;
  if (language !== "en" || !guide.locales?.en) return guide;
  return {
    ...guide,
    ...guide.locales.en,
    recipe: { ...guide.recipe, ...guide.locales.en.recipe },
  };
}

export function caseThumbnail(guide) {
  if (!guide) return "./assets/readme/hero.png";
  return guide.previewImage || guide.poster || guide.referenceImage || guide.effectImage || "./assets/readme/hero.png";
}

export function caseOverviewImage(guide) {
  if (!guide) return "./assets/readme/hero.png";
  return guide.effectImage || guide.referenceImage || guide.previewImage || guide.poster || "./assets/readme/hero.png";
}

export function projectPatchForGuide(guide) {
  if (!guide) return {};
  const template = guide.category === "commerce" ? "commerce" : guide.category === "creative" ? "dashboard" : guide.category === "wellness" ? "social" : "landing";
  const brand = guide.category === "commerce" ? "airbnb" : guide.category === "creative" ? "linear" : guide.category === "editorial" ? "notion" : "stripe";
  const normalizedTags = (guide.tags || []).map((tag) => String(tag || "").trim().toLocaleLowerCase()).join(" ");
  const theme = guide.styleProfileIds?.[0]
    || (/editorial|编辑|magazine/.test(normalizedTags) ? "editorial-commerce" : /glass|玻璃/.test(normalizedTags) ? "glass" : guide.category === "wellness" ? "soft-lifestyle" : "minimal-tech");
  return {
    name: `${guide.name} / ${guide.style}`,
    template,
    brand,
    theme,
    sourceCaseId: guide.id,
    sourceCaseName: guide.name,
    sourceCaseStyle: guide.style,
    sourceCaseImage: caseThumbnail(guide),
    sourceCaseDemo: guide.liveDemo || "",
    lastStep: "library",
  };
}

export function filterCases(guides, { styleId = "all", category = "all", query = "" } = {}) {
  const normalizedQuery = String(query || "").trim().toLocaleLowerCase();
  return activeCases(guides).filter((guide) => {
    const styleMatch = styleId === "all"
      || guide.styleProfileIds?.includes(styleId)
      || styleId === "dense-tool" && ["creative", "editorial"].includes(guide.category);
    const categoryMatch = category === "all" || guide.category === category;
    if (!styleMatch || !categoryMatch) return false;
    if (!normalizedQuery) return true;
    const searchable = [guide.name, guide.style, guide.summary, guide.bestFor, guide.category, ...(guide.tags || [])].join(" ").toLocaleLowerCase();
    return searchable.includes(normalizedQuery);
  });
}
