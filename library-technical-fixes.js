import { getPreviewMediaPresentation, standardPreviewDevice } from "./library-preview-config.mjs";

const SCALE_OVERSHOOT = 1.04;
const LEGACY_NOTEBOOK_CARD_PREVIEW = "marble-note/screenshots/library-preview-reference-v2.png";
const CANONICAL_NOTEBOOK_CARD_PREVIEW = "marble-note/screenshots/library-preview-2x.png";

function normalizeGalleryCardSource(image) {
  if (!image) return;
  const src = image.getAttribute("src") || "";
  if (!src.includes(LEGACY_NOTEBOOK_CARD_PREVIEW)) return;

  image.setAttribute("src", src.replace(LEGACY_NOTEBOOK_CARD_PREVIEW, CANONICAL_NOTEBOOK_CARD_PREVIEW));
  image.dataset.previewSourceNormalized = "true";
}

function setFramePresentation(frame, width, height, { forceDevice = false } = {}) {
  if (!frame) return;

  const presentation = forceDevice ? "device" : getPreviewMediaPresentation(width, height);
  const isArtboard = presentation === "artboard";

  frame.classList.toggle("is-artboard-preview", isArtboard);
  frame.dataset.mediaPresentation = presentation;

  if (isArtboard && Number.isFinite(width) && Number.isFinite(height) && width > 0 && height > 0) {
    frame.style.setProperty("--adaptive-media-ratio", `${width} / ${height}`);
  } else {
    frame.style.removeProperty("--adaptive-media-ratio");
  }
}

function bindImageToFrame(image, frame) {
  if (!image || !frame || image.dataset.adaptivePreviewBound === "true") return;
  image.dataset.adaptivePreviewBound = "true";

  const sync = () => {
    if (!image.naturalWidth || !image.naturalHeight) return;
    setFramePresentation(frame, image.naturalWidth, image.naturalHeight);
  };

  image.addEventListener("load", sync);
  if (image.complete) sync();
}

function bindGalleryCards() {
  const gallery = document.querySelector("#demoGallery");
  if (!gallery) return;

  const bindCurrentCards = () => {
    gallery.querySelectorAll(".phone-frame--card").forEach((frame) => {
      const image = frame.querySelector("img.phone-media");
      normalizeGalleryCardSource(image);
      bindImageToFrame(image, frame);
    });
  };

  bindCurrentCards();
  new MutationObserver(bindCurrentCards).observe(gallery, { childList: true, subtree: true });
}

function installDetailPresentation() {
  const frame = document.querySelector("#previewMediaFrame");
  const image = document.querySelector("#previewDialogImage");
  const sequence = document.querySelector("#previewDialogSequence");
  const video = document.querySelector("#previewDialogVideo");
  const demo = document.querySelector("#previewDialogDemo");
  if (!frame) return;

  bindImageToFrame(image, frame);
  bindImageToFrame(sequence, frame);

  const syncVideo = () => {
    if (!video || !video.videoWidth || !video.videoHeight) return;
    setFramePresentation(frame, video.videoWidth, video.videoHeight);
  };
  video?.addEventListener("loadedmetadata", syncVideo);

  const syncVisibleMode = () => {
    if (demo && !demo.hidden) {
      setFramePresentation(frame, standardPreviewDevice.width, standardPreviewDevice.height, { forceDevice: true });
      return;
    }
    if (video && !video.hidden && video.videoWidth && video.videoHeight) {
      syncVideo();
      return;
    }
    if (sequence && !sequence.hidden && sequence.naturalWidth && sequence.naturalHeight) {
      setFramePresentation(frame, sequence.naturalWidth, sequence.naturalHeight);
      return;
    }
    if (image && !image.hidden && image.naturalWidth && image.naturalHeight) {
      setFramePresentation(frame, image.naturalWidth, image.naturalHeight);
    }
  };

  [image, sequence, video, demo].filter(Boolean).forEach((element) => {
    new MutationObserver(syncVisibleMode).observe(element, {
      attributes: true,
      attributeFilter: ["hidden", "src"]
    });
  });

  syncVisibleMode();
}

function installPreviewScaleCorrection() {
  const frame = document.querySelector("#previewMediaFrame");
  if (!frame) return;

  let lastCorrectedValue = "";
  const correctScale = () => {
    const raw = frame.style.getPropertyValue("--preview-embed-scale").trim();
    if (!raw || raw === lastCorrectedValue) return;

    const scale = Number.parseFloat(raw);
    if (!Number.isFinite(scale) || scale <= 0) return;

    const corrected = String(scale / SCALE_OVERSHOOT);
    lastCorrectedValue = corrected;
    frame.style.setProperty("--preview-embed-scale", corrected);
  };

  new MutationObserver(correctScale).observe(frame, {
    attributes: true,
    attributeFilter: ["style"]
  });
  correctScale();
}

function installAdaptivePreviewRuntime() {
  bindGalleryCards();
  installDetailPresentation();
  installPreviewScaleCorrection();
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", installAdaptivePreviewRuntime, { once: true });
} else {
  installAdaptivePreviewRuntime();
}
