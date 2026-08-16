import {
  getLibraryPreviewProfile,
  getPreviewMediaPresentation,
  previewContractVersion,
  standardPreviewDevice,
} from "../../../library-preview-config.mjs";

const LEGACY_SCALE_OVERSHOOT = 1.04;
const LEGACY_NOTEBOOK_CARD_PREVIEW = "marble-note/screenshots/library-preview-reference-v2.png";
const CANONICAL_NOTEBOOK_CARD_PREVIEW = "marble-note/screenshots/library-preview-2x.png";

const DETAIL_SCREEN_ONLY_OVERRIDES = Object.freeze({
  "signal-grid": Object.freeze({
    legacyPrefix: "demo/signal-grid/screenshots/",
    canonical: "./demo/signal-grid/screenshots/library-preview-2x.png",
  }),
  "still-form": Object.freeze({
    legacyPrefix: "demo/still-form/screenshots/",
    canonical: "./demo/still-form/screenshots/library-preview-2x.png",
  }),
});

function normalizeGalleryCardSource(image) {
  if (!image) return;
  const src = image.getAttribute("src") || "";
  if (!src.includes(LEGACY_NOTEBOOK_CARD_PREVIEW)) return;

  image.setAttribute("src", src.replace(LEGACY_NOTEBOOK_CARD_PREVIEW, CANONICAL_NOTEBOOK_CARD_PREVIEW));
  image.dataset.previewSourceNormalized = "true";
}

function normalizeDetailScreenSource(image, caseId) {
  if (!image || !caseId) return false;
  const override = DETAIL_SCREEN_ONLY_OVERRIDES[caseId];
  if (!override) return false;

  const src = image.getAttribute("src") || "";
  if (!src.includes(override.legacyPrefix) || src.includes("library-preview-2x.png")) return false;

  image.setAttribute("src", override.canonical);
  image.dataset.previewSourceNormalized = "screen-only";
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
  const presentation = forceDevice
    ? "device"
    : getPreviewMediaPresentation(width, height, { caseId });
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
      normalizeGalleryCardSource(image);
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
    if (!video || !video.videoWidth || !video.videoHeight) return;
    setFramePresentation(frame, video.videoWidth, video.videoHeight, { caseId: resolveCaseId() });
  };
  video?.addEventListener("loadedmetadata", syncVideo);

  const syncVisibleMode = () => {
    const caseId = resolveCaseId();
    if (image && !image.hidden) normalizeDetailScreenSource(image, caseId);

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

function installLegacyScaleNormalization() {
  const frame = document.querySelector("#previewMediaFrame");
  if (!frame) return;

  let lastCorrectedValue = "";
  const correctScale = () => {
    const raw = frame.style.getPropertyValue("--preview-embed-scale").trim();
    if (!raw || raw === lastCorrectedValue) return;

    const scale = Number.parseFloat(raw);
    if (!Number.isFinite(scale) || scale <= 0) return;

    const corrected = String(scale / LEGACY_SCALE_OVERSHOOT);
    lastCorrectedValue = corrected;
    frame.style.setProperty("--preview-embed-scale", corrected);
  };

  new MutationObserver(correctScale).observe(frame, {
    attributes: true,
    attributeFilter: ["style"]
  });
  correctScale();
}

function installDevicePreview() {
  document.documentElement.dataset.previewContract = previewContractVersion;
  bindGalleryCards();
  installDetailPresentation();
  installLegacyScaleNormalization();
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", installDevicePreview, { once: true });
} else {
  installDevicePreview();
}
