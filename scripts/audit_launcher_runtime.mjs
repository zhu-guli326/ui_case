import { chromium } from "playwright";

const baseUrl = process.env.IMAGE2_UI_BASE_URL || "http://127.0.0.1:4174";
const browser = await chromium.launch({ headless: true });

async function inspect(url, run) {
  const context = await browser.newContext({ viewport: { width: 1440, height: 1000 } });
  const page = await context.newPage();
  const pageErrors = [];
  page.on("pageerror", (error) => pageErrors.push(error.message));
  try {
    await page.goto(`${baseUrl}/${url}`, { waitUntil: "networkidle" });
    await page.locator("#intentForm").waitFor({ state: "visible" });
    await run(page);
    if (pageErrors.length) throw new Error(`runtime page errors: ${pageErrors.join(" | ")}`);
  } finally {
    await context.close();
  }
}

await inspect("launcher.html?lang=zh&intent=create", async (page) => {
  await page.locator('#modeTabs [data-intent="create"]').waitFor();
  if (await page.locator('#modeTabs [data-intent="create"]').getAttribute("aria-selected") !== "true") {
    throw new Error("create task tab is not selected");
  }
  if (!/从零创建/.test(await page.locator("#pageTitle").innerText())) {
    throw new Error("create page title did not localize for zh");
  }

  await page.locator('[name="audience"]').fill("设计团队");
  await page.locator('[name="coreTask"]').fill("创建一个项目工作台");
  await page.locator('[name="requiredPages"]').fill("首页, 项目详情");
  await page.locator('[name="requiredPages"]').blur();
  await page.waitForFunction(() => !document.querySelector("#generatePrompt")?.disabled);

  await page.locator('.platform-card[data-platform="android"]').click();
  if (await page.locator('.platform-card[data-platform="android"]').getAttribute("aria-checked") !== "true") {
    throw new Error("Android platform did not become the selected radio");
  }
  if (await page.locator("#previewDevice").getAttribute("data-platform") !== "android") {
    throw new Error("platform selection did not synchronize the preview");
  }

  await page.locator('.ds-tab[data-ds-tab="components"]').click();
  if (await page.locator('.ds-tab[data-ds-tab="components"]').getAttribute("aria-selected") !== "true") {
    throw new Error("Design System components tab did not activate");
  }
  if (await page.locator('[data-ds-panel="components"]').isHidden()) {
    throw new Error("Design System components panel stayed hidden");
  }

  await page.locator('#modeTabs [data-intent="rebuild"]').click();
  await page.waitForFunction(() => new URL(location.href).searchParams.get("intent") === "rebuild");
  if (!/参考图还原/.test(await page.locator("#pageTitle").innerText())) {
    throw new Error("rebuild title did not synchronize with the selected intent");
  }
});

await inspect("launcher.html?lang=en&intent=create", async (page) => {
  if (await page.locator("html").getAttribute("lang") !== "en") throw new Error("html lang did not switch to en");
  if (!/create/i.test(await page.locator("#pageTitle").innerText())) throw new Error("English create title did not render");
  if (!/choose a task mode/i.test(await page.locator("#modeTitle").innerText())) throw new Error("English shell copy did not render");
  if (!/define task/i.test(await page.locator('.launcher-step-link[data-launcher-step="task"] strong').innerText())) {
    throw new Error("English step navigation did not render");
  }
});

await browser.close();
console.log("Launcher runtime audit passed: zh/create/rebuild, readiness, platform, Design System tabs, and en shell.");
