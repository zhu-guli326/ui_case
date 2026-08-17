const STORAGE_KEY = "image2-ui-target-platform";

const profiles = {
  apple: { match: /Apple|苹果|System/i, name: "Apple System", font: "SF Pro", stack: "SF Pro Display · SF Pro Text · SF Mono", type: "Large Title 34 / Title 28 / Headline 17 / Body 17 / Caption 12", colors: ["#0a84ff", "#ffffff", "#1d1d1f", "#f2f2f7"], radius: "12 px", spacing: "8 pt", border: "1 px", density: "Comfortable" },
  material: { match: /Material/i, name: "Material 3", font: "Roboto Flex", stack: "Roboto Flex · Roboto · system-ui", type: "Display 45 / Headline 32 / Title 22 / Body 16 / Label 14", colors: ["#6750a4", "#fffbfe", "#1d1b20", "#e7e0ec"], radius: "16 px", spacing: "8 dp", border: "1 px", density: "Comfortable" },
  ant: { match: /Ant/i, name: "Ant Design", font: "Inter / system-ui", stack: "Inter · -apple-system · BlinkMacSystemFont · Segoe UI", type: "Title 24 / Heading 20 / Body 14 / Caption 12", colors: ["#1677ff", "#ffffff", "#1f1f1f", "#f5f5f5"], radius: "6 px", spacing: "8 px", border: "1 px", density: "Compact" },
  fluent: { match: /Fluent/i, name: "Fluent 2", font: "Segoe UI Variable", stack: "Segoe UI Variable · Segoe UI · system-ui", type: "Title 28 / Subtitle 20 / Body 14 / Caption 12", colors: ["#0f6cbd", "#ffffff", "#242424", "#f5f5f5"], radius: "4–8 px", spacing: "4 px", border: "1 px", density: "Comfortable" },
  carbon: { match: /Carbon|IBM/i, name: "Carbon", font: "IBM Plex Sans", stack: "IBM Plex Sans · IBM Plex Mono · sans-serif", type: "Heading 32 / Productive 20 / Body 14 / Helper 12", colors: ["#0f62fe", "#ffffff", "#161616", "#f4f4f4"], radius: "0–4 px", spacing: "8 px", border: "1 px", density: "Dense" },
  primer: { match: /Primer/i, name: "Primer", font: "-apple-system", stack: "-apple-system · BlinkMacSystemFont · Segoe UI · sans-serif", type: "Display 40 / Heading 24 / Body 14 / Small 12", colors: ["#0969da", "#ffffff", "#1f2328", "#f6f8fa"], radius: "6 px", spacing: "8 px", border: "1 px", density: "Compact" },
  spectrum: { match: /Spectrum|Adobe/i, name: "Spectrum", font: "Adobe Clean", stack: "Adobe Clean · system-ui · sans-serif", type: "Heading 28 / Detail 18 / Body 14 / Label 12", colors: ["#1473e6", "#ffffff", "#2c2c2c", "#f5f5f5"], radius: "4 px", spacing: "8 px", border: "1 px", density: "Comfortable" },
  generic: { match: /.*/, name: "Brand Visual System", font: "Inter", stack: "Inter · system-ui · sans-serif", type: "Display 36 / Heading 24 / Body 16 / Caption 12", colors: ["#176f43", "#ffffff", "#202421", "#f1f4f2"], radius: "10 px", spacing: "8 px", border: "1 px", density: "Balanced" },
};

