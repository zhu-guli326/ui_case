export const previewContractVersion = "20260816-preview-contract-v2";
export const libraryPreviewAssetVersion = previewContractVersion;

export const standardPreviewDevice = Object.freeze({ width: 390, height: 844 });
export const standardCanonicalPreview = Object.freeze({ width: 780, height: 1688 });
export const standardPreviewDetailWidth = 300;
export const defaultPreviewDevice = standardPreviewDevice;
export const standardVideoPreviewDevice = standardPreviewDevice;
export const standardPreviewDisplayDevice = standardPreviewDevice;

export const libraryPreviewCaseIds = Object.freeze([
  "buddy",
  "carry-bag",
  "cleanbite",
  "fashion",
  "fithub",
  "fufu",
  "itinerary",
  "journal",
  "loy",
  "mimo",
  "moe",
  "moodly",
  "museum",
  "news",
  "notebook",
  "organique",
  "plate-play",
  "reflect",
  "relay-music",
  "signal-grid",
  "softly-reflections",
  "still-form",
  "volt-route",
]);

const staticCaseIds = new Set(["fashion", "museum", "news"]);
const sequencePreferredCaseIds = new Set(["museum", "organique"]);

function createPreviewProfile(id) {
  return Object.freeze({
    id,
    presentation: "device",
    frameOwner: "library",
    allowBakedDevice: false,
    sourceKind: staticCaseIds.has(id) ? "static" : "live",
    motionKind: sequencePreferredCaseIds.has(id) ? "screen-sequence" : "screen",
    screen: standardPreviewDevice,
    canonical: standardCanonicalPreview,
    detailWidth: standardPreviewDetailWidth,
    image: standardPreviewDevice,
    video: standardPreviewDevice,
    live: standardPreviewDevice,
  });
}

export const libraryPreviewProfiles = Object.freeze(Object.fromEntries(
  libraryPreviewCaseIds.map((id) => [id, createPreviewProfile(id)]),
));

export function getLibraryPreviewProfile(id) {
  return libraryPreviewProfiles[id] || null;
}

export function getLibraryPreviewDevice(id, mode = "live") {
  return libraryPreviewProfiles[id]?.[mode] || standardPreviewDevice;
}

export function getLibraryPreviewDisplayDevice() {
  return standardPreviewDisplayDevice;
}

export function isLibraryOwnedDevice(id) {
  return libraryPreviewProfiles[id]?.frameOwner === "library";
}

/**
 * Static reference boards can still appear in auxiliary galleries, so unknown
 * media falls back to ratio classification. Canonical case media is governed by
 * the explicit case contract instead of being guessed from bitmap dimensions.
 */
export function getPreviewMediaPresentation(width, height, options = {}) {
  const caseId = typeof options === "string" ? options : options.caseId;
  if (caseId && libraryPreviewProfiles[caseId]) {
    return libraryPreviewProfiles[caseId].presentation;
  }

  if (!Number.isFinite(width) || !Number.isFinite(height) || width <= 0 || height <= 0) {
    return "device";
  }

  const ratio = width / height;
  const isPortraitPhone = ratio >= 0.38 && ratio <= 0.64;
  return isPortraitPhone ? "device" : "artboard";
}
