import { styleGuides } from "../../../catalog/index.js?v=20260815-artmuse-sequence";

const REPAIR_VERSION = "20260817-library-qa-v1";
const caseRepairs = Object.freeze({
  fashion: {
    liveDemo: "./demo/fashion/index.html",
    fallbacks: [
      "./assets/cases/fashion-shopping-app/card-screen.png",
      "./assets/cases/fashion-shopping-app/hero-screen.png",
      "./assets/cases/fashion-shopping-app/screen-only/hero.png"
    ]
  },
  news: {
    liveDemo: "./demo/news/index.html",
    fallbacks: [
      "./assets/cases/news-app/card-screen.png",
      "./assets/cases/news-app/headlines-screen.png",
      "./assets/cases/news-app/screen-only/headlines.png"
    ]
  }
});

const guideById = new Map(styleGuides.map((guide) => [guide.id, guide]));
const repairedIds = [];

for (const [id, repair] of Object.entries(caseRepairs)) {
  const guide = guideById.get(id);
  if (!guide) continue;
  if (!guide.liveDemo && repair.liveDemo) {
    guide.liveDemo = repair.liveDemo;
    repairedIds.push(id);
  }
}

function absolute(src) {
  try { return new URL(src, window.location.href).href; }
  catch { return src || ""; }
}

function unique(values) {
  return [...new Set(values.filter(Boolean).map(absolute))];
}

function fallbackCandidates(id) {
  const guide = guideById.get(id);
  const repair = caseRepairs[id];
  return unique([
    ...(repair?.fallbacks || []),
    guide?.previewImage,
    guide?.poster,
    guide?.referenceImage
  ]);
}

function refreshGalleryFromSharedCatalog() {
  const search = document.querySelector("#styleSearch");
  if (!search) return;
  search.dispatchEvent(new Event("input", { bubbles: true }));
}

function enhanceCards() {
  const cards = [...document.querySelectorAll("#demoGallery .demo-card")];
  cards.forEach((card, index) => {
    card.dataset.qaNormalized = "true";
    const image = card.querySelector(".phone-preview-media img");
    if (image) {
      image.loading = index < 3 ? "eager" : "lazy";
      image.fetchPriority = index < 3 ? "high" : "low";
      image.decoding = "async";
      image.dataset.caseId = card.dataset.caseId || "";
      if (!image.dataset.fallbackQueue) {
        image.dataset.fallbackQueue = JSON.stringify(fallbackCandidates(card.dataset.caseId));
      }
    }

    const preview = card.querySelector(".demo-card-preview");
    if (preview && !preview.dataset.backgroundPreviewBound) {
      preview.dataset.backgroundPreviewBound = "true";
      preview.addEventListener("click", (event) => {
        if (event.target.closest("button,a,input,summary")) return;
        preview.querySelector(".preview-open-button")?.click();
      });
    }
  });
}

function installImageRecovery() {
  document.addEventListener("error", (event) => {
    const image = event.target;
    if (!(image instanceof HTMLImageElement) || !image.closest("#demoGallery")) return;
    const card = image.closest(".demo-card");
    if (!card) return;

    const current = absolute(image.currentSrc || image.src);
    let queue = [];
    try { queue = JSON.parse(image.dataset.fallbackQueue || "[]"); } catch {}
    if (!queue.length) queue = fallbackCandidates(card.dataset.caseId);
    const next = queue.find((src) => src && src !== current && !image.dataset[`failed${btoa(src).replace(/=/g, "")}`]);
    if (!next) return;

    // Prevent the base Library error handler from removing the image before we
    // have exhausted the known-good local fallbacks.
    event.stopImmediatePropagation();
    const key = `failed${btoa(current).replace(/=/g, "")}`;
    image.dataset[key] = "1";
    image.src = next;
    image.closest(".phone-preview-media")?.classList.remove("is-unavailable");
  }, true);
}

