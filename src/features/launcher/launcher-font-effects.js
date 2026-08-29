const DNA_STORAGE_KEY = "ondesign:interface-dna:v1";
const FONT_EFFECTS_KEY = "ondesign:interface-dna:font-effects:v1";
const lang = () => (window.image2I18n?.language === "en" ? "en" : "zh");
const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
const pick = (copy) => copy?.[lang()] ?? copy?.zh ?? "";

const fontCopy = {
  sans: {
    label: { zh: "系统无衬线", en: "System sans" },
    desc: { zh: "PingFang SC / Microsoft YaHei", en: "Segoe UI / PingFang SC" },
    sample: 'system-ui,-apple-system,"Segoe UI","PingFang SC","Microsoft YaHei",sans-serif',
  },
  serif: {
    label: { zh: "宋体", en: "Songti serif" },
    desc: { zh: "Songti SC / SimSun", en: "Songti SC / SimSun" },
    sample: '"Songti SC","STSong",SimSun,Georgia,serif',
  },
  mono: {
    label: { zh: "等宽", en: "Monospace" },
    desc: { zh: "SFMono / Consolas", en: "SFMono / Consolas" },
    sample: 'ui-monospace,"SFMono-Regular",Consolas,"Liberation Mono",monospace',
  },
  hei: {
    label: { zh: "黑体", en: "Heiti" },
    desc: { zh: "SimHei / Microsoft YaHei", en: "SimHei / Microsoft YaHei" },
    sample: '"Noto Sans SC","Source Han Sans SC",SimHei,"Microsoft YaHei",sans-serif',
  },
  kai: {
    label: { zh: "楷体", en: "Kaiti" },
    desc: { zh: "Kaiti SC / KaiTi", en: "Kaiti SC / KaiTi" },
    sample: '"Kaiti SC","STKaiti",KaiTi,"TW-Kai",cursive',
  },
  fangsong: {
    label: { zh: "仿宋", en: "Fangsong" },
    desc: { zh: "STFangsong / FangSong", en: "STFangsong / FangSong" },
    sample: '"Fangsong SC","STFangsong",FangSong,SimSun,serif',
  },
  yuan: {
    label: { zh: "圆体", en: "Rounded" },
    desc: { zh: "Yuanti SC / YouYuan", en: "Yuanti SC / YouYuan" },
    sample: '"Yuanti SC",YouYuan,"PingFang SC","Microsoft YaHei",sans-serif',
  },
  geometric: {
    label: { zh: "几何无衬线", en: "Geometric sans" },
    desc: { zh: "Futura / Century Gothic", en: "Futura / Century Gothic" },
    sample: 'Futura,"Century Gothic","Avenir Next","Trebuchet MS",sans-serif',
  },
};

const effectCopy = {
  weight: { zh: "标题字重", en: "Heading weight" },
  tracking: { zh: "字距", en: "Tracking" },
  slant: { zh: "字形", en: "Slant" },
  weightValues: {
    "400": { zh: "常规", en: "Regular" },
    "500": { zh: "中等", en: "Medium" },
    "600": { zh: "半粗", en: "Semibold" },
    "700": { zh: "粗体", en: "Bold" },
    "800": { zh: "特粗", en: "Heavy" },
  },
  trackingValues: {
    tight: { zh: "紧", en: "Tight" },
    normal: { zh: "标准", en: "Normal" },
    loose: { zh: "松", en: "Loose" },
  },
  slantValues: {
    normal: { zh: "常规", en: "Normal" },
    italic: { zh: "斜体", en: "Italic" },
  },
};

const defaults = { weight: "700", tracking: "normal", slant: "normal" };
let effects = { ...defaults };
let promptGuard = false;

function readEffects() {
  try {
    const standalone = JSON.parse(localStorage.getItem(FONT_EFFECTS_KEY) || "null") || {};
    const dna = JSON.parse(localStorage.getItem(DNA_STORAGE_KEY) || "null") || {};
    effects = {
      weight: String(standalone.weight ?? dna.fontWeight ?? defaults.weight),
      tracking: String(standalone.tracking ?? dna.fontTracking ?? defaults.tracking),
      slant: String(standalone.slant ?? dna.fontSlant ?? defaults.slant),
    };
  } catch {
    effects = { ...defaults };
  }
}

function persistEffects() {
  try {
    localStorage.setItem(FONT_EFFECTS_KEY, JSON.stringify(effects));
    const dna = JSON.parse(localStorage.getItem(DNA_STORAGE_KEY) || "null");
    if (dna) {
      dna.fontWeight = effects.weight;
      dna.fontTracking = effects.tracking;
      dna.fontSlant = effects.slant;
      localStorage.setItem(DNA_STORAGE_KEY, JSON.stringify(dna));
    }
  } catch {}
}

