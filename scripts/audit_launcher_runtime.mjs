import { chromium } from "playwright";

const baseUrl = process.env.IMAGE2_UI_BASE_URL || "http://127.0.0.1:4174";
const browser = await chromium.launch({ headless: true });

async function inspect(url, run) {
  const context = await browser.newContext({ viewport: { width: 1440, height: 1000 } });
  const page = await context.newPage();
  const errors = [];
  page.on("pageerror", (error) => errors.push(error.message));
  try {
    await page.goto(`${baseUrl}/${url}`, { waitUntil: "networkidle" });
    await page.locator("#intentForm").waitFor({ state: "visible" });
    await run(page);
    if (errors.length) throw new Error(`runtime page errors: ${errors.join(" | ")}`);
  } finally {
    await context.close();
  }
}

async function modeShape(page) {
  return page.locator('#modeTabs [data-intent="create"]').evaluate((element) => {
    const style = getComputedStyle(element);
    return {
      height: Math.round(element.getBoundingClientRect().height),
      radius: style.borderRadius,
      detailDisplay: getComputedStyle(element.querySelector("small")).display,
      layout: getComputedStyle(element.parentElement).display,
    };
  });
}

function assertCardModeShape(shape, label) {
  if (shape.layout !== "grid") throw new Error(`${label}: task modes are not a grid`);
  if (shape.height < 56) throw new Error(`${label}: task modes collapsed into pills`);
  if (shape.detailDisplay === "none") throw new Error(`${label}: task descriptions disappeared`);
  if (/999/.test(shape.radius)) throw new Error(`${label}: task mode inherited pill radius`);
}

async function choosePlatform(page, platform, expectedName) {
  const button = page.locator(`.platform-card[data-platform="${platform}"]`);
  await button.click();
  if (await button.getAttribute("aria-checked") !== "true") throw new Error(`${expectedName} was not selected`);
  if (await page.locator("#previewDevice").getAttribute("data-platform") !== platform) throw new Error(`${expectedName} did not sync source preview`);
  if ((await page.locator("#previewPlatformName").innerText()).trim() !== expectedName) throw new Error(`${expectedName} label did not sync`);
}

await inspect("launcher.html?lang=zh&intent=create", async (page) => {
  if (!/从零创建/.test(await page.locator("#pageTitle").innerText())) throw new Error("create title did not render");
  assertCardModeShape(await modeShape(page), "create");
  if (await page.locator("body").evaluate((body) => body.classList.contains("create-flow-refactored"))) throw new Error("legacy Create layout returned");

  const steps = await page.locator(".launcher-step-link").count();
  if (steps !== 3) throw new Error(`expected exactly three workflow steps, got ${steps}`);
  if (await page.locator('.ds-tab').count()) throw new Error("Design System tabs still exist in simplified mode");
  if (!(await page.locator('[data-ds-panel="foundation"]').isVisible())) throw new Error("Foundation summary is hidden");
  if (!(await page.locator('[data-ds-panel="components"]').isVisible())) throw new Error("Components summary is hidden");

  const reference = page.locator('.config-section[aria-labelledby="referenceTitle"]');
  if (!(await reference.isVisible())) throw new Error("Create reference module is hidden");

  await page.locator('[name="audience"]').fill("设计团队");
  await page.locator('[name="coreTask"]').fill("创建一个项目工作台");
  await page.locator('[name="requiredPages"]').fill("首页, 项目详情");
  await page.locator('[name="requiredPages"]').blur();
  await page.waitForFunction(() => !document.querySelector("#generatePrompt")?.disabled);

  const preview = page.locator("#previewLabSection");
  await preview.waitFor({ state: "visible" });
  const previewParent = await preview.evaluate((el) => el.parentElement?.id || "");
  if (previewParent !== "resultStageBody") throw new Error(`Live Preview mounted outside result step: ${previewParent}`);
  await page.waitForFunction(() => {
    const device = document.querySelector("#livePreviewDevice");
    return Boolean(device && device.children.length && !device.querySelector(".live-preview-empty"));
  });

  const outputPosition = await page.locator("#outputPanel").evaluate((el) => getComputedStyle(el).position);
  if (outputPosition === "sticky" || outputPosition === "fixed") throw new Error(`output is still competing as ${outputPosition}`);

  await page.locator("#previewPageTemplate").selectOption("dashboard");
  await page.waitForFunction(() => document.querySelector("#livePreviewDevice .pt-kpis, #livePreviewDevice .pm-shell"));
  await page.locator('#previewThemeSegment [data-theme="dark"]').click();
  if (await page.locator("#previewLabStage").getAttribute("data-theme") !== "dark") throw new Error("dark preview did not activate");

  await choosePlatform(page, "windows", "Windows");
  await page.waitForFunction(() => document.querySelector("#livePreviewDevice")?.dataset.size === "desktop");
  await choosePlatform(page, "android", "Android");

  for (const intent of ["rebuild", "improve", "explore", "design-system", "create"]) {
    await page.locator(`#modeTabs [data-intent="${intent}"]`).click();
    await page.waitForFunction((value) => new URL(location.href).searchParams.get("intent") === value, intent);
    assertCardModeShape(await modeShape(page), intent);
    if (!(await page.locator("#designDecisions").isVisible())) throw new Error(`${intent}: design step disappeared`);
    if (!(await page.locator("#resultStage").isVisible())) throw new Error(`${intent}: result step disappeared`);
    if (await page.locator('.ds-tab').count()) throw new Error(`${intent}: Design System tabs reappeared`);
  }

  if (await page.locator('[name="audience"]').inputValue() !== "设计团队") throw new Error("create draft was not preserved");
});

await inspect("launcher.html?lang=en&intent=create", async (page) => {
  if (await page.locator("html").getAttribute("lang") !== "en") throw new Error("html lang did not switch to en");
  if (!/create/i.test(await page.locator("#pageTitle").innerText())) throw new Error("English create title did not render");
  assertCardModeShape(await modeShape(page), "english-create");
  await page.locator("#previewLabSection").waitFor({ state: "visible" });
  if (!/page preview/i.test(await page.locator("#livePreviewTitle").innerText())) throw new Error("English page preview heading did not render");
});

await browser.close();
console.log("Launcher runtime audit passed: one three-step flow, no duplicate Design System preview tabs, visible system summary, populated final preview, non-sticky output, stable intent switching, and zh/en runtime.");
