import { styleGuides } from "../../../catalog/index.js";

const RUNTIME_VERSION = "20260901-library-runtime-v2";
function refreshGalleryIfEmpty() {
  const search = document.querySelector("#styleSearch");
  if (!search || document.querySelector("#demoGallery .demo-card")) return;
  search.dispatchEvent(new Event("input", { bubbles: true }));
}

function enhanceCards() {
  [...document.querySelectorAll("#demoGallery .demo-card")].forEach((card) => {
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

function installVideoRecovery() {
  const video = document.querySelector("#previewDialogVideo");
  const dialog = document.querySelector("#previewDialog");
  const status = document.querySelector("#previewMediaStatus");
  const statusText = document.querySelector("#previewMediaStatusText");
  if (!video || !dialog) return;

  let stalledTimer = 0;
  const clearTimer = () => window.clearTimeout(stalledTimer);
  const fallback = (reason) => {
    clearTimer();
    const target = dialog.querySelector('[data-preview-view="live"]') || dialog.querySelector('[data-preview-view="image"]');
    if (!target) return;
    if (status && statusText) {
      status.hidden = false;
      status.classList.add("is-error");
      statusText.textContent = window.image2I18n?.language === "en"
        ? "The video could not be played. Switched to an available preview."
        : "视频无法播放，已自动切换到可用预览。";
    }
    console.warn(`[library] video fallback (${reason})`, video.currentSrc || video.src);
    window.setTimeout(() => target.click(), 250);
  };

  video.addEventListener("loadstart", clearTimer);
  video.addEventListener("loadedmetadata", clearTimer);
  video.addEventListener("canplay", clearTimer);
  video.addEventListener("error", () => fallback("error"));
  video.addEventListener("stalled", () => {
    clearTimer();
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
      const text = `${doc?.title || ""} ${doc?.body?.innerText?.slice(0, 240) || ""}`;
      if (!/(^|\s)404(\s|$)|page not found|there isn't a github pages site/i.test(text)) return;
      if (status && statusText) {
        status.hidden = false;
        status.classList.add("is-error");
        statusText.textContent = window.image2I18n?.language === "en"
          ? "This interactive demo is unavailable. Use the screen or flow preview instead."
          : "这个可点击 Demo 当前不可用，请改用效果图或流程预览。";
      }
      if (retry) retry.hidden = false;
      dialog.querySelector('[data-preview-view="image"]')?.click();
    } catch {}
  });
}

function installDialogMediaPolicy() {
  const video = document.querySelector("#previewDialogVideo");
  if (!video) return;
  video.preload = "metadata";
  video.playsInline = true;
  video.muted = true;
}

function boot() {
  window.setTimeout(refreshGalleryIfEmpty, 0);
  enhanceCards();
  installDialogMediaPolicy();

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

  installVideoRecovery();
  installIframeHealthCheck();

  window.image2LibraryRuntime = Object.freeze({
    version: RUNTIME_VERSION,
    totalCases: styleGuides.length
  });
}

if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot, { once: true });
else boot();
