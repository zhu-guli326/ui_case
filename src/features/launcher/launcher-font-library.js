const CUSTOM_KEY = "ondesign:launcher-google-font:v1";
const DNA_KEY = "ondesign:interface-dna:v1";
const LANG = () => (window.image2I18n?.language === "en" ? "en" : "zh");
const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
const pick = (copy) => copy[LANG()] ?? copy.zh;

const baseFonts = {
  sans: {
    name: { zh: "系统无衬线", en: "System Sans" },
    meta: { zh: "System UI · PingFang SC", en: "System UI · Segoe UI" },
    sample: "Aa",
    family: 'system-ui,-apple-system,"Segoe UI","PingFang SC","Microsoft YaHei",sans-serif',
  },
  serif: {
    name: { zh: "宋体", en: "Songti Serif" },
    meta: { zh: "Songti SC · SimSun", en: "Songti SC · Georgia" },
    sample: "宋",
    family: '"Songti SC","STSong",SimSun,Georgia,serif',
  },
  mono: {
    name: { zh: "等宽", en: "Monospace" },
    meta: { zh: "SFMono · Consolas", en: "SFMono · Consolas" },
    sample: "R1",
    family: 'ui-monospace,"SFMono-Regular",Consolas,"Liberation Mono",monospace',
  },
  hei: {
    name: { zh: "黑体", en: "Heiti" },
    meta: { zh: "SimHei · Microsoft YaHei", en: "SimHei · Microsoft YaHei" },
    sample: "黑",
    family: '"Noto Sans SC","Source Han Sans SC",SimHei,"Microsoft YaHei",sans-serif',
  },
  kai: {
    name: { zh: "楷体", en: "Kaiti" },
    meta: { zh: "Kaiti SC · KaiTi", en: "Kaiti SC · KaiTi" },
    sample: "楷",
    family: '"Kaiti SC","STKaiti",KaiTi,"TW-Kai",cursive',
  },
  fangsong: {
    name: { zh: "仿宋", en: "Fangsong" },
    meta: { zh: "STFangsong · FangSong", en: "STFangsong · FangSong" },
    sample: "仿",
    family: '"Fangsong SC","STFangsong",FangSong,SimSun,serif',
  },
  yuan: {
    name: { zh: "圆体", en: "Rounded" },
    meta: { zh: "Yuanti SC · YouYuan", en: "Yuanti SC · YouYuan" },
    sample: "圆",
    family: '"Yuanti SC",YouYuan,"PingFang SC","Microsoft YaHei",sans-serif',
  },
  geometric: {
    name: { zh: "几何无衬线", en: "Geometric Sans" },
    meta: { zh: "Futura · Century Gothic", en: "Futura · Century Gothic" },
    sample: "Gg",
    family: 'Futura,"Century Gothic","Avenir Next","Trebuchet MS",sans-serif',
  },
};

const googleFonts = [
  {
    id: "noto-sans-sc",
    name: "Noto Sans SC",
    meta: { zh: "Google Fonts · 中文无衬线", en: "Google Fonts · CJK Sans" },
    sample: "界",
    family: '"Noto Sans SC","PingFang SC",sans-serif',
    query: "Noto+Sans+SC:wght@400;500;600;700;800",
  },
  {
    id: "noto-serif-sc",
    name: "Noto Serif SC",
    meta: { zh: "Google Fonts · 中文衬线", en: "Google Fonts · CJK Serif" },
    sample: "文",
    family: '"Noto Serif SC","Songti SC",serif',
    query: "Noto+Serif+SC:wght@400;500;600;700;800",
  },
  {
    id: "zcool-qingke",
    name: "ZCOOL QingKe HuangYou",
    meta: { zh: "Google Fonts · 中文标题", en: "Google Fonts · Chinese Display" },
    sample: "酷",
    family: '"ZCOOL QingKe HuangYou","Microsoft YaHei",sans-serif',
    query: "ZCOOL+QingKe+HuangYou",
  },
  {
    id: "zcool-xiaowei",
    name: "ZCOOL XiaoWei",
    meta: { zh: "Google Fonts · 中文衬线", en: "Google Fonts · Chinese Serif" },
    sample: "微",
    family: '"ZCOOL XiaoWei","Songti SC",serif',
    query: "ZCOOL+XiaoWei",
  },
  {
    id: "ma-shan-zheng",
    name: "Ma Shan Zheng",
    meta: { zh: "Google Fonts · 中文手写", en: "Google Fonts · Chinese Handwriting" },
    sample: "山",
    family: '"Ma Shan Zheng","Kaiti SC",cursive',
    query: "Ma+Shan+Zheng",
  },
  {
    id: "long-cang",
    name: "Long Cang",
    meta: { zh: "Google Fonts · 中文书写", en: "Google Fonts · Chinese Script" },
    sample: "龙",
    family: '"Long Cang","Kaiti SC",cursive',
    query: "Long+Cang",
  },
  {
    id: "liu-jian-mao-cao",
    name: "Liu Jian Mao Cao",
    meta: { zh: "Google Fonts · 中文草书", en: "Google Fonts · Chinese Cursive" },
    sample: "草",
    family: '"Liu Jian Mao Cao","Kaiti SC",cursive',
    query: "Liu+Jian+Mao+Cao",
  },
  {
    id: "zhi-mang-xing",
    name: "Zhi Mang Xing",
    meta: { zh: "Google Fonts · 中文行书", en: "Google Fonts · Chinese Brush" },
    sample: "行",
    family: '"Zhi Mang Xing","Kaiti SC",cursive',
    query: "Zhi+Mang+Xing",
  },
];