function installStyles() {
  if ($("#launcher-font-effects-style")) return;
  const style = document.createElement("style");
  style.id = "launcher-font-effects-style";
  style.textContent = `
    .font-effects-panel{display:grid;gap:10px;margin-top:12px;padding-top:12px;border-top:1px solid var(--dna-hairline)}
    .font-effect-row{display:grid;grid-template-columns:88px minmax(0,1fr);align-items:center;gap:10px}
    .font-effect-label{color:var(--dna-muted);font-size:12px;font-weight:780}
    .font-effect-segments{display:flex;flex-wrap:wrap;gap:5px}
    .font-effect-segments button{min-height:32px;padding:0 10px;border:1px solid var(--dna-line);border-radius:9px;background:var(--dna-surface);color:var(--dna-muted);font:inherit;font-size:12px;font-weight:720}
    .font-effect-segments button:hover{color:var(--dna-ink)}
    .font-effect-segments button.is-selected{border-color:var(--dna-accent);background:var(--dna-accent-soft);color:var(--dna-ink);box-shadow:0 0 0 1px var(--dna-accent)}
    .type-option i{font-family:var(--font-option-family,inherit)}
    .preview-page{letter-spacing:var(--dna-font-tracking,normal);font-style:var(--dna-font-slant,normal)}
    .preview-page h1,.preview-page h2,.preview-page h3,.preview-page h4,.preview-page h5,.preview-page strong,.preview-page b{font-weight:var(--dna-heading-weight,700)}
    @media(max-width:760px){.font-effect-row{grid-template-columns:1fr}.font-effect-segments button{flex:1 1 auto}}
  `;
  document.head.append(style);
}

function registerConcreteTranslations() {
  const entries = {
    "dna.fontLegend": { zh: "字体", en: "Font" },
    "dna.fontSans": fontCopy.sans.label,
    "dna.fontSansDesc": fontCopy.sans.desc,
    "dna.fontSerif": fontCopy.serif.label,
    "dna.fontSerifDesc": fontCopy.serif.desc,
    "dna.fontMono": fontCopy.mono.label,
    "dna.fontMonoDesc": fontCopy.mono.desc,
    "dna.fontHei": fontCopy.hei.label,
    "dna.fontHeiDesc": fontCopy.hei.desc,
    "dna.fontKai": fontCopy.kai.label,
    "dna.fontKaiDesc": fontCopy.kai.desc,
    "dna.fontFangsong": fontCopy.fangsong.label,
    "dna.fontFangsongDesc": fontCopy.fangsong.desc,
    "dna.fontYuan": fontCopy.yuan.label,
    "dna.fontYuanDesc": fontCopy.yuan.desc,
    "dna.fontGeometric": fontCopy.geometric.label,
    "dna.fontGeometricDesc": fontCopy.geometric.desc,
  };
  window.image2I18n?.addTranslations(entries);
}

function renderFontChoices() {
  const field = $(".font-field");
  if (!field) return;
  const legend = $("legend", field);
  if (legend) legend.textContent = pick({ zh: "字体", en: "Font" });
  field.setAttribute("aria-label", pick({ zh: "字体", en: "Font" }));
  const list = $(".type-list", field);
  if (list) list.setAttribute("aria-label", pick({ zh: "字体", en: "Font" }));

  $$(".type-option[data-value]", field).forEach((button) => {
    const copy = fontCopy[button.dataset.value];
    if (!copy) return;
    const title = $("b", button);
    const desc = $("span", button);
    const sample = $("i", button);
    if (title) title.textContent = pick(copy.label);
    if (desc) desc.textContent = pick(copy.desc);
    if (sample) sample.style.setProperty("--font-option-family", copy.sample);
  });
}

function effectButton(group, value, copy) {
  return `<button type="button" data-font-effect="${group}" data-effect-value="${value}" class="${effects[group] === value ? "is-selected" : ""}">${pick(copy)}</button>`;
}

