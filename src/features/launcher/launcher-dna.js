const STORAGE_KEY = "ondesign:interface-dna:v1";
const palettes = {
  sage: { label: "鼠尾草绿", colors: ["#18a957", "#e7f5ec", "#f6f5f1", "#24231f"] },
  ink: { label: "墨黑灰", colors: ["#111111", "#e8e8e4", "#f5f4f0", "#252724"] },
  blue: { label: "深海蓝", colors: ["#2457e6", "#e7edff", "#f2f5ff", "#17213c"] },
  coral: { label: "暖珊瑚", colors: ["#e4573d", "#fff0e8", "#fff7f2", "#321d18"] },
};
const labels = {
  style: { restrained: "克制", editorial: "编辑感", vivid: "活力", future: "未来感" },
  density: { loose: "宽松", balanced: "平衡", compact: "紧凑" },
  font: { sans: "简洁无衬线", serif: "编辑衬线", mono: "几何等宽" },
  radius: { "0": "直角", "14": "适中", "28": "圆润" },
  spacing: { "6": "紧凑", "10": "平衡", "14": "宽松" },
};
const state = { step: "direction", style: "restrained", density: "balanced", palette: "sage", font: "sans", radius: "14", spacing: "10", device: "desktop" };
const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];

function setStep(step) {
  if (!$(`[data-panel="${step}"]`)) return;
  state.step = step;
  $$(".dna-step").forEach((button) => {
    const active = button.dataset.step === step;
    button.classList.toggle("is-active", active);
    if (active) button.setAttribute("aria-current", "step"); else button.removeAttribute("aria-current");
  });
  $$(".dna-panel").forEach((panel) => { const active = panel.dataset.panel === step; panel.hidden = !active; panel.classList.toggle("is-active", active); });
  if (step === "save") renderSummary();
}

function selectInGroup(group, button) {
  const value = button.dataset.value;
  if (!value) return;
  state[group] = value;
  $$(`[data-choice-group="${group}"] button`).forEach((item) => {
    const selected = item === button;
    item.classList.toggle("is-selected", selected);
    if (item.getAttribute("role") === "radio") item.setAttribute("aria-checked", String(selected));
  });
  applyPreview();
}

function selectStyle(button) {
  state.style = button.dataset.style;
  $$(".direction-card").forEach((item) => { const selected = item === button; item.classList.toggle("is-selected", selected); item.setAttribute("aria-checked", String(selected)); });
  const preset = {
    restrained: { density: "balanced", palette: "sage", font: "sans", radius: "14", spacing: "10" },
    editorial: { density: "compact", palette: "ink", font: "serif", radius: "0", spacing: "6" },
    vivid: { density: "compact", palette: "coral", font: "sans", radius: "28", spacing: "10" },
    future: { density: "balanced", palette: "blue", font: "mono", radius: "14", spacing: "14" },
  }[state.style];
  Object.assign(state, preset);
  ["density", "palette", "font", "radius", "spacing"].forEach((group) => {
    $$(`[data-choice-group="${group}"] button`).forEach((item) => {
      const selected = item.dataset.value === state[group];
      item.classList.toggle("is-selected", selected);
      if (item.getAttribute("role") === "radio") item.setAttribute("aria-checked", String(selected));
    });
  });
  applyPreview();
}

function applyPreview() {
  const root = document.documentElement;
  const palette = palettes[state.palette];
  const densityScale = { loose: 1.28, balanced: 1, compact: .78 }[state.density];
  const displayFont = {
    sans: 'Inter,"PingFang SC","Microsoft YaHei",sans-serif',
    serif: '"Noto Serif SC","Songti SC",Georgia,serif',
    mono: '"SFMono-Regular",Consolas,"Liberation Mono",monospace',
  }[state.font];
  root.style.setProperty("--dna-accent", palette.colors[0]);
  root.style.setProperty("--dna-accent-soft", palette.colors[1]);
  root.style.setProperty("--dna-canvas", palette.colors[2]);
  root.style.setProperty("--dna-ink", palette.colors[3]);
  root.style.setProperty("--dna-radius", `${state.radius}px`);
  root.style.setProperty("--dna-space", `${Number(state.spacing) * densityScale}px`);
  root.style.setProperty("--dna-display", displayFont);
  document.body.dataset.style = state.style;
  const styleRadius = { restrained: state.radius, editorial: "0", vivid: String(Math.max(16, Number(state.radius))), future: String(Math.max(4, Number(state.radius))) }[state.style];
  $(".sample-visual")?.style.setProperty("border-radius", `${styleRadius}px`);
  $$("#dockPalette i").forEach((item, index) => { item.style.background = palette.colors[index]; });
  $("#dockFont").textContent = labels.font[state.font];
  $("#dockRadius").textContent = `${state.radius}px 圆角`;
  $("#dockDensity").textContent = `${labels.density[state.density]}密度`;
}

