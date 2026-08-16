#!/usr/bin/env node

import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { createRequire } from "node:module";
import { fileURLToPath, pathToFileURL } from "node:url";

const repoRoot = path.resolve(fileURLToPath(new URL("..", import.meta.url)));
const baseUrl = process.env.UI_CASE_URL || "http://127.0.0.1:4174/";
const viewport = Object.freeze({ width: 390, height: 844 });
const outputDir = path.join(repoRoot, "artifacts", "visual-qa");
const liveScreenshotDir = path.join(outputDir, "live");
const cardScreenshotDir = path.join(outputDir, "cards");
fs.mkdirSync(liveScreenshotDir, { recursive: true });
fs.mkdirSync(cardScreenshotDir, { recursive: true });

const cardPreviewOverrides = Object.freeze({
  museum: "assets/cases/museum-app/video-frames/01-home.png",
  fashion: "assets/cases/fashion-shopping-app/card-screen.png",
  news: "assets/cases/news-app/card-screen.png",
});

async function loadPlaywright() {
  try {
    const mod = await import("playwright");
    return { chromium: mod.chromium || mod.default?.chromium, source: "project" };
  } catch {}

  const require = createRequire(import.meta.url);
  const candidates = [
    process.env.PLAYWRIGHT_NODE_MODULES,
    path.join(repoRoot, "node_modules"),
    path.join(process.cwd(), "node_modules"),
    path.join(os.homedir(), ".cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules"),
  ].filter(Boolean);

  for (const candidate of candidates) {
    try {
      const resolved = require.resolve("playwright", { paths: [candidate] });
      const mod = await import(pathToFileURL(resolved).href);
      return { chromium: mod.chromium || mod.default?.chromium, source: resolved };
    } catch {}
  }
  return null;
}

function loadCases() {
  const caseDir = path.join(repoRoot, "catalog", "cases");
  return fs.readdirSync(caseDir)
    .filter((name) => name.endsWith(".json"))
    .sort()
    .map((name) => JSON.parse(fs.readFileSync(path.join(caseDir, name), "utf8")));
}

