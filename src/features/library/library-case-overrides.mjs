export const libraryCaseOverrides = Object.freeze({
  fashion: Object.freeze({
    liveDemo: "./demo/fashion/index.html",
    previewImage: "./assets/cases/fashion-shopping-app/screen-only/hero.png",
    fallbacks: Object.freeze([
      "./assets/cases/fashion-shopping-app/card-screen.png",
      "./assets/cases/fashion-shopping-app/hero-screen.png",
      "./assets/cases/fashion-shopping-app/screen-only/hero.png"
    ])
  }),
  news: Object.freeze({
    liveDemo: "./demo/news/index.html",
    previewImage: "./assets/cases/news-app/screen-only/headlines.png",
    fallbacks: Object.freeze([
      "./assets/cases/news-app/card-screen.png",
      "./assets/cases/news-app/headlines-screen.png",
      "./assets/cases/news-app/screen-only/headlines.png"
    ])
  }),

  // Comparison surfaces should open on a representative product screen, not a
  // splash/welcome screen. Keep those intro screens in the screen rail as
  // secondary references instead of making them the first impression.
  moe: Object.freeze({
    previewImage: "./demo/moe-habits/screenshots/video-2x/02-home.png",
    poster: "./demo/moe-habits/screenshots/video-2x/02-home.png?v=sharp-3x",
    fallbacks: Object.freeze([
      "./demo/moe-habits/screenshots/video-2x/02-home.png",
      "./demo/moe-habits/screenshots/library-preview-2x.png"
    ])
  }),
  loy: Object.freeze({
    previewImage: "./demo/loy-wellness/screenshots/01-home.png",
    poster: "./demo/loy-wellness/screenshots/01-home.png",
    fallbacks: Object.freeze([
      "./demo/loy-wellness/screenshots/01-home.png",
      "./demo/loy-wellness/mobile-preview.png"
    ])
  }),
  fufu: Object.freeze({
    previewImage: "./demo/fufu-bakery/screenshots/02-home.png",
    poster: "./demo/fufu-bakery/screenshots/02-home.png"
  }),
  "plate-play": Object.freeze({
    previewImage: "./demo/plate-play/screenshots/recipes.png",
    poster: "./demo/plate-play/screenshots/recipes.png"
  }),
  "still-form": Object.freeze({
    previewImage: "./demo/still-form/screenshots/02-catalog.png",
    poster: "./demo/still-form/screenshots/02-catalog.png"
  })
});

export function applyLibraryCaseOverrides(guides) {
  const repaired = [];
  for (const guide of guides) {
    // Library is a comparison surface first. Start with a stable screen view;
    // motion and interactive demos remain explicit choices in the viewer.
    if (guide.defaultPreviewMode !== "image") {
      guide.defaultPreviewMode = "image";
      repaired.push(guide.id);
    }

    const override = libraryCaseOverrides[guide.id];
    if (!override) continue;
    for (const [key, value] of Object.entries(override)) {
      if (key === "fallbacks") continue;
      if (guide[key] !== value) {
        guide[key] = value;
        repaired.push(guide.id);
      }
    }
  }
  return [...new Set(repaired)];
}
