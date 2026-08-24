const CATEGORY_QUERY_ALIASES = Object.freeze({
  foundation: ["基础", "页面基础", "foundation", "foundations", "page foundation", "page foundations"],
  layout: ["布局", "页面布局", "layout", "layouts", "page layout", "page layouts"],
  navigation: ["导航", "发现", "导航与发现", "navigation", "discovery", "navigation and discovery"],
  content: ["内容", "内容展示", "content", "media", "content display"],
  controls: ["控件", "表单", "控件与表单", "control", "controls", "form", "forms", "controls and forms"],
  feedback: ["反馈", "浮层", "反馈与浮层", "feedback", "overlay", "overlays", "feedback and overlays"],
  visual: ["视觉", "视觉与实现", "visual", "visual design"],
});

export function normalizeVocabularyQuery(value) {
  return String(value || "").trim().toLocaleLowerCase().replace(/\s+/g, " ");
}

export function resolveVocabularyCategoryIntent(query, categories = []) {
  const normalizedQuery = normalizeVocabularyQuery(query);
  if (!normalizedQuery) return null;

  const availableCategoryIds = new Set(categories.map((category) => category.id));
  for (const category of categories) {
    const labels = [category.label, category.en].map(normalizeVocabularyQuery);
    if (labels.includes(normalizedQuery)) return category.id;
  }

  for (const [categoryId, aliases] of Object.entries(CATEGORY_QUERY_ALIASES)) {
    if (availableCategoryIds.has(categoryId) && aliases.includes(normalizedQuery)) return categoryId;
  }

  return null;
}
