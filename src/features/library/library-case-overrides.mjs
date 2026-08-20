function screenSequence(frames, secondsPerFrame = 2) {
  return Object.freeze({
    duration: frames.length * secondsPerFrame,
    frames: Object.freeze(frames.map((frame, index) => Object.freeze({
      ...frame,
      at: index * secondsPerFrame
    })))
  });
}

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

  // Loy has a complete, checked-in screen sequence. Other cases use their
  // canonical single-screen capture plus the authored MP4/live demo instead of
  // advertising flow frames that are not present in the repository.
  loy: Object.freeze({
    previewImage: "./demo/loy-wellness/screenshots/01-home.png",
    poster: "./demo/loy-wellness/screenshots/01-home.png",
    videoSequence: screenSequence([
      { src: "./demo/loy-wellness/screenshots/01-home.png", label: "健康首页" },
      { src: "./demo/loy-wellness/screenshots/02-playlist.png", label: "播放列表" },
      { src: "./demo/loy-wellness/screenshots/03-welcome.png", label: "欢迎" }
    ]),
    fallbacks: Object.freeze([
      "./demo/loy-wellness/screenshots/01-home.png",
      "./demo/loy-wellness/mobile-preview.png"
    ])
  }),
  "signal-grid": Object.freeze({
    previewImage: "./demo/signal-grid/screenshots/library-preview-2x.png",
    poster: "./demo/signal-grid/screenshots/library-preview-2x.png",
    fallbacks: Object.freeze([
      "./demo/signal-grid/screenshots/library-preview-2x.png"
    ])
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