const platformCopy = {
  ios: {
    name: "iOS",
    badge: "Mobile",
    zh: ["iOS 推荐：", "Apple HIG + SF Pro + iOS 原生组件，并自动遵守 Safe Area。"],
    en: ["iOS recommendation:", "Apple HIG + SF Pro + native iOS components with Safe Area support."],
  },
  android: {
    name: "Android",
    badge: "Mobile",
    zh: ["Android 推荐：", "Material 3 + Roboto + Android 原生导航与触控尺寸。"],
    en: ["Android recommendation:", "Material 3 + Roboto + native Android navigation and touch targets."],
  },
  windows: {
    name: "Windows",
    badge: "Desktop",
    zh: ["Windows 推荐：", "Fluent 2 + Segoe UI Variable + 桌面窗口与键鼠交互。"],
    en: ["Windows recommendation:", "Fluent 2 + Segoe UI Variable + desktop window and pointer conventions."],
  },
  macos: {
    name: "macOS",
    badge: "Desktop",
    zh: ["macOS 推荐：", "Apple HIG + SF Pro + macOS 窗口、Toolbar、Sidebar 与键鼠交互。"],
    en: ["macOS recommendation:", "Apple HIG + SF Pro + macOS windows, toolbars, sidebars, and pointer conventions."],
  },
};

const q = (selector) => document.querySelector(selector);
const qa = (selector) => [...document.querySelectorAll(selector)];
const language = () => window.image2I18n?.language === "en" || new URL(location.href).searchParams.get("lang") === "en" ? "en" : "zh";

function activeThemeText() {
  const grid = q("#colorThemeGrid");
  if (!grid) return "";
  const checked = grid.querySelector("input:checked");
  const card = checked?.closest(".color-theme-card") || grid.querySelector(".is-selected,[aria-checked='true'],[aria-pressed='true']");
  return (card?.innerText || checked?.value || "").trim();
}

function profileFor(text) {
  return Object.values(profiles).find((profile) => profile !== profiles.generic && profile.match.test(text)) || profiles.generic;
}

function renderProfile() {
  const workbench = q("#designSystemWorkbench");
  if (!workbench) return;
  const profile = profileFor(activeThemeText());
  q("#previewSystemName").textContent = profile.name;
  q("#dsFontSample").textContent = profile.font;
  q("#dsFontStack").textContent = profile.stack;
  q("#dsTypeScale").textContent = profile.type;
  q("#dsRadius").textContent = profile.radius;
  q("#dsSpacing").textContent = profile.spacing;
  q("#dsBorder").textContent = profile.border;
  q("#dsDensity").textContent = profile.density;
  qa("#dsSwatches .ds-swatch").forEach((swatch, index) => {
    if (profile.colors[index]) swatch.style.setProperty("--swatch", profile.colors[index]);
  });
  q("#previewDevice")?.style.setProperty("--preview-accent", profile.colors[0]);
  if (q("#dsDemoButton")) q("#dsDemoButton").style.background = profile.colors[0];
  q("#dsWorkbenchTitle").textContent = `${profile.name} · ${language() === "en" ? "system details" : "完整规范"}`;
  q("#dsWorkbenchSubtitle").textContent = language() === "en"
    ? "Typography, tokens, component anatomy, and page preview stay synchronized with the selected system."
    : "字体、Token、组件骨架与页面预览会同步当前选择。";
}

function setPreviewSize(size) {
  const device = q("#previewDevice");
  if (!device) return;
  device.dataset.size = size;
  qa(".preview-control").forEach((button) => {
    const active = button.dataset.previewSize === size;
    button.classList.toggle("is-active", active);
    button.setAttribute("aria-pressed", String(active));
  });
}

function selectPlatform(key, { persist = true } = {}) {
  const platform = platformCopy[key] || platformCopy.ios;
  qa(".platform-card").forEach((button) => {
    const active = button.dataset.platform === key;
    button.classList.toggle("is-active", active);
    button.setAttribute("role", "radio");
    button.setAttribute("aria-checked", String(active));
    button.removeAttribute("aria-pressed");
    button.tabIndex = active ? 0 : -1;
  });

  const locale = language();
  const hint = platform[locale];
  if (q("#platformHintTitle")) q("#platformHintTitle").textContent = hint[0];
  if (q("#platformHintText")) q("#platformHintText").textContent = hint[1];
  if (q("#platformBadge")) q("#platformBadge").textContent = platform.badge;
  if (q("#previewPlatformName")) q("#previewPlatformName").textContent = platform.name;
  if (q("#previewDevice")) q("#previewDevice").dataset.platform = key;

  setPreviewSize(key === "windows" || key === "macos" ? "desktop" : "mobile");
  if (persist) {
    try { localStorage.setItem(STORAGE_KEY, key); } catch {}
  }
  window.dispatchEvent(new CustomEvent("image2:launcherplatformchange", { detail: { platform: key } }));
}

