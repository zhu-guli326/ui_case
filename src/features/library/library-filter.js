const HIDDEN_GUIDE_IDS = new Set(["loy"]);

export function normalizeTag(value) {
  return String(value || "").trim().toLocaleLowerCase();
}

export function getFilteredGuides({
  styleGuides,
  searchGuides,
  query,
  activeCategory,
  activeTag,
  localizeRecord,
  featuredCaseOrder
}) {
  const guides = searchGuides(styleGuides, query).filter((guide) => {
    if (HIDDEN_GUIDE_IDS.has(guide.id)) return false;
    const localized = localizeRecord(guide);
    const tags = [...(guide.tags || []), ...(localized.tags || [])];
    const matchesTag = !activeTag || tags.some((tag) => normalizeTag(tag) === normalizeTag(activeTag));
    return (activeCategory === "all" || guide.category === activeCategory) && matchesTag;
  });
  if (activeCategory !== "all" || activeTag || query.trim()) return guides;
  const rank = new Map(featuredCaseOrder.map((id, index) => [id, index]));
  return [...guides].sort((a, b) => (rank.get(a.id) ?? featuredCaseOrder.length) - (rank.get(b.id) ?? featuredCaseOrder.length));
}
