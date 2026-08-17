const VERSION = "20260817-simplified-v1";

function reportFailure(label, error) {
  console.error(`[launcher] ${label} failed to load`, error);
  const toast = document.getElementById("toast");
  if (!toast) return;
  toast.textContent = new URL(location.href).searchParams.get("lang") === "en"
    ? "Part of the workspace failed to load. Refresh the page to retry."
    : "工作区有部分模块加载失败，请刷新页面重试。";
  toast.hidden = false;
}

function installCompatibilityStyles() {
  if (document.querySelector('link[data-launcher-compat]')) return;
  const link = document.createElement("link");
  link.rel = "stylesheet";
  link.href = new URL(`./launcher-workspace-compat.css?v=${VERSION}`, import.meta.url).href;
  link.dataset.launcherCompat = "true";
  document.head.append(link);
}

async function loadCore() {
  try {
    await import(`../../../launcher.js?v=${VERSION}`);
  } catch (error) {
    reportFailure("core", error);
    throw error;
  }
}

async function loadEnhancements() {
  const modules = [
    ["shell", `./launcher-shell.js?v=${VERSION}`],
    ["design-system", `./launcher-design-system.js?v=${VERSION}`],
    ["hardening", `./launcher-hardening.js?v=${VERSION}`],
    ["stability", `./launcher-stability.js?v=${VERSION}`],
    ["live-preview", `./launcher-live-preview.js?v=${VERSION}`],
    ["preview-templates", `./launcher-preview-templates.js?v=${VERSION}`],
    ["preview-modern-cases", `./launcher-preview-modern-cases.js?v=${VERSION}`],
    ["preview-editorial-images", `./launcher-preview-editorial-images.js?v=${VERSION}`],
  ];

  const results = await Promise.allSettled(modules.map(([, path]) => import(path)));
  results.forEach((result, index) => {
    if (result.status === "rejected") reportFailure(modules[index][0], result.reason);
  });

  try {
    await import(`./launcher-simplified-runtime.js?v=${VERSION}`);
  } catch (error) {
    reportFailure("simplified-runtime", error);
  }
}

installCompatibilityStyles();
loadCore().then(loadEnhancements).catch(() => {});
