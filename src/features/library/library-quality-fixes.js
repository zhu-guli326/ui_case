import { styleGuides } from "../../../catalog/index.js?v=20260815-artmuse-sequence";
import { applyLibraryCaseOverrides, libraryCaseOverrides } from "./library-case-overrides.mjs";

const REPAIR_VERSION = "20260817-library-qa-v5";
const guideById = new Map(styleGuides.map((guide) => [guide.id, guide]));
const repairedIds = applyLibraryCaseOverrides(styleGuides);

function absolute(src) {
  try { return new URL(src, window.location.href).href; }
  catch { return src || ""; }
}

function unique(values) {
  return [...new Set(values.filter(Boolean).map(absolute))];
}

function preferredCardSource(id) {
  const guide = guideById.get(id);
  if (!guide) return "";
  // Poster is the canonical single-screen browsing asset. `previewImage` is a
  // fallback because a few older preview images are composite boards containing
  // their own phone hardware and large margins.
  return guide.poster || guide.previewImage || "";
}

function fallbackCandidates(id) {
  const guide = guideById.get(id);
  const repair = libraryCaseOverrides[id];
  return unique([
    preferredCardSource(id),
    ...(repair?.fallbacks || []),
    guide?.previewImage,
    guide?.referenceImage
  ]);
}

function refreshGalleryFromSharedCatalog() {
  const search = document.querySelector("#styleSearch");
  if (!search) return;
  search.dispatchEvent(new Event("input", { bubbles: true }));
}

function normalizeCardImage(image, caseId) {
  const preferred = preferredCardSource(caseId);
  if (!image || !preferred) return;
  const current = absolute(image.getAttribute("src") || "");
  const target = absolute(preferred);
  if (!target || current === target || current.startsWith(`${target}?`) || current.startsWith(`${target}&`)) return;
  image.src = preferred;
  image.dataset.previewSourceNormalized = "representative-screen";
  image.closest(".phone-preview-media")?.classList.remove("is-unavailable");
}

function enhanceCards() {
  const cards = [...document.querySelectorAll("#demoGallery .demo-card")];
  cards.forEach((card, index) => {
    card.dataset.qaNormalized = "true";
    const caseId = card.dataset.caseId || "";
    const image = card.querySelector(".phone-preview-media img");
    if (image) {
      normalizeCardImage(image, caseId);
      image.loading = index < 3 ? "eager" : "lazy";
      image.fetchPriority = index < 3 ? "high" : "low";
      image.decoding = "async";
      image.dataset.caseId = caseId;
      image.dataset.fallbackQueue = JSON.stringify(fallbackCandidates(caseId));
      if (!image.dataset.failedSources) image.dataset.failedSources = "[]";
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
    let failed = [];
    try { queue = JSON.parse(image.dataset.fallbackQueue || "[]"); } catch {}
    try { failed = JSON.parse(image.dataset.failedSources || "[]"); } catch {}
    if (!queue.length) queue = fallbackCandidates(card.dataset.caseId);
    if (current && !failed.includes(current)) failed.push(current);
    image.dataset.failedSources = JSON.stringify(failed);

    const next = queue.find((src) => src && src !== current && !failed.includes(src));
    if (!next) return;

    event.stopImmediatePropagation();
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
          ? "This interactive demo is unavailable. Use the screen or flow preview instead."
          : "这个可点击 Demo 当前不可用，请改用效果图或流程预览。";
      }
      if (retry) retry.hidden = false;
      dialog.querySelector('[data-preview-view="image"]')?.click();
    } catch {
      // Cross-origin demos cannot be inspected; the base timeout/error handlers
      // continue to own those cases.
    }
  });
}

function installDialogMediaPolicy() {
  const video = document.querySelector("#previewDialogVideo");
  if (video) {
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
  // library.js performs the initial render itself. Defer the compatibility
  // refresh until all deferred modules have run, and only use it when the
  // gallery is still empty; this prevents a second full card render on load.
  window.setTimeout(() => {
    if (!document.querySelector("#demoGallery .demo-card")) refreshGalleryFromSharedCatalog();
  }, 0);
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
