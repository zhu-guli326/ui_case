const STYLE_VERSION = "20260817-consistency-v1";

const q = (selector) => document.querySelector(selector);
const qa = (selector, root = document) => [...root.querySelectorAll(selector)];
const locale = () => {
  const query = new URL(location.href).searchParams.get("lang");
  if (query === "en" || query === "zh") return query;
  return window.image2I18n?.language === "en" ? "en" : "zh";
};
const localized = (zh, en) => locale() === "en" ? en : zh;

function installStyles() {
  if (document.querySelector('link[data-launcher-live-preview]')) return;
  const link = document.createElement("link");
  link.rel = "stylesheet";
  link.href = new URL(`./launcher-live-preview.css?v=${STYLE_VERSION}`, import.meta.url).href;
  link.dataset.launcherLivePreview = "true";
  document.head.append(link);
}

function neutralizeLegacyCreateLayout() {
  const body = document.body;
  const removeLegacyClass = () => {
    if (body.classList.contains("create-flow-refactored")) body.classList.remove("create-flow-refactored");
  };
  removeLegacyClass();
  const observer = new MutationObserver(removeLegacyClass);
  observer.observe(body, { attributes: true, attributeFilter: ["class"] });
}

function sectionMarkup() {
  return `
    <header class="preview-lab-head">
      <div class="preview-lab-head-copy">
        <div class="flow-label"><span aria-hidden="true">P</span> Live preview</div>
        <h2 id="livePreviewTitle">${localized("最终页面效果", "Final page preview")}</h2>
        <p id="livePreviewIntro">${localized("前面的平台、Design System、颜色与页面模板会同步到这里；任务模式只改变需求，不再改变这个预览模块的结构。", "Platform, design system, color, and page template stay synchronized here. Task modes change requirements, not the preview structure.")}</p>
      </div>
      <span class="preview-lab-badge">${localized("实时联动", "Live sync")}</span>
    </header>
    <div class="preview-toolbar" aria-label="${localized("最终预览控制", "Final preview controls")}">
      <label class="preview-field">
        <span>${localized("页面", "Page")}</span>
        <select id="previewPageTemplate">
          <option value="account">${localized("账户设置 / Account Settings", "Account Settings")}</option>
          <option value="dashboard">${localized("数据面板 / Dashboard", "Dashboard")}</option>
          <option value="commerce">${localized("商品详情 / Product Detail", "Product Detail")}</option>
          <option value="editorial">${localized("内容主页 / Editorial Home", "Editorial Home")}</option>
        </select>
      </label>
      <div class="preview-field">
        <span>${localized("设备", "Device")}</span>
        <div class="preview-segment" id="previewDeviceSegment" role="group" aria-label="${localized("预览设备", "Preview device")}">
          <button type="button" data-size="desktop" aria-pressed="false">Desktop</button>
          <button type="button" data-size="tablet" aria-pressed="false">Tablet</button>
          <button type="button" data-size="mobile" class="is-active" aria-pressed="true">Mobile</button>
        </div>
      </div>
      <div class="preview-field">
        <span>${localized("主题", "Theme")}</span>
        <div class="preview-segment" id="previewThemeSegment" role="group" aria-label="${localized("预览主题", "Preview theme")}">
          <button type="button" data-theme="light" class="is-active" aria-pressed="true">Light</button>
          <button type="button" data-theme="dark" aria-pressed="false">Dark</button>
        </div>
      </div>
      <label class="preview-field">
        <span>${localized("语言", "Language")}</span>
        <select id="previewLanguage">
          <option value="zh">简体中文</option>
          <option value="en">English</option>
        </select>
      </label>
      <div class="preview-current">${localized("当前方案：", "Current system: ")}<b id="previewCurrentSystem">${localized("跟随上方选择", "Follow selection")}</b></div>
    </div>
    <div class="preview-lab-stage" id="previewLabStage" data-theme="light">
      <div class="live-preview-canvas">
        <div class="preview-device live-preview-device" id="livePreviewDevice" data-size="mobile" data-platform="ios" aria-live="polite">
          <div class="live-preview-empty">${localized("正在同步页面预览…", "Synchronizing page preview…")}</div>
        </div>
      </div>
    </div>`;
}

