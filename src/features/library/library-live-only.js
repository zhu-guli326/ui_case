import { styleGuides } from "../../../catalog/index.js?v=20260815-artmuse-sequence";

/*
 * Library admission rule
 * ----------------------
 * A case belongs in the browseable UI library only when it has a real
 * clickable demo. Screenshot/video-only references can still exist in the
 * repository, but they should not appear as first-class cases in Library.
 *
 * This also normalizes the primary action: clicking a case opens the live demo
 * first, so every mobile preview uses the same Library-owned PhoneShell.
 */

const liveGuides = styleGuides.filter((guide) => Boolean(guide.liveDemo));
const liveGuideById = new Map(liveGuides.map((guide) => [guide.id, guide]));

const gallery = document.querySelector("#demoGallery");
const resultCount = document.querySelector("#resultCount");
const emptyState = document.querySelector("#emptyState");
const categoryNav = document.querySelector("#categoryNav");

function isEnglish() {
  return window.image2I18n?.language === "en";
}

function countLabel(count) {
  return isEnglish() ? `${count} cases` : `${count} 个案例`;
}

function updateGlobalCounts() {
  const categoryCounts = liveGuides.reduce((counts, guide) => {
    counts[guide.category] = (counts[guide.category] || 0) + 1;
    return counts;
  }, {});

  categoryNav?.querySelectorAll("[data-filter]").forEach((button) => {
    const count = button.dataset.filter === "all"
      ? liveGuides.length
      : (categoryCounts[button.dataset.filter] || 0);
    const badge = button.querySelector("b");
    if (badge) badge.textContent = String(count);
  });

  const stats = document.querySelectorAll(".stats-panel strong");
  if (stats[0]) stats[0].textContent = String(liveGuides.length);
  if (stats[1]) stats[1].textContent = String(liveGuides.length);

  const sidebarCount = document.querySelector(".sidebar-note strong");
  if (sidebarCount) sidebarCount.textContent = isEnglish()
    ? `${liveGuides.length} real clickable UI cases`
    : `${liveGuides.length} 个真实可点击 UI 案例`;
}

function normalizeRenderedCards() {
  if (!gallery) return;

  gallery.querySelectorAll(".demo-card[data-case-id]").forEach((card) => {
    const guide = liveGuideById.get(card.dataset.caseId);
    if (!guide) {
      card.remove();
      return;
    }

    card.dataset.hasLiveDemo = "true";

    const primary = card.querySelector(".preview-open-button[data-preview-id]");
    if (primary) {
      primary.dataset.previewMode = "live";
      const label = primary.querySelector("span");
      if (label) label.textContent = isEnglish() ? "Interactive" : "可点击";
      primary.setAttribute(
        "aria-label",
        `${isEnglish() ? "Open interactive demo" : "打开可点击 Demo"}: ${guide.name}`
      );
    }
  });

  const visibleCount = gallery.querySelectorAll(".demo-card[data-case-id]").length;
  if (resultCount) resultCount.textContent = countLabel(visibleCount);
  if (emptyState) emptyState.hidden = visibleCount !== 0;
}

/* Existing Library rerenders the grid for search/category/tag changes. Keep the
 * admission rule applied after every render without duplicating its renderer. */
if (gallery) {
  const observer = new MutationObserver(normalizeRenderedCards);
  observer.observe(gallery, { childList: true });

  /* The card body previously opened the automatic mode, which prefers video.
   * Redirect that gesture to the primary live-demo button instead. */
  gallery.addEventListener("click", (event) => {
    const detailsHit = event.target.closest("[data-style-details]");
    if (!detailsHit) return;
    const card = detailsHit.closest(".demo-card[data-has-live-demo='true']");
    const primary = card?.querySelector(".preview-open-button[data-preview-mode='live']");
    if (!primary) return;

    event.preventDefault();
    event.stopImmediatePropagation();
    primary.click();
  }, true);
}

updateGlobalCounts();
normalizeRenderedCards();

window.addEventListener("image2:languagechange", () => {
  updateGlobalCounts();
  normalizeRenderedCards();
});
