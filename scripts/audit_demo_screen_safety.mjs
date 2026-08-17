#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright";

const repoRoot = path.resolve(fileURLToPath(new URL("..", import.meta.url)));
const baseUrl = process.env.UI_CASE_URL || "http://127.0.0.1:4174/";
const outputDir = path.join(repoRoot, "artifacts", "visual-qa", "screen-safety");
fs.mkdirSync(outputDir, { recursive: true });

const records = fs.readdirSync(path.join(repoRoot, "catalog", "cases"))
  .filter((name) => name.endsWith(".json"))
  .sort()
  .map((name) => JSON.parse(fs.readFileSync(path.join(repoRoot, "catalog", "cases", name), "utf8")))
  .filter((record) => record.liveDemo);

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 1 });
const results = [];

function withEmbed(url) {
  const target = new URL(url.replace(/^\.\//, ""), baseUrl);
  target.searchParams.set("embed", "1");
  return target.href;
}

try {
  for (const record of records) {
    await page.goto(withEmbed(record.liveDemo), { waitUntil: "networkidle" });
    await page.waitForTimeout(120);

    const metrics = await page.evaluate(() => {
      const vw = document.documentElement.clientWidth;
      const vh = document.documentElement.clientHeight;
      const isVisible = (element) => {
        if (!(element instanceof Element)) return false;
        const style = getComputedStyle(element);
        const rect = element.getBoundingClientRect();
        return style.display !== "none" && style.visibility !== "hidden" && Number(style.opacity || 1) > 0 && rect.width > 2 && rect.height > 2;
      };
      const rectData = (rect) => ({ left: rect.left, top: rect.top, right: rect.right, bottom: rect.bottom, width: rect.width, height: rect.height });
      const intersects = (a, b) => Math.max(a.left, b.left) < Math.min(a.right, b.right) && Math.max(a.top, b.top) < Math.min(a.bottom, b.bottom);

      const status = [...document.querySelectorAll(".statusbar,.status-bar,.status")].find(isVisible) || null;
      const statusRect = status ? status.getBoundingClientRect() : null;
      const island = [...document.querySelectorAll(".island,.dynamic-island,[class*='dynamic-island']")].find(isVisible) || null;
      const islandRect = island ? island.getBoundingClientRect() : null;
      const statusChildren = status
        ? [...status.children]
            .filter(isVisible)
            .filter((child) => !child.matches(".island,.dynamic-island,[class*='dynamic-island']"))
            .map((child) => ({ tag: child.tagName.toLowerCase(), rect: rectData(child.getBoundingClientRect()) }))
        : [];
      const statusIslandOverlap = Boolean(islandRect && statusChildren.some((child) => intersects(child.rect, islandRect)));

      const navCandidates = [...document.querySelectorAll("nav,.tabbar,.bottom-nav,.bottom-bar,.bottom-tabs,[class*='bottom-nav'],[class*='bottom-bar'],[class*='bottom-tabs']")]
        .filter(isVisible)
        .map((element) => element.getBoundingClientRect())
        .filter((rect) => rect.top > vh * 0.55)
        .sort((a, b) => b.top - a.top);
      const bottomBoundary = navCandidates.length ? navCandidates[0].top : vh - 24;

      const activeView = [...document.querySelectorAll("[data-view]")].find((element) => isVisible(element) && !element.hidden) || document.body;
      const meaningfulSelector = "h1,h2,h3,h4,p,small,strong,time,img,figure,button,a,input,label,li,article,[role='button']";
      const meaningful = [...activeView.querySelectorAll(meaningfulSelector)]
        .filter(isVisible)
        .filter((element) => !element.closest("nav,.tabbar,.bottom-nav,.bottom-bar,.bottom-tabs,.statusbar,.status-bar,.status"))
        .map((element) => element.getBoundingClientRect())
        .filter((rect) => rect.top >= 0 && rect.top < bottomBoundary + 4 && rect.bottom > 0)
        .filter((rect) => rect.width < vw * 0.98 || rect.height < vh * 0.45);
      const meaningfulBottom = meaningful.length ? Math.max(...meaningful.map((rect) => Math.min(rect.bottom, bottomBoundary))) : 0;
      const bottomWhitespace = Math.max(0, bottomBoundary - meaningfulBottom);

      return {
        viewport: { width: vw, height: vh },
        statusbar: statusRect ? rectData(statusRect) : null,
        statusChildren,
        island: islandRect ? rectData(islandRect) : null,
        statusIslandOverlap,
        bottomBoundary,
        meaningfulBottom,
        bottomWhitespace,
      };
    });

    const issues = [];
    const reviews = [];
    if (!metrics.statusbar) issues.push("statusbar-missing");
    if (metrics.statusbar) {
      if (metrics.statusbar.top < -2 || metrics.statusbar.bottom > 62) issues.push("statusbar-out-of-safe-zone");
      if (metrics.statusbar.height < 38 || metrics.statusbar.height > 52) issues.push("statusbar-height");
      if (metrics.statusbar.left < -2 || metrics.statusbar.right > metrics.viewport.width + 2) issues.push("statusbar-horizontal-overflow");
    }
    if (metrics.statusIslandOverlap) issues.push("statusbar-island-overlap");
    if (metrics.bottomWhitespace > 210) reviews.push("excess-bottom-whitespace");

    results.push({ id: record.id, name: record.name, liveDemo: record.liveDemo, issues, reviews, ...metrics });
    await page.screenshot({ path: path.join(outputDir, `${record.id}.png`), type: "png", fullPage: false });
  }
} finally {
  await browser.close();
}

const failed = results.filter((result) => result.issues.length);
const review = results.filter((result) => result.reviews.length);
const report = {
  generatedAt: new Date().toISOString(),
  summary: { total: results.length, passed: results.length - failed.length, failed: failed.length, review: review.length },
  cases: results,
};
fs.writeFileSync(path.join(outputDir, "screen-safety.json"), `${JSON.stringify(report, null, 2)}\n`, "utf8");
console.log(JSON.stringify(report.summary, null, 2));
for (const item of failed) console.error(`${item.id}: ${item.issues.join(", ")} (bottomWhitespace=${Math.round(item.bottomWhitespace)}px)`);
for (const item of review) console.warn(`${item.id}: ${item.reviews.join(", ")} (bottomWhitespace=${Math.round(item.bottomWhitespace)}px)`);
if (failed.length) process.exitCode = 1;
