import { createLibrarySpotlight } from "./library-spotlight.js";

export function createLibraryCards({
  elements,
  getState,
  helpers,
  actions
}) {
  const { gallery, searchInput, resultCount, emptyState, clearFilters, spotlightHost } = elements;
  const {
    currentCopy,
    localizeRecord,
    getFilteredGuides,
    getCardPoster,
    getPreviewScreens,
    normalizeTag
  } = helpers;
  const { openPreview, setTagFilter, track } = actions;

  const spotlight = createLibrarySpotlight({
    host: spotlightHost,
    localizeRecord,
    getPreviewScreens,
    openPreview,
    getCopy: currentCopy
  });

  const isEnglish = () => window.image2I18n?.language === "en";

  function renderDemoGallery() {
    const copy = currentCopy();
    const guides = getFilteredGuides();
    const { activeTag, activeCategory } = getState();
    const isSearch = Boolean(searchInput.value.trim());

    spotlight.render(guides);
    clearFilters.hidden = !isSearch && !activeTag && activeCategory === "all";

    gallery.innerHTML = guides.map((sourceGuide, index) => {
      const guide = localizeRecord(sourceGuide);
      const mediaMode = guide.video ? "video" : "image";
      const openMode = guide.defaultPreviewMode || mediaMode;
      const openLabel = copy.modes[openMode];
      const poster = getCardPoster(sourceGuide);
      const category = copy.categories[sourceGuide.category] || "";
      const uses = (guide.bestFor || "").split(/[、,]/).slice(0, 2).join(isEnglish() ? ", " : " · ");
      const actionLabel = guide.liveDemo ? copy.openDemo : copy.openCase;
      const tags = guide.tags.map((tag, tagIndex) => {
        const stableTag = sourceGuide.tags[tagIndex] || tag;
        const isActive = normalizeTag(stableTag) === normalizeTag(activeTag) || normalizeTag(tag) === normalizeTag(activeTag);
        return `<a class="wall-tag${isActive ? " is-active" : ""}" href="./library.html?tag=${encodeURIComponent(stableTag)}" data-tag="${stableTag}" aria-current="${isActive ? "true" : "false"}">${tag}</a>`;
      }).join("");

      return `
      <article class="wall-card" data-case-id="${guide.id}" style="--case-tint: ${sourceGuide.preview || "#e7e8e2"}">
        <div class="wall-frame">
          <span class="wall-index" aria-hidden="true">${String(index + 1).padStart(2, "0")}</span>
          <span class="wall-category" aria-hidden="true">${category}</span>
          <figure class="phone-frame phone-frame--card wall-phone"><div class="phone-screen"><img class="phone-media" loading="${index < 6 ? "eager" : "lazy"}" fetchpriority="${index < 3 ? "high" : "low"}" src="${poster}" alt="${isEnglish() ? `${guide.style} — ${guide.name}` : `${guide.style} — ${guide.name} 手机界面`}" decoding="async"></div></figure>
          <button class="wall-open" type="button" data-preview-id="${guide.id}" data-preview-mode="${openMode}" aria-label="${copy.openPreview}: ${guide.style}, ${openLabel}"></button>
        </div>
        <div class="wall-caption">
          <p class="wall-name">${guide.name}</p>
          <h3>${guide.style}</h3>
          <p class="wall-use">${uses}</p>
          <div class="wall-foot">
            <div class="wall-tags" aria-label="${copy.styleKeywords}">${tags}</div>
            <button class="wall-action" type="button" data-preview-id="${guide.id}" data-preview-mode="${openMode}">${actionLabel} <span aria-hidden="true">↗</span></button>
          </div>
        </div>
      </article>`;
    }).join("");

    let activeTagLabel = activeTag;
    if (activeTag) {
      for (const sourceGuide of guides) {
        const localized = localizeRecord(sourceGuide);
        const sourceIndex = (sourceGuide.tags || []).indexOf(activeTag);
        if (sourceIndex >= 0) {
          activeTagLabel = localized.tags?.[sourceIndex] || activeTag;
          break;
        }
        const localizedIndex = (localized.tags || []).indexOf(activeTag);
        if (localizedIndex >= 0) {
          activeTagLabel = localized.tags[localizedIndex] || activeTag;
          break;
        }
      }
    }

    resultCount.textContent = activeTag ? `${copy.count(guides.length)} · ${activeTagLabel}` : copy.count(guides.length);
    emptyState.hidden = guides.length !== 0;

    gallery.querySelectorAll(".wall-phone img").forEach((image) => image.addEventListener("error", () => {
      image.closest(".wall-frame")?.classList.add("is-unavailable");
      image.remove();
    }, { once: true }));

    gallery.querySelectorAll("[data-preview-id]").forEach((button) => button.addEventListener("click", () => openPreview(button.dataset.previewId, button.dataset.previewMode)));
    gallery.querySelectorAll("[data-tag]").forEach((link) => link.addEventListener("click", (event) => {
      event.preventDefault();
      event.stopPropagation();
      setTagFilter(link.dataset.tag);
      track("tag_filter", { tag: link.dataset.tag, resultCount: getFilteredGuides().length });
    }));
  }

  return { renderDemoGallery };
}
