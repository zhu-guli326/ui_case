export const libraryCaseOverrides = Object.freeze({
  fashion: Object.freeze({
    liveDemo: "./demo/fashion/index.html",
    fallbacks: Object.freeze([
      "./assets/cases/fashion-shopping-app/card-screen.png",
      "./assets/cases/fashion-shopping-app/hero-screen.png",
      "./assets/cases/fashion-shopping-app/screen-only/hero.png"
    ])
  }),
  news: Object.freeze({
    liveDemo: "./demo/news/index.html",
    fallbacks: Object.freeze([
      "./assets/cases/news-app/card-screen.png",
      "./assets/cases/news-app/headlines-screen.png",
      "./assets/cases/news-app/screen-only/headlines.png"
    ])
  })
});

export function applyLibraryCaseOverrides(guides) {
  const repaired = [];
  for (const guide of guides) {
    // The Library is a comparison surface first. Opening every case on its most
    // representative screen makes cases comparable; video and interactive modes
    // remain explicit choices instead of silently becoming the default.
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