function installVideoRecovery() {
  const video = document.querySelector("#previewDialogVideo");
  const dialog = document.querySelector("#previewDialog");
  const status = document.querySelector("#previewMediaStatus");
  const statusText = document.querySelector("#previewMediaStatusText");
  if (!video || !dialog) return;

  let stalledTimer = 0;
  const clearStalledTimer = () => window.clearTimeout(stalledTimer);
  const fallback = (reason) => {
    clearStalledTimer();
    const live = dialog.querySelector('[data-preview-view="live"]');
    const image = dialog.querySelector('[data-preview-view="image"]');
    const target = live || image;
    if (!target) return;
    if (status && statusText) {
      status.hidden = false;
      status.classList.add("is-error");
      statusText.textContent = window.image2I18n?.language === "en"
        ? "The video could not be played. Switched to an available preview."
        : "视频无法播放，已自动切换到可用预览。";
    }
    console.warn(`[library QA] video fallback (${reason})`, video.currentSrc || video.src);
    window.setTimeout(() => target.click(), 250);
  };

  video.addEventListener("loadstart", clearStalledTimer);
  video.addEventListener("loadedmetadata", clearStalledTimer);
  video.addEventListener("canplay", clearStalledTimer);
  video.addEventListener("error", () => fallback("error"));
  video.addEventListener("stalled", () => {
    clearStalledTimer();
    stalledTimer = window.setTimeout(() => {
      if (!video.hidden && video.readyState < HTMLMediaElement.HAVE_CURRENT_DATA) fallback("stalled");
    }, 3000);
  });
}

function installIframeHealthCheck() {
  const iframe = document.querySelector("#previewDialogDemo");
  const dialog = document.querySelector("#previewDialog");
  const status = document.querySelector("#previewMediaStatus");
  const statusText = document.querySelector("#previewMediaStatusText");
  const retry = document.querySelector("#previewMediaRetry");
  if (!iframe || !dialog) return;

  iframe.addEventListener("load", () => {
    if (iframe.hidden || iframe.src === "about:blank") return;
    try {
      const doc = iframe.contentDocument;
      const title = doc?.title || "";
      const text = doc?.body?.innerText?.slice(0, 240) || "";
      const looksBroken = /(^|\s)404(\s|$)|page not found|there isn't a github pages site/i.test(`${title} ${text}`);
      if (!looksBroken) return;
      if (status && statusText) {
        status.hidden = false;
        status.classList.add("is-error");
        statusText.textContent = window.image2I18n?.language === "en"
          ? "This interactive demo is unavailable. Use the screen or video preview instead."
          : "这个可点击 Demo 当前不可用，请改用效果图或视频预览。";
      }
      if (retry) retry.hidden = false;
      dialog.querySelector('[data-preview-view="image"]')?.click();
    } catch {
      // Cross-origin demos cannot be inspected. The base timeout/error handlers
      // remain responsible for those cases.
    }
  });
}

function installDialogMediaPolicy() {
  const video = document.querySelector("#previewDialogVideo");
  if (video) {
    // The base library assigns video.src only after the modal is opened, so
    // keeping metadata preload here preserves the existing lazy-load contract.
    video.preload = "metadata";
    video.playsInline = true;
    video.muted = true;
  }
}

function runEnhancements() {
  enhanceCards();
  installDialogMediaPolicy();
}

function boot() {
  refreshGalleryFromSharedCatalog();
  runEnhancements();

  const gallery = document.querySelector("#demoGallery");
  if (gallery) {
    let queued = false;
    new MutationObserver(() => {
      if (queued) return;
      queued = true;
      requestAnimationFrame(() => {
        queued = false;
        enhanceCards();
      });
    }).observe(gallery, { childList: true, subtree: true });
  }

  installImageRecovery();
  installVideoRecovery();
  installIframeHealthCheck();

  window.image2LibraryQA = Object.freeze({
    version: REPAIR_VERSION,
    repairedIds: [...repairedIds],
    totalCases: styleGuides.length
  });
}

if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot, { once: true });
else boot();
