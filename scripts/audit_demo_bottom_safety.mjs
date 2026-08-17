#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright";

const repoRoot = path.resolve(fileURLToPath(new URL("..", import.meta.url)));
const baseUrl = process.env.UI_CASE_URL || "http://127.0.0.1:4174/";
const outputDir = path.join(repoRoot, "artifacts", "visual-qa", "bottom-safety");
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
    const consoleErrors = [];
    const onConsole = (message) => {
      if (message.type() === "error") consoleErrors.push(message.text());
    };
    page.on("console", onConsole);

    await page.goto(withEmbed(record.liveDemo), { waitUntil: "networkidle" });
    await page.waitForTimeout(120);

    const metrics = await page.evaluate(() => {
      const vw = document.documentElement.clientWidth;
      const vh = document.documentElement.clientHeight;
      const EPS = 2;

      const isVisible = (element) => {
        if (!(element instanceof Element)) return false;
        const style = getComputedStyle(element);
        const rect = element.getBoundingClientRect();
        return style.display !== "none" && style.visibility !== "hidden" && Number(style.opacity || 1) > 0 && rect.width > 2 && rect.height > 2;
      };

      const rectData = (rect) => ({
        left: rect.left,
        top: rect.top,
        right: rect.right,
        bottom: rect.bottom,
        width: rect.width,
        height: rect.height,
      });

      const navSelector = [
        "nav",
        ".tabbar",
        ".bottom-nav",
        ".bottom-bar",
        ".bottom-tabs",
        "[class*='tabbar']",
        "[class*='bottom-nav']",
        "[class*='bottom-bar']",
        "[class*='bottom-tabs']",
        "[class*='bottom-dock']",
      ].join(",");

      const navs = [...new Set([...document.querySelectorAll(navSelector)])]
        .filter(isVisible)
        .map((element) => ({ element, rect: element.getBoundingClientRect(), style: getComputedStyle(element) }))
        .filter((item) => item.rect.top >= vh * 0.52)
        .sort((a, b) => b.rect.top - a.rect.top);

      const navigation = navs.map(({ element, rect, style }) => {
        const buttons = [...element.querySelectorAll("button,a,[role='button'],[data-tab],[data-view-target]")]
          .filter(isVisible)
          .map((button) => {
            const buttonRect = button.getBoundingClientRect();
            const x = Math.max(0, Math.min(vw - 1, buttonRect.left + buttonRect.width / 2));
            const y = Math.max(0, Math.min(vh - 1, buttonRect.top + buttonRect.height / 2));
            const hit = document.elementFromPoint(x, y);
            const receivesPointer = Boolean(hit && (button === hit || button.contains(hit)));
            return {
              label: button.getAttribute("aria-label") || button.textContent?.trim().replace(/\s+/g, " ").slice(0, 60) || button.tagName.toLowerCase(),
              rect: rectData(buttonRect),
              receivesPointer,
              disabled: Boolean(button.disabled || button.getAttribute("aria-disabled") === "true"),
              pointerEvents: getComputedStyle(button).pointerEvents,
            };
          });

        return {
          tag: element.tagName.toLowerCase(),
          className: typeof element.className === "string" ? element.className : "",
          rect: rectData(rect),
          pointerEvents: style.pointerEvents,
          overflowX: rect.left < -EPS || rect.right > vw + EPS,
          overflowBottom: rect.bottom > vh + EPS,
          buttons,
        };
      });

      const coveredControls = [];
      const interactive = [...document.querySelectorAll("button,a,input,select,textarea,[role='button']")].filter(isVisible);
      for (const control of interactive) {
        if (navs.some(({ element }) => element.contains(control))) continue;
        const rect = control.getBoundingClientRect();
        if (rect.bottom < vh * 0.55) continue;
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;
        if (cx < 0 || cx >= vw || cy < 0 || cy >= vh) continue;
        const hit = document.elementFromPoint(cx, cy);
        const coveredByNav = navs.some(({ element }) => hit && (element === hit || element.contains(hit)));
        if (coveredByNav) {
          coveredControls.push({
            label: control.getAttribute("aria-label") || control.textContent?.trim().replace(/\s+/g, " ").slice(0, 60) || control.tagName.toLowerCase(),
            rect: rectData(rect),
          });
        }
      }

      const indicators = [...document.querySelectorAll(".home-indicator,[class*='home-indicator']")]
        .filter(isVisible)
        .map((element) => ({
          rect: rectData(element.getBoundingClientRect()),
          pointerEvents: getComputedStyle(element).pointerEvents,
        }));

      return {
        viewport: { width: vw, height: vh },
        document: {
          scrollWidth: document.scrollingElement?.scrollWidth || document.documentElement.scrollWidth,
          scrollHeight: document.scrollingElement?.scrollHeight || document.documentElement.scrollHeight,
        },
        navigation,
        coveredControls,
        indicators,
      };
    });

    const issues = [];
    if (metrics.document.scrollWidth > metrics.viewport.width + 2) issues.push("horizontal-scroll");
    for (const nav of metrics.navigation) {
      if (nav.overflowX) issues.push("bottom-nav-horizontal-overflow");
      if (nav.overflowBottom) issues.push("bottom-nav-bottom-overflow");
      if (nav.pointerEvents === "none") issues.push("bottom-nav-pointer-events-none");
      for (const button of nav.buttons) {
        if (!button.disabled && button.pointerEvents !== "none" && !button.receivesPointer) issues.push("bottom-nav-button-hit-test");
        if (!button.disabled && button.pointerEvents === "none") issues.push("bottom-nav-button-pointer-events-none");
      }
    }
    if (metrics.coveredControls.length) issues.push("bottom-nav-covers-control");
    if (metrics.indicators.some((indicator) => indicator.pointerEvents !== "none")) issues.push("home-indicator-intercepts-pointer");
    if (consoleErrors.length) issues.push("console-error");

    const uniqueIssues = [...new Set(issues)];
    results.push({
      id: record.id,
      name: record.name,
      liveDemo: record.liveDemo,
      issues: uniqueIssues,
      consoleErrors,
      ...metrics,
    });

    await page.screenshot({
      path: path.join(outputDir, `${record.id}.png`),
      type: "png",
      fullPage: false,
    });
    page.off("console", onConsole);
  }
} finally {
  await browser.close();
}

const failed = results.filter((result) => result.issues.length);
const report = {
  generatedAt: new Date().toISOString(),
  summary: {
    total: results.length,
    passed: results.length - failed.length,
    failed: failed.length,
  },
  cases: results,
};

fs.writeFileSync(path.join(outputDir, "bottom-safety.json"), `${JSON.stringify(report, null, 2)}\n`, "utf8");
console.log(JSON.stringify(report.summary, null, 2));
if (failed.length) {
  for (const item of failed) console.error(`${item.id}: ${item.issues.join(", ")}`);
  process.exitCode = 1;
}
