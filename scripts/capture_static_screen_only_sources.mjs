import fs from "node:fs";
import path from "node:path";
import { chromium } from "playwright";

const baseUrl = process.env.IMAGE2_UI_BASE_URL || "http://127.0.0.1:4174";
const outputRoot = path.resolve("artifacts/visual-qa/generated-static");

/*
 * These six legacy static references were authored as phone mockups rather
 * than raw screens. Crop once from the original source pixels in Chromium and
 * persist a real 780 x 1688 screen-only asset. The boxes intentionally sit a
 * few pixels inside the historical inner bezel so no baked corner/edge line
 * survives when the shared PhoneShell wraps the result.
 */
const families = {
  fashion: {
    crop: { x: 29 / 301, y: 50 / 650, width: 240 / 301, height: 518 / 650 },
    sources: [
      ["hero", "/assets/cases/fashion-shopping-app/hero-screen.png"],
      ["catalog", "/assets/cases/fashion-shopping-app/catalog-screen.png"],
      ["favorites", "/assets/cases/fashion-shopping-app/favorites-screen.png"],
    ],
  },
  news: {
    crop: { x: 32 / 301, y: 59 / 650, width: 245 / 301, height: 529 / 650 },
    sources: [
      ["headlines", "/assets/cases/news-app/headlines-screen.png"],
      ["feed", "/assets/cases/news-app/feed-screen.png"],
      ["discover", "/assets/cases/news-app/discover-screen.png"],
    ],
  },
};

fs.mkdirSync(outputRoot, { recursive: true });
const browser = await chromium.launch({ headless: true });
const page = await browser.newPage();
await page.goto(`${baseUrl}/library.html`, { waitUntil: "domcontentloaded" });

const manifest = [];
for (const [family, config] of Object.entries(families)) {
  const familyDir = path.join(outputRoot, family);
  fs.mkdirSync(familyDir, { recursive: true });

  for (const [name, source] of config.sources) {
    const result = await page.evaluate(async ({ source, crop }) => {
      const img = new Image();
      img.src = source;
      await img.decode();

      const sx = Math.round(img.naturalWidth * crop.x);
      const sy = Math.round(img.naturalHeight * crop.y);
      const sw = Math.round(img.naturalWidth * crop.width);
      const sh = Math.round(img.naturalHeight * crop.height);

      const canvas = document.createElement("canvas");
      canvas.width = 780;
      canvas.height = 1688;
      const ctx = canvas.getContext("2d", { alpha: false });
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = "high";
      ctx.drawImage(img, sx, sy, sw, sh, 0, 0, canvas.width, canvas.height);

      return {
        data: canvas.toDataURL("image/png").split(",")[1],
        sourceWidth: img.naturalWidth,
        sourceHeight: img.naturalHeight,
        crop: { x: sx, y: sy, width: sw, height: sh },
      };
    }, { source, crop: config.crop });

    const destination = path.join(familyDir, `${name}.png`);
    fs.writeFileSync(destination, Buffer.from(result.data, "base64"));
    manifest.push({ family, name, source, destination, ...result, data: undefined });
    console.log(`${family}/${name}: ${result.sourceWidth}x${result.sourceHeight} -> ${result.crop.width}x${result.crop.height} -> 780x1688`);
  }
}

await browser.close();
fs.writeFileSync(
  path.join(outputRoot, "manifest.json"),
  `${JSON.stringify(manifest, null, 2)}\n`,
);
console.log(`Captured ${manifest.length} static screen-only assets.`);
