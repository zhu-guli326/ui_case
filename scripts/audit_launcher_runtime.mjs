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

async function visibilityTrace(locator) {
  return locator.evaluate((element) => {
    const trace = [];
    let node = element;
    while (node && node instanceof HTMLElement) {
      const style = getComputedStyle(node);
      const rect = node.getBoundingClientRect();
      trace.push({
        tag: node.tagName.toLowerCase(),
        id: node.id || "",
        className: node.className || "",
        hidden: node.hidden,
        display: style.display,
        visibility: style.visibility,
        opacity: style.opacity,
        width: Math.round(rect.width),
        height: Math.round(rect.height),
      });
      node = node.parentElement;
    }
    return trace;
  });
}

async function modeShape(page) {
  return page.locator('#modeTabs [data-intent="create"]').evaluate((element) => {
    const style = getComputedStyle(element);
    const detail = element.querySelector("small");
    const tabs = element.parentElement;
    return {
      height: Math.round(element.getBoundingClientRect().height),
      radius: style.borderRadius,
      detailDisplay: detail ? getComputedStyle(detail).display : "missing",
      layout: tabs ? getComputedStyle(tabs).display : "missing",
    };
  });
}

function assertCardModeShape(shape, label) {
  if (shape.layout !== "grid") throw new Error(`${label}: task modes are not using the shared grid layout (${JSON.stringify(shape)})`);
  if (shape.height < 60) throw new Error(`${label}: task mode cards collapsed into compact pills (${JSON.stringify(shape)})`);
  if (shape.detailDisplay === "none") throw new Error(`${label}: task mode descriptions disappeared (${JSON.stringify(shape)})`);
  if (/999/.test(shape.radius)) throw new Error(`${label}: task mode cards inherited pill radius (${JSON.stringify(shape)})`);
}

async function choosePlatform(page, platform, expectedName) {
  const button = page.locator(`.platform-card[data-platform="${platform}"]`);
  await button.click();
  if (await button.getAttribute("aria-checked") !== "true") {
    throw new Error(`${expectedName} platform did not become the selected radio`);
  }
  if (await page.locator("#previewDevice").getAttribute("data-platform") !== platform) {
    throw new Error(`${expectedName} platform did not synchronize the design-system preview device`);
  }
  if ((await page.locator("#previewPlatformName").innerText()).trim() !== expectedName) {
    throw new Error(`${expectedName} platform did not synchronize the preview label`);
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
  if (await page.locator("body").evaluate((body) => body.classList.contains("create-flow-refactored"))) {
    throw new Error("legacy Create-only layout class was reintroduced");
  }
  assertCardModeShape(await modeShape(page), "create");

  const createReference = page.locator('.config-section[aria-labelledby="referenceTitle"]');
  if (!(await createReference.isVisible())) {
    throw new Error(`create reference module is missing or hidden: ${JSON.stringify(await visibilityTrace(createReference))}`);
  }

  await page.locator('[name="audience"]').fill("设计团队");
  await page.locator('[name="coreTask"]').fill("创建一个项目工作台");
  await page.locator('[name="requiredPages"]').fill("首页, 项目详情");
  await page.locator('[name="requiredPages"]').blur();
  await page.waitForFunction(() => !document.querySelector("#generatePrompt")?.disabled);

  await choosePlatform(page, "android", "Android");
  await choosePlatform(page, "windows", "Windows");
  await choosePlatform(page, "android", "Android");

  const componentsTab = page.locator('.ds-tab[data-ds-tab="components"]');
  if (!(await componentsTab.isVisible())) {
    throw new Error(`Design System components tab is hidden: ${JSON.stringify(await visibilityTrace(componentsTab))}`);
  }
  await componentsTab.click();
  if (await componentsTab.getAttribute("aria-selected") !== "true") {
    throw new Error("Design System components tab did not activate");
  }
  if (await page.locator('[data-ds-panel="components"]').isHidden()) {
    throw new Error("Design System components panel stayed hidden");
  }

  const livePreview = page.locator("#previewLabSection");
  await livePreview.waitFor({ state: "visible" });
  await page.waitForFunction(() => {
    const device = document.querySelector("#livePreviewDevice");
    return Boolean(device && device.children.length && !device.querySelector(".live-preview-empty"));
  });
  if ((await page.locator("#livePreviewDevice").innerHTML()).trim().length < 100) {
    throw new Error("final Live Preview is visually empty");
  }

  await page.locator("#previewPageTemplate").selectOption("dashboard");
  await page.waitForFunction(() => document.querySelector("#livePreviewDevice .pt-kpis, #livePreviewDevice .pm-shell"));
  await page.locator('#previewThemeSegment [data-theme="dark"]').click();
  if (await page.locator("#previewLabStage").getAttribute("data-theme") !== "dark") {
    throw new Error("Live Preview dark theme did not activate");
  }

  await choosePlatform(page, "windows", "Windows");
  await page.waitForFunction(() => document.querySelector("#livePreviewDevice")?.dataset.size === "desktop");
  if (await page.locator("#livePreviewDevice").getAttribute("data-platform") !== "windows") {
    throw new Error("final Live Preview did not synchronize Windows platform");
  }
  await choosePlatform(page, "android", "Android");

  await page.locator('#modeTabs [data-intent="rebuild"]').click();
  await page.waitForFunction(() => new URL(location.href).searchParams.get("intent") === "rebuild");
  if (!/参考图还原/.test(await page.locator("#pageTitle").innerText())) {
    throw new Error("rebuild title did not synchronize with the selected intent");
  }
  assertCardModeShape(await modeShape(page), "rebuild");
  const rebuildReference = page.locator('.config-section[aria-labelledby="referenceTitle"]');
  if (!(await rebuildReference.isVisible())) {
    throw new Error(`rebuild reference module is missing or hidden: ${JSON.stringify(await visibilityTrace(rebuildReference))}`);
  }
  if (!(await page.locator("#previewLabSection").isVisible())) {
    throw new Error("Live Preview disappeared after switching to Rebuild");
  }

  await page.locator('#modeTabs [data-intent="create"]').click();
  await page.waitForFunction(() => new URL(location.href).searchParams.get("intent") === "create");
  assertCardModeShape(await modeShape(page), "create-after-round-trip");
  if (await page.locator('[name="audience"]').inputValue() !== "设计团队") {
    throw new Error("create draft was not preserved after switching intents");
  }
  if (!(await page.locator('.config-section[aria-labelledby="referenceTitle"]').isVisible())) {
    throw new Error("Create reference module disappeared after the intent round-trip");
  }
});

await inspect("launcher.html?lang=en&intent=create", async (page) => {
  if (await page.locator("html").getAttribute("lang") !== "en") throw new Error("html lang did not switch to en");
  if (!/create/i.test(await page.locator("#pageTitle").innerText())) throw new Error("English create title did not render");
  if (!/choose a task mode/i.test(await page.locator("#modeTitle").innerText())) throw new Error("English shell copy did not render");
  if (!/define task/i.test(await page.locator('.launcher-step-link[data-launcher-step="task"] strong').innerText())) {
    throw new Error("English step navigation did not render");
  }
  assertCardModeShape(await modeShape(page), "english-create");
  await page.locator("#previewLabSection").waitFor({ state: "visible" });
  if (!/final page preview/i.test(await page.locator("#livePreviewTitle").innerText())) {
    throw new Error("English Live Preview heading did not render");
  }
});

await browser.close();
console.log("Launcher runtime audit passed: stable task-mode cards, create/rebuild reference modules, readiness, repeated platform switching, Design System tabs, populated Live Preview, and zh/en shell.");
