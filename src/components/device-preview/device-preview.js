import {
  getLibraryPreviewProfile,
  getPreviewMediaPresentation,
  standardPreviewDevice,
} from "../../features/library/library-preview-config.mjs";

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

function bindImageToFrame(image, frame, resolveCaseId = () => "") {
  if (!image || !frame || image.dataset.adaptivePreviewBound === "true") return;
  image.dataset.adaptivePreviewBound = "true";

  const sync = () => {
    const caseId = resolveCaseId();
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
  bindImageToFrame(image, frame, resolveCaseId);
  bindImageToFrame(sequence, frame, resolveCaseId);

  const syncVideo = () => {
    const caseId = resolveCaseId();
    if (!video || !video.videoWidth || !video.videoHeight) return;
    setFramePresentation(frame, video.videoWidth, video.videoHeight, { caseId });
  };
  video?.addEventListener("loadedmetadata", syncVideo);

  const syncVisibleMode = () => {
    const caseId = resolveCaseId();

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
  bindGalleryCards();
  installDetailPresentation();
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", installDevicePreview, { once: true });
} else {
  installDevicePreview();
}
