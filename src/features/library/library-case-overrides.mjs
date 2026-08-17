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

  // These demos historically recorded an entire rendered phone/board into MP4.
  // In the Library that created inconsistent nested devices and oversized white
  // gutters. Use the canonical screen captures as a deterministic flow preview;
  // the actual interactive demo remains available in the third tab.
  moe: Object.freeze({
    previewImage: "./demo/moe-habits/screenshots/video-2x/02-home.png",
    poster: "./demo/moe-habits/screenshots/video-2x/02-home.png?v=sharp-3x",
    videoSequence: screenSequence([
      { src: "./demo/moe-habits/screenshots/video-2x/02-home.png", label: "习惯首页" },
      { src: "./demo/moe-habits/screenshots/video-2x/03-task.png", label: "任务" },
      { src: "./demo/moe-habits/screenshots/video-2x/04-celebration.png", label: "完成" },
      { src: "./demo/moe-habits/screenshots/video-2x/01-intro.png", label: "欢迎" }
    ]),
    fallbacks: Object.freeze([
      "./demo/moe-habits/screenshots/video-2x/02-home.png",
      "./demo/moe-habits/screenshots/library-preview-2x.png"
    ])
  }),
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
  reflect: Object.freeze({
    previewImage: "./demo/reflect-journal/screenshots/01-home.png",
    poster: "./demo/reflect-journal/screenshots/01-home.png",
    videoSequence: screenSequence([
      { src: "./demo/reflect-journal/screenshots/01-home.png", label: "日记首页" },
      { src: "./demo/reflect-journal/screenshots/02-detail.png", label: "日记详情" }
    ])
  }),
  moodly: Object.freeze({
    previewImage: "./demo/moodly-health/screenshots/01-checkin.png",
    poster: "./demo/moodly-health/screenshots/01-checkin.png",
    videoSequence: screenSequence([
      { src: "./demo/moodly-health/screenshots/01-checkin.png", label: "情绪签到" },
      { src: "./demo/moodly-health/screenshots/02-confirm.png", label: "签到完成" }
    ])
  }),
  fufu: Object.freeze({
    previewImage: "./demo/fufu-bakery/screenshots/02-home.png",
    poster: "./demo/fufu-bakery/screenshots/02-home.png",
    videoSequence: screenSequence([
      { src: "./demo/fufu-bakery/screenshots/02-home.png", label: "烘焙首页" },
      { src: "./demo/fufu-bakery/screenshots/04-menu.png", label: "今日菜单" },
      { src: "./demo/fufu-bakery/screenshots/03-member.png", label: "会员卡" },
      { src: "./demo/fufu-bakery/screenshots/01-welcome.png", label: "欢迎页" }
    ])
  }),
  "plate-play": Object.freeze({
    previewImage: "./demo/plate-play/screenshots/recipes.png",
    poster: "./demo/plate-play/screenshots/recipes.png",
    videoSequence: screenSequence([
      { src: "./demo/plate-play/screenshots/recipes.png", label: "食谱列表" },
      { src: "./demo/plate-play/screenshots/detail.png", label: "食谱详情" },
      { src: "./demo/plate-play/screenshots/library-preview-2x.png", label: "欢迎页" }
    ])
  }),
  "still-form": Object.freeze({
    previewImage: "./demo/still-form/screenshots/02-catalog.png",
    poster: "./demo/still-form/screenshots/02-catalog.png",
    videoSequence: screenSequence([
      { src: "./demo/still-form/screenshots/02-catalog.png", label: "系列目录" },
      { src: "./demo/still-form/screenshots/03-detail.png", label: "单品详情" },
      { src: "./demo/still-form/screenshots/01-intro.png", label: "品牌入口" }
    ])
  }),
  mimo: Object.freeze({
    videoSequence: screenSequence([
      { src: "./demo/mimo-activities/screenshots/01-carousel.png", label: "日程轮播" },
      { src: "./demo/mimo-activities/screenshots/02-walk-focus.png", label: "步行任务" }
    ])
  }),
  "signal-grid": Object.freeze({
    videoSequence: screenSequence([
      { src: "./demo/signal-grid/screenshots/01-scan.png", label: "扫描页" },
      { src: "./demo/signal-grid/screenshots/02-plans.png", label: "方案页" },
      { src: "./demo/signal-grid/screenshots/03-confirmation.png", label: "确认页" }
    ])
  }),
  "volt-route": Object.freeze({
    videoSequence: screenSequence([
      { src: "./demo/volt-route/screenshots/01-dashboard.png", label: "车辆状态" },
      { src: "./demo/volt-route/screenshots/02-route.png", label: "充电路线" },
      { src: "./demo/volt-route/screenshots/03-charging.png", label: "充电进度" }
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
