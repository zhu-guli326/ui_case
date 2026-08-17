import { chromium } from "playwright";

const baseUrl = process.env.IMAGE2_UI_BASE_URL || "http://127.0.0.1:4174";
const browser = await chromium.launch({ headless: true });

async function inspect(url, run) {
  const context = await browser.newContext({ viewport: { width: 1440, height: 1000 } });
  const page = await context.newPage();
  const errors = [];
  page.on("pageerror", (error) => errors.push(error.stack || error.message));
  try {
    await page.goto(`${baseUrl}/${url}`, { waitUntil: "networkidle" });
    await page.locator("#intentForm").waitFor({ state: "visible" });
    await run(page);
    if (errors.length) throw new Error(`runtime page errors:\n${errors.join("\n---\n")}`);
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

async function assertModeVisualState(page, intent) {
  const selectedCount = await page.locator('#modeTabs [aria-selected="true"]').count();
  if (selectedCount !== 1) throw new Error(`${intent}: expected one visually selected task mode, got ${selectedCount}`);

  const state = await page.locator(`#modeTabs [data-intent="${intent}"]`).evaluate((element) => {
    const style = getComputedStyle(element);
    const badge = getComputedStyle(element, "::after");
    const title = element.querySelector("strong")?.getBoundingClientRect();
    const rect = element.getBoundingClientRect();
    const badgeWidth = Number.parseFloat(badge.width) || 0;
    const badgeRight = Number.parseFloat(badge.right) || 0;
    const badgeLeft = rect.right - badgeRight - badgeWidth;
    return {
      selected: element.getAttribute("aria-selected"),
      paddingRight: Number.parseFloat(style.paddingRight) || 0,
      badgeContent: badge.content,
      badgePosition: badge.position,
      badgeLeftRule: badge.left,
      badgeRightRule: badge.right,
      badgeTopRule: badge.top,
      badgeBottomRule: badge.bottom,
      badgeWidth: badge.width,
      badgeHeight: badge.height,
      titleRight: title?.right || 0,
      badgeLeft,
    };
  });

  if (state.selected !== "true") throw new Error(`${intent}: task mode is not aria-selected: ${JSON.stringify(state)}`);
  if (!/✓/.test(state.badgeContent)) throw new Error(`${intent}: selected badge is missing: ${JSON.stringify(state)}`);
  if (state.badgePosition !== "absolute") throw new Error(`${intent}: selected badge is not absolutely positioned: ${JSON.stringify(state)}`);
  if (state.badgeLeftRule !== "auto" || state.badgeBottomRule !== "auto") {
    throw new Error(`${intent}: legacy underline geometry leaked into selected badge: ${JSON.stringify(state)}`);
  }
  if (Math.abs(Number.parseFloat(state.badgeWidth) - 18) > 1 || Math.abs(Number.parseFloat(state.badgeHeight) - 18) > 1) {
    throw new Error(`${intent}: selected badge geometry drifted: ${JSON.stringify(state)}`);
  }
  if (state.paddingRight < 36) throw new Error(`${intent}: selected title has no reserved badge space: ${JSON.stringify(state)}`);
  if (state.titleRight > state.badgeLeft - 4) throw new Error(`${intent}: selected badge overlaps task title: ${JSON.stringify(state)}`);

  const inactivePseudo = await page.locator(`#modeTabs [data-intent]:not([data-intent="${intent}"])`).first().evaluate((element) => getComputedStyle(element, "::after").content);
  if (inactivePseudo && inactivePseudo !== "none" && inactivePseudo !== "normal" && inactivePseudo !== '""') {
    throw new Error(`${intent}: inactive task mode still paints a legacy pseudo-element: ${inactivePseudo}`);
  }
}

async function choosePlatform(page, platform, expectedSize) {
  const button = page.locator(`.platform-card[data-platform="${platform}"]`);
  await button.click();
  if (await button.getAttribute("aria-checked") !== "true") throw new Error(`${platform} was not selected`);
  await page.waitForFunction(({ platform, expectedSize }) => {
    const device = document.querySelector("#livePreviewDevice");
    return device?.dataset.platform === platform && device?.dataset.size === expectedSize;
  }, { platform, expectedSize });
}

async function readDesignState(page, themeId) {
  return page.evaluate((requestedThemeId) => {
    const input = document.querySelector(`input[name="colorTheme"][value="${requestedThemeId}"]`);
    const checked = document.querySelector('input[name="colorTheme"]:checked');
    const workbench = document.querySelector("#designSystemWorkbench");
    const device = document.querySelector("#livePreviewDevice");
    return {
      requestedThemeId,
      requestedSelected: Boolean(input?.checked),
      checkedThemeId: checked?.value || null,
      workbenchThemeId: workbench?.dataset.themeId || null,
      workbenchThemeName: workbench?.dataset.themeName || null,
      workbenchSystemName: workbench?.dataset.systemName || null,
      workbenchAccent: workbench?.dataset.accent || null,
      previewSystemName: document.querySelector("#previewCurrentSystem")?.textContent?.trim() || null,
      previewAccent: device?.style.getPropertyValue("--preview-accent").trim() || null,
    };
  }, themeId);
}

async function chooseDesignTheme(page, themeId, expectedSystem, expectedAccent) {
  const card = page.locator(`.color-theme-card:has(input[name="colorTheme"][value="${themeId}"])`);
  if (!(await card.count())) throw new Error(`missing color theme ${themeId}`);
  const choice = card.locator(".color-theme-choice");
  await choice.click();

  try {
    await page.waitForFunction((requestedThemeId) => {
      return Boolean(document.querySelector(`input[name="colorTheme"][value="${requestedThemeId}"]`)?.checked);
    }, themeId, { timeout: 3000 });
  } catch {
    const state = await readDesignState(page, themeId);
    throw new Error(`${themeId}: card click did not select requested theme: ${JSON.stringify(state)}`);
  }

  await page.waitForTimeout(150);
  const state = await readDesignState(page, themeId);
  const expectedAccentNormalized = expectedAccent.toLowerCase();
  const mismatches = [];
  if (!state.requestedSelected) mismatches.push(`selected=${state.requestedSelected}`);
  if (state.checkedThemeId !== themeId) mismatches.push(`checkedThemeId=${state.checkedThemeId}`);
  if (state.workbenchThemeId !== themeId) mismatches.push(`workbenchThemeId=${state.workbenchThemeId}`);
  if (state.workbenchSystemName !== expectedSystem) mismatches.push(`systemName=${state.workbenchSystemName}`);
  if ((state.workbenchAccent || "").toLowerCase() !== expectedAccentNormalized) mismatches.push(`workbenchAccent=${state.workbenchAccent}`);
  if ((state.previewAccent || "").toLowerCase() !== expectedAccentNormalized) mismatches.push(`previewAccent=${state.previewAccent}`);
  if (state.previewSystemName !== expectedSystem) mismatches.push(`previewSystemName=${state.previewSystemName}`);
  if (mismatches.length) {
    throw new Error(`${themeId}: design-state propagation mismatch (${mismatches.join(", ")}): ${JSON.stringify(state)}`);
  }
}

await inspect("launcher.html?lang=zh&intent=create", async (page) => {
  if (!/从零创建/.test(await page.locator("#pageTitle").innerText())) throw new Error("create title did not render");
  assertCardModeShape(await modeShape(page), "create");
  await assertModeVisualState(page, "create");
  if (await page.locator("body").evaluate((body) => body.classList.contains("create-flow-refactored"))) throw new Error("legacy Create layout returned");

  const steps = await page.locator(".launcher-step-link").count();
  if (steps !== 3) throw new Error(`expected exactly three workflow steps, got ${steps}`);
  if (await page.locator(".ds-tab").count()) throw new Error("Design System tabs still exist in simplified mode");
  if (!(await page.locator('[data-ds-panel="foundation"]').isVisible())) throw new Error("Foundation summary is hidden");
  if (!(await page.locator('[data-ds-panel="components"]').isVisible())) throw new Error("Components summary is hidden");

  const reference = page.locator('.config-section[aria-labelledby="referenceTitle"]');
  if (!(await reference.isVisible())) throw new Error("Create reference module is hidden");

  const structuredBrief = page.locator(".structured-brief").first();
  await structuredBrief.waitFor({ state: "visible" });
  const briefPseudo = await structuredBrief.evaluate((el) => {
    const style = getComputedStyle(el, "::before");
    return { start: style.gridColumnStart, end: style.gridColumnEnd };
  });
  if (briefPseudo.start !== "1" || !["-1", "4"].includes(briefPseudo.end)) {
    throw new Error(`structured brief heading does not span the full grid: ${JSON.stringify(briefPseudo)}`);
  }
  const briefFieldTops = await structuredBrief.locator(".text-field").evaluateAll((fields) => fields.slice(0, 3).map((field) => Math.round(field.getBoundingClientRect().top)));
  if (briefFieldTops.length >= 3 && Math.max(...briefFieldTops) - Math.min(...briefFieldTops) > 3) {
    throw new Error(`structured brief fields are staggered instead of aligned: ${JSON.stringify(briefFieldTops)}`);
  }
  if (await page.locator(".font-preview-shell").isVisible()) throw new Error("obsolete Northstar font specimen is still visible");

  const outputPosition = await page.locator("#outputPanel").evaluate((el) => getComputedStyle(el).position);
  if (outputPosition !== "fixed") throw new Error(`prompt output is not viewport-fixed: ${outputPosition}`);
  const outputBeforeScroll = await page.locator("#outputPanel").boundingBox();
  if (!outputBeforeScroll) throw new Error("floating prompt rail has no measurable layout box");
  if (Math.abs(outputBeforeScroll.y - 80) > 2) throw new Error(`floating prompt rail top offset drifted: ${JSON.stringify(outputBeforeScroll)}`);

  await page.locator('[name="audience"]').fill("设计团队");
  await page.locator('[name="coreTask"]').fill("创建一个项目工作台");
  await page.locator('[name="requiredPages"]').fill("首页, 项目详情");
  await page.locator('[name="requiredPages"]').blur();
  await page.waitForFunction(() => !document.querySelector("#generatePrompt")?.disabled);

  await page.locator("#designDecisions").scrollIntoViewIfNeeded();
  await page.waitForTimeout(120);
  const outputAfterScroll = await page.locator("#outputPanel").boundingBox();
  if (!outputAfterScroll) throw new Error("floating prompt rail disappeared after scrolling");
  if (Math.abs(outputAfterScroll.y - outputBeforeScroll.y) > 2 || Math.abs(outputAfterScroll.x - outputBeforeScroll.x) > 2) {
    throw new Error(`floating prompt rail moved with page scroll: before=${JSON.stringify(outputBeforeScroll)} after=${JSON.stringify(outputAfterScroll)}`);
  }

  const preview = page.locator("#previewLabSection");
  await preview.waitFor({ state: "visible" });
  const previewParent = await preview.evaluate((el) => el.parentElement?.id || "");
  if (previewParent !== "resultStageBody") throw new Error(`Live Preview mounted outside result step: ${previewParent}`);
  await page.waitForFunction(() => Boolean(document.querySelector("#livePreviewDevice .preview-template")));

  const [previewBox, outputBox] = await Promise.all([
    page.locator("#resultStageBody").boundingBox(),
    page.locator("#outputPanel").boundingBox(),
  ]);
  if (!previewBox || !outputBox) throw new Error("Step 03 preview or prompt rail has no measurable layout box");
  if (outputBox.x < previewBox.x + previewBox.width - 2) {
    throw new Error(`floating prompt overlaps the left workflow: preview=${JSON.stringify(previewBox)} output=${JSON.stringify(outputBox)}`);
  }

  await chooseDesignTheme(page, "google-material-3", "Material 3", "#6750a4");
  await chooseDesignTheme(page, "airbnb", "Airbnb Visual System", "#e00b41");

  await page.locator("#previewPageTemplate").selectOption("dashboard");
  await page.waitForFunction(() => document.querySelector("#livePreviewDevice .pt-kpis"));
  await page.locator('#previewThemeSegment [data-theme="dark"]').click();
  if (await page.locator("#previewLabStage").getAttribute("data-theme") !== "dark") throw new Error("dark preview did not activate");

  await choosePlatform(page, "windows", "desktop");
  await choosePlatform(page, "android", "mobile");

  for (const intent of ["rebuild", "improve", "explore", "design-system", "create"]) {
    await page.locator(`#modeTabs [data-intent="${intent}"]`).click();
    await page.waitForFunction((value) => new URL(location.href).searchParams.get("intent") === value, intent);
    assertCardModeShape(await modeShape(page), intent);
    await assertModeVisualState(page, intent);
    if (!(await page.locator("#designDecisions").isVisible())) throw new Error(`${intent}: design step disappeared`);
    if (!(await page.locator("#resultStage").isVisible())) throw new Error(`${intent}: result step disappeared`);
    if (await page.locator(".ds-tab").count()) throw new Error(`${intent}: Design System tabs reappeared`);
  }

  if (await page.locator('[name="audience"]').inputValue() !== "设计团队") throw new Error("create draft was not preserved");
});

await inspect("launcher.html?lang=en&intent=create", async (page) => {
  if (await page.locator("html").getAttribute("lang") !== "en") throw new Error("html lang did not switch to en");
  if (!/create/i.test(await page.locator("#pageTitle").innerText())) throw new Error("English create title did not render");
  assertCardModeShape(await modeShape(page), "english-create");
  await assertModeVisualState(page, "create");
  await page.locator("#previewLabSection").waitFor({ state: "visible" });
  if (!/page preview/i.test(await page.locator("#livePreviewTitle").innerText())) throw new Error("English page preview heading did not render");
  const pseudo = await page.locator(".structured-brief").first().evaluate((el) => getComputedStyle(el, "::before").content).catch(() => "");
  if (pseudo && /补齐关键信息/.test(pseudo)) throw new Error("English structured brief still exposes Chinese pseudo-copy");
  if (await page.locator(".font-preview-shell").isVisible()) throw new Error("obsolete font specimen is visible in English mode");
});

await browser.close();
console.log("Launcher runtime audit passed: unified task-control states, non-overlapping selected badges, aligned structured brief, removed font specimen, real design-token propagation, one final preview, viewport-fixed prompt output across desktop scrolling, stable intent switching, and zh/en runtime.");