function currentPlatform() {
  return q('.platform-card[aria-checked="true"]')?.dataset.platform || q(".platform-card.is-active")?.dataset.platform || "ios";
}

function init() {
  if (!document.body.classList.contains("launcher-workspace")) return;
  installStyles();
  neutralizeLegacyCreateLayout();

  const shell = q(".launcher-shell");
  const flow = q(".workspace-flow");
  const sourceDevice = q("#previewDevice");
  if (!shell || !flow || !sourceDevice || q("#previewLabSection")) return;

  const section = document.createElement("section");
  section.className = "preview-lab-section";
  section.id = "previewLabSection";
  section.setAttribute("aria-labelledby", "livePreviewTitle");
  section.innerHTML = sectionMarkup();
  flow.insertAdjacentElement("afterend", section);

  const stage = q("#previewLabStage");
  const liveDevice = q("#livePreviewDevice");
  const pageSelect = q("#previewPageTemplate");
  const languageSelect = q("#previewLanguage");
  const currentSystem = q("#previewCurrentSystem");
  if (!stage || !liveDevice || !pageSelect || !languageSelect || !currentSystem) return;

  languageSelect.value = locale();

  function syncSourcePreview() {
    const sourceHtml = sourceDevice.innerHTML.trim();
    liveDevice.innerHTML = sourceHtml || `<div class="live-preview-empty">${localized("暂无可预览内容", "No preview content yet")}</div>`;
    liveDevice.dataset.platform = sourceDevice.dataset.platform || currentPlatform();
    liveDevice.dataset.template = sourceDevice.dataset.template || pageSelect.value || "account";
    const accent = sourceDevice.style.getPropertyValue("--preview-accent") || getComputedStyle(sourceDevice).getPropertyValue("--preview-accent");
    if (accent.trim()) liveDevice.style.setProperty("--preview-accent", accent.trim());
  }

  function syncSystem() {
    currentSystem.textContent = q("#previewSystemName")?.textContent?.trim() || localized("跟随上方选择", "Follow selection");
    syncSourcePreview();
  }

  function setDevice(size) {
    liveDevice.dataset.size = size;
    qa("#previewDeviceSegment button", section).forEach((button) => {
      const active = button.dataset.size === size;
      button.classList.toggle("is-active", active);
      button.setAttribute("aria-pressed", String(active));
    });
  }

  function setTheme(theme) {
    stage.dataset.theme = theme;
    qa("#previewThemeSegment button", section).forEach((button) => {
      const active = button.dataset.theme === theme;
      button.classList.toggle("is-active", active);
      button.setAttribute("aria-pressed", String(active));
    });
  }

  function setDeviceForPlatform(platform) {
    setDevice(platform === "windows" || platform === "macos" ? "desktop" : "mobile");
    liveDevice.dataset.platform = platform;
  }

  qa("#previewDeviceSegment button", section).forEach((button) => {
    button.addEventListener("click", () => setDevice(button.dataset.size));
  });
  qa("#previewThemeSegment button", section).forEach((button) => {
    button.addEventListener("click", () => setTheme(button.dataset.theme));
  });

  const sourceObserver = new MutationObserver(syncSourcePreview);
  sourceObserver.observe(sourceDevice, {
    childList: true,
    subtree: true,
    attributes: true,
    attributeFilter: ["style", "data-platform", "data-template"],
  });

  const systemName = q("#previewSystemName");
  if (systemName) {
    new MutationObserver(syncSystem).observe(systemName, { childList: true, characterData: true, subtree: true });
  }

  window.addEventListener("image2:launcherplatformchange", (event) => {
    const platform = event.detail?.platform || currentPlatform();
    setDeviceForPlatform(platform);
    requestAnimationFrame(syncSourcePreview);
  });

  document.addEventListener("change", (event) => {
    if (event.target.matches('[name="colorTheme"],[name="fontScheme"],#previewPageTemplate,#previewLanguage')) {
      window.setTimeout(syncSystem, 40);
    }
  });

  window.image2I18n?.registerPage?.(() => {
    languageSelect.value = locale();
    window.setTimeout(syncSystem, 40);
  });

  setTheme("light");
  setDeviceForPlatform(currentPlatform());
  syncSystem();
  requestAnimationFrame(syncSourcePreview);
  window.setTimeout(syncSourcePreview, 120);
}

if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init, { once: true });
else init();
