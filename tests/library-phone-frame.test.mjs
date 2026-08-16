import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const html = readFileSync(path.join(root, "library.html"), "utf8");
const css = readFileSync(path.join(root, "library.css"), "utf8");
const technicalCss = readFileSync(path.join(root, "library-technical-fixes.css"), "utf8");
const script = readFileSync(path.join(root, "library.js"), "utf8");

test("library cards and detail media share one visible 390 by 844 iPhone bezel", () => {
  const cardFrame = script.match(/<figure class="phone-frame phone-frame--card phone-preview-media[\s\S]*?<\/figure>/)?.[0] || "";
  const detailFrame = html.match(/<figure class="phone-frame phone-frame--detail preview-media-frame"[\s\S]*?<\/figure>/)?.[0] || "";
  assert.ok(cardFrame, "card preview has an iPhone frame");
  assert.ok(detailFrame, "detail preview has an iPhone frame");
  assert.equal((cardFrame.match(/class="phone-frame(?:\s|")/g) || []).length, 1);
  assert.equal((detailFrame.match(/class="phone-frame(?:\s|")/g) || []).length, 1);
  assert.match(html, /class="phone-screen"/);
  assert.match(css, /--screen-ratio:\s*390\s*\/\s*844/);
  assert.match(css, /--modal-device-width:\s*300px/);
  assert.match(css, /--iphone-bezel-shadow:\s*0 0 0 2px/);
  assert.match(css, /\.phone-frame\s*\{[^}]*box-shadow:\s*var\(--iphone-bezel-shadow\)/);
  assert.match(css, /\.phone-frame--card\s*\{[^}]*box-shadow:\s*var\(--iphone-bezel-shadow\)/);
  assert.match(css, /\.preview-media-frame\s*\{[^}]*box-shadow:\s*var\(--iphone-bezel-shadow\)/);
  assert.match(css, /\.phone-frame::before,\s*\.phone-frame::after/);
  assert.doesNotMatch(`${html}\n${script}\n${css}`, /phone-notch/);
  assert.match(css, /--card-preview-ratio:\s*4\s*\/\s*5/);
  assert.match(css, /\.phone-screen\s*\{[^}]*overflow:\s*hidden/);
  assert.match(css, /\.phone-screen\s*\{[^}]*isolation:\s*isolate/);
  assert.match(css, /\.phone-media\s*\{[^}]*object-fit:\s*cover/);
  assert.match(css, /\.preview-media-stage\s*\{[^}]*min-height:\s*0[^}]*overflow:\s*hidden/);
  assert.match(css, /\.preview-media-frame\s*\{[^}]*width:\s*min\(var\(--modal-device-width\),\s*32dvh,\s*calc\(100% - 48px\)\)[^}]*height:\s*auto[^}]*max-height:\s*100%/);
  assert.match(technicalCss, /\.preview-media-frame:not\(\.is-artboard-preview\)\s*\{[\s\S]*?var\(--modal-device-width, 300px\)[\s\S]*?aspect-ratio:\s*390\s*\/\s*844/);
  assert.match(css, /\.preview-dialog\s*\{[^}]*max-width:\s*calc\(100vw - 32px\)[^}]*max-height:\s*calc\(100dvh - 32px\)/);
});

test("video previews use poster media and custom controls", () => {
  const videoMarkup = html.match(/<video[\s\S]*?id="previewDialogVideo"[\s\S]*?>/i)?.[0] || "";
  assert.ok(videoMarkup, "detail video is present");
  assert.doesNotMatch(videoMarkup, /\bcontrols\b/);
  assert.match(videoMarkup, /autoplay/);
  assert.match(videoMarkup, /muted/);
  assert.match(videoMarkup, /loop/);
  assert.match(videoMarkup, /playsinline/);
  assert.match(html, /id="previewVideoToggle"/);
  assert.match(html, /id="previewVideoProgress"/);
  assert.match(html, /id="previewExpand"/);
  assert.match(script, /previewDialogVideo\.addEventListener\("timeupdate"/);
  assert.match(script, /previewVideoProgress\.addEventListener\("input"/);
  assert.match(script, /previewMediaStage\.requestFullscreen/);
  assert.doesNotMatch(script, /previewDialog\.requestFullscreen/);
  assert.doesNotMatch(css, /image-sequence\s+img\s*\+\s*img/);
});

test("ArtMuse video mode uses current artwork frames instead of the stale recording", () => {
  const museum = JSON.parse(readFileSync(path.join(root, "catalog", "cases", "museum.json"), "utf8"));
  assert.equal(museum.videoSequence.duration, 8);
  assert.equal(museum.videoSequence.frames.length, 3);
  for (const frame of museum.videoSequence.frames) {
    assert.ok(existsSync(path.join(root, frame.src.replace(/^\.\//, ""))), `missing ArtMuse frame: ${frame.src}`);
  }
  assert.match(html, /id="previewDialogSequence"/);
  assert.match(script, /activeVideoSequence/);
  assert.match(script, /playPreviewSequence/);
  assert.match(script, /seekPreviewSequence/);
});

test("Organique video mode uses canonical screen frames instead of the mismatched recording canvas", () => {
  const organique = JSON.parse(readFileSync(path.join(root, "catalog", "cases", "organique.json"), "utf8"));
  assert.equal(organique.videoSequence.duration, 6);
  assert.deepEqual(
    organique.videoSequence.frames.map((frame) => frame.src),
    [
      "./demo/organique-food/screenshots/01-choose.png",
      "./demo/organique-food/screenshots/02-plan.png",
      "./demo/organique-food/screenshots/03-confirmation.png",
    ],
  );
  for (const frame of organique.videoSequence.frames) {
    assert.ok(existsSync(path.join(root, frame.src.replace(/^\.\//, ""))), `missing Organique frame: ${frame.src}`);
  }
  assert.match(script, /const videoSequence = isVideo \? getVideoSequence\(guide\) : null/);
  assert.match(script, /if \(videoSequence\)[\s\S]*?activeVideoSequence = videoSequence[\s\S]*?playPreviewSequence\(\)/);
});

test("generated device mockups are not nested inside gallery devices", () => {
  assert.match(script, /museum:\s*"\.\/assets\/cases\/museum-app\/video-frames\/01-home\.png"/);
  assert.match(script, /fashion:\s*"\.\/assets\/cases\/fashion-shopping-app\/card-screen\.png"/);
  assert.match(script, /news:\s*"\.\/assets\/cases\/news-app\/card-screen\.png"/);
  assert.match(script, /fittedCardPreviewIds = new Set\(\["museum", "fashion", "news"\]\)/);
  assert.match(css, /\.phone-frame--card\.has-fitted-device-art\s*\{[^}]*--card-media-scale:\s*1\.02/);
  assert.doesNotMatch(script, /cardPreviewImages[\s\S]*library-preview-generated-v2-standard/);
});

test("fullscreen fallback keeps the same dialog and cleans up on close", () => {
  assert.match(script, /previewDialog\.classList\.toggle\("is-lightbox"/);
  assert.match(script, /previewDialog\.addEventListener\("close"/);
  assert.match(script, /previewDialogVideo\.removeAttribute\("src"\)[\s\S]*?previewDialogVideo\.load\(\)/);
  assert.match(css, /\.preview-dialog\.is-lightbox[^{]*\{[^}]*width:\s*100vw/);
  assert.match(css, /\.preview-dialog\.is-lightbox[^{]*\{[^}]*height:\s*100dvh/);
  assert.match(css, /body:has\(dialog\[open\]\) \.floating-helper/);
  assert.match(css, /@media \(max-width:\s*900px\)/);
});