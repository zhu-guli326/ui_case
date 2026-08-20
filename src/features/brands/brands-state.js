/**
 * brands-state.js — 状态管理、URL 同步、持久化与主题别名归一化
 * 从 brands-runtime-fix.js 和原 brands.js 中提取的状态逻辑
 */
import { systems, brandReferences, themes, changeIntensities, devices, findSystem, findTheme, findBrandReference, findDevice, findChangeIntensity, findTemplate, templates } from "../../../lab/lab-data.js";

const STORAGE_KEY = "image2-ui-current-project";

const THEME_ALIASES = {
  "minimal-tech": "ant-design",
  "editorial-commerce": "adobe-spectrum",
  "soft-lifestyle": "apple-hig",
  "future-tech": "google-material-3",
  "neo-brutal": "tdesign",
  glass: "fluent-2",
  retro: "github-primer",
};

const DEFAULTS = {
  name: "Atlas Dashboard",
  template: "dashboard",
  system: "ant",
  brand: "linear",
  theme: "ant-design",
  intensity: "standard",
  device: "desktop",
  appearance: "light",
  view: "single",
  compare: ["ant", "material", "apple"],
};

export function normalizeTheme(value) {
  return THEME_ALIASES[value] || value;
}

/**
 * 在模块加载时立即执行一次旧数据迁移，确保 brands.js 主模块读取时数据已归一化。
 * 同时安装 MutationObserver 修复 iframe srcdoc/src 冲突。
 */
export function bootstrapState() {
  // 1. 迁移 localStorage 中的旧主题别名
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || "null");
    if (saved && saved.theme) {
      const normalized = normalizeTheme(saved.theme);
      if (normalized !== saved.theme) {
        saved.theme = normalized;
        localStorage.setItem(STORAGE_KEY, JSON.stringify(saved));
      }
    }
  } catch {}

  // 2. 迁移 URL 中的旧主题别名
  try {
    const url = new URL(window.location.href);
    const requestedTheme = url.searchParams.get("theme");
    const normalizedTheme = normalizeTheme(requestedTheme);
    if (requestedTheme && normalizedTheme !== requestedTheme) {
      url.searchParams.set("theme", normalizedTheme);
      history.replaceState(history.state, "", url);
    }
  } catch {}

  // 3. 修复 iframe srcdoc/src 冲突
  function repairFrame(frame) {
    if (!(frame instanceof HTMLIFrameElement) || !frame.hasAttribute("srcdoc")) return;
    const target = frame.dataset.previewSrc || frame.getAttribute("src");
    if (!target) return;
    frame.removeAttribute("srcdoc");
    frame.src = target;
  }

  function scan(root) {
    if (!root) return;
    if (root instanceof HTMLIFrameElement) repairFrame(root);
    root.querySelectorAll?.("iframe[srcdoc]").forEach(repairFrame);
  }

  const observer = new MutationObserver((records) => {
    records.forEach((record) => {
      record.addedNodes.forEach((node) => {
        if (node.nodeType === Node.ELEMENT_NODE) scan(node);
      });
      if (record.type === "attributes") repairFrame(record.target);
    });
  });

  observer.observe(document.documentElement, {
    childList: true,
    subtree: true,
    attributes: true,
    attributeFilter: ["src"],
  });

  // 4. 拦截快速换配色按钮，提前归一化主题 ID
  document.addEventListener(
    "click",
    (event) => {
      const quick = event.target.closest?.("[data-theme-quick]");
      if (!quick) return;
      quick.dataset.themeQuick = normalizeTheme(quick.dataset.themeQuick);
    },
    true
  );
}

/**
 * 从 URL + localStorage 中读取并合并状态，验证所有字段有效性。
 */
export function readState() {
  let stored = {};
  try {
    stored = JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}") || {};
  } catch {}
  const url = new URL(location.href);
  const compare = url.searchParams.get("compare")?.split(",").filter(Boolean);
  const incoming = {
    ...DEFAULTS,
    ...stored,
    ...Object.fromEntries(
      ["template", "system", "brand", "theme", "intensity", "device", "appearance", "view"]
        .map((key) => [key, url.searchParams.get(key)])
        .filter(([, v]) => v)
    ),
    compare: compare?.length ? compare : stored.compare || DEFAULTS.compare,
  };
  incoming.theme = normalizeTheme(incoming.theme);
  if (!templates.some((t) => t.id === incoming.template)) incoming.template = DEFAULTS.template;
  if (!systems.some((s) => s.id === incoming.system)) incoming.system = DEFAULTS.system;
  if (!brandReferences.some((b) => b.id === incoming.brand)) incoming.brand = DEFAULTS.brand;
  if (!changeIntensities.some((c) => c.id === incoming.intensity)) incoming.intensity = DEFAULTS.intensity;
  if (!devices.some((d) => d.id === incoming.device)) incoming.device = DEFAULTS.device;
  if (!["light", "dark"].includes(incoming.appearance)) incoming.appearance = DEFAULTS.appearance;
  if (!["single", "compare", "differences"].includes(incoming.view)) incoming.view = DEFAULTS.view;
  incoming.compare = (incoming.compare || DEFAULTS.compare).filter((id) =>
    systems.some((s) => s.id === id)
  );
  if (incoming.compare.length < 2) incoming.compare = ["ant", "material", "apple"];
  return incoming;
}

/**
 * 持久化到 localStorage 并触发 projectchange 事件。
 */
export function persist(state) {
  state.lastStep = "brands";
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {}
  window.dispatchEvent(new CustomEvent("image2:projectchange", { detail: { ...state } }));
}

/**
 * 将当前状态同步到 URL searchParams。
 */
export function writeUrl(state) {
  const url = new URL(location.href);
  ["template", "system", "brand", "theme", "intensity", "device", "appearance", "view"].forEach(
    (key) => url.searchParams.set(key, state[key])
  );
  url.searchParams.set("compare", state.compare.join(","));
  history.replaceState({ ...state }, "", url);
}

export { DEFAULTS };
