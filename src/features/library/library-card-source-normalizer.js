/* Canonical card-poster normalizer.
 *
 * Library cards are allowed to show one phone screen only. Marketing boards,
 * multi-device composites and precomposed effect images belong in case detail,
 * never in the browse grid. This module intentionally runs after library.js
 * and replaces mixed poster sources with the first canonical single screen.
 */

const canonicalCardScreens = Object.freeze({
  museum: "./assets/cases/museum-app/home-screen.png",
  fashion: "./assets/cases/fashion-shopping-app/hero-screen.png",
  fufu: "./demo/fufu-bakery/screenshots/01-welcome.png",
  organique: "./demo/organique-food/screenshots/01-choose.png",
  "plate-play": "./demo/plate-play/screenshots/recipes.png",
  "carry-bag": "./demo/carry-bag/screenshots/03-hero.png",
  fithub: "./demo/fithub/screenshots/01-discover.png",
  "still-form": "./demo/still-form/screenshots/01-intro.png",
  news: "./assets/cases/news-app/headlines-screen.png",
  "signal-grid": "./demo/signal-grid/screenshots/01-scan.png",
  "volt-route": "./demo/volt-route/screenshots/01-dashboard.png",
  moe: "./demo/moe-habits/screenshots/video-2x/01-intro.png",
  loy: "./demo/loy-wellness/screenshots/03-welcome.png",
  moodly: "./demo/moodly-health/screenshots/01-checkin.png",
  reflect: "./demo/reflect-journal/screenshots/01-home.png",
  mimo: "./demo/mimo-activities/screenshots/library-preview-2x.png"
});

function normalizeCard(card) {
  const caseId = card?.dataset?.caseId;
  if (!caseId) return;
  const image = card.querySelector(".demo-card-preview .phone-media");
  if (!(image instanceof HTMLImageElement)) return;

  const canonical = canonicalCardScreens[caseId];
  if (canonical && image.getAttribute("src") !== canonical) {
    image.src = canonical;
  }

  // All grid cards represent one screen, never a wide artboard/composite.
  const frame = card.querySelector(".demo-card-preview .phone-frame");
  frame?.classList.remove("has-wide-device-art", "has-fitted-device-art", "is-artboard-preview");
  frame?.classList.add("is-canonical-single-screen");
}

function normalizeGallery() {
  document.querySelectorAll("#demoGallery .demo-card[data-case-id]").forEach(normalizeCard);
}

const gallery = document.querySelector("#demoGallery");
if (gallery) {
  normalizeGallery();
  new MutationObserver(normalizeGallery).observe(gallery, { childList: true, subtree: true });
}