function setDesignSystemTab(name, { focus = false } = {}) {
  const tabs = qa(".ds-tab");
  const panels = qa(".ds-panel");
  tabs.forEach((tab) => {
    const active = tab.dataset.dsTab === name;
    tab.classList.toggle("is-active", active);
    tab.setAttribute("role", "tab");
    tab.setAttribute("aria-selected", String(active));
    tab.tabIndex = active ? 0 : -1;
    if (active && focus) tab.focus();
  });
  panels.forEach((panel) => {
    const active = panel.dataset.dsPanel === name;
    panel.classList.toggle("is-active", active);
    panel.hidden = !active;
    panel.setAttribute("role", "tabpanel");
  });
}

function installInteractions() {
  const platformGrid = q("#platformGrid");
  platformGrid?.addEventListener("click", (event) => {
    const button = event.target.closest(".platform-card[data-platform]");
    if (button) selectPlatform(button.dataset.platform);
  });
  platformGrid?.addEventListener("keydown", (event) => {
    if (!["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown", "Home", "End"].includes(event.key)) return;
    const buttons = qa(".platform-card[data-platform]");
    if (!buttons.length) return;
    event.preventDefault();
    const current = Math.max(0, buttons.indexOf(document.activeElement));
    let next = current;
    if (["ArrowRight", "ArrowDown"].includes(event.key)) next = (current + 1) % buttons.length;
    if (["ArrowLeft", "ArrowUp"].includes(event.key)) next = (current - 1 + buttons.length) % buttons.length;
    if (event.key === "Home") next = 0;
    if (event.key === "End") next = buttons.length - 1;
    selectPlatform(buttons[next].dataset.platform);
    buttons[next].focus();
  });

  q(".ds-tabs")?.addEventListener("click", (event) => {
    const tab = event.target.closest(".ds-tab[data-ds-tab]");
    if (tab) setDesignSystemTab(tab.dataset.dsTab);
  });
  q(".ds-tabs")?.addEventListener("keydown", (event) => {
    if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) return;
    const tabs = qa(".ds-tab[data-ds-tab]");
    if (!tabs.length) return;
    event.preventDefault();
    const current = Math.max(0, tabs.indexOf(document.activeElement));
    let next = current;
    if (event.key === "ArrowRight") next = (current + 1) % tabs.length;
    if (event.key === "ArrowLeft") next = (current - 1 + tabs.length) % tabs.length;
    if (event.key === "Home") next = 0;
    if (event.key === "End") next = tabs.length - 1;
    setDesignSystemTab(tabs[next].dataset.dsTab, { focus: true });
  });

  q(".preview-controls")?.addEventListener("click", (event) => {
    const button = event.target.closest(".preview-control[data-preview-size]");
    if (button) setPreviewSize(button.dataset.previewSize);
  });

  const grid = q("#colorThemeGrid");
  if (grid) {
    const observer = new MutationObserver(renderProfile);
    observer.observe(grid, { subtree: true, childList: true, attributes: true, attributeFilter: ["class", "aria-checked", "aria-pressed", "checked"] });
    grid.addEventListener("change", () => queueMicrotask(renderProfile));
  }
}

function init() {
  if (!document.body.classList.contains("launcher-workspace")) return;
  installInteractions();
  let saved = "ios";
  try { saved = localStorage.getItem(STORAGE_KEY) || "ios"; } catch {}
  selectPlatform(platformCopy[saved] ? saved : "ios", { persist: false });
  setDesignSystemTab("foundation");
  renderProfile();
  window.image2I18n?.registerPage?.(() => {
    selectPlatform(qa(".platform-card[aria-checked='true']")[0]?.dataset.platform || saved, { persist: false });
    renderProfile();
  });
}

if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init, { once: true });
else init();