function resolveCardPreview(record) {
  if (cardPreviewOverrides[record.id]) return cardPreviewOverrides[record.id];
  if (record.liveDemo) {
    return record.liveDemo.replace(/^\.\//, "").replace(/index\.html$/, "screenshots/library-preview-2x.png");
  }
  return (record.previewImage || record.poster || record.referenceImage || "").replace(/^\.\//, "");
}

function localPath(relativePath) {
  return path.resolve(repoRoot, String(relativePath || "").replace(/^\.\//, ""));
}

function absoluteUrl(relativePath) {
  return new URL(String(relativePath || "").replace(/^\.\//, ""), baseUrl).href;
}

function probeVideo(relativePath) {
  const file = localPath(relativePath);
  if (!fs.existsSync(file)) return { ok: false, reason: "missing-file", file };

  const probe = spawnSync("ffprobe", [
    "-v", "error",
    "-select_streams", "v:0",
    "-show_entries", "stream=width,height:format=duration",
    "-of", "json",
    file,
  ], { encoding: "utf8" });

  if (probe.error?.code === "ENOENT") return { ok: false, infrastructure: true, reason: "ffprobe-unavailable", file };
  if (probe.status !== 0) return { ok: false, reason: "ffprobe-failed", stderr: probe.stderr?.trim() || "", file };

  try {
    const data = JSON.parse(probe.stdout || "{}");
    const stream = data.streams?.[0];
    const width = Number(stream?.width);
    const height = Number(stream?.height);
    const duration = Number(data.format?.duration);
    if (!(width > 0) || !(height > 0)) return { ok: false, reason: "missing-video-dimensions", file };
    return { ok: true, width, height, duration: Number.isFinite(duration) ? duration : null, file };
  } catch (error) {
    return { ok: false, reason: "invalid-ffprobe-json", detail: String(error?.message || error), file };
  }
}

async function waitForStablePaint(page) {
  await page.evaluate(async () => {
    await Promise.all([...document.images].map(async (image) => {
      if (!image.complete) await new Promise((resolve) => image.addEventListener("load", resolve, { once: true }));
      if (image.decode) await image.decode().catch(() => {});
    }));
    await new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)));
  });
  await page.waitForTimeout(220);
}

async function getImageMeta(page, src) {
  return page.evaluate(async (url) => {
    const image = new Image();
    image.src = url;
    try {
      await image.decode();
      return { ok: true, width: image.naturalWidth, height: image.naturalHeight };
    } catch {
      return { ok: false, width: 0, height: 0 };
    }
  }, src);
}

async function compareCardToLive(page, cardSrc, liveScreenshot) {
  const screenshotSrc = `data:image/png;base64,${liveScreenshot.toString("base64")}`;
  return page.evaluate(async ({ cardSrc: cardUrl, screenshotSrc: liveUrl }) => {
    async function load(src) {
      const image = new Image();
      image.src = src;
      await image.decode();
      return image;
    }
    const [card, live] = await Promise.all([load(cardUrl), load(liveUrl)]);
    const width = 48;
    const height = 104;
    const canvas = document.createElement("canvas");
    canvas.width = width * 2;
    canvas.height = height;
    const context = canvas.getContext("2d", { willReadFrequently: true });
    context.drawImage(card, 0, 0, width, height);
    context.drawImage(live, width, 0, width, height);
    const left = context.getImageData(0, 0, width, height).data;
    const right = context.getImageData(width, 0, width, height).data;
    let rgb = 0;
    let luminance = 0;
    const pixels = width * height;
    for (let offset = 0; offset < left.length; offset += 4) {
      const lr = left[offset];
      const lg = left[offset + 1];
      const lb = left[offset + 2];
      const rr = right[offset];
      const rg = right[offset + 1];
      const rb = right[offset + 2];
      rgb += Math.abs(lr - rr) + Math.abs(lg - rg) + Math.abs(lb - rb);
      const ll = (lr * 0.2126) + (lg * 0.7152) + (lb * 0.0722);
      const rl = (rr * 0.2126) + (rg * 0.7152) + (rb * 0.0722);
      luminance += Math.abs(ll - rl);
    }
    return {
      rgbDelta: rgb / (pixels * 3 * 255),
      luminanceDelta: luminance / (pixels * 255),
    };
  }, { cardSrc, screenshotSrc });
}

async function inspectDemoGeometry(page) {
  return page.evaluate(({ width, height }) => {
    const tolerance = 3;
    const visible = (element) => {
      if (!(element instanceof Element)) return false;
      const style = getComputedStyle(element);
      const rect = element.getBoundingClientRect();
      return style.display !== "none" && style.visibility !== "hidden" && Number(style.opacity || 1) > 0 && rect.width > 0 && rect.height > 0;
    };
    const rectData = (element) => {
      const rect = element.getBoundingClientRect();
      return { left: rect.left, top: rect.top, right: rect.right, bottom: rect.bottom, width: rect.width, height: rect.height };
    };
    const styleData = (element) => {
      const style = getComputedStyle(element);
      return { position: style.position, overflowX: style.overflowX, overflowY: style.overflowY };
    };

    const documentScroller = document.scrollingElement || document.documentElement;
    const documentMetrics = {
      clientWidth: documentScroller.clientWidth,
      clientHeight: documentScroller.clientHeight,
      scrollWidth: documentScroller.scrollWidth,
      scrollHeight: documentScroller.scrollHeight,
      outerScrollPx: Math.max(0, documentScroller.scrollHeight - documentScroller.clientHeight),
      horizontalOverflowPx: Math.max(0, documentScroller.scrollWidth - documentScroller.clientWidth),
    };

    const shellCandidates = [...document.querySelectorAll("main, .app, .stage, .shell, .screen, .phone, .iphone-frame, [class*='app-shell'], [class*='phone-shell']")]
      .filter(visible)
      .map((element) => ({ element, rect: element.getBoundingClientRect() }))
      .filter(({ rect }) => rect.width >= width * 0.8 && rect.height >= height * 0.72)
      .sort((a, b) => (b.rect.width * b.rect.height) - (a.rect.width * a.rect.height));
    const shell = shellCandidates[0];
    const shellRect = shell ? rectData(shell.element) : null;
    const shellOffset = shellRect ? {
      left: Math.abs(shellRect.left),
      top: Math.abs(shellRect.top),
      rightGap: Math.abs(width - shellRect.right),
      bottomGap: Math.abs(height - shellRect.bottom),
    } : null;

    const frameSelector = ".iphone-frame, .phone-frame, [class*='iphone-frame'], [class*='phone-frame'], [class*='device-frame']";
    const phoneFrames = [...new Set([...document.querySelectorAll(frameSelector)])]
      .filter(visible)
      .map((element) => ({ className: String(element.className || ""), rect: rectData(element) }));

    const scrollRegions = [...document.querySelectorAll("body *")]
      .filter(visible)
      .filter((element) => /(auto|scroll)/.test(getComputedStyle(element).overflowY) && element.scrollHeight > element.clientHeight + 8)
      .map((element) => ({
        tag: element.tagName.toLowerCase(),
        className: String(element.className || ""),
        clientHeight: element.clientHeight,
        scrollHeight: element.scrollHeight,
        ratio: element.scrollHeight / Math.max(1, element.clientHeight),
        rect: rectData(element),
      }))
      .sort((a, b) => b.ratio - a.ratio)
      .slice(0, 8);

    const navSelector = "nav, [role='navigation'], .bottom-nav, [class*='bottom-nav'], [class*='bottom_bar'], [class*='bottom-bar'], [class*='tab-bar'], [class*='tabbar']";
    const bottomNavigation = [...new Set([...document.querySelectorAll(navSelector)])]
      .filter(visible)
      .map((element) => ({ className: String(element.className || ""), rect: rectData(element), style: styleData(element) }))
      .filter(({ rect }) => rect.top >= height * 0.5)
      .sort((a, b) => b.rect.bottom - a.rect.bottom)[0] || null;

    const bottomNavigationClipped = Boolean(bottomNavigation && (
      bottomNavigation.rect.left < -tolerance ||
      bottomNavigation.rect.right > width + tolerance ||
      bottomNavigation.rect.bottom > height + tolerance ||
      bottomNavigation.rect.top < 0
    ));

    const interactiveSelector = "a[href], button, input, select, textarea, [role='button'], [onclick], [tabindex]:not([tabindex='-1'])";
    const interactive = [...document.querySelectorAll(interactiveSelector)]
      .filter(visible)
      .map((element) => {
        const rect = rectData(element);
        return {
          tag: element.tagName.toLowerCase(),
          text: (element.getAttribute("aria-label") || element.textContent || "").trim().replace(/\s+/g, " ").slice(0, 80),
          className: String(element.className || ""),
          rect,
          style: styleData(element),
          centerX: rect.left + (rect.width / 2),
        };
      });

    const interactiveOverflow = interactive.filter(({ rect, style, centerX }) => {
      const intersectsVertically = rect.bottom > 0 && rect.top < height;
      if (!intersectsVertically) return false;
      const centerBelongsToViewport = centerX > tolerance && centerX < width - tolerance;
      const horizontal = centerBelongsToViewport && (rect.left < -tolerance || rect.right > width + tolerance);
      const fixedVertical = ["fixed", "sticky"].includes(style.position) && (rect.top < -tolerance || rect.bottom > height + tolerance);
      return horizontal || fixedVertical;
    });

    const offscreenInteractive = interactive.filter(({ rect, centerX }) => {
      const partlyVisible = rect.right > 0 && rect.left < width && rect.bottom > 0 && rect.top < height;
      const centerOutside = centerX <= tolerance || centerX >= width - tolerance;
      return partlyVisible && centerOutside && (rect.left < -tolerance || rect.right > width + tolerance);
    });

    const fixedOverflow = [...document.querySelectorAll("body *")]
      .filter(visible)
      .map((element) => ({ element, style: getComputedStyle(element), rect: element.getBoundingClientRect() }))
      .filter(({ style }) => style.position === "fixed" || style.position === "sticky")
      .filter(({ rect }) => rect.left < -tolerance || rect.right > width + tolerance || rect.top < -tolerance || rect.bottom > height + tolerance)
      .map(({ element, style, rect }) => ({
        className: String(element.className || ""),
        position: style.position,
        rect: { left: rect.left, top: rect.top, right: rect.right, bottom: rect.bottom },
      }));

    let contentBottomGap = null;
    const activeView = [...document.querySelectorAll("[data-view], .view")].find((element) => visible(element) && !element.hidden) || document.querySelector(".screen");
    if (activeView && bottomNavigation) {
      const exclusions = ".tabbar, nav, .statusbar, .home-indicator, .feedback, .island";
      const contentChildren = [...activeView.children]
        .filter(visible)
        .filter((element) => !element.matches(exclusions))
        .map((element) => rectData(element))
        .filter((rect) => rect.top < bottomNavigation.rect.top && rect.height < height * 0.65);
      const bottom = contentChildren.length ? Math.max(...contentChildren.map((rect) => Math.min(rect.bottom, bottomNavigation.rect.top))) : null;
      if (bottom !== null) contentBottomGap = Math.max(0, bottomNavigation.rect.top - bottom);
    }

    return {
      document: documentMetrics,
      shellRect,
      shellOffset,
      phoneFrames,
      scrollRegions,
      bottomNavigation,
      bottomNavigationClipped,
      interactiveOverflow: interactiveOverflow.slice(0, 20),
      offscreenInteractive: offscreenInteractive.slice(0, 20),
      fixedOverflow: fixedOverflow.slice(0, 20),
      contentBottomGap,
    };
  }, viewport);
}

function classifyCase(result) {
  const issues = [];
  const review = [];

  if (!result.card.ok) issues.push("card-preview-missing");
  if (result.card.ok && Math.abs((result.card.width / result.card.height) - (viewport.width / viewport.height)) > 0.015) issues.push("card-preview-ratio");

  if (result.video && !result.video.ok) {
    if (result.video.infrastructure) review.push("video-probe-unavailable");
    else issues.push("video-metadata");
  }
  if (result.video?.ok && result.card.ok) {
    const videoRatio = result.video.width / result.video.height;
    const cardRatio = result.card.width / result.card.height;
    if (Math.abs(videoRatio - cardRatio) > 0.02) issues.push("video-card-ratio");
  }

  if (result.live) {
    const geometry = result.live.geometry;
    if (geometry.document.horizontalOverflowPx > 3) issues.push("horizontal-overflow");
    if (geometry.document.outerScrollPx > 32) issues.push("outer-document-scroll");
    if (geometry.phoneFrames.length > 1) issues.push("duplicate-phone-frame");
    if (geometry.shellOffset && (geometry.shellOffset.left > 4 || geometry.shellOffset.top > 4 || geometry.shellOffset.rightGap > 4)) issues.push("first-screen-offset");
    if (geometry.bottomNavigationClipped) issues.push("bottom-navigation-clipped");
    if (geometry.interactiveOverflow.length) issues.push("interactive-hitarea-overflow");
    if (geometry.fixedOverflow.length) issues.push("fixed-element-overflow");
    if (geometry.scrollRegions[0]?.ratio > 4.5) issues.push("excessive-scroll-region");
    if (result.live.visual?.rgbDelta > 0.24 && result.live.visual?.luminanceDelta > 0.18) issues.push("card-live-state-mismatch");

    if (geometry.offscreenInteractive.length) review.push("carousel-or-offscreen-hitareas");
    if (geometry.contentBottomGap !== null && geometry.contentBottomGap > 180) review.push("large-lower-dead-zone");
    if (result.live.visual?.rgbDelta > 0.13 && result.live.visual?.luminanceDelta > 0.10) review.push("card-live-visual-drift");
  }

  return { issues: [...new Set(issues)], review: [...new Set(review)] };
}

function markdownReport(results) {
  const lines = [
    "# 23-case visual QA",
    "",
    `Viewport: ${viewport.width}×${viewport.height}`,
    "",
    "| Case | Card | Video | Live | Hard issues | Review flags |",
    "|---|---:|---:|---:|---|---|",
  ];

  for (const item of results) {
    const card = item.card.ok ? `${item.card.width}×${item.card.height}` : "missing";
    const video = item.video ? (item.video.ok ? `${item.video.width}×${item.video.height}` : `error:${item.video.reason}`) : "—";
    const live = item.live ? "yes" : "—";
    lines.push(`| ${item.id} | ${card} | ${video} | ${live} | ${item.issues.length ? item.issues.join(", ") : "pass"} | ${item.review.length ? item.review.join(", ") : "—"} |`);
  }

  const failed = results.filter((item) => item.issues.length);
  const review = results.filter((item) => item.review.length);
  lines.push("", `Hard failures: ${failed.length}/${results.length}`, `Human-review candidates: ${review.length}/${results.length}`);

  for (const item of results.filter((entry) => entry.issues.length || entry.review.length)) {
    lines.push("", `## ${item.id}`, "");
    for (const issue of item.issues) lines.push(`- FAIL: ${issue}`);
    for (const flag of item.review) lines.push(`- REVIEW: ${flag}`);
    if (item.live?.visual) lines.push(`- visual delta: RGB ${item.live.visual.rgbDelta.toFixed(3)}, luminance ${item.live.visual.luminanceDelta.toFixed(3)}`);
    if (item.live?.geometry?.contentBottomGap !== null) lines.push(`- lower content gap: ${Math.round(item.live.geometry.contentBottomGap)}px`);
    if (item.live?.geometry?.interactiveOverflow?.length) lines.push(`- hard hitarea overflow: ${JSON.stringify(item.live.geometry.interactiveOverflow)}`);
    if (item.live?.geometry?.offscreenInteractive?.length) lines.push(`- offscreen/peek hitareas: ${JSON.stringify(item.live.geometry.offscreenInteractive)}`);
  }
  return `${lines.join("\n")}\n`;
}

const playwright = await loadPlaywright();
if (!playwright?.chromium) {
  console.error("Playwright is unavailable. Install Playwright and Chromium before running the visual audit.");
  process.exit(2);
}

const cases = loadCases();
const browser = await playwright.chromium.launch({ headless: true });
const results = [];

try {
  const page = await browser.newPage({ viewport });

  await page.goto(new URL("library.html", baseUrl).href, { waitUntil: "networkidle" });
  await waitForStablePaint(page);
  for (const record of cases) {
    const cardHost = page.locator(`[data-case-id="${record.id}"] .phone-frame--card`).first();
    if (await cardHost.count()) {
      await cardHost.screenshot({ path: path.join(cardScreenshotDir, `${record.id}.png`) });
    }
  }

  for (const record of cases) {
    const cardSrc = absoluteUrl(resolveCardPreview(record));
    await page.goto(baseUrl, { waitUntil: "domcontentloaded" });
    const card = await getImageMeta(page, cardSrc);
    const video = record.video ? probeVideo(record.video) : null;
    let live = null;

    if (record.liveDemo) {
      const demoUrl = new URL(record.liveDemo, baseUrl);
      demoUrl.searchParams.set("embed", "1");
      await page.goto(demoUrl.href, { waitUntil: "networkidle", timeout: 15000 });
      await waitForStablePaint(page);
      const geometry = await inspectDemoGeometry(page);
      const screenshotPath = path.join(liveScreenshotDir, `${record.id}.png`);
      const screenshot = await page.screenshot({ path: screenshotPath, fullPage: false });
      let visual = null;
      if (card.ok) {
        try {
          visual = await compareCardToLive(page, cardSrc, screenshot);
        } catch (error) {
          visual = { error: String(error?.message || error) };
        }
      }
      live = { url: demoUrl.href, screenshot: path.relative(repoRoot, screenshotPath), geometry, visual };
    }

    const result = { id: record.id, name: record.name, card: { src: cardSrc, ...card }, video, live };
    const classification = classifyCase(result);
    result.issues = classification.issues;
    result.review = classification.review;
    results.push(result);
    const status = result.issues.length ? `FAIL ${result.issues.join(", ")}` : "pass";
    const reviewText = result.review.length ? ` | review: ${result.review.join(", ")}` : "";
    console.log(`${record.id}: ${status}${reviewText}`);
  }
} finally {
  await browser.close();
}

const payload = {
  generatedAt: new Date().toISOString(),
  viewport,
  playwright: playwright.source,
  cases: results,
  summary: {
    total: results.length,
    passed: results.filter((item) => !item.issues.length).length,
    failed: results.filter((item) => item.issues.length).length,
    review: results.filter((item) => item.review.length).length,
    liveDemos: results.filter((item) => item.live).length,
  },
};

fs.writeFileSync(path.join(outputDir, "visual-qa.json"), `${JSON.stringify(payload, null, 2)}\n`);
fs.writeFileSync(path.join(outputDir, "visual-qa.md"), markdownReport(results));
console.log(JSON.stringify(payload.summary, null, 2));
process.exitCode = payload.summary.failed ? 1 : 0;
