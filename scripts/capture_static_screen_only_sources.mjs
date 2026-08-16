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
 *
 * A few legacy captures also contained desktop mouse pointers. Those are not
 * product UI, so the cleanup operations below restore the local screen pixels
 * before the normalized assets are persisted.
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

const cleanupOps = Object.freeze({
  fashion: Object.freeze({
    hero: Object.freeze([
      { type: "interpolate", box: [510, 965, 570, 1035] },
      { type: "interpolate", box: [485, 1215, 545, 1290] },
    ]),
    catalog: Object.freeze([
      { type: "ellipse", box: [505, 955, 645, 1075], color: [230, 197, 197] },
      { type: "interpolate", box: [395, 1070, 455, 1145] },
    ]),
    favorites: Object.freeze([
      { type: "fill-sample", box: [325, 970, 610, 1095], sample: [600, 1030] },
      { type: "text", text: "Mini Tote", x: 330, y: 976, font: "700 52px Inter, Arial, sans-serif", color: [12, 12, 15] },
      { type: "text", text: "Handle", x: 330, y: 1030, font: "700 52px Inter, Arial, sans-serif", color: [12, 12, 15] },
      { type: "interpolate", box: [545, 1335, 615, 1425] },
    ]),
  }),
  news: Object.freeze({
    headlines: Object.freeze([
      { type: "interpolate", box: [555, 885, 625, 975] },
    ]),
    feed: Object.freeze([
      { type: "interpolate", box: [385, 705, 455, 795] },
    ]),
    discover: Object.freeze([
      { type: "interpolate", box: [630, 1535, 700, 1615] },
    ]),
  }),
});

fs.mkdirSync(outputRoot, { recursive: true });
const browser = await chromium.launch({ headless: true });
const page = await browser.newPage();
await page.goto(`${baseUrl}/library.html`, { waitUntil: "domcontentloaded" });

const manifest = [];
for (const [family, config] of Object.entries(families)) {
  const familyDir = path.join(outputRoot, family);
  fs.mkdirSync(familyDir, { recursive: true });

  for (const [name, source] of config.sources) {
    const cleanup = cleanupOps[family]?.[name] || [];
    const result = await page.evaluate(async ({ source, crop, cleanup }) => {
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

      const interpolateRect = ([x1, y1, x2, y2]) => {
        const image = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = image.data;
        for (let y = y1; y < y2; y += 1) {
          const leftIndex = ((y * canvas.width) + (x1 - 1)) * 4;
          const rightIndex = ((y * canvas.width) + x2) * 4;
          const left = [data[leftIndex], data[leftIndex + 1], data[leftIndex + 2]];
          const right = [data[rightIndex], data[rightIndex + 1], data[rightIndex + 2]];
          const width = x2 - x1;
          for (let x = x1; x < x2; x += 1) {
            const t = (x - x1) / width;
            const index = ((y * canvas.width) + x) * 4;
            data[index] = Math.round(left[0] * (1 - t) + right[0] * t);
            data[index + 1] = Math.round(left[1] * (1 - t) + right[1] * t);
            data[index + 2] = Math.round(left[2] * (1 - t) + right[2] * t);
            data[index + 3] = 255;
          }
        }
        ctx.putImageData(image, 0, 0);
      };

      for (const op of cleanup) {
        if (op.type === "interpolate") {
          interpolateRect(op.box);
          continue;
        }
        if (op.type === "ellipse") {
          const [x1, y1, x2, y2] = op.box;
          const [r, g, b] = op.color;
          ctx.save();
          ctx.fillStyle = `rgb(${r} ${g} ${b})`;
          ctx.beginPath();
          ctx.ellipse((x1 + x2) / 2, (y1 + y2) / 2, (x2 - x1) / 2, (y2 - y1) / 2, 0, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
          continue;
        }
        if (op.type === "fill-sample") {
          const [x1, y1, x2, y2] = op.box;
          const pixel = ctx.getImageData(op.sample[0], op.sample[1], 1, 1).data;
          ctx.save();
          ctx.fillStyle = `rgb(${pixel[0]} ${pixel[1]} ${pixel[2]})`;
          ctx.fillRect(x1, y1, x2 - x1, y2 - y1);
          ctx.restore();
          continue;
        }
        if (op.type === "text") {
          const [r, g, b] = op.color;
          ctx.save();
          ctx.font = op.font;
          ctx.textBaseline = "top";
          ctx.fillStyle = `rgb(${r} ${g} ${b})`;
          ctx.fillText(op.text, op.x, op.y);
          ctx.restore();
        }
      }

      return {
        data: canvas.toDataURL("image/png").split(",")[1],
        sourceWidth: img.naturalWidth,
        sourceHeight: img.naturalHeight,
        crop: { x: sx, y: sy, width: sw, height: sh },
        cleanupCount: cleanup.length,
      };
    }, { source, crop: config.crop, cleanup });

    const destination = path.join(familyDir, `${name}.png`);
    fs.writeFileSync(destination, Buffer.from(result.data, "base64"));
    manifest.push({ family, name, source, destination, ...result, data: undefined });
    console.log(`${family}/${name}: ${result.sourceWidth}x${result.sourceHeight} -> ${result.crop.width}x${result.crop.height} -> 780x1688; cleanup=${result.cleanupCount}`);
  }
}

await browser.close();
fs.writeFileSync(
  path.join(outputRoot, "manifest.json"),
  `${JSON.stringify(manifest, null, 2)}\n`,
);
console.log(`Captured ${manifest.length} static screen-only assets without baked desktop cursors.`);
