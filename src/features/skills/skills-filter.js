export function getRepositoryItems({ repositories, repositoriesEn, resolvedRepositories, currentLanguage }) {
  const source = resolvedRepositories || repositories;
  return currentLanguage === "en"
    ? source.map((item, index) => ({ ...item, fallback: repositoriesEn[index].fallback, focus: repositoriesEn[index].focus }))
    : source;
}

export function getStarValue(item) {
  if (typeof item.stars === "number") return item.stars;
  const label = String(item.starsLabel || "").trim().toLowerCase();
  const value = Number.parseFloat(label.replace(/[^0-9.]/g, ""));
  if (!Number.isFinite(value)) return -1;
  if (label.includes("m")) return value * 1000000;
  if (label.includes("k")) return value * 1000;
  return value;
}

export function hasReplacementCover(item) {
  return Boolean(item.coverImage || (item.coverType === "video" && item.coverSrc));
}

export function getFilteredRepositories({ items, activeCategories, searchQuery, activeSort }) {
  const query = searchQuery.trim().toLowerCase();
  const filtered = items.filter((item) => {
    const categoryMatch = activeCategories.size === 0 || activeCategories.has(item.category);
    const searchMatch = !query || [item.slug, item.title, item.category, item.fallback, item.description, item.focus]
      .some((value) => String(value || "").toLowerCase().includes(query));
    return categoryMatch && searchMatch;
  });
  if (activeSort === "STARS") return filtered.sort((a, b) => getStarValue(b) - getStarValue(a));
  if (activeSort === "UPDATED") return filtered.sort((a, b) => new Date(b.updatedAt || 0).getTime() - new Date(a.updatedAt || 0).getTime());
  return filtered.sort((a, b) => Number(hasReplacementCover(b)) - Number(hasReplacementCover(a)));
}

export function getFilteredWebsites({ items, activeCategories, searchQuery, activeSourceOnly, currentLanguage }) {
  const query = searchQuery.trim().toLowerCase();
  return items.filter((item) => {
    const categoryMatch = activeCategories.size === 0 || activeCategories.has(item.group);
    const description = currentLanguage === "en" ? item.descriptionEn : item.descriptionZh;
    const focus = currentLanguage === "en" ? item.focusEn : item.focusZh;
    const searchMatch = !query || [item.name, item.domain, item.group, description, focus]
      .some((value) => String(value || "").toLowerCase().includes(query));
    const sourceMatch = !activeSourceOnly || item.openSource;
    return categoryMatch && searchMatch && sourceMatch;
  });
}
