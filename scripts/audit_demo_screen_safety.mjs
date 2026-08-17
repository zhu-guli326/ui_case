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

async function measureState() {
  return page.evaluate(() => {
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

    const navCandidates = [...document.querySelectorAll("nav,.tabbar,.bottom-nav,.bottom-bar,.bottom-tabs,.dock,[class*='bottom-nav'],[class*='bottom-bar'],[class*='bottom-tabs']")]
      .filter(isVisible)
      .map((element) => element.getBoundingClientRect())
      .filter((rect) => rect.top > vh * 0.55)
      .sort((a, b) => b.top - a.top);
    const bottomBoundary = navCandidates.length ? navCandidates[0].top : vh - 24;

    const activeView = [...document.querySelectorAll("[data-view]")].find((element) => isVisible(element) && !element.hidden) || document.body;
    const activeViewName = activeView instanceof Element
      ? activeView.getAttribute("data-view") || activeView.getAttribute("aria-label") || activeView.className || "body"
      : "body";
    const meaningfulSelector = "h1,h2,h3,h4,p,small,strong,time,img,figure,button,a,input,label,li,article,[role='button']";
    const meaningful = [...activeView.querySelectorAll(meaningfulSelector)]
      .filter(isVisible)
      .filter((element) => !element.closest("nav,.tabbar,.bottom-nav,.bottom-bar,.bottom-tabs,.dock,.statusbar,.status-bar,.status"))
      .map((element) => element.getBoundingClientRect())
      .filter((rect) => rect.top >= 0 && rect.top < bottomBoundary + 4 && rect.bottom > 0)
      .filter((rect) => rect.width < vw * 0.98 || rect.height < vh * 0.45);
    const meaningfulBottom = meaningful.length ? Math.max(...meaningful.map((rect) => Math.min(rect.bottom, bottomBoundary))) : 0;
    const bottomWhitespace = Math.max(0, bottomBoundary - meaningfulBottom);

    return {
      viewport: { width: vw, height: vh },
      activeViewName: String(activeViewName),
      statusbar: statusRect ? rectData(statusRect) : null,
      statusChildren,
      island: islandRect ? rectData(islandRect) : null,
      statusIslandOverlap,
      bottomBoundary,
      meaningfulBottom,
      bottomWhitespace,
    };
  });
}

function assess(metrics) {
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
  return { issues, reviews };
}

function slug(value) {
  return String(value || "state")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 48) || "state";
}

try {
  for (const record of records) {
    await page.goto(withEmbed(record.liveDemo), { waitUntil: "networkidle" });
    await page.waitForTimeout(120);

    const states = [];
    const initialMetrics = await measureState();
    const initialAssessment = assess(initialMetrics);
    states.push({ label: "initial", ...initialMetrics, ...initialAssessment });
    await page.screenshot({ path: path.join(outputDir, `${record.id}-initial.png`), type: "png", fullPage: false });

    const buttonLocator = page.locator([
      "nav button",
      ".tabbar button",
      ".bottom-nav button",
      ".bottom-bar button",
      ".bottom-tabs button",
      ".dock button",
    ].join(","));
    const buttonCount = await buttonLocator.count();
    const visited = new Set([initialMetrics.activeViewName]);

    for (let index = 0; index < buttonCount; index += 1) {
      const button = buttonLocator.nth(index);
      const box = await button.boundingBox().catch(() => null);
      if (!box || box.y < 844 * 0.55) continue;

      const descriptor = await button.evaluate((element) => ({
        label: element.getAttribute("aria-label") || element.textContent?.trim().replace(/\s+/g, " ") || `tab-${element.dataset.tab || element.dataset.viewTarget || element.dataset.set || "item"}`,
        target: element.dataset.tab || element.dataset.viewTarget || element.dataset.set || "",
        disabled: Boolean(element.disabled || element.getAttribute("aria-disabled") === "true"),
      }));
      if (descriptor.disabled) continue;

      await button.click({ timeout: 1200 }).catch(() => {});
      await page.waitForTimeout(90);
      const stateMetrics = await measureState();
      if (visited.has(stateMetrics.activeViewName)) continue;
      visited.add(stateMetrics.activeViewName);
      const stateAssessment = assess(stateMetrics);
      const label = descriptor.target || descriptor.label || stateMetrics.activeViewName;
      states.push({ label, ...stateMetrics, ...stateAssessment });
      await page.screenshot({
        path: path.join(outputDir, `${record.id}-${slug(label)}.png`),
        type: "png",
        fullPage: false,
      });
    }

    const issues = [...new Set(states.flatMap((state) => state.issues))];
    const reviews = [...new Set(states.flatMap((state) => state.reviews))];
    results.push({ id: record.id, name: record.name, liveDemo: record.liveDemo, issues, reviews, states });
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
for (const item of failed) {
  const detail = item.states.filter((state) => state.issues.length).map((state) => `${state.label}:${state.issues.join("+")}`).join(" | ");
  console.error(`${item.id}: ${detail}`);
}
for (const item of review) {
  const detail = item.states.filter((state) => state.reviews.length).map((state) => `${state.label}:${Math.round(state.bottomWhitespace)}px`).join(" | ");
  console.warn(`${item.id}: excess-bottom-whitespace ${detail}`);
}
if (failed.length) process.exitCode = 1;
