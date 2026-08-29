const DNA_KEY = "ondesign:interface-dna:v1";
const EFFECTS_KEY = "ondesign:interface-dna:font-effects:v1";
const LANG = () => (window.image2I18n?.language === "en" ? "en" : "zh");
const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
const text = (copy) => copy[LANG()] ?? copy.zh;

const fonts = {
  sans: { name: { zh: "系统无衬线", en: "System sans" }, info: { zh: "PingFang SC / Microsoft YaHei", en: "Segoe UI / PingFang SC" }, family: 'system-ui,-apple-system,"Segoe UI","PingFang SC","Microsoft YaHei",sans-serif' },
  serif: { name: { zh: "宋体", en: "Songti serif" }, info: { zh: "Songti SC / SimSun", en: "Songti SC / SimSun" }, family: '"Songti SC","STSong",SimSun,Georgia,serif' },
  mono: { name: { zh: "等宽", en: "Monospace" }, info: { zh: "SFMono / Consolas", en: "SFMono / Consolas" }, family: 'ui-monospace,"SFMono-Regular",Consolas,"Liberation Mono",monospace' },
  hei: { name: { zh: "黑体", en: "Heiti" }, info: { zh: "SimHei / Microsoft YaHei", en: "SimHei / Microsoft YaHei" }, family: '"Noto Sans SC","Source Han Sans SC",SimHei,"Microsoft YaHei",sans-serif' },
  kai: { name: { zh: "楷体", en: "Kaiti" }, info: { zh: "Kaiti SC / KaiTi", en: "Kaiti SC / KaiTi" }, family: '"Kaiti SC","STKaiti",KaiTi,"TW-Kai",cursive' },
  fangsong: { name: { zh: "仿宋", en: "Fangsong" }, info: { zh: "STFangsong / FangSong", en: "STFangsong / FangSong" }, family: '"Fangsong SC","STFangsong",FangSong,SimSun,serif' },
  yuan: { name: { zh: "圆体", en: "Rounded" }, info: { zh: "Yuanti SC / YouYuan", en: "Yuanti SC / YouYuan" }, family: '"Yuanti SC",YouYuan,"PingFang SC","Microsoft YaHei",sans-serif' },
  geometric: { name: { zh: "几何无衬线", en: "Geometric sans" }, info: { zh: "Futura / Century Gothic", en: "Futura / Century Gothic" }, family: 'Futura,"Century Gothic","Avenir Next","Trebuchet MS",sans-serif' },
};

const copy = {
  font: { zh: "字体", en: "Font" },
  weight: { zh: "标题字重", en: "Heading weight" },
  tracking: { zh: "字距", en: "Tracking" },
  slant: { zh: "字形", en: "Slant" },
  weightValues: {
    "400": { zh: "常规", en: "Regular" }, "500": { zh: "中等", en: "Medium" }, "600": { zh: "半粗", en: "Semibold" }, "700": { zh: "粗体", en: "Bold" }, "800": { zh: "特粗", en: "Heavy" },
  },
  trackingValues: { tight: { zh: "紧", en: "Tight" }, normal: { zh: "标准", en: "Normal" }, loose: { zh: "松", en: "Loose" } },
  slantValues: { normal: { zh: "常规", en: "Normal" }, italic: { zh: "斜体", en: "Italic" } },
};

let effects = { weight: "700", tracking: "normal", slant: "normal" };

function restoreEffects() {
  try {
    const extra = JSON.parse(localStorage.getItem(EFFECTS_KEY) || "null") || {};
    const dna = JSON.parse(localStorage.getItem(DNA_KEY) || "null") || {};
    effects = {
      weight: String(extra.weight ?? dna.fontWeight ?? "700"),
      tracking: String(extra.tracking ?? dna.fontTracking ?? "normal"),
      slant: String(extra.slant ?? dna.fontSlant ?? "normal"),
    };
  } catch {}
}

