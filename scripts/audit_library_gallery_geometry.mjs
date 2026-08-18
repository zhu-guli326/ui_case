#!/usr/bin/env node

import { chromium } from "playwright";

const baseUrl = process.env.IMAGE2_UI_BASE_URL || "http://127.0.0.1:4174";
const browser = await chromium.launch({ headless: true });

function closeEnough(actual, expected, tolerance = 1.5) {
  return Math.abs(actual - expected) <= tolerance;
}

async function auditViewport(viewport, expected) {
  const page = await browser.newPage({ viewport });
  try {
    await page.goto(`${baseUrl}/library.html?lang=zh`, { waitUntil: "networkidle" });
    await page.locator("#demoGallery .demo-card").first().waitFor({ state: "visible" });
    await page.waitForFunction(() => document.querySelectorAll("#demoGallery .demo-card").length === 19);

    const result = await page.evaluate(() => {
      const gallery = document.querySelector("#demoGallery");
      const cards = [...gallery.querySelectorAll(".demo-card")];
      const sample = cards.slice(0, 8).map((card) => {
        const preview = card.querySelector(".demo-card-preview");
        const phone = card.querySelector(".phone-frame--card");
        const previewRect = preview.getBoundingClientRect();
        const phoneRect = phone.getBoundingClientRect();
        return {
          id: card.dataset.caseId || "",
          previewWidth: previewRect.width,
          previewHeight: previewRect.height,
          phoneWidth: phoneRect.width,
          phoneHeight: phoneRect.height,
        };
      });
      return {
        cardCount: cards.length,
        columns: getComputedStyle(gallery).gridTemplateColumns.split(" ").filter(Boolean).length,
        sample,
      };
    });

    if (result.cardCount !== 19) throw new Error(`${viewport.width}px: expected 19 cards, got ${result.cardCount}`);
    if (result.columns !== expected.columns) throw new Error(`${viewport.width}px: expected ${expected.columns} columns, got ${result.columns}`);

    for (const card of result.sample) {
      if (!closeEnough(card.previewHeight, expected.previewHeight)) {
        throw new Error(`${viewport.width}px ${card.id}: preview height ${card.previewHeight}px, expected ${expected.previewHeight}px`);
      }
      if (!closeEnough(card.phoneWidth, expected.phoneWidth)) {
        throw new Error(`${viewport.width}px ${card.id}: phone width ${card.phoneWidth}px, expected ${expected.phoneWidth}px`);
      }
      if (!closeEnough(card.phoneHeight, expected.phoneHeight)) {
        throw new Error(`${viewport.width}px ${card.id}: phone height ${card.phoneHeight}px, expected ${expected.phoneHeight}px`);
      }
      const boardRatio = card.previewWidth / Math.max(1, card.previewHeight);
      if (Math.abs(boardRatio - 0.8) < 0.015) {
        throw new Error(`${viewport.width}px ${card.id}: preview regressed to scalable 4:5 board (${card.previewWidth}×${card.previewHeight})`);
      }
    }

    console.log(`${viewport.width}×${viewport.height}: ${expected.columns} columns, preview ${expected.previewHeight}px, screen ${expected.phoneWidth}×${expected.phoneHeight}px`);
  } finally {
    await page.close();
  }
}

try {
  await auditViewport({ width: 1920, height: 1080 }, { columns: 4, previewHeight: 360, phoneWidth: 147, phoneHeight: 318 });
  await auditViewport({ width: 1440, height: 960 }, { columns: 4, previewHeight: 360, phoneWidth: 147, phoneHeight: 318 });
  await auditViewport({ width: 1024, height: 768 }, { columns: 3, previewHeight: 340, phoneWidth: 138, phoneHeight: 298 });
  console.log("Library gallery geometry audit passed.");
} finally {
  await browser.close();
}
