import {
  getLibraryPreviewProfile,
  getPreviewMediaPresentation,
  previewContractVersion,
  standardPreviewDevice,
} from "../../../library-preview-config.mjs";

const LEGACY_NOTEBOOK_CARD_PREVIEW = "marble-note/screenshots/library-preview-reference-v2.png";
const CANONICAL_NOTEBOOK_CARD_PREVIEW = "marble-note/screenshots/library-preview-2x.png";

const CARD_SCREEN_ONLY_OVERRIDES = Object.freeze({
  fashion: "./assets/cases/fashion-shopping-app/screen-only/hero.png",
  museum: "./assets/cases/museum-app/video-frames/01-home.png",
  news: "./assets/cases/news-app/screen-only/headlines.png",
});

const DETAIL_IMAGE_OVERRIDES = Object.freeze({
  fashion: Object.freeze({
    "hero-screen.png": "./assets/cases/fashion-shopping-app/screen-only/hero.png",
    "catalog-screen.png": "./assets/cases/fashion-shopping-app/screen-only/catalog.png",
    "favorites-screen.png": "./assets/cases/fashion-shopping-app/screen-only/favorites.png",
  }),
  museum: Object.freeze({
    "home-screen.png": "./assets/cases/museum-app/video-frames/01-home.png",
    "exhibitions-screen.png": "./assets/cases/museum-app/video-frames/02-exhibitions.png",
    "detail-screen.png": "./assets/cases/museum-app/video-frames/03-detail.png",
  }),
  news: Object.freeze({
    "headlines-screen.png": "./assets/cases/news-app/screen-only/headlines.png",
    "feed-screen.png": "./assets/cases/news-app/screen-only/feed.png",
    "discover-screen.png": "./assets/cases/news-app/screen-only/discover.png",
  }),
});

const DETAIL_VIDEO_OVERRIDES = Object.freeze({
  fashion: "./assets/cases/fashion-shopping-app/screen-only/demo.mp4",
  news: "./assets/cases/news-app/screen-only/demo.mp4",
});

function normalizeGalleryCardSource(image, caseId = "") {
  if (!image) return false;
  const src = image.getAttribute("src") || "";

  const caseOverride = CARD_SCREEN_ONLY_OVERRIDES[caseId];
  if (caseOverride && src !== caseOverride && !src.includes("/screen-only/")) {
    image.setAttribute("src", caseOverride);
    image.dataset.previewSourceNormalized = "screen-only";
    return true;
  }

  if (src.includes(LEGACY_NOTEBOOK_CARD_PREVIEW)) {
    image.setAttribute("src", src.replace(LEGACY_NOTEBOOK_CARD_PREVIEW, CANONICAL_NOTEBOOK_CARD_PREVIEW));
    image.dataset.previewSourceNormalized = "true";
    return true;
  }

  return false;
}

function normalizeDetailScreenSource(image, caseId) {
  if (!image || !caseId) return false;
  const src = image.getAttribute("src") || "";
  const mapped = DETAIL_IMAGE_OVERRIDES[caseId];
  if (!mapped) return false;

  for (const [legacyName, canonical] of Object.entries(mapped)) {
    if (!src.includes(legacyName)) continue;
    image.setAttribute("src", canonical);
    image.dataset.previewSourceNormalized = "screen-only";
    return true;
  }
  return false;
}

function normalizeDetailVideoSource(video, caseId) {
  if (!video || !caseId) return false;
  const canonical = DETAIL_VIDEO_OVERRIDES[caseId];
  if (!canonical) return false;

  const src = video.getAttribute("src") || "";
  if (!src || src === canonical || src.includes("/screen-only/demo.mp4")) return false;
  video.setAttribute("src", canonical);
  video.dataset.previewSourceNormalized = "screen-only";
  video.load();
  if (!video.hidden) video.play().catch(() => {});
  return true;
}

function getCardCaseId(frame) {
  return frame?.closest("[data-case-id]")?.dataset.caseId || "";
}

function getDetailCaseId() {
  return document.querySelector("#previewDialogCopy")?.dataset.copyStyle || "";
}

