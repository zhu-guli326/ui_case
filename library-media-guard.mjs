import { getPreviewMediaPresentation } from "./library-preview-config.mjs";

const frame = document.querySelector("#previewMediaFrame");
const phoneScreen = document.querySelector("#previewPhoneScreen");
const image = document.querySelector("#previewDialogImage");
const sequence = document.querySelector("#previewDialogSequence");
const video = document.querySelector("#previewDialogVideo");
const demo = document.querySelector("#previewDialogDemo");

const STANDARD_RATIO = 390 / 844;
const PHONE_RATIO_TOLERANCE = 0.04;

function resetDevicePresentation() {
  if (!frame) return;
  frame.classList.remove("is-artboard-preview");
  frame.dataset.previewFit = "cover";
  frame.dataset.previewPresentation = "device";
  frame.style.removeProperty("--adaptive-media-ratio");
  frame.style.removeProperty("--preview-media-ratio");
}

function applyMediaPresentation(width, height) {
  if (!frame || !Number.isFinite(width) || !Number.isFinite(height) || width <= 0 || height <= 0) {
    resetDevicePresentation();
    return;
  }

  const ratio = width / height;
  const presentation = getPreviewMediaPresentation(width, height);
  const isArtboard = presentation === "artboard";
  const ratioDelta = Math.abs(ratio - STANDARD_RATIO) / STANDARD_RATIO;
  const fit = isArtboard || ratioDelta > PHONE_RATIO_TOLERANCE ? "contain" : "cover";

  frame.classList.toggle("is-artboard-preview", isArtboard);
  frame.dataset.previewFit = fit;
  frame.dataset.previewPresentation = presentation;
  frame.style.setProperty("--adaptive-media-ratio", `${width} / ${height}`);
  frame.style.setProperty("--preview-media-ratio", String(ratio));
}

function syncPreviewPresentation() {
  if (!frame) return;

  // Interactive demos are authored against the canonical 390 x 844 viewport.
  if (demo && !demo.hidden) {
    resetDevicePresentation();
    return;
  }

  if (sequence && !sequence.hidden) {
    if (sequence.complete && sequence.naturalWidth && sequence.naturalHeight) {
      applyMediaPresentation(sequence.naturalWidth, sequence.naturalHeight);
    } else {
      resetDevicePresentation();
      frame.dataset.previewFit = "contain";
    }
    return;
  }

  if (video && !video.hidden) {
    if (video.videoWidth && video.videoHeight) {
      applyMediaPresentation(video.videoWidth, video.videoHeight);
    } else {
      resetDevicePresentation();
      frame.dataset.previewFit = "contain";
    }
    return;
  }

  if (image && !image.hidden) {
    if (image.complete && image.naturalWidth && image.naturalHeight) {
      applyMediaPresentation(image.naturalWidth, image.naturalHeight);
    } else {
      resetDevicePresentation();
      frame.dataset.previewFit = "contain";
    }
    return;
  }

  resetDevicePresentation();
}

let syncFrame = 0;
function scheduleSync() {
  cancelAnimationFrame(syncFrame);
  syncFrame = requestAnimationFrame(syncPreviewPresentation);
}

[image, sequence].filter(Boolean).forEach((media) => {
  media.addEventListener("load", scheduleSync);
  media.addEventListener("error", scheduleSync);
});

if (video) {
  video.addEventListener("loadedmetadata", scheduleSync);
  video.addEventListener("emptied", scheduleSync);
  video.addEventListener("error", scheduleSync);
}

if (phoneScreen) {
  new MutationObserver(scheduleSync).observe(phoneScreen, {
    subtree: true,
    attributes: true,
    attributeFilter: ["hidden", "src"],
  });
}

document.querySelector("#previewDialog")?.addEventListener("close", resetDevicePresentation);
window.addEventListener("resize", scheduleSync, { passive: true });
scheduleSync();
