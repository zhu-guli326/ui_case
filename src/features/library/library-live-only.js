import { styleGuides } from "../../../catalog/index.js?v=20260815-artmuse-sequence";

/*
 * Library admission rule
 * ----------------------
 * A case belongs in the browseable UI library only when it has a real
 * clickable demo. Screenshot/video-only references can still exist in the
 * repository, but they should not appear as first-class cases in Library.
 */

const liveGuides = styleGuides.filter((guide) => Boolean(guide.liveDemo));
const liveGuideById = new Map(liveGuides.map((guide) => [guide.id, guide]));

/* These are screenshots captured from the actual clickable demos. Their older
 * mobile-preview posters are presentation compositions and do not match the
 * demo that opens after clicking the card. The Library thumbnail should be a
 * scaled version of the real demo, not a second art-directed preview. */
const liveDemoCardScreens = Object.freeze({
  mimo: "./demo/mimo-activities/screenshots/01-carousel.png",
  moe: "./demo/moe-habits/screenshots/video-2x/01-intro.png",
  moodly: "./demo/moodly-health/screenshots/01-checkin.png"
});

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

function withPosterVersion(src) {
  if (!src) return "";
  return `${src}${src.includes("?") ? "&" : "?"}v=20260817-live-demo-card-v1`;
}

function forceNotebookLivePreview(card, guide) {
  const screen = card.querySelector(".phone-screen") || card.querySelector(".phone-preview-media");
  if (!screen) return;

  // The historical Marble Note poster is a presentation board containing its
  // own phone mockups. It must never be shown in the browse grid.
  screen.querySelectorAll("img, video, iframe").forEach((node) => {
    if (node.dataset?.notebookLive === "true") return;
    node.remove();
  });

  let frame = screen.querySelector("iframe[data-notebook-live='true']");
  if (!frame) {
    frame = document.createElement("iframe");
    frame.dataset.notebookLive = "true";
    frame.src = `${guide.liveDemo}${guide.liveDemo.includes("?") ? "&" : "?"}libraryPreview=1&v=20260817-notebook-live-v2`;
    frame.title = `${guide.name} preview`;
    frame.loading = "eager";
    frame.tabIndex = -1;
    frame.setAttribute("aria-hidden", "true");
    frame.style.cssText = [
      "position:absolute",
      "inset:0",
      "width:100%",
      "height:100%",
      "border:0",
      "display:block",
      "pointer-events:none",
      "background:#fff",
      "transform:none"
    ].join(";");
    screen.appendChild(frame);
  }

  const frameShell = card.querySelector(".phone-frame");
  frameShell?.classList.remove("has-wide-device-art", "has-fitted-device-art", "is-artboard-preview");
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

    if (guide.id === "notebook") {
      forceNotebookLivePreview(card, guide);
    } else {
      const poster = card.querySelector(".phone-preview-media .phone-media");
      if (poster && poster.tagName === "IMG") {
        const source = liveDemoCardScreens[guide.id] || guide.poster;
        if (source) {
          const canonicalSrc = withPosterVersion(source);
          if (poster.getAttribute("src") !== canonicalSrc) poster.setAttribute("src", canonicalSrc);
        }
      }
    }

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

if (gallery) {
  const observer = new MutationObserver(normalizeRenderedCards);
  observer.observe(gallery, { childList: true, subtree: true });

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
requestAnimationFrame(normalizeRenderedCards);
setTimeout(normalizeRenderedCards, 150);
setTimeout(normalizeRenderedCards, 600);

window.addEventListener("image2:languagechange", () => {
  updateGlobalCounts();
  normalizeRenderedCards();
});
