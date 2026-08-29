import {
  DESIGN_SYSTEMS,
  DESIGN_SYSTEM_CATEGORY_LABELS as CATEGORY_LABELS,
  DESIGN_SYSTEM_SOURCE_REPO as SOURCE_REPO,
  DESIGN_SYSTEM_SOURCE_BASE as SOURCE_BASE,
} from "./design-systems-catalog.js";

const STORAGE_KEY = "ondesign:design-system-preset:v1";
const cache = new Map();
let selectedEntry = null;
let selectedSpec = null;
let currentCategory = "all";
let dialog = null;
let grid = null;
let detail = null;
let searchInput = null;
let currentButton = null;
let statusNode = null;
let promptSnapshot = "";

const lang = () => (window.image2I18n?.language === "en" || document.documentElement.lang.startsWith("en") ? "en" : "zh");
const txt = (zh, en) => (lang() === "en" ? en : zh);
const esc = (value) => String(value ?? "").replace(/[&<>"']/g, (ch) => ({ "&":"&amp;", "<":"&lt;", ">":"&gt;", '"':"&quot;", "'":"&#39;" }[ch]));
const cssValue = (value, fallback) => {
  const v = String(value || "").trim();
  return /^#(?:[\da-f]{3,8})$/i.test(v) || /^(?:rgb|hsl|oklch|color)\(/i.test(v) ? v : fallback;
};
const pxNumber = (value, fallback) => {
  const match = String(value || "").match(/-?\d+(?:\.\d+)?/);
  return match ? Number(match[0]) : fallback;
};
const sourceUrl = (entry) => `${SOURCE_BASE}/${entry.slug}/DESIGN.md`;
const getDesignUrl = (entry) => `https://getdesign.md/${entry.slug}/design-md`;

function parseDesign(text, entry) {
  const result = {
    description: entry.description,
    colors: {},
    typography: {},
    rounded: {},
    spacing: {},
    components: [],
    raw: text,
  };
  const end = text.startsWith("---") ? text.indexOf("\n---", 3) : -1;
  const frontmatter = text.startsWith("---") ? text.slice(3, end > 0 ? end : text.length) : text;
  const lines = frontmatter.split(/\r?\n/);
  let section = "";
  let subkey = "";
  for (const line of lines) {
    if (!line.trim() || /^\s*#/.test(line)) continue;
    const top = line.match(/^([A-Za-z][\w-]*):(?:\s*(.*))?$/);
    if (top) {
      section = top[1];
      subkey = "";
      const topValue = (top[2] || "").trim().replace(/^["']|["']$/g, "");
      if (section === "description" && topValue) result.description = topValue;
      continue;
    }
    if (section === "colors") {
      const match = line.match(/^\s{2}([\w-]+):\s*["']?([^"']+?)["']?\s*$/);
      if (match) result.colors[match[1]] = match[2].trim();
    } else if (section === "rounded" || section === "spacing") {
      const match = line.match(/^\s{2}([\w-]+):\s*["']?([^"']+?)["']?\s*$/);
      if (match) result[section][match[1]] = match[2].trim();
    } else if (section === "typography") {
      const role = line.match(/^\s{2}([\w-]+):\s*$/);
      if (role) {
        subkey = role[1];
        result.typography[subkey] = {};
        continue;
      }
      const prop = line.match(/^\s{4}([\w-]+):\s*["']?([^"']+?)["']?\s*$/);
      if (prop && subkey) result.typography[subkey][prop[1]] = prop[2].trim();
    } else if (section === "components") {
      const component = line.match(/^\s{2}([\w-]+):\s*$/);
      if (component) result.components.push(component[1]);
    }
  }
  if (!Object.keys(result.colors).length) {
    [...new Set(text.match(/#[0-9a-fA-F]{3,8}\b/g) || [])].slice(0, 12).forEach((value, index) => {
      result.colors[`color-${index + 1}`] = value;
    });
  }
  return result;
}

function pickColor(spec, names, fallback) {
  for (const name of names) if (spec.colors[name]) return cssValue(spec.colors[name], fallback);
  const values = Object.values(spec.colors).filter(Boolean);
  return cssValue(values[0], fallback);
}

function paletteFor(spec) {
  return {
    accent: pickColor(spec, ["primary", "accent", "brand", "brand-primary", "action", "cta", "highlight"], "#18a957"),
    canvas: pickColor(spec, ["canvas", "background", "bg", "page", "base"], "#f5f5f5"),
    surface: pickColor(spec, ["surface-1", "surface", "card", "panel", "surface-primary"], "#ffffff"),
    ink: pickColor(spec, ["ink", "text", "foreground", "text-primary", "on-background"], "#202020"),
    muted: pickColor(spec, ["ink-muted", "muted", "text-secondary", "subtle"], "#737373"),
  };
}

function typographyList(spec) {
  const entries = Object.entries(spec.typography);
  const preferred = ["display-xl", "display-lg", "headline", "title", "body", "body-sm", "caption", "mono"];
  return [
    ...preferred.map((key) => [key, spec.typography[key]]).filter(([, value]) => value),
    ...entries.filter(([key]) => !preferred.includes(key)),
  ].slice(0, 6);
}

function primaryFont(spec) {
  return typographyList(spec).find(([, value]) => value?.fontFamily)?.[1]?.fontFamily || "system-ui";
}
function radiusValue(spec) {
  return spec.rounded.md || spec.rounded.base || spec.rounded.sm || Object.values(spec.rounded)[0] || "8px";
}
function spacingValue(spec) {
  return spec.spacing.md || spec.spacing.base || spec.spacing.sm || Object.values(spec.spacing)[0] || "16px";
}

async function loadSpec(entry) {
  if (cache.has(entry.slug)) return cache.get(entry.slug);
  const request = fetch(sourceUrl(entry), { cache: "force-cache" })
    .then((response) => {
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      return response.text();
    })
    .then((text) => parseDesign(text, entry))
    .catch((error) => ({
      description: entry.description,
      colors: {}, typography: {}, rounded: {}, spacing: {}, components: [], raw: "", error: String(error),
    }));
  cache.set(entry.slug, request);
  return request;
}

function createStyles() {
  if (document.getElementById("ondesign-design-system-style")) return;
  const style = document.createElement("style");
  style.id = "ondesign-design-system-style";
  style.textContent = `
    .ds-field{margin:0 0 16px;padding:0;border:0}.ds-field>legend{margin:0 0 8px;color:var(--ant-text,#262626);font-size:13px;font-weight:500}
    .ds-current{display:grid;grid-template-columns:minmax(0,1fr) auto;align-items:center;gap:12px;width:100%;min-height:58px;padding:10px 12px;border:1px solid var(--ant-border,#d9d9d9);border-radius:7px;background:#fff;text-align:left}.ds-current:hover{border-color:var(--ant-primary,#18a957)}
    .ds-current-copy{min-width:0;display:grid;gap:2px}.ds-current-copy strong{font-size:13px;font-weight:650}.ds-current-copy small{overflow:hidden;color:#737373;font-size:11px;text-overflow:ellipsis;white-space:nowrap}.ds-current-visual{display:flex;align-items:center;gap:4px}.ds-current-visual i{width:16px;height:28px;border:1px solid rgba(0,0,0,.08);border-radius:4px;background:#eee}.ds-current-arrow{margin-left:4px;color:#777;font-size:16px}
    .ds-dialog{width:min(1280px,calc(100vw - 32px));height:min(850px,calc(100vh - 32px));max-width:none;max-height:none;padding:0;border:1px solid #dedede;border-radius:16px;background:#fff;box-shadow:0 28px 90px rgba(0,0,0,.22);overflow:hidden}.ds-dialog::backdrop{background:rgba(15,18,16,.5);backdrop-filter:blur(8px)}
    .ds-shell{display:grid;grid-template-rows:auto minmax(0,1fr);height:100%}.ds-head{display:flex;align-items:center;gap:14px;padding:14px 16px;border-bottom:1px solid #eee}.ds-title{min-width:160px}.ds-title strong{display:block;font-size:16px}.ds-title small{color:#777;font-size:11px}.ds-search{flex:1;min-width:180px;height:38px;padding:0 12px;border:1px solid #d9d9d9;border-radius:7px;font:inherit;outline:0}.ds-search:focus{border-color:#18a957;box-shadow:0 0 0 2px rgb(24 169 87 / 12%)}.ds-close{display:grid;width:38px;height:38px;place-items:center;border:0;border-radius:7px;background:#f5f5f5;font-size:20px}.ds-close:hover{background:#ececec}
    .ds-body{display:grid;grid-template-columns:minmax(0,1.12fr) minmax(360px,.88fr);min-height:0}.ds-library{display:grid;grid-template-rows:auto minmax(0,1fr);min-width:0;border-right:1px solid #eee}.ds-filters{display:flex;gap:6px;padding:10px 12px;border-bottom:1px solid #f0f0f0;overflow:auto}.ds-filter{flex:0 0 auto;min-height:30px;padding:0 10px;border:1px solid #e2e2e2;border-radius:999px;background:#fff;color:#666;font-size:11px}.ds-filter.is-active{border-color:#18a957;background:#f0f9f3;color:#128a46}
    .ds-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:10px;align-content:start;padding:12px;overflow:auto;background:#fafafa}.ds-card{display:grid;gap:9px;padding:12px;border:1px solid #e4e4e4;border-radius:10px;background:#fff;text-align:left;transition:border-color .15s ease,transform .15s ease}.ds-card:hover{border-color:#18a957;transform:translateY(-1px)}.ds-card.is-selected{border-color:#18a957;box-shadow:0 0 0 1px #18a957}.ds-card-head{display:flex;align-items:center;gap:8px}.ds-logo{display:grid;width:30px;height:30px;place-items:center;flex:0 0 30px;border-radius:7px;background:#f2f2f2;font-size:10px;font-weight:800}.ds-card-name{min-width:0}.ds-card-name strong{display:block;font-size:13px}.ds-card-name small{display:block;overflow:hidden;color:#888;font-size:10px;text-overflow:ellipsis;white-space:nowrap}.ds-swatches{display:grid;grid-template-columns:repeat(5,1fr);height:22px;overflow:hidden;border:1px solid rgba(0,0,0,.08);border-radius:5px}.ds-card-meta{display:flex;gap:8px;color:#777;font-size:10px}.ds-card-meta span{overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.ds-card-desc{display:-webkit-box;overflow:hidden;color:#777;font-size:10.5px;line-height:1.45;-webkit-box-orient:vertical;-webkit-line-clamp:2}
    .ds-detail{min-width:0;overflow:auto;padding:18px 20px;background:#fff}.ds-empty{display:grid;min-height:100%;place-items:center;color:#888;font-size:12px;text-align:center}.ds-detail-hero{display:grid;gap:14px;margin-bottom:18px;padding:18px;border:1px solid color-mix(in srgb,var(--ds-ink,#222) 12%,transparent);border-radius:12px;background:var(--ds-canvas,#f6f6f6);color:var(--ds-ink,#222)}.ds-detail-top{display:flex;align-items:flex-start;justify-content:space-between;gap:14px}.ds-detail-top h3{margin:0;font-size:22px;line-height:1.2}.ds-detail-top p{margin:5px 0 0;color:var(--ds-muted,#707070);font-size:11px;line-height:1.5}.ds-source{flex:0 0 auto;color:inherit;font-size:11px;text-underline-offset:3px}
    .ds-mini-ui{display:grid;grid-template-columns:1.08fr .92fr;gap:10px}.ds-mini-copy{display:grid;align-content:center;gap:7px;padding:16px;border-radius:var(--ds-radius,8px);background:var(--ds-surface,#fff);border:1px solid color-mix(in srgb,var(--ds-ink,#222) 12%,transparent)}.ds-mini-copy small{color:var(--ds-accent,#18a957);font-weight:700}.ds-mini-copy b{font-family:var(--ds-font,system-ui);font-size:19px;line-height:1.15}.ds-mini-copy p{margin:0;color:var(--ds-muted,#777);font-size:10px;line-height:1.5}.ds-mini-copy button{justify-self:start;min-height:30px;padding:0 11px;border:0;border-radius:var(--ds-radius,8px);background:var(--ds-accent,#18a957);color:#fff;font-size:10px;font-weight:700}.ds-mini-panel{display:grid;gap:7px;padding:10px;border-radius:var(--ds-radius,8px);background:var(--ds-surface,#fff);border:1px solid color-mix(in srgb,var(--ds-ink,#222) 12%,transparent)}.ds-mini-row{display:grid;grid-template-columns:28px 1fr auto;align-items:center;gap:7px;padding:7px;border-radius:calc(var(--ds-radius,8px)*.65);background:color-mix(in srgb,var(--ds-surface,#fff) 78%,var(--ds-canvas,#f6f6f6))}.ds-mini-row i{height:18px;border-radius:4px;background:var(--ds-accent,#18a957)}.ds-mini-row span{height:6px;border-radius:999px;background:color-mix(in srgb,var(--ds-ink,#222) 22%,transparent)}.ds-mini-row em{font-size:9px;font-style:normal}
    .ds-section{margin:18px 0 0}.ds-section-head{display:flex;align-items:center;justify-content:space-between;margin-bottom:8px}.ds-section-head h4{margin:0;font-size:12px}.ds-section-head small{color:#888;font-size:10px}.ds-color-grid{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:7px}.ds-color{overflow:hidden;border:1px solid #e6e6e6;border-radius:8px}.ds-color i{display:block;height:48px}.ds-color span{display:block;overflow:hidden;padding:6px 7px;color:#555;font-size:9px;text-overflow:ellipsis;white-space:nowrap}.ds-type-list{display:grid;gap:7px}.ds-type-row{display:grid;grid-template-columns:100px minmax(0,1fr) auto;align-items:center;gap:10px;padding:8px 0;border-bottom:1px solid #f0f0f0}.ds-type-row:last-child{border-bottom:0}.ds-type-row small{color:#777;font-size:9px}.ds-type-row b{overflow:hidden;font-size:15px;font-weight:600;text-overflow:ellipsis;white-space:nowrap}.ds-type-row em{color:#888;font-size:9px;font-style:normal}.ds-token-row{display:grid;grid-template-columns:1fr 1fr;gap:12px}.ds-token-box{padding:10px;border:1px solid #eee;border-radius:9px}.ds-token-box h5{margin:0 0 8px;font-size:10px}.ds-radius-demo{display:flex;align-items:end;gap:8px}.ds-radius-demo i{display:block;width:42px;height:42px;border:1px solid #ddd;background:#f6f6f6}.ds-space-bars{display:grid;gap:5px}.ds-space-bars i{display:block;height:7px;border-radius:999px;background:#d8d8d8}.ds-components{display:flex;flex-wrap:wrap;gap:6px}.ds-components span{padding:5px 8px;border-radius:6px;background:#f5f5f5;color:#555;font-size:9px}.ds-actions{display:flex;gap:8px;margin-top:18px}.ds-apply{flex:1;min-height:40px;border:0;border-radius:7px;background:#18a957;color:#fff;font-weight:650}.ds-apply:hover{background:#128a46}.ds-note{margin-top:10px;color:#888;font-size:9.5px;line-height:1.5}.ds-status{min-height:18px;margin-top:6px;color:#18a957;font-size:10px}
    @media(max-width:900px){.ds-body{grid-template-columns:1fr}.ds-library{border-right:0}.ds-detail{display:none}.ds-grid{grid-template-columns:1fr}.ds-title{display:none}}
  `;
  document.head.append(style);
}

function initials(name) {
  return name.replace(/\([^)]*\)/g, "").split(/\s+/).filter(Boolean).map((part) => part[0]).join("").slice(0, 2).toUpperCase();
}

function ensureLauncherField() {
  const rulesBody = document.querySelector("#dna-rules .dna-section-body");
  if (!rulesBody || document.querySelector("[data-design-system-field]")) return;
  const field = document.createElement("fieldset");
  field.className = "ds-field";
  field.dataset.designSystemField = "";
  field.innerHTML = `
    <legend>${txt("设计规范", "Design system")}</legend>
    <button class="ds-current" type="button" data-design-system-current>
      <span class="ds-current-copy"><strong>${txt("选择设计规范", "Choose a design system")}</strong><small>${txt("73 套真实网站 DESIGN.md，可搜索和预览", "73 real-site DESIGN.md presets with visual previews")}</small></span>
      <span class="ds-current-visual" aria-hidden="true"><i></i><i></i><i></i><i></i><span class="ds-current-arrow">⌄</span></span>
    </button>
    <div class="ds-status" data-design-system-status></div>`;
  rulesBody.prepend(field);
  currentButton = field.querySelector("[data-design-system-current]");
  statusNode = field.querySelector("[data-design-system-status]");
  currentButton.addEventListener("click", openDialog);
}

function ensureDialog() {
  if (dialog) return;
  dialog = document.createElement("dialog");
  dialog.className = "ds-dialog";
  dialog.setAttribute("aria-label", txt("设计规范库", "Design system library"));
  dialog.innerHTML = `
    <div class="ds-shell">
      <header class="ds-head">
        <div class="ds-title"><strong>${txt("设计规范库", "Design system library")}</strong><small>73 DESIGN.md · VoltAgent</small></div>
        <input class="ds-search" type="search" placeholder="${txt("搜索 Linear、Apple、Figma…", "Search Linear, Apple, Figma…")}" aria-label="${txt("搜索设计规范", "Search design systems")}">
        <button class="ds-close" type="button" aria-label="${txt("关闭", "Close")}">×</button>
      </header>
      <div class="ds-body">
        <section class="ds-library"><div class="ds-filters" data-ds-filters></div><div class="ds-grid" data-ds-grid></div></section>
        <aside class="ds-detail" data-ds-detail><div class="ds-empty">${txt("选择一套规范，查看颜色、字体、圆角、间距和组件可视化。", "Choose a system to preview colors, typography, radius, spacing, and components.")}</div></aside>
      </div>
    </div>`;
  document.body.append(dialog);
  grid = dialog.querySelector("[data-ds-grid]");
  detail = dialog.querySelector("[data-ds-detail]");
  searchInput = dialog.querySelector(".ds-search");
  dialog.querySelector(".ds-close").addEventListener("click", () => dialog.close());
  dialog.addEventListener("click", (event) => { if (event.target === dialog) dialog.close(); });
  searchInput.addEventListener("input", renderCards);
  const filters = dialog.querySelector("[data-ds-filters]");
  Object.keys(CATEGORY_LABELS).forEach((key) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = `ds-filter${key === "all" ? " is-active" : ""}`;
    button.dataset.category = key;
    button.textContent = CATEGORY_LABELS[key][lang()];
    button.addEventListener("click", () => {
      currentCategory = key;
      filters.querySelectorAll(".ds-filter").forEach((item) => item.classList.toggle("is-active", item === button));
      renderCards();
    });
    filters.append(button);
  });
}

function filteredEntries() {
  const query = (searchInput?.value || "").trim().toLowerCase();
  return DESIGN_SYSTEMS.filter((entry) => {
    const categoryMatch = currentCategory === "all" || entry.category === currentCategory;
    const textMatch = !query || `${entry.name} ${entry.slug} ${entry.description}`.toLowerCase().includes(query);
    return categoryMatch && textMatch;
  });
}

function cardHtml(entry) {
  return `<button type="button" class="ds-card${selectedEntry?.slug === entry.slug ? " is-selected" : ""}" data-ds-slug="${esc(entry.slug)}">
    <span class="ds-card-head"><span class="ds-logo">${esc(initials(entry.name))}</span><span class="ds-card-name"><strong>${esc(entry.name)}</strong><small>${esc(CATEGORY_LABELS[entry.category][lang()])}</small></span></span>
    <span class="ds-swatches" data-card-swatches><i></i><i></i><i></i><i></i><i></i></span>
    <span class="ds-card-meta" data-card-meta><span>${txt("正在读取 DESIGN.md", "Loading DESIGN.md")}</span></span>
    <span class="ds-card-desc">${esc(entry.description)}</span>
  </button>`;
}

function renderCards() {
  if (!grid) return;
  const entries = filteredEntries();
  grid.innerHTML = entries.map(cardHtml).join("") || `<div class="ds-empty">${txt("没有匹配的设计规范", "No matching design systems")}</div>`;
  grid.querySelectorAll(".ds-card").forEach((card) => {
    const entry = DESIGN_SYSTEMS.find((item) => item.slug === card.dataset.dsSlug);
    card.addEventListener("click", () => selectForPreview(entry));
    hydrateCard(entry, card);
  });
}

async function hydrateCard(entry, card) {
  const spec = await loadSpec(entry);
  if (!card.isConnected) return;
  const palette = paletteFor(spec);
  [palette.accent, palette.ink, palette.canvas, palette.surface, palette.muted].forEach((color, index) => {
    const swatch = card.querySelectorAll("[data-card-swatches] i")[index];
    if (swatch) swatch.style.background = color;
  });
  const meta = card.querySelector("[data-card-meta]");
  if (meta) meta.innerHTML = `<span>${esc(primaryFont(spec))}</span><span>${esc(radiusValue(spec))}</span>`;
}

async function selectForPreview(entry) {
  if (!entry) return;
  selectedEntry = entry;
  grid?.querySelectorAll(".ds-card").forEach((card) => card.classList.toggle("is-selected", card.dataset.dsSlug === entry.slug));
  detail.innerHTML = `<div class="ds-empty">${txt("正在读取并可视化 DESIGN.md…", "Loading and visualizing DESIGN.md…")}</div>`;
  const spec = await loadSpec(entry);
  selectedSpec = spec;
  renderDetail(entry, spec);
}

function renderDetail(entry, spec) {
  const palette = paletteFor(spec);
  const type = typographyList(spec);
  const radius = radiusValue(spec);
  const spacing = spacingValue(spec);
  const colors = Object.entries(spec.colors).slice(0, 12);
  const components = spec.components.slice(0, 12);
  detail.style.setProperty("--ds-accent", palette.accent);
  detail.style.setProperty("--ds-canvas", palette.canvas);
  detail.style.setProperty("--ds-surface", palette.surface);
  detail.style.setProperty("--ds-ink", palette.ink);
  detail.style.setProperty("--ds-muted", palette.muted);
  detail.style.setProperty("--ds-radius", radius);
  detail.style.setProperty("--ds-font", `"${primaryFont(spec)}",system-ui,sans-serif`);
  detail.innerHTML = `
    <section class="ds-detail-hero">
      <div class="ds-detail-top"><div><h3>${esc(entry.name)}</h3><p>${esc(spec.description || entry.description)}</p></div><a class="ds-source" href="${esc(getDesignUrl(entry))}" target="_blank" rel="noopener">${txt("查看原始 DESIGN.md ↗", "View source DESIGN.md ↗")}</a></div>
      <div class="ds-mini-ui">
        <div class="ds-mini-copy"><small>DESIGN SYSTEM</small><b>${esc(entry.name)} interface</b><p>${txt("颜色、字体、形状与间距统一来自这一套视觉语言。", "Color, type, shape and spacing follow one coherent visual language.")}</p><button type="button">${txt("主要操作", "Primary action")}</button></div>
        <div class="ds-mini-panel"><div class="ds-mini-row"><i></i><span></span><em>01</em></div><div class="ds-mini-row"><i></i><span></span><em>02</em></div><div class="ds-mini-row"><i></i><span></span><em>03</em></div></div>
      </div>
    </section>
    <section class="ds-section"><div class="ds-section-head"><h4>${txt("颜色系统", "Color system")}</h4><small>${colors.length} tokens</small></div><div class="ds-color-grid">${colors.map(([key, value]) => `<div class="ds-color"><i style="background:${esc(cssValue(value, "#eee"))}"></i><span title="${esc(key)}">${esc(key)} · ${esc(value)}</span></div>`).join("") || `<small>${txt("未解析到颜色 Token", "No color tokens parsed")}</small>`}</div></section>
    <section class="ds-section"><div class="ds-section-head"><h4>${txt("字体层级", "Typography")}</h4><small>${esc(primaryFont(spec))}</small></div><div class="ds-type-list">${type.map(([role, token]) => `<div class="ds-type-row"><small>${esc(role)}</small><b style="font-family:'${esc(token.fontFamily || primaryFont(spec))}',system-ui;font-size:${Math.min(28, Math.max(12, pxNumber(token.fontSize, 16)))}px;font-weight:${esc(token.fontWeight || "500")}">Aa 设计 Design</b><em>${esc(token.fontSize || "")}${token.lineHeight ? ` / ${esc(token.lineHeight)}` : ""}</em></div>`).join("") || `<small>${txt("未解析到字体层级", "No typography scale parsed")}</small>`}</div></section>
    <section class="ds-section ds-token-row">
      <div class="ds-token-box"><h5>${txt("圆角", "Radius")} · ${esc(radius)}</h5><div class="ds-radius-demo">${[0.5, 1, 1.6].map((scale) => `<i style="border-radius:${Math.max(0, pxNumber(radius, 8) * scale)}px"></i>`).join("")}</div></div>
      <div class="ds-token-box"><h5>${txt("间距", "Spacing")} · ${esc(spacing)}</h5><div class="ds-space-bars">${[0.5, 1, 1.5, 2].map((scale) => `<i style="width:${Math.min(100, 30 + pxNumber(spacing, 16) * scale)}%"></i>`).join("")}</div></div>
    </section>
    <section class="ds-section"><div class="ds-section-head"><h4>${txt("组件规则", "Component rules")}</h4><small>${spec.components.length} components</small></div><div class="ds-components">${components.map((name) => `<span>${esc(name)}</span>`).join("") || `<span>${txt("以 DESIGN.md 原始规则为准", "See source DESIGN.md for component rules")}</span>`}</div></section>
    <div class="ds-actions"><button type="button" class="ds-apply" data-ds-apply>${txt("应用到当前 DNA", "Apply to current DNA")}</button></div>
    <p class="ds-note">${txt("来源：VoltAgent/awesome-design-md（MIT）。品牌专有字体只引用名称，不打包字体文件；无法使用时自动回退到系统字体。", "Source: VoltAgent/awesome-design-md (MIT). Proprietary brand fonts are referenced by name only and fall back to system fonts when unavailable.")}</p>`;
  detail.querySelector("[data-ds-apply]")?.addEventListener("click", () => applyDesignSystem(entry, spec));
}

function buildPrompt(entry, spec) {
  const palette = paletteFor(spec);
  const type = typographyList(spec);
  return [
    `${lang() === "en" ? "Design system" : "设计规范"}: ${entry.name}`,
    `${lang() === "en" ? "Source" : "来源"}: ${SOURCE_REPO}/design-md/${entry.slug}/DESIGN.md`,
    `${lang() === "en" ? "Visual direction" : "视觉方向"}: ${spec.description || entry.description}`,
    `${lang() === "en" ? "Core colors" : "核心颜色"}: accent ${palette.accent}; canvas ${palette.canvas}; surface ${palette.surface}; ink ${palette.ink}; muted ${palette.muted}`,
    `${lang() === "en" ? "Typography" : "字体"}: ${type.map(([role, token]) => `${role}=${token.fontFamily || ""} ${token.fontSize || ""} ${token.fontWeight || ""}`.trim()).join("; ") || primaryFont(spec)}`,
    `${lang() === "en" ? "Radius" : "圆角"}: ${Object.entries(spec.rounded).slice(0, 8).map(([key, value]) => `${key} ${value}`).join(", ") || radiusValue(spec)}`,
    `${lang() === "en" ? "Spacing" : "间距"}: ${Object.entries(spec.spacing).slice(0, 8).map(([key, value]) => `${key} ${value}`).join(", ") || spacingValue(spec)}`,
    `${lang() === "en" ? "Components" : "组件"}: ${spec.components.slice(0, 16).join(", ") || "Follow the source DESIGN.md component rules."}`,
    lang() === "en"
      ? "Reuse rule: keep this design language consistent across pages. Preserve surface hierarchy, type scale, spacing rhythm and component states. Do not copy brand assets or proprietary font files."
      : "复用要求：所有页面持续遵循这套视觉语言，保持表面层级、字体层级、间距节奏与组件状态一致；不要复制品牌素材或打包专有字体文件。",
  ].join("\n");
}

function applyDesignSystem(entry, spec, { silent = false } = {}) {
  selectedEntry = entry;
  selectedSpec = spec;
  promptSnapshot = buildPrompt(entry, spec);
  const palette = paletteFor(spec);
  const root = document.documentElement;
  root.style.setProperty("--dna-accent", palette.accent);
  root.style.setProperty("--dna-accent-soft", `color-mix(in srgb, ${palette.accent} 12%, ${palette.surface})`);
  root.style.setProperty("--dna-canvas", palette.canvas);
  root.style.setProperty("--dna-surface", palette.surface);
  root.style.setProperty("--dna-ink", palette.ink);
  root.style.setProperty("--dna-muted", palette.muted);
  root.style.setProperty("--dna-radius", `${Math.max(0, pxNumber(radiusValue(spec), 8))}px`);
  root.style.setProperty("--dna-space", `${Math.max(4, pxNumber(spacingValue(spec), 16))}px`);
  root.style.setProperty("--dna-display", `"${primaryFont(spec)}",system-ui,-apple-system,"Segoe UI","PingFang SC","Microsoft YaHei",sans-serif`);
  document.body.dataset.designSystem = entry.slug;
  const prompt = document.querySelector("#dnaPrompt");
  if (prompt) prompt.textContent = promptSnapshot;
  const name = document.querySelector("#dnaName");
  if (name) name.value = `${entry.name} · Web DNA`;
  const rulesChip = document.querySelector('[data-section-value="rules"]');
  if (rulesChip) rulesChip.textContent = `${entry.name} · ${primaryFont(spec)}`;
  const dockFont = document.querySelector("#dockFont");
  if (dockFont) dockFont.textContent = primaryFont(spec);
  const dockRadius = document.querySelector("#dockRadius");
  if (dockRadius) dockRadius.textContent = `${Math.max(0, pxNumber(radiusValue(spec), 8))}px ${txt("圆角", "radius")}`;
  const dockPalette = document.querySelectorAll("#dockPalette i");
  [palette.accent, palette.surface, palette.canvas, palette.ink].forEach((color, index) => { if (dockPalette[index]) dockPalette[index].style.background = color; });
  updateCurrentField();
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify({ slug: entry.slug })); } catch {}
  if (!silent && statusNode) statusNode.textContent = txt(`已应用 ${entry.name} 设计规范`, `Applied ${entry.name} design system`);
  setTimeout(() => { if (statusNode) statusNode.textContent = ""; }, 2200);
  dialog?.close();
}

function updateCurrentField() {
  if (!currentButton) return;
  const strong = currentButton.querySelector("strong");
  const small = currentButton.querySelector("small");
  const swatches = currentButton.querySelectorAll(".ds-current-visual i");
  if (!selectedEntry || !selectedSpec) {
    strong.textContent = txt("选择设计规范", "Choose a design system");
    small.textContent = txt("73 套真实网站 DESIGN.md，可搜索和预览", "73 real-site DESIGN.md presets with visual previews");
    swatches.forEach((node) => node.style.background = "#eee");
    return;
  }
  strong.textContent = selectedEntry.name;
  small.textContent = `${primaryFont(selectedSpec)} · ${radiusValue(selectedSpec)} · ${spacingValue(selectedSpec)}`;
  const palette = paletteFor(selectedSpec);
  [palette.accent, palette.surface, palette.canvas, palette.ink].forEach((color, index) => { if (swatches[index]) swatches[index].style.background = color; });
}

function clearDesignSystemMode() {
  if (!selectedEntry) return;
  selectedEntry = null;
  selectedSpec = null;
  promptSnapshot = "";
  document.body.removeAttribute("data-design-system");
  try { localStorage.removeItem(STORAGE_KEY); } catch {}
  updateCurrentField();
}

function installInteractionGuards() {
  document.addEventListener("click", (event) => {
    const target = event.target.closest(".direction-card,[data-choice-group] button,.palette-option,.font-select-control select");
    if (target && !target.closest(".ds-dialog")) clearDesignSystemMode();
  }, true);
  document.addEventListener("click", async (event) => {
    if (!selectedEntry || !promptSnapshot) return;
    const copy = event.target.closest("#copyDna");
    if (!copy) return;
    event.preventDefault();
    event.stopImmediatePropagation();
    try {
      await navigator.clipboard.writeText(promptSnapshot);
      if (statusNode) statusNode.textContent = txt("完整设计规范 Prompt 已复制", "Full design-system prompt copied");
    } catch {
      if (statusNode) statusNode.textContent = txt("复制失败，请重试", "Copy failed, please retry");
    }
  }, true);
}

async function restoreSelection() {
  let saved = null;
  try { saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || "null"); } catch {}
  if (!saved?.slug) return;
  const entry = DESIGN_SYSTEMS.find((item) => item.slug === saved.slug);
  if (!entry) return;
  applyDesignSystem(entry, await loadSpec(entry), { silent: true });
}

function openDialog() {
  ensureDialog();
  renderCards();
  selectForPreview(selectedEntry || DESIGN_SYSTEMS.find((item) => item.slug === "linear.app") || DESIGN_SYSTEMS[0]);
  if (typeof dialog.showModal === "function") dialog.showModal();
  else dialog.setAttribute("open", "");
}

function syncLanguage() {
  if (dialog?.open) {
    const active = selectedEntry;
    dialog.remove();
    dialog = grid = detail = searchInput = null;
    ensureDialog();
    renderCards();
    if (active) selectForPreview(active);
    dialog.showModal?.();
  }
  ensureLauncherField();
  updateCurrentField();
}

function init() {
  createStyles();
  ensureLauncherField();
  ensureDialog();
  installInteractionGuards();
  restoreSelection();
  window.addEventListener("image2:languagechange", syncLanguage);
  window.ONDesignDesignSystems = { entries: DESIGN_SYSTEMS, open: openDialog, load: loadSpec };
}

init();
