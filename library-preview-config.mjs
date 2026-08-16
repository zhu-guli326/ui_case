export const libraryPreviewAssetVersion = "20260816-adaptive-preview-v1";

export const standardPreviewDevice = Object.freeze({ width: 390, height: 844 });
export const defaultPreviewDevice = standardPreviewDevice;
export const standardVideoPreviewDevice = standardPreviewDevice;
export const standardPreviewDisplayDevice = standardPreviewDevice;

const libraryPreviewCaseIds = [
  "museum",
  "fashion",
  "fufu",
  "organique",
  "cleanbite",
  "plate-play",
  "carry-bag",
  "fithub",
  "still-form",
  "news",
  "itinerary",
  "journal",
  "buddy",
  "notebook",
  "signal-grid",
  "volt-route",
  "moodly",
  "reflect",
  "moe",
  "loy",
  "mimo",
  "relay-music",
  "softly-reflections",
];

export const libraryPreviewProfiles = Object.freeze(Object.fromEntries(
  libraryPreviewCaseIds.map((id) => [id, Object.freeze({
    image: standardPreviewDevice,
    video: standardPreviewDevice,
    live: standardPreviewDevice,
  })]),
));

export function getLibraryPreviewDevice(id, mode = "live") {
  return libraryPreviewProfiles[id]?.[mode] || standardPreviewDevice;
}

export function getLibraryPreviewDisplayDevice() {
  return standardPreviewDisplayDevice;
}

/**
 * Classify static preview media by the source bitmap/video ratio rather than
 * assuming that every asset is a 390 x 844 phone screen.
 *
 * 9:16 exports, modern iPhone screenshots and the existing 390 x 844 capture
 * all stay inside the device chrome. Boards, desktop captures, multi-device
 * compositions and square/landscape references are shown as neutral artboards.
 */
export function getPreviewMediaPresentation(width, height) {
  if (!Number.isFinite(width) || !Number.isFinite(height) || width <= 0 || height <= 0) {
    return "device";
  }

  const ratio = width / height;
  const isPortraitPhone = ratio >= 0.38 && ratio <= 0.64;
  return isPortraitPhone ? "device" : "artboard";
}
