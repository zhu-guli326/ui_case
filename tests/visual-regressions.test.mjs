import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";
import { getLibraryPreviewProfile } from "../library-preview-config.mjs";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const read = (file) => readFileSync(path.join(root, file), "utf8");

function primaryPhoneRule(css) {
  return css.match(/\.phone\s*\{([^}]*)\}/s)?.[1] || "";
}

test("FuFu loads its balanced welcome composition", () => {
  const html = read("demo/fufu-bakery/index.html");
  const polish = read("demo/fufu-bakery/visual-polish.css");
  assert.match(html, /visual-polish\.css/);
  assert.match(polish, /justify-content:\s*center/);
  assert.match(polish, /height:\s*336px/);
  assert.doesNotMatch(polish, /margin-top:\s*auto/);
});

test("FitHub derives Demo video from canonical screen frames", () => {
  const profile = getLibraryPreviewProfile("fithub");
  const library = read("library.js");
  assert.equal(profile?.motionKind, "screen-sequence");
  assert.match(library, /screenFrames = previewImageSets\[guide\?\.id\]/);
  assert.match(library, /secondsPerFrame = 2/);
});

test("Mimo bottom navigation is inset from the rounded screen edge", () => {
  const html = read("demo/mimo-activities/index.html");
  const polish = read("demo/mimo-activities/visual-polish.css");
  assert.match(html, /visual-polish\.css/);
  assert.match(polish, /right:\s*12px/);
  assert.match(polish, /left:\s*12px/);
  assert.match(polish, /border-radius:\s*23px/);
});

test("these case-local phone aliases no longer own device hardware", () => {
  for (const file of [
    "demo/fufu-bakery/styles.css",
    "demo/fithub/styles.css",
    "demo/mimo-activities/styles.css",
  ]) {
    const rule = primaryPhoneRule(read(file));
    assert.doesNotMatch(rule, /(?:padding|border|border-radius|background|box-shadow)\s*:/, `${file} must leave device chrome to PhoneShell`);
  }
});
