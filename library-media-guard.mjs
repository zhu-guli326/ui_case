/* Library media contract bootstrap.
 *
 * The shared DevicePreview component already owns the hard parts of the Library
 * media contract: canonical 390 x 844 geometry, per-case screen-only source
 * normalization, embedded-demo scale correction, and artboard classification.
 * Library previously loaded only its CSS, so that behavior never ran. Keep this
 * tiny compatibility entrypoint because library.html already loads it last.
 */
import "./src/components/device-preview/device-preview.js";

const image = document.querySelector("#previewDialogImage");
const sequence = document.querySelector("#previewDialogSequence");

// Reserve the canonical phone box before an image is decoded. The parent frame
// already has aspect-ratio, but explicit intrinsic dimensions make the media
// contract self-contained and avoid layout instability if the markup is reused.
for (const media of [image, sequence]) {
  if (!media) continue;
  media.width = 390;
  media.height = 844;
  media.decoding = "async";
}
