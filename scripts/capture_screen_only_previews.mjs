import fs from "node:fs/promises";
import path from "node:path";
import { chromium } from "playwright";

const baseUrl = process.env.VISUAL_QA_BASE_URL || "http://127.0.0.1:4174";
const outputRoot = path.resolve("artifacts/visual-qa/screen-only/organique");

const targets = [
  { name: "choose", query: "?embed=1", file: "01-choose.png" },
  { name: "plan", query: "?embed=1&view=plan", file: "02-plan.png" },
  { name: "confirmation", query: "?embed=1&view=confirmation", file: "03-confirmation.png" },
];

await fs.mkdir(outputRoot, { recursive: true });

const browser = await chromium.launch({ headless: true });
try {
  const page = await browser.newPage({
    viewport: { width: 390, height: 844 },
    deviceScaleFactor: 1,
  });

  for (const target of targets) {
    const url = `${baseUrl}/demo/organique-food/index.html${target.query}`;
    await page.goto(url, { waitUntil: "networkidle" });
    await page.waitForSelector(".embed-mode .phone.iphone-frame");

    const chrome = await page.locator(".phone.iphone-frame").evaluate((element) => {
      const style = getComputedStyle(element);
      const screen = element.querySelector(".screen");
      const screenStyle = screen ? getComputedStyle(screen) : null;
      return {
        width: element.getBoundingClientRect().width,
        height: element.getBoundingClientRect().height,
        paddingTop: style.paddingTop,
        borderTopWidth: style.borderTopWidth,
        borderRadius: style.borderRadius,
        boxShadow: style.boxShadow,
        backgroundColor: style.backgroundColor,
        screenBorderRadius: screenStyle?.borderRadius || "",
      };
    });

    if (Math.round(chrome.width) !== 390 || Math.round(chrome.height) !== 844) {
      throw new Error(`${target.name}: embedded screen is ${chrome.width}x${chrome.height}, expected 390x844`);
    }
    if (chrome.paddingTop !== "0px" || chrome.borderTopWidth !== "0px" || chrome.borderRadius !== "0px") {
      throw new Error(`${target.name}: embedded demo still owns device chrome: ${JSON.stringify(chrome)}`);
    }
    if (chrome.boxShadow !== "none" || chrome.screenBorderRadius !== "0px") {
      throw new Error(`${target.name}: embedded demo still renders a second bezel: ${JSON.stringify(chrome)}`);
    }

    await page.screenshot({
      path: path.join(outputRoot, target.file),
      fullPage: false,
      animations: "disabled",
    });
  }
} finally {
  await browser.close();
}

console.log(`Captured ${targets.length} screen-only Organique states at 390x844.`);
