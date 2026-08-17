import { findColorTheme, localizeColorTheme } from "../../../catalog/color-themes.js";

const STORAGE_KEY = "image2-ui-target-platform";

const systemProfiles = {
  "apple-hig": { name: "Apple HIG", font: "SF Pro", stack: "SF Pro Display · SF Pro Text · SF Mono", type: "Large Title 34 / Title 28 / Headline 17 / Body 17 / Caption 12", radius: "12 px", spacing: "8 pt", border: "1 px", density: "Comfortable" },
  "google-material-3": { name: "Material 3", font: "Roboto Flex", stack: "Roboto Flex · Roboto · system-ui", type: "Display 45 / Headline 32 / Title 22 / Body 16 / Label 14", radius: "16 px", spacing: "8 dp", border: "1 px", density: "Comfortable" },
  "ant-design": { name: "Ant Design", font: "Inter / system-ui", stack: "Inter · -apple-system · BlinkMacSystemFont · Segoe UI", type: "Title 24 / Heading 20 / Body 14 / Caption 12", radius: "6 px", spacing: "8 px", border: "1 px", density: "Compact" },
  "fluent-2": { name: "Fluent 2", font: "Segoe UI Variable", stack: "Segoe UI Variable · Segoe UI · system-ui", type: "Title 28 / Subtitle 20 / Body 14 / Caption 12", radius: "4–8 px", spacing: "4 px", border: "1 px", density: "Comfortable" },
  "carbon-design": { name: "Carbon", font: "IBM Plex Sans", stack: "IBM Plex Sans · IBM Plex Mono · sans-serif", type: "Heading 32 / Productive 20 / Body 14 / Helper 12", radius: "0–4 px", spacing: "8 px", border: "1 px", density: "Dense" },
  "github-primer": { name: "Primer", font: "-apple-system", stack: "-apple-system · BlinkMacSystemFont · Segoe UI · sans-serif", type: "Display 40 / Heading 24 / Body 14 / Small 12", radius: "6 px", spacing: "8 px", border: "1 px", density: "Compact" },
  "adobe-spectrum": { name: "Spectrum", font: "Adobe Clean", stack: "Adobe Clean · system-ui · sans-serif", type: "Heading 28 / Detail 18 / Body 14 / Label 12", radius: "4 px", spacing: "8 px", border: "1 px", density: "Comfortable" },
  tdesign: { name: "TDesign", font: "PingFang SC / system-ui", stack: "PingFang SC · system-ui · sans-serif", type: "Title 20 / Heading 16 / Body 14 / Caption 12", radius: "6 px", spacing: "8 px", border: "1 px", density: "Compact" },
  generic: { name: "Brand Visual System", font: "Inter / system-ui", stack: "Inter · system-ui · sans-serif", type: "Display 36 / Heading 24 / Body 16 / Caption 12", radius: "10 px", spacing: "8 px", border: "1 px", density: "Balanced" },
};

const platformCopy = {
  ios: { name: "iOS", badge: "Mobile", zh: ["iOS 推荐：", "Apple HIG + SF Pro + iOS 原生组件，并自动遵守 Safe Area。"], en: ["iOS recommendation:", "Apple HIG + SF Pro + native iOS components with Safe Area support."] },
  android: { name: "Android", badge: "Mobile", zh: ["Android 推荐：", "Material 3 + Roboto + Android 原生导航与触控尺寸。"], en: ["Android recommendation:", "Material 3 + Roboto + native Android navigation and touch targets."] },
  windows: { name: "Windows", badge: "Desktop", zh: ["Windows 推荐：", "Fluent 2 + Segoe UI Variable + 桌面窗口与键鼠交互。"], en: ["Windows recommendation:", "Fluent 2 + Segoe UI Variable + desktop window and pointer conventions."] },
  macos: { name: "macOS", badge: "Desktop", zh: ["macOS 推荐：", "Apple HIG + SF Pro + macOS 窗口、Toolbar、Sidebar 与键鼠交互。"], en: ["macOS recommendation:", "Apple HIG + SF Pro + macOS windows, toolbars, sidebars, and pointer conventions."] },
};

const q = (selector) => document.querySelector(selector);
const qa = (selector) => [...document.querySelectorAll(selector)];
const language = () => {
  const query = new URL(location.href).searchParams.get("lang");
  if (query === "en" || query === "zh") return query;
  return window.image2I18n?.language === "en" ? "en" : "zh";
};

let currentPlatformKey = "ios";
let currentDesignState = null;

function activeThemeId() {
  const grid = q("#colorThemeGrid");
  const checked = grid?.querySelector('input[name="colorTheme"]:checked');
  const selectedCard = checked?.closest(".color-theme-card") || grid?.querySelector(".is-selected,[aria-checked='true'],[aria-pressed='true']");
  return checked?.value || selectedCard?.dataset.colorTheme || selectedCard?.dataset.theme || "";
}

