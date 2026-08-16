#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright";

const repoRoot = path.resolve(fileURLToPath(new URL("..", import.meta.url)));
const baseUrl = process.env.UI_CASE_URL || "http://127.0.0.1:4174/";
const outputDir = path.join(repoRoot, "artifacts", "visual-qa", "library-dialog");
fs.mkdirSync(outputDir, { recursive: true });

const records = fs.readdirSync(path.join(repoRoot, "catalog", "cases"))
  .filter((name) => name.endsWith(".json"))
  .sort()
  .map((name) => JSON.parse(fs.readFileSync(path.join(repoRoot, "catalog", "cases", name), "utf8")));

if (records.length !== 23) throw new Error(`Expected 23 cases, found ${records.length}`);

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1440, height: 960 }, deviceScaleFactor: 1 });
const results = [];

try {
  await page.goto(new URL("library.html?lang=zh", baseUrl).href, { waitUntil: "networkidle" });
  await page.locator("#demoGallery .demo-card").first().waitFor({ state: "visible" });

  for (const record of records) {
    const card = page.locator(`.demo-card[data-case-id="${record.id}"]`);
    if (await card.count() !== 1) throw new Error(`Missing Library card for ${record.id}`);

    await card.scrollIntoViewIfNeeded();
    const opener = card.locator(`[data-preview-id="${record.id}"]`).first();
    await opener.click();
    await page.locator("#previewDialog[open]").waitFor({ state: "visible" });
    await page.waitForFunction((id) => {
      const frame = document.querySelector("#previewMediaFrame");
      return frame?.dataset.previewCaseId === id && frame?.dataset.frameOwner === "library";
    }, record.id);

    const modeButtons = page.locator("#previewModeSwitch [data-preview-view]");
    const modes = await modeButtons.evaluateAll((buttons) => buttons.map((button) => button.dataset.previewView));
    if (!modes.length) modes.push("image");

    const modeResults = [];
    for (const mode of modes) {
      const button = page.locator(`#previewModeSwitch [data-preview-view="${mode}"]`);
      if (await button.count()) await button.click();
      await page.waitForTimeout(mode === "live" ? 450 : 180);

      if (mode === "live") {
        await page.waitForFunction(() => {
          const iframe = document.querySelector("#previewDialogDemo");
          return iframe && !iframe.hidden && iframe.contentDocument?.readyState === "complete";
        }, null, { timeout: 5000 }).catch(() => {});
      }

      const metrics = await page.evaluate((modeName) => {
        const frame = document.querySelector("#previewMediaFrame");
        const screen = document.querySelector("#previewPhoneScreen");
        const image = document.querySelector("#previewDialogImage");
        const sequence = document.querySelector("#previewDialogSequence");
        const video = document.querySelector("#previewDialogVideo");
        const iframe = document.querySelector("#previewDialogDemo");
        const frameRect = frame.getBoundingClientRect();
        const screenRect = screen.getBoundingClientRect();
        const visibleMedia = [image, sequence, video, iframe].find((element) => element && !element.hidden);
        const mediaStyle = visibleMedia ? getComputedStyle(visibleMedia) : null;
        const nestedDeviceCount = screen.querySelectorAll(
          ".phone-frame, .iphone-frame, [class*='device-frame'], [class*='phone-shell'], [class*='iphone-shell']",
        ).length;

        let embedded = null;
        if (modeName === "live" && iframe?.contentDocument) {
          const doc = iframe.contentDocument;
          const embeddedFrame = doc.querySelector(".iphone-frame");
          const embeddedFrameStyle = embeddedFrame ? getComputedStyle(embeddedFrame) : null;
          const embeddedFrameRect = embeddedFrame?.getBoundingClientRect();
          const scroller = doc.scrollingElement || doc.documentElement;
          embedded = {
            foundFrame: Boolean(embeddedFrame),
            width: embeddedFrameRect?.width || 0,
            height: embeddedFrameRect?.height || 0,
            borderTopWidth: embeddedFrameStyle?.borderTopWidth || "",
            paddingTop: embeddedFrameStyle?.paddingTop || "",
            borderRadius: embeddedFrameStyle?.borderRadius || "",
            boxShadow: embeddedFrameStyle?.boxShadow || "",
            backgroundColor: embeddedFrameStyle?.backgroundColor || "",
            documentScrollWidth: scroller.scrollWidth,
            documentClientWidth: scroller.clientWidth,
            documentScrollHeight: scroller.scrollHeight,
            documentClientHeight: scroller.clientHeight,
          };
        }

        return {
          mode: modeName,
          frame: {
            width: frameRect.width,
            height: frameRect.height,
            ratio: frameRect.width / Math.max(1, frameRect.height),
            presentation: frame.dataset.mediaPresentation || "",
            frameOwner: frame.dataset.frameOwner || "",
            sourceKind: frame.dataset.sourceKind || "",
            contract: frame.dataset.previewContract || "",
            isArtboard: frame.classList.contains("is-artboard-preview"),
          },
          screen: {
            width: screenRect.width,
            height: screenRect.height,
            leftGap: Math.abs(screenRect.left - frameRect.left),
            topGap: Math.abs(screenRect.top - frameRect.top),
            rightGap: Math.abs(frameRect.right - screenRect.right),
            bottomGap: Math.abs(frameRect.bottom - screenRect.bottom),
          },
          media: {
            tag: visibleMedia?.tagName?.toLowerCase() || "",
            objectFit: mediaStyle?.objectFit || "",
            width: visibleMedia?.getBoundingClientRect().width || 0,
            height: visibleMedia?.getBoundingClientRect().height || 0,
          },
          nestedDeviceCount,
          embedded,
        };
      }, mode);

      const issues = [];
      const expectedRatio = 390 / 844;
      if (metrics.frame.frameOwner !== "library") issues.push("frame-owner");
      if (metrics.frame.presentation !== "device") issues.push("presentation");
      if (metrics.frame.isArtboard) issues.push("unexpected-artboard");
      if (Math.abs(metrics.frame.ratio - expectedRatio) > 0.004) issues.push("frame-ratio");
      if (Math.max(metrics.screen.leftGap, metrics.screen.topGap, metrics.screen.rightGap, metrics.screen.bottomGap) > 1.5) issues.push("screen-gap");
      if (metrics.nestedDeviceCount > 0) issues.push("nested-library-device");
      if (["img", "video"].includes(metrics.media.tag) && metrics.media.objectFit !== "cover") issues.push("media-fit");
      if (Math.abs(metrics.media.width - metrics.screen.width) > 1.5 || Math.abs(metrics.media.height - metrics.screen.height) > 1.5) issues.push("media-size");

      if (mode === "live") {
        if (!metrics.embedded?.foundFrame) issues.push("embed-frame-missing");
        if (metrics.embedded?.borderTopWidth !== "0px") issues.push("embed-border");
        if (metrics.embedded?.paddingTop !== "0px") issues.push("embed-padding");
        if (metrics.embedded?.boxShadow !== "none") issues.push("embed-shadow");
        if (metrics.embedded?.borderRadius !== "0px") issues.push("embed-radius");
        if (Math.abs((metrics.embedded?.width || 0) - 390) > 1.5 || Math.abs((metrics.embedded?.height || 0) - 844) > 1.5) issues.push("embed-size");
        if ((metrics.embedded?.documentScrollWidth || 0) > (metrics.embedded?.documentClientWidth || 0) + 2) issues.push("embed-horizontal-scroll");
      }

      modeResults.push({ ...metrics, issues });
      await page.locator("#previewMediaFrame").screenshot({
        path: path.join(outputDir, `${record.id}-${mode}.png`),
        type: "png",
      });
    }

    const widths = modeResults.map((item) => item.frame.width);
    const heights = modeResults.map((item) => item.frame.height);
    const modeSizeDrift = Math.max(...widths) - Math.min(...widths) > 1.5 || Math.max(...heights) - Math.min(...heights) > 1.5;
    const issues = [...new Set(modeResults.flatMap((item) => item.issues))];
    if (modeSizeDrift) issues.push("mode-size-drift");

    results.push({ id: record.id, name: record.name, modes: modeResults, issues });
    await page.evaluate(() => document.querySelector("#previewDialog")?.close());
    await page.waitForTimeout(40);
  }
} finally {
  await browser.close();
}

const failed = results.filter((item) => item.issues.length);
const report = {
  generatedAt: new Date().toISOString(),
  standard: {
    source: { width: 390, height: 844 },
    canonical: { width: 780, height: 1688 },
    preferredDetailWidth: 300,
    frameOwner: "library",
  },
  summary: {
    total: results.length,
    passed: results.length - failed.length,
    failed: failed.length,
  },
  cases: results,
};

fs.writeFileSync(
  path.join(outputDir, "library-preview-contract.json"),
  `${JSON.stringify(report, null, 2)}\n`,
  "utf8",
);

console.log(JSON.stringify(report.summary, null, 2));
if (failed.length) {
  for (const item of failed) console.error(`${item.id}: ${item.issues.join(", ")}`);
  process.exitCode = 1;
}
