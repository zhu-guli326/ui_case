import { spawnSync } from "node:child_process";
import { createRequire } from "node:module";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const demoDir = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(demoDir, "../..");
const framesDir = path.join(demoDir, "screenshots", "video-2x");
const recordingsDir = path.join(demoDir, ".recordings");
const outputPath = path.join(repoRoot, "assets", "cases", "museum-app", "museum-app-demo.mp4");
const temporaryOutput = path.join(demoDir, ".artmuse-demo.tmp.mp4");
const targetUrl = process.argv[2] || pathToFileURL(path.join(demoDir, "index.html")).href;
const outputSize = { width: 780, height: 1688 };
const ffmpegCommand = process.env.FFMPEG_PATH || [
  "ffmpeg",
  "/Applications/VideoFusion-macOS.app/Contents/Resources/ffmpeg",
].find((candidate) => candidate === "ffmpeg" ? commandExists(candidate) : fs.existsSync(candidate));

if (!ffmpegCommand) throw new Error("ffmpeg is unavailable. Set FFMPEG_PATH to an executable ffmpeg binary.");

const playwright = await loadPlaywright();
if (!playwright?.chromium) throw new Error("Playwright is unavailable.");

fs.mkdirSync(framesDir, { recursive: true });
fs.mkdirSync(recordingsDir, { recursive: true });

const browser = await playwright.chromium.launch({ headless: true });
let recordedPath;
try {
  const context = await browser.newContext({
    viewport: outputSize,
    deviceScaleFactor: 1,
    recordVideo: { dir: recordingsDir, size: outputSize },
  });
  const page = await context.newPage();
  await page.goto(targetUrl, { waitUntil: "load" });
  await page.waitForFunction(() => [...document.images].every((image) => image.complete));
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.addStyleTag({ content: `
    html, body { width: 780px; min-width: 780px; height: 1688px; min-height: 1688px; overflow: hidden; }
    body { background: #fffcf6; }
    .stage { display: block; width: 390px; min-width: 390px; height: 844px; min-height: 844px; padding: 0; transform: scale(2); transform-origin: top left; }
    .decor { display: none; }
    .phone { display: none; width: 390px; min-width: 390px; max-width: 390px; height: 844px; flex: none; }
    .phone.is-active { display: block; }
    .device { width: 390px; height: 844px; aspect-ratio: auto; box-shadow: none; }
    #recording-touch { position: fixed; z-index: 999; top: 0; left: 0; width: 34px; height: 34px; border: 2px solid rgba(255,255,255,.96); border-radius: 50%; background: rgba(45,38,31,.3); box-shadow: 0 2px 9px rgba(0,0,0,.3); opacity: 0; pointer-events: none; transform: translate(-50%,-50%) scale(.86); }
    #recording-touch.is-visible { opacity: 1; transform: translate(-50%,-50%) scale(1); }
    #recording-touch.is-pressed { background: rgba(121,76,38,.7); transform: translate(-50%,-50%) scale(.72); }
  ` });
  await page.evaluate(() => {
    const touch = document.createElement("i");
    touch.id = "recording-touch";
    touch.setAttribute("aria-hidden", "true");
    document.documentElement.append(touch);
  });

  await page.waitForTimeout(900);
  await capture(page, "01-home.png");

  await touchAndClick(page, page.locator('[data-screen="home"] .visit-grid button[data-go="exhibitions"]'), 1200);
  await capture(page, "02-exhibitions.png");

  await touchAndClick(page, page.locator('[data-screen="exhibitions"] .exhibit-card:first-child button[data-go="detail"]'), 1400);
  await capture(page, "03-detail.png");

  await touchAndClick(page, page.locator('[data-screen="detail"] [data-toggle="favorite"]'), 1000);
  await page.waitForTimeout(500);

  const recording = page.video();
  await context.close();
  recordedPath = await recording.path();
} finally {
  await browser.close();
}

const ffmpeg = spawnSync(ffmpegCommand, [
  "-y",
  "-hide_banner",
  "-loglevel", "error",
  "-i", recordedPath,
  "-vf", `scale=${outputSize.width}:${outputSize.height}:flags=lanczos,fps=30,format=yuv420p`,
  "-c:v", "libx264",
  "-preset", "slow",
  "-tune", "animation",
  "-crf", "12",
  "-profile:v", "high",
  "-level:v", "4.2",
  "-movflags", "+faststart",
  "-an",
  temporaryOutput,
], { encoding: "utf8" });

fs.rmSync(recordingsDir, { recursive: true, force: true });
if (ffmpeg.status !== 0) {
  fs.rmSync(temporaryOutput, { force: true });
  throw new Error(`ffmpeg failed (status ${ffmpeg.status}, signal ${ffmpeg.signal || "none"})\n${ffmpeg.error?.message || ffmpeg.stderr || ffmpeg.stdout || "no diagnostic output"}`);
}

fs.renameSync(temporaryOutput, outputPath);
console.log(`Rendered ${outputPath}`);

async function capture(page, name) {
  await page.screenshot({ path: path.join(framesDir, name) });
}

async function touchAndClick(page, locator, holdAfter) {
  const box = await locator.boundingBox();
  if (!box) throw new Error("Unable to locate an interaction target.");
  const point = { x: box.x + box.width / 2, y: box.y + box.height / 2 };
  await page.evaluate(({ x, y }) => {
    const touch = document.querySelector("#recording-touch");
    touch.style.left = `${x}px`;
    touch.style.top = `${y}px`;
    touch.classList.add("is-visible");
  }, point);
  await page.waitForTimeout(260);
  await page.evaluate(() => document.querySelector("#recording-touch")?.classList.add("is-pressed"));
  await page.waitForTimeout(120);
  await locator.click();
  await page.waitForTimeout(140);
  await page.evaluate(() => document.querySelector("#recording-touch")?.classList.remove("is-pressed", "is-visible"));
  await page.waitForTimeout(holdAfter);
}

async function loadPlaywright() {
  try {
    const mod = await import("playwright");
    const chromium = mod.chromium || mod.default?.chromium;
    if (chromium) return { chromium };
  } catch {
    // Fall through to the bundled runtime lookup.
  }

  const require = createRequire(import.meta.url);
  const candidates = [
    process.env.PLAYWRIGHT_NODE_MODULES,
    ...String(process.env.NODE_PATH || "").split(path.delimiter),
    path.join(demoDir, "node_modules"),
    path.join(repoRoot, "node_modules"),
    path.join(os.homedir(), ".cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules"),
  ].filter(Boolean);

  for (const candidate of candidates) {
    try {
      const resolved = require.resolve("playwright", { paths: [candidate] });
      const mod = await import(pathToFileURL(resolved).href);
      const chromium = mod.chromium || mod.default?.chromium;
      if (chromium) return { chromium };
    } catch {
      // Try the next runtime path.
    }
  }

  return null;
}

function commandExists(command) {
  const result = spawnSync("/usr/bin/env", ["which", command], { stdio: "ignore" });
  return result.status === 0;
}