function renderSummary() {
  const summary = $("#dnaSummary");
  if (!summary) return;
  const rows = [["设计方向", labels.style[state.style]], ["颜色", palettes[state.palette].label], ["字体", labels.font[state.font]], ["圆角", `${labels.radius[state.radius]} · ${state.radius}px`], ["间距", `${labels.spacing[state.spacing]} · ${state.spacing}px`], ["密度", labels.density[state.density]]];
  summary.replaceChildren(...rows.map(([term, value]) => {
    const row = document.createElement("div"); const dt = document.createElement("dt"); const dd = document.createElement("dd");
    dt.textContent = term; dd.textContent = value; row.append(dt, dd); return row;
  }));
}

function dnaPayload() {
  return { name: $("#dnaName")?.value.trim() || "未命名界面 DNA", updatedAt: new Date().toISOString(), ...Object.fromEntries(Object.entries(state).filter(([key]) => !["step", "device"].includes(key))), colors: palettes[state.palette].colors };
}
function dnaText() {
  const data = dnaPayload();
  return [`界面设计 DNA：${data.name}`, `设计方向：${labels.style[data.style]}`, `颜色：${palettes[data.palette].label}（${data.colors.join(" / ")}）`, `字体：${labels.font[data.font]}`, `圆角：${data.radius}px`, `基础间距：${data.spacing}px`, `界面密度：${labels.density[data.density]}`, "复用要求：新页面应继承以上视觉规则，仅根据页面任务调整内容结构。"].join("\n");
}
function toast(message) { const node = $("#dnaToast"); if (!node) return; node.textContent = message; node.hidden = false; clearTimeout(toast.timer); toast.timer = setTimeout(() => { node.hidden = true; }, 2200); }
async function copyDna() { try { await navigator.clipboard.writeText(dnaText()); toast("设计规范已复制"); } catch { toast("复制失败，请重试"); } }
function saveDna() { localStorage.setItem(STORAGE_KEY, JSON.stringify(dnaPayload())); $("#saveNote").textContent = "已保存到当前浏览器，可继续用于其他页面。"; toast("界面 DNA 已保存"); }

function restoreDna() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || "null"); if (!saved) return;
    ["style", "density", "palette", "font", "radius", "spacing"].forEach((key) => { if (saved[key] != null) state[key] = String(saved[key]); });
    if (saved.name) $("#dnaName").value = saved.name;
    $$(".direction-card").forEach((item) => { const selected = item.dataset.style === state.style; item.classList.toggle("is-selected", selected); item.setAttribute("aria-checked", String(selected)); });
    ["density", "palette", "font", "radius", "spacing"].forEach((group) => { $$(`[data-choice-group="${group}"] button`).forEach((item) => { const selected = item.dataset.value === state[group]; item.classList.toggle("is-selected", selected); if (item.getAttribute("role") === "radio") item.setAttribute("aria-checked", String(selected)); }); });
  } catch { localStorage.removeItem(STORAGE_KEY); }
}

function installEvents() {
  $$(".dna-step").forEach((button) => button.addEventListener("click", () => setStep(button.dataset.step)));
  $$('[data-next]').forEach((button) => button.addEventListener("click", () => setStep(button.dataset.next)));
  $$('[data-go-save]').forEach((button) => button.addEventListener("click", () => setStep("save")));
  $$(".direction-card").forEach((button) => button.addEventListener("click", () => selectStyle(button)));
  $$('[data-choice-group]').forEach((group) => group.addEventListener("click", (event) => { const button = event.target.closest("button[data-value]"); if (button) selectInGroup(group.dataset.choiceGroup, button); }));
  $$("[data-open-rule]").forEach((button) => button.addEventListener("click", () => setStep("rules")));
  $$("[data-device]").forEach((button) => button.addEventListener("click", () => { state.device = button.dataset.device; $$("[data-device]").forEach((item) => item.classList.toggle("is-selected", item === button)); $("[data-preview-stage]").classList.toggle("is-mobile", state.device === "mobile"); }));
  $("#saveDna")?.addEventListener("click", saveDna); $("#copyDna")?.addEventListener("click", copyDna);
}

restoreDna(); installEvents(); applyPreview(); renderSummary();