let currentCustomId = "";
let observer = null;

function ensureGoogleFont(font) {
  if (!font || $(`link[data-launcher-google-font="${font.id}"]`)) return;
  const link = document.createElement("link");
  link.rel = "stylesheet";
  link.href = `https://fonts.googleapis.com/css2?family=${font.query}&display=swap`;
  link.dataset.launcherGoogleFont = font.id;
  document.head.appendChild(link);
}

function selectedFont() {
  return googleFonts.find((font) => font.id === currentCustomId) || null;
}

function fontLabel() {
  return selectedFont()?.name || "";
}

function updateBaseLabels() {
  const field = $(".font-field");
  const legend = $("legend", field || document);
  if (legend) legend.textContent = pick({ zh: "字体", en: "Font" });
  const list = $(".type-list", field || document);
  if (list) list.setAttribute("aria-label", pick({ zh: "字体", en: "Font" }));

  Object.entries(baseFonts).forEach(([key, font]) => {
    const button = $(`.type-option[data-value="${key}"]`, field || document);
    if (!button) return;
    const title = $("b", button);
    const meta = $("span", button);
    const sample = $("i", button);
    if (title) title.textContent = pick(font.name);
    if (meta) meta.textContent = pick(font.meta);
    if (sample) {
      sample.textContent = font.sample;
      sample.style.fontFamily = font.family;
    }
  });
}

function renderGoogleFonts() {
  const list = $(".font-field .type-list");
  if (!list) return;
  list.querySelectorAll("[data-google-font]").forEach((node) => node.remove());
  googleFonts.forEach((font) => {
    const button = document.createElement("button");
    button.className = `type-option google-font-option${font.id === currentCustomId ? " is-selected" : ""}`;
    button.type = "button";
    button.setAttribute("role", "radio");
    button.setAttribute("aria-checked", String(font.id === currentCustomId));
    button.dataset.googleFont = font.id;
    button.innerHTML = `<b>${font.name}</b><span>${pick(font.meta)}</span><i>${font.sample}</i>`;
    const title = $("b", button);
    const sample = $("i", button);
    if (title) title.style.fontFamily = font.family;
    if (sample) sample.style.fontFamily = font.family;
    list.appendChild(button);
  });
}

function patchPrompt() {
  const node = $("#dnaPrompt");
  const font = selectedFont();
  if (!node || !font) return;
  const lines = node.textContent.split("\n").map((line) => {
    if (/^字体：/.test(line)) return `字体：${font.name}`;
    if (/^Typography:/.test(line)) return `Typography: ${font.name}`;
    return line;
  });
  node.textContent = lines.join("\n");
}

function patchSummary() {
  const font = selectedFont();
  if (!font) return;
  const dock = $("#dockFont");
  if (dock && dock.textContent !== font.name) dock.textContent = font.name;

  const summaryRows = $$("#dnaSummary > div");
  const fontValue = summaryRows[2] ? $("dd", summaryRows[2]) : null;
  if (fontValue && fontValue.textContent !== font.name) fontValue.textContent = font.name;

  const rules = $('[data-section-value="rules"]');
  if (rules) {
    const parts = rules.textContent.split(" · ");
    if (parts.length > 1) parts[parts.length - 1] = font.name;
    const next = parts.join(" · ");
    if (rules.textContent !== next) rules.textContent = next;
  }

  patchPrompt();
}

