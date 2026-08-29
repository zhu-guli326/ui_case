import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const html = readFileSync(path.join(root, "library.html"), "utf8");
const css = readFileSync(path.join(root, "src", "features", "library", "library.css"), "utf8");
const phoneShellCss = readFileSync(path.join(root, "src", "components", "device-preview", "phone-shell.css"), "utf8");
const devicePreviewCss = readFileSync(path.join(root, "src", "components", "device-preview", "device-preview.css"), "utf8");
const devicePreviewScript = readFileSync(path.join(root, "src", "components", "device-preview", "device-preview.js"), "utf8");
const screenBalanceCss = readFileSync(path.join(root, "src", "components", "device-preview", "screen-balance.css"), "utf8");
const script = readFileSync(path.join(root, "src", "features", "library", "library.js"), "utf8");

test("library cards and detail media reuse one visible 390 by 844 PhoneShell", () => {
  const cardFrame = script.match(/<figure class="phone-frame phone-frame--card phone-preview-media[\s\S]*?<\/figure>/)?.[0] || "";
  const detailFrame = html.match(/<figure class="phone-frame phone-frame--detail preview-media-frame"[\s\S]*?<\/figure>/)?.[0] || "";
  assert.ok(cardFrame, "card preview invokes PhoneShell");
  assert.ok(detailFrame, "detail preview invokes PhoneShell");
  assert.equal((cardFrame.match(/class="phone-frame(?:\s|")/g) || []).length, 1);
  assert.equal((detailFrame.match(/class="phone-frame(?:\s|")/g) || []).length, 1);
  assert.match(html, /src\/components\/device-preview\/device-preview\.css/);
  assert.match(html, /class="phone-screen"/);

  assert.match(phoneShellCss, /--phone-shell-screen-width:\s*390px/);
  assert.match(phoneShellCss, /--phone-shell-screen-height:\s*844px/);
  assert.match(phoneShellCss, /--phone-shell-screen-ratio:\s*390\s*\/\s*844/);
  assert.match(phoneShellCss, /\.phone-frame:not\(\.is-artboard-preview\)\s*\{[\s\S]*?box-shadow:/);
  assert.match(phoneShellCss, /\.phone-frame:not\(\.is-artboard-preview\)::before,[\s\S]*?::after/);
  assert.match(phoneShellCss, /\.phone-frame:not\(\.is-artboard-preview\) \.phone-screen\s*\{[\s\S]*?overflow:\s*hidden/);
  assert.doesNotMatch(phoneShellCss, /phone-notch/);

  assert.match(devicePreviewCss, /@import\s+url\("\.\/phone-shell\.css"\)/);
  assert.match(devicePreviewCss, /--library-detail-device-width:\s*300px/);
  assert.match(devicePreviewCss, /\.preview-media-frame:not\(\.is-artboard-preview\)\s*\{[\s\S]*?var\(--library-detail-device-width\)[\s\S]*?aspect-ratio:\s*390\s*\/\s*844/);
  assert.match(devicePreviewCss, /\.phone-frame:not\(\.is-artboard-preview\) \.phone-media\s*\{[\s\S]*?object-fit:\s*cover\s*!important/);
  assert.match(devicePreviewCss, /\.phone-frame\.is-artboard-preview \.phone-media\s*\{[\s\S]*?object-fit:\s*contain\s*!important/);
  assert.doesNotMatch(devicePreviewCss, /\.phone-frame:not\(\.is-artboard-preview\)\s*\{[^}]*box-shadow:/s, "DevicePreview must not reimplement PhoneShell hardware");

  assert.doesNotMatch(css, /--iphone-bezel/);
  assert.doesNotMatch(css, /--radius-phone/);
  assert.doesNotMatch(css, /--radius-screen/);
  assert.doesNotMatch(css, /--screen-ratio/);
  assert.doesNotMatch(css, /\.phone-frame::before|\.phone-frame::after/);
  assert.doesNotMatch(css, /\.phone-frame\s*\{[^}]*box-shadow:/s);
  assert.doesNotMatch(css, /\.phone-frame\s*\{[^}]*border-radius:/s);
  assert.match(css, /\.demo-card-preview > \.phone-frame\s*\{[^}]*z-index:\s*1/);
  assert.match(css, /\.phone-frame--card\s*\{[^}]*height:\s*min\(var\(--card-device-height\)/);
  assert.match(css, /--modal-device-width:\s*300px/);
  assert.match(css, /--card-preview-ratio:\s*4\s*\/\s*5/);
  assert.match(css, /\.phone-media\s*\{[^}]*object-fit:\s*cover/);
  assert.match(css, /\.preview-media-stage\s*\{[^}]*min-height:\s*0[^}]*overflow:\s*hidden/);
  assert.match(css, /\.preview-dialog\s*\{[^}]*max-width:\s*calc\(100vw - 32px\)[^}]*max-height:\s*calc\(100dvh - 32px\)/);
});

test("legacy baked-device media is normalized to screen-only sources", () => {
  assert.match(devicePreviewScript, /fashion:\s*"\.\/assets\/cases\/fashion-shopping-app\/screen-only\/hero\.png"/);
  assert.match(devicePreviewScript, /museum:\s*"\.\/assets\/cases\/museum-app\/video-frames\/01-home\.png"/);
  assert.match(devicePreviewScript, /news:\s*"\.\/assets\/cases\/news-app\/screen-only\/headlines\.png"/);
  assert.match(devicePreviewScript, /"signal-grid"[\s\S]*?library-preview-2x\.png/);
  assert.match(devicePreviewScript, /"still-form"[\s\S]*?library-preview-2x\.png/);
  assert.match(devicePreviewScript, /screen-only\/demo\.mp4/);
  assert.doesNotMatch(devicePreviewCss, /transform:\s*scale\(1\.(?:205|165|62|105|045)\)/);
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

test("Organique media never advertises missing flow frames", () => {
  const organique = JSON.parse(readFileSync(path.join(root, "catalog", "cases", "organique.json"), "utf8"));
  assert.equal(organique.videoSequence, undefined);
  assert.ok(existsSync(path.join(root, organique.video.replace(/^\.\//, ""))), "missing Organique video");
  assert.ok(existsSync(path.join(root, "demo/organique-food/screenshots/library-preview-2x.png")), "missing Organique screen capture");
  assert.match(script, /const videoSequence = isVideo \? getVideoSequence\(guide\) : null/);
  assert.match(script, /if \(videoSequence\)[\s\S]*?activeVideoSequence = videoSequence[\s\S]*?playPreviewSequence\(\)/);
});

test("shared embed balancing never overrides a hidden app view", () => {
  assert.match(screenBalanceCss, /\.view\.playlist:not\(\[hidden\]\)/);
  assert.match(screenBalanceCss, /\.view\.explore:not\(\[hidden\]\)/);
  assert.match(screenBalanceCss, /\.view\.trips:not\(\[hidden\]\)/);
  assert.match(screenBalanceCss, /\.view\.profile:not\(\[hidden\]\)/);
  assert.doesNotMatch(screenBalanceCss, /\.view\.(?:playlist|explore|trips|profile)\s*\{\s*display:\s*flex/);
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
