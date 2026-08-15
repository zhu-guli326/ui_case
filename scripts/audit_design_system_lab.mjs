#!/usr/bin/env node

import fs from "node:fs";
import http from "node:http";
import os from "node:os";
import path from "node:path";
import { createRequire } from "node:module";
import { fileURLToPath, pathToFileURL } from "node:url";

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const outputDir = path.join(repoRoot, "screenshots");
fs.mkdirSync(outputDir, { recursive: true });
const playwright = await loadPlaywright();
if (!playwright?.chromium) throw new Error("Playwright is unavailable");
const server = await startServer();
const browser = await playwright.chromium.launch({ headless: true });
const failures = [];
const screenshots = [];

try {
  const page = await browser.newPage({ viewport: { width: 1440, height: 1000 }, acceptDownloads: true });
  const errors = watchErrors(page);
  await page.goto(`${server.url}/lab/?system=ant&view=single&lang=zh`, { waitUntil: "networkidle" });
  await page.waitForSelector("#previewStage iframe");
  const initial = await page.evaluate(() => ({
    system: window.image2DesignSystemLab?.state.system,
    view: window.image2DesignSystemLab?.state.view,
    tabs: document.querySelectorAll("#systemTabs [role=tab]").length,
    selected: document.querySelector('#systemTabs [aria-selected="true"]')?.textContent,
    frames: document.querySelectorAll("#previewStage iframe").length,
    settingsHidden: document.querySelector("#settingsPanel")?.hidden,
    catalogCards: document.querySelectorAll(".system-card, #systemCardGrid").length,
    overflow: document.documentElement.scrollWidth > document.documentElement.clientWidth + 1,
    activeNav: document.querySelector('[data-site-nav] [aria-current="page"]')?.getAttribute("href"),
  }));
  if (initial.system !== "ant" || initial.view !== "single" || initial.tabs !== 19 || initial.selected !== "Ant" || initial.frames !== 1 || !initial.settingsHidden || initial.catalogCards !== 0 || initial.overflow || !initial.activeNav?.startsWith("../brands.html")) failures.push(`desktop defaults invalid: ${JSON.stringify(initial)}`);
  const iframe = page.frameLocator("#previewStage iframe");
  await iframe.locator("h1", { hasText: "账户设置" }).waitFor();
  if (await iframe.locator("form[data-action-form]").count() !== 1) failures.push("account settings preview form is missing");

  await page.locator('[data-system="carbon"]').click();
  await page.waitForFunction(() => document.querySelector("#previewStage iframe")?.src.includes("system=carbon"));
  const carbon = await page.frameLocator("#previewStage iframe").locator("html").evaluate((html) => ({ system: html.dataset.system, controlHeight: getComputedStyle(html).getPropertyValue("--system-control-height").trim() }));
  if (carbon.system !== "carbon" || carbon.controlHeight !== "40px") failures.push(`Carbon adapter invalid: ${JSON.stringify(carbon)}`);

  await page.locator('[data-control="view"] [data-value="compare"]').click();
  await page.waitForFunction(() => document.querySelectorAll("#previewStage iframe").length === 4);
  const compareSystems = await page.locator("#previewStage iframe").evaluateAll((frames) => frames.map((frame) => new URL(frame.src).searchParams.get("system")));
  if (!["carbon", "apple", "material", "ant"].every((system) => compareSystems.includes(system))) failures.push(`comparison invalid: ${compareSystems.join(",")}`);
  const compareShot = path.join(outputDir, "design-system-lab-compare-1440.png");
  await page.screenshot({ path: compareShot, fullPage: false }); screenshots.push(compareShot);

  await page.locator("#settingsButton").click();
  const settings = await page.evaluate(() => ({ hidden: document.querySelector("#settingsPanel")?.hidden, expanded: document.querySelector("#settingsButton")?.getAttribute("aria-expanded"), lowFrequency: [...document.querySelectorAll("#settingsPanel [name]")].map((element) => element.name) }));
  if (settings.hidden || settings.expanded !== "true" || !["template", "theme"].every((name) => settings.lowFrequency.includes(name))) failures.push(`settings drawer invalid: ${JSON.stringify(settings)}`);
  await page.selectOption('#settingsPanel [name="theme"]', "editorial-commerce");
  await page.locator('[data-control="appearance"] [data-value="dark"]').click();
  await page.waitForFunction(() => document.documentElement.dataset.appearance === "dark");
  await page.waitForFunction(() => {
    const frames = [...document.querySelectorAll("#previewStage iframe")];
    return frames.length === 4 && frames.every((frame) => frame.contentDocument?.documentElement.dataset.appearance === "dark");
  });
  const iframeAppearances = await page.locator("#previewStage iframe").evaluateAll((frames) => frames.map((frame) => frame.contentDocument?.documentElement.dataset.appearance));
  if (iframeAppearances.some((appearance) => appearance !== "dark")) failures.push(`dark mode did not reach previews: ${JSON.stringify(iframeAppearances)}`);
  await page.locator("#settingsClose").click();

  await page.locator('[data-control="view"] [data-value="matrix"]').click();
  await page.waitForSelector("#componentMatrix:not([hidden]) .matrix-table");
  if (await page.locator("#componentMatrix .matrix-row").count() !== 9) failures.push("component matrix did not render 8 roles");
  const matrixShot = path.join(outputDir, "design-system-lab-matrix-1440.png");
  await page.screenshot({ path: matrixShot, fullPage: false }); screenshots.push(matrixShot);

  await page.locator('[data-control="view"] [data-value="single"]').click();
  await page.locator('[data-inspector="tokens"]').click();
  await page.evaluate(() => { window.__copied = []; Object.defineProperty(navigator, "clipboard", { configurable: true, value: { writeText: async (value) => window.__copied.push(value) } }); });
  await page.locator('[data-copy="tokens"]').click();
  const copied = await page.evaluate(() => window.__copied);
  if (copied.length !== 1 || !copied[0].includes('"designSystem"')) failures.push("token copy failed");
  const desktopShot = path.join(outputDir, "design-system-lab-desktop-1440.png");
  await page.screenshot({ path: desktopShot, fullPage: false }); screenshots.push(desktopShot);

  const mobilePage = await browser.newPage({ viewport: { width: 390, height: 844 } });
  const mobileErrors = watchErrors(mobilePage);
  await mobilePage.goto(`${server.url}/lab/?system=apple&device=iphone&view=single&lang=zh`, { waitUntil: "networkidle" });
  await mobilePage.waitForSelector("#previewStage iframe");
  const mobile = await mobilePage.evaluate(() => ({
    overflow: document.documentElement.scrollWidth > document.documentElement.clientWidth + 1,
    frameWidth: document.querySelector("#previewStage iframe")?.getBoundingClientRect().width,
    frame: (() => {
      const element = document.querySelector(".device-frame");
      const iframe = element?.querySelector("iframe");
      const width = Number(element?.dataset.previewWidth);
      const height = Number(element?.dataset.previewHeight);
      const rect = element?.getBoundingClientRect();
      const iframeRect = iframe?.getBoundingClientRect();
      return { width, height, renderedWidth: rect?.width, renderedHeight: rect?.height, ratio: rect?.height / rect?.width, canvasRatio: iframeRect?.height / iframeRect?.width };
    })(),
    buttonHeight: document.querySelector("#settingsButton")?.getBoundingClientRect().height,
  }));
  const expectedMobileRatio = 844 / 390;
  if (mobile.overflow || mobile.frameWidth < 280 || mobile.buttonHeight < 38 || mobile.frame.width !== 390 || mobile.frame.height !== 844 || Math.abs(mobile.frame.canvasRatio - expectedMobileRatio) > 0.03) failures.push(`mobile layout invalid: ${JSON.stringify(mobile)}`);
  await mobilePage.locator("#settingsButton").click();
  const panelWidth = await mobilePage.locator("#settingsPanel").evaluate((panel) => panel.getBoundingClientRect().width);
  if (panelWidth > 390) failures.push(`mobile settings drawer too wide: ${panelWidth}`);
  const mobileShot = path.join(outputDir, "design-system-lab-mobile-390.png");
  await mobilePage.screenshot({ path: mobileShot, fullPage: false }); screenshots.push(mobileShot);
  await mobilePage.close();

  failures.push(...errors.map((error) => `desktop console: ${error}`), ...mobileErrors.map((error) => `mobile console: ${error}`));
  console.log(JSON.stringify({ status: failures.length ? "fail" : "pass", playwright: playwright.source, initial, carbon, compareSystems, settings, mobile, screenshots, failures }, null, 2));
  process.exitCode = failures.length ? 2 : 0;
} finally {
  await browser.close();
  await new Promise((resolve) => server.instance.close(resolve));
}

