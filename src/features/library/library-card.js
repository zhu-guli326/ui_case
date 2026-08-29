export function createLibraryCards({
  elements,
  getState,
  helpers,
  actions
}) {
  const { gallery, searchInput, catalogHeading, resultCount, emptyState } = elements;
  const {
    currentCopy,
    localizeRecord,
    getFilteredGuides,
    getCardPoster,
    fittedCardPreviewIds,
    getStyleProfiles,
    normalizeTag
  } = helpers;
  const { applyCaseToProject, openPreview, setTagFilter, track } = actions;

  function updateCatalogHeadingVisibility() {
    const { activeCategory, activeTag } = getState();
    catalogHeading.hidden = activeCategory !== "all" || Boolean(activeTag) || Boolean(searchInput.value.trim());
  }

  function renderDemoGallery() {
    updateCatalogHeadingVisibility();
    const copy = currentCopy();
    const guides = getFilteredGuides();
    const { activeTag } = getState();
    const isSearch = Boolean(searchInput.value.trim());
    document.querySelector(".catalog-bar .kicker").textContent = isSearch ? copy.searchResults : copy.featured;
    document.querySelector("#catalogTitle").textContent = isSearch ? copy.searchTitle : copy.startVisual;
    gallery.innerHTML = guides.map((sourceGuide) => {
      const guide = localizeRecord(sourceGuide);
      const mediaMode = guide.video ? "video" : "image";
      const openMode = guide.defaultPreviewMode || mediaMode;
      const openLabel = copy.modes[openMode];
      const poster = getCardPoster(guide);
      const referenceMatchedPoster = poster;
      const deviceArtClass = fittedCardPreviewIds.has(guide.id) ? " has-fitted-device-art" : "";
      const previewActionButtons = [
        guide.video ? `<button class="style-details-button" type="button" data-preview-id="${guide.id}" data-preview-mode="video">${copy.video}</button>` : "",
        guide.liveDemo ? `<button class="style-details-button" type="button" data-preview-id="${guide.id}" data-preview-mode="live">${copy.clickable}</button>` : ""
      ].join("");
      return `
      <article class="demo-card" data-case-id="${guide.id}">
        <div class="demo-card-preview" style="--preview: ${guide.preview}">
          <figure class="phone-frame phone-frame--card phone-preview-media${deviceArtClass}"><div class="phone-screen"><img class="phone-media" src="${referenceMatchedPoster}" alt="${window.image2I18n?.language === "en" ? `${guide.style} mobile interface thumbnail` : `${guide.style} 手机界面缩略图`}" decoding="async"></div><span class="media-hint">${copy.imagePreview}</span></figure>
          <button class="preview-open-button" type="button" data-preview-id="${guide.id}" data-preview-mode="${openMode}" aria-label="${copy.openPreview}: ${guide.style}, ${openLabel}"><span>${openLabel}</span></button>
        </div>
        <div class="demo-card-body">
          <button class="demo-card-details-hitarea" type="button" data-style-details="${guide.id}" aria-label="${copy.openDetails}: ${guide.style}"></button>
          <div class="demo-card-meta"><span>${guide.name}</span><span>${guide.bestFor}</span></div>
          <h3>${guide.style}</h3>
          <p class="demo-card-summary">${guide.summary}</p>
          <div class="case-statuses" aria-label="${window.image2I18n?.language === "en" ? "Case status" : "案例状态"}"><span>Screenshot</span>${guide.liveDemo ? `<span class="is-live">Clickable</span><span>Code Ready</span>` : ""}</div>
          <div class="style-tags" aria-label="${copy.styleKeywords}">${guide.tags.map((tag, index) => { const stableTag = sourceGuide.tags[index] || tag; return `<a class="style-tag${normalizeTag(stableTag) === normalizeTag(activeTag) ? " is-active" : ""}" href="./library.html?tag=${encodeURIComponent(stableTag)}" data-tag="${stableTag}" aria-pressed="${normalizeTag(stableTag) === normalizeTag(activeTag)}">${tag}</a>`; }).join("")}</div>
          <div class="brand-links" aria-label="${copy.brands}">${getStyleProfiles(sourceGuide).map((profile) => `<span>${profile.name}</span>`).join("")}</div>
          <div class="demo-card-footer"><small title="${copy.localReference}: ${guide.referenceImage}">${copy.localReference}: ${guide.reference}</small><div class="demo-card-actions">${previewActionButtons}<button class="style-details-button" type="button" data-style-details="${guide.id}">${copy.details}</button><button class="copy-style-button" type="button" data-apply-case="${guide.id}">${copy.applyProject}</button></div></div>
        </div>
      </article>`;
    }).join("");
    resultCount.textContent = copy.count(guides.length);
    emptyState.hidden = guides.length !== 0;
    gallery.querySelectorAll(".phone-preview-media img").forEach((image) => image.addEventListener("error", () => {
      const media = image.closest(".phone-preview-media");
      media?.classList.add("is-unavailable");
      image.remove();
    }, { once: true }));
    gallery.querySelectorAll("[data-apply-case]").forEach((button) => button.addEventListener("click", () => applyCaseToProject(button.dataset.applyCase, true)));
    gallery.querySelectorAll("[data-style-details]").forEach((button) => button.addEventListener("click", () => openPreview(button.dataset.styleDetails)));
    gallery.querySelectorAll("[data-preview-id]").forEach((button) => button.addEventListener("click", () => openPreview(button.dataset.previewId, button.dataset.previewMode)));
    gallery.querySelectorAll("[data-tag]").forEach((link) => link.addEventListener("click", (event) => {
      event.preventDefault();
      event.stopPropagation();
      setTagFilter(link.dataset.tag);
      track("tag_filter", { tag: link.dataset.tag, resultCount: getFilteredGuides().length });
    }));
  }

  return { renderDemoGallery, updateCatalogHeadingVisibility };
}