function resolveDesignState() {
  const theme = findColorTheme(activeThemeId());
  const localizedTheme = localizeColorTheme(theme, language());
  const componentProfile = systemProfiles[theme.designSystemId] || systemProfiles.generic;
  const isNamedComponentSystem = Boolean(theme.designSystemId && theme.designSystemId !== "custom");
  const systemName = isNamedComponentSystem
    ? componentProfile.name
    : `${theme.organization || localizedTheme.organization || "Brand"} Visual System`;
  const colors = theme.colors || {};
  return {
    platform: currentPlatformKey,
    themeId: theme.id,
    themeName: localizedTheme.name || theme.name,
    organization: theme.organization || "",
    systemName,
    componentProfile,
    colors,
    accent: colors.actionAccent || colors.accent || "#176f43",
  };
}

function publishDesignState(state = currentDesignState || resolveDesignState()) {
  currentDesignState = state;
  const workbench = q("#designSystemWorkbench");
  if (workbench) {
    workbench.dataset.platform = state.platform;
    workbench.dataset.themeId = state.themeId;
    workbench.dataset.themeName = state.themeName;
    workbench.dataset.systemName = state.systemName;
    workbench.dataset.accent = state.accent;
    workbench.dataset.canvas = state.colors.canvas || "";
    workbench.dataset.surface = state.colors.surface || "";
    workbench.dataset.ink = state.colors.ink || "";
  }
  window.dispatchEvent(new CustomEvent("image2:launcherdesignchange", { detail: state }));
}

function renderProfile() {
  const workbench = q("#designSystemWorkbench");
  if (!workbench) return;
  const state = resolveDesignState();
  const profile = state.componentProfile;
  const tokenColors = [state.colors.accent, state.colors.canvas, state.colors.ink, state.colors.surface].filter(Boolean);

  q("#dsFontSample").textContent = profile.font;
  q("#dsFontStack").textContent = profile.stack;
  q("#dsTypeScale").textContent = profile.type;
  q("#dsRadius").textContent = profile.radius;
  q("#dsSpacing").textContent = profile.spacing;
  q("#dsBorder").textContent = profile.border;
  q("#dsDensity").textContent = profile.density;
  qa("#dsSwatches .ds-swatch").forEach((swatch, index) => {
    if (tokenColors[index]) swatch.style.setProperty("--swatch", tokenColors[index]);
  });

  const demoButton = q("#dsDemoButton");
  if (demoButton) {
    demoButton.style.background = state.accent;
    demoButton.style.color = state.colors.onAccent || "#ffffff";
  }

  q("#dsWorkbenchTitle").textContent = `${state.systemName} · ${state.themeName}`;
  q("#dsWorkbenchSubtitle").textContent = language() === "en"
    ? "The selected palette drives tokens; component anatomy and typography follow the current system profile."
    : "当前配色直接驱动 Token；组件骨架与字体遵循对应的系统 Profile。";

  publishDesignState(state);
}

function selectPlatform(key, { persist = true } = {}) {
  const platform = platformCopy[key] || platformCopy.ios;
  currentPlatformKey = platformCopy[key] ? key : "ios";

  qa(".platform-card").forEach((button) => {
    const active = button.dataset.platform === currentPlatformKey;
    button.classList.toggle("is-active", active);
    button.setAttribute("role", "radio");
    button.setAttribute("aria-checked", String(active));
    button.removeAttribute("aria-pressed");
    button.tabIndex = active ? 0 : -1;
  });

  const hint = platform[language()];
  if (q("#platformHintTitle")) q("#platformHintTitle").textContent = hint[0];
  if (q("#platformHintText")) q("#platformHintText").textContent = hint[1];
  if (q("#platformBadge")) q("#platformBadge").textContent = platform.badge;

  if (persist) {
    try { localStorage.setItem(STORAGE_KEY, currentPlatformKey); } catch {}
  }

  const nextState = resolveDesignState();
  publishDesignState(nextState);
  window.dispatchEvent(new CustomEvent("image2:launcherplatformchange", { detail: { platform: currentPlatformKey } }));
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

  const grid = q("#colorThemeGrid");
  if (grid) {
    grid.addEventListener("change", (event) => {
      if (event.target.matches('[name="colorTheme"]')) queueMicrotask(renderProfile);
    });
    new MutationObserver(() => queueMicrotask(renderProfile)).observe(grid, {
      subtree: true,
      childList: true,
      attributes: true,
      attributeFilter: ["checked", "aria-checked", "class"],
    });
  }
}

function init() {
  if (!document.body.classList.contains("launcher-workspace")) return;
  installInteractions();
  try { currentPlatformKey = localStorage.getItem(STORAGE_KEY) || "ios"; } catch {}
  if (!platformCopy[currentPlatformKey]) currentPlatformKey = "ios";
  selectPlatform(currentPlatformKey, { persist: false });
  renderProfile();
  window.image2I18n?.registerPage?.(() => {
    selectPlatform(currentPlatformKey, { persist: false });
    renderProfile();
  });
}

if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init, { once: true });
else init();