function watchErrors(page) {
  const errors = [];
  page.on("console", (message) => { if (message.type() === "error" && message.location().url !== "https://api.github.com/repos/zhu-guli326/image2_UI_skill") errors.push(`${message.text()} @ ${message.location().url}`); });
  page.on("pageerror", (error) => errors.push(error.message));
  return errors;
}
async function loadPlaywright() {
  try { const mod = await import("playwright"); return { chromium: mod.chromium || mod.default?.chromium, source: "project" }; } catch {}
  const require = createRequire(import.meta.url);
  for (const candidate of [process.env.PLAYWRIGHT_NODE_MODULES, path.join(repoRoot, "node_modules"), path.join(os.homedir(), ".cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules")].filter(Boolean)) {
    try { const resolved = require.resolve("playwright", { paths: [candidate] }); const mod = await import(pathToFileURL(resolved).href); return { chromium: mod.chromium || mod.default?.chromium, source: resolved }; } catch {}
  }
  return null;
}
async function startServer() {
  const server = http.createServer((request, response) => {
    const pathname = decodeURIComponent(new URL(request.url, "http://local").pathname);
    let file = path.resolve(repoRoot, `.${pathname}`);
    if (!file.startsWith(`${repoRoot}${path.sep}`) || !fs.existsSync(file)) { response.writeHead(404); response.end("Not found"); return; }
    if (fs.statSync(file).isDirectory()) file = path.join(file, "index.html");
    const type = ({ ".html": "text/html; charset=utf-8", ".css": "text/css; charset=utf-8", ".js": "text/javascript; charset=utf-8", ".json": "application/json" })[path.extname(file)] || "application/octet-stream";
    response.writeHead(200, { "content-type": type }); fs.createReadStream(file).pipe(response);
  });
  await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
  return { instance: server, url: `http://127.0.0.1:${server.address().port}` };
}