function saveEffects() {
  try {
    localStorage.setItem(EFFECTS_KEY, JSON.stringify(effects));
    const dna = JSON.parse(localStorage.getItem(DNA_KEY) || "null");
    if (dna) {
      Object.assign(dna, { fontWeight: effects.weight, fontTracking: effects.tracking, fontSlant: effects.slant });
      localStorage.setItem(DNA_KEY, JSON.stringify(dna));
    }
  } catch {}
}

function installStyle() {
  if ($("#launcher-font-controls-style")) return;
  const style = document.createElement("style");
  style.id = "launcher-font-controls-style";
  style.textContent = `
    .font-effects-panel{display:grid;gap:10px;margin-top:12px;padding-top:12px;border-top:1px solid var(--dna-hairline)}
    .font-effect-row{display:grid;grid-template-columns:88px minmax(0,1fr);align-items:center;gap:10px}
    .font-effect-label{color:var(--dna-muted);font-size:12px;font-weight:780}
    .font-effect-options{display:flex;flex-wrap:wrap;gap:5px}
    .font-effect-options button{min-height:32px;padding:0 10px;border:1px solid var(--dna-line);border-radius:9px;background:var(--dna-surface);color:var(--dna-muted);font:inherit;font-size:12px;font-weight:720}
    .font-effect-options button:hover{color:var(--dna-ink)}
    .font-effect-options button.is-selected{border-color:var(--dna-accent);background:var(--dna-accent-soft);color:var(--dna-ink);box-shadow:0 0 0 1px var(--dna-accent)}
    .type-option i{font-family:var(--option-font,inherit)}
    .preview-page{letter-spacing:var(--dna-font-tracking,normal);font-style:var(--dna-font-slant,normal)}
    .preview-page h1,.preview-page h2,.preview-page h3,.preview-page h4,.preview-page h5,.preview-page strong,.preview-page b{font-weight:var(--dna-heading-weight,700)}
    @media(max-width:760px){.font-effect-row{grid-template-columns:1fr}.font-effect-options button{flex:1 1 auto}}
  `;
  document.head.append(style);
}

function currentFontKey() {
  return $(".type-option.is-selected")?.dataset.value || "sans";
}

function currentFontName() {
  return text(fonts[currentFontKey()]?.name || fonts.sans.name);
}

function renderFontNames() {
  const field = $(".font-field");
  if (!field) return;
  const legend = $("legend", field);
  if (legend) legend.textContent = text(copy.font);
  const list = $(".type-list", field);
  if (list) list.setAttribute("aria-label", text(copy.font));
  $$(".type-option[data-value]", field).forEach((button) => {
    const font = fonts[button.dataset.value];
    if (!font) return;
    const title = $("b", button);
    const info = $("span", button);
    const sample = $("i", button);
    if (title) title.textContent = text(font.name);
    if (info) info.textContent = text(font.info);
    if (sample) sample.style.setProperty("--option-font", font.family);
  });
}

function option(group, value, label) {
  return `<button type="button" data-font-effect="${group}" data-effect-value="${value}" class="${effects[group] === value ? "is-selected" : ""}">${text(label)}</button>`;
}

function renderEffectPanel() {
  const field = $(".font-field");
  const list = $(".type-list", field || document);
  if (!field || !list) return;
  let panel = $(".font-effects-panel", field);
  if (!panel) {
    panel = document.createElement("div");
    panel.className = "font-effects-panel";
    list.insertAdjacentElement("afterend", panel);
  }
  panel.innerHTML = `
    <div class="font-effect-row"><span class="font-effect-label">${text(copy.weight)}</span><div class="font-effect-options">${Object.entries(copy.weightValues).map(([value, label]) => option("weight", value, label)).join("")}</div></div>
    <div class="font-effect-row"><span class="font-effect-label">${text(copy.tracking)}</span><div class="font-effect-options">${Object.entries(copy.trackingValues).map(([value, label]) => option("tracking", value, label)).join("")}</div></div>
    <div class="font-effect-row"><span class="font-effect-label">${text(copy.slant)}</span><div class="font-effect-options">${Object.entries(copy.slantValues).map(([value, label]) => option("slant", value, label)).join("")}</div></div>`;
}