function renderEffectControls() {
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
    <div class="font-effect-row"><span class="font-effect-label">${pick(effectCopy.weight)}</span><div class="font-effect-segments">
      ${Object.entries(effectCopy.weightValues).map(([value, copy]) => effectButton("weight", value, copy)).join("")}
    </div></div>
    <div class="font-effect-row"><span class="font-effect-label">${pick(effectCopy.tracking)}</span><div class="font-effect-segments">
      ${Object.entries(effectCopy.trackingValues).map(([value, copy]) => effectButton("tracking", value, copy)).join("")}
    </div></div>
    <div class="font-effect-row"><span class="font-effect-label">${pick(effectCopy.slant)}</span><div class="font-effect-segments">
      ${Object.entries(effectCopy.slantValues).map(([value, copy]) => effectButton("slant", value, copy)).join("")}
    </div></div>`;
}

function applyEffects() {
  const tracking = { tight: "-.025em", normal: "normal", loose: ".045em" }[effects.tracking] || "normal";
  const root = document.documentElement;
  root.style.setProperty("--dna-heading-weight", effects.weight);
  root.style.setProperty("--dna-font-tracking", tracking);
  root.style.setProperty("--dna-font-slant", effects.slant === "italic" ? "italic" : "normal");
  $$("[data-font-effect]").forEach((button) => {
    button.classList.toggle("is-selected", effects[button.dataset.fontEffect] === button.dataset.effectValue);
  });
}

function selectedFontKey() {
  return $(".type-option.is-selected")?.dataset.value || "sans";
}

function selectedFontLabel() {
  return pick(fontCopy[selectedFontKey()]?.label || fontCopy.sans.label);
}

function renderConcreteSurfaces() {
  const fontLabel = selectedFontLabel();
  const dock = $("#dockFont");
  if (dock) dock.textContent = fontLabel;

  const summaryRows = $$("#dnaSummary > div");
  if (summaryRows[2]) {
    const dd = $("dd", summaryRows[2]);
    if (dd) dd.textContent = fontLabel;
  }

  const rules = $('[data-section-value="rules"]');
  if (rules) {
    const chunks = rules.textContent.split(" · ");
    if (chunks.length > 1) chunks[chunks.length - 1] = fontLabel;
    rules.textContent = chunks.join(" · ");
  }
  syncPrompt();
}

function syncPrompt() {
  const node = $("#dnaPrompt");
  if (!node || promptGuard) return;
  promptGuard = true;
  const isEn = lang() === "en";
  const fontLabel = selectedFontLabel();
  let lines = node.textContent.split("\n").filter(Boolean);
  lines = lines.filter((line) => !/^(?:标题字重|字距|字形|Heading weight|Tracking|Slant):/.test(line));
  lines = lines.map((line) => {
    if (/^(?:字体|Typography):/.test(line)) return `${isEn ? "Typography" : "字体"}: ${fontLabel}`;
    return line;
  });
  const insertAt = Math.max(0, lines.findIndex((line) => /^(?:圆角|Radius):/.test(line)));
  const effectLines = isEn
    ? [
        `Heading weight: ${effects.weight}`,
        `Tracking: ${pick(effectCopy.trackingValues[effects.tracking])}`,
        `Slant: ${pick(effectCopy.slantValues[effects.slant])}`,
      ]
    : [
        `标题字重: ${effects.weight}`,
        `字距: ${pick(effectCopy.trackingValues[effects.tracking])}`,
        `字形: ${pick(effectCopy.slantValues[effects.slant])}`,
      ];
  if (insertAt > 0) lines.splice(insertAt, 0, ...effectLines);
  else lines.push(...effectLines);
  node.textContent = lines.join("\n");
  promptGuard = false;
}

function toast(message) {
  const node = $("#dnaToast");
  if (!node) return;
  node.textContent = message;
  node.hidden = false;
  clearTimeout(toast.timer);
  toast.timer = setTimeout(() => { node.hidden = true; }, 2200);
}

function installEvents() {
  document.addEventListener("click", (event) => {
    const effect = event.target.closest("[data-font-effect]");
    if (effect) {
      effects[effect.dataset.fontEffect] = effect.dataset.effectValue;
      persistEffects();
      applyEffects();
      renderConcreteSurfaces();
      return;
    }
    if (event.target.closest(".dna-controls button, .dna-preset-item")) {
      setTimeout(renderConcreteSurfaces, 0);
    }
  });

  document.addEventListener("change", () => setTimeout(renderConcreteSurfaces, 0));

  $("#saveDna")?.addEventListener("click", () => {
    persistEffects();
    setTimeout(persistEffects, 0);
  });

  $("#copyDna")?.addEventListener("click", async (event) => {
    event.preventDefault();
    event.stopImmediatePropagation();
    syncPrompt();
    try {
      await navigator.clipboard.writeText($("#dnaPrompt")?.textContent || "");
      toast(pick({ zh: "提示词已复制", en: "Prompt copied" }));
    } catch {
      toast(pick({ zh: "复制失败，请重试", en: "Copy failed, please retry" }));
    }
  }, true);

  window.addEventListener("image2:languagechange", () => {
    setTimeout(() => {
      renderFontChoices();
      renderEffectControls();
      applyEffects();
      renderConcreteSurfaces();
    }, 0);
  });
}

function init() {
  readEffects();
  installStyles();
  registerConcreteTranslations();
  renderFontChoices();
  renderEffectControls();
  applyEffects();
  renderConcreteSurfaces();
  installEvents();

  const prompt = $("#dnaPrompt");
  if (prompt) {
    new MutationObserver(() => {
      if (!promptGuard) setTimeout(renderConcreteSurfaces, 0);
    }).observe(prompt, { childList: true, characterData: true, subtree: true });
  }
}

if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init, { once: true });
else init();
