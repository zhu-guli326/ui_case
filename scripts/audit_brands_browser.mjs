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
  const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
  const errors = watchErrors(page);
  await page.goto(`${server.url}/brands.html`, { waitUntil: "networkidle" });
  await page.waitForSelector(".system-card");
  const initial = await page.evaluate(() => ({
    systems: document.querySelectorAll(".system-card").length,
    previews: document.querySelectorAll(".mini-preview").length,
    previewLinks: document.querySelectorAll('.system-card .preview-button').length,
    labControls: document.querySelectorAll(".lab-commandbar, #previewStage, #settingsPanel").length,
    systemCount: document.querySelector("#catalogSystemCount")?.textContent,
    componentCount: document.querySelector("#catalogComponentCount")?.textContent,
    columns: getComputedStyle(document.querySelector("#systemCardGrid")).gridTemplateColumns.split(" ").length,
    overflow: document.documentElement.scrollWidth > document.documentElement.clientWidth + 1,
  }));
  if (initial.systems !== 19 || initial.previews !== 19 || initial.previewLinks !== 19 || initial.labControls !== 0 || initial.systemCount !== "19" || initial.componentCount !== "57" || initial.columns !== 3 || initial.overflow) failures.push(`desktop catalog invalid: ${JSON.stringify(initial)}`);
  const desktop = path.join(outputDir, "systems-catalog-desktop-1440.png");
  await page.screenshot({ path: desktop, fullPage: false });
  screenshots.push(desktop);

  await page.selectOption('#catalogFilters [name="platform"]', "vue");
  const vueSystems = await page.locator(".system-card").count();
  if (vueSystems < 5) failures.push(`Vue filter rendered only ${vueSystems} systems`);
  await page.selectOption('#catalogFilters [name="platform"]', "");
  await page.fill('.catalog-search [name="query"]', "Carbon");
  if (await page.locator(".system-card").count() !== 1) failures.push("Carbon search did not render one system");
  await page.locator(".system-card [data-component-reference]").click();
  const detail = await page.evaluate(() => ({ open: document.querySelector("#referenceDialog")?.open, sections: document.querySelectorAll(".component-reference-grid section").length }));
  if (!detail.open || detail.sections !== 4) failures.push(`component detail invalid: ${JSON.stringify(detail)}`);
  await page.locator("#referenceDialog").evaluate((element) => element.close());

  await page.setViewportSize({ width: 390, height: 844 });
  await page.fill('.catalog-search [name="query"]', "");
  const mobile = await page.evaluate(() => ({
    systems: document.querySelectorAll(".system-card").length,
    columns: getComputedStyle(document.querySelector("#systemCardGrid")).gridTemplateColumns.split(" ").length,
    overflow: document.documentElement.scrollWidth > document.documentElement.clientWidth + 1,
  }));
  if (mobile.systems !== 19 || mobile.columns !== 1 || mobile.overflow) failures.push(`mobile catalog invalid: ${JSON.stringify(mobile)}`);
  const mobileShot = path.join(outputDir, "systems-catalog-mobile-390.png");
  await page.screenshot({ path: mobileShot, fullPage: false });
  screenshots.push(mobileShot);
  failures.push(...errors.map((error) => `console: ${error}`));
  console.log(JSON.stringify({ status: failures.length ? "fail" : "pass", playwright: playwright.source, initial, detail, mobile, screenshots, failures }, null, 2));
  process.exitCode = failures.length ? 2 : 0;
} finally {
  await browser.close();
  await new Promise((resolve) => server.instance.close(resolve));
}

function watchErrors(page) {
  const errors = [];
  page.on("console", (message) => { if (message.type() === "error" && message.location().url !== "https://api.github.com/repos/zhu-guli326/image2_UI_skill") errors.push(message.text()); });
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