function applyEffects() {
  const tracking = { tight: "-.025em", normal: "normal", loose: ".045em" }[effects.tracking] || "normal";
  document.documentElement.style.setProperty("--dna-heading-weight", effects.weight);
  document.documentElement.style.setProperty("--dna-font-tracking", tracking);
  document.documentElement.style.setProperty("--dna-font-slant", effects.slant === "italic" ? "italic" : "normal");
}

function updatePrompt() {
  const node = $("#dnaPrompt");
  if (!node) return;
  const en = LANG() === "en";
  let lines = node.textContent.split("\n").filter(Boolean);
  lines = lines.filter((line) => !/^(?:标题字重|字距|字形|Heading weight|Tracking|Slant):/.test(line));
  lines = lines.map((line) => /^(?:字体|Typography):/.test(line) ? `${en ? "Typography" : "字体"}: ${currentFontName()}` : line);
  const additions = en
    ? [`Heading weight: ${effects.weight}`, `Tracking: ${text(copy.trackingValues[effects.tracking])}`, `Slant: ${text(copy.slantValues[effects.slant])}`]
    : [`标题字重: ${effects.weight}`, `字距: ${text(copy.trackingValues[effects.tracking])}`, `字形: ${text(copy.slantValues[effects.slant])}`];
  const radiusIndex = lines.findIndex((line) => /^(?:圆角|Radius):/.test(line));
  if (radiusIndex >= 0) lines.splice(radiusIndex, 0, ...additions); else lines.push(...additions);
  const next = lines.join("\n");
  if (node.textContent !== next) node.textContent = next;
}

function updateMainSurfaces() {
  const fontName = currentFontName();
  const dock = $("#dockFont");
  if (dock) dock.textContent = fontName;
  const rows = $$("#dnaSummary > div");
  const summaryFont = rows[2] ? $("dd", rows[2]) : null;
  if (summaryFont) summaryFont.textContent = fontName;
  const rules = $('[data-section-value="rules"]');
  if (rules) {
    const parts = rules.textContent.split(" · ");
    if (parts.length > 1) parts[parts.length - 1] = fontName;
    rules.textContent = parts.join(" · ");
  }
  updatePrompt();
}

function showToast(message) {
  const node = $("#dnaToast");
  if (!node) return;
  node.textContent = message;
  node.hidden = false;
  clearTimeout(showToast.timer);
  showToast.timer = setTimeout(() => { node.hidden = true; }, 2200);
}

function refresh() {
  renderFontNames();
  renderEffectPanel();
  applyEffects();
  updateMainSurfaces();
}

function installEvents() {
  document.addEventListener("click", (event) => {
    const effect = event.target.closest("[data-font-effect]");
    if (effect) {
      effects[effect.dataset.fontEffect] = effect.dataset.effectValue;
      saveEffects();
      refresh();
      return;
    }
    if (event.target.closest(".dna-controls button, .dna-preset-item")) setTimeout(updateMainSurfaces, 0);
  });
  document.addEventListener("change", () => setTimeout(updateMainSurfaces, 0));
  $("#dnaName")?.addEventListener("input", () => setTimeout(updatePrompt, 0));
  $("#saveDna")?.addEventListener("click", () => setTimeout(saveEffects, 0));
  $("#copyDna")?.addEventListener("click", async (event) => {
    event.preventDefault();
    event.stopImmediatePropagation();
    updatePrompt();
    try {
      await navigator.clipboard.writeText($("#dnaPrompt")?.textContent || "");
      showToast(text({ zh: "提示词已复制", en: "Prompt copied" }));
    } catch {
      showToast(text({ zh: "复制失败，请重试", en: "Copy failed, please retry" }));
    }
  }, true);
  window.addEventListener("image2:languagechange", () => setTimeout(refresh, 0));
}

function init() {
  restoreEffects();
  installStyle();
  refresh();
  installEvents();
}

if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init, { once: true }); else init();