function applyCustomFont() {
  const font = selectedFont();
  if (!font) return;
  ensureGoogleFont(font);
  document.documentElement.style.setProperty("--dna-display", font.family);
  $$(".font-field .type-option").forEach((button) => {
    const selected = button.dataset.googleFont === font.id;
    button.classList.toggle("is-selected", selected);
    if (button.getAttribute("role") === "radio") button.setAttribute("aria-checked", String(selected));
  });
  patchSummary();
}

function persistCustomFont() {
  try {
    if (currentCustomId) localStorage.setItem(CUSTOM_KEY, currentCustomId);
    else localStorage.removeItem(CUSTOM_KEY);

    const dna = JSON.parse(localStorage.getItem(DNA_KEY) || "null");
    if (dna && typeof dna === "object") {
      if (currentCustomId) dna.googleFont = currentCustomId;
      else delete dna.googleFont;
      localStorage.setItem(DNA_KEY, JSON.stringify(dna));
    }
  } catch {}
}

function restoreCustomFont() {
  try {
    const own = localStorage.getItem(CUSTOM_KEY) || "";
    const dna = JSON.parse(localStorage.getItem(DNA_KEY) || "null");
    const saved = own || dna?.googleFont || "";
    if (googleFonts.some((font) => font.id === saved)) currentCustomId = saved;
  } catch {}
}

function clearCustomFont() {
  if (!currentCustomId) return;
  currentCustomId = "";
  persistCustomFont();
  renderGoogleFonts();
}

function selectCustomFont(id) {
  if (!googleFonts.some((font) => font.id === id)) return;
  currentCustomId = id;
  persistCustomFont();
  renderGoogleFonts();
  applyCustomFont();
}

function installEvents() {
  document.addEventListener("click", (event) => {
    const custom = event.target.closest("[data-google-font]");
    if (custom) {
      selectCustomFont(custom.dataset.googleFont);
      return;
    }

    const base = event.target.closest('.font-field .type-option[data-value]');
    const resetsFont = event.target.closest(".direction-card, .dna-preset-item");
    if (base || resetsFont) {
      clearCustomFont();
      return;
    }

    if (currentCustomId && event.target.closest(".dna-controls button, .dna-controls select")) {
      setTimeout(applyCustomFont, 0);
    }

    if (currentCustomId && event.target.closest("#saveDna")) {
      setTimeout(() => {
        persistCustomFont();
        applyCustomFont();
      }, 0);
    }
  });

  document.addEventListener("change", (event) => {
    if (currentCustomId && event.target.closest(".dna-controls")) setTimeout(applyCustomFont, 0);
  });

  document.addEventListener("click", async (event) => {
    if (!currentCustomId || !event.target.closest("#copyDna")) return;
    event.preventDefault();
    event.stopImmediatePropagation();
    applyCustomFont();
    try {
      await navigator.clipboard.writeText($("#dnaPrompt")?.textContent || "");
      const toast = $("#dnaToast");
      if (toast) {
        toast.textContent = pick({ zh: "提示词已复制", en: "Prompt copied" });
        toast.hidden = false;
        setTimeout(() => { toast.hidden = true; }, 2200);
      }
    } catch {}
  }, true);

  window.addEventListener("image2:languagechange", () => {
    setTimeout(() => {
      updateBaseLabels();
      renderGoogleFonts();
      if (currentCustomId) applyCustomFont();
    }, 0);
  });
}

function installObserver() {
  const dock = $("#dockFont");
  if (!dock) return;
  observer?.disconnect();
  observer = new MutationObserver(() => {
    if (currentCustomId && dock.textContent !== fontLabel()) setTimeout(applyCustomFont, 0);
  });
  observer.observe(dock, { childList: true, characterData: true, subtree: true });
}

function init() {
  restoreCustomFont();
  updateBaseLabels();
  renderGoogleFonts();
  if (currentCustomId) applyCustomFont();
  installObserver();
  installEvents();
}

if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", () => setTimeout(init, 0), { once: true });
else setTimeout(init, 0);
