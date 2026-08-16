import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const readJson = (name) => JSON.parse(readFileSync(path.join(root, "catalog", "cases", `${name}.json`), "utf8"));
const generated = readFileSync(path.join(root, "catalog", "index.js"), "utf8");
const devicePreviewCss = readFileSync(path.join(root, "src", "components", "device-preview", "device-preview.css"), "utf8");

const expected = Object.freeze({
  fashion: Object.freeze({
    video: "./assets/cases/fashion-shopping-app/screen-only/demo.mp4",
    poster: "./assets/cases/fashion-shopping-app/screen-only/hero.png",
    previewImage: "./assets/cases/fashion-shopping-app/screen-only/hero.png",
  }),
  news: Object.freeze({
    video: "./assets/cases/news-app/screen-only/demo.mp4",
    poster: "./assets/cases/news-app/screen-only/headlines.png",
    previewImage: "./assets/cases/news-app/screen-only/headlines.png",
  }),
});

for (const [id, media] of Object.entries(expected)) {
  test(`${id} static media stays screen-only and cursor-free`, () => {
    const record = readJson(id);
    assert.equal(record.video, media.video);
    assert.equal(record.poster, media.poster);
    assert.equal(record.previewImage, media.previewImage);
    assert.match(generated, new RegExp(media.video.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
    assert.match(generated, new RegExp(media.poster.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
  });
}

test("Library never overlays a synthetic desktop mouse cursor on mobile previews", () => {
  assert.match(devicePreviewCss, /#previewCursor\s*\{[^}]*display:\s*none\s*!important/s);
});
