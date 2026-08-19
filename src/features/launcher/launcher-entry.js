const VERSION = "20260819-freeze-v1";

function reportFailure(label, error) {
  console.error(`[launcher] ${label} failed to load`, error);
  const toast = document.getElementById("toast");
  if (!toast) return;
  toast.textContent = new URL(location.href).searchParams.get("lang") === "en"
    ? "Part of the workspace failed to load. Refresh the page to retry."
    : "工作区有部分模块加载失败，请刷新页面重试。";
  toast.hidden = false;
}

async function load(label, path) {
  try {
    return await import(path);
  } catch (error) {
    reportFailure(label, error);
    throw error;
  }
}

async function boot() {
  await load("core", `../../../launcher.js?v=${VERSION}`);
  await load("design-system", `./launcher-design-system.js?v=${VERSION}`);
  await load("final-preview", `./launcher-live-preview.js?v=${VERSION}`);
  await load("runtime", `./launcher-simplified-runtime.js?v=${VERSION}`);
  await load("consolidated-controls", `./launcher-platform-merge.js?v=${VERSION}`);
}

boot().catch(() => {});