function setFramePresentation(frame, width, height, { forceDevice = false, caseId = "" } = {}) {
  if (!frame) return;

  const profile = caseId ? getLibraryPreviewProfile(caseId) : null;
  const presentation = forceDevice ? "device" : getPreviewMediaPresentation(width, height, { caseId });
  const isArtboard = presentation === "artboard";

  frame.classList.toggle("is-artboard-preview", isArtboard);
  frame.dataset.mediaPresentation = presentation;
  frame.dataset.previewContract = previewContractVersion;
  if (caseId) frame.dataset.previewCaseId = caseId;
  if (profile) {
    frame.dataset.frameOwner = profile.frameOwner;
    frame.dataset.sourceKind = profile.sourceKind;
  }

  if (isArtboard && Number.isFinite(width) && Number.isFinite(height) && width > 0 && height > 0) {
    frame.style.setProperty("--adaptive-media-ratio", `${width} / ${height}`);
  } else {
    frame.style.removeProperty("--adaptive-media-ratio");
  }
}

function bindImageToFrame(image, frame, resolveCaseId = () => "", { normalizeDetailSource = false } = {}) {
  if (!image || !frame || image.dataset.adaptivePreviewBound === "true") return;
  image.dataset.adaptivePreviewBound = "true";

  const sync = () => {
    const caseId = resolveCaseId();
    if (normalizeDetailSource && normalizeDetailScreenSource(image, caseId)) return;
    if (!image.naturalWidth || !image.naturalHeight) return;
    setFramePresentation(frame, image.naturalWidth, image.naturalHeight, { caseId });
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
      const caseId = getCardCaseId(frame);
      normalizeGalleryCardSource(image, caseId);
      bindImageToFrame(image, frame, () => getCardCaseId(frame));
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
  const caseMarker = document.querySelector("#previewDialogCopy");
  if (!frame) return;

  const resolveCaseId = () => getDetailCaseId();
  bindImageToFrame(image, frame, resolveCaseId, { normalizeDetailSource: true });
  bindImageToFrame(sequence, frame, resolveCaseId);

  const syncVideo = () => {
    const caseId = resolveCaseId();
    if (normalizeDetailVideoSource(video, caseId)) return;
    if (!video || !video.videoWidth || !video.videoHeight) return;
    setFramePresentation(frame, video.videoWidth, video.videoHeight, { caseId });
  };
  video?.addEventListener("loadedmetadata", syncVideo);

  const syncVisibleMode = () => {
    const caseId = resolveCaseId();
    if (image && !image.hidden) normalizeDetailScreenSource(image, caseId);
    if (video && !video.hidden) normalizeDetailVideoSource(video, caseId);

    const profile = getLibraryPreviewProfile(caseId);
    if (profile) {
      setFramePresentation(frame, standardPreviewDevice.width, standardPreviewDevice.height, {
        forceDevice: profile.presentation === "device",
        caseId,
      });
      return;
    }
    if (demo && !demo.hidden) {
      setFramePresentation(frame, standardPreviewDevice.width, standardPreviewDevice.height, { forceDevice: true, caseId });
      return;
    }
    if (video && !video.hidden && video.videoWidth && video.videoHeight) {
      syncVideo();
      return;
    }
    if (sequence && !sequence.hidden && sequence.naturalWidth && sequence.naturalHeight) {
      setFramePresentation(frame, sequence.naturalWidth, sequence.naturalHeight, { caseId });
      return;
    }
    if (image && !image.hidden && image.naturalWidth && image.naturalHeight) {
      setFramePresentation(frame, image.naturalWidth, image.naturalHeight, { caseId });
    }
  };

  [image, sequence, video, demo].filter(Boolean).forEach((element) => {
    new MutationObserver(syncVisibleMode).observe(element, {
      attributes: true,
      attributeFilter: ["hidden", "src"]
    });
  });
  if (caseMarker) {
    new MutationObserver(syncVisibleMode).observe(caseMarker, {
      attributes: true,
      attributeFilter: ["data-copy-style"]
    });
  }

  syncVisibleMode();
}

function installDevicePreview() {
  document.documentElement.dataset.previewContract = previewContractVersion;
  bindGalleryCards();
  installDetailPresentation();
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", installDevicePreview, { once: true });
} else {
  installDevicePreview();
}
